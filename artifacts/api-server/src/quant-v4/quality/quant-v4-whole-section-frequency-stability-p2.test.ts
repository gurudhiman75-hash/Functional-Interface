import assert from "node:assert/strict";

import { QUANT_V4_REGISTERED_PYQ_OBSERVATIONS } from "./quant-v4-pyq-observation-registry-p2";
import {
  QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
} from "./quant-v4-whole-section-frequency-calibration-p2";
import {
  QUANT_V4_CGL_TIER_I_STABILITY_P2_AUDIT_POLICY,
  QUANT_V4_WHOLE_SECTION_FREQUENCY_STABILITY_AUTHORITY,
  buildQuantV4WholeSectionFrequencyStabilityProfile,
  canPromoteQuantV4WholeSectionFrequencyFromStability,
} from "./quant-v4-whole-section-frequency-stability-p2";

function approx(actual: number, expected: number, tolerance = 1e-12): void {
  assert.ok(Math.abs(actual - expected) <= tolerance, `Expected ${actual} ≈ ${expected}`);
}

const profile = buildQuantV4WholeSectionFrequencyStabilityProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  sections: QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  wholeSectionPolicy: QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
  stabilityPolicy: QUANT_V4_CGL_TIER_I_STABILITY_P2_AUDIT_POLICY,
});

assert.equal(
  QUANT_V4_WHOLE_SECTION_FREQUENCY_STABILITY_AUTHORITY,
  "QUANT-V4-WHOLE-SECTION-FREQUENCY-STABILITY-P2",
);
assert.equal(profile.completeSectionCount, 8);
assert.equal(profile.completeQuestionCount, 200);
assert.equal(profile.wholeSectionProfile.evidenceStatus, "SECTION_FREQUENCY_CANDIDATE");
assert.deepEqual([...profile.wholeSectionProfile.blockers], []);
assert.equal(profile.wholeSectionProfile.packageCoverageCount, 27);
assert.equal(profile.status, "STABILITY_HOLD");
assert.deepEqual([...profile.blockers], [
  "BALANCED_YEAR_SAMPLE_BELOW_POLICY",
  "SINGLE_YEAR_SECTION_CONCENTRATION_HIGH",
  "SINGLE_DATE_SECTION_CONCENTRATION_HIGH",
  "CONCENTRATED_DATE_SUPPORT_LOSS_HIGH",
]);
assert.equal(profile.productionPromotionAuthorized, false);
assert.equal(canPromoteQuantV4WholeSectionFrequencyFromStability(profile), false);

// Year balance: six of eight sections are 2023; 2022 and 2024 have one section each.
assert.equal(profile.distinctYearCount, 3);
assert.equal(profile.balancedYearCount, 1);
assert.equal(profile.maxSingleYear, "2023");
approx(profile.maxSingleYearSectionShare, 6 / 8);
assert.deepEqual(
  profile.yearProfiles.map((year) => [year.year, year.sectionCount, year.questionCount, year.packageCoverageCount]),
  [
    ["2022", 1, 25, 17],
    ["2023", 6, 150, 27],
    ["2024", 1, 25, 14],
  ],
);
const year2023 = profile.yearProfiles.find((year) => year.year === "2023");
assert.ok(year2023);
assert.deepEqual(
  year2023.packageFrequencies.slice(0, 3).map((entry) => [entry.packageId, entry.questionCount]),
  [["TMW-001", 19], ["ALG-001", 18], ["TRG-001", 16]],
);
const year2024 = profile.yearProfiles.find((year) => year.year === "2024");
assert.equal(year2024?.packageFrequencies[0]?.packageId, "DI-001");
assert.equal(year2024?.packageFrequencies[0]?.questionCount, 4);

// Concentration of the current 200-question whole-section sample.
assert.equal(profile.top3QuestionCount, 67);
approx(profile.top3QuestionShare, 0.335);
assert.equal(profile.top5QuestionCount, 94);
approx(profile.top5QuestionShare, 0.47);
assert.equal(profile.top10QuestionCount, 146);
approx(profile.top10QuestionShare, 0.73);

