import { Request, Response, NextFunction } from 'express';
import * as adminService from '../services/admin.service';

/**
 * POST /api/v1/admin/login
 * Admin-only login. Returns JWT on success.
 */
export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const { user, token } = await adminService.loginAdmin(email, password);

    res.status(200).json({
      success: true,
      message: 'Admin logged in successfully',
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/admin/me
 * Returns the currently authenticated admin's profile.
 * Protected by requireAuth + requireAdmin.
 */
export const getAdminProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      success: true,
      data: { user: (req as any).user },
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await adminService.getDashboardStats();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const data = await adminService.getUsers(page, limit, search);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await adminService.getUserById(req.params.id as string);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await adminService.deleteUser(req.params.id as string);
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const data = await adminService.getNotes(page, limit, search);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await adminService.deleteNote(req.params.id as string);
    res.status(200).json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getUploads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const data = await adminService.getUploads(page, limit, search);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const deleteUpload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await adminService.deleteUpload(req.params.id as string);
    res.status(200).json({ success: true, message: 'Upload deleted successfully' });
  } catch (error) {
    next(error);
  }
};
