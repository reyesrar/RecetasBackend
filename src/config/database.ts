import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri);
    
    console.log('Database connected successfully');
    
    mongoose.connection.on('error', (error) => {
      console.error('Database connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Database disconnected');
    });

  } catch (error) {
    console.error('Error connecting to Database:', error);
    process.exit(1);
  }
};