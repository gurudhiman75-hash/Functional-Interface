#!/usr/bin/env bash
set -euo pipefail

# Combined-tree V2: exact approved locale pins; workflow gates mirror each checkpoint's final approved authority.
ROOT="artifacts/api-server/src/reasoning-v1/topics/Ranking-and-Order/RNK-001"

materialize() {
  local branch="$1"
  local expected="$2"
  shift 2
  git fetch --no-tags origin "$branch"
  local actual
  actual="$(git rev-parse FETCH_HEAD)"
  if [[ "$actual" != "$expected" ]]; then
    echo "PIN MOVED: $branch expected $expected got $actual" >&2
    exit 1
  fi
  git checkout "$expected" -- "$@"
}

materialize feature/rnk-cp001-localization-review-v1 d62bb7ea6bf8312a360318cf4939bd15bce057f0 \
  "$ROOT/RNK-CP-001/cp001-localization-review-export-v4.ts" \
  "$ROOT/RNK-CP-001/cp001-localization-review-v1.test.ts" \
  "$ROOT/RNK-CP-001/cp001-localization-review-v1.ts" \
  "$ROOT/RNK-CP-001/cp001-localization-review-v2.test.ts" \
  "$ROOT/RNK-CP-001/cp001-localization-review-v2.ts" \
  "$ROOT/RNK-CP-001/cp001-localization-review-v3.test.ts" \
  "$ROOT/RNK-CP-001/cp001-localization-review-v3.ts" \
  "$ROOT/RNK-CP-001/cp001-localization-review-v4.test.ts" \
  "$ROOT/RNK-CP-001/cp001-localization-review-v4.ts"

materialize feature/rnk-cp002-localization-review-v1 0e29a4760f80c638c5e318cdc5dcff621fe3b9a4 \
  "$ROOT/RNK-CP-002/cp002-localization-review-export-v1.ts" \
  "$ROOT/RNK-CP-002/cp002-localization-review-export-v2.ts" \
  "$ROOT/RNK-CP-002/cp002-localization-review-v1.test.ts" \
  "$ROOT/RNK-CP-002/cp002-localization-review-v1.ts" \
  "$ROOT/RNK-CP-002/cp002-localization-review-v2.test.ts" \
  "$ROOT/RNK-CP-002/cp002-localization-review-v2.ts"

materialize feature/rnk-cp003-localization-review-v1 618a5a8ebdc33eaad395a10297719cae030d8cc9 \
  "$ROOT/RNK-CP-003/cp003-localization-review-export-v4.ts" \
  "$ROOT/RNK-CP-003/cp003-localization-review-v1.test.ts" \
  "$ROOT/RNK-CP-003/cp003-localization-review-v1.ts" \
  "$ROOT/RNK-CP-003/cp003-localization-review-v2.test.ts" \
  "$ROOT/RNK-CP-003/cp003-localization-review-v2.ts" \
  "$ROOT/RNK-CP-003/cp003-localization-review-v3.test.ts" \
  "$ROOT/RNK-CP-003/cp003-localization-review-v3.ts" \
  "$ROOT/RNK-CP-003/cp003-localization-review-v4.test.ts" \
  "$ROOT/RNK-CP-003/cp003-localization-review-v4.ts"

materialize feature/rnk-cp004-localization-review-v1 7ac8eeeb76cd2c259957baa67d30c1acb329f36e \
  "$ROOT/RNK-CP-004/cp004-localization-review-export-v5-final.ts" \
  "$ROOT/RNK-CP-004/cp004-localization-review-export-v6.ts" \
  "$ROOT/RNK-CP-004/cp004-localization-review-v1-sample-gates.test.ts" \
  "$ROOT/RNK-CP-004/cp004-localization-review-v1.ts" \
  "$ROOT/RNK-CP-004/cp004-localization-review-v2.ts" \
  "$ROOT/RNK-CP-004/cp004-localization-review-v3.test.ts" \
  "$ROOT/RNK-CP-004/cp004-localization-review-v3.ts" \
  "$ROOT/RNK-CP-004/cp004-localization-review-v4.test.ts" \
  "$ROOT/RNK-CP-004/cp004-localization-review-v4.ts" \
  "$ROOT/RNK-CP-004/cp004-localization-review-v5-final.test.ts" \
  "$ROOT/RNK-CP-004/cp004-localization-review-v5-final.ts" \
  "$ROOT/RNK-CP-004/cp004-localization-review-v5.test.ts" \
  "$ROOT/RNK-CP-004/cp004-localization-review-v5.ts" \
  "$ROOT/RNK-CP-004/cp004-localization-review-v6.test.ts" \
  "$ROOT/RNK-CP-004/cp004-localization-review-v6.ts" \
  "$ROOT/RNK-CP-004/cp004-localization-v1-semantic-baseline.test.ts" \
  "$ROOT/RNK-CP-004/cp004-localization-v1-static-contract.test.ts"

