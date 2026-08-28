import { add, rational, toMixedString, type Rational } from "../../TSD-001/foundation/rational";
import { verifyTsdCp011 } from "./executable-verifier";
import { TSD_CP011_ENGLISH_REVIEW, type TsdCp011EnglishReviewQuestion } from "./english-review-final";
import { TSD_CP011_NATIVE_HINDI_REVIEW, TSD_CP011_NATIVE_PUNJABI_REVIEW, type TsdCp011NativeReviewQuestion } from "./native-review-final";
import type { TsdCp011ExecutableSolution } from "./executable-types";
import type { TsdCp011QlId } from "./ql-allocation";

export type TsdCp011StudioLanguage = "en" | "hi" | "pa";
export type TsdCp011StudioDifficulty = "EASY" | "MEDIUM";
export type TsdCp011StudioRequest = Readonly<{
  language?: TsdCp011StudioLanguage;
  count?: number;
  seed?: string;
  qlId?: TsdCp011QlId;
  difficulty?: TsdCp011StudioDifficulty;
}>;

export const TSD_CP011_STUDIO_CANDIDATE_RUNTIME_MODE = "TSD-CP-011-MULTILINGUAL-REVIEW-CANDIDATE-v1" as const;
export const TSD_CP011_STUDIO_CANDIDATE_PACKAGE_ID = "TSD-CP011-STUDIO-REVIEW-CANDIDATE" as const;
export const TSD_CP011_STUDIO_REVIEWED_COMBINATIONS_PER_LOCALE = 42 as const;
export const TSD_CP011_STUDIO_REVIEWED_MULTILINGUAL_COMBINATIONS = 126 as const;

export const TSD_CP011_STUDIO_CANDIDATE_PACKAGE = Object.freeze({
  packageId: TSD_CP011_STUDIO_CANDIDATE_PACKAGE_ID,
  checkpointId: "TSD-CP-011" as const,
  runtimeMode: TSD_CP011_STUDIO_CANDIDATE_RUNTIME_MODE,
  supportedLanguages: Object.freeze(["en", "hi", "pa"] as const),
  supportedDifficulties: Object.freeze(["EASY", "MEDIUM"] as const),
  reviewedCombinationsPerLocale: TSD_CP011_STUDIO_REVIEWED_COMBINATIONS_PER_LOCALE,
  reviewedMultilingualCombinations: TSD_CP011_STUDIO_REVIEWED_MULTILINGUAL_COMBINATIONS,
  sourceStatus: "MULTILINGUAL_REVIEW_CANDIDATE" as const,
  questionStudioRegistrationStatus: "NOT_REGISTERED" as const,
  productionSelectorVisible: false as const,
  routeMounted: false as const,
  persistenceAllowed: false as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  optionPolicy: "EXACTLY_FOUR_UNIQUE_OPTIONS" as const,
  verificationPolicy: "EXACT_SOLVER_PLUS_INDEPENDENT_VERIFIER" as const,
  variationPolicy: "REVIEWED_HUMAN_FAMILY_ONLY_UNTIL_CAPACITY_EXPANSION_IS_SEPARATELY_PROVEN" as const,
});

type ReviewQuestion = TsdCp011EnglishReviewQuestion | TsdCp011NativeReviewQuestion;

function source(language: TsdCp011StudioLanguage): readonly ReviewQuestion[] {
  if (language === "hi") return TSD_CP011_NATIVE_HINDI_REVIEW;
  if (language === "pa") return TSD_CP011_NATIVE_PUNJABI_REVIEW;
  return TSD_CP011_ENGLISH_REVIEW;
}

