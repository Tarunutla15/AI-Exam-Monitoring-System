import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginForm() {
  const [faceFailed, setFaceFailed] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [capturedImage, setCapturedImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [movementDetected, setMovementDetected] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  let previousFrame = null;
  const navigate = useNavigate();

  // Email Validation Function
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
        detectMotion();
      }
    } catch (error) {
      setMessage("Error accessing the camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const detectMotion = () => {
    setInterval(() => {
      if (!videoRef.current || !canvasRef.current) return;
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

      let currentFrame = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height).data;
      if (previousFrame) {
        let diff = 0;
        for (let i = 0; i < currentFrame.length; i += 4) {
          diff += Math.abs(currentFrame[i] - previousFrame[i]);
        }
        setMovementDetected(diff > 500000);
      }
      previousFrame = currentFrame;
    }, 500);
  };

  const captureImage = () => {
    if (!movementDetected) {
      setMessage("Liveness not detected! Move slightly before capturing.");
      return;
    }
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasRef.current.toBlob((blob) => {
      setCapturedImage(blob);
      setImageURL(URL.createObjectURL(blob));
    }, "image/png");
    setFaceFailed(false);
  };

  const handleFaceVerification = async () => {
    if (!isValidEmail(email)) {
      setMessage("Enter a valid email for face verification.");
      return;
    }
    if (!capturedImage) {
      setMessage("No image captured. Please take a picture.");
      return;
    }
  
    setLoading(true);
    setMessage("");
  
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("image", capturedImage, "face.png");
  
      const response = await axios.post("http://localhost:8000/api/users/login/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      const user = response.data.user;
      console.log("📌 Storing User Role in sessionStorage:", user.role); // Debugging Log
  
      sessionStorage.setItem("accessToken", response.data.tokens.access);
      sessionStorage.setItem("refreshToken", response.data.tokens.refresh);
      sessionStorage.setItem("user", JSON.stringify(user)); // Store user object as a string
  
      console.log("✅ Stored User Data:", sessionStorage.getItem("user")); // Check if correctly stored
  
      setMessage("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      setMessage("Login failed.");
    } finally {
      setLoading(false);
    }
  };
  

  const handlePasswordLogin = async (event) => {
    event.preventDefault();
    if (!isValidEmail(email) || !password) {
      setMessage("Enter a valid email and password.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:8000/api/users/fallback_login/", { email, password });
      sessionStorage.setItem("accessToken", response.data.tokens.access);
      sessionStorage.setItem("refreshToken", response.data.tokens.refresh);
      sessionStorage.setItem("user", JSON.stringify(response.data.user)); 
      console.log(response.data.user)
      setMessage("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      setMessage("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4 transition-all">
      {!faceFailed ? (
        <>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="h-12 px-4 text-white bg-gray-900 border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-cyan-400"
            required 
          />
          <label className="text-sm text-gray-400">Take a picture for verification</label>
          <video ref={videoRef} autoPlay className="w-full h-40 rounded-md border border-gray-600"></video>
          <canvas ref={canvasRef} className="hidden"></canvas>

          <button type="button" onClick={startCamera} className="h-12 text-white bg-gray-700 rounded-md hover:bg-gray-600 transition-all duration-300">
            Start Camera
          </button>
          <button type="button" onClick={captureImage} className="h-12 text-white bg-cyan-400 rounded-md hover:bg-cyan-500 transition-all duration-300">
            Capture Image
          </button>
          <button 
            type="button" 
            onClick={handleFaceVerification} 
            disabled={!isValidEmail(email) || loading} 
            className={`h-12 text-white rounded-md transition-all duration-300 ${!isValidEmail(email) || loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
          >
            {loading ? "Verifying..." : "Verify Face"}
          </button>
        </>
      ) : (
        <>
          <input 
            type="email" 
            placeholder="Email address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="h-12 px-4 text-white bg-gray-900 border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-cyan-400"
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="h-12 px-4 text-white bg-gray-900 border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-cyan-400"
            required 
          />
          <button 
            type="submit" 
            onClick={handlePasswordLogin} 
            disabled={!isValidEmail(email) || !password || loading} 
            className={`h-12 text-white rounded-md transition-all duration-300 ${!isValidEmail(email) || !password || loading ? "bg-gray-500 cursor-not-allowed" : "bg-cyan-400 hover:bg-cyan-500"}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </>
      )}
        {imageURL && (
        <div className="absolute right-[-400px] top-1/2 transform -translate-y-1/2 bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 animate-slide-in">
          <img src={imageURL} alt="Uploaded Preview" className="w-60 h-60 object-cover rounded-lg border-4 border-cyan-400" />
        </div>
      )}
      {message && <p className="text-center text-green-400 mt-2">{message}</p>}
    </form>
  );
}
