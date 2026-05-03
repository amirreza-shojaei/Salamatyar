from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from accounts.models import User

class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('phone', 'is_staff', 'is_active' , 'is_doctor' , 'role')
    search_fields = ('phone',)
    ordering = ('phone',)
    list_filter = ['is_doctor' , 'role']

    fieldsets = (
        ('authentication', {
            'fields': ('phone', 'password')
        }),
        ('permissions', {    
            'fields': ('is_active', 'is_staff', 'is_superuser' , 'is_doctor' , 'role')
        }),
        ('detail', {    
            'fields': ('first_name', 'last_name')
        }),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'phone', 'password1', 'password2','first_name', 'last_name',
                'is_active', 'is_staff', 'is_superuser', 'is_verified','is_doctor' , 'role'
            )
        }),
    )
admin.site.register(User, CustomUserAdmin)