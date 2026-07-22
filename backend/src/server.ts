import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
import { seedAdminAccount } from './config/adminSeeder';

const startServer = async () => {
  try {
    // 1. Connect to Database first
    await connectDB();

    // 2. Seed the default admin account (idempotent - safe to run every startup)
    await seedAdminAccount();

    // 3. Start the Express server
    const server = app.listen(env.port, () => {
      console.log(`[SERVER] Running in ${env.nodeEnv} mode on port ${env.port}`);
    });

    // Handle Unhandled Promise Rejections (e.g., if DB drops later)
    process.on('unhandledRejection', (err: any) => {
      console.error(`[UNHANDLED REJECTION] Shutting down...`);
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    console.error(`[INITIALIZATION ERROR] Failed to start application:`, error);
    process.exit(1);
  }
};

startServer();
