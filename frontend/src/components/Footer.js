import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => (
  <footer className={styles.footer}>
    <div className="container">
      <div className="row g-4">
        <div className="col-lg-4 col-md-6">
          <div className={styles.brand}>
            <i className="bi bi-mortarboard-fill"></i>
            <span>SCMS</span>
          </div>
          <p className={styles.description}>
            Student Course Management System — empowering learners with quality education
            and seamless course management.
          </p>
          <div className={styles.social}>
            <a href="https://www.linkedin.com/in/nerella-dhanush-045427291/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <i className="bi bi-linkedin"></i>
            </a>
            <a href="https://www.instagram.com/dhanush_nerella/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <i className="bi bi-instagram"></i>
            </a>
          </div>
        </div>
        <div className="col-lg-2 col-md-6">
          <h5>Quick Links</h5>
          <ul className={styles.links}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>
        <div className="col-lg-3 col-md-6">
          <h5>Categories</h5>
          <ul className={styles.links}>
            <li><Link to="/courses?category=Web Development">Web Development</Link></li>
            <li><Link to="/courses?category=Data Science">Data Science</Link></li>
            <li><Link to="/courses?category=AI & Machine Learning">AI & ML</Link></li>
            <li><Link to="/courses?category=Cybersecurity">Cybersecurity</Link></li>
          </ul>
        </div>
        <div className="col-lg-3 col-md-6">
          <h5>Contact Info</h5>
          <ul className={styles.contact}>
            <li><i className="bi bi-geo-alt"></i> 5-69, Vutukuru</li>
            <li><i className="bi bi-telephone"></i> +91 9390773373</li>
            <li><i className="bi bi-envelope"></i> dhanushnerella1@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr className={styles.divider} />
      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} Student Course Management System. All rights reserved.</p>
        <p>Built with MERN Stack</p>
      </div>
    </div>
  </footer>
);

export default Footer;
