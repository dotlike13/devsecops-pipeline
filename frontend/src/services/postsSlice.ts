import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 게시물 타입 정의
export interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
  comments: any[];
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
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/posts');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '게시물을 불러오는데 실패했습니다.');
    }
  }
);

export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (id: string) => {
    try {
      const response = await axios.get(`/api/posts/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '게시물을 불러오는데 실패했습니다.');
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (post: { title: string; content: string }) => {
    try {
      const response = await axios.post('/api/posts', post);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '게시물 생성에 실패했습니다.');
    }
  }
);

export const updatePost = createAsyncThunk('posts/updatePost',
  async ({ id, post }: { id: string; post: { title: string; content: string } }) => {
    try {
      const response = await axios.put(`/posts/${id}`, post);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '게시물 수정에 실패했습니다.');
    }
  }
);

export const deletePost = createAsyncThunk('posts/deletePost',
  async (id: string) => {
    try {
      await axios.delete(`/posts/${id}`);
      return id;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '게시물 삭제에 실패했습니다.');
    }
  }
);

export const votePost = createAsyncThunk(
  'posts/votePost',
  async ({ id, voteType }: { id: string; voteType: 'upvote' | 'downvote' }) => {
    try {
      const response = await axios.post(`/api/posts/${id}/vote`, { voteType });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '투표에 실패했습니다.');
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
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
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
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || '게시물 생성에 실패했습니다.';
      })
      // updatePost
      .addCase(updatePost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        if (state.post?._id === action.payload._id) {
          state.post = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || '게시물 수정에 실패했습니다.';
      })
      // deletePost
      .addCase(deletePost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = state.posts.filter(post => post._id !== action.payload);
        if (state.post?._id === action.payload) {
          state.post = null;
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || '게시물 삭제에 실패했습니다.';
      })
      // votePost
      .addCase(votePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        if (state.post?._id === action.payload._id) {
          state.post = action.payload;
        }
      });
  }
});

export const { clearPostDetail } = postsSlice.actions;

export default postsSlice.reducer;
