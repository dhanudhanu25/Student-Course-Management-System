import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { courseService } from '../services/courseService';
import styles from './Home.module.css';

const testimonials = [
  { name: 'Sarah Mitchell', role: 'Web Developer', text: 'SCMS transformed my learning journey. The courses are well-structured and the platform is incredibly intuitive.', rating: 5 },
  { name: 'David Chen', role: 'Data Analyst', text: 'I enrolled in 5 courses and completed 3 already. The progress tracking feature keeps me motivated every day.', rating: 5 },
  { name: 'Priya Sharma', role: 'Software Engineer', text: 'Best online learning platform I have used. The instructors are top-notch and the content is always up-to-date.', rating: 5 },
];

const features = [
  { icon: 'bi-book', title: 'Expert Instructors', desc: 'Learn from industry professionals with years of real-world experience.' },
  { icon: 'bi-laptop', title: 'Flexible Learning', desc: 'Study at your own pace with 24/7 access to all course materials.' },
  { icon: 'bi-award', title: 'Certificates', desc: 'Earn certificates upon course completion to boost your career.' },
  { icon: 'bi-people', title: 'Community Support', desc: 'Join a vibrant community of learners and grow together.' },
];

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await courseService.getFeatured();
        setCourses(data.courses);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <MainLayout>
      <section className={styles.hero}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <span className={styles.badge}>Welcome to SCMS</span>
              <h1 className={styles.heroTitle}>
                Unlock Your Potential with <span>Quality Education</span>
              </h1>
              <p className={styles.heroText}>
                Discover hundreds of courses taught by expert instructors. Enroll today
                and take the first step toward your dream career.
              </p>
              <div className={styles.heroActions}>
                <Link to="/courses" className="btn btn-primary btn-lg">Browse Courses</Link>
                <Link to="/signup" className="btn btn-outline-primary btn-lg">Get Started Free</Link>
              </div>
              <div className={styles.stats}>
                <div><strong>500+</strong><span>Courses</span></div>
                <div><strong>10K+</strong><span>Students</span></div>
                <div><strong>50+</strong><span>Instructors</span></div>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <div className={styles.heroImage}>
                <i className="bi bi-mortarboard-fill"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`py-5 ${styles.featured}`}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className={styles.sectionTitle}>Featured Courses</h2>
            <p className={styles.sectionSubtitle}>Explore our most popular courses</p>
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="row g-4">
              {courses.map((course) => (
                <div className="col-lg-4 col-md-6" key={course._id}>
                  <CourseCard course={course} showEnroll={false} />
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-4">
            <Link to="/courses" className="btn btn-primary">View All Courses</Link>
          </div>
        </div>
      </section>

      <section className={`py-5 ${styles.whyUs}`}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className={styles.sectionTitle}>Why Choose Us</h2>
            <p className={styles.sectionSubtitle}>Everything you need to succeed in your learning journey</p>
          </div>
          <div className="row g-4">
            {features.map((f) => (
              <div className="col-lg-3 col-md-6" key={f.title}>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}><i className={`bi ${f.icon}`}></i></div>
                  <h5>{f.title}</h5>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-5 ${styles.testimonials}`}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className={styles.sectionTitle}>Student Testimonials</h2>
            <p className={styles.sectionSubtitle}>Hear from our successful students</p>
          </div>
          <div className="row g-4">
            {testimonials.map((t) => (
              <div className="col-lg-4 col-md-6" key={t.name}>
                <div className={styles.testimonialCard}>
                  <div className={styles.stars}>
                    {[...Array(t.rating)].map((_, i) => (
                      <i key={i} className="bi bi-star-fill"></i>
                    ))}
                  </div>
                  <p className={styles.testimonialText}>"{t.text}"</p>
                  <div className={styles.testimonialAuthor}>
                    <div className={styles.authorAvatar}>{t.name.charAt(0)}</div>
                    <div>
                      <strong>{t.name}</strong>
                      <small>{t.role}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
