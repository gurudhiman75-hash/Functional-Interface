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
  const seed = `trg001-native-review-final5-${qlId}`;
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
    english: { stem: en.stem, options: en.options.map((o: any) => o.display), answer: en.answer, explanation: en.explanation },
    hindi: {
      stem: hi.stem,
      options: hi.options.map((o: any) => o.display),
      answer: hi.localizedAnswerDisplay,
      explanation: hi.explanation,
      correctedLearnerFields: hi.localizationProof.final5CorrectedLearnerFields,
      fingerprint: hi.localizationProof.localizationFingerprint,
    },
    punjabi: {
      stem: pa.stem,
      options: pa.options.map((o: any) => o.display),
      answer: pa.localizedAnswerDisplay,
      explanation: pa.explanation,
      correctedLearnerFields: pa.localizationProof.final5CorrectedLearnerFields,
      fingerprint: pa.localizationProof.localizationFingerprint,
    },
    governance: {
      humanLanguageReview: "PENDING",
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
  status: "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_FINAL5",
  frozenEnglishQls: 144,
  localizedReviewSurfaces: 288,
  languages: ["hi", "pa"],
  sourceLayer: "FINAL4",
  reviewRows,
}, null, 2)}\n`, "utf8");

console.log(`TRG001_FINAL5_PACK_WRITTEN rows=${reviewRows.length} surfaces=${reviewRows.length * 2} output=${output}`);
