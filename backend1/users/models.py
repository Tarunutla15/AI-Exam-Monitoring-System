from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.hashers import make_password

class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('admin', 'Admin'),
    )

    first_name = models.CharField(max_length=50, null=True, blank=True)
    last_name = models.CharField(max_length=50, null=True, blank=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # Hashed password
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    profile_picture = models.ImageField(upload_to="profile_pictures/", null=True, blank=True)
    face_encodings = models.JSONField(null=True, blank=True)  # Stores face encodings as JSON (list)

    def save(self, *args, **kwargs):
        """Ensure password is hashed only when creating a new user"""
        if not self.password.startswith("pbkdf2_"):  # Avoid rehashing
            self.set_password(self.password)
        super().save(*args, **kwargs)


    def set_password(self, raw_password):
        """Hashes the password before saving"""
        self.password = make_password(raw_password)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.role})"
