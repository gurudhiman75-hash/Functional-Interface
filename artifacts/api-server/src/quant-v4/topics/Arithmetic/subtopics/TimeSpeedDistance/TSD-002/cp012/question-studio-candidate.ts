import { add, compare, rational, subtract, toMixedString, type Rational } from "../../TSD-001/foundation/rational";
import { verifyTsdCp012 } from "./executable-verifier";
import type { TsdCp012ExecutableSolution } from "./executable-types";
import { TSD_CP012_ENGLISH_REVIEW_FINAL } from "./english-review-editorial-final";
import type { TsdCp012EnglishReviewQuestion } from "./english-review-final";
import { TSD_CP012_NATIVE_HINDI_REVIEW_FINAL, TSD_CP012_NATIVE_PUNJABI_REVIEW_FINAL } from "./native-review-editorial-final";
import type { TsdCp012NativeReviewQuestion } from "./native-review-final";
import type { TsdCp012QlId } from "./ql-allocation";
import { verifyTsdCp012SourceExtension } from "./source-executable-extensions";

export type TsdCp012StudioLanguage = "en" | "hi" | "pa";
export type TsdCp012StudioDifficulty = "EASY" | "MEDIUM" | "HARD";
export type TsdCp012StudioRequest = Readonly<{
  language?: TsdCp012StudioLanguage;
  count?: number;
  seed?: string;
  qlId?: TsdCp012QlId;
  difficulty?: TsdCp012StudioDifficulty;
}>;

export const TSD_CP012_STUDIO_CANDIDATE_RUNTIME_MODE = "TSD-CP-012-MULTILINGUAL-REVIEW-CANDIDATE-v1" as const;
export const TSD_CP012_STUDIO_CANDIDATE_PACKAGE_ID = "TSD-CP012-STUDIO-REVIEW-CANDIDATE" as const;
export const TSD_CP012_STUDIO_REVIEWED_COMBINATIONS_PER_LOCALE = 66 as const;
export const TSD_CP012_STUDIO_REVIEWED_MULTILINGUAL_COMBINATIONS = 198 as const;

export const TSD_CP012_STUDIO_CANDIDATE_PACKAGE = Object.freeze({
  packageId: TSD_CP012_STUDIO_CANDIDATE_PACKAGE_ID,
  checkpointId: "TSD-CP-012" as const,
  runtimeMode: TSD_CP012_STUDIO_CANDIDATE_RUNTIME_MODE,
  supportedLanguages: Object.freeze(["en", "hi", "pa"] as const),
  supportedDifficulties: Object.freeze(["EASY", "MEDIUM", "HARD"] as const),
  reviewedCombinationsPerLocale: TSD_CP012_STUDIO_REVIEWED_COMBINATIONS_PER_LOCALE,
  reviewedMultilingualCombinations: TSD_CP012_STUDIO_REVIEWED_MULTILINGUAL_COMBINATIONS,
  sourceStatus: "MULTILINGUAL_REVIEW_CANDIDATE" as const,
  productOwnerApprovalStatus: "NOT_APPROVED" as const,
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
  optionPolicy: "FOUR_UNIQUE_REVIEW_SCAFFOLD_OPTIONS_NOT_FROZEN" as const,
  distractorStatus: "REVIEW_REQUIRED_BEFORE_FREEZE" as const,
  verificationPolicy: "EXACT_SOLVER_OR_SOURCE_EXTENSION_PLUS_INDEPENDENT_VERIFIER" as const,
  variationPolicy: "REVIEWED_HUMAN_FAMILY_ONLY_NO_SYNTHETIC_CAPACITY_EXPANSION" as const,
});

type ReviewQuestion = TsdCp012EnglishReviewQuestion | TsdCp012NativeReviewQuestion;
const EXTENSION_TARGETS = new Set(["EXACT_TIME_TO_DISTANCE_IN_REPEATING_CYCLE", "DISTANCE_REMAINING_AFTER_STAGES", "CLOSED_ROUTE_OPPOSITE_MEETING_TIME"]);

