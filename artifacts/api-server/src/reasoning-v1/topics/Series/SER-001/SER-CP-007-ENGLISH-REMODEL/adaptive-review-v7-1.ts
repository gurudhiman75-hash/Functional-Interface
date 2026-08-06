import type { SerCp007EditorialQuestion } from "./adaptive-review";
import {
  buildAdaptiveSerCp007ReviewV7Final,
} from "./adaptive-review-v7-final";
import type { SerCp007AdaptiveReviewV7 } from "./adaptive-review-v7";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export type SerCp007ExplanationModeV71 =
  | "CONCISE_ONLY"
  | "CONCISE_WITH_SHORTCUT"
  | "CONCISE_WITH_EXPANDED_HELP"
  | "FULL_WORKED_EXPLANATION";

export type SerCp007ExamSuitabilityV71 =
  | "FOUNDATION"
  | "SSC_MTS_CHSL"
  | "SSC_CGL"
  | "BANK_PRELIMS"
  | "BANK_MAINS"
  | "PUNJAB_STATE"
  | "ADVANCED_PRACTICE";

export type SerCp007RenderingContractV71 =
  | {
      readonly kind: "CASE_MARKER";
      readonly preserveCase: true;
      readonly monospace: true;
      readonly emphasizeLowercase: "BOX_AND_UNDERLINE";
      readonly accessibleDescription: string;
    }
  | {
      readonly kind: "PERIODIC_GAP_LINE";
      readonly preserveWhitespace: true;
      readonly noWrapWithinSeries: true;
      readonly horizontalOverflow: true;
      readonly accessibleDescription: string;
    };

export interface SerCp007InterleavedEvidenceV71 {
  readonly displayedTermCount: number;
  readonly targetRows: readonly number[];
  readonly observedTermsInTargetRows: number;
  readonly usesOnlyDisplayedTermsAndAnswers: boolean;
  readonly twoSidedMissingProofs: number;
  readonly oneSidedMissingProofs: number;
}

export type SerCp007AdaptiveReviewV71 = Omit<
  SerCp007AdaptiveReviewV7,
  "explanationMode"
> & {
  readonly explanationMode: SerCp007ExplanationModeV71;
  readonly examSuitability: readonly SerCp007ExamSuitabilityV71[];
  readonly renderingContract: SerCp007RenderingContractV71 | null;
  readonly interleavedEvidence: SerCp007InterleavedEvidenceV71 | null;
};

function mod(value: number, base: number): number {
  return ((value % base) + base) % base;
}

function positionOf(character: string): number {
  return ALPHABET.indexOf(character.toUpperCase());
}

