from django.urls import path
from .views import create_test, get_assigned_tests, submit_test,get_test_submissions,update_submission_status,get_student_submissions

urlpatterns = [
    path("admin/create-test/", create_test),
    path("student/tests/", get_assigned_tests),
    path("student/tests/<int:test_id>/submit/", submit_test),  
    path("admin/submissions/", get_test_submissions, name="get_test_submissions"),
    path("admin/submissions/<int:submission_id>/update/", update_submission_status),
    path("student/submissions/", get_student_submissions),
]

