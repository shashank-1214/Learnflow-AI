import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware';
import * as adminController from '../controllers/admin.controller';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Admin
 *   description: Admin authentication and protected management endpoints
 */

/**
 * @openapi
 * /api/v1/admin/login:
 *   post:
 *     summary: Admin login
 *     description: Authenticates an admin user and returns a JWT token. Normal users are rejected.
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@learnflow.ai
 *               password:
 *                 type: string
 *                 example: Admin@123
 *     responses:
 *       200:
 *         description: Admin authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     user:
 *                       type: object
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Access denied - not an admin account
 */
router.post('/login', adminController.adminLogin);

/**
 * @openapi
 * /api/v1/admin/me:
 *   get:
 *     summary: Get current admin profile
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin profile returned
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not an admin
 */
router.get('/me', requireAuth, requireAdmin, adminController.getAdminProfile);

/**
 * @openapi
 * /api/v1/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard stats
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics returned
 */
router.get('/dashboard', requireAuth, requireAdmin, adminController.getDashboard);

/**
 * @openapi
 * /api/v1/admin/users:
 *   get:
 *     summary: Get all users with pagination and search
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Users list returned
 */
router.get('/users', requireAuth, requireAdmin, adminController.getUsers);

/**
 * @openapi
 * /api/v1/admin/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details returned
 */
router.get('/users/:id', requireAuth, requireAdmin, adminController.getUserById);

/**
 * @openapi
 * /api/v1/admin/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete('/users/:id', requireAuth, requireAdmin, adminController.deleteUser);

/**
 * @openapi
 * /api/v1/admin/notes:
 *   get:
 *     summary: Get all notes with pagination and search
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notes list returned
 */
router.get('/notes', requireAuth, requireAdmin, adminController.getNotes);

/**
 * @openapi
 * /api/v1/admin/notes/{id}:
 *   delete:
 *     summary: Delete note by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note deleted
 */
router.delete('/notes/:id', requireAuth, requireAdmin, adminController.deleteNote);

/**
 * @openapi
 * /api/v1/admin/uploads:
 *   get:
 *     summary: Get all uploads with pagination and search
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Uploads list returned
 */
router.get('/uploads', requireAuth, requireAdmin, adminController.getUploads);

/**
 * @openapi
 * /api/v1/admin/uploads/{id}:
 *   delete:
 *     summary: Delete upload by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Upload deleted
 */
router.delete('/uploads/:id', requireAuth, requireAdmin, adminController.deleteUpload);

export default router;
