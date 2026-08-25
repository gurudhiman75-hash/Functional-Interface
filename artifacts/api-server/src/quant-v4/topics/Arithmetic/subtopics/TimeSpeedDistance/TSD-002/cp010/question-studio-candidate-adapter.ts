import { add, divide, multiply, rational, subtract, toMixedString, type Rational } from "../../TSD-001/foundation/rational";
import { TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW } from "./english-rendered-review-final";
import { generateTsdCp010ExecutableCases } from "./executable-generator";
import { verifyTsdCp010 } from "./executable-verifier";
import type { TsdCp010ExecutableInput, TsdCp010ExecutableSolution } from "./executable-types";
import { TSD_CP010_NATIVE_FINAL_HINDI_REVIEW, TSD_CP010_NATIVE_FINAL_PUNJABI_REVIEW } from "./localization-native-final";
import { TSD_CP010_PERMANENT_QL_IDS, type TsdCp010QlId } from "./ql-allocation";

export const TSD_CP010_STUDIO_CANDIDATE_PACKAGE_ID = "TSD-002" as const;
export const TSD_CP010_STUDIO_CANDIDATE_CHECKPOINT_ID = "TSD-CP-010" as const;
export const TSD_CP010_STUDIO_CANDIDATE_LANGUAGES = ["en", "hi", "pa"] as const;
export const TSD_CP010_STUDIO_CANDIDATE_DIFFICULTIES = ["EASY", "MEDIUM"] as const;
export const TSD_CP010_STUDIO_CANDIDATE_RUNTIME_MODE = "TSD-CP-010-MULTILINGUAL-REVIEW-CANDIDATE-v2" as const;

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
function metres(r: Rational, language: TsdCp010StudioCandidateLanguage) {
  return `${value(r)} ${language === "hi" ? "मीटर" : language === "pa" ? "ਮੀਟਰ" : "m"}`;
}
function seconds(r: Rational, language: TsdCp010StudioCandidateLanguage) {
  return `${value(r)} ${language === "hi" ? "सेकंड" : language === "pa" ? "ਸਕਿੰਟ" : "seconds"}`;
}
function speed(r: Rational, language: TsdCp010StudioCandidateLanguage) {
  return `${value(r)} ${language === "hi" ? "मीटर/सेकंड" : language === "pa" ? "ਮੀਟਰ/ਸਕਿੰਟ" : "m/s"}`;
}
function answerText(solution: TsdCp010ExecutableSolution, language: TsdCp010StudioCandidateLanguage) {
  if (solution.unit === "RATIO") return `${solution.answer.numerator}:${solution.answer.denominator}`;
  if (solution.unit === "PERCENT") return `${value(solution.answer)}%`;
  if (solution.unit === "METRE") return metres(solution.answer, language);
  if (solution.unit === "SECOND") return seconds(solution.answer, language);
  return speed(solution.answer, language);
}

function finishDistanceLead(input: Extract<TsdCp010ExecutableInput, { authorityKey: "finishDistanceLeadState" }>) {
  return subtract(input.raceDistance, multiply(input.loserSpeed, divide(input.raceDistance, input.winnerSpeed)));
}

