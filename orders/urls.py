from django.urls import path
from rest_framework.routers import DefaultRouter
from orders.views.orders import ListRetrieveOrderView

router = DefaultRouter()

router.register(r'orders',ListRetrieveOrderView,basename='get_orders')

urlpatterns = [
]

urlpatterns += router.urls