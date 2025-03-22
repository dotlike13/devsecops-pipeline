import { Router, Request, Response, NextFunction } from 'express';
import { createComment, updateComment, deleteComment, getCommentsByPost } from '../controllers/comment.controller';
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

// 게시물의 모든 댓글 조회 (인증 불필요)
router.get('/post/:postId', handleAsync(getCommentsByPost));

// 댓글 생성 (인증 필요)
router.post('/post/:postId', auth, handleAsync(createComment));

// 댓글 수정 (인증 필요)
router.put('/:id', auth, handleAsync(updateComment));

// 댓글 삭제 (인증 필요)
router.delete('/:id', auth, handleAsync(deleteComment));

export default router;
