from django.db import models
from decimal import Decimal
from django.utils import timezone
from datetime import timedelta

class Member(models.Model):
    member_id = models.CharField(max_length=20, primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)
    address = models.TextField(blank=True, default='Not Provided')

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Loan(models.Model):
    loan_number = models.CharField(max_length=20, primary_key=True)
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    loan_amount = models.DecimalField(max_digits=15, decimal_places=2)
    type = models.CharField(max_length=10, choices=[('Regular', 'Regular'), ('Emergency', 'Emergency')], default='Regular')
    loan_term = models.PositiveIntegerField(default=15)  # in days
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=5)  # Annual interest rate
    service_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # Service fee
    penalty_rate = models.DecimalField(max_digits=5, decimal_places=2, default=2)  # Penalty rate in percentage
    loan_date = models.DateField(auto_now_add=True)
    due_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=[('Pending', 'Pending'), ('Approved', 'Approved'), ('Paid', 'Paid')])

    def save(self, *args, **kwargs):
        if not self.due_date:
            # Calculate due date based on loan term
            self.due_date = self.loan_date + timedelta(days=self.loan_term)
        super().save(*args, **kwargs)

    def calculate_amount_due(self):
        total_amount = self.loan_amount
        if self.status == 'Approved':
            # Fixed interest rate of 5%
            interest = (total_amount * self.interest_rate / 100)
            total_amount += interest

            # Add service fee
            total_amount += self.service_fee

            # Check if the loan is delinquent
            if timezone.now().date() > self.due_date:
                penalty = (total_amount * self.penalty_rate / 100)
                total_amount += penalty
        
        return total_amount

    def __str__(self):
        return self.loan_number

class RepaymentSchedule(models.Model):
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, related_name='repayment_schedules')
    due_date = models.DateField()
    amount_due = models.DecimalField(max_digits=15, decimal_places=2)
    amount_paid = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    balance_due = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    def save(self, *args, **kwargs):
        # Calculate the balance due as the difference between amount due and amount paid
        self.balance_due = self.amount_due - self.amount_paid
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Repayment Schedule for Loan {self.loan.loan_number} due on {self.due_date}"


class Payment(models.Model):
    OR = models.CharField(max_length=50, primary_key=True, default='DEFAULT_Payment_NUMBER')
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE)
    payment_amount = models.DecimalField(max_digits=15, decimal_places=2)
    payment_date = models.DateField(auto_now_add=True)
    method = models.CharField(max_length=50, choices=[('Cash', 'Cash'), ('Bank Transfer', 'Bank Transfer')], default='Unknown')
    service_fee = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'))
    penalty = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'))

    def save(self, *args, **kwargs):
        # Calculate service fee as a percentage of the payment amount
        self.service_fee = self.payment_amount * Decimal('0.02')  # Example: 2% service fee

        # Check if the payment is delinquent
        loan = self.loan
        if loan.status == 'Approved':
            # Calculate penalty if payment is late
            if self.payment_date > loan.due_date:
                self.penalty = loan.loan_amount * Decimal('0.02')  # Example: 2% penalty for delinquency
            else:
                self.penalty = Decimal('0.00')
        
        # Save the payment with updated service fee and penalty
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Payment {self.OR} for Loan {self.loan.loan_number} on {self.payment_date.strftime('%Y-%m-%d')}"

class Account(models.Model):
    account_number = models.CharField(max_length=20, primary_key=True)
    account_holder = models.ForeignKey(Member, on_delete=models.CASCADE)  # Link to Member
    account_type = models.CharField(max_length=50, choices=[('Savings', 'Savings'), ('Current', 'Current')])
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'))
    status = models.CharField(max_length=50, choices=[('Active', 'Active'), ('Closed', 'Closed')])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def deposit(self, amount):
        self.balance += Decimal(amount)
        self.save()
        Ledger.objects.create(
            account=self,
            transaction_type='Deposit',
            amount=Decimal(amount),
            balance_after_transaction=self.balance,
            transaction_date=timezone.now(),
        )

    def withdraw(self, amount):
        if self.balance >= Decimal(amount):
            self.balance -= Decimal(amount)
            self.save()
            Ledger.objects.create(
                account=self,
                transaction_type='Withdrawal',
                amount=Decimal(amount),
                balance_after_transaction=self.balance,
                transaction_date=timezone.now(),
            )
        else:
            raise ValueError("Insufficient balance")

    def __str__(self):
        return f"Account {self.account_number} - {self.account_holder.first_name} {self.account_holder.last_name}"

class Ledger(models.Model):
    transaction_id = models.CharField(max_length=50, primary_key=True)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    transaction_date = models.DateField(default=timezone.now)
    transaction_type = models.CharField(max_length=50, choices=[('Deposit', 'Deposit'), ('Withdrawal', 'Withdrawal')])
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    balance_after_transaction = models.DecimalField(max_digits=15, decimal_places=2)

    def __str__(self):
        return f"Transaction {self.transaction_id} - Account {self.account.account_number} on {self.transaction_date.strftime('%Y-%m-%d')}"
