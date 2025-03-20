# Community Frontend

Reddit 스타일 커뮤니티 웹 애플리케이션의 프론트엔드 저장소입니다.

## 기술 스택

- React.js
- Redux (상태 관리)
- React Router (라우팅)
- Axios (API 통신)
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

## 설치 및 실행 방법

### 로컬 개발 환경

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start

# 테스트 실행
npm test

# 프로덕션 빌드
npm run build
```

### Docker를 통한 실행

```bash
# Docker 이미지 빌드
docker build -t community-frontend:latest .

# Docker 컨테이너 실행
docker run -p 3000:80 community-frontend:latest
```

## 주요 기능

- 게시물 목록 보기
- 게시물 상세 보기
- 게시물 작성 및 편집
- 댓글 작성 및 관리
- 사용자 프로필 관리
