import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => (
  <div className={styles.page}>
    <div className={styles.content}>
      <h1 className={styles.code}>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <div className={styles.actions}>
        <Link to="/" className="btn btn-primary btn-lg">Go Home</Link>
        <Link to="/courses" className="btn btn-outline-primary btn-lg">Browse Courses</Link>
      </div>
    </div>
  </div>
);

export default NotFound;
