// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

//Middleware protect.auth
export const protect = (req: Request, res: Response, next: NextFunction) => {
    // const authHeader = req.headers.authorization || ' ';
    // const [scheme, token] = authHeader.split(' ');

    // if (scheme !== 'Bearer' || !token) {
    //     return res.status(401).json({ status:401, message: 'Missing or invalid Authorization header' });
    // }
    const token = req.cookies.access_token

    if(!token) return res.status(401).json({ status:401, message: 'Missing or invalid Authorization header' });

    try {
        const decoded = verifyToken(token);
        
        (req as any).user = { id: decoded.id }
        next();
    } catch (err) {
        res.status(401).json({ status:401, message: 'Invalid or expired token' });
        return;
    }
};