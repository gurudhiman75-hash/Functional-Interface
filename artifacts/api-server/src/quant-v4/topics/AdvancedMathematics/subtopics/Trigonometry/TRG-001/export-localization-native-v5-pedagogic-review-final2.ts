import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";
import { TRG_001_LOCALIZATION_QL_IDS } from "./localization-v1";
import { trg001V5BindingFor } from "./localization-native-v5-registry";
import { generateLocalizedTrg001QuestionNativeReviewFinal2 } from "./localization-native-v5-pedagogic-review-final2";

const output = resolve(
  process.cwd(),
  "artifacts/api-server/dist/quant-v4/trg-001-localization-native-review-final2.json",
);
mkdirSync(dirname(output), { recursive: true });

const reviewRows = TRG_001_LOCALIZATION_QL_IDS.map((qlId) => {
  const seed = `trg001-native-review-final2-${qlId}`;
  const en: any = generateHumanApprovedTrg001Question(qlId, seed);
  const hi: any = generateLocalizedTrg001QuestionNativeReviewFinal2(qlId, seed, "hi-IN");
  const pa: any = generateLocalizedTrg001QuestionNativeReviewFinal2(qlId, seed, "pa-IN");
  return {
    qlId,
    cpId: en.cpId,
    solveMode: en.solveMode,
    difficulty: en.difficulty,
    target: en.target,
    seed,
    v5Binding: trg001V5BindingFor(qlId),
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
      answer: hi.localizedAnswerDisplay,
      explanation: hi.explanation,
      fingerprint: hi.localizationProof.localizationFingerprint,
    },
    punjabi: {
      stem: pa.stem,
      options: pa.options.map((option: any) => option.display),
      answer: pa.localizedAnswerDisplay,
      explanation: pa.explanation,
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
  status: "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC_REVIEW_FINAL2",
  frozenEnglishQls: 144,
  localizedSurfaces: 288,
  humanLanguageReview: "PENDING",
  multilingualFreeze: false,
  activation: false,
  publicRelease: false,
  reviewRows,
}, null, 2)}\n`, "utf8");

console.log(`TRG001_NATIVE_REVIEW_FINAL2_PACK_WRITTEN rows=${reviewRows.length} surfaces=${reviewRows.length * 2} output=${output}`);
