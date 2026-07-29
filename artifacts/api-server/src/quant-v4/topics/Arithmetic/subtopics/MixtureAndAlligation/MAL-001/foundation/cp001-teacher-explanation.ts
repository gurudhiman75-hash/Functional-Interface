import type { MalCp001PermanentQlId } from "./cp001-permanent-allocation";
import {
  absoluteRational,
  addRational,
  divideRational,
  multiplyRational,
  rational,
  reduceRationalRatio,
  subtractRational,
  sumRationals,
} from "./rational";
import type { BlendComponent, Rational } from "./types";

export const MAL_CP001_TEACHER_LAYOUT_ID =
  "MAL-CP001-EN-SIMPLE-TEACHER-V1" as const;

export interface MalCp001TeacherExplanation {
  layoutId: typeof MAL_CP001_TEACHER_LAYOUT_ID;
  languageLevel: "SIMPLE_ENGLISH";
  sectionTitles: {
    coreConcept: "📌 Core Concept & Formula";
    steps: "📝 Step-by-Step Solution";
    shortcut: "⚡ 10-Second Exam Shortcut";
    trap: "⚠️ Common Trap & Mistake Warning";
  };
  opening: string;
  coreConcept: string;
  formula: string;
  steps: string[];
  examShortcut: string;
  verification: string;
  conclusion: string;
  commonTrap: string;
}

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
  if (value.denominator === 1n) return formatIndianInteger(value.numerator);
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

function quantityText(value: Rational, unit: string): string {
  return `${numberText(value)} ${unit}`;
}

function priceText(value: Rational, unit: string): string {
  return `₹${numberText(value)} per ${unit}`;
}

function moneyText(value: Rational): string {
  return `₹${numberText(value)}`;
}

function ratioText(first: Rational, second: Rational): string {
  return `${numberText(first)} : ${numberText(second)}`;
}

function totalValue(component: BlendComponent): Rational {
  return multiplyRational(component.quantity, component.value);
}

function componentValues(components: readonly BlendComponent[]): Rational[] {
  return components.map(totalValue);
}

function optionLabel(index: number): string {
  return String.fromCharCode(65 + index);
}

function trapOption(
  question: any,
  misconceptionIds: readonly string[],
): string | null {
  const index = question.optionAudit?.findIndex((item: any) =>
    misconceptionIds.includes(String(item.misconceptionId)),
  );
  if (typeof index !== "number" || index < 0) return null;
  return `Option ${optionLabel(index)} (${question.options[index]})`;
}

function makeTrap(
  question: any,
  misconceptionIds: readonly string[],
  message: string,
): string {
  const option = trapOption(question, misconceptionIds);
  return option
    ? `Common trap: do not choose ${option}. ${message}`
    : `Common trap: ${message}`;
}

function withStepNumbers(steps: readonly string[]): string[] {
  return steps.map((step, index) => `Step ${index + 1}: ${step}`);
}

function makeExplanation(input: {
  coreConcept: string;
  formula: string;
  steps: readonly string[];
  examShortcut: string;
  verification: string;
  conclusion: string;
  commonTrap: string;
}): MalCp001TeacherExplanation {
  return {
    layoutId: MAL_CP001_TEACHER_LAYOUT_ID,
    languageLevel: "SIMPLE_ENGLISH",
    sectionTitles: {
      coreConcept: "📌 Core Concept & Formula",
      steps: "📝 Step-by-Step Solution",
      shortcut: "⚡ 10-Second Exam Shortcut",
      trap: "⚠️ Common Trap & Mistake Warning",
    },
    opening: input.coreConcept,
    coreConcept: input.coreConcept,
    formula: input.formula,
    steps: withStepNumbers(input.steps),
    examShortcut: input.examShortcut,
    verification: input.verification,
    conclusion: input.conclusion,
    commonTrap: input.commonTrap,
  };
}

