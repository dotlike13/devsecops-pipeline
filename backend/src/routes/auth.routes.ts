import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { auth } from '../middleware/auth';

const router = Router();

// 회원가입
router.post('/register', register);

// 로그인
router.post('/login', login);

// 현재 사용자 정보 조회 (인증 필요)
router.get('/me', auth, getMe);

export default router;
