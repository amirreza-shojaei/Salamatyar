from django.contrib import admin
from .models import Appointment
# Register your models here.
class AppointmentAdmin(admin.ModelAdmin):
    model = Appointment
    list_display = ('patient_first_name', 'patient_last_name', 'patient_phone' , 'status',)
    search_fields = ('patient_phone','patient_national_code',)
    ordering = ('patient_phone',)
    list_filter = ['created_date' , 'doctor__user__first_name' , 'status']
    
admin.site.register(Appointment , AppointmentAdmin)