import { rational, toMixedString, type Rational } from "../../TSD-001/foundation/rational";
import { verifyTsdCp012 } from "./executable-verifier";
import type { TsdCp012ExecutableSolution } from "./executable-types";
import { TSD_CP012_ENGLISH_REVIEW_FINAL } from "./english-review-editorial-final";
import { TSD_CP012_NATIVE_HINDI_REVIEW_FINAL, TSD_CP012_NATIVE_PUNJABI_REVIEW_FINAL } from "./native-review-editorial-final";
import type { TsdCp012QlId } from "./ql-allocation";
import {
  buildTsdCp012ScalarDistractors,
  buildTsdCp012SetDistractors,
} from "./question-studio-distractors";
import { verifyTsdCp012SourceExtension } from "./source-executable-extensions";

export type TsdCp012StudioLanguage = "en" | "hi" | "pa";
export type TsdCp012StudioDifficulty = "EASY" | "MEDIUM";
export type TsdCp012StudioRequest = Readonly<{
  language?: TsdCp012StudioLanguage;
  count?: number;
  seed?: string;
  qlId?: TsdCp012QlId;
  difficulty?: TsdCp012StudioDifficulty;
}>;

export const TSD_CP012_STUDIO_CANDIDATE_RUNTIME_MODE = "TSD-CP-012-MULTILINGUAL-TARGET-EXHAUSTIVE-REVIEW-CANDIDATE-v3" as const;
export const TSD_CP012_STUDIO_CANDIDATE_PACKAGE_ID = "TSD-CP012-STUDIO-REVIEW-CANDIDATE" as const;
export const TSD_CP012_STUDIO_REVIEWED_COMBINATIONS_PER_LOCALE = 270 as const;
export const TSD_CP012_STUDIO_REVIEWED_MULTILINGUAL_COMBINATIONS = 810 as const;

export const TSD_CP012_STUDIO_CANDIDATE_PACKAGE = Object.freeze({
  packageId: TSD_CP012_STUDIO_CANDIDATE_PACKAGE_ID,
  checkpointId: "TSD-CP-012" as const,
  runtimeMode: TSD_CP012_STUDIO_CANDIDATE_RUNTIME_MODE,
  supportedLanguages: Object.freeze(["en", "hi", "pa"] as const),
  supportedDifficulties: Object.freeze(["EASY", "MEDIUM"] as const),
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
  optionPolicy: "FOUR_UNIQUE_MISCONCEPTION_BACKED_REVIEW_OPTIONS_NOT_FROZEN" as const,
  distractorStatus: "MISCONCEPTION_BACKED_REVIEW_CANDIDATE_NOT_FROZEN" as const,
  verificationPolicy: "EXACT_SOLVER_OR_SOURCE_EXTENSION_PLUS_INDEPENDENT_VERIFIER" as const,
  variationPolicy: "TARGET_EXHAUSTIVE_REVIEWED_SEMANTIC_SCALE_BANDS_NO_BLIND_RANDOMIZATION" as const,
});

type ReviewQuestion =
  | (typeof TSD_CP012_ENGLISH_REVIEW_FINAL)[number]
  | (typeof TSD_CP012_NATIVE_HINDI_REVIEW_FINAL)[number]
  | (typeof TSD_CP012_NATIVE_PUNJABI_REVIEW_FINAL)[number];
type InternalOptionAudit = Readonly<{
  text: string;
  isCorrect: boolean;
  misconceptionId?: string;
  wrongWorking?: Readonly<{ calculation: string }>;
}>;
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
function finalize(records: readonly InternalOptionAudit[], seed: string, optionModel: string) {
  const shuffledRecords = shuffled(records, seed);
  const options = shuffledRecords.map((record) => record.text);
  const correctIndex = shuffledRecords.findIndex((record) => record.isCorrect);
  if (new Set(options).size !== 4 || correctIndex < 0 || shuffledRecords.filter((record) => record.isCorrect).length !== 1) throw new Error("CP012 Studio option construction failed uniqueness/correct-answer guard");
  return Object.freeze({
    options: Object.freeze(options),
    correctIndex,
    optionModel,
    internalOptionAudit: Object.freeze(shuffledRecords),
  });
}
function routeOptions(solution: Extract<TsdCp012ExecutableSolution, { kind: "SCALAR" }>, language: TsdCp012StudioLanguage, seed: string) {
  const correct = formatScalar(solution.answer, "INDEX", language);
  const routeRecords: InternalOptionAudit[] = [1, 2, 3].map((route) => {
    const text = formatScalar(rational(route), "INDEX", language);
    return text === correct
      ? Object.freeze({ text, isCorrect: true })
      : Object.freeze({ text, isCorrect: false, misconceptionId: `ROUTE_${route}_SELECTED_WITHOUT_EXACT_TIME_COMPARISON`, wrongWorking: Object.freeze({ calculation: `Select Route ${route} without comparing the exact sum of segment times for every route.` }) });
  });
  routeRecords.push(Object.freeze({
    text: equalRouteOption(language),
    isCorrect: false,
    misconceptionId: "FALSE_EQUAL_ROUTE_TIME_ASSUMPTION",
    wrongWorking: Object.freeze({ calculation: "Assume the three route profiles take equal time instead of summing each route's exact segment times." }),
  }));
  return finalize(routeRecords, seed, "FINITE_ROUTE_CHOICE");
}
function scalarOptions(question: ReviewQuestion, solution: Extract<TsdCp012ExecutableSolution, { kind: "SCALAR" }>, language: TsdCp012StudioLanguage, seed: string) {
  if (solution.unit === "INDEX") return routeOptions(solution, language, seed);
  const correct = formatScalar(solution.answer, solution.unit, language);
  const wrongs = buildTsdCp012ScalarDistractors(question.input, solution);
  const records: InternalOptionAudit[] = [Object.freeze({ text: correct, isCorrect: true })];
  for (const wrong of wrongs) records.push(Object.freeze({
    text: formatScalar(wrong.value, solution.unit, language),
    isCorrect: false,
    misconceptionId: wrong.misconceptionId,
    wrongWorking: Object.freeze({ calculation: wrong.calculation }),
  }));
  return finalize(records, seed, "MISCONCEPTION_BACKED_SCALAR_REVIEW");
}
function setOptions(question: ReviewQuestion, solution: Extract<TsdCp012ExecutableSolution, { kind: "SET" }>, language: TsdCp012StudioLanguage, seed: string) {
  const correct = formatSet(solution.values, language);
  const wrongs = buildTsdCp012SetDistractors(question.input, solution);
  const records: InternalOptionAudit[] = [Object.freeze({ text: correct, isCorrect: true })];
  for (const wrong of wrongs) records.push(Object.freeze({
    text: formatSet(wrong.values, language),
    isCorrect: false,
    misconceptionId: wrong.misconceptionId,
    wrongWorking: Object.freeze({ calculation: wrong.calculation }),
  }));
  return finalize(records, seed, "MISCONCEPTION_BACKED_COMPLETE_SET_REVIEW");
}
function optionsFor(question: ReviewQuestion, language: TsdCp012StudioLanguage, seed: string) {
  return question.solution.kind === "SET"
    ? setOptions(question, question.solution, language, seed)
    : scalarOptions(question, question.solution, language, seed);
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
    const optionModel = optionsFor(question, language, `${seed}:${language}:${question.familyId}:${index}`);
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
      internalOptionAudit: optionModel.internalOptionAudit,
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
        misconceptionBackedDistractors: true,
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
