# Community Helm Charts

Reddit 스타일 커뮤니티 웹 애플리케이션의 Helm 차트 저장소입니다.

## 개요

이 저장소는 커뮤니티 애플리케이션의 Kubernetes 배포를 위한 Helm 차트를 포함하고 있습니다. ArgoCD를 통해 GitOps 방식으로 애플리케이션을 배포하는 데 사용됩니다.

## 차트 구조

- `community-frontend`: 프론트엔드 애플리케이션 배포를 위한 Helm 차트
- `community-backend`: 백엔드 애플리케이션 배포를 위한 Helm 차트
- `community-common`: 공통 리소스 및 설정을 위한 Helm 차트

## 브랜치 구조

- `dev`: 개발 환경 (기본 브랜치)
- `stg`: 스테이징 환경
- `prod`: 프로덕션 환경

## 보안 통합

이 Helm 차트는 다음과 같은 보안 기능을 통합하고 있습니다:

1. **CSA 점검**
   - Checkov를 사용하여 Kubernetes 매니페스트 및 Helm 차트의 보안 검사

2. **Vault 통합**
   - HashiCorp Vault와 통합하여 민감 정보 관리
   - 환경별 시크릿 분리 (dev, stg, prod)

3. **네트워크 정책**
   - 서비스 간 통신을 위한 Kubernetes 네트워크 정책
   - 최소 권한 원칙 적용

## 사용 방법

### 수동 배포

```bash
# 프론트엔드 배포
helm install community-frontend ./community-frontend -n community

# 백엔드 배포
helm install community-backend ./community-backend -n community
```

### ArgoCD를 통한 배포

ArgoCD 애플리케이션 정의 예시:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: community-frontend
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/username/community-helm-charts.git
    targetRevision: dev
    path: community-frontend
  destination:
    server: https://kubernetes.default.svc
    namespace: community
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

## 환경별 구성

각 환경(dev, stg, prod)에 대한 구성은 `values-{env}.yaml` 파일에 정의되어 있습니다:

- `values-dev.yaml`: 개발 환경 구성
- `values-stg.yaml`: 스테이징 환경 구성
- `values-prod.yaml`: 프로덕션 환경 구성
