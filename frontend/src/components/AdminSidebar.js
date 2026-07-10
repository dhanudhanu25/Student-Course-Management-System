import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './AdminSidebar.module.css';

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const links = [
    { to: '/admin/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
    { to: '/admin/courses', icon: 'bi-journal-bookmark', label: 'Manage Courses' },
    { to: '/admin/students', icon: 'bi-people', label: 'Manage Students' },
    { to: '/admin/analytics', icon: 'bi-bar-chart', label: 'Analytics' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <i className="bi bi-mortarboard-fill"></i>
        <span>SCMS Admin</span>
      </div>
      <nav className={styles.nav}>
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`${styles.navLink} ${location.pathname === link.to ? styles.active : ''}`}
          >
            <i className={`bi ${link.icon}`}></i>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
      <div className={styles.footer}>
        <Link to="/" className={styles.navLink}>
          <i className="bi bi-house"></i>
          <span>View Site</span>
        </Link>
        <button className={`${styles.navLink} ${styles.logout}`} onClick={logout}>
          <i className="bi bi-box-arrow-right"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
