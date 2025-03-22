import numpy as np
import cv2
import face_recognition
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "role", "profile_picture"]

class RegisterSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ["first_name", "last_name", "username", "email", "password", "role", "profile_picture"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        profile_picture = validated_data.pop("profile_picture", None)
        password = validated_data.pop("password")

        user = User(**validated_data)
        user.set_password(password)  # ✅ Only hash once here

        # ✅ Handle profile picture & face encoding
        if profile_picture:
            encoding_vector = self.get_face_encoding(profile_picture)
            user.face_encodings = encoding_vector.tolist()
            user.profile_picture = profile_picture

        user.save()
        return user



    def get_face_encoding(self, image_file):
        """Extracts face encoding from uploaded image"""
        image_bytes = np.frombuffer(image_file.read(), np.uint8)
        image = cv2.imdecode(image_bytes, cv2.IMREAD_COLOR)

        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        encodings = face_recognition.face_encodings(rgb_image)

        if not encodings:
            raise serializers.ValidationError("No face detected in the uploaded image.")
        return encodings[0]
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=False)