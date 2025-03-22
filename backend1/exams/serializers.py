from rest_framework import serializers
from .models import Test, AssignedTest

class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = "__all__"  # Include all fields

class AssignedTestSerializer(serializers.ModelSerializer):
    test = TestSerializer(read_only=True)  # Include test details in the response

    class Meta:
        model = AssignedTest
        fields = "__all__"
