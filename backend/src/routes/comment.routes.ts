import { Router } from 'express';
import { createComment, updateComment, deleteComment, getCommentsByPost } from '../controllers/comment.controller';
import { auth } from '../middleware/auth';

const router = Router();

// 게시물의 모든 댓글 조회 (인증 불필요)
router.get('/post/:postId', getCommentsByPost);

// 댓글 생성 (인증 필요)
router.post('/post/:postId', auth, createComment);

// 댓글 수정 (인증 필요)
router.put('/:id', auth, updateComment);

// 댓글 삭제 (인증 필요)
router.delete('/:id', auth, deleteComment);

export default router;
