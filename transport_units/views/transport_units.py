from rest_framework import mixins
from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework.viewsets import GenericViewSet
from transport_units.models.transport_units import TransportUnit
from transport_units.serializers.transport_units import GetTransportUnitSerializer

@extend_schema_view(
    list=extend_schema(summary='Просмотр всех машин', tags=['Машины']),
    retrieve=extend_schema(summary='Просмотр машины', tags=['Машины']),
)
class TransportUnitView(mixins.ListModelMixin, mixins.RetrieveModelMixin, GenericViewSet):
    queryset = TransportUnit.objects.all()
    serializer_class = GetTransportUnitSerializer
