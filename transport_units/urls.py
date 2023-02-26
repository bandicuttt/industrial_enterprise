from django.urls import path
from transport_units.views.transport_category import TransportCategoryView

urlpatterns = [
    path('categories/', TransportCategoryView.as_view(), name='get_category')
]