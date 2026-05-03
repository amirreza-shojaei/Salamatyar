from rest_framework.permissions import BasePermission

class IsReceptionUser(BasePermission):
    def has_permission(self, request, view):
        print(f"User: {request.user.phone}")
        print(f"Authenticated: {request.user.is_authenticated}")
        print(f"Has profile: {hasattr(request.user, 'reception_profile')}")
        return (
            request.user.is_authenticated and 
            hasattr(request.user, 'reception_profile')
        )