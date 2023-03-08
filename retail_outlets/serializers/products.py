from rest_framework import serializers
from retail_outlets.models.products import Product
from retail_outlets.serializers.retail_outlets import ListOutletSerializer


class ListProductSerializer(serializers.ModelSerializer):
    outlet = ListOutletSerializer()
    class Meta:
        model = Product
        fields = '__all__'