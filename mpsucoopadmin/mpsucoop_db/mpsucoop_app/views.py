from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.contrib.auth.forms import AuthenticationForm
from .forms import MemberSignUpForm
from .models import Member,Account


# Create your views here.
def home(request):
    return render(request, 'home.html', {})

def profile(request):
    # You can add user-specific information here if needed
    return render(request, 'profile.html')

def user_login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)

            if user.is_superuser:
                return redirect('/admin/')  # Redirect to admin panel
            else:
                return redirect('/')  # Redirect users to the home page
    else:
        form = AuthenticationForm()
    return render(request, 'registration/login.html', {'form': form})

def member_signup(request):
    if request.method == "POST":
        form = MemberSignUpForm(request.POST)
        if form.is_valid():
            account_number = form.cleaned_data.get('account_number')
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')

            # Create the User object
            user = User.objects.create(
                username=username,
                password=make_password(password)  # Hash password
            )

            # Link the User object to the Member model
            account = Account.objects.get(account_number=account_number)
            member = Member.objects.get(memId=account.account_holder.memId)
            member.user = user
            member.save()

            return redirect('login')  # Redirect to the login page
    else:
        form = MemberSignUpForm()

    return render(request, 'registration/signup.html', {'form': form})




