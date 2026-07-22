import { UserModel } from '../models/user.model';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.util';
import { ApiError } from '../utils/ApiError';

export const registerUser = async (data: any) => {
  const { name, email, password } = data;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, 'User with this email already exists');
    }

    const hashedPassword = await hashPassword(password);
    
    console.log('[AUTH DEBUG] Before create - Instantiating new user');
    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
    });
    console.log('[AUTH DEBUG] After create - User instantiated, ready to save');

    await user.save();
    console.log('[AUTH DEBUG] After save - User successfully saved to MongoDB Atlas');

    const token = generateToken(user._id.toString());
    
    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, token };
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error; // Re-throw handled API errors
    }
    console.error(`[DB ERROR] MongoDB Registration Error:`, error);
    // Print exact MongoDB error as requested
    throw new ApiError(500, `Database Error: ${error.message}`);
  }
};

export const loginUser = async (data: any) => {
  const { email, password } = data;

  const user = await UserModel.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isPasswordValid = await comparePassword(password, user.password as string);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = generateToken(user._id.toString());

  const userResponse = user.toObject();
  delete userResponse.password;

  return { user: userResponse, token };
};
