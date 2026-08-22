import assert from "node:assert/strict";

import { buildCp006EnglishReviewCorpus, cp006EnglishReviewFingerprint } from "./cp006-review-corpus.ts";
import {
  SEA002_CP006_APPROVED_REVIEW,
  SEA002_CP006_PREVIOUS_APPROVED_REVIEW,
  buildApprovedCp006ReviewLedger,
} from "./review/approved-review.ts";
import { SEA002_CP006_REOPENED_ENGLISH_REVIEW } from "./review/reopened-review.ts";
import {
  SEA002_CP006_BLUEPRINT_TO_PERMANENT_QL,
  SEA002_CP006_PERMANENT_QL_IDS,
  SEA002_CP006_PERMANENT_QL_REGISTRY,
  SEA002_NEXT_AVAILABLE_PERMANENT_QL_ID,
} from "./permanent/registry.ts";
import {
  SEA002_CP006_ENGLISH_FREEZE,
  SEA002_CP006_FROZEN_QUERY_CONTRACTS,
  SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE,
  SEA002_CP006_QUERY_MIX_FREEZE,
  SEA002_CP006_SOLVE_INVENTORY_FREEZE,
  assertCp006PermanentLayerStillInactive,
} from "./permanent/freeze.ts";
import { SEA002_CP006_BLUEPRINT_IDS } from "./types.ts";

const corpus=buildCp006EnglishReviewCorpus();
const fingerprint=cp006EnglishReviewFingerprint(corpus);
assert.equal(corpus.length,100);
assert.equal(fingerprint,SEA002_CP006_APPROVED_REVIEW.approvedReviewFingerprint,"corrected approved fingerprint drifted");
assert.equal(fingerprint,"21e815257a510a943092cffb69f3c5f44222c7e332ffe171e36eadbca0b83621");
assert.equal(SEA002_CP006_APPROVED_REVIEW.artifactId,9474796937);
assert.equal(SEA002_CP006_APPROVED_REVIEW.artifactSha256,"df6636920226295a3f7486c3b753f6a03f6f0aa28e309b4c2530f5eed9fb99e7");
assert.equal(SEA002_CP006_PREVIOUS_APPROVED_REVIEW.approvedReviewFingerprint,"07216e2a08c198266bd25e40484a477d5c6e4de73b2dae06b8235fc3773a0c3e");
assert.notEqual(SEA002_CP006_PREVIOUS_APPROVED_REVIEW.approvedReviewFingerprint,fingerprint);
assert.equal(SEA002_CP006_REOPENED_ENGLISH_REVIEW.status,"CLOSED_AFTER_CORRECTED_ARTIFACT_REAPPROVAL");
assert.equal(SEA002_CP006_REOPENED_ENGLISH_REVIEW.currentReviewApproved,true);
assert.equal(SEA002_CP006_REOPENED_ENGLISH_REVIEW.localizationMayProceed,true);
assert.equal(SEA002_CP006_REOPENED_ENGLISH_REVIEW.affectedRationaleCount,84);
assert.deepEqual(SEA002_CP006_REOPENED_ENGLISH_REVIEW.affectedQueryContracts,{"SEA-QC-003":41,"SEA-QC-010":34,"SEA-QC-012":9});
assert.equal(SEA002_CP006_REOPENED_ENGLISH_REVIEW.semanticAnswerChanges,0);
assert.equal(SEA002_CP006_REOPENED_ENGLISH_REVIEW.queryContractChanges,0);
assert.equal(SEA002_CP006_REOPENED_ENGLISH_REVIEW.solveAuthorityChanges,0);
assert.equal(SEA002_CP006_REOPENED_ENGLISH_REVIEW.permanentQlIdentityChanges,0);

const ledger=buildApprovedCp006ReviewLedger(corpus);
assert.equal(ledger.length,100);
assert.ok(ledger.every((entry)=>entry.decision==="ACCEPT"));
assert.ok(ledger.every((entry)=>entry.reviewerId===SEA002_CP006_APPROVED_REVIEW.reviewerId));
assert.ok(ledger.every((entry)=>entry.reviewedAt===SEA002_CP006_APPROVED_REVIEW.reviewedAt));
assert.equal(new Set(ledger.map((entry)=>entry.caseletId)).size,100);
assert.equal(new Set(ledger.map((entry)=>entry.contentFingerprint)).size,100);

