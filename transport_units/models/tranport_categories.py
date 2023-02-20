from django.db import models
from common.models import BaseTypeModel

class TransportCategory(BaseTypeModel):
    class Meta:
        verbose_name='Категория'
        verbose_name_plural='Категории'