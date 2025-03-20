import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../services/postsSlice';

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const { posts, status, error } = useSelector((state: any) => state.posts);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPosts() as any);
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <div className="loading">게시물을 불러오는 중...</div>;
  }

  if (status === 'failed') {
    return <div className="error">오류: {error}</div>;
  }

  return (
    <div className="home-page">
      <div className="posts-header">
        <h1>최근 게시물</h1>
        <Link to="/create-post" className="btn btn-primary">
          새 게시물 작성
        </Link>
      </div>

      <div className="posts-list">
        {posts.length === 0 ? (
          <p>게시물이 없습니다.</p>
        ) : (
          posts.map((post: any) => (
            <div key={post.id} className="post-card">
              <h2>
                <Link to={`/posts/${post.id}`}>{post.title}</Link>
              </h2>
              <div className="post-meta">
                <span className="author">작성자: {post.author}</span>
                <span className="date">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="post-stats">
                <span className="upvotes">👍 {post.upvotes}</span>
                <span className="downvotes">👎 {post.downvotes}</span>
                <span className="comments">💬 {post.comments}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
