import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { generateHumanApprovedTrg001Question, TRG_001_FREEZE } from "./production-human-approved-runtime";
import { TRG_001_LOCALIZATION_QL_IDS, trg001CanonicalSemanticFingerprint } from "./localization-v1";
import { generateLocalizedTrg001QuestionNativeV4, trg001V4ResidualEnglishTokens } from "./localization-native-v4";

const outputPath = resolve(process.cwd(), "artifacts/api-server/dist/quant-v4/trg-001-localization-native-v4-review.json");
mkdirSync(dirname(outputPath), { recursive: true });

const rows = TRG_001_LOCALIZATION_QL_IDS.map((qlId) => {
  const seed = `trg001-localization-native-v4-review-${qlId}`;
  const english = generateHumanApprovedTrg001Question(qlId, seed) as any;
  const hindi = generateLocalizedTrg001QuestionNativeV4(qlId, seed, "hi-IN") as any;
  const punjabi = generateLocalizedTrg001QuestionNativeV4(qlId, seed, "pa-IN") as any;

  const view = (question: any) => ({
    stem: question.stem,
    options: question.options.map((option: any) => option.display),
    localizedAnswerDisplay: question.localizedAnswerDisplay,
    explanation: question.explanation,
    residualEnglishProseTokens: [
      question.stem,
      ...question.options.map((option: any) => option.display),
      question.localizedAnswerDisplay,
      question.explanation.keyRule,
      ...question.explanation.steps.flatMap((step: any) => [step.title, step.body]),
      question.explanation.shortcut,
      ...question.explanation.traps,
    ].reduce((sum: number, value: unknown) => sum + trg001V4ResidualEnglishTokens(value).length, 0),
    localizationFingerprint: question.localizationProof.localizationFingerprint,
  });

  return {
    qlId,
    cpId: english.cpId,
    solveMode: english.solveMode,
    difficulty: english.difficulty,
    target: english.target,
    seed,
    englishAuthorityFingerprint: TRG_001_FREEZE.approvedContentFingerprint,
    canonicalSemanticFingerprint: trg001CanonicalSemanticFingerprint(english),
    english: {
      stem: english.stem,
      options: english.options.map((option: any) => option.display),
      answer: english.answer,
      explanation: english.explanation,
    },
    hindi: view(hindi),
    punjabi: view(punjabi),
    governance: {
      humanLanguageReview: "PENDING",
      multilingualFreeze: false,
      activation: false,
      questionStudio: false,
      questionBank: "NOT_STORED",
      testBuilder: "INELIGIBLE",
      publicRelease: false,
    },
  };
});

const payload = {
  packageId: "TRG-001",
  status: "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_V4",
  frozenEnglishQls: TRG_001_LOCALIZATION_QL_IDS.length,
  localizedSurfaces: TRG_001_LOCALIZATION_QL_IDS.length * 2,
  languages: ["en", "hi", "pa"],
  englishAuthorityFingerprint: TRG_001_FREEZE.approvedContentFingerprint,
  rows,
};

writeFileSync(outputPath, JSON.stringify(payload, null, 2) + "\n", "utf8");
console.log(`TRG001_LOCALIZATION_NATIVE_V4_REVIEW_PACK rows=${rows.length} path=${outputPath}`);
