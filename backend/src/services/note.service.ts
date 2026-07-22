import fs from 'fs';
import path from 'path';
import { NoteModel } from '../models/note.model';
import { extractTextFromFile } from '../utils/textExtractor';
import { generateContentFromText, generateContentFromImage } from './ai/gemini.service';
import { ApiError } from '../utils/ApiError';

export const processUploadedNote = async (
  file: Express.Multer.File,
  userId: string,
  title: string
) => {
  // 1. Create Initial Note Record (Status: Processing)
  const newNote = await NoteModel.create({
    title,
    originalFileName: file.originalname,
    fileType: file.mimetype,
    fileSize: file.size,
    storagePath: file.path,
    owner: userId,
    status: 'processing',
    sourceType: 'file',
  });

  try {
    // 2. Extract Text
    const extractedText = await extractTextFromFile(file.path, file.mimetype);

    // 3. Call AI Service
    const aiData = await generateContentFromText(extractedText);

    // 4. Update Note Record with AI Results (Status: Completed)
    newNote.generatedNotes = aiData.generatedNotes;
    newNote.summary = aiData.summary;
    newNote.keyPoints = aiData.keyPoints;
    newNote.flashcards = aiData.flashcards;
    newNote.mindMap = aiData.mindMap;
    newNote.quiz = aiData.quiz;
    newNote.status = 'completed';

    await newNote.save();
    return newNote;
  } catch (error: any) {
    // 5. If failure, update status to Failed
    newNote.status = 'failed';
    await newNote.save();
    throw new ApiError(500, `Failed to process note: ${error.message}`);
  }
};

export const processImageNote = async (
  file: Express.Multer.File,
  userId: string,
  title: string
) => {
  // 1. Create Initial Note Record
  const newNote = await NoteModel.create({
    title,
    originalFileName: file.originalname,
    fileType: file.mimetype,
    fileSize: file.size,
    storagePath: file.path,
    owner: userId,
    status: 'processing',
    sourceType: 'image',
    imageUrl: file.path, // Assuming it's served locally or you upload it to cloud
  });

  try {
    // 2. Read Image as Base64
    const base64Data = fs.readFileSync(file.path, { encoding: 'base64' });

    // 3. Call AI Vision Service
    const aiData = await generateContentFromImage(file.mimetype, base64Data);

    // 4. Update Note Record
    newNote.generatedNotes = aiData.generatedNotes;
    newNote.summary = aiData.summary;
    newNote.keyPoints = aiData.keyPoints;
    newNote.flashcards = aiData.flashcards;
    newNote.mindMap = aiData.mindMap;
    newNote.quiz = aiData.quiz;
    newNote.status = 'completed';

    await newNote.save();
    return newNote;
  } catch (error: any) {
    newNote.status = 'failed';
    await newNote.save();
    throw new ApiError(500, `Failed to process image: ${error.message}`);
  }
};

export const getUserNotes = async (userId: string) => {
  return NoteModel.find({ owner: userId }).sort({ createdAt: -1 });
};

export const getNoteById = async (noteId: string, userId: string) => {
  const note = await NoteModel.findOne({ _id: noteId, owner: userId });
  if (!note) {
    throw new ApiError(404, 'Note not found');
  }
  return note;
};

export const deleteNoteById = async (noteId: string, userId: string) => {
  const note = await NoteModel.findOne({ _id: noteId, owner: userId });
  if (!note) {
    throw new ApiError(404, 'Note not found');
  }

  // Delete physical file if it exists
  if (note.storagePath && fs.existsSync(note.storagePath)) {
    await fs.promises.unlink(note.storagePath);
  }

  // Delete DB record
  await note.deleteOne();
  return true;
};
