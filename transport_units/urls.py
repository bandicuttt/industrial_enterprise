from django.urls import path
from transport_units.views.transport_category import TransportCategoryView
from transport_units.views.drivers import GetAllActiveDriversView
from rest_framework.routers import DefaultRouter
from transport_units.views.transport_units import TransportUnitView

router = DefaultRouter()

router.register(r'transportunit',TransportUnitView,basename='get_transport_unit')

urlpatterns = [
    path('categories/', TransportCategoryView.as_view(), name='get_category'),
    path('drivers/', GetAllActiveDriversView.as_view(), name='get_drivers')
]

urlpatterns += router.urls