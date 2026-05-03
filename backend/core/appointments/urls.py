from django.urls import path , include
from . import views

urlpatterns = [
    path('api/v1/' , include("appointments.api.v1.urls"))
   
]