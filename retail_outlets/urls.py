from django.urls import path, include
from retail_outlets.views.retail_outlets import RetailOutletView
from retail_outlets.views.products import ProductView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register(r'retailoutlets',RetailOutletView,basename='get_retail_outlets')
router.register(r'products',ProductView,basename='get_products')

urlpatterns = [
]

urlpatterns += router.urls