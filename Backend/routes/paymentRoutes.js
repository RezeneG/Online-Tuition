// backend/routes/paymentRoutes.js
import express from 'express';

const router = express.Router();

// Create payment intent
router.post('/create-intent', async (req, res) => {
  try {
    const { courseId, amount, currency = 'gbp' } = req.body;
    
    if (!courseId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Course ID and amount are required'
      });
    }

    // In a real app, integrate with Stripe/PayPal here
    const mockPaymentIntent = {
      id: 'pi_mock_' + Date.now(),
      client_secret: 'cs_mock_' + Math.random().toString(36).substr(2, 9),
      amount: amount * 100, // Convert to cents/pence
      currency: currency,
      status: 'requires_payment_method'
    };

    res.json({
      success: true,
      paymentIntent: mockPaymentIntent,
      message: 'Payment intent created successfully'
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Confirm payment
router.post('/confirm', async (req, res) => {
  try {
    const { paymentIntentId, courseId, userId } = req.body;

    // Mock payment confirmation
    const mockConfirmation = {
      id: paymentIntentId,
      status: 'succeeded',
      amount: 9900, // £99 in pence
      currency: 'gbp',
      receipt_url: `https://example.com/receipts/${paymentIntentId}`
    };

    res.json({
      success: true,
      payment: mockConfirmation,
      message: 'Payment confirmed successfully'
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
