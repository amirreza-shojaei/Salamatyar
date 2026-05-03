# appointments/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from ...models import Appointment
from .serializer import CreateAppointmentSerializer

class AppointmentCreateView(generics.CreateAPIView):
    """
    POST /api/appointments/
    ثبت نوبت جدید توسط بیمار
    """
    permission_classes = [AllowAny]  # بدون نیاز به لاگین
    serializer_class = CreateAppointmentSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            appointment = serializer.save()
            
            return Response({
                "status": "success",
                "message": "نوبت با موفقیت ثبت شد",
                "error": None,
                "data": {
                    "appointmentId": appointment.id
                }
            }, status=status.HTTP_201_CREATED)
        

        return Response({
            "status": "error",
            "message": "خطا در ثبت نوبت",
            #"error": errors,
            "data": None
        }, status=status.HTTP_400_BAD_REQUEST)