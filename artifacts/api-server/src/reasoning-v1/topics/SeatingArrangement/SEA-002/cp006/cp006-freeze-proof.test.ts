import assert from "node:assert/strict";

import { buildCp006EnglishReviewCorpus, cp006EnglishReviewFingerprint } from "./cp006-review-corpus.ts";
import {
  SEA002_CP006_APPROVED_REVIEW,
  buildApprovedCp006ReviewLedger,
} from "./review/approved-review.ts";
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
assert.equal(fingerprint,SEA002_CP006_APPROVED_REVIEW.approvedReviewFingerprint,"approved review fingerprint drifted");
assert.equal(SEA002_CP006_APPROVED_REVIEW.approvedReviewFingerprint,"07216e2a08c198266bd25e40484a477d5c6e4de73b2dae06b8235fc3773a0c3e");
assert.equal(SEA002_CP006_APPROVED_REVIEW.artifactSha256,"7e37d79da61f4b4edca8601e353cd1cf4b8fc1b85fa427dfd89591fa7f747ccc");
assert.equal(SEA002_CP006_APPROVED_REVIEW.artifactId,9474071929);
assert.equal(SEA002_CP006_APPROVED_REVIEW.decision,"100_ACCEPT_0_REWRITE_0_REJECT");

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
assert.equal(new Set(SEA002_CP006_PERMANENT_QL_REGISTRY.map((entry)=>entry.permanentQlId)).size,4);
assert.equal(new Set(SEA002_CP006_PERMANENT_QL_REGISTRY.map((entry)=>entry.blueprintAuthorityId)).size,4);
for(const blueprint of SEA002_CP006_BLUEPRINT_IDS){
  const ql=SEA002_CP006_BLUEPRINT_TO_PERMANENT_QL[blueprint];
  const entry=SEA002_CP006_PERMANENT_QL_REGISTRY.find((candidate)=>candidate.blueprintAuthorityId===blueprint);
  assert.ok(entry,`${blueprint}: missing permanent registry entry`);
  assert.equal(entry.permanentQlId,ql);
  assert.equal(entry.approvedReviewFingerprint,fingerprint);
  assert.equal(entry.englishStatus,"ENGLISH_MANUAL_FREEZE_APPROVED");
  assert.equal(entry.solveInventoryStatus,"FROZEN");
  assert.equal(entry.queryMixStatus,"FROZEN");
  assert.equal(entry.allocationStatus,"PERMANENT_ID_ALLOCATED_INACTIVE");
  assert.equal(entry.localizationStatus,"NOT_STARTED");
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
assert.equal(SEA002_CP006_ENGLISH_FREEZE.status,"FROZEN");
assert.equal(SEA002_CP006_ENGLISH_FREEZE.locale,"en-IN");
assert.equal(SEA002_CP006_ENGLISH_FREEZE.learnerTerminology,"POSITION_NOT_COLUMN");
assert.equal(SEA002_CP006_ENGLISH_FREEZE.approvedReviewFingerprint,fingerprint);
assert.equal(SEA002_CP006_ENGLISH_FREEZE.reviewDecision,"100_ACCEPT_0_REWRITE_0_REJECT");

assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.identityStatus,"PERMANENT_IDS_ALLOCATED");
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.solveInventoryStatus,"FROZEN");
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.queryMixStatus,"FROZEN");
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.englishFreezeStatus,"FROZEN");
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.permanentQlCount,4);
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.localizationStatus,"NOT_STARTED");
assert.doesNotThrow(()=>assertCp006PermanentLayerStillInactive());

console.log("PASS_SEA002_CP006_PERMANENT_FREEZE");
console.log("permanent QLs",SEA002_CP006_PERMANENT_QL_IDS.join(","));
console.log("blueprint mapping",SEA002_CP006_BLUEPRINT_TO_PERMANENT_QL);
console.log("review fingerprint",fingerprint);
console.log("review decision",SEA002_CP006_APPROVED_REVIEW.decision);
console.log("next permanent QL",SEA002_NEXT_AVAILABLE_PERMANENT_QL_ID);
console.log("localization/Studio/Bank/mock/staging/public",false,false,false,false,false,false);
