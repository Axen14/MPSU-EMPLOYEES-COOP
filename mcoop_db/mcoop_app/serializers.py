from rest_framework import serializers
from django.contrib.auth.models import User
from decimal import Decimal
from .models import Member, Account, Loan, PaymentSchedule, Payment

from django.contrib.auth import get_user_model
import uuid
User = get_user_model()
# from .models import CustomUser, UserProfile 

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['account_number', 'account_holder', 'shareCapital', 'status', 'created_at', 'updated_at']



class MemberSerializer(serializers.ModelSerializer):
    accountN = serializers.CharField(source='accountN.account_number', read_only=True)
    # password = serializers.CharField(write_only=True)

    class Meta:
        model = Member
        fields = ['memId','accountN', 'first_name', 'last_name', 'email', 'phone_number', "birth_date", 'gender','religion', 'pstatus', 'address']

        # def create(self, validated_data):
        # account_data = validated_data.pop('accountN', None)
        # member = Member.objects.create(**validated_data)

        # if account_data:
        #     Account.objects.create(account_holder=member, **account_data)
        
        # return member
    def get_accountN(self, obj):
        return obj.accountN.account_number if hasattr(obj, 'accountN') else None
    
    # def create(self, validated_data):
        
    #     password = validated_data.pop('password')
    #     account_number = validated_data.get('account_number')
        
        
    #     User = get_user_model()
        
        
    #     user = User.objects.create_user(account_number=account_number, password=password)
        
        
    #     member = Member.objects.create(user=user, **validated_data)
        
    #     return member

    def create(self, validated_data):
        account_data = validated_data.pop('accountN', None)
        member = Member.objects.create(**validated_data)

        if account_data:
            Account.objects.create(account_holder=member, **account_data)
        
        return member

class PaymentScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentSchedule
        fields = ['loan', 'principal_amount', 'interest_amount', 'payment_amount', 
                  'due_date', 'balance', 'is_paid']

class LoanSerializer(serializers.ModelSerializer):
    control_number = serializers.ReadOnlyField()
    bi_monthly_installment = serializers.SerializerMethodField()
    payment_schedule = PaymentScheduleSerializer(source='paymentschedule_set', many=True, read_only=True)

    class Meta:
        model = Loan
        fields = ['control_number', 'account', 'loan_amount', 'loan_type', 'interest_rate', 
                  'loan_period', 'loan_period_unit', 'loan_date', 'due_date', 'status', 
                  'service_fee', 'penalty_rate', 'purpose', 'bi_monthly_installment', 'payment_schedule']
        read_only_fields = ['control_number', 'loan_date', 'due_date']
    def validate_control_number(self, value):
        try:
            uuid.UUID(str(value))
        except ValueError:
            raise serializers.ValidationError("Invalid UUID format.")
        return value
    def get_bi_monthly_installment(self, obj):
        total_periods = (obj.loan_period * 2) if obj.loan_period_unit == 'years' else obj.loan_period * 2
        bi_monthly_rate = (obj.interest_rate / Decimal('100')) / 24  
        total_interest = (obj.loan_amount * bi_monthly_rate * total_periods)
        total_amount_due = obj.loan_amount + total_interest
        bi_monthly_payment = total_amount_due / Decimal(total_periods)
        return bi_monthly_payment.quantize(Decimal('0.01'))

    def create(self, validated_data):
        loan = Loan.objects.create(**validated_data)
        if loan.status == 'Approved':
            loan.generate_payment_schedule()
        return loan



class PaymentSerializer(serializers.ModelSerializer):
    service_fee = serializers.DecimalField(max_digits=15, decimal_places=2, read_only=True)
    penalty = serializers.DecimalField(max_digits=15, decimal_places=2, read_only=True)
    cisp = serializers.DecimalField(max_digits=15, decimal_places=2, read_only=True)
    payment_schedule = serializers.PrimaryKeyRelatedField(queryset=PaymentSchedule.objects.all())
    payment_amount = serializers.DecimalField(max_digits=15, decimal_places=2, read_only=True)

    class Meta:
        model = Payment
        fields = ['OR', 'loan', 'payment_amount', 'payment_date', 'method', 'penalty', 
                  'admin_cost', 'cisp', 'payment_schedule', 'service_fee']
        read_only_fields = ['OR', 'service_fee', 'penalty', 'cisp', 'admin_cost','payment_amount',]  

    def create(self, validated_data):
        payment_schedule = validated_data.get('payment_schedule')
        payment = Payment.objects.create(**validated_data)
        payment.save()  
        

        if payment_schedule and payment.payment_amount >= payment_schedule.payment_amount:
            payment_schedule.is_paid = True
            payment_schedule.save()

        return payment



