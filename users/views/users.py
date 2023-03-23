from django.shortcuts import get_object_or_404
from rest_framework import generics
from users.serializers.users import (CustomerProfileAdminSerializer, DriverProfileAdminSerializer, ProfileAdminSerializer, RegisterSerializer, RegisterDriverSerializer,
                                        RetrieveDriverSerializer, UpdateDriverSerializer, RegisterCustomerSerializer, UpdateDriverSerializerAdmin, UpdateUserProfileSerializer, UserSerializerMixin)
from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from transport_units.models.drivers import Driver,  TransportCategory
from crum import get_current_user
from rest_framework.permissions import IsAdminUser
from rest_framework import serializers
from users.models.users import Role
from rest_framework.response import Response


User = get_user_model()


@extend_schema_view(
    post=extend_schema(summary='Валидация данных', tags=['Валидация данных']),
)
class RegisterView(generics.CreateAPIView):
    queryset = None
    serializer_class = RegisterSerializer

    permission_classes = [
        AllowAny
    ]


@extend_schema_view(
    post=extend_schema(summary='Регистрация водителя', tags=['Аутентификация & Авторизация']),
)
class RegisterDriverView(generics.CreateAPIView):
    queryset = None
    serializer_class = RegisterDriverSerializer

    permission_classes = [
        AllowAny
    ]

@extend_schema_view(
    post=extend_schema(summary='Регистрация покупателя', tags=['Аутентификация & Авторизация']),
)
class RegisterCustomerView(generics.CreateAPIView):
    queryset = None
    serializer_class = RegisterCustomerSerializer

    permission_classes = [
        AllowAny
    ]


@extend_schema_view(
    get=extend_schema(summary='Посмотреть всех покупателей', tags=['Покупатели']),
)
class GetAllCustomersView(generics.ListAPIView):

    queryset = User.objects.filter(is_active=True, role__title='Покупатель')
    serializer_class = UserSerializerMixin



@extend_schema_view(
    patch=extend_schema(request=UpdateDriverSerializer, summary='Обновить профиль частично', tags=['Профиль']),
    get=extend_schema(summary='Посмотреть профиль', tags=['Профиль']),
)
class ProfileView(generics.RetrieveUpdateAPIView):

    queryset = User.objects.all()
    serializer_class = UpdateDriverSerializer
    http_method_names = ['get','patch']

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        user = get_current_user()
        if user.role.title == 'Водитель':
            obj = queryset.get(user=user)
        else:
            obj = queryset.get(id=user.id)
            self.check_object_permissions(self.request, obj)
        return obj

    def get_serializer_class(self):
        user = get_current_user()

        if self.request.method in ['PATCH']:
            if user.role.title == 'Покупатель':
                return UpdateUserProfileSerializer
            return UpdateDriverSerializer
        
        if user.role.title == 'Водитель':
            return RetrieveDriverSerializer
        return UserSerializerMixin
    
    def get_queryset(self):
        user = get_current_user()
        if user.role.title == 'Водитель':
            queryset = Driver.objects.all()
        else:
            queryset = User.objects.all()
        return queryset


@extend_schema_view(
    delete=extend_schema(summary='Удалить профиль', tags=['Для админов']),
)
class ProfileAdminDelete(generics.DestroyAPIView):
    queryset = User.objects.all()
    permission_classes = (IsAdminUser,)


@extend_schema_view(
    patch=extend_schema(summary='Обновить профиль частично', tags=['Для админов']),
    get=extend_schema(summary='Посмотреть профиль', tags=['Для админов']),
)
class ProfileAdminView(generics.RetrieveUpdateAPIView):
    allowed_methods = ['GET', 'PATCH']
    queryset = User.objects.select_related('role', 'driver').all()
    serializer_class = ProfileAdminSerializer
    permission_classes = [IsAdminUser]

    def get_object(self):
        user_id = self.kwargs.get('pk')
        user = get_object_or_404(self.queryset, id=user_id)
        return user

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user_role'] = self.get_object().role.title
        return context

    def get_serializer_class(self):
        if self.request.method == 'GET':
            if self.get_object().role.title == 'Водитель':
                return DriverProfileAdminSerializer
            else:
                return ProfileAdminSerializer
                
        elif self.request.method == 'PATCH':
            if self.get_object().role.title == 'Водитель':
                return DriverProfileAdminSerializer
            else:
                return CustomerProfileAdminSerializer

        return self.serializer_class

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()




