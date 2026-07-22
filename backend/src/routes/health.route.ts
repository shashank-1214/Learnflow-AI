import { Router, Request, Response } from 'express';
import { env } from '../config/env';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to LearnFlow API 🚀',
  });
});

router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'LearnFlow API is running',
    timestamp: new Date().toISOString(),
    environment: env.nodeEnv,
  });
});

export default router;