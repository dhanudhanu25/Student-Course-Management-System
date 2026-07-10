const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get analytics dashboard data
// @route   GET /api/analytics
// @access  Private/Admin
exports.getAnalytics = asyncHandler(async (req, res) => {
  const totalStudents = await User.countDocuments({ role: 'student' });
  const totalCourses = await Course.countDocuments();
  const totalEnrollments = await Enrollment.countDocuments();

  const enrollmentsByCategory = await Enrollment.aggregate([
    {
      $lookup: {
        from: 'courses',
        localField: 'courseId',
        foreignField: '_id',
        as: 'course',
      },
    },
    { $unwind: '$course' },
    {
      $group: {
        _id: '$course.category',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  const recentEnrollments = await Enrollment.find()
    .populate('studentId', 'name email')
    .populate('courseId', 'title')
    .sort({ enrolledDate: -1 })
    .limit(5);

  const monthlyEnrollments = await Enrollment.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$enrolledDate' },
          month: { $month: '$enrolledDate' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);

  res.status(200).json({
    success: true,
    analytics: {
      totalStudents,
      totalCourses,
      totalEnrollments,
      enrollmentsByCategory,
      recentEnrollments,
      monthlyEnrollments,
    },
  });
});
