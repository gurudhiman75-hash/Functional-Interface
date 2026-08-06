import type { SerCp007EditorialQuestion } from "./adaptive-review";
import {
  buildAdaptiveSerCp007ReviewV5,
  type SerCp007AdaptiveReviewV5,
} from "./adaptive-review-v5";
import {
  analyzeSerCp007StructuralDepthV6,
  type SerCp007StructuralDepthProfileV6,
} from "./structural-depth-v6";

export type SerCp007AdaptiveReviewV6 = Omit<
  SerCp007AdaptiveReviewV5,
  "structuralDepth"
> & {
  readonly structuralDepth: SerCp007StructuralDepthProfileV6;
  readonly studentReleasePoolKey: string;
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function mod(value: number, base: number): number {
  return ((value % base) + base) % base;
}

function positionOf(letter: string): number {
  return ALPHABET.indexOf(letter.toUpperCase());
}

function formatSigned(value: number): string {
  if (value === 0) return "0";
  return value > 0 ? `+${value}` : String(value);
}

function ordinal(index: number): string {
  const number = index + 1;
  if (number % 10 === 1 && number % 100 !== 11) return `${number}st`;
  if (number % 10 === 2 && number % 100 !== 12) return `${number}nd`;
  if (number % 10 === 3 && number % 100 !== 13) return `${number}rd`;
  return `${number}th`;
}

function answerIndexes(question: SerCp007EditorialQuestion): readonly number[] {
  if (question.hiddenState?.answerIndexes?.length) {
    return question.hiddenState.answerIndexes;
  }
  if (typeof question.hiddenState?.answerIndex === "number") {
    return [question.hiddenState.answerIndex];
  }
  return [];
}

function parameterKey(question: SerCp007EditorialQuestion): string {
  return (
    question.hiddenState as { readonly parameterKey?: string } | undefined
  )?.parameterKey ?? "";
}

function stripUnverifiedCheck(review: string): string {
  return review
    .split("\n")
    .filter((line) => !line.startsWith("**Check:**"))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parseNumberList(value: string | undefined): readonly number[] {
  if (!value) return [];
  return value
    .split(".")
    .map(Number)
    .filter((number) => Number.isFinite(number));
}

function progressiveSteps(
  question: SerCp007EditorialQuestion,
): readonly string[] | null {
  if (question.sourceRuleId !== "PROGRESSIVE_COLUMN_SHIFTS") return null;
  const terms = question.hiddenState?.canonicalTerms ?? [];
  const [startsPart, firstPart, incrementPart] = parameterKey(question).split("|");
  const starts = parseNumberList(startsPart);
  const firstShifts = parseNumberList(firstPart);
  const increments = parseNumberList(incrementPart);
  if (
    terms.length < 2 ||
    starts.length === 0 ||
    firstShifts.length !== starts.length ||
    increments.length !== starts.length
  ) {
    return question.explanation.steps;
  }

  const rows: string[] = [];
  for (let column = 0; column < starts.length; column += 1) {
    const transitions = terms.slice(0, -1).map((term, index) => {
      const next = terms[index + 1]!;
      const jump = firstShifts[column]! + increments[column]! * index;
      const fromRank = positionOf(term[column]!);
      const wraps = fromRank + jump < 0 || fromRank + jump > 25;
      return `${term[column]}→${next[column]} (${formatSigned(jump)}${wraps ? `; wraps to ${next[column]}` : ""})`;
    });
    rows.push(`${ordinal(column)} letters: ${transitions.join(", ")}.`);
  }
  for (const index of answerIndexes(question)) {
    if (terms[index]) rows.push(`The required ${ordinal(index)} group is ${terms[index]}.`);
  }
  return rows;
}

function sequenceDirection(term: string): 1 | -1 {
  if (term.length < 2) return 1;
  const from = positionOf(term[0]!);
  const to = positionOf(term[1]!);
  return mod(to - from, 26) === 1 ? 1 : -1;
}

function skippedLetters(
  end: string,
  start: string,
  direction: 1 | -1,
): readonly string[] {
  const output: string[] = [];
  let cursor = mod(positionOf(end) + direction, 26);
  const target = positionOf(start);
  while (cursor !== target && output.length < 25) {
    output.push(ALPHABET[cursor]!);
    cursor = mod(cursor + direction, 26);
  }
  return output;
}

function consecutiveSteps(
  question: SerCp007EditorialQuestion,
): readonly string[] | null {
  if (
    question.canonicalAuthorityId !== "VARIABLE_LENGTH_CONSECUTIVE_CLUSTER" &&
    question.canonicalAuthorityId !== "GROWING_CONSECUTIVE_CLUSTER"
  ) {
    return null;
  }
  const terms = question.hiddenState?.canonicalTerms ?? [];
  if (terms.length === 0) return question.explanation.steps;
  const direction = sequenceDirection(terms[0]!);
  const directionText = direction === 1 ? "forward" : "backward";
  const steps: string[] = [
    `Lengths: ${terms.map((term) => term.length).join(", ")}.`,
    `Starting letters: ${terms.map((term) => term[0]).join(", ")}. The letters inside every group run ${directionText}.`,
  ];
  for (const index of answerIndexes(question)) {
    const answer = terms[index];
    if (!answer) continue;
    if (index > 0) {
      const previous = terms[index - 1]!;
      const skipped = skippedLetters(
        previous.at(-1)!,
        answer[0]!,
        direction,
      );
      const skipText = skipped.length > 0 ? skipped.join(" and ") : "no letters";
      steps.push(
        `${previous} ends at ${previous.at(-1)}. Moving ${directionText}, skip ${skipText}; the next group therefore starts at ${answer[0]} and contains ${answer.length} letters: ${answer}.`,
      );
    } else if (terms[1]) {
      const next = terms[1]!;
      const skipped = skippedLetters(answer.at(-1)!, next[0]!, direction);
      steps.push(
        `${answer} ends at ${answer.at(-1)}. Moving ${directionText}, skip ${skipped.join(" and ") || "no letters"} before ${next}; therefore the required previous group is ${answer}.`,
      );
    }
  }
  return steps;
}

function signedSmallStep(from: string, to: string): number {
  const left = positionOf(from);
  const right = positionOf(to);
  let delta = right - left;
  if (delta > 13) delta -= 26;
  if (delta < -13) delta += 26;
  return delta;
}

function symmetricGrowthSteps(
  question: SerCp007EditorialQuestion,
): readonly string[] | null {
  if (question.canonicalAuthorityId !== "SYMMETRIC_EDGE_GROWTH") return null;
  const terms = question.hiddenState?.canonicalTerms ?? [];
  if (terms.length < 3) return question.explanation.steps;
  const leftAdditions = terms.slice(1).map((term) => term[0]!);
  const rightAdditions = terms.slice(1).map((term) => term.at(-1)!);
  const leftStep = signedSmallStep(leftAdditions[0]!, leftAdditions[1]!);
  const rightStep = signedSmallStep(rightAdditions[0]!, rightAdditions[1]!);
  const steps: string[] = [
    `New left-edge letters: ${leftAdditions.join(" → ")} (${formatSigned(leftStep)} each time, with alphabet wraparound).`,
    `New right-edge letters: ${rightAdditions.join(" → ")} (${formatSigned(rightStep)} each time, with alphabet wraparound).`,
  ];
  for (const index of answerIndexes(question)) {
    const answer = terms[index];
    if (!answer) continue;
    if (index > 0) {
      const previous = terms[index - 1]!;
      steps.push(
        `${leftAdditions[index - 1]} + ${previous} + ${rightAdditions[index - 1]} = ${answer}.`,
      );
    }
  }
  return steps;
}

function insertionSteps(
  question: SerCp007EditorialQuestion,
): readonly string[] | null {
  if (
    question.sourceRuleId !== "CENTER_INSERTION_GROWTH" &&
    question.sourceRuleId !== "ALTERNATING_INTERIOR_INSERTION_GROWTH"
  ) {
    return null;
  }
  const state = question.hiddenState as
    | {
        readonly canonicalTerms?: readonly string[];
        readonly insertedLetters?: readonly string[];
        readonly insertionIndexes?: readonly number[];
      }
    | undefined;
  const terms = state?.canonicalTerms ?? [];
  const letters = state?.insertedLetters ?? [];
  const indexes = state?.insertionIndexes ?? [];
  if (terms.length < 2 || letters.length === 0 || indexes.length === 0) {
    return question.explanation.steps;
  }
  const step = letters.length > 1 ? signedSmallStep(letters[0]!, letters[1]!) : 0;
  const output: string[] = [
    `Inserted-letter sequence: ${letters.join(" → ")} (${formatSigned(step)} each time, with alphabet wraparound).`,
  ];
  for (const answerIndex of answerIndexes(question)) {
    if (answerIndex > 0 && terms[answerIndex]) {
      output.push(
        `${terms[answerIndex - 1]} + insert ${letters[answerIndex - 1]} at place ${indexes[answerIndex - 1]! + 1} = ${terms[answerIndex]}.`,
      );
    } else if (answerIndex === 0 && terms[1]) {
      output.push(
        `Remove ${letters[0]} from place ${indexes[0]! + 1} of ${terms[1]} to recover the previous group ${terms[0]}.`,
      );
    }
  }
  return output;
}

function rotationSteps(
  question: SerCp007EditorialQuestion,
): readonly string[] | null {
  if (
    question.sourceRuleId !== "CYCLIC_CLUSTER_ROTATION" &&
    question.sourceRuleId !== "NEXT_TWO_ROTATION"
  ) {
    return null;
  }
  const terms = question.hiddenState?.canonicalTerms ?? [];
  const rotation =
    (question.hiddenState as { readonly rotationAmount?: number } | undefined)
      ?.rotationAmount ?? 1;
  if (terms.length === 0) return question.explanation.steps;
  const order = [
    ...Array.from(
      { length: terms[0]!.length - rotation },
      (_, index) => index + rotation + 1,
    ),
    ...Array.from({ length: rotation }, (_, index) => index + 1),
  ].join(", ");
  const output: string[] = [
    `Use position order ${order}; the letters are rearranged, not changed alphabetically.`,
  ];
  for (const index of answerIndexes(question)) {
    if (index > 0 && terms[index]) {
      output.push(
        `${terms[index - 1]} → ${terms[index]}: move the first ${rotation} ${rotation === 1 ? "letter" : "letters"} to the end.`,
      );
    } else if (index === 0 && terms[1]) {
      output.push(
        `${terms[0]} must come before ${terms[1]} because the same position order changes ${terms[0]} into ${terms[1]}.`,
      );
    }
  }
  return output;
}

function customSteps(
  question: SerCp007EditorialQuestion,
): readonly string[] | null {
  return (
    progressiveSteps(question) ??
    consecutiveSteps(question) ??
    symmetricGrowthSteps(question) ??
    insertionSteps(question) ??
    rotationSteps(question)
  );
}

function customLabel(question: SerCp007EditorialQuestion): string {
  if (question.sourceRuleId === "PROGRESSIVE_COLUMN_SHIFTS") {
    return "Keep the conceptual jump progression";
  }
  if (
    question.canonicalAuthorityId === "VARIABLE_LENGTH_CONSECUTIVE_CLUSTER" ||
    question.canonicalAuthorityId === "GROWING_CONSECUTIVE_CLUSTER"
  ) {
    return "Follow the correct alphabet direction";
  }
  if (question.canonicalAuthorityId === "SYMMETRIC_EDGE_GROWTH") {
    return "Continue both edge-letter sequences";
  }
  if (
    question.sourceRuleId === "CENTER_INSERTION_GROWTH" ||
    question.sourceRuleId === "ALTERNATING_INTERIOR_INSERTION_GROWTH"
  ) {
    return "Use both insertion position and inserted-letter progression";
  }
  if (
    question.sourceRuleId === "CYCLIC_CLUSTER_ROTATION" ||
    question.sourceRuleId === "NEXT_TWO_ROTATION"
  ) {
    return "Track positions rather than alphabet values";
  }
  return "Apply the decisive rule";
}

function enhancedRule(question: SerCp007EditorialQuestion): string {
  if (question.canonicalAuthorityId === "SYMMETRIC_EDGE_GROWTH") {
    const terms = question.hiddenState?.canonicalTerms ?? [];
    if (terms.length >= 3) {
      const left = terms.slice(1).map((term) => term[0]!);
      const right = terms.slice(1).map((term) => term.at(-1)!);
      const leftStep = signedSmallStep(left[0]!, left[1]!);
      const rightStep = signedSmallStep(right[0]!, right[1]!);
      return `Keep the middle group unchanged and add one letter to each side. The new left letter moves ${formatSigned(leftStep)} each time, while the new right letter moves ${formatSigned(rightStep)} each time.`;
    }
  }
  return question.explanation.rule.replace(
    /move the first 1 letter/g,
    "move the first letter",
  );
}

function difficultyFor(
  question: SerCp007EditorialQuestion,
  base: SerCp007AdaptiveReviewV5,
): SerCp007AdaptiveReviewV5["difficulty"] {
  const simple = new Set([
    "UNIFORM_COLUMN_SHIFTS",
    "FIXED_FRONT_DELETION",
    "FIXED_END_DELETION",
    "ALTERNATING_EDGE_DELETION",
    "CYCLIC_CLUSTER_ROTATION",
    "REPEATED_BLOCK_GAPS",
    "ALTERNATING_BLOCK_GAPS",
    "REPEATED_BLOCK_MULTI_GAP_GROUPS",
    "ALTERNATING_BLOCK_MULTI_GAP_GROUPS",
  ]);
  const hard = new Set([
    "PROGRESSIVE_COLUMN_SHIFTS",
    "THREE_INTERLEAVED_CLUSTER_ROWS",
    "FOUR_INTERLEAVED_CLUSTER_ROWS",
    "ODD_EVEN_POSITION_REORDERING",
    "ALPHABET_COMPLEMENT_WITH_ROTATION",
    "PROGRESSIVE_PREFIX_SUBSTITUTION",
    "PROGRESSIVE_SUFFIX_SUBSTITUTION",
    "MOVING_PATTERN_BOUNDARY",
  ]);
  if (hard.has(question.sourceRuleId)) return "HARD";
  if (simple.has(question.sourceRuleId)) {
    return question.taskKind === "NEXT_TWO_TERMS" ? "MEDIUM" : "EASY";
  }
  if (question.explanation.trapCode === "ANSWER_LEAKAGE_PERIODIC_LAYOUT_REMOVED") {
    return base.difficulty === "HARD" ? "HARD" : "MEDIUM";
  }
  return "MEDIUM";
}

function releaseTierFor(
  structuralDepth: SerCp007StructuralDepthProfileV6,
  base: SerCp007AdaptiveReviewV5,
  question: SerCp007EditorialQuestion,
): SerCp007AdaptiveReviewV5["releaseTier"] {
  if (!structuralDepth.passesStructuralDepth) return "INTERNAL_REVIEW_ONLY";
  if (base.maximumTermLength > 14 || base.visibleCharacterLoad > 105) {
    return "ADVANCED_PRACTICE";
  }
  if (
    (question.canonicalAuthorityId ===
      "MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME" ||
      question.canonicalAuthorityId === "PROGRESSIVE_POSITIONAL_SUBSTITUTION") &&
    base.visibleCharacterLoad > 80
  ) {
    return "ADVANCED_PRACTICE";
  }
  return "STANDARD_MOCK";
}

function rebuildCustomReview(
  question: SerCp007EditorialQuestion,
  base: SerCp007AdaptiveReviewV5,
  steps: readonly string[],
): string {
  const options = base.options.map(
    (option, index) =>
      `${index === question.correctIndex ? "✓" : " "} ${index + 1}. ${option}`,
  );
  return [
    base.stem,
    "",
    ...options,
    "",
    `**Answer:** ${question.correctIndex + 1}. ${question.correctAnswer}`,
    "",
    "### Explanation",
    "",
    enhancedRule(question),
    "",
    `**${customLabel(question)}:**`,
    ...steps.map((step, index) => `${index + 1}. ${step}`),
    `${steps.length + 1}. ${question.explanation.conclusion}`,
  ].join("\n");
}

export function buildAdaptiveSerCp007ReviewV6(
  question: SerCp007EditorialQuestion,
): SerCp007AdaptiveReviewV6 {
  const base = buildAdaptiveSerCp007ReviewV5(question);
  const structuralDepth = analyzeSerCp007StructuralDepthV6(question);
  const steps = customSteps(question);
  const difficulty = difficultyFor(question, base);
  const releaseTier = releaseTierFor(structuralDepth, base, question);
  const review = steps
    ? rebuildCustomReview(question, base, steps)
    : stripUnverifiedCheck(base.review);

  return {
    ...base,
    review,
    workedSteps: steps ?? base.workedSteps,
    renderedCheck: false,
    visibleCheckRole: null,
    difficulty,
    releaseTier,
    standardMockEligible: releaseTier === "STANDARD_MOCK",
    structuralDepth,
    studentReleasePoolKey: base.stateFingerprint,
  };
}
