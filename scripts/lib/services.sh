#!/usr/bin/env bash

ALL_BACKEND_SERVICES=(
  system
  archive
  inventory
  purchase
  operation
  member
  online
  finance
  analytics
  gateway
)

DEFAULT_BACKEND_SERVICES=(
  system
  gateway
)

is_known_backend_service() {
  local candidate="$1"
  local service
  for service in "${ALL_BACKEND_SERVICES[@]}"; do
    if [[ "${service}" == "${candidate}" ]]; then
      return 0
    fi
  done
  return 1
}

normalize_backend_services() {
  if (($# == 0)); then
    printf '%s\n' "${DEFAULT_BACKEND_SERVICES[@]}"
    return
  fi

  if [[ "$1" == "all" ]]; then
    printf '%s\n' "${ALL_BACKEND_SERVICES[@]}"
    return
  fi

  local requested=()
  local candidate
  for candidate in "$@"; do
    if ! is_known_backend_service "${candidate}"; then
      echo "Unknown backend service: ${candidate}" >&2
      return 1
    fi
    requested+=("${candidate}")
  done

  printf '%s\n' "${requested[@]}"
}
