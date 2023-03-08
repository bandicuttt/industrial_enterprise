from rest_framework import serializers
from transport_units.models.transport_units import TransportUnit
from transport_units.serializers.transport_category import TransportCategoryListSerializer

class GetTransportUnitSerializer(serializers.ModelSerializer):
    license_category = TransportCategoryListSerializer()

    class Meta:
        model = TransportUnit
        fields = '__all__'