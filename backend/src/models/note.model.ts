import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface INote extends MongooseDocument {
  title: string;
  originalFileName?: string;
  fileType?: string;
  fileSize?: number;
  storagePath?: string;
  sourceType: 'file' | 'image';
  imageUrl?: string;
  generatedNotes?: string;
  summary?: string;
  keyPoints?: string[];
  flashcards?: { front: string; back: string }[];
  mindMap?: string;
  quiz?: { question: string; options: string[]; answer: string }[];
  owner: mongoose.Types.ObjectId;
  status: 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    title: { type: String, required: true, trim: true },
    originalFileName: { type: String },
    fileType: { type: String },
    fileSize: { type: Number },
    storagePath: { type: String },
    sourceType: { type: String, enum: ['file', 'image'], default: 'file' },
    imageUrl: { type: String },
    generatedNotes: { type: String },
    summary: { type: String },
    keyPoints: [{ type: String }],
    flashcards: [
      {
        front: { type: String },
        back: { type: String },
      },
    ],
    mindMap: { type: String },
    quiz: [
      {
        question: { type: String },
        options: [{ type: String }],
        answer: { type: String },
      },
    ],
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['processing', 'completed', 'failed'],
      default: 'processing',
    },
  },
  { timestamps: true }
);

noteSchema.index({ owner: 1 });
noteSchema.index({ createdAt: -1 });
noteSchema.index(
  {
    title: 'text',
    summary: 'text',
    generatedNotes: 'text',
  },
  {
    weights: {
      title: 10,
      summary: 5,
      generatedNotes: 1,
    },
    name: 'note_text_index',
  }
);

export const NoteModel = mongoose.model<INote>('Note', noteSchema);
