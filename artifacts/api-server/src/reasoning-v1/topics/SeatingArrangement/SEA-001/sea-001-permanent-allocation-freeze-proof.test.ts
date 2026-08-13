import { buildApprovedSea001ManualReviewLedger } from "./review/approved-review.ts";
import { assessSea001AllocationReadiness } from "./review/readiness.ts";
import { runSea001MergeSplitAudit } from "./saturation/authority-audits.ts";
import { buildSea001SaturationCorpus, selectManualReviewCorpus } from "./saturation/corpus.ts";
import {
  SEA001_ENGLISH_FREEZE,
  SEA001_FROZEN_QUERY_CONTRACTS_BY_CHECKPOINT,
  SEA001_PERMANENT_INACTIVE_LIFECYCLE,
  SEA001_QUERY_MIX_FREEZE,
  SEA001_SOLVE_INVENTORY_FREEZE,
  assertSea001PermanentLayerStillInactive,
} from "./permanent/freeze.ts";
import {
  SEA001_BLUEPRINT_TO_PERMANENT_QL,
  SEA001_NEXT_AVAILABLE_PERMANENT_QL_ID,
  SEA001_PERMANENT_QL_IDS,
  SEA001_PERMANENT_QL_REGISTRY,
} from "./permanent/registry.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function sameStrings(actual: readonly string[], expected: readonly string[], message: string): void {
  const left = [...new Set(actual)].sort();
  const right = [...new Set(expected)].sort();
  if (JSON.stringify(left) !== JSON.stringify(right)) {
    throw new Error(`${message}: expected ${JSON.stringify(right)}, got ${JSON.stringify(left)}`);
  }
}

const saturation = buildSea001SaturationCorpus(40);
const reviewCorpus = selectManualReviewCorpus(saturation.caselets, 5);
const reviewLedger = buildApprovedSea001ManualReviewLedger(reviewCorpus);
const readiness = assessSea001AllocationReadiness({
  saturationCorpus: saturation.caselets,
  reviewCorpus,
  reviewLedger,
});

assert(readiness.permanentAllocationEligible, "signed review did not unlock permanent allocation eligibility");
assert(readiness.solveInventoryFreezeEligible, "solve inventory was not freeze eligible");
assert(readiness.queryMixFreezeEligible, "query mix was not freeze eligible");
assert(readiness.englishFreezeEligible, "English was not freeze eligible");
assert(!readiness.activationEligible, "activation became eligible during permanent allocation");

const mergeSplit = runSea001MergeSplitAudit(saturation.caselets);
assert(mergeSplit.passed, "merge/split audit must pass at permanent allocation");
assert(mergeSplit.decisions.length === 20, `expected 20 retained solve authorities, got ${mergeSplit.decisions.length}`);
assert(mergeSplit.mergeCandidatePairs.length === 0, "permanent allocation cannot proceed with merge candidates");
assert(mergeSplit.splitCandidates.length === 0, "permanent allocation cannot proceed with split candidates");
assert(mergeSplit.decisions.every((decision) => decision.decision === "RETAIN_SEPARATE"), "every named SEA-001 PBA must remain a separate permanent solve authority");

assert(SEA001_PERMANENT_QL_IDS.length === 20, "permanent QL identity count");
assert(SEA001_PERMANENT_QL_REGISTRY.length === 20, "permanent QL registry count");
assert(new Set(SEA001_PERMANENT_QL_IDS).size === 20, "permanent QL identities must be unique");
assert(new Set(SEA001_PERMANENT_QL_REGISTRY.map((entry) => entry.blueprintAuthorityId)).size === 20, "each PBA must have one permanent owner");
assert(new Set(SEA001_PERMANENT_QL_REGISTRY.map((entry) => entry.permanentQlId)).size === 20, "each permanent QL must own one retained PBA");
assert(SEA001_NEXT_AVAILABLE_PERMANENT_QL_ID === "SEA-QL-021", "next available permanent QL identity");

for (const decision of mergeSplit.decisions) {
  const qlId = SEA001_BLUEPRINT_TO_PERMANENT_QL[decision.blueprintId as keyof typeof SEA001_BLUEPRINT_TO_PERMANENT_QL];
  assert(Boolean(qlId), `${decision.blueprintId}: missing permanent QL`);
  const entry = SEA001_PERMANENT_QL_REGISTRY.find((candidate) => candidate.blueprintAuthorityId === decision.blueprintId);
  assert(Boolean(entry), `${decision.blueprintId}: missing permanent registry entry`);
  assert(entry?.permanentQlId === qlId, `${decision.blueprintId}: registry mapping mismatch`);
  assert(entry?.checkpointId === decision.checkpointId, `${decision.blueprintId}: checkpoint changed during allocation`);
  assert(entry?.solveContract === decision.authorityContract, `${decision.blueprintId}: solve contract changed during allocation`);
  sameStrings(entry?.definingDiscriminators ?? [], decision.definingDiscriminators, `${decision.blueprintId}: discriminator freeze`);
}

