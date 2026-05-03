# appointments/models.py
from django.db import models
from doctor.models import Doctor
from django.core.validators import RegexValidator

class Appointment(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments', verbose_name="دکتر")
    
    patient_first_name = models.CharField(max_length=100, verbose_name="نام بیمار")
    patient_last_name = models.CharField(max_length=100 , verbose_name="نام خانوادگی بیمار")
    phone_regex = RegexValidator(
        regex=r'^09\d{9}$',
        message="شماره موبایل باید 11 رقم و با 09 شروع شود"
    )
    patient_phone = models.CharField(max_length=11,validators=[phone_regex] , verbose_name="شماره تلفن بیمار")
    patient_national_code = models.CharField(max_length=10, blank=True, null=True , verbose_name="کدملی بیمار")
    
    date = models.DateField(verbose_name="تاریخ نوبت")
    time = models.TimeField(verbose_name="ساعت نوبت")
    
    problem = models.TextField(blank=True,verbose_name="بیماری و مشکلات")
    
    STATUS_CHOICES = [
        ('pending', 'در انتظار'),
        ('confirmed', 'تایید شده'),
        ('cancelled', 'لغو شده'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending' ,verbose_name="وضعیت")
    created_date = models.DateTimeField(auto_now_add=True,verbose_name="تاریخ ثبت")

    class Meta:
        verbose_name = "نوبت"
        verbose_name_plural = "نوبت ها"

    def __str__(self):
        return f"{self.patient_first_name} - دکتر {self.doctor.user.first_name} - {self.date} {self.time}"