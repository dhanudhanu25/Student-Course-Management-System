import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { analyticsService } from '../../services/analyticsService';
import styles from './Analytics.module.css';

const Analytics = () => {
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

  if (loading) return <AdminLayout title="Analytics"><LoadingSpinner /></AdminLayout>;

  const maxCategoryCount = Math.max(...(analytics?.enrollmentsByCategory?.map((c) => c.count) || [1]));

  return (
    <AdminLayout title="Analytics">
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <StatCard icon="bi-people-fill" title="Total Students" value={analytics?.totalStudents || 0} color="primary" />
        </div>
        <div className="col-md-4">
          <StatCard icon="bi-journal-bookmark-fill" title="Total Courses" value={analytics?.totalCourses || 0} color="success" />
        </div>
        <div className="col-md-4">
          <StatCard icon="bi-graph-up-arrow" title="Total Enrollments" value={analytics?.totalEnrollments || 0} color="info" />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className={styles.card}>
            <h3>Enrollments by Category</h3>
            {analytics?.enrollmentsByCategory?.map((cat) => (
              <div key={cat._id} className={styles.barChart}>
                <div className={styles.barLabel}>
                  <span>{cat._id}</span>
                  <span className={styles.barValue}>{cat.count}</span>
                </div>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${(cat.count / maxCategoryCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-6">
          <div className={styles.card}>
            <h3>Monthly Enrollments</h3>
            {analytics?.monthlyEnrollments?.length === 0 ? (
              <p className="text-muted">No data available</p>
            ) : (
              <div className={styles.monthlyChart}>
                {analytics?.monthlyEnrollments?.map((item) => {
                  const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  const maxMonthly = Math.max(...analytics.monthlyEnrollments.map((m) => m.count));
                  return (
                    <div key={`${item._id.year}-${item._id.month}`} className={styles.monthBar}>
                      <div
                        className={styles.monthFill}
                        style={{ height: `${(item.count / maxMonthly) * 100}%` }}
                      >
                        <span className={styles.monthCount}>{item.count}</span>
                      </div>
                      <span className={styles.monthLabel}>{monthNames[item._id.month]}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
