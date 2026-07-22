import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import * as dashboardController from '../controllers/dashboard.controller';

const router = Router();

// Protect all dashboard routes
router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard and statistics endpoints
 */

/**
 * @swagger
 * /api/v1/dashboard:
 *   get:
 *     summary: Get dashboard summary
 *     description: Retrieves total notes, recent notes, and storage usage for the logged-in user.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', dashboardController.getDashboardSummary);

/**
 * @swagger
 * /api/v1/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Retrieves weekly/monthly uploads and AI generation stats.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/stats', dashboardController.getDashboardStats);

export default router;
