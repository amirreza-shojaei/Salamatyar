from django.urls import path
from . import views

urlpatterns = [
    path('doctors_list/', views.DoctorListView.as_view(), name='doctor-list'),
    path('doctor_dashbord/', views.DoctorDashbord.as_view(), name='doctor-list'),

]