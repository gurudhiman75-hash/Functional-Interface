import {
  addRational,
  compareRational,
  divideRational,
  formatRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./rational";
import {
  serializeMalCp002RatioVisual,
  type MalCp002PermanentQlId,
} from "./cp002-permanent-runtime";
import type { MalReasoningGraph, Rational } from "./types";
import {
  runMalCp002EnglishEditorialSurfaceV2Pipeline,
  type MalCp002EditorialSurfaceV2Question,
} from "./cp002-editorial-surface-cleanup-v2";

export const MAL_CP002_EQUATION_POLISH_V2 = Object.freeze({
  equationPolishId: "MAL-CP002-EN-COMPLETE-EQUATIONS-V2",
});

type JsonRecord = Record<string, unknown>;

type EquationFields = {
  stem: string;
  coreConcept: string;
  formula: string;
  steps: string[];
  verification: string;
  conclusion: string;
  examShortcut: string;
  commonTrap: string;
};

export type MalCp002EquationPolishV2Question =
  MalCp002EditorialSurfaceV2Question & {
    editorialEquationPolishId:
      typeof MAL_CP002_EQUATION_POLISH_V2.equationPolishId;
    explanation: MalCp002EditorialSurfaceV2Question["explanation"] & {
      editorialEquationPolishId:
        typeof MAL_CP002_EQUATION_POLISH_V2.equationPolishId;
    };
    traceability: MalCp002EditorialSurfaceV2Question["traceability"] & {
      editorialEquationPolishId:
        typeof MAL_CP002_EQUATION_POLISH_V2.equationPolishId;
    };
  };

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null;
}

function record(value: unknown): JsonRecord {
  return isRecord(value) ? value : {};
}

function toRational(value: unknown, fallback = rational(0)): Rational {
  if (typeof value === "number") return rational(value);
  if (typeof value === "bigint") return rational(Number(value));
  if (typeof value === "string" && /^-?\d+$/u.test(value.trim())) {
    return rational(Number(value));
  }
  if (!isRecord(value)) return fallback;
  const numerator = value.numerator;
  const denominator = value.denominator;
  if (
    (typeof numerator !== "bigint" &&
      typeof numerator !== "number" &&
      typeof numerator !== "string") ||
    (typeof denominator !== "bigint" &&
      typeof denominator !== "number" &&
      typeof denominator !== "string")
  ) {
    return fallback;
  }
  return rational(Number(numerator), Number(denominator));
}

function parseRationalText(value: string): Rational {
  const normalized = value.trim().replace(/−/gu, "-");
  const mixed = normalized.match(/^(-?\d+)\s+(\d+)\/(\d+)$/u);
  if (mixed) {
    const whole = Number(mixed[1]);
    const numerator = Number(mixed[2]);
    const denominator = Number(mixed[3]);
    const sign = whole < 0 ? -1 : 1;
    return rational(whole * denominator + sign * numerator, denominator);
  }
  const fraction = normalized.match(/^(-?\d+)\/(\d+)$/u);
  if (fraction) return rational(Number(fraction[1]), Number(fraction[2]));
  return rational(Number(normalized));
}

function latexNumber(value: string): string {
  const normalized = value.trim().replace(/−/gu, "-");
  const mixed = normalized.match(/^(-?\d+)\s+(\d+)\/(\d+)$/u);
  if (mixed) return `${mixed[1]}\\frac{${mixed[2]}}{${mixed[3]}}`;
  const fraction = normalized.match(/^(-?\d+)\/(\d+)$/u);
  if (fraction) return `\\frac{${fraction[1]}}{${fraction[2]}}`;
  return normalized;
}

function rationalLatex(value: Rational): string {
  return latexNumber(formatRational(value));
}

function equation(value: string): string {
  return `$${value}$`;
}

function boldEquation(value: string): string {
  return `$\\mathbf{${value}}$`;
}

function mathQuantity(
  value: Rational,
  unit: string,
  bold = false,
): string {
  const body = `${rationalLatex(value)}\\,\\text{${unit}}`;
  return bold ? `$\\mathbf{${body}}$` : `$${body}$`;
}

function mathRatio(parts: readonly Rational[]): string {
  return `$${parts.map(rationalLatex).join(" : ")}$`;
}

function capitalize(value: string): string {
  return value ? `${value[0]!.toUpperCase()}${value.slice(1)}` : value;
}

function visualQuantity(value: string): Rational {
  return parseRationalText(value);
}