materialize feature/rnk-cp005-localization-review-v1 7d28290d061329153935853cba28d5c3ffe63a43 \
  "$ROOT/RNK-CP-005/cp005-localization-review-export-v2.ts" \
  "$ROOT/RNK-CP-005/cp005-localization-review-export-v3.ts" \
  "$ROOT/RNK-CP-005/cp005-localization-review-v1.ts" \
  "$ROOT/RNK-CP-005/cp005-localization-review-v2-final.test.ts" \
  "$ROOT/RNK-CP-005/cp005-localization-review-v2.test.ts" \
  "$ROOT/RNK-CP-005/cp005-localization-review-v2.ts" \
  "$ROOT/RNK-CP-005/cp005-localization-review-v3.test.ts" \
  "$ROOT/RNK-CP-005/cp005-localization-review-v3.ts" \
  "$ROOT/RNK-CP-005/cp005-permanent-runtime-v1-gates.test.ts"

materialize feature/rnk-cp006-localization-review-v1 361cf571f138572caebfd0ecb0fa145e9afdfda3 \
  "$ROOT/RNK-CP-006/cp006-localization-review-export-v1.ts" \
  "$ROOT/RNK-CP-006/cp006-localization-review-v1.test.ts" \
  "$ROOT/RNK-CP-006/cp006-localization-review-v1.ts"

materialize fix/rnk-cp007-native-editorial-v2 60d1fcca93efd27340f969ff8589b95195c2771e \
  "$ROOT/RNK-CP-007/cp007-localization-review-export-v2.ts" \
  "$ROOT/RNK-CP-007/cp007-localization-review-export-v3.ts" \
  "$ROOT/RNK-CP-007/cp007-localization-review-export-v4.ts" \
  "$ROOT/RNK-CP-007/cp007-localization-review-v2.test.ts" \
  "$ROOT/RNK-CP-007/cp007-localization-review-v2.ts" \
  "$ROOT/RNK-CP-007/cp007-localization-review-v3.test.ts" \
  "$ROOT/RNK-CP-007/cp007-localization-review-v3.ts" \
  "$ROOT/RNK-CP-007/cp007-localization-review-v4.test.ts" \
  "$ROOT/RNK-CP-007/cp007-localization-review-v4.ts" \
  "$ROOT/RNK-CP-007/cp007-percentage-presentation-adapter-v1.test.ts" \
  "$ROOT/RNK-CP-007/cp007-percentage-presentation-adapter-v1.ts" \
  "$ROOT/RNK-CP-007/cp007-percentage-presentation-adapter-v2.test.ts" \
  "$ROOT/RNK-CP-007/cp007-percentage-presentation-adapter-v2.ts" \
  "$ROOT/RNK-CP-007/cp007-percentage-presentation-export-v1.ts" \
  "$ROOT/RNK-CP-007/cp007-percentage-presentation-export-v2.ts"

mapfile -t changed < <(git diff --cached --name-only)
if [[ ${#changed[@]} -eq 0 ]]; then
  echo "No locale files were materialized" >&2
  exit 1
fi
for path in "${changed[@]}"; do
  if [[ "$path" != "$ROOT"/RNK-CP-00[1-7]/* ]]; then
    echo "Unexpected combined-tree path: $path" >&2
    exit 1
  fi
done

echo "Materialized ${#changed[@]} approved locale files from seven pinned heads."
printf '%s\n' "${changed[@]}"
