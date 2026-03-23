// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const protect = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || ' ';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ status:401, message: 'Missing or invalid Authorization header' });
    }

    try {
        const decoded = verifyToken(token);
        
        req.body = { id: decoded.id }
        next();
    } catch (err) {
        res.status(401).json({ status:401, message: 'Invalid or expired token' });
        return;
    }
};