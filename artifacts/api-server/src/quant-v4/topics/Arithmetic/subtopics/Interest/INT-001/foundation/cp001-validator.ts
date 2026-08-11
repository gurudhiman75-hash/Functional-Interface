import { optionMatchesSolution } from "./cp001-options";
import { verifyIntCp001Independently } from "./cp001-independent-verifier";
import {
  compareRational,
  equalsRational,
  isWholeRational,
  rational,
} from "./rational";
import type {
  IntCp001Explanation,
  IntCp001OptionAudit,
  IntCp001PrototypeParameters,
  IntCp001SolveResult,
  IntReasoningGraph,
  VerificationResult,
} from "./types";

interface ValidationInput {
  parameters: IntCp001PrototypeParameters;
  solution: IntCp001SolveResult;
  stem: string;
  options: string[];
  optionAudit: IntCp001OptionAudit[];
  correctIndex: number;
  explanation: IntCp001Explanation;
  reasoningGraph: IntReasoningGraph;
}

function containsUnsafePlaceholder(value: string): boolean {
  return /\{\{[^}]+\}\}|\b(?:TODO|TBD|PLACEHOLDER)\b|undefined|null/iu.test(value);
}

function explanationText(explanation: IntCp001Explanation): string {
  return [
    explanation.notice,
    explanation.relation,
    ...explanation.steps,
    explanation.verification,
    explanation.conclusion,
    explanation.commonTrap,
  ].join("\n");
}

function namesInterestStructure(value: string): boolean {
  return /simple interest|annual interest|interest-to-principal|amount multiplier|\bI\s*=\s*P|\bP\s*=|\bR\s*=|\bT\s*=/iu.test(value);
}

function hasMeaningfulVerification(value: string): boolean {
  return value.trim().length >= 12
    && /\d|₹|%|=|matches|reproduces|confirm|exactly|equals/iu.test(value);
}

function usesMoneySemantic(solution: IntCp001SolveResult): boolean {
  return solution.semantic === "SIMPLE_INTEREST"
    || solution.semantic === "TOTAL_AMOUNT"
    || solution.semantic === "PRINCIPAL"
    || solution.semantic === "ANNUAL_INTEREST";
}

export function validateIntCp001Prototype(input: ValidationInput): VerificationResult {
  const independent = verifyIntCp001Independently(input.parameters, input.solution);
  const errors = [...independent.errors];

  if (compareRational(input.solution.value, rational(0)) <= 0) {
    errors.push("The answer must be positive.");
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
  const exactMatches = input.optionAudit.filter((option) => optionMatchesSolution(option, input.solution));
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
    if (!input.options[index] || input.options[index] !== option.text) {
      errors.push(`Option audit text is misaligned at index ${index}.`);
    }
    if (usesMoneySemantic(input.solution) && !isWholeRational(option.result.value)) {
      errors.push(`Money option ${index + 1} is fractional.`);
    }
  }

  if (!input.stem.endsWith("?")) errors.push("Stem must end with a question mark.");
  if (input.stem.length < 60) errors.push("Stem is too short to carry a natural exam context.");
  if (input.stem[0] && input.stem[0] !== input.stem[0].toUpperCase()) {
    errors.push("Stem begins with a lowercase character.");
  }
  if (/\bFind\b[^.?!]*\?/u.test(input.stem)) {
    errors.push("Stem uses the discouraged 'Find ...?' fragment form.");
  }
  if (/\bDetermine\b[^.?!]*\?$/u.test(input.stem)) {
    errors.push("Stem uses an imperative 'Determine ...?' question form.");
  }
  if (/private lending agreement/iu.test(input.stem)) {
    errors.push("Stem exposes an unnatural personal-lending institution label.");
  }
  if (containsUnsafePlaceholder(input.stem)) errors.push("Stem contains an unresolved placeholder.");

  const renderedExplanation = explanationText(input.explanation);
  if (renderedExplanation.length < 280) errors.push("Explanation is too shallow.");
  if (containsUnsafePlaceholder(renderedExplanation)) {
    errors.push("Explanation contains an unresolved placeholder.");
  }
  if (!namesInterestStructure(renderedExplanation)) {
    errors.push("Explanation does not identify the decisive interest relation.");
  }
  if (!hasMeaningfulVerification(input.explanation.verification)) {
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
    errors.push("Reasoning graph lacks rate/time normalisation.");
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

  const state = input.parameters.hiddenState;
  if (!equalsRational(
    state.amount,
    {
      numerator: state.principal.numerator * state.simpleInterest.denominator
        + state.simpleInterest.numerator * state.principal.denominator,
      denominator: state.principal.denominator * state.simpleInterest.denominator,
    },
  )) {
    errors.push("Amount invariant failed after exact cross multiplication.");
  }

  return {
    ok: errors.length === 0,
    errors,
    matchingCandidates: independent.matchingCandidates,
  };
}
