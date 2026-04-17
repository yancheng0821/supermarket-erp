#!/usr/bin/env bash

COMMON_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "${COMMON_DIR}/../.." && pwd)"
DEFAULT_ENV_FILE="${ROOT_DIR}/.env"

load_env_file() {
  local env_file="${ENV_FILE:-${DEFAULT_ENV_FILE}}"
  if [[ -f "${env_file}" ]]; then
    set -a
    # shellcheck disable=SC1090
    source "${env_file}"
    set +a
  fi
}

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
