#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"
# shellcheck source=lib/services.sh
source "${SCRIPT_DIR}/lib/services.sh"

RUNTIME_DIR="${ROOT_DIR}/.runtime"
PID_DIR="${RUNTIME_DIR}/pids"
LOG_DIR="${RUNTIME_DIR}/logs"

usage() {
  cat <<'EOF'
Usage: ./scripts/status-local-stack.sh [all|service...]

Without arguments, this script shows the status of all tracked backend services.
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

mapfile -t SERVICES < <(normalize_backend_services "${@:-all}")

for service in "${SERVICES[@]}"; do
  pid_file="${PID_DIR}/${service}.pid"
  log_file="${LOG_DIR}/${service}.log"

  if [[ -f "${pid_file}" ]]; then
    pid="$(<"${pid_file}")"
    if kill -0 "${pid}" >/dev/null 2>&1; then
      echo "[running] ${service} pid=${pid} log=${log_file}"
      continue
    fi
    echo "[stale] ${service} pid=${pid} log=${log_file}"
    continue
  fi

  echo "[stopped] ${service}"
done
