import mongoose from 'mongoose';
import 'dotenv/config';

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error('Missing MongoDB configuration: MONGODB_URI not set');
}

export const connectDatabase = async () => {
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export default mongoose;
