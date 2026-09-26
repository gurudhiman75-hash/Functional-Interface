import assert from "node:assert/strict";

import { generateQuantV4RealExamSectionWithAdvancedMath } from "./quant-v4-real-exam-advanced-math-integration-p2";
import {
  auditNovelQuestionCapability,
  QUANT_V4_NOVEL_QUESTION_CAPABILITY_AUTHORITY,
  type NovelQuestionObservation,
} from "./novel-question-capability-p4";

const SECTIONS = 20;
const questions = [];
for (let sectionIndex = 1; sectionIndex <= SECTIONS; sectionIndex += 1) {
  const section = await generateQuantV4RealExamSectionWithAdvancedMath({
    examId: "SSC_CGL_TIER_I",
    sectionIndex,
    seed: `QUANT-V4-CGL-NOVELTY-P4:${sectionIndex}`,
  });
  questions.push(...section.questions.filter((question) => question.sourceKind === "RUNTIME_GENERATED"));
}

function observation(question: (typeof questions)[number], index: number): NovelQuestionObservation {
  return {
    id: `${question.examId}:${question.sectionIndex}:${question.ordinal}:${index}`,
    packageId: question.packageId,
    canonicalProblemId: question.canonicalProblemId ?? null,
    patternId: question.patternId ?? null,
    exactStem: question.text,
    structuralSignature: question.normalizedStemSignature,
    mathematicalStateSignature: question.mathematicalStateSignature ?? null,
    parameterStateSignature: question.parameterStateSignature ?? null,
    seedGroup: String(question.sectionIndex),
  };
}

const observations = questions.map(observation);
assert.ok(observations.length >= 400, "CGL novelty audit must inspect a substantial live runtime sample.");

const global = auditNovelQuestionCapability(observations, {
  maxExactDuplicateRate: 0.05,
  maxStructuralDuplicateRate: 0.10,
  minHeldOutStructuralNoveltyRate: 0.15,
  minPatternBreadth: 30,
  minCanonicalProblemBreadth: 8,
  minStateNoveltyRate: 0.70,
});

const packageIds = [...new Set(observations.map((row) => row.packageId))].sort();
const byPackage = packageIds.map((packageId) => {
  const rows = observations.filter((row) => row.packageId === packageId);
  return {
    packageId,
    ...auditNovelQuestionCapability(rows, {
      maxExactDuplicateRate: 0.10,
      maxStructuralDuplicateRate: 0.20,
      minHeldOutStructuralNoveltyRate: 0.10,
      minPatternBreadth: Math.min(4, Math.max(1, rows.length)),
      minCanonicalProblemBreadth: 1,
      minStateNoveltyRate: 0.60,
    }),
  };
}).sort((left, right) =>
  right.structural.duplicateRate - left.structural.duplicateRate
  || right.exact.duplicateRate - left.exact.duplicateRate
  || left.packageId.localeCompare(right.packageId)
);

const packagesRequiringNoveltyRemediation = byPackage
  .filter((row) => row.blockers.length > 0)
  .map((row) => ({
    packageId: row.packageId,
    records: row.records,
    patternBreadth: row.patternBreadth,
    canonicalProblemBreadth: row.canonicalProblemBreadth,
    exactDuplicateRate: row.exact.duplicateRate,
    structuralDuplicateRate: row.structural.duplicateRate,
    heldOutStructuralNoveltyRate: row.heldOutStructuralNovelty.rate,
    stateEvidenceTier: row.state.tier,
    stateNoveltyRate: row.stateNoveltyRate,
    blockers: row.blockers,
  }));

console.log("QUANT_V4_CGL_NOVEL_QUESTION_CAPABILITY_P4", JSON.stringify({
  authority: QUANT_V4_NOVEL_QUESTION_CAPABILITY_AUTHORITY,
  sections: SECTIONS,
  records: observations.length,
  global,
  packagesAudited: byPackage.length,
  packagesRequiringNoveltyRemediation,
  strongestPackages: byPackage
    .filter((row) => row.blockers.length === 0)
    .slice(0, 10)
    .map((row) => ({
      packageId: row.packageId,
      records: row.records,
      patternBreadth: row.patternBreadth,
      canonicalProblemBreadth: row.canonicalProblemBreadth,
      structuralDuplicateRate: row.structural.duplicateRate,
      heldOutStructuralNoveltyRate: row.heldOutStructuralNovelty.rate,
      stateEvidenceTier: row.state.tier,
      stateNoveltyRate: row.stateNoveltyRate,
    })),
  productionPromotionAuthorized: false,
  noveltyHardGateEnabled: false,
}));
