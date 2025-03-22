import { useState } from "react";
import axios from "axios";

export default function SignupForm() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    role: "student",
    profile_picture: null,
  });
  const [message, setMessage] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setFormData({ ...formData, profile_picture: file });
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await axios.post("http://localhost:8000/api/users/signup/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Signup successful! You can now log in.");
      setFormData({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        role: "student",
        profile_picture: null,
      });
      setSelectedImage(null);
      console.log(response.data);
    } catch (error) {
      console.error("Signup error:", error.response?.data || error);
      setMessage("Signup failed. Check your input.");
    }
  };

  return (
    <form className="flex flex-col gap-3 transition-all" onSubmit={handleSubmit}>
      <input type="text" name="first_name" placeholder="First name" value={formData.first_name} onChange={handleChange} className="h-10 px-4 text-white bg-gray-900 border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-cyan-400" required />
      <input type="text" name="last_name" placeholder="Last name" value={formData.last_name} onChange={handleChange} className="h-10 px-4 text-white bg-gray-900 border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-cyan-400" required />
      <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="h-10 px-4 text-white bg-gray-900 border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-cyan-400" required />
      <input type="email" name="email" placeholder="Email address" value={formData.email} onChange={handleChange} className="h-10 px-4 text-white bg-gray-900 border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-cyan-400" required />
      <select name="role" value={formData.role} onChange={handleChange} className="h-10 px-4 text-white bg-gray-900 border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-cyan-400" required>
        <option value="student">Student</option>
        <option value="admin">Admin</option>
      </select>
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="h-10 px-4 text-gray-100 bg-gray-900 border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-cyan-400" required />
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-400">Upload Profile Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} className="file:bg-gray-700 file:border-none file:px-4 file:py-2 file:rounded-md file:text-white file:cursor-pointer" required />
      </div>
      <button type="submit" className="h-10 text-black bg-cyan-400 rounded-md hover:bg-cyan-500 transition-all duration-300">Signup</button>
      {message && <p className="text-center text-green-400 mt-2">{message}</p>}
      {selectedImage && (
        <div className="absolute right-[-400px] top-1/2 transform -translate-y-1/2 bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 animate-slide-in">
          <img src={selectedImage} alt="Uploaded Preview" className="w-60 h-60 object-cover rounded-lg border-4 border-cyan-400" />
        </div>
      )}
    </form>
  );
}
