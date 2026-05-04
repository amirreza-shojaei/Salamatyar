# doctors/serializers.py
from rest_framework import serializers
from ...models import Doctor, Specialty, Schedule
from appointments.models import Appointment
import jdatetime
from django_jalali.db import models as jmodels
from django.utils import timezone

class DoctorListSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.first_name')
    lastName = serializers.CharField(source='user.last_name')
    specialty = serializers.SerializerMethodField()
    workingTimes = serializers.SerializerMethodField()
    
    class Meta:
        model = Doctor
        fields = ['id', 'name', 'lastName', 'specialty', 'workingTimes' , 'picture']
     
    def get_specialty(self, obj):
        return obj.specialty.name if obj.specialty else "عمومی"
    
    def get_workingTimes(self, obj):
        working_times = []

        today = timezone.localdate()

        
        schedules = Schedule.objects.filter(doctor=obj.id,date__gte=today,is_active=True).order_by('date')


        appointments = Appointment.objects.filter(status__in=['pending', 'confirmed'],date__gte=today)

        for schedule in schedules:
            day_appointments = appointments.filter(date=schedule.date)
            
            working_times.append({
                "date": self._format_jalali_date(schedule.date),
                "startTime": schedule.start_time.hour,
                "finishTime": schedule.end_time.hour,
                "fullTime": [
                    apt.time.strftime("%H:%M").replace(':', ':') 
                    for apt in day_appointments
                ]
            })
        
        return working_times
    
    def _format_jalali_date(self, date):
        """تبدیل تاریخ میلادی به شمسی (فرمت 1404/02/01)"""
        try:
            jalali_date = jdatetime.date.fromgregorian(date=date)
            return jalali_date.strftime("%Y/%m/%d")
        except Exception as e:
            return date.strftime("%Y/%m/%d")
        
class ApprovedAppointmentSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField() 
        
    class Meta:
        model = Appointment
        fields = [
            'id', 'patient_first_name', 'patient_last_name', 'patient_phone', 
            'patient_national_code', 'problem', 'date', 'time'
        ]

    def get_date(self, obj):
        try:
            jalali_date = jdatetime.date.fromgregorian(date=obj.date)
            return jalali_date.strftime("%Y/%m/%d")
        except:
            return obj.date.strftime("%Y-%m-%d")
