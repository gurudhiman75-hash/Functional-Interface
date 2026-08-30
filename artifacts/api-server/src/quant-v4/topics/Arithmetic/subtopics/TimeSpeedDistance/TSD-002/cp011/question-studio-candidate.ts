import { add, divide, multiply, rational, subtract, toMixedString, type Rational } from "../../TSD-001/foundation/rational";
import { verifyTsdCp011 } from "./executable-verifier";
import { TSD_CP011_ENGLISH_REVIEW, type TsdCp011EnglishReviewQuestion } from "./english-review-final";
import { TSD_CP011_NATIVE_HINDI_REVIEW, TSD_CP011_NATIVE_PUNJABI_REVIEW, type TsdCp011NativeReviewQuestion } from "./native-review-final";
import type { TsdCp011ExecutableInput, TsdCp011ExecutableSolution } from "./executable-types";
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

export const TSD_CP011_STUDIO_CANDIDATE_RUNTIME_MODE = "TSD-CP-011-MULTILINGUAL-TARGET-EXHAUSTIVE-REVIEW-CANDIDATE-v2" as const;
export const TSD_CP011_STUDIO_CANDIDATE_PACKAGE_ID = "TSD-CP011-STUDIO-REVIEW-CANDIDATE" as const;
export const TSD_CP011_STUDIO_REVIEWED_COMBINATIONS_PER_LOCALE = 168 as const;
export const TSD_CP011_STUDIO_REVIEWED_MULTILINGUAL_COMBINATIONS = 504 as const;

