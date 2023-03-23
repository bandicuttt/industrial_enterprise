from django.urls import path, include
from users.views.users import (CreateOrderView, FinishOrderView, RegisterView, RegisterDriverView,
                                ProfileView, RegisterCustomerView,
                                GetAllCustomersView, ProfileAdminView, ProfileAdminDelete)
from rest_framework.routers import DefaultRouter

# router = DefaultRouter()
# router.register(r'admin/profile-usr/', ProfileAdminView, basename='usr-profile-for-admin')


urlpatterns = [
    path('users/check/', RegisterView.as_view(), name='check_user'),
    path('users/register/driver/', RegisterDriverView.as_view(), name='reg_driver'),
    path('users/register/customer/', RegisterCustomerView.as_view(), name='reg_customer'),
    path('profile/', ProfileView.as_view(), name='driver_profile'),
    path('customers/', GetAllCustomersView.as_view(), name='get_customers'),
    path('admin/profile-usr/<int:pk>/', ProfileAdminView.as_view(), name='usr-profile-for-admin'),
    path('admin/profile-usr-del/<int:pk>/', ProfileAdminDelete.as_view(), name='del_usr-profile-for-admin'),
    path('admin/order/<int:pk>/', FinishOrderView.as_view(), name='finish-order'),
    path('order/create_order/<int:customer_id>/<int:product_id>/<int:volume>/<str:delivery_address>/', CreateOrderView.as_view(), name='create_order'),
]

# urlpatterns += router.urls