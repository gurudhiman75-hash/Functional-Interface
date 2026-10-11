import { add, rational } from "../../TSD-001/foundation/rational";
import { TSD_CP007_AUTHORITY_APPROVAL } from "./approved-authority-registry";
import { generateCp007ExecutableAuditCases } from "./executable-generator";
import { TSD_CP007_EXECUTABLE_AUTHORITIES, type TsdCp007ExecutableSolution } from "./executable-types";
import { independentlyVerifyCp007Authority } from "./executable-verifier";
import { TSD_CP007_NEXT_PERMANENT_QL_ID, TSD_CP007_PERMANENT_QL_IDS } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-007 executable proof failed: ${message}`);
}

function tamper(solution: TsdCp007ExecutableSolution): TsdCp007ExecutableSolution {
  if (solution.answerKind === "COUNT") {
    return Object.freeze({ ...solution, count: (solution.count ?? 0n) + 1n });
  }
  return Object.freeze({ ...solution, value: add(solution.value ?? rational(0), rational(1)) });
}

const cases = generateCp007ExecutableAuditCases(12);
assert(TSD_CP007_EXECUTABLE_AUTHORITIES.length === 11, "expected 11 executable authorities");
assert(cases.length === 132, `expected 132 audit cases, found ${cases.length}`);
assert(new Set(cases.map((entry) => entry.seed)).size === 132, "audit seeds are not unique");
assert(new Set(cases.map((entry) => entry.authorityKey)).size === 11, "not every approved authority is exercised");
assert(new Set(cases.map((entry) => entry.permanentQlId)).size === 11, "not every permanent QL is exercised");
assert(TSD_CP007_PERMANENT_QL_IDS.length === 11, "permanent QL registry changed");
assert(TSD_CP007_NEXT_PERMANENT_QL_ID === "TSD-QL-095", "next free QL changed");

let independentChecks = 0;
let tamperRejections = 0;
for (const generated of cases) {
  assert(generated.verification.valid, `${generated.seed}: generator emitted an independently invalid case`);
  independentChecks += 1;
  assert(generated.lifecycle.permanentQlAllocated === true, `${generated.seed}: permanent identity must be allocated`);
  assert(generated.lifecycle.englishFreezeStatus === "UNFROZEN", `${generated.seed}: English content must remain unfrozen`);
  assert(generated.lifecycle.questionStudioEnabled === false, `${generated.seed}: Question Studio must remain disabled`);
  assert(generated.lifecycle.questionBankStatus === "NOT_STORED", `${generated.seed}: question-bank storage is premature`);
  assert(generated.lifecycle.testEligibility === "INELIGIBLE", `${generated.seed}: test eligibility is premature`);
  assert(generated.lifecycle.publiclyPublishable === false, `${generated.seed}: public publication is premature`);

  const rejected = independentlyVerifyCp007Authority(generated.authorityKey, generated.input, tamper(generated.solution));
  assert(!rejected.valid, `${generated.seed}: deliberately tampered answer was accepted`);
  tamperRejections += 1;
}

const objectEvidenceModes = new Set(cases
  .filter((entry) => entry.authorityKey === "fixedObjectLengthFromCrossingEvidence")
  .map((entry) => entry.input.objectLengthEvidenceMode));
assert(objectEvidenceModes.has("DIRECT_SPEED") && objectEvidenceModes.has("PAIRED_POINT_TIME"), "object-length authority does not cover both evidence modes");

const occupancyTargets = new Set(cases
  .filter((entry) => entry.authorityKey === "fullOccupancyDuration")
  .map((entry) => entry.input.occupancyTarget));
assert(occupancyTargets.has("DURATION") && occupancyTargets.has("OBJECT_LENGTH"), "full-occupancy authority does not cover forward and inverse targets");

const timelineIntervalKinds = new Set(cases
  .filter((entry) => entry.authorityKey === "trainCrossingEventTimeline")
  .map((entry) => entry.input.timelineIntervalKind));
assert(timelineIntervalKinds.size === 3, "timeline authority must exercise point crossing, full crossing and full occupancy intervals");
const timelineTargets = new Set(cases
  .filter((entry) => entry.authorityKey === "trainCrossingEventTimeline")
  .map((entry) => entry.input.timelineTarget));
assert(timelineTargets.has("FORWARD_CLOCK") && timelineTargets.has("BACKWARD_CLOCK"), "timeline authority must exercise forward and backward clock reconstruction");

const spacingTargets = new Set(cases
  .filter((entry) => entry.authorityKey === "fixedSpacingPointCount")
  .map((entry) => entry.input.spacingTarget));
assert(spacingTargets.size === 3, "fixed-spacing authority must exercise count, spacing and speed targets");
const endpointConventions = new Set(cases
  .filter((entry) => entry.authorityKey === "fixedSpacingPointCount")
  .map((entry) => entry.input.includeStartingPoint));
assert(endpointConventions.has(true) && endpointConventions.has(false), "fixed-spacing authority must exercise both endpoint conventions");

assert(TSD_CP007_AUTHORITY_APPROVAL.questionStudioEnabled === false, "Question Studio must stay closed at executable arithmetic gate");
assert(TSD_CP007_AUTHORITY_APPROVAL.englishFreezeStatus === "UNFROZEN", "English freeze must remain pending");

console.log("TSD-CP-007 EXECUTABLE AUTHORITY PROOF: PASS");
console.log(JSON.stringify({
  approvedAuthorities: TSD_CP007_EXECUTABLE_AUTHORITIES.length,
  permanentQlRange: `${TSD_CP007_PERMANENT_QL_IDS[0]}..${TSD_CP007_PERMANENT_QL_IDS[10]}`,
  nextPermanentQl: TSD_CP007_NEXT_PERMANENT_QL_ID,
  generatedAuditCases: cases.length,
  casesPerAuthority: 12,
  independentVerifierChecks: independentChecks,
  deliberateTamperRejections: tamperRejections,
  objectEvidenceModes: [...objectEvidenceModes],
  occupancyTargets: [...occupancyTargets],
  timelineIntervalKinds: [...timelineIntervalKinds],
  timelineTargets: [...timelineTargets],
  spacingTargets: [...spacingTargets],
  endpointConventions: [...endpointConventions],
  englishFreezeStatus: TSD_CP007_AUTHORITY_APPROVAL.englishFreezeStatus,
  questionStudioEnabled: TSD_CP007_AUTHORITY_APPROVAL.questionStudioEnabled,
}, null, 2));