function source(language: TsdCp012StudioLanguage): readonly ReviewQuestion[] {
  if (language === "hi") return TSD_CP012_NATIVE_HINDI_REVIEW_FINAL;
  if (language === "pa") return TSD_CP012_NATIVE_PUNJABI_REVIEW_FINAL;
  return TSD_CP012_ENGLISH_REVIEW_FINAL;
}
function verify(question: ReviewQuestion) {
  if (EXTENSION_TARGETS.has(question.input.target)) {
    return verifyTsdCp012SourceExtension(question.input as Parameters<typeof verifyTsdCp012SourceExtension>[0], question.solution as Parameters<typeof verifyTsdCp012SourceExtension>[1]);
  }
  return verifyTsdCp012(question.input as Parameters<typeof verifyTsdCp012>[0], question.solution);
}
function n(value: Rational): string { return toMixedString(value); }
function formatScalar(value: Rational, unit: Exclude<TsdCp012ExecutableSolution, { kind: "SET" }>["unit"], language: TsdCp012StudioLanguage): string {
  const valueText = n(value);
  if (unit === "INDEX") {
    if (language === "hi") return `मार्ग ${valueText}`;
    if (language === "pa") return `ਰਸਤਾ ${valueText}`;
    return `Route ${valueText}`;
  }
  if (unit === "COUNT" || unit === "RATIO") return valueText;
  if (language === "hi") {
    if (unit === "SECOND") return `${valueText} सेकंड`;
    if (unit === "METRE") return `${valueText} मीटर`;
    return `${valueText} मीटर/सेकंड`;
  }
  if (language === "pa") {
    if (unit === "SECOND") return `${valueText} ਸਕਿੰਟ`;
    if (unit === "METRE") return `${valueText} ਮੀਟਰ`;
    return `${valueText} ਮੀਟਰ/ਸਕਿੰਟ`;
  }
  if (unit === "SECOND") return `${valueText} seconds`;
  if (unit === "METRE") return `${valueText} m`;
  return `${valueText} m/s`;
}
function formatSet(values: readonly Rational[], language: TsdCp012StudioLanguage): string {
  const body = `{${values.map(n).join(", ")}}`;
  if (language === "hi") return `${body} मीटर/सेकंड`;
  if (language === "pa") return `${body} ਮੀਟਰ/ਸਕਿੰਟ`;
  return `${body} m/s`;
}
function equalRouteOption(language: TsdCp012StudioLanguage): string {
  if (language === "hi") return "सभी मार्गों का समय समान है";
  if (language === "pa") return "ਸਾਰੇ ਰਸਤਿਆਂ ਦਾ ਸਮਾਂ ਬਰਾਬਰ ਹੈ";
  return "All routes take equal time";
}
function hash(text: string): number {
  let value = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    value ^= text.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}