function formatValue(value: Rational, unit: TsdCp011ExecutableSolution["unit"], language: TsdCp011StudioLanguage): string {
  const n = toMixedString(value);
  if (language === "hi") {
    switch (unit) {
      case "SECOND": return `${n} सेकंड`;
      case "MINUTE": return `${n} मिनट`;
      case "METRE": return `${n} मीटर`;
      case "STEP": return `${n} सीढ़ियाँ`;
      case "METRE_PER_SECOND": return `${n} मीटर/सेकंड`;
      case "STEP_PER_SECOND": return `${n} सीढ़ियाँ/सेकंड`;
      case "REVOLUTION": return `${n} चक्कर`;
      case "METRE_PER_MINUTE": return `${n} मीटर/मिनट`;
      case "REVOLUTION_PER_MINUTE": return `${n} चक्कर प्रति मिनट`;
      case "RATIO": return n;
    }
  }
  if (language === "pa") {
    switch (unit) {
      case "SECOND": return `${n} ਸਕਿੰਟ`;
      case "MINUTE": return `${n} ਮਿੰਟ`;
      case "METRE": return `${n} ਮੀਟਰ`;
      case "STEP": return `${n} ਪੌੜੀਆਂ`;
      case "METRE_PER_SECOND": return `${n} ਮੀਟਰ/ਸਕਿੰਟ`;
      case "STEP_PER_SECOND": return `${n} ਪੌੜੀਆਂ/ਸਕਿੰਟ`;
      case "REVOLUTION": return `${n} ਚੱਕਰ`;
      case "METRE_PER_MINUTE": return `${n} ਮੀਟਰ/ਮਿੰਟ`;
      case "REVOLUTION_PER_MINUTE": return `${n} ਚੱਕਰ ਪ੍ਰਤੀ ਮਿੰਟ`;
      case "RATIO": return n;
    }
  }
  switch (unit) {
    case "SECOND": return `${n} seconds`;
    case "MINUTE": return `${n} minutes`;
    case "METRE": return `${n} m`;
    case "STEP": return `${n} steps`;
    case "METRE_PER_SECOND": return `${n} m/s`;
    case "STEP_PER_SECOND": return `${n} steps/s`;
    case "REVOLUTION": return `${n} revolutions`;
    case "METRE_PER_MINUTE": return `${n} m/min`;
    case "REVOLUTION_PER_MINUTE": return `${n} rpm`;
    case "RATIO": return n;
  }
}

function hash(text: string): number {
  let value = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    value ^= text.charCodeAt(i);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function shuffled<T>(items: readonly T[], seed: string): T[] {
  const out = [...items];
  let state = hash(seed) || 1;
  for (let i = out.length - 1; i > 0; i -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function optionsFor(solution: TsdCp011ExecutableSolution, language: TsdCp011StudioLanguage, seed: string) {
  const values = [solution.answer, add(solution.answer, rational(1)), add(solution.answer, rational(2)), add(solution.answer, rational(3))];
  const correct = formatValue(solution.answer, solution.unit, language);
  const options = shuffled(values.map((value) => formatValue(value, solution.unit, language)), seed);
  const correctIndex = options.indexOf(correct);
  if (new Set(options).size !== 4 || correctIndex < 0) throw new Error("CP011 Studio option construction failed uniqueness/correct-answer guard");
  return Object.freeze({ options: Object.freeze(options), correctIndex });
}

export function previewTsdCp011StudioCandidate(request: TsdCp011StudioRequest = {}) {
  const language = request.language ?? "en";
  const count = Math.max(1, Math.floor(request.count ?? 5));
  const seed = request.seed ?? "cp011-studio-review";
  const selected = source(language).filter((q) =>
    (!request.qlId || q.qlId === request.qlId) &&
    (!request.difficulty || q.difficulty === request.difficulty));

  if (!selected.length) throw new Error("No CP011 review candidates match the requested filters.");
  if (count > selected.length) throw new Error(`Requested ${count} CP011 questions but only ${selected.length} reviewed combinations match the filters.`);

  const questions = shuffled(selected, `${seed}:${language}`).slice(0, count).map((q, index) => {
    const verification = verifyTsdCp011(q.input, q.solution);
    if (!verification.accepted) throw new Error(`${language}/${q.familyId}: independent verifier rejected Studio candidate`);
    const optionModel = optionsFor(q.solution, language, `${seed}:${language}:${q.familyId}:${index}`);
    return Object.freeze({
      questionId: `TSD-CP011-${language}-${q.familyId}-${hash(`${seed}:${index}`).toString(16)}`,
      canonicalItemId: q.familyId,
      questionLanguageId: `${q.familyId}-${language}`,
      qlId: q.qlId,
      familyId: q.familyId,
      authorityKey: q.authorityKey,
      difficultyBand: q.difficulty,
      language,
      locale: language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN",
      stem: q.stem,
      explanation: q.explanation,
      input: q.input,
      solution: q.solution,
      options: optionModel.options,
      correctIndex: optionModel.correctIndex,
      runtimeMode: TSD_CP011_STUDIO_CANDIDATE_RUNTIME_MODE,
      reviewStatus: "REVIEW_CANDIDATE_NOT_APPROVED" as const,
      questionStudioRegistrationStatus: "NOT_REGISTERED" as const,
      persistenceAllowed: false as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
      validation: Object.freeze({
        exactSolverBacked: true,
        independentVerifierAccepted: true,
        fourUniqueOptions: true,
        humanReviewedFamily: true,
      }),
    });
  });

  return Object.freeze({
    package: TSD_CP011_STUDIO_CANDIDATE_PACKAGE,
    request: Object.freeze({ ...request, language, count, seed }),
    availableCombinationsUnderFilters: selected.length,
    questions: Object.freeze(questions),
  });
}
