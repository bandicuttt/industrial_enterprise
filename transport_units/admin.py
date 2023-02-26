from django.contrib import admin
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from transport_units.models.transport_units import TransportUnit
from transport_units.models.tranport_categories import TransportCategory
from django.utils.translation import gettext_lazy as _
from django.db.models import Count
from .models.drivers import Driver

@admin.register(TransportCategory)
class TransportAdmin(admin.ModelAdmin):
    list_display=(
        'id',
        'title',
        'categories_count',
    )
    list_display_links=(
        'title',
    )
    ordering=(
        '-id',
    )
    
    def categories_count(self,obj):
        return obj.categories_count

    def get_queryset(self, *args,**kwargs):
        return TransportCategory.objects.annotate(
            categories_count=Count('categories_transport')
        )


@admin.register(TransportUnit)
class TransportUnitAdmin(admin.ModelAdmin):
    list_display=(
        'id',
        'carrying_capacity',
        'make',
        'delivery_price',
        'license_category',
    )
    list_display_links=(
        'id',
    )
    ordering=(
        '-id',
    )

@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display=(
        'user',
        'category',
        'is_active',
        'card_id',
    )
    list_display_links=(
        'user',
    )
    ordering=(
        '-id',
    )