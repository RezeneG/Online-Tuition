// routes/services.js
import express from 'express';
import Service from '../models/Service.js';

const router = express.Router();

// Get all services with optional filtering
router.get('/', async (req, res) => {
  try {
    const { category, serviceType, limit = 10, page = 1 } = req.query;
    
    let filter = {};
    if (category) filter.category = category;
    if (serviceType) filter.serviceType = serviceType;
    
    const services = await Service.find(filter)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ rating: -1, createdAt: -1 });
    
    const total = await Service.countDocuments(filter);
    
    res.json({
      success: true,
      services,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message
    });
  }
});

// Get single service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    res.json({
      success: true,
      service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching service',
      error: error.message
    });
  }
});

// Get services by provider
router.get('/provider/:providerId', async (req, res) => {
  try {
    const services = await Service.find({ providerId: parseInt(req.params.providerId) });
    
    res.json({
      success: true,
      services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching provider services',
      error: error.message
    });
  }
});

// Get service categories
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await Service.distinct('category');
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

export default router;
