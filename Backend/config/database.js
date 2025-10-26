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
            bio: 'Senior Web Development Instructor with 10+ years experience',
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
          name: 'Mr. David Chen',
          email: 'david@tuition.com',
          password: 'instructor123',
          role: 'instructor',
          profile: {
            bio: 'Mathematics Tutor specializing in GCSE and A-Level',
            phone: '+1234567893',
            location: {
              city: 'Manchester',
              postcode: 'M1 1AB'
            },
            preferences: {
              teachingMode: 'face-to-face'
            }
          }
        },
        {
          name: 'Dr. Emily Watson',
          email: 'emily@tuition.com',
          password: 'instructor123',
          role: 'instructor',
          profile: {
            bio: 'Data Science Expert and Machine Learning Specialist',
            phone: '+1234567894',
            location: {
              city: 'London',
              postcode: 'EC1A 1BB'
            },
            preferences: {
              teachingMode: 'online'
            }
          }
        },
        {
          name: 'Alex Thompson',
          email: 'alex@tuition.com',
          password: 'instructor123',
          role: 'instructor',
          profile: {
            bio: 'Mobile App Developer and React Native Expert',
            phone: '+1234567895',
            location: {
              city: 'Birmingham',
              postcode: 'B1 1BC'
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

      const createdUsers = await User.create(sampleUsers);
      console.log('✅ Sample users created');

      // Create comprehensive sample courses
      const sampleCourses = [
        {
          title: 'Complete Web Development Bootcamp',
          description: 'Learn full-stack web development from scratch. Build real-world projects and master modern technologies including HTML, CSS, JavaScript, React, and Node.js.',
          instructor: 'Dr. Sarah Johnson',
          instructorId: 1002,
          price: 299,
          duration: '12 weeks',
          category: 'web-dev',
          level: 'beginner',
          teachingMode: 'hybrid',
          location: {
            address: '123 Tech Street',
            city: 'London',
            postcode: 'SW1A 1AA'
          },
          schedule: [
            {
              day: 'monday',
              startTime: '18:00',
              endTime: '20:00',
              frequency: 'weekly'
            },
            {
              day: 'wednesday',
              startTime: '18:00',
              endTime: '20:00',
              frequency: 'weekly'
            }
          ],
          onlinePlatform: 'zoom',
          maxStudents: 25,
          currentEnrollment: 18,
          image: '/images/web-dev.jpg',
          rating: 4.8,
          reviews: 47,
          studentsEnrolled: 156,
          details: {
            syllabus: [
              { week: 1, topic: 'HTML & CSS Fundamentals', description: 'Learn the building blocks of web development' },
              { week: 2, topic: 'JavaScript Basics', description: 'Master JavaScript programming fundamentals' },
              { week: 3, topic: 'Advanced CSS and Responsive Design', description: 'Create beautiful, responsive layouts' },
              { week: 4, topic: 'DOM Manipulation', description: 'Interactive web pages with JavaScript' }
            ],
            requirements: ['Basic computer knowledge', 'No prior programming experience required'],
            learningOutcomes: ['Build responsive websites', 'Create full-stack applications', 'Understand modern web technologies', 'Deploy applications to production']
          },
          badge: 'Bestseller',
          status: 'published'
        },
        {
          title: 'Advanced Python Programming',
          description: 'Master advanced Python concepts including data structures, algorithms, and professional development practices. Perfect for intermediate developers.',
          instructor: 'Dr. Sarah Johnson',
          instructorId: 1002,
          price: 199,
          duration: '8 weeks',
          category: 'programming',
          level: 'intermediate',
          teachingMode: 'online',
          onlinePlatform: 'teams',
          maxStudents: 30,
          currentEnrollment: 22,
          image: '/images/python.jpg',
          rating: 4.6,
          reviews: 32,
          studentsEnrolled: 89,
          details: {
            syllabus: [
              { week: 1, topic: 'Advanced Data Structures', description: 'Master lists, dictionaries, and custom data structures' },
              { week: 2, topic: 'Algorithm Design', description: 'Learn efficient algorithm implementation' },
              { week: 3, topic: 'Object-Oriented Programming', description: 'Advanced OOP concepts and patterns' },
              { week: 4, topic: 'Python for Web Development', description: 'Django and Flask frameworks' }
            ],
            requirements: ['Basic Python knowledge', 'Understanding of programming concepts'],
            learningOutcomes: ['Master advanced data structures', 'Implement efficient algorithms', 'Learn professional coding practices', 'Build complex applications']
          },
          badge: 'Popular',
          status: 'published'
        },
        {
          title: 'Face-to-Face Mathematics Tutoring',
          description: 'Personalized mathematics tutoring for GCSE and A-Level students. Small group sessions with experienced mathematics tutors.',
          instructor: 'Mr. David Chen',
          instructorId: 1003,
          price: 149,
          duration: '10 weeks',
          category: 'math',
          level: 'intermediate',
          teachingMode: 'face-to-face',
          location: {
            address: '456 Education Lane',
            city: 'Manchester',
            postcode: 'M1 1AB'
          },
          schedule: [
            {
              day: 'tuesday',
              startTime: '16:00',
              endTime: '18:00',
              frequency: 'weekly'
            },
            {
              day: 'thursday',
              startTime: '16:00',
              endTime: '18:00',
              frequency: 'weekly'
            }
          ],
          maxStudents: 8,
          currentEnrollment: 6,
          image: '/images/math.jpg',
          rating: 4.9,
          reviews: 28,
          studentsEnrolled: 42,
          details: {
            syllabus: [
              { week: 1, topic: 'Algebra Fundamentals', description: 'Equations, inequalities, and expressions' },
              { week: 2, topic: 'Geometry and Trigonometry', description: 'Shapes, angles, and trigonometric functions' },
              { week: 3, topic: 'Calculus Introduction', description: 'Limits, derivatives, and integrals' },
              { week: 4, topic: 'Statistics and Probability', description: 'Data analysis and probability theory' }
            ],
            requirements: ['Basic mathematics knowledge', 'GCSE mathematics foundation'],
            learningOutcomes: ['Master GCSE/A-Level mathematics', 'Improve problem-solving skills', 'Prepare for examinations', 'Build mathematical confidence']
          },
          badge: 'Trending',
          status: 'published'
        },
        {
          title: 'Data Science Fundamentals',
          description: 'Introduction to data science concepts, tools, and techniques. Learn Python for data analysis, visualization, and basic machine learning.',
          instructor: 'Dr. Emily Watson',
          instructorId: 1004,
          price: 249,
          duration: '10 weeks',
          category: 'data-science',
          level: 'beginner',
          teachingMode: 'online',
          onlinePlatform: 'google-meet',
          maxStudents: 50,
          currentEnrollment: 35,
          image: '/images/data-science.jpg',
          rating: 4.7,
          reviews: 41,
          studentsEnrolled: 127,
          details: {
            syllabus: [
              { week: 1, topic: 'Python for Data Science', description: 'Pandas, NumPy, and data manipulation' },
              { week: 2, topic: 'Data Visualization', description: 'Matplotlib, Seaborn, and Plotly' },
              { week: 3, topic: 'Statistical Analysis', description: 'Descriptive and inferential statistics' },
              { week: 4, topic: 'Machine Learning Basics', description: 'Introduction to ML algorithms' }
            ],
            requirements: ['Basic programming knowledge', 'Understanding of mathematics'],
            learningOutcomes: ['Understand data science workflow', 'Master Python for data analysis', 'Create data visualizations', 'Build basic machine learning models']
          },
          badge: 'New',
          status: 'published'
        },
        {
          title: 'Mobile App Development with React Native',
          description: 'Build cross-platform mobile applications for iOS and Android using React Native. Learn to create professional mobile apps from scratch.',
          instructor: 'Alex Thompson',
          instructorId: 1005,
          price: 279,
          duration: '10 weeks',
          category: 'mobile-dev',
          level: 'intermediate',
          teachingMode: 'hybrid',
          location: {
            address: '789 App Avenue',
            city: 'Birmingham',
            postcode: 'B1 1BC'
          },
          schedule: [
            {
              day: 'monday',
              startTime: '19:00',
              endTime: '21:00',
              frequency: 'weekly'
            },
            {
              day: 'friday',
              startTime: '19:00',
              endTime: '21:00',
              frequency: 'weekly'
            }
          ],
          onlinePlatform: 'zoom',
          maxStudents: 20,
          currentEnrollment: 15,
          image: '/images/mobile-dev.jpg',
          rating: 4.5,
          reviews: 23,
          studentsEnrolled: 78,
          details: {
            syllabus: [
              { week: 1, topic: 'React Native Fundamentals', description: 'Setting up development environment' },
              { week: 2, topic: 'Components and Props', description: 'Building reusable UI components' },
              { week: 3, topic: 'Navigation and Routing', description: 'App navigation patterns' },
              { week: 4, topic: 'State Management', description: 'Managing app state effectively' }
            ],
            requirements: ['Basic JavaScript knowledge', 'Understanding of React basics'],
            learningOutcomes: ['Build cross-platform mobile apps', 'Master React Native framework', 'Implement mobile UI/UX design', 'Publish apps to app stores']
          },
          badge: 'Trending',
          status: 'published'
        },
        {
          title: 'Cybersecurity Essentials',
          description: 'Learn fundamental cybersecurity concepts, threat detection, and protection strategies. Essential for anyone in IT or digital business.',
          instructor: 'Security Expert Team',
          instructorId: 1006,
          price: 189,
          duration: '8 weeks',
          category: 'cybersecurity',
          level: 'beginner',
          teachingMode: 'online',
          onlinePlatform: 'teams',
          maxStudents: 40,
          currentEnrollment: 32,
          image: '/images/cybersecurity.jpg',
          rating: 4.8,
          reviews: 56,
          studentsEnrolled: 145,
          details: {
            syllabus: [
              { week: 1, topic: 'Cybersecurity Fundamentals', description: 'Basic concepts and terminology' },
              { week: 2, topic: 'Network Security', description: 'Protecting network infrastructure' },
              { week: 3, topic: 'Threat Detection', description: 'Identifying security threats' },
              { week: 4, topic: 'Security Policies', description: 'Developing effective security strategies' }
            ],
            requirements: ['Basic computer knowledge', 'Interest in security topics'],
            learningOutcomes: ['Understand cybersecurity threats', 'Implement security measures', 'Learn encryption techniques', 'Develop security policies']
          },
          badge: 'Popular',
          status: 'published'
        },
        {
          title: 'Digital Literacy for Beginners',
          description: 'Essential digital skills for everyday life. Learn to use computers, internet, email, and essential software applications confidently.',
          instructor: 'Community Tutors',
          instructorId: 1007,
          price: 99,
          duration: '6 weeks',
          category: 'digital-literacy',
          level: 'beginner',
          teachingMode: 'face-to-face',
          location: {
            address: '321 Community Centre',
            city: 'Leeds',
            postcode: 'LS1 1DE'
          },
          schedule: [
            {
              day: 'wednesday',
              startTime: '10:00',
              endTime: '12:00',
              frequency: 'weekly'
            },
            {
              day: 'friday',
              startTime: '10:00',
              endTime: '12:00',
              frequency: 'weekly'
            }
          ],
          maxStudents: 12,
          currentEnrollment: 8,
          image: '/images/digital-literacy.jpg',
          rating: 4.9,
          reviews: 34,
          studentsEnrolled: 67,
          details: {
            syllabus: [
              { week: 1, topic: 'Computer Basics', description: 'Operating systems and file management' },
              { week: 2, topic: 'Internet and Email', description: 'Browsing and communication skills' },
              { week: 3, topic: 'Word Processing', description: 'Creating and formatting documents' },
              { week: 4, topic: 'Online Safety', description: 'Protecting personal information online' }
            ],
            requirements: ['No prior experience needed', 'Willingness to learn'],
            learningOutcomes: ['Basic computer operation', 'Internet and email skills', 'Document creation', 'Online safety awareness']
          },
          badge: 'New',
          status: 'published'
        },
        {
          title: 'GCSE Science Revision',
          description: 'Comprehensive GCSE Science revision covering Biology, Chemistry, and Physics. Small group sessions with expert science tutors.',
          instructor: 'Science Department',
          instructorId: 1008,
          price: 179,
          duration: '12 weeks',
          category: 'science',
          level: 'intermediate',
          teachingMode: 'hybrid',
          location: {
            address: '654 Science Park',
            city: 'Liverpool',
            postcode: 'L1 1FG'
          },
          schedule: [
            {
              day: 'tuesday',
              startTime: '17:00',
              endTime: '19:00',
              frequency: 'weekly'
            },
            {
              day: 'saturday',
              startTime: '10:00',
              endTime: '12:00',
              frequency: 'weekly'
            }
          ],
          onlinePlatform: 'google-meet',
          maxStudents: 15,
          currentEnrollment: 12,
          image: '/images/science.jpg',
          rating: 4.7,
          reviews: 29,
          studentsEnrolled: 53,
          details: {
            syllabus: [
              { week: 1, topic: 'Biology Fundamentals', description: 'Cell biology and organisms' },
              { week: 2, topic: 'Chemistry Basics', description: 'Elements, compounds, and reactions' },
              { week: 3, topic: 'Physics Principles', description: 'Forces, energy, and waves' },
              { week: 4, topic: 'Scientific Method', description: 'Experimentation and analysis' }
            ],
            requirements: ['GCSE science foundation', 'Current GCSE student'],
            learningOutcomes: ['Master GCSE science curriculum', 'Develop scientific thinking', 'Prepare for examinations', 'Conduct scientific experiments']
          },
          badge: 'Bestseller',
          status: 'published'
        },
        {
          title: 'Business English Communication',
          description: 'Improve your professional English communication skills for business environments. Focus on meetings, presentations, and professional writing.',
          instructor: 'Language Experts',
          instructorId: 1009,
          price: 159,
          duration: '8 weeks',
          category: 'languages',
          level: 'intermediate',
          teachingMode: 'online',
          onlinePlatform: 'zoom',
          maxStudents: 25,
          currentEnrollment: 18,
          image: '/images/business-english.jpg',
          rating: 4.6,
          reviews: 38,
          studentsEnrolled: 94,
          details: {
            syllabus: [
              { week: 1, topic: 'Business Vocabulary', description: 'Professional terminology and phrases' },
              { week: 2, topic: 'Meeting Skills', description: 'Participating effectively in meetings' },
              { week: 3, topic: 'Presentation Techniques', description: 'Delivering engaging presentations' },
              { week: 4, topic: 'Professional Writing', description: 'Emails, reports, and documentation' }
            ],
            requirements: ['Intermediate English level', 'Business/professional background'],
            learningOutcomes: ['Professional business vocabulary', 'Effective meeting participation', 'Business presentation skills', 'Professional email writing']
          },
          badge: 'Popular',
          status: 'published'
        },
        {
          title: 'Creative Writing Workshop',
          description: 'Unlock your creativity and develop your writing skills. Explore fiction, poetry, and creative non-fiction in a supportive workshop environment.',
          instructor: 'Published Authors',
          instructorId: 1010,
          price: 129,
          duration: '8 weeks',
          category: 'creative-arts',
          level: 'beginner',
          teachingMode: 'face-to-face',
          location: {
            address: '987 Arts Centre',
            city: 'Bristol',
            postcode: 'BS1 1HI'
          },
          schedule: [
            {
              day: 'thursday',
              startTime: '18:30',
              endTime: '20:30',
              frequency: 'weekly'
            }
          ],
          maxStudents: 10,
          currentEnrollment: 7,
          image: '/images/creative-writing.jpg',
          rating: 4.9,
          reviews: 25,
          studentsEnrolled: 41,
          details: {
            syllabus: [
              { week: 1, topic: 'Fiction Writing', description: 'Character development and plot structure' },
              { week: 2, topic: 'Poetry Techniques', description: 'Forms, rhythm, and imagery' },
              { week: 3, topic: 'Creative Non-Fiction', description: 'Memoir and personal essays' },
              { week: 4, topic: 'Editing and Revision', description: 'Polishing your writing' }
            ],
            requirements: ['Interest in writing', 'Willingness to share work'],
            learningOutcomes: ['Develop creative writing skills', 'Explore different writing styles', 'Receive constructive feedback', 'Build writing portfolio']
          },
          badge: 'New',
          status: 'published'
        },
        {
          title: 'Entrepreneurship Fundamentals',
          description: 'Learn how to start and grow your own business. Covering business planning, marketing, finance, and growth strategies for aspiring entrepreneurs.',
          instructor: 'Business Coaches',
          instructorId: 1011,
          price: 229,
          duration: '10 weeks',
          category: 'business',
          level: 'beginner',
          teachingMode: 'hybrid',
          location: {
            address: '555 Business Hub',
            city: 'London',
            postcode: 'EC1A 1JK'
          },
          schedule: [
            {
              day: 'monday',
              startTime: '19:00',
              endTime: '21:00',
              frequency: 'weekly'
            },
            {
              day: 'wednesday',
              startTime: '19:00',
              endTime: '21:00',
              frequency: 'weekly'
            }
          ],
          onlinePlatform: 'teams',
          maxStudents: 30,
          currentEnrollment: 24,
          image: '/images/entrepreneurship.jpg',
          rating: 4.7,
          reviews: 45,
          studentsEnrolled: 112,
          details: {
            syllabus: [
              { week: 1, topic: 'Business Ideation', description: 'Generating and validating business ideas' },
              { week: 2, topic: 'Business Planning', description: 'Creating comprehensive business plans' },
              { week: 3, topic: 'Market Research', description: 'Understanding target markets and competition' },
              { week: 4, topic: 'Funding Strategies', description: 'Securing investment and managing finances' }
            ],
            requirements: ['Business idea interest', 'No prior experience needed'],
            learningOutcomes: ['Develop business ideas', 'Create business plans', 'Understand market research', 'Learn funding strategies']
          },
          badge: 'Trending',
          status: 'published'
        },
        {
          title: 'Spanish for Beginners',
          description: 'Learn Spanish from scratch with native speakers. Focus on practical conversation skills, grammar, and cultural understanding.',
          instructor: 'Native Spanish Teachers',
          instructorId: 1012,
          price: 139,
          duration: '12 weeks',
          category: 'languages',
          level: 'beginner',
          teachingMode: 'online',
          onlinePlatform: 'zoom',
          maxStudents: 20,
          currentEnrollment: 16,
          image: '/images/spanish.jpg',
          rating: 4.8,
          reviews: 52,
          studentsEnrolled: 88,
          details: {
            syllabus: [
              { week: 1, topic: 'Basic Greetings', description: 'Introductions and everyday phrases' },
              { week: 2, topic: 'Grammar Fundamentals', description: 'Verb conjugation and sentence structure' },
              { week: 3, topic: 'Vocabulary Building', description: 'Essential words and expressions' },
              { week: 4, topic: 'Cultural Context', description: 'Understanding Spanish-speaking cultures' }
            ],
            requirements: ['No prior Spanish needed', 'Willingness to practice speaking'],
            learningOutcomes: ['Basic Spanish conversation', 'Essential grammar and vocabulary', 'Cultural understanding', 'Travel Spanish skills']
          },
          badge: 'Popular',
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

// Fallback in-memory data structure with comprehensive courses
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
      price: 299,
      category: 'web-dev',
      level: 'beginner',
      teachingMode: 'hybrid',
      status: 'published',
      currentEnrollment: 18,
      maxStudents: 25,
      rating: 4.8,
      badge: 'Bestseller'
    },
    {
      courseId: 102,
      title: 'Advanced Python Programming',
      instructor: 'Dr. Sarah Johnson', 
      price: 199,
      category: 'programming',
      level: 'intermediate',
      teachingMode: 'online',
      status: 'published',
      currentEnrollment: 22,
      maxStudents: 30,
      rating: 4.6,
      badge: 'Popular'
    },
    {
      courseId: 103,
      title: 'Face-to-Face Mathematics Tutoring',
      instructor: 'Mr. David Chen',
      price: 149,
      category: 'math',
      level: 'intermediate',
      teachingMode: 'face-to-face',
      status: 'published',
      currentEnrollment: 6,
      maxStudents: 8,
      rating: 4.9,
      badge: 'Trending'
    }
    // ... more courses can be added here for fallback
  ]
};

export default connectDB;
export { inMemoryData };
