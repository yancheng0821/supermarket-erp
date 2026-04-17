#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"

SERVICE_KEY=""
SERVICE_NAME=""
MODULE_PATH=""
PORT_VAR=""
DEFAULT_PORT=""

resolve_service() {
  case "$1" in
    system)
      SERVICE_NAME="erp-system"
      MODULE_PATH="erp-module-system/erp-module-system-biz"
      PORT_VAR="SYSTEM_PORT"
      DEFAULT_PORT="8080"
      ;;
    gateway)
      SERVICE_NAME="erp-gateway"
      MODULE_PATH="erp-gateway"
      PORT_VAR="GATEWAY_PORT"
      DEFAULT_PORT="9000"
      ;;
    archive)
      SERVICE_NAME="erp-archive"
      MODULE_PATH="erp-module-archive/erp-module-archive-biz"
      PORT_VAR="ARCHIVE_PORT"
      DEFAULT_PORT="8081"
      ;;
    inventory)
      SERVICE_NAME="erp-inventory"
      MODULE_PATH="erp-module-inventory/erp-module-inventory-biz"
      PORT_VAR="INVENTORY_PORT"
      DEFAULT_PORT="8082"
      ;;
    purchase)
      SERVICE_NAME="erp-purchase"
      MODULE_PATH="erp-module-purchase/erp-module-purchase-biz"
      PORT_VAR="PURCHASE_PORT"
      DEFAULT_PORT="8083"
      ;;
    operation)
      SERVICE_NAME="erp-operation"
      MODULE_PATH="erp-module-operation/erp-module-operation-biz"
      PORT_VAR="OPERATION_PORT"
      DEFAULT_PORT="8084"
      ;;
    member)
      SERVICE_NAME="erp-member"
      MODULE_PATH="erp-module-member/erp-module-member-biz"
      PORT_VAR="MEMBER_PORT"
      DEFAULT_PORT="8085"
      ;;
    online)
      SERVICE_NAME="erp-online"
      MODULE_PATH="erp-module-online/erp-module-online-biz"
      PORT_VAR="ONLINE_PORT"
      DEFAULT_PORT="8086"
      ;;
    finance)
      SERVICE_NAME="erp-finance"
      MODULE_PATH="erp-module-finance/erp-module-finance-biz"
      PORT_VAR="FINANCE_PORT"
      DEFAULT_PORT="8087"
      ;;
    analytics)
      SERVICE_NAME="erp-analytics"
      MODULE_PATH="erp-module-analytics/erp-module-analytics-biz"
      PORT_VAR="ANALYTICS_PORT"
      DEFAULT_PORT="8088"
      ;;
    *)
      echo "Unknown service: $1" >&2
      return 1
      ;;
  esac
}

usage_all() {
  cat <<'EOF'
Usage: ./scripts/run-local-service.sh <service> [extra spring arguments...]

Services:
  system
  gateway
  archive
  inventory
  purchase
  operation
  member
  online
  finance
  analytics

Examples:
  ./scripts/run-local-service.sh system
  ./scripts/run-local-service.sh archive --logging.level.root=DEBUG
EOF
}

usage_service() {
  cat <<EOF
Usage: ./scripts/run-local-${SERVICE_KEY}.sh [extra spring arguments...]

Environment variables:
  SPRING_PROFILE  Spring profile to run, defaults to "local"
  MVN_BIN         Maven executable, defaults to "mvn"
  ENV_FILE        Optional env file path, defaults to ${DEFAULT_ENV_FILE}
  ${PORT_VAR}     Local ${SERVICE_NAME} port, defaults to ${DEFAULT_PORT}

This script automatically loads \`.env\` when present and exports its values
for Spring placeholders such as gateway route ports, datasource config, and JWT secret.

Examples:
  ./scripts/run-local-${SERVICE_KEY}.sh
  ${PORT_VAR}=1${DEFAULT_PORT} ./scripts/run-local-${SERVICE_KEY}.sh
  ./scripts/run-local-${SERVICE_KEY}.sh --logging.level.root=DEBUG
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" || $# -eq 0 ]]; then
  usage_all
  exit 0
fi

SERVICE_KEY="$1"
shift
resolve_service "${SERVICE_KEY}"

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage_service
  exit 0
fi

load_env_file
ensure_java17

MVN_BIN="${MVN_BIN:-mvn}"
SPRING_PROFILE="${SPRING_PROFILE:-local}"

PORT_VALUE="${!PORT_VAR:-${DEFAULT_PORT}}"
printf -v "${PORT_VAR}" '%s' "${PORT_VALUE}"
export "${PORT_VAR}"

SPRING_ARGS=("--server.port=${PORT_VALUE}")
if (($# > 0)); then
  SPRING_ARGS+=("$@")
fi

cd "${ROOT_DIR}"

exec "${MVN_BIN}" -pl "${MODULE_PATH}" spring-boot:run \
  -Dspring-boot.run.profiles="${SPRING_PROFILE}" \
  "-Dspring-boot.run.arguments=${SPRING_ARGS[*]}"
