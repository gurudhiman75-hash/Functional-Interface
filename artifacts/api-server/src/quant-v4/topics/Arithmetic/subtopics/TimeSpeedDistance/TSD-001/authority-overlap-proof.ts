import {
  TSD_AUTHORITY_AUDIT_PROJECTED_COUNTS,
  TSD_AUTHORITY_AUDIT_REQUIRED_REPRESENTATIONS,
  TSD_CROSS_QL_AUTHORITY_AUDIT,
} from "./authority-overlap-audit";
import { TSD_CP001_LEARNER_AUTHORITIES, TSD_CP001_NON_LEARNER_MODES } from "./cp001/runtime";
import { TSD_CP002_INTERNAL_AUTHORITIES, TSD_CP002_LEARNER_AUTHORITIES } from "./cp002/discovery-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const requiredQlIds = [
  "TSD-QL-017",
  "TSD-QL-018",
  "TSD-QL-029",
  "TSD-QL-032",
  "TSD-QL-033",
  "TSD-QL-034",
  "TSD-QL-035",
] as const;

assert(TSD_CROSS_QL_AUTHORITY_AUDIT.length === requiredQlIds.length, "Unexpected cross-QL audit record count");
assert(new Set(TSD_CROSS_QL_AUTHORITY_AUDIT.map((entry) => entry.currentQlId)).size === requiredQlIds.length, "Duplicate current QL in authority audit");
for (const qlId of requiredQlIds) {
  assert(TSD_CROSS_QL_AUTHORITY_AUDIT.some((entry) => entry.currentQlId === qlId), `${qlId}: missing overlap decision`);
}

const sourceOwners = new Map<string, string[]>();
for (const record of TSD_CROSS_QL_AUTHORITY_AUDIT) {
  assert(record.implementationStatus === "DECIDED_NOT_IMPLEMENTED", `${record.currentQlId}: implementation status is premature`);
  assert(record.permanentIdsAssigned === false, `${record.currentQlId}: permanent ID was assigned before implementation proof`);
  assert(record.targetAuthorityKeys.length > 0, `${record.currentQlId}: no target authority key`);
  assert(record.sourceCandidates.length > 0, `${record.currentQlId}: no source evidence`);
  assert(record.essentialOperation.trim().length > 20, `${record.currentQlId}: essential operation is not documented`);
  assert(record.reason.trim().length > 40, `${record.currentQlId}: audit rationale is incomplete`);
  for (const source of record.sourceCandidates) {
    sourceOwners.set(source, [...(sourceOwners.get(source) ?? []), record.currentQlId]);
  }
}
assert([...sourceOwners.values()].every((owners) => owners.length === 1), "An audited source candidate has multiple final owners");

const ql17 = TSD_CROSS_QL_AUTHORITY_AUDIT.find((entry) => entry.currentQlId === "TSD-QL-017")!;
const ql18 = TSD_CROSS_QL_AUTHORITY_AUDIT.find((entry) => entry.currentQlId === "TSD-QL-018")!;
const ql29 = TSD_CROSS_QL_AUTHORITY_AUDIT.find((entry) => entry.currentQlId === "TSD-QL-029")!;
const ql32 = TSD_CROSS_QL_AUTHORITY_AUDIT.find((entry) => entry.currentQlId === "TSD-QL-032")!;
const ql33 = TSD_CROSS_QL_AUTHORITY_AUDIT.find((entry) => entry.currentQlId === "TSD-QL-033")!;
const ql34 = TSD_CROSS_QL_AUTHORITY_AUDIT.find((entry) => entry.currentQlId === "TSD-QL-034")!;
const ql35 = TSD_CROSS_QL_AUTHORITY_AUDIT.find((entry) => entry.currentQlId === "TSD-QL-035")!;

