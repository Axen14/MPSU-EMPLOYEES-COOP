from django.db import models
from decimal import Decimal, ROUND_HALF_UP
from datetime import timedelta
from django.utils import timezone
from django.conf import settings
from django.core.validators import MinValueValidator 
import uuid
import math
from django.db.models import Sum
from django.core.exceptions import ValidationError
import logging
logger = logging.getLogger(__name__)




class Member(models.Model):
    memId = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100)
    birth_date = models.DateField()   
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=12)
    gender = models.CharField(max_length=20, choices=[('Male', 'Male'), ('Female', 'Female')], default='Male')
    religion = models.CharField(max_length=100, default='Catholic')
    pstatus = models.CharField(max_length=50, choices=[('Single', 'Single'), ('Married', 'Married'), ('Widower', 'Widower'), ('Separated', 'Separated')], default='Single')
    address = models.TextField(blank=True, default='Not Provided')
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='member_profile')

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Account(models.Model):
    account_number = models.CharField(max_length=20, primary_key=True)
    account_holder = models.OneToOneField(Member, on_delete=models.CASCADE, related_name='accountN')
    shareCapital = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'), validators=[MinValueValidator(Decimal('0.00'))])
    status = models.CharField(max_length=50, choices=[('Active', 'Active'), ('Closed', 'Closed')])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def deposit(self, amount):
        if self.status == 'Active':
            self.shareCapital += Decimal(amount)  
            self.save()
        else:
            logger.error(f"Deposit failed: Account {self.account_number} is not active.")
            raise ValueError("Account is not active. Cannot deposit.")

    def withdraw(self, amount):
        if self.status == 'Active':
            if self.shareCapital >= Decimal(amount):
                self.shareCapital -= Decimal(amount)
                self.save()
            else:
                raise ValueError("Insufficient funds.")
        else:
            raise ValueError("Account is not active. Cannot withdraw.")

    def __str__(self):
        return f"Account {self.account_number} - {self.account_holder.memId}"





class Loan(models.Model):
    PURPOSE_CHOICES = [
        ('Education', 'Education'),
        ('Medical/Emergency', 'Medical/Emergency'),
        ('House Construction & Repair', 'House Construction & Repair'),
        ('Commodity/Appliances', 'Commodity/Appliances'),
        ('Utility Services', 'Utility Services'),
        ('Others', 'Others'),
    ]

    control_number = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    account = models.ForeignKey('Account', on_delete=models.CASCADE)
    loan_amount = models.DecimalField(max_digits=15, decimal_places=2)
    loan_type = models.CharField(
        max_length=200, choices=[('Regular', 'Regular'), ('Emergency', 'Emergency')], default='Emergency'
    )
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2) 
    loan_period = models.PositiveIntegerField(default=12)  
    loan_period_unit = models.CharField(
        max_length=10, choices=[('months', 'Months'), ('years', 'Years')], default='months'
    )
    loan_date = models.DateField(auto_now_add=True)
    due_date = models.DateField(null=True, blank=True)
    status = models.CharField(
        max_length=50,
        choices=[('Pending', 'Pending'), ('Approved', 'Approved'), ('Active', 'Active'), ('Completed', 'Completed')],
        default='Pending'
    )
    service_fee = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'))
    penalty_rate = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('2.00'))
    purpose = models.CharField(max_length=200, choices=PURPOSE_CHOICES, default='Education')



    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    def save(self, *args, **kwargs):
        if self.loan_date and self.loan_period:
            loan_period_in_months = self.loan_period
            self.due_date = self.loan_date + timedelta(days=loan_period_in_months * 30)  
        super().save(*args, **kwargs)

        if self.status == 'Approved':
            self.generate_payment_schedule()

    def generate_payment_schedule(self):
        """
        Generate a bi-monthly payment schedule for the loan.
        """
        if self.loan_period_unit == 'years':
            total_months = self.loan_period * 12
        else:
            total_months = self.loan_period

        total_periods = total_months * 2  
        bi_monthly_rate = (self.interest_rate / Decimal('100')) / 24  

        
        loan_principal = self.loan_amount
        total_interest = (loan_principal * bi_monthly_rate * total_periods)
        total_amount_due = loan_principal + total_interest
        bi_monthly_payment = total_amount_due / Decimal(total_periods)

        
        for period in range(total_periods):
            due_date = self.loan_date + timedelta(days=(period * 15))
            principal_payment = loan_principal / Decimal(total_periods)
            interest_payment = total_interest / Decimal(total_periods)
            balance_due = (total_amount_due - (bi_monthly_payment * (period + 1)))

            PaymentSchedule.objects.create(
                loan=self,
                principal_amount=principal_payment.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP),
                interest_amount=interest_payment.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP),
                payment_amount=bi_monthly_payment.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP),
                due_date=due_date,
                balance=balance_due.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
            )

    def __str__(self):
        return f"Loan {self.control_number} for {self.account} ({self.status})"

class PaymentSchedule(models.Model):
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE)
    principal_amount = models.DecimalField(max_digits=15, decimal_places=2)
    interest_amount = models.DecimalField(max_digits=15, decimal_places=2)
    payment_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0.0)
    due_date = models.DateField()
    balance = models.DecimalField(max_digits=15, decimal_places=2)
    is_paid = models.BooleanField(default=False)

    def __str__(self):
        return f"Payment for Loan {self.loan.control_number} on {self.due_date}"

    def mark_as_paid(self):
        self.is_paid = True
        self.save()


class Payment(models.Model):
    OR = models.CharField(max_length=50, primary_key=True, unique=True)
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE)
    payment_amount = models.DecimalField(max_digits=15, decimal_places=2)
    payment_date = models.DateField(auto_now_add=True)
    method = models.CharField(max_length=50, choices=[('Cash', 'Cash'), ('Bank Transfer', 'Bank Transfer')], default='Unknown')

    penalty = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'))
    admin_cost = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('10.00'))
    payment_schedule = models.ForeignKey(PaymentSchedule, on_delete=models.CASCADE, related_name='paymentsched')


    def save(self, *args, **kwargs):
        if self.loan.status == 'Approved':
            if self.payment_date and self.loan.due_date:
                if self.payment_date > self.loan.due_date:
                    self.penalty = self.loan.loan_amount * Decimal('0.02')  
                else:
                    self.penalty = Decimal('0.00')
        else:
            logger.warning(f"Either payment_date or loan.due_date is None for OR: {self.OR}")
        
        if not self.OR or self.OR == 'DEFAULT_Payment_NUMBER':
            self.OR = str(uuid.uuid4())


        
        if self.payment_amount is None:
            self.payment_amount = self.payment_schedule.payment_amount 
        
       
        self.payment_schedule.is_paid = True
        self.payment_schedule.save()

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Payment {self.OR} for Loan {self.loan.control_number} on {self.payment_date.strftime('%Y-%m-%d')}"