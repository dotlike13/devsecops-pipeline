import { Router } from 'express';
import { getPosts, getPostById, createPost, updatePost, deletePost, votePost } from '../controllers/post.controller';
import { auth } from '../middleware/auth';

const router = Router();

// 모든 게시물 조회 (인증 불필요)
router.get('/', getPosts);

// 특정 게시물 조회 (인증 불필요)
router.get('/:id', getPostById);

// 게시물 생성 (인증 필요)
router.post('/', auth, createPost);

// 게시물 수정 (인증 필요)
router.put('/:id', auth, updatePost);

// 게시물 삭제 (인증 필요)
router.delete('/:id', auth, deletePost);

// 게시물 투표 (인증 필요)
router.post('/:id/vote', auth, votePost);

export default router;
