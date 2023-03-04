from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework import mixins
from rest_framework.viewsets import GenericViewSet
from retail_outlets.models.retail_outlets import RetailOutlet
from retail_outlets.serializers.retail_outlets import ListOutletSerializer

@extend_schema_view(
    list=extend_schema(summary='Просмотр всех торговых точек', tags=['Торговые точки']),
    retrieve=extend_schema(summary='Просмотр торговой точки', tags=['Торговые точки']),
)
class RetailOutletView(mixins.ListModelMixin, mixins.RetrieveModelMixin, GenericViewSet):
    queryset = RetailOutlet.objects.all()
    serializer_class = ListOutletSerializer
