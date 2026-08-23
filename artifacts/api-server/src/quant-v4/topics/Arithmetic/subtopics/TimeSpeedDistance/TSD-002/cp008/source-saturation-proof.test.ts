import { TSD_CP004_FINAL_NEW_AUTHORITY_CANDIDATES } from "../../../TSD-001/cp004/final-ownership-candidate";
import { TSD_CP005_APPROVED_LEARNER_AUTHORITIES } from "../../../TSD-001/cp005/approved-authority-registry";
import { TSD_CP008_FINAL_NEW_AUTHORITY_CANDIDATES } from "./final-ownership-candidate";
import { TSD_CP008_FINAL_COUNTS, TSD_CP008_SOURCE_SATURATION_FINAL, TSD_CP008_SOURCE_SATURATION_POLICY } from "./source-saturation-final";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-008 source saturation proof failed: ${message}`);
}

assert(TSD_CP008_SOURCE_SATURATION_FINAL.length === 37, "all 37 discovery modes must remain accounted for");
assert(TSD_CP008_FINAL_COUNTS.learnerAuthorities === 9, "final learner authority count must be 9");
assert(TSD_CP008_FINAL_COUNTS.mergedModes === 7, "final merged mode count must be 7");
assert(TSD_CP008_FINAL_COUNTS.crossCheckpointHolds === 11, "cross-checkpoint holds must be 11");
assert(TSD_CP008_FINAL_COUNTS.representationHolds === 6, "representation holds must be 6");
assert(TSD_CP008_FINAL_COUNTS.internalQaModes === 4, "internal QA count must be 4");
assert(TSD_CP008_FINAL_NEW_AUTHORITY_CANDIDATES.length === 9, "final ownership candidate must expose 9 authorities");
assert(TSD_CP008_FINAL_NEW_AUTHORITY_CANDIDATES.every((entry) => entry.examRepresentations.length >= 4), "every retained authority needs at least four exam representations");
assert(TSD_CP008_FINAL_NEW_AUTHORITY_CANDIDATES.every((entry) => entry.executableInvariant.length >= 8), "every retained authority needs an executable invariant");
assert(TSD_CP008_SOURCE_SATURATION_POLICY.permanentQlCount === 0, "QL allocation must remain blocked during feasibility");
assert(TSD_CP008_SOURCE_SATURATION_POLICY.nextPermanentQl === "TSD-QL-095", "next available identity changed");
assert(!TSD_CP008_SOURCE_SATURATION_POLICY.questionStudioEnabled, "Question Studio opened before allocation/content freeze");
assert(TSD_CP008_SOURCE_SATURATION_POLICY.questionBankStatus === "NOT_STORED", "Question Bank opened");
assert(TSD_CP008_SOURCE_SATURATION_POLICY.testEligibility === "INELIGIBLE", "tests opened");
assert(!TSD_CP008_SOURCE_SATURATION_POLICY.publiclyPublishable, "public publication opened");
assert(TSD_CP008_SOURCE_SATURATION_POLICY.ambiguousMaximumOverlapRejected, "ambiguous maximum-overlap wording must stay rejected");

const cp004Keys = new Set(TSD_CP004_FINAL_NEW_AUTHORITY_CANDIDATES.map((entry) => entry.authorityKey));
const cp005Keys = new Set(TSD_CP005_APPROVED_LEARNER_AUTHORITIES.map((entry) => entry.authorityKey));
const crossHolds = TSD_CP008_SOURCE_SATURATION_FINAL.filter((entry) => entry.decision === "HOLD_CROSS_CHECKPOINT");
for (const entry of crossHolds) {
  if (entry.targetAuthority.startsWith("TSD_CP004:")) assert(cp004Keys.has(entry.targetAuthority.split(":")[1]!), `${entry.solveMode}: missing inherited CP004 target`);
  if (entry.targetAuthority.startsWith("TSD_CP005:")) assert(cp005Keys.has(entry.targetAuthority.split(":")[1]!), `${entry.solveMode}: missing inherited CP005 target`);
}

const retained = new Set(TSD_CP008_FINAL_NEW_AUTHORITY_CANDIDATES.map((entry) => entry.authorityKey));
for (const entry of TSD_CP008_SOURCE_SATURATION_FINAL.filter((candidate) => candidate.decision === "MERGE_CP008_AUTHORITY")) {
  assert(retained.has(entry.targetAuthority), `${entry.solveMode}: merge target is not retained`);
}

console.log("TSD-CP-008 SOURCE SATURATION PROOF: PASS");
console.log(JSON.stringify({
  discoveryModes: 37,
  provisionalAuthorities: 12,
  finalLearnerAuthorities: TSD_CP008_FINAL_COUNTS.learnerAuthorities,
  mergedModes: TSD_CP008_FINAL_COUNTS.mergedModes,
  crossCheckpointHolds: TSD_CP008_FINAL_COUNTS.crossCheckpointHolds,
  representationHolds: TSD_CP008_FINAL_COUNTS.representationHolds,
  internalQaModes: TSD_CP008_FINAL_COUNTS.internalQaModes,
  inheritedOwners: ["TSD-CP-004", "TSD-CP-005", "TSD-CP-012"],
  finiteLengthEssentialityRule: TSD_CP008_SOURCE_SATURATION_POLICY.finiteLengthEssentialityRule,
  permanentQlCount: 0,
  nextPermanentQl: TSD_CP008_SOURCE_SATURATION_POLICY.nextPermanentQl,
}, null, 2));
