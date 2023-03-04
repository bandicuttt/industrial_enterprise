from django.urls import path, include
from users.views.users import RegisterView, RegisterDriverView, ProfileView, RegisterCustomerView, GetAllCustomersView

urlpatterns = [
    path('users/check/', RegisterView.as_view(), name='check_user'),
    path('users/register/driver/', RegisterDriverView.as_view(), name='reg_driver'),
    path('users/register/customer/', RegisterCustomerView.as_view(), name='reg_customer'),
    path('profile/', ProfileView.as_view(), name='driver_profile'),
    path('customers/', GetAllCustomersView.as_view(), name='get_customers'),
]