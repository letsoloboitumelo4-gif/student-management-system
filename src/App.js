
import { useState, useEffect } from "react";
import "./App.css";

const emptyForm = {
  id: "",
  name: "",
  age: "",
  email: "",
  course: "",
  active: true
};

function App() {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("students_v2");
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [viewStudent, setViewStudent] = useState(null);

  useEffect(() => {
    localStorage.setItem("students_v2", JSON.stringify(students));
  }, [students]);

  function handleChange(e) {
    const { name, value, checked, type } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  }

  function openAddForm() {
    setForm({ ...emptyForm });
    setEditing(false);
    setShowForm(true);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.id.trim() ||
      !form.name.trim() ||
      !form.age ||
      !form.email.trim() ||
      !form.course.trim()
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (
      !Number.isInteger(Number(form.age)) ||
      Number(form.age) < 1 ||
      Number(form.age) > 120
    ) {
      alert("Please enter a valid age.");
      return;
    }

    const duplicate = students.some(
      (student) =>
        student.id.toLowerCase() === form.id.trim().toLowerCase() &&
        (!editing || student.id !== form.originalId)
    );

    if (duplicate) {
      alert("This student ID already exists.");
      return;
    }

    const newStudent = {
      id: form.id.trim(),
      name: form.name.trim(),
      age: Number(form.age),
      email: form.email.trim(),
      course: form.course.trim(),
      active: form.active
    };

    if (editing) {
      setStudents((current) =>
        current.map((student) =>
          student.id === form.originalId ? newStudent : student
        )
      );
    } else {
      setStudents((current) => [...current, newStudent]);
    }

    setShowForm(false);
    setEditing(false);
    setForm({ ...emptyForm });
  }

  function editStudent(student) {
    setForm({
      ...student,
      age: String(student.age),
      originalId: student.id
    });

    setEditing(true);
    setShowForm(true);
    setViewStudent(null);
  }

  function deleteStudent(id) {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setStudents((current) =>
        current.filter((student) => student.id !== id)
      );

      if (viewStudent?.id === id) {
        setViewStudent(null);
      }
    }
  }

  const filteredStudents = students.filter((student) =>
    `${student.id} ${student.name} ${student.email} ${student.course}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const activeCount = students.filter((student) => student.active).length;
  const inactiveCount = students.length - activeCount;

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">C</div>
          <div>
            <h2>CampusDesk</h2>
            <span>Student Portal</span>
          </div>
        </div>

        <p className="nav-heading">MENU</p>

        <button className="nav-link selected" type="button">
          <span>▦</span> Dashboard
        </button>

        <button className="nav-link" type="button" onClick={openAddForm}>
          <span>＋</span> Add Student
        </button>

        <div className="sidebar-note">
          <strong>Student Management</strong>
          <p>Managestudent records in one place.</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="welcome-text">WELCOME BACK</p>
            <h1>Student Dashboard</h1>
            <p className="subtitle">
              View and manage student information.
            </p>
          </div>

          <button className="primary-btn" onClick={openAddForm} type="button">
            <span>＋</span> Add Student
          </button>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">♧</div>
            <div>
              <p>Total Students</p>
              <h2>{students.length}</h2>
              <span>All registered students</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">✓</div>
            <div>
              <p>Active Students</p>
              <h2>{activeCount}</h2>
              <span>Currently active</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">◷</div>
            <div>
              <p>Inactive Students</p>
              <h2>{inactiveCount}</h2>
              <span>Currently inactive</span>
            </div>
          </div>
        </section>

        <section className="records-card">
          <div className="records-heading">
            <div>
              <h2>Student Records</h2>
              <p>All student information is displayed below.</p>
            </div>

            <span className="record-count">
              {students.length} total
            </span>
          </div>

          <div className="toolbar">
            <div className="search-box">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Search by ID, name, email or course..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>STUDENT ID</th>
                  <th>STUDENT NAME</th>
                  <th>AGE</th>
                  <th>EMAIL ADDRESS</th>
                  <th>COURSE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <span className="student-id">{student.id}</span>
                      </td>
                      <td className="student-name">{student.name}</td>
                      <td>{student.age}</td>
                      <td>{student.email}</td>
                      <td>{student.course}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            student.active ? "status-active" : "status-inactive"
                          }`}
                        >
                          {student.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn view-btn"
                            type="button"
                            onClick={() => setViewStudent(student)}
                          >
                            View
                          </button>
                          <button
                            className="action-btn edit-btn"
                            type="button"
                            onClick={() => editStudent(student)}
                          >
                            Edit
                          </button>
                          <button
                            className="action-btn delete-btn"
                            type="button"
                            onClick={() => deleteStudent(student.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">
                      <div className="empty-state">
                        <div className="empty-icon">♧</div>
                        <h3>
                          {search ? "No students found" : "No student records yet"}
                        </h3>
                        <p>
                          {search
                            ? "Try searching with a different word."
                            : "Add your first student using the button below."}
                        </p>
                        {!search && (
                          <button
                            type="button"
                            className="primary-btn"
                            onClick={openAddForm}
                          >
                            ＋ Add First Student
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="table-bottom">
            Showing {filteredStudents.length} of {students.length} student(s)
          </div>
        </section>
      </main>

      {showForm && (
        <div
          className="modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowForm(false);
          }}
        >
          <div className="modal form-modal">
            <div className="modal-header">
              <div>
                <h2>{editing ? "Edit Student" : "Add New Student"}</h2>
                <p>
                  {editing
                    ? "Update the student's information."
                    : "Enter the details of the student below."}
                </p>
              </div>

              <button
                className="close-btn"
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form className="student-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="id">Student ID</label>
                <input
                  id="id"
                  name="id"
                  value={form.id}
                  onChange={handleChange}
                  placeholder="e.g. 1"
                  disabled={editing}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="age">Age</label>
                  <input
                    id="age"
                    type="number"
                    name="age"
                    value={form.age}
                    onChange={handleChange}
                    placeholder="Enter age"
                    min="1"
                    max="120"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="course">Course</label>
                  <input
                    id="course"
                    name="course"
                    value={form.course}
                    onChange={handleChange}
                    placeholder="Enter course"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="student@example.com"
                  required
                />
              </div>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={handleChange}
                />
                <span>
                  <strong>Active student</strong>
                  <small>Mark this student as currently active.</small>
                </span>
              </label>

              <div className="form-buttons">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  {editing ? "Save Changes" : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewStudent && (
        <div className="modal-overlay" onMouseDown={(e) => {
          if (e.target === e.currentTarget) setViewStudent(null);
        }}>
          <div className="modal details-modal">
            <div className="modal-header">
              <div>
                <h2>Student Details</h2>
                <p>Full student information</p>
              </div>
              <button
                className="close-btn"
                type="button"
                onClick={() => setViewStudent(null)}
                aria-label="Close details"
              >
                ×
              </button>
            </div>

            <div className="details-list">
              <div><span>Student ID</span><strong>{viewStudent.id}</strong></div>
              <div><span>Full Name</span><strong>{viewStudent.name}</strong></div>
              <div><span>Age</span><strong>{viewStudent.age}</strong></div>
              <div><span>Email Address</span><strong>{viewStudent.email}</strong></div>
              <div><span>Course</span><strong>{viewStudent.course}</strong></div>
              <div>
                <span>Status</span>
                <strong>{viewStudent.active ? "Active" : "Inactive"}</strong>
              </div>
            </div>

            <div className="form-buttons">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setViewStudent(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="primary-btn"
                onClick={() => editStudent(viewStudent)}
              >
                Edit Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
