import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import API from "../services/api";

function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  // Load Students
  const loadStudents = async () => {
    try {
      const res = await API.get("/admin/students");

      if (res.data.success) {
        setStudents(res.data.students);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Delete Student
  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      const res = await API.delete(`/admin/student/${id}`);

      if (res.data.success) {
        alert("Student Deleted Successfully");
        loadStudents();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Export Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(students);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Students"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(data, "Students.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    const titleLines = doc.splitTextToSize(
      "PU PIET Dep.",
      182
    );
    doc.text(titleLines, 14, 15);

    doc.setFontSize(12);
    const reportY = 18 + titleLines.length * 6;
    doc.text("Students Report", 14, reportY);

    autoTable(doc, {
      startY: reportY + 10,
      head: [["ID", "Name", "Email", "Role"]],
      body: students.map((student) => [
        student._id,
        student.fullName,
        student.email,
        student.role,
      ]),
    });

    doc.save("Students.pdf");
  };

  const filteredStudents = students.filter((student) =>
    (student.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
    (student.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-5" style={{ maxWidth: "1140px" }}>

      <div className="mb-3">
        <Link to="/admin" className="btn btn-secondary btn-sm">
          ← Back to Admin Dashboard
        </Link>
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">👨‍🎓 Manage Students</h2>
          <p className="text-muted mb-0">View registered students, export lists, and manage user accounts</p>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-success"
            onClick={exportExcel}
          >
            📥 Export Excel
          </button>

          <button
            className="btn btn-danger"
            onClick={exportPDF}
          >
            📄 Export PDF
          </button>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          style={{ height: "46px" }}
          placeholder="🔍 Search by Name or Email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card shadow-sm border overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: "220px" }}>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th style={{ width: "120px" }}>Role</th>
                <th style={{ width: "120px" }} className="text-end">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student._id}>
                    <td className="text-muted font-monospace" style={{ fontSize: "12px" }}>
                      {student._id}
                    </td>

                    <td className="fw-semibold">
                      {student.fullName || "Unnamed"}
                    </td>

                    <td>{student.email}</td>

                    <td>
                      <span
                        className="badge"
                        style={{
                          background: student.role === "admin" ? "rgba(217, 119, 6, 0.15)" : "rgba(79, 70, 229, 0.12)",
                          color: student.role === "admin" ? "#d97706" : "#4f46e5",
                          fontWeight: "700",
                          padding: "6px 10px",
                          borderRadius: "9999px"
                        }}
                      >
                        {student.role || "student"}
                      </span>
                    </td>

                    <td className="text-end">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => deleteStudent(student._id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-5 text-muted"
                  >
                    No Students Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default ManageStudents;