import { addRational, divideRational, multiplyRational, subtractRational } from "./rational";
import type { MalCp002ReleasedQuestion } from "./cp002-permanent-runtime";
import type { MalCp002ComponentId, MalCp002Ratio, MalCp002State } from "./cp002-types";
import type { Rational } from "./types";
import {
  choose,
  latexText,
  latexNumber,
  inlineMath,
  displayMath,
  quantityMath,
  ratioParts,
  ratioMath,
  stateMath,
  componentValue,
  otherComponent,
  labelsOf,
  labelOf,
  buildExplanation,
  type Explanation
} from "./cp002-editorial-v2-common";

export function totalRatioAdjustmentEditorial(
  question: MalCp002ReleasedQuestion,
): { stem: string; explanation: Explanation } {
  const parameters = question.parameters as {
    initialTotal: Rational;
    initialRatio: MalCp002Ratio;
    changedComponent: MalCp002ComponentId;
    adjustmentKind: "ADD" | "REMOVE";
    targetRatio: MalCp002Ratio;
  };
  const solution = question.solution as unknown as {
    quantity: Rational;
    initialState: MalCp002State;
    finalState: MalCp002State;
    targetRatio: MalCp002Ratio;
  };
  const labels = labelsOf(question);
  const unit = question.diagram.quantityUnit;
  const changed = parameters.changedComponent;
  const other = otherComponent(changed);
  const changedLabel = labelOf(labels, changed);
  const otherLabel = labelOf(labels, other);
  const action = parameters.adjustmentKind === "ADD" ? "added" : "removed";
  const [initialAPart, initialBPart] = ratioParts(parameters.initialRatio);
  const initialParts = addRational(initialAPart, initialBPart);
  const initialOnePart = divideRational(parameters.initialTotal, initialParts);
  const [targetAPart, targetBPart] = ratioParts(parameters.targetRatio);
  const targetChangedPart = changed === "A" ? targetAPart : targetBPart;
  const targetOtherPart = other === "A" ? targetAPart : targetBPart;
  const otherQuantity = componentValue(solution.initialState, other);
  const targetOnePart = divideRational(otherQuantity, targetOtherPart);
  const requiredChanged = componentValue(solution.finalState, changed);
  const initialChanged = componentValue(solution.initialState, changed);
  const difference = parameters.adjustmentKind === "ADD"
    ? `${latexNumber(requiredChanged)}-${latexNumber(initialChanged)}`
    : `${latexNumber(initialChanged)}-${latexNumber(requiredChanged)}`;

  const stem = choose(`${question.seed}:stem`, [
    `A mixture has a total quantity of ${quantityMath(parameters.initialTotal, unit)}. ${labels[0]} and ${labels[1]} are in the ratio ${ratioMath(parameters.initialRatio)}. How many ${unit} of ${changedLabel} should be ${action} so that their ratio becomes ${ratioMath(parameters.targetRatio)}?`,
    `In a ${quantityMath(parameters.initialTotal, unit)} mixture, the ratio of ${labels[0]} to ${labels[1]} is ${ratioMath(parameters.initialRatio)}. What quantity of ${changedLabel} should be ${action} to obtain the ratio ${ratioMath(parameters.targetRatio)}?`,
    `The total amount of a mixture is ${quantityMath(parameters.initialTotal, unit)}, with ${labels[0]} and ${labels[1]} in the ratio ${ratioMath(parameters.initialRatio)}. How much ${changedLabel} must be ${action} to make the ratio ${ratioMath(parameters.targetRatio)}?`,
  ]);

  return {
    stem,
    explanation: buildExplanation(question, {
      coreConcept: `First use the initial total and ratio to find the actual quantities. Since only ${changedLabel} is ${action}, the quantity of ${otherLabel} remains ${quantityMath(otherQuantity, unit)}; use it to scale the target ratio.`,
      formula: [
        displayMath(`\\text{Initial one part}=\\frac{\\text{initial total}}{\\text{sum of initial ratio parts}}`),
        displayMath(`\\text{Target one part}=\\frac{\\text{quantity of ${latexText(otherLabel)}}}{\\text{target parts of ${latexText(otherLabel)}}}`),
        displayMath(`\\text{Amount ${action}}=${parameters.adjustmentKind === "ADD" ? "\\text{required quantity}-\\text{initial quantity}" : "\\text{initial quantity}-\\text{required quantity}"}`),
      ].join("\n"),
      steps: [
        `Step 1: Add the initial ratio parts: ${displayMath(`\\text{Initial parts}=${latexNumber(initialAPart)}+${latexNumber(initialBPart)}=${latexNumber(initialParts)}`)}`,
        `Step 2: Find the initial value of one part: ${displayMath(`1\\,\\text{part}=\\frac{${latexNumber(parameters.initialTotal)}}{${latexNumber(initialParts)}}=${latexNumber(initialOnePart)}\\,\\text{${latexText(unit)}}`)}`,
        `Step 3: Therefore, the initial quantities are ${stateMath(solution.initialState, labels, unit)}.`,
        `Step 4: In the target ratio ${ratioMath(parameters.targetRatio)}, ${otherLabel} represents ${inlineMath(`${latexNumber(targetOtherPart)}\\,\\text{parts}`)}. Since its quantity is still ${quantityMath(otherQuantity, unit)}, ${displayMath(`1\\,\\text{target part}=\\frac{${latexNumber(otherQuantity)}}{${latexNumber(targetOtherPart)}}=${latexNumber(targetOnePart)}\\,\\text{${latexText(unit)}}`)}`,
        `Step 5: The required quantity of ${changedLabel} is ${displayMath(`\\text{Required ${latexText(changedLabel)}}=${latexNumber(targetChangedPart)}\\times ${latexNumber(targetOnePart)}=${latexNumber(requiredChanged)}\\,\\text{${latexText(unit)}}`)}`,
        `Step 6: Calculate the directed change: ${displayMath(`\\text{Amount ${action}}=${difference}=${latexNumber(solution.quantity)}\\,\\text{${latexText(unit)}}`)}`,
      ],
      verification: `The final quantities are ${stateMath(solution.finalState, labels, unit)}, and their ratio is ${ratioMath(solution.targetRatio)}.`,
      conclusion: `${quantityMath(solution.quantity, unit, true)} of ${changedLabel} should be ${action}.`,
      examShortcut: `After reconstructing the initial quantities, keep ${quantityMath(otherQuantity, unit)} of ${otherLabel} as the anchor. Scale the target ratio from that amount and compare the required ${changedLabel} quantity with its starting value.`,
      commonTrap: `Do not distribute the target ratio across the original total. The total changes when ${changedLabel} is ${action}.`,
    }),
  };
}

