# appointments/serializers.py
from rest_framework import serializers
from ...models import Appointment
from doctor.models import Doctor, Schedule
import jdatetime
from datetime import datetime

class CreateAppointmentSerializer(serializers.ModelSerializer):
    date = serializers.CharField(write_only=True)
    time = serializers.CharField(write_only=True)
    
    class Meta:
        model = Appointment
        fields = [
            'doctor', 'patient_first_name', 'patient_last_name', 
            'patient_phone', 'patient_national_code', 'problem', 'date', 'time'
        ]
    
    def validate_date(self, value):
        try:
            year, month, day = map(int, value.split('/'))
            jalali_date = jdatetime.date(year, month, day)
            return jalali_date.togregorian() 
        except Exception:
            raise serializers.ValidationError("فرمت تاریخ باید 1404/02/01 باشد")
    
    def validate_time(self, value):
        try:
            return datetime.strptime(value, '%H:%M').time()
        except Exception:
            raise serializers.ValidationError("فرمت ساعت باید 10:30 باشد")
    
    def validate(self, data):
        doctor = data.get('doctor')
        date = data.get('date') 
        time = data.get('time')  
        
        try:
            schedule = Schedule.objects.get(
                doctor=doctor,
                date=date,
                is_active=True
            )
        except Schedule.DoesNotExist:
            raise serializers.ValidationError({
                "date": "پزشک در این تاریخ وقت ویزیت ندارد"
            })

        if time < schedule.start_time or time > schedule.end_time:
            raise serializers.ValidationError({
                "time": f"ساعت باید بین {schedule.start_time.strftime('%H:%M')} تا {schedule.end_time.strftime('%H:%M')} باشد"
            })

        if Appointment.objects.filter(
            doctor=doctor,
            date=date,
            time=time,
            status__in=['pending', 'confirmed']
        ).exists():
            raise serializers.ValidationError({
                "time": "این ساعت قبلاً رزرو شده است"
            })
        
        return data 
    
    def create(self, validated_data):
        
        return super().create(validated_data)