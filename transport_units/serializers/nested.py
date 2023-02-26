from rest_framework import serializers
from transport_units.models.tranport_categories import TransportCategory


class TransportCategoryShortSerializer(serializers.ModelSerializer):

    class Meta:
        model = TransportCategory
        fields = '__all__'