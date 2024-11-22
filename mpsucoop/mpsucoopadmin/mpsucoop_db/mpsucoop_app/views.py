from django.shortcuts import render, redirect
from rest_framework.decorators import action
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.contrib.auth.forms import AuthenticationForm
from .forms import MemberSignUpForm
from .models import Member,Account, Loan, Payment
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import MemberSerializer, AccountSerializer, LoanSerializer, PaymentSerializer


# Create your views here.
def home(request):
    return render(request, 'home.html', {})

def profile(request):
    return render(request, 'profile.html')

def user_login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)

            if user.is_superuser:
                return redirect('/admin/')  
            else:
                return redirect('/')  
    else:
        form = AuthenticationForm()
    return render(request, 'registration/login.html', {'form': form})

def member_signup(request):
    if request.method == "POST":
        form = MemberSignUpForm(request.POST)
        if form.is_valid():
            account_number = form.cleaned_data.get('account_number')
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')

            # PASSWORD HASHED
            user = User.objects.create(
                username=username,
                password=make_password(password)  
            )

            account = Account.objects.get(account_number=account_number)
            member = Member.objects.get(memId=account.account_holder.memId)
            member.user = user
            member.save()

            return redirect('login')  
    else:
        form = MemberSignUpForm()

    return render(request, 'registration/signup.html', {'form': form})


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    permission_classes = [AllowAny]


class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    @action(detail=True, methods=['post'], url_path='deposit')
    def deposit(self, request, pk=None):  
        try:
            account = self.get_object()  
            amount = request.data.get('amount')
            if amount is None:
                return Response({"error": "Amount is required."}, status=status.HTTP_400_BAD_REQUEST)

           
            account.deposit(amount)  
            account.save()  

            return Response({"message": "Deposit successful!", "new_balance": account.shareCapital}, status=status.HTTP_200_OK)
        except Account.DoesNotExist:
            return Response({"error": "Account not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'], url_path='withdraw')
    def withdraw(self, request, pk=None):  
            try:
                account = self.get_object()  
                amount = request.data.get('amount')
                if amount is None:
                    return Response({"error": "Amount is required."}, status=status.HTTP_400_BAD_REQUEST)

                
                account.withdraw(amount)  
                account.save()  

                return Response({"message": "Withdrawal successful!", "new_balance": account.shareCapital}, status=status.HTTP_200_OK)
            except Account.DoesNotExist:
                return Response({"error": "Account not found."}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class LoanViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer
    permission_classes = [IsAuthenticated]

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

