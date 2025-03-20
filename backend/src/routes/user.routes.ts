import { Router } from 'express';
import { auth, adminOnly } from '../middleware/auth';

const router = Router();

// 사용자 프로필 조회 (인증 필요)
router.get('/profile', auth, (req, res) => {
  const user = (req as any).user;
  res.status(200).json({
    id: user._id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt
  });
});

// 향후 확장을 위한 사용자 관련 라우트 추가 가능

export default router;
