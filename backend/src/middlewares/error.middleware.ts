import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode ? error.statusCode : 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  const { statusCode, message } = error;

  res.locals.errorMessage = error.message;

  const response = {
    code: statusCode,
    message,
    ...(env.nodeEnv === 'development' && { stack: error.stack }),
  };

  if (env.nodeEnv === 'development') {
    console.error(`[ERROR] ${statusCode} - ${message}`);
    console.error(error.stack);
  }

  res.status(statusCode).send(response);
};
