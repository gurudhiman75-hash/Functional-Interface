import type { SerCp007EditorialQuestion } from "./adaptive-review";
import type { SerCp007AdaptiveReviewV71 } from "./adaptive-review-v7-1";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export interface SerCp007GeneratedDifficultyFactorsV8 {
  readonly taskBurden: number;
  readonly multiAnswerBurden: number;
  readonly interleavingBurden: number;
  readonly progressiveTransformationBurden: number;
  readonly activeChannelBurden: number;
  readonly lengthChangeBurden: number;
  readonly permutationBurden: number;
  readonly wraparoundBurden: number;
  readonly lowEvidenceBurden: number;
  readonly distractorProximityBurden: number;
  readonly caseSignalBurden: number;
}

export interface SerCp007GeneratedDifficultyProfileV8 {
  readonly difficulty: "EASY" | "MEDIUM" | "HARD";
  readonly score: number;
  readonly factors: SerCp007GeneratedDifficultyFactorsV8;
  readonly rowCount: number;
  readonly targetCount: number;
  readonly maximumActiveChannels: number;
  readonly distinctTransitionVectorCount: number;
  readonly usesRuleIdentityAsDifficultyInput: false;
  readonly usesMagnitudeOrTermLengthAsPrimaryInput: false;
}

function mod(value: number, base: number): number {
  return ((value % base) + base) % base;
}

function alphabetPosition(letter: string): number | null {
  const index = ALPHABET.indexOf(letter.toUpperCase());
  return index < 0 ? null : index;
}

function signedStep(from: string, to: string): number | null {
  const left = alphabetPosition(from);
  const right = alphabetPosition(to);
  if (left === null || right === null) return null;
  let delta = right - left;
  if (delta > 13) delta -= 26;
  if (delta < -13) delta += 26;
  return delta;
}

function transitionVector(from: string, to: string): readonly number[] | null {
  if (from.length !== to.length || from.length === 0) return null;
  const output: number[] = [];
  for (let index = 0; index < from.length; index += 1) {
    const step = signedStep(from[index]!, to[index]!);
    if (step === null) return null;
    output.push(step);
  }
  return output;
}

function wrapsAlphabet(from: string, vector: readonly number[]): boolean {
  return [...from].some((letter, index) => {
    const position = alphabetPosition(letter);
    const step = vector[index];
    return position !== null && step !== undefined && (position + step < 0 || position + step > 25);
  });
}

function taskBurden(taskKind: string, stem: string): number {
  switch (taskKind) {
    case "NEXT_TERM":
    case "MISSING_TERM":
      return 0;
    case "PREVIOUS_TERM":
      return 1;
    case "NEXT_TWO_TERMS":
      return 1;
    case "MISSING_TWO_TERMS":
      return 2;
    case "WRONG_TERM":
    case "REPLACE_WRONG_TERM":
      return 2;
    case "WRONG_AND_REPLACEMENT":
      return 3;
    case "FILL_GAPS":
    case "FILL_GAP_GROUPS": {
      const blankCount = (stem.match(/[_?]/g) ?? []).length;
      return blankCount >= 4 ? 3 : blankCount >= 2 ? 2 : 1;
    }
    default:
      return 1;
  }
}

function targetCount(question: SerCp007EditorialQuestion): number {
  const state = question.hiddenState;
  if (state?.answerIndexes?.length) return state.answerIndexes.length;
  if (typeof state?.answerIndex === "number") return 1;
  if (question.taskKind === "NEXT_TWO_TERMS" || question.taskKind === "MISSING_TWO_TERMS") return 2;
  if (question.taskKind === "FILL_GAPS" || question.taskKind === "FILL_GAP_GROUPS") {
    return Math.max(1, question.correctAnswer.split(/,|\s+/).filter(Boolean).length);
  }
  return 1;
}

function rowCount(review: SerCp007AdaptiveReviewV71): number {
  return review.interleavedProof?.rowCount ?? 1;
}

function rowTerms(terms: readonly string[], row: number, count: number): readonly string[] {
  const output: string[] = [];
  for (let index = row; index < terms.length; index += count) output.push(terms[index]!);
  return output;
}

