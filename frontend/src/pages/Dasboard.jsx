import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🚀 Dashboard useEffect running...");

    try {
      const storedUser = sessionStorage.getItem("user");

      if (storedUser) {
        console.log("📌 Raw user data from sessionStorage:", storedUser); // Debugging
        const user = JSON.parse(storedUser);

        console.log("✅ User Role Retrieved:", user.role); // Confirm role

        // Convert role to lowercase for case consistency
        const userRole = user.role.toLowerCase();

        if (userRole === "admin") {
          console.log("➡️ Navigating to /admin-dashboard...");
          navigate("/admin-dashboard", { replace: true });
        } else if (userRole === "student") {
          console.log("➡️ Navigating to /student-dashboard...");
          navigate("/student-dashboard", { replace: true });
        } else {
          console.error("❌ Unknown role detected:", user.role);
          navigate("/login", { replace: true });
        }
      } else {
        console.error("⚠️ No user data found in sessionStorage.");
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error("🚨 Error parsing user data:", error);
      sessionStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return <p>Redirecting...</p>;
}
