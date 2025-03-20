#!/bin/bash

# SBOM 생성 스크립트
# 이 스크립트는 프론트엔드와 백엔드 애플리케이션에 대한 SBOM을 생성합니다.

set -e

echo "소프트웨어 구성 요소 명세(SBOM) 생성 시작..."

# 필요한 도구 설치 확인
if ! command -v trivy &> /dev/null; then
    echo "Trivy가 설치되어 있지 않습니다. 설치를 진행합니다..."
    curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
fi

# 프론트엔드 SBOM 생성
echo "프론트엔드 애플리케이션 SBOM 생성 중..."
cd "$(dirname "$0")/../frontend" || exit 1

# 소스 코드 기반 SBOM 생성
trivy fs --format cyclonedx --output frontend-source-sbom.json .

# Docker 이미지 기반 SBOM 생성 (이미지가 있는 경우)
if docker images | grep -q "community/frontend"; then
    echo "프론트엔드 Docker 이미지 SBOM 생성 중..."
    trivy image --format cyclonedx --output frontend-image-sbom.json community/frontend:latest
fi

# 백엔드 SBOM 생성
echo "백엔드 애플리케이션 SBOM 생성 중..."
cd "$(dirname "$0")/../backend" || exit 1

# 소스 코드 기반 SBOM 생성
trivy fs --format cyclonedx --output backend-source-sbom.json .

# Docker 이미지 기반 SBOM 생성 (이미지가 있는 경우)
if docker images | grep -q "community/backend"; then
    echo "백엔드 Docker 이미지 SBOM 생성 중..."
    trivy image --format cyclonedx --output backend-image-sbom.json community/backend:latest
fi

echo "SBOM 생성이 완료되었습니다."
echo "생성된 SBOM 파일:"
echo "- frontend-source-sbom.json"
echo "- frontend-image-sbom.json (Docker 이미지가 있는 경우)"
echo "- backend-source-sbom.json"
echo "- backend-image-sbom.json (Docker 이미지가 있는 경우)"
