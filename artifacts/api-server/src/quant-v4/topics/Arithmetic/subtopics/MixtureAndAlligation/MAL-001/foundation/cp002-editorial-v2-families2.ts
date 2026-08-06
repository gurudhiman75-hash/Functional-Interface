import { addRational, divideRational, multiplyRational } from "./rational";
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

export function forwardReplacementEditorial(
  question: MalCp002ReleasedQuestion,
): { stem: string; explanation: Explanation } {
  const parameters = question.parameters as {
    initialState: MalCp002State;
    removedQuantity: Rational;
    replacementComponent: MalCp002ComponentId;
  };
  const solution = question.solution as unknown as {
    retainedFraction: Rational;
    finalState: MalCp002State;
    finalRatio: MalCp002Ratio;
  };
  const labels = labelsOf(question);
  const unit = question.diagram.quantityUnit;
  const refillLabel = labelOf(labels, parameters.replacementComponent);
  const total = addRational(
    parameters.initialState.componentA,
    parameters.initialState.componentB,
  );
  const retainedA = multiplyRational(
    parameters.initialState.componentA,
    solution.retainedFraction,
  );
  const retainedB = multiplyRational(
    parameters.initialState.componentB,
    solution.retainedFraction,
  );

  const stem = choose(`${question.seed}:stem`, [
    `A vessel contains ${quantityMath(parameters.initialState.componentA, unit)} of ${labels[0]} and ${quantityMath(parameters.initialState.componentB, unit)} of ${labels[1]}. A well-mixed sample of ${quantityMath(parameters.removedQuantity, unit)} is removed and replaced with the same quantity of ${refillLabel}. What is the final ratio of ${labels[0]} to ${labels[1]}?`,
    `A mixture contains ${stateMath(parameters.initialState, labels, unit)}. After removing ${quantityMath(parameters.removedQuantity, unit)} of the well-mixed contents and refilling the same amount with ${refillLabel}, what is the new ratio of ${labels[0]} to ${labels[1]}?`,
  ]);

  return {
    stem,
    explanation: buildExplanation(question, {
      coreConcept: `The removed sample has the same composition as the vessel. First multiply both original quantities by the retained fraction; then add the refill only to ${refillLabel}.`,
      formula: [
        displayMath(`\\text{Retained fraction}=\\frac{V-r}{V}`),
        displayMath(`\\text{Amount left}=\\text{initial amount}\\times\\frac{V-r}{V}`),
      ].join("\n"),
      steps: [
        `Step 1: Find the total quantity: ${displayMath(`V=${latexNumber(parameters.initialState.componentA)}+${latexNumber(parameters.initialState.componentB)}=${latexNumber(total)}\\,\\text{${latexText(unit)}}`)}`,
        `Step 2: Calculate the retained fraction: ${displayMath(`\\frac{V-r}{V}=\\frac{${latexNumber(total)}-${latexNumber(parameters.removedQuantity)}}{${latexNumber(total)}}=${latexNumber(solution.retainedFraction)}`)}`,
        `Step 3: Find the retained ${labels[0]}: ${displayMath(`${latexNumber(parameters.initialState.componentA)}\\times ${latexNumber(solution.retainedFraction)}=${latexNumber(retainedA)}\\,\\text{${latexText(unit)}}`)}`,
        `Step 4: Find the retained ${labels[1]}: ${displayMath(`${latexNumber(parameters.initialState.componentB)}\\times ${latexNumber(solution.retainedFraction)}=${latexNumber(retainedB)}\\,\\text{${latexText(unit)}}`)}`,
        `Step 5: Add the refill to ${refillLabel} only. The final quantities are ${stateMath(solution.finalState, labels, unit)}.`,
        `Step 6: Reduce the final quantities: ${displayMath(`${latexNumber(solution.finalState.componentA)}:${latexNumber(solution.finalState.componentB)}=${latexNumber(solution.finalRatio.componentAPart)}:${latexNumber(solution.finalRatio.componentBPart)}`)}`,
      ],
      verification: `The final quantities add to ${quantityMath(total, unit)}, so the vessel has been restored to its original total.`,
      conclusion: `The final ratio is ${ratioMath(solution.finalRatio)}.`,
      examShortcut: `Apply ${inlineMath(`\\frac{${latexNumber(total)}-${latexNumber(parameters.removedQuantity)}}{${latexNumber(total)}}=${latexNumber(solution.retainedFraction)}`)} to both items, then add the refill to ${refillLabel}.`,
      commonTrap: `Do not subtract the whole removed amount from one item. A well-mixed sample contains both items in the current ratio.`,
    }),
  };
}

