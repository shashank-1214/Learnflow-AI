import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth.util';
import { UserModel, IUser } from '../models/user.model';
import { ApiError } from '../utils/ApiError';

// Extend Express Request interface to include the user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Not authorized, no token provided');
    }

    // Verify token
    const decoded = verifyToken(token);

    // Fetch user from DB
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, 'Not authorized, user no longer exists');
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error: any) {
    // If it's a JWT error (expired, invalid signature), normalize the response
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      next(new ApiError(401, 'Not authorized, token failed'));
    } else {
      next(error);
    }
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    next(new ApiError(403, 'Not authorized, require admin role'));
  }
};
