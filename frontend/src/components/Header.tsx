import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store.ts';
import { logout } from '../services/authSlice.ts';
import { FaUser, FaPen, FaSignOutAlt } from 'react-icons/fa';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 h-12 flex justify-between items-center">
        <Link 
          to="/" 
          className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
        >
          커뮤니티
        </Link>
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              <Link 
                to="/posts/create" 
                className="flex items-center px-4 h-8 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                <FaPen className="mr-2" size={14} />
                글쓰기
              </Link>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center px-4 h-8 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  <FaUser className="mr-2" size={14} />
                  {user?.username || '사용자'}
                </button>
                {isDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200"
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                    >
                      <FaUser className="mr-2" size={14} />
                      프로필
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                    >
                      <FaSignOutAlt className="mr-2" size={14} />
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                로그인
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
