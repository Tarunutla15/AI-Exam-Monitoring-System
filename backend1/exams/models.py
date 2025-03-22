from django.conf import settings
from django.db import models

class Test(models.Model):
    title = models.CharField(max_length=255)
    questions = models.JSONField(null=False,default=None)  # Store questions in JSON format
    duration = models.IntegerField()  # Test duration in minutes
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

class AssignedTest(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    assigned_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[("Pending", "Pending"), ("Completed", "Completed")],
        default="Pending",
    )

class TestSubmission(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    answers = models.JSONField(default=None)  # Store answers in JSON format
    submitted_at = models.DateTimeField(auto_now_add=True)
    STATUS_CHOICES = [("Pending", "Pending"), ("Accepted", "Accepted"), ("Rejected", "Rejected")]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="Pending")  # ✅ NEW FIELD

    def __str__(self):
        return f"{self.student.username} - {self.test.title}"
