from django.db import models
from .retail_outlets import RetailOutlet

class Product(models.Model):
    product_name=models.CharField(
        max_length=48,
    )
    product_description=models.TextField(
        max_length=500
    )
    product_price=models.DecimalField(
        max_digits=7,
        decimal_places=2
    )
    volume=models.PositiveSmallIntegerField()
    weight=models.FloatField(
        max_length=500
    )
    outlet=models.ForeignKey(
        RetailOutlet,
        on_delete=models.CASCADE,
        related_name='outlet_products'
    )

    def __str__(self):
        return self.product_name

    class Meta:
        verbose_name='Продукт'
        verbose_name_plural='Продукты'


