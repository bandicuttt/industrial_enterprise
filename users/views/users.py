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