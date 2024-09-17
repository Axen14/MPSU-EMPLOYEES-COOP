from django.contrib import admin
from django import forms
from django.http import HttpResponseRedirect
from .models import Member, Loan, Payment, Account, Ledger, RepaymentSchedule
from django.shortcuts import render


class DepositForm(forms.ModelForm):
    deposit_amount = forms.DecimalField(max_digits=15, decimal_places=2)

    class Meta:
        model = Account
        fields = ['deposit_amount']

    def save(self, commit=True):
        account = super().save(commit=False)
        deposit_amount = self.cleaned_data['deposit_amount']
        account.deposit(deposit_amount)
        if commit:
            account.save()
        return account

# Withdraw form
class WithdrawForm(forms.ModelForm):
    withdraw_amount = forms.DecimalField(max_digits=15, decimal_places=2)

    class Meta:
        model = Account
        fields = ['withdraw_amount']

    def save(self, commit=True):
        account = super().save(commit=False)
        withdraw_amount = self.cleaned_data['withdraw_amount']
        account.withdraw(withdraw_amount)
        if commit:
            account.save()
        return account



class AccountAdmin(admin.ModelAdmin):
    change_form_template = 'admin/account_change_form.html'
    list_display = ('account_number', 'account_holder', 'account_type', 'balance', 'status', 'created_at', 'updated_at')
    readonly_fields = ('balance', 'created_at', 'updated_at')

    def get_form(self, request, obj=None, **kwargs):
        if obj:
            if 'deposit' in request.GET:
                return DepositForm
            elif 'withdraw' in request.GET:
                return WithdrawForm
        return super().get_form(request, obj, **kwargs)

    def change_view(self, request, object_id, form_url='', extra_context=None):
        obj = self.get_object(request, object_id)

        if obj is None:
            return super().change_view(request, object_id, form_url, extra_context)

        form_class = self.get_form(request, obj)
        form = form_class(request.POST or None, instance=obj)

        if request.method == 'POST':
            if form.is_valid():
                form.save()
                self.message_user(request, "Transaction completed successfully.")
                return HttpResponseRedirect(request.get_full_path())

        context = {
            'form': form,
            'opts': self.model._meta,
            'object_id': object_id,
            'change': True,
            'has_view_permission': self.has_view_permission(request, obj),
            'has_change_permission': self.has_change_permission(request, obj),
            'has_add_permission': self.has_add_permission(request),
            'has_delete_permission': self.has_delete_permission(request, obj),
            'is_popup': '_popup' in request.GET,
            'show_save_and_add_another': False,
            'show_save_and_continue': False,
            'show_save_and_edit': False,
            **(extra_context or {}),
        }

        # Debugging context
        context['debug'] = {
            'form_class': str(form_class),
            'request.GET': request.GET,
            'form_errors': form.errors
        }
        
        return self.render_change_form(request, context, add=False)


# Ledger Admin
class LedgerAdmin(admin.ModelAdmin):
    list_display = ('transaction_id', 'account', 'transaction_date', 'transaction_type', 'amount', 'balance_after_transaction')
    readonly_fields = ('transaction_id', 'transaction_date', 'transaction_type', 'amount', 'balance_after_transaction')
    search_fields = ('transaction_id', 'account__account_number', 'transaction_type')

# Other Admin classes
class MemberAdmin(admin.ModelAdmin):
    list_display = ('member_id', 'first_name', 'last_name', 'email', 'phone_number', 'address')

class LoanAdmin(admin.ModelAdmin):
    list_display = ('loan_number', 'member', 'loan_amount', 'interest_rate', 'loan_date', 'due_date', 'status')
    list_filter = ('status', 'loan_date')

class PaymentAdmin(admin.ModelAdmin):
    list_display = ('OR', 'loan', 'payment_amount', 'payment_date', 'method', 'service_fee', 'penalty')
    readonly_fields = ('service_fee', 'penalty') 
    search_fields = ('OR', 'loan__loan_number')
    list_filter = ('method', 'payment_date')

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if obj:
            
            form.base_fields['service_fee'].widget.attrs['readonly'] = True
            form.base_fields['penalty'].widget.attrs['readonly'] = True
        return form
class RepaymentScheduleAdmin(admin.ModelAdmin):
    list_display = ('loan', 'due_date', 'amount_due', 'amount_paid', 'balance_due')
    readonly_fields = ('balance_due',)
    search_fields = ('loan__loan_number',)


admin.site.register(Member, MemberAdmin)
admin.site.register(Loan, LoanAdmin)
admin.site.register(Payment, PaymentAdmin)
admin.site.register(RepaymentSchedule, RepaymentScheduleAdmin)
admin.site.register(Account, AccountAdmin)
admin.site.register(Ledger, LedgerAdmin)
