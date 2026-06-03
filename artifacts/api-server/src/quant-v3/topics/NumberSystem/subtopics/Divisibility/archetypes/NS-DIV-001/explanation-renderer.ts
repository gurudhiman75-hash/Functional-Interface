import type { Cp001Parameters, Cp001ReasoningGraph, Cp001Explanation } from "./types";
import {
  assertNsDiv001DivisorCapabilityAllowed,
  getNsDiv001ActiveCp001ExplanationVariants,
} from "./realism-library";

function outputNumber(value: unknown) {
  if (typeof value !== "number") throw new Error("Reasoning graph output is missing a numeric value.");
  return value;
}

export function renderCp001ExplanationFromGraph(parameters: Cp001Parameters, graph: Cp001ReasoningGraph): Cp001Explanation {
  const conditionNode = graph.nodes.find((node) => node.type === "Condition Construction");
  const verificationNode = graph.nodes.find((node) => node.type === "Verification");
  const answerNode = graph.nodes.find((node) => node.id === graph.answerNodeId);

  if (!conditionNode || !verificationNode || !answerNode) {
    throw new Error("Explanation renderer requires a complete reasoning graph.");
  }

  const knownDigitSum = outputNumber(conditionNode.inputs.knownDigitSum);
  const answerDigit = outputNumber(answerNode.outputs.answerDigit);
  const resolvedNumber = outputNumber(answerNode.outputs.resolvedNumber);
  const digitSum = outputNumber(verificationNode.outputs.digitSum);
  const divisorCapability = assertNsDiv001DivisorCapabilityAllowed(parameters.divisor, parameters.canonicalProblemId);
  const variants = getNsDiv001ActiveCp001ExplanationVariants();
  const variantId = variants[(knownDigitSum + answerDigit) % variants.length];
  const ruleText = ruleSentence(parameters.divisor, divisorCapability.reasoningPattern.name, parameters.divisorComponents);
  const applyText = applySentence(parameters.divisor, divisorCapability.reasoningPattern.name, knownDigitSum, resolvedNumber, parameters.divisorComponents);

  const variantLines: Record<string, readonly string[]> = {
    "Variant A": [
      `Rule: ${ruleText}`,
      `Apply Rule: ${applyText}`,
      `Compute: Solving this condition gives x = ${answerDigit}.`,
      `Conclude: Therefore, x = ${answerDigit}.`,
    ],
    "Variant B": [
      `Recall Rule: ${ruleText}`,
      `Observe Digits: The known digits add up to ${knownDigitSum}.`,
      `Apply Condition: Using the divisibility condition, we obtain x = ${answerDigit}.`,
      `Answer: So the correct answer is ${answerDigit}.`,
    ],
    "Variant C": [
      `Check Divisibility Condition: ${ruleText}`,
      `Form Expression: ${applyText}`,
      `Solve: Solving this condition gives x = ${answerDigit}.`,
      `Final Result: Hence, the required digit is ${answerDigit}.`,
    ],
    "Variant D": [
      `Required Rule: ${ruleText}`,
      `Known Information: The known digits add up to ${knownDigitSum}.`,
      `Calculation: This gives x = ${answerDigit}.`,
      `Conclusion: Therefore, x = ${answerDigit}.`,
    ],
    "Variant E": [
      `Divisibility Test: ${ruleText}`,
      `Digit Sum: The known digits add up to ${knownDigitSum}.`,
      `Condition Satisfaction: The completed number is ${resolvedNumber}, and its digit sum is ${digitSum}.`,
      `Answer: Hence, the required digit is ${answerDigit}.`,
    ],
  };

  return {
    graphId: graph.graphId,
    variantId,
    lines: variantLines[variantId],
  };
}

function ruleSentence(divisor: number, ruleName: string, components?: readonly number[]) {
  switch (ruleName) {
    case "Digit Sum Rule":
      return `For a number to be divisible by ${divisor}, the sum of its digits must be divisible by ${divisor}.`;
    case "Alternating Sum Rule":
      return `For a number to be divisible by ${divisor}, the alternating sum of its digits must satisfy the divisibility test.`;
    case "Last Digit Rule":
      return `For a number to be divisible by ${divisor}, its last digit must satisfy the divisibility test.`;
    case "Last Two Digits Rule":
      return `For a number to be divisible by ${divisor}, the number formed by its last two digits must satisfy the divisibility test.`;
    case "Last Three Digits Rule":
      return `For a number to be divisible by ${divisor}, the number formed by its last three digits must satisfy the divisibility test.`;
    case "Combined Divisibility Rule":
      return `For a number to be divisible by ${divisor}, it must satisfy divisibility by ${components?.join(" and ")}.`;
    default:
      return `For a number to be divisible by ${divisor}, the approved divisibility test must be satisfied.`;
  }
}

function applySentence(divisor: number, ruleName: string, knownDigitSum: number, resolvedNumber: number, components?: readonly number[]) {
  if (ruleName === "Digit Sum Rule") {
    return `The known digits add up to ${knownDigitSum}.`;
  }
  if (ruleName === "Combined Divisibility Rule") {
    return `The completed number ${resolvedNumber} satisfies the required checks for ${components?.join(" and ")}.`;
  }
  return `Applying this rule to the given number, ${resolvedNumber} is divisible by ${divisor}.`;
}
