import { convertSpeed } from "../foundation/units";
import { TSD_CP001_DISCOVERY_AUTHORITIES } from "./discovery-registry";
import {
  EQUIVALENT_SPEED_FINGERPRINT,
  SCALAR_SPEED_FINGERPRINT,
  isEquivalentSpeedFingerprint,
} from "./equivalent-speed-representation";
import {
  TSD_CP001_LEARNER_AUTHORITIES,
  generateCp001Candidate,
  generateCp001ReviewRows,
} from "./runtime";
import { formatExamNumber } from "./runtime-support";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const conversionAuthority = TSD_CP001_DISCOVERY_AUTHORITIES.find(
  (authority) => authority.solveMode === "convertSpeedUnit",
);
assert(conversionAuthority, "convertSpeedUnit authority is missing");
assert(conversionAuthority.provisionalId === "TSD-CP001-DISC-004", "Speed-conversion authority ID changed unexpectedly");
assert(TSD_CP001_DISCOVERY_AUTHORITIES.length === 25, "Equivalent representation created a new mathematical authority");
assert(TSD_CP001_LEARNER_AUTHORITIES.length === 23, "Equivalent representation changed the learner-authority boundary");

const reviewRows = generateCp001ReviewRows(3);
assert(reviewRows.length === 69, "Equivalent representation changed the review-row boundary");
const conversionRows = reviewRows.filter((row) => row.solveMode === "convertSpeedUnit");
assert(conversionRows.length === 3, "Expected three convertSpeedUnit review rows");
const equivalentReviewRows = conversionRows.filter((row) => isEquivalentSpeedFingerprint(row.mathematicalFingerprint));
const scalarReviewRows = conversionRows.filter((row) => row.mathematicalFingerprint.includes(SCALAR_SPEED_FINGERPRINT));
assert(equivalentReviewRows.length === 1, "Review must contain exactly one equivalent-speed option-set row");
assert(scalarReviewRows.length === 2, "Review must retain exactly two scalar speed-conversion rows");

const reviewEquivalent = equivalentReviewRows[0];
assert(reviewEquivalent.input.solveMode === "convertSpeedUnit", "Equivalent row escaped the speed-conversion authority");
assert(reviewEquivalent.validation.valid, `Equivalent review row is invalid: ${reviewEquivalent.validation.errors.join("; ")}`);
assert(reviewEquivalent.answerText === reviewEquivalent.options[reviewEquivalent.correctIndex], "Equivalent answer key is misaligned");
assert(reviewEquivalent.options.every((option) => /m\/s/.test(option) && /km\/h/.test(option) && /m\/min/.test(option)), "Equivalent options do not compare all three required units");
assert(reviewEquivalent.answerText.split(" = ").length === 3, "Correct equivalent option is not a three-unit equality");

const metresPerSecond = convertSpeed(reviewEquivalent.input.value, reviewEquivalent.input.from, "MPS");
const kilometresPerHour = convertSpeed(reviewEquivalent.input.value, reviewEquivalent.input.from, "KMPH");
const metresPerMinute = convertSpeed(reviewEquivalent.input.value, reviewEquivalent.input.from, "M_PER_MINUTE");
const expectedTriplet = `${formatExamNumber(metresPerSecond)} m/s = ${formatExamNumber(kilometresPerHour)} km/h = ${formatExamNumber(metresPerMinute)} m/min`;
assert(reviewEquivalent.answerText === expectedTriplet, `Equivalent answer is mathematically wrong: expected ${expectedTriplet}, received ${reviewEquivalent.answerText}`);
assert(reviewEquivalent.explanation.stepByStepSolution.length >= 6 && reviewEquivalent.explanation.stepByStepSolution.length <= 7, "Equivalent explanation is not concise");
assert(reviewEquivalent.explanation.optionAnalysis.length === 4, "Equivalent row does not analyse all four options");
assert(reviewEquivalent.explanation.optionAnalysis.every((option) => option.reason.includes(option.text)), "Equivalent option analysis is not value-specific");
assert(reviewEquivalent.explanation.optionAnalysis.every((option) => /=/.test(option.reason)), "Equivalent option analysis lacks a numerical equality/check");

