import mongoose from 'mongoose';

export const connectDatabase = async (uri: string) => {
  await mongoose.connect(uri);
  mongoose.connection.on('connected', () => {
    console.log('🗄️  MongoDB connected');
  });
  mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
  });
};

