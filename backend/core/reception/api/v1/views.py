# appointments/api/v1/views.py
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from appointments.models import Appointment
from .serializer import PendingAppointmentSerializer
from rest_framework.views import APIView
from rest_framework import status
from doctor.models import Doctor, Schedule
from datetime import datetime
import jdatetime
from .permission import IsReceptionUser

class MyDoctorsPendingAppointmentsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated , IsReceptionUser]
    serializer_class = PendingAppointmentSerializer
    
    def get_queryset(self):
        user = self.request.user
        reception = user.reception_profile
        
        if not reception.doctors:
            return Appointment.objects.none()
        
        return Appointment.objects.filter(
            doctor=reception.doctors,
            status='pending'
        ).order_by('-created_date')
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            "status": "success",
            "message": "لیست نوبت‌های در انتظار تایید",
            "error": None,
            "data": serializer.data
        })
    
class ApproveAppointmentView(APIView):
    permission_classes = [IsAuthenticated , IsReceptionUser]
    
    def post(self, request, pk):
        user = request.user
        
        reception = user.reception_profile
        
        try:
            appointment = Appointment.objects.get(
                pk=pk,
                doctor=reception.doctors,
                status='pending'
            )
        except Appointment.DoesNotExist:
            return Response({
                "status": "error",
                "message": "نوبت یافت نشد یا قبلاً تایید/رد شده",
                "error": None,
                "data": None
            }, status=status.HTTP_404_NOT_FOUND)
        
        appointment.status = 'confirmed'
        appointment.save()
        
        return Response({
            "status": "success",
            "message": "نوبت با موفقیت تایید شد",
            "error": None,
            "data": {"appointmentId": appointment.id}
        })
    
class RejectAppointmentView(APIView):
    permission_classes = [IsAuthenticated , IsReceptionUser]
    
    def post(self, request, pk):
        user = request.user
        
        reception = user.reception_profile
        
        try:
            appointment = Appointment.objects.get(
                pk=pk,
                doctor=reception.doctors,
                status='pending'
            )
        except Appointment.DoesNotExist:
            return Response({
                "status": "error",
                "message": "نوبت یافت نشد",
                "error": None,
                "data": None
            }, status=status.HTTP_404_NOT_FOUND)
        
        appointment.status = 'cancelled'
        appointment.save()
        
        return Response({
            "status": "success",
            "message": "نوبت رد شد",
            "error": None,
            "data": {"appointmentId": appointment.id}
        })

class CreateScheduleView(APIView):
    permission_classes = [IsAuthenticated , IsReceptionUser]
    
    
    def post(self, request):
        user = request.user
        reception = user.reception_profile
        
        if not reception.doctors:
            return Response({
                "status": "error",
                "message": "شما به هیچ پزشکی متصل نیستید",
                "error": None,
                "data": None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        doctor = reception.doctors
        
        date_str = request.data.get('date')  
        start_time_str = request.data.get('start_time')  
        end_time_str = request.data.get('end_time')  

    
        try:
            year, month, day = map(int, date_str.split('/'))
            jalali = jdatetime.date(year, month, day)
            gregorian = jalali.togregorian()
            print(f"Shamsi: {date_str} → Gregorian: {gregorian}")
        except Exception as e:
            print(f"Date conversion error: {e}")
        
        if not date_str or not start_time_str or not end_time_str:
            return Response({
                "status": "error",
                "message": "تاریخ، ساعت شروع و پایان الزامی است",
                "error": None,
                "data": None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            start_time = datetime.strptime(start_time_str, '%H:%M').time()
            end_time = datetime.strptime(end_time_str, '%H:%M').time()
        except Exception:
            return Response({
                "status": "error",
                "message": "فرمت تاریخ یا ساعت نامعتبر",
                "error": None,
                "data": None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if start_time >= end_time:
            return Response({
                "status": "error",
                "message": "ساعت شروع باید قبل از پایان باشد",
                "error": None,
                "data": None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        schedule, created = Schedule.objects.update_or_create(
            doctor=doctor,
            date=gregorian,
            defaults={
                'start_time': start_time,
                'end_time': end_time,
                'is_active': True
            }
        )
        
        return Response({
            "status": "success",
            "message": "زمان کاری با موفقیت ثبت شد" if created else "زمان کاری بروزرسانی شد",
            "error": None,
            "data": {
                "scheduleId": schedule.id,
                "date": date_str,
                "startTime": start_time_str,
                "endTime": end_time_str
            }
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)