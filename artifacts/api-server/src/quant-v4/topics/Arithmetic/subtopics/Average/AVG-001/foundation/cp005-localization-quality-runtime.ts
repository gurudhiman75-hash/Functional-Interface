import { applyAvg001Cp005ExamStrategy } from "./cp005-exam-strategy-finalizer";
import { localizedCp005Explanation, localizedCp005Stem, type Avg001Cp005PilotLanguage } from "./cp005-localization-content";
import { getAvg001QuestionEntries } from "./library";
import { runAvg001Pipeline } from "./pipeline";
import type { Avg001Language, Avg001QuestionPackage, Avg001ValidationCheck } from "./types";

export const AVG_001_CP005_MULTILINGUAL_PILOT = Object.freeze({
  releaseId: "AVG-001-CP005-HI-PA-v1-CANDIDATE",
  packageId: "AVG-001",
  canonicalProblemId: "AVG-CP-005",
  languages: ["hi", "pa"] as const,
  qlCount: 56,
  status: "MANUAL_REVIEW",
  editorialStatus: "PENDING",
  publiclyPublishable: false,
  createdAt: "2026-07-25",
});

const CP005_QL_IDS = getAvg001QuestionEntries()
  .filter((entry) => entry.cpId === "AVG-CP-005")
  .map((entry) => entry.qlId);

function answerToken(pkg: Avg001QuestionPackage) {
  return pkg.answer.replaceAll(",", "").match(/-?\d+(?:\.\d+)?/)?.[0] ?? pkg.answer;
}

function correctedChecks(pkg: Avg001QuestionPackage, language: Avg001Cp005PilotLanguage) {
  const excluded = new Set([
    "language", "maturity", "release-approval", "resolved-stem",
    "explanation-depth", "explanation-arithmetic", "explanation-answer",
  ]);
  const checks: Avg001ValidationCheck[] = pkg.validation.checks.filter((check) => !excluded.has(check.name));
  const allText = `${pkg.stem}\n${pkg.explanation.lines.join("\n")}`;
  const prose = pkg.explanation.lines.filter((line) => !/\$\$/.test(line)).join("\n");
  const devanagari = /[\u0900-\u0963\u0970-\u097F]/;
  const gurmukhi = /[\u0A01-\u0A74]/;
  const expected = language === "hi" ? devanagari : gurmukhi;
  const wrong = language === "hi" ? gurmukhi : devanagari;
  const answer = answerToken(pkg);
  checks.push(
    { name: "localized-language", passed: pkg.language === language, message: `Package language is ${language}` },
    { name: "localized-script", passed: expected.test(pkg.stem) && expected.test(prose) && !wrong.test(allText), message: "Localized stem and prose use the expected Indic script" },
    { name: "localized-stem", passed: !/[{}]|undefined|NaN|Infinity|null|[A-Za-z]/.test(pkg.stem), message: "Localized stem is fully rendered without Latin fallback" },
    { name: "localized-explanation", passed: pkg.explanation.lines.length === 4 && pkg.explanation.lines.some((line) => line.replaceAll(",", "").includes(answer)) && pkg.explanation.lines.some((line) => /×|÷|\+|-|=/.test(line)), message: "Localized explanation has four meaningful lines with arithmetic and numeric answer evidence" },
    { name: "localized-exam-strategy", passed: pkg.traceability.cp005ExamStrategyFinalizer === "AVG-CP-005 compact exam shortcut and trap guidance v1", message: "Localized explanation includes compact exam shortcut and trap guidance" },
    { name: "localization-parity", passed: pkg.options.length === 4 && pkg.options[pkg.correctIndex] === pkg.answer, message: "Localized package preserves the frozen English answer and options" },
    { name: "localization-candidate", passed: pkg.maturity === "MANUAL_REVIEW" && !pkg.publiclyPublishable, message: "Localization remains non-publishable pending review" },
  );
  return checks;
}

export function getAvg001Cp005LocalizedQlIds() {
  return [...CP005_QL_IDS];
}

export function runAvg001Cp005LocalizationPilot(input: {
  questionLanguageId: string;
  seed: string;
  language: Avg001Cp005PilotLanguage;
}): Avg001QuestionPackage {
  const english = runAvg001Pipeline({ questionLanguageId: input.questionLanguageId, seed: input.seed, language: "en" });
  if (english.canonicalProblemId !== "AVG-CP-005") {
    throw new Error(`${input.questionLanguageId} is outside the AVG-001 CP-005 multilingual pilot`);
  }
  const localized: Avg001QuestionPackage = {
    ...english,
    questionId: `${english.questionId}:${input.language}`,
    language: input.language as Avg001Language,
    stem: localizedCp005Stem(english, input.language),
    parameters: { ...english.parameters, language: input.language as Avg001Language },
    explanation: localizedCp005Explanation(english, input.language),
    maturity: "MANUAL_REVIEW",
    publiclyPublishable: false,
    traceability: {
      ...english.traceability,
      localizationReleaseId: AVG_001_CP005_MULTILINGUAL_PILOT.releaseId,
      localizationStatus: AVG_001_CP005_MULTILINGUAL_PILOT.status,
      editorialStatus: AVG_001_CP005_MULTILINGUAL_PILOT.editorialStatus,
      localizedLanguage: input.language,
      sourceEnglishReleaseId: english.traceability.releaseId,
      publiclyPublishable: false,
      localizedStemContextFidelity: "AVG-001 localized stem context fidelity v1",
      localizedStemContextKind: "cp005-correction-scenario",
      localizedStemGrammarGuard: "AVG-001 localized stem grammar guard v1",
      localizedStemVariationFinalizer: "AVG-001 localized stem variation finalizer v1",
      localizedStemVariationPolish: "AVG-001 localized stem variation polish v1",
      explanationAuthorship: "AVG-001 deterministic human-authored presentation v2",
      explanationOpeningVariant: Number(english.questionLanguageId.slice(-3)) % 23,
      explanationConclusionVariant: Number(english.questionLanguageId.slice(-3)) % 19,
      cp005LocalizationAuthorship: "AVG-CP-005 context-authored localization v1",
    },
  };
  const examReady = applyAvg001Cp005ExamStrategy(localized);
  const checks = correctedChecks(examReady, input.language);
  return { ...examReady, validation: { valid: checks.every((check) => check.passed), checks } };
}
