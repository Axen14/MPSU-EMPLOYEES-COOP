from django.contrib import admin
from django.contrib import messages
from django.shortcuts import render
from django.http import HttpResponseRedirect
from .models import Member, Account, Loan
from .forms import DepositWithdrawForm
from django.core.exceptions import ValidationError
from django.contrib import admin
from .models import Payment, PaymentSchedule, Ledger

class MemberAdmin(admin.ModelAdmin):
    search_fields = ('first_name', 'last_name', 'email')
    list_display = ('memId', 'first_name', 'middle_name', 'last_name', 'email', 'phone_number', 'address', 'user')

class AccountAdmin(admin.ModelAdmin):
    list_display = ('account_number', 'account_holder', 'shareCapital', 'status', 'created_at', 'updated_at')
    search_fields = ('account_number', 'account_holder__first_name', 'account_holder__last_name')

    actions = ['deposit', 'withdraw']

    def deposit(self, request, queryset):
        form = DepositWithdrawForm(request.POST or None)  

        if request.method == 'POST' and form.is_valid():
            amount = form.cleaned_data['amount']  
            for account in queryset:
                try:
                    account.deposit(amount)  
                    self.message_user(request, f"Successfully deposited {amount} to account {account.account_number}.", messages.SUCCESS)
                except ValueError as e:
                    self.message_user(request, str(e), messages.ERROR)

            return HttpResponseRedirect(request.get_full_path())  
        context = {
            'form': form,
            'action_checkbox_name': admin.helpers.ACTION_CHECKBOX_NAME,
        }
        return render(request, 'admin/deposit_withdraw_form.html', context)

    deposit.short_description = "Deposit to selected accounts"

    def withdraw(self, request, queryset):
        form = DepositWithdrawForm(request.POST or None)  
        if request.method == 'POST' and form.is_valid():
            amount = form.cleaned_data['amount']  
            for account in queryset:
                try:
                    account.withdraw(amount)  
                    self.message_user(request, f"Successfully withdrew {amount} from account {account.account_number}.", messages.SUCCESS)
                except ValueError as e:
                    self.message_user(request, str(e), messages.ERROR)

            return HttpResponseRedirect(request.get_full_path())  

        context = {
            'form': form,
            'action_checkbox_name': admin.helpers.ACTION_CHECKBOX_NAME,
        }
        return render(request, 'admin/deposit_withdraw_form.html', context)

    withdraw.short_description = "Withdraw from selected accounts"

class LoanAdmin(admin.ModelAdmin):
    list_display = ('control_number','account', 'loan_amount', 'loan_type', 'loan_period', 'loan_period_unit', 'interest_rate', 'status', 'due_date')
    search_fields = ('control_number', 'account__account_number', 'member__first_name', 'member__last_name')

    
    list_filter = ('loan_type', 'status', 'loan_period_unit')

    fieldsets = (
        (None, {
            'fields': ('control_number', 'account', 'loan_amount', 'loan_type', 'loan_period', 'loan_period_unit', 'interest_rate', 'service_fee', 'penalty_rate')
        }),
        ('Status and Purpose', {
            'fields': ('status', 'purpose', 'others_purpose', 'nameOfSpouse')
        }),
    )

    def save_model(self, request, obj, form, change):
        if obj.loan_period <= 0:
            raise ValueError("Loan term must be greater than 0")
        if obj.loan_type == 'Regular' and obj.loan_period > 48:
            raise ValidationError("Regular loans cannot exceed 48 months (4 years).")
        elif obj.loan_type == 'Emergency' and obj.loan_period > 6:
            raise ValidationError("Emergency loans cannot exceed 6 months.")
        super().save_model(request, obj, form, change)


class PaymentScheduleAdmin(admin.ModelAdmin):
    list_display = ('loan', 'due_date', 'installment_amount', 'is_paid')
    list_filter = ('loan', 'is_paid')  
    search_fields = ('loan__control_number',)  


class PaymentAdmin(admin.ModelAdmin):
    list_display = ('OR', 'loan', 'payment_amount', 'payment_date', 'method', 'service_fee', 'penalty')
    list_filter = ('loan', 'method')  
    search_fields = ('loan__control_number', 'OR')  

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)


class LedgerAdmin(admin.ModelAdmin):
    list_display = ('member', 'loan', 'transaction_type', 'amount', 'transaction_date', 'details')
    search_fields = ('member__first_name', 'member__last_name', 'loan__loan_number', 'transaction_type')
    list_filter = ('transaction_type', 'transaction_date')
    date_hierarchy = 'transaction_date'
    readonly_fields = ('member', 'loan', 'transaction_type', 'amount', 'transaction_date', 'details')

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
    

admin.site.register(PaymentSchedule, PaymentScheduleAdmin)
admin.site.register(Payment, PaymentAdmin)
admin.site.register(Loan, LoanAdmin)
admin.site.register(Account, AccountAdmin)
admin.site.register(Member, MemberAdmin)
admin.site.register(Ledger, LedgerAdmin)
