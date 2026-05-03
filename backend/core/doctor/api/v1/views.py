# doctors/views.py
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from ...models import Doctor
from appointments.models import Appointment
from .serializer import DoctorListSerializer , ApprovedAppointmentSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

class DoctorListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = DoctorListSerializer
    
    def get_queryset(self):
        return Doctor.objects.all().select_related(
            'user', 'specialty'
        ).prefetch_related(
            'schedules', 'appointments'
        )
    
    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)

            return Response({
                "status": "success",
                "message": "لیست پزشکان",
                "error": None,
                "data": serializer.data
            })
        except Exception as e:
            return Response({
                "status": "error",
                "message": "خطا در دریافت لیست پزشکان",
                "error": e,
                "data": []
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


class DoctorDashbord(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ApprovedAppointmentSerializer
    
    def get_queryset(self):
        if self.request.user.role != 'doctor':
            return Appointment.objects.none()
        
        if not hasattr(self.request.user, 'doctor_profile'):
            return Appointment.objects.none()

        doctor = self.request.user.doctor_profile
        
        return Appointment.objects.filter(
            doctor=doctor,
            status='confirmed'
        ).order_by('-date', '-time')
    
    def list(self, request, *args, **kwargs):
        if request.user.role != 'doctor':
            return Response({
                "status": "error",
                "message": "دسترسی غیرمجاز - فقط پزشکان می‌توانند نوبت‌ها را مشاهده کنند",
                "error": "Access denied",
                "data": None
            }, status=status.HTTP_403_FORBIDDEN)
        
        if not hasattr(request.user, 'doctor_profile'):
            return Response({
                "status": "error",
                "message": "پروفایل پزشک یافت نشد",
                "error": "Doctor profile not found",
                "data": None
            }, status=status.HTTP_404_NOT_FOUND)
        
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        return Response({
            "status": "success",
            "message": "لیست نوبت‌های تأیید شده",
            "error": None,
            "data": serializer.data
        }, status=status.HTTP_200_OK)