#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"
load_env_file

SYSTEM_PORT="${SYSTEM_PORT:-8080}"
ARCHIVE_PORT="${ARCHIVE_PORT:-8081}"
INVENTORY_PORT="${INVENTORY_PORT:-8082}"
PURCHASE_PORT="${PURCHASE_PORT:-8083}"
OPERATION_PORT="${OPERATION_PORT:-8084}"
MEMBER_PORT="${MEMBER_PORT:-8085}"
ONLINE_PORT="${ONLINE_PORT:-8086}"
FINANCE_PORT="${FINANCE_PORT:-8087}"
ANALYTICS_PORT="${ANALYTICS_PORT:-8088}"

usage() {
  cat <<'EOF'
Usage: ./scripts/smoke-local-services.sh

Environment variables:
  ENV_FILE        Optional env file path, defaults to root .env
  SYSTEM_PORT     Direct system service port, defaults to 8080
  ARCHIVE_PORT    Direct archive service port, defaults to 8081
  INVENTORY_PORT  Direct inventory service port, defaults to 8082
  PURCHASE_PORT   Direct purchase service port, defaults to 8083
  OPERATION_PORT  Direct operation service port, defaults to 8084
  MEMBER_PORT     Direct member service port, defaults to 8085
  ONLINE_PORT     Direct online service port, defaults to 8086
  FINANCE_PORT    Direct finance service port, defaults to 8087
  ANALYTICS_PORT  Direct analytics service port, defaults to 8088

This script performs actuator health checks against all direct backend services.
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

request_health() {
  local service_name="$1"
  local port="$2"

  printf '== %s ==\n' "${service_name}"
  curl --noproxy '*' -sS -i "http://127.0.0.1:${port}/actuator/health"
  printf '\n\n'
}

request_health "system health" "${SYSTEM_PORT}"
request_health "archive health" "${ARCHIVE_PORT}"
request_health "inventory health" "${INVENTORY_PORT}"
request_health "purchase health" "${PURCHASE_PORT}"
request_health "operation health" "${OPERATION_PORT}"
request_health "member health" "${MEMBER_PORT}"
request_health "online health" "${ONLINE_PORT}"
request_health "finance health" "${FINANCE_PORT}"
request_health "analytics health" "${ANALYTICS_PORT}"
