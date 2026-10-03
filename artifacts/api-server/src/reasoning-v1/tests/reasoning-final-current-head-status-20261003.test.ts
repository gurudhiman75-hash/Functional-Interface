import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  REASONING_V1_FINAL_CURRENT_HEAD_STATUS_V1,
  REASONING_V1_FINAL_TOPIC_STATUS_V1,
} from "../shared/reasoning-final-current-head-status-20261003";
import { REASONING_V1_NOVELTY_PROVIDERS_V1 } from "../shared/reasoning-novelty-provider-registry-v1";
import { SPATIAL_FAMILY_FREEZE_AUTHORITY_V1 } from "../foundation/spatial/spatial-family-freeze-v1";

const cwd = process.cwd();
const reasoningRoot = resolve(cwd, "artifacts/api-server/src/reasoning-v1");

assert.equal(REASONING_V1_FINAL_CURRENT_HEAD_STATUS_V1.topicDirectoryCount, 31);
assert.equal(REASONING_V1_FINAL_CURRENT_HEAD_STATUS_V1.internalContentBlockerCount, 0);
assert.equal(REASONING_V1_FINAL_CURRENT_HEAD_STATUS_V1.externalSourceHoldTopicCount, 1);
assert.equal(REASONING_V1_FINAL_CURRENT_HEAD_STATUS_V1.contentDeepAuditCompleteForCurrentRepository, true);
assert.equal(REASONING_V1_FINAL_CURRENT_HEAD_STATUS_V1.fullTargetExamSourceSaturationComplete, false);
assert.equal(
  REASONING_V1_FINAL_CURRENT_HEAD_STATUS_V1.onlyKnownSourceSaturationHold,
  "LP-001_FIRST_PARTY_SSC_PUNJAB_RETRIEVAL_CEILING",
);

assert.equal(
  new Set(REASONING_V1_FINAL_TOPIC_STATUS_V1.map((entry) => entry.topicDirectory)).size,
  REASONING_V1_FINAL_TOPIC_STATUS_V1.length,
);

for (const entry of REASONING_V1_FINAL_TOPIC_STATUS_V1) {
  assert.equal(entry.internalContentBlocker, false, entry.topicDirectory);
  assert.ok(entry.chapterIds.length >= 1, entry.topicDirectory + ": missing chapter ids");
  assert.ok(entry.closureAuthorities.length >= 1, entry.topicDirectory + ": missing closure authorities");

  for (const relativePath of entry.closureAuthorities) {
    const fullPath = resolve(reasoningRoot, relativePath);
    assert.equal(
      existsSync(fullPath),
      true,
      entry.topicDirectory + ": missing closure authority " + relativePath,
    );
  }
}

const lp = REASONING_V1_FINAL_TOPIC_STATUS_V1.find(
  (entry) => entry.topicDirectory === "Logic-Puzzles",
);
assert.ok(lp);
assert.equal(lp?.status, "DEEP_AUDIT_CLOSED_EXTERNAL_SOURCE_HOLD");
assert.ok(lp?.externalEvidenceHold?.includes("first-party") || lp?.externalEvidenceHold?.includes("First-party"));

const lpSourceCeiling = readFileSync(
  resolve(
    reasoningRoot,
    "topics/Logic-Puzzles/LP-001/LP-001-011-SOURCE-PROVENANCE-WAVE04-RETRIEVAL-CEILING.md",
  ),
  "utf8",
);
assert.equal(lpSourceCeiling.includes("SOURCE_SATURATED_FOR_TARGET_EXAMS = false"), true);
assert.equal(lpSourceCeiling.includes("PRODUCTION_ELIGIBLE = false"), true);
assert.match(lpSourceCeiling, /FIRST-PARTY RETRIEVAL CEILING/i);

assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.permanentQlCount, 63);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.freezeContract.familyFrozen, true);
assert.equal(
  SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.freezeContract.deterministicUnifiedSoakPassed,
  true,
);

const approvedNoveltyProviders = REASONING_V1_NOVELTY_PROVIDERS_V1.filter(
  (provider) => provider.status === "APPROVED_RUNTIME",
);
const nonApprovedNoveltyProviders = REASONING_V1_NOVELTY_PROVIDERS_V1.filter(
  (provider) => provider.status !== "APPROVED_RUNTIME",
);
assert.equal(approvedNoveltyProviders.length, 9);
assert.equal(nonApprovedNoveltyProviders.length, 0);
assert.equal(
  approvedNoveltyProviders.filter((provider) => provider.countsTowardAssemblyNoveltyNow).length,
  9,
);

console.log(JSON.stringify({
  status: "PASS_REASONING_FINAL_CURRENT_HEAD_STATUS_20261003",
  topicDirectories: REASONING_V1_FINAL_CURRENT_HEAD_STATUS_V1.topicDirectoryCount,
  internalContentBlockers: REASONING_V1_FINAL_CURRENT_HEAD_STATUS_V1.internalContentBlockerCount,
  externalSourceHolds: REASONING_V1_FINAL_CURRENT_HEAD_STATUS_V1.externalSourceHoldTopicCount,
  approvedNoveltyProviders: approvedNoveltyProviders.map((provider) => provider.providerId),
  spatialPermanentQlCount: SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.permanentQlCount,
  verdict: REASONING_V1_FINAL_CURRENT_HEAD_STATUS_V1.verdict,
}, null, 2));
