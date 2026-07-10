import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../services/api';
import styles from './ProfileDropdown.module.css';

const ProfileDropdown = () => {
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  const dashboardLink = isAdmin ? '/admin/dashboard' : '/dashboard';

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button className={styles.trigger} onClick={() => setOpen(!open)}>
        <img
          src={getImageUrl(user?.profileImage)}
          alt={user?.name}
          className={styles.avatar}
        />
        <span className={styles.name}>{user?.name?.split(' ')[0]}</span>
        <i className={`bi bi-chevron-down ${open ? styles.rotated : ''}`}></i>
      </button>
      {open && (
        <div className={styles.menu}>
          <div className={styles.menuHeader}>
            <img src={getImageUrl(user?.profileImage)} alt="" className={styles.menuAvatar} />
            <div>
              <strong>{user?.name}</strong>
              <small>{user?.email}</small>
            </div>
          </div>
          <hr />
          <Link to={dashboardLink} className={styles.menuItem} onClick={() => setOpen(false)}>
            <i className="bi bi-speedometer2"></i> Dashboard
          </Link>
          {!isAdmin && (
            <>
              <Link to="/my-courses" className={styles.menuItem} onClick={() => setOpen(false)}>
                <i className="bi bi-book"></i> My Courses
              </Link>
              <Link to="/profile" className={styles.menuItem} onClick={() => setOpen(false)}>
                <i className="bi bi-person"></i> Profile
              </Link>
            </>
          )}
          <hr />
          <button className={`${styles.menuItem} ${styles.logout}`} onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
