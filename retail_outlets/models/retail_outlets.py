from django.db import models
from phonenumber_field.modelfields import PhoneNumberField

class RetailOutlet(models.Model):
    outlet_photo=models.ImageField(
        null=True,
        blank=True,
        upload_to='media/'
    )
    outlet_phone=PhoneNumberField(
        unique=True,
        null=True,
    )
    outlet_name=models.CharField(
        max_length=48,
        unique=True,
    )
    outlet_address=models.CharField(
        max_length=48,
        unique=True,
    )

    
    def __str__(self):
        return self.outlet_address

    class Meta:
        verbose_name='Торговая точка'
        verbose_name_plural='Торговые точки'


