import { useState } from "react";
import axios from "axios";

export default function AdminSubmissionsList({ submissions, fetchAdminSubmissions }) {
  const [loading, setLoading] = useState(false);
  const [editingSubmissionId, setEditingSubmissionId] = useState(null);

  const updateStatus = async (submissionId, newStatus) => {
    setLoading(true);
    try {
      await axios.patch(
        "http://localhost:8000/api/exams/admin/submissions/",  // ✅ Remove submissionId from the URL
        { submission_id: submissionId, status: newStatus },    // ✅ Send ID in request body
        { headers: { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}` } }
      );
      fetchAdminSubmissions();
      setEditingSubmissionId(null);
    } catch (error) {
      console.error("Error updating status:", error);
    }
    setLoading(false);
  };

  // ✅ Sorting submissions by most recent first
  const sortedSubmissions = [...submissions].sort(
    (a, b) => new Date(b.submitted_at) - new Date(a.submitted_at)
  );

  // ✅ Separate Approved vs Non-Accepted (Pending & Rejected) submissions
  const acceptedSubmissions = sortedSubmissions.filter((s) => s.status === "Accepted");
  const pendingOrRejectedSubmissions = sortedSubmissions.filter((s) => s.status !== "Accepted");

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      {/* ✅ Left Column - Pending & Rejected */}
      <div className="flex-1 bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">⏳ Pending / ❌ Rejected Submissions</h2>
        <div className="space-y-4">
          {pendingOrRejectedSubmissions.length > 0 ? (
            pendingOrRejectedSubmissions.map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                editingSubmissionId={editingSubmissionId}
                setEditingSubmissionId={setEditingSubmissionId}
                updateStatus={updateStatus}
                loading={loading}
              />
            ))
          ) : (
            <p className="text-gray-400">No pending or rejected submissions.</p>
          )}
        </div>
      </div>

      {/* ✅ Right Column - Approved Submissions */}
      <div className="flex-1 bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-green-400 mb-4">✅ Approved Submissions</h2>
        <div className="space-y-4">
          {acceptedSubmissions.length > 0 ? (
            acceptedSubmissions.map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                editingSubmissionId={editingSubmissionId}
                setEditingSubmissionId={setEditingSubmissionId}
                updateStatus={updateStatus}
                loading={loading}
              />
            ))
          ) : (
            <p className="text-gray-400">No accepted submissions yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ✅ Reusable Submission Card Component
function SubmissionCard({ submission, editingSubmissionId, setEditingSubmissionId, updateStatus, loading }) {
  return (
    <div className="bg-gray-800 p-5 rounded-lg shadow-lg border border-gray-700 w-72 md:w-80 max-w-sm">
      <h2 className="text-md font-semibold text-cyan-300">
        {submission.student?.username || "Unknown Student"}
      </h2>
      <h3 className="text-lg font-semibold">{submission.test?.title || "Untitled Test"}</h3>
      <p className={`text-sm font-bold ${submission.status === "Accepted" ? "text-green-400" : "text-red-400"}`}>
        Status: {submission.status || "Pending"}
      </p>
      <p className="text-xs text-gray-400">
        Submitted At: {submission.submitted_at ? new Date(submission.submitted_at).toLocaleString() : "N/A"}
      </p>

      <details className="mt-2">
        <summary className="cursor-pointer text-cyan-400 text-sm">View Answers</summary>
        <div className="bg-gray-700 p-3 rounded-md mt-2">
          {submission.answers && typeof submission.answers === "object" ? (
            Object.entries(submission.answers).map(([question, answer], index) => (
              <div key={index} className="mb-2">
                <p className="text-white font-semibold text-sm">Q{question}:</p>
                {typeof answer === "string" ? (
                  <p className="text-gray-300 text-sm">{answer}</p>
                ) : (
                  <a href={answer} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline text-sm">
                    View File
                  </a>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No answers provided.</p>
          )}
        </div>
      </details>

      {/* Edit Button */}
      {editingSubmissionId !== submission.id && (
        <button
          className="bg-yellow-500 px-4 py-2 text-sm rounded hover:bg-yellow-600 mt-3 w-full"
          onClick={() => setEditingSubmissionId(submission.id)}
        >
          ✏️ Edit Status
        </button>
      )}

      {/* Approve/Reject Buttons */}
      {editingSubmissionId === submission.id && (
        <div className="flex justify-between gap-3 mt-3">
          <button 
            className="bg-green-500 px-4 py-2 text-sm rounded hover:bg-green-600 flex-1"
            onClick={() => updateStatus(submission.id, "Accepted")}
            disabled={loading}
          >
            ✅ Approve
          </button>

          <button 
            className="bg-red-500 px-4 py-2 text-sm rounded hover:bg-red-600 flex-1"
            onClick={() => updateStatus(submission.id, "Rejected")}
            disabled={loading}
          >
            ❌ Reject
          </button>
        </div>
      )}
    </div>
  );
}

