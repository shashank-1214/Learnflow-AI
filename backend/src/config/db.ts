import mongoose from 'mongoose';
import { env } from './env';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.mongoUri);
    console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`[DB ERROR] Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