function buildTargetRatio(question: any): MalCp001TeacherExplanation {
  const request = question.parameters.request;
  const solution = question.solution;
  const unit = question.parameters.context.quantityUnit === "kg" ? "kg" : "litre";
  const cheaperGap = subtractRational(request.higherValue, request.targetValue);
  const dearerGap = subtractRational(request.targetValue, request.lowerValue);
  const partsTotal = addRational(solution.firstPart, solution.secondPart);
  const checkValue = addRational(
    multiplyRational(solution.firstPart, request.lowerValue),
    multiplyRational(solution.secondPart, request.higherValue),
  );
  const checkMean = divideRational(checkValue, partsTotal);
  const answer = ratioText(solution.firstPart, solution.secondPart);

  return makeExplanation({
    coreConcept:
      "Use the Alligation Cross method. Find the two cross differences, then place each difference with the item on the other side.",
    formula:
      "\\(\\text{Cheaper item : Dearer item}=(\\text{Dearer price}-\\text{Target price}):(\\text{Target price}-\\text{Cheaper price})\\)",
    steps: [
      `Write the prices: ${request.lowerComponentLabel} = ${priceText(request.lowerValue, unit)}, ${request.higherComponentLabel} = ${priceText(request.higherValue, unit)}, and target = ${priceText(request.targetValue, unit)}.`,
      `Dearer price − target price = ${numberText(request.higherValue)} − ${numberText(request.targetValue)} = ${numberText(cheaperGap)}. These are the parts of ${request.lowerComponentLabel}.`,
      `Target price − cheaper price = ${numberText(request.targetValue)} − ${numberText(request.lowerValue)} = ${numberText(dearerGap)}. These are the parts of ${request.higherComponentLabel}.`,
      `Write the ratio in the asked order: ${numberText(cheaperGap)} : ${numberText(dearerGap)}.`,
      `Simplify the ratio to ${answer}.`,
    ],
    examShortcut:
      "Write the cheaper price on the left, the dearer price on the right and the target in the middle. Subtract across the cross. The right-side difference belongs to the cheaper item.",
    verification: `Check: ${answer} gives an average of ${priceText(checkMean, unit)}, which is exactly the target price.`,
    conclusion: `Mix ${request.lowerComponentLabel} and ${request.higherComponentLabel} in the ratio ${answer}.`,
    commonTrap: makeTrap(
      question,
      ["RATIO_REVERSED"],
      "A reversed ratio is formed when the two cross differences are written under the wrong items. Always answer in the order used in the question.",
    ),
  });
}

function buildWeightedMean(
  question: any,
  useRatioParts: boolean,
): MalCp001TeacherExplanation {
  const request = question.parameters.request;
  const solution = question.solution;
  const components: BlendComponent[] = request.components;
  const unit = question.parameters.context.quantityUnit === "kg" ? "kg" : "litre";
  const values = componentValues(components);
  const totalQuantity = sumRationals(components.map((item) => item.quantity));
  const total = sumRationals(values);
  const steps: string[] = [];

  if (useRatioParts) {
    steps.push(
      `Use the ratio numbers as temporary quantities: ${components.map((item) => `${item.label} = ${numberText(item.quantity)} parts`).join(" and ")}.`,
    );
  } else {
    steps.push(
      `Write each quantity and price clearly: ${components.map((item) => `${quantityText(item.quantity, unit)} of ${item.label} at ${priceText(item.value, unit)}`).join("; ")}.`,
    );
  }

  components.forEach((component, index) => {
    const quantity = useRatioParts
      ? `${numberText(component.quantity)} parts`
      : quantityText(component.quantity, unit);
    steps.push(
      `${component.label}: ${quantity} × ₹${numberText(component.value)} = ${moneyText(values[index])}.`,
    );
  });

  steps.push(
    `Add the value totals: ${values.map(moneyText).join(" + ")} = ${moneyText(total)}.`,
    `Add the ${useRatioParts ? "ratio parts" : "quantities"}: ${components.map((item) => numberText(item.quantity)).join(" + ")} = ${numberText(totalQuantity)}${useRatioParts ? " parts" : ` ${unit}`}.`,
    `Average price = ${moneyText(total)} ÷ ${numberText(totalQuantity)} = ${priceText(solution.value, unit)}.`,
  );

  const misconception = components.length > 2
    ? ["ONE_COMPONENT_OMITTED"]
    : ["SIMPLE_AVERAGE_USED"];

  return makeExplanation({
    coreConcept:
      "The amount of each item matters. Multiply each price by its quantity, add the value totals, and divide by the total quantity.",
    formula:
      "\\(\\text{Average price}=\\dfrac{\\text{Total value of all items}}{\\text{Total quantity}}\\)",
    steps,
    examShortcut: useRatioParts
      ? "Treat the ratio numbers as small sample quantities. Multiply, add and divide; actual kilograms or litres are not needed."
      : components.length > 2
        ? "Make a quick three-column table: item, quantity and price. The last working column is quantity × price."
        : "When the quantities are different, never take the plain average of the two prices. Use quantity × price first.",
    verification: `Check: ${priceText(solution.value, unit)} × ${quantityText(totalQuantity, unit)} = ${moneyText(total)}, the same as the total value found above.`,
    conclusion: `The final average price is ${priceText(solution.value, unit)}.`,
    commonTrap: makeTrap(
      question,
      misconception,
      components.length > 2
        ? "Leaving out even one item changes both the total value and the total quantity. Include every component."
        : "A simple average is correct only when the two quantities are equal.",
    ),
  });
}

