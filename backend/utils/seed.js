require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { getCourseImage } = require('./courseImages');

const coursesData = [
  {
    title: 'Complete React.js Masterclass',
    instructor: 'Sarah Johnson',
    duration: '40 hours',
    category: 'Web Development',
    price: 3999,
    description: 'Master React.js from basics to advanced concepts including hooks, context, and Redux.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop',
  },
  {
    title: 'Node.js & Express Backend Development',
    instructor: 'Michael Chen',
    duration: '35 hours',
    category: 'Web Development',
    price: 3499,
    description: 'Build scalable REST APIs with Node.js, Express, and MongoDB.',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
  },
  {
    title: 'Full Stack MERN Development',
    instructor: 'David Williams',
    duration: '60 hours',
    category: 'Web Development',
    price: 6499,
    description: 'Complete MERN stack course covering MongoDB, Express, React, and Node.js.',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop',
  },
  {
    title: 'Python for Data Science',
    instructor: 'Emily Rodriguez',
    duration: '45 hours',
    category: 'Data Science',
    price: 4499,
    description: 'Learn Python programming for data analysis, visualization, and machine learning.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
  },
  {
    title: 'Machine Learning Fundamentals',
    instructor: 'Dr. James Park',
    duration: '50 hours',
    category: 'AI & Machine Learning',
    price: 5499,
    description: 'Introduction to ML algorithms, neural networks, and practical applications.',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
  },
  {
    title: 'Deep Learning with TensorFlow',
    instructor: 'Dr. Lisa Wang',
    duration: '55 hours',
    category: 'AI & Machine Learning',
    price: 5999,
    description: 'Build deep neural networks using TensorFlow and Keras frameworks.',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop',
  },
  {
    title: 'React Native Mobile Apps',
    instructor: 'Alex Turner',
    duration: '38 hours',
    category: 'Mobile Development',
    price: 4999,
    description: 'Create cross-platform mobile applications with React Native.',
    thumbnail: 'https://images.unsplash.com/photo-1512949206161-90d852a82c8b?w=600&h=400&fit=crop',
  },
  {
    title: 'Flutter Development Bootcamp',
    instructor: 'Maria Garcia',
    duration: '42 hours',
    category: 'Mobile Development',
    price: 4499,
    description: 'Build beautiful native apps for iOS and Android using Flutter and Dart.',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
  },
  {
    title: 'AWS Cloud Practitioner',
    instructor: 'Robert Kim',
    duration: '30 hours',
    category: 'Cloud Computing',
    price: 3999,
    description: 'Learn AWS fundamentals and prepare for cloud certification.',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
  },
  {
    title: 'Docker & Kubernetes Mastery',
    instructor: 'Chris Anderson',
    duration: '28 hours',
    category: 'DevOps',
    price: 4999,
    description: 'Containerize applications and orchestrate with Kubernetes.',
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fcb?w=600&h=400&fit=crop',
  },
  {
    title: 'Cybersecurity Essentials',
    instructor: 'Jennifer Lee',
    duration: '32 hours',
    category: 'Cybersecurity',
    price: 5499,
    description: 'Learn network security, encryption, and ethical hacking basics.',
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop',
  },
  {
    title: 'Ethical Hacking & Penetration Testing',
    instructor: 'Mark Stevens',
    duration: '48 hours',
    category: 'Cybersecurity',
    price: 6499,
    description: 'Advanced penetration testing techniques and security assessment.',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop',
  },
  {
    title: 'UI/UX Design Principles',
    instructor: 'Anna Mueller',
    duration: '25 hours',
    category: 'UI/UX Design',
    price: 2999,
    description: 'Master user interface and experience design with Figma and Adobe XD.',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
  },
  {
    title: 'MongoDB Database Design',
    instructor: 'Tom Baker',
    duration: '22 hours',
    category: 'Database',
    price: 2499,
    description: 'NoSQL database design, aggregation, and performance optimization.',
    thumbnail: 'https://images.unsplash.com/photo-1544383832-bda2bc66a55d?w=600&h=400&fit=crop',
  },
  {
    title: 'SQL & PostgreSQL Mastery',
    instructor: 'Rachel Green',
    duration: '30 hours',
    category: 'Database',
    price: 3499,
    description: 'Advanced SQL queries, database design, and PostgreSQL administration.',
    thumbnail: 'https://images.unsplash.com/photo-1544383832-bda2bc66a55d?w=600&h=400&fit=crop',
  },
  {
    title: 'Java Programming Complete Course',
    instructor: 'Kevin Brown',
    duration: '50 hours',
    category: 'Programming',
    price: 3999,
    description: 'From Java basics to OOP, collections, and enterprise development.',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop',
  },
  {
    title: 'C++ for Game Development',
    instructor: 'Steve Miller',
    duration: '45 hours',
    category: 'Programming',
    price: 4999,
    description: 'Learn C++ programming for game engines and graphics programming.',
    thumbnail: 'https://images.unsplash.com/photo-1538481199705-c710c4e213fc?w=600&h=400&fit=crop',
  },
  {
    title: 'TypeScript for Modern Web',
    instructor: 'Laura Davis',
    duration: '20 hours',
    category: 'Web Development',
    price: 1999,
    description: 'Type-safe JavaScript development with TypeScript.',
    thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=400&fit=crop',
  },
  {
    title: 'GraphQL API Development',
    instructor: 'Paul Wilson',
    duration: '18 hours',
    category: 'Web Development',
    price: 2999,
    description: 'Build flexible APIs with GraphQL, Apollo Server, and Apollo Client.',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
  },
  {
    title: 'Data Visualization with D3.js',
    instructor: 'Nina Patel',
    duration: '24 hours',
    category: 'Data Science',
    price: 3499,
    description: 'Create stunning interactive data visualizations using D3.js.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
  },
  {
    title: 'CI/CD Pipeline with Jenkins',
    instructor: 'Brian Taylor',
    duration: '20 hours',
    category: 'DevOps',
    price: 3999,
    description: 'Automate build, test, and deployment pipelines with Jenkins and GitHub Actions.',
    thumbnail: 'https://images.unsplash.com/photo-1618477388954-7852f326625c?w=600&h=400&fit=crop',
  },
  {
    title: 'Vue.js 3 Complete Guide',
    instructor: 'Sophie Martin',
    duration: '35 hours',
    category: 'Web Development',
    price: 3499,
    description: 'Build modern web applications with Vue.js 3 Composition API.',
    thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=600&h=400&fit=crop',
  },
];

