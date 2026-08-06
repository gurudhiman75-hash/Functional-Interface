import type { SerCp007EditorialQuestion } from "./adaptive-review";
import type { SerCp007AdaptiveReviewV6 } from "./adaptive-review-v6";
import { buildAdaptiveSerCp007ReviewV6Final } from "./adaptive-review-v6-final";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export interface SerCp007InterleavedProofTransitionV7 {
  readonly fromIndex: number;
  readonly toIndex: number;
  readonly rowIndex: number;
  readonly targetRowIndex: number;
}

export interface SerCp007InterleavedProofV7 {
  readonly rowCount: number;
  readonly targetRows: readonly number[];
  readonly transitions: readonly SerCp007InterleavedProofTransitionV7[];
  readonly passesSameRowProof: boolean;
}

export type SerCp007AdaptiveReviewV7 = SerCp007AdaptiveReviewV6 & {
  readonly conciseReview: string;
  readonly expandedReview: string;
  readonly interleavedProof: SerCp007InterleavedProofV7 | null;
  readonly explanationMode: "CONCISE_WITH_EXPANDED_HELP";
};

function mod(value: number, base: number): number {
  return ((value % base) + base) % base;
}

function positionOf(character: string): number {
  return ALPHABET.indexOf(character.toUpperCase());
}

function signedSmallStep(from: string, to: string): number {
  const left = positionOf(from);
  const right = positionOf(to);
  if (left < 0 || right < 0) return 0;
  let delta = right - left;
  if (delta > 13) delta -= 26;
  if (delta < -13) delta += 26;
  return delta;
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
  const state = question.hiddenState;
  if (state?.answerIndexes?.length) return state.answerIndexes;
  if (typeof state?.answerIndex === "number") return [state.answerIndex];
  const terms = state?.canonicalTerms ?? [];
  return question.correctAnswer
    .split(/,|→/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => terms.indexOf(part))
    .filter((index) => index >= 0);
}

function parameterKey(question: SerCp007EditorialQuestion): string {
  return (
    question.hiddenState as { readonly parameterKey?: string } | undefined
  )?.parameterKey ?? "";
}

function interleavedRowCount(sourceRuleId: string): number | null {
  switch (sourceRuleId) {
    case "TWO_INTERLEAVED_CLUSTER_ROWS":
    case "ALTERNATING_FRAME_CORE_ROWS":
    case "NEXT_TWO_INTERLEAVED_ROWS":
      return 2;
    case "THREE_INTERLEAVED_CLUSTER_ROWS":
      return 3;
    case "FOUR_INTERLEAVED_CLUSTER_ROWS":
      return 4;
    default:
      return null;
  }
}

function rowIndexes(
  termCount: number,
  rowIndex: number,
  rowCount: number,
): readonly number[] {
  const indexes: number[] = [];
  for (let index = rowIndex; index < termCount; index += rowCount) {
    indexes.push(index);
  }
  return indexes;
}

function rowLabel(rowIndex: number, rowCount: number): string {
  if (rowCount === 2) {
    return rowIndex === 0 ? "Odd-position row" : "Even-position row";
  }
  const positions = Array.from(
    { length: 4 },
    (_, index) => rowIndex + 1 + index * rowCount,
  ).join(", ");
  return `Row ${rowIndex + 1} (positions ${positions}...)`;
}

function wrapsAlphabet(from: string, step: number): boolean {
  const position = positionOf(from);
  return position >= 0 && (position + step < 0 || position + step > 25);
}

function columnLine(rowTerms: readonly string[], column: number): string {
  const letters = rowTerms.map((term) => term[column]!);
  const step = signedSmallStep(letters[0]!, letters[1]!);
  const fixed = letters.every((letter) => letter === letters[0]);
  if (fixed) {
    return `${ordinal(column)} letters: ${letters.join(" → ")} (fixed).`;
  }
  const wrap = letters
    .slice(0, -1)
    .some((letter) => wrapsAlphabet(letter, step));
  return `${ordinal(column)} letters: ${letters.join(" → ")} (${formatSigned(step)} each time${wrap ? ", with alphabet wraparound" : ""}).`;
}

function buildReview(
  question: SerCp007EditorialQuestion,
  base: SerCp007AdaptiveReviewV6,
  rule: string,
  label: string,
  steps: readonly string[],
): string {
  const optionLines = base.options.map(
    (option, index) =>
      `${index === question.correctIndex ? "✓" : " "} ${index + 1}. ${option}`,
  );
  return [
    base.stem,
    "",
    ...optionLines,
    "",
    `**Answer:** ${question.correctIndex + 1}. ${question.correctAnswer}`,
    "",
    "### Explanation",
    "",
    rule,
    "",
    `**${label}:**`,
    ...steps.map((step, index) => `${index + 1}. ${step}`),
    `${steps.length + 1}. ${question.explanation.conclusion}`,
  ].join("\n");
}

function interleavedReview(
  question: SerCp007EditorialQuestion,
  base: SerCp007AdaptiveReviewV6,
): {
  readonly concise: string;
  readonly expanded: string;
  readonly workedSteps: readonly string[];
  readonly proof: SerCp007InterleavedProofV7;
} | null {
  const rowCount = interleavedRowCount(question.sourceRuleId);
  const terms = question.hiddenState?.canonicalTerms ?? [];
  const targets = answerIndexes(question);
  if (!rowCount || terms.length < rowCount * 3 || targets.length === 0) return null;

  const targetRows = [...new Set(targets.map((index) => mod(index, rowCount)))];
  const allRows = Array.from({ length: rowCount }, (_, rowIndex) => {
    const indexes = rowIndexes(terms.length, rowIndex, rowCount);
    return {
      rowIndex,
      indexes,
      terms: indexes.map((index) => terms[index]!),
    };
  });
  const transitions: SerCp007InterleavedProofTransitionV7[] = [];
  const targetSteps: string[] = [];

  for (const targetRow of targetRows) {
    const row = allRows[targetRow]!;
    targetSteps.push(`${rowLabel(targetRow, rowCount)}: ${row.terms.join(" → ")}.`);
    const width = row.terms[0]!.length;
    for (let column = 0; column < width; column += 1) {
      targetSteps.push(columnLine(row.terms, column));
    }
    for (let local = 0; local < row.indexes.length - 1; local += 1) {
      transitions.push({
        fromIndex: row.indexes[local]!,
        toIndex: row.indexes[local + 1]!,
        rowIndex: targetRow,
        targetRowIndex: targetRow,
      });
    }
    for (const targetIndex of targets.filter(
      (index) => mod(index, rowCount) === targetRow,
    )) {
      const local = row.indexes.indexOf(targetIndex);
      const answer = terms[targetIndex]!;
      if (local > 0) {
        targetSteps.push(
          `Apply those same movements to ${row.terms[local - 1]} to obtain ${answer}.`,
        );
      } else {
        targetSteps.push(
          `${answer} is the required previous group because applying the same row movements gives ${row.terms[1]}.`,
        );
      }
    }
  }

  const allRowLines = allRows.map(
    (row) => `${rowLabel(row.rowIndex, rowCount)}: ${row.terms.join(" → ")}.`,
  );
  const expandedSteps = [
    ...allRowLines,
    ...targetSteps.filter((step) => !allRowLines.includes(step)),
  ];
  const rule =
    rowCount === 2
      ? "Separate the odd-position and even-position groups. Prove the answer only from the row containing the required position."
      : `Separate the series into ${rowCount} rows by repeating positions 1 to ${rowCount}. Prove the answer only inside its own row.`;

  return {
    concise: buildReview(
      question,
      base,
      rule,
      "Continue the target row only",
      targetSteps,
    ),
    expanded: buildReview(
      question,
      base,
      rule,
      "Expanded row check",
      expandedSteps,
    ),
    workedSteps: targetSteps,
    proof: {
      rowCount,
      targetRows,
      transitions,
      passesSameRowProof: transitions.every(
        (transition) =>
          mod(transition.fromIndex, rowCount) === transition.targetRowIndex &&
          mod(transition.toIndex, rowCount) === transition.targetRowIndex &&
          transition.rowIndex === transition.targetRowIndex,
      ),
    },
  };
}

function markerPosition(term: string): number {
  return [...term].findIndex((character) => /[a-z]/.test(character));
}

function markerReview(
  question: SerCp007EditorialQuestion,
  base: SerCp007AdaptiveReviewV6,
): {
  readonly concise: string;
  readonly steps: readonly string[];
} | null {
  if (question.sourceRuleId !== "UNIFORM_FRAME_CASE_MARKER_ROTATION") {
    return null;
  }
  const terms = question.hiddenState?.canonicalTerms ?? [];
  const targets = answerIndexes(question);
  if (terms.length < 3 || targets.length === 0) return null;
  const positions = terms.map(markerPosition);
  if (positions.some((position) => position < 0)) return null;
  const width = terms[0]!.length;
  const forward = mod(positions[1]! - positions[0]!, width);
  const signedStep = forward <= width / 2 ? forward : forward - width;
  const direction = signedStep > 0 ? "right" : "left";
  const steps: string[] = [
    `Marker positions: ${positions.map((position) => position + 1).join(" → ")}.`,
    `The lowercase marker moves ${Math.abs(signedStep)} place${Math.abs(signedStep) === 1 ? "" : "s"} to the ${direction} each time, wrapping at the end.`,
  ];
  for (const target of targets) {
    steps.push(
      `At the required group, the lowercase marker must be at position ${positions[target]! + 1}, giving ${terms[target]}.`,
    );
  }
  const rule =
    "Keep the uppercase background unchanged. Track only the position of the lowercase marker.";
  return {
    concise: buildReview(
      question,
      base,
      rule,
      "Track the marker position",
      steps,
    ),
    steps,
  };
}

