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
assert.equal(profile.completeSectionCount, 13);
assert.equal(profile.completeQuestionCount, 325);
assert.equal(profile.wholeSectionProfile.evidenceStatus, "SECTION_FREQUENCY_CANDIDATE");
assert.deepEqual([...profile.wholeSectionProfile.blockers], []);
assert.equal(profile.wholeSectionProfile.packageCoverageCount, 28);

// Wave 13 intentionally adds independent PCT-001 support on 13 Sep 2024.
// This reduces the dominant-date support-loss count from three packages to the
// policy ceiling of two, clearing the final evidence-stability blocker.
assert.equal(profile.status, "STABILITY_CANDIDATE");
assert.deepEqual([...profile.blockers], []);
assert.equal(profile.productionPromotionAuthorized, false);
assert.equal(canPromoteQuantV4WholeSectionFrequencyFromStability(profile), false);

assert.equal(profile.distinctYearCount, 3);
assert.equal(profile.balancedYearCount, 3);
assert.equal(profile.maxSingleYear, "2023");
approx(profile.maxSingleYearSectionShare, 6 / 13);
const year2022 = profile.yearProfiles.find((year) => year.year === "2022");
const year2023 = profile.yearProfiles.find((year) => year.year === "2023");
const year2024 = profile.yearProfiles.find((year) => year.year === "2024");
assert.ok(year2022 && year2023 && year2024);
assert.deepEqual([year2022.sectionCount, year2022.questionCount], [2, 50]);
assert.deepEqual([year2023.sectionCount, year2023.questionCount], [6, 150]);
assert.deepEqual([year2024.sectionCount, year2024.questionCount], [5, 125]);
assert.ok(year2024.packageFrequencies.some((entry) => entry.packageId === "PCT-001" && entry.questionCount >= 1));

// Concentration statistics are allowed to evolve with each complete section;
// the audit freezes the conservative thresholds rather than incidental ranks.
assert.ok(profile.top3QuestionCount > 0);
assert.ok(profile.top5QuestionCount >= profile.top3QuestionCount);
assert.ok(profile.top10QuestionCount >= profile.top5QuestionCount);
assert.ok(profile.top10QuestionShare <= 1);

assert.equal(profile.leaveOneSectionOut.length, 13);
assert.ok(profile.leaveOneSectionOut.every((entry) => entry.remainingSectionCount === 12));
assert.ok(profile.leaveOneSectionOut.every((entry) => entry.remainingQuestionCount === 300));
assert.ok(
  profile.maxLeaveOneOutShareDeltaPoints <=
    QUANT_V4_CGL_TIER_I_STABILITY_P2_AUDIT_POLICY.maxLeaveOneOutShareDeltaPoints + 1e-12,
);

assert.equal(profile.maxSingleDate, "2023-07-25");
approx(profile.maxSingleDateSectionShare, 3 / 13);
const window = profile.concentratedDateSensitivity;
assert.ok(window);
assert.equal(window.heldDate, "2023-07-25");
assert.equal(window.removedSectionCount, 3);
approx(window.removedSectionShare, 3 / 13);
assert.equal(window.removedQuestionCount, 75);
assert.equal(window.remainingSectionCount, 10);
assert.equal(window.remainingQuestionCount, 250);
assert.equal(window.remainingPackageCoverageCount, 26);
assert.deepEqual([...window.packagesLostFromSupport], ["DI-004", "SRI-002"]);
assert.ok(
  window.maxAbsoluteShareDeltaPoints <=
    QUANT_V4_CGL_TIER_I_STABILITY_P2_AUDIT_POLICY.maxConcentratedDateRemovalShareDeltaPoints + 1e-12,
);
assert.ok(
  window.packagesLostFromSupport.length <=
    QUANT_V4_CGL_TIER_I_STABILITY_P2_AUDIT_POLICY.maxPackagesLostOnConcentratedDateRemoval,
);

// Candidate stability still does not authorize production frequency promotion.
assert.equal(QUANT_V4_CGL_TIER_I_STABILITY_P2_AUDIT_POLICY.productionPromotionAuthorized, false);
assert.equal(canPromoteQuantV4WholeSectionFrequencyFromStability(profile), false);

const explicitlyAuthorized = buildQuantV4WholeSectionFrequencyStabilityProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  sections: QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  wholeSectionPolicy: QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
  stabilityPolicy: Object.freeze({
    ...QUANT_V4_CGL_TIER_I_STABILITY_P2_AUDIT_POLICY,
    productionPromotionAuthorized: true,
  }),
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
  concentratedDateSensitivity: profile.concentratedDateSensitivity,
  stabilityStatus: profile.status,
  blockers: profile.blockers,
  productionPromotionAuthorized: profile.productionPromotionAuthorized,
}));
