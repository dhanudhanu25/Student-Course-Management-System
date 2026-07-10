import React, { useState } from 'react';
import { toast } from 'react-toastify';
import MainLayout from '../components/MainLayout';
import styles from './Contact.module.css';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.subject.trim()) newErrors.subject = 'Subject is required';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <MainLayout>
      <div className={`container py-4 ${styles.page}`}>
        <div className="text-center mb-5">
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.subtitle}>We'd love to hear from you. Send us a message!</p>
        </div>

        <div className="row g-4">
          <div className="col-lg-5">
            <div className={styles.infoCard}>
              <h3>Get in Touch</h3>
              <div className={styles.infoItem}>
                <div className={styles.icon}><i className="bi bi-geo-alt-fill"></i></div>
                <div>
                  <strong>Address</strong>
                  <p>5-69, Vutukuru</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.icon}><i className="bi bi-telephone-fill"></i></div>
                <div>
                  <strong>Phone</strong>
                  <p>+91 9390773373</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.icon}><i className="bi bi-envelope-fill"></i></div>
                <div>
                  <strong>Email</strong>
                  <p>dhanushnerella1@gmail.com</p>
                </div>
              </div>
              <div className={styles.social}>
                <a href="https://www.linkedin.com/in/nerella-dhanush-045427291/" target="_blank" rel="noreferrer"><i className="bi bi-linkedin"></i></a>
                <a href="https://www.instagram.com/dhanush_nerella/" target="_blank" rel="noreferrer"><i className="bi bi-instagram"></i></a>
              </div>
            </div>

            <div className={styles.mapPlaceholder}>
              <i className="bi bi-geo-alt"></i>
              <p>Google Map Placeholder</p>
              <small>5-69, Vutukuru</small>
            </div>
          </div>

          <div className="col-lg-7">
            <div className={styles.formCard}>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Your Name</label>
                    <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Your Email</label>
                    <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Subject</label>
                  <input type="text" className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                    value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                  {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Message</label>
                  <textarea className={`form-control ${errors.message ? 'is-invalid' : ''}`} rows="5"
                    value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                </div>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;
