import mongoose from 'mongoose';
import { getNextSequenceValue, initializeCounters } from '../../models/Counter.js';
import connectDB from '../../config/database.js';

describe('Counter Model', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clean up counters before each test
    await mongoose.connection.collection('counters').deleteMany({});
  });

  test('should get next sequence value', async () => {
    const sequenceName = 'testCounter';
    const firstValue = await getNextSequenceValue(sequenceName);
    const secondValue = await getNextSequenceValue(sequenceName);

    expect(firstValue).toBe(1);
    expect(secondValue).toBe(2);
  });

  test('should initialize default counters', async () => {
    await initializeCounters();
    
    const courseCounter = await mongoose.connection.collection('counters').findOne({ _id: 'courseId' });
    expect(courseCounter.sequence_value).toBe(1000);
  });
});