assert.deepEqual(SEA002_CP006_PERMANENT_QL_IDS,["SEA-QL-021","SEA-QL-022","SEA-QL-023","SEA-QL-024"]);
assert.equal(SEA002_NEXT_AVAILABLE_PERMANENT_QL_ID,"SEA-QL-025");
assert.equal(SEA002_CP006_PERMANENT_QL_REGISTRY.length,4);
for(const blueprint of SEA002_CP006_BLUEPRINT_IDS){
  const entry=SEA002_CP006_PERMANENT_QL_REGISTRY.find((candidate)=>candidate.blueprintAuthorityId===blueprint);
  assert.ok(entry,`${blueprint}: missing permanent registry entry`);
  assert.equal(entry.permanentQlId,SEA002_CP006_BLUEPRINT_TO_PERMANENT_QL[blueprint]);
  assert.equal(entry.approvedReviewFingerprint,fingerprint);
  assert.equal(entry.approvedArtifactId,SEA002_CP006_APPROVED_REVIEW.artifactId);
  assert.equal(entry.englishStatus,"ENGLISH_MANUAL_FREEZE_APPROVED_CORRECTED");
  assert.equal(entry.solveInventoryStatus,"FROZEN");
  assert.equal(entry.queryMixStatus,"FROZEN");
  assert.equal(entry.localizationStatus,"REVIEW_CANDIDATE_HUMAN_REVIEW_PENDING");
  assert.equal(entry.active,false);
  assert.equal(entry.questionStudioDiscoverable,false);
  assert.equal(entry.questionBankWritable,false);
  assert.equal(entry.testEligible,false);
  assert.equal(entry.publiclyPublishable,false);
}

assert.deepEqual([...SEA002_CP006_FROZEN_QUERY_CONTRACTS].sort(),["SEA-QC-003","SEA-QC-006","SEA-QC-008","SEA-QC-010","SEA-QC-011","SEA-QC-012","SEA-QC-014","SEA-QC-015"]);
assert.equal(SEA002_CP006_SOLVE_INVENTORY_FREEZE.status,"FROZEN");
assert.equal(SEA002_CP006_QUERY_MIX_FREEZE.status,"FROZEN");
assert.equal(SEA002_CP006_ENGLISH_FREEZE.status,"FROZEN");
assert.equal(SEA002_CP006_ENGLISH_FREEZE.freezeActive,true);
assert.equal(SEA002_CP006_ENGLISH_FREEZE.approvedReviewFingerprint,fingerprint);
assert.equal(SEA002_CP006_ENGLISH_FREEZE.approvedArtifactId,9474796937);
assert.equal(SEA002_CP006_ENGLISH_FREEZE.learnerTerminology,"POSITION_NOT_COLUMN");
assert.equal(SEA002_CP006_ENGLISH_FREEZE.currentReviewApproved,true);

assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.englishFreezeStatus,"FROZEN");
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.localizationStatus,"REVIEW_CANDIDATE_HUMAN_REVIEW_PENDING");
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.localizationFrozen,false);
assert.doesNotThrow(()=>assertCp006PermanentLayerStillInactive());

console.log("PASS_SEA002_CP006_CORRECTED_ENGLISH_FREEZE");
console.log("permanent QLs",SEA002_CP006_PERMANENT_QL_IDS.join(","));
console.log("approved fingerprint",fingerprint);
console.log("approved artifact",SEA002_CP006_APPROVED_REVIEW.artifactId);
console.log("corrected rationales",SEA002_CP006_REOPENED_ENGLISH_REVIEW.affectedRationaleCount,SEA002_CP006_REOPENED_ENGLISH_REVIEW.affectedQueryContracts);
console.log("English freeze active",SEA002_CP006_ENGLISH_FREEZE.freezeActive);
console.log("localization status",SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.localizationStatus);
console.log("Studio/Bank/mock/staging/public",false,false,false,false,false);
