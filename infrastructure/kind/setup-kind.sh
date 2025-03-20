#!/bin/bash

set -e

echo "===== Kind 클러스터 설치 및 구성 ====="

# 필요한 도구 확인
command -v docker >/dev/null 2>&1 || { echo "Docker가 필요합니다. 설치 후 다시 시도하세요."; exit 1; }
command -v kind >/dev/null 2>&1 || { 
  echo "Kind가 설치되어 있지 않습니다. 설치를 진행합니다..."
  curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
  chmod +x ./kind
  sudo mv ./kind /usr/local/bin/kind
}
command -v kubectl >/dev/null 2>&1 || {
  echo "kubectl이 설치되어 있지 않습니다. 설치를 진행합니다..."
  curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
  chmod +x kubectl
  sudo mv kubectl /usr/local/bin/
}

# 기존 클러스터 삭제 (있는 경우)
echo "기존 클러스터를 확인하고 있습니다..."
if kind get clusters | grep -q "devsecops-cluster"; then
  echo "기존 클러스터를 삭제합니다..."
  kind delete cluster --name devsecops-cluster
fi

# Kind 클러스터 생성
echo "Kind 클러스터를 생성합니다..."
kind create cluster --config=kind-config.yaml

# 클러스터 정보 확인
echo "클러스터 정보:"
kubectl cluster-info --context kind-devsecops-cluster

# 노드 상태 확인
echo "노드 상태:"
kubectl get nodes

echo "===== Kind 클러스터 설치 완료 ====="
