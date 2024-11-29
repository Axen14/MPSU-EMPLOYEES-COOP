from rest_framework import generics, status, viewsets, filters
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from decimal import Decimal
from django.http import JsonResponse
import uuid
from django.db.models import Sum, Min, F, OuterRef, Subquery
from rest_framework.decorators import api_view
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from django.db import transaction
from .models import Member, Account, Loan, PaymentSchedule, Payment
from .serializers import (
    MemberSerializer, AccountSerializer, LoanSerializer, 
    PaymentScheduleSerializer, PaymentSerializer
)
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
import django_filters

class MemberFilter(django_filters.FilterSet):
    account_number = django_filters.CharFilter(field_name='accountN__account_number', lookup_expr='exact')

    class Meta:
        model = Member
        fields = ['account_number']  # This is the filter field

class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = MemberFilter  # Use the custom filter set here
    search_fields = ['accountN__account_number']  # For partial searching


class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [AllowAny]

    def _handle_transaction(self, account, amount, transaction_type):
        try:
            amount = Decimal(amount)
            if amount <= 0:
                return Response({"error": "Amount must be a positive value."}, status=status.HTTP_400_BAD_REQUEST)
        except (TypeError, ValueError):
            return Response({"error": "Invalid amount format."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            if transaction_type == 'deposit':
                account.deposit(amount)
                message = "Deposit successful!"
            elif transaction_type == 'withdraw':
                account.withdraw(amount)
                message = "Withdrawal successful!"
            else:
                return Response({"error": "Invalid transaction type."}, status=status.HTTP_400_BAD_REQUEST)

            return Response({"message": message, "new_balance": account.shareCapital}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='deposit')
    def deposit(self, request, pk=None):
        account = self.get_object()
        amount = request.data.get('amount')
        return self._handle_transaction(account, amount, 'deposit')

    @action(detail=True, methods=['post'], url_path='withdraw')
    def withdraw(self, request, pk=None):
        account = self.get_object()
        amount = request.data.get('amount')
        return self._handle_transaction(account, amount, 'withdraw')


class LoanViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        control_number = self.request.query_params.get('control_number', None)
        if control_number:
            try:
                uuid.UUID(control_number)
            except ValueError:
                return Loan.objects.none() 
            return Loan.objects.filter(control_number=control_number)
        return super().get_queryset()
    @action(detail=False, methods=['post'])
    def create_loan(self, request):
        account_number = request.data.get('account_number')
        try:
            account = Account.objects.get(account_number=account_number)
        except Account.DoesNotExist:
            return Response({"error": "Account not found."}, status=status.HTTP_404_NOT_FOUND)

        
        active_loan = Loan.objects.filter(account=account).first()
        if active_loan and not active_loan.check_loan_eligibility_for_reloan():
            return Response({
                "error": "50% of the existing loan must be paid off before applying for a new loan."
            }, status=status.HTTP_400_BAD_REQUEST)

        
        loan_data = request.data
        try:
            with transaction.atomic():
                new_loan = Loan.objects.create(**loan_data)
                return Response({
                    "status": "Loan created successfully",
                    "control_number": new_loan.control_number
                }, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Error creating loan: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def payment_schedule(self, request, pk=None):
        loan = self.get_object()
        payment_schedule = PaymentSchedule.objects.filter(loan=loan)
        return Response(PaymentScheduleSerializer(payment_schedule, many=True).data)
    def create(self, request, *args, **kwargs):
        """
        Override create to calculate service fee and other fields if needed.
        """
        loan_data = request.data
        loan_amount = float(loan_data.get('loan_amount', 0))
        loan_period = int(loan_data.get('loan_period', 0))
        
        #  Calculate service fee
        if loan_period <= 12:
            service_fee = loan_amount * 0.01
        elif loan_period <= 24:
            service_fee = loan_amount * 0.015
        elif loan_period <= 36:
            service_fee = loan_amount * 0.02
        else:
            service_fee = loan_amount * 0.025
        
        loan_data['service_fee'] = service_fee
        serializer = self.get_serializer(data=loan_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PaymentScheduleViewSet(viewsets.ModelViewSet):
    queryset = PaymentSchedule.objects.all()
    serializer_class = PaymentScheduleSerializer

    @action(detail=False, methods=['get'], url_path='summaries')
    def payment_schedule_summaries(self, request):
        earliest_due_date = PaymentSchedule.objects.filter(
            loan__account=OuterRef('loan__account'),
            is_paid=False
        ).values('due_date').order_by('due_date')[:1]
        
        summaries = PaymentSchedule.objects.filter(
            is_paid=False,
            due_date=Subquery(earliest_due_date)
        ).annotate(
            account_number=F('loan__account__account_number'),
            next_due_date=F('due_date'),
            total_balance=Sum('balance')
        ).values('account_number', 'next_due_date', 'total_balance').distinct()

        return Response(summaries)

    @action(detail=True, methods=['get'])
    def loan_details(self, request, pk=None):
        schedule = self.get_object()
        loan = schedule.loan
        return Response(LoanSerializer(loan).data)

    # @action(detail=True, methods=['post'])
    # def mark_as_paid(self, request, pk=None):
    #     schedule = self.get_object()
    #     schedule.is_paid = True
    #     schedule.save()
    #     return Response({"status": "Payment schedule marked as paid"}, status=status.HTTP_200_OK)

    def get_queryset(self):
        account_number = self.request.query_params.get('account_number')
        if account_number:
            return self.queryset.filter(loan__account__account_number=account_number)
        return self.queryset


    # @action(detail=True, methods=['post'], url_path='mark-paid')
def mark_as_paid(request, id):
        try:
            schedule = PaymentSchedule.objects.get(id=id)

            schedule.is_paid = True
            schedule.status = 'Paid'
            schedule.save()

            return JsonResponse({'status': 'Payment marked as paid.'}, status=status.HTTP_200_OK)
        except PaymentSchedule.DoesNotExist:
            return JsonResponse({'error': 'Payment schedule not found.'}, status=status.HTTP_404_NOT_FOUND)

    
class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
#     @action(detail=True, methods=['post'])
#     def make_payment(self, request, pk=None):
#         payment_data = request.data
#         try:
#             payment_schedule = PaymentSchedule.objects.get(id=payment_data['payment_schedule'])
#             loan = payment_schedule.loan
            
#             payment_amount = Decimal(payment_data['payment_amount'])
#             if payment_amount <= 0:
#                 return Response({"error": "Payment amount must be a positive value."}, status=status.HTTP_400_BAD_REQUEST)

#             payment = Payment.objects.create(
#                 loan=loan,
#                 payment_schedule=payment_schedule,
#                 payment_amount=payment_amount,
#                 payment_date=payment_data.get('payment_date', timezone.now().date()),
#                 method=payment_data.get('method', 'Cash')
#             )

#             payment.save()

#             return Response({"status": "Payment recorded"}, status=status.HTTP_201_CREATED)

#         except PaymentSchedule.DoesNotExist:
#             return Response({"error": "Payment schedule not found."}, status=status.HTTP_404_NOT_FOUND)
#         except ValidationError as e:
#             return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             return Response({"error": f"Error processing payment: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

class ActiveLoansByAccountView(APIView):
    def get(self, request, account_number):
        loans = Loan.objects.filter(account__account_number=account_number)
        print(f"Loans found: {loans}")

        active_loans_data = []
        payment_schedules_data = []

        for loan in loans:
            schedules = PaymentSchedule.objects.filter(loan=loan)
            active = False
            schedule_data = []
            for schedule in schedules:
                if not schedule.is_paid:
                    active = True
                    schedule_data.append(PaymentScheduleSerializer(schedule).data)

            if active:
                active_loans_data.append(LoanSerializer(loan).data)
                payment_schedules_data.append(schedule_data)

        if active_loans_data:
            return Response({
                'active_loans': active_loans_data,
                'payment_schedules': payment_schedules_data
            })
        else:
            return Response({"message": "No active loans found."}, status=status.HTTP_404_NOT_FOUND)

