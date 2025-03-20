#!/bin/bash

# CI 파이프라인 테스트 스크립트
# 이 스크립트는 로컬 환경에서 CI 파이프라인 기능을 테스트합니다.

set -e

echo "CI 파이프라인 테스트 시작..."

# 작업 디렉토리 설정
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="${SCRIPT_DIR}/../../frontend"
BACKEND_DIR="${SCRIPT_DIR}/../../backend"

# 필요한 도구 설치 확인 및 설치
check_and_install_tool() {
  if ! command -v "$1" &> /dev/null; then
    echo "$1이 설치되어 있지 않습니다. 설치를 진행합니다..."
    case "$1" in
      trivy)
        curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
        ;;
      checkov)
        pip3 install checkov
        ;;
      *)
        echo "알 수 없는 도구: $1"
        exit 1
        ;;
    esac
  fi
}

check_and_install_tool "trivy"
check_and_install_tool "checkov"

# 프론트엔드 테스트
test_frontend() {
  echo "프론트엔드 CI 파이프라인 테스트 중..."
  cd "$FRONTEND_DIR" || exit 1
  
  # 코드 린팅 테스트 (package.json에 lint 스크립트가 있다고 가정)
  if grep -q "\"lint\":" package.json; then
    echo "린팅 테스트 실행 중..."
    npm run lint || echo "린팅 이슈가 발견되었습니다."
  else
    echo "린팅 스크립트가 없습니다. 건너뜁니다."
  fi
  
  # 단위 테스트 (package.json에 test 스크립트가 있다고 가정)
  if grep -q "\"test\":" package.json; then
    echo "단위 테스트 실행 중..."
    npm test || echo "테스트 실패"
  else
    echo "테스트 스크립트가 없습니다. 건너뜁니다."
  fi
  
  # Checkov 보안 스캔
  echo "Checkov 보안 스캔 실행 중..."
  checkov -d . --framework dockerfile || echo "Checkov 스캔에서 이슈가 발견되었습니다."
  
  # Docker 이미지 빌드
  echo "Docker 이미지 빌드 중..."
  docker build -t community/frontend:test .
  
  # Trivy 취약점 스캔
  echo "Trivy 취약점 스캔 실행 중..."
  trivy image community/frontend:test
  
  # SBOM 생성
  echo "SBOM 생성 중..."
  trivy image --format cyclonedx --output frontend-sbom.json community/frontend:test
  
  echo "프론트엔드 CI 파이프라인 테스트 완료"
}

# 백엔드 테스트
test_backend() {
  echo "백엔드 CI 파이프라인 테스트 중..."
  cd "$BACKEND_DIR" || exit 1
  
  # 코드 린팅 테스트 (package.json에 lint 스크립트가 있다고 가정)
  if grep -q "\"lint\":" package.json; then
    echo "린팅 테스트 실행 중..."
    npm run lint || echo "린팅 이슈가 발견되었습니다."
  else
    echo "린팅 스크립트가 없습니다. 건너뜁니다."
  fi
  
  # 단위 테스트 (package.json에 test 스크립트가 있다고 가정)
  if grep -q "\"test\":" package.json; then
    echo "단위 테스트 실행 중..."
    npm test || echo "테스트 실패"
  else
    echo "테스트 스크립트가 없습니다. 건너뜁니다."
  fi
  
  # Checkov 보안 스캔
  echo "Checkov 보안 스캔 실행 중..."
  checkov -d . --framework dockerfile || echo "Checkov 스캔에서 이슈가 발견되었습니다."
  
  # Docker 이미지 빌드
  echo "Docker 이미지 빌드 중..."
  docker build -t community/backend:test .
  
  # Trivy 취약점 스캔
  echo "Trivy 취약점 스캔 실행 중..."
  trivy image community/backend:test
  
  # SBOM 생성
  echo "SBOM 생성 중..."
  trivy image --format cyclonedx --output backend-sbom.json community/backend:test
  
  echo "백엔드 CI 파이프라인 테스트 완료"
}

# 메인 실행
echo "CI 파이프라인 테스트를 시작합니다..."

# 사용자 선택에 따라 테스트 실행
if [ "$1" == "frontend" ]; then
  test_frontend
elif [ "$1" == "backend" ]; then
  test_backend
else
  echo "전체 CI 파이프라인 테스트를 실행합니다..."
  test_frontend
  test_backend
fi

echo "CI 파이프라인 테스트가 완료되었습니다."
