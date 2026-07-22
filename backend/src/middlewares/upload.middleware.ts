import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { ApiError } from '../utils/ApiError';

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

// Ensure base upload directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subFolder = 'others';
    
    if (file.mimetype === 'application/pdf') subFolder = 'pdf';
    else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') subFolder = 'docx';
    else if (file.mimetype === 'text/plain') subFolder = 'text';
    else if (file.mimetype.startsWith('image/')) subFolder = 'images';

    const dir = path.join(UPLOADS_DIR, subFolder);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  console.log('[MULTER DEBUG] req.body before validation:', req.body);
  console.log('[MULTER DEBUG] req.file to validate:', file);
  console.log('[MULTER DEBUG] req.file.mimetype:', file.mimetype);

  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Invalid file type. Only PDF, DOCX, TXT, PNG, JPG, JPEG, and WEBP are allowed.') as any, false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter,
});