function signedStep(from: string, to: string): number {
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
  if (question.hiddenState?.answerIndexes?.length) {
    return question.hiddenState.answerIndexes;
  }
  if (typeof question.hiddenState?.answerIndex === "number") {
    return [question.hiddenState.answerIndex];
  }
  const terms = question.hiddenState?.canonicalTerms ?? [];
  return question.correctAnswer
    .split(/,|→/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => terms.indexOf(part))
    .filter((index) => index >= 0);
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

function seriesLine(stem: string): string | null {
  return [...stem.split("\n")]
    .reverse()
    .find((line) => line.includes(","))
    ?.trim() ?? null;
}

function displayedCanonicalTerms(
  question: SerCp007EditorialQuestion,
): {
  readonly terms: readonly string[];
  readonly targetIndexes: readonly number[];
} | null {
  const line = seriesLine(question.stem);
  const canonical = question.hiddenState?.canonicalTerms ?? [];
  const targets = answerIndexes(question);
  if (!line || canonical.length === 0 || targets.length === 0) return null;
  const displayed = line.split(",").map((term) => term.trim());
  if (displayed.length < 3 || displayed.length > canonical.length) return null;
  const terms = displayed.map((term, index) => {
    if (targets.includes(index) && canonical[index]) return canonical[index]!;
    return term;
  });
  return { terms, targetIndexes: targets.filter((index) => index < terms.length) };
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

function vector(from: string, to: string): readonly number[] {
  if (from.length !== to.length) return [];
  return [...from].map((letter, index) => signedStep(letter, to[index]!));
}

function equalVectors(left: readonly number[], right: readonly number[]): boolean {
  return left.length > 0 &&
    left.length === right.length &&
    left.every((value, index) => value === right[index]);
}

function threeTermColumnLines(
  first: string,
  second: string,
  third: string,
): readonly string[] {
  if (first.length !== second.length || second.length !== third.length) {
    return [`${first} → ${second} → ${third}.`];
  }
  return [...first].map((letter, index) => {
    const middle = second[index]!;
    const last = third[index]!;
    const firstStep = signedStep(letter, middle);
    const secondStep = signedStep(middle, last);
    const movement =
      firstStep === secondStep
        ? `${formatSigned(firstStep)} each time`
        : `${formatSigned(firstStep)}, then ${formatSigned(secondStep)}`;
    return `${ordinal(index)} letters: ${letter} → ${middle} → ${last} (${movement}).`;
  });
}

function buildReview(
  question: SerCp007EditorialQuestion,
  stem: string,
  rule: string,
  label: string,
  steps: readonly string[],
): string {
  const optionLines = question.options.map(
    (option, index) =>
      `${index === question.correctIndex ? "✓" : " "} ${index + 1}. ${option}`,
  );
  return [
    stem,
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

function interleavedReviewV71(
  question: SerCp007EditorialQuestion,
  stem: string,
): {
  readonly concise: string;
  readonly expanded: string;
  readonly steps: readonly string[];
  readonly evidence: SerCp007InterleavedEvidenceV71;
} | null {
  const rowCount = interleavedRowCount(question.sourceRuleId);
  const displayed = displayedCanonicalTerms(question);
  if (!rowCount || !displayed || displayed.targetIndexes.length === 0) return null;

  const targetRows = [
    ...new Set(displayed.targetIndexes.map((index) => mod(index, rowCount))),
  ];
  const conciseSteps: string[] = [];
  const expandedRowLines: string[] = [];
  let observedTerms = 0;
  let twoSided = 0;
  let oneSided = 0;

  for (let row = 0; row < rowCount; row += 1) {
    const indexes = rowIndexes(displayed.terms.length, row, rowCount);
    const values = indexes.map((index) => displayed.terms[index]!);
    expandedRowLines.push(`${rowLabel(row, rowCount)}: ${values.join(" → ")}.`);
    if (!targetRows.includes(row)) continue;

    const rowTargets = displayed.targetIndexes.filter(
      (index) => mod(index, rowCount) === row,
    );
    const targetLocals = new Set(rowTargets.map((index) => indexes.indexOf(index)));
    observedTerms += values.filter((_, local) => !targetLocals.has(local)).length;
    conciseSteps.push(`${rowLabel(row, rowCount)}: ${values.join(" → ")}.`);

    for (const targetIndex of rowTargets) {
      const local = indexes.indexOf(targetIndex);
      const answer = displayed.terms[targetIndex]!;
      const previous = local > 0 ? values[local - 1] : undefined;
      const next = local + 1 < values.length ? values[local + 1] : undefined;

      if (previous && next) {
        const left = vector(previous, answer);
        const right = vector(answer, next);
        conciseSteps.push(...threeTermColumnLines(previous, answer, next));
        conciseSteps.push(
          equalVectors(left, right)
            ? `The same movements change ${previous} to ${answer} and ${answer} to ${next}; therefore ${answer} is verified from both sides.`
            : `${previous} → ${answer} → ${next} follows the target row's stated movements; therefore the missing group is ${answer}.`,
        );
        twoSided += 1;
        continue;
      }

      if (previous && local >= 2) {
        const earlier = values[local - 2]!;
        const observedVector = vector(earlier, previous);
        const answerVector = vector(previous, answer);
        conciseSteps.push(...threeTermColumnLines(earlier, previous, answer));
        conciseSteps.push(
          equalVectors(observedVector, answerVector)
            ? `${earlier} → ${previous} establishes the movement; applying it once more gives ${answer}.`
            : `Continue the established target-row movement from ${previous} to obtain ${answer}.`,
        );
        oneSided += 1;
        continue;
      }

      if (next && local + 2 < values.length) {
        const later = values[local + 2]!;
        conciseSteps.push(...threeTermColumnLines(answer, next, later));
        conciseSteps.push(
          `${next} → ${later} establishes the row movement. Reverse that movement once to obtain the required previous group ${answer}.`,
        );
        oneSided += 1;
        continue;
      }

      conciseSteps.push(`The required position in this row is ${answer}.`);
      oneSided += 1;
    }
  }

  const rule =
    rowCount === 2
      ? "Separate the odd-position and even-position groups. Use only the displayed terms in the row containing the blank."
      : `Separate the series into ${rowCount} rows. Use only displayed terms and the proposed answer inside the target row.`;
  const concise = buildReview(
    question,
    stem,
    rule,
    "Prove the answer inside the target row",
    conciseSteps,
  );
  const expanded = buildReview(
    question,
    stem,
    rule,
    "Expanded displayed-row check",
    [
      ...expandedRowLines,
      ...conciseSteps.filter((step) => !expandedRowLines.includes(step)),
    ],
  );
  return {
    concise,
    expanded,
    steps: conciseSteps,
    evidence: {
      displayedTermCount: displayed.terms.length,
      targetRows,
      observedTermsInTargetRows: observedTerms,
      usesOnlyDisplayedTermsAndAnswers: true,
      twoSidedMissingProofs: twoSided,
      oneSidedMissingProofs: oneSided,
    },
  };
}

function explanationWordCount(review: string): number {
  const marker = review.indexOf("### Explanation");
  const explanation = marker >= 0 ? review.slice(marker) : review;
  return explanation.trim().split(/\s+/).filter(Boolean).length;
}

function explanationModeFor(
  question: SerCp007EditorialQuestion,
  base: SerCp007AdaptiveReviewV7,
  concise: string,
  expanded: string,
): SerCp007ExplanationModeV71 {
  if (expanded !== concise) return "CONCISE_WITH_EXPANDED_HELP";
  if (base.renderedShortcut) return "CONCISE_WITH_SHORTCUT";
  if (
    explanationWordCount(concise) > 110 ||
    question.sourceRuleId === "ALPHABET_COMPLEMENT_WITH_ROTATION" ||
    question.sourceRuleId === "ODD_EVEN_POSITION_REORDERING"
  ) {
    return "FULL_WORKED_EXPLANATION";
  }
  return "CONCISE_ONLY";
}

function releaseTierForV71(
  question: SerCp007EditorialQuestion,
  base: SerCp007AdaptiveReviewV7,
  displayedTermCount: number,
): SerCp007AdaptiveReviewV7["releaseTier"] {
  if (
    question.temporaryTemplateId === "SER-CP-007-TMP-014" &&
    question.seed === 2
  ) {
    return "INTERNAL_REVIEW_ONLY";
  }
  if (
    question.sourceRuleId === "FOUR_INTERLEAVED_CLUSTER_ROWS" &&
    displayedTermCount >= 15
  ) {
    return "ADVANCED_PRACTICE";
  }
  return base.releaseTier;
}

function examSuitabilityFor(
  difficulty: SerCp007AdaptiveReviewV7["difficulty"],
  releaseTier: SerCp007AdaptiveReviewV7["releaseTier"],
  maximumTermLength: number,
  visibleCharacterLoad: number,
): readonly SerCp007ExamSuitabilityV71[] {
  if (releaseTier === "INTERNAL_REVIEW_ONLY") return [];
  if (releaseTier === "ADVANCED_PRACTICE") {
    return ["SSC_CGL", "BANK_MAINS", "ADVANCED_PRACTICE"];
  }
  if (difficulty === "EASY") {
    return [
      "FOUNDATION",
      "SSC_MTS_CHSL",
      "SSC_CGL",
      "BANK_PRELIMS",
      "PUNJAB_STATE",
    ];
  }
  if (difficulty === "HARD") {
    return ["SSC_CGL", "BANK_MAINS", "PUNJAB_STATE"];
  }
  const suitability: SerCp007ExamSuitabilityV71[] = [
    "SSC_CGL",
    "BANK_PRELIMS",
    "PUNJAB_STATE",
  ];
  if (maximumTermLength <= 6 && visibleCharacterLoad <= 35) {
    suitability.unshift("SSC_MTS_CHSL");
  }
  return suitability;
}

function renderingContractFor(
  question: SerCp007EditorialQuestion,
): SerCp007RenderingContractV71 | null {
  if (question.sourceRuleId === "UNIFORM_FRAME_CASE_MARKER_ROTATION") {
    return {
      kind: "CASE_MARKER",
      preserveCase: true,
      monospace: true,
      emphasizeLowercase: "BOX_AND_UNDERLINE",
      accessibleDescription:
        "Letter case is meaningful. Announce each lowercase marker by its letter and position; never rely on colour alone.",
    };
  }
  if (
    question.taskKind === "FILL_GAPS" ||
    question.taskKind === "FILL_GAP_GROUPS"
  ) {
    return {
      kind: "PERIODIC_GAP_LINE",
      preserveWhitespace: true,
      noWrapWithinSeries: true,
      horizontalOverflow: true,
      accessibleDescription:
        "Keep the complete letter-gap line on one horizontally scrollable row so repeated block boundaries remain stable.",
    };
  }
  return null;
}

export function buildAdaptiveSerCp007ReviewV71(
  question: SerCp007EditorialQuestion,
): SerCp007AdaptiveReviewV71 {
  const base = buildAdaptiveSerCp007ReviewV7Final(question);
  const interleaved = interleavedReviewV71(question, base.stem);
  const conciseReview = interleaved?.concise ?? base.conciseReview;
  const expandedReview = interleaved?.expanded ?? base.expandedReview;
  const displayedCount =
    interleaved?.evidence.displayedTermCount ??
    (seriesLine(question.stem)?.split(",").length ?? 0);
  const releaseTier = releaseTierForV71(question, base, displayedCount);
  const explanationMode = explanationModeFor(
    question,
    base,
    conciseReview,
    expandedReview,
  );

  return {
    ...base,
    review: conciseReview,
    conciseReview,
    expandedReview,
    workedSteps: interleaved?.steps ?? base.workedSteps,
    releaseTier,
    standardMockEligible: releaseTier === "STANDARD_MOCK",
    explanationMode,
    examSuitability: examSuitabilityFor(
      base.difficulty,
      releaseTier,
      base.maximumTermLength,
      base.visibleCharacterLoad,
    ),
    renderingContract: renderingContractFor(question),
    interleavedEvidence: interleaved?.evidence ?? null,
  };
}
