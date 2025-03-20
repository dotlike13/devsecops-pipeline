# Community Backend

Reddit 스타일 커뮤니티 웹 애플리케이션의 백엔드 저장소입니다.

## 기술 스택

- Node.js
- Express.js (웹 프레임워크)
- MongoDB (데이터베이스)
- Mongoose (ODM)
- Jest (테스트)
- Docker (컨테이너화)

## 브랜치 구조

- `dev`: 개발 환경 (기본 브랜치)
- `stg`: 스테이징 환경
- `prod`: 프로덕션 환경

## DevSecOps 파이프라인

이 저장소는 다음과 같은 DevSecOps 파이프라인을 통해 관리됩니다:

1. **CI 파이프라인** (GitHub Actions)
   - 코드 빌드
   - SAST 점검 (SonarQube)
   - Docker 이미지 빌드
   - 이미지 취약점 스캔 (Trivy)
   - Harbor 레지스트리 푸시

2. **보안 점검**
   - CSA (Checkov)
   - SBOM 생성 (Trivy)
   - DAST 점검 (OWASP ZAP, dev/stg 환경)

3. **CD 파이프라인** (ArgoCD)
   - Harbor에서 이미지 가져오기
   - Helm을 통한 배포
   - 애플리케이션 모니터링

## 민감 정보 관리

- HashiCorp Vault를 사용하여 민감 정보 관리
- 환경별 시크릿 분리 (dev, stg, prod)

## 설치 및 실행 방법

### 로컬 개발 환경

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 테스트 실행
npm test

# 프로덕션 빌드 및 실행
npm run build
npm start
```

### Docker를 통한 실행

```bash
# Docker 이미지 빌드
docker build -t community-backend:latest .

# Docker 컨테이너 실행
docker run -p 4000:4000 community-backend:latest
```

## API 엔드포인트

- `/api/auth`: 인증 관련 엔드포인트
- `/api/posts`: 게시물 관련 엔드포인트
- `/api/comments`: 댓글 관련 엔드포인트
- `/api/users`: 사용자 관련 엔드포인트

## 데이터베이스 스키마

- User: 사용자 정보
- Post: 게시물 정보
- Comment: 댓글 정보
- Category: 게시물 카테고리
