from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from .models import Member, Account, Loan, Payment, PaymentSchedule
import uuid
from decimal import Decimal

@receiver(post_save, sender=Member)
def create_account_for_member(sender, instance, created, **kwargs):
    if created:
        Account.objects.create(
            account_number=str(uuid.uuid4())[:12].upper(),
            account_holder=instance,
            shareCapital=Decimal('0.00'),
            status='Active'
        )
@receiver(post_save, sender=Loan)
def handle_loan_post_save(sender, instance, created, **kwargs):
    if created and instance.status == 'Approved':
        if not instance.due_date:
            instance.generate_payment_schedule()


@receiver(post_save, sender=Payment)
def update_payment_schedule_status(sender, instance, **kwargs):
    payment_schedule = instance.payment_schedule
    if payment_schedule:
        payment_schedule.is_paid = True  
        payment_schedule.save()
