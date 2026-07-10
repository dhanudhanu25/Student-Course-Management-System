import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import MainLayout from '../components/MainLayout';
import ProgressBar from '../components/ProgressBar';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import { enrollmentService } from '../services/enrollmentService';
import { getImageUrl } from '../services/api';
import { getCourseThumbnail, CATEGORY_IMAGES, DEFAULT_COURSE_IMAGE } from '../utils/courseImages';
import styles from './MyCourses.module.css';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const { data } = await enrollmentService.getEnrollments({ page, limit: 6 });
      setEnrollments(data.enrollments);
      setTotalPages(data.pages);
    } catch {
      toast.error('Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, [page]);

  const handleRemove = async (id) => {
    if (!window.confirm('Are you sure you want to remove this enrollment?')) return;
    try {
      await enrollmentService.deleteEnrollment(id);
      toast.success('Enrollment removed');
      fetchEnrollments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove');
    }
  };

  const handleProgressUpdate = async (id, progress) => {
    try {
      await enrollmentService.updateProgress(id, progress);
      setEnrollments((prev) =>
        prev.map((e) => (e._id === id ? { ...e, progress, completionStatus: progress >= 100 ? 'completed' : 'in-progress' } : e))
      );
      toast.success('Progress updated!');
    } catch {
      toast.error('Failed to update progress');
    }
  };

  return (
    <MainLayout>
      <div className={`container py-4 ${styles.page}`}>
        <div className={styles.header}>
          <h1>My Courses</h1>
          <p>Track your learning progress</p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : enrollments.length === 0 ? (
          <div className={styles.empty}>
            <i className="bi bi-book"></i>
            <h3>No enrolled courses yet</h3>
            <p>Start learning by enrolling in a course</p>
            <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {enrollments.map((enrollment) => {
                const course = enrollment.courseId;
                if (!course) return null;
                return (
                  <div className="col-lg-6" key={enrollment._id}>
                    <div className={styles.courseCard}>
                      <img
                        src={getImageUrl(getCourseThumbnail(course))}
                        alt={course.title}
                        className={styles.thumbnail}
                        onError={(e) => {
                          e.target.src = CATEGORY_IMAGES[course.category] || DEFAULT_COURSE_IMAGE;
                        }}
                      />
                      <div className={styles.content}>
                        <div className={styles.top}>
                          <span className={styles.category}>{course.category}</span>
                          <span className={`badge ${enrollment.completionStatus === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                            {enrollment.completionStatus === 'completed' ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                        <h4>{course.title}</h4>
                        <p className={styles.instructor}>
                          <i className="bi bi-person"></i> {course.instructor}
                        </p>
                        <ProgressBar progress={enrollment.progress} label="Progress" />
                        <div className={styles.actions}>
                          <Link to={`/courses/${course._id}`} className="btn btn-primary btn-sm">
                            Continue Learning
                          </Link>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => handleProgressUpdate(enrollment._id, Math.min(100, enrollment.progress + 25))}
                            >
                              +25%
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleRemove(enrollment._id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default MyCourses;
