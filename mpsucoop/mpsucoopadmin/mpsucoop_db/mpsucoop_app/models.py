from django.db import models
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth.models import User
from decimal import Decimal
from django.core.exceptions import ValidationError
import logging
logger = logging.getLogger(__name__)

class Member(models.Model):
    memId = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=12)
    address = models.TextField(blank=True, default='Not Provided')
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True)  
   
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
class Account(models.Model):
    account_number = models.CharField(max_length=20, primary_key=True) 
    account_holder = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='account_by_id') 
    shareCapital = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'))
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
            if self.shareCapital>= Decimal(amount):
                self.shareCapital -= Decimal(amount)
                self.save()
            else:
                raise ValueError("Insufficient funds.")
        else:
            raise ValueError("Account is not active. Cannot withdraw.")

    def __str__(self):
        return f"Account {self.account_number} - {self.account_holder.memId}"


class Loan(models.Model): 
    class LoanType(models.TextChoices):
        REGULAR = 'Regular', 'Regular'
        EMERGENCY = 'Emergency', 'Emergency'

    class LoanStatus(models.TextChoices):
        PENDING = 'Pending', 'Pending'
        APPROVED = 'Approved', 'Approved'
        PAID = 'Paid', 'Paid'
        CANCELED = 'Canceled', 'Canceled'

    class Purpose(models.TextChoices):
        EDUCATION = 'Education', 'Education'
        MEDICAL = 'Medical/Emergency', 'Medical/Emergency'
        HOUSE = 'House Construction & Repair', 'House Construction & Repair'
        APPLIANCES = 'Commodity/Appliances', 'Commodity/Appliances'
        UTILITY = 'Utility Services', 'Utility Services'
        OTHERS = 'Others', 'Others'

    control_number = models.CharField(max_length=20, primary_key=True)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    loan_amount = models.DecimalField(max_digits=15, decimal_places=2)
    loan_type = models.CharField(max_length=10, choices=[('Regular', 'Regular'), ('Emergency', 'Emergency')], default='Regular')
    loan_period = models.PositiveIntegerField()  
    loan_period_unit = models.CharField(max_length=10, choices=[('Months', 'Months'), ('Years', 'Years')], default='Months')  
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=5)
    service_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    penalty_rate = models.DecimalField(max_digits=5, decimal_places=2, default=2)
    loan_date = models.DateField(auto_now_add=True)
    due_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=[('Pending', 'Pending'), ('Approved', 'Approved'), ('Paid', 'Paid')])
    purpose = models.CharField(max_length=200, choices=[('Education', 'Education'), ('Medical/Emergency', 'Medical/Emergency'),
                                                        ('House Construction & Repair', 'House Construction & Repair'),
                                                        ('Commodity/Appliances', 'Commodity/Appliances'),
                                                        ('Utility Services', 'Utility Services'), ('Others', 'Others')],
                               default='Choose Purpose')
    others_purpose = models.CharField(max_length=200, blank=True)
    nameOfSpouse = models.CharField(max_length=200, blank=True, default='If applicable')
    take_home_pay = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)  
    notarial_fee = models.DecimalField(max_digits=6, decimal_places=2, default=100.00)


    
    def clean(self):
        if self.loan_type == 'Regular' and self.loan_period > 48:
            raise ValidationError('Regular loans cannot exceed 48 months (4 years).')
        elif self.loan_type == 'Emergency' and self.loan_period > 6:
            raise ValidationError('Emergency loans cannot exceed 6 months.')

    
    def calculate_take_home_pay(self):
        """Calculates take home pay as loan_amount - (service_fee + notarial_fee)."""
        return self.loan_amount - (self.service_fee + Decimal(self.notarial_fee))

    # calculate due date based on loan_period and loan_period_unit
    def calculate_due_date(self):
        if self.loan_date is None:
            raise ValueError("Loan date must be set before calculating due date.")
        
        if self.loan_period_unit == 'Months':
            return self.loan_date + timedelta(days=self.loan_period * 30)  # For months
        elif self.loan_period_unit == 'Years':
            return self.loan_date + timedelta(days=self.loan_period * 365)  # For years
        else:
            raise ValueError("Invalid loan period unit. Must be 'Months' or 'Years'.")

    def save(self, *args, **kwargs):
        # Set loan_date to current date if it's not set
        if not self.loan_date:
            self.loan_date = timezone.now()  # Automatically sets the current date
        # Calculate due_date only if it's not already set
        if not self.due_date:
            self.due_date = self.calculate_due_date()

        self.take_home_pay = self.calculate_take_home_pay()
        super().save(*args, **kwargs)

    
    def calculate_monthly_installment(self):
        
        monthly_interest_rate = (self.interest_rate / 100) / 12
        number_of_payments = self.loan_period
        if monthly_interest_rate == 0:
            return self.loan_amount / number_of_payments  
        else:
            installment = (self.loan_amount * monthly_interest_rate) / (1 - (1 + monthly_interest_rate) ** -number_of_payments)
            return round(installment, 2)

    
    def generate_payment_schedule(self):
        for i in range(self.loan_period):
            due_date = self.loan_date + timedelta(days=(i + 1) * 30)  
            PaymentSchedule.objects.create(
                loan=self,
                due_date=due_date,
                installment_amount=self.calculate_monthly_installment()
            )
