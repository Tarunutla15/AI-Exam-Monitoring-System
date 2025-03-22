import { useState } from "react";
import axios from "axios";

export default function CreateTest() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([""]);
  const [duration, setDuration] = useState("");
  const [message, setMessage] = useState("");

  const handleAddQuestion = () => setQuestions([...questions, ""]);

  const handleChangeQuestion = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const handleSendTest = async () => {
    if (!title || questions.some((q) => q.trim() === "") || !duration) {
      setMessage("❌ Please fill all fields.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/api/exams/admin/create-test/",
        { title, questions, duration: parseInt(duration) },
        { headers: { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}` } }
      );

      setMessage("✅ Test sent to students successfully!");
      setTitle("");
      setQuestions([""]);
      setDuration("");
    } catch (error) {
      setMessage("❌ Failed to create test.");
      console.error("Error:", error.response);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 w-96">
      <h2 className="text-xl font-semibold mb-2">📝 Create a Test</h2>
      <input
        type="text"
        placeholder="Test Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-2 bg-gray-700 text-white rounded-md"
      />

      {questions.map((question, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Question ${index + 1}`}
          value={question}
          onChange={(e) => handleChangeQuestion(index, e.target.value)}
          className="w-full p-2 mb-2 bg-gray-700 text-white rounded-md"
        />
      ))}

      <button onClick={handleAddQuestion} className="w-full bg-blue-500 p-2 rounded-md mb-2">
        ➕ Add Question
      </button>

      <input
        type="number"
        placeholder="Test Duration (minutes)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="w-full p-2 mb-2 bg-gray-700 text-white rounded-md"
      />

      <button onClick={handleSendTest} className="w-full bg-green-500 p-2 rounded-md">
        📤 Send Test
      </button>

      {message && <p className="text-center mt-2">{message}</p>}
    </div>
  );
}