function sameMultiset(left: string, right: string): boolean {
  return [...left].sort().join("") === [...right].sort().join("");
}

function levenshtein(left: string, right: string): number {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let i = 1; i <= left.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= right.length; j += 1) {
      current[j] = Math.min(
        current[j - 1]! + 1,
        previous[j]! + 1,
        previous[j - 1]! + (left[i - 1] === right[j - 1] ? 0 : 1),
      );
    }
    previous.splice(0, previous.length, ...current);
  }
  return previous[right.length]!;
}

function nearDistractorCount(question: SerCp007EditorialQuestion): number {
  return question.options.filter((option, index) => {
    if (index === question.correctIndex) return false;
    const distance = levenshtein(option, question.correctAnswer);
    const scale = Math.max(option.length, question.correctAnswer.length, 1);
    return distance <= 1 || distance / scale <= 0.2;
  }).length;
}

export function analyzeSerCp007GeneratedDifficultyV8(
  question: SerCp007EditorialQuestion,
  review: SerCp007AdaptiveReviewV71,
): SerCp007GeneratedDifficultyProfileV8 {
  const terms = question.hiddenState?.canonicalTerms ?? [];
  const rows = Math.max(1, rowCount(review));
  const vectors = new Set<string>();
  let maximumActiveChannels = 0;
  let hasWraparound = false;
  let hasPermutation = false;
  let hasProgressiveTransformation = false;

  for (let row = 0; row < rows; row += 1) {
    const values = rowTerms(terms, row, rows);
    const rowVectors = new Set<string>();
    for (let index = 0; index < values.length - 1; index += 1) {
      const from = values[index]!;
      const to = values[index + 1]!;
      if (from !== to && from.length === to.length && sameMultiset(from, to)) hasPermutation = true;
      const vector = transitionVector(from, to);
      if (!vector) continue;
      const key = vector.join(",");
      rowVectors.add(key);
      vectors.add(key);
      maximumActiveChannels = Math.max(maximumActiveChannels, vector.filter((step) => step !== 0).length);
      if (wrapsAlphabet(from, vector)) hasWraparound = true;
    }
    if (rowVectors.size > 1) hasProgressiveTransformation = true;
  }

  const lengths = new Set(terms.map((term) => term.length));
  const targets = targetCount(question);
  const evidence = review.interleavedEvidence?.observedTermsInTargetRows ?? null;
  const nearDistractors = nearDistractorCount(question);
  const hasCaseSignal = terms.some((term) => /[a-z]/.test(term));

  const factors: SerCp007GeneratedDifficultyFactorsV8 = {
    taskBurden: taskBurden(question.taskKind, question.stem),
    multiAnswerBurden: targets >= 3 ? 2 : targets === 2 ? 1 : 0,
    interleavingBurden: rows >= 4 ? 3 : rows === 3 ? 2 : rows === 2 ? 1 : 0,
    progressiveTransformationBurden: hasProgressiveTransformation ? 2 : 0,
    activeChannelBurden: maximumActiveChannels >= 3 ? 1 : 0,
    lengthChangeBurden: lengths.size > 1 ? 1 : 0,
    permutationBurden: hasPermutation ? 1 : 0,
    wraparoundBurden: hasWraparound ? 1 : 0,
    lowEvidenceBurden: evidence !== null && evidence <= 2 ? 1 : 0,
    distractorProximityBurden: nearDistractors >= 2 ? 1 : 0,
    caseSignalBurden: hasCaseSignal ? 1 : 0,
  };

  const score = Object.values(factors).reduce((sum, value) => sum + value, 0);
  const difficulty = score <= 2 ? "EASY" : score <= 5 ? "MEDIUM" : "HARD";

  return {
    difficulty,
    score,
    factors,
    rowCount: rows,
    targetCount: targets,
    maximumActiveChannels,
    distinctTransitionVectorCount: vectors.size,
    usesRuleIdentityAsDifficultyInput: false,
    usesMagnitudeOrTermLengthAsPrimaryInput: false,
  };
}