export function otherComponentEditorial(
  question: MalCp002ReleasedQuestion,
): { stem: string; explanation: Explanation } {
  const parameters = question.parameters as { ratio: MalCp002Ratio; knownComponent: MalCp002ComponentId; knownQuantity: Rational };
  const solution = question.solution as unknown as { otherQuantity: Rational; fullState: MalCp002State };
  const labels = labelsOf(question);
  const unit = question.diagram.quantityUnit;
  const known = parameters.knownComponent;
  const other = otherComponent(known);
  const knownLabel = labelOf(labels, known);
  const otherLabel = labelOf(labels, other);
  const [aPart, bPart] = ratioParts(parameters.ratio);
  const knownPart = known === "A" ? aPart : bPart;
  const otherPart = other === "A" ? aPart : bPart;
  const onePart = divideRational(parameters.knownQuantity, knownPart);

  const stem = choose(`${question.seed}:stem`, [
    `${labels[0]} and ${labels[1]} are present in the ratio ${ratioMath(parameters.ratio)}. If the quantity of ${knownLabel} is ${quantityMath(parameters.knownQuantity, unit)}, what is the quantity of ${otherLabel}?`,
    `In a mixture, the ratio of ${labels[0]} to ${labels[1]} is ${ratioMath(parameters.ratio)}. The mixture contains ${quantityMath(parameters.knownQuantity, unit)} of ${knownLabel}. How much ${otherLabel} does it contain?`,
    `A mixture contains ${labels[0]} and ${labels[1]} in the ratio ${ratioMath(parameters.ratio)}. Given that ${knownLabel} measures ${quantityMath(parameters.knownQuantity, unit)}, how much ${otherLabel} is present?`,
  ]);

  return {
    stem,
    explanation: buildExplanation(question, {
      coreConcept: `${knownLabel} represents ${inlineMath(`${latexNumber(knownPart)}\\,\\text{ratio parts}`)}. Divide its known quantity by those parts to find one part, then multiply by the parts belonging to ${otherLabel}.`,
      formula: [
        displayMath(`\\text{One part}=\\frac{\\text{known quantity}}{\\text{known ratio parts}}`),
        displayMath(`\\text{Other quantity}=\\text{other ratio parts}\\times\\text{one part}`),
      ].join("\n"),
      steps: [
        `Step 1: ${knownLabel} corresponds to ${inlineMath(`${latexNumber(knownPart)}\\,\\text{parts}`)} in the ratio ${ratioMath(parameters.ratio)}.`,
        `Step 2: Find one part: ${displayMath(`1\\,\\text{part}=\\frac{${latexNumber(parameters.knownQuantity)}}{${latexNumber(knownPart)}}=${latexNumber(onePart)}\\,\\text{${latexText(unit)}}`)}`,
        `Step 3: ${otherLabel} corresponds to ${inlineMath(`${latexNumber(otherPart)}\\,\\text{parts}`)}.`,
        `Step 4: Find its quantity: ${displayMath(`\\text{${latexText(otherLabel)}}=${latexNumber(otherPart)}\\times ${latexNumber(onePart)}=${latexNumber(solution.otherQuantity)}\\,\\text{${latexText(unit)}}`)}`,
      ],
      verification: `The reconstructed quantities are ${stateMath(solution.fullState, labels, unit)}; they reduce to ${ratioMath(parameters.ratio)}.`,
      conclusion: `The quantity of ${otherLabel} is ${quantityMath(solution.otherQuantity, unit, true)}.`,
      examShortcut: `Scale the ratio directly from ${knownLabel}: ${inlineMath(`${latexNumber(parameters.knownQuantity)}\\div ${latexNumber(knownPart)}=${latexNumber(onePart)}`)} per part, then multiply by ${inlineMath(latexNumber(otherPart))}.`,
      commonTrap: `Do not multiply the known quantity by the other ratio term before dividing by the known item's own ratio term.`,
    }),
  };
}

