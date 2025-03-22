from django.urls import path
from .views import register_user, login_user, fallback_login,get_students
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

urlpatterns = [
    path('signup/', register_user, name='signup'),
    path('login/', login_user, name='login'), 
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # ✅ Refresh token
    path('verify/', TokenVerifyView.as_view(), name='token_verify'),  # ✅ Verify token validity
    path('fallback_login/', fallback_login, name='fallback_login'),
    path("students/", get_students),
]
