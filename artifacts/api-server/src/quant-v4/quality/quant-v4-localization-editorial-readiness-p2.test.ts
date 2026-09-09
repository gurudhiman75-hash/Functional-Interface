import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function read(path: string): string {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

function requireFragments(source: string, label: string, fragments: readonly string[]): void {
  for (const fragment of fragments) {
    assert.ok(source.includes(fragment), `${label} editorial/lifecycle drift: missing ${fragment}`);
  }
}

const probability = read("src/quant-v4/topics/Probability/native-review-freeze.ts");
requireFragments(probability, "Probability", [
  "requiredQlCountPerLanguage: 216",
  "requiredDecisionCount: 432",
  "PROBABILITY_NATIVE_REVIEW_DECISIONS: readonly ProbabilityNativeReviewDecision[] = Object.freeze([])",
  'status: "PENDING_HUMAN_REVIEW"',
  "nativeQuestionStudioGenerationEnabled: false",
  "nativeScoredMockEnabled: false",
  "publiclyPublishable: false",
  "automaticStudentPublication: false",
]);

const interestCp001 = read("src/quant-v4/topics/Arithmetic/subtopics/Interest/INT-001/int-001-cp001-multilingual-v2-review-export.ts");
requireFragments(interestCp001, "Interest CP001", [
  'status: "PENDING_HUMAN_REVIEW"',
  'reviewStatus: "PENDING_HUMAN_REVIEW"',
  "publiclyPublishable: false",
  "questionStudioDiscoverable: false",
  "INT_CP001_MULTILINGUAL_V2_STANDARD",
]);

const trg001Status = read("src/quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-001/LOCALIZATION-V1-STATUS.md");
requireFragments(trg001Status, "TRG-001", [
  "FINAL5 ENGINEERING REVIEW-READY",
  "HUMAN REVIEW PENDING",
  "NOT FROZEN",
  "NOT ACTIVATED",
  "144 permanent QLs",
]);

const trg002LocalizationFiles = [
  "src/quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/localization-cp007-v1.ts",
  "src/quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/localization-cp008-v1.ts",
  "src/quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/localization-cp009-v1.ts",
  "src/quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/localization-cp010-v1.ts",
] as const;

for (const path of trg002LocalizationFiles) {
  const source = read(path);
  requireFragments(source, path, [
    'humanReviewStatus: "PENDING"',
    "frozen: false",
    "freezeEligible: false",
    'freezeStatus: "NOT_FROZEN"',
    "activationAuthorized: false",
  ]);
}

const partnershipFreeze = read("src/quant-v4/topics/Arithmetic/subtopics/Partnership/PRT-001/PRT-001-E12-FINAL-FREEZE-VALIDATION.md");
requireFragments(partnershipFreeze, "Partnership", [
  "E11 Hindi/Punjabi editorial: **2,310 cases",
  "E11 internal allocation enums: **0**",
  "E11 generic localized explanation phrases: **0**",
  "E11 remaining localized editorial similarity pairs at >= 0.88: **0**",
  "automated chapter release/freeze gate is closed",
]);

console.log("PASS_QUANT_V4_LOCALIZATION_EDITORIAL_READINESS_P2", {
  pendingExplicitHumanReview: ["Probability", "INT-CP-001", "TRG-001"],
  activeLocalizationReviewCandidates: ["TRG-002-CP007", "TRG-002-CP008", "TRG-002-CP009", "TRG-002-CP010"],
  protectedEditoriallyClosed: ["PRT-001"],
  fabricatedApprovals: 0,
  downstreamActivationsAuthorizedByThisCheckpoint: 0,
});
