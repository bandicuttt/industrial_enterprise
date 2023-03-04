from rest_framework.viewsets import GenericViewSet
from rest_framework import mixins
from orders.models.orders import Order
from orders.serializers.orders import OrderSerializer
from drf_spectacular.utils import extend_schema_view, extend_schema


@extend_schema_view(
    list=extend_schema(summary='Просмотр всех заказов', tags=['Заказы']),
    retrieve=extend_schema(summary='Просмотр заказа', tags=['Заказы']),
)
class ListRetrieveOrderView(mixins.ListModelMixin, mixins.RetrieveModelMixin, GenericViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
