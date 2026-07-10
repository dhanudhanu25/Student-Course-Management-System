require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Course = require('../models/Course');
const { normalizePrice, MIN_COURSE_PRICE } = require('./coursePricing');

const updateCoursePrices = async () => {
  try {
    await connectDB();

    const courses = await Course.find();
    let updated = 0;

    for (const course of courses) {
      const newPrice = normalizePrice(course.price, course.title);

      if (course.price !== newPrice) {
        course.price = newPrice;
        await course.save();
        updated += 1;
        console.log(`Updated ${course.title}: ₹${newPrice}`);
      }
    }

    console.log(`\nDone. ${updated} courses updated. Minimum price is ₹${MIN_COURSE_PRICE}.`);
    process.exit(0);
  } catch (error) {
    console.error('Price update error:', error);
    process.exit(1);
  }
};

updateCoursePrices();
