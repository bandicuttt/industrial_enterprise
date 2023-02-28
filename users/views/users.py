from json import loads
import json
from rest_framework import generics
from users.serializers.users import (RegisterSerializer, RegisterDriverSerializer,
                                        RetrieveDriverSerializer, UpdateDriverSerializer, RegisterCustomerSerializer)
from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from transport_units.models.drivers import Driver
from crum import get_current_user
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
    put=extend_schema(request=UpdateDriverSerializer, summary='Обновить профиль водителя', tags=['Вводитель']),
    patch=extend_schema(request=UpdateDriverSerializer, summary='Обновить профиль водителя частично', tags=['Вводитель']),
    get=extend_schema(summary='Посмотреть профиль водителя', tags=['Вводитель']),
)
class DriverProfileView(generics.RetrieveUpdateAPIView):
    
    queryset = Driver.objects.select_related('user').all()
    serializer_class = UpdateDriverSerializer

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        user = get_current_user()
        obj = queryset.get(user=user)
        self.check_object_permissions(self.request, obj)
        return obj

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return UpdateDriverSerializer
        return RetrieveDriverSerializer

@extend_schema_view(
    get=extend_schema(summary='Получить всех водителей', tags=['Вводитель']),
)
class GetAllDriversView(generics.RetrieveUpdateAPIView):

    def get(self, request):
        queryset = Driver.objects.all()
        serializer_for_queryset = RetrieveDriverSerializer(
            instance=queryset, # Передаём набор записей
            many=True # Указываем, что на вход подаётся именно набор записей
        )
        return Response(serializer_for_queryset.data)
