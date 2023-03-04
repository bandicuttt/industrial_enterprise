from rest_framework import serializers
from retail_outlets.models.products import Product


class ListProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'