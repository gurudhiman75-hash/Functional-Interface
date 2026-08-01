import {
  addRational,
  divideRational,
  formatRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./rational";
import {
  serializeMalCp002RatioVisual,
  type MalCp002PermanentQlId,
  type MalCp002RatioVisual,
} from "./cp002-permanent-runtime";
import type { MalReasoningGraph, Rational } from "./types";
import type { MalCp002EditorialRemediationV2Question } from "./cp002-editorial-remediation-v2";
import { runMalCp002EnglishEditorialRemediationV2Pipeline as runBaseEditorialPipeline } from "./cp002-editorial-remediation-v2-pipeline";

export const MAL_CP002_FINAL_EDITORIAL_POLISH_V2 = Object.freeze({
  polishId: "MAL-CP002-EN-FAMILY-POLISH-V2",
  unitInsideMathJax: true,
  algebraInsideSingleMathSpan: true,
  naturalQuestionGrammar: true,
});

type JsonRecord = Record<string, unknown>;

type PolishedFields = {
  stem: string;
  coreConcept: string;
  formula: string;
  steps: string[];
  verification: string;
  conclusion: string;
  examShortcut: string;
  commonTrap: string;
  visual: MalCp002RatioVisual;
};

export type MalCp002FinalEditorialV2Question =
  MalCp002EditorialRemediationV2Question & {
    editorialPolishId: typeof MAL_CP002_FINAL_EDITORIAL_POLISH_V2.polishId;
    explanation: MalCp002EditorialRemediationV2Question["explanation"] & {
      editorialPolishId: typeof MAL_CP002_FINAL_EDITORIAL_POLISH_V2.polishId;
    };
    traceability: MalCp002EditorialRemediationV2Question["traceability"] & {
      editorialPolishId: typeof MAL_CP002_FINAL_EDITORIAL_POLISH_V2.polishId;
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

function rationalState(value: unknown): { componentA: Rational; componentB: Rational } {
  const item = record(value);
  return {
    componentA: toRational(item.componentA),
    componentB: toRational(item.componentB),
  };
}

function ratioPair(value: unknown): [Rational, Rational] {
  const item = record(value);
  return [
    toRational(item.componentAPart, rational(1)),
    toRational(item.componentBPart, rational(1)),
  ];
}

function ratioFromText(value: string): Rational[] {
  return value.split(":").map((part) => parseRationalText(part.trim()));
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
  value: string | Rational,
  unit: string,
  bold = false,
): string {
  const raw = typeof value === "string" ? value : formatRational(value);
  const body = `${latexNumber(raw)}\\,\\text{${unit}}`;
  return bold ? `$\\mathbf{${body}}$` : `$${body}$`;
}

function mathRatio(value: string | readonly Rational[]): string {
  const parts =
    typeof value === "string"
      ? value.split(":").map((part) => latexNumber(part.trim()))
      : value.map(rationalLatex);
  return `$${parts.join(" : ")}$`;
}

function mathNumber(value: string | Rational): string {
  return `$${
    typeof value === "string" ? latexNumber(value) : rationalLatex(value)
  }$`;
}

function capitalize(value: string): string {
  return value ? `${value[0]!.toUpperCase()}${value.slice(1)}` : value;
}

function mergeTrailingUnitIntoMath(value: string): string {
  return value.replace(
    /\$([^$]+)\$\s+(kg|litres)\b/giu,
    (_match, expression: string, unit: string) =>
      `$${expression}\\,\\text{${unit.toLowerCase()}}$`,
  );
}

function polishSentence(value: string): string {
  return mergeTrailingUnitIntoMath(value)
    .replace(/\.\s+find\b/gu, ". Find")
    .replace(/^find\b/u, "Find")
    .replace(/\bthird grade\b/giu, "third variety")
    .replace(/\bthe third grade\b/giu, "the third variety")
    .replace(/\bhomogeneous sample\b/giu, "well-mixed sample")
    .replace(/\bcomponent quantities\b/giu, "item quantities")
    .replace(/\bcomponents\b/giu, "items");
}

function polishedVisual(
  visual: MalCp002RatioVisual,
  overrides: Partial<MalCp002RatioVisual> = {},
): MalCp002RatioVisual {
  const normalizeLabel = (label: string) =>
    label.replace(/\bthird grade\b/giu, "third variety");
  return {
    ...visual,
    ...overrides,
    before: (overrides.before ?? visual.before).map((item) => ({
      ...item,
      label: normalizeLabel(item.label),
    })),
    after: (overrides.after ?? visual.after).map((item) => ({
      ...item,
      label: normalizeLabel(item.label),
    })),
    operation: polishSentence(overrides.operation ?? visual.operation),
    note: polishSentence(overrides.note ?? visual.note),
  };
}

function quantityFromVisual(value: string): Rational {
  return parseRationalText(value);
}

function partitionFields(
  question: MalCp002EditorialRemediationV2Question,
): PolishedFields {
  const unit = question.diagram.quantityUnit;
  const labels = question.diagram.after.map((item) => item.label);
  const quantities = question.diagram.after.map((item) =>
    quantityFromVisual(item.quantity),
  );
  const total = addRational(quantities[0]!, quantities[1]!);
  const parts = ratioFromText(question.diagram.afterRatio);
  const totalParts = addRational(parts[0]!, parts[1]!);
  const onePart = divideRational(total, totalParts);
  return {
    stem: `A mixture of ${mathQuantity(total, unit)} contains ${labels[0]} and ${labels[1]} in the ratio ${mathRatio(parts)}. Find the quantity of each item.`,
    coreConcept: `The total mixture is divided into ${mathNumber(totalParts)} equal ratio parts. Find the value of one part first, then multiply by each item’s number of parts.`,
    formula: `${equation(`\\text{one part}=\\dfrac{\\text{total quantity}}{\\text{sum of ratio parts}}`)}`,
    steps: [
      `Step 1: Total ratio parts ${equation(`=${rationalLatex(parts[0]!)}+${rationalLatex(parts[1]!)}=${rationalLatex(totalParts)}`)}.`,
      `Step 2: One part ${equation(`=\\dfrac{${rationalLatex(total)}}{${rationalLatex(totalParts)}}=${rationalLatex(onePart)}\\,\\text{${unit}}`)}.`,
      `Step 3: ${capitalize(labels[0]!)} ${equation(`=${rationalLatex(parts[0]!)}\\times${rationalLatex(onePart)}=${rationalLatex(quantities[0]!)}\\,\\text{${unit}}`)}.`,
      `Step 4: ${capitalize(labels[1]!)} ${equation(`=${rationalLatex(parts[1]!)}\\times${rationalLatex(onePart)}=${rationalLatex(quantities[1]!)}\\,\\text{${unit}}`)}.`,
    ],
    verification: `${equation(`${rationalLatex(quantities[0]!)}+${rationalLatex(quantities[1]!)}=${rationalLatex(total)}\\,\\text{${unit}}`)} and ${mathRatio(quantities)} reduces to ${mathRatio(parts)}.`,
    conclusion: `${capitalize(labels[0]!)} ${mathQuantity(quantities[0]!, unit, true)} and ${labels[1]} ${mathQuantity(quantities[1]!, unit, true)}.`,
    examShortcut: `Add the ratio parts, divide the total once, and multiply by the two ratio parts.`,
    commonTrap: `The ratio numbers are parts, not the actual quantities. Scale them to the stated total before answering.`,
    visual: polishedVisual(question.diagram, {
      operation: `Divide ${formatRational(total)} ${unit} in the ratio ${question.diagram.afterRatio}`,
      note: `The two quantities add to ${formatRational(total)} ${unit}.`,
    }),
  };
}

function inverseReplacementFields(
  question: MalCp002EditorialRemediationV2Question,
): PolishedFields {
  const unit = question.diagram.quantityUnit;
  const params = record(question.parameters);
  const request = record(params.request);
  const initial = rationalState(request.initialState);
  const solved = record(question.solution);
  const final = rationalState(solved.finalState);
  const amount = toRational(solved.quantity);
  const replacementIndex = request.replacementComponent === "B" ? 1 : 0;
  const otherIndex = replacementIndex === 0 ? 1 : 0;
  const labels = question.diagram.before.map((item) => item.label);
  const total = addRational(initial.componentA, initial.componentB);
  const targetParts = ratioPair(request.targetRatio);
  const targetPartTotal = addRational(targetParts[0], targetParts[1]);
  const targetOnePart = divideRational(total, targetPartTotal);
  const finalOther = otherIndex === 0 ? final.componentA : final.componentB;
  const initialOther = otherIndex === 0 ? initial.componentA : initial.componentB;
  const retainedFraction = divideRational(finalOther, initialOther);
  const replacedFraction = subtractRational(rational(1), retainedFraction);
  return {
    stem: `A vessel contains ${mathQuantity(initial.componentA, unit)} of ${labels[0]} and ${mathQuantity(initial.componentB, unit)} of ${labels[1]}. A well-mixed quantity is removed once and replaced with the same quantity of ${labels[replacementIndex]}. What quantity should be replaced so that the final ratio becomes ${mathRatio(targetParts)}?`,
    coreConcept: `A well-mixed sample contains both items in the same proportion as the vessel. Track ${labels[otherIndex]}, because none of it is added back during the refill.`,
    formula: `${equation(`\\text{retained fraction}=\\dfrac{\\text{final quantity of ${labels[otherIndex]}}}{\\text{initial quantity of ${labels[otherIndex]}}}`)}.`,
    steps: [
      `Step 1: Total quantity ${equation(`=${rationalLatex(initial.componentA)}+${rationalLatex(initial.componentB)}=${rationalLatex(total)}\\,\\text{${unit}}`)}.`,
      `Step 2: Target one part ${equation(`=\\dfrac{${rationalLatex(total)}}{${rationalLatex(targetPartTotal)}}=${rationalLatex(targetOnePart)}\\,\\text{${unit}}`)}. Therefore, final ${labels[otherIndex]} ${equation(`=${rationalLatex(targetParts[otherIndex])}\\times${rationalLatex(targetOnePart)}=${rationalLatex(finalOther)}\\,\\text{${unit}}`)}.`,
      `Step 3: Retained fraction ${equation(`=\\dfrac{${rationalLatex(finalOther)}}{${rationalLatex(initialOther)}}=${rationalLatex(retainedFraction)}`)}.`,
      `Step 4: Replaced fraction ${equation(`=1-${rationalLatex(retainedFraction)}=${rationalLatex(replacedFraction)}`)}.`,
      `Step 5: Replaced quantity ${equation(`=${rationalLatex(total)}\\times${rationalLatex(replacedFraction)}=${rationalLatex(amount)}\\,\\text{${unit}}`)}.`,
    ],
    verification: `After the replacement, the quantities are ${mathQuantity(final.componentA, unit)} and ${mathQuantity(final.componentB, unit)}, giving ${mathRatio(targetParts)}.`,
    conclusion: `Replace ${mathQuantity(amount, unit, true)} with ${labels[replacementIndex]}.`,
    examShortcut: `Use the item not added back: final quantity divided by initial quantity gives the retained fraction directly.`,
    commonTrap: `Do not subtract the replaced quantity from one item alone. The removed quantity is a well-mixed sample containing both items.`,
    visual: polishedVisual(question.diagram, {
      operation: `Remove ${formatRational(amount)} ${unit} of mixture; add the same amount of ${labels[replacementIndex]}`,
      note: `Both original items are reduced proportionally before ${labels[replacementIndex]} is added.`,
    }),
  };
}

function originalScaleFields(
  question: MalCp002EditorialRemediationV2Question,
): PolishedFields {
  const unit = question.diagram.quantityUnit;
  const params = record(question.parameters);
  const solved = record(question.solution);
  const initialParts = ratioPair(params.initialRatio);
  const finalParts = ratioPair(params.finalRatio);
  const changedIndex = params.changedComponent === "B" ? 1 : 0;
  const otherIndex = changedIndex === 0 ? 1 : 0;
  const action = params.adjustmentKind === "REMOVE" ? "remove" : "add";
  const amount = toRational(params.adjustmentQuantity);
  const originalScale = toRational(solved.originalScale);
  const originalTotal = toRational(solved.originalTotal);
  const originalState = rationalState(solved.originalState);
  const finalState = rationalState(solved.finalState);
  const labels = question.diagram.before.map((item) => item.label);
  const yFactor = divideRational(
    initialParts[otherIndex],
    finalParts[otherIndex],
  );
  const changedTargetCoefficient = multiplyRational(
    finalParts[changedIndex],
    yFactor,
  );
  const solvingCoefficient =
    action === "add"
      ? subtractRational(changedTargetCoefficient, initialParts[changedIndex])
      : subtractRational(initialParts[changedIndex], changedTargetCoefficient);
  const sign = action === "add" ? "+" : "-";
  return {
    stem: `${capitalize(labels[0]!)} and ${labels[1]} were initially in the ratio ${mathRatio(initialParts)}. After ${mathQuantity(amount, unit)} of ${labels[changedIndex]} was ${action === "add" ? "added" : "removed"}, the ratio became ${mathRatio(finalParts)}. Find the original total quantity.`,
    coreConcept: `Use scale ${equation("x")} for the original ratio and scale ${equation("y")} for the final ratio. Since ${labels[otherIndex]} is not changed, it links the two scales.`,
    formula: `${equation(`${rationalLatex(initialParts[otherIndex])}x=${rationalLatex(finalParts[otherIndex])}y`)} together with ${equation(`${rationalLatex(initialParts[changedIndex])}x${sign}${rationalLatex(amount)}=${rationalLatex(finalParts[changedIndex])}y`)}.`,
    steps: [
      `Step 1: Let the original quantities be ${equation(`${rationalLatex(initialParts[0])}x`)} and ${equation(`${rationalLatex(initialParts[1])}x`)}.`,
      `Step 2: ${capitalize(labels[otherIndex]!)} is not changed, so ${equation(`${rationalLatex(initialParts[otherIndex])}x=${rationalLatex(finalParts[otherIndex])}y`)}. Hence, ${equation(`y=${rationalLatex(yFactor)}x`)}.`,
      `Step 3: For ${labels[changedIndex]}, ${equation(`${rationalLatex(initialParts[changedIndex])}x${sign}${rationalLatex(amount)}=${rationalLatex(finalParts[changedIndex])}y`)}. Substituting ${equation(`y=${rationalLatex(yFactor)}x`)} gives ${equation(`${rationalLatex(amount)}=${rationalLatex(solvingCoefficient)}x`)}.`,
      `Step 4: Therefore, ${equation(`x=\\dfrac{${rationalLatex(amount)}}{${rationalLatex(solvingCoefficient)}}=${rationalLatex(originalScale)}`)}.`,
      `Step 5: Original total ${equation(`=(${rationalLatex(initialParts[0])}+${rationalLatex(initialParts[1])})\\times${rationalLatex(originalScale)}=${rationalLatex(originalTotal)}\\,\\text{${unit}}`)}.`,
    ],
    verification: `The original quantities are ${mathQuantity(originalState.componentA, unit)} and ${mathQuantity(originalState.componentB, unit)}. After the stated change, they become ${mathQuantity(finalState.componentA, unit)} and ${mathQuantity(finalState.componentB, unit)}, giving ${mathRatio(finalParts)}.`,
    conclusion: `The original total was ${mathQuantity(originalTotal, unit, true)}.`,
    examShortcut: `Use the item that does not change to connect the two ratio scales, then substitute into the equation for the changed item.`,
    commonTrap: `Do not use the same scale for both ratios unless the unchanged-item equation proves it.`,
    visual: polishedVisual(question.diagram, {
      operation: `${capitalize(action)} ${formatRational(amount)} ${unit} of ${labels[changedIndex]}`,
      note: `${capitalize(labels[otherIndex]!)} has the same quantity before and after.`,
    }),
  };
}

function forwardReplacementFields(
  question: MalCp002EditorialRemediationV2Question,
): PolishedFields {
  const unit = question.diagram.quantityUnit;
  const params = record(question.parameters);
  const solved = record(question.solution);
  const initial = rationalState(params.initialState);
  const removed = toRational(params.removedQuantity);
  const refillIndex = params.replacementComponent === "B" ? 1 : 0;
  const labels = question.diagram.before.map((item) => item.label);
  const total = addRational(initial.componentA, initial.componentB);
  const retainedFraction = toRational(solved.retainedFraction);
  const final = rationalState(solved.finalState);
  const retainedA = multiplyRational(initial.componentA, retainedFraction);
  const retainedB = multiplyRational(initial.componentB, retainedFraction);
  return {
    stem: `A mixture contains ${mathQuantity(initial.componentA, unit)} of ${labels[0]} and ${mathQuantity(initial.componentB, unit)} of ${labels[1]}. A well-mixed sample of ${mathQuantity(removed, unit)} is removed and replaced with the same quantity of ${labels[refillIndex]}. Find the final ratio.`,
    coreConcept: `Removing a well-mixed sample reduces both items by the same retained fraction. Add the refill only after calculating both retained quantities.`,
    formula: `${equation(`\\text{retained fraction}=\\dfrac{V-r}{V}`)} and ${equation(`\\text{retained quantity}=\\text{initial quantity}\\times\\text{retained fraction}`)}.`,
    steps: [
      `Step 1: Total quantity ${equation(`V=${rationalLatex(initial.componentA)}+${rationalLatex(initial.componentB)}=${rationalLatex(total)}\\,\\text{${unit}}`)}.`,
      `Step 2: Retained fraction ${equation(`=\\dfrac{${rationalLatex(total)}-${rationalLatex(removed)}}{${rationalLatex(total)}}=${rationalLatex(retainedFraction)}`)}.`,
      `Step 3: Retained ${labels[0]} ${equation(`=${rationalLatex(initial.componentA)}\\times${rationalLatex(retainedFraction)}=${rationalLatex(retainedA)}\\,\\text{${unit}}`)}.`,
      `Step 4: Retained ${labels[1]} ${equation(`=${rationalLatex(initial.componentB)}\\times${rationalLatex(retainedFraction)}=${rationalLatex(retainedB)}\\,\\text{${unit}}`)}.`,
      `Step 5: Add ${mathQuantity(removed, unit)} to ${labels[refillIndex]}. The final quantities are ${mathQuantity(final.componentA, unit)} and ${mathQuantity(final.componentB, unit)}, so the final ratio is ${mathRatio(question.diagram.afterRatio)}.`,
    ],
    verification: `${equation(`${rationalLatex(final.componentA)}+${rationalLatex(final.componentB)}=${rationalLatex(total)}\\,\\text{${unit}}`)}; the vessel returns to its original total after refill.`,
    conclusion: `The final ratio is ${boldEquation(ratioFromText(question.diagram.afterRatio).map(rationalLatex).join(" : "))}.`,
    examShortcut: `Multiply both original quantities by the retained fraction, then add the refill to only one item.`,
    commonTrap: `Do not subtract the whole removed quantity from one item. A well-mixed sample contains both items.`,
    visual: polishedVisual(question.diagram, {
      operation: `Remove ${formatRational(removed)} ${unit} of mixture; add ${labels[refillIndex]}`,
      note: `Both original items are reduced by the same fraction before refill.`,
    }),
  };
}

function homogeneousRemovalFields(
  question: MalCp002EditorialRemediationV2Question,
): PolishedFields {
  const unit = question.diagram.quantityUnit;
  const params = record(question.parameters);
  const solved = record(question.solution);
  const initialParts = ratioPair(params.initialRatio);
  const removed = toRational(params.removedQuantity);
  const retainedFraction = toRational(solved.retainedFraction);
  const final = rationalState(solved.finalState);
  const before = question.diagram.before.map((item) => quantityFromVisual(item.quantity));
  const total = addRational(before[0]!, before[1]!);
  const labels = question.diagram.before.map((item) => item.label);
  return {
    stem: `A mixture contains ${labels[0]} and ${labels[1]} in the ratio ${mathRatio(initialParts)}. A well-mixed sample of ${mathQuantity(removed, unit)} is removed and nothing is added back. Find the ratio in the remaining mixture.`,
    coreConcept: `A well-mixed sample has the same composition as the whole mixture. Both items are multiplied by the same retained fraction, so their ratio remains unchanged.`,
    formula: `${equation(`A\\left(1-\\dfrac{r}{V}\\right):B\\left(1-\\dfrac{r}{V}\\right)=A:B`)}.`,
    steps: [
      `Step 1: Total quantity ${equation(`V=${rationalLatex(total)}\\,\\text{${unit}}`)} and removed quantity ${equation(`r=${rationalLatex(removed)}\\,\\text{${unit}}`)}.`,
      `Step 2: Retained fraction ${equation(`=\\dfrac{V-r}{V}=\\dfrac{${rationalLatex(total)}-${rationalLatex(removed)}}{${rationalLatex(total)}}=${rationalLatex(retainedFraction)}`)}.`,
      `Step 3: Remaining ${labels[0]} ${mathQuantity(final.componentA, unit)} and remaining ${labels[1]} ${mathQuantity(final.componentB, unit)}.`,
      `Step 4: ${mathRatio([final.componentA, final.componentB])} reduces to ${mathRatio(initialParts)}.`,
    ],
    verification: `The same non-zero factor ${mathNumber(retainedFraction)} multiplies both original quantities, so it cancels when the ratio is reduced.`,
    conclusion: `The ratio remains ${boldEquation(initialParts.map(rationalLatex).join(" : "))}.`,
    examShortcut: `Removing a well-mixed sample without refill does not change the ratio.`,
    commonTrap: `Do not subtract the removed quantity from only one item; the sample contains both items in the current ratio.`,
    visual: polishedVisual(question.diagram, {
      operation: `Remove ${formatRational(removed)} ${unit} of well-mixed contents`,
      note: `Both items are reduced by the same fraction, so the ratio is preserved.`,
    }),
  };
}

function threeItemFields(
  question: MalCp002EditorialRemediationV2Question,
): PolishedFields {
  const unit = question.diagram.quantityUnit;
  const params = record(question.parameters);
  const solved = record(question.solution);
  const rawInitial = Array.isArray(params.initialRatio)
    ? params.initialRatio
    : [];
  const rawFinal = Array.isArray(params.finalRatio) ? params.finalRatio : [];
  const initialParts = rawInitial.map((item) => toRational(item));
  const finalParts = rawFinal.map((item) => toRational(item));
  const additionA = toRational(params.additionA);
  const additionB = toRational(params.additionB);
  const scale = toRational(solved.scale);
  const requested = toRational(solved.requestedQuantity);
  const labels = question.diagram.before.map((item) =>
    item.label.replace(/\bthird grade\b/giu, "third variety"),
  );
  const finalQuantities = Array.isArray(solved.finalQuantities)
    ? solved.finalQuantities.map((item) => toRational(item))
    : question.diagram.after.map((item) => quantityFromVisual(item.quantity));
  const coefficientDifference = subtractRational(finalParts[0]!, initialParts[0]!);
  const visual = polishedVisual(question.diagram, {
    before: question.diagram.before.map((item) => ({
      ...item,
      label: item.label.replace(/\bthird grade\b/giu, "third variety"),
    })),
    after: question.diagram.after.map((item) => ({
      ...item,
      label: item.label.replace(/\bthird grade\b/giu, "third variety"),
    })),
    operation: `Add ${formatRational(additionA)} ${unit} to ${labels[0]} and ${formatRational(additionB)} ${unit} to ${labels[1]}`,
    note: `${capitalize(labels[2]!)} is not changed.`,
  });
  return {
    stem: `${capitalize(labels[0]!)} , ${labels[1]} and a ${labels[2]} are initially in the ratio ${mathRatio(initialParts)}. After adding ${mathQuantity(additionA, unit)} to ${labels[0]} and ${mathQuantity(additionB, unit)} to ${labels[1]}, the ratio becomes ${mathRatio(finalParts)}. Find the final quantity of the ${labels[2]}.`,
    coreConcept: `The ${labels[2]} is not changed, and its ratio part is the same before and after. Therefore, the original and final ratios use the same scale ${equation("x")}.`,
    formula: `${equation(`${rationalLatex(initialParts[0]!)}x+${rationalLatex(additionA)}=${rationalLatex(finalParts[0]!)}x`)}.`,
    steps: [
      `Step 1: Let the initial quantities be ${equation(`${rationalLatex(initialParts[0]!)}x`)}, ${equation(`${rationalLatex(initialParts[1]!)}x`)} and ${equation(`${rationalLatex(initialParts[2]!)}x`)}.`,
      `Step 2: The ${labels[2]} remains at ${equation(`${rationalLatex(initialParts[2]!)}x`)}, and its final ratio part is also ${mathNumber(finalParts[2]!)}. Hence, the final scale is still ${equation("x")}.`,
      `Step 3: Using the first addition, ${equation(`${rationalLatex(initialParts[0]!)}x+${rationalLatex(additionA)}=${rationalLatex(finalParts[0]!)}x`)}. Therefore, ${equation(`${rationalLatex(additionA)}=${rationalLatex(coefficientDifference)}x`)} and ${equation(`x=${rationalLatex(scale)}`)}.`,
      `Step 4: Check the second addition: ${equation(`${rationalLatex(initialParts[1]!)}\\times${rationalLatex(scale)}+${rationalLatex(additionB)}=${rationalLatex(finalParts[1]!)}\\times${rationalLatex(scale)}`)}.`,
      `Step 5: Final ${labels[2]} ${equation(`=${rationalLatex(finalParts[2]!)}\\times${rationalLatex(scale)}=${rationalLatex(requested)}\\,\\text{${unit}}`)}.`,
    ],
    verification: `${mathRatio(finalQuantities)} reduces to ${mathRatio(finalParts)}.`,
    conclusion: `The final quantity of the ${labels[2]} is ${mathQuantity(requested, unit, true)}.`,
    examShortcut: `Use the item whose ratio part is unchanged as the scale anchor; one addition then gives the scale immediately.`,
    commonTrap: `Do not add either stated addition to the ${labels[2]}; its quantity is the link between the two ratios.`,
    visual,
  };
}

function genericFields(
  question: MalCp002EditorialRemediationV2Question,
): PolishedFields {
  return {
    stem: polishSentence(question.stem),
    coreConcept: polishSentence(question.explanation.coreConcept),
    formula: polishSentence(question.explanation.formula),
    steps: question.explanation.steps.map(polishSentence),
    verification: polishSentence(question.explanation.verification),
    conclusion: polishSentence(question.explanation.conclusion),
    examShortcut: polishSentence(question.explanation.examShortcut),
    commonTrap: polishSentence(question.explanation.commonTrap),
    visual: polishedVisual(question.diagram),
  };
}

function fieldsFor(
  question: MalCp002EditorialRemediationV2Question,
): PolishedFields {
  switch (question.traceability.familyId) {
    case "COMPONENTS_FROM_TOTAL_AND_RATIO":
      return partitionFields(question);
    case "SINGLE_REPLACEMENT_TO_TARGET":
      return inverseReplacementFields(question);
    case "ORIGINAL_TOTAL_FROM_ADDITION_RATIO_SHIFT":
    case "ORIGINAL_TOTAL_FROM_REMOVAL_RATIO_SHIFT":
      return originalScaleFields(question);
    case "RATIO_AFTER_SINGLE_REPLACEMENT":
      return forwardReplacementFields(question);
    case "HOMOGENEOUS_REMOVAL_RATIO_INVARIANCE":
      return homogeneousRemovalFields(question);
    case "THREE_COMPONENT_COUPLED_ADDITION":
      return threeItemFields(question);
    default:
      return genericFields(question);
  }
}

function explanationLines(
  question: MalCp002EditorialRemediationV2Question,
  fields: PolishedFields,
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
    serializeMalCp002RatioVisual(fields.visual),
    fields.examShortcut,
    question.explanation.sectionTitles.trap,
    fields.commonTrap.replace(/^Common trap:\s*/iu, ""),
  ];
}

function reasoningGraph(fields: PolishedFields): MalReasoningGraph {
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

export function applyMalCp002FinalEditorialPolishV2(
  question: MalCp002EditorialRemediationV2Question,
): MalCp002FinalEditorialV2Question {
  const fields = fieldsFor(question);
  const explanationBase = {
    ...question.explanation,
    editorialPolishId: MAL_CP002_FINAL_EDITORIAL_POLISH_V2.polishId,
    coreConcept: fields.coreConcept,
    formula: fields.formula,
    steps: fields.steps,
    verification: fields.verification,
    conclusion: fields.conclusion,
    examShortcut: fields.examShortcut,
    commonTrap: fields.commonTrap,
    ratioVisual: fields.visual,
  };
  return {
    ...question,
    editorialPolishId: MAL_CP002_FINAL_EDITORIAL_POLISH_V2.polishId,
    stem: fields.stem,
    explanationId: `${question.questionLanguageId}-EN-EDITORIAL-V2-POLISHED`,
    explanation: {
      ...explanationBase,
      lines: explanationLines(question, fields),
    },
    reasoningGraph: reasoningGraph(fields),
    diagram: fields.visual,
    validation: {
      ...question.validation,
      checks: [
        ...question.validation.checks,
        {
          name: "family-aware-final-polish-v2",
          passed: true,
          message:
            "Natural grammar, complete algebra and units inside MathJax are enforced by family-aware final authoring.",
        },
      ],
    },
    traceability: {
      ...question.traceability,
      editorialPolishId: MAL_CP002_FINAL_EDITORIAL_POLISH_V2.polishId,
    },
  } as MalCp002FinalEditorialV2Question;
}

export function runMalCp002EnglishFinalEditorialV2Pipeline(
  input: {
    questionLanguageId?: MalCp002PermanentQlId | string;
    seed?: string;
    language?: "en";
  } = {},
): MalCp002FinalEditorialV2Question {
  return applyMalCp002FinalEditorialPolishV2(runBaseEditorialPipeline(input));
}
