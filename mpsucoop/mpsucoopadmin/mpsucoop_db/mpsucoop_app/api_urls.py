from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MemberViewSet, AccountViewSet, LoanViewSet, PaymentViewSet

router = DefaultRouter()
router.register(r'members', MemberViewSet)
router.register(r'accounts', AccountViewSet)
router.register(r'loans', LoanViewSet)
router.register(r'payments', PaymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
