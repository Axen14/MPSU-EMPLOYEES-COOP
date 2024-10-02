from rest_framework import serializers
from .models import Member, Account, Loan, Payment

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = '__all__'

class AccountSerializer(serializers.ModelSerializer):
    account_holder = MemberSerializer()

    class Meta:
        model = Account
        fields = ['account_number', 'account_holder', 'shareCapital', 'status', 'created_at', 'updated_at']

class LoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
