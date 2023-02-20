from django.db import models
from .tranport_categories import TransportCategory

class TransportUnit(models.Model):
    carrying_capacity=models.PositiveSmallIntegerField()
    make=models.CharField(max_length=48)
    registration_number=models.CharField(max_length=10, unique=True)
    delivery_price=models.DecimalField(max_digits=7,decimal_places=2)
    unit_photo=models.ImageField(blank=True, null=True, upload_to='media/')
    license_category=models.ForeignKey(
        TransportCategory,
        on_delete=models.SET_NULL,
        null=True,
        related_name='categories_transport'
    )
    
    def __str__(self):
        return self.registration_number

    class Meta:
        verbose_name='Транспорт'
        verbose_name_plural='Транспорт'


