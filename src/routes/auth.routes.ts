import express, { Request, Response, NextFunction } from 'express';
import { register, login,  user, logout } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', (req: Request, res: Response, next: NextFunction) => {
    register(req, res).catch(next);
});
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
    login(req, res).catch(next);
});

router.get('/me', protect, (req:Request, res:Response) => {
    user(req,res)
});

router.post('/logout', protect,(req:Request,res:Response)=>{
    logout(req,res)
})

export default router;