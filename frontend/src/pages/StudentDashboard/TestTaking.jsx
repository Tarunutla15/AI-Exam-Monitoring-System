import { useState } from "react";
import axios from "axios";

export default function TestTaking({ selectedTest, setSelectedTest, answers, setAnswers, message, setMessage, fetchSubmissions }) {
  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers((prev) => ({ ...prev, [questionIndex + 1]: answer }));
  };

  const handleFileUpload = (questionIndex, file) => {
    setAnswers((prev) => ({ ...prev, [questionIndex + 1]: file }));
  };

  const handleSubmitTest = async () => {
    try {
      const formData = new FormData();
      formData.append("answers", JSON.stringify(answers));

      await axios.post(
        `http://localhost:8000/api/exams/student/tests/${selectedTest.test.id}/submit/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("✅ Test submitted successfully!");
      setSelectedTest(null);
      fetchSubmissions();
    } catch (error) {
      setMessage("❌ Failed to submit test.");
      console.error("Error submitting test:", error);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 w-96">
      <h2 className="text-xl font-semibold">{selectedTest.test.title}</h2>
      <p className="text-gray-400">Duration: {selectedTest.test.duration} min</p>

      {selectedTest.test.questions.map((question, index) => (
        <div key={index} className="mt-4">
          <p className="text-lg">{question.content}</p>
          {question.type === "text" ? (
            <input
              type="text"
              placeholder="Your answer"
              value={answers[index + 1] || ""}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              className="w-full p-2 mt-1 bg-gray-700 text-white rounded-md"
            />
          ) : (
            <input
              type="file"
              accept={question.type === "pdf" ? "application/pdf" : "image/*"}
              onChange={(e) => handleFileUpload(index, e.target.files[0])}
              className="w-full p-2 bg-gray-700 text-white rounded-md"
            />
          )}
        </div>
      ))}

      <button onClick={handleSubmitTest} className="w-full bg-green-500 p-2 rounded-md mt-4">
        📝 Submit Test
      </button>
      {message && <p className="text-center mt-2">{message}</p>}
    </div>
  );
}
