import jwt, { Secret } from 'jsonwebtoken';
import { User } from '../models/user';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';

// load environment variables
dotenv.config();

// constant to hold the value of the token secret key
const SECRET = process.env.TOKEN_KEY as Secret;
export const getTokenByUser = (user: User) => {
    return jwt.sign({ user }, SECRET);
};

export const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // check if the authorization header is not present
    if (!req.headers.authorization) {
        res.status(401).json({ error: 'Access denied, invalid token' });
        return false;
    }
    try {
        // extract the token from the authorization header
        const token = req.headers.authorization.split(' ')[1];
        // verify the token using the secret key
        jwt.verify(token, SECRET);
        // proceed to the next middleware function
        next();
    } catch (error) {
        // send error response if the token is invalid
        res.status(401);
        res.json('Access denied, invalid token');
        return;
    }
};