const generateLessons = (courseTitle) => [
  { title: `Introduction to ${courseTitle}`, duration: '45 min', content: 'Course overview and setup' },
  { title: 'Core Concepts', duration: '60 min', content: 'Fundamental principles and theory' },
  { title: 'Hands-on Practice', duration: '90 min', content: 'Practical exercises and projects' },
  { title: 'Advanced Topics', duration: '75 min', content: 'Deep dive into advanced features' },
  { title: 'Final Project', duration: '120 min', content: 'Capstone project and review' },
];

const studentsData = [
  { name: 'John Smith', email: 'john.smith@demo.com', phone: '9876543210', password: 'Student@123' },
  { name: 'Emma Wilson', email: 'emma.wilson@demo.com', phone: '9876543211', password: 'Student@123' },
  { name: 'Liam Johnson', email: 'liam.johnson@demo.com', phone: '9876543212', password: 'Student@123' },
  { name: 'Olivia Brown', email: 'olivia.brown@demo.com', phone: '9876543213', password: 'Student@123' },
  { name: 'Noah Davis', email: 'noah.davis@demo.com', phone: '9876543214', password: 'Student@123' },
  { name: 'Ava Martinez', email: 'ava.martinez@demo.com', phone: '9876543215', password: 'Student@123' },
  { name: 'William Garcia', email: 'william.garcia@demo.com', phone: '9876543216', password: 'Student@123' },
  { name: 'Sophia Anderson', email: 'sophia.anderson@demo.com', phone: '9876543217', password: 'Student@123' },
  { name: 'James Thomas', email: 'james.thomas@demo.com', phone: '9876543218', password: 'Student@123' },
  { name: 'Isabella Taylor', email: 'isabella.taylor@demo.com', phone: '9876543219', password: 'Student@123' },
  { name: 'Benjamin Moore', email: 'benjamin.moore@demo.com', phone: '9876543220', password: 'Student@123' },
  { name: 'Mia Jackson', email: 'mia.jackson@demo.com', phone: '9876543221', password: 'Student@123' },
  { name: 'Lucas White', email: 'lucas.white@demo.com', phone: '9876543222', password: 'Student@123' },
  { name: 'Charlotte Harris', email: 'charlotte.harris@demo.com', phone: '9876543223', password: 'Student@123' },
  { name: 'Henry Clark', email: 'henry.clark@demo.com', phone: '9876543224', password: 'Student@123' },
];

const adminData = {
  name: 'System Admin',
  email: 'admin@gmail.com',
  phone: '9999999999',
  password: 'Admin@123',
  role: 'admin',
};

const seedDatabase = async () => {
  try {
    await connectDB();

    await Enrollment.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();

    console.log('Cleared existing data...');

    const admin = await User.create(adminData);
    console.log(`Admin created: ${admin.email}`);

    const students = await User.create(
      studentsData.map((s) => ({ ...s, role: 'student' }))
    );
    console.log(`${students.length} students created`);

    const courses = await Course.create(
      coursesData.map((course) => {
        const { thumbnail: _removed, ...courseFields } = course;
        return {
          ...courseFields,
          thumbnail: getCourseImage(course.title, course.category),
          lessons: generateLessons(course.title),
        };
      })
    );
    console.log(`${courses.length} courses created`);

    const enrollmentData = [];
    for (let i = 0; i < students.length; i++) {
      const numEnrollments = Math.floor(Math.random() * 4) + 2;
      const shuffled = [...courses].sort(() => 0.5 - Math.random());
      const selectedCourses = shuffled.slice(0, numEnrollments);

      for (const course of selectedCourses) {
        const progress = Math.floor(Math.random() * 100);
        enrollmentData.push({
          studentId: students[i]._id,
          courseId: course._id,
          progress,
          completionStatus: progress >= 100 ? 'completed' : 'in-progress',
        });

        await User.findByIdAndUpdate(students[i]._id, {
          $addToSet: { enrolledCourses: course._id },
        });
      }
    }

    await Enrollment.insertMany(enrollmentData);
    console.log(`${enrollmentData.length} enrollments created`);

    console.log('\n=== Seed Data Summary ===');
    console.log(`Admin: ${adminData.email} / ${adminData.password}`);
    console.log('Demo Students (password: Student@123):');
    studentsData.slice(0, 5).forEach((s) => console.log(`  - ${s.email}`));
    console.log(`\nTotal Courses: ${courses.length}`);
    console.log(`Total Students: ${students.length}`);
    console.log(`Total Enrollments: ${enrollmentData.length}`);
    console.log('All prices are in Indian Rupees (INR)');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
