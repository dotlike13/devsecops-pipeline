import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import User, { IUser } from '../models/User';

// AuthRequest 인터페이스 수정
export interface AuthRequest extends Request {
  user?: IUser;
}

// auth 미들웨어 수정
export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ message: '인증 토큰이 없습니다.' });
      return;
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
    const user = await User.findById(decoded.id);
    
    if (!user) {
      res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: '인증에 실패했습니다.' });
  }
};

// 관리자 권한 확인 미들웨어 (향후 확장 가능)
export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: '관리자 권한이 필요합니다.' });
  }
};
