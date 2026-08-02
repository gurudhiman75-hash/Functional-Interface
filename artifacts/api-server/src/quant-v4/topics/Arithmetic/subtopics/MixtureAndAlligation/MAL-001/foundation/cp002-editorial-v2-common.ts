import { reduceRationalRatio } from "./rational";
import {
  serializeMalCp002RatioVisual,
  type MalCp002RatioVisual,
  type MalCp002ReleasedQuestion,
} from "./cp002-permanent-runtime";
import { buildMalCp002Explanation, buildMalCp002Stem } from "./cp002-authoring-v2";
import type { MalCp002Context } from "./cp002-context-library";
import type {
  MalCp002ComponentId,
  MalCp002Ratio,
  MalCp002SolveRequest,
  MalCp002SolveResult,
  MalCp002State,
} from "./cp002-types";
import type { Rational } from "./types";

export const MAL_CP002_EDITORIAL_V2_ID =
  "MAL-CP002-EN-EDITORIAL-V2" as const;

export const MAL_CP002_EDITORIAL_V2 = Object.freeze({
  editorialId: MAL_CP002_EDITORIAL_V2_ID,
  baseReleaseId: "MAL-CP002-EN-v1",
  canonicalProblemId: "MAL-CP-002",
  language: "en",
  method: "CONSERVED_RATIO_PART",
  alligationAllowed: false,
  naturalExamStemAuthority: true,
  fullMathJaxWorking: true,
  reviewerStatus: "APPLIED_FROM_SENIOR_EDITORIAL_AUDIT",
});

export type Explanation = MalCp002ReleasedQuestion["explanation"];

