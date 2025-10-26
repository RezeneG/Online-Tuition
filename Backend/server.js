import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

console.log('Starting Online Tuition Backend Server...');

const app = express();

app.use(cors());
app.use(express.json());

const courses = [
  {
    id: 1,
    title: "Web Development Basics",
    instructor: "John Smith",
    price: 99,
    duration: "8 weeks",
    category: "web-dev",
    level: "beginner",
    rating: 4.7,
    students: 1500
  },
  {
    id: 2,
    title: "Python Programming",
    instructor: "Sarah Johnson", 
    price: 129,
    duration: "6 weeks",
    category: "programming",
    level: "beginner",
    rating: 4.8,
    students: 2000
  },
  {
    id: 3,
    title: "Data Science Fundamentals",
    instructor: "Dr. Emily Chen",
    price: 199,
    duration: "10 weeks",
    category: "data-science", 
    level: "intermediate",
    rating: 4.5,
    students: 800
  }
];

app.get('/', (req, res) => {
  res.json({ 
    message: 'Online Tuition Backend API',
    version: '1.0.0',
    status: 'Running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/courses', (req, res) => {
  const category = req.query.category;
  const level = req.query.level;
  const search = req.query.search;
  
  let filteredCourses = courses;
  
  if (category) {
    filteredCourses = filteredCourses.filter(course => course.category === category);
  }
  
  if (level) {
    filteredCourses = filteredCourses.filter(course => course.level === level);
  }
  
  if (search) {
    filteredCourses = filteredCourses.filter(course =>
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.instructor.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json({
    success: true,
    courses: filteredCourses,
    total: filteredCourses.length
  });
});

app.get('/api/courses/:id', (req, res) => {
  const courseId = parseInt(req.params.id);
  const course = courses.find(c => c.id === courseId);
  
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
});

app.post('/api/auth/register', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email and password'
    });
  }
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: {
      id: Date.now(),
      name: name,
      email: email,
      role: 'student'
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }
  
  res.json({
    success: true,
    message: 'Login successful',
    user: {
      id: 1,
      name: 'Test User',
      email: email,
      role: 'student'
    },
    token: 'mock-jwt-token-' + Date.now()
  });
});

app.post('/api/courses/:id/enroll', (req, res) => {
  const courseId = parseInt(req.params.id);
  const userId = req.body.userId;
  const userEmail = req.body.userEmail;
  
  const course = courses.find(c => c.id === courseId);
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Successfully enrolled in course',
    enrollment: {
      id: Date.now(),
      courseId: courseId,
      userId: userId,
      userEmail: userEmail,
      enrolledAt: new Date().toISOString()
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('==================================================');
  console.log('ONLINE TUITION BACKEND SERVER STARTED');
  console.log('==================================================');
  console.log('Port: ' + PORT);
  console.log('Environment: ' + (process.env.NODE_ENV || 'development'));
  console.log('Time: ' + new Date().toLocaleString());
  console.log('URL: http://localhost:' + PORT);
  console.log('==================================================');
});