function buildUnknownSourceFromQuantities(question: any): MalCp001TeacherExplanation {
  const request = question.parameters.request;
  const solution = question.solution;
  const unit = question.parameters.context.quantityUnit === "kg" ? "kg" : "litre";
  const knownComponents: BlendComponent[] = request.knownComponents;
  const knownQuantity = sumRationals(knownComponents.map((item) => item.quantity));
  const knownValues = componentValues(knownComponents);
  const knownTotal = sumRationals(knownValues);
  const totalQuantity = addRational(knownQuantity, request.unknownQuantity);
  const requiredTotal = multiplyRational(totalQuantity, request.targetValue);
  const unknownTotal = subtractRational(requiredTotal, knownTotal);

  return makeExplanation({
    coreConcept:
      "First find the value the whole mixture must have. Then remove the value already supplied by the known item. The value left belongs to the unknown item.",
    formula:
      "\\(\\text{Unknown price}=\\dfrac{\\text{Required total value}-\\text{Known total value}}{\\text{Unknown quantity}}\\)",
    steps: [
      `Known quantity = ${quantityText(knownQuantity, unit)} and unknown quantity = ${quantityText(request.unknownQuantity, unit)}.`,
      `Total quantity = ${numberText(knownQuantity)} + ${numberText(request.unknownQuantity)} = ${quantityText(totalQuantity, unit)}.`,
      `Required total value = ${numberText(totalQuantity)} × ₹${numberText(request.targetValue)} = ${moneyText(requiredTotal)}.`,
      `Known total value = ${knownComponents.map((item, index) => `${numberText(item.quantity)} × ₹${numberText(item.value)} = ${moneyText(knownValues[index])}`).join("; ")}. Therefore, known total value = ${moneyText(knownTotal)}.`,
      `Value belonging to ${request.unknownComponentLabel} = ${moneyText(requiredTotal)} − ${moneyText(knownTotal)} = ${moneyText(unknownTotal)}.`,
      `Price of ${request.unknownComponentLabel} = ${moneyText(unknownTotal)} ÷ ${numberText(request.unknownQuantity)} = ${priceText(solution.value, unit)}.`,
    ],
    examShortcut:
      "Think in two totals: what the full mixture should cost, and what the known item already costs. Subtract first, divide last.",
    verification: `Check: putting ${priceText(solution.value, unit)} back into the mixture gives the required average of ${priceText(request.targetValue, unit)}.`,
    conclusion: `${request.unknownComponentLabel} costs ${priceText(solution.value, unit)}.`,
    commonTrap: makeTrap(
      question,
      ["TARGET_REPORTED", "KNOWN_SOURCE_REPORTED"],
      "The target price and the known price are given values, not the answer. Find the value left for the unknown item and then divide by its quantity.",
    ),
  });
}

function buildUnknownSourceFromRatio(question: any): MalCp001TeacherExplanation {
  const request = question.parameters.request;
  const solution = question.solution;
  const unit = question.parameters.context.quantityUnit === "kg" ? "kg" : "litre";
  const knownPart = request.knownSide === "LOWER"
    ? request.lowerRatioPart
    : request.higherRatioPart;
  const unknownPart = request.knownSide === "LOWER"
    ? request.higherRatioPart
    : request.lowerRatioPart;
  const unknownLabel = request.knownSide === "LOWER"
    ? request.higherComponentLabel
    : request.lowerComponentLabel;
  const totalParts = addRational(request.lowerRatioPart, request.higherRatioPart);
  const requiredTotal = multiplyRational(totalParts, request.targetValue);
  const knownTotal = multiplyRational(knownPart, request.knownValue);
  const unknownTotal = subtractRational(requiredTotal, knownTotal);

  return makeExplanation({
    coreConcept:
      "Use the ratio numbers as small sample quantities. Find the total value needed for all parts, remove the known part, and divide the value left by the unknown parts.",
    formula:
      "\\(\\text{Unknown price}=\\dfrac{\\text{Target price}\\times\\text{Total parts}-\\text{Known price}\\times\\text{Known parts}}{\\text{Unknown parts}}\\)",
    steps: [
      `Ratio parts are ${numberText(request.lowerRatioPart)} and ${numberText(request.higherRatioPart)}. Total parts = ${numberText(request.lowerRatioPart)} + ${numberText(request.higherRatioPart)} = ${numberText(totalParts)}.`,
      `Total value needed for these parts = ${numberText(totalParts)} × ₹${numberText(request.targetValue)} = ${moneyText(requiredTotal)}.`,
      `Value supplied by the known item = ${numberText(knownPart)} × ₹${numberText(request.knownValue)} = ${moneyText(knownTotal)}.`,
      `Value left for ${unknownLabel} = ${moneyText(requiredTotal)} − ${moneyText(knownTotal)} = ${moneyText(unknownTotal)}.`,
      `${unknownLabel} has ${numberText(unknownPart)} ratio parts. Its price = ${moneyText(unknownTotal)} ÷ ${numberText(unknownPart)} = ${priceText(solution.value, unit)}.`,
    ],
    examShortcut:
      "Replace the ratio by small imaginary quantities. For example, a 3 : 2 ratio means use 3 units and 2 units. Then solve it like an ordinary value-total question.",
    verification: `Check: the two ratio parts, using ${priceText(solution.value, unit)} for ${unknownLabel}, give the target price ${priceText(request.targetValue, unit)}.`,
    conclusion: `${unknownLabel} ${/(?:leaves|beans)$/iu.test(unknownLabel) ? "cost" : "costs"} ${priceText(solution.value, unit)}.`,
    commonTrap: makeTrap(
      question,
      ["TARGET_REPORTED", "KNOWN_SOURCE_REPORTED", "RATIO_REVERSED"],
      "Do not report the target price or the known price. Also keep each price with its correct ratio part.",
    ),
  });
}

function oneKnownQuantityData(question: any): {
  known: BlendComponent;
  unknownLabel: string;
  unknownValue: Rational;
  targetValue: Rational;
} {
  const request = question.parameters.request;
  if (request.mode === "ADD_SOURCE_TO_REACH_TARGET") {
    return {
      known: request.initialComponents[0],
      unknownLabel: request.addedComponentLabel,
      unknownValue: request.addedValue,
      targetValue: request.targetValue,
    };
  }
  return {
    known: request.knownComponents[0],
    unknownLabel: request.unknownComponentLabel,
    unknownValue: request.unknownValue,
    targetValue: request.targetValue,
  };
}

