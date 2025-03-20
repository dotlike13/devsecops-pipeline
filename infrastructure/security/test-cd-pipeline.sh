#!/bin/bash

# CD 파이프라인 테스트 스크립트
# 이 스크립트는 ArgoCD와 환경별 배포 설정을 테스트합니다.

set -e

echo "===== CD 파이프라인 테스트 시작 ====="

# 작업 디렉토리 설정
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ARGOCD_DIR="${SCRIPT_DIR}/../../infrastructure/argocd"
ENV_DIR="${SCRIPT_DIR}/../../infrastructure/environments"

# 필요한 도구 확인
command -v kubectl >/dev/null 2>&1 || {
  echo "kubectl이 설치되어 있지 않습니다. 설치를 진행합니다..."
  curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
  chmod +x kubectl
  sudo mv kubectl /usr/local/bin/
}

command -v argocd >/dev/null 2>&1 || {
  echo "argocd CLI가 설치되어 있지 않습니다. 설치를 진행합니다..."
  curl -sSL -o argocd-linux-amd64 https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
  chmod +x argocd-linux-amd64
  sudo mv argocd-linux-amd64 /usr/local/bin/argocd
}

# ArgoCD 애플리케이션 정의 테스트
test_argocd_applications() {
  echo "ArgoCD 애플리케이션 정의를 테스트합니다..."
  
  # 애플리케이션 정의 파일 확인
  if [ ! -f "${ARGOCD_DIR}/applications/frontend-app.yaml" ] || [ ! -f "${ARGOCD_DIR}/applications/backend-app.yaml" ]; then
    echo "오류: ArgoCD 애플리케이션 정의 파일이 없습니다."
    return 1
  fi
  
  # 애플리케이션 정의 유효성 검사
  kubectl apply --dry-run=client -f "${ARGOCD_DIR}/applications/frontend-app.yaml" -o yaml > /dev/null
  if [ $? -ne 0 ]; then
    echo "오류: 프론트엔드 애플리케이션 정의가 유효하지 않습니다."
    return 1
  fi
  
  kubectl apply --dry-run=client -f "${ARGOCD_DIR}/applications/backend-app.yaml" -o yaml > /dev/null
  if [ $? -ne 0 ]; then
    echo "오류: 백엔드 애플리케이션 정의가 유효하지 않습니다."
    return 1
  fi
  
  echo "ArgoCD 애플리케이션 정의 테스트 성공!"
  return 0
}

# 환경별 배포 설정 테스트
test_environment_configs() {
  echo "환경별 배포 설정을 테스트합니다..."
  
  # 환경 설정 파일 확인
  for env in dev stg prod; do
    if [ ! -f "${ENV_DIR}/${env}-env.yaml" ]; then
      echo "오류: ${env} 환경 설정 파일이 없습니다."
      return 1
    fi
    
    # 환경 설정 유효성 검사
    kubectl apply --dry-run=client -f "${ENV_DIR}/${env}-env.yaml" -o yaml > /dev/null
    if [ $? -ne 0 ]; then
      echo "오류: ${env} 환경 설정이 유효하지 않습니다."
      return 1
    fi
  done
  
  echo "환경별 배포 설정 테스트 성공!"
  return 0
}

# OWASP ZAP 통합 테스트
test_owasp_zap_integration() {
  echo "OWASP ZAP 통합을 테스트합니다..."
  
  # DAST 스크립트 확인
  if [ ! -f "${SCRIPT_DIR}/../dast/run-zap-scan.sh" ]; then
    echo "오류: OWASP ZAP DAST 스크립트가 없습니다."
    return 1
  fi
  
  # DAST 워크플로우 파일 확인
  if [ ! -f "${SCRIPT_DIR}/../../../frontend/.github/workflows/dast.yml" ] || [ ! -f "${SCRIPT_DIR}/../../../backend/.github/workflows/dast.yml" ]; then
    echo "오류: DAST 워크플로우 파일이 없습니다."
    return 1
  fi
  
  # ZAP 규칙 파일 확인
  if [ ! -f "${SCRIPT_DIR}/../../../frontend/.zap/rules.tsv" ] || [ ! -f "${SCRIPT_DIR}/../../../backend/.zap/rules.tsv" ]; then
    echo "오류: ZAP 규칙 파일이 없습니다."
    return 1
  fi
  
  echo "OWASP ZAP 통합 테스트 성공!"
  return 0
}

# 전체 CD 파이프라인 테스트
test_cd_pipeline() {
  echo "전체 CD 파이프라인을 테스트합니다..."
  
  # ArgoCD 애플리케이션 정의 테스트
  test_argocd_applications
  if [ $? -ne 0 ]; then
    echo "CD 파이프라인 테스트 실패: ArgoCD 애플리케이션 정의 테스트 실패"
    return 1
  fi
  
  # 환경별 배포 설정 테스트
  test_environment_configs
  if [ $? -ne 0 ]; then
    echo "CD 파이프라인 테스트 실패: 환경별 배포 설정 테스트 실패"
    return 1
  fi
  
  # OWASP ZAP 통합 테스트
  test_owasp_zap_integration
  if [ $? -ne 0 ]; then
    echo "CD 파이프라인 테스트 실패: OWASP ZAP 통합 테스트 실패"
    return 1
  fi
  
  echo "전체 CD 파이프라인 테스트 성공!"
  return 0
}

# 메인 실행
echo "CD 파이프라인 테스트를 시작합니다..."
test_cd_pipeline

if [ $? -eq 0 ]; then
  echo "===== CD 파이프라인 테스트 완료: 성공 ====="
  exit 0
else
  echo "===== CD 파이프라인 테스트 완료: 실패 ====="
  exit 1
fi
