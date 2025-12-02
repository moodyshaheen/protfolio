import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://moshaheen616_db_user:741456@cluster0.fexkcly.mongodb.net/?';

export const connectDb = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('DB Connected');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
};