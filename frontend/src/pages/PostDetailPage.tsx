import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostById, clearPostDetail } from '../services/postsSlice';

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { post, status, error } = useSelector((state: any) => state.posts);
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(id) as any);
    }

    // 컴포넌트 언마운트 시 상태 초기화
    return () => {
      dispatch(clearPostDetail());
    };
  }, [id, dispatch]);

  if (status === 'loading') {
    return <div className="loading">게시물을 불러오는 중...</div>;
  }

  if (status === 'failed') {
    return <div className="error">오류: {error}</div>;
  }

  if (!post) {
    return <div className="not-found">게시물을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="post-detail-page">
      <div className="post-header">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span className="author">작성자: {post.author}</span>
          <span className="date">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="post-content">
        <p>{post.content}</p>
      </div>

      <div className="post-actions">
        <div className="vote-buttons">
          <button className="upvote">👍 {post.upvotes}</button>
          <button className="downvote">👎 {post.downvotes}</button>
        </div>
        <Link to="/" className="btn btn-secondary">
          목록으로 돌아가기
        </Link>
      </div>

      <div className="comments-section">
        <h2>댓글 ({post.comments?.length || 0})</h2>
        
        {isAuthenticated ? (
          <div className="comment-form">
            <textarea placeholder="댓글을 입력하세요..."></textarea>
            <button className="btn btn-primary">댓글 작성</button>
          </div>
        ) : (
          <p>
            <Link to="/login">로그인</Link>하여 댓글을 작성하세요.
          </p>
        )}

        <div className="comments-list">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment: any) => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <span className="comment-author">{comment.author}</span>
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="comment-body">
                  <p>{comment.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p>아직 댓글이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
