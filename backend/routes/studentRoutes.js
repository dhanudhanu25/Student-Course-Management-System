const express = require('express');
const { getStudents, getStudent, deleteStudent } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('admin'));

router.route('/').get(getStudents);
router.route('/:id').get(getStudent).delete(deleteStudent);

module.exports = router;
