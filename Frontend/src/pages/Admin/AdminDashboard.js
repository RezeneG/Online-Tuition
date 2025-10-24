import React, { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import CourseForm from "../components/CourseForm";
import CourseList from "../components/CourseList";

const API_URL = "http://localhost:5000/api/courses";

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState(null);

  const fetchCourses = async () => {
    setLoading(true);
    const res = await fetch(API_URL);
    const data = await res.json();
    setCourses(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (formData) => {
    const method = editingCourse ? "PUT" : "POST";
    const url = editingCourse ? `${API_URL}/${editingCourse._id}` : API_URL;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setEditingCourse(null);
    fetchCourses();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchCourses();
  };

  const handleEdit = (course) => setEditingCourse(course);
  const handleCancel = () => setEditingCourse(null);

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-8 flex items-center space-x-2">
        <PlusCircle className="w-8 h-8" />
        <span>Admin Dashboard</span>
      </h1>

      <CourseForm
        onSubmit={handleSubmit}
        editingCourse={editingCourse}
        onCancel={handleCancel}
      />

      <CourseList
        courses={courses}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminDashboard;
