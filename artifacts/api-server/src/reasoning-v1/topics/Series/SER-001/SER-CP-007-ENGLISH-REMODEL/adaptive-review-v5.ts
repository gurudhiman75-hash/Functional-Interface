import type { SerCp007EditorialQuestion } from "./adaptive-review";
import {
  buildAdaptiveSerCp007ReviewV4,
  type SerCp007AdaptiveReviewV4,
} from "./adaptive-review-v4";
import {
  analyzeSerCp007StructuralDepth,
  type SerCp007StructuralDepthProfile,
} from "./structural-depth";

export interface SerCp007AdaptiveReviewV5 extends SerCp007AdaptiveReviewV4 {
  readonly structuralDepth: SerCp007StructuralDepthProfile;
}

const REMODEL_TRAP = "ANSWER_LEAKAGE_PERIODIC_LAYOUT_REMOVED";

function progressionStep(question: SerCp007EditorialQuestion): number | null {
  const parameterKey = (
    question.hiddenState as { readonly parameterKey?: string } | undefined
  )?.parameterKey;
  const match = parameterKey?.match(/paired-progression:(\d+)/);
  return match ? Number(match[1]) : null;
}

function pairAction(question: SerCp007EditorialQuestion): string {
  const rotation =
    (question.hiddenState as { readonly rotationAmount?: number } | undefined)
      ?.rotationAmount ?? 0;
  switch (question.sourceRuleId) {
    case "PAIRWISE_ADJACENT_SWAP_PERMUTATION":
      return "swap the 1st and 2nd letters, the 3rd and 4th letters, and so on";
    case "FULL_REVERSAL_PERMUTATION":
      return "reverse the order of all letters";
    case "ODD_EVEN_POSITION_REORDERING":
      return "write the odd-position letters first and the even-position letters afterwards";
    case "ALPHABET_COMPLEMENT_CLUSTER":
      return "replace every letter with its alphabet opposite";
    case "ALPHABET_COMPLEMENT_WITH_ROTATION":
      return `replace every letter with its alphabet opposite, then move the first ${rotation} letter${rotation === 1 ? "" : "s"} to the end`;
    default:
      return "apply the within-pair rule";
  }
}

function answerIndex(question: SerCp007EditorialQuestion): number | null {
  if (typeof question.hiddenState?.answerIndex === "number") {
    return question.hiddenState.answerIndex;
  }
  return null;
}

function pairedWorkedSteps(
  question: SerCp007EditorialQuestion,
): readonly string[] {
  const terms = question.hiddenState?.canonicalTerms ?? [];
  const index = answerIndex(question);
  const step = progressionStep(question);
  if (terms.length !== 8 || index === null || step === null) {
    return question.explanation.steps;
  }

  const anchors = [terms[0]!, terms[2]!, terms[4]!, terms[6]!];
  const anchorIndex = index % 2 === 0 ? index : index - 1;
  const anchorNumber = anchorIndex / 2;
  const anchor = terms[anchorIndex]!;
  const partner = terms[anchorIndex + 1]!;
  const steps: string[] = [
    `First groups of the four pairs: ${anchors.join(" → ")}. Every letter moves ${step} place${step === 1 ? "" : "s"} forward from one pair to the next.`,
  ];

  if (anchorNumber > 0) {
    const previousAnchor = terms[anchorIndex - 2]!;
    steps.push(
      `${previousAnchor} → ${anchor}: move every letter ${step} place${step === 1 ? "" : "s"} forward. This fixes the first group of the required pair as ${anchor}.`,
    );
  } else {
    const nextAnchor = terms[2]!;
    steps.push(
      `${anchor} → ${nextAnchor}: moving every letter ${step} place${step === 1 ? "" : "s"} forward gives the first group of the next pair, confirming that the required first group is ${anchor}.`,
    );
  }

  steps.push(
    `${anchor} → ${partner}: ${pairAction(question)}. Therefore, the pair is ${anchor}, ${partner}.`,
  );

  if (index % 2 === 1) {
    steps.push(`The required position is the second group of this pair, so it is ${partner}.`);
  } else {
    steps.push(`The required position is the first group of this pair, so it is ${anchor}.`);
  }

  return steps;
}

function pairedDifficulty(
  question: SerCp007EditorialQuestion,
): SerCp007AdaptiveReviewV4["difficulty"] {
  return question.sourceRuleId === "ODD_EVEN_POSITION_REORDERING" ||
    question.sourceRuleId === "ALPHABET_COMPLEMENT_WITH_ROTATION"
    ? "HARD"
    : "MEDIUM";
}

function rebuildPairedReview(
  question: SerCp007EditorialQuestion,
  base: SerCp007AdaptiveReviewV4,
  workedSteps: readonly string[],
): string {
  const optionLines = base.options.map(
    (option, index) =>
      `${index === question.correctIndex ? "✓" : " "} ${index + 1}. ${option}`,
  );
  const lines = [
    base.stem,
    "",
    ...optionLines,
    "",
    `**Answer:** ${question.correctIndex + 1}. ${question.correctAnswer}`,
    "",
    "### Explanation",
    "",
    question.explanation.rule,
    "",
    "**Use the two-part pair pattern:**",
    ...workedSteps.map((step, index) => `${index + 1}. ${step}`),
    `${workedSteps.length + 1}. ${question.explanation.conclusion}`,
  ];

  if (base.renderedCheck && base.distractors[0]) {
    const visibleCheck = base.distractors[0];
    const optionIndex = base.options.indexOf(visibleCheck.value);
    lines.push(
      "",
      `**Check:** Option ${optionIndex + 1} (${visibleCheck.value}) is tempting because ${visibleCheck.learnerCheck}.`,
    );
  }

  return lines.join("\n");
}

export function buildAdaptiveSerCp007ReviewV5(
  question: SerCp007EditorialQuestion,
): SerCp007AdaptiveReviewV5 {
  const structuralDepth = analyzeSerCp007StructuralDepth(question);
  const base = buildAdaptiveSerCp007ReviewV4(question);
  const isPairedRemodel = question.explanation.trapCode === REMODEL_TRAP;

  if (!isPairedRemodel) {
    return {
      ...base,
      standardMockEligible:
        base.standardMockEligible && structuralDepth.passesStructuralDepth,
      releaseTier: structuralDepth.passesStructuralDepth
        ? base.releaseTier
        : "INTERNAL_REVIEW_ONLY",
      structuralDepth,
    };
  }

  const workedSteps = pairedWorkedSteps(question);
  return {
    ...base,
    review: rebuildPairedReview(question, base, workedSteps),
    workedSteps,
    renderedShortcut: false,
    difficulty: pairedDifficulty(question),
    standardMockEligible:
      structuralDepth.passesStructuralDepth &&
      base.maximumTermLength <= 14 &&
      base.visibleCharacterLoad <= 105,
    releaseTier:
      structuralDepth.passesStructuralDepth &&
      base.maximumTermLength <= 14 &&
      base.visibleCharacterLoad <= 105
        ? "STANDARD_MOCK"
        : "ADVANCED_PRACTICE",
    structuralDepth,
  };
}
