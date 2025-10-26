// backend/routes/courseRoutes.js
import express from 'express';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import User from '../models/User.js';

const router = express.Router();

// SEED ENDPOINT - Add sample data here
router.post('/seed', async (req, res) => {
  try {
    const sampleCourses = [
      // ONLINE COURSE
      {
        title: "Web Development Masterclass",
        description: "Learn full-stack web development with modern technologies through online sessions",
        category: "web-dev",
        level: "Beginner",
        teachingMode: "online",
        onlinePlatform: "zoom",
        price: 99,
        duration: "8 weeks",
        instructor: "Sarah Johnson",
        instructorId: 1001,
        learningObjectives: [
          "Build responsive websites", 
          "Master JavaScript frameworks",
          "Deploy applications to cloud"
        ],
        requirements: [
          "Basic computer skills", 
          "Internet connection"
        ],
        badge: "Bestseller",
        studentsEnrolled: 45,
        rating: 4.7,
        reviews: 120
      },
      
      // FACE-TO-FACE COURSE
      {
        title: "Python Programming Workshop",
        description: "Hands-on Python programming in our London classroom",
        category: "programming",
        level: "Beginner", 
        teachingMode: "face-to-face",
        location: {
          address: "123 Tech Street, Innovation District",
          city: "London",
          postcode: "SW1A 1AA"
        },
        schedule: [{
          day: "saturday",
          startTime: "10:00",
          endTime: "13:00",
          frequency: "weekly"
        }],
        price: 149,
        maxStudents: 15,
        currentEnrollment: 8,
        duration: "6 weeks",
        instructor: "Mike Chen",
        instructorId: 1002,
        learningObjectives: [
          "Python syntax and fundamentals",
          "Problem-solving with code", 
          "Build real-world applications"
        ],
        requirements: [
          "No prior experience needed", 
          "Laptop required"
        ],
        badge: "Popular",
        studentsEnrolled: 8,
        rating: 4.8,
        reviews: 89
      },
      
      // HYBRID COURSE
      {
        title: "Data Science Bootcamp",
        description: "Comprehensive data science training with both online and in-person sessions",
        category: "data-science",
        level: "Intermediate",
        teachingMode: "hybrid", 
        location: {
          address: "456 Data Lane, Tech Hub",
          city: "Manchester", 
          postcode: "M1 1AB"
        },
        schedule: [{
          day: "wednesday",
          startTime: "18:00",
          endTime: "20:00", 
          frequency: "weekly"
        }],
        onlinePlatform: "teams",
        price: 199,
        maxStudents: 25,
        currentEnrollment: 12,
        duration: "10 weeks",
        instructor: "Dr. Emily Roberts",
        instructorId: 1003,
        learningObjectives: [
          "Data analysis with Python",
          "Machine learning algorithms",
          "Data visualization techniques"
        ],
        requirements: [
          "Basic Python knowledge", 
          "Statistics fundamentals"
        ],
        badge: "New",
        studentsEnrolled: 12,
        rating: 4.5,
        reviews: 67
      },
      
      // ADD MORE COURSES AS NEEDED
      {
        title: "Digital Marketing Fundamentals",
        description: "Learn to market businesses effectively in the digital age",
        category: "business",
        level: "Beginner",
        teachingMode: "online",
        onlinePlatform: "google-meet", 
        price: 79,
        duration: "4 weeks",
        instructor: "Lisa Wang",
        instructorId: 1004,
        badge: "Trending",
        studentsEnrolled: 23,
        rating: 4.6,
        reviews: 45
      },
      {
        title: "Mobile App Development",
        description: "Build iOS and Android apps with React Native - in-person classes",
        category: "mobile-dev",
        level: "Intermediate",
        teachingMode: "face-to-face",
        location: {
          address: "789 App Avenue",
          city: "Birmingham",
          postcode: "B1 1AB"
        },
        schedule: [{
          day: "tuesday",
          startTime: "19:00",
          endTime: "21:00",
          frequency: "weekly"
        }],
        price: 179,
        maxStudents: 12,
        currentEnrollment: 6,
        duration: "8 weeks",
        instructor: "James Wilson",
        instructorId: 1005,
        badge: "New",
        studentsEnrolled: 6,
        rating: 4.9,
        reviews: 34
      }
    ];

    // Clear existing courses
    await Course.deleteMany({});
    
    // Insert new sample courses
    const courses = await Course.insertMany(sampleCourses);

    res.json({
      success: true,
      message: 'Sample courses seeded successfully',
      courses: courses.length,
      teachingModes: {
        online: courses.filter(c => c.teachingMode === 'online').length,
        faceToFace: courses.filter(c => c.teachingMode === 'face-to-face').length,
        hybrid: courses.filter(c => c.teachingMode === 'hybrid').length
      }
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Your other course routes...
router.get('/', async (req, res) => {
  // Your existing get courses logic
});

router.get('/:id', async (req, res) => {
  // Your existing get single course logic
});

export default router;
