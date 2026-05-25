import type { CanonicalPercentageProblem } from "../canonical/percentage-types";
import { semanticAnswerText } from "../editorial/contextual-humanization";
import type { EditorialRealization } from "../editorial/editorial-types";
import type { LocalizedRealization } from "../localization/contracts/language-contracts";
import type { ReasoningGraph } from "../reasoning/reasoning-graph-types";
import type { ValidationResult } from "./problem-validator";

export interface PedagogicalFlowMetrics {
  pedagogicalContinuityScore: number;
  derivationVisibilityScore: number;
  shortcutBalanceScore: number;
  explanationCompletenessScore: number;
  compressionStabilityScore: number;
  collisionSuppressionScore: number;
}

const ARITHMETIC_LINE_PATTERN = /\d\s*(?:x|\/|\+|-|\^)\s*\d/u;
const TRANSITION_COLLISION_PATTERN =
  /(?:So|Thus|Hence|Therefore),\s+(?:Find|Use|Apply|Work|Convert)/iu;

function nonBlankLines(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function shortcutBlockEnd(lines: readonly string[]) {
  const start = lines.findIndex((line) =>
    /^(?:Shortcut|Direct relation|संक्षिप्त विधि|ਸੰਖੇਪ ਵਿਧੀ)/u.test(line),
  );
  if (start < 0) {
    return -1;
  }

  const blankAfter = lines.findIndex(
    (line, index) => index > start && line.trim().length === 0,
  );
  return blankAfter >= 0 ? blankAfter : start + 1;
}

function hasDerivationOutsideShortcut(text: string) {
  const rawLines = text.split("\n");
  const end = shortcutBlockEnd(rawLines);
  return rawLines.some((line, index) =>
    (end < 0 || index > end) && ARITHMETIC_LINE_PATTERN.test(line),
  );
}

function hasAnyDerivation(text: string) {
  return ARITHMETIC_LINE_PATTERN.test(text);
}

function normalizedLabel(text: string) {
  return text
    .replace(/[:=]\s*$/u, "")
    .replace(/\s+(?:is|are)$/iu, "")
    .trim()
    .toLowerCase();
}

function hasLabelDuplication(text: string) {
  const lines = nonBlankLines(text);
  return lines.some((line, index) => {
    const next = lines[index + 1];
    if (!next) {
      return false;
    }
    if (!line.endsWith(":") || !next.endsWith("=")) {
      return false;
    }
    return normalizedLabel(line) === normalizedLabel(next);
  });
}

function hasShortcutOnlyCollapse(realization: EditorialRealization) {
  return realization.naturalization.shortcutSurfaced &&
    !hasDerivationOutsideShortcut(realization.explanation);
}

function hasAbruptAnswerJump(
  problem: CanonicalPercentageProblem,
  text: string,
) {
  const lines = nonBlankLines(text);
  const numericAnswer = Number(problem.answer);
  const answerCandidates = [
    semanticAnswerText(problem),
    String(problem.answer),
    Number.isFinite(numericAnswer) ? String(Math.abs(numericAnswer)) : "",
  ].filter((candidate, index, candidates) =>
    candidate.length > 0 && candidates.indexOf(candidate) === index,
  );
  let answerIndex = -1;
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    if (answerCandidates.some((answer) => lines[index].includes(answer))) {
      answerIndex = index;
      break;
    }
  }
  if (answerIndex <= 0) {
    return true;
  }

  return !lines.slice(0, answerIndex).some((line) =>
    ARITHMETIC_LINE_PATTERN.test(line),
  );
}

function score(...issues: boolean[]) {
  return Math.max(
    0,
    100 - issues.filter(Boolean).length * 22,
  );
}

function localizedTexts(localized: readonly LocalizedRealization[] = []) {
  return localized.map((item) => item.explanation);
}

export function createPedagogicalFlowMetrics(input: {
  problem: CanonicalPercentageProblem;
  graph: ReasoningGraph;
  realization: EditorialRealization;
  localized?: readonly LocalizedRealization[];
}): PedagogicalFlowMetrics {
  const texts = [
    input.realization.explanation,
    ...localizedTexts(input.localized),
  ];
  const shortcutCollapse = hasShortcutOnlyCollapse(input.realization);
  const missingDerivation = texts.some((text) => !hasAnyDerivation(text));
  const missingDerivationOutsideShortcut =
    input.realization.naturalization.shortcutSurfaced &&
    texts.some((text) => !hasDerivationOutsideShortcut(text));
  const labelDuplication = texts.some(hasLabelDuplication);
  const transitionCollision = texts.some((text) =>
    TRANSITION_COLLISION_PATTERN.test(text),
  );
  const abruptAnswer = texts.some((text) =>
    hasAbruptAnswerJump(input.problem, text),
  );
  const lineCount = nonBlankLines(input.realization.explanation).length;
  const tooCompressed = lineCount < (input.graph.steps.length <= 2 ? 4 : 5);

  const derivationVisibilityScore = score(
    missingDerivation,
    missingDerivationOutsideShortcut,
  );
  const shortcutBalanceScore = score(shortcutCollapse);
  const explanationCompletenessScore = score(abruptAnswer, tooCompressed);
  const compressionStabilityScore = score(tooCompressed);
  const collisionSuppressionScore = score(
    labelDuplication,
    transitionCollision,
  );
  const pedagogicalContinuityScore = Math.round(
    (
      derivationVisibilityScore +
      shortcutBalanceScore +
      explanationCompletenessScore +
      compressionStabilityScore +
      collisionSuppressionScore
    ) / 5,
  );

  return {
    pedagogicalContinuityScore,
    derivationVisibilityScore,
    shortcutBalanceScore,
    explanationCompletenessScore,
    compressionStabilityScore,
    collisionSuppressionScore,
  };
}

export function validatePedagogicalFlow(input: {
  problem: CanonicalPercentageProblem;
  graph: ReasoningGraph;
  realization: EditorialRealization;
  localized?: readonly LocalizedRealization[];
}): ValidationResult {
  const issues: string[] = [];
  const metrics = createPedagogicalFlowMetrics(input);
  const texts = [
    input.realization.explanation,
    ...localizedTexts(input.localized),
  ];

  if (hasShortcutOnlyCollapse(input.realization)) {
    issues.push("Shortcut replaced the derivation instead of supporting it.");
  }
  if (texts.some((text) => !hasAnyDerivation(text))) {
    issues.push("Explanation has no visible mathematical derivation.");
  }
  if (
    input.realization.naturalization.shortcutSurfaced &&
    texts.some((text) => !hasDerivationOutsideShortcut(text))
  ) {
    issues.push("Shortcut-first explanation lacks derivation after shortcut.");
  }
  if (texts.some(hasLabelDuplication)) {
    issues.push("Explanation repeats the same semantic label before equation.");
  }
  if (texts.some((text) => TRANSITION_COLLISION_PATTERN.test(text))) {
    issues.push("Explanation contains transition/instruction collision.");
  }
  if (texts.some((text) => hasAbruptAnswerJump(input.problem, text))) {
    issues.push("Explanation jumps to answer without a visible bridge.");
  }
  if (metrics.pedagogicalContinuityScore < 78) {
    issues.push(
      `Pedagogical continuity score is too low: ${metrics.pedagogicalContinuityScore}.`,
    );
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
