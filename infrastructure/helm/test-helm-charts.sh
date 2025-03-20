#!/bin/bash

# Helm 차트 테스트 스크립트
# 이 스크립트는 생성된 Helm 차트의 유효성을 검사합니다.

set -e

echo "===== Helm 차트 테스트 시작 ====="

# 작업 디렉토리 설정
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HELM_CHARTS_DIR="${SCRIPT_DIR}/../helm-charts"

# 필요한 도구 확인
command -v helm >/dev/null 2>&1 || {
  echo "helm이 설치되어 있지 않습니다. 설치를 진행합니다..."
  curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
}

# Helm 차트 lint 테스트
test_helm_lint() {
  local chart_name=$1
  echo "Helm 차트 lint 테스트: ${chart_name}"
  
  helm lint "${HELM_CHARTS_DIR}/${chart_name}"
  if [ $? -ne 0 ]; then
    echo "오류: ${chart_name} 차트의 lint 테스트에 실패했습니다."
    return 1
  fi
  
  echo "${chart_name} 차트의 lint 테스트가 성공했습니다."
  return 0
}

# Helm 차트 템플릿 렌더링 테스트
test_helm_template() {
  local chart_name=$1
  echo "Helm 차트 템플릿 렌더링 테스트: ${chart_name}"
  
  helm template "${HELM_CHARTS_DIR}/${chart_name}" > /dev/null
  if [ $? -ne 0 ]; then
    echo "오류: ${chart_name} 차트의 템플릿 렌더링에 실패했습니다."
    return 1
  fi
  
  echo "${chart_name} 차트의 템플릿 렌더링이 성공했습니다."
  return 0
}

# 의존성 업데이트 테스트
test_helm_dependency() {
  local chart_name=$1
  echo "Helm 차트 의존성 업데이트 테스트: ${chart_name}"
  
  helm dependency update "${HELM_CHARTS_DIR}/${chart_name}" > /dev/null
  if [ $? -ne 0 ]; then
    echo "오류: ${chart_name} 차트의 의존성 업데이트에 실패했습니다."
    return 1
  fi
  
  echo "${chart_name} 차트의 의존성 업데이트가 성공했습니다."
  return 0
}

# 전체 Helm 차트 테스트
test_all_charts() {
  local charts=("frontend" "backend")
  local failed=0
  
  for chart in "${charts[@]}"; do
    echo "===== ${chart} 차트 테스트 시작 ====="
    
    # 의존성 업데이트 테스트
    test_helm_dependency "${chart}"
    if [ $? -ne 0 ]; then
      failed=1
      continue
    fi
    
    # lint 테스트
    test_helm_lint "${chart}"
    if [ $? -ne 0 ]; then
      failed=1
      continue
    fi
    
    # 템플릿 렌더링 테스트
    test_helm_template "${chart}"
    if [ $? -ne 0 ]; then
      failed=1
      continue
    fi
    
    echo "===== ${chart} 차트 테스트 완료: 성공 ====="
  done
  
  return $failed
}

# 메인 실행
echo "Helm 차트 테스트를 시작합니다..."
test_all_charts

if [ $? -eq 0 ]; then
  echo "===== 모든 Helm 차트 테스트 완료: 성공 ====="
  exit 0
else
  echo "===== Helm 차트 테스트 완료: 일부 실패 ====="
  exit 1
fi
