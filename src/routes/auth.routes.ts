import express, { Request, Response, NextFunction } from 'express';
import { register, login, base } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    base(req,res).catch(next)
});

router.post('/register', (req: Request, res: Response, next: NextFunction) => {
    register(req, res).catch(next);
});
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
    login(req, res).catch(next);
});

router.get('/me', protect, (req, res): void => {
    res.json({ message: 'You are authorized', user: (req as any).user })
});

export default router;