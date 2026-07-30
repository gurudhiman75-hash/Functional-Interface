import { Buffer } from "node:buffer";
import {
  absoluteRational,
  addRational,
  divideRational,
  multiplyRational,
  reduceRationalRatio,
  subtractRational,
  sumRationals,
} from "./rational";
import type { BlendComponent, Rational } from "./types";
import type { MalCp001PermanentQuestion } from "./cp001-permanent-runtime";
import type { MalCp001TeacherExplanation } from "./cp001-teacher-explanation";

export const MAL_CP001_RELEASE_LAYOUT_ID =
  "MAL-CP001-EN-FORMULA-ALLIGATION-SVG-V2" as const;
export const MAL_CP001_ALLIGATION_VISUAL_ID =
  "MAL-CP001-ALLIGATION-SVG-V1" as const;
export const MAL_CP001_ALLIGATION_DIRECTIVE_PREFIX =
  "[[EXAMTREE_ALLIGATION_SVG_V1:" as const;

export type MalCp001AlligationCrossVisual = {
  version: 1;
  kind: "cross";
  title: string;
  lower: {
    label: string;
    value: string;
    quantity?: string;
  };
  higher: {
    label: string;
    value: string;
    quantity?: string;
  };
  mean: {
    label: string;
    value: string;
  };
  lowerPart: {
    label: string;
    value: string;
    expression: string;
  };
  higherPart: {
    label: string;
    value: string;
    expression: string;
  };
  rangePartition?: {
    quantityRatio: string;
    totalParts: string;
    priceGap: string;
    valuePerPart: string;
    meanDistanceFromLowerParts: string;
  };
};

export type MalCp001AlligationDeviationVisual = {
  version: 1;
  kind: "deviation";
  title: string;
  target: {
    label: string;
    value: string;
  };
  below: Array<{
    label: string;
    value: string;
    quantity: string;
    deviation: string;
  }>;
  above: Array<{
    label: string;
    value: string;
    quantity: string;
    deviation: string;
  }>;
};

export type MalCp001AlligationSequenceVisual = {
  version: 1;
  kind: "sequence";
  title: string;
  stages: Array<{
    label: string;
    diagram: MalCp001AlligationCrossVisual;
  }>;
};

export type MalCp001AlligationVisual =
  | MalCp001AlligationCrossVisual
  | MalCp001AlligationDeviationVisual
  | MalCp001AlligationSequenceVisual;

export type MalCp001ReleaseExplanationV2 = Omit<
  MalCp001TeacherExplanation,
  "sectionTitles"
> & {
  sectionTitles: {
    coreConcept: "📌 Core Concept & Formula";
    steps: "📝 Method 1 — Normal Formula Method";
    shortcut: "⚡ Method 2 — Alligation Method (Exam Shortcut)";
    trap: "⚠️ Common Trap & Mistake Warning";
  };
  releaseLayoutId: typeof MAL_CP001_RELEASE_LAYOUT_ID;
  alligationVisualId: typeof MAL_CP001_ALLIGATION_VISUAL_ID;
  alligationVisual: MalCp001AlligationVisual;
};

function formatIndianInteger(value: bigint): string {
  const sign = value < 0n ? "-" : "";
  const digits = (value < 0n ? -value : value).toString();
  if (digits.length <= 3) return `${sign}${digits}`;
  const lastThree = digits.slice(-3);
  let rest = digits.slice(0, -3);
  const groups: string[] = [];
  while (rest.length > 2) {
    groups.unshift(rest.slice(-2));
    rest = rest.slice(0, -2);
  }
  if (rest) groups.unshift(rest);
  return `${sign}${groups.join(",")},${lastThree}`;
}

function numberText(value: Rational): string {
  if (value.denominator === 1n) {
    return formatIndianInteger(value.numerator);
  }
  const sign = value.numerator < 0n ? "-" : "";
  const numerator = value.numerator < 0n ? -value.numerator : value.numerator;
  if (numerator > value.denominator) {
    const whole = numerator / value.denominator;
    const remainder = numerator % value.denominator;
    return remainder === 0n
      ? `${sign}${formatIndianInteger(whole)}`
      : `${sign}${formatIndianInteger(whole)} ${remainder}/${value.denominator}`;
  }
  return `${sign}${numerator}/${value.denominator}`;
}

function unitFor(question: MalCp001PermanentQuestion): "kg" | "litre" {
  return question.parameters.context.quantityUnit === "kg" ? "kg" : "litre";
}

function quantityText(value: Rational, unit: "kg" | "litre"): string {
  const label = unit === "litre" && value.numerator !== value.denominator
    ? "litres"
    : unit;
  return `${numberText(value)} ${label}`;
}

function priceText(value: Rational, unit: "kg" | "litre"): string {
  return `₹${numberText(value)} per ${unit}`;
}

function moneyText(value: Rational): string {
  return `₹${numberText(value)}`;
}

function ratioText(first: Rational, second: Rational): string {
  return `${numberText(first)} : ${numberText(second)}`;
}

function compareRational(left: Rational, right: Rational): number {
  const difference = left.numerator * right.denominator - right.numerator * left.denominator;
  return difference < 0n ? -1 : difference > 0n ? 1 : 0;
}

