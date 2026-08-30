import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";
import {
  TRG_001_LOCALIZATION_QL_IDS,
  generateLocalizedTrg001Question,
} from "./localization-v1";

const output = resolve(
  process.cwd(),
  "artifacts/api-server/dist/quant-v4/trg-001-localization-v1-review.json",
);
mkdirSync(dirname(output), { recursive: true });

const rows = TRG_001_LOCALIZATION_QL_IDS.map((qlId) => {
  const seed = `trg001-localization-review-${qlId}`;
  const en: any = generateHumanApprovedTrg001Question(qlId, seed);
  const hi: any = generateLocalizedTrg001Question(qlId, seed, "hi-IN");
  const pa: any = generateLocalizedTrg001Question(qlId, seed, "pa-IN");
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
    },
    punjabi: {
      stem: pa.stem,
      options: pa.options.map((option: any) => option.display),
      localizedAnswerDisplay: pa.localizedAnswerDisplay,
      explanation: pa.explanation,
      localizationFingerprint: pa.localizationProof.localizationFingerprint,
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
  status: "LOCALIZATION_REVIEW_CANDIDATE_V1",
  frozenEnglishQls: 144,
  localizedSurfaces: 288,
  languages: ["hi", "pa"],
  rows,
}, null, 2)}\n`, "utf8");

console.log(`TRG001_LOCALIZATION_REVIEW_PACK_WRITTEN rows=${rows.length} localizedSurfaces=${rows.length * 2} output=${output}`);
