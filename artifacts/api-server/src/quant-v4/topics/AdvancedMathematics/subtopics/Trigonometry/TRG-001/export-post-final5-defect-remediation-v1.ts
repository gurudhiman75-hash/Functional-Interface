import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { TRG_001_LOCALIZATION_QL_IDS } from "./localization-v1";
import {
  TRG_001_LOCALIZATION_FINAL6_REMEDIATED_IDS,
  TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL6_VERSION,
  generateLocalizedTrg001QuestionNativeReviewFinal6,
} from "./localization-native-v5-pedagogic-review-final6";
import {
  TRG_001_POST_FREEZE_REMEDIATION_V1_IDS,
  TRG_001_POST_FREEZE_REMEDIATION_V1_VERSION,
  generatePostFreezeRemediatedTrg001Question,
} from "./production-post-freeze-remediation-v1";

const output = resolve(
  process.cwd(),
  "artifacts/api-server/dist/quant-v4/trg-001-post-final5-defect-remediation-v1.json",
);
mkdirSync(dirname(output), { recursive: true });

const reviewRows = TRG_001_LOCALIZATION_QL_IDS.map((qlId) => {
  const seed = `trg001-post-final5-review-${qlId}`;
  const en: any = generatePostFreezeRemediatedTrg001Question(qlId, seed);
  const hi: any = generateLocalizedTrg001QuestionNativeReviewFinal6(qlId, seed, "hi-IN");
  const pa: any = generateLocalizedTrg001QuestionNativeReviewFinal6(qlId, seed, "pa-IN");

  return {
    qlId,
    cpId: en.cpId,
    solveMode: en.solveMode,
    difficulty: en.difficulty,
    target: en.target,
    seed,
    canonicalSemanticFingerprint: hi.localizationProof.canonicalSemanticFingerprint,
    english: {
      stem: en.stem,
      options: en.options.map((option: any) => option.display),
      answer: en.answer,
      explanation: en.explanation,
      remediationApplied: TRG_001_POST_FREEZE_REMEDIATION_V1_IDS.includes(qlId as any),
    },
    hindi: {
      stem: hi.stem,
      options: hi.options.map((option: any) => option.display),
      localizedAnswerDisplay: hi.localizedAnswerDisplay,
      explanation: hi.explanation,
      localizationFingerprint: hi.localizationProof.localizationFingerprint,
      final6RemediationApplied: TRG_001_LOCALIZATION_FINAL6_REMEDIATED_IDS.includes(qlId as any),
    },
    punjabi: {
      stem: pa.stem,
      options: pa.options.map((option: any) => option.display),
      localizedAnswerDisplay: pa.localizedAnswerDisplay,
      explanation: pa.explanation,
      localizationFingerprint: pa.localizationProof.localizationFingerprint,
      final6RemediationApplied: TRG_001_LOCALIZATION_FINAL6_REMEDIATED_IDS.includes(qlId as any),
    },
    governance: {
      previousEnglishFreezeNotInherited: true,
      englishHumanReview: "PENDING",
      hindiPunjabiHumanReview: "PENDING",
      multilingualFreezeGranted: false,
      activationAuthorized: false,
      questionStudioEnabled: false,
      questionBankWritable: false,
      testBuilderEligible: false,
      publiclyPublishable: false,
    },
  };
});

writeFileSync(output, `${JSON.stringify({
  packageId: "TRG-001",
  status: "POST_FINAL5_DEFECT_REMEDIATION_REVIEW_CANDIDATE_V1",
  englishRemediationVersion: TRG_001_POST_FREEZE_REMEDIATION_V1_VERSION,
  localizationVersion: TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL6_VERSION,
  previousFrozenEnglishQls: 144,
  localizedReviewSurfaces: 288,
  englishRemediationIds: TRG_001_POST_FREEZE_REMEDIATION_V1_IDS,
  localizedRemediationIds: TRG_001_LOCALIZATION_FINAL6_REMEDIATED_IDS,
  reviewRows,
}, null, 2)}\n`, "utf8");

console.log(`TRG001_POST_FINAL5_REMEDIATION_REVIEW_WRITTEN rows=${reviewRows.length} localizedSurfaces=${reviewRows.length * 2} output=${output}`);
