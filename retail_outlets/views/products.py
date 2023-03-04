from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework import mixins
from rest_framework.viewsets import GenericViewSet
from retail_outlets.models.products import Product
from retail_outlets.serializers.products import ListProductSerializer

@extend_schema_view(
    list=extend_schema(summary='Просмотр всех товаров', tags=['Товары']),
    retrieve=extend_schema(summary='Просмотр товара', tags=['Товары']),
)
class ProductView(mixins.ListModelMixin, mixins.RetrieveModelMixin, GenericViewSet):
    queryset = Product.objects.all()
    serializer_class = ListProductSerializer
