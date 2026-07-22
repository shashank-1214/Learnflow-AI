import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, env.jwtSecret as string, {
    expiresIn: env.jwtExpiresIn as any,
  });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, env.jwtSecret as string);
};
