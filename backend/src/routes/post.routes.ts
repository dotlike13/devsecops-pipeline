import { Router, Request, Response, NextFunction } from 'express';
import { getPosts, getPostById, createPost, updatePost, deletePost, votePost } from '../controllers/post.controller';
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

// 모든 게시물 조회 (인증 불필요)
router.get('/', handleAsync(getPosts));

// 특정 게시물 조회 (인증 불필요)
router.get('/:id', handleAsync(getPostById));

// 게시물 생성 (인증 필요)
router.post('/', auth, handleAsync(createPost));

// 게시물 수정 (인증 필요)
router.put('/:id', auth, handleAsync(updatePost));

// 게시물 삭제 (인증 필요)
router.delete('/:id', auth, handleAsync(deletePost));

// 게시물 투표 (인증 필요)
router.post('/:id/vote', auth, handleAsync(votePost));

export default router;
