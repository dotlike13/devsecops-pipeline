import React from 'react';
import { useSelector } from 'react-redux';

const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth);

  if (!user) {
    return <div className="loading">사용자 정보를 불러오는 중...</div>;
  }

  return (
    <div className="profile-page">
      <h1>사용자 프로필</h1>
      
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {/* 사용자 이니셜 표시 */}
            <div className="avatar-placeholder">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="profile-info">
            <h2>{user.username}</h2>
            <p>{user.email}</p>
          </div>
        </div>
        
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">0</span>
            <span className="stat-label">게시물</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">0</span>
            <span className="stat-label">댓글</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">0</span>
            <span className="stat-label">좋아요</span>
          </div>
        </div>
        
        <div className="profile-actions">
          <button className="btn btn-secondary">프로필 수정</button>
          <button className="btn btn-secondary">비밀번호 변경</button>
        </div>
      </div>
      
      <div className="user-activity">
        <h2>최근 활동</h2>
        <div className="activity-empty">
          <p>아직 활동 내역이 없습니다.</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
