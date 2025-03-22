from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, UserSerializer, LoginSerializer
from .models import User
from django.contrib.auth.hashers import check_password
import numpy as np
import cv2
import json
import face_recognition

@csrf_exempt  
@api_view(["POST"])
@permission_classes([AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({"message": "User registered successfully!", "user": UserSerializer(user).data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

FAILED_ATTEMPTS = {}

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token)
    }

@api_view(["POST"])
def login_user(request):
    global FAILED_ATTEMPTS
    
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({"error": "Invalid input"}, status=400)
    
    email = serializer.validated_data["email"]
    image = request.FILES.get("image")
    
    try:
        user = User.objects.get(email=email)
        user_data = {
            "user_id":user.id,
            "username":user.username,
            "email":user.email,
            "role":user.role
        }
        FAILED_ATTEMPTS[email] = FAILED_ATTEMPTS.get(email, 0)
        
        if image:
            image_array = np.frombuffer(image.read(), np.uint8)
            img = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
            
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
            if laplacian_var < 50:
                FAILED_ATTEMPTS[email] += 1
                return Response({"error": "Liveness check failed! Move your face."}, status=400)
            
            encodings = face_recognition.face_encodings(img)
            if not encodings:
                FAILED_ATTEMPTS[email] += 1
                return Response({"error": "No face detected. Try again."}, status=400)
            
            stored_encodings = json.loads(user.face_encodings) if isinstance(user.face_encodings, str) else user.face_encodings
            matches = face_recognition.compare_faces([stored_encodings], encodings[0])
            face_distance = face_recognition.face_distance([np.array(stored_encodings)], encodings[0])
            
            if True in matches and face_distance[0] < 0.45:
                FAILED_ATTEMPTS[email] = 0
                tokens = get_tokens_for_user(user)
                return Response({"message": "Login successful!", "tokens": tokens,"user":user_data}, status=200)
            else:
                FAILED_ATTEMPTS[email] += 1
                return Response({"error": "Face match failed."}, status=400)
        else:
            return Response({"error": "No image uploaded."}, status=400)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

@api_view(["POST"])
def fallback_login(request):
    global FAILED_ATTEMPTS
    
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({"error": "Invalid input"}, status=400)
    
    email = serializer.validated_data["email"]
    password = serializer.validated_data["password"]
    
    try:
        user = User.objects.get(email=email)
        user_data = {
            "user_id":user.id,
            "username":user.username,
            "email":user.email,
            "role":user.role
        }
        if check_password(password, user.password):
            FAILED_ATTEMPTS[email] = 0
            tokens = get_tokens_for_user(user)
            return Response({"message": "Login successful via email & password!", "tokens": tokens,"user":user_data}, status=200)
        else:
            return Response({"error": "Invalid email or password."}, status=401)
    except User.DoesNotExist:
        return Response({"error": "User does not exist."}, status=404)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_user(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "Logout successful!"}, status=200)
    except Exception as e:
        return Response({"error": "Invalid token."}, status=400)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_students(request):
    """Retrieve all students (Only for Admin)"""
    if request.user.role != "admin":
        return Response({"error": "Unauthorized"}, status=403)

    students = User.objects.filter(role="student").values("id", "username", "email", "role")
    
    return Response(list(students))