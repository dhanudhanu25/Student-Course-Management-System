import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DarkModeToggle from './DarkModeToggle';
import ProfileDropdown from './ProfileDropdown';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/courses', label: 'Courses' },
    { to: '/contact', label: 'Contact' },
  ];

  if (isAuthenticated && !isAdmin) {
    navLinks.splice(2, 0, { to: '/my-courses', label: 'My Courses' });
    navLinks.splice(2, 0, { to: '/dashboard', label: 'Dashboard' });
  }

  return (
    <nav className={`navbar navbar-expand-lg ${styles.navbar} sticky-top`}>
      <div className="container">
        <Link className={`navbar-brand ${styles.brand}`} to="/">
          <i className="bi bi-mortarboard-fill"></i>
          <span>SCMS</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav mx-auto">
            {navLinks.map((link) => (
              <li className="nav-item" key={link.to}>
                <NavLink
                  className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.active : ''}`}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className={`d-flex align-items-center gap-2 ${styles.actions}`}>
            <DarkModeToggle />
            {isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <>
                <button className="btn btn-outline-primary btn-sm" onClick={() => navigate('/login')}>
                  Login
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/signup')}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
