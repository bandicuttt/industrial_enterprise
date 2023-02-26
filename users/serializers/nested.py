from rest_framework import serializers
from django.contrib.auth import get_user_model
from users.models.users import Role

User = get_user_model()

class RoleShortSerializer(serializers.ModelSerializer):

    class Meta:
        model = Role
        fields = '__all__'

class UserShortSerializer(serializers.ModelSerializer):
    
    role = RoleShortSerializer()

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'first_name',
            'last_name',
            'phone_number',
            'user_photo',
            'user_dob',
            'email',
            'role',
        ) 

class UserShortUpdateSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'first_name',
            'last_name',
            'phone_number',
            'user_photo',
            'user_dob',
            'email',
        ) 

