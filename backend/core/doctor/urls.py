from django.urls import path , include
from . import views

urlpatterns = [
    path('api/v1/', include('doctor.api.v1.urls')),
]