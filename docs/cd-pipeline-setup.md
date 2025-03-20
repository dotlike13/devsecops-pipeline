# CD 파이프라인 설정 문서

## 개요

이 문서는 DevSecOps 포트폴리오 프로젝트의 CD(지속적 배포) 파이프라인 설정에 대한 상세 정보를 제공합니다. CD 파이프라인은 ArgoCD를 사용하여 구현되었으며, 애플리케이션 정의, OWASP ZAP을 통한 동적 애플리케이션 보안 테스트(DAST), 환경별 배포 설정 등의 기능을 포함합니다.

## 구성 요소

CD 파이프라인은 다음과 같은 주요 구성 요소로 이루어져 있습니다:

1. **ArgoCD 애플리케이션 정의**: 프론트엔드와 백엔드 애플리케이션의 배포를 정의합니다.
2. **OWASP ZAP 통합**: 동적 애플리케이션 보안 테스트(DAST)를 수행합니다.
3. **환경별 배포 설정**: 개발(dev), 스테이징(stg), 프로덕션(prod) 환경에 대한 설정을 제공합니다.

## ArgoCD 애플리케이션 정의

### 개별 애플리케이션 정의

프론트엔드와 백엔드 애플리케이션에 대한 ArgoCD 애플리케이션 정의 파일이 작성되었습니다. 각 파일은 개발(dev), 스테이징(stg), 프로덕션(prod) 환경에 대한 설정을 포함합니다.

#### 프론트엔드 애플리케이션 정의 (`frontend-app.yaml`)

이 파일은 프론트엔드 애플리케이션의 배포를 정의하며, 다음과 같은 특징이 있습니다:

- 개발, 스테이징, 프로덕션 환경에 대한 별도의 애플리케이션 정의
- 자동 동기화 및 자동 복구 기능 활성화
- 네임스페이스 자동 생성 옵션 설정
- 프로덕션 환경에서는 자동 정리(prune) 기능 비활성화

#### 백엔드 애플리케이션 정의 (`backend-app.yaml`)

이 파일은 백엔드 애플리케이션의 배포를 정의하며, 프론트엔드와 유사한 구조를 가집니다.

### ApplicationSet 정의

`application-set.yaml` 파일은 ApplicationSet 리소스를 정의하여 여러 환경에 대한 애플리케이션 배포를 효율적으로 관리합니다. 이 파일은 다음과 같은 특징이 있습니다:

- 리스트 생성기를 사용하여 여러 애플리케이션과 환경 조합 정의
- 템플릿을 통한 애플리케이션 정의 자동화
- 환경별 동기화 정책 설정

## OWASP ZAP 통합

### DAST 스크립트

`run-zap-scan.sh` 스크립트는 OWASP ZAP을 사용하여 동적 애플리케이션 보안 테스트(DAST)를 수행합니다. 이 스크립트는 다음과 같은 기능을 제공합니다:

- Docker를 통한 OWASP ZAP 실행
- 대상 URL에 대한 보안 취약점 스캔
- 다양한 형식(HTML, XML, JSON, MD)의 보고서 생성
- 스캔 결과 요약 출력

### GitHub Actions 워크플로우

프론트엔드와 백엔드 애플리케이션 모두에 대한 DAST GitHub Actions 워크플로우 파일이 작성되었습니다. 이 워크플로우는 다음과 같은 특징이 있습니다:

- CI 파이프라인 완료 후 자동 실행
- 개발 및 스테이징 환경에 대한 스캔 수행
- 취약점 발견 시 GitHub 이슈 자동 생성
- 스캔 보고서를 아티팩트로 업로드

### ZAP 규칙 파일

프론트엔드와 백엔드 애플리케이션 모두에 대한 ZAP 규칙 파일이 작성되었습니다. 이 파일들은 다음과 같은 규칙 카테고리를 포함합니다:

- 정보 수집 관련 규칙
- 보안 헤더 관련 규칙
- 인증 및 세션 관련 규칙
- 입력 검증 관련 규칙
- API 보안 관련 규칙 (백엔드 전용)
- 기타 규칙

## 환경별 배포 설정

### 개발 환경 설정 (`dev-env.yaml`)

개발 환경에 대한 ConfigMap 리소스가 정의되어 있으며, 다음과 같은 설정을 포함합니다:

- 프론트엔드 설정: API URL, 환경 변수, 로그 레벨, 분석 기능 비활성화
- 백엔드 설정: 환경 변수, 로그 레벨, MongoDB URI, JWT 시크릿, CORS 설정, Swagger 활성화

### 스테이징 환경 설정 (`stg-env.yaml`)

스테이징 환경에 대한 ConfigMap 리소스가 정의되어 있으며, 개발 환경과 유사하지만 다음과 같은 차이점이 있습니다:

- 로그 레벨: `info`로 설정
- 분석 기능: 활성화
- 환경 변수: `staging`으로 설정

### 프로덕션 환경 설정 (`prod-env.yaml`)

프로덕션 환경에 대한 ConfigMap 리소스가 정의되어 있으며, 다음과 같은 특징이 있습니다:

- 로그 레벨: `error`로 설정 (중요 오류만 기록)
- 분석 기능: 활성화
- 환경 변수: `production`으로 설정
- Swagger: 비활성화 (보안 강화)

## CD 파이프라인 테스트

CD 파이프라인 테스트를 위한 스크립트(`test-cd-pipeline.sh`)가 제공되며, 이 스크립트는 다음과 같은 기능을 테스트합니다:

- ArgoCD 애플리케이션 정의 유효성 검사
- 환경별 배포 설정 유효성 검사
- OWASP ZAP 통합 구성 확인

## 사용 방법

### ArgoCD 애플리케이션 배포

1. ArgoCD 서버에 로그인합니다:
   ```bash
   argocd login <argocd-server> --username admin --password <password>
   ```

2. 애플리케이션 정의 파일을 적용합니다:
   ```bash
   kubectl apply -f frontend-app.yaml -f backend-app.yaml
   # 또는 ApplicationSet 사용
   kubectl apply -f application-set.yaml
   ```

3. ArgoCD UI에서 애플리케이션 동기화 상태를 확인합니다.

### 환경별 설정 적용

1. 환경별 설정 파일을 적용합니다:
   ```bash
   kubectl apply -f dev-env.yaml   # 개발 환경
   kubectl apply -f stg-env.yaml   # 스테이징 환경
   kubectl apply -f prod-env.yaml  # 프로덕션 환경
   ```

### DAST 스캔 실행

1. DAST 스크립트를 실행합니다:
   ```bash
   ./run-zap-scan.sh <target-url> <report-name> <report-format>
   ```

2. 예시:
   ```bash
   ./run-zap-scan.sh http://frontend-service.community-dev.svc.cluster.local:3000 frontend-scan html
   ```

## 결론

이 CD 파이프라인 설정은 DevSecOps 모범 사례를 따르며, ArgoCD를 통한 지속적 배포, OWASP ZAP을 통한 동적 애플리케이션 보안 테스트, 환경별 배포 설정 등의 기능을 제공합니다. 이를 통해 애플리케이션의 안전하고 효율적인 배포가 가능해집니다.
