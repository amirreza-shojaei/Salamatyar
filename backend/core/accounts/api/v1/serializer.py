from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'phone'
    
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        
        full_name = user.phone
        if hasattr(user, 'first_name') and user.first_name:
            full_name = user.first_name
            if hasattr(user, 'last_name') and user.last_name:
                full_name = f"{user.first_name} {user.last_name}"
        
        data['user'] = {
            'id': user.id,
            'phone': user.phone,
            'full_name': full_name,
            'role': user.role,
            'is_doctor': user.role == 'doctor'
        }
        
        return data

