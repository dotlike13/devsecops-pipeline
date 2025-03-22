import { Router, Request, Response, NextFunction } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { auth, AuthRequest } from '../middleware/auth';

const router = Router();

// 타입이 지정된 에러 처리 미들웨어
const handleAsync = (handler: (req: Request | AuthRequest, res: Response) => Promise<void>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
};

// 라우트 정의
router.post('/register', handleAsync(register));
router.post('/login', handleAsync(login));
router.get('/me', auth, handleAsync(getMe));

export default router;
