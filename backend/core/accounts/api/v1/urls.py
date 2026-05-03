from django.urls import path , include
from . import views
from rest_framework_simplejwt.views import TokenRefreshView , TokenObtainPairView
from rest_framework_simplejwt.serializers import *

urlpatterns = [
    path("jwt/create/" ,views.CustomTokenObtainPairView.as_view() , name="jwt-create" ),
    path("jwt/refresh/" , TokenRefreshView.as_view() , name="jwt-refresh"),
    path('', include("django.contrib.auth.urls")),
]