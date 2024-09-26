from django.contrib import admin
from django.urls import path
from django.contrib.auth.views import LoginView
from .views import home, member_signup, profile, user_login 

urlpatterns = [
    path('', home, name='home'),  
    path('signup/', member_signup, name='signup'), 
    path('accounts/profile/', profile, name='profile'),
    path('login/', user_login, name='user_login'),  
]