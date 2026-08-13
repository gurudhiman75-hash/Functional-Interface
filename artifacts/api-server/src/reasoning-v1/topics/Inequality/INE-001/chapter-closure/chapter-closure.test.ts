import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

import { INE_CP001_CONCLUSION_CONTRACTS } from "../INE-CP-001/conclusion-contracts";
import { INE_CP001_PROTOTYPE_CONTRACTS } from "../INE-CP-001/prototype-contracts";
import { INE_CP002_PROTOTYPE_CONTRACTS } from "../INE-CP-002/contracts";
import { INE_CP003_PROTOTYPE_CONTRACTS } from "../INE-CP-003/contracts";
import { INE_CP004_PROTOTYPE_CONTRACTS } from "../INE-CP-004/contracts";
import { INE_CP005_PROTOTYPE_CONTRACTS } from "../INE-CP-005/contracts";
import { INE_CP006_PROTOTYPE_CONTRACTS } from "../INE-CP-006/contracts";
import { INE_CP007_PROTOTYPE_CONTRACTS } from "../INE-CP-007/contracts";
import { INE_CP008_PROTOTYPE_CONTRACTS } from "../INE-CP-008/contracts";
import {
  INE_001_ACTIVATION_STATE,
  INE_001_CLOSURE_GROUPS,
  INE_001_GUIDED_GROUPS,
  INE_001_PERMANENT_QL_CANDIDATES,
} from "./registry";

interface ReviewRow {
  authorityId: string;
  options: readonly string[];
  correctOption: string;
  correctIndex?: number;
  explanation?: string;
  mockExplanation?: string;
  mockSolution?: string;
  reviewStatus?: string;
}

const root = path.resolve(
  "src/reasoning-v1/topics/Inequality/INE-001",
);
const expectedPackCounts = [32, 36, 84, 48, 48, 48, 32, 32] as const;
const packs = expectedPackCounts.map((expectedCount, index) => {
  const cpNumber = String(index + 1).padStart(3, "0");
  const file = path.join(
    root,
    `INE-CP-${cpNumber}`,
    "review",
    `ine-cp${cpNumber}-english-review.json`,
  );
  const rows = JSON.parse(readFileSync(file, "utf8")) as ReviewRow[];
  assert.equal(rows.length, expectedCount, `${file} is stale.`);
  return rows;
});
const rows = packs.flat();

const contractAuthorities = [
  ...INE_CP001_PROTOTYPE_CONTRACTS,
  ...INE_CP001_CONCLUSION_CONTRACTS,
  ...INE_CP002_PROTOTYPE_CONTRACTS,
  ...INE_CP003_PROTOTYPE_CONTRACTS,
  ...INE_CP004_PROTOTYPE_CONTRACTS,
  ...INE_CP005_PROTOTYPE_CONTRACTS,
  ...INE_CP006_PROTOTYPE_CONTRACTS,
  ...INE_CP007_PROTOTYPE_CONTRACTS,
  ...INE_CP008_PROTOTYPE_CONTRACTS,
].map((contract) => contract.authorityId);
const groupedAuthorities = INE_001_CLOSURE_GROUPS.flatMap(
  (group) => group.authorityIds,
);

assert.equal(contractAuthorities.length, 44);
assert.equal(new Set(contractAuthorities).size, 44);
assert.equal(groupedAuthorities.length, 44);
assert.equal(new Set(groupedAuthorities).size, 44);
assert.deepEqual(
  [...groupedAuthorities].sort(),
  [...contractAuthorities].sort(),
  "Every provisional authority must have exactly one closure decision.",
);
assert.equal(new Set(INE_001_CLOSURE_GROUPS.map((group) => group.candidateId)).size, 19);
assert.equal(INE_001_PERMANENT_QL_CANDIDATES.length, 12);
assert.equal(INE_001_GUIDED_GROUPS.length, 7);

const closureByAuthority = new Map(
  INE_001_CLOSURE_GROUPS.flatMap((group) =>
    group.authorityIds.map((authorityId) => [authorityId, group] as const),
  ),
);
const threeChoiceGuidedAuthorities = new Set([
  "CLASSIFY_SINGLE_CONCLUSION_TRUTH",
  "EVALUATE_INCLUSIVE_CONCLUSION_TRUTH",
]);
const forbiddenExplanationLanguage =
  /\b(?:endpoint|model|formally|solver|strict parts|strongest definite relation|carry|carries|proof path)\b/i;

for (const row of rows) {
  const group = closureByAuthority.get(row.authorityId);
  assert.ok(group, `Missing closure decision for ${row.authorityId}.`);
  assert.equal(new Set(row.options).size, row.options.length);
  assert.ok(row.options.every((option) => option.trim().length > 0));
  assert.ok(row.options.includes(row.correctOption));
  if (row.reviewStatus !== undefined)
    assert.equal(row.reviewStatus, "CHECKPOINT_ACCEPTED");
  if (row.correctIndex !== undefined)
    assert.equal(row.options[row.correctIndex], row.correctOption);

  if (group.decision === "PERMANENT_QL_CANDIDATE")
    assert.equal(row.options.length, 4, `${row.authorityId} must have four options.`);
  else if (threeChoiceGuidedAuthorities.has(row.authorityId))
    assert.equal(row.options.length, 3);
  else assert.equal(row.options.length, 4);

  const publicExplanation =
    row.mockSolution ?? row.mockExplanation ?? row.explanation ?? "";
  assert.ok(publicExplanation.length >= 30);
  assert.ok(publicExplanation.length <= 500);
  assert.doesNotMatch(publicExplanation, forbiddenExplanationLanguage);
}

for (const cpNumber of [2, 3, 4, 5]) {
  const padded = String(cpNumber).padStart(3, "0");
  const markdown = readFileSync(
    path.join(
      root,
      `INE-CP-${padded}`,
      "review",
      `ine-cp${padded}-english-review.md`,
    ),
    "utf8",
  );
  assert.doesNotMatch(markdown, /^### Learning solution$/m);
  assert.match(markdown, /^### Explanation$/m);
}

assert.deepEqual(INE_001_ACTIVATION_STATE, {
  permanentQlIdsAllocated: false,
  questionStudioVisible: false,
  localizationEnabled: false,
  publicReleaseEnabled: false,
});

console.log("INE-001 chapter-closure audit passed.", {
  reviewRecordCount: rows.length,
  provisionalAuthorityCount: contractAuthorities.length,
  permanentQlCandidateCount: INE_001_PERMANENT_QL_CANDIDATES.length,
  guidedGroupCount: INE_001_GUIDED_GROUPS.length,
  threeChoiceGuidedRecordCount: rows.filter((row) =>
    threeChoiceGuidedAuthorities.has(row.authorityId),
  ).length,
});
