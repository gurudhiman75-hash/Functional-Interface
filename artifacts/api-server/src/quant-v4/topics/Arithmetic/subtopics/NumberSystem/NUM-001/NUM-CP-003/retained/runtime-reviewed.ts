import {
  generateNumCp003RetainedQuestion as generateBase,
  NUM_CP003_RETAINED_TEMPLATE_LABELS,
  verifyRetainedAnswer,
} from "./runtime";
import type {
  NumCp003RetainedExplanation,
  NumCp003RetainedHiddenState,
  NumCp003RetainedQuestion,
  NumCp003RetainedTemplateLabel,
} from "./runtime-types";
import { polishNumCp003RetainedStem } from "../../editorial/cp003-retained-stem-style";
import { polishNumCp003Explanation } from "../../editorial/cp003-explanation-style";
import { formatStandaloneIntegersForEnglishIndia } from "../../editorial/english-stem-style";

interface DigitAssignment {
  readonly x: number;
  readonly y?: number;
}

function repairDirectDivisibilityExplanation(
  explanation: NumCp003RetainedExplanation,
  hiddenState: NumCp003RetainedHiddenState,
): NumCp003RetainedExplanation {
  if (hiddenState.kind !== "DIRECT_DIVISIBILITY") return explanation;

  const steps = hiddenState.divisorOptions.map((divisor) => {
    const quotient = hiddenState.number / divisor;
    const remainder = hiddenState.number % divisor;
    return remainder === 0n
      ? `$${hiddenState.number} \\div ${divisor} = ${quotient}$, so the remainder is 0 and the division is exact.`
      : `$${hiddenState.number} = ${divisor} \\times ${quotient} + ${remainder}$, so the remainder is ${remainder}.`;
  });
  const answer = hiddenState.divisorOptions.find((divisor) => {
    const dividesExactly = hiddenState.number % divisor === 0n;
    return hiddenState.requestedPolarity === "DIVISIBLE"
      ? dividesExactly
      : !dividesExactly;
  })!;
  const quotient = hiddenState.number / answer;
  const remainder = hiddenState.number % answer;
  const verification = remainder === 0n
    ? `$${hiddenState.number} \\div ${answer} = ${quotient}$ with remainder 0, so ${answer} divides the number exactly.`
    : `$${hiddenState.number} = ${answer} \\times ${quotient} + ${remainder}$, so ${answer} does not divide the number exactly.`;

  return {
    ...explanation,
    steps,
    verification,
  };
}

function digitAssignments(
  hiddenState: NumCp003RetainedHiddenState,
): DigitAssignment[] {
  if (hiddenState.kind === "SINGLE_DIGIT_CANDIDATE_SET") {
    return hiddenState.validDigits.map((x) => ({ x }));
  }
  if (hiddenState.kind === "ORDERED_PAIR_CANDIDATE_SET") {
    return hiddenState.validPairs.map(([x, y]) => ({ x, y }));
  }
  return [];
}

function digitSumParts(template: string): {
  readonly expanded: string;
  readonly fixed: number;
  readonly xCount: number;
  readonly yCount: number;
} {
  let fixed = 0;
  let xCount = 0;
  let yCount = 0;
  const expanded: string[] = [];
  for (const character of template) {
    if (character === "X") {
      xCount += 1;
      expanded.push("X");
    } else if (character === "Y") {
      yCount += 1;
      expanded.push("Y");
    } else {
      fixed += Number(character);
      expanded.push(character);
    }
  }
  return {
    expanded: expanded.join(" + "),
    fixed,
    xCount,
    yCount,
  };
}

function symbolicDigitSum(parts: ReturnType<typeof digitSumParts>): string {
  const terms: string[] = [];
  if (parts.fixed !== 0) terms.push(String(parts.fixed));
  if (parts.xCount === 1) terms.push("X");
  else if (parts.xCount > 1) terms.push(`${parts.xCount}X`);
  if (parts.yCount === 1) terms.push("Y");
  else if (parts.yCount > 1) terms.push(`${parts.yCount}Y`);
  return terms.length > 0 ? terms.join(" + ") : "0";
}

function substitutedDigitSum(
  parts: ReturnType<typeof digitSumParts>,
  assignment: DigitAssignment,
): string {
  const terms: string[] = [];
  if (parts.fixed !== 0) terms.push(String(parts.fixed));
  if (parts.xCount === 1) terms.push(String(assignment.x));
  else if (parts.xCount > 1) terms.push(`${parts.xCount} \\times ${assignment.x}`);
  if (parts.yCount === 1) terms.push(String(assignment.y ?? 0));
  else if (parts.yCount > 1) terms.push(`${parts.yCount} \\times ${assignment.y ?? 0}`);
  return terms.length > 0 ? terms.join(" + ") : "0";
}

