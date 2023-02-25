from json import loads
import json
from rest_framework import generics
from users.serializers.users import RegisterSerializer, RegisterDriverSerializer
from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model

User = get_user_model()


@extend_schema_view(
    post=extend_schema(summary='Проверка данных', tags=['Проверка']),
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
    queryset = User.objects.all()
    serializer_class = RegisterDriverSerializer

    permission_classes = [
        AllowAny
    ]