function changedIndex(
  question: MalCp002EditorialSurfaceV2Question,
): 0 | 1 {
  return question.diagram.before[0]!.quantity ===
    question.diagram.after[0]!.quantity
    ? 1
    : 0;
}

function absoluteDifference(first: Rational, second: Rational): Rational {
  return compareRational(first, second) >= 0
    ? subtractRational(first, second)
    : subtractRational(second, first);
}

function forwardChangeFields(
  question: MalCp002EditorialSurfaceV2Question,
  action: "addition" | "removal",
): EquationFields {
  const unit = question.diagram.quantityUnit;
  const before = question.diagram.before;
  const after = question.diagram.after;
  const changed = changedIndex(question);
  const other = changed === 0 ? 1 : 0;
  const initialChanged = visualQuantity(before[changed]!.quantity);
  const finalChanged = visualQuantity(after[changed]!.quantity);
  const otherQuantity = visualQuantity(before[other]!.quantity);
  const amount = absoluteDifference(initialChanged, finalChanged);
  const finalParts = question.diagram.afterRatio
    .split(":")
    .map((part) => parseRationalText(part));
  const finalValues = after.map((item) => visualQuantity(item.quantity));
  const sign = action === "addition" ? "+" : "-";
  const actionVerb = action === "addition" ? "added" : "removed";
  return {
    stem: question.stem,
    coreConcept: `Only ${before[changed]!.label} changes. The quantity of ${before[other]!.label} remains ${mathQuantity(otherQuantity, unit)}.`,
    formula: `${equation(`\\text{new ${before[changed]!.label}}=\\text{initial ${before[changed]!.label}}${sign}\\text{stated quantity}`)}; then reduce the final pair.`,
    steps: [
      `Step 1: Initial quantities are ${mathQuantity(visualQuantity(before[0]!.quantity), unit)} of ${before[0]!.label} and ${mathQuantity(visualQuantity(before[1]!.quantity), unit)} of ${before[1]!.label}.`,
      `Step 2: New ${before[changed]!.label} ${equation(`=${rationalLatex(initialChanged)}${sign}${rationalLatex(amount)}=${rationalLatex(finalChanged)}\\,\\text{${unit}}`)}.`,
      `Step 3: ${capitalize(before[other]!.label)} remains ${mathQuantity(otherQuantity, unit)}.`,
      `Step 4: Final ratio ${equation(`=${rationalLatex(finalValues[0]!)}:${rationalLatex(finalValues[1]!)}=${finalParts.map(rationalLatex).join(":")}`)}.`,
    ],
    verification: `The stated ${mathQuantity(amount, unit)} is ${actionVerb} from ${before[changed]!.label} only; the final quantities give ${mathRatio(finalParts)}.`,
    conclusion: `The resulting ratio is ${boldEquation(finalParts.map(rationalLatex).join(" : "))}.`,
    examShortcut: `Update ${before[changed]!.label} once, keep ${before[other]!.label} at the same quantity, and reduce the final pair.`,
    commonTrap: `Do not ${action === "addition" ? "add" : "subtract"} the stated quantity on both sides of the ratio. Only ${before[changed]!.label} changes.`,
  };
}

