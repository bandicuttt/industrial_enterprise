from django.urls import path, include
from users.views.users import RegisterView, RegisterDriverView

urlpatterns = [
    path('users/check/', RegisterView.as_view(), name='check_user'),
    path('users/register/driver/', RegisterDriverView.as_view(), name='reg_driver')
]