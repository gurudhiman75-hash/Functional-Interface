import {
  NS_DIV_001_ARCHETYPE_ID,
  NS_DIV_001_CANONICAL_PROBLEM_ID,
  type Cp001QuestionPackage,
  type Cp001ReasoningGraph,
  type Cp001SolverResult,
  type Cp001ValidationResult,
} from "./types";
import {
  FORBIDDEN_EXPLANATION_LANGUAGE,
  FORBIDDEN_STEM_LANGUAGE,
  containsForbiddenLanguage,
} from "./language-contract";
import {
  assertNsDiv001NumberPatternAllowed,
  assertNsDiv001DivisorCapabilityAllowed,
  validateNsDiv001RealismLibraries,
} from "./realism-library";

function check(name: string, passed: boolean, message: string) {
  return { name, passed, message };
}

export function validateCp001AnswerContract(solver: Cp001SolverResult, graph: Cp001ReasoningGraph): Cp001ValidationResult {
  const answerNode = graph.nodes.find((node) => node.id === graph.answerNodeId);
  const answerFromGraph = answerNode?.outputs.answerDigit;
  const checks = [
    check("archetype ownership", solver.archetypeId === NS_DIV_001_ARCHETYPE_ID && graph.archetypeId === NS_DIV_001_ARCHETYPE_ID, "Solver and graph must belong to NS-DIV-001."),
    check("canonical problem ownership", solver.canonicalProblemId === NS_DIV_001_CANONICAL_PROBLEM_ID && graph.canonicalProblemId === NS_DIV_001_CANONICAL_PROBLEM_ID, "Solver and graph must target CP-001."),
    check("reasoning pattern agreement", solver.reasoningPatternId === graph.reasoningPatternId, "Solver and graph must use the same approved reasoning pattern."),
    check("single valid candidate", solver.validCandidates.length === 1, "CP-001 must resolve exactly one valid missing digit."),
    check("graph answer agreement", answerFromGraph === solver.answerDigit, "Reasoning graph answer must match solver answer."),
    check("solver verification", solver.verification.isDivisible, "Solver verification must pass before rendering."),
  ];

  return {
    valid: checks.every((item) => item.passed),
    checks,
  };
}

export function validateCp001QuestionPackage(questionPackage: Cp001QuestionPackage): Cp001ValidationResult {
  const answerValidation = validateCp001AnswerContract(questionPackage.solver, questionPackage.reasoningGraph);
  const libraryValidation = validateNsDiv001RealismLibraries();
  const forbiddenStemPhrases = containsForbiddenLanguage(questionPackage.stem, FORBIDDEN_STEM_LANGUAGE);
  const explanationText = questionPackage.explanation.lines.join("\n");
  const forbiddenExplanationPhrases = containsForbiddenLanguage(explanationText, FORBIDDEN_EXPLANATION_LANGUAGE);
  let numberPatternAllowed = true;
  let divisorAllowed = true;
  try {
    assertNsDiv001NumberPatternAllowed(questionPackage.parameters.numberExpression);
  } catch {
    numberPatternAllowed = false;
  }
  try {
    assertNsDiv001DivisorCapabilityAllowed(questionPackage.parameters.divisor, questionPackage.canonicalProblemId);
  } catch {
    divisorAllowed = false;
  }
  const checks = [
    ...answerValidation.checks,
    check("realism libraries valid", libraryValidation.valid, libraryValidation.failures.join("; ") || "Realism libraries must match human-curated source of truth."),
    check("number pattern approved", numberPatternAllowed, "Number expression must come from the approved number pattern library."),
    check("divisor capability approved", divisorAllowed, "Divisor must come from the approved divisor capability library."),
    check("stem ownership", questionPackage.stem.includes(questionPackage.parameters.numberExpression), "Stem must be rendered from CP-001 parameters."),
    check("explanation consumes graph", questionPackage.explanation.graphId === questionPackage.reasoningGraph.graphId, "Explanation must consume reasoning graph output."),
    check("final answer agreement", questionPackage.answer === questionPackage.solver.answerDigit, "Final answer must match solver output."),
    check("source trace preserved", questionPackage.sourceTrace.sourceId === questionPackage.parameters.sourceTrace.sourceId, "Final package must preserve source trace."),
    check("stem family registered", Boolean(questionPackage.stemFamilyId), "Question package must report a registered stem family."),
    check("explanation variant registered", Boolean(questionPackage.explanation.variantId), "Question package must report an explanation variant."),
    check("approved stem language", forbiddenStemPhrases.length === 0, `Stem must avoid forbidden language: ${forbiddenStemPhrases.join(", ")}`),
    check("teacher explanation language", forbiddenExplanationPhrases.length === 0, `Explanation must avoid system language: ${forbiddenExplanationPhrases.join(", ")}`),
  ];

  return {
    valid: checks.every((item) => item.passed),
    checks,
  };
}
