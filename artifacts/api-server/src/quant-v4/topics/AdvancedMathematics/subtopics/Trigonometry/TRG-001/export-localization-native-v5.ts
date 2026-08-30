import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";
import { TRG_001_LOCALIZATION_QL_IDS } from "./localization-v1";
import { generateLocalizedTrg001QuestionNativeV5, trg001V5RuleText } from "./localization-native-v5-final";
import { trg001V5BindingFor } from "./localization-native-v5-registry";

const output = resolve(
  process.cwd(),
  "artifacts/api-server/dist/quant-v4/trg-001-localization-native-v5-review.json",
);
mkdirSync(dirname(output), { recursive: true });

const rows = TRG_001_LOCALIZATION_QL_IDS.map((qlId) => {
  const seed = `trg001-native-v5-review-${qlId}`;
  const en: any = generateHumanApprovedTrg001Question(qlId, seed);
  const hi: any = generateLocalizedTrg001QuestionNativeV5(qlId, seed, "hi-IN");
  const pa: any = generateLocalizedTrg001QuestionNativeV5(qlId, seed, "pa-IN");
  const binding = trg001V5BindingFor(qlId);
  if (!binding) throw new Error(`${qlId}: missing V5 binding during review export.`);

  return {
    qlId,
    cpId: en.cpId,
    solveMode: en.solveMode,
    difficulty: en.difficulty,
    target: en.target,
    seed,
    v5Binding: binding,
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
      nativeRule: trg001V5RuleText(binding.ruleKey, "hi-IN"),
      explanation: hi.explanation,
      localizationFingerprint: hi.localizationProof.localizationFingerprint,
      templateHit: hi.localizationProof.v5TemplateHit,
      finalHardening: hi.localizationProof.v5FinalHardening,
      fallbackRendererUsed: hi.localizationProof.v5FallbackRendererUsed,
    },
    punjabi: {
      stem: pa.stem,
      options: pa.options.map((option: any) => option.display),
      localizedAnswerDisplay: pa.localizedAnswerDisplay,
      nativeRule: trg001V5RuleText(binding.ruleKey, "pa-IN"),
      explanation: pa.explanation,
      localizationFingerprint: pa.localizationProof.localizationFingerprint,
      templateHit: pa.localizationProof.v5TemplateHit,
      finalHardening: pa.localizationProof.v5FinalHardening,
      fallbackRendererUsed: pa.localizationProof.v5FallbackRendererUsed,
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
  status: "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_V5",
  frozenEnglishQls: 144,
  localizedReviewSurfaces: 288,
  mandatoryV5Bindings: 144,
  languages: ["hi", "pa"],
  rows,
}, null, 2)}\n`, "utf8");

console.log(`TRG001_LOCALIZATION_NATIVE_V5_REVIEW_PACK_WRITTEN rows=${rows.length} localizedSurfaces=${rows.length * 2} output=${output}`);