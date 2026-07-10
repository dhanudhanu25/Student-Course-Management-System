import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/AdminLayout';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import { courseService } from '../../services/courseService';
import { getImageUrl } from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import { getCourseThumbnail } from '../../utils/courseImages';
import styles from './ManageCourses.module.css';

const CATEGORIES = [
  'Web Development', 'Data Science', 'Mobile Development',
  'Cloud Computing', 'Cybersecurity', 'AI & Machine Learning',
  'DevOps', 'UI/UX Design', 'Database', 'Programming',
];

const emptyForm = {
  title: '', description: '', instructor: '', duration: '',
  category: 'Web Development', price: '', lessons: '',
};

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [thumbnail, setThumbnail] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data } = await courseService.getCourses({ page, limit: 10 });
      setCourses(data.courses);
      setTotalPages(data.pages);
    } catch {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, [page]);

  const openAddModal = () => {
    setEditingCourse(null);
    setForm(emptyForm);
    setThumbnail(null);
    setShowModal(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setForm({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      duration: course.duration,
      category: course.category,
      price: course.price,
      lessons: JSON.stringify(course.lessons || [], null, 2),
    });
    setThumbnail(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      if (thumbnail) formData.append('thumbnail', thumbnail);

      if (editingCourse) {
        await courseService.updateCourse(editingCourse._id, formData);
        toast.success('Course updated!');
      } else {
        await courseService.createCourse(formData);
        toast.success('Course created!');
      }
      setShowModal(false);
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await courseService.deleteCourse(id);
      toast.success('Course deleted');
      fetchCourses();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <AdminLayout title="Manage Courses">
      <div className={styles.header}>
        <p className="text-muted mb-0">Add, edit, and delete courses</p>
        <button className="btn btn-primary" onClick={openAddModal}>
          <i className="bi bi-plus-lg me-2"></i>Add Course
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="table-responsive">
            <table className={`table ${styles.table}`}>
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Instructor</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id}>
                    <td>
                      <img src={getImageUrl(getCourseThumbnail(course))} alt="" className={styles.thumb} />
                    </td>
                    <td><strong>{course.title}</strong></td>
                    <td><span className="badge bg-primary">{course.category}</span></td>
                    <td>{course.instructor}</td>
                    <td>{formatPrice(course.price)}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEditModal(course)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(course._id)}>
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

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{editingCourse ? 'Edit Course' : 'Add Course'}</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-8 mb-3">
                  <label className="form-label">Title</label>
                  <input type="text" className="form-control" value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Price (₹ INR, min ₹1,501)</label>
                  <input type="number" className="form-control" value={form.price} step="1" min="1501"
                    onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows="3" value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Instructor</label>
                  <input type="text" className="form-control" value={form.instructor}
                    onChange={(e) => setForm({ ...form, instructor: e.target.value })} required />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Duration</label>
                  <input type="text" className="form-control" value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })} required />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Thumbnail</label>
                <input type="file" className="form-control" accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files[0])} />
              </div>
              <div className="mb-3">
                <label className="form-label">Lessons (JSON)</label>
                <textarea className="form-control" rows="4" value={form.lessons}
                  onChange={(e) => setForm({ ...form, lessons: e.target.value })}
                  placeholder='[{"title":"Lesson 1","duration":"30 min","content":"..."}]' />
              </div>
              <div className="d-flex gap-2 justify-content-end">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingCourse ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageCourses;