for (const [checkpointId, expectedContracts] of Object.entries(SEA001_FROZEN_QUERY_CONTRACTS_BY_CHECKPOINT)) {
  const observed = saturation.caselets
    .filter((caselet) => caselet.checkpointId === checkpointId)
    .flatMap((caselet) => caselet.children.map((child) => child.queryContractId));
  sameStrings(observed, expectedContracts, `${checkpointId}: frozen query-contract set`);
}

assert(SEA001_SOLVE_INVENTORY_FREEZE.status === "FROZEN", "solve inventory status");
assert(SEA001_SOLVE_INVENTORY_FREEZE.permanentQlCount === 20, "solve inventory permanent QL count");
assert(SEA001_SOLVE_INVENTORY_FREEZE.retainedAuthorityCount === 20, "retained authority count");
assert(SEA001_SOLVE_INVENTORY_FREEZE.mergeCount === 0, "frozen merge count");
assert(SEA001_SOLVE_INVENTORY_FREEZE.splitCount === 0, "frozen split count");
assert(SEA001_QUERY_MIX_FREEZE.status === "FROZEN", "query mix status");
assert(SEA001_QUERY_MIX_FREEZE.childQuestionsPerCaselet === 4, "caselet child-question count changed");
assert(SEA001_ENGLISH_FREEZE.status === "FROZEN", "English freeze status");
assert(SEA001_ENGLISH_FREEZE.reviewDecision === "100_ACCEPT_0_REWRITE_0_REJECT", "English freeze decision summary");
assert(readiness.manualReview.acceptCount === 100, "approved manual review accept count");
assert(readiness.manualReview.pendingCount === 0, "approved manual review pending count");
assert(readiness.manualReview.rewriteCount === 0, "approved manual review rewrite count");
assert(readiness.manualReview.rejectCount === 0, "approved manual review reject count");

assertSea001PermanentLayerStillInactive();
assert(SEA001_PERMANENT_INACTIVE_LIFECYCLE.permanentQlCount === 20, "permanent inactive lifecycle QL count");
assert(!SEA001_PERMANENT_INACTIVE_LIFECYCLE.questionStudioRegistered, "Question Studio must remain disabled");
assert(!SEA001_PERMANENT_INACTIVE_LIFECYCLE.questionBankWritable, "Question Bank writes must remain disabled");
assert(!SEA001_PERMANENT_INACTIVE_LIFECYCLE.testEligible, "mock-test eligibility must remain disabled");
assert(!SEA001_PERMANENT_INACTIVE_LIFECYCLE.publiclyPublishable, "public delivery must remain disabled");

console.log("PASS_SEA_001_PERMANENT_ALLOCATION_AND_FREEZE");
console.log("permanent QLs", SEA001_PERMANENT_QL_REGISTRY.length);
console.log("permanent range", `${SEA001_PERMANENT_QL_IDS[0]}..${SEA001_PERMANENT_QL_IDS.at(-1)}`);
console.log("next permanent QL", SEA001_NEXT_AVAILABLE_PERMANENT_QL_ID);
console.log("retained solve authorities", SEA001_SOLVE_INVENTORY_FREEZE.retainedAuthorityCount);
console.log("merge candidates", mergeSplit.mergeCandidatePairs.length);
console.log("split candidates", mergeSplit.splitCandidates.length);
console.log("query mix fingerprint", SEA001_QUERY_MIX_FREEZE.mixFingerprint);
console.log("solve inventory fingerprint", SEA001_SOLVE_INVENTORY_FREEZE.registryFingerprint);
console.log("English review fingerprint", SEA001_ENGLISH_FREEZE.approvedReviewFingerprint);
console.log("signed accepts", readiness.manualReview.acceptCount);
console.log("Question Studio registered", SEA001_PERMANENT_INACTIVE_LIFECYCLE.questionStudioRegistered);
console.log("Question Bank writable", SEA001_PERMANENT_INACTIVE_LIFECYCLE.questionBankWritable);
console.log("test eligible", SEA001_PERMANENT_INACTIVE_LIFECYCLE.testEligible);
console.log("publicly publishable", SEA001_PERMANENT_INACTIVE_LIFECYCLE.publiclyPublishable);
