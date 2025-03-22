import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./pages/AuthForm"; // Import your auth form
import Dashboard from "./pages/Dasboard";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />  {/* Default route -> Signup/Login Page */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Example dashboard */}
        <Route path='/admin-dashboard'  element={<AdminDashboard />} />
        <Route path='/student-dashboard'  element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
}
