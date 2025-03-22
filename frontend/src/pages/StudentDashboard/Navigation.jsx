export default function Navigation({ activeTab, setActiveTab }) {
    return (
      <nav className="flex justify-between bg-gray-800 p-4 w-full">
        <h1 className="text-xl font-bold">📚 Student Dashboard</h1>
        <div className="flex gap-4">
          <button onClick={() => setActiveTab("available-tests")} className="hover:text-cyan-400">
            📝 Available Tests
          </button>
          <button onClick={() => setActiveTab("my-submissions")} className="hover:text-cyan-400">
            📄 My Submissions
          </button>
        </div>
      </nav>
    );
  }
  