import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store.ts';
import App from './App.tsx';
import './index.css';
import axios from 'axios';

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

// axios 기본 설정
axios.defaults.baseURL = 'http://localhost:4000'; // 백엔드 서버 주소
axios.defaults.headers.common['Content-Type'] = 'application/json';

// axios 인터셉터 설정
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
