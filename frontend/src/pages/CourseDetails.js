import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/MainLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { courseService } from '../services/courseService';
import { enrollmentService } from '../services/enrollmentService';
import { getImageUrl } from '../services/api';
import { formatPrice } from '../utils/formatPrice';
import {
  getCourseThumbnail,
  DEFAULT_COURSE_IMAGE,
} from '../utils/courseImages';
import useRecentlyViewed from '../hooks/useRecentlyViewed';
import styles from './CourseDetails.module.css';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isStudent } = useAuth();
  const { addRecentCourse } = useRecentlyViewed();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await courseService.getCourse(id);
        setCourse(data.course);
        addRecentCourse(data.course);

        if (isAuthenticated && isStudent) {
          const enrollRes = await enrollmentService.getEnrollments({ limit: 100 });
          const enrolled = enrollRes.data.enrollments.some(
            (e) => (e.courseId?._id || e.courseId) === id
          );
          setIsEnrolled(enrolled);
        }
      } catch {
        toast.error('Course not found');
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, isAuthenticated, isStudent, navigate, addRecentCourse]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/courses/${id}` } } });
      return;
    }
    setEnrolling(true);
    try {
      await enrollmentService.enroll(id);
      setIsEnrolled(true);
      toast.success('Enrolled successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <MainLayout><LoadingSpinner fullScreen /></MainLayout>;
  if (!course) return null;

  return (
    <MainLayout>
      <div className={`container py-4 ${styles.page}`}>
        <div className="row g-4">
          <div className="col-lg-8">
            <img
              src={getImageUrl(getCourseThumbnail(course))}
              alt={course.title}
              className={styles.thumbnail}
              onError={(e) => {
                e.target.src = DEFAULT_COURSE_IMAGE;
              }}
            />
            <span className={styles.category}>{course.category}</span>
            <h1 className={styles.title}>{course.title}</h1>
            <div className={styles.meta}>
              <span><i className="bi bi-person"></i> {course.instructor}</span>
              <span><i className="bi bi-clock"></i> {course.duration}</span>
              <span><i className="bi bi-book"></i> {course.lessons?.length || 0} Lessons</span>
            </div>
            <div className={styles.description}>
              <h3>About This Course</h3>
              <p>{course.description}</p>
            </div>
            {course.lessons?.length > 0 && (
              <div className={styles.lessons}>
                <h3>Course Curriculum</h3>
                {course.lessons.map((lesson, index) => (
                  <div key={index} className={styles.lessonItem}>
                    <div className={styles.lessonNumber}>{index + 1}</div>
                    <div>
                      <strong>{lesson.title}</strong>
                      <small>{lesson.duration}</small>
                    </div>
                    <i className="bi bi-play-circle"></i>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="col-lg-4">
            <div className={styles.sidebar}>
              <div className={styles.price}>{formatPrice(course.price)}</div>
              {isEnrolled ? (
                <>
                  <button className="btn btn-success w-100 mb-2" onClick={() => navigate('/my-courses')}>
                    <i className="bi bi-check-circle me-2"></i>Enrolled
                  </button>
                  <button className="btn btn-primary w-100" onClick={() => navigate('/my-courses')}>
                    Continue Learning
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-primary w-100 btn-lg"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}
              <hr />
              <h5>This course includes:</h5>
              <ul className={styles.includes}>
                <li><i className="bi bi-play-circle"></i> {course.lessons?.length || 0} video lessons</li>
                <li><i className="bi bi-infinity"></i> Lifetime access</li>
                <li><i className="bi bi-phone"></i> Mobile friendly</li>
                <li><i className="bi bi-award"></i> Certificate of completion</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CourseDetails;
