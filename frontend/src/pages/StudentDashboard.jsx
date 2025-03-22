import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "./StudentDashboard/Navigation";
import TestList from "./StudentDashboard/TestList";
import TestTaking from "./StudentDashboard/TestTaking";
import SubmissionsList from "./StudentDashboard/SubmissionsList";

export default function StudentDashboard() {
  const [tests, setTests] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("available-tests");

  useEffect(() => {
    fetchTests();
    fetchSubmissions();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/exams/student/tests/", {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}` },
      });
      setTests(response.data);
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  };

  // ✅ Fix: fetchSubmissions does NOT take parameters, uses state setter directly
  const fetchSubmissions = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/exams/student/submissions/", {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}` },
      });
      setSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "available-tests" && (
        selectedTest ? (
          <TestTaking 
            selectedTest={selectedTest} 
            setSelectedTest={setSelectedTest} 
            answers={answers} 
            setAnswers={setAnswers} 
            message={message} 
            setMessage={setMessage} 
            fetchSubmissions={fetchSubmissions} // ✅ Passed correctly
          />
        ) : (
          <TestList tests={tests} handleStartTest={setSelectedTest} />
        )
      )}

      {activeTab === "my-submissions" && <SubmissionsList submissions={submissions} />}
    </div>
  );
}