function presentationTokens(input: TsdCp010ExecutableInput, language: TsdCp010StudioCandidateLanguage): readonly string[] {
  switch (input.authorityKey) {
    case "finishDistanceLeadState": {
      const winnerTime = divide(input.raceDistance, input.winnerSpeed);
      const lead = finishDistanceLead(input);
      return Object.freeze([
        metres(input.raceDistance, language),
        speed(input.winnerSpeed, language),
        speed(input.loserSpeed, language),
        seconds(winnerTime, language),
        metres(lead, language),
        metres(multiply(input.loserSpeed, winnerTime), language),
      ]);
    }
    case "finishTimeLeadState":
      return Object.freeze([
        metres(input.raceDistance, language),
        speed(input.winnerSpeed, language),
        speed(input.loserSpeed, language),
        seconds(divide(input.raceDistance, input.winnerSpeed), language),
        seconds(divide(input.raceDistance, input.loserSpeed), language),
      ]);
    case "raceSpeedRatioState":
      return input.mode === "DISTANCE_LEAD"
        ? Object.freeze([
            metres(input.raceDistance, language),
            metres(input.distanceLead, language),
            metres(subtract(input.raceDistance, input.distanceLead), language),
          ])
        : Object.freeze([
            seconds(input.winnerTime, language),
            seconds(input.timeLead, language),
            seconds(add(input.winnerTime, input.timeLead), language),
          ]);
    case "raceLengthFromLeadEvidence":
      return input.mode === "DISTANCE_LEAD"
        ? Object.freeze([speed(input.winnerSpeed, language), speed(input.loserSpeed, language), metres(input.distanceLead, language)])
        : Object.freeze([speed(input.winnerSpeed, language), speed(input.loserSpeed, language), seconds(input.timeLead, language)]);
    case "deadHeatHandicapState":
      return Object.freeze([metres(input.raceDistance, language), speed(input.fasterSpeed, language), speed(input.slowerSpeed, language)]);
    case "leadConversionState":
      return input.mode === "DISTANCE_TO_TIME"
        ? Object.freeze([speed(input.loserSpeed, language), metres(input.distanceLead!, language)])
        : Object.freeze([speed(input.loserSpeed, language), seconds(input.timeLead!, language)]);
    case "transitiveRaceComparison":
      return Object.freeze([metres(input.raceDistance, language), metres(input.aBeatsBBy, language), metres(input.bBeatsCBy, language)]);
    case "multiOutcomeRaceComparison":
      return Object.freeze([
        metres(input.firstRaceDistance, language),
        metres(input.firstRaceLead, language),
        metres(input.secondRaceDistance, language),
        metres(input.secondRaceHeadStartForLoser, language),
      ]);
    case "changedRaceOutcomeState":
      if (input.mode === "FASTER_SPEED_CHANGE") {
        return Object.freeze([
          metres(input.raceDistance, language),
          speed(input.fasterSpeed, language),
          speed(input.slowerSpeed, language),
          speed(input.changedFasterSpeed!, language),
          speed(subtract(input.changedFasterSpeed!, input.fasterSpeed), language),
        ]);
      }
      if (input.mode === "SLOWER_REST") {
        return Object.freeze([
          metres(input.raceDistance, language),
          speed(input.fasterSpeed, language),
          speed(input.slowerSpeed, language),
          seconds(input.slowerRestTime!, language),
        ]);
      }
      return Object.freeze([
        metres(input.raceDistance, language),
        speed(input.fasterSpeed, language),
        speed(input.slowerSpeed, language),
        seconds(input.fasterStartDelay!, language),
      ]);
    case "runnerStateFromTwoRaceOutcomes":
      return Object.freeze([
        metres(input.firstRaceDistance, language),
        metres(input.firstRaceDistanceLead, language),
        metres(input.secondRaceDistance, language),
        seconds(input.secondRaceTimeLead, language),
      ]);
  }
}

function shape(input: TsdCp010ExecutableInput): string {
  switch (input.authorityKey) {
    case "finishDistanceLeadState": return `${input.authorityKey}:${input.target}`;
    case "raceSpeedRatioState": return `${input.authorityKey}:${input.mode}`;
    case "raceLengthFromLeadEvidence": return `${input.authorityKey}:${input.mode}`;
    case "deadHeatHandicapState": return `${input.authorityKey}:${input.mode}`;
    case "leadConversionState": return `${input.authorityKey}:${input.mode}`;
    case "changedRaceOutcomeState": return `${input.authorityKey}:${input.mode}`;
    case "runnerStateFromTwoRaceOutcomes": return `${input.authorityKey}:${input.target}`;
    default: return input.authorityKey;
  }
}

function replacementPairs(
  sourceInput: TsdCp010ExecutableInput,
  candidateInput: TsdCp010ExecutableInput,
  sourceSolution: TsdCp010ExecutableSolution,
  candidateSolution: TsdCp010ExecutableSolution,
  language: TsdCp010StudioCandidateLanguage,
) {
  const sourceTokens = presentationTokens(sourceInput, language);
  const candidateTokens = presentationTokens(candidateInput, language);
  if (sourceTokens.length !== candidateTokens.length) throw new Error("CP010 presentation token shape mismatch");
  const map = new Map<string, string>();
  const addPair = (from: string, to: string) => {
    const existing = map.get(from);
    if (existing !== undefined && existing !== to) {
      throw new Error(`CP010 ambiguous numeric rebinding '${from}' -> '${existing}' / '${to}'`);
    }
    map.set(from, to);
  };
  for (let index = 0; index < sourceTokens.length; index += 1) addPair(sourceTokens[index]!, candidateTokens[index]!);
  addPair(answerText(sourceSolution, language), answerText(candidateSolution, language));
  return [...map.entries()].sort((a, b) => b[0].length - a[0].length);
}

