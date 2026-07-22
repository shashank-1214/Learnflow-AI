import mongoose from 'mongoose';
import { NoteModel } from '../models/note.model';

export const getDashboardSummary = async (userId: string) => {
  const owner = new mongoose.Types.ObjectId(userId);
  
  const totalNotes = await NoteModel.countDocuments({ owner });
  
  const recentNotes = await NoteModel.find({ owner })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();
    
  const aggregation = await NoteModel.aggregate([
    { $match: { owner } },
    { $group: { _id: null, totalStorage: { $sum: '$fileSize' } } }
  ]);
  
  const storageUsed = aggregation[0]?.totalStorage || 0;
  
  const lastUploadDoc = await NoteModel.findOne({ owner })
    .sort({ createdAt: -1 })
    .select('createdAt')
    .lean();
    
  return {
    totalNotes,
    totalUploads: totalNotes,
    recentNotes,
    storageUsed,
    lastUpload: lastUploadDoc ? lastUploadDoc.createdAt : null,
  };
};

export const getDashboardStats = async (userId: string) => {
  const owner = new mongoose.Types.ObjectId(userId);
  
  const now = new Date();
  
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 7);
  
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);
  
  const weeklyUploads = await NoteModel.countDocuments({ 
    owner, 
    createdAt: { $gte: oneWeekAgo } 
  });
  
  const monthlyUploads = await NoteModel.countDocuments({ 
    owner, 
    createdAt: { $gte: oneMonthAgo } 
  });
  
  const totalAINotesGenerated = await NoteModel.countDocuments({ 
    owner, 
    status: 'completed' 
  });
  
  const aggregation = await NoteModel.aggregate([
    { $match: { owner } },
    { $group: { _id: null, totalStorage: { $sum: '$fileSize' } } }
  ]);
  
  const storageUsed = aggregation[0]?.totalStorage || 0;

  return {
    weeklyUploads,
    monthlyUploads,
    totalAINotesGenerated,
    storageUsed
  };
};
