import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import postsReducer from './services/postsSlice';
import authReducer from './services/authSlice';

// Redux 스토어 구성
const store = configureStore({
  reducer: {
    posts: postsReducer,
    auth: authReducer,
  },
});

// 루트 엘리먼트 생성
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// 앱 렌더링
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
