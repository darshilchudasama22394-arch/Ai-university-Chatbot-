import React, { useEffect, useState } from "react";
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

  doc.setFontSize(18);
  doc.text("AI University Helpdesk", 14, 15);

  doc.setFontSize(12);
  doc.text("Students Report", 14, 25);

  autoTable(doc, {
    startY: 35,
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
    <div className="container mt-5">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h2>👨‍🎓 Manage Students</h2>

        <div className="d-flex gap-2">

  <button
    className="btn btn-success"
    onClick={exportExcel}
  >
    📥 Excel
  </button>

  <button
    className="btn btn-danger"
    onClick={exportPDF}
  >
    📄 PDF
  </button>

</div>

        <div className="mb-3 mt-3">
  <input
    type="text"
    className="form-control"
    placeholder="🔍 Search by Name or Email..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>

      </div>

      <table className="table table-bordered table-hover shadow">

        <thead className="table-dark">

          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th width="120">Action</th>
          </tr>

        </thead>

        <tbody>

          {students.length > 0 ? (
            filteredStudents.map((student) => (
              <tr key={student._id}>

                <td>{student._id}</td>

                <td>{student.fullName}</td>

                <td>{student.email}</td>

                <td>{student.role}</td>

                <td>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteStudent(student._id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))
          ) : (
            <tr>

              <td
                colSpan="5"
                className="text-center"
              >
                No Students Found
              </td>

            </tr>
          )}

        </tbody>

      </table>

    </div>
  );
}

export default ManageStudents;