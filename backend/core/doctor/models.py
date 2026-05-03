from django.db import models
from accounts.models import User

# Create your models here.

class Specialty(models.Model):
    name = models.CharField(max_length=100,default="عمومی",verbose_name="تخصص")

    class Meta:
        verbose_name = "تخصص"
        verbose_name_plural = "تخصص‌ها"
    
    def __str__(self):
        return self.name


class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE,related_name='doctor_profile')
    specialty = models.ForeignKey(Specialty,on_delete=models.SET_NULL,null=True,blank=True,verbose_name="تخصص")
    medical_license = models.CharField(max_length=50 , unique=True,verbose_name="کد نظام پزشکی")
    description = models.TextField(blank=True , verbose_name="توضیحات")
    picture = models.ImageField(blank=True , null=True) 
    created_date = models.DateTimeField(auto_now_add=True,verbose_name="تاریخ ثبت")
    updated_date = models.DateTimeField(auto_now=True,verbose_name="تاریخ بروزرسانی")

    class Meta:
        verbose_name = "پزشک"
        verbose_name_plural = "پزشکان"

    def __str__(self):
        return self.user.first_name + " " +self.user.last_name + " " +self.specialty.name
    
class Schedule(models.Model):
    date = models.DateField(verbose_name="تاریخ")
    start_time = models.TimeField(verbose_name="ساعت شروع")
    end_time = models.TimeField(verbose_name="ساعت پایان")
    is_active = models.BooleanField(verbose_name="فعال")
    doctor = models.ForeignKey('Doctor', on_delete=models.CASCADE , verbose_name="دکتر" , related_name='schedules') 

    class Meta:
        verbose_name = "بازه زمانی"
        verbose_name_plural = "بازه‌های زمانی"
        unique_together = ['doctor', 'date', 'start_time']

    def __str__(self):
        return f"{self.doctor} - {self.date} ({self.start_time} تا {self.end_time})"
    
