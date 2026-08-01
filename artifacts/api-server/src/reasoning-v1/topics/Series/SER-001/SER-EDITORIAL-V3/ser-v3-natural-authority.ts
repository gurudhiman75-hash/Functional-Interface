import {
  SER_V3_NATURAL_STANDARD_ID,
  type SerV3CompatibleQuestion,
  type SerV3NaturalExplanation,
  type SerV3NaturalQuestion,
  applySerV3NaturalExplanation as applyPedagogical,
  auditSerV3NaturalExplanation as auditPedagogical,
  buildSerV3NaturalExplanation as buildPedagogical,
} from "./ser-v3-natural-pedagogical";

export { SER_V3_NATURAL_STANDARD_ID };
export type { SerV3CompatibleQuestion, SerV3NaturalExplanation, SerV3NaturalQuestion };

interface AlphabetWrapTransition {
  readonly from: string;
  readonly fromPosition: number;
  readonly shift: number;
  readonly to: string;
  readonly toPosition: number;
}

const STANDARD_TRANSITION = /([A-Z])\((\d{1,2})\)\s*\\xrightarrow\{([+-]\d+)\}\s*([A-Z])\((\d{1,2})\)/g;

function formatLetter(letter: string, position: number): string {
  return `${letter}(${position})`;
}

function inlineMath(value: string): string {
  return `$${value}$`;
}

function wrapTransitions(explanation: SerV3NaturalExplanation): readonly AlphabetWrapTransition[] {
  const text = [explanation.corePattern, ...explanation.derivation, explanation.examSpeedShortcut].join("\n");
  const found: AlphabetWrapTransition[] = [];
  const seen = new Set<string>();

  for (const match of text.matchAll(STANDARD_TRANSITION)) {
    const transition: AlphabetWrapTransition = {
      from: match[1]!,
      fromPosition: Number(match[2]),
      shift: Number(match[3]),
      to: match[4]!,
      toPosition: Number(match[5]),
    };
    const wrappedForward = transition.shift > 0 && transition.toPosition < transition.fromPosition;
    const wrappedBackward = transition.shift < 0 && transition.toPosition > transition.fromPosition;
    if (!wrappedForward && !wrappedBackward) continue;

    const key = `${transition.from}:${transition.fromPosition}:${transition.shift}:${transition.to}:${transition.toPosition}`;
    if (seen.has(key)) continue;
    seen.add(key);
    found.push(transition);
  }

  return found;
}

function wrapArithmeticLine(transition: AlphabetWrapTransition): string {
  const arrow = inlineMath(
    `${formatLetter(transition.from, transition.fromPosition)} \\xrightarrow{${transition.shift >= 0 ? "+" : ""}${transition.shift}} ${formatLetter(transition.to, transition.toPosition)}`,
  );
  const rawPosition = transition.fromPosition + transition.shift;

  if (transition.shift > 0) {
    const cycles = Math.floor((rawPosition - 1) / 26);
    const deduction = cycles * 26;
    return `Cyclic wrap arithmetic: ${arrow} because ${inlineMath(`${transition.fromPosition}+${transition.shift}=${rawPosition}`)} and ${inlineMath(`${rawPosition}-${deduction}=${transition.toPosition}`)}.`;
  }

  const cycles = Math.ceil((1 - rawPosition) / 26);
  const addition = cycles * 26;
  return `Cyclic wrap arithmetic: ${arrow} because ${inlineMath(`${transition.fromPosition}${transition.shift}=${rawPosition}`)} and ${inlineMath(`${rawPosition}+${addition}=${transition.toPosition}`)}.`;
}

function withExplicitWrapArithmetic(explanation: SerV3NaturalExplanation): SerV3NaturalExplanation {
  const additions = wrapTransitions(explanation).map(wrapArithmeticLine);
  if (additions.length === 0) return explanation;
  return { ...explanation, derivation: [...explanation.derivation, ...additions] };
}

function previousFirstStepIsNonSpoiling(
  question: SerV3CompatibleQuestion,
  explanation: SerV3NaturalExplanation,
): boolean {
  if (question.taskKind !== "PREVIOUS_TERM") return true;
  const firstStep = explanation.derivation[0] ?? "";
  const target = String(question.hiddenState.correctReplacement);
  const targetPosition = /^[A-Z]$/.test(target) ? target.charCodeAt(0) - 64 : undefined;
  const targetArrow = targetPosition === undefined ? undefined : `${target}(${targetPosition}) \\xrightarrow`;
  return explanation.answerRevealStep >= 3
    && !/\ba_0\s*=/.test(firstStep)
    && !(targetArrow && firstStep.includes(targetArrow));
}

export function buildSerV3NaturalExplanation(question: SerV3CompatibleQuestion): SerV3NaturalExplanation {
  return withExplicitWrapArithmetic(buildPedagogical(question));
}

export function applySerV3NaturalExplanation<T extends SerV3CompatibleQuestion>(
  question: T,
): SerV3NaturalQuestion<T> {
  const enhanced = applyPedagogical(question);
  return { ...enhanced, explanationV3: buildSerV3NaturalExplanation(question) };
}

export function auditSerV3NaturalExplanation(question: SerV3CompatibleQuestion) {
  const explanation = buildSerV3NaturalExplanation(question);
  const expectedWraps = wrapTransitions(buildPedagogical(question));
  const wrapLines = explanation.derivation.filter((line) => line.startsWith("Cyclic wrap arithmetic:"));

  return [
    ...auditPedagogical(question),
    {
      name: "series-v3-strict-previous-non-spoiling",
      passed: previousFirstStepIsNonSpoiling(question, explanation),
      message: "Previous-term Step 1 must use known terms only; target derivation begins after the inverse rule is stated.",
    },
    {
      name: "series-v3-explicit-wrap-arithmetic",
      passed:
        expectedWraps.length === wrapLines.length
        && wrapLines.every((line) => /because \$-?\d+[+-]\d+=-?\d+\$ and \$-?\d+[+-]\d+=\d+\$\.$/.test(line)),
      message: "Every displayed A/Z wrap must include the exact position arithmetic that normalizes the result into 1–26.",
    },
  ];
}

export function renderSerV3NaturalReview(question: SerV3CompatibleQuestion): string {
  const enhanced = applySerV3NaturalExplanation(question);
  const optionLines = enhanced.options.map(
    (option, index) => `${index === enhanced.correctIndex ? "✓" : " "} ${String.fromCharCode(65 + index)}. ${option}`,
  );
  return [
    `## ${enhanced.temporaryTemplateId} · seed ${enhanced.seed}${enhanced.difficulty ? ` · ${enhanced.difficulty}` : ""}`,
    "",
    enhanced.stem,
    "",
    ...optionLines,
    "",
    `**Answer:** ${String.fromCharCode(65 + enhanced.correctIndex)}. ${enhanced.correctAnswer}`,
    "",
    "📌 **Core Pattern**",
    enhanced.explanationV3.corePattern,
    "",
    "📝 **Step-by-Step Derivation**",
    ...enhanced.explanationV3.derivation.map((line, index) => `${index + 1}. ${line}`),
    "",
    "⚡ **Exam Speed Shortcut**",
    enhanced.explanationV3.examSpeedShortcut,
    "",
    "⚠️ **Common Student Trap**",
    `${enhanced.explanationV3.commonTrap.warning} [${enhanced.explanationV3.commonTrap.code}]`,
    ...enhanced.explanationV3.commonTrap.optionWarnings.map((line) => `- ${line}`),
  ].join("\n");
}
