import { Request, Response } from 'express';
import Post from '../models/Post';
import User from '../models/User';

// 모든 게시물 조회
export const getPosts = async (req: Request, res: Response) => {
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

    res.status(200).json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: '게시물 조회 중 오류가 발생했습니다.' });
  }
};

// 특정 게시물 조회
export const getPostById = async (req: Request, res: Response) => {
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
      return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error('Get post by id error:', error);
    res.status(500).json({ message: '게시물 조회 중 오류가 발생했습니다.' });
  }
};

// 게시물 생성
export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const user = (req as any).user;

    const post = new Post({
      title,
      content,
      author: user.id
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
export const updatePost = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const user = (req as any).user;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
    }

    // 작성자 확인
    if (post.author.toString() !== user.id) {
      return res.status(403).json({ message: '게시물을 수정할 권한이 없습니다.' });
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
export const deletePost = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
    }

    // 작성자 확인
    if (post.author.toString() !== user.id) {
      return res.status(403).json({ message: '게시물을 삭제할 권한이 없습니다.' });
    }

    await post.remove();

    res.status(200).json({ message: '게시물이 삭제되었습니다.' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: '게시물 삭제 중 오류가 발생했습니다.' });
  }
};

// 게시물 투표
export const votePost = async (req: Request, res: Response) => {
  try {
    const { vote } = req.body;  // 'up' 또는 'down'
    const user = (req as any).user;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
    }

    if (vote === 'up') {
      post.upvotes += 1;
    } else if (vote === 'down') {
      post.downvotes += 1;
    } else {
      return res.status(400).json({ message: '유효하지 않은 투표 유형입니다.' });
    }

    await post.save();

    res.status(200).json({
      message: '투표가 반영되었습니다.',
      upvotes: post.upvotes,
      downvotes: post.downvotes
    });
  } catch (error) {
    console.error('Vote post error:', error);
    res.status(500).json({ message: '투표 중 오류가 발생했습니다.' });
  }
};
