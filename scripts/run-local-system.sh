#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
MVN_BIN="${MVN_BIN:-mvn}"
SPRING_PROFILE="${SPRING_PROFILE:-local}"
SYSTEM_PORT="${SYSTEM_PORT:-8080}"

is_java17_or_newer() {
  local version_output="$1"
  [[ "${version_output}" =~ \"17|\"18|\"19|\"2[0-9] ]]
}

ensure_java17() {
  local java_version_output
  java_version_output="$(java -version 2>&1 | head -n 1 || true)"
  if is_java17_or_newer "${java_version_output}"; then
    return
  fi

  if [[ -x /usr/libexec/java_home ]]; then
    JAVA_HOME="$(/usr/libexec/java_home -v 17+ 2>/dev/null || true)"
    export JAVA_HOME
    if [[ -n "${JAVA_HOME:-}" ]]; then
      export PATH="${JAVA_HOME}/bin:${PATH}"
      java_version_output="$(java -version 2>&1 | head -n 1 || true)"
      if is_java17_or_newer "${java_version_output}"; then
        return
      fi
    fi
  fi

  {
    local candidate
    local version_output
    for candidate in \
      "${HOME}"/Library/Java/JavaVirtualMachines/*/Contents/Home \
      /Library/Java/JavaVirtualMachines/*/Contents/Home; do
      [[ -x "${candidate}/bin/java" ]] || continue
      version_output="$("${candidate}/bin/java" -version 2>&1 | head -n 1 || true)"
      if is_java17_or_newer "${version_output}"; then
        JAVA_HOME="${candidate}"
        export JAVA_HOME
        break
      fi
    done
  }

  if [[ -n "${JAVA_HOME:-}" ]]; then
    export PATH="${JAVA_HOME}/bin:${PATH}"
  fi

  java_version_output="$(java -version 2>&1 | head -n 1 || true)"
  if ! is_java17_or_newer "${java_version_output}"; then
    echo "Java 17+ is required. Current runtime: ${java_version_output:-unknown}" >&2
    echo "Set JAVA_HOME before running this script if auto-detection did not find a Java 17+ installation." >&2
    exit 1
  fi
}

usage() {
  cat <<'EOF'
Usage: ./scripts/run-local-system.sh [extra spring arguments...]

Environment variables:
  SPRING_PROFILE  Spring profile to run, defaults to "local"
  SYSTEM_PORT     Local system port, defaults to 8080
  MVN_BIN         Maven executable, defaults to "mvn"

Examples:
  ./scripts/run-local-system.sh
  SYSTEM_PORT=18080 ./scripts/run-local-system.sh
  ./scripts/run-local-system.sh --logging.level.root=DEBUG
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

ensure_java17

SPRING_ARGS=("--server.port=${SYSTEM_PORT}")
if (($# > 0)); then
  SPRING_ARGS+=("$@")
fi

cd "${ROOT_DIR}"

exec "${MVN_BIN}" -pl erp-module-system/erp-module-system-biz spring-boot:run \
  -Dspring-boot.run.profiles="${SPRING_PROFILE}" \
  "-Dspring-boot.run.arguments=${SPRING_ARGS[*]}"
