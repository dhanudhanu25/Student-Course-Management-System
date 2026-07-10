const Course = require('../models/Course');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { getCourseImage } = require('../utils/courseImages');
const { normalizePrice } = require('../utils/coursePricing');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const startIndex = (page - 1) * limit;

  const query = {};

  if (req.query.category && req.query.category !== 'all') {
    query.category = req.query.category;
  }

  if (req.query.search) {
    query.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
      { instructor: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  let sortOption = { createdAt: -1 };
  if (req.query.sort === 'price-asc') sortOption = { price: 1 };
  if (req.query.sort === 'price-desc') sortOption = { price: -1 };
  if (req.query.sort === 'title') sortOption = { title: 1 };

  const total = await Course.countDocuments(query);
  const courses = await Course.find(query)
    .sort(sortOption)
    .skip(startIndex)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: courses.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    courses,
  });
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse(`Course not found with id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    course,
  });
});

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Admin
exports.createCourse = asyncHandler(async (req, res) => {
  const courseData = { ...req.body };

  if (req.file) {
    courseData.thumbnail = `/uploads/${req.file.filename}`;
  } else if (!courseData.thumbnail && courseData.title) {
    courseData.thumbnail = getCourseImage(courseData.title, courseData.category);
  }

  if (typeof courseData.lessons === 'string') {
    try {
      courseData.lessons = courseData.lessons ? JSON.parse(courseData.lessons) : [];
    } catch {
      courseData.lessons = [];
    }
  }

  if (courseData.price) {
    courseData.price = normalizePrice(courseData.price, courseData.title);
  }

  const course = await Course.create(courseData);

  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    course,
  });
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse(`Course not found with id ${req.params.id}`, 404));
  }

  const updateData = { ...req.body };

  if (req.file) {
    updateData.thumbnail = `/uploads/${req.file.filename}`;
  }

  if (typeof updateData.lessons === 'string') {
    try {
      updateData.lessons = updateData.lessons ? JSON.parse(updateData.lessons) : [];
    } catch {
      updateData.lessons = [];
    }
  }

  if (updateData.price) {
    updateData.price = normalizePrice(updateData.price, updateData.title || course.title);
  }

  course = await Course.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Course updated successfully',
    course,
  });
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse(`Course not found with id ${req.params.id}`, 404));
  }

  await course.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Course deleted successfully',
  });
});

// @desc    Get featured courses
// @route   GET /api/courses/featured/list
// @access  Public
exports.getFeaturedCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find().sort({ createdAt: -1 }).limit(6);

  res.status(200).json({
    success: true,
    courses,
  });
});
