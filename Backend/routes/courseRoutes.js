// backend/routes/courseRoutes.js - Add these endpoints

// Get courses by teaching mode
router.get('/mode/:mode', async (req, res) => {
  try {
    const { mode } = req.params;
    const { page = 1, limit = 12 } = req.query;
    
    const courses = await Course.find({ 
      teachingMode: mode,
      isPublished: true 
    })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Course.countDocuments({ 
      teachingMode: mode,
      isPublished: true 
    });

    res.json({
      success: true,
      courses,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get courses by location
router.get('/location/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const { page = 1, limit = 12 } = req.query;
    
    const courses = await Course.find({ 
      'location.city': new RegExp(city, 'i'),
      isPublished: true,
      teachingMode: { $in: ['face-to-face', 'hybrid'] }
    })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Course.countDocuments({ 
      'location.city': new RegExp(city, 'i'),
      isPublished: true,
      teachingMode: { $in: ['face-to-face', 'hybrid'] }
    });

    res.json({
      success: true,
      courses,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Enhanced enrollment with capacity check
router.post('/:id/enroll', async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const { userId, userEmail, preferredMode = 'online' } = req.body;

    // Check if course exists
    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check capacity for face-to-face enrollment
    if (preferredMode === 'face-to-face' && course.teachingMode !== 'online') {
      if (course.isFull()) {
        return res.status(400).json({
          success: false,
          message: 'This class is full. Please choose online option or join waitlist.'
        });
      }
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
      preferredMode,
      status: 'active'
    });

    // Update course student count and enrollment
    course.studentsEnrolled += 1;
    if (preferredMode === 'face-to-face' && course.teachingMode !== 'online') {
      course.currentEnrollment += 1;
    }
    await course.save();

    // Update user's enrolled courses
    await User.findOneAndUpdate(
      { userId },
      { 
        $push: { 
          enrolledCourses: { 
            courseId, 
            enrolledAt: new Date(),
            preferredMode 
          } 
        } 
      }
    );

    res.status(201).json({
      success: true,
      enrollment,
      message: `Successfully enrolled in ${course.title} (${preferredMode})`,
      availableSpots: course.availableSpots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
