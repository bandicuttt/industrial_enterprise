from rest_framework import serializers
from orders.models.orders import Order
from retail_outlets.serializers.retail_outlets import ListOutletSerializer
from transport_units.serializers.drivers import DriverListSerializer
from users.serializers.users import UserSerializerMixin
from retail_outlets.serializers.products import ListProductSerializer
from transport_units.serializers.transport_units import GetTransportUnitSerializer


class OrderSerializer(serializers.ModelSerializer):

    outlet = ListOutletSerializer()
    customer = UserSerializerMixin()
    product = ListProductSerializer()
    unit = GetTransportUnitSerializer()
    driver = DriverListSerializer()

    class Meta:
        model = Order
        fields = '__all__'