#!/bin/bash

set -e

echo "===== DevSecOps 로컬 인프라 통합 설치 스크립트 ====="

# 작업 디렉토리 설정
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Kind 클러스터 설치
echo "1. Kind 클러스터 설치를 시작합니다..."
cd kind
chmod +x setup-kind.sh
./setup-kind.sh
cd ..

# 잠시 대기 (클러스터 준비 시간)
echo "클러스터가 준비될 때까지 30초 대기합니다..."
sleep 30

# Harbor 설치
echo "2. Harbor 레지스트리 설치를 시작합니다..."
cd harbor
chmod +x setup-harbor.sh
./setup-harbor.sh
cd ..

# Vault 설치
echo "3. HashiCorp Vault 설치를 시작합니다..."
cd vault
chmod +x setup-vault.sh
./setup-vault.sh
cd ..

# ArgoCD 설치
echo "4. ArgoCD 설치를 시작합니다..."
cd argocd
chmod +x setup-argocd.sh
./setup-argocd.sh
cd ..

echo "===== DevSecOps 로컬 인프라 설치 완료 ====="
echo "모든 구성 요소가 설치되었습니다. 각 서비스 접속 정보:"
echo ""
echo "1. Harbor 레지스트리: https://harbor.local:30003"
echo "   - 관리자 계정: admin"
echo "   - 관리자 비밀번호: Harbor12345"
echo ""
echo "2. HashiCorp Vault: http://localhost:30022"
echo "   - 초기화 및 언실링이 필요합니다. setup-vault.sh의 안내를 참조하세요."
echo ""
echo "3. ArgoCD: http://localhost:30080"
echo "   - 관리자 계정: admin"
echo "   - 관리자 비밀번호: kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath=\"{.data.password}\" | base64 -d"
echo ""
echo "로컬 환경에서 Harbor에 접속하려면 /etc/hosts 파일에 다음 항목을 추가하세요:"
echo "127.0.0.1 harbor.local"
