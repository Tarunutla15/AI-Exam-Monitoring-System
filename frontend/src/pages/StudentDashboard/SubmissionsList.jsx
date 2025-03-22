export default function SubmissionsList({ submissions }) {
    return (
      <div>
        <h2 className="text-xl font-semibold">📄 My Test Submissions</h2>
        {submissions.length > 0 ? (
          submissions.map((submission) => (
            <div key={submission.id} className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 w-96 mb-4">
              <h2 className="text-xl font-semibold">{submission.test.title}</h2>
              <p className={`text-lg font-bold ${submission.status === "Accepted" ? "text-green-400" : "text-red-400"}`}>
                Status: {submission.status}
              </p>
              <p className="text-gray-400">Submitted At: {new Date(submission.submitted_at).toLocaleString()}</p>
  
              <details className="mt-2">
                <summary className="cursor-pointer text-cyan-400">View Answers</summary>
                <div className="bg-gray-700 p-2 rounded-md mt-2">
                  {Object.entries(submission.answers).map(([question, answer], index) => (
                    <div key={index} className="mb-2">
                      <p className="text-white font-semibold">Q{question}:</p>
                      {typeof answer === "string" ? (
                        <p className="text-gray-300">{answer}</p>
                      ) : (
                        <a href={answer} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                          View File
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </details>
            </div>
          ))
        ) : (
          <p>No test submissions yet.</p>
        )}
      </div>
    );
  }
  