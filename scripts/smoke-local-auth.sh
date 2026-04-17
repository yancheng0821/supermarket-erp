#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"
load_env_file

SYSTEM_PORT="${SYSTEM_PORT:-8080}"
GATEWAY_PORT="${GATEWAY_PORT:-9000}"
SYSTEM_BASE_URL="${SYSTEM_BASE_URL:-http://127.0.0.1:${SYSTEM_PORT}}"
GATEWAY_BASE_URL="${GATEWAY_BASE_URL:-http://127.0.0.1:${GATEWAY_PORT}}"
REQUEST_SUFFIX="${REQUEST_SUFFIX:-$(date +%s)}"

usage() {
  cat <<'EOF'
Usage: ./scripts/smoke-local-auth.sh

Environment variables:
  SYSTEM_PORT      Local system port, defaults to 8080
  GATEWAY_PORT     Local gateway port, defaults to 9000
  SYSTEM_BASE_URL  Local system base URL, defaults to http://127.0.0.1:${SYSTEM_PORT}
  GATEWAY_BASE_URL Local gateway base URL, defaults to http://127.0.0.1:${GATEWAY_PORT}
  REQUEST_SUFFIX   Request ID suffix, defaults to the current unix timestamp

This script performs four requests:
  1. system health
  2. system unauthenticated session
  3. gateway health
  4. gateway unauthenticated session
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

request() {
  local label="$1"
  shift

  printf '== %s ==\n' "${label}"
  curl --noproxy '*' -sS -i "$@"
  printf '\n\n'
}

request "system health" \
  "${SYSTEM_BASE_URL}/actuator/health"

request "system auth session" \
  -H "X-Request-Id: req-smoke-system-${REQUEST_SUFFIX}" \
  "${SYSTEM_BASE_URL}/api/v1/admin/auth/session"

request "gateway health" \
  "${GATEWAY_BASE_URL}/actuator/health"

request "gateway auth session" \
  -H "X-Request-Id: req-smoke-gateway-${REQUEST_SUFFIX}" \
  "${GATEWAY_BASE_URL}/api/v1/admin/auth/session"
