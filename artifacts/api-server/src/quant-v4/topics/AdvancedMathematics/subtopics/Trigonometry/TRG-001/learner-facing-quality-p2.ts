import { generatePostFreezeRemediatedTrg001Question } from "./production-post-freeze-remediation-v1";
import { formatTrg001LearnerExplanation, type Trg001LearnerLanguage } from "./learner-explanation-p2";

export const TRG_001_LEARNER_FACING_QUALITY_P2 = Object.freeze({
  version: "TRG001_LEARNER_FACING_QUALITY_P2" as const,
  difficultyRecalibratedQlIds: ["TRG-001-QL-121"] as const,
  questionStudioRebound: false as const,
  contentMutationAuthorized: false as const,
});

export function generateLearnerFacingAuditTrg001Question(
  qlId: string,
  seed: string,
  language: Trg001LearnerLanguage = "en",
) {
  const source: any = generatePostFreezeRemediatedTrg001Question(qlId, seed);
  const difficulty = qlId === "TRG-001-QL-121" ? "Medium" as const : source.difficulty;

  return Object.freeze({
    ...source,
    difficulty,
    learnerExplanation: formatTrg001LearnerExplanation(source, language),
    learnerFacingAuditP2: Object.freeze({
      version: TRG_001_LEARNER_FACING_QUALITY_P2.version,
      difficultyChanged: qlId === "TRG-001-QL-121",
      originalDifficulty: source.difficulty,
      learnerDifficulty: difficulty,
      defaultExplanationFields: ["keyRule", "steps"] as const,
      shortcutAndTrapMetadataRetained: true as const,
      questionStudioRebound: false as const,
    }),
    questionStudioDiscoverable: false as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
  });
}
