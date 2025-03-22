import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <div className="text-center py-8">로그인이 필요합니다.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">프로필</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="text-gray-600">아이디</label>
              <p className="text-xl">{user.username}</p>
            </div>
            <div>
              <label className="text-gray-600">이메일</label>
              <p className="text-xl">{user.email}</p>
            </div>
            <div>
              <label className="text-gray-600">가입일</label>
              <p className="text-xl">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
