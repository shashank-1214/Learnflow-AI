import mongoose from 'mongoose';
import { env } from './src/config/env';
import { UserModel } from './src/models/user.model';

const runTest = async () => {
  console.log('--- 1. Environment Variables ---');
  console.log('MONGODB_URI is loaded:', !!process.env.MONGODB_URI);
  console.log('MONGO_URI is loaded:', !!process.env.MONGO_URI);
  
  // Hide credentials from URI
  const rawUri = env.mongoUri;
  const safeUri = rawUri.replace(/\/\/[^@]+@/, '//***:***@');
  console.log('Resolved env.mongoUri host (safe):', safeUri);
  console.log('Fallback to localhost exists in string?', safeUri.includes('localhost') || safeUri.includes('127.0.0.1'));

  console.log('\n--- 2. MongoDB Connection ---');
  try {
    const conn = await mongoose.connect(env.mongoUri);
    console.log('Connected Database Name:', conn.connection.name);
    console.log('Connection URI Host:', conn.connection.host);
    console.log('mongoose.connection.readyState:', mongoose.connection.readyState, '(1 = connected)');
    
    console.log('\n--- 3. User Model Info ---');
    console.log('Model Name:', UserModel.modelName);
    console.log('Collection Name:', UserModel.collection.collectionName);
    const indexes = await UserModel.collection.indexes();
    console.log('Indexes:', JSON.stringify(indexes, null, 2));

    console.log('\n--- 4. Register Controller / Save Test ---');
    const testEmail = `test_${Date.now()}@learnflow.com`;
    console.log('Attempting to create test user:', testEmail);
    
    console.log('[AUTH DEBUG] Before create - Instantiating new user');
    const user = new UserModel({
      name: 'Atlas Test User',
      email: testEmail,
      password: 'hashed_password_123',
    });
    console.log('[AUTH DEBUG] After create - User instantiated, ready to save');

    await user.save();
    console.log('[AUTH DEBUG] After save - User successfully saved to MongoDB Atlas');
    
    const foundUser = await UserModel.findOne({ email: testEmail });
    if (foundUser) {
      console.log('Atlas Insert Status: SUCCESS (Document found in collection)');
      console.log('Document ID:', foundUser._id);
    } else {
      console.log('Atlas Insert Status: FAILED (Document not found after save!)');
    }

    // Clean up
    await UserModel.deleteOne({ email: testEmail });
    console.log('Cleaned up test user.');

  } catch (error: any) {
    console.error('ERROR during test:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
};

runTest();
