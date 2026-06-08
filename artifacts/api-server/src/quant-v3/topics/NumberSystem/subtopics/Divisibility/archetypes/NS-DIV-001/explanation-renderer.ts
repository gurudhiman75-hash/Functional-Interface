import type { Cp001Parameters, Cp001ReasoningGraph, Cp001Explanation, Cp002Parameters, ValidDigitSetParameters } from "./types";
import {
  assertNsDiv001DivisorCapabilityAllowed,
  assertNsDiv001ExplanationStyleAllowed,
  assertNsDiv001ValidDigitSetExplanationStyleAllowed,
  getNsDiv001ValidDigitSetConclusion,
  getNsDiv001ActiveCp001ExplanationVariants,
} from "./realism-library";

function outputNumber(value: unknown) {
  if (typeof value !== "number") throw new Error("Reasoning graph output is missing a numeric value.");
  return value;
}

function outputNumberArray(value: unknown) {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "number")) {
    throw new Error("Reasoning graph output is missing a numeric array.");
  }
  return value as number[];
}

export function renderCp001ExplanationFromGraph(
  parameters: Cp001Parameters,
  graph: Cp001ReasoningGraph,
  styleId: string,
): Cp001Explanation {
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
  const explanationStyle = assertNsDiv001ExplanationStyleAllowed(styleId);
  const variants = getNsDiv001ActiveCp001ExplanationVariants();
  const variantId = variants[(knownDigitSum + answerDigit) % variants.length];
  const ruleText = ruleSentence(parameters.divisor, divisorCapability.reasoningPattern.name, parameters.divisorComponents);
  const applyText = applySentence(parameters.divisor, divisorCapability.reasoningPattern.name, knownDigitSum, resolvedNumber, parameters.divisorComponents);
  const teacherLines = [
    `Rule: ${ruleText}`,
    `Apply Rule: ${applyText}`,
    `Compute: Solving this condition gives x = ${answerDigit}.`,
    `Conclude: Therefore, x = ${answerDigit}.`,
  ] as const;
  const shortExamLines = [
    `Calculation: This gives x = ${answerDigit}.`,
    `Answer: So the correct answer is ${answerDigit}.`,
  ] as const;
  const detailedTeachingLines = [
    `Rule: ${ruleText}`,
    `Apply Rule: ${applyText}`,
    `Observe Digits: The known digits add up to ${knownDigitSum}.`,
    `Condition Satisfaction: The completed number is ${resolvedNumber}, and its digit sum is ${digitSum}.`,
    `Solve: Solving this condition gives x = ${answerDigit}.`,
    `Conclude: Therefore, x = ${answerDigit}.`,
  ] as const;

  const variantLines: Record<string, readonly string[]> = {
    "Variant A": teacherLines,
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
  const styleLines =
    explanationStyle.id === "ES-002"
      ? shortExamLines
      : explanationStyle.id === "ES-003"
        ? detailedTeachingLines
        : variantLines[variantId];

  return {
    graphId: graph.graphId,
    variantId,
    styleId: explanationStyle.id,
    lines: styleLines,
  };
}

export function renderCp002ExplanationFromGraph(
  parameters: Cp002Parameters,
  graph: Cp001ReasoningGraph,
  styleId: string,
): Cp001Explanation {
  const candidateNode = graph.nodes.find((node) => node.type === "Generate Candidate Digit Set");
  const validSetNode = graph.nodes.find((node) => node.type === "Build Valid Digit Set");
  const selectionNode = graph.nodes.find((node) => node.type === "Select Largest Valid Digit");
  const answerNode = graph.nodes.find((node) => node.id === graph.answerNodeId);

  if (!candidateNode || !validSetNode || !selectionNode || !answerNode) {
    throw new Error("CP-002 explanation renderer requires a complete reasoning graph.");
  }

  const divisorCapability = assertNsDiv001DivisorCapabilityAllowed(parameters.divisor, parameters.canonicalProblemId);
  const explanationStyle = assertNsDiv001ExplanationStyleAllowed(styleId);
  const candidateDigitSet = outputNumberArray(candidateNode.outputs.candidateDigitSet);
  const validDigitSet = outputNumberArray(validSetNode.outputs.validDigitSet);
  const largestValidDigit = outputNumber(selectionNode.outputs.largestValidDigit);
  const answerDigit = outputNumber(answerNode.outputs.answerDigit);
  const variants = getNsDiv001ActiveCp001ExplanationVariants();
  const variantId = variants[(candidateDigitSet.length + largestValidDigit) % variants.length];
  const ruleText = ruleSentence(parameters.divisor, divisorCapability.reasoningPattern.name, parameters.divisorComponents);
  const validSetText = validDigitSet.join(", ");

  const teacherLines = [
    `Rule: ${ruleText}`,
    `Apply Rule: The valid digits are ${validSetText}.`,
    `Selection: The largest valid digit is ${largestValidDigit}.`,
    `Conclude: Therefore, x = ${answerDigit}.`,
  ] as const;
  const shortExamLines = [
    `Valid Digits: ${validSetText}.`,
    `Largest Digit: ${largestValidDigit}.`,
    `Answer: So the correct answer is ${answerDigit}.`,
  ] as const;
  const detailedTeachingLines = [
    `Rule: ${ruleText}`,
    `Apply Rule: The allowed digits are ${candidateDigitSet.join(", ")}.`,
    `Known Information: The valid digits are ${validSetText}.`,
    `Selection: The largest valid digit is ${largestValidDigit}.`,
    `Conclusion: Therefore, x = ${answerDigit}.`,
  ] as const;

  const styleLines =
    explanationStyle.id === "ES-002" ? shortExamLines : explanationStyle.id === "ES-003" ? detailedTeachingLines : teacherLines;

  return {
    graphId: graph.graphId,
    variantId,
    styleId: explanationStyle.id,
    lines: styleLines,
  };
}

export function renderCp003ExplanationFromGraph(
  parameters: ValidDigitSetParameters,
  graph: Cp001ReasoningGraph,
  styleId: string,
): Cp001Explanation {
  const validSetNode = graph.nodes.find((node) => node.type === "Valid Digit Identification");
  const answerNode = graph.nodes.find((node) => node.id === graph.answerNodeId);

  if (!validSetNode || !answerNode) {
    throw new Error("Valid digit set explanation renderer requires a complete reasoning graph.");
  }

  const divisorCapability = assertNsDiv001DivisorCapabilityAllowed(parameters.divisor, parameters.canonicalProblemId);
  const explanationStyle = assertNsDiv001ValidDigitSetExplanationStyleAllowed(styleId);
  const conclusionTemplate = getNsDiv001ValidDigitSetConclusion(parameters.canonicalProblemId);
  const validDigitSet = outputNumberArray(validSetNode.outputs.validDigitSet);
  const answer = outputNumber(answerNode.outputs.answer);
  const validSetText = validDigitSet.join(", ");
  const ruleText = cp003RuleFragment(ruleSentence(parameters.divisor, divisorCapability.reasoningPattern.name, parameters.divisorComponents));
  const conclusion = conclusionTemplate.text.replace("{answer}", String(answer));

  const lines = explanationStyle.template.map((line) => {
    return line
      .replace("{divisor}", String(parameters.divisor))
      .replace("{ruleText}", ruleText)
      .replace("{validDigitList}", validSetText)
      .replace("{conclusion}", conclusion);
  });

  return {
    graphId: graph.graphId,
    variantId: explanationStyle.id,
    styleId: explanationStyle.id,
    lines,
  };
}

export const renderCp004ExplanationFromGraph = renderCp003ExplanationFromGraph;
export const renderCp005ExplanationFromGraph = renderCp003ExplanationFromGraph;
export const renderCp006ExplanationFromGraph = renderCp003ExplanationFromGraph;
export const renderCp007ExplanationFromGraph = renderCp003ExplanationFromGraph;

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

function cp003RuleFragment(ruleText: string) {
  const prefix = "For a number to be divisible by ";
  if (!ruleText.startsWith(prefix)) {
    return ruleText.charAt(0).toLowerCase() + ruleText.slice(1);
  }
  const commaIndex = ruleText.indexOf(", ");
  if (commaIndex === -1) {
    return ruleText;
  }
  return ruleText.slice(commaIndex + 2);
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
