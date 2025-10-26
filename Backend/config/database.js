// config/database.js
import mongoose from 'mongoose';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Counter from '../models/Counter.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/online-tuition',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Initialize counters and sample data
    await initializeData();
    
    return true;
  } catch (error) {
    console.log('⚠️  MongoDB connection failed, using in-memory data');
    console.log('💡 To use real database:');
    console.log('   1. Install MongoDB locally or use MongoDB Atlas');
    console.log('   2. Add MONGODB_URI to your .env file');
    return false;
  }
};

const initializeData = async () => {
  try {
    // Check if we already have data
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('📦 Initializing sample data...');
      
      // Create initial counters
      await Counter.create([
        { _id: 'userId', sequence_value: 1000 },
        { _id: 'courseId', sequence_value: 100 },
        { _id: 'enrollmentId', sequence_value: 500 }
      ]);

      // Create sample users
      const sampleUsers = [
        {
          name: 'Admin User',
          email: 'admin@tuition.com',
          password: 'admin123',
          role: 'admin',
          profile: {
            bio: 'Platform Administrator',
            phone: '+1234567890',
            location: {
              city: 'London',
              postcode: 'SW1A 1AA'
            }
          }
        },
        {
          name: 'Dr. Sarah Johnson',
          email: 'sarah@tuition.com',
          password: 'instructor123',
          role: 'instructor',
          profile: {
            bio: 'Senior Python Instructor with 10+ years experience',
            phone: '+1234567891',
            location: {
              city: 'Manchester',
              postcode: 'M1 1AB'
            },
            preferences: {
              teachingMode: 'both'
            }
          }
        },
        {
          name: 'John Student',
          email: 'john@student.com',
          password: 'student123',
          role: 'student',
          profile: {
            bio: 'Aspiring web developer',
            phone: '+1234567892',
            location: {
              city: 'Birmingham',
              postcode: 'B1 1BC'
            },
            preferences: {
              teachingMode: 'online'
            }
          }
        }
      ];

      await User.create(sampleUsers);
      console.log('✅ Sample users created');

      // Create sample courses
      const sampleCourses = [
        {
          title: 'Complete Web Development Bootcamp',
          description: 'Learn full-stack web development from scratch. Build real-world projects and master modern technologies.',
          instructor: 'Dr. Sarah Johnson',
          instructorId: 1002, // Sarah's userId
          price: 199,
          duration: '12 weeks',
          category: 'web-dev',
          level: 'beginner',
          teachingModes: ['online', 'face-to-face'],
          details: {
            syllabus: [
              { week: 1, topic: 'HTML & CSS Fundamentals', description: 'Learn the building blocks of web development' },
              { week: 2, topic: 'JavaScript Basics', description: 'Master JavaScript programming fundamentals' }
            ],
            requirements: ['Basic computer knowledge', 'No prior programming experience required'],
            learningOutcomes: ['Build responsive websites', 'Create web applications', 'Understand full-stack development']
          },
          schedule: {
            startDate: new Date('2024-02-01'),
            endDate: new Date('2024-04-25'),
            sessions: [
              { day: 'Monday', time: '18:00-20:00', mode: 'online', location: 'Virtual Classroom' },
              { day: 'Wednesday', time: '18:00-20:00', mode: 'face-to-face', location: 'London Campus' }
            ]
          },
          enrollment: {
            maxStudents: 30,
            totalStudents: 15
          },
          status: 'published'
        },
        {
          title: 'Advanced Python Programming',
          description: 'Master advanced Python concepts including data structures, algorithms, and professional development practices.',
          instructor: 'Dr. Sarah Johnson',
          instructorId: 1002,
          price: 149,
          duration: '8 weeks',
          category: 'programming',
          level: 'intermediate',
          teachingModes: ['online'],
          details: {
            syllabus: [
              { week: 1, topic: 'Advanced Data Structures', description: 'Master lists, dictionaries, and custom data structures' },
              { week: 2, topic: 'Algorithm Design', description: 'Learn efficient algorithm implementation' }
            ],
            requirements: ['Basic Python knowledge', 'Understanding of programming concepts'],
            learningOutcomes: ['Advanced Python skills', 'Algorithm design', 'Professional coding practices']
          },
          schedule: {
            startDate: new Date('2024-02-15'),
            endDate: new Date('2024-04-05'),
            sessions: [
              { day: 'Tuesday', time: '19:00-21:00', mode: 'online', location: 'Virtual Classroom' },
              { day: 'Thursday', time: '19:00-21:00', mode: 'online', location: 'Virtual Classroom' }
            ]
          },
          enrollment: {
            maxStudents: 25,
            totalStudents: 12
          },
          status: 'published'
        }
      ];

      await Course.create(sampleCourses);
      console.log('✅ Sample courses created');
    }
  } catch (error) {
    console.log('⚠️ Error initializing sample data:', error.message);
  }
};

// Fallback in-memory data structure
const inMemoryData = {
  users: [
    {
      userId: 1001,
      name: 'Admin User',
      email: 'admin@tuition.com',
      role: 'admin',
      profile: {
        bio: 'Platform Administrator',
        location: { city: 'London', postcode: 'SW1A 1AA' }
      },
      isActive: true
    },
    {
      userId: 1002,
      name: 'John Student', 
      email: 'john@student.com',
      role: 'student',
      profile: {
        bio: 'Aspiring web developer',
        location: { city: 'Birmingham', postcode: 'B1 1BC' }
      },
      isActive: true
    }
  ],
  courses: [
    {
      courseId: 101,
      title: 'Complete Web Development Bootcamp',
      instructor: 'Dr. Sarah Johnson',
      price: 199,
      category: 'web-dev',
      level: 'beginner',
      teachingModes: ['online', 'face-to-face'],
      status: 'published',
      enrollment: { totalStudents: 15 }
    },
    {
      courseId: 102,
      title: 'Advanced Python Programming',
      instructor: 'Dr. Sarah Johnson', 
      price: 149,
      category: 'programming',
      level: 'intermediate',
      teachingModes: ['online'],
      status: 'published',
      enrollment: { totalStudents: 12 }
    }
  ]
};

export default connectDB;
export { inMemoryData };
