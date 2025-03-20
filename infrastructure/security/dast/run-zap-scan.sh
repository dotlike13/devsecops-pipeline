#!/bin/bash

# OWASP ZAP DAST 스크립트
# 이 스크립트는 OWASP ZAP을 사용하여 동적 애플리케이션 보안 테스트(DAST)를 수행합니다.

set -e

echo "===== OWASP ZAP DAST 테스트 시작 ====="

# 환경 변수 설정
TARGET_URL=${1:-"http://localhost:8080"}  # 기본값은 로컬 백엔드 서비스
REPORT_NAME=${2:-"zap-report"}
REPORT_FORMAT=${3:-"html"}  # html, xml, json, md 등 지원
ZAP_OPTIONS=${4:-"-t 10"}  # ZAP 스캔 옵션, 기본 타임아웃 10분

# ZAP Docker 이미지 확인
if ! docker images | grep -q "owasp/zap2docker-stable"; then
  echo "OWASP ZAP Docker 이미지를 가져옵니다..."
  docker pull owasp/zap2docker-stable
fi

# 결과 디렉토리 생성
REPORT_DIR="$(pwd)/zap-reports"
mkdir -p "$REPORT_DIR"

echo "대상 URL: $TARGET_URL"
echo "보고서 이름: $REPORT_NAME"
echo "보고서 형식: $REPORT_FORMAT"
echo "ZAP 옵션: $ZAP_OPTIONS"

# ZAP 스캔 실행
echo "ZAP 스캔을 시작합니다..."
docker run --rm -v "$REPORT_DIR:/zap/wrk/:rw" owasp/zap2docker-stable zap-baseline.py \
  -t "$TARGET_URL" \
  -r "$REPORT_NAME.$REPORT_FORMAT" \
  $ZAP_OPTIONS

# 결과 확인
echo "ZAP 스캔이 완료되었습니다."
echo "보고서 위치: $REPORT_DIR/$REPORT_NAME.$REPORT_FORMAT"

# 결과 요약 출력
if [ "$REPORT_FORMAT" = "json" ]; then
  echo "취약점 요약:"
  cat "$REPORT_DIR/$REPORT_NAME.$REPORT_FORMAT" | grep -o '"riskcode":"[0-9]"' | sort | uniq -c
elif [ "$REPORT_FORMAT" = "xml" ]; then
  echo "취약점 요약:"
  cat "$REPORT_DIR/$REPORT_NAME.$REPORT_FORMAT" | grep -o 'riskcode="[0-9]"' | sort | uniq -c
else
  echo "보고서를 확인하세요: $REPORT_DIR/$REPORT_NAME.$REPORT_FORMAT"
fi

echo "===== OWASP ZAP DAST 테스트 완료 ====="
