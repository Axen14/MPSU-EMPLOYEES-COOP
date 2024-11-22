
# from django.contrib import messages
# from decimal import Decimal
# from django.http import HttpResponseRedirect
# from .models import Member, Account, Loan, PaymentSchedule
# from django.contrib import admin
# from django.contrib.auth.models import User




# class MemberAdmin(admin.ModelAdmin):
#     search_fields = ('first_name', 'last_name', 'email')
#     list_display = ( 'first_name', 'middle_name', 'last_name', 'email', 'phone_number', 'address', 'user')

# class AccountAdmin(admin.ModelAdmin):
#     list_display = ('account_number', 'account_holder', 'shareCapital', 'status', 'created_at', 'updated_at')
#     search_fields = ('account_number', 'account_holder__first_name', 'account_holder__last_name')
    
#     actions = ['deposit', 'withdraw']

#     def deposit(self, request, queryset):
#         if request.method == 'POST':
#             amount = request.POST.get('amount')  
#             for account in queryset:
#                 try:
#                     account.deposit(Decimal(amount))
#                     self.message_user(request, f"Successfully deposited {amount} to account {account.account_number}.", messages.SUCCESS)
#                 except ValueError as e:
#                     self.message_user(request, str(e), messages.ERROR)
#             return HttpResponseRedirect(request.get_full_path())
#         return HttpResponseRedirect(request.get_full_path())  
#     deposit.short_description = "Deposit to selected accounts"

#     def withdraw(self, request, queryset):
#         if request.method == 'POST':
#             amount = request.POST.get('amount')  
#             for account in queryset:
#                 try:
#                     account.withdraw(Decimal(amount))
#                     self.message_user(request, f"Successfully withdrew {amount} from account {account.account_number}.", messages.SUCCESS)
#                 except ValueError as e:
#                     self.message_user(request, str(e), messages.ERROR)
#             return HttpResponseRedirect(request.get_full_path())
#         return HttpResponseRedirect(request.get_full_path())  
#     withdraw.short_description = "Withdraw from selected accounts"




# class LoanAdmin(admin.ModelAdmin):
#     list_display = ('control_number', 'account', 'loan_amount', 'loan_type', 'status', 'loan_date', 'due_date')
#     search_fields = ('control_number', 'account__account_number')
#     list_filter = ('loan_type', 'status')
    
#     def get_search_results(self, request, queryset, search_term):
#         if len(search_term) == 36 and search_term.count('-') == 4:  
#             try:
#                 import uuid
#                 uuid.UUID(search_term)
#             except ValueError:
#                 return queryset.none()  
#         return super().get_search_results(request, queryset, search_term)


# class PaymentScheduleAdmin(admin.ModelAdmin):
#     list_display = ('loan', 'due_date', 'payment_amount', 'balance')
#     search_fields = ('loan__control_number',)
#     list_filter = ('due_date',)



     
     
     
     
    
     
     
     
    

# admin.site.register(Loan, LoanAdmin)
# admin.site.register(PaymentSchedule)
# admin.site.register(Account, AccountAdmin)
# admin.site.register(Member, MemberAdmin)
