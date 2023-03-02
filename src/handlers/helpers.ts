import { NextFunction, Request, Response } from 'express';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { User } from '../models/user';
import dotenv from 'dotenv';

dotenv.config();

const TOKEN_KEY: Secret = process.env.TOKEN_KEY as Secret;

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const createToken = (user: User): string => {
  return jwt.sign({ user }, TOKEN_KEY);
};

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Invalid or missing token.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, TOKEN_KEY) as JwtPayload;
    req.user = decodedToken.user as User;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

export {
  createToken,
  verifyToken,
  TOKEN_KEY,
};
