# Helm 차트 설정 문서

## 개요

이 문서는 DevSecOps 포트폴리오 프로젝트의 Helm 차트 설정에 대한 상세 정보를 제공합니다. 프론트엔드와 백엔드 애플리케이션을 위한 Helm 차트와 공통 라이브러리 차트가 구현되었으며, 이를 통해 Kubernetes 환경에서 애플리케이션을 효율적으로 배포하고 관리할 수 있습니다.

## 구성 요소

Helm 차트는 다음과 같은 주요 구성 요소로 이루어져 있습니다:

1. **프론트엔드 Helm 차트**: React 기반 프론트엔드 애플리케이션 배포를 위한 차트
2. **백엔드 Helm 차트**: Node.js Express 기반 백엔드 애플리케이션 배포를 위한 차트
3. **공통 라이브러리 차트**: 프론트엔드와 백엔드 차트에서 공통으로 사용하는 기능과 설정을 제공하는 라이브러리 차트

## 디렉토리 구조

```
helm-charts/
├── frontend/                  # 프론트엔드 애플리케이션 차트
│   ├── Chart.yaml             # 차트 메타데이터
│   ├── values.yaml            # 기본 설정값
│   └── templates/             # Kubernetes 매니페스트 템플릿
│       ├── deployment.yaml    # Deployment 리소스
│       ├── service.yaml       # Service 리소스
│       ├── ingress.yaml       # Ingress 리소스
│       ├── serviceaccount.yaml # ServiceAccount 리소스
│       ├── hpa.yaml           # HorizontalPodAutoscaler 리소스
│       └── _helpers.tpl       # 헬퍼 함수 정의
├── backend/                   # 백엔드 애플리케이션 차트
│   ├── Chart.yaml             # 차트 메타데이터
│   ├── values.yaml            # 기본 설정값
│   └── templates/             # Kubernetes 매니페스트 템플릿
│       ├── deployment.yaml    # Deployment 리소스
│       ├── service.yaml       # Service 리소스
│       ├── ingress.yaml       # Ingress 리소스
│       ├── serviceaccount.yaml # ServiceAccount 리소스
│       ├── hpa.yaml           # HorizontalPodAutoscaler 리소스
│       └── _helpers.tpl       # 헬퍼 함수 정의
└── common/                    # 공통 라이브러리 차트
    ├── Chart.yaml             # 차트 메타데이터
    ├── values.yaml            # 기본 설정값
    └── templates/             # 공통 템플릿
        └── _helpers.tpl       # 공통 헬퍼 함수 정의
```

## 프론트엔드 Helm 차트

### 주요 특징

- React 기반 프론트엔드 애플리케이션 배포
- 환경 변수 구성을 통한 백엔드 API URL 설정
- Ingress 리소스를 통한 외부 접근 설정
- 수평 확장 기능 (HPA) 지원
- 리소스 요청 및 제한 설정
- 라이브니스 및 레디니스 프로브 구성

### 주요 설정 옵션 (values.yaml)

| 옵션 | 설명 | 기본값 |
|------|------|--------|
| `replicaCount` | 복제본 수 | `1` |
| `image.repository` | 이미지 저장소 | `harbor.local/community/frontend` |
| `image.tag` | 이미지 태그 | `latest` |
| `service.type` | 서비스 타입 | `ClusterIP` |
| `service.port` | 서비스 포트 | `80` |
| `ingress.enabled` | Ingress 활성화 여부 | `true` |
| `ingress.hosts` | Ingress 호스트 설정 | `frontend.community.local` |
| `resources.limits` | 리소스 제한 | CPU: `500m`, Memory: `512Mi` |
| `resources.requests` | 리소스 요청 | CPU: `100m`, Memory: `128Mi` |
| `env.NODE_ENV` | Node.js 환경 | `production` |
| `env.API_URL` | 백엔드 API URL | `http://backend-service:8080` |

## 백엔드 Helm 차트

### 주요 특징

- Node.js Express 기반 백엔드 애플리케이션 배포
- MongoDB 연결 설정
- JWT 시크릿 및 CORS 설정
- Swagger 문서화 활성화/비활성화 옵션
- 수평 확장 기능 (HPA) 지원
- 리소스 요청 및 제한 설정
- 라이브니스 및 레디니스 프로브 구성

### 주요 설정 옵션 (values.yaml)

