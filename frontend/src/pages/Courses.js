import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/MainLayout';
import CourseCard from '../components/CourseCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import { courseService } from '../services/courseService';
import { enrollmentService } from '../services/enrollmentService';
import styles from './Courses.module.css';

const CATEGORIES = [
  'all', 'Web Development', 'Data Science', 'Mobile Development',
  'Cloud Computing', 'Cybersecurity', 'AI & Machine Learning',
  'DevOps', 'UI/UX Design', 'Database', 'Programming',
];

const Courses = () => {
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isStudent } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9, sort: sort === 'newest' ? undefined : sort };
      if (category !== 'all') params.category = category;
      if (search) params.search = search;

      const { data } = await courseService.getCourses(params);
      setCourses(data.courses);
      setTotalPages(data.pages);

      if (isAuthenticated && isStudent) {
        const enrollRes = await enrollmentService.getEnrollments({ limit: 100 });
        setEnrolledIds(enrollRes.data.enrollments.map((e) => e.courseId?._id || e.courseId));
      }
    } catch (err) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, [page, category, search, sort, isAuthenticated, isStudent]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCourses();
  };

  const handleEnroll = async (courseId) => {
    if (!isAuthenticated) {
      toast.info('Please login to enroll');
      return;
    }
    try {
      await enrollmentService.enroll(courseId);
      setEnrolledIds([...enrolledIds, courseId]);
      toast.success('Enrolled successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    }
  };

  return (
    <MainLayout>
      <div className={`container py-4 ${styles.page}`}>
        <div className={styles.header}>
          <h1>Explore Courses</h1>
          <p>Find the perfect course to advance your skills</p>
        </div>

        <div className={styles.filters}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
          </form>
          <select
            className="form-select"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </select>
          <select
            className="form-select"
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
          >
            <option value="newest">Newest First</option>
            <option value="title">Title A-Z</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : courses.length === 0 ? (
          <div className={styles.empty}>
            <i className="bi bi-search"></i>
            <h3>No courses found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {courses.map((course) => (
                <div className="col-lg-4 col-md-6" key={course._id}>
                  <CourseCard
                    course={course}
                    onEnroll={handleEnroll}
                    isEnrolled={enrolledIds.includes(course._id)}
                    showEnroll={isStudent || !isAuthenticated}
                  />
                </div>
              ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Courses;
