const MIN_COURSE_PRICE = 1501;

const SEED_COURSE_PRICES = {
  'Complete React.js Masterclass': 3999,
  'Node.js & Express Backend Development': 3499,
  'Full Stack MERN Development': 6499,
  'Python for Data Science': 4499,
  'Machine Learning Fundamentals': 5499,
  'Deep Learning with TensorFlow': 5999,
  'React Native Mobile Apps': 4999,
  'Flutter Development Bootcamp': 4499,
  'AWS Cloud Practitioner': 3999,
  'Docker & Kubernetes Mastery': 4999,
  'Cybersecurity Essentials': 5499,
  'Ethical Hacking & Penetration Testing': 6499,
  'UI/UX Design Principles': 2999,
  'MongoDB Database Design': 2499,
  'SQL & PostgreSQL Mastery': 3499,
  'Java Programming Complete Course': 3999,
  'C++ for Game Development': 4999,
  'TypeScript for Modern Web': 1999,
  'GraphQL API Development': 2999,
  'Data Visualization with D3.js': 3499,
  'CI/CD Pipeline with Jenkins': 3999,
  'Vue.js 3 Complete Guide': 3499,
};

const normalizePrice = (price, title) => {
  let value = Number(price);

  if (SEED_COURSE_PRICES[title]) {
    value = SEED_COURSE_PRICES[title];
  }

  if (Number.isNaN(value) || value <= 1500) {
    value = 1999;
  }

  return value;
};

module.exports = {
  MIN_COURSE_PRICE,
  SEED_COURSE_PRICES,
  normalizePrice,
};
