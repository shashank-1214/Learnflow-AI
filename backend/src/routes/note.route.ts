import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';
import * as noteController from '../controllers/note.controller';

const router = Router();

// Apply auth middleware to all note routes
router.use(requireAuth);

/**
 * @openapi
 * tags:
 *   name: Notes
 *   description: AI Notes generation and document management
 */

/**
 * @openapi
 * /api/v1/notes/upload:
 *   post:
 *     summary: Upload a document for AI processing
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Document uploaded and processing started
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 */
router.post('/upload', upload.single('file'), noteController.uploadNote);

/**
 * @openapi
 * /api/v1/notes:
 *   get:
 *     summary: Get all notes for the current user
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user notes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/', noteController.getNotes);

/**
 * @openapi
 * /api/v1/notes/{id}:
 *   get:
 *     summary: Get a specific note by ID
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note details
 */
router.get('/:id', noteController.getNoteById);

/**
 * @openapi
 * /api/v1/notes/{id}:
 *   delete:
 *     summary: Delete a note and its physical file
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note deleted successfully
 */
router.delete('/:id', noteController.deleteNote);

/**
 * @openapi
 * /api/v1/notes/{id}/chat:
 *   post:
 *     summary: Chat with AI about a specific note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI answer based on the note content
 */
router.post('/:id/chat', noteController.chatNote);

export default router;
