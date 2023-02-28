from django.urls import path
from transport_units.views.transport_category import TransportCategoryView
from transport_units.views.drivers import GetAllActiveDriversView

urlpatterns = [
    path('categories/', TransportCategoryView.as_view(), name='get_category'),
    path('drivers/', GetAllActiveDriversView.as_view(), name='get_drivers')
]