import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import User from '../models/User';

// JWT 토큰 검증을 위한 인터페이스 확장
interface AuthRequest extends Request {
  user?: any;
}

// 인증 미들웨어
export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // 헤더에서 토큰 가져오기
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: '인증 토큰이 없습니다. 로그인이 필요합니다.' });
    }

    // 토큰 검증
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
    
    // 사용자 찾기
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }

    // 요청 객체에 사용자 정보 추가
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: '인증에 실패했습니다. 다시 로그인해주세요.' });
  }
};

// 관리자 권한 확인 미들웨어 (향후 확장 가능)
export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: '관리자 권한이 필요합니다.' });
  }
};
