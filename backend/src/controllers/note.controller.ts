import { Request, Response, NextFunction } from 'express';
import * as noteService from '../services/note.service';
import { ApiError } from '../utils/ApiError';
import { chatWithNoteContext } from '../services/ai/gemini.service';

export const uploadNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('[UPLOAD DEBUG] req.body:', req.body);
    if (req.file) {
      console.log('[UPLOAD DEBUG] req.file:', req.file);
      console.log('[UPLOAD DEBUG] req.file.mimetype:', req.file.mimetype);
    }

    const { title: reqTitle } = req.body;
    const userId = (req as any).user._id.toString();

    if (!req.file) {
      throw new ApiError(400, 'Please upload a file');
    }
    
    const title = reqTitle || req.file.originalname.split('.')[0];
    
    let note;
    if (req.file.mimetype.startsWith('image/')) {
      note = await noteService.processImageNote(req.file, userId, title);
    } else {
      note = await noteService.processUploadedNote(req.file, userId, title);
    }

    return res.status(201).json({
      success: true,
      message: 'Document uploaded and processed successfully',
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

export const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notes = await noteService.getUserNotes((req as any).user._id.toString());
    res.status(200).json({
      success: true,
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const note = await noteService.getNoteById(req.params.id as string, (req as any).user._id.toString());
    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await noteService.deleteNoteById(req.params.id as string, (req as any).user._id.toString());
    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const chatNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      throw new ApiError(400, 'A non-empty message is required.');
    }

    // Fetch the note and verify ownership
    const note = await noteService.getNoteById(req.params.id as string, (req as any).user._id.toString());

    // Build the tightly-bounded context from the AI-generated fields only
    const contextParts: string[] = [];
    if (note.summary) contextParts.push(`SUMMARY:\n${note.summary}`);
    if (note.keyPoints && note.keyPoints.length > 0) contextParts.push(`KEY POINTS:\n${note.keyPoints.map(p => `- ${p}`).join('\n')}`);
    if (note.generatedNotes) contextParts.push(`GENERATED NOTES:\n${note.generatedNotes}`);

    if (contextParts.length === 0) {
      return res.status(200).json({
        success: true,
        answer: "This note has not been fully processed by AI yet. Please wait and try again.",
      });
    }

    const noteContext = contextParts.join('\n\n---\n\n');
    const answer = await chatWithNoteContext(message.trim(), noteContext, history || []);

    res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    next(error);
  }
};
