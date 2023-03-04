from rest_framework import serializers
from retail_outlets.models.retail_outlets import RetailOutlet


class ListOutletSerializer(serializers.ModelSerializer):
    class Meta:
        model  = RetailOutlet
        fields = '__all__'