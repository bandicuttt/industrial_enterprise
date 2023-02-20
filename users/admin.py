from django.contrib import admin
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from users.models.users import User, Role
from django.utils.translation import gettext_lazy as _
from django.db.models import Count

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display=(
        'id',
        'title',
        'roles_count',
    )
    list_display_links=(
        'title',
    )
    ordering=(
        '-id',
    )
    
    def roles_count(self,obj):
        return obj.roles_count

    def get_queryset(self, *args,**kwargs):
        return Role.objects.annotate(
            roles_count=Count('roles_users')
        )


@admin.register(User)
class UserAdmin(UserAdmin):
    change_user_password_template = None
    fieldsets = (
        (None, {'fields': ('phone_number', 'email', )}),
        (_('Личная информация'),
         {'fields': ('first_name', 'last_name',)}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'role',  'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'phone_number', 'role', 'password1', 'password2',),
        }),
    )
    list_display = ('id', 'email', 'phone_number', 'role','first_name','last_name','user_dob','role' )

    list_display_links = ('id',)
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups',)
    search_fields = ('first_name', 'last_name', 'id', 'email', 'phone_number',)
    ordering = ('-id',)
    filter_horizontal = ('groups', 'user_permissions',)
    readonly_fields = ('last_login',)