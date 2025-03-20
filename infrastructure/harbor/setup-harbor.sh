#!/bin/bash

set -e

echo "===== Harbor 레지스트리 설치 및 구성 ====="

# 필요한 도구 확인
command -v helm >/dev/null 2>&1 || {
  echo "Helm이 설치되어 있지 않습니다. 설치를 진행합니다..."
  curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
  chmod 700 get_helm.sh
  ./get_helm.sh
  rm get_helm.sh
}

# Harbor Helm 저장소 추가
echo "Harbor Helm 저장소를 추가합니다..."
helm repo add harbor https://helm.goharbor.io
helm repo update

# Harbor 네임스페이스 생성
echo "Harbor 네임스페이스를 생성합니다..."
kubectl create namespace harbor --dry-run=client -o yaml | kubectl apply -f -

# Harbor 설치
echo "Harbor를 설치합니다..."
helm install harbor harbor/harbor -f harbor-values.yaml -n harbor

# 설치 상태 확인
echo "Harbor 설치 상태를 확인합니다..."
kubectl get pods -n harbor

echo "Harbor 서비스 상태를 확인합니다..."
kubectl get svc -n harbor

echo "===== Harbor 설치 완료 ====="
echo "Harbor UI 접속 URL: https://harbor.local:30003"
echo "관리자 계정: admin"
echo "관리자 비밀번호: Harbor12345"
echo ""
echo "로컬 환경에서 접속하려면 /etc/hosts 파일에 다음 항목을 추가하세요:"
echo "127.0.0.1 harbor.local"
