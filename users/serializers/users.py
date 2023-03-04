from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import ParseError
from users.models.users import Role
from transport_units.models.drivers import Driver
from transport_units.serializers.nested import TransportCategoryShortSerializer
from crum import get_current_user
from django.db import transaction
from transport_units.models.tranport_categories import TransportCategory
from .nested import RoleShortSerializer, UserShortSerializer, UserShortUpdateSerializer
from phonenumber_field.modelfields import PhoneNumberField



User = get_user_model()   


class UserSerializerMixin(serializers.ModelSerializer):
    role = RoleShortSerializer()
    
    class Meta:
        model = User
        fields = (
            'id',
            'last_login',
            'date_joined',
            'username',
            'first_name',
            'last_name',
            'phone_number',
            'user_photo',
            'user_dob',
            'email',
            'role',
        )


class RetrieveDriverSerializer(serializers.ModelSerializer):

    user = UserShortSerializer()
    category = TransportCategoryShortSerializer()

    class Meta:
        model = Driver
        fields = '__all__'


class UpdateUserProfileSerializer(serializers.ModelSerializer):

    id = serializers.IntegerField(read_only=True)
    date_joined = serializers.DateTimeField(read_only=True)
    email = serializers.EmailField(read_only=True)

    class Meta:
        model = User
        fields = (
            'id',
            'date_joined',
            'username',
            'first_name',
            'last_name',
            'phone_number',
            'user_photo',
            'user_dob',
            'email',
            'role',
        )

class UpdateDriverSerializer(serializers.ModelSerializer):

    is_active = serializers.BooleanField(read_only=True)
    user = UserShortUpdateSerializer()

    class Meta:
        model = Driver
        fields = '__all__'

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user') if 'user' in validated_data else None
        instance = super().update(instance, validated_data)
        if user_data:
            user = instance.user
            for key, value in user_data.items():
                if hasattr(user, key):
                    setattr(user, key, value)
            user.save()
        return instance


class RegisterCustomerSerializer(serializers.ModelSerializer):
    role = serializers.IntegerField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'first_name',
            'last_name',
            'user_dob',
            'email',
            'role',
            'password',
            'phone_number'
        )

    def create(self, validated_data):

        user_data = {
            'username':validated_data.pop('username'),
            'role_id':validated_data.pop('role'),
            'first_name':validated_data.pop('first_name'),
            'last_name':validated_data.pop('last_name'),
            'user_dob': validated_data.pop('user_dob'),
            'email': validated_data.pop('email'),
            'password':validated_data.pop('password'),
            'phone_number':validated_data.pop('phone_number'),
        }

        with transaction.atomic():
            if self.validated_data.pop('role') == 2:
                user = User.objects.create(**user_data)
                user.set_password(user_data.pop('password'))
                user.save()
            else:
                raise ParseError('Ошибка валидации !')
        return self.validated_data


class RegisterDriverSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    first_name = serializers.CharField()
    last_name  = serializers.CharField()
    user_dob = serializers.DateField()
    email = serializers.EmailField()
    phone_number = serializers.CharField()
    role = serializers.IntegerField(write_only=True)
    password = serializers.CharField(write_only=True)
    category = serializers.IntegerField(write_only=True)
    is_active = serializers.BooleanField(default=False, read_only=True)

    class Meta:
        model = Driver
        fields = (
            'id',
            'username',
            'first_name',
            'last_name',
            'user_dob',
            'email',
            'role',
            'category',
            'card_id',
            'password',
            'phone_number',
            'is_active',
        )

    def validate_email(self, value):
        if User.objects.filter(email=value.lower()).exists():
            raise ParseError(
                'Пользователь с таким email уже существует!'
            )
        return value

    def validate_phone_number(self, value):
        value = str(value).replace('+','')
        if len(value) == 12:
            try:
                value = int(value)
            except Exception:
                raise ParseError(
                    'Номер телефона введен некорректно!'
                )
        return value

    def validate_category(self, value):
        if not TransportCategory.objects.filter(id=value).exists():
            raise ParseError(
                'Такой категории не существует'
            )
        return value

    def validate_role(self, value):
        if not Role.objects.filter(id=value).exists():
            raise ParseError(
                'Роль не найдена'
            )
        return value

    def create(self, validated_data):

        user_data = {
            'username':validated_data.pop('username'),
            'role_id':validated_data.pop('role'),
            'first_name':validated_data.pop('first_name'),
            'last_name':validated_data.pop('last_name'),
            'user_dob': validated_data.pop('user_dob'),
            'email': validated_data.pop('email'),
            'password':validated_data.pop('password'),
            'phone_number':validated_data.pop('phone_number'),
        }

        with transaction.atomic():
            if self.validated_data.pop('role') == 3:
                user = User.objects.create(**user_data)
                user.set_password(user_data.pop('password'))
                user.save()
                validated_data['user'] = user
                Driver.objects.create(
                    category_id=validated_data.pop('category'),
                    user=validated_data.pop('user'),
                    card_id=validated_data.pop('card_id'),
                    
                )
            else:
                raise ParseError(
                    'Ошибка валидации!'
                )
            
        return self.validated_data
        

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

    def create(self, validated_data):
        return self.validated_data