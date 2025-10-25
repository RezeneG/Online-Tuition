// backend/routes/courseRoutes.js
import express from 'express';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import User from '../models/User.js';

const router = express.Router();

// Get all courses with filtering
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      level, 
      search, 
      sort = 'popularity',
      maxPrice,
      page = 1,
      limit = 12
    } = req.query;

    // Build filter object
    let filter = { isPublished: true };
    
    if (category && category !== 'all') {
      const categories = category.split(',');
      filter.category = { $in: categories };
    }
    
    if (level && level !== 'all') {
      filter.level = level;
    }
    
    if (maxPrice) {
      filter.price = { $lte: parseInt(maxPrice) };
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { instructor: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    let sortOption = {};
    switch(sort) {
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'price-low':
        sortOption = { price: 1 };
        break;
      case 'price-high':
        sortOption = { price: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      default: // popularity
        sortOption = { students: -1 };
    }

    // Execute query
    const courses = await Course.find(filter)
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Course.countDocuments(filter);

    res.json({
      success: true,
      courses,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      filters: {
        category,
        level,
        search,
        sort,
        maxPrice
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single course
router.get('/:id', async (req, res) => {
  try {
    let course;
    
    // Check if ID is a number (courseId) or string (slug)
    if (!isNaN(req.params.id)) {
      course = await Course.findOne({ courseId: parseInt(req.params.id) });
    } else {
      course = await Course.findOne({ slug: req.params.id });
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      course
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Enroll in course
router.post('/:id/enroll', async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const { userId, userEmail } = req.body;

    if (!userId || !userEmail) {
      return res.status(400).json({
        success: false,
        message: 'User ID and email are required'
      });
    }

    // Check if course exists
    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ courseId, userId });
    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      courseId,
      userId,
      userEmail,
      status: 'active'
    });

    // Update course student count
    course.students += 1;
    await course.save();

    // Update user's enrolled courses
    await User.findOneAndUpdate(
      { userId },
      { $push: { enrolledCourses: { courseId, enrolledAt: new Date() } } }
    );

    res.status(201).json({
      success: true,
      enrollment,
      message: 'Successfully enrolled in course'
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Seed sample courses
router.post('/seed', async (req, res) => {
  try {
    const sampleCourses = [
      {
        title: "Web Basics: HTML & CSS",
        instructor: "Sarah Johnson",
        instructorId: 1,
        category: "web-dev",
        level: "beginner",
        duration: "8 weeks",
        price: 99,
        originalPrice: 149,
        rating: 4.7,
        reviews: 890,
        students: 1800,
        image: "HTML/CSS",
        badge: "Bestseller",
        description: "Learn the fundamentals of web development with HTML and CSS. Build beautiful, responsive websites from scratch.",
        learningObjectives: [
          "Build responsive websites",
          "Master CSS Flexbox and Grid",
          "Create modern web layouts",
          "Understand web accessibility"
        ],
        requirements: ["No prior experience needed", "Basic computer skills"],
        isPublished: true
      },
      {
        title: "Programming Fundamentals",
        instructor: "Mike Chen",
        instructorId: 2,
        category: "programming", 
        level: "beginner",
        duration: "6 weeks",
        price: 129,
        originalPrice: 199,
        rating: 4.8,
        reviews: 1200,
        students: 2400,
        image: "Python",
        badge: "Bestseller",
        description: "Master programming basics with Python. Learn to think like a programmer and solve real-world problems.",
        learningObjectives: [
          "Understand programming concepts",
          "Write Python programs",
          "Solve problems with code",
          "Debug and test applications"
        ],
        requirements: ["No coding experience required"],
        isPublished: true
      },
      {
        title: "Data Science Essentials",
        instructor: "Dr. Emily Roberts",
        instructorId: 3,
        category: "data-science",
        level: "intermediate",
        duration: "10 weeks",
        price: 249,
        originalPrice: null,
        rating: 4.5,
        reviews: 650,
        students: 1200,
        image: "Data",
        badge: "",
        description: "Dive into data analysis, visualization, and machine learning with Python and popular data science libraries.",
        learningObjectives: [
          "Data analysis with Pandas",
          "Data visualization",
          "Machine learning basics",
          "Statistical analysis"
        ],
        requirements: ["Basic Python knowledge", "Statistics fundamentals"],
        isPublished: true
      }
    ];

    // Clear existing courses and reset counter
    await Course.deleteMany({});
    const Counter = await import('../models/Counter.js').then(mod => mod.default);
    await Counter.findByIdAndUpdate('courseId', { sequence_value: 0 }, { upsert: true });

    const courses = await Course.insertMany(sampleCourses);

    res.json({
      success: true,
      message: 'Sample courses seeded successfully',
      courses: courses.length
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