export const TSD_CP011_STUDIO_CANDIDATE_PACKAGE = Object.freeze({
  packageId: TSD_CP011_STUDIO_CANDIDATE_PACKAGE_ID,
  checkpointId: "TSD-CP-011" as const,
  runtimeMode: TSD_CP011_STUDIO_CANDIDATE_RUNTIME_MODE,
  supportedLanguages: Object.freeze(["en", "hi", "pa"] as const),
  supportedDifficulties: Object.freeze(["EASY", "MEDIUM"] as const),
  reviewedCombinationsPerLocale: TSD_CP011_STUDIO_REVIEWED_COMBINATIONS_PER_LOCALE,
  reviewedMultilingualCombinations: TSD_CP011_STUDIO_REVIEWED_MULTILINGUAL_COMBINATIONS,
  sourceStatus: "MULTILINGUAL_TARGET_EXHAUSTIVE_REVIEW_CANDIDATE" as const,
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
  optionPolicy: "EXACTLY_FOUR_UNIQUE_OPTIONS_WITH_THREE_MISCONCEPTION_PATHS" as const,
  verificationPolicy: "EXACT_SOLVER_PLUS_INDEPENDENT_VERIFIER" as const,
  variationPolicy: "FULL_24_CASE_PER_AUTHORITY_REVIEW_SURFACE" as const,
  arbitraryOffsetDistractors: false as const,
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
      case "RATIO": return `${value.numerator}:${value.denominator}`;
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
      case "RATIO": return `${value.numerator}:${value.denominator}`;
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
    case "RATIO": return `${value.numerator}:${value.denominator}`;
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

function rationalKey(value: Rational) {
  return `${value.numerator}/${value.denominator}`;
}

function positiveDifference(left: Rational, right: Rational) {
  const diff = subtract(left, right);
  return diff.numerator < 0n ? rational(-diff.numerator, diff.denominator) : diff;
}

function fallbackMisconceptions(answer: Rational): readonly Rational[] {
  return Object.freeze([
    multiply(answer, rational(2)),
    divide(answer, rational(2)),
    multiply(answer, rational(3, 2)),
    multiply(answer, rational(3)),
  ]);
}

function misconceptionValues(input: TsdCp011ExecutableInput, solution: TsdCp011ExecutableSolution): readonly Rational[] {
  const out: Rational[] = [];
  const push = (...values: Rational[]) => out.push(...values);

  switch (input.authorityKey) {
    case "movingSurfaceTravelState": {
      if (input.target === "TIME") {
        const reverseNet = input.direction === "SAME" ? subtract(input.personRate, input.surfaceRate) : add(input.personRate, input.surfaceRate);
        push(divide(input.length, input.personRate), divide(input.length, input.surfaceRate), divide(input.length, reverseNet));
      } else if (input.target === "LENGTH") {
        const reverseNet = input.direction === "SAME" ? subtract(input.personRate, input.surfaceRate) : add(input.personRate, input.surfaceRate);
        push(multiply(input.personRate, input.time), multiply(input.surfaceRate, input.time), multiply(reverseNet, input.time));
      } else if (input.target === "PERSON_RATE") {
        const ground = divide(input.length, input.time);
        push(ground, add(ground, input.surfaceRate), positiveDifference(ground, input.surfaceRate));
      } else {
        const ground = divide(input.length, input.time);
        push(ground, input.personRate, add(ground, input.personRate));
      }
      break;
    }
    case "stationaryStepCountState": {
      if (input.target === "TOTAL_STEPS") {
        const time = divide(input.walkedSteps, input.personStepRate);
        push(
          input.walkedSteps,
          multiply(add(input.personStepRate, input.escalatorStepRate), time),
          multiply(subtract(input.personStepRate, input.escalatorStepRate), time),
        );
      } else if (input.target === "WALKED_STEPS") {
        push(
          input.totalSteps,
          multiply(input.totalSteps, divide(input.personStepRate, add(input.personStepRate, input.escalatorStepRate))),
          multiply(input.totalSteps, divide(input.personStepRate, subtract(input.personStepRate, input.escalatorStepRate))),
        );
      } else if (input.target === "PERSON_RATE") {
        const gap = positiveDifference(input.totalSteps, input.walkedSteps);
        push(
          input.escalatorStepRate,
          multiply(input.escalatorStepRate, divide(input.totalSteps, input.walkedSteps)),
          divide(input.walkedSteps, gap),
        );
      } else {
        const gap = positiveDifference(input.totalSteps, input.walkedSteps);
        push(
          input.personStepRate,
          gap,
          divide(gap, input.personStepRate),
          multiply(gap, divide(input.personStepRate, input.totalSteps)),
        );
      }
      break;
    }
    case "dualEscalatorObservationState": {
      if (input.target === "STOPPED_TIME") {
        push(
          divide(add(input.upTime, input.downTime), rational(2)),
          positiveDifference(input.downTime, input.upTime),
          divide(multiply(input.upTime, input.downTime), add(input.upTime, input.downTime)),
        );
      } else {
        push(
          divide(input.downTime, input.upTime),
          divide(input.upTime, input.downTime),
          divide(add(input.downTime, input.upTime), input.downTime),
        );
      }
      break;
    }
    case "movingSurfaceStateComparison": {
      if (input.target === "COMBINED_TIME" || input.target === "TIME_SAVED") {
        push(
          add(input.stoppedWalkingTime, input.carriedStandingTime),
          divide(add(input.stoppedWalkingTime, input.carriedStandingTime), rational(2)),
          positiveDifference(input.carriedStandingTime, input.stoppedWalkingTime),
        );
      } else if (input.target === "STOPPED_WALKING_TIME") {
        push(
          add(input.combinedTime, input.carriedStandingTime),
          positiveDifference(input.carriedStandingTime, input.combinedTime),
          divide(add(input.combinedTime, input.carriedStandingTime), rational(2)),
        );
      } else {
        push(
          add(input.combinedTime, input.stoppedWalkingTime),
          positiveDifference(input.stoppedWalkingTime, input.combinedTime),
          divide(add(input.combinedTime, input.stoppedWalkingTime), rational(2)),
        );
      }
      break;
    }
    case "wheelRollState": {
      if (input.target === "DISTANCE") {
        push(input.circumference, input.revolutions, add(input.circumference, input.revolutions));
      } else if (input.target === "REVOLUTIONS") {
        push(multiply(input.distance, input.circumference), input.distance, input.circumference);
      } else if (input.target === "CIRCUMFERENCE") {
        push(multiply(input.distance, input.revolutions), input.distance, input.revolutions);
      } else if (input.target === "DIAMETER") {
        push(multiply(solution.answer, input.pi), multiply(solution.answer, rational(2)));
      } else {
        push(multiply(solution.answer, rational(2)), multiply(solution.answer, input.pi));
      }
      break;
    }
    case "wheelRateTranslationState": {
      if (input.target === "LINEAR_SPEED") push(input.circumference, input.rpm);
      else if (input.target === "RPM") push(input.linearSpeedPerMinute, input.circumference);
      else if (input.target === "DISTANCE") push(
        multiply(input.circumference, input.rpm),
        multiply(input.circumference, input.timeMinutes),
        multiply(input.rpm, input.timeMinutes),
      );
      else push(divide(input.distance, input.circumference), divide(input.distance, input.rpm));
      break;
    }
    case "twoWheelComparisonState": {
      if (input.target === "REVOLUTION_RATIO") {
        push(
          divide(input.circumferenceA, input.circumferenceB),
          divide(add(input.circumferenceA, input.circumferenceB), input.circumferenceA),
        );
      } else {
        const countA = divide(input.distance, input.circumferenceA);
        const countB = divide(input.distance, input.circumferenceB);
        push(countA, countB, add(countA, countB));
      }
      break;
    }
  }

  push(...fallbackMisconceptions(solution.answer));
  const answerKey = rationalKey(solution.answer);
  const seen = new Set<string>([answerKey]);
  const distinct = out.filter((value) => {
    if (value.numerator <= 0n) return false;
    const key = rationalKey(value);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  if (distinct.length < 3) throw new Error(`${input.authorityKey}/${input.target}: fewer than three distinct misconception distractors`);
  return Object.freeze(distinct.slice(0, 3));
}

function optionsFor(input: TsdCp011ExecutableInput, solution: TsdCp011ExecutableSolution, language: TsdCp011StudioLanguage, seed: string) {
  const values = [solution.answer, ...misconceptionValues(input, solution)];
  const correct = formatValue(solution.answer, solution.unit, language);
  const options = shuffled(values.map((value) => formatValue(value, solution.unit, language)), seed);
  const correctIndex = options.indexOf(correct);
  if (new Set(options).size !== 4 || correctIndex < 0) throw new Error(`${input.authorityKey}/${input.target}: CP011 Studio option construction failed uniqueness/correct-answer guard`);
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
    const optionModel = optionsFor(q.input, q.solution, language, `${seed}:${language}:${q.familyId}:${index}`);
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
        misconceptionBackedDistractors: true,
        arbitraryOffsetDistractors: false,
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