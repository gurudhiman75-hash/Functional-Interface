import assert from "node:assert/strict";

import { buildCp006EnglishReviewCorpus, cp006EnglishReviewFingerprint } from "./cp006-review-corpus.ts";
import {
  SEA002_CP006_APPROVED_REVIEW,
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
assert.equal(fingerprint,SEA002_CP006_REOPENED_ENGLISH_REVIEW.currentReviewCandidateFingerprint,"corrected review candidate fingerprint drifted");
assert.notEqual(fingerprint,SEA002_CP006_APPROVED_REVIEW.approvedReviewFingerprint,"old signed review must not authorize corrected learner text");
assert.equal(SEA002_CP006_APPROVED_REVIEW.approvedReviewFingerprint,"07216e2a08c198266bd25e40484a477d5c6e4de73b2dae06b8235fc3773a0c3e");
assert.equal(SEA002_CP006_REOPENED_ENGLISH_REVIEW.currentReviewCandidateFingerprint,"21e815257a510a943092cffb69f3c5f44222c7e332ffe171e36eadbca0b83621");
assert.equal(SEA002_CP006_REOPENED_ENGLISH_REVIEW.reasonCode,"SELF_REFERENCE_DISTRACTOR_RATIONALE_ERRATA");
assert.equal(SEA002_CP006_REOPENED_ENGLISH_REVIEW.affectedRationaleCount,84);
assert.deepEqual(SEA002_CP006_REOPENED_ENGLISH_REVIEW.affectedQueryContracts,{"SEA-QC-003":41,"SEA-QC-010":34,"SEA-QC-012":9});
assert.equal(SEA002_CP006_REOPENED_ENGLISH_REVIEW.semanticAnswerChanges,0);
assert.equal(SEA002_CP006_REOPENED_ENGLISH_REVIEW.queryContractChanges,0);
assert.equal(SEA002_CP006_REOPENED_ENGLISH_REVIEW.solveAuthorityChanges,0);
assert.equal(SEA002_CP006_REOPENED_ENGLISH_REVIEW.permanentQlIdentityChanges,0);
assert.equal(SEA002_CP006_REOPENED_ENGLISH_REVIEW.currentReviewApproved,false);
assert.equal(SEA002_CP006_REOPENED_ENGLISH_REVIEW.localizationMayProceed,false);
assert.throws(()=>buildApprovedCp006ReviewLedger(corpus),/signed review is stale/,"historical approval ledger must reject corrected content");

assert.deepEqual(SEA002_CP006_PERMANENT_QL_IDS,["SEA-QL-021","SEA-QL-022","SEA-QL-023","SEA-QL-024"]);
assert.equal(SEA002_NEXT_AVAILABLE_PERMANENT_QL_ID,"SEA-QL-025");
assert.equal(SEA002_CP006_PERMANENT_QL_REGISTRY.length,4);
assert.equal(new Set(SEA002_CP006_PERMANENT_QL_REGISTRY.map((entry)=>entry.permanentQlId)).size,4);
assert.equal(new Set(SEA002_CP006_PERMANENT_QL_REGISTRY.map((entry)=>entry.blueprintAuthorityId)).size,4);
for(const blueprint of SEA002_CP006_BLUEPRINT_IDS){
  const ql=SEA002_CP006_BLUEPRINT_TO_PERMANENT_QL[blueprint];
  const entry=SEA002_CP006_PERMANENT_QL_REGISTRY.find((candidate)=>candidate.blueprintAuthorityId===blueprint);
  assert.ok(entry,`${blueprint}: missing permanent registry entry`);
  assert.equal(entry.permanentQlId,ql);
  assert.equal(entry.previousApprovedReviewFingerprint,SEA002_CP006_APPROVED_REVIEW.approvedReviewFingerprint);
  assert.equal(entry.currentReviewCandidateFingerprint,fingerprint);
  assert.equal(entry.englishStatus,"ENGLISH_REVIEW_REOPENED_AFTER_EDITORIAL_ERRATA");
  assert.equal(entry.solveInventoryStatus,"FROZEN");
  assert.equal(entry.queryMixStatus,"FROZEN");
  assert.equal(entry.allocationStatus,"PERMANENT_ID_ALLOCATED_INACTIVE");
  assert.equal(entry.localizationStatus,"BLOCKED_BY_ENGLISH_REVIEW_REOPENED");
  assert.equal(entry.active,false);
  assert.equal(entry.questionStudioDiscoverable,false);
  assert.equal(entry.questionBankWritable,false);
  assert.equal(entry.testEligible,false);
  assert.equal(entry.publiclyPublishable,false);
}

assert.deepEqual([...SEA002_CP006_FROZEN_QUERY_CONTRACTS].sort(),["SEA-QC-003","SEA-QC-006","SEA-QC-008","SEA-QC-010","SEA-QC-011","SEA-QC-012","SEA-QC-014","SEA-QC-015"]);
assert.equal(SEA002_CP006_SOLVE_INVENTORY_FREEZE.status,"FROZEN");
assert.equal(SEA002_CP006_SOLVE_INVENTORY_FREEZE.permanentQlCount,4);
assert.equal(SEA002_CP006_SOLVE_INVENTORY_FREEZE.retainedAuthorityCount,4);
assert.equal(SEA002_CP006_SOLVE_INVENTORY_FREEZE.mergeCount,0);
assert.equal(SEA002_CP006_SOLVE_INVENTORY_FREEZE.splitCount,0);
assert.equal(SEA002_CP006_SOLVE_INVENTORY_FREEZE.nextAvailablePermanentQlId,"SEA-QL-025");
assert.match(SEA002_CP006_SOLVE_INVENTORY_FREEZE.registryFingerprint,/^[a-f0-9]{64}$/);
assert.equal(SEA002_CP006_QUERY_MIX_FREEZE.status,"FROZEN");
assert.equal(SEA002_CP006_QUERY_MIX_FREEZE.childQuestionsPerCaselet,4);
assert.match(SEA002_CP006_QUERY_MIX_FREEZE.mixFingerprint,/^[a-f0-9]{64}$/);

assert.equal(SEA002_CP006_ENGLISH_FREEZE.status,"REVIEW_REOPENED");
assert.equal(SEA002_CP006_ENGLISH_FREEZE.freezeActive,false);
assert.equal(SEA002_CP006_ENGLISH_FREEZE.locale,"en-IN");
assert.equal(SEA002_CP006_ENGLISH_FREEZE.learnerTerminology,"POSITION_NOT_COLUMN");
assert.equal(SEA002_CP006_ENGLISH_FREEZE.previousApprovedReviewFingerprint,SEA002_CP006_APPROVED_REVIEW.approvedReviewFingerprint);
assert.equal(SEA002_CP006_ENGLISH_FREEZE.currentReviewCandidateFingerprint,fingerprint);
assert.equal(SEA002_CP006_ENGLISH_FREEZE.currentReviewApproved,false);

assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.identityStatus,"PERMANENT_IDS_ALLOCATED");
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.solveInventoryStatus,"FROZEN");
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.queryMixStatus,"FROZEN");
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.englishFreezeStatus,"REVIEW_REOPENED");
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.permanentQlCount,4);
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.localizationStatus,"BLOCKED_BY_ENGLISH_REVIEW_REOPENED");
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.localizationFrozen,false);
assert.doesNotThrow(()=>assertCp006PermanentLayerStillInactive());

console.log("PASS_SEA002_CP006_ENGLISH_REVIEW_REOPENED");
console.log("permanent QLs reserved",SEA002_CP006_PERMANENT_QL_IDS.join(","));
console.log("previous approved fingerprint",SEA002_CP006_APPROVED_REVIEW.approvedReviewFingerprint);
console.log("corrected review candidate fingerprint",fingerprint);
console.log("corrected rationales",SEA002_CP006_REOPENED_ENGLISH_REVIEW.affectedRationaleCount,SEA002_CP006_REOPENED_ENGLISH_REVIEW.affectedQueryContracts);
console.log("answer/query/solve/QL identity changes",0,0,0,0);
console.log("English freeze active",SEA002_CP006_ENGLISH_FREEZE.freezeActive);
console.log("localization status",SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.localizationStatus);
console.log("next permanent QL",SEA002_NEXT_AVAILABLE_PERMANENT_QL_ID);
console.log("Studio/Bank/mock/staging/public",false,false,false,false,false);
