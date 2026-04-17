#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"
# shellcheck source=lib/services.sh
source "${SCRIPT_DIR}/lib/services.sh"

RUNTIME_DIR="${ROOT_DIR}/.runtime"
PID_DIR="${RUNTIME_DIR}/pids"
STOP_WAIT_SECONDS="${STOP_WAIT_SECONDS:-10}"

usage() {
  cat <<'EOF'
Usage: ./scripts/stop-local-stack.sh [all|service...]

Without arguments, this script attempts to stop all tracked backend services.

Examples:
  ./scripts/stop-local-stack.sh
  ./scripts/stop-local-stack.sh gateway
  ./scripts/stop-local-stack.sh system archive gateway

Environment variables:
  STOP_WAIT_SECONDS  Seconds to wait after SIGTERM before giving up, defaults to 10
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

mapfile -t SERVICES < <(normalize_backend_services "${@:-all}")

for service in "${SERVICES[@]}"; do
  pid_file="${PID_DIR}/${service}.pid"
  if [[ ! -f "${pid_file}" ]]; then
    echo "[skip] ${service} has no pid file"
    continue
  fi

  pid="$(<"${pid_file}")"
  if ! kill -0 "${pid}" >/dev/null 2>&1; then
    echo "[stale] ${service} pid file found but process is not running"
    rm -f "${pid_file}"
    continue
  fi

  echo "[stop] ${service} (pid=${pid})"
  kill "${pid}"

  for _ in $(seq 1 "${STOP_WAIT_SECONDS}"); do
    if ! kill -0 "${pid}" >/dev/null 2>&1; then
      break
    fi
    sleep 1
  done

  if kill -0 "${pid}" >/dev/null 2>&1; then
    echo "[warn] ${service} is still running after ${STOP_WAIT_SECONDS}s; stop it manually if needed"
    continue
  fi

  rm -f "${pid_file}"
  echo "[ok] ${service} stopped"
done
