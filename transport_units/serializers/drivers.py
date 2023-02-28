from rest_framework import serializers
from transport_units.models.drivers import Driver
from users.serializers.nested import UserShortSerializer
from transport_units.serializers.nested import TransportCategoryShortSerializer

class DriverListSerializer(serializers.ModelSerializer):

    user = UserShortSerializer()
    category = TransportCategoryShortSerializer()

    class Meta:
        model = Driver
        fields = '__all__'
    
