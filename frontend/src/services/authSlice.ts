import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 사용자 타입 정의
export interface User {
  id: string;
  username: string;
  email: string;
  token: string;
}

interface AuthState {
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  isAuthenticated: boolean;
}

// 초기 상태
const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
  isAuthenticated: false
};

// API 요청을 위한 비동기 thunk 생성
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { username: string; email: string; password: string }) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return Promise.reject('No token found');
      }
      
      const response = await axios.get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

// 인증 슬라이스 생성
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || '로그인에 실패했습니다.';
      })
      // register
      .addCase(register.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || '회원가입에 실패했습니다.';
      })
      // fetchCurrentUser
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.status = 'failed';
        state.user = null;
        state.isAuthenticated = false;
      });
  }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
