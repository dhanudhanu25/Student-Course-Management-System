require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Course = require('../models/Course');
const { getCourseImage } = require('./courseImages');

const updateCourseImages = async () => {
  try {
    await connectDB();

    const courses = await Course.find();
    let updated = 0;

    for (const course of courses) {
      const thumbnail = getCourseImage(course.title, course.category);
      if (course.thumbnail !== thumbnail) {
        course.thumbnail = thumbnail;
        await course.save();
        updated += 1;
        console.log(`Updated: ${course.title}`);
      }
    }

    console.log(`\nDone. ${updated} of ${courses.length} courses updated with relevant images.`);
    process.exit(0);
  } catch (error) {
    console.error('Update error:', error);
    process.exit(1);
  }
};

updateCourseImages();
