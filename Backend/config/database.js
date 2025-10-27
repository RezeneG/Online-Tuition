// config/database.js - Updated with services
import mongoose from 'mongoose';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Service from '../models/Service.js'; // New model
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
    await initializeData();
    return true;
  } catch (error) {
    console.log('⚠️  MongoDB connection failed, using in-memory data');
    return false;
  }
};

const initializeData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('📦 Initializing sample data...');
      
      // Create counters
      await Counter.create([
        { _id: 'userId', sequence_value: 1000 },
        { _id: 'courseId', sequence_value: 100 },
        { _id: 'serviceId', sequence_value: 200 }, // New service counter
        { _id: 'enrollmentId', sequence_value: 500 }
      ]);

      // Create sample users (including service providers)
      const sampleUsers = [
        {
          name: 'Admin User',
          email: 'admin@tuition.com',
          password: 'admin123',
          role: 'admin',
          profile: {
            bio: 'Platform Administrator',
            phone: '+1234567890',
            location: { city: 'London', postcode: 'SW1A 1AA' }
          }
        },
        {
          name: 'Dr. Sarah Johnson',
          email: 'sarah@tuition.com',
          password: 'instructor123',
          role: 'instructor',
          profile: {
            bio: 'Senior Web Development Instructor',
            phone: '+1234567891',
            location: { city: 'Manchester', postcode: 'M1 1AB' }
          }
        },
        {
          name: 'Tech Solutions Ltd',
          email: 'tech@services.com',
          password: 'provider123',
          role: 'provider', // New role
          profile: {
            bio: 'Professional IT services company',
            phone: '+1234567893',
            location: { city: 'London', postcode: 'EC1A 1BB' },
            company: 'Tech Solutions Ltd',
            services: ['web-development', 'it-support']
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
            location: { city: 'Birmingham', postcode: 'B1 1BC' }
          }
        }
      ];

      await User.create(sampleUsers);
      console.log('✅ Sample users created');

      // Create sample courses (your existing 3 courses + more)
      const sampleCourses = [
        {
          title: 'Complete Web Development Bootcamp',
          description: 'Learn full-stack web development from scratch. Build real-world projects.',
          instructor: 'Dr. Sarah Johnson',
          instructorId: 1002,
          price: 299,
          duration: '12 weeks',
          category: 'web-development',
          level: 'beginner',
          teachingMode: 'hybrid',
          maxStudents: 25,
          currentEnrollment: 18,
          image: '/images/web-dev.jpg',
          rating: 4.8,
          studentsEnrolled: 156,
          status: 'published'
        },
        {
          title: 'Cybersecurity Essentials',
          description: 'Learn fundamental cybersecurity concepts and protection strategies.',
          instructor: 'Dr. Sarah Johnson',
          instructorId: 1002,
          price: 189,
          duration: '8 weeks',
          category: 'cybersecurity',
          level: 'beginner',
          teachingMode: 'online',
          maxStudents: 30,
          currentEnrollment: 22,
          image: '/images/cybersecurity.jpg',
          rating: 4.6,
          studentsEnrolled: 89,
          status: 'published'
        },
        {
          title: 'Mobile App Development',
          description: 'Build cross-platform mobile applications for iOS and Android.',
          instructor: 'Dr. Sarah Johnson',
          instructorId: 1002,
          price: 249,
          duration: '10 weeks',
          category: 'mobile-development',
          level: 'intermediate',
          teachingMode: 'hybrid',
          maxStudents: 20,
          currentEnrollment: 15,
          image: '/images/mobile-dev.jpg',
          rating: 4.7,
          studentsEnrolled: 78,
          status: 'published'
        }
      ];

      await Course.create(sampleCourses);
      console.log('✅ Sample courses created');

      // Create sample services
      const sampleServices = [
        {
          title: 'Website Development Service',
          description: 'Professional website development for businesses. Responsive design, SEO optimized, fast loading.',
          provider: 'Tech Solutions Ltd',
          providerId: 1003,
          category: 'web-development',
          serviceType: 'fixed-price',
          pricing: {
            model: 'fixed',
            amount: 999,
            currency: 'GBP'
          },
          deliveryTime: '2-3 weeks',
          image: '/images/web-service.jpg',
          rating: 4.8,
          completedProjects: 47,
          features: [
            'Custom website design',
            'Responsive development',
            'SEO optimization',
            '1 month free support',
            'Mobile-friendly'
          ],
          status: 'available'
        },
        {
          title: 'IT Support & Maintenance',
          description: 'Ongoing IT support, troubleshooting, and system maintenance for businesses and individuals.',
          provider: 'Tech Solutions Ltd',
          providerId: 1003,
          category: 'it-support',
          serviceType: 'hourly',
          pricing: {
            model: 'hourly',
            rate: 45,
            currency: 'GBP',
            minHours: 2
          },
          deliveryTime: 'Same day',
          image: '/images/it-support.jpg',
          rating: 4.6,
          completedProjects: 89,
          features: [
            'Hardware troubleshooting',
            'Software installation',
            'Network setup',
            'Virus removal',
            'Remote support available'
          ],
          status: 'available'
        },
        {
          title: 'Software Testing Service',
          description: 'Comprehensive software testing including functional, performance, and security testing.',
          provider: 'Tech Solutions Ltd',
          providerId: 1003,
          category: 'software-testing',
          serviceType: 'project-based',
          pricing: {
            model: 'quote',
            currency: 'GBP'
          },
          deliveryTime: '1-2 weeks',
          image: '/images/testing-service.jpg',
          rating: 4.7,
          completedProjects: 34,
          features: [
            'Manual testing',
            'Automation testing',
            'Performance testing',
            'Security testing',
            'Detailed reports'
          ],
          status: 'available'
        },
        {
          title: 'Game Development Consultation',
          description: 'Expert consultation for game development projects, from concept to deployment.',
          provider: 'Tech Solutions Ltd',
          providerId: 1003,
          category: 'game-development',
          serviceType: 'hourly',
          pricing: {
            model: 'hourly',
            rate: 65,
            currency: 'GBP',
            minHours: 1
          },
          deliveryTime: 'Flexible',
          image: '/images/game-dev.jpg',
          rating: 4.9,
          completedProjects: 23,
          features: [
            'Game design consultation',
            'Development guidance',
            'Technical architecture',
            'App store deployment',
            'Post-launch support'
          ],
          status: 'available'
        }
      ];

      await Service.create(sampleServices);
      console.log('✅ Sample services created');
    }
  } catch (error) {
    console.log('⚠️ Error initializing sample data:', error.message);
  }
};

export default connectDB;
