#!/bin/bash

set -e

echo "===== ArgoCD 설치 및 구성 ====="

# 필요한 도구 확인
command -v helm >/dev/null 2>&1 || {
  echo "Helm이 설치되어 있지 않습니다. 설치를 진행합니다..."
  curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
  chmod 700 get_helm.sh
  ./get_helm.sh
  rm get_helm.sh
}

# ArgoCD 네임스페이스 생성
echo "ArgoCD 네임스페이스를 생성합니다..."
kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -

# ArgoCD Helm 저장소 추가
echo "ArgoCD Helm 저장소를 추가합니다..."
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update

# ArgoCD 설치
echo "ArgoCD를 설치합니다..."
helm install argocd argo/argo-cd -f argocd-values.yaml -n argocd

# 설치 상태 확인
echo "ArgoCD 설치 상태를 확인합니다..."
kubectl get pods -n argocd

echo "ArgoCD 서비스 상태를 확인합니다..."
kubectl get svc -n argocd

# 초기 관리자 비밀번호 가져오기
echo "초기 관리자 비밀번호를 가져옵니다..."
echo "비밀번호 명령: kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d"

echo "===== ArgoCD 설치 완료 ====="
echo "ArgoCD UI 접속 URL: http://localhost:30080"
echo "관리자 계정: admin"
echo "관리자 비밀번호: 위 명령어로 확인하세요."