function shuffled<T>(items: readonly T[], seed: string): T[] {
  const out = [...items];
  let state = hash(seed) || 1;
  for (let index = out.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swap = state % (index + 1);
    [out[index], out[swap]] = [out[swap]!, out[index]!];
  }
  return out;
}
function scalarOptions(solution: Extract<TsdCp012ExecutableSolution, { kind: "SCALAR" }>, language: TsdCp012StudioLanguage, seed: string) {
  const correct = formatScalar(solution.answer, solution.unit, language);
  if (solution.unit === "INDEX") {
    const raw = [formatScalar(rational(1), "INDEX", language), formatScalar(rational(2), "INDEX", language), formatScalar(rational(3), "INDEX", language), equalRouteOption(language)];
    const options = shuffled(raw, seed);
    const correctIndex = options.indexOf(correct);
    if (new Set(options).size !== 4 || correctIndex < 0) throw new Error("CP012 Studio route-option construction failed");
    return Object.freeze({ options: Object.freeze(options), correctIndex, optionModel: "FINITE_ROUTE_CHOICE" as const });
  }
  const minusOne = subtract(solution.answer, rational(1));
  const third = compare(minusOne, rational(0)) > 0 ? minusOne : add(solution.answer, rational(3));
  const values = [solution.answer, add(solution.answer, rational(1)), add(solution.answer, rational(2)), third];
  const options = shuffled(values.map((value) => formatScalar(value, solution.unit, language)), seed);
  const correctIndex = options.indexOf(correct);
  if (new Set(options).size !== 4 || correctIndex < 0) throw new Error("CP012 Studio scalar-option construction failed");
  return Object.freeze({ options: Object.freeze(options), correctIndex, optionModel: "SCALAR_REVIEW_SCAFFOLD" as const });
}
function setOptions(solution: Extract<TsdCp012ExecutableSolution, { kind: "SET" }>, language: TsdCp012StudioLanguage, seed: string) {
  const values = [...solution.values];
  if (values.length < 3) throw new Error("CP012 Studio set option model requires at least three valid values");
  const last = values.at(-1)!;
  const correct = formatSet(values, language);
  const variants = [
    values,
    values.slice(0, -1),
    [values[0]!, ...values.slice(2)],
    [...values, add(last, rational(1))],
  ];
  const options = shuffled(variants.map((candidate) => formatSet(candidate, language)), seed);
  const correctIndex = options.indexOf(correct);
  if (new Set(options).size !== 4 || correctIndex < 0) throw new Error("CP012 Studio set-option construction failed");
  return Object.freeze({ options: Object.freeze(options), correctIndex, optionModel: "COMPLETE_SET_REVIEW_SCAFFOLD" as const });
}
function optionsFor(solution: TsdCp012ExecutableSolution, language: TsdCp012StudioLanguage, seed: string) {
  return solution.kind === "SET" ? setOptions(solution, language, seed) : scalarOptions(solution, language, seed);
}

export function previewTsdCp012StudioCandidate(request: TsdCp012StudioRequest = {}) {
  const language = request.language ?? "en";
  const count = Math.max(1, Math.floor(request.count ?? 5));
  const seed = request.seed ?? "cp012-studio-review";
  const selected = source(language).filter((question) =>
    (!request.qlId || question.qlId === request.qlId) &&
    (!request.difficulty || question.difficulty === request.difficulty));
  if (!selected.length) throw new Error("No CP012 review candidates match the requested filters.");
  if (count > selected.length) throw new Error(`Requested ${count} CP012 questions but only ${selected.length} reviewed combinations match the filters.`);

  const questions = shuffled(selected, `${seed}:${language}`).slice(0, count).map((question, index) => {
    const verification = verify(question);
    if (!verification.accepted) throw new Error(`${language}/${question.familyId}: independent verifier rejected Studio candidate (${verification.reason})`);
    const optionModel = optionsFor(question.solution, language, `${seed}:${language}:${question.familyId}:${index}`);
    return Object.freeze({
      questionId: `TSD-CP012-${language}-${question.familyId}-${hash(`${seed}:${index}`).toString(16)}`,
      canonicalItemId: question.familyId,
      questionLanguageId: `${question.familyId}-${language}`,
      qlId: question.qlId,
      familyId: question.familyId,
      authorityKey: question.authorityKey,
      difficultyBand: question.difficulty,
      language,
      locale: language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN",
      stem: question.stem,
      explanation: question.explanation,
      input: question.input,
      solution: question.solution,
      options: optionModel.options,
      correctIndex: optionModel.correctIndex,
      optionModel: optionModel.optionModel,
      runtimeMode: TSD_CP012_STUDIO_CANDIDATE_RUNTIME_MODE,
      reviewStatus: "REVIEW_CANDIDATE_NOT_APPROVED" as const,
      questionStudioRegistrationStatus: "NOT_REGISTERED" as const,
      persistenceAllowed: false as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
      validation: Object.freeze({
        exactSolverOrSourceExtensionBacked: true,
        independentVerifierAccepted: true,
        fourUniqueOptions: true,
        humanReviewedFamily: true,
        distractorsFrozen: false,
      }),
    });
  });

  return Object.freeze({
    package: TSD_CP012_STUDIO_CANDIDATE_PACKAGE,
    request: Object.freeze({ ...request, language, count, seed }),
    availableCombinationsUnderFilters: selected.length,
    questions: Object.freeze(questions),
  });
}