function buildOneKnownUnknownQuantity(question: any): MalCp001TeacherExplanation {
  const solution = question.solution;
  const unit = question.parameters.context.quantityUnit === "kg" ? "kg" : "litre";
  const data = oneKnownQuantityData(question);
  const knownGap = absoluteRational(subtractRational(data.targetValue, data.known.value));
  const unknownGap = absoluteRational(subtractRational(data.unknownValue, data.targetValue));
  const numerator = multiplyRational(data.known.quantity, knownGap);

  return makeExplanation({
    coreConcept:
      "Use the two price gaps around the target. The known quantity and the required quantity are in the reverse ratio of these gaps.",
    formula:
      "\\(\\text{Required quantity}=\\dfrac{\\text{Known quantity}\\times|\\text{Target}-\\text{Known price}|}{|\\text{New price}-\\text{Target}|}\\)",
    steps: [
      `Known item: ${quantityText(data.known.quantity, unit)} of ${data.known.label} at ${priceText(data.known.value, unit)}.`,
      `New item: ${data.unknownLabel} at ${priceText(data.unknownValue, unit)}. Target price = ${priceText(data.targetValue, unit)}.`,
      `Gap from the known price to the target = |${numberText(data.targetValue)} − ${numberText(data.known.value)}| = ${numberText(knownGap)}.`,
      `Gap from the new price to the target = |${numberText(data.unknownValue)} − ${numberText(data.targetValue)}| = ${numberText(unknownGap)}.`,
      `Known quantity × first gap = ${numberText(data.known.quantity)} × ${numberText(knownGap)} = ${numberText(numerator)}.`,
      `Required quantity = ${numberText(numerator)} ÷ ${numberText(unknownGap)} = ${quantityText(solution.quantity, unit)}.`,
    ],
    examShortcut:
      "Draw a small alligation cross. If one quantity is already known, multiply that quantity by its opposite gap and divide by the other gap.",
    verification: `Check: adding ${quantityText(solution.quantity, unit)} of ${data.unknownLabel} makes the average price exactly ${priceText(data.targetValue, unit)}.`,
    conclusion: `The required quantity of ${data.unknownLabel} is ${quantityText(solution.quantity, unit)}.`,
    commonTrap: makeTrap(
      question,
      ["KNOWN_QUANTITY_REPORTED", "TOTAL_QUANTITY_REPORTED", "DIFFERENCE_INSTEAD_OF_UNKNOWN"],
      "The question asks for the new item only. Do not report the known quantity, the final total quantity or merely the difference between two quantities.",
    ),
  });
}

function buildMultiKnownUnknownQuantity(question: any): MalCp001TeacherExplanation {
  const request = question.parameters.request;
  const solution = question.solution;
  const unit = question.parameters.context.quantityUnit === "kg" ? "kg" : "litre";
  const knownComponents: BlendComponent[] = request.knownComponents;
  const knownValues = componentValues(knownComponents);
  const knownTotalValue = sumRationals(knownValues);
  const knownTotalQuantity = sumRationals(knownComponents.map((item) => item.quantity));
  const knownMean = divideRational(knownTotalValue, knownTotalQuantity);
  const knownGap = absoluteRational(subtractRational(request.targetValue, knownMean));
  const unknownGap = absoluteRational(subtractRational(request.unknownValue, request.targetValue));
  const numerator = multiplyRational(knownTotalQuantity, knownGap);

  return makeExplanation({
    coreConcept:
      "First combine all known items into one known blend. After finding its average price, solve one ordinary two-item alligation question.",
    formula:
      "\\(\\text{Unknown quantity}=\\dfrac{\\text{Known-blend quantity}\\times|\\text{Target}-\\text{Known-blend price}|}{|\\text{Unknown price}-\\text{Target}|}\\)",
    steps: [
      ...knownComponents.map((item, index) =>
        `${item.label}: ${numberText(item.quantity)} × ₹${numberText(item.value)} = ${moneyText(knownValues[index])}.`,
      ),
      `Known total value = ${knownValues.map(moneyText).join(" + ")} = ${moneyText(knownTotalValue)}.`,
      `Known total quantity = ${knownComponents.map((item) => numberText(item.quantity)).join(" + ")} = ${quantityText(knownTotalQuantity, unit)}.`,
      `Average price of the known blend = ${moneyText(knownTotalValue)} ÷ ${numberText(knownTotalQuantity)} = ${priceText(knownMean, unit)}.`,
      `Gap from known-blend price to target = |${numberText(request.targetValue)} − ${numberText(knownMean)}| = ${numberText(knownGap)}.`,
      `Gap from ${request.unknownComponentLabel} price to target = |${numberText(request.unknownValue)} − ${numberText(request.targetValue)}| = ${numberText(unknownGap)}.`,
      `Required quantity = ${numberText(knownTotalQuantity)} × ${numberText(knownGap)} ÷ ${numberText(unknownGap)} = ${quantityText(solution.quantity, unit)}.`,
    ],
    examShortcut:
      "Do not carry three items through the full calculation. First turn the known items into one pre-blend, then use the ordinary alligation cross.",
    verification: `Check: the known blend plus ${quantityText(solution.quantity, unit)} of ${request.unknownComponentLabel} gives the target price ${priceText(request.targetValue, unit)}.`,
    conclusion: `The required quantity of ${request.unknownComponentLabel} is ${quantityText(solution.quantity, unit)}.`,
    commonTrap: makeTrap(
      question,
      ["ONE_COMPONENT_OMITTED", "KNOWN_QUANTITY_REPORTED"],
      "Do not leave out a known item. Every known quantity and price must be included before the unknown quantity is found.",
    ),
  });
}

