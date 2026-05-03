from django.contrib import admin
from .models import Doctor , Schedule , Specialty
# Register your models here.
# Register your models here.

class SpecialtyAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['name']

class DoctorAdmin(admin.ModelAdmin):
    model = Doctor
    list_display = ('user__first_name', 'user__last_name', 'specialty__name' , 'medical_license',)
    search_fields = ('medical_license',)
    ordering = ('medical_license',)
    list_filter = ['created_date',]
    

class ScheduletAdmin(admin.ModelAdmin):
    model = Schedule
    list_display = ('date', 'start_time', 'end_time' , 'is_active',)
    search_fields = ('date', 'start_time', 'end_time',)
    ordering = ('date',)
    
admin.site.register(Specialty , SpecialtyAdmin)
admin.site.register(Doctor , DoctorAdmin)
admin.site.register(Schedule , ScheduletAdmin)