| 옵션 | 설명 | 기본값 |
|------|------|--------|
| `replicaCount` | 복제본 수 | `1` |
| `image.repository` | 이미지 저장소 | `harbor.local/community/backend` |
| `image.tag` | 이미지 태그 | `latest` |
| `service.type` | 서비스 타입 | `ClusterIP` |
| `service.port` | 서비스 포트 | `8080` |
| `ingress.enabled` | Ingress 활성화 여부 | `true` |
| `ingress.hosts` | Ingress 호스트 설정 | `backend.community.local` |
| `resources.limits` | 리소스 제한 | CPU: `500m`, Memory: `512Mi` |
| `resources.requests` | 리소스 요청 | CPU: `100m`, Memory: `128Mi` |
| `env.NODE_ENV` | Node.js 환경 | `production` |
| `env.MONGODB_URI` | MongoDB 연결 문자열 | `mongodb://mongodb-service:27017/community` |
| `env.JWT_SECRET` | JWT 시크릿 | `${JWT_SECRET}` |
| `env.ENABLE_SWAGGER` | Swagger 활성화 여부 | `false` |

## 공통 라이브러리 차트

### 주요 특징

- 프론트엔드와 백엔드 차트에서 공통으로 사용하는 기능 제공
- 공통 헬퍼 함수 정의
- 공통 레이블 및 셀렉터 정의
- 공통 환경 변수 설정
- 공통 리소스 설정

### 주요 설정 옵션 (values.yaml)

| 옵션 | 설명 | 기본값 |
|------|------|--------|
| `env.NODE_ENV` | 기본 Node.js 환경 | `production` |
| `env.LOG_LEVEL` | 로그 레벨 | `info` |
| `resources.limits` | 기본 리소스 제한 | CPU: `500m`, Memory: `512Mi` |
| `resources.requests` | 기본 리소스 요청 | CPU: `100m`, Memory: `128Mi` |
| `service.type` | 기본 서비스 타입 | `ClusterIP` |
| `ingress.enabled` | 기본 Ingress 활성화 여부 | `true` |
| `ingress.className` | 기본 Ingress 클래스 | `nginx` |

## 사용 방법

### 의존성 업데이트

Helm 차트를 사용하기 전에 의존성을 업데이트해야 합니다:

```bash
# 프론트엔드 차트 의존성 업데이트
helm dependency update ./helm-charts/frontend

# 백엔드 차트 의존성 업데이트
helm dependency update ./helm-charts/backend
```

### 차트 설치

#### 개발 환경 설치

```bash
# 프론트엔드 설치 (개발 환경)
helm install frontend ./helm-charts/frontend \
  --set env.NODE_ENV=development \
  --set env.LOG_LEVEL=debug \
  --set env.ENABLE_ANALYTICS=false \
  --namespace community-dev \
  --create-namespace

# 백엔드 설치 (개발 환경)
helm install backend ./helm-charts/backend \
  --set env.NODE_ENV=development \
  --set env.LOG_LEVEL=debug \
  --set env.ENABLE_SWAGGER=true \
  --namespace community-dev \
  --create-namespace
```

#### 프로덕션 환경 설치

```bash
# 프론트엔드 설치 (프로덕션 환경)
helm install frontend ./helm-charts/frontend \
  --set env.NODE_ENV=production \
  --set env.LOG_LEVEL=error \
  --set env.ENABLE_ANALYTICS=true \
  --set replicaCount=3 \
  --set autoscaling.enabled=true \
  --namespace community-prod \
  --create-namespace

# 백엔드 설치 (프로덕션 환경)
helm install backend ./helm-charts/backend \
  --set env.NODE_ENV=production \
  --set env.LOG_LEVEL=error \
  --set env.ENABLE_SWAGGER=false \
  --set replicaCount=3 \
  --set autoscaling.enabled=true \
  --namespace community-prod \
  --create-namespace
```

### 차트 업그레이드

```bash
# 프론트엔드 업그레이드
helm upgrade frontend ./helm-charts/frontend \
  --reuse-values \
  --set image.tag=v1.0.1 \
  --namespace community-prod

# 백엔드 업그레이드
helm upgrade backend ./helm-charts/backend \
  --reuse-values \
  --set image.tag=v1.0.1 \
  --namespace community-prod
```

### 차트 삭제

```bash
# 프론트엔드 삭제
helm uninstall frontend --namespace community-prod

# 백엔드 삭제
helm uninstall backend --namespace community-prod
```

## 테스트

Helm 차트 테스트를 위한 스크립트가 제공됩니다:

```bash
./infrastructure/helm/test-helm-charts.sh
```

이 스크립트는 다음과 같은 테스트를 수행합니다:

1. Helm 차트 lint 테스트
2. Helm 차트 템플릿 렌더링 테스트
3. Helm 차트 의존성 업데이트 테스트

## 결론

이 Helm 차트 설정은 DevSecOps 모범 사례를 따르며, 프론트엔드와 백엔드 애플리케이션을 Kubernetes 환경에 효율적으로 배포하고 관리할 수 있는 기능을 제공합니다. 공통 라이브러리 차트를 통해 코드 중복을 줄이고 일관성을 유지할 수 있으며, 다양한 환경(개발, 스테이징, 프로덕션)에 맞게 구성을 조정할 수 있습니다.
