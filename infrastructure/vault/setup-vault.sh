#!/bin/bash

set -e

echo "===== HashiCorp Vault 설치 및 구성 ====="

# 필요한 도구 확인
command -v helm >/dev/null 2>&1 || {
  echo "Helm이 설치되어 있지 않습니다. 설치를 진행합니다..."
  curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
  chmod 700 get_helm.sh
  ./get_helm.sh
  rm get_helm.sh
}

# HashiCorp Helm 저장소 추가
echo "HashiCorp Helm 저장소를 추가합니다..."
helm repo add hashicorp https://helm.releases.hashicorp.com
helm repo update

# Vault 네임스페이스 생성
echo "Vault 네임스페이스를 생성합니다..."
kubectl create namespace vault --dry-run=client -o yaml | kubectl apply -f -

# Vault 설치
echo "Vault를 설치합니다..."
helm install vault hashicorp/vault -f vault-values.yaml -n vault

# 설치 상태 확인
echo "Vault 설치 상태를 확인합니다..."
kubectl get pods -n vault

echo "Vault 서비스 상태를 확인합니다..."
kubectl get svc -n vault

echo "===== Vault 설치 완료 ====="
echo "Vault UI 접속 URL: http://localhost:30022"
echo ""
echo "Vault 초기화 방법:"
echo "1. Vault 포드에 접속: kubectl exec -it vault-0 -n vault -- /bin/sh"
echo "2. Vault 초기화: vault operator init"
echo "3. 언실링 키와 루트 토큰을 안전하게 보관하세요."
echo "4. Vault 언실링: vault operator unseal <언실링 키>"
echo "5. 토큰으로 로그인: vault login <루트 토큰>"