const mixedScaleTrap = reviewEquivalent.explanation.optionAnalysis.find(
  (option) => option.misconceptionId === "MIX_UNCONVERTED_UNITS",
);
assert(mixedScaleTrap, "Equivalent row is missing the mixed-scale distractor");
assert(mixedScaleTrap.reason.includes(mixedScaleTrap.text), "Mixed-scale distractor reason does not name the selected option");
assert(/=/.test(mixedScaleTrap.reason), "Mixed-scale distractor has no numerical check");
assert(/m\/s|km\/h|m\/min|convert|unit|scale/i.test(mixedScaleTrap.reason), "Mixed-scale distractor does not explain the unit/conversion error");
assert(!/obtained by|nearby value|careful check/i.test(mixedScaleTrap.reason), "Mixed-scale distractor diagnosis became generic");
assert(reviewEquivalent.mathematicalFingerprint.includes(EQUIVALENT_SPEED_FINGERPRINT), "Equivalent representation marker is missing");

let equivalentCandidateCount = 0;
let scalarCandidateCount = 0;
let exactTripletSeen = false;
for (let index = 0; index < 600; index += 1) {
  const candidate = generateCp001Candidate(
    conversionAuthority.provisionalId,
    `equivalent-proof:${conversionAuthority.provisionalId}:${index}`,
  );
  assert(candidate.validation.valid, `Speed representation candidate ${index} is invalid: ${candidate.validation.errors.join("; ")}`);
  if (isEquivalentSpeedFingerprint(candidate.mathematicalFingerprint)) {
    equivalentCandidateCount += 1;
    assert(candidate.input.solveMode === "convertSpeedUnit", `Equivalent candidate ${index} has wrong input mode`);
    const expectedMps = convertSpeed(candidate.input.value, candidate.input.from, "MPS");
    const expectedKmph = convertSpeed(candidate.input.value, candidate.input.from, "KMPH");
    const expectedMpm = convertSpeed(candidate.input.value, candidate.input.from, "M_PER_MINUTE");
    const expected = `${formatExamNumber(expectedMps)} m/s = ${formatExamNumber(expectedKmph)} km/h = ${formatExamNumber(expectedMpm)} m/min`;
    assert(candidate.answerText === expected, `Equivalent candidate ${index} has an incorrect triplet`);
    if (candidate.answerText === "25 m/s = 90 km/h = 1500 m/min") exactTripletSeen = true;
  } else {
    scalarCandidateCount += 1;
    assert(candidate.mathematicalFingerprint.includes(SCALAR_SPEED_FINGERPRINT), "Scalar conversion marker is missing");
  }
}

assert(equivalentCandidateCount > 0, "No equivalent-speed representation was generated");
assert(scalarCandidateCount > 0, "Equivalent representation displaced all scalar conversions");
assert(exactTripletSeen, "The required 25 m/s = 90 km/h = 1500 m/min case was not generated");

console.log(JSON.stringify({
  status: "PASS",
  decision: "REPRESENTATION_VARIANT_NOT_NEW_AUTHORITY",
  provisionalAuthorityCount: TSD_CP001_DISCOVERY_AUTHORITIES.length,
  learnerFacingAuthorityCount: TSD_CP001_LEARNER_AUTHORITIES.length,
  reviewRowCount: reviewRows.length,
  conversionReviewRows: conversionRows.length,
  equivalentReviewRows: equivalentReviewRows.length,
  scalarConversionReviewRows: scalarReviewRows.length,
  generatedEquivalentCandidates: equivalentCandidateCount,
  generatedScalarCandidates: scalarCandidateCount,
  exactTripletVerified: "25 m/s = 90 km/h = 1500 m/min",
  preciseMixedScaleDiagnosis: true,
  permanentQlCount: 0,
}, null, 2));
