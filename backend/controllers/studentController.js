const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin
exports.getStudents = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const query = { role: 'student' };

  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
      { phone: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const total = await User.countDocuments(query);
  const students = await User.find(query)
    .select('-password')
    .populate('enrolledCourses')
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: students.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    students,
  });
});

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private/Admin
exports.getStudent = asyncHandler(async (req, res, next) => {
  const student = await User.findOne({ _id: req.params.id, role: 'student' })
    .select('-password')
    .populate('enrolledCourses');

  if (!student) {
    return next(new ErrorResponse('Student not found', 404));
  }

  res.status(200).json({
    success: true,
    student,
  });
});

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
exports.deleteStudent = asyncHandler(async (req, res, next) => {
  const student = await User.findOne({ _id: req.params.id, role: 'student' });

  if (!student) {
    return next(new ErrorResponse('Student not found', 404));
  }

  await student.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Student deleted successfully',
  });
});