function totalValue(component: BlendComponent): Rational {
  return multiplyRational(component.quantity, component.value);
}

function componentValues(components: readonly BlendComponent[]): Rational[] {
  return components.map(totalValue);
}

function numberSteps(steps: readonly string[]): string[] {
  return steps.map((step, index) => `Step ${index + 1}: ${step}`);
}

function normalizeExamStem(value: string): string {
  const placeholder = "__HOUSE_BLEND_BEANS__";
  return value
    .replace(/house-blend beans/giu, placeholder)
    .replace(/\bcombined with\b/giu, "mixed with")
    .replace(/\bcombining\b/giu, "mixing")
    .replace(/\bcombined\b/giu, "mixed")
    .replace(/\bcombine\b/giu, "mix")
    .replace(/\bfinal blend\b/giu, "final mixture")
    .replace(/\bresulting blend\b/giu, "resulting mixture")
    .replace(/\bthe blend\b/giu, "the mixture")
    .replace(/\ba blend\b/giu, "a mixture")
    .replace(/\bblend's\b/giu, "mixture's")
    .replace(/\bblend\b/giu, "mixture")
    .replace(new RegExp(placeholder, "g"), "house-blend beans");
}

function encodeBase64Url(value: string): string {
  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/\+/gu, "-")
    .replace(/\//gu, "_")
    .replace(/=+$/gu, "");
}

export function serializeMalCp001AlligationVisual(
  visual: MalCp001AlligationVisual,
): string {
  return `${MAL_CP001_ALLIGATION_DIRECTIVE_PREFIX}${encodeBase64Url(
    JSON.stringify(visual),
  )}]]`;
}

function crossVisual(input: {
  title?: string;
  lowerLabel: string;
  lowerValue: Rational;
  lowerQuantity?: string;
  higherLabel: string;
  higherValue: Rational;
  higherQuantity?: string;
  meanLabel?: string;
  meanValue: Rational;
  lowerPart: Rational;
  higherPart: Rational;
  lowerExpression: string;
  higherExpression: string;
  unit: "kg" | "litre";
  rangePartition?: MalCp001AlligationCrossVisual["rangePartition"];
}): MalCp001AlligationCrossVisual {
  return {
    version: 1,
    kind: "cross",
    title: input.title ?? "Alligation Cross",
    lower: {
      label: input.lowerLabel,
      value: priceText(input.lowerValue, input.unit),
      ...(input.lowerQuantity ? { quantity: input.lowerQuantity } : {}),
    },
    higher: {
      label: input.higherLabel,
      value: priceText(input.higherValue, input.unit),
      ...(input.higherQuantity ? { quantity: input.higherQuantity } : {}),
    },
    mean: {
      label: input.meanLabel ?? "Mean",
      value: priceText(input.meanValue, input.unit),
    },
    lowerPart: {
      label: `${input.lowerLabel} part`,
      value: numberText(input.lowerPart),
      expression: input.lowerExpression,
    },
    higherPart: {
      label: `${input.higherLabel} part`,
      value: numberText(input.higherPart),
      expression: input.higherExpression,
    },
    ...(input.rangePartition ? { rangePartition: input.rangePartition } : {}),
  };
}

function rangePartitionData(
  lower: Rational,
  higher: Rational,
  lowerQuantity: Rational,
  higherQuantity: Rational,
): MalCp001AlligationCrossVisual["rangePartition"] {
  const [lowerParts, higherParts] = reduceRationalRatio(
    lowerQuantity,
    higherQuantity,
  );
  const totalParts = addRational(lowerParts, higherParts);
  const priceGap = subtractRational(higher, lower);
  const valuePerPart = divideRational(priceGap, totalParts);
  return {
    quantityRatio: ratioText(lowerParts, higherParts),
    totalParts: numberText(totalParts),
    priceGap: moneyText(priceGap),
    valuePerPart: moneyText(valuePerPart),
    meanDistanceFromLowerParts: numberText(higherParts),
  };
}

function buildTargetRatioVisual(
  question: MalCp001PermanentQuestion,
): MalCp001AlligationCrossVisual {
  const request = question.parameters.request as any;
  const unit = unitFor(question);
  const lowerPart = subtractRational(request.higherValue, request.targetValue);
  const higherPart = subtractRational(request.targetValue, request.lowerValue);
  return crossVisual({
    lowerLabel: request.lowerComponentLabel,
    lowerValue: request.lowerValue,
    higherLabel: request.higherComponentLabel,
    higherValue: request.higherValue,
    meanLabel: "Target mean",
    meanValue: request.targetValue,
    lowerPart,
    higherPart,
    lowerExpression: `${numberText(request.higherValue)} - ${numberText(request.targetValue)}`,
    higherExpression: `${numberText(request.targetValue)} - ${numberText(request.lowerValue)}`,
    unit,
  });
}

function buildMeanVisual(
  question: MalCp001PermanentQuestion,
): MalCp001AlligationCrossVisual {
  const request = question.parameters.request as any;
  const components = [...(request.components as BlendComponent[])].sort((left, right) =>
    compareRational(left.value, right.value),
  );
  const lower = components[0]!;
  const higher = components[1]!;
  const mean = question.solution.value as Rational;
  const unit = unitFor(question);
  const lowerPart = subtractRational(higher.value, mean);
  const higherPart = subtractRational(mean, lower.value);
  const ratioParts = question.permanentQlId === "MAL-QL-003";
  return crossVisual({
    title: "Alligation Cross — Range Partition",
    lowerLabel: lower.label,
    lowerValue: lower.value,
    lowerQuantity: ratioParts
      ? `${numberText(lower.quantity)} parts`
      : quantityText(lower.quantity, unit),
    higherLabel: higher.label,
    higherValue: higher.value,
    higherQuantity: ratioParts
      ? `${numberText(higher.quantity)} parts`
      : quantityText(higher.quantity, unit),
    meanValue: mean,
    lowerPart,
    higherPart,
    lowerExpression: `${numberText(higher.value)} - ${numberText(mean)}`,
    higherExpression: `${numberText(mean)} - ${numberText(lower.value)}`,
    unit,
    rangePartition: rangePartitionData(
      lower.value,
      higher.value,
      lower.quantity,
      higher.quantity,
    ),
  });
}

function buildDeviationVisual(
  question: MalCp001PermanentQuestion,
): MalCp001AlligationDeviationVisual {
  const request = question.parameters.request as any;
  const unit = unitFor(question);
  const target = question.permanentQlId === "MAL-QL-004"
    ? (question.solution.value as Rational)
    : (request.targetValue as Rational);
  const knownComponents: BlendComponent[] = question.permanentQlId === "MAL-QL-004"
    ? request.components
    : request.knownComponents;
  const components: Array<BlendComponent & { isUnknown?: boolean }> = [
    ...knownComponents,
  ];
  if (question.permanentQlId === "MAL-QL-008") {
    components.push({
      label: request.unknownComponentLabel,
      value: request.unknownValue,
      quantity: question.solution.quantity,
      isUnknown: true,
    });
  }

  const below: MalCp001AlligationDeviationVisual["below"] = [];
  const above: MalCp001AlligationDeviationVisual["above"] = [];
  for (const component of components) {
    const comparison = compareRational(component.value, target);
    if (comparison === 0) continue;
    const deviation = absoluteRational(subtractRational(component.value, target));
    const row = {
      label: component.label,
      value: priceText(component.value, unit),
      quantity: quantityText(component.quantity, unit),
      deviation: numberText(deviation),
    };
    if (comparison < 0) below.push(row);
    else above.push(row);
  }

  return {
    version: 1,
    kind: "deviation",
    title: "Multi-Component Deviation Balance",
    target: {
      label: "Target mean",
      value: priceText(target, unit),
    },
    below,
    above,
  };
}

function oneKnownQuantityData(question: MalCp001PermanentQuestion) {
  const request = question.parameters.request as any;
  if (request.mode === "ADD_SOURCE_TO_REACH_TARGET") {
    return {
      known: request.initialComponents[0] as BlendComponent,
      unknownLabel: request.addedComponentLabel as string,
      unknownValue: request.addedValue as Rational,
      targetValue: request.targetValue as Rational,
    };
  }
  return {
    known: request.knownComponents[0] as BlendComponent,
    unknownLabel: request.unknownComponentLabel as string,
    unknownValue: request.unknownValue as Rational,
    targetValue: request.targetValue as Rational,
  };
}

function buildUnknownPriceVisual(
  question: MalCp001PermanentQuestion,
): MalCp001AlligationCrossVisual {
  const request = question.parameters.request as any;
  const unit = unitFor(question);
  let knownValue: Rational;
  let knownQuantity: Rational;
  let knownLabel: string;
  const unknownValue: Rational = question.solution.value as Rational;
  let unknownQuantity: Rational;
  let unknownLabel: string;
  const target: Rational = request.targetValue;

  if (question.permanentQlId === "MAL-QL-005") {
    const known = request.knownComponents[0] as BlendComponent;
    knownValue = known.value;
    knownQuantity = known.quantity;
    knownLabel = known.label;
    unknownQuantity = request.unknownQuantity;
    unknownLabel = request.unknownComponentLabel;
  } else {
    knownValue = request.knownValue;
    knownQuantity = request.knownSide === "LOWER"
      ? request.lowerRatioPart
      : request.higherRatioPart;
    unknownQuantity = request.knownSide === "LOWER"
      ? request.higherRatioPart
      : request.lowerRatioPart;
    knownLabel = request.knownSide === "LOWER"
      ? request.lowerComponentLabel
      : request.higherComponentLabel;
    unknownLabel = request.knownSide === "LOWER"
      ? request.higherComponentLabel
      : request.lowerComponentLabel;
  }

  const unknownIsLower = compareRational(unknownValue, target) < 0;
  const lowerValue = unknownIsLower ? unknownValue : knownValue;
  const higherValue = unknownIsLower ? knownValue : unknownValue;
  const lowerLabel = unknownIsLower ? unknownLabel : knownLabel;
  const higherLabel = unknownIsLower ? knownLabel : unknownLabel;
  const lowerQuantity = unknownIsLower ? unknownQuantity : knownQuantity;
  const higherQuantity = unknownIsLower ? knownQuantity : unknownQuantity;
  const lowerPart = subtractRational(higherValue, target);
  const higherPart = subtractRational(target, lowerValue);
  const quantitySuffix = question.permanentQlId === "MAL-QL-006" ? "parts" : unit;

  return crossVisual({
    lowerLabel,
    lowerValue,
    lowerQuantity: `${numberText(lowerQuantity)} ${quantitySuffix}`,
    higherLabel,
    higherValue,
    higherQuantity: `${numberText(higherQuantity)} ${quantitySuffix}`,
    meanLabel: "Target mean",
    meanValue: target,
    lowerPart,
    higherPart,
    lowerExpression: `${numberText(higherValue)} - ${numberText(target)}`,
    higherExpression: `${numberText(target)} - ${numberText(lowerValue)}`,
    unit,
  });
}

function buildUnknownQuantityVisual(
  question: MalCp001PermanentQuestion,
): MalCp001AlligationCrossVisual {
  const data = oneKnownQuantityData(question);
  const unit = unitFor(question);
  const result = question.solution.quantity as Rational;
  const knownIsLower = compareRational(data.known.value, data.targetValue) < 0;
  const lowerValue = knownIsLower ? data.known.value : data.unknownValue;
  const higherValue = knownIsLower ? data.unknownValue : data.known.value;
  const lowerLabel = knownIsLower ? data.known.label : data.unknownLabel;
  const higherLabel = knownIsLower ? data.unknownLabel : data.known.label;
  const lowerQuantity = knownIsLower ? data.known.quantity : result;
  const higherQuantity = knownIsLower ? result : data.known.quantity;
  const lowerPart = subtractRational(higherValue, data.targetValue);
  const higherPart = subtractRational(data.targetValue, lowerValue);

  return crossVisual({
    lowerLabel,
    lowerValue,
    lowerQuantity: quantityText(lowerQuantity, unit),
    higherLabel,
    higherValue,
    higherQuantity: quantityText(higherQuantity, unit),
    meanLabel: "Target mean",
    meanValue: data.targetValue,
    lowerPart,
    higherPart,
    lowerExpression: `${numberText(higherValue)} - ${numberText(data.targetValue)}`,
    higherExpression: `${numberText(data.targetValue)} - ${numberText(lowerValue)}`,
    unit,
  });
}

function buildRatioScaleVisual(
  question: MalCp001PermanentQuestion,
): MalCp001AlligationCrossVisual {
  const request = question.parameters.request as any;
  const unit = unitFor(question);
  const lowerPart = subtractRational(request.higherValue, request.targetValue);
  const higherPart = subtractRational(request.targetValue, request.lowerValue);
  const [reducedLower, reducedHigher] = reduceRationalRatio(lowerPart, higherPart);
  const totalParts = addRational(reducedLower, reducedHigher);
  const onePart = divideRational(request.totalQuantity, totalParts);
  const lowerQuantity = multiplyRational(reducedLower, onePart);
  const higherQuantity = multiplyRational(reducedHigher, onePart);

  return crossVisual({
    lowerLabel: request.lowerComponentLabel,
    lowerValue: request.lowerValue,
    lowerQuantity: quantityText(lowerQuantity, unit),
    higherLabel: request.higherComponentLabel,
    higherValue: request.higherValue,
    higherQuantity: quantityText(higherQuantity, unit),
    meanLabel: "Target mean",
    meanValue: request.targetValue,
    lowerPart,
    higherPart,
    lowerExpression: `${numberText(request.higherValue)} - ${numberText(request.targetValue)}`,
    higherExpression: `${numberText(request.targetValue)} - ${numberText(request.lowerValue)}`,
    unit,
  });
}

function buildTwoStageVisual(
  question: MalCp001PermanentQuestion,
): MalCp001AlligationSequenceVisual {
  const request = question.parameters.request as any;
  const unit = unitFor(question);
  const first = request.stageOneComponents[0] as BlendComponent;
  const second = request.stageOneComponents[1] as BlendComponent;
  const stageOneTotalValue = addRational(totalValue(first), totalValue(second));
  const stageOneTotalQuantity = addRational(first.quantity, second.quantity);
  const stageOneMean = divideRational(stageOneTotalValue, stageOneTotalQuantity);

  const stageOneComponents = [first, second].sort((left, right) =>
    compareRational(left.value, right.value),
  );
  const lowerOne = stageOneComponents[0]!;
  const higherOne = stageOneComponents[1]!;
  const stageOneLowerPart = subtractRational(higherOne.value, stageOneMean);
  const stageOneHigherPart = subtractRational(stageOneMean, lowerOne.value);
  const stageOneDiagram = crossVisual({
    title: "Stage 1 Alligation Cross",
    lowerLabel: lowerOne.label,
    lowerValue: lowerOne.value,
    lowerQuantity: quantityText(lowerOne.quantity, unit),
    higherLabel: higherOne.label,
    higherValue: higherOne.value,
    higherQuantity: quantityText(higherOne.quantity, unit),
    meanValue: stageOneMean,
    lowerPart: stageOneLowerPart,
    higherPart: stageOneHigherPart,
    lowerExpression: `${numberText(higherOne.value)} - ${numberText(stageOneMean)}`,
    higherExpression: `${numberText(stageOneMean)} - ${numberText(lowerOne.value)}`,
    unit,
    rangePartition: rangePartitionData(
      lowerOne.value,
      higherOne.value,
      lowerOne.quantity,
      higherOne.quantity,
    ),
  });

  const stageTwoFirst: BlendComponent = {
    label: "used first mixture",
    quantity: request.stageOneQuantityUsed,
    value: stageOneMean,
  };
  const stageTwoSecond = request.finalComponent as BlendComponent;
  const stageTwoComponents = [stageTwoFirst, stageTwoSecond].sort((left, right) =>
    compareRational(left.value, right.value),
  );
  const lowerTwo = stageTwoComponents[0]!;
  const higherTwo = stageTwoComponents[1]!;
  const finalMean = question.solution.value as Rational;
  const stageTwoLowerPart = subtractRational(higherTwo.value, finalMean);
  const stageTwoHigherPart = subtractRational(finalMean, lowerTwo.value);
  const stageTwoDiagram = crossVisual({
    title: "Stage 2 Alligation Cross",
    lowerLabel: lowerTwo.label,
    lowerValue: lowerTwo.value,
    lowerQuantity: quantityText(lowerTwo.quantity, unit),
    higherLabel: higherTwo.label,
    higherValue: higherTwo.value,
    higherQuantity: quantityText(higherTwo.quantity, unit),
    meanValue: finalMean,
    lowerPart: stageTwoLowerPart,
    higherPart: stageTwoHigherPart,
    lowerExpression: `${numberText(higherTwo.value)} - ${numberText(finalMean)}`,
    higherExpression: `${numberText(finalMean)} - ${numberText(lowerTwo.value)}`,
    unit,
    rangePartition: rangePartitionData(
      lowerTwo.value,
      higherTwo.value,
      lowerTwo.quantity,
      higherTwo.quantity,
    ),
  });

  return {
    version: 1,
    kind: "sequence",
    title: "Two-Stage Alligation",
    stages: [
      { label: "Stage 1 — first mixture", diagram: stageOneDiagram },
      { label: "Stage 2 — final mixture", diagram: stageTwoDiagram },
    ],
  };
}

export function buildMalCp001AlligationVisual(
  question: MalCp001PermanentQuestion,
): MalCp001AlligationVisual {
  switch (question.permanentQlId) {
    case "MAL-QL-001":
      return buildTargetRatioVisual(question);
    case "MAL-QL-002":
    case "MAL-QL-003":
      return buildMeanVisual(question);
    case "MAL-QL-004":
      return buildDeviationVisual(question);
    case "MAL-QL-005":
    case "MAL-QL-006":
      return buildUnknownPriceVisual(question);
    case "MAL-QL-007":
      return buildUnknownQuantityVisual(question);
    case "MAL-QL-008":
      return buildDeviationVisual(question);
    case "MAL-QL-009":
    case "MAL-QL-010":
      return buildRatioScaleVisual(question);
    case "MAL-QL-011":
      return buildTwoStageVisual(question);
    default:
      throw new Error(`Unsupported MAL-CP-001 QL: ${question.permanentQlId}`);
  }
}

function formulaPatchTargetRatio(question: MalCp001PermanentQuestion) {
  const request = question.parameters.request as any;
  const solution = question.solution as any;
  const answer = ratioText(solution.firstPart, solution.secondPart);
  return {
    coreConcept:
      "Use the standard weighted-average equation. Let the two required quantities be x and y, form the average-price equation, and simplify x : y.",
    formula:
      "\\(\\dfrac{Lx+Hy}{x+y}=T\\)",
    steps: numberSteps([
      `Let x be the quantity of ${request.lowerComponentLabel} and y be the quantity of ${request.higherComponentLabel}.`,
      `Write the average-value equation: (${numberText(request.lowerValue)}x + ${numberText(request.higherValue)}y) ÷ (x + y) = ${numberText(request.targetValue)}.`,
      `Multiply by (x + y): ${numberText(request.lowerValue)}x + ${numberText(request.higherValue)}y = ${numberText(request.targetValue)}x + ${numberText(request.targetValue)}y.`,
      `Bring like terms together: ${numberText(subtractRational(request.targetValue, request.lowerValue))}x = ${numberText(subtractRational(request.higherValue, request.targetValue))}y.`,
      `Therefore, x : y = ${answer}.`,
    ]),
    examShortcut: [
      "Method 2 — Alligation method:",
      `Dearer price − target = ${numberText(request.higherValue)} − ${numberText(request.targetValue)} = ${numberText(subtractRational(request.higherValue, request.targetValue))}. This is the cheaper item's part.`,
      `Target − cheaper price = ${numberText(request.targetValue)} − ${numberText(request.lowerValue)} = ${numberText(subtractRational(request.targetValue, request.lowerValue))}. This is the dearer item's part.`,
      `Hence, ${request.lowerComponentLabel} : ${request.higherComponentLabel} = ${answer}.`,
    ].join("\n"),
  };
}

function formulaPatchOneKnownQuantity(question: MalCp001PermanentQuestion) {
  const data = oneKnownQuantityData(question);
  const unit = unitFor(question);
  const answer = question.solution.quantity as Rational;
  const knownValue = totalValue(data.known);
  const knownTargetValue = multiplyRational(data.known.quantity, data.targetValue);
  const coefficient = absoluteRational(subtractRational(data.unknownValue, data.targetValue));
  const rightSide = absoluteRational(subtractRational(knownTargetValue, knownValue));
  const knownGap = absoluteRational(subtractRational(data.targetValue, data.known.value));
  const unknownGap = absoluteRational(subtractRational(data.unknownValue, data.targetValue));
  const [knownParts, unknownParts] = reduceRationalRatio(unknownGap, knownGap);
  const onePart = divideRational(data.known.quantity, knownParts);
  return {
    coreConcept:
      "Use total value = average price × total quantity. Let the required new quantity be q and solve the resulting linear equation.",
    formula:
      "\\(Q_kP_k+qP_n=T(Q_k+q)\\)",
    steps: numberSteps([
      `Let the required quantity of ${data.unknownLabel} be q ${unit}.`,
      `Form the value equation: ${numberText(data.known.quantity)} × ${numberText(data.known.value)} + q × ${numberText(data.unknownValue)} = ${numberText(data.targetValue)}(${numberText(data.known.quantity)} + q).`,
      `Expand: ${numberText(knownValue)} + ${numberText(data.unknownValue)}q = ${numberText(knownTargetValue)} + ${numberText(data.targetValue)}q.`,
      `Collect q terms: ${numberText(coefficient)}q = ${numberText(rightSide)}.`,
      `q = ${numberText(rightSide)} ÷ ${numberText(coefficient)} = ${quantityText(answer, unit)}.`,
    ]),
    examShortcut: [
      "Method 2 — Alligation method:",
      `Known item : new item = ${numberText(unknownGap)} : ${numberText(knownGap)} = ${ratioText(knownParts, unknownParts)}.`,
      `${quantityText(data.known.quantity, unit)} represents ${numberText(knownParts)} parts, so one part = ${quantityText(onePart, unit)}.`,
      `Required new quantity = ${numberText(unknownParts)} × ${numberText(onePart)} = ${quantityText(answer, unit)}.`,
    ].join("\n"),
  };
}

function formulaPatchMultiKnownQuantity(question: MalCp001PermanentQuestion) {
  const request = question.parameters.request as any;
  const unit = unitFor(question);
  const knownComponents = request.knownComponents as BlendComponent[];
  const knownValues = componentValues(knownComponents);
  const knownTotal = sumRationals(knownValues);
  const knownQuantity = sumRationals(knownComponents.map((item) => item.quantity));
  const answer = question.solution.quantity as Rational;
  const requiredKnownTarget = multiplyRational(knownQuantity, request.targetValue);
  const coefficient = absoluteRational(subtractRational(request.unknownValue, request.targetValue));
  const rightSide = absoluteRational(subtractRational(requiredKnownTarget, knownTotal));

  const deficitTerms: string[] = [];
  const surplusTerms: string[] = [];
  for (const item of knownComponents) {
    const comparison = compareRational(item.value, request.targetValue);
    const deviation = absoluteRational(subtractRational(item.value, request.targetValue));
    const term = `${numberText(item.quantity)} × ${numberText(deviation)}`;
    if (comparison < 0) deficitTerms.push(term);
    else if (comparison > 0) surplusTerms.push(term);
  }
  const unknownComparison = compareRational(request.unknownValue, request.targetValue);
  const unknownDeviation = absoluteRational(subtractRational(request.unknownValue, request.targetValue));

  return {
    coreConcept:
      "Use one total-value equation for all known items and the unknown quantity. This keeps the main solution purely formula based.",
    formula:
      "\\(V_k+qP_u=T(Q_k+q)\\)",
    steps: numberSteps([
      `Known total value = ${knownValues.map(moneyText).join(" + ")} = ${moneyText(knownTotal)}.`,
      `Known total quantity = ${knownComponents.map((item) => numberText(item.quantity)).join(" + ")} = ${quantityText(knownQuantity, unit)}.`,
      `Let the required quantity of ${request.unknownComponentLabel} be q ${unit}.`,
      `Form the equation: ${numberText(knownTotal)} + ${numberText(request.unknownValue)}q = ${numberText(request.targetValue)}(${numberText(knownQuantity)} + q).`,
      `After collecting q terms: ${numberText(coefficient)}q = ${numberText(rightSide)}.`,
      `q = ${numberText(rightSide)} ÷ ${numberText(coefficient)} = ${quantityText(answer, unit)}.`,
    ]),
    examShortcut: [
      "Method 2 — deviation-balance alligation:",
      `Known deficit = ${deficitTerms.join(" + ") || "0"}.`,
      `Known surplus = ${surplusTerms.join(" + ") || "0"}.`,
      unknownComparison > 0
        ? `The unknown item is above the target, so q × ${numberText(unknownDeviation)} balances the known deficit.`
        : `The unknown item is below the target, so q × ${numberText(unknownDeviation)} balances the known surplus.`,
      `Solving the balance gives q = ${quantityText(answer, unit)}.`,
    ].join("\n"),
  };
}

function formulaPatchRatioScale(question: MalCp001PermanentQuestion) {
  const request = question.parameters.request as any;
  const unit = unitFor(question);
  const lowerQuantity = question.permanentQlId === "MAL-QL-009"
    ? (question.solution.firstQuantity as Rational)
    : divideRational(
        multiplyRational(
          subtractRational(request.higherValue, request.targetValue),
          request.totalQuantity,
        ),
        subtractRational(request.higherValue, request.lowerValue),
      );
  const higherQuantity = subtractRational(request.totalQuantity, lowerQuantity);
  const lowerPart = subtractRational(request.higherValue, request.targetValue);
  const higherPart = subtractRational(request.targetValue, request.lowerValue);
  const [reducedLower, reducedHigher] = reduceRationalRatio(lowerPart, higherPart);
  const totalParts = addRational(reducedLower, reducedHigher);
  const onePart = divideRational(request.totalQuantity, totalParts);
  const requestedLabel = request.requestedSide === "LOWER"
    ? request.lowerComponentLabel
    : request.higherComponentLabel;
  const requestedQuantity = question.permanentQlId === "MAL-QL-010"
    ? (question.solution.quantity as Rational)
    : null;

  return {
    coreConcept:
      "Let the lower-priced quantity be x. The higher-priced quantity is the given total minus x. Use the total-value equation and solve.",
    formula:
      "\\(Lx+H(Q-x)=TQ\\)",
    steps: numberSteps([
      `Let x be the quantity of ${request.lowerComponentLabel}. Then ${request.higherComponentLabel} quantity = ${numberText(request.totalQuantity)} − x.`,
      `Form the value equation: ${numberText(request.lowerValue)}x + ${numberText(request.higherValue)}(${numberText(request.totalQuantity)} − x) = ${numberText(request.targetValue)} × ${numberText(request.totalQuantity)}.`,
      `Solve the equation to get x = ${quantityText(lowerQuantity, unit)}.`,
      `The higher-priced quantity = ${numberText(request.totalQuantity)} − ${numberText(lowerQuantity)} = ${quantityText(higherQuantity, unit)}.`,
      question.permanentQlId === "MAL-QL-010"
        ? `The question asks for ${requestedLabel}, so the answer is ${quantityText(requestedQuantity!, unit)}.`
        : `Therefore, the two quantities are ${quantityText(lowerQuantity, unit)} and ${quantityText(higherQuantity, unit)}, in that order.`,
    ]),
    examShortcut: [
      "Method 2 — Alligation method:",
      `Lower : higher = (${numberText(request.higherValue)} − ${numberText(request.targetValue)}) : (${numberText(request.targetValue)} − ${numberText(request.lowerValue)}) = ${ratioText(reducedLower, reducedHigher)}.`,
      `Total parts = ${numberText(totalParts)}; one part = ${numberText(request.totalQuantity)} ÷ ${numberText(totalParts)} = ${quantityText(onePart, unit)}.`,
      question.permanentQlId === "MAL-QL-010"
        ? `${requestedLabel} uses ${numberText(request.requestedSide === "LOWER" ? reducedLower : reducedHigher)} parts, so its quantity is ${quantityText(requestedQuantity!, unit)}.`
        : `Quantities = ${numberText(reducedLower)} × ${numberText(onePart)} and ${numberText(reducedHigher)} × ${numberText(onePart)} = ${quantityText(lowerQuantity, unit)} and ${quantityText(higherQuantity, unit)}.`,
    ].join("\n"),
  };
}

function rangePartitionShortcut(
  lower: BlendComponent,
  higher: BlendComponent,
  mean: Rational,
  unit: "kg" | "litre",
  useParts: boolean,
): string {
  const [lowerParts, higherParts] = reduceRationalRatio(
    lower.quantity,
    higher.quantity,
  );
  const totalParts = addRational(lowerParts, higherParts);
  const priceGap = subtractRational(higher.value, lower.value);
  const valuePerPart = divideRational(priceGap, totalParts);
  return [
    "Method 2 — Alligation range-partition shortcut:",
    `Quantity ratio = ${ratioText(lower.quantity, higher.quantity)} = ${ratioText(lowerParts, higherParts)}${useParts ? " parts" : ""}.`,
    `Total price gap = ${moneyText(higher.value)} − ${moneyText(lower.value)} = ${moneyText(priceGap)}.`,
    `Value per ratio part = ${moneyText(priceGap)} ÷ ${numberText(totalParts)} = ${moneyText(valuePerPart)}.`,
    `The mean is ${numberText(higherParts)} parts above the lower price: ${moneyText(lower.value)} + (${numberText(higherParts)} × ${moneyText(valuePerPart)}) = ${moneyText(mean)} per ${unit}.`,
  ].join("\n");
}

function patchShortcutOnly(question: MalCp001PermanentQuestion) {
  const request = question.parameters.request as any;
  const unit = unitFor(question);
  switch (question.permanentQlId) {
    case "MAL-QL-002":
    case "MAL-QL-003": {
      const components = [...(request.components as BlendComponent[])].sort((left, right) =>
        compareRational(left.value, right.value),
      );
      return {
        examShortcut: rangePartitionShortcut(
          components[0]!,
          components[1]!,
          question.solution.value as Rational,
          unit,
          question.permanentQlId === "MAL-QL-003",
        ),
      };
    }
    case "MAL-QL-004": {
      const target = question.solution.value as Rational;
      const components = request.components as BlendComponent[];
      const below = components.filter((item) => compareRational(item.value, target) < 0);
      const above = components.filter((item) => compareRational(item.value, target) > 0);
      const deficit = sumRationals(
        below.map((item) =>
          multiplyRational(item.quantity, subtractRational(target, item.value)),
        ),
      );
      const surplus = sumRationals(
        above.map((item) =>
          multiplyRational(item.quantity, subtractRational(item.value, target)),
        ),
      );
      return {
        examShortcut: [
          "Method 2 — deviation-balance alligation:",
          `Take ${priceText(target, unit)} as the target mean.`,
          `Total deficit below the target = ${numberText(deficit)}.`,
          `Total surplus above the target = ${numberText(surplus)}.`,
          `The two totals are equal, confirming the mean ${priceText(target, unit)}.`,
        ].join("\n"),
      };
    }
    case "MAL-QL-005":
    case "MAL-QL-006": {
      const visual = buildUnknownPriceVisual(question);
      const lowerQuantity = visual.lower.quantity ?? "";
      const higherQuantity = visual.higher.quantity ?? "";
      return {
        examShortcut: [
          "Method 2 — Alligation method:",
          `${visual.lower.label} : ${visual.higher.label} quantity = ${lowerQuantity} : ${higherQuantity}.`,
          "Place the opposite differences under the two prices as shown in the cross.",
          "Use the quantity ratio with those differences and solve the single unknown price.",
          `The unknown price is ${priceText(question.solution.value as Rational, unit)}.`,
        ].join("\n"),
      };
    }
    case "MAL-QL-011": {
      const first = request.stageOneComponents[0] as BlendComponent;
      const second = request.stageOneComponents[1] as BlendComponent;
      const stageOneMean = divideRational(
        addRational(totalValue(first), totalValue(second)),
        addRational(first.quantity, second.quantity),
      );
      const firstSorted = [first, second].sort((left, right) =>
        compareRational(left.value, right.value),
      );
      const stageTwoFirst: BlendComponent = {
        label: "used first mixture",
        quantity: request.stageOneQuantityUsed,
        value: stageOneMean,
      };
      const stageTwoSecond = request.finalComponent as BlendComponent;
      const secondSorted = [stageTwoFirst, stageTwoSecond].sort((left, right) =>
        compareRational(left.value, right.value),
      );
      return {
        examShortcut: [
          "Method 2 — two-stage alligation range partition:",
          "Stage 1:",
          rangePartitionShortcut(
            firstSorted[0]!,
            firstSorted[1]!,
            stageOneMean,
            unit,
            false,
          ).replace(/^Method 2[^\n]*\n/u, ""),
          "Stage 2:",
          rangePartitionShortcut(
            secondSorted[0]!,
            secondSorted[1]!,
            question.solution.value as Rational,
            unit,
            false,
          ).replace(/^Method 2[^\n]*\n/u, ""),
        ].join("\n"),
      };
    }
    default:
      return {};
  }
}

type EditorialPatch = Partial<
  Pick<
    MalCp001TeacherExplanation,
    "coreConcept" | "formula" | "steps" | "examShortcut"
  >
>;

function formulaFirstPatch(
  question: MalCp001PermanentQuestion,
): EditorialPatch {
  switch (question.permanentQlId) {
    case "MAL-QL-001":
      return formulaPatchTargetRatio(question);
    case "MAL-QL-007":
      return formulaPatchOneKnownQuantity(question);
    case "MAL-QL-008":
      return formulaPatchMultiKnownQuantity(question);
    case "MAL-QL-009":
    case "MAL-QL-010":
      return formulaPatchRatioScale(question);
    default:
      return patchShortcutOnly(question);
  }
}

export function buildMalCp001ReleaseEditorialV2(
  question: MalCp001PermanentQuestion,
): {
  stem: string;
  explanation: MalCp001ReleaseExplanationV2;
} {
  const alligationVisual = buildMalCp001AlligationVisual(question);
  const patch: EditorialPatch = formulaFirstPatch(question);
  const merged = {
    ...question.explanation,
    ...patch,
  };
  const coreConcept = normalizeExamStem(merged.coreConcept);
  const explanation: MalCp001ReleaseExplanationV2 = {
    ...merged,
    sectionTitles: {
      coreConcept: "📌 Core Concept & Formula",
      steps: "📝 Method 1 — Normal Formula Method",
      shortcut: "⚡ Method 2 — Alligation Method (Exam Shortcut)",
      trap: "⚠️ Common Trap & Mistake Warning",
    },
    opening: coreConcept,
    coreConcept,
    formula: normalizeExamStem(merged.formula),
    steps: merged.steps.map(normalizeExamStem),
    examShortcut: normalizeExamStem(merged.examShortcut),
    verification: normalizeExamStem(merged.verification),
    conclusion: normalizeExamStem(merged.conclusion),
    commonTrap: normalizeExamStem(merged.commonTrap),
    releaseLayoutId: MAL_CP001_RELEASE_LAYOUT_ID,
    alligationVisualId: MAL_CP001_ALLIGATION_VISUAL_ID,
    alligationVisual,
  };
  return {
    stem: normalizeExamStem(question.stem),
    explanation,
  };
}
