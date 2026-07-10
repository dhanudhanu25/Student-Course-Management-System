const mongoose = require('mongoose');
const { MIN_COURSE_PRICE } = require('../utils/coursePricing');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, default: '30 min' },
  content: { type: String, default: '' },
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
    },
    instructor: {
      type: String,
      required: [true, 'Instructor name is required'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Web Development',
        'Data Science',
        'Mobile Development',
        'Cloud Computing',
        'Cybersecurity',
        'AI & Machine Learning',
        'DevOps',
        'UI/UX Design',
        'Database',
        'Programming',
      ],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [MIN_COURSE_PRICE, `Price must be greater than ₹1500`],
    },
    lessons: [lessonSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Course', courseSchema);
