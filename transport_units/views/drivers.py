from rest_framework import generics
from drf_spectacular.utils import extend_schema_view, extend_schema
from transport_units.models.drivers import Driver
from transport_units.serializers.drivers import DriverListSerializer
from transport_units.filters import DriversFilter
from django_filters.rest_framework import DjangoFilterBackend



@extend_schema_view(
    get=extend_schema(summary='Получить всех водителей', tags=['Водители']),
)
class GetAllActiveDriversView(generics.ListAPIView):

    serializer_class = DriverListSerializer
    filter_backends = (DjangoFilterBackend,)
    queryset = Driver.objects.filter()
    filterset_class = DriversFilter