function rebind(text: string, pairs: readonly (readonly [string, string])[]) {
  return pairs.reduce((value, [from, to]) => value.split(from).join(to), text);
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
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
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
  input: TsdCp010ExecutableInput;
  solution: TsdCp010ExecutableSolution;
}>;

function sources(language: TsdCp010StudioCandidateLanguage): readonly ReviewSource[] {
  if (language === "hi") return TSD_CP010_NATIVE_FINAL_HINDI_REVIEW as readonly ReviewSource[];
  if (language === "pa") return TSD_CP010_NATIVE_FINAL_PUNJABI_REVIEW as readonly ReviewSource[];
  return TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW as readonly ReviewSource[];
}

function qlForAuthority(authorityKey: TsdCp010ExecutableInput["authorityKey"]): TsdCp010QlId {
  const source = TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW.find((question) => question.input.authorityKey === authorityKey);
  if (!source) throw new Error(`${authorityKey}: CP010 QL mapping missing`);
  return source.qlId as TsdCp010QlId;
}

const EXECUTABLE_CASES = generateTsdCp010ExecutableCases();

function allCompatible(language: TsdCp010StudioCandidateLanguage) {
  const out: Array<Readonly<{
    qlId: TsdCp010QlId;
    familyId: string;
    caseId: string;
    difficultyBand: "EASY" | "MEDIUM";
    representation: string;
    language: TsdCp010StudioCandidateLanguage;
    locale: "en-IN" | "hi-IN" | "pa-IN";
    stem: string;
    answer: string;
    explanation: Readonly<{ steps: readonly string[]; conclusion: string }>;
    input: TsdCp010ExecutableInput;
    solution: TsdCp010ExecutableSolution;
  }>> = [];

  for (const source of sources(language)) {
    for (const candidate of EXECUTABLE_CASES) {
      if (candidate.authorityKey !== source.input.authorityKey) continue;
      if (shape(candidate.input) !== shape(source.input)) continue;
      const verification = verifyTsdCp010(candidate.input, candidate.expected);
      if (!verification.accepted) continue;
      const pairs = replacementPairs(source.input, candidate.input, source.solution, candidate.expected, language);
      const stem = rebind(source.stem, pairs);
      const explanation = Object.freeze({
        steps: Object.freeze(source.explanation.steps.map((step) => rebind(step, pairs))),
        conclusion: rebind(source.explanation.conclusion, pairs),
      });
      out.push(Object.freeze({
        qlId: qlForAuthority(candidate.authorityKey),
        familyId: source.familyId,
        caseId: candidate.caseId,
        difficultyBand: source.difficulty,
        representation: source.representation,
        language,
        locale: language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN",
        stem,
        answer: answerText(candidate.expected, language),
        explanation,
        input: candidate.input,
        solution: candidate.expected,
      }));
    }
  }

  const keys = new Set<string>();
  const stems = new Set<string>();
  for (const item of out) {
    const key = `${item.familyId}:${item.caseId}`;
    if (keys.has(key)) throw new Error(`${language}/${key}: duplicate CP010 family-case combination`);
    keys.add(key);
    if (stems.has(item.stem)) throw new Error(`${language}/${key}: duplicate learner stem after family-case recombination`);
    stems.add(item.stem);
  }
  return Object.freeze(out);
}

const ALL_BY_LANGUAGE = Object.freeze(Object.fromEntries(
  TSD_CP010_STUDIO_CANDIDATE_LANGUAGES.map((language) => [language, allCompatible(language)]),
) as Record<TsdCp010StudioCandidateLanguage, ReturnType<typeof allCompatible>>);

export const TSD_CP010_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE = ALL_BY_LANGUAGE.en.length;
export const TSD_CP010_STUDIO_MULTILINGUAL_COMBINATIONS = TSD_CP010_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE * 3;

