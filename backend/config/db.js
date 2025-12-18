import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://moshaheen616_db_user:123456789123@cluster0.ttpz2m8.mongodb.net/?';

export const connectDb = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('DB Connected');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error); 
    console.log('⚠️  Continuing without database connection...');
    // Don't exit - allow server to run without DB for deploy endpoint
  }
};