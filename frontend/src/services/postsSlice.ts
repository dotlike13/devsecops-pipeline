import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 게시물 타입 정의
export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  comments: number;
}

interface PostsState {
  posts: Post[];
  post: Post | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// 초기 상태
const initialState: PostsState = {
  posts: [],
  post: null,
  status: 'idle',
  error: null
};

// API 요청을 위한 비동기 thunk 생성
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  try {
    // 실제 환경에서는 백엔드 API URL로 변경
    const response = await axios.get('/api/posts');
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
});

export const fetchPostById = createAsyncThunk('posts/fetchPostById', async (id: string) => {
  try {
    const response = await axios.get(`/api/posts/${id}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
});

export const createPost = createAsyncThunk('posts/createPost', 
  async (post: { title: string; content: string }) => {
    try {
      const response = await axios.post('/api/posts', post);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

// 게시물 슬라이스 생성
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearPostDetail: (state) => {
      state.post = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchPosts
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || '게시물을 불러오는데 실패했습니다.';
      })
      // fetchPostById
      .addCase(fetchPostById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.post = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || '게시물을 불러오는데 실패했습니다.';
      })
      // createPost
      .addCase(createPost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts.push(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || '게시물 생성에 실패했습니다.';
      });
  }
});

export const { clearPostDetail } = postsSlice.actions;

export default postsSlice.reducer;