from django.db.models import Sum
from django.http import Http404
from rest_framework import generics
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema_view
from retail_outlets.models.retail_outlets import RetailOutlet
from orders.models.orders import Order
from retail_outlets.models.products import Product
from transport_units.models.drivers import Driver
from transport_units.models.tranport_categories import TransportCategory
from transport_units.models.transport_units import TransportUnit
from rest_framework import serializers
from datetime import datetime, timezone
from rest_framework.exceptions import ValidationError
from django.db import transaction
from django.shortcuts import get_object_or_404


class OrderSerializer(serializers.ModelSerializer):
    delivery_date = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = '__all__'

    def get_delivery_date(self, obj):
        return obj.delivery_date.date() if obj.delivery_date else None

    def update(self, instance, validated_data):
        instance.delivery_date = timezone.now()
        instance.save()
        return instance

@extend_schema_view(
    post=extend_schema(summary='Заврешить заказ', tags=['Заказы']),
)
class FinishOrderView(generics.CreateAPIView):
    serializer_class = OrderSerializer

    def post(self, request, *args, **kwargs):
        order_id = self.kwargs['pk']
        order = get_object_or_404(Order, id=order_id)
        order.delivery_date = datetime.now()
        order.save()
        driver = order.driver
        driver.is_active = False
        driver.save()
        serializer = self.serializer_class(order)
        return Response(serializer.data)

class CreateOrderSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField()
    customer_id = serializers.IntegerField()
    volume = serializers.IntegerField()
    delivery_address = serializers.CharField()

    class Meta:
        model = Order
        fields = ['product_id', 'customer_id', 'volume', 'delivery_address']

    def create(self, validated_data):
        product_id = validated_data.pop('product_id')
        customer_id = validated_data.pop('customer_id')
        volume = validated_data.pop('volume')
        delivery_address = validated_data.pop('delivery_address')
        outlet_id = self.context.get('outlet_id')
        
        try:
            customer = User.objects.get(id=customer_id)
        except User.DoesNotExist:
            raise ValidationError('Пользователь не найден')

        # Calculate the total weight of the order
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            raise ValidationError('Товар не найден')
        
        if product.volume < volume:
            raise ValidationError('Не хватает товара')

        outlet_id = product.outlet
        total_weight = product.weight * volume
        
        # Select a suitable transport unit for the order
        transport_unit = TransportUnit.objects.filter(carrying_capacity__gte=total_weight).order_by('carrying_capacity').first()
        if not transport_unit:
            raise ValidationError('Нет подходящих машин')
        
        # Select a suitable driver for the transport unit's category
        driver = Driver.objects.filter(category=transport_unit.license_category, is_active=False).first()
        if not driver:
            raise ValidationError('Нет подходящего водителя')
        
        order = Order.objects.create(
            product_id=product_id,
            customer_id=customer_id,
            volume=volume,
            delivery_address=delivery_address,
            unit=transport_unit,
            driver=driver,
            outlet=outlet_id,
        )
        
        driver.is_active = True
        product.volume = product.volume - volume
        driver.save()
        product.save()
        
        return order

@extend_schema_view(
    post=extend_schema(summary='Создать заказ', tags=['Заказы']),
)
class CreateOrderView(generics.CreateAPIView):
    serializer_class = CreateOrderSerializer

    def perform_create(self, serializer):
        # Get the selected product and calculate the total weight
        product_id = self.kwargs.get('product_id')
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            raise ValidationError('Товар не найден')
        total_weight = product.weight * self.kwargs.get('volume')

        # Get the suitable transport unit for the total weight
        transport_unit = TransportUnit.objects.filter(
            carrying_capacity__gte=total_weight
        ).order_by('carrying_capacity').first()
        if not transport_unit:
            raise ValidationError('Нет подходящих машин')

        # Get the suitable driver for the transport unit's category
        driver = Driver.objects.filter(
        category=transport_unit.license_category
        ).filter(
            is_active=False
        ).first()
        if not driver:
            raise ValidationError('Нет подходящего водителя')

        serializer.validated_data['created_at'] = datetime.now()
        serializer.validated_data['driver'] = driver
        serializer.save(
            outlet_id=product.outlet,
            customer_id=self.kwargs.get('customer_id'),
            product=product,
            volume=self.kwargs.get('volume'),
            delivery_address=self.kwargs.get('delivery_address'),
            unit=transport_unit,
            driver=driver, 
        )

        driver.is_active = True
        product.volume = product.volume - self.kwargs.get('volume')
        driver.save()
        product.save()