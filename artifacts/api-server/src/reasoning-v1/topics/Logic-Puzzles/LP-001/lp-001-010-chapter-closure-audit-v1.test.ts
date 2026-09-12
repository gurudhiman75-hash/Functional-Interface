import assert from "node:assert/strict";
import { LP_001_010_PERMANENT_QL_REGISTRY_V1 } from "./lp-001-010-permanent-ql-registry-v1.ts";
import { LP_001_010_CHAPTER_CLOSURE_AUDIT_V1 } from "./lp-001-010-chapter-closure-audit-v1.ts";

assert.equal(LP_001_010_CHAPTER_CLOSURE_AUDIT_V1.status, "SOURCE_SATURATION_REVIEW_CANDIDATE");
assert.deepEqual(LP_001_010_CHAPTER_CLOSURE_AUDIT_V1.coveredPackages, [
  "LP-001", "LP-002", "LP-003", "LP-004", "LP-005",
  "LP-006", "LP-007", "LP-008", "LP-009", "LP-010",
]);
assert.equal(LP_001_010_CHAPTER_CLOSURE_AUDIT_V1.permanentQlCount, 40);
assert.deepEqual(LP_001_010_CHAPTER_CLOSURE_AUDIT_V1.permanentQlRange, ["LP-QL-001", "LP-QL-040"]);
assert.equal(LP_001_010_CHAPTER_CLOSURE_AUDIT_V1.nextAvailableQlId, "LP-QL-041");
assert.equal(LP_001_010_CHAPTER_CLOSURE_AUDIT_V1.nextQlAllocated, false);
assert.equal(LP_001_010_PERMANENT_QL_REGISTRY_V1.permanentQlIds.includes("LP-QL-041"), false);
assert.equal(new Set(LP_001_010_PERMANENT_QL_REGISTRY_V1.permanentQlIds).size, 40);
assert.deepEqual(LP_001_010_CHAPTER_CLOSURE_AUDIT_V1.excludedOwnership, {
  FLOOR_FLAT: "REAS-FLR",
  LINEAR_SEATING: "REAS-LAR",
  CIRCULAR_SEATING: "REAS-CAR",
  SQUARE_RECTANGULAR_SEATING: "REAS-SQR",
  BLOOD_RELATIONS: "REAS-BLR",
  INPUT_OUTPUT: "REAS-INP",
  GAMES_TOURNAMENT: "REAS-GAM",
});
assert.equal(LP_001_010_CHAPTER_CLOSURE_AUDIT_V1.invariants.noCosmeticQlAllocation, true);
assert.equal(LP_001_010_CHAPTER_CLOSURE_AUDIT_V1.invariants.noCrossChapterOwnershipLeakage, true);
assert.equal(LP_001_010_CHAPTER_CLOSURE_AUDIT_V1.invariants.lpQl041RemainsUnallocated, true);

console.log("Logic Puzzles chapter-closure audit passed: LP-001..010 cover the governed REAS-PUZ source taxonomy; LP-QL-041 remains intentionally unallocated.");