assert(ql17.decision === "KEEP_DISTINCT" && ql17.targetAuthorityKeys.length === 1, "QL-017 must remain a hidden-reference-rate distance authority");
assert(ql18.decision === "KEEP_DISTINCT" && ql18.targetAuthorityKeys.length === 1, "QL-018 must remain a hidden-reference-rate time authority");
assert(ql32.decision === "KEEP_DISTINCT" && ql32.targetAuthorityKeys[0] === "roundTripLegTimeSum", "QL-032 multi-leg time sum was incorrectly merged into direct time");
assert(ql33.decision === "MERGE_AS_REPRESENTATION" && ql33.targetAuthorityKeys[0].startsWith("distanceFromSpeedAndTime"), "QL-033 must merge into direct distance as an effective-speed representation");
assert(ql29.decision === "SPLIT_BY_EQUATION" && ql29.targetAuthorityKeys.length === 2, "QL-029 must split distance and time shares");
assert(ql34.decision === "KEEP_PARAMETERIZED" && ql34.targetAuthorityKeys.length === 1, "QL-034 must retain one simultaneous-equation authority");
assert(ql35.decision === "SPLIT_BY_EQUATION" && ql35.targetAuthorityKeys.length === 2, "QL-035 must split distance and time ratios");

assert(TSD_AUTHORITY_AUDIT_REQUIRED_REPRESENTATIONS.referenceTripDistanceAtChangedConditions.includes("CHANGED_SPEED"), "QL-017 changed-speed representation is not required");
assert(TSD_AUTHORITY_AUDIT_REQUIRED_REPRESENTATIONS.referenceTripTimeAtChangedConditions.includes("CHANGED_SPEED_SAME_DISTANCE"), "QL-018 changed-speed representation is not required");
assert(TSD_AUTHORITY_AUDIT_REQUIRED_REPRESENTATIONS.segmentAllocationFromTotalsAndSpeeds.length === 4, "QL-034 requested-quantity coverage is incomplete");

assert(TSD_CP001_LEARNER_AUTHORITIES.length === 23, "Unexpected current CP-001 learner authority count");
assert(TSD_CP002_LEARNER_AUTHORITIES.length === 14, "Unexpected current CP-002 learner authority count");
assert(TSD_CP001_NON_LEARNER_MODES.size === 2 && TSD_CP002_INTERNAL_AUTHORITIES.length === 2, "Internal QA boundary changed");

const projectedCp002 = TSD_CP002_LEARNER_AUTHORITIES.length
  - 1 // QL-033 merges into QL-001.
  + 1 // QL-029 one current authority becomes two.
  + 1; // QL-035 one current authority becomes two.
assert(projectedCp002 === 15, "Projected CP-002 learner count is not 15");
assert(TSD_AUTHORITY_AUDIT_PROJECTED_COUNTS.cp001LearnerAuthorities === 23, "Projected CP-001 count changed unexpectedly");
assert(TSD_AUTHORITY_AUDIT_PROJECTED_COUNTS.cp002LearnerAuthorities === projectedCp002, "Projected CP-002 count does not match audit arithmetic");
assert(TSD_AUTHORITY_AUDIT_PROJECTED_COUNTS.combinedLearnerAuthorities === 38, "Projected combined learner count is not 38");
assert(TSD_AUTHORITY_AUDIT_PROJECTED_COUNTS.internalQaAuthorities === 4, "Projected internal QA count is not 4");
assert(TSD_AUTHORITY_AUDIT_PROJECTED_COUNTS.combinedMathematicalAuthorities === 42, "Projected mathematical-authority count is not 42");
assert(TSD_AUTHORITY_AUDIT_PROJECTED_COUNTS.permanentIdsAssigned === 0, "Permanent IDs must remain unassigned during the audit stage");

console.log(JSON.stringify({
  status: "PASS",
  phase: "CROSS_QL_AUTHORITY_AUDIT",
  auditedCurrentQlMappings: TSD_CROSS_QL_AUTHORITY_AUDIT.length,
  auditedSourceCandidates: sourceOwners.size,
  decisions: Object.fromEntries(TSD_CROSS_QL_AUTHORITY_AUDIT.map((entry) => [entry.currentQlId, entry.decision])),
  projectedCp001LearnerAuthorities: 23,
  projectedCp002LearnerAuthorities: 15,
  projectedCombinedLearnerAuthorities: 38,
  projectedInternalQaAuthorities: 4,
  projectedCombinedMathematicalAuthorities: 42,
  permanentIdsAssigned: 0,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
