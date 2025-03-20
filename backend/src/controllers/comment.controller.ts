import { Request, Response } from 'express';
import Comment from '../models/Comment';
import Post from '../models/Post';

// 댓글 생성
export const createComment = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const postId = req.params.postId;
    const user = (req as any).user;

    // 게시물 존재 확인
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
    }

    // 새 댓글 생성
    const comment = new Comment({
      content,
      author: user.id,
      post: postId
    });

    await comment.save();

    // 게시물의 댓글 목록에 추가
    post.comments.push(comment._id);
    await post.save();

    res.status(201).json({
      message: '댓글이 작성되었습니다.',
      comment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: '댓글 작성 중 오류가 발생했습니다.' });
  }
};

// 댓글 수정
export const updateComment = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const commentId = req.params.id;
    const user = (req as any).user;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    }

    // 작성자 확인
    if (comment.author.toString() !== user.id) {
      return res.status(403).json({ message: '댓글을 수정할 권한이 없습니다.' });
    }

    comment.content = content || comment.content;
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
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.id;
    const user = (req as any).user;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    }

    // 작성자 확인
    if (comment.author.toString() !== user.id) {
      return res.status(403).json({ message: '댓글을 삭제할 권한이 없습니다.' });
    }

    // 게시물에서 댓글 참조 제거
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: commentId }
    });

    await comment.remove();

    res.status(200).json({ message: '댓글이 삭제되었습니다.' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: '댓글 삭제 중 오류가 발생했습니다.' });
  }
};

// 게시물의 모든 댓글 조회
export const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;

    // 게시물 존재 확인
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
    }

    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate('author', 'username');

    res.status(200).json(comments);
  } catch (error) {
    console.error('Get comments by post error:', error);
    res.status(500).json({ message: '댓글 조회 중 오류가 발생했습니다.' });
  }
};
