import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";
import { TRG_001_LOCALIZATION_QL_IDS } from "./localization-v1";
import {
  generateLocalizedTrg001QuestionEditorialV3,
  trg001V3ResidualEnglishTokens,
} from "./localization-editorial-v3";

const output = resolve(
  process.cwd(),
  "artifacts/api-server/dist/quant-v4/trg-001-localization-editorial-v3-review.json",
);
mkdirSync(dirname(output), { recursive: true });

function learnerValues(question: any) {
  return [
    question.stem,
    ...question.options.map((option: any) => option.display),
    question.localizedAnswerDisplay,
    question.explanation?.keyRule,
    ...question.explanation.steps.flatMap((step: any) => [step.title, step.body]),
    question.explanation?.shortcut,
    ...question.explanation.traps,
  ];
}

function residualCount(question: any) {
  return learnerValues(question).reduce(
    (sum: number, value: unknown) => sum + trg001V3ResidualEnglishTokens(value).length,
    0,
  );
}

const rows = TRG_001_LOCALIZATION_QL_IDS.map((qlId) => {
  const seed = `trg001-localization-editorial-v3-review-${qlId}`;
  const en: any = generateHumanApprovedTrg001Question(qlId, seed);
  const hi: any = generateLocalizedTrg001QuestionEditorialV3(qlId, seed, "hi-IN");
  const pa: any = generateLocalizedTrg001QuestionEditorialV3(qlId, seed, "pa-IN");
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
      residualEnglishProseTokens: residualCount(hi),
      localizationFingerprint: hi.localizationProof.localizationFingerprint,
    },
    punjabi: {
      stem: pa.stem,
      options: pa.options.map((option: any) => option.display),
      localizedAnswerDisplay: pa.localizedAnswerDisplay,
      explanation: pa.explanation,
      residualEnglishProseTokens: residualCount(pa),
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

const hindiResidual = rows.reduce((sum, row) => sum + row.hindi.residualEnglishProseTokens, 0);
const punjabiResidual = rows.reduce((sum, row) => sum + row.punjabi.residualEnglishProseTokens, 0);
if (hindiResidual !== 0 || punjabiResidual !== 0) {
  throw new Error(`V3 review pack contains residual English prose: hi=${hindiResidual}, pa=${punjabiResidual}`);
}

writeFileSync(output, `${JSON.stringify({
  packageId: "TRG-001",
  status: "LOCALIZATION_EDITORIAL_REVIEW_CANDIDATE_V3",
  frozenEnglishQls: 144,
  localizedSurfaces: 288,
  languages: ["hi", "pa"],
  residualEnglishProseTokens: { hindi: 0, punjabi: 0 },
  rows,
}, null, 2)}\n`, "utf8");

console.log(`TRG001_LOCALIZATION_EDITORIAL_V3_REVIEW_PACK_WRITTEN rows=${rows.length} localizedSurfaces=${rows.length * 2} residualEnglish=0 output=${output}`);