function ratioScaleData(question: any): {
  lowerParts: Rational;
  higherParts: Rational;
  totalParts: Rational;
  onePart: Rational;
} {
  const request = question.parameters.request;
  const lowerGap = subtractRational(request.higherValue, request.targetValue);
  const higherGap = subtractRational(request.targetValue, request.lowerValue);
  const [lowerParts, higherParts] = reduceRationalRatio(lowerGap, higherGap);
  const totalParts = addRational(lowerParts, higherParts);
  const onePart = divideRational(request.totalQuantity, totalParts);
  return { lowerParts, higherParts, totalParts, onePart };
}

function buildBothQuantities(question: any): MalCp001TeacherExplanation {
  const request = question.parameters.request;
  const solution = question.solution;
  const unit = question.parameters.context.quantityUnit === "kg" ? "kg" : "litre";
  const lowerGap = subtractRational(request.higherValue, request.targetValue);
  const higherGap = subtractRational(request.targetValue, request.lowerValue);
  const scale = ratioScaleData(question);

  return makeExplanation({
    coreConcept:
      "First use Alligation Cross to find the quantity ratio. Then use the total quantity to change ratio parts into actual kilograms or litres.",
    formula:
      "\\(\\text{One ratio part}=\\dfrac{\\text{Total quantity}}{\\text{Total ratio parts}}\\)",
    steps: [
      `Cross difference for ${request.lowerComponentLabel} = ${numberText(request.higherValue)} − ${numberText(request.targetValue)} = ${numberText(lowerGap)}.`,
      `Cross difference for ${request.higherComponentLabel} = ${numberText(request.targetValue)} − ${numberText(request.lowerValue)} = ${numberText(higherGap)}.`,
      `Quantity ratio = ${numberText(lowerGap)} : ${numberText(higherGap)} = ${ratioText(scale.lowerParts, scale.higherParts)}.`,
      `Total ratio parts = ${numberText(scale.lowerParts)} + ${numberText(scale.higherParts)} = ${numberText(scale.totalParts)}.`,
      `One ratio part = ${quantityText(request.totalQuantity, unit)} ÷ ${numberText(scale.totalParts)} = ${quantityText(scale.onePart, unit)}.`,
      `${request.lowerComponentLabel} quantity = ${numberText(scale.lowerParts)} × ${quantityText(scale.onePart, unit)} = ${quantityText(solution.firstQuantity, unit)}.`,
      `${request.higherComponentLabel} quantity = ${numberText(scale.higherParts)} × ${quantityText(scale.onePart, unit)} = ${quantityText(solution.secondQuantity, unit)}.`,
    ],
    examShortcut:
      "Cross first, scale second. Do not start with two algebra variables when the total quantity is already given.",
    verification: `Check: ${quantityText(solution.firstQuantity, unit)} + ${quantityText(solution.secondQuantity, unit)} = ${quantityText(request.totalQuantity, unit)}, and their average price is ${priceText(request.targetValue, unit)}.`,
    conclusion: `The quantities are ${quantityText(solution.firstQuantity, unit)} of ${request.lowerComponentLabel} and ${quantityText(solution.secondQuantity, unit)} of ${request.higherComponentLabel}.`,
    commonTrap: makeTrap(
      question,
      ["QUANTITIES_SWAPPED", "EQUAL_SPLIT_ASSUMED", "RATIO_REVERSED"],
      "Keep the answer in the asked order. Equal quantities are correct only when the target price is exactly halfway between the two source prices.",
    ),
  });
}

