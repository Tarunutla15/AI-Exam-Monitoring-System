export default function StudentList({ students, setSelectedStudent }) {
    return (
      <aside className="w-60 bg-gray-800 p-4 border-r border-gray-700 h-screen">
        <h2 className="text-lg font-semibold mb-4">👨‍🎓 Students</h2>
        {students.length > 0 ? (
          students.map((student) => (
            <button
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className="block w-full text-left p-2 hover:bg-gray-700 rounded-md"
            >
              {student.username}
            </button>
          ))
        ) : (
          <p>No students available.</p>
        )}
      </aside>
    );
  }
  