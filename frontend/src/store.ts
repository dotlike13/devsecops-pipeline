import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './services/postsSlice.ts';
import authReducer from './services/authSlice.ts';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 