export function originalTotalEditorial(
  question: MalCp002ReleasedQuestion,
): { stem: string; explanation: Explanation } {
  const parameters = question.parameters as { initialRatio: MalCp002Ratio; finalRatio: MalCp002Ratio; changedComponent: MalCp002ComponentId; adjustmentKind: "ADD" | "REMOVE"; adjustmentQuantity: Rational };
  const solution = question.solution as unknown as { originalScale: Rational; originalState: MalCp002State; originalTotal: Rational; finalState: MalCp002State };
  const labels = labelsOf(question);
  const unit = question.diagram.quantityUnit;
  const changed = parameters.changedComponent;
  const other = otherComponent(changed);
  const changedLabel = labelOf(labels, changed);
  const otherLabel = labelOf(labels, other);
  const action = parameters.adjustmentKind === "ADD" ? "added" : "removed";
  const sign = parameters.adjustmentKind === "ADD" ? "+" : "-";
  const [ia, ib] = ratioParts(parameters.initialRatio);
  const [fa, fb] = ratioParts(parameters.finalRatio);
  const initialChangedPart = changed === "A" ? ia : ib;
  const initialOtherPart = other === "A" ? ia : ib;
  const finalChangedPart = changed === "A" ? fa : fb;
  const finalOtherPart = other === "A" ? fa : fb;
  const yFactor = divideRational(initialOtherPart, finalOtherPart);
  const finalChangedCoefficient = multiplyRational(finalChangedPart, yFactor);
  const coefficient = parameters.adjustmentKind === "ADD"
    ? subtractRational(finalChangedCoefficient, initialChangedPart)
    : subtractRational(initialChangedPart, finalChangedCoefficient);

  const stem = choose(`${question.seed}:stem`, [
    `${labels[0]} and ${labels[1]} were initially in the ratio ${ratioMath(parameters.initialRatio)}. After ${quantityMath(parameters.adjustmentQuantity, unit)} of ${changedLabel} was ${action}, the ratio became ${ratioMath(parameters.finalRatio)}. What was the original total quantity?`,
    `The initial ratio of ${labels[0]} to ${labels[1]} was ${ratioMath(parameters.initialRatio)}. ${quantityMath(parameters.adjustmentQuantity, unit)} of ${changedLabel} was then ${action}, changing the ratio to ${ratioMath(parameters.finalRatio)}. What was the original total?`,
    `A mixture had ${labels[0]} and ${labels[1]} in the ratio ${ratioMath(parameters.initialRatio)}. When ${quantityMath(parameters.adjustmentQuantity, unit)} of ${changedLabel} was ${action}, the ratio became ${ratioMath(parameters.finalRatio)}. What was the mixture's original quantity?`,
  ]);

  return {
    stem,
    explanation: buildExplanation(question, {
      coreConcept: `Use one scale for the original ratio and another for the final ratio. Since no ${otherLabel} is added or removed, its quantity gives the equation that links the two scales.`,
      formula: [
        displayMath(`\\text{Original quantities}=ax\\text{ and }bx`),
        displayMath(`\\text{Final quantities}=ry\\text{ and }sy`),
        displayMath(`\\text{quantity of ${latexText(otherLabel)} before}=\\text{quantity of ${latexText(otherLabel)} after}`),
      ].join("\n"),
      steps: [
        `Step 1: Write the original quantities using ${inlineMath("x")}: ${displayMath(`\\text{Original quantities}=${latexNumber(ia)}x\\text{ and }${latexNumber(ib)}x`)}`,
        `Step 2: Write the final quantities using ${inlineMath("y")}: ${displayMath(`\\text{Final quantities}=${latexNumber(fa)}y\\text{ and }${latexNumber(fb)}y`)}`,
        `Step 3: ${otherLabel} has the same quantity in both states: ${displayMath(`${latexNumber(initialOtherPart)}x=${latexNumber(finalOtherPart)}y\\quad\\Rightarrow\\quad y=${latexNumber(yFactor)}x`)}`,
        `Step 4: Use the ${changedLabel} operation: ${displayMath(`${latexNumber(initialChangedPart)}x${sign}${latexNumber(parameters.adjustmentQuantity)}=${latexNumber(finalChangedPart)}y`)}`,
        `Step 5: Substitute ${inlineMath(`y=${latexNumber(yFactor)}x`)}: ${displayMath(`${latexNumber(initialChangedPart)}x${sign}${latexNumber(parameters.adjustmentQuantity)}=${latexNumber(finalChangedCoefficient)}x`)}`,
        `Step 6: Rearrange and solve: ${displayMath(`${latexNumber(parameters.adjustmentQuantity)}=${latexNumber(coefficient)}x\\quad\\Rightarrow\\quad x=\\frac{${latexNumber(parameters.adjustmentQuantity)}}{${latexNumber(coefficient)}}=${latexNumber(solution.originalScale)}`)}`,
        `Step 7: Find the original total: ${displayMath(`\\text{Original total}=(${latexNumber(ia)}+${latexNumber(ib)})\\times ${latexNumber(solution.originalScale)}=${latexNumber(solution.originalTotal)}\\,\\text{${latexText(unit)}}`)}`,
      ],
      verification: `The reconstructed original quantities are ${stateMath(solution.originalState, labels, unit)}. After the stated operation, they become ${stateMath(solution.finalState, labels, unit)}, which has ratio ${ratioMath(parameters.finalRatio)}.`,
      conclusion: `The original total quantity was ${quantityMath(solution.originalTotal, unit, true)}.`,
      examShortcut: `Match the ${otherLabel} terms first to connect the two ratio scales. Substitute that relation into the ${changedLabel} equation and solve for the original scale.`,
      commonTrap: `Do not use one common scale for both ratios. The ratio changes after ${changedLabel} is ${action}, so the original and final scales are different.`,
    }),
  };
}
