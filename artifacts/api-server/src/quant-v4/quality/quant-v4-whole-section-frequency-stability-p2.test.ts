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
assert.equal(profile.completeSectionCount, 11);
assert.equal(profile.completeQuestionCount, 275);
assert.equal(profile.wholeSectionProfile.evidenceStatus, "SECTION_FREQUENCY_CANDIDATE");
assert.deepEqual([...profile.wholeSectionProfile.blockers], []);
assert.equal(profile.wholeSectionProfile.packageCoverageCount, 28);
assert.equal(profile.status, "STABILITY_HOLD");
assert.deepEqual([...profile.blockers], [
  "SINGLE_DATE_SECTION_CONCENTRATION_HIGH",
  "CONCENTRATED_DATE_SUPPORT_LOSS_HIGH",
]);
assert.equal(profile.productionPromotionAuthorized, false);
assert.equal(canPromoteQuantV4WholeSectionFrequencyFromStability(profile), false);

// Wave 11 adds a third independent 2024 section. Year balance improves further,
// but the three sections from 25 Jul 2023 still exceed the conservative 25% date cap.
assert.equal(profile.distinctYearCount, 3);
assert.equal(profile.balancedYearCount, 3);
assert.equal(profile.maxSingleYear, "2023");
approx(profile.maxSingleYearSectionShare, 6 / 11);
assert.deepEqual(
  profile.yearProfiles.map((year) => [year.year, year.sectionCount, year.questionCount, year.packageCoverageCount]),
  [
    ["2022", 2, 50, 18],
    ["2023", 6, 150, 27],
    ["2024", 3, 75, 21],
  ],
);
const year2022 = profile.yearProfiles.find((year) => year.year === "2022");
assert.ok(year2022);
assert.ok(year2022.packageFrequencies.some((entry) => entry.packageId === "PCT-006" && entry.questionCount === 1));
const year2023 = profile.yearProfiles.find((year) => year.year === "2023");
assert.ok(year2023);
assert.deepEqual(
  year2023.packageFrequencies.slice(0, 3).map((entry) => [entry.packageId, entry.questionCount]),
  [["TMW-001", 19], ["ALG-001", 18], ["TRG-001", 16]],
);
const year2024 = profile.yearProfiles.find((year) => year.year === "2024");
assert.ok(year2024);
assert.deepEqual(
  year2024.packageFrequencies.slice(0, 3).map((entry) => [entry.packageId, entry.questionCount]),
  [["TRG-001", 9], ["DI-001", 8], ["PNL-001", 6]],
);

// Concentration after Wave 11 is now measured over 275 complete-section questions.
assert.equal(profile.top3QuestionCount, 86);
approx(profile.top3QuestionShare, 86 / 275);
assert.equal(profile.top5QuestionCount, 124);
approx(profile.top5QuestionShare, 124 / 275);
assert.equal(profile.top10QuestionCount, 195);
approx(profile.top10QuestionShare, 195 / 275);

// Leave-one-section-out must remain inside the conservative 2pp stability bound.
assert.equal(profile.leaveOneSectionOut.length, 11);
assert.ok(profile.leaveOneSectionOut.every((entry) => entry.remainingSectionCount === 10));
assert.ok(profile.leaveOneSectionOut.every((entry) => entry.remainingQuestionCount === 250));
assert.ok(profile.maxLeaveOneOutShareDeltaPoints <= QUANT_V4_CGL_TIER_I_STABILITY_P2_AUDIT_POLICY.maxLeaveOneOutShareDeltaPoints + 1e-12);
assert.ok(profile.maxLeaveOneOutRankMovement >= 0);

// The largest same-date cluster remains 25 Jul 2023. Wave 11 is on another date,
// so its section share falls from 30% to 3/11. DI-004, PCT-001 and SRI-002 are
// still supported only by that date, so support-loss remains the second blocker.
assert.equal(profile.maxSingleDate, "2023-07-25");
approx(profile.maxSingleDateSectionShare, 3 / 11);
const window = profile.concentratedDateSensitivity;
assert.ok(window);
assert.equal(window.heldDate, "2023-07-25");
assert.equal(window.removedSectionCount, 3);
approx(window.removedSectionShare, 3 / 11);
assert.equal(window.removedQuestionCount, 75);
assert.equal(window.remainingSectionCount, 8);
assert.equal(window.remainingQuestionCount, 200);
assert.equal(window.remainingPackageCoverageCount, 25);
assert.deepEqual([...window.packagesLostFromSupport], ["DI-004", "PCT-001", "SRI-002"]);
approx(window.maxAbsoluteShareDeltaPoints, 1.4545454545454541);
assert.equal(window.maxAbsoluteShareDeltaPackageId, "DI-001");
assert.ok(window.maxAbsoluteShareDeltaPoints <= QUANT_V4_CGL_TIER_I_STABILITY_P2_AUDIT_POLICY.maxConcentratedDateRemovalShareDeltaPoints + 1e-12);

// Relaxing evidence-stability thresholds alone never authorizes production.
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
