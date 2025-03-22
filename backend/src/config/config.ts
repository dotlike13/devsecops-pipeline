import dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config();

interface Config {
  port: number | string;
  nodeEnv: string;
  mongoURI: string;
  jwtSecret: string;
  jwtExpire: '24h' | '7d' | '30d';
  logFormat: string;
  corsOrigin: string;
}

const config: Config = {
  // 서버 설정
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // MongoDB 설정
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/community',
  
  // JWT 설정
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  jwtExpire: process.env.JWT_EXPIRE as '24h' | '7d' | '30d' || '24h',
  
  // 로그 설정
  logFormat: process.env.LOG_FORMAT || 'dev',
  
  // CORS 설정
  corsOrigin: process.env.CORS_ORIGIN || '*',
};

export default config;
