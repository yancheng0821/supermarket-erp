#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"
# shellcheck source=lib/services.sh
source "${SCRIPT_DIR}/lib/services.sh"

load_env_file

RUNTIME_DIR="${ROOT_DIR}/.runtime"
PID_DIR="${RUNTIME_DIR}/pids"
LOG_DIR="${RUNTIME_DIR}/logs"
START_DELAY_SECONDS="${START_DELAY_SECONDS:-2}"
ENV_FILE_PATH="${ENV_FILE:-${DEFAULT_ENV_FILE}}"

usage() {
  cat <<'EOF'
Usage: ./scripts/start-local-stack.sh [all|service...]

Without arguments, this script starts the minimal local chain:
  system gateway

Examples:
  ./scripts/start-local-stack.sh
  ./scripts/start-local-stack.sh all
  ./scripts/start-local-stack.sh system archive gateway

Environment variables:
  ENV_FILE             Optional env file path, defaults to root .env
  START_DELAY_SECONDS  Delay between service launches, defaults to 2
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

mkdir -p "${PID_DIR}" "${LOG_DIR}"

mapfile -t SERVICES < <(normalize_backend_services "$@")

for service in "${SERVICES[@]}"; do
  pid_file="${PID_DIR}/${service}.pid"
  log_file="${LOG_DIR}/${service}.log"
  script_path="${ROOT_DIR}/scripts/run-local-${service}.sh"

  if [[ ! -x "${script_path}" ]]; then
    echo "Missing executable script: ${script_path}" >&2
    exit 1
  fi

  if [[ -f "${pid_file}" ]]; then
    pid="$(<"${pid_file}")"
    if kill -0 "${pid}" >/dev/null 2>&1; then
      echo "[skip] ${service} already running (pid=${pid})"
      continue
    fi
    rm -f "${pid_file}"
  fi

  echo "[start] ${service} -> ${log_file}"
  nohup env ENV_FILE="${ENV_FILE_PATH}" "${script_path}" >"${log_file}" 2>&1 &
  pid=$!
  echo "${pid}" >"${pid_file}"
  echo "[ok] ${service} started (pid=${pid})"
  sleep "${START_DELAY_SECONDS}"
done

echo "Runtime state directory: ${RUNTIME_DIR}"
