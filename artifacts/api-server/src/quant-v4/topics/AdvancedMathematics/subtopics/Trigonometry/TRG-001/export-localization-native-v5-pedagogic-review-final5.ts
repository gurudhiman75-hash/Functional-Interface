import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";
import { TRG_001_LOCALIZATION_QL_IDS } from "./localization-v1";
import { generateLocalizedTrg001QuestionNativeReviewFinal5 } from "./localization-native-v5-pedagogic-review-final5";

const output = resolve(
  process.cwd(),
  "artifacts/api-server/dist/quant-v4/trg-001-localization-native-review-final5.json",
);
mkdirSync(dirname(output), { recursive: true });

const reviewRows = TRG_001_LOCALIZATION_QL_IDS.map((qlId) => {
  const seed = `trg001-final5-review-${qlId}`;
  const en: any = generateHumanApprovedTrg001Question(qlId, seed);
  const hi: any = generateLocalizedTrg001QuestionNativeReviewFinal5(qlId, seed, "hi-IN");
  const pa: any = generateLocalizedTrg001QuestionNativeReviewFinal5(qlId, seed, "pa-IN");

  return {
    qlId,
    cpId: en.cpId,
    solveMode: en.solveMode,
    difficulty: en.difficulty,
    target: en.target,
    seed,
    englishAuthorityFingerprint: hi.localizationLifecycle.englishAuthorityFingerprint,
    canonicalSemanticFingerprint: hi.localizationProof.canonicalSemanticFingerprint,
    english: {
      stem: en.stem,
      options: en.options.map((option: any) => option.display),
      answer: en.answer,
      explanation: en.explanation,
    },
    hindi: {
      stem: hi.stem,
      options: hi.options.map((option: any) => option.display),
      localizedAnswerDisplay: hi.localizedAnswerDisplay,
      explanation: hi.explanation,
      localizationFingerprint: hi.localizationProof.localizationFingerprint,
      final5NativeWordOrderPolish: hi.localizationProof.final5NativeWordOrderPolish,
    },
    punjabi: {
      stem: pa.stem,
      options: pa.options.map((option: any) => option.display),
      localizedAnswerDisplay: pa.localizedAnswerDisplay,
      explanation: pa.explanation,
      localizationFingerprint: pa.localizationProof.localizationFingerprint,
      final5NativeWordOrderPolish: pa.localizationProof.final5NativeWordOrderPolish,
    },
    governance: {
      humanLanguageReview: "PENDING",
      multilingualFreezeGranted: false,
      activationAuthorized: false,
      questionStudioEnabledForLocalizedSurface: false,
      questionBankWritableForLocalizedSurface: false,
      testBuilderEligibleForLocalizedSurface: false,
      publiclyPublishable: false,
    },
  };
});

writeFileSync(output, `${JSON.stringify({
  packageId: "TRG-001",
  status: "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_FINAL5",
  frozenEnglishQls: 144,
  localizedReviewSurfaces: 288,
  languages: ["hi", "pa"],
  final5Scope: [
    "native degree-clause word order",
    "native equivalence-statement word order",
    "Punjabi subtraction-sign wording",
  ],
  reviewRows,
}, null, 2)}\n`, "utf8");

console.log(`TRG001_LOCALIZATION_NATIVE_REVIEW_FINAL5_WRITTEN rows=${reviewRows.length} localizedSurfaces=${reviewRows.length * 2} output=${output}`);