class PaymentSchedule(models.Model):
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE)
    due_date = models.DateField()
    installment_amount = models.DecimalField(max_digits=15, decimal_places=2)
    is_paid = models.BooleanField(default=False)

    def __str__(self):
        return f"Installment for Loan {self.loan.control_number} due on {self.due_date.strftime('%Y-%m-%d')}"

class Payment(models.Model):
    OR = models.CharField(max_length=50, primary_key=True, default='DEFAULT_Payment_NUMBER')
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE)
    payment_amount = models.DecimalField(max_digits=15, decimal_places=2)
    payment_date = models.DateField(auto_now_add=True)
    method = models.CharField(max_length=50, choices=[('Cash', 'Cash'), ('Bank Transfer', 'Bank Transfer')], default='Unknown')
    
    penalty = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'))
     
    admin_cost = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('10.00'))  
    cisp = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'))  
    payment_schedule = models.ForeignKey(PaymentSchedule, on_delete=models.CASCADE, related_name='payments')
    def save(self, *args, **kwargs):

        # SERVICE FEE IS BASED ON BALANCE AND AGE
        loan_duration = (self.loan.due_date - self.loan.loan_date).days // 30  
        
        if loan_duration <= 12:
            self.service_fee = self.payment_amount * Decimal('0.01')  # 1% for 1st year
        elif loan_duration <= 24:
            self.service_fee = self.payment_amount * Decimal('0.015')  # 1.5% for 2nd year
        elif loan_duration <= 36:
            self.service_fee = self.payment_amount * Decimal('0.02')  # 2% for 3rd year
        elif loan_duration <= 48:
            self.service_fee = self.payment_amount * Decimal('0.025')  # 2.5% for 4th year
        else:
            self.service_fee = Decimal('0.00')  

        # FOR  CISP- no idea what this is
        self.cisp = (self.loan.loan_amount / Decimal('1000')) * Decimal('0.75') * 12

        # Check if it's delinquent
        if self.loan.status == 'Approved':
            if self.payment_date > self.loan.due_date:
                self.penalty = self.loan.loan_amount * Decimal('0.02')  # 2% penalty for delinquency
            else:
                self.penalty = Decimal('0.00')

        super().save(*args, **kwargs)
        self.payment_schedule.is_paid = True
        self.payment_schedule.save() 
      

    def __str__(self):
        return f"Payment {self.OR} for Loan {self.loan.control_number} on {self.payment_date.strftime('%Y-%m-%d')}"

class Ledger(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='ledger_entries')
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=20, choices=[('Loan', 'Loan Disbursal'), ('Payment', 'Payment')])
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    transaction_date = models.DateField(auto_now_add=True)
    details = models.TextField(blank=True, null=True)  
    
    def __str__(self):
        return f"{self.member} - {self.transaction_type} of {self.amount} on {self.transaction_date}"

    class Meta:
        ordering = ['transaction_date']