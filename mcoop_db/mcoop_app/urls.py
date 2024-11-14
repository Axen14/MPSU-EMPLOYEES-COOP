from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MemberViewSet, 
    AccountViewSet, 
    LoanViewSet,
    PaymentScheduleViewSet,
    PaymentViewSet,
    ActiveLoansByAccountView
)

router = DefaultRouter()
router.register(r'members', MemberViewSet)  
router.register(r'accounts', AccountViewSet)
router.register(r'loans', LoanViewSet) 
router.register(r'payment-schedules', PaymentScheduleViewSet, basename='payment-schedules')
router.register(r'payments', PaymentViewSet, basename='payment')

urlpatterns = [
    path('', include(router.urls)),
    path('active-loans/<str:account_number>/', ActiveLoansByAccountView.as_view(), name='active-loans-by-account'),
    
    

    
]
