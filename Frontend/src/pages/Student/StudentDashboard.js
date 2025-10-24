// frontend/src/pages/student/StudentDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CourseContext } from '../../context/CourseContext';
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  Calendar,
  PlayCircle,
  CheckCircle,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { courses } = useContext(CourseContext);
  const navigate = useNavigate();
  
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [progress, setProgress] = useState({});
  const [activeTab, setActiveTab] = useState('overview');

  // Mock enrolled courses and progress (replace with actual API calls)
  useEffect(() => {
    // Simulate API call to get enrolled courses
    const mockEnrolledCourses = courses.slice(0, 3).map(course => ({
      ...course,
      progress: Math.floor(Math.random() * 100),
      lastAccessed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      completed: Math.random() > 0.7
    }));
    
    setEnrolledCourses(mockEnrolledCourses);

    // Mock overall progress
    setProgress({
      completedCourses: mockEnrolledCourses.filter(course => course.completed).length,
      inProgress: mockEnrolledCourses.filter(course => !course.completed && course.progress > 0).length,
      totalHours: Math.floor(Math.random() * 50) + 10,
      streak: Math.floor(Math.random() * 15)
    });
  }, [courses]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleContinueLearning = (courseId) => {
    // Navigate to course player
    navigate(`/course/${courseId}`);
  };

  const recommendedCourses = courses
    .filter(course => !enrolledCourses.some(ec => ec._id === course._id))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.name}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/courses')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Browse Courses
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition ${
                  activeTab === 'overview' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span>Overview</span>
              </button>
              
              <button
                onClick={() => setActiveTab('my-courses')}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition ${
                  activeTab === 'my-courses' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span>My Courses</span>
              </button>
              
              <button
                onClick={() => setActiveTab('progress')}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition ${
                  activeTab === 'progress' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                <span>Progress</span>
              </button>
              
              <button
                onClick={() => setActiveTab('achievements')}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition ${
                  activeTab === 'achievements' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Award className="w-5 h-5" />
                <span>Achievements</span>
              </button>
              
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition ${
                  activeTab === 'settings' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
                        <p className="text-2xl font-bold text-gray-900">{enrolledCourses.length}</p>
                      </div>
                      <BookOpen className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Completed</p>
                        <p className="text-2xl font-bold text-gray-900">{progress.completedCourses}</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Learning Hours</p>
                        <p className="text-2xl font-bold text-gray-900">{progress.totalHours}h</p>
                      </div>
                      <Clock className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Current Streak</p>
                        <p className="text-2xl font-bold text-gray-900">{progress.streak} days</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-orange-600" />
                    </div>
                  </div>
                </div>

                {/* Continue Learning */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Continue Learning</h2>
                  <div className="space-y-4">
                    {enrolledCourses.filter(course => !course.completed).map((course) => (
                      <div key={course._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <PlayCircle className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{course.title}</h3>
                            <p className="text-sm text-gray-600">{course.category} • {course.level}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12">{course.progress}%</span>
                          <button
                            onClick={() => handleContinueLearning(course._id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                          >
                            Continue
                          </button>
                        </div>
                      </div>
                    ))}
                    {enrolledCourses.filter(course => !course.completed).length === 0 && (
                      <p className="text-gray-500 text-center py-8">No courses in progress. Start a new course!</p>
                    )}
                  </div>
                </div>

                {/* Recommended Courses */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Recommended For You</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recommendedCourses.map((course) => (
                      <div key={course._id} className="border rounded-lg overflow-hidden hover:shadow-md transition">
                        <div className="h-32 bg-gray-200"></div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{course.category} • {course.level}</p>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-900">${course.price}</span>
                            <button
                              onClick={() => navigate('/courses')}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                            >
                              Enroll
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'my-courses' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">My Courses</h2>
                <div className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <div key={course._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{course.title}</h3>
                          <p className="text-sm text-gray-600">{course.category} • {course.level}</p>
                          <p className="text-xs text-gray-500">
                            Last accessed: {course.lastAccessed.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="w-32 bg-gray-200 rounded-full h-2 mb-2">
                            <div 
                              className={`h-2 rounded-full transition-all ${
                                course.completed ? 'bg-green-600' : 'bg-blue-600'
                              }`}
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {course.completed ? 'Completed' : `${course.progress}% complete`}
                          </span>
                        </div>
                        <button
                          onClick={() => handleContinueLearning(course._id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                        >
                          {course.completed ? 'Review' : 'Continue'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Learning Progress</h2>
                <div className="space-y-6">
                  {/* Progress Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-4">Course Completion</h3>
                      <div className="space-y-3">
                        {enrolledCourses.map((course) => (
                          <div key={course._id}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{course.title}</span>
                              <span>{course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  course.completed ? 'bg-green-600' : 'bg-blue-600'
                                }`}
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-4">Learning Stats</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Total Learning Time</span>
                          <span className="font-semibold">{progress.totalHours} hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Current Streak</span>
                          <span className="font-semibold">{progress.streak} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Courses Completed</span>
                          <span className="font-semibold">{progress.completedCourses}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Courses in Progress</span>
                          <span className="font-semibold">{progress.inProgress}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Achievements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Mock achievements */}
                  {[
                    { name: 'First Course', description: 'Complete your first course', earned: true },
                    { name: 'Week Warrior', description: 'Learn for 7 days straight', earned: progress.streak >= 7 },
                    { name: 'Bookworm', description: 'Complete 5 courses', earned: progress.completedCourses >= 5 },
                    { name: 'Quick Learner', description: 'Complete a course in 3 days', earned: false },
                    { name: 'Perfect Score', description: 'Get 100% on a course', earned: false },
                    { name: 'Early Bird', description: 'Start learning before 8 AM', earned: true }
                  ].map((achievement, index) => (
                    <div key={index} className={`p-4 border rounded-lg text-center ${
                      achievement.earned ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <Award className={`w-12 h-12 mx-auto mb-3 ${
                        achievement.earned ? 'text-green-600' : 'text-gray-400'
                      }`} />
                      <h3 className="font-semibold mb-1">{achievement.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                      <span className={`text-xs font-medium ${
                        achievement.earned ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {achievement.earned ? 'Earned' : 'Not Earned'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input 
                          type="text" 
                          defaultValue={user?.name}
                          className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                          type="email" 
                          defaultValue={user?.email}
                          className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Learning Preferences</h3>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span>Email notifications for new courses</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span>Weekly learning progress report</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Mobile push notifications</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <button className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition">
                      Cancel
                    </button>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
