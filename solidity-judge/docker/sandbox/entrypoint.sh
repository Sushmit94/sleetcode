#!/bin/bash
set -e

mkdir -p /sandbox/src /sandbox/test

# USER_CODE and TEST_CODE are passed as env vars by the API
printf '%s' "$USER_CODE" > /sandbox/src/Solution.sol
printf '%s' "$TEST_CODE" > /sandbox/test/Solution.t.sol

cd /sandbox

# Run forge test with JSON output. Exit code 0 = all pass, 1 = some fail.
forge test --json --no-match-test "SKIP" 2>&1 || true