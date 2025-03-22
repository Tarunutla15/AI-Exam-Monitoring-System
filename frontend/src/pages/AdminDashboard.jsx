// AdminDashboard.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "./AdminDashboard/Navigation";
import CreateTest from "./AdminDashboard/CreateTest";
import StudentList from "./AdminDashboard/StudentList";
import SubmissionsList from "./AdminDashboard/AdminSubmissionsList";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("create-test");
  const [submissions, setSubmissions] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);

  useEffect(() => {
    fetchAdminSubmissions();
    fetchStudents();
  }, []); 

  const fetchAdminSubmissions = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/exams/admin/submissions/", {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}` },
      });
      setSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };


  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/users/students/", {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}` },
      });
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex">
        {activeTab === "students" && <StudentList students={students} setSelectedStudent={setSelectedStudent} />}
        <div className="flex-1 p-6">
          {activeTab === "create-test" && <CreateTest />}
          {activeTab === "submissions" && (
            <SubmissionsList 
              submissions={submissions} 
              fetchAdminSubmissions={fetchAdminSubmissions}  // ✅ Pass the function
              selectedTest={selectedTest} 
              setSelectedTest={setSelectedTest} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
