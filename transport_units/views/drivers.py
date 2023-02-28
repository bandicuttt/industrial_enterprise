from rest_framework import generics
from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework.permissions import AllowAny
from transport_units.models.drivers import Driver
from transport_units.serializers.drivers import DriverListSerializer
from rest_framework.filters import SearchFilter



@extend_schema_view(
    get=extend_schema(summary='Получить всех активных водителей', tags=['Вводитель']),
)
class GetAllActiveDriversView(generics.ListAPIView):
    serializer_class = DriverListSerializer
    
    # queryset = Driver.objects.all()
    # filter_backends = (
    #     SearchFilter,
    # )
    # search_fields = (
    #     'is_active',
    # )

    def get_queryset(self):
        queryset = Driver.objects.filter()
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(user__is_active=is_active)
        return queryset