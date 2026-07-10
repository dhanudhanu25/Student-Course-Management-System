const IMG = (id, query = 'w=600&h=400&fit=crop') =>
  `https://images.unsplash.com/photo-${id}?${query}`;

export const COURSE_IMAGES = {
  'Complete React.js Masterclass': IMG('1633356122544-f134324a6cee'),
  'Node.js & Express Backend Development': IMG('1555066931-4365d14bab8c'),
  'Full Stack MERN Development': IMG('1498050108023-c5249f4df085'),
  'Python for Data Science': IMG('1526374965318-7f61d4dc18c5'),
  'Machine Learning Fundamentals': IMG('1677442136019-21780ecad995'),
  'Deep Learning with TensorFlow': IMG('1620712943543-bcc4688e7485'),
  'React Native Mobile Apps': IMG('1512949206161-90d852a82c8b'),
  'Flutter Development Bootcamp': IMG('1511707171634-5f897ff02aa9'),
  'AWS Cloud Practitioner': IMG('1451187580459-43490279c0fa'),
  'Docker & Kubernetes Mastery': IMG('1667372393119-3d4c48d07fcb'),
  'Cybersecurity Essentials': IMG('1563986768609-322da13575f3'),
  'Ethical Hacking & Penetration Testing': IMG('1550751827-4bd374c3f58b'),
  'UI/UX Design Principles': IMG('1561070791-2526d30994b5'),
  'MongoDB Database Design': IMG('1544197150-b99a580bb7a8'),
  'SQL & PostgreSQL Mastery': IMG('1544383832-bda2bc66a55d'),
  'Java Programming Complete Course': IMG('1517694712202-14dd9538aa90'),
  'C++ for Game Development': IMG('1538481199705-c710c4e213fc'),
  'TypeScript for Modern Web': IMG('1587620962725-abab7fe55159'),
  'GraphQL API Development': IMG('1558494949-ef010cbdcc31'),
  'Data Visualization with D3.js': IMG('1460925895917-afdab827c52f'),
  'CI/CD Pipeline with Jenkins': IMG('1618477388954-7852f326625c'),
  'Vue.js 3 Complete Guide': IMG('1593720213428-28a5b9e94613'),
};

export const CATEGORY_IMAGES = {
  'Web Development': IMG('1498050108023-c5249f4df085'),
  'Data Science': IMG('1551288049-bebda4e38f71'),
  'Mobile Development': IMG('1512949206161-90d852a82c8b'),
  'Cloud Computing': IMG('1451187580459-43490279c0fa'),
  'Cybersecurity': IMG('1563986768609-322da13575f3'),
  'AI & Machine Learning': IMG('1677442136019-21780ecad995'),
  DevOps: IMG('1667372393119-3d4c48d07fcb'),
  'UI/UX Design': IMG('1561070791-2526d30994b5'),
  Database: IMG('1544383832-bda2bc66a55d'),
  Programming: IMG('1516116216624-53e697fedbea'),
};

export const DEFAULT_COURSE_IMAGE = IMG('1522202176988-66273c2fd55f');

const isGenericThumbnail = (thumbnail) =>
  !thumbnail ||
  thumbnail.includes('picsum.photos') ||
  thumbnail.includes('ui-avatars.com');

export const getCourseThumbnail = (course) => {
  if (!course) return DEFAULT_COURSE_IMAGE;

  if (!isGenericThumbnail(course.thumbnail)) {
    return course.thumbnail.startsWith('http') ? course.thumbnail : course.thumbnail;
  }

  return COURSE_IMAGES[course.title] || CATEGORY_IMAGES[course.category] || DEFAULT_COURSE_IMAGE;
};
