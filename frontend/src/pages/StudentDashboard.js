import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/MainLayout';
import CourseCard from '../components/CourseCard';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { courseService } from '../services/courseService';
import { enrollmentService } from '../services/enrollmentService';
import { getImageUrl } from '../services/api';
import useRecentlyViewed from '../hooks/useRecentlyViewed';
import styles from './Dashboard.module.css';

const StudentDashboard = () => {
  const { user, getProfileCompletion } = useAuth();
  const { recentCourses } = useRecentlyViewed();
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enrollRes, courseRes, activityRes] = await Promise.all([
          enrollmentService.getEnrollments({ limit: 100 }),
          courseService.getCourses({ limit: 4 }),
          enrollmentService.getRecentActivity(),
        ]);
        setEnrollments(enrollRes.data.enrollments);
        setCourses(courseRes.data.courses);
        setRecentActivity(activityRes.data.enrollments);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const profileCompletion = getProfileCompletion();

  if (loading) return <MainLayout><LoadingSpinner fullScreen /></MainLayout>;

  return (
    <MainLayout>
      <div className={`container py-4 ${styles.dashboard}`}>
        <div className={styles.welcome}>
          <div>
            <h1>Welcome back, {user?.name?.split(' ')[0]}!</h1>
            <p>Continue your learning journey</p>
          </div>
          <Link to="/profile" className={styles.profileSummary}>
            <img src={getImageUrl(user?.profileImage)} alt="" />
            <div>
              <strong>{user?.name}</strong>
              <ProgressBar progress={profileCompletion} label="Profile Completion" size="sm" />
            </div>
          </Link>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <StatCard icon="bi-book" title="Enrolled Courses" value={enrollments.length} color="primary" />
          </div>
          <div className="col-md-4">
            <StatCard
              icon="bi-check-circle"
              title="Completed"
              value={enrollments.filter((e) => e.completionStatus === 'completed').length}
              color="success"
            />
          </div>
          <div className="col-md-4">
            <StatCard
              icon="bi-graph-up"
              title="Avg Progress"
              value={`${enrollments.length ? Math.round(enrollments.reduce((a, e) => a + e.progress, 0) / enrollments.length) : 0}%`}
              color="info"
            />
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3>Available Courses</h3>
                <Link to="/courses">View All</Link>
              </div>
              <div className="row g-3">
                {courses.map((course) => (
                  <div className="col-md-6" key={course._id}>
                    <CourseCard
                      course={course}
                      compact
                      showEnroll={false}
                      isEnrolled={enrollments.some((e) => e.courseId?._id === course._id)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {recentCourses.length > 0 && (
              <div className={styles.section}>
                <h3>Recently Viewed</h3>
                <div className="row g-3">
                  {recentCourses.map((course) => (
                    <div className="col-md-6" key={course._id}>
                      <CourseCard course={course} compact showEnroll={false} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="col-lg-4">
            <div className={styles.section}>
              <h3>Recent Activity</h3>
              {recentActivity.length === 0 ? (
                <p className="text-muted">No recent activity</p>
              ) : (
                <div className={styles.activityList}>
                  {recentActivity.map((item) => (
                    <div key={item._id} className={styles.activityItem}>
                      <div className={styles.activityIcon}>
                        <i className="bi bi-play-circle"></i>
                      </div>
                      <div>
                        <strong>{item.courseId?.title}</strong>
                        <ProgressBar progress={item.progress} showLabel={false} size="sm" />
                        <small>{item.completionStatus === 'completed' ? 'Completed' : 'In Progress'}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentDashboard;
