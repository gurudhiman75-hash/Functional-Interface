import assert from "node:assert/strict";
import { SAP_CP003_EXAM_READINESS_POLICY } from "./exam-readiness-policy";
import { generateSapCp003Package } from "./editorial-runtime";
import { SAP_CP003_PERMANENT_STATE } from "./permanent-runtime/runtime";

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

const complementaryPolicy = SAP_CP003_EXAM_READINESS_POLICY["SAP-CP003-PROT-COMPLEMENTARY-PERCENTAGE-EXPRESSION"];
assert.equal(complementaryPolicy.mockUse, "SSC_ELIGIBLE");
assert.equal(complementaryPolicy.structuralRisk, "MEDIUM");
assert.match(complementaryPolicy.mockWeightGuidance, /diversified/i);

const successivePolicy = SAP_CP003_EXAM_READINESS_POLICY["SAP-CP003-PROT-SUCCESSIVE-PERCENT-FACTORS"];
assert.equal(successivePolicy.mockUse, "SSC_AND_BANKING_ELIGIBLE");
assert.equal(successivePolicy.structuralRisk, "MEDIUM");
assert.match(successivePolicy.mockWeightGuidance, /broadened/i);

const mixedThreeRepresentationPolicy = SAP_CP003_EXAM_READINESS_POLICY["SAP-CP003-PROT-MIXED-PERCENT-FRACTION-DECIMAL"];
assert.equal(mixedThreeRepresentationPolicy.mockUse, "REMEDIATION_PENDING");
assert.equal(mixedThreeRepresentationPolicy.structuralRisk, "HIGH");

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
  complementaryMockUse: complementaryPolicy.mockUse,
  successivePercentageMockUse: successivePolicy.mockUse,
  mixedThreeRepresentationMockUse: mixedThreeRepresentationPolicy.mockUse,
  permanentQlRange: SAP_CP003_PERMANENT_STATE.permanentQlRange,
  nextAvailableQlId: SAP_CP003_PERMANENT_STATE.nextAvailableQlId,
  explanationFreeze: SAP_CP003_PERMANENT_STATE.englishExplanationFreeze,
  lifecycle: "INACTIVE",
}, null, 2));
