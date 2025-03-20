# 빌드 스테이지
FROM node:16-alpine as build

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사 및 설치
COPY package.json package-lock.json* ./
RUN npm ci

# 소스 코드 복사
COPY . .

# TypeScript 컴파일
RUN npm run build

# 실행 스테이지
FROM node:16-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 프로덕션 의존성만 설치
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# 빌드 스테이지에서 컴파일된 코드 복사
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

# 환경 변수 설정
ENV NODE_ENV=production
ENV PORT=4000

# 4000 포트 노출
EXPOSE 4000

# 애플리케이션 실행
CMD ["node", "dist/server.js"]

