import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/AdminLayout';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import { studentService } from '../../services/studentService';
import { getImageUrl } from '../../services/api';
import styles from './ManageStudents.module.css';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      const { data } = await studentService.getStudents(params);
      setStudents(data.students);
      setTotalPages(data.pages);
    } catch {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchStudents();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await studentService.deleteStudent(id);
      toast.success('Student deleted');
      fetchStudents();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <AdminLayout title="Manage Students">
      <form onSubmit={handleSearch} className={styles.searchBar}>
        <i className="bi bi-search"></i>
        <input
          type="text"
          placeholder="Search students by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-primary btn-sm">Search</button>
      </form>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="table-responsive">
            <table className={`table ${styles.table}`}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Enrolled</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>
                      <div className={styles.studentInfo}>
                        <img src={getImageUrl(student.profileImage)} alt="" />
                        <strong>{student.name}</strong>
                      </div>
                    </td>
                    <td>{student.email}</td>
                    <td>{student.phone}</td>
                    <td><span className="badge bg-primary">{student.enrolledCourses?.length || 0}</span></td>
                    <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(student._id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </AdminLayout>
  );
};

export default ManageStudents;
