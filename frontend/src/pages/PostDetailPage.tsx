import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store.ts';
import { fetchPostById, deletePost } from '../services/postsSlice.ts';

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { post, status, error } = useSelector((state: RootState) => state.posts);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(id) as any);
    }
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (window.confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
      try {
        await dispatch(deletePost(id!) as any);
        navigate('/');
      } catch (err) {
        console.error('게시물 삭제 실패:', err);
      }
    }
  };

  if (status === 'loading') {
    return <div className="text-center py-8">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!post) {
    return <div className="text-center py-8">게시물을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">{post.title}</h1>
        <div className="flex items-center text-gray-600 mb-8">
          <span className="font-medium">{post.author.username}</span>
          <span className="mx-2">•</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="prose prose-lg max-w-none mb-8">
          {post.content}
        </div>
        {user && user._id === post.author._id && (
          <div className="flex space-x-4 mt-8 pt-8 border-t">
            <button
              onClick={() => navigate(`/posts/${post._id}/edit`)}
              className="btn-primary"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="btn-secondary text-red-600 hover:bg-red-50"
            >
              삭제
            </button>
          </div>
        )}
      </article>
    </div>
  );
};

export default PostDetailPage;
