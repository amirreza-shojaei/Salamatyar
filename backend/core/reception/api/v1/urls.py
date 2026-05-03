from django.urls import path
from . import views


urlpatterns = [
    path('pending-appointments/', views.MyDoctorsPendingAppointmentsView.as_view(), name='pending-appointments'),
        path('pending-appointments/<int:pk>/approve/', views.ApproveAppointmentView.as_view(), name='approve-appointment'),
        path('pending-appointments/<int:pk>/reject/', views.RejectAppointmentView.as_view(), name='reject-appointment'),
        path('schedules/create/', views.CreateScheduleView.as_view(), name='create-schedule')
]