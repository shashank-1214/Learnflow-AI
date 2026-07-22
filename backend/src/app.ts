import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import { env } from './config/env';
import { errorHandler } from './middlewares/error.middleware';
import { ApiError } from './utils/ApiError';

// Routes
import healthRoutes from './routes/health.route';
import authRoutes from './routes/auth.route'; // Mocked for now to let Swagger parse comments
import noteRoutes from './routes/note.route';
import dashboardRoutes from './routes/dashboard.route';
import adminRoutes from './routes/admin.route';
import { setupSwagger } from './config/swagger';

const app: Application = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: env.nodeEnv === 'production' ? 'https://learnflow.ai' : 'http://localhost:5173',
    credentials: true,
  })
);

// Payload Parsing & Compression
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());
app.use(cookieParser());

// Logging
if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// API Versioning & Routes
app.use('/api/v1', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/notes', noteRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/admin', adminRoutes);

// Setup Swagger UI
setupSwagger(app);


// Handle unknown routes
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found on this server.`));
});

// Global Error Handler
app.use(errorHandler);

export default app;
