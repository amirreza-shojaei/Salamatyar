from django.contrib import admin
from .models import Reception

@admin.register(Reception)
class ReceptionAdmin(admin.ModelAdmin):
    list_display = ['user__first_name', 'user__last_name', 'doctors', 'is_active']
    list_filter = ['is_active' , 'doctors']
    search_fields = ['user__first_name', 'user__last_name', 'user__phone']