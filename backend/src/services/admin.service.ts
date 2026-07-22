import { UserModel } from '../models/user.model';
import { NoteModel } from '../models/note.model';
import { DocumentModel } from '../models/document.model';
import { comparePassword, generateToken } from '../utils/auth.util';
import { ApiError } from '../utils/ApiError';

/**
 * Admin-specific login service.
 * Validates credentials AND asserts that the account has role === 'admin'.
 * A normal user with correct credentials is STILL rejected.
 */
export const loginAdmin = async (email: string, password: string) => {
  // Must select password since it is excluded by default
  const user = await UserModel.findOne({ email }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // Explicit admin role check — normal users are blocked here
  if (user.role !== 'admin') {
    throw new ApiError(403, 'Access denied: admin privileges required');
  }

  const isPasswordValid = await comparePassword(password, user.password as string);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = generateToken(user._id.toString());

  const userResponse = user.toObject();
  delete userResponse.password;

  return { user: userResponse, token };
};

export const getDashboardStats = async () => {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Last 7 days for timelines
  const last7Days = new Date(now);
  last7Days.setDate(now.getDate() - 6);
  last7Days.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    totalNotes,
    totalUploads,
    storageData,
    todaysUploadsCount,
    monthlyGrowthCount,
    recentUsers,
    recentNotes,
    recentUploads,
    userGrowthTimeline,
    notesTimeline,
    uploadsTimeline,
  ] = await Promise.all([
    UserModel.countDocuments(),
    NoteModel.countDocuments(),
    DocumentModel.countDocuments(),
    DocumentModel.aggregate([{ $group: { _id: null, total: { $sum: '$fileSize' } } }]),
    DocumentModel.countDocuments({ createdAt: { $gte: todayStart } }),
    UserModel.countDocuments({ createdAt: { $gte: thisMonthStart } }),
    UserModel.find().sort({ createdAt: -1 }).limit(5).select('-password').lean(),
    NoteModel.find().sort({ createdAt: -1 }).limit(5).populate('owner', 'name email').lean(),
    DocumentModel.find().sort({ createdAt: -1 }).limit(5).populate('uploadedBy', 'name email').lean(),
    // Daily user registrations for the last 7 days
    UserModel.aggregate([
      { $match: { createdAt: { $gte: last7Days } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', count: 1, _id: 0 } },
    ]),
    // Daily notes generated for the last 7 days
    NoteModel.aggregate([
      { $match: { createdAt: { $gte: last7Days } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', count: 1, _id: 0 } },
    ]),
    // Daily uploads for the last 7 days
    DocumentModel.aggregate([
      { $match: { createdAt: { $gte: last7Days } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', count: 1, _id: 0 } },
    ]),
  ]);

  const totalStorage = storageData.length > 0 ? storageData[0].total : 0;

  return {
    totalUsers,
    totalNotes,
    totalUploads,
    totalStorage,
    todaysUploads: todaysUploadsCount,
    monthlyGrowth: monthlyGrowthCount,
    recentUsers,
    recentNotes,
    recentUploads,
    userGrowthTimeline,
    notesTimeline,
    uploadsTimeline,
  };
};

export const getUsers = async (page = 1, limit = 10, search = '') => {
  const query = search ? {
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ]
  } : {};

  const total = await UserModel.countDocuments(query);
  const users = await UserModel.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .select('-password')
    .lean();

  return { users, total, page, totalPages: Math.ceil(total / limit) };
};

export const getUserById = async (id: string) => {
  const user = await UserModel.findById(id).select('-password').lean();
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

export const deleteUser = async (id: string) => {
  const user = await UserModel.findByIdAndDelete(id);
  if (!user) throw new ApiError(404, 'User not found');
  // Also delete their notes and documents
  await Promise.all([
    NoteModel.deleteMany({ owner: id }),
    DocumentModel.deleteMany({ uploadedBy: id })
  ]);
  return true;
};

export const getNotes = async (page = 1, limit = 10, search = '') => {
  const query = search ? { title: { $regex: search, $options: 'i' } } : {};
  const total = await NoteModel.countDocuments(query);
  const notes = await NoteModel.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('owner', 'name email')
    .lean();

  return { notes, total, page, totalPages: Math.ceil(total / limit) };
};

export const deleteNote = async (id: string) => {
  const note = await NoteModel.findByIdAndDelete(id);
  if (!note) throw new ApiError(404, 'Note not found');
  return true;
};

export const getUploads = async (page = 1, limit = 10, search = '') => {
  const query = search ? { originalName: { $regex: search, $options: 'i' } } : {};
  const total = await DocumentModel.countDocuments(query);
  const uploads = await DocumentModel.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('uploadedBy', 'name email')
    .lean();

  return { uploads, total, page, totalPages: Math.ceil(total / limit) };
};

export const deleteUpload = async (id: string) => {
  const upload = await DocumentModel.findByIdAndDelete(id);
  if (!upload) throw new ApiError(404, 'Upload not found');
  return true;
};
