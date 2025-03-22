import { Request, Response } from 'express';
import Post, { IPost } from '../models/Post';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// 모든 게시물 조회
export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'username')
      .populate({
        path: 'comments',
        select: 'content author createdAt',
        populate: {
          path: 'author',
          select: 'username'
        }
      });

    // 응답 데이터 로깅 추가
    console.log('Posts response:', JSON.stringify(posts, null, 2));

    res.status(200).json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: '게시물 조회 중 오류가 발생했습니다.' });
  }
};

// 특정 게시물 조회
export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username')
      .populate({
        path: 'comments',
        select: 'content author createdAt',
        populate: {
          path: 'author',
          select: 'username'
        }
      });

    if (!post) {
      res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
      return;
    }

    res.status(200).json(post);
  } catch (error) {
    console.error('Get post by id error:', error);
    res.status(500).json({ message: '게시물 조회 중 오류가 발생했습니다.' });
  }
};

// 게시물 생성
export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;
    if (!req.user) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const post = new Post({
      title,
      content,
      author: req.user.id
    });

    await post.save();

    res.status(201).json({
      message: '게시물이 생성되었습니다.',
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: '게시물 생성 중 오류가 발생했습니다.' });
  }
};

// 게시물 수정
export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;
    if (!req.user) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
      return;
    }

    // 작성자 확인
    if (post.author.toString() !== req.user.id) {
      res.status(403).json({ message: '게시물을 수정할 권한이 없습니다.' });
      return;
    }

    post.title = title || post.title;
    post.content = content || post.content;

    await post.save();

    res.status(200).json({
      message: '게시물이 수정되었습니다.',
      post
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: '게시물 수정 중 오류가 발생했습니다.' });
  }
};

// 게시물 삭제
export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
      return;
    }

    // 작성자 확인
    if (post.author.toString() !== req.user.id) {
      res.status(403).json({ message: '게시물을 삭제할 권한이 없습니다.' });
      return;
    }

    await Post.deleteOne({ _id: post._id });

    res.status(200).json({ message: '게시물이 삭제되었습니다.' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: '게시물 삭제 중 오류가 발생했습니다.' });
  }
};

// 게시물 투표
export const votePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { voteType } = req.body;  // 'upvote' 또는 'downvote'
    
    if (!req.user) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const post = await Post.findById(id);

    if (!post) {
      res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
      return;
    }

    // 투표 업데이트
    if (voteType === 'upvote') {
      post.upvotes = (post.upvotes || 0) + 1;
    } else if (voteType === 'downvote') {
      post.downvotes = (post.downvotes || 0) + 1;
    } else {
      res.status(400).json({ message: '유효하지 않은 투표 유형입니다.' });
      return;
    }

    await post.save();

    // 업데이트된 게시물 반환
    const updatedPost = await Post.findById(id)
      .populate('author', 'username')
      .populate({
        path: 'comments',
        select: 'content author createdAt',
        populate: {
          path: 'author',
          select: 'username'
        }
      });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Vote post error:', error);
    res.status(500).json({ message: '투표 중 오류가 발생했습니다.' });
  }
};
