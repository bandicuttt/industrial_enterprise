from django.db import models
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField
from .managers import BaseUserManager
from common.models import BaseTypeModel

class Role(BaseTypeModel):
    class Meta:
        verbose_name='Роль'
        verbose_name_plural='Роли'



class User(AbstractUser):
    phone_number=PhoneNumberField(
        unique=True,
        null=True,
    )
    user_photo=models.ImageField(
        blank=True,
        null=True,
        upload_to='media/'
    )
    user_dob=models.DateField(
        null=True,
    )
    email=models.EmailField(
        unique=True,
    )
    role=models.ForeignKey(
        Role,
        on_delete=models.SET_NULL,
        null=True,
        related_name='roles_users',
    )

    # objects=BaseUserManager()

    def __str__(self):
        return self.first_name

    class Meta:
        verbose_name='Пользователь'
        verbose_name_plural='Пользователи'
    
    

