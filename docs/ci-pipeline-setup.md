# CI 파이프라인 설정 문서

## 개요

이 문서는 DevSecOps 포트폴리오 프로젝트의 CI(지속적 통합) 파이프라인 설정에 대한 상세 정보를 제공합니다. CI 파이프라인은 GitHub Actions를 사용하여 구현되었으며, 코드 품질 검사, 보안 취약점 스캔, Docker 이미지 빌드 및 배포, SBOM(소프트웨어 구성 요소 명세) 생성 등의 기능을 포함합니다.

## 구성 요소

CI 파이프라인은 다음과 같은 주요 구성 요소로 이루어져 있습니다:

1. **GitHub Actions 워크플로우**: 프론트엔드와 백엔드 애플리케이션에 대한 CI 파이프라인을 정의합니다.
2. **SonarQube**: 정적 애플리케이션 보안 테스트(SAST)를 수행합니다.
3. **Checkov**: 인프라 및 애플리케이션 코드의 보안 취약점을 스캔합니다.
4. **Trivy**: Docker 이미지 취약점 스캔 및 SBOM 생성을 수행합니다.
5. **Harbor 레지스트리**: 빌드된 Docker 이미지를 저장합니다.

## GitHub Actions 워크플로우

### 프론트엔드 CI 파이프라인

프론트엔드 CI 파이프라인은 `.github/workflows/ci.yml` 파일에 정의되어 있으며, 다음과 같은 작업을 수행합니다:

1. **빌드 및 테스트**: 코드 린팅, 단위 테스트, SonarQube 스캔을 수행합니다.
2. **보안 스캔**: Checkov를 사용한 코드 스캔, Trivy를 사용한 Docker 이미지 취약점 스캔을 수행합니다.
3. **SBOM 생성**: Trivy를 사용하여 소프트웨어 구성 요소 명세를 생성합니다.
4. **이미지 배포**: 빌드된 Docker 이미지를 Harbor 레지스트리에 배포합니다.

워크플로우는 `main`, `dev`, `stg`, `prod` 브랜치에 대한 푸시 및 풀 리퀘스트 이벤트에서 트리거됩니다.

### 백엔드 CI 파이프라인

백엔드 CI 파이프라인도 유사한 구조로 `.github/workflows/ci.yml` 파일에 정의되어 있으며, 프론트엔드와 동일한 작업을 수행합니다.

## 보안 도구 통합

### SonarQube 통합

SonarQube는 코드 품질 및 보안 취약점 분석을 위해 통합되었습니다. 각 애플리케이션 디렉토리에는 `sonar-project.properties` 파일이 있으며, 다음과 같은 설정을 포함합니다:

- 프로젝트 키 및 조직 설정
- 소스 코드 및 테스트 코드 경로 설정
- 테스트 커버리지 리포트 경로 설정
- 품질 게이트 설정

GitHub Actions 워크플로우에서는 SonarSource/sonarcloud-github-action을 사용하여 SonarQube 스캔을 수행합니다.

### Checkov 통합

Checkov는 인프라 및 애플리케이션 코드의 보안 취약점을 스캔하기 위해 통합되었습니다. 각 애플리케이션 디렉토리에는 `.checkov.yaml` 파일이 있으며, 다음과 같은 설정을 포함합니다:

- 스캔에서 제외할 항목 설정
- 스캔 대상 디렉토리 설정
- 출력 형식 설정
- 심각도 수준 설정
- 스캔할 프레임워크 설정

GitHub Actions 워크플로우에서는 bridgecrewio/checkov-action을 사용하여 Checkov 스캔을 수행합니다.

### Trivy 통합

Trivy는 Docker 이미지 취약점 스캔 및 SBOM 생성을 위해 통합되었습니다. 각 애플리케이션 디렉토리에는 `.trivyignore.yaml` 파일이 있으며, 다음과 같은 설정을 포함합니다:

- 취약점 스캔 설정
- 비밀 스캔 설정
- 설정 스캔 설정
- 출력 형식 설정
- 캐시 설정

GitHub Actions 워크플로우에서는 aquasecurity/trivy-action을 사용하여 Trivy 스캔 및 SBOM 생성을 수행합니다.

## SBOM 생성

SBOM(소프트웨어 구성 요소 명세)는 애플리케이션에 사용된 모든 소프트웨어 구성 요소와 그 종속성을 문서화한 것입니다. CI 파이프라인에서는 Trivy를 사용하여 SBOM을 생성합니다.

SBOM 생성을 위한 별도의 스크립트(`generate-sbom.sh`)가 제공되며, 이 스크립트는 다음과 같은 기능을 수행합니다:

- 프론트엔드 및 백엔드 애플리케이션의 소스 코드 기반 SBOM 생성
- 프론트엔드 및 백엔드 Docker 이미지 기반 SBOM 생성

생성된 SBOM은 CycloneDX 형식으로 저장되며, GitHub Actions 워크플로우에서는 이를 아티팩트로 업로드합니다.

## CI 파이프라인 테스트

CI 파이프라인 테스트를 위한 스크립트(`test-ci-pipeline.sh`)가 제공되며, 이 스크립트는 로컬 환경에서 CI 파이프라인의 모든 기능을 테스트할 수 있습니다. 다음과 같은 기능을 테스트합니다:

- 코드 린팅
- 단위 테스트
- Checkov 보안 스캔
- Docker 이미지 빌드
- Trivy 취약점 스캔
- SBOM 생성

## 사용 방법

### GitHub Actions 워크플로우 설정

1. 프론트엔드 및 백엔드 저장소에 `.github/workflows/ci.yml` 파일을 추가합니다.
2. 필요한 시크릿을 GitHub 저장소 설정에 추가합니다:
   - `SONAR_TOKEN`: SonarQube 인증 토큰
   - `HARBOR_REGISTRY`: Harbor 레지스트리 URL
   - `HARBOR_USERNAME`: Harbor 레지스트리 사용자 이름
   - `HARBOR_PASSWORD`: Harbor 레지스트리 비밀번호

### 로컬 테스트

1. 테스트 스크립트를 실행합니다:
   ```bash
   ./test-ci-pipeline.sh
   ```

2. 특정 애플리케이션만 테스트하려면 인자를 전달합니다:
   ```bash
   ./test-ci-pipeline.sh frontend
   # 또는
   ./test-ci-pipeline.sh backend
   ```

### SBOM 생성

1. SBOM 생성 스크립트를 실행합니다:
   ```bash
   ./generate-sbom.sh
   ```

2. 생성된 SBOM 파일을 확인합니다:
   - `frontend-source-sbom.json`
   - `frontend-image-sbom.json`
   - `backend-source-sbom.json`
   - `backend-image-sbom.json`

## 결론

이 CI 파이프라인 설정은 DevSecOps 모범 사례를 따르며, 코드 품질 검사, 보안 취약점 스캔, Docker 이미지 빌드 및 배포, SBOM 생성 등의 기능을 자동화합니다. GitHub Actions를 사용하여 구현되었으며, SonarQube, Checkov, Trivy 등의 보안 도구를 통합하여 애플리케이션의 보안성을 강화합니다.