// Leave-one-section-out: no single paper moves a package share by 2 percentage points,
// but rank order can move by four places because several mid/low-frequency packages are tied.
assert.equal(profile.leaveOneSectionOut.length, 8);
approx(profile.maxLeaveOneOutShareDeltaPoints, 10 / 7, 1e-10);
assert.equal(profile.maxLeaveOneOutRankMovement, 4);
const without2024 = profile.leaveOneSectionOut.find(
  (entry) => entry.paperId === "SSC-CGL-2024-TIER-I-2024-09-09-S1",
);
assert.ok(without2024);
assert.equal(without2024.remainingQuestionCount, 175);
assert.equal(without2024.remainingPackageCoverageCount, 27);
assert.equal(without2024.maxAbsoluteShareDeltaPackageId, "DI-001");
approx(without2024.maxAbsoluteShareDeltaPoints, 10 / 7, 1e-10);

// The highest same-date cluster is 25 Jul 2023: three sections / 75 questions.
// Removing it leaves four packages unsupported and shifts DI-001 by exactly 2 percentage points.
assert.equal(profile.maxSingleDate, "2023-07-25");
approx(profile.maxSingleDateSectionShare, 3 / 8);
const window = profile.concentratedDateSensitivity;
assert.ok(window);
assert.equal(window.heldDate, "2023-07-25");
assert.equal(window.removedSectionCount, 3);
approx(window.removedSectionShare, 3 / 8);
assert.equal(window.removedQuestionCount, 75);
assert.equal(window.remainingSectionCount, 5);
assert.equal(window.remainingQuestionCount, 125);
assert.equal(window.remainingPackageCoverageCount, 23);
assert.deepEqual([...window.packagesLostFromSupport], ["DI-004", "PCT-001", "PCT-005", "SRI-002"]);
assert.equal(window.maxAbsoluteShareDeltaPackageId, "DI-001");
approx(window.maxAbsoluteShareDeltaPoints, 2);

// Reaching a stability candidate under deliberately relaxed audit thresholds still cannot
// promote production weights unless the separate authorization gate is explicitly opened.
const relaxedPolicy = Object.freeze({
  ...QUANT_V4_CGL_TIER_I_STABILITY_P2_AUDIT_POLICY,
  minBalancedYearCount: 1,
  maxSingleYearSectionShare: 1,
  maxSingleDateSectionShare: 1,
  maxLeaveOneOutShareDeltaPoints: 100,
  maxConcentratedDateRemovalShareDeltaPoints: 100,
  maxPackagesLostOnConcentratedDateRemoval: 100,
  productionPromotionAuthorized: false,
});
const candidate = buildQuantV4WholeSectionFrequencyStabilityProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  sections: QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  wholeSectionPolicy: QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
  stabilityPolicy: relaxedPolicy,
});
assert.equal(candidate.status, "STABILITY_CANDIDATE");
assert.deepEqual([...candidate.blockers], []);
assert.equal(canPromoteQuantV4WholeSectionFrequencyFromStability(candidate), false);

const explicitlyAuthorized = buildQuantV4WholeSectionFrequencyStabilityProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  sections: QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  wholeSectionPolicy: QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
  stabilityPolicy: Object.freeze({ ...relaxedPolicy, productionPromotionAuthorized: true }),
});
assert.equal(explicitlyAuthorized.status, "STABILITY_CANDIDATE");
assert.equal(canPromoteQuantV4WholeSectionFrequencyFromStability(explicitlyAuthorized), true);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_WHOLE_SECTION_FREQUENCY_STABILITY_P2",
  authority: QUANT_V4_WHOLE_SECTION_FREQUENCY_STABILITY_AUTHORITY,
  completeSections: profile.completeSectionCount,
  completeQuestions: profile.completeQuestionCount,
  distinctYears: profile.distinctYearCount,
  balancedYears: profile.balancedYearCount,
  maxSingleYear: profile.maxSingleYear,
  maxSingleYearSectionShare: profile.maxSingleYearSectionShare,
  maxSingleDate: profile.maxSingleDate,
  maxSingleDateSectionShare: profile.maxSingleDateSectionShare,
  maxLeaveOneOutShareDeltaPoints: profile.maxLeaveOneOutShareDeltaPoints,
  maxLeaveOneOutRankMovement: profile.maxLeaveOneOutRankMovement,
  concentratedDateSensitivity: profile.concentratedDateSensitivity,
  blockers: profile.blockers,
  productionPromotionAuthorized: profile.productionPromotionAuthorized,
}));
