import app from './app';
import config from './config/config';

const PORT = config.port;

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`환경: ${config.nodeEnv}`);
});
