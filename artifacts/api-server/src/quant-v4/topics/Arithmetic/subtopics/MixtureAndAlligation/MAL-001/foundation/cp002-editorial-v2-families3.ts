import type { MalCp002ReleasedQuestion } from "./cp002-permanent-runtime";
import type { Rational } from "./types";
import {
  choose,
  latexText,
  latexNumber,
  inlineMath,
  displayMath,
  quantityMath,
  arrayRatioMath,
  buildExplanation,
  type Explanation
} from "./cp002-editorial-v2-common";

export function threeComponentEditorial(
  question: MalCp002ReleasedQuestion,
): { stem: string; explanation: Explanation } {
  const parameters = question.parameters as {
    initialRatio: readonly number[];
    finalRatio: readonly number[];
    additionA: Rational;
    additionB: Rational;
    labels: readonly string[];
  };
  const solution = question.solution as unknown as {
    scale: Rational;
    initialQuantities: readonly Rational[];
    finalQuantities: readonly Rational[];
    requestedQuantity: Rational;
  };
  const unit = question.diagram.quantityUnit;
  const [labelA, labelB, labelC] = parameters.labels;
  if (!labelA || !labelB || !labelC) {
    throw new Error(`${question.questionId}: three labels are required.`);
  }
  const [ia, ib, ic] = parameters.initialRatio;
  const [fa, fb, fc] = parameters.finalRatio;
  if (
    ia === undefined || ib === undefined || ic === undefined ||
    fa === undefined || fb === undefined || fc === undefined
  ) {
    throw new Error(`${question.questionId}: three-way ratios are incomplete.`);
  }

  const stem = choose(`${question.seed}:stem`, [
    `${labelA}, ${labelB} and ${labelC} are initially in the ratio ${arrayRatioMath(parameters.initialRatio)}. After adding ${quantityMath(parameters.additionA, unit)} of ${labelA} and ${quantityMath(parameters.additionB, unit)} of ${labelB}, their ratio becomes ${arrayRatioMath(parameters.finalRatio)}. What is the final quantity of ${labelC}?`,
    `A three-item mixture has ${labelA}, ${labelB} and ${labelC} in the ratio ${arrayRatioMath(parameters.initialRatio)}. ${quantityMath(parameters.additionA, unit)} of ${labelA} and ${quantityMath(parameters.additionB, unit)} of ${labelB} are added, producing the ratio ${arrayRatioMath(parameters.finalRatio)}. How much ${labelC} is present at the end?`,
  ]);

  return {
    stem,
    explanation: buildExplanation(question, {
      coreConcept: `No ${labelC} is added or removed, so its quantity is the same before and after. Use one of the stated additions to determine the common scale, and use the second addition as a check.`,
      formula: [
        displayMath(`\\text{Initial quantities}=ax,\\,bx,\\,cx`),
        displayMath(`\\text{After addition}=rx,\\,sx,\\,tx`),
      ].join("\n"),
      steps: [
        `Step 1: Represent the initial quantities as ${displayMath(`${ia}x,\\quad ${ib}x,\\quad ${ic}x`)}`,
        `Step 2: Use the change in ${labelA}: ${displayMath(`${ia}x+${latexNumber(parameters.additionA)}=${fa}x`)}`,
        `Step 3: Solve for the scale: ${displayMath(`${latexNumber(parameters.additionA)}=(${fa}-${ia})x\\quad\\Rightarrow\\quad x=${latexNumber(solution.scale)}`)}`,
        `Step 4: Check with ${labelB}: ${displayMath(`${ib}\\times ${latexNumber(solution.scale)}+${latexNumber(parameters.additionB)}=${fb}\\times ${latexNumber(solution.scale)}`)}`,
        `Step 5: Since ${labelC} is not adjusted, its final quantity is ${displayMath(`\\text{Final ${latexText(labelC)}}=${ic}\\times ${latexNumber(solution.scale)}=${latexNumber(solution.requestedQuantity)}\\,\\text{${latexText(unit)}}`)}`,
      ],
      verification: `The final quantities are ${inlineMath(solution.finalQuantities.map(latexNumber).join(":"))}, which reduce to ${arrayRatioMath(parameters.finalRatio)}.`,
      conclusion: `The final quantity of ${labelC} is ${quantityMath(solution.requestedQuantity, unit, true)}.`,
      examShortcut: `Use the first ratio term whose addition is known: ${inlineMath(`${ia}x+${latexNumber(parameters.additionA)}=${fa}x`)}. This gives ${inlineMath(`x=${latexNumber(solution.scale)}`)} immediately; multiply by ${inlineMath(String(ic))} for ${labelC}.`,
      commonTrap: `Do not add either stated amount to ${labelC}. Only ${labelA} and ${labelB} are adjusted.`,
    }),
  };
}
