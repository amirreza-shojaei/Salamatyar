from django.db import models
from accounts.models import User

# Create your models here.
# reception/models.py
class Reception(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='reception_profile')
    work_phone = models.CharField(max_length=11, blank=True, null=True)

    doctors = models.OneToOneField(
        'doctor.Doctor',
        blank=True,
        null=True,
        related_name='receptionists',
        verbose_name="پزشکان تحت پوشش",
        on_delete=models.CASCADE
    )
    
    is_active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "منشی"
        verbose_name_plural = "منشی‌ها"
    
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - منشی"