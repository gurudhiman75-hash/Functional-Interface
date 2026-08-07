import assert from "node:assert/strict";
import { SAP_CP003_EXAM_READINESS_POLICY } from "./exam-readiness-policy";
import { isTerminating, parseNumericLiteral } from "./exact";
import { generateSapCp003Package } from "./editorial-runtime";
import { SAP_CP003_PERMANENT_STATE } from "./permanent-runtime/runtime";

function frameSignature(stem: string): string {
  return stem
    .replace(/\d+(?:\.\d+)?%/g, "PERCENT")
    .replace(/\d+\/\d+/g, "FRACTION")
    .replace(/\d+(?:\.\d+)?/g, "NUMBER");
}

const placementPrototype = "SAP-CP003-PROT-SELECT-CORRECT-DECIMAL-PLACEMENT" as const;
let placementPackages = 0;
for (let seed = 1; seed <= 100; seed += 1) {
  const pkg = generateSapCp003Package(placementPrototype, seed);
  placementPackages += 1;
  const stemMatch = pkg.stem.match(/^Ignoring decimal points, (\d+) × (\d+) = (\d+)\./);
  assert.ok(stemMatch, `${placementPrototype}/${seed}: missing visible whole-number multiplication.`);
  const [, leftDigits, rightDigits, productDigits] = stemMatch!;
  assert.doesNotMatch(leftDigits!, /^0\d/, `${placementPrototype}/${seed}: left factor contains hidden leading zeros.`);
  assert.doesNotMatch(rightDigits!, /^0\d/, `${placementPrototype}/${seed}: right factor contains hidden leading zeros.`);
  assert.doesNotMatch(productDigits!, /^0\d/, `${placementPrototype}/${seed}: product contains hidden leading zeros.`);
  assert.ok(pkg.explanation.steps.some((step) => step.includes(`${leftDigits} × ${rightDigits} = ${productDigits}`)));
}

const decimalFractionPrototype = "SAP-CP003-PROT-DECIMAL-FRACTION-MIXED-EXPRESSION" as const;
const decimalFractionFrames = new Set<string>();
for (let seed = 1; seed <= 100; seed += 1) {
  const pkg = generateSapCp003Package(decimalFractionPrototype, seed);
  assert.match(pkg.stem, /\d+\.\d+/);
  assert.match(pkg.stem, /\d+\/\d+/);
  assert.equal(pkg.options.length, 4);
  assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4);
  assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer);
  const answer = parseNumericLiteral(pkg.canonicalAnswer);
  assert.ok(answer && isTerminating(answer), `${decimalFractionPrototype}/${seed}: answer must be terminating.`);
  assert.ok(pkg.options.filter((option) => !option.isCorrect).every((option) => option.analysis.length >= 25));
  decimalFractionFrames.add(frameSignature(pkg.stem));
}
assert.equal(decimalFractionFrames.size, 4);

const mixedPrototype = "SAP-CP003-PROT-MIXED-PERCENT-FRACTION-DECIMAL" as const;
const mixedFrameSignatures = new Set<string>();
let maximumMixedAnswerDenominator = 0n;
for (let seed = 1; seed <= 100; seed += 1) {
  const pkg = generateSapCp003Package(mixedPrototype, seed);
  assert.match(pkg.stem, /%/);
  assert.match(pkg.stem, /\d+\/\d+/);
  assert.match(pkg.stem, /\d+\.\d+/);
  assert.match(pkg.stem, /Give the answer as a reduced fraction/);
  assert.ok(pkg.explanation.steps.length >= 3);
  assert.equal(pkg.options.length, 4);
  assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4);
  assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer);
  const answer = parseNumericLiteral(pkg.canonicalAnswer);
  assert.ok(answer, `${mixedPrototype}/${seed}: answer is not an exact numeric value.`);
  maximumMixedAnswerDenominator = answer!.d > maximumMixedAnswerDenominator ? answer!.d : maximumMixedAnswerDenominator;
  assert.ok(answer!.d <= 8n, `${mixedPrototype}/${seed}: answer denominator ${answer!.d} is unnecessarily awkward.`);
  mixedFrameSignatures.add(frameSignature(pkg.stem));
}
assert.equal(mixedFrameSignatures.size, 4);

const fractionTargetPrototype = "SAP-CP003-PROT-CONVERT-TERMS-TO-FRACTIONS" as const;
const fractionTargetFrames = new Set<string>();
const fractionTargetPayloads = new Set<string>();
let maximumFractionTargetDenominator = 0n;
for (let seed = 1; seed <= 100; seed += 1) {
  const pkg = generateSapCp003Package(fractionTargetPrototype, seed);
  assert.match(pkg.stem, /%/);
  assert.match(pkg.stem, /\d+\/\d+/);
  assert.match(pkg.stem, /\d+\.\d+/);
  assert.match(pkg.stem, /Give the answer as a reduced fraction/);
  assert.ok(pkg.explanation.steps.length >= 2);
  const answer = parseNumericLiteral(pkg.canonicalAnswer);
  assert.ok(answer, `${fractionTargetPrototype}/${seed}: answer is not exact.`);
  maximumFractionTargetDenominator = answer!.d > maximumFractionTargetDenominator ? answer!.d : maximumFractionTargetDenominator;
  assert.ok(answer!.d <= 40n, `${fractionTargetPrototype}/${seed}: answer denominator ${answer!.d} is too cumbersome.`);
  fractionTargetFrames.add(frameSignature(pkg.stem));
  fractionTargetPayloads.add(pkg.canonicalPayloadKey);
}
assert.equal(fractionTargetFrames.size, 4);
assert.ok(fractionTargetPayloads.size >= 24);