function reverseChangeFields(
  question: MalCp002EditorialSurfaceV2Question,
  priorAction: "addition" | "removal",
): EquationFields {
  const unit = question.diagram.quantityUnit;
  const original = question.diagram.before;
  const final = question.diagram.after;
  const changed = changedIndex(question);
  const other = changed === 0 ? 1 : 0;
  const originalChanged = visualQuantity(original[changed]!.quantity);
  const finalChanged = visualQuantity(final[changed]!.quantity);
  const otherQuantity = visualQuantity(original[other]!.quantity);
  const amount = absoluteDifference(originalChanged, finalChanged);
  const originalValues = original.map((item) => visualQuantity(item.quantity));
  const originalParts = question.diagram.beforeRatio
    .split(":")
    .map((part) => parseRationalText(part));
  const undoSign = priorAction === "addition" ? "-" : "+";
  const replaySign = priorAction === "addition" ? "+" : "-";
  return {
    stem: question.stem,
    coreConcept: `Undo the stated ${priorAction} on ${original[changed]!.label}. The quantity of ${original[other]!.label} is the same before and after.`,
    formula: `${equation(`\\text{original ${original[changed]!.label}}=\\text{final ${original[changed]!.label}}${undoSign}\\text{stated quantity}`)}.`,
    steps: [
      `Step 1: Final quantities are ${mathQuantity(visualQuantity(final[0]!.quantity), unit)} of ${final[0]!.label} and ${mathQuantity(visualQuantity(final[1]!.quantity), unit)} of ${final[1]!.label}.`,
      `Step 2: Original ${original[changed]!.label} ${equation(`=${rationalLatex(finalChanged)}${undoSign}${rationalLatex(amount)}=${rationalLatex(originalChanged)}\\,\\text{${unit}}`)}.`,
      `Step 3: ${capitalize(original[other]!.label)} remains ${mathQuantity(otherQuantity, unit)}.`,
      `Step 4: Original ratio ${equation(`=${rationalLatex(originalValues[0]!)}:${rationalLatex(originalValues[1]!)}=${originalParts.map(rationalLatex).join(":")}`)}.`,
    ],
    verification: `Reapplying the ${priorAction} gives ${equation(`${rationalLatex(originalChanged)}${replaySign}${rationalLatex(amount)}=${rationalLatex(finalChanged)}\\,\\text{${unit}}`)}, which reproduces the stated final quantity of ${original[changed]!.label}.`,
    conclusion: `The original ratio was ${boldEquation(originalParts.map(rationalLatex).join(" : "))}.`,
    examShortcut: `Reverse the operation on ${original[changed]!.label} only, then reduce the reconstructed pair.`,
    commonTrap: `Do not reverse the operation on ${original[other]!.label}; its quantity never changed.`,
  };
}

function oneKnownItemFields(
  question: MalCp002EditorialSurfaceV2Question,
): EquationFields {
  const unit = question.diagram.quantityUnit;
  const params = record(question.parameters);
  const known = params.knownComponent === "B" ? 1 : 0;
  const other = known === 0 ? 1 : 0;
  const partsRecord = record(params.ratio);
  const parts = [
    toRational(partsRecord.componentAPart, rational(1)),
    toRational(partsRecord.componentBPart, rational(1)),
  ] as const;
  const knownQuantity = toRational(params.knownQuantity);
  const solved = record(question.solution);
  const otherQuantity = toRational(solved.otherQuantity);
  const onePart = divideRational(knownQuantity, parts[known]);
  const labels = question.diagram.before.map((item) => item.label);
  const fullValues = [
    known === 0 ? knownQuantity : otherQuantity,
    known === 1 ? knownQuantity : otherQuantity,
  ] as const;
  return {
    stem: question.stem,
    coreConcept: `${capitalize(labels[known]!)} fixes the value of one ratio part. Divide its quantity by its number of parts, then multiply by the parts belonging to ${labels[other]}.`,
    formula: `${equation(`\\text{one part}=\\dfrac{\\text{known quantity}}{\\text{known ratio part}}`)} and ${equation(`\\text{required quantity}=\\text{required parts}\\times\\text{one part}`)}.`,
    steps: [
      `Step 1: In the ratio ${mathRatio(parts)}, ${labels[known]} represents ${mathQuantity(parts[known], "parts").replace("\\,\\text{parts}", "\\,\\text{parts}")}.`,
      `Step 2: One part ${equation(`=\\dfrac{${rationalLatex(knownQuantity)}}{${rationalLatex(parts[known])}}=${rationalLatex(onePart)}\\,\\text{${unit}}`)}.`,
      `Step 3: ${capitalize(labels[other]!)} represents ${equation(`${rationalLatex(parts[other])}\\,\\text{parts}`)}.`,
      `Step 4: ${capitalize(labels[other]!)} quantity ${equation(`=${rationalLatex(parts[other])}\\times${rationalLatex(onePart)}=${rationalLatex(otherQuantity)}\\,\\text{${unit}}`)}.`,
    ],
    verification: `${mathRatio(fullValues)} reduces to ${mathRatio(parts)}.`,
    conclusion: `The quantity of ${labels[other]} is ${mathQuantity(otherQuantity, unit, true)}.`,
    examShortcut: `Known quantity ÷ known parts × required parts.`,
    commonTrap: `Match each item with the correct side of the ratio; reversing the parts reverses the answer.`,
  };
}

