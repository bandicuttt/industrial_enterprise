from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.db.models import Count
from orders.models.orders import Order

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display=(
        'id',
        'outlet',
        'customer',
        'product',
        'unit',
        'driver',
        'volume',
        'delivery_address',
        'delivery_date',
    )
    list_display_links=(
        'product',
    )
    ordering=(
        '-id',
    )