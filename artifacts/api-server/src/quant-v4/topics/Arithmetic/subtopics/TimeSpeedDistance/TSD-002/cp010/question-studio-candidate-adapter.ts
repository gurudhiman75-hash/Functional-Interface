import { add, rational, toMixedString, type Rational } from "../../TSD-001/foundation/rational";
import { TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW } from "./english-rendered-review-final";
import { verifyTsdCp010 } from "./executable-verifier";
import type { TsdCp010ExecutableSolution } from "./executable-types";
import { TSD_CP010_NATIVE_FINAL_HINDI_REVIEW, TSD_CP010_NATIVE_FINAL_PUNJABI_REVIEW } from "./localization-native-final";
import { TSD_CP010_PERMANENT_QL_IDS, type TsdCp010QlId } from "./ql-allocation";

export const TSD_CP010_STUDIO_CANDIDATE_PACKAGE_ID = "TSD-002" as const;
export const TSD_CP010_STUDIO_CANDIDATE_CHECKPOINT_ID = "TSD-CP-010" as const;
export const TSD_CP010_STUDIO_CANDIDATE_LANGUAGES = ["en", "hi", "pa"] as const;
export const TSD_CP010_STUDIO_CANDIDATE_DIFFICULTIES = ["EASY", "MEDIUM"] as const;
export const TSD_CP010_STUDIO_CANDIDATE_RUNTIME_MODE = "TSD-CP-010-MULTILINGUAL-REVIEW-CANDIDATE-v1" as const;

export type TsdCp010StudioCandidateLanguage = (typeof TSD_CP010_STUDIO_CANDIDATE_LANGUAGES)[number];
export type TsdCp010StudioCandidateDifficulty = (typeof TSD_CP010_STUDIO_CANDIDATE_DIFFICULTIES)[number];

export type TsdCp010StudioCandidateRequest = Readonly<{
  language?: TsdCp010StudioCandidateLanguage;
  qlId?: TsdCp010QlId;
  familyId?: string;
  difficulty?: TsdCp010StudioCandidateDifficulty;
  count?: number;
  seed?: string;
}>;

function value(r: Rational) { return toMixedString(r); }
function answerText(solution: TsdCp010ExecutableSolution, language: TsdCp010StudioCandidateLanguage) {
  if (solution.unit === "RATIO") return `${solution.answer.numerator}:${solution.answer.denominator}`;
  if (solution.unit === "PERCENT") return `${value(solution.answer)}%`;
  if (solution.unit === "METRE") return `${value(solution.answer)} ${language === "hi" ? "मीटर" : language === "pa" ? "ਮੀਟਰ" : "m"}`;
  if (solution.unit === "SECOND") return `${value(solution.answer)} ${language === "hi" ? "सेकंड" : language === "pa" ? "ਸਕਿੰਟ" : "seconds"}`;
  return `${value(solution.answer)} ${language === "hi" ? "मीटर/सेकंड" : language === "pa" ? "ਮੀਟਰ/ਸਕਿੰਟ" : "m/s"}`;
}

function alternativeSolutions(solution: TsdCp010ExecutableSolution): readonly TsdCp010ExecutableSolution[] {
  if (solution.unit === "RATIO") {
    const n = solution.answer.numerator;
    const d = solution.answer.denominator;
    return Object.freeze([
      { ...solution, answer: rational(n + 1n, d) },
      { ...solution, answer: rational(n, d + 1n) },
      { ...solution, answer: rational(n + 2n, d + 1n) },
    ]);
  }
  const deltas = solution.answer.numerator > 2n * solution.answer.denominator ? [-2, -1, 1] : [1, 2, 3];
  return Object.freeze(deltas.map((delta) => Object.freeze({ ...solution, answer: add(solution.answer, rational(delta)) })));
}

function hash(value: string) {
  let result = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    result ^= value.charCodeAt(i);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function optionsFor(solution: TsdCp010ExecutableSolution, language: TsdCp010StudioCandidateLanguage, seed: string) {
  const values = [answerText(solution, language), ...alternativeSolutions(solution).map((x) => answerText(x, language))];
  if (new Set(values).size !== 4) throw new Error("CP010 candidate options are not unique");
  const correct = values[0]!;
  const shift = hash(seed) % 4;
  const options = values.map((_value, index) => values[(index + shift) % 4]!);
  return Object.freeze({ options: Object.freeze(options), correctIndex: options.indexOf(correct) });
}

type ReviewSource = Readonly<{
  qlId: string;
  familyId: string;
  difficulty: "EASY" | "MEDIUM";
  representation: string;
  stem: string;
  answer: string;
  explanation: Readonly<{ steps: readonly string[]; conclusion: string }>;
  input: Parameters<typeof verifyTsdCp010>[0];
  solution: TsdCp010ExecutableSolution;
}>;

function sources(language: TsdCp010StudioCandidateLanguage): readonly ReviewSource[] {
  if (language === "hi") return TSD_CP010_NATIVE_FINAL_HINDI_REVIEW as readonly ReviewSource[];
  if (language === "pa") return TSD_CP010_NATIVE_FINAL_PUNJABI_REVIEW as readonly ReviewSource[];
  return TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW as readonly ReviewSource[];
}

function shuffled<T>(items: readonly T[], seed: string) {
  const out = [...items];
  let state = hash(seed) || 1;
  for (let i = out.length - 1; i > 0; i -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

export const TSD_CP010_STUDIO_CANDIDATE_PACKAGE = Object.freeze({
  packageId: TSD_CP010_STUDIO_CANDIDATE_PACKAGE_ID,
  checkpointId: TSD_CP010_STUDIO_CANDIDATE_CHECKPOINT_ID,
  runtimeMode: TSD_CP010_STUDIO_CANDIDATE_RUNTIME_MODE,
  permanentQlIds: TSD_CP010_PERMANENT_QL_IDS,
  supportedLanguages: TSD_CP010_STUDIO_CANDIDATE_LANGUAGES,
  supportedDifficulties: TSD_CP010_STUDIO_CANDIDATE_DIFFICULTIES,
  deterministicReviewItemsPerLocale: 60,
  deterministicReviewItems: 180,
  sourceStatus: "MULTILINGUAL_REVIEW_CANDIDATE" as const,
  questionStudioRegistrationStatus: "NOT_REGISTERED" as const,
  questionStudioStagingStatus: "DISABLED_PENDING_PRODUCT_OWNER_APPROVAL" as const,
  routeMounted: false as const,
  productionSelectorVisible: false as const,
  persistenceAllowed: false as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
  mockTestEligible: false as const,
  automaticStudentPublication: false as const,
});

export function previewTsdCp010StudioCandidate(request: TsdCp010StudioCandidateRequest = {}) {
  const language = request.language ?? "en";
  const count = Math.max(1, Math.floor(request.count ?? 5));
  const seed = request.seed ?? "cp010-studio-candidate";
  const selected = sources(language).filter((question) =>
    (!request.qlId || question.qlId === request.qlId) &&
    (!request.familyId || question.familyId === request.familyId) &&
    (!request.difficulty || question.difficulty === request.difficulty));
  if (!selected.length) throw new Error("No CP010 review-candidate questions match the requested filters.");
  if (count > selected.length) throw new Error(`Requested ${count} questions but only ${selected.length} CP010 candidate items match the filters.`);
  const questions = shuffled(selected, `${seed}:${language}`).slice(0, count).map((source, index) => {
    const verification = verifyTsdCp010(source.input, source.solution);
    if (!verification.accepted) throw new Error(`${source.familyId}: independent verifier rejected Studio candidate`);
    const optionModel = optionsFor(source.solution, language, `${seed}:${source.familyId}:${index}`);
    return Object.freeze({
      questionId: `TSD-CP010-${language}-${source.familyId}-${hash(`${seed}:${index}`).toString(16)}`,
      canonicalItemId: `TSD-CP010-${source.familyId}`,
      questionLanguageId: `TSD-CP010-${source.familyId}-${language}`,
      qlId: source.qlId as TsdCp010QlId,
      familyId: source.familyId,
      difficultyBand: source.difficulty,
      representation: source.representation,
      language,
      locale: language === "hi" ? "hi-IN" as const : language === "pa" ? "pa-IN" as const : "en-IN" as const,
      stem: source.stem,
      options: optionModel.options,
      correctIndex: optionModel.correctIndex,
      answer: answerText(source.solution, language),
      explanation: source.explanation,
      input: source.input,
      solution: source.solution,
      runtimeMode: TSD_CP010_STUDIO_CANDIDATE_RUNTIME_MODE,
      reviewStatus: "REVIEW_CANDIDATE_NOT_APPROVED" as const,
      questionStudioRegistrationStatus: "NOT_REGISTERED" as const,
      persistenceAllowed: false as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
      validation: Object.freeze({ exactSolverBacked: true, independentVerifierAccepted: true, fourUniqueOptions: true }),
    });
  });
  return Object.freeze({ package: TSD_CP010_STUDIO_CANDIDATE_PACKAGE, request: Object.freeze({ ...request, language, count, seed }), availableItemsUnderFilters: selected.length, questions: Object.freeze(questions) });
}
