from django import forms
from .models import Member, Account

class MemberSignUpForm(forms.Form):
    account_number = forms.CharField(max_length=20)
    first_name = forms.CharField(max_length=50)
    middle_name = forms.CharField(max_length=50, required=False)
    last_name = forms.CharField(max_length=50)
    email = forms.EmailField()
    phone_number = forms.CharField(max_length=15)
    home_address = forms.CharField(widget=forms.Textarea)
    username = forms.CharField(max_length=150)
    password = forms.CharField(widget=forms.PasswordInput)

    def clean(self):
        cleaned_data = super().clean()
        account_number = cleaned_data.get("account_number")
        first_name = cleaned_data.get("first_name")
        last_name = cleaned_data.get("last_name")
        email = cleaned_data.get("email")
        phone_number = cleaned_data.get("phone_number")

        
        try:
            account = Account.objects.get(account_number=account_number)
            member = Member.objects.get(
                memId=account.account_holder.memId,  
                first_name=first_name,
                last_name=last_name,
                email=email,
                phone_number=phone_number
            )
        except (Account.DoesNotExist, Member.DoesNotExist):
            raise forms.ValidationError("Record not found. Become a member.")
        
        return cleaned_data
    