function assignmentLabel(assignment: DigitAssignment): string {
  return assignment.y === undefined
    ? `X = ${assignment.x}`
    : `(X, Y) = (${assignment.x}, ${assignment.y})`;
}

function correctedDigitSumStep(
  template: string,
  divisor: number,
  assignments: readonly DigitAssignment[],
): string {
  const parts = digitSumParts(template);
  const symbolic = symbolicDigitSum(parts);
  const samples = assignments.map((assignment) => {
    const total = parts.fixed
      + parts.xCount * assignment.x
      + parts.yCount * (assignment.y ?? 0);
    return `${assignmentLabel(assignment)} gives $${substitutedDigitSum(parts, assignment)} = ${total} = ${divisor} \\times ${total / divisor}$.`;
  });
  return `For divisibility by ${divisor}, the digit sum is $${parts.expanded} = ${symbolic}$. ${samples.join(" ")}`;
}

function repairDigitSumSteps(
  explanation: NumCp003RetainedExplanation,
  hiddenState: NumCp003RetainedHiddenState,
): NumCp003RetainedExplanation {
  if (
    hiddenState.kind !== "SINGLE_DIGIT_CANDIDATE_SET"
    && hiddenState.kind !== "ORDERED_PAIR_CANDIDATE_SET"
  ) {
    return explanation;
  }
  const assignments = digitAssignments(hiddenState);
  if (assignments.length === 0) return explanation;

  return {
    ...explanation,
    steps: explanation.steps.map((step) => {
      const match = step.match(/^For divisibility by (3|9), the digit sum is /u);
      if (!match) return step;
      return correctedDigitSumStep(
        hiddenState.template,
        Number(match[1]),
        assignments,
      );
    }),
  };
}

function ensureStepStructure(
  explanation: NumCp003RetainedExplanation,
  hiddenState: NumCp003RetainedHiddenState,
): NumCp003RetainedExplanation {
  if (explanation.steps.length >= 3) return explanation;

  const opening = hiddenState.kind === "SINGLE_DIGIT_CANDIDATE_SET"
    ? "Start with the possible digits {0, 1, 2, 3, 4, 5, 6, 7, 8, 9}; exclude 0 if X is the first digit."
    : hiddenState.kind === "ORDERED_PAIR_CANDIDATE_SET"
      ? "Start with ordered digit pairs (X, Y); exclude 0 from any leading position."
      : "Write down the given condition before carrying out the calculation.";

  const steps = [opening, ...explanation.steps];
  if (steps.length < 3) {
    steps.splice(1, 0, "Apply every stated condition to the same completed number.");
  }
  return { ...explanation, steps };
}

function addNaturalLead(text: string, minimum: number, lead: string): string {
  const trimmed = text.trim();
  return trimmed.length >= minimum ? trimmed : `${lead}${trimmed}`;
}

function ensureReadableDepth(
  explanation: NumCp003RetainedExplanation,
): NumCp003RetainedExplanation {
  return {
    coreConcept: explanation.coreConcept,
    strategy: explanation.strategy,
    steps: explanation.steps.map((step) =>
      addNaturalLead(step, 16, "Now calculate: ")),
    shortcut: addNaturalLead(explanation.shortcut, 24, "Quick method: "),
    verification: addNaturalLead(
      explanation.verification,
      20,
      "This confirms the answer: ",
    ),
    conclusion: addNaturalLead(explanation.conclusion, 16, "Therefore, "),
    traps: explanation.traps.map((trap) =>
      addNaturalLead(trap, 16, "Remember: ")),
  };
}

function formatExplanationNumbers(
  explanation: NumCp003RetainedExplanation,
): NumCp003RetainedExplanation {
  const format = (text: string): string =>
    formatStandaloneIntegersForEnglishIndia(text);
  return {
    coreConcept: format(explanation.coreConcept),
    strategy: format(explanation.strategy),
    steps: explanation.steps.map(format),
    shortcut: format(explanation.shortcut),
    verification: format(explanation.verification),
    conclusion: format(explanation.conclusion),
    traps: explanation.traps.map(format),
  };
}

export { NUM_CP003_RETAINED_TEMPLATE_LABELS, verifyRetainedAnswer };

export function generateNumCp003RetainedQuestion(
  label: NumCp003RetainedTemplateLabel,
  seed: string,
): NumCp003RetainedQuestion {
  const base = generateBase(label, seed);
  const polished = polishNumCp003Explanation(
    label,
    base.explanation,
    base.hiddenState,
  );
  const directRepaired = repairDirectDivisibilityExplanation(
    polished,
    base.hiddenState,
  );
  const repaired = repairDigitSumSteps(directRepaired, base.hiddenState);
  const structured = ensureStepStructure(repaired, base.hiddenState);
  const explanation = ensureReadableDepth(structured);
  return {
    ...base,
    stem: polishNumCp003RetainedStem(label, base.stem, base.hiddenState),
    explanation: formatExplanationNumbers(explanation),
  };
}
