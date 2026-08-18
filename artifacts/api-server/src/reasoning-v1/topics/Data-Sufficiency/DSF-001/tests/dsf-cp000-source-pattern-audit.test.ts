import assert from "node:assert/strict";
import { SUFFICIENCY_CLASSES } from "../foundation/index.ts";
import {
  DSF_BANK_BOB_2015_ORDER,
  DSF_BANK_STANDARD_ORDER,
  DSF_EXAM_FAMILY_EVIDENCE_STATUS,
  DSF_THREE_STATEMENT_SOURCE_PATTERNS,
  DSF_TWO_STATEMENT_SOURCE_PATTERNS,
  semanticOrderFingerprint,
} from "../discovery/source-pattern-registry.ts";
import {
  DSF_MERGE_SPLIT_AUDIT,
  DSF_PERMANENT_QL_ALLOCATION_DECISION,
  dsfMergeSplitSummary,
} from "../discovery/merge-split-audit.ts";

assert.equal(DSF_TWO_STATEMENT_SOURCE_PATTERNS.length, 2);
assert(DSF_TWO_STATEMENT_SOURCE_PATTERNS.every((entry) => entry.evidenceLevel === "CURATED_MEMORY_BASED_EXAM"));
assert(DSF_TWO_STATEMENT_SOURCE_PATTERNS.every((entry) => entry.sourceUrl.startsWith("https://sathee.iitk.ac.in/")));

assert.deepEqual(new Set(DSF_BANK_STANDARD_ORDER), new Set(SUFFICIENCY_CLASSES));
assert.deepEqual(new Set(DSF_BANK_BOB_2015_ORDER), new Set(SUFFICIENCY_CLASSES));
assert.notEqual(
  semanticOrderFingerprint(DSF_BANK_STANDARD_ORDER),
  semanticOrderFingerprint(DSF_BANK_BOB_2015_ORDER),
  "Banking source patterns should prove that option display order can vary while semantic coverage stays constant.",
);

assert.equal(DSF_THREE_STATEMENT_SOURCE_PATTERNS.length, 2);
assert(DSF_THREE_STATEMENT_SOURCE_PATTERNS.every((entry) => entry.statementCount === 3));
assert(DSF_THREE_STATEMENT_SOURCE_PATTERNS.some((entry) => entry.optionContractKind === "NAMED_STATEMENT_SUBSETS"));
assert(DSF_THREE_STATEMENT_SOURCE_PATTERNS.some((entry) => entry.optionContractKind === "MIXED_MINIMAL_SUBSET_EXPRESSIONS"));

const bankStatus = DSF_EXAM_FAMILY_EVIDENCE_STATUS.find((entry) => entry.examFamily === "BANKING")!;
const railwayStatus = DSF_EXAM_FAMILY_EVIDENCE_STATUS.find((entry) => entry.examFamily === "RAILWAY")!;
const sscStatus = DSF_EXAM_FAMILY_EVIDENCE_STATUS.find((entry) => entry.examFamily === "SSC")!;
const punjabStatus = DSF_EXAM_FAMILY_EVIDENCE_STATUS.find((entry) => entry.examFamily === "PUNJAB_STATE")!;
assert.equal(bankStatus.status, "SUPPORTED_FOR_DISCOVERY");
assert.equal(railwayStatus.status, "PARTIAL_SIGNAL_ONLY");
assert.equal(sscStatus.status, "PENDING_DIRECT_DS_EVIDENCE");
assert.equal(punjabStatus.status, "PENDING_DIRECT_DS_EVIDENCE");

assert.deepEqual(dsfMergeSplitSummary(), {
  MERGE: 2,
  SPLIT_CONTRACT: 2,
  SPLIT_ADAPTER: 2,
  DEFER: 2,
});
assert.equal(DSF_MERGE_SPLIT_AUDIT.length, 8);
assert(DSF_MERGE_SPLIT_AUDIT.some((entry) => entry.concern.includes("option order") && entry.permanentQlEffect === "NO_NEW_QL"));
assert(DSF_MERGE_SPLIT_AUDIT.some((entry) => entry.concern.includes("Three-statement") && entry.decision === "SPLIT_CONTRACT"));
assert(DSF_MERGE_SPLIT_AUDIT.some((entry) => entry.concern.includes("SSC-specific") && entry.decision === "DEFER"));

assert.equal(DSF_PERMANENT_QL_ALLOCATION_DECISION.status, "BLOCKED_PENDING_SOURCE_COMPLETION");
assert(DSF_PERMANENT_QL_ALLOCATION_DECISION.reasons.some((reason) => reason.includes("SSC")));
assert(DSF_PERMANENT_QL_ALLOCATION_DECISION.reasons.some((reason) => reason.includes("Punjab")));

console.log(JSON.stringify({
  status: "PASS_DSF_CP_000_SOURCE_PATTERN_AUDIT",
  sourceEvidence: {
    twoStatementProfiles: DSF_TWO_STATEMENT_SOURCE_PATTERNS.map((entry) => entry.patternId),
    threeStatementProfiles: DSF_THREE_STATEMENT_SOURCE_PATTERNS.map((entry) => entry.patternId),
    examFamilyStatus: Object.fromEntries(DSF_EXAM_FAMILY_EVIDENCE_STATUS.map((entry) => [entry.examFamily, entry.status])),
  },
  mergeSplit: dsfMergeSplitSummary(),
  permanentQlAllocation: DSF_PERMANENT_QL_ALLOCATION_DECISION.status,
}, null, 2));
