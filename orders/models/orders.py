from django.db import models
from django.contrib.auth import get_user_model
from retail_outlets.models.retail_outlets import RetailOutlet
from retail_outlets.models.products import Product
from transport_units.models.transport_units import TransportUnit
from transport_units.models.drivers import Driver

User = get_user_model()

class Order(models.Model):
    outlet=models.ForeignKey(
        RetailOutlet,
        on_delete=models.PROTECT,
        related_name='outlets_orders',
    )
    customer=models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='customers_orders',
    )
    product=models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name='products_orders',
    )
    unit=models.ForeignKey(
        TransportUnit,
        on_delete=models.PROTECT,
        related_name='units_orders',
    )
    driver=models.ForeignKey(
        Driver,
        on_delete=models.PROTECT,
        related_name='drivers_orders',
    )
    volume=models.PositiveSmallIntegerField()
    delivery_date=models.DateField()
    delivery_address=models.CharField(
        max_length=100,
    )

    def __str__(self):
        return self.product.product_name

    class Meta:
        verbose_name='Заказ'
        verbose_name_plural='Заказы'