export function invarianceEditorial(
  question: MalCp002ReleasedQuestion,
): { stem: string; explanation: Explanation } {
  const parameters = question.parameters as { initialRatio: MalCp002Ratio; removedQuantity: Rational };
  const solution = question.solution as unknown as { retainedFraction: Rational; finalState: MalCp002State; finalRatio: MalCp002Ratio };
  const labels = labelsOf(question);
  const unit = question.diagram.quantityUnit;

  const stem = choose(`${question.seed}:stem`, [
    `${labels[0]} and ${labels[1]} are in the ratio ${ratioMath(parameters.initialRatio)}. A well-mixed sample of ${quantityMath(parameters.removedQuantity, unit)} is removed and nothing is added. What is the ratio of ${labels[0]} to ${labels[1]} in the remaining mixture?`,
    `A mixture contains ${labels[0]} and ${labels[1]} in the ratio ${ratioMath(parameters.initialRatio)}. If ${quantityMath(parameters.removedQuantity, unit)} of the well-mixed mixture is taken out without replacement, what ratio is left behind?`,
  ]);

  return {
    stem,
    explanation: buildExplanation(question, {
      coreConcept: `A well-mixed sample removes the same fraction of both items. Multiplying both terms of a ratio by the same retained factor does not change the ratio.`,
      formula: displayMath(`A\\left(1-\\frac{r}{V}\\right):B\\left(1-\\frac{r}{V}\\right)=A:B`),
      steps: [
        `Step 1: The initial ratio is ${ratioMath(parameters.initialRatio)}.`,
        `Step 2: The fraction of each item that remains is ${inlineMath(latexNumber(solution.retainedFraction))}.`,
        `Step 3: Both quantities are multiplied by this same factor: ${displayMath(`${latexNumber(parameters.initialRatio.componentAPart)}\\times ${latexNumber(solution.retainedFraction)}:${latexNumber(parameters.initialRatio.componentBPart)}\\times ${latexNumber(solution.retainedFraction)}`)}`,
        `Step 4: The common factor cancels, so the ratio remains ${ratioMath(solution.finalRatio)}.`,
        `Step 5: The calculated quantities left in this instance are ${stateMath(solution.finalState, labels, unit)}, and they reduce to the same ratio.`,
      ],
      verification: `${displayMath(`\\frac{${latexNumber(solution.finalState.componentA)}}{${latexNumber(solution.finalState.componentB)}}=\\frac{${latexNumber(solution.finalRatio.componentAPart)}}{${latexNumber(solution.finalRatio.componentBPart)}}`)}`,
      conclusion: `The remaining ratio is ${ratioMath(solution.finalRatio)}.`,
      examShortcut: `When a sample is well mixed and nothing is added back, write the original ratio immediately.`,
      commonTrap: `Do not subtract the full sample quantity from only one item. That would be a different operation.`,
    }),
  };
}

export function operationChoiceEditorial(
  question: MalCp002ReleasedQuestion,
): { stem: string; explanation: Explanation } {
  const parameters = question.parameters as { initialState: MalCp002State; targetRatio: MalCp002Ratio };
  const solution = question.solution as unknown as { changedComponent: MalCp002ComponentId; adjustmentKind: "ADD" | "REMOVE"; quantity: Rational; finalState: MalCp002State };
  const labels = labelsOf(question);
  const unit = question.diagram.quantityUnit;
  const changed = solution.changedComponent;
  const other = otherComponent(changed);
  const changedLabel = labelOf(labels, changed);
  const otherLabel = labelOf(labels, other);
  const [targetA, targetB] = ratioParts(parameters.targetRatio);
  const changedPart = changed === "A" ? targetA : targetB;
  const otherPart = other === "A" ? targetA : targetB;
  const otherQuantity = componentValue(parameters.initialState, other);
  const onePart = divideRational(otherQuantity, otherPart);
  const requiredChanged = multiplyRational(changedPart, onePart);
  const initialChanged = componentValue(parameters.initialState, changed);
  const action = solution.adjustmentKind === "ADD" ? "add" : "remove";
  const difference = solution.adjustmentKind === "ADD"
    ? `${latexNumber(requiredChanged)}-${latexNumber(initialChanged)}`
    : `${latexNumber(initialChanged)}-${latexNumber(requiredChanged)}`;

  const stem = choose(`${question.seed}:stem`, [
    `A mixture contains ${stateMath(parameters.initialState, labels, unit)}. Which single addition or removal will change the ratio of ${labels[0]} to ${labels[1]} to ${ratioMath(parameters.targetRatio)}?`,
    `The quantities of ${labels[0]} and ${labels[1]} are ${quantityMath(parameters.initialState.componentA, unit)} and ${quantityMath(parameters.initialState.componentB, unit)}. What one-item operation is needed to obtain the ratio ${ratioMath(parameters.targetRatio)}?`,
  ]);

  return {
    stem,
    explanation: buildExplanation(question, {
      coreConcept: `Use ${otherLabel}, whose quantity will not be adjusted, to scale the target ratio. Comparing the required and current quantities of ${changedLabel} reveals both the operation and the amount.`,
      formula: [
        displayMath(`\\text{Target one part}=\\frac{\\text{quantity of ${latexText(otherLabel)}}}{\\text{target parts of ${latexText(otherLabel)}}}`),
        displayMath(`\\text{Required change}=${solution.adjustmentKind === "ADD" ? "\\text{required quantity}-\\text{current quantity}" : "\\text{current quantity}-\\text{required quantity}"}`),
      ].join("\n"),
      steps: [
        `Step 1: The starting quantities are ${stateMath(parameters.initialState, labels, unit)}.`,
        `Step 2: In the target ratio ${ratioMath(parameters.targetRatio)}, ${otherLabel} represents ${inlineMath(`${latexNumber(otherPart)}\\,\\text{parts}`)}.`,
        `Step 3: Find one target part: ${displayMath(`1\\,\\text{part}=\\frac{${latexNumber(otherQuantity)}}{${latexNumber(otherPart)}}=${latexNumber(onePart)}\\,\\text{${latexText(unit)}}`)}`,
        `Step 4: The required amount of ${changedLabel} is ${displayMath(`${latexNumber(changedPart)}\\times ${latexNumber(onePart)}=${latexNumber(requiredChanged)}\\,\\text{${latexText(unit)}}`)}`,
        `Step 5: Compare with the current ${changedLabel} quantity: ${displayMath(`\\text{Amount to ${action}}=${difference}=${latexNumber(solution.quantity)}\\,\\text{${latexText(unit)}}`)}`,
        `Step 6: Since ${inlineMath(`${latexNumber(requiredChanged)}${solution.adjustmentKind === "ADD" ? ">" : "<"}${latexNumber(initialChanged)}`)}, the required quantity is ${solution.adjustmentKind === "ADD" ? "greater" : "smaller"} than the current quantity. Therefore, ${changedLabel} must be ${solution.adjustmentKind === "ADD" ? "added" : "removed"}.`,
      ],
      verification: `The selected operation gives ${stateMath(solution.finalState, labels, unit)}, whose ratio is ${ratioMath(parameters.targetRatio)}.`,
      conclusion: `${solution.adjustmentKind === "ADD" ? "Add" : "Remove"} ${quantityMath(solution.quantity, unit, true)} of ${changedLabel}.`,
      examShortcut: `Keep ${quantityMath(otherQuantity, unit)} of ${otherLabel} as the target-ratio anchor. It gives a required ${changedLabel} amount of ${quantityMath(requiredChanged, unit)}; compare this directly with the current amount.`,
      commonTrap: `A correct quantity paired with the wrong item or the wrong direction is still an incorrect operation.`,
    }),
  };
}
