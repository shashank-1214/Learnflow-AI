import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IDocument extends MongooseDocument {
  title: string;
  originalName: string;
  storedName: string;
  mimeType: string;
  extension: string;
  fileSize: number;
  storagePath: string;
  uploadedBy: mongoose.Types.ObjectId;
  status: 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    storedName: {
      type: String,
      required: true,
      unique: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    extension: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    storagePath: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['processing', 'completed', 'failed'],
      default: 'completed', // Defaults to completed since we are just storing it in this sprint
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster querying
documentSchema.index({ uploadedBy: 1 });
documentSchema.index({ createdAt: -1 });

export const DocumentModel = mongoose.model<IDocument>('Document', documentSchema);
