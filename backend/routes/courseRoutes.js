const express = require('express');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getFeaturedCourses,
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/featured/list', getFeaturedCourses);
router.route('/').get(getCourses).post(protect, authorize('admin'), upload.single('thumbnail'), createCourse);
router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('admin'), upload.single('thumbnail'), updateCourse)
  .delete(protect, authorize('admin'), deleteCourse);

module.exports = router;
