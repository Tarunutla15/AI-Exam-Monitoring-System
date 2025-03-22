export default function Navigation({ activeTab, setActiveTab }) {
    return (
      <nav className="flex justify-between bg-gray-800 p-4">
        <h1 className="text-xl font-bold">📊 Admin Dashboard</h1>
        <div className="flex gap-4">
          <button onClick={() => setActiveTab("create-test")} className="hover:text-cyan-400">
            📝 Create Test
          </button>
          <button onClick={() => setActiveTab("students")} className="hover:text-cyan-400">
            👨‍🎓 Students
          </button>
          <button onClick={() => setActiveTab("submissions")} className="hover:text-cyan-400">
            📄 Submissions
          </button>
        </div>
      </nav>
    );
  }
  