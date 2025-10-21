// backend/models/Counter.js
import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  sequence_value: {
    type: Number,
    default: 0
  }
});

// Create a model for the counter collection
const Counter = mongoose.model('Counter', counterSchema);

// Function to get the next sequence value
export const getNextSequenceValue = async (sequenceName) => {
  try {
    const sequenceDocument = await Counter.findByIdAndUpdate(
      { _id: sequenceName },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );
    return sequenceDocument.sequence_value;
  } catch (error) {
    console.error('Error getting next sequence value:', error);
    throw error;
  }
};

// Initialize default counters
export const initializeCounters = async () => {
  try {
    const defaultCounters = ['courseId', 'userId', 'orderId'];
    
    for (const counterName of defaultCounters) {
      const existingCounter = await Counter.findById(counterName);
      if (!existingCounter) {
        await Counter.create({
          _id: counterName,
          sequence_value: 1000 // Start from 1000
        });
        console.log(`✅ Counter initialized: ${counterName}`);
      }
    }
  } catch (error) {
    console.error('Error initializing counters:', error);
  }
};

export default Counter;
