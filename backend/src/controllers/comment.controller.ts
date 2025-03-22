import { Request, Response } from 'express';
import Comment, { IComment } from '../models/Comment';
import Post, { IPost } from '../models/Post';
import { AuthRequest } from '../middleware/auth';
import mongoose, { Types } from 'mongoose';

// 댓글 생성
export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content } = req.body;
    if (!req.user) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const postId = new Types.ObjectId(req.params.postId as string);
    const post = await Post.findById(postId) as IPost;
    if (!post) {
      res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
      return;
    }

    const comment = await Comment.create({
      content,
      author: req.user._id,
      post: postId
    }) as IComment;

    // 게시물의 comments 배열에 추가
    post.comments.push(comment._id);
    await post.save();

    res.status(201).json({
      message: '댓글이 생성되었습니다.',
      comment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: '댓글 생성 중 오류가 발생했습니다.' });
  }
};

// 댓글 수정
export const updateComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content } = req.body;
    if (!req.user) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const commentId = new Types.ObjectId(req.params.id as string);
    const comment = await Comment.findById(commentId) as IComment;
    if (!comment) {
      res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
      return;
    }

    // 작성자 확인
    if (comment.author.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: '댓글을 수정할 권한이 없습니다.' });
      return;
    }

    comment.content = content;
    await comment.save();

    res.status(200).json({
      message: '댓글이 수정되었습니다.',
      comment
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: '댓글 수정 중 오류가 발생했습니다.' });
  }
};

// 댓글 삭제
export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const commentId = new Types.ObjectId(req.params.id as string);
    const comment = await Comment.findById(commentId) as IComment;
    if (!comment) {
      res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
      return;
    }

    // 작성자 확인
    if (comment.author.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: '댓글을 삭제할 권한이 없습니다.' });
      return;
    }

    // 게시물에서 댓글 ID 제거
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id }
    });

    await Comment.deleteOne({ _id: comment._id });

    res.status(200).json({ message: '댓글이 삭제되었습니다.' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: '댓글 삭제 중 오류가 발생했습니다.' });
  }
};

// 게시물의 모든 댓글 조회
export const getCommentsByPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = new Types.ObjectId(req.params.postId as string);
    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate('author', 'username');

    res.status(200).json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: '댓글 조회 중 오류가 발생했습니다.' });
  }
};