const complementaryPolicy = SAP_CP003_EXAM_READINESS_POLICY["SAP-CP003-PROT-COMPLEMENTARY-PERCENTAGE-EXPRESSION"];
assert.equal(complementaryPolicy.mockUse, "SSC_ELIGIBLE");
assert.equal(complementaryPolicy.structuralRisk, "MEDIUM");
assert.match(complementaryPolicy.mockWeightGuidance, /diversified/i);

const successivePolicy = SAP_CP003_EXAM_READINESS_POLICY["SAP-CP003-PROT-SUCCESSIVE-PERCENT-FACTORS"];
assert.equal(successivePolicy.mockUse, "SSC_AND_BANKING_ELIGIBLE");
assert.equal(successivePolicy.structuralRisk, "MEDIUM");
assert.match(successivePolicy.mockWeightGuidance, /broadened/i);

const decimalFractionPolicy = SAP_CP003_EXAM_READINESS_POLICY[decimalFractionPrototype];
assert.equal(decimalFractionPolicy.mockUse, "SSC_AND_BANKING_ELIGIBLE");
assert.equal(decimalFractionPolicy.structuralRisk, "MEDIUM");

const mixedThreeRepresentationPolicy = SAP_CP003_EXAM_READINESS_POLICY[mixedPrototype];
assert.equal(mixedThreeRepresentationPolicy.mockUse, "SSC_AND_BANKING_ELIGIBLE");
assert.equal(mixedThreeRepresentationPolicy.structuralRisk, "MEDIUM");
assert.match(mixedThreeRepresentationPolicy.mockWeightGuidance, /denominators no greater than eight/i);

const fractionTargetPolicy = SAP_CP003_EXAM_READINESS_POLICY[fractionTargetPrototype];
assert.equal(fractionTargetPolicy.mockUse, "SSC_AND_BANKING_ELIGIBLE");
assert.equal(fractionTargetPolicy.structuralRisk, "MEDIUM");

const policies = Object.values(SAP_CP003_EXAM_READINESS_POLICY);
assert.equal(policies.filter((policy) => policy.mockUse === "REMEDIATION_PENDING").length, 0);
assert.deepEqual(
  [...new Set(policies.map((policy) => policy.mockUse))].sort(),
  ["FOUNDATION_ONLY", "SSC_AND_BANKING_ELIGIBLE", "SSC_ELIGIBLE"].sort(),
);

assert.equal(SAP_CP003_PERMANENT_STATE.permanentQlRange, "SAP-QL-034..SAP-QL-052");
assert.equal(SAP_CP003_PERMANENT_STATE.nextAvailableQlId, "SAP-QL-053");
assert.equal(SAP_CP003_PERMANENT_STATE.questionAndAnswerReview, "REOPENED_STRUCTURAL_REMEDIATION_V2");
assert.equal(SAP_CP003_PERMANENT_STATE.englishExplanationFreeze, "BLOCKED_PENDING_RENEWED_QA_APPROVAL");
assert.equal(SAP_CP003_PERMANENT_STATE.active, false);
assert.equal(SAP_CP003_PERMANENT_STATE.questionStudioDiscoverable, false);
assert.equal(SAP_CP003_PERMANENT_STATE.testEligible, false);

console.log(JSON.stringify({
  status: "PASS_SAP_CP003_STRUCTURAL_V2_PRESENTATION_AUTHORITY",
  decimalPlacementPackagesChecked: placementPackages,
  hiddenLeadingZeroDefects: 0,
  decimalFractionFrameCount: decimalFractionFrames.size,
  mixedRepresentationFrameCount: mixedFrameSignatures.size,
  maximumMixedAnswerDenominator: maximumMixedAnswerDenominator.toString(),
  fractionTargetFrameCount: fractionTargetFrames.size,
  fractionTargetUniquePayloads: fractionTargetPayloads.size,
  maximumFractionTargetDenominator: maximumFractionTargetDenominator.toString(),
  complementaryMockUse: complementaryPolicy.mockUse,
  successivePercentageMockUse: successivePolicy.mockUse,
  remediationPendingPolicyCount: 0,
  permanentQlRange: SAP_CP003_PERMANENT_STATE.permanentQlRange,
  nextAvailableQlId: SAP_CP003_PERMANENT_STATE.nextAvailableQlId,
  explanationFreeze: SAP_CP003_PERMANENT_STATE.englishExplanationFreeze,
  lifecycle: "INACTIVE",
}, null, 2));
