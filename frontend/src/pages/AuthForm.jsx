import { useState } from "react";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";

export default function AuthComponent() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black to-gray-900 relative">
      <div className="relative h-max w-[400px] p-8 bg-opacity-70 bg-gray-800 backdrop-blur-l rounded-xl shadow-lg border border-gray-700 text-white transition-all duration-500">
        {/* Toggle Headers */}
        <div className="flex justify-center gap-10 mb-6">
          <h2
            className={`text-xl font-semibold cursor-pointer transition-all ${
              isLogin ? "text-gray-500" : "text-cyan-400 border-b-2 border-cyan-400"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Signup
          </h2>
          <h2
            className={`text-xl font-semibold cursor-pointer transition-all ${
              isLogin ? "text-cyan-400 border-b-2 border-cyan-400" : "text-gray-500"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </h2>
        </div>

        {/* Conditional Rendering for Signup or Login */}
        {isLogin ? <LoginForm /> : <SignupForm />}
      </div>
    </div>
  );
}
