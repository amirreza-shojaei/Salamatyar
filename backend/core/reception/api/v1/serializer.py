# appointments/api/v1/serializers.py (یا reception/api/v1/serializers.py)
from rest_framework import serializers
from appointments.models import Appointment
import jdatetime

class PendingAppointmentSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField()
    time = serializers.SerializerMethodField()
    doctorInfo = serializers.SerializerMethodField()
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'doctorInfo', 'patient_first_name', 'patient_last_name', 'patient_phone',
            'patient_national_code', 'problem', 'date', 'time' , "status"
        ]
    
    def get_date(self, obj):
        try:
            jalali_date = jdatetime.date.fromgregorian(date=obj.date)
            return jalali_date.strftime("%Y/%m/%d")
        except:
            return str(obj.date)
    
    def get_time(self, obj):
        return obj.time.strftime("%H:%M") if obj.time else ""
    
    def get_doctorInfo(self, obj):
        return {
            "name": obj.doctor.user.first_name,
            "lastName": obj.doctor.user.last_name,
            "doctorId": obj.doctor.id,
            "specialties": obj.doctor.specialty.name if obj.doctor.specialty else "عمومی"
        }