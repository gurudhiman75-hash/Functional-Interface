import { getAvg001QuestionEntries } from "./library";
import { runAvg001Pipeline } from "./pipeline";
import { localizedExplanation } from "./cp004-localization-explanation";
import { qlNumber } from "./cp004-localization-values";
import { localizedStem } from "./cp004-localization-stem";
import type { Avg001Cp004PilotLanguage } from "./cp004-localization-lexicon";
import type { Avg001Language, Avg001QuestionPackage, Avg001ValidationCheck } from "./types";

export const AVG_001_CP004_MULTILINGUAL_PILOT = Object.freeze({
  releaseId: "AVG-001-CP004-HI-PA-v1-CANDIDATE",
  packageId: "AVG-001",
  canonicalProblemId: "AVG-CP-004",
  languages: ["hi", "pa"] as const,
  qlCount: 85,
  status: "MANUAL_REVIEW",
  editorialStatus: "PENDING",
  publiclyPublishable: false,
  createdAt: "2026-07-25",
});

type PilotLanguage = Avg001Cp004PilotLanguage;

const CP004_QL_IDS = getAvg001QuestionEntries()
  .filter((entry) => entry.cpId === "AVG-CP-004")
  .map((entry) => entry.qlId);

function correctedChecks(pkg: Avg001QuestionPackage, language: PilotLanguage) {
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
  checks.push(
    { name: "localized-language", passed: pkg.language === language, message: `Package language is ${language}` },
    { name: "localized-script", passed: expected.test(pkg.stem) && expected.test(prose) && !wrong.test(allText), message: "Localized stem and prose use the expected Indic script" },
    { name: "localized-stem", passed: !/[{}]|undefined|NaN|Infinity|null|[A-Za-z]/.test(pkg.stem), message: "Localized stem is fully rendered without Latin fallback" },
    { name: "localized-explanation", passed: pkg.explanation.lines.length === 4 && pkg.explanation.lines.some((line) => line.includes(pkg.answer)) && pkg.explanation.lines.some((line) => /×|÷|\+|-|=/.test(line)), message: "Localized explanation has four meaningful lines with arithmetic and answer evidence" },
    { name: "localization-parity", passed: pkg.options.length === 4 && pkg.options[pkg.correctIndex] === pkg.answer, message: "Localized package preserves the frozen English answer and options" },
    { name: "localization-candidate", passed: pkg.maturity === "MANUAL_REVIEW" && !pkg.publiclyPublishable, message: "Localization remains non-publishable pending review" },
  );
  return checks;
}

export function getAvg001Cp004LocalizedQlIds() {
  return [...CP004_QL_IDS];
}

export function runAvg001Cp004LocalizationPilot(input: {
  questionLanguageId: string;
  seed: string;
  language: PilotLanguage;
}): Avg001QuestionPackage {
  const english = runAvg001Pipeline({ questionLanguageId: input.questionLanguageId, seed: input.seed, language: "en" });
  if (english.canonicalProblemId !== "AVG-CP-004") {
    throw new Error(`${input.questionLanguageId} is outside the AVG-001 CP-004 multilingual pilot`);
  }
  const localized: Avg001QuestionPackage = {
    ...english,
    questionId: `${english.questionId}:${input.language}`,
    language: input.language as Avg001Language,
    stem: localizedStem(english, input.language),
    parameters: { ...english.parameters, language: input.language as Avg001Language },
    explanation: localizedExplanation(english, input.language),
    maturity: "MANUAL_REVIEW",
    publiclyPublishable: false,
    traceability: {
      ...english.traceability,
      localizationReleaseId: AVG_001_CP004_MULTILINGUAL_PILOT.releaseId,
      localizationStatus: AVG_001_CP004_MULTILINGUAL_PILOT.status,
      editorialStatus: AVG_001_CP004_MULTILINGUAL_PILOT.editorialStatus,
      localizedLanguage: input.language,
      sourceEnglishReleaseId: english.traceability.releaseId,
      publiclyPublishable: false,
      localizedStemContextFidelity: "AVG-001 localized stem context fidelity v1",
      localizedStemContextKind: "cp004-scenario",
      localizedStemGrammarGuard: "AVG-001 localized stem grammar guard v1",
      localizedStemVariationFinalizer: "AVG-001 localized stem variation finalizer v1",
      localizedStemVariationPolish: "AVG-001 localized stem variation polish v1",
      explanationAuthorship: "AVG-001 deterministic human-authored presentation v2",
      explanationOpeningVariant: qlNumber(english) % 23,
      explanationConclusionVariant: qlNumber(english) % 19,
      cp004LocalizationAuthorship: "AVG-CP-004 context-authored localization v1",
    },
  };
  const checks = correctedChecks(localized, input.language);
  return { ...localized, validation: { valid: checks.every((check) => check.passed), checks } };
}
