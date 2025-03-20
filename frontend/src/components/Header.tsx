import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../services/authSlice';

const Header: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">커뮤니티</Link>
          </div>
          <nav className="nav">
            <ul>
              <li><Link to="/">홈</Link></li>
              {isAuthenticated ? (
                <>
                  <li><Link to="/create-post">글 작성</Link></li>
                  <li><Link to="/profile">프로필</Link></li>
                  <li><button onClick={handleLogout}>로그아웃</button></li>
                  <li><span>안녕하세요, {user?.username}님!</span></li>
                </>
              ) : (
                <>
                  <li><Link to="/login">로그인</Link></li>
                  <li><Link to="/register">회원가입</Link></li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
