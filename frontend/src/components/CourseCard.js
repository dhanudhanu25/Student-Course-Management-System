import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';
import { formatPrice } from '../utils/formatPrice';
import {
  getCourseThumbnail,
  CATEGORY_IMAGES,
  DEFAULT_COURSE_IMAGE,
} from '../utils/courseImages';
import styles from './CourseCard.module.css';

const CourseCard = ({ course, onEnroll, isEnrolled, showEnroll = true, compact = false }) => {
  const handleEnroll = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEnroll) onEnroll(course._id);
  };

  const thumbnail = getCourseThumbnail(course);

  return (
    <div className={`card ${styles.card} h-100`}>
      <Link to={`/courses/${course._id}`} className={styles.imageLink}>
        <img
          src={getImageUrl(thumbnail)}
          className={`card-img-top ${styles.thumbnail}`}
          alt={course.title}
          onError={(e) => {
            e.target.src = CATEGORY_IMAGES[course.category] || DEFAULT_COURSE_IMAGE;
          }}
        />
        <span className={styles.category}>{course.category}</span>
      </Link>
      <div className="card-body d-flex flex-column">
        <Link to={`/courses/${course._id}`} className={styles.titleLink}>
          <h5 className={`card-title ${styles.title}`}>{course.title}</h5>
        </Link>
        {!compact && (
          <p className={`card-text ${styles.description}`}>
            {course.description?.substring(0, 100)}...
          </p>
        )}
        <div className={styles.meta}>
          <span><i className="bi bi-person"></i> {course.instructor}</span>
          <span><i className="bi bi-clock"></i> {course.duration}</span>
        </div>
        <div className={styles.footer}>
          <span className={styles.price}>{formatPrice(course.price)}</span>
          {showEnroll && (
            isEnrolled ? (
              <span className="badge bg-success">Enrolled</span>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={handleEnroll}>
                Enroll Now
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