function buildRequestedShare(question: any): MalCp001TeacherExplanation {
  const request = question.parameters.request;
  const solution = question.solution;
  const unit = question.parameters.context.quantityUnit === "kg" ? "kg" : "litre";
  const lowerGap = subtractRational(request.higherValue, request.targetValue);
  const higherGap = subtractRational(request.targetValue, request.lowerValue);
  const scale = ratioScaleData(question);
  const requestedLabel = request.requestedSide === "LOWER"
    ? request.lowerComponentLabel
    : request.higherComponentLabel;
  const requestedParts = request.requestedSide === "LOWER"
    ? scale.lowerParts
    : scale.higherParts;

  return makeExplanation({
    coreConcept:
      "Find the alligation ratio, change one ratio part into an actual quantity, and calculate only the component asked for.",
    formula:
      "\\(\\text{Asked quantity}=\\text{Asked ratio parts}\\times\\dfrac{\\text{Total quantity}}{\\text{Total ratio parts}}\\)",
    steps: [
      `Cross difference for ${request.lowerComponentLabel} = ${numberText(request.higherValue)} − ${numberText(request.targetValue)} = ${numberText(lowerGap)}.`,
      `Cross difference for ${request.higherComponentLabel} = ${numberText(request.targetValue)} − ${numberText(request.lowerValue)} = ${numberText(higherGap)}.`,
      `Quantity ratio = ${ratioText(scale.lowerParts, scale.higherParts)}.`,
      `Total ratio parts = ${numberText(scale.lowerParts)} + ${numberText(scale.higherParts)} = ${numberText(scale.totalParts)}.`,
      `One ratio part = ${quantityText(request.totalQuantity, unit)} ÷ ${numberText(scale.totalParts)} = ${quantityText(scale.onePart, unit)}.`,
      `${requestedLabel} uses ${numberText(requestedParts)} parts. Required quantity = ${numberText(requestedParts)} × ${quantityText(scale.onePart, unit)} = ${quantityText(solution.quantity, unit)}.`,
    ],
    examShortcut:
      "After finding one-part value, multiply only by the ratio parts of the item named in the question. There is no need to calculate both quantities.",
    verification: `Check: the requested share ${quantityText(solution.quantity, unit)} fits the same ratio and total quantity, giving the target price ${priceText(request.targetValue, unit)}.`,
    conclusion: `The required quantity of ${requestedLabel} is ${quantityText(solution.quantity, unit)}.`,
    commonTrap: makeTrap(
      question,
      ["OTHER_COMPONENT_REPORTED", "RATIO_PART_USED_AS_QUANTITY", "EQUAL_SPLIT_ASSUMED"],
      "Read the component name in the last line. A ratio part is not an actual quantity until it is multiplied by the one-part value.",
    ),
  });
}

