import { UserModel } from '../models/user.model';
import { hashPassword } from '../utils/auth.util';

const ADMIN_EMAIL = 'admin@learnflow.ai';
const ADMIN_PASSWORD = 'Admin@123';
const ADMIN_NAME = 'LearnFlow Admin';

/**
 * Checks if a default admin account exists; creates one if it does not.
 * This runs once on application startup.
 */
export const seedAdminAccount = async (): Promise<void> => {
  try {
    const existing = await UserModel.findOne({ email: ADMIN_EMAIL, role: 'admin' });

    if (existing) {
      console.log('[ADMIN SEEDER] Default admin account already exists. Skipping.');
      return;
    }

    const hashedPassword = await hashPassword(ADMIN_PASSWORD);

    await UserModel.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
      provider: 'local',
    });

    console.log('[ADMIN SEEDER] ✅ Default admin account created successfully.');
    console.log(`[ADMIN SEEDER]    Email   : ${ADMIN_EMAIL}`);
    console.log(`[ADMIN SEEDER]    Password: ${ADMIN_PASSWORD}`);
  } catch (error: any) {
    console.error(`[ADMIN SEEDER] ❌ Failed to seed admin: ${error.message}`);
  }
};