if (TSD_CP010_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE !== 472) {
  throw new Error(`CP010 Studio capacity mismatch: expected 472/locale, got ${TSD_CP010_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE}`);
}
if (ALL_BY_LANGUAGE.hi.length !== ALL_BY_LANGUAGE.en.length || ALL_BY_LANGUAGE.pa.length !== ALL_BY_LANGUAGE.en.length) {
  throw new Error("CP010 Studio multilingual capacity mismatch");
}

export const TSD_CP010_STUDIO_CANDIDATE_PACKAGE = Object.freeze({
  packageId: TSD_CP010_STUDIO_CANDIDATE_PACKAGE_ID,
  checkpointId: TSD_CP010_STUDIO_CANDIDATE_CHECKPOINT_ID,
  runtimeMode: TSD_CP010_STUDIO_CANDIDATE_RUNTIME_MODE,
  permanentQlIds: TSD_CP010_PERMANENT_QL_IDS,
  supportedLanguages: TSD_CP010_STUDIO_CANDIDATE_LANGUAGES,
  supportedDifficulties: TSD_CP010_STUDIO_CANDIDATE_DIFFICULTIES,
  compatibleCombinationsPerLocale: TSD_CP010_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE,
  deterministicMultilingualCombinations: TSD_CP010_STUDIO_MULTILINGUAL_COMBINATIONS,
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
  optionPolicy: "EXACTLY_FOUR_UNIQUE_OPTIONS" as const,
  verificationPolicy: "EXACT_SOLVER_PLUS_INDEPENDENT_VERIFIER" as const,
  variationPolicy: "HUMAN_FAMILY_X_SEMANTICALLY_COMPATIBLE_EXECUTABLE_CASE" as const,
});

function shuffled<T>(items: readonly T[], seed: string) {
  const out = [...items];
  let state = hash(seed) || 1;
  for (let index = out.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [out[index], out[swapIndex]] = [out[swapIndex]!, out[index]!];
  }
  return out;
}

export function previewTsdCp010StudioCandidate(request: TsdCp010StudioCandidateRequest = {}) {
  const language = request.language ?? "en";
  const count = Math.max(1, Math.floor(request.count ?? 5));
  const seed = request.seed ?? "cp010-studio-candidate";
  const selected = ALL_BY_LANGUAGE[language].filter((question) =>
    (!request.qlId || question.qlId === request.qlId) &&
    (!request.familyId || question.familyId === request.familyId) &&
    (!request.difficulty || question.difficultyBand === request.difficulty));
  if (!selected.length) throw new Error("No CP010 review-candidate combinations match the requested filters.");
  if (count > selected.length) throw new Error(`Requested ${count} questions but only ${selected.length} unique CP010 candidate combinations match the filters.`);

  const questions = shuffled(selected, `${seed}:${language}`).slice(0, count).map((source, index) => {
    const verification = verifyTsdCp010(source.input, source.solution);
    if (!verification.accepted) throw new Error(`${source.familyId}/${source.caseId}: independent verifier rejected Studio candidate`);
    const optionModel = optionsFor(source.solution, language, `${seed}:${source.familyId}:${source.caseId}:${index}`);
    return Object.freeze({
      questionId: `TSD-CP010-${language}-${source.familyId}-${source.caseId.split("-").at(-1)}-${hash(`${seed}:${index}`).toString(16)}`,
      canonicalItemId: `TSD-CP010-${source.familyId}-${source.caseId.split("-").at(-1)}`,
      questionLanguageId: `TSD-CP010-${source.familyId}-${source.caseId.split("-").at(-1)}-${language}`,
      ...source,
      options: optionModel.options,
      correctIndex: optionModel.correctIndex,
      runtimeMode: TSD_CP010_STUDIO_CANDIDATE_RUNTIME_MODE,
      reviewStatus: "REVIEW_CANDIDATE_NOT_APPROVED" as const,
      questionStudioRegistrationStatus: "NOT_REGISTERED" as const,
      persistenceAllowed: false as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
      validation: Object.freeze({ exactSolverBacked: true, independentVerifierAccepted: true, fourUniqueOptions: true, semanticShapeCompatible: true }),
    });
  });

  return Object.freeze({
    package: TSD_CP010_STUDIO_CANDIDATE_PACKAGE,
    request: Object.freeze({ ...request, language, count, seed }),
    availableCombinationsUnderFilters: selected.length,
    questions: Object.freeze(questions),
  });
}
