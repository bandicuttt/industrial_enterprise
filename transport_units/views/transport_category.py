from transport_units.serializers.transport_category import TransportCategoryListSerializer
from rest_framework import generics
from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework.permissions import AllowAny
from transport_units.models.tranport_categories import TransportCategory

@extend_schema_view(
    get=extend_schema(summary='Получение всех категорий', tags=['Категории']),
)
class TransportCategoryView(generics.ListAPIView):
    queryset = TransportCategory.objects.all()
    serializer_class = TransportCategoryListSerializer

    permission_classes = [
        AllowAny
    ]

