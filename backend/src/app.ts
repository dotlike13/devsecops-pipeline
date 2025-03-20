import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config/config';

// 라우트 임포트
import authRoutes from './routes/auth.routes';
import postRoutes from './routes/post.routes';
import commentRoutes from './routes/comment.routes';
import userRoutes from './routes/user.routes';

// Express 앱 초기화
const app: Application = express();

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));
app.use(helmet());
app.use(morgan(config.logFormat));

// MongoDB 연결
mongoose.connect(config.mongoURI)
  .then(() => {
    console.log('MongoDB 연결 성공');
  })
  .catch((err) => {
    console.error('MongoDB 연결 실패:', err);
    process.exit(1);
  });

// 기본 라우트
app.get('/', (req: Request, res: Response) => {
  res.json({ message: '커뮤니티 API 서버에 오신 것을 환영합니다!' });
});

// API 라우트
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

// 404 에러 처리
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: '요청한 리소스를 찾을 수 없습니다.' });
});

// 에러 처리 미들웨어
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: '서버 내부 오류가 발생했습니다.' });
});

export default app;