export function hash(value: string): number {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.codePointAt(0) ?? 0;
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

export function choose(seed: string, values: readonly string[]): string {
  return values[hash(seed) % values.length]!;
}

export function latexText(value: string): string {
  return value
    .replace(/\\/gu, "\\textbackslash{}")
    .replace(/([#$%&_{}])/gu, "\\$1")
    .replace(/\^/gu, "\\textasciicircum{}")
    .replace(/~/gu, "\\textasciitilde{}");
}

export function latexNumber(value: Rational): string {
  if (value.denominator === 1n) return value.numerator.toString();
  const negative = value.numerator < 0n;
  const numerator = negative ? -value.numerator : value.numerator;
  return `${negative ? "-" : ""}\\frac{${numerator.toString()}}{${value.denominator.toString()}}`;
}

export function inlineMath(value: string): string {
  return `\\(${value}\\)`;
}

export function displayMath(value: string): string {
  return `\\[${value}\\]`;
}

export function quantityMath(
  value: Rational,
  unit: string,
  bold = false,
): string {
  const body = `${latexNumber(value)}\\,\\text{${latexText(unit)}}`;
  return inlineMath(bold ? `\\mathbf{${body}}` : body);
}

export function ratioParts(ratio: MalCp002Ratio): readonly [Rational, Rational] {
  return reduceRationalRatio(
    ratio.componentAPart,
    ratio.componentBPart,
  );
}

export function ratioMath(ratio: MalCp002Ratio): string {
  const [first, second] = ratioParts(ratio);
  return inlineMath(`${latexNumber(first)}:${latexNumber(second)}`);
}

export function arrayRatioMath(values: readonly number[]): string {
  return inlineMath(values.join(":"));
}

export function stateMath(
  state: MalCp002State,
  labels: readonly [string, string],
  unit: string,
): string {
  return `${inlineMath(
    `\\text{${latexText(labels[0])}}=${latexNumber(
      state.componentA,
    )}\\,\\text{${latexText(unit)}}`,
  )} and ${inlineMath(
    `\\text{${latexText(labels[1])}}=${latexNumber(
      state.componentB,
    )}\\,\\text{${latexText(unit)}}`,
  )}`;
}

export function componentValue(
  state: MalCp002State,
  component: MalCp002ComponentId,
): Rational {
  return component === "A" ? state.componentA : state.componentB;
}

export function otherComponent(
  component: MalCp002ComponentId,
): MalCp002ComponentId {
  return component === "A" ? "B" : "A";
}

export function labelsOf(
  question: MalCp002ReleasedQuestion,
): readonly [string, string] {
  const first = question.diagram.before[0]?.label;
  const second = question.diagram.before[1]?.label;
  if (!first || !second) {
    throw new Error(`${question.questionId}: two-component labels are missing.`);
  }
  return [first, second];
}

export function labelOf(
  labels: readonly [string, string],
  component: MalCp002ComponentId,
): string {
  return component === "A" ? labels[0] : labels[1];
}

export function contextFromQuestion(
  question: MalCp002ReleasedQuestion,
): MalCp002Context {
  const labels = labelsOf(question);
  return {
    contextId: String(
      (question.parameters as Record<string, unknown>).contextId ??
        `${question.permanentQlId}:editorial-v2`,
    ),
    actor: "",
    container:
      question.diagram.quantityUnit === "litres" ? "vessel" : "mixture",
    componentALabel: labels[0],
    componentBLabel: labels[1],
    quantityUnit: question.diagram.quantityUnit as "kg" | "litres",
    domain: "FOOD_GRADE",
  };
}

export function naturalVisual(
  visual: MalCp002RatioVisual,
): MalCp002RatioVisual {
  return {
    ...visual,
    title:
      visual.kind === "THREE_COMPONENT"
        ? "Ratio change: before and after"
        : "Conserved-part ratio method",
    operation: visual.operation
      .replace(/\bpure\s+/giu, "")
      .replace(/\bcounterpart\b/giu, "other item"),
    note: visual.note
      .replace(/\bpure\s+/giu, "")
      .replace(/\bthe counterpart\b/giu, "the other item")
      .replace(/\bcounterpart\b/giu, "other item")
      .replace(/\bunchanged component\b/giu, "item not adjusted"),
  };
}

export function explanationLines(
  explanation: Omit<Explanation, "lines">,
): string[] {
  return [
    explanation.sectionTitles.coreConcept,
    explanation.coreConcept,
    `Formula: ${explanation.formula}`,
    explanation.sectionTitles.steps,
    ...explanation.steps,
    `Quick check: ${explanation.verification}`,
    `Final answer: ${explanation.conclusion}`,
    explanation.sectionTitles.shortcut,
    serializeMalCp002RatioVisual(explanation.ratioVisual),
    explanation.examShortcut,
    explanation.sectionTitles.trap,
    explanation.commonTrap.replace(/^Common trap:\s*/u, ""),
  ];
}

export function buildExplanation(
  question: MalCp002ReleasedQuestion,
  values: Omit<Explanation, "lines" | "ratioVisual" | "layoutId" | "sectionTitles">,
): Explanation {
  const ratioVisual = naturalVisual(question.explanation.ratioVisual);
  const withoutLines: Omit<Explanation, "lines"> = {
    layoutId: "MAL-CP002-EN-FORMULA-FIRST-SVG-V1",
    sectionTitles: question.explanation.sectionTitles,
    ...values,
    ratioVisual,
  };
  return {
    ...withoutLines,
    lines: explanationLines(withoutLines),
  };
}

export function sourceEditorial(
  question: MalCp002ReleasedQuestion,
): {
  stem: string;
  explanation: Explanation;
} {
  const parameters = question.parameters as {
    request: MalCp002SolveRequest;
  };
  const context = contextFromQuestion(question);
  const stem = buildMalCp002Stem(parameters.request, context);
  const source = buildMalCp002Explanation(
    parameters.request,
    question.solution as unknown as MalCp002SolveResult,
    context,
  );
  return {
    stem,
    explanation: buildExplanation(question, {
      coreConcept: source.coreConcept,
      formula: source.formula,
      steps: source.steps,
      verification: source.verification,
      conclusion: source.conclusion,
      examShortcut: source.examShortcut,
      commonTrap: source.commonTrap,
    }),
  };
}
