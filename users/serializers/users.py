from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import ParseError
from users.models.users import Role
from rest_framework.status import HTTP_204_NO_CONTENT
from transport_units.models.drivers import Driver

User = get_user_model()

class RegisterDriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = (
            'user',
            'category',
            'card_id',
            'registration_number',
        )
    

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            'id',
            'role',
            'username',
            'password',
            'email'
        )
    
    def validate_password(self, value):
        validate_password(value)
        return value
    
    def validate_email(self, value):
        if User.objects.filter(email=value.lower()).exists():
            raise ParseError(
                'Пользователь с таким email уже существует!'
            )
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value.lower()).exists():
            raise ParseError(
                'Пользователь с таким логином уже существует!'
            )
        return value
    
    def validate_role(self, value):
        if not Role.objects.filter(id=value.id).exists():
            raise ParseError(
                'Роль не найдена'
            )
        return value
    
    def create(self, request, *args, **kwargs):
        return request

    