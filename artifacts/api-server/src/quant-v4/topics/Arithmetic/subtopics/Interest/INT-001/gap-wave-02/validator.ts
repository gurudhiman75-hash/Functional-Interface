import {
  compareRational,
  equalsRational,
  isWholeRational,
  rational,
} from "../foundation/rational";
import { verifyIntCp001Wave2Independently } from "./independent-verifier";
import { intCp001Wave2OptionMatchesSolution } from "./options";
import type {
  IntCp001Wave2Explanation,
  IntCp001Wave2OptionAudit,
  IntCp001Wave2PrototypeParameters,
  IntCp001Wave2ReasoningGraph,
  IntCp001Wave2SolveResult,
  IntCp001Wave2VerificationResult,
} from "./types";

interface ValidationInput {
  parameters: IntCp001Wave2PrototypeParameters;
  solution: IntCp001Wave2SolveResult;
  stem: string;
  options: string[];
  optionAudit: IntCp001Wave2OptionAudit[];
  correctIndex: number;
  explanation: IntCp001Wave2Explanation;
  reasoningGraph: IntCp001Wave2ReasoningGraph;
}

function containsUnsafePlaceholder(value: string): boolean {
  return /\{\{[^}]+\}\}|\b(?:TODO|TBD|PLACEHOLDER|undefined|null|NaN|Infinity)\b/iu.test(value);
}

function explanationText(explanation: IntCp001Wave2Explanation): string {
  return [
    explanation.notice,
    explanation.relation,
    ...explanation.steps,
    explanation.verification,
    explanation.conclusion,
    explanation.commonTrap,
  ].join("\n");
}

function isMoneySemantic(semantic: IntCp001Wave2SolveResult["semantic"]): boolean {
  return semantic === "TOTAL_AMOUNT"
    || semantic === "PRINCIPAL"
    || semantic === "ANNUAL_INTEREST";
}

function namesDecisiveStructure(value: string): boolean {
  return /simple interest|annual interest|amount multiple|interest-to-principal|amount ratio|A\(t\)|I\s*=|P\s*=|R\s*=|T\s*=/iu.test(value);
}

export function validateIntCp001Wave2(
  input: ValidationInput,
): IntCp001Wave2VerificationResult {
  const independent = verifyIntCp001Wave2Independently(input.parameters, input.solution);
  const errors = [...independent.errors];

  if (compareRational(input.solution.value, rational(0)) <= 0) {
    errors.push("The answer must be positive.");
  }
  if (input.solution.semantic === "AMOUNT_MULTIPLE"
    && compareRational(input.solution.value, rational(1)) <= 0) {
    errors.push("An amount multiple under positive simple interest must exceed one.");
  }
  if (input.solution.semantic === "TIME_MONTHS" && !isWholeRational(input.solution.value)) {
    errors.push("Wave 02 month answers must be whole months.");
  }
  if (isMoneySemantic(input.solution.semantic) && !isWholeRational(input.solution.value)) {
    errors.push("Wave 02 money answers must be integral rupees.");
  }

  if (input.options.length !== 4 || input.optionAudit.length !== 4) {
    errors.push("An MCQ prototype must contain exactly four options.");
  }
  if (new Set(input.options).size !== input.options.length) {
    errors.push("Option text is not unique.");
  }
  if (input.correctIndex < 0 || input.correctIndex >= input.optionAudit.length) {
    errors.push("Correct option index is outside the option array.");
  }
  const exactMatches = input.optionAudit.filter((option) =>
    intCp001Wave2OptionMatchesSolution(option, input.solution),
  );
  if (exactMatches.length !== 1) {
    errors.push(`Expected exactly one mathematically correct option; found ${exactMatches.length}.`);
  }
  const indexedCorrect = input.optionAudit[input.correctIndex];
  if (!indexedCorrect || indexedCorrect.misconceptionId !== "CORRECT") {
    errors.push("The declared correct option is not labelled CORRECT.");
  }
  if (indexedCorrect && !equalsRational(indexedCorrect.result.value, input.solution.value)) {
    errors.push("The declared correct option value disagrees with the solution.");
  }
  for (const [index, option] of input.optionAudit.entries()) {
    if (index !== input.correctIndex && option.misconceptionId === "CORRECT") {
      errors.push("A distractor is incorrectly labelled CORRECT.");
    }
    if (input.options[index] !== option.text) {
      errors.push(`Option audit text is misaligned at index ${index}.`);
    }
    if (isMoneySemantic(input.solution.semantic) && !isWholeRational(option.result.value)) {
      errors.push(`Money option ${index} is not an integral rupee value.`);
    }
  }

  if (!input.stem.endsWith("?")) errors.push("Stem must end with a question mark.");
  if (input.stem.length < 65) errors.push("Stem is too short for a natural competitive-exam question.");
  if (/^(?:find|determine)\b/iu.test(input.stem)
    || /\b(?:Find|Determine)\b[^.?!]*\?$/u.test(input.stem)) {
    errors.push("Stem uses an imperative question fragment.");
  }
  if (/^[a-z]/u.test(input.stem)) errors.push("Stem begins with a lowercase letter.");
  if (containsUnsafePlaceholder(input.stem)) errors.push("Stem contains unsafe placeholder text.");
  if (/ {2,}/u.test(input.stem)) errors.push("Stem contains repeated spaces.");

  const renderedExplanation = explanationText(input.explanation);
  if (renderedExplanation.length < 300) errors.push("Explanation is too shallow.");
  if (input.explanation.steps.length < 3) errors.push("Explanation has too few value-specific steps.");
  if (containsUnsafePlaceholder(renderedExplanation)) {
    errors.push("Explanation contains unsafe placeholder text.");
  }
  if (!namesDecisiveStructure(renderedExplanation)) {
    errors.push("Explanation does not identify the decisive interest structure.");
  }
  if (input.explanation.verification.trim().length < 25
    || !/\d|₹|%|=|reconstruct|reproduce|match|exact/iu.test(input.explanation.verification)) {
    errors.push("Explanation lacks a meaningful verification step.");
  }
  if (!input.explanation.conclusion.includes(input.options[input.correctIndex] ?? "__missing__")) {
    errors.push("Explanation conclusion does not state the semantic answer.");
  }

  const nodeIds = new Set(input.reasoningGraph.nodes.map((node) => node.id));
  if (nodeIds.size !== input.reasoningGraph.nodes.length) {
    errors.push("Reasoning graph contains duplicate node IDs.");
  }
  if (!input.reasoningGraph.nodes.some((node) => node.kind === "NORMALISATION")) {
    errors.push("Reasoning graph lacks a normalisation node.");
  }
  if (!input.reasoningGraph.nodes.some((node) => node.kind === "VERIFICATION")) {
    errors.push("Reasoning graph lacks an independent verification node.");
  }
  for (const node of input.reasoningGraph.nodes) {
    for (const dependency of node.dependsOn) {
      if (!nodeIds.has(dependency)) errors.push(`Reasoning graph dependency ${dependency} is missing.`);
    }
    if (node.mathLatex && /\f|\t|\r|\u0008/u.test(node.mathLatex)) {
      errors.push(`Reasoning graph node ${node.id} contains a control character in TeX.`);
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    matchingCandidates: independent.matchingCandidates,
  };
}
