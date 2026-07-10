import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { analyticsService } from '../../services/analyticsService';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await analyticsService.getAnalytics();
        setAnalytics(data.analytics);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <AdminLayout title="Dashboard"><LoadingSpinner /></AdminLayout>;

  return (
    <AdminLayout title="Admin Dashboard">
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <StatCard icon="bi-people" title="Total Students" value={analytics?.totalStudents || 0} color="primary" />
        </div>
        <div className="col-md-4">
          <StatCard icon="bi-journal-bookmark" title="Total Courses" value={analytics?.totalCourses || 0} color="success" />
        </div>
        <div className="col-md-4">
          <StatCard icon="bi-graph-up" title="Total Enrollments" value={analytics?.totalEnrollments || 0} color="warning" />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className={styles.card}>
            <h3>Recent Enrollments</h3>
            {analytics?.recentEnrollments?.length === 0 ? (
              <p className="text-muted">No enrollments yet</p>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Course</th>
                      <th>Date</th>
                      <th>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics?.recentEnrollments?.map((e) => (
                      <tr key={e._id}>
                        <td>{e.studentId?.name}</td>
                        <td>{e.courseId?.title}</td>
                        <td>{new Date(e.enrolledDate).toLocaleDateString()}</td>
                        <td>
                          <div className="progress" style={{ height: '8px' }}>
                            <div className="progress-bar" style={{ width: `${e.progress}%` }}></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <div className="col-lg-4">
          <div className={styles.card}>
            <h3>Quick Actions</h3>
            <div className={styles.actions}>
              <Link to="/admin/courses" className={styles.actionBtn}>
                <i className="bi bi-plus-circle"></i> Add Course
              </Link>
              <Link to="/admin/students" className={styles.actionBtn}>
                <i className="bi bi-people"></i> View Students
              </Link>
              <Link to="/admin/analytics" className={styles.actionBtn}>
                <i className="bi bi-bar-chart"></i> View Analytics
              </Link>
            </div>
          </div>

          <div className={`${styles.card} mt-4`}>
            <h3>Enrollments by Category</h3>
            {analytics?.enrollmentsByCategory?.map((cat) => (
              <div key={cat._id} className={styles.categoryBar}>
                <div className={styles.categoryLabel}>
                  <span>{cat._id}</span>
                  <span>{cat.count}</span>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div
                    className="progress-bar bg-primary"
                    style={{ width: `${(cat.count / analytics.totalEnrollments) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
