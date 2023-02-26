from django.db import models
from .tranport_categories import TransportCategory
from django.contrib.auth import get_user_model

User = get_user_model()

class Driver(models.Model):
    category=models.ForeignKey(
        TransportCategory,
        on_delete=models.PROTECT,
        related_name='categories_drivers'
    )
    user=models.OneToOneField(
        User,
        on_delete=models.CASCADE,
    )
    is_active=models.BooleanField(default=False)
    card_id=models.CharField(max_length=20)

    class Meta:
        verbose_name='Водитель'
        verbose_name_plural='Водители'


