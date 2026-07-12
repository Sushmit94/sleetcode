#!/usr/bin/env bash
# Verifies a problem package the same way the grader will:
#   1. reference.sol (a correct solution, not shipped to users) must PASS test.sol
#   2. starter.sol (the unmodified stub) must NOT pass test.sol
# Usage: scripts/verify-problem.sh <slug>
set -euo pipefail

SLUG="${1:?usage: verify-problem.sh <slug>}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROBLEM_DIR="$ROOT/apps/api/problems/$SLUG"
TEMPLATE_DIR="$ROOT/apps/api/sandbox-template"
FORGE="$ROOT/.foundry/bin/forge"

if [ ! -d "$PROBLEM_DIR" ]; then
  echo "No such problem: $SLUG" >&2
  exit 1
fi

run_case() {
  local src_file="$1" label="$2"
  local dir
  dir=$(mktemp -d)
  mkdir -p "$dir/src" "$dir/test"
  cp -r "$TEMPLATE_DIR/lib" "$dir/lib"
  cp "$TEMPLATE_DIR/foundry.toml" "$dir/foundry.toml"
  cp "$TEMPLATE_DIR/remappings.txt" "$dir/remappings.txt"
  cp "$src_file" "$dir/src/Solution.sol"
  cp "$PROBLEM_DIR/test.sol" "$dir/test/Solution.t.sol"

  set +e
  OUT=$(cd "$dir" && "$FORGE" test 2>&1)
  CODE=$?
  set -e
  rm -rf "$dir"

  if [ "$label" = "reference" ]; then
    if [ $CODE -ne 0 ]; then
      echo "FAIL: reference solution did not pass tests"
      echo "$OUT"
      return 1
    fi
    echo "OK: reference solution passes"
  else
    if [ $CODE -eq 0 ]; then
      echo "FAIL: starter code (unmodified) already passes tests — problem is trivial"
      return 1
    fi
    echo "OK: starter code correctly fails (not trivially solved)"
  fi
}

run_case "$PROBLEM_DIR/reference.sol" reference
run_case "$PROBLEM_DIR/starter.sol" starter
echo "PASS: $SLUG verified"
