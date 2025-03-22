import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store.ts';
import { fetchPosts, votePost } from '../services/postsSlice.ts';
import { Post } from '../services/postsSlice.ts';
import { FaArrowUp, FaArrowDown, FaComments } from 'react-icons/fa';

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const { posts, status, error } = useSelector((state: RootState) => state.posts);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchPosts() as any);
  }, [dispatch]);

  const handleVote = async (postId: string, voteType: 'upvote' | 'downvote') => {
    if (!user) {
      alert('투표하려면 로그인이 필요합니다.');
      return;
    }
    dispatch(votePost({ id: postId, voteType }) as any);
  };

  if (status === 'loading') {
    return <div className="text-center py-8">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">최근 게시물</h1>
      
      {!posts || posts.length === 0 ? (
        <p className="text-gray-600 bg-white p-4 rounded-md shadow">게시물이 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post: Post) => (
            <div key={post._id} className="bg-white rounded-md shadow hover:shadow-md transition-shadow">
              <div className="flex">
                {/* 투표 섹션 */}
                <div className="flex flex-col items-center px-2 py-4 bg-gray-50 rounded-l-md">
                  <button
                    onClick={() => handleVote(post._id, 'upvote')}
                    className="text-gray-400 hover:text-orange-500 focus:outline-none"
                  >
                    <FaArrowUp size={20} />
                  </button>
                  <span className="my-1 font-medium text-sm">
                    {(post.upvotes || 0) - (post.downvotes || 0)}
                  </span>
                  <button
                    onClick={() => handleVote(post._id, 'downvote')}
                    className="text-gray-400 hover:text-blue-500 focus:outline-none"
                  >
                    <FaArrowDown size={20} />
                  </button>
                </div>

                {/* 컨텐츠 섹션 */}
                <div className="flex-1 p-4">
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <span>Posted by </span>
                    <span className="ml-1 hover:underline">
                      u/{post.author?.username || '알 수 없는 사용자'}
                    </span>
                    <span className="mx-1">•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <Link to={`/posts/${post._id}`}>
                    <h2 className="text-xl font-semibold mb-2 hover:text-orange-500">
                      {post.title}
                    </h2>
                  </Link>
                  
                  <p className="text-gray-600 mb-3 line-clamp-3">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center text-gray-500 text-sm">
                    <Link 
                      to={`/posts/${post._id}`}
                      className="flex items-center hover:bg-gray-100 px-2 py-1 rounded"
                    >
                      <FaComments className="mr-1" />
                      <span>{post.comments?.length || 0} 댓글</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
