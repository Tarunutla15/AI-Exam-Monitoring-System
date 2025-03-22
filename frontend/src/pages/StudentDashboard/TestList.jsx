export default function TestList({ tests, handleStartTest }) {
    return (
      <div>
        <h2 className="text-xl font-semibold">📝 Available Tests</h2>
        {tests.length > 0 ? (
          tests.map((test) => (
            <div key={test.id} className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 w-96 mb-4">
              <h2 className="text-xl font-semibold">{test.test.title}</h2>
              <p className="text-gray-400">Duration: {test.test.duration} min</p>
              <button onClick={() => handleStartTest(test)} className="w-full bg-blue-500 p-2 rounded-md mt-2">
                📝 Start Test
              </button>
            </div>
          ))
        ) : (
          <p>No tests available.</p>
        )}
      </div>
    );
  }
  