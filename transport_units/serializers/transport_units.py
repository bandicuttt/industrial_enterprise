from rest_framework import serializers
from transport_units.models.transport_units import TransportUnit

class GetTransportUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransportUnit
        fields = '__all__'