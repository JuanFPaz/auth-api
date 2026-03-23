import express, { Request, Response, NextFunction } from 'express';
import { register, login, base, user } from '../controllers/auth.controller';
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

router.get('/me', protect, (req, res) => {
    user(req,res)
});

export default router;