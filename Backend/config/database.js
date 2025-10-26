import mongoose from 'mongoose';

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
    return true;
  } catch (error) {
    console.log('⚠️  MongoDB connection failed, using in-memory data');
    console.log('💡 To use real database:');
    console.log('   1. Install MongoDB locally or use MongoDB Atlas');
    console.log('   2. Add MONGODB_URI to your .env file');
    return false;
  }
};

// Fallback in-memory data for development
const inMemoryData = {
  users: [
    {
      _id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      status: 'active',
      createdAt: new Date()
    },
    {
      _id: '2', 
      name: 'John Student',
      email: 'john@example.com',
      role: 'student',
      status: 'active',
      createdAt: new Date()
    }
  ],
  courses: [
    {
      _id: '1',
      title: 'Web Development Basics',
      instructor: 'John Smith',
      price: 99,
      duration: '8 weeks',
      category: 'web-dev',
      level: 'beginner',
      rating: 4.7,
      students: 1500,
      status: 'active'
    },
    {
      _id: '2',
      title: 'Python Programming', 
      instructor: 'Sarah Johnson',
      price: 129,
      duration: '6 weeks',
      category: 'programming',
      level: 'beginner',
      rating: 4.8,
      students: 2000,
      status: 'active'
    }
  ]
};

export default connectDB;
export { inMemoryData };
