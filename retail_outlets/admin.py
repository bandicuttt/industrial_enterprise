from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models.retail_outlets import RetailOutlet
from .models.products import Product
from django.db.models import Count

@admin.register(RetailOutlet)
class RetailOutletAdmin(admin.ModelAdmin):
    list_display=(
        'id',
        'outlet_name',
        'outlet_address',
        'outlet_phone',
        'outlet_products',
    )
    list_display_links=(
        'outlet_name',
    )
    ordering=(
        '-id',
    )

    def outlet_products(self, obj):
        return obj.outlet_count
    
    def get_queryset(self, *args, **kwargs):
        return RetailOutlet.objects.annotate(
            outlet_count=Count('outlet_products')
        )

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display=(
        'id',
        'outlet',
        'product_name',
        'product_price',
        'volume',
        'weight',
    )
    list_display_links=(
        'product_name',
    )
    ordering=(
        '-id',
    )