function conciseProgressiveReview(
  question: SerCp007EditorialQuestion,
  base: SerCp007AdaptiveReviewV6,
): {
  readonly concise: string;
  readonly steps: readonly string[];
} | null {
  if (question.sourceRuleId !== "PROGRESSIVE_COLUMN_SHIFTS") return null;
  const terms = question.hiddenState?.canonicalTerms ?? [];
  const targets = answerIndexes(question);
  const [, firstPart, incrementPart] = parameterKey(question).split("|");
  const first = firstPart?.split(".").map(Number) ?? [];
  const increment = incrementPart?.split(".").map(Number) ?? [];
  if (terms.length < 2 || targets.length === 0 || first.length === 0) return null;
  const steps: string[] = [];
  for (const target of targets) {
    const transition = Math.max(0, target - 1);
    const jumps = first.map(
      (value, column) => value + (increment[column] ?? 0) * transition,
    );
    const previous = target > 0 ? terms[target - 1]! : terms[target]!;
    const answer = terms[target]!;
    steps.push(
      `At the required transition, the column jumps are ${jumps.map(formatSigned).join(", ")}.`,
    );
    if (target > 0) {
      steps.push(`${previous} → ${answer} using those jumps, with alphabet wraparound where needed.`);
    } else {
      steps.push(`Reverse the first set of jumps to obtain the previous group ${answer}.`);
    }
  }
  return {
    concise: buildReview(
      question,
      base,
      question.explanation.rule,
      "Use only the decisive progressive jump",
      steps,
    ),
    steps,
  };
}

function difficultyForV7(
  question: SerCp007EditorialQuestion,
  base: SerCp007AdaptiveReviewV6,
): SerCp007AdaptiveReviewV6["difficulty"] {
  if (question.sourceRuleId === "PROGRESSIVE_COLUMN_SHIFTS") return "HARD";
  if (
    question.sourceRuleId === "THREE_INTERLEAVED_CLUSTER_ROWS" ||
    question.sourceRuleId === "FOUR_INTERLEAVED_CLUSTER_ROWS"
  ) {
    return "HARD";
  }
  if (
    question.sourceRuleId === "ALPHABET_COMPLEMENT_CLUSTER" &&
    base.maximumTermLength > 5
  ) {
    return "HARD";
  }
  if (
    question.canonicalAuthorityId === "EDGE_DELETION_WORD_SEQUENCE" &&
    question.taskKind === "NEXT_TWO_TERMS"
  ) {
    return "EASY";
  }
  if (
    question.canonicalAuthorityId === "PROGRESSIVE_POSITIONAL_SUBSTITUTION" ||
    question.canonicalAuthorityId === "SYMMETRIC_EDGE_GROWTH"
  ) {
    return "MEDIUM";
  }
  return base.difficulty;
}

function releaseTierForV7(
  question: SerCp007EditorialQuestion,
  base: SerCp007AdaptiveReviewV6,
): SerCp007AdaptiveReviewV6["releaseTier"] {
  if (!base.structuralDepth.passesStructuralDepth) return "INTERNAL_REVIEW_ONLY";
  if (question.sourceRuleId === "PROGRESSIVE_COLUMN_SHIFTS") {
    return "ADVANCED_PRACTICE";
  }
  if (
    question.taskKind === "FILL_GAPS" ||
    question.taskKind === "FILL_GAP_GROUPS"
  ) {
    return base.visibleCharacterLoad <= 70
      ? "STANDARD_MOCK"
      : "ADVANCED_PRACTICE";
  }
  if (base.maximumTermLength > 10 || base.visibleCharacterLoad > 50) {
    return "ADVANCED_PRACTICE";
  }
  if (
    question.canonicalAuthorityId === "SYMMETRIC_EDGE_GROWTH" &&
    (base.maximumTermLength > 8 || base.visibleCharacterLoad > 45)
  ) {
    return "ADVANCED_PRACTICE";
  }
  return "STANDARD_MOCK";
}

export function buildAdaptiveSerCp007ReviewV7(
  question: SerCp007EditorialQuestion,
): SerCp007AdaptiveReviewV7 {
  const base = buildAdaptiveSerCp007ReviewV6Final(question);
  const interleaved = interleavedReview(question, base);
  const marker = markerReview(question, base);
  const progressive = conciseProgressiveReview(question, base);
  const conciseReview =
    interleaved?.concise ?? marker?.concise ?? progressive?.concise ?? base.review;
  const expandedReview = interleaved?.expanded ?? base.review;
  const workedSteps =
    interleaved?.workedSteps ?? marker?.steps ?? progressive?.steps ?? base.workedSteps;
  const difficulty = difficultyForV7(question, base);
  const releaseTier = releaseTierForV7(question, base);

  return {
    ...base,
    review: conciseReview,
    conciseReview,
    expandedReview,
    workedSteps,
    difficulty,
    releaseTier,
    standardMockEligible: releaseTier === "STANDARD_MOCK",
    interleavedProof: interleaved?.proof ?? null,
    explanationMode: "CONCISE_WITH_EXPANDED_HELP",
  };
}