function buildTwoStageMean(question: any): MalCp001TeacherExplanation {
  const request = question.parameters.request;
  const solution = question.solution;
  const unit = question.parameters.context.quantityUnit === "kg" ? "kg" : "litre";
  const first: BlendComponent = request.stageOneComponents[0];
  const second: BlendComponent = request.stageOneComponents[1];
  const stageOneValues = [totalValue(first), totalValue(second)];
  const stageOneTotalValue = addRational(stageOneValues[0], stageOneValues[1]);
  const stageOneTotalQuantity = addRational(first.quantity, second.quantity);
  const stageOneMean = divideRational(stageOneTotalValue, stageOneTotalQuantity);
  const usedPortionValue = multiplyRational(request.stageOneQuantityUsed, stageOneMean);
  const finalComponentValue = totalValue(request.finalComponent);
  const finalTotalValue = addRational(usedPortionValue, finalComponentValue);
  const finalTotalQuantity = addRational(
    request.stageOneQuantityUsed,
    request.finalComponent.quantity,
  );

  return makeExplanation({
    coreConcept:
      "Solve the first blend completely. Then treat the used portion of that blend as one new item in the second mixing step.",
    formula:
      "\\(\\text{Final average price}=\\dfrac{\\text{Value of used first blend}+\\text{Value of new item}}{\\text{Final total quantity}}\\)",
    steps: [
      `${first.label} value = ${numberText(first.quantity)} × ₹${numberText(first.value)} = ${moneyText(stageOneValues[0])}.`,
      `${second.label} value = ${numberText(second.quantity)} × ₹${numberText(second.value)} = ${moneyText(stageOneValues[1])}.`,
      `First-blend total value = ${moneyText(stageOneValues[0])} + ${moneyText(stageOneValues[1])} = ${moneyText(stageOneTotalValue)}. First-blend total quantity = ${numberText(first.quantity)} + ${numberText(second.quantity)} = ${quantityText(stageOneTotalQuantity, unit)}.`,
      `First-blend average price = ${moneyText(stageOneTotalValue)} ÷ ${numberText(stageOneTotalQuantity)} = ${priceText(stageOneMean, unit)}.`,
      `Value of the used first-blend portion = ${numberText(request.stageOneQuantityUsed)} × ₹${numberText(stageOneMean)} = ${moneyText(usedPortionValue)}.`,
      `Value of ${request.finalComponent.label} = ${numberText(request.finalComponent.quantity)} × ₹${numberText(request.finalComponent.value)} = ${moneyText(finalComponentValue)}.`,
      `Final total value = ${moneyText(usedPortionValue)} + ${moneyText(finalComponentValue)} = ${moneyText(finalTotalValue)}. Final total quantity = ${numberText(request.stageOneQuantityUsed)} + ${numberText(request.finalComponent.quantity)} = ${quantityText(finalTotalQuantity, unit)}.`,
      `Final average price = ${moneyText(finalTotalValue)} ÷ ${numberText(finalTotalQuantity)} = ${priceText(solution.value, unit)}.`,
    ],
    examShortcut:
      "Once the first blend's average price is known, forget its old ingredients. Use only the portion quantity and that average price in stage two.",
    verification: `Check: ${priceText(solution.value, unit)} × ${quantityText(finalTotalQuantity, unit)} = ${moneyText(finalTotalValue)}, the final value total.`,
    conclusion: `The final blend costs ${priceText(solution.value, unit)}.`,
    commonTrap: makeTrap(
      question,
      ["STAGE_ONE_MEAN_REPORTED", "SIMPLE_STAGE_AVERAGE", "ONE_COMPONENT_OMITTED"],
      "The first-blend price is only an intermediate result. Use it with the exact portion taken, then include the new item before finding the final answer.",
    ),
  });
}

export function buildMalCp001TeacherExplanation(
  question: any,
  qlId: MalCp001PermanentQlId,
): MalCp001TeacherExplanation {
  switch (qlId) {
    case "MAL-QL-001":
      return buildTargetRatio(question);
    case "MAL-QL-002":
      return buildWeightedMean(question, false);
    case "MAL-QL-003":
      return buildWeightedMean(question, true);
    case "MAL-QL-004":
      return buildWeightedMean(question, false);
    case "MAL-QL-005":
      return buildUnknownSourceFromQuantities(question);
    case "MAL-QL-006":
      return buildUnknownSourceFromRatio(question);
    case "MAL-QL-007":
      return buildOneKnownUnknownQuantity(question);
    case "MAL-QL-008":
      return buildMultiKnownUnknownQuantity(question);
    case "MAL-QL-009":
      return buildBothQuantities(question);
    case "MAL-QL-010":
      return buildRequestedShare(question);
    case "MAL-QL-011":
      return buildTwoStageMean(question);
  }
}