function fieldsFor(
  question: MalCp002EditorialSurfaceV2Question,
): EquationFields | null {
  switch (question.traceability.familyId) {
    case "RATIO_AFTER_PURE_ADDITION":
      return forwardChangeFields(question, "addition");
    case "RATIO_AFTER_PURE_REMOVAL":
      return forwardChangeFields(question, "removal");
    case "ORIGINAL_RATIO_BEFORE_ADDITION":
      return reverseChangeFields(question, "addition");
    case "ORIGINAL_RATIO_BEFORE_REMOVAL":
      return reverseChangeFields(question, "removal");
    case "OTHER_COMPONENT_FROM_ONE_COMPONENT_AND_RATIO":
      return oneKnownItemFields(question);
    default:
      return null;
  }
}

function reasoningGraph(fields: EquationFields): MalReasoningGraph {
  const nodes: MalReasoningGraph["nodes"] = [
    { id: "given", kind: "GIVEN", text: fields.stem, dependsOn: [] },
    {
      id: "method",
      kind: "RELATION",
      text: fields.coreConcept,
      dependsOn: ["given"],
    },
  ];
  fields.steps.forEach((text, index) => {
    nodes.push({
      id: `step-${index + 1}`,
      kind: "DERIVATION",
      text,
      dependsOn: [index === 0 ? "method" : `step-${index}`],
    });
  });
  nodes.push({
    id: "verification",
    kind: "VERIFICATION",
    text: fields.verification,
    dependsOn: [`step-${fields.steps.length}`],
  });
  nodes.push({
    id: "conclusion",
    kind: "CONCLUSION",
    text: fields.conclusion,
    dependsOn: ["verification"],
  });
  return { nodes };
}

function explanationLines(
  question: MalCp002EditorialSurfaceV2Question,
  fields: EquationFields,
): string[] {
  return [
    question.explanation.sectionTitles.coreConcept,
    fields.coreConcept,
    `Formula: ${fields.formula}`,
    question.explanation.sectionTitles.steps,
    ...fields.steps,
    `Quick check: ${fields.verification}`,
    `Final answer: ${fields.conclusion}`,
    question.explanation.sectionTitles.shortcut,
    serializeMalCp002RatioVisual(question.diagram),
    fields.examShortcut,
    question.explanation.sectionTitles.trap,
    fields.commonTrap,
  ];
}

export function applyMalCp002EquationPolishV2(
  question: MalCp002EditorialSurfaceV2Question,
): MalCp002EquationPolishV2Question {
  const fields = fieldsFor(question);
  if (!fields) {
    return {
      ...question,
      editorialEquationPolishId:
        MAL_CP002_EQUATION_POLISH_V2.equationPolishId,
      explanation: {
        ...question.explanation,
        editorialEquationPolishId:
          MAL_CP002_EQUATION_POLISH_V2.equationPolishId,
      },
      traceability: {
        ...question.traceability,
        editorialEquationPolishId:
          MAL_CP002_EQUATION_POLISH_V2.equationPolishId,
      },
    } as MalCp002EquationPolishV2Question;
  }

  const explanationBase = {
    ...question.explanation,
    editorialEquationPolishId:
      MAL_CP002_EQUATION_POLISH_V2.equationPolishId,
    coreConcept: fields.coreConcept,
    formula: fields.formula,
    steps: fields.steps,
    verification: fields.verification,
    conclusion: fields.conclusion,
    examShortcut: fields.examShortcut,
    commonTrap: fields.commonTrap,
  };
  return {
    ...question,
    editorialEquationPolishId:
      MAL_CP002_EQUATION_POLISH_V2.equationPolishId,
    stem: fields.stem,
    explanationId: `${question.questionLanguageId}-EN-EDITORIAL-V2-COMPLETE-EQUATIONS`,
    explanation: {
      ...explanationBase,
      lines: explanationLines(question, fields),
    },
    reasoningGraph: reasoningGraph(fields),
    validation: {
      ...question.validation,
      checks: [
        ...question.validation.checks,
        {
          name: "complete-equations-v2",
          passed: true,
          message:
            "Forward, reverse and one-known-item families use complete single-span MathJax equations.",
        },
      ],
    },
    traceability: {
      ...question.traceability,
      editorialEquationPolishId:
        MAL_CP002_EQUATION_POLISH_V2.equationPolishId,
    },
  } as MalCp002EquationPolishV2Question;
}

export function runMalCp002EnglishEquationPolishV2Pipeline(
  input: {
    questionLanguageId?: MalCp002PermanentQlId | string;
    seed?: string;
    language?: "en";
  } = {},
): MalCp002EquationPolishV2Question {
  return applyMalCp002EquationPolishV2(
    runMalCp002EnglishEditorialSurfaceV2Pipeline(input),
  );
}
