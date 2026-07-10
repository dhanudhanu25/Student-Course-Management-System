const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Enroll in a course
// @route   POST /api/enrollments
// @access  Private/Student
exports.createEnrollment = asyncHandler(async (req, res, next) => {
  const { courseId } = req.body;

  if (!courseId) {
    return next(new ErrorResponse('Course ID is required', 400));
  }

  const course = await Course.findById(courseId);
  if (!course) {
    return next(new ErrorResponse('Course not found', 404));
  }

  const existingEnrollment = await Enrollment.findOne({
    studentId: req.user._id,
    courseId,
  });

  if (existingEnrollment) {
    return next(new ErrorResponse('Already enrolled in this course', 400));
  }

  const enrollment = await Enrollment.create({
    studentId: req.user._id,
    courseId,
  });

  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { enrolledCourses: courseId },
  });

  const populatedEnrollment = await Enrollment.findById(enrollment._id)
    .populate('courseId')
    .populate('studentId', 'name email');

  res.status(201).json({
    success: true,
    message: 'Enrolled successfully',
    enrollment: populatedEnrollment,
  });
});

// @desc    Get enrollments
// @route   GET /api/enrollments
// @access  Private
exports.getEnrollments = asyncHandler(async (req, res) => {
  const query = {};

  if (req.user.role === 'student') {
    query.studentId = req.user._id;
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const total = await Enrollment.countDocuments(query);
  const enrollments = await Enrollment.find(query)
    .populate('courseId')
    .populate('studentId', 'name email profileImage')
    .sort({ enrolledDate: -1 })
    .skip(startIndex)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: enrollments.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    enrollments,
  });
});

// @desc    Delete enrollment
// @route   DELETE /api/enrollments/:id
// @access  Private
exports.deleteEnrollment = asyncHandler(async (req, res, next) => {
  const enrollment = await Enrollment.findById(req.params.id);

  if (!enrollment) {
    return next(new ErrorResponse('Enrollment not found', 404));
  }

  if (
    req.user.role === 'student' &&
    enrollment.studentId.toString() !== req.user._id.toString()
  ) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  await User.findByIdAndUpdate(enrollment.studentId, {
    $pull: { enrolledCourses: enrollment.courseId },
  });

  await enrollment.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Enrollment removed successfully',
  });
});

// @desc    Update enrollment progress
// @route   PUT /api/enrollments/progress/:id
// @access  Private/Student
exports.updateProgress = asyncHandler(async (req, res, next) => {
  const { progress } = req.body;

  if (progress === undefined || progress < 0 || progress > 100) {
    return next(new ErrorResponse('Progress must be between 0 and 100', 400));
  }

  const enrollment = await Enrollment.findById(req.params.id);

  if (!enrollment) {
    return next(new ErrorResponse('Enrollment not found', 404));
  }

  if (enrollment.studentId.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  enrollment.progress = progress;
  enrollment.completionStatus = progress >= 100 ? 'completed' : 'in-progress';

  await enrollment.save();

  const populatedEnrollment = await Enrollment.findById(enrollment._id).populate('courseId');

  res.status(200).json({
    success: true,
    message: 'Progress updated',
    enrollment: populatedEnrollment,
  });
});

// @desc    Get recent activity for student
// @route   GET /api/enrollments/recent
// @access  Private/Student
exports.getRecentActivity = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ studentId: req.user._id })
    .populate('courseId')
    .sort({ updatedAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    enrollments,
  });
});
