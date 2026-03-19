// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const protect = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || ' ';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }

    try {
        const decoded = verifyToken(token);
        console.log(decoded);
        
        (req as any).user = { id: decoded.id, username: decoded.name }
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
        return;
    }
};