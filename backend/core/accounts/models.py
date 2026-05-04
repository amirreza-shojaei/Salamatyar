from django.db import models
from django.contrib.auth.models import (PermissionsMixin , AbstractBaseUser , BaseUserManager)  
from django.utils.translation import gettext as _
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.validators import RegexValidator

# Create your models here.

class UserManager(BaseUserManager):
    def create_user(self , phone , password , **extra_fiels):
        if not phone:
            raise ValueError(_("the phone must be set"))
        user = self.model(phone=phone, **extra_fiels)
        user.set_password(password)
        user.save()
        return user
    def create_superuser(self,phone ,password, **extra_fields):
        extra_fields.setdefault('is_staff' , True)
        extra_fields.setdefault('is_active' , True)
        extra_fields.setdefault('is_superuser' , True)

        if not extra_fields.get('is_staff'):
            raise ValueError(_("superuser must be is_staff=True"))
        if not extra_fields.get('is_active'):
            raise ValueError(_("superuser must be is_active=True"))
        if not extra_fields.get('is_superuser'):
            raise ValueError(_("superuser must be is_superuser=True"))
        
        return self.create_user(phone , password , **extra_fields)

class User(AbstractBaseUser , PermissionsMixin):
    phone_regex = RegexValidator(
        regex=r'^09\d{9}$',
        message="شماره موبایل باید 11 رقم و با 09 شروع شود"
    )
    phone = models.CharField(max_length=11,unique=True,validators=[phone_regex],verbose_name="شماره تلفن")
    first_name = models.CharField(max_length=255, verbose_name="نام")
    last_name = models.CharField(max_length=255,  verbose_name="نام خانوادگی")
    ROLE_CHOICES = [
        ('admin' , "ادمین"),
        ('doctor', 'پزشک'),
        ('secretary', 'منشی'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='doctor', verbose_name="نقش")
    is_doctor = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)

    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = []
    
    created_date = models.DateTimeField(auto_now_add=True , verbose_name="تاریخ ساخت")
    updated_date = models.DateTimeField(auto_now=True,verbose_name="تاریخ آپدیت")
    pub_date = models.DateTimeField(auto_now=True)

    objects = UserManager()

    class Meta:
        verbose_name = "کاربر"
        verbose_name_plural = "کاربران"

    def __str__(self):
        return self.phone
@receiver(post_save , sender=User)
def save_doctor_profile(sender , instance , created ,**kwargs):
    if created and instance.role == 'doctor'and instance.is_active:
        from doctor.models import Doctor, Specialty
        general_specialty, _ = Specialty.objects.get_or_create(name="عمومی")
        Doctor.objects.create(user=instance,specialty=general_specialty,medical_license=f"TEMP_{instance.phone}")
    elif created and instance.role == 'secretary'and instance.is_active:
        from reception.models import Reception
        Reception.objects.get_or_create(user=instance)
