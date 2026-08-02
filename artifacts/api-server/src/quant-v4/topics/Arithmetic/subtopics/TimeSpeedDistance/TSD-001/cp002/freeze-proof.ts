import { TSD_CP001_NEXT_PERMANENT_QL_ID } from "../cp001/freeze-registry";
import {
  TSD_CP002_INTERNAL_AUTHORITIES,
  TSD_CP002_LEARNER_AUTHORITIES,
  TSD_CP002_SOURCE_CANDIDATES,
} from "./discovery-registry";
import {
  TSD_CP002_FROZEN_AUTHORITIES,
  TSD_CP002_NEXT_PERMANENT_QL_ID,
} from "./freeze-registry";
import { generateCp002ReviewRows } from "./runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(TSD_CP001_NEXT_PERMANENT_QL_ID === "TSD-QL-024", "CP-002 does not start at the next CP-001 permanent ID");
assert(TSD_CP002_FROZEN_AUTHORITIES.length === 14, "CP-002 must freeze exactly 14 learner authorities");
assert(TSD_CP002_LEARNER_AUTHORITIES.length === 14, "Learner discovery/freeze count mismatch");
assert(TSD_CP002_INTERNAL_AUTHORITIES.length === 2, "Internal QA count changed during freeze");

const expected = Array.from({ length: 14 }, (_, index) => `TSD-QL-${String(index + 24).padStart(3, "0")}`);
assert(JSON.stringify(TSD_CP002_FROZEN_AUTHORITIES.map((entry) => entry.permanentQlId)) === JSON.stringify(expected), "CP-002 permanent IDs are not contiguous TSD-QL-024..037");
assert(TSD_CP002_NEXT_PERMANENT_QL_ID === "TSD-QL-038", "Unexpected next permanent TSD QL after CP-002");
assert(new Set(TSD_CP002_FROZEN_AUTHORITIES.map((entry) => entry.solveMode)).size === 14, "Duplicate frozen CP-002 solve mode");
assert(new Set(TSD_CP002_FROZEN_AUTHORITIES.map((entry) => entry.provisionalAuthorityId)).size === 14, "Duplicate frozen CP-002 provisional authority");
assert(TSD_CP002_FROZEN_AUTHORITIES.every((entry) => entry.englishFreezeStatus === "FROZEN" && !entry.publiclyPublishable), "CP-002 freeze status failed");

const review = generateCp002ReviewRows();
assert(review.length === 42, "CP-002 English freeze must contain 42 reviewed questions");
for (const authority of TSD_CP002_FROZEN_AUTHORITIES) {
  const rows = review.filter((row) => row.permanentQlId === authority.permanentQlId);
  assert(rows.length === authority.reviewedStates, `${authority.permanentQlId}: reviewed-state count mismatch`);
  assert(rows.every((row) => row.validation.valid), `${authority.permanentQlId}: invalid row entered freeze`);
  assert(rows.every((row) => row.lifecycle.englishFreezeStatus === "FROZEN"), `${authority.permanentQlId}: English row is not frozen`);
  assert(rows.every((row) => row.lifecycle.questionBankStatus === "NOT_STORED" && row.lifecycle.testEligibility === "INELIGIBLE" && !row.publiclyPublishable), `${authority.permanentQlId}: delivery lock failed`);
  assert(new Set(rows.map((row) => row.mathematicalFingerprint)).size === 3, `${authority.permanentQlId}: mathematical states are not distinct`);
}

assert(TSD_CP002_SOURCE_CANDIDATES.length === 34, "Source evidence changed during CP-002 freeze");
assert(review.every((row) => !/TSD-CP002-DISC-01[56]/.test(`${row.stem} ${row.answerText}`)), "Internal QA authority leaked into frozen learner review");

console.log(JSON.stringify({
  status: "PASS",
  canonicalProblemId: "TSD-CP-002",
  sourceCandidates: TSD_CP002_SOURCE_CANDIDATES.length,
  frozenLearnerAuthorities: TSD_CP002_FROZEN_AUTHORITIES.length,
  internalQaAuthorities: TSD_CP002_INTERNAL_AUTHORITIES.length,
  approvedEnglishQuestions: review.length,
  permanentQlRange: "TSD-QL-024..TSD-QL-037",
  nextPermanentQlId: TSD_CP002_NEXT_PERMANENT_QL_ID,
  questionBankStored: 0,
  testEligible: 0,
  publiclyPublishable: 0,
}, null, 2));
