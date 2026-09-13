import { generateCompletePyqCoverageRemediatedTrg001Question } from "./pyq-coverage-remediated-runtime-p2-complete";
import { formatTrg001LearnerExplanation, type Trg001LearnerLanguage } from "./learner-explanation-p2";
import { localizePyqRemediatedTrg001QuestionP2 } from "./pyq-localization-native-p2";

export const TRG_001_CONSOLIDATED_AUDIT_P2 = Object.freeze({
  version: "TRG001_CONSOLIDATED_AUDIT_P2" as const,
  pyqCoverageQlIds: ["TRG-001-QL-024", "TRG-001-QL-126", "TRG-001-QL-143"] as const,
  difficultyRecalibratedQlIds: ["TRG-001-QL-121"] as const,
  contentLanguages: ["en", "hi", "pa"] as const,
  localizationStatus: "NATIVE_HI_PA_REMEDIATION_CANDIDATE" as const,
  humanLanguageReviewRequired: true as const,
  questionStudioRebound: false as const,
  productionActivationChanged: false as const,
});

export function generateConsolidatedAuditTrg001Question(
  qlId: string,
  seed: string,
  language: Trg001LearnerLanguage = "en",
) {
  const canonical: any = generateCompletePyqCoverageRemediatedTrg001Question(qlId, seed);
  const source: any = language === "en"
    ? canonical
    : localizePyqRemediatedTrg001QuestionP2(canonical, language === "hi" ? "hi-IN" : "pa-IN");
  const difficulty = qlId === "TRG-001-QL-121" ? "Medium" as const : source.difficulty;

  return Object.freeze({
    ...source,
    difficulty,
    learnerExplanation: formatTrg001LearnerExplanation(source, language),
    consolidatedAuditP2: Object.freeze({
      version: TRG_001_CONSOLIDATED_AUDIT_P2.version,
      pyqCoverageChanged: (TRG_001_CONSOLIDATED_AUDIT_P2.pyqCoverageQlIds as readonly string[]).includes(qlId),
      difficultyChanged: qlId === "TRG-001-QL-121",
      originalDifficulty: source.difficulty,
      learnerDifficulty: difficulty,
      contentLanguage: language,
      localizationStatus: TRG_001_CONSOLIDATED_AUDIT_P2.localizationStatus,
      humanLanguageReviewRequired: true as const,
      defaultExplanationFields: ["keyRule", "steps"] as const,
      shortcutAndTrapMetadataRetained: true as const,
      questionStudioRebound: false as const,
      productionActivationChanged: false as const,
    }),
    questionStudioDiscoverable: false as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
  });
}
