from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import TestSerializer, AssignedTestSerializer
from django.conf import settings  # ✅ ADD this
from .models import Test, AssignedTest,TestSubmission
from django.apps import apps
User = apps.get_model(settings.AUTH_USER_MODEL)  # ✅ Get the custom user model



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_test(request):
    if request.user.role != "admin":
        return Response({"error": "Unauthorized"}, status=403)

    data = request.data
    test = Test.objects.create(
        title=data["title"],
        questions=data["questions"],
        duration=data["duration"],
        created_by=request.user
    )

    # ✅ Fetch the correct User model dynamically
    User = apps.get_model(settings.AUTH_USER_MODEL)  
    students = User.objects.filter(role="student")  # ✅ Now it will work

    for student in students:
        AssignedTest.objects.create(test=test, student=student)

    return Response({"message": "Test created and assigned!", "test_id": test.id})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_assigned_tests(request):
    if request.user.role != "student":
        return Response({"error": "Unauthorized"}, status=403)

    assigned_tests = AssignedTest.objects.filter(student=request.user, status="Pending")
    return Response(AssignedTestSerializer(assigned_tests, many=True).data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_test(request, test_id):
    if request.user.role != "student":
        return Response({"error": "Unauthorized"}, status=403)

    try:
        assigned_test = AssignedTest.objects.get(test_id=test_id, student=request.user, status="Pending")
        assigned_test.status = "Completed"
        assigned_test.save()

        TestSubmission.objects.create(
            test=assigned_test.test,
            student=request.user,
            answers=request.data.get("answers", {})  # Store answers as JSON
        )

        return Response({"message": "✅ Test submitted successfully!"})
    except AssignedTest.DoesNotExist:
        return Response({"error": "❌ No assigned test found or already submitted."}, status=404)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import TestSubmission

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_submission_status(request, submission_id):
    if request.user.role != "admin":
        return Response({"error": "Unauthorized"}, status=403)

    try:
        submission = TestSubmission.objects.get(id=submission_id)
        new_status = request.data.get("status")  # "Accepted" or "Rejected"

        if new_status not in ["Accepted", "Rejected"]:
            return Response({"error": "Invalid status"}, status=400)

        submission.status = new_status
        submission.save()

        return Response({"message": f"✅ Submission {new_status} successfully!"})
    except TestSubmission.DoesNotExist:
        return Response({"error": "Submission not found"}, status=404)

from django.shortcuts import get_object_or_404
@api_view(["GET", "PATCH"])  # ✅ Allow PATCH requests
@permission_classes([IsAuthenticated])
def get_test_submissions(request):
    if request.method == "GET":
        if request.user.role != "admin":
            return Response({"error": "Unauthorized"}, status=403)

        submissions = TestSubmission.objects.all().order_by("-submitted_at")  # ✅ Show most recent first
        data = [
            {
                "id": submission.id,
                "test": {"id": submission.test.id, "title": submission.test.title},
                "student": {"id": submission.student.id, "username": submission.student.username},
                "answers": submission.answers,
                "submitted_at": submission.submitted_at,
                "status": submission.status,
            }
            for submission in submissions
        ]
        return Response(data)

    elif request.method == "PATCH":
        if request.user.role != "admin":
            return Response({"error": "Unauthorized"}, status=403)

        submission_id = request.data.get("submission_id")
        new_status = request.data.get("status")

        if not submission_id or not new_status:
            return Response({"error": "Missing submission ID or status"}, status=400)

        submission = get_object_or_404(TestSubmission, id=submission_id)
        submission.status = new_status
        submission.save()

        return Response({"message": "Submission status updated successfully!"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_student_submissions(request):
    """Retrieve all test submissions for the logged-in student"""
    if request.user.role != "student":
        return Response({"error": "Unauthorized"}, status=403)

    submissions = TestSubmission.objects.filter(student=request.user).select_related("test").order_by("-submitted_at")

    response_data = [
        {
            "id": submission.id,
            "test": {
                "id": submission.test.id,
                "title": submission.test.title,  # ✅ Now correctly nested
            },
            "answers": submission.answers,
            "status": submission.status,
            "submitted_at": submission.submitted_at,
        }
        for submission in submissions
    ]

    return Response(response_data)