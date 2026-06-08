import {
  NS_DIV_001_ARCHETYPE_ID,
  NS_DIV_001_CP_002_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CP_003_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CP_004_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CP_005_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CP_006_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CP_007_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CANONICAL_PROBLEM_ID,
  type Cp001QuestionPackage,
  type Cp001ReasoningGraph,
  type Cp001SolverResult,
  type Cp001ValidationResult,
  type Cp002QuestionPackage,
  type Cp002SolverResult,
  type Cp003QuestionPackage,
  type Cp003SolverResult,
  type Cp004QuestionPackage,
  type Cp005QuestionPackage,
  type Cp006QuestionPackage,
  type Cp007QuestionPackage,
  type ValidDigitSetQuestionPackage,
} from "./types";
import {
  FORBIDDEN_EXPLANATION_LANGUAGE,
  FORBIDDEN_STEM_LANGUAGE,
  containsForbiddenLanguage,
} from "./language-contract";
import {
  assertNsDiv001DivisorCapabilityAllowed,
  assertNsDiv001ExplanationStyleAllowed,
  assertNsDiv001ValidDigitSetExplanationStyleAllowed,
  isNsDiv001RenderedQuestionLanguage,
  isNsDiv001RenderedValidDigitSetQuestionLanguage,
  validateNsDiv001RealismLibraries,
} from "./realism-library";
import {
  assertNsDiv001StructuralPatternAllowed,
  validateNsDiv001StructuralInstance,
  validateNsDiv001StructuralPatternLibrary,
} from "./structural-pattern-registry";

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
  const structuralLibraryValidation = validateNsDiv001StructuralPatternLibrary();
  const forbiddenStemPhrases = containsForbiddenLanguage(questionPackage.stem, FORBIDDEN_STEM_LANGUAGE);
  const explanationText = questionPackage.explanation.lines.join("\n");
  const forbiddenExplanationPhrases = containsForbiddenLanguage(explanationText, FORBIDDEN_EXPLANATION_LANGUAGE);
  let structuralPatternAllowed = true;
  let divisorAllowed = true;
  let explanationStyleAllowed = true;
  try {
    assertNsDiv001StructuralPatternAllowed(questionPackage.parameters.patternId);
  } catch {
    structuralPatternAllowed = false;
  }
  try {
    assertNsDiv001DivisorCapabilityAllowed(questionPackage.parameters.divisor, questionPackage.canonicalProblemId);
  } catch {
    divisorAllowed = false;
  }
  try {
    assertNsDiv001ExplanationStyleAllowed(questionPackage.explanation.styleId);
  } catch {
    explanationStyleAllowed = false;
  }
  const structuralInstanceValidation = validateNsDiv001StructuralInstance({
    patternId: questionPackage.parameters.patternId,
    instance: questionPackage.parameters.numberExpression,
  });
  const checks = [
    ...answerValidation.checks,
    check("realism libraries valid", libraryValidation.valid, libraryValidation.failures.join("; ") || "Realism libraries must match human-curated source of truth."),
    check("structural pattern library valid", structuralLibraryValidation.valid, structuralLibraryValidation.failures.join("; ") || "Structural pattern library must match the V2 schema."),
    check("structural pattern approved", structuralPatternAllowed, "Question package must use an approved structural pattern."),
    check("instance validation", structuralInstanceValidation.valid, structuralInstanceValidation.failures.join("; ") || "Generated instance must match its structural pattern."),
    check("traceability validation", Boolean(questionPackage.questionId && questionPackage.patternId && questionPackage.instanceId), "Question package must report Question ID, Pattern ID, and Instance ID."),
    check("divisor capability approved", divisorAllowed, "Divisor must come from the approved divisor capability library."),
    check(
      "question language rendered from library",
      isNsDiv001RenderedQuestionLanguage({
        familyId: questionPackage.stemFamilyId,
        questionLanguageId: questionPackage.questionLanguageId,
        stem: questionPackage.stem,
        number: questionPackage.parameters.numberExpression,
        divisor: questionPackage.parameters.divisor,
      }),
      "Stem must be rendered from the registered question language library.",
    ),
    check("explanation consumes graph", questionPackage.explanation.graphId === questionPackage.reasoningGraph.graphId, "Explanation must consume reasoning graph output."),
    check("final answer agreement", questionPackage.answer === questionPackage.solver.answerDigit, "Final answer must match solver output."),
    check("source trace preserved", questionPackage.sourceTrace.sourceId === questionPackage.parameters.sourceTrace.sourceId, "Final package must preserve source trace."),
    check("stem family registered", Boolean(questionPackage.stemFamilyId), "Question package must report a registered stem family."),
    check("question language registered", Boolean(questionPackage.questionLanguageId), "Question package must report a registered question language entry."),
    check("explanation variant registered", Boolean(questionPackage.explanation.variantId), "Question package must report an explanation variant."),
    check("explanation style registered", explanationStyleAllowed, "Question package must report a registered explanation style."),
    check("approved stem language", forbiddenStemPhrases.length === 0, `Stem must avoid forbidden language: ${forbiddenStemPhrases.join(", ")}`),
    check("teacher explanation language", forbiddenExplanationPhrases.length === 0, `Explanation must avoid system language: ${forbiddenExplanationPhrases.join(", ")}`),
  ];

  return {
    valid: checks.every((item) => item.passed),
    checks,
  };
}

export function validateCp002AnswerContract(solver: Cp002SolverResult, graph: Cp001ReasoningGraph): Cp001ValidationResult {
  const answerNode = graph.nodes.find((node) => node.id === graph.answerNodeId);
  const answerFromGraph = answerNode?.outputs.answerDigit;
  const expectedNodeTypes = [
    "Recognize Divisor",
    "Select Divisibility Rule",
    "Generate Candidate Digit Set",
    "Evaluate Candidates",
    "Build Valid Digit Set",
    "Select Largest Valid Digit",
    "Verify Result",
  ];
  const checks = [
    check("archetype ownership", solver.archetypeId === NS_DIV_001_ARCHETYPE_ID && graph.archetypeId === NS_DIV_001_ARCHETYPE_ID, "Solver and graph must belong to NS-DIV-001."),
    check(
      "canonical problem ownership",
      solver.canonicalProblemId === NS_DIV_001_CP_002_CANONICAL_PROBLEM_ID && graph.canonicalProblemId === NS_DIV_001_CP_002_CANONICAL_PROBLEM_ID,
      "Solver and graph must target CP-002.",
    ),
    check("reasoning pattern agreement", solver.reasoningPatternId === graph.reasoningPatternId, "Solver and graph must use the same approved reasoning pattern."),
    check("candidate set validation", solver.candidateDigitSet.length === solver.candidateEvaluations.length, "Every candidate must be evaluated."),
    check("valid digit set validation", solver.validDigitSet.length >= 1, "CP-002 valid digit set size must be at least 1."),
    check("largest digit validation", solver.largestValidDigit === Math.max(...solver.validDigitSet), "Selected answer must be the maximum element of the valid digit set."),
    check("graph answer agreement", answerFromGraph === solver.answerDigit, "Reasoning graph answer must match solver answer."),
    check(
      "graph consistency validation",
      graph.nodes.length === 7 && graph.nodes.every((node, index) => node.type === expectedNodeTypes[index]),
      "CP-002 graph must contain exactly the approved nodes in order.",
    ),
    check("solver verification", solver.verification.isDivisible && solver.verification.selectedDigitIsMaximum, "Solver verification must pass before rendering."),
  ];

  return {
    valid: checks.every((item) => item.passed),
    checks,
  };
}

export function validateCp002QuestionPackage(questionPackage: Cp002QuestionPackage): Cp001ValidationResult {
  const answerValidation = validateCp002AnswerContract(questionPackage.solver, questionPackage.reasoningGraph);
  const libraryValidation = validateNsDiv001RealismLibraries();
  const structuralLibraryValidation = validateNsDiv001StructuralPatternLibrary();
  const forbiddenStemPhrases = containsForbiddenLanguage(questionPackage.stem, FORBIDDEN_STEM_LANGUAGE);
  const explanationText = questionPackage.explanation.lines.join("\n");
  const forbiddenExplanationPhrases = containsForbiddenLanguage(explanationText, FORBIDDEN_EXPLANATION_LANGUAGE);
  const expectedCandidateSet = questionPackage.parameters.missingPosition === 1 ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const evaluatedCandidates = questionPackage.solver.candidateEvaluations.map((entry) => entry.candidate);
  const validDigitsFromEvaluation = questionPackage.solver.candidateEvaluations.filter((entry) => entry.isValid).map((entry) => entry.candidate);
  let structuralPatternAllowed = true;
  let divisorAllowed = true;
  let explanationStyleAllowed = true;
  try {
    assertNsDiv001StructuralPatternAllowed(questionPackage.parameters.patternId);
  } catch {
    structuralPatternAllowed = false;
  }
  try {
    assertNsDiv001DivisorCapabilityAllowed(questionPackage.parameters.divisor, questionPackage.canonicalProblemId);
  } catch {
    divisorAllowed = false;
  }
  try {
    assertNsDiv001ExplanationStyleAllowed(questionPackage.explanation.styleId);
  } catch {
    explanationStyleAllowed = false;
  }
  const structuralInstanceValidation = validateNsDiv001StructuralInstance({
    patternId: questionPackage.parameters.patternId,
    instance: questionPackage.parameters.numberExpression,
  });
  const checks = [
    ...answerValidation.checks,
    check("realism libraries valid", libraryValidation.valid, libraryValidation.failures.join("; ") || "Realism libraries must match human-curated source of truth."),
    check("structural pattern library valid", structuralLibraryValidation.valid, structuralLibraryValidation.failures.join("; ") || "Structural pattern library must match the V2 schema."),
    check("structural pattern approved", structuralPatternAllowed, "Question package must use an approved structural pattern."),
    check("instance validation", structuralInstanceValidation.valid, structuralInstanceValidation.failures.join("; ") || "Generated instance must match its structural pattern."),
    check("traceability validation", Boolean(questionPackage.questionId && questionPackage.patternId && questionPackage.instanceId), "Question package must report Question ID, Pattern ID, and Instance ID."),
    check("divisor capability approved", divisorAllowed, "Divisor must come from the approved divisor capability library."),
    check("candidate universe approved", JSON.stringify(questionPackage.parameters.candidateDomain) === JSON.stringify(expectedCandidateSet), "Candidate universe must follow CP-002 leading zero rules."),
    check("candidate evaluation complete", JSON.stringify(evaluatedCandidates) === JSON.stringify(expectedCandidateSet), "Every allowed candidate must be evaluated in ascending order."),
    check("valid digit set derived", JSON.stringify(questionPackage.solver.validDigitSet) === JSON.stringify(validDigitsFromEvaluation), "Valid digit set must be derived from evaluated candidates."),
    check("valid digit set non-empty", questionPackage.solver.validDigitSet.length >= 1, "Empty valid digit sets are forbidden."),
    check("largest digit selected", questionPackage.answer === Math.max(...questionPackage.solver.validDigitSet), "Final answer must be the largest valid digit."),
    check(
      "question language rendered from library",
      isNsDiv001RenderedQuestionLanguage({
        familyId: questionPackage.stemFamilyId,
        questionLanguageId: questionPackage.questionLanguageId,
        stem: questionPackage.stem,
        number: questionPackage.parameters.numberExpression,
        divisor: questionPackage.parameters.divisor,
      }),
      "Stem must be rendered from the registered question language library.",
    ),
    check("explanation consumes graph", questionPackage.explanation.graphId === questionPackage.reasoningGraph.graphId, "Explanation must consume reasoning graph output."),
    check("explanation consistency validation", explanationText.includes(String(questionPackage.answer)), "Explanation must include the selected answer."),
    check("final answer agreement", questionPackage.answer === questionPackage.solver.answerDigit, "Final answer must match solver output."),
    check("source trace preserved", questionPackage.sourceTrace.sourceId === questionPackage.parameters.sourceTrace.sourceId, "Final package must preserve source trace."),
    check("stem family registered", Boolean(questionPackage.stemFamilyId), "Question package must report a registered stem family."),
    check("question language registered", Boolean(questionPackage.questionLanguageId), "Question package must report a registered question language entry."),
    check("explanation variant registered", Boolean(questionPackage.explanation.variantId), "Question package must report an explanation variant."),
    check("explanation style registered", explanationStyleAllowed, "Question package must report a registered explanation style."),
    check("approved stem language", forbiddenStemPhrases.length === 0, `Stem must avoid forbidden language: ${forbiddenStemPhrases.join(", ")}`),
    check("teacher explanation language", forbiddenExplanationPhrases.length === 0, `Explanation must avoid system language: ${forbiddenExplanationPhrases.join(", ")}`),
  ];

  return {
    valid: checks.every((item) => item.passed),
    checks,
  };
}

export function validateCp003AnswerContract(solver: Cp003SolverResult, graph: Cp001ReasoningGraph): Cp001ValidationResult {
  return validateValidDigitSetAnswerContract(solver, graph);
}

export const validateCp004AnswerContract = validateCp003AnswerContract;
export const validateCp005AnswerContract = validateCp003AnswerContract;
export const validateCp006AnswerContract = validateCp003AnswerContract;
export const validateCp007AnswerContract = validateCp003AnswerContract;

function validateValidDigitSetAnswerContract(solver: Cp003SolverResult, graph: Cp001ReasoningGraph): Cp001ValidationResult {
  const answerNode = graph.nodes.find((node) => node.id === graph.answerNodeId);
  const validSetNode = graph.nodes.find((node) => node.type === "Valid Digit Identification");
  const answerFromGraph = answerNode?.outputs.answer;
  const validDigitSetFromGraph = validSetNode?.outputs.validDigitSet;
  const expectedNodeTypes = expectedValidDigitSetNodeTypes(solver.canonicalProblemId);
  const checks = [
    check("archetype ownership", solver.archetypeId === NS_DIV_001_ARCHETYPE_ID && graph.archetypeId === NS_DIV_001_ARCHETYPE_ID, "Solver and graph must belong to NS-DIV-001."),
    check(
      "canonical problem ownership",
      solver.canonicalProblemId === graph.canonicalProblemId && isValidDigitSetCanonicalProblemId(graph.canonicalProblemId),
      "Solver and graph must target the same valid-digit-set canonical problem.",
    ),
    check("reasoning pattern agreement", solver.reasoningPatternId === graph.reasoningPatternId, "Solver and graph must use the same approved reasoning pattern."),
    check("valid digit set validation", solver.validDigitSet.length >= 1, "Valid digit set size must be at least 1."),
    check("answer rule validation", validDigitSetAnswerRuleSatisfied(solver.canonicalProblemId, solver.answer, solver.validDigitSet, solver.resolvedNumber), "Answer must follow the CP-specific valid digit set rule."),
    check("graph digit list agreement", JSON.stringify(validDigitSetFromGraph) === JSON.stringify(solver.validDigitSet), "Reasoning graph valid digit set must match solver output."),
    check("graph answer agreement", answerFromGraph === solver.answer, "Reasoning graph answer must match solver answer."),
    check(
      "graph consistency validation",
      graph.nodes.length === 7 && graph.nodes.every((node, index) => node.type === expectedNodeTypes[index]),
      "Graph must contain exactly the approved valid-digit-set nodes in order.",
    ),
    check("solver verification", solver.verification.isDivisible && solver.verification.answerRuleSatisfied, "Solver verification must pass before rendering."),
  ];

  return {
    valid: checks.every((item) => item.passed),
    checks,
  };
}

function expectedValidDigitSetNodeTypes(canonicalProblemId: string) {
  const base = [
    "Problem Recognition",
    "Divisor Recognition",
    "Rule Selection",
    "Candidate Generation",
    "Valid Digit Identification",
  ];

  switch (canonicalProblemId) {
    case NS_DIV_001_CP_003_CANONICAL_PROBLEM_ID:
      return [...base, "Minimum Selection", "Answer Production"];
    case NS_DIV_001_CP_004_CANONICAL_PROBLEM_ID:
      return [...base, "Counting", "Answer Production"];
    case NS_DIV_001_CP_005_CANONICAL_PROBLEM_ID:
      return [...base, "Summation", "Answer Production"];
    case NS_DIV_001_CP_006_CANONICAL_PROBLEM_ID:
      return [...base, "Maximum Selection", "Number Formation"];
    case NS_DIV_001_CP_007_CANONICAL_PROBLEM_ID:
      return [...base, "Minimum Selection", "Number Formation"];
    default:
      return [];
  }
}

export function validateCp003QuestionPackage(questionPackage: Cp003QuestionPackage): Cp001ValidationResult {
  return validateValidDigitSetQuestionPackage(questionPackage);
}

export function validateCp004QuestionPackage(questionPackage: Cp004QuestionPackage): Cp001ValidationResult {
  return validateValidDigitSetQuestionPackage(questionPackage);
}

export function validateCp005QuestionPackage(questionPackage: Cp005QuestionPackage): Cp001ValidationResult {
  return validateValidDigitSetQuestionPackage(questionPackage);
}

export function validateCp006QuestionPackage(questionPackage: Cp006QuestionPackage): Cp001ValidationResult {
  return validateValidDigitSetQuestionPackage(questionPackage);
}

export function validateCp007QuestionPackage(questionPackage: Cp007QuestionPackage): Cp001ValidationResult {
  return validateValidDigitSetQuestionPackage(questionPackage);
}

function validateValidDigitSetQuestionPackage(questionPackage: ValidDigitSetQuestionPackage): Cp001ValidationResult {
  const answerValidation = validateValidDigitSetAnswerContract(questionPackage.solver, questionPackage.reasoningGraph);
  const libraryValidation = validateNsDiv001RealismLibraries();
  const structuralLibraryValidation = validateNsDiv001StructuralPatternLibrary();
  const forbiddenStemPhrases = containsForbiddenLanguage(questionPackage.stem, FORBIDDEN_STEM_LANGUAGE);
  const explanationText = questionPackage.explanation.lines.join("\n");
  const forbiddenExplanationPhrases = containsForbiddenLanguage(explanationText, FORBIDDEN_EXPLANATION_LANGUAGE);
  const expectedCandidateSet = questionPackage.parameters.missingPosition === 1 ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const evaluatedCandidates = questionPackage.solver.candidateEvaluations.map((entry) => entry.candidate);
  const validDigitsFromEvaluation = questionPackage.solver.candidateEvaluations.filter((entry) => entry.isValid).map((entry) => entry.candidate);
  const graphValidSet = questionPackage.reasoningGraph.nodes.find((node) => node.type === "Valid Digit Identification")?.outputs.validDigitSet;
  const validDigitListText = questionPackage.solver.validDigitSet.join(", ");
  let structuralPatternAllowed = true;
  let divisorAllowed = true;
  let explanationStyleAllowed = true;
  try {
    assertNsDiv001StructuralPatternAllowed(questionPackage.parameters.patternId);
  } catch {
    structuralPatternAllowed = false;
  }
  try {
    assertNsDiv001DivisorCapabilityAllowed(questionPackage.parameters.divisor, questionPackage.canonicalProblemId);
  } catch {
    divisorAllowed = false;
  }
  try {
    assertNsDiv001ValidDigitSetExplanationStyleAllowed(questionPackage.explanation.styleId);
  } catch {
    explanationStyleAllowed = false;
  }
  const structuralInstanceValidation = validateNsDiv001StructuralInstance({
    patternId: questionPackage.parameters.patternId,
    instance: questionPackage.parameters.numberExpression,
  });
  const checks = [
    ...answerValidation.checks,
    check("realism libraries valid", libraryValidation.valid, libraryValidation.failures.join("; ") || "Realism libraries must match human-curated source of truth."),
    check("structural pattern library valid", structuralLibraryValidation.valid, structuralLibraryValidation.failures.join("; ") || "Structural pattern library must match the V2 schema."),
    check("structural pattern approved", structuralPatternAllowed, "Question package must use an approved structural pattern."),
    check("instance validation", structuralInstanceValidation.valid, structuralInstanceValidation.failures.join("; ") || "Generated instance must match its structural pattern."),
    check("traceability validation", Boolean(questionPackage.questionId && questionPackage.patternId && questionPackage.instanceId), "Question package must report Question ID, Pattern ID, and Instance ID."),
    check("divisor capability approved", divisorAllowed, "Divisor must come from the approved divisor capability library."),
    check("candidate universe approved", JSON.stringify(questionPackage.parameters.candidateDomain) === JSON.stringify(expectedCandidateSet), "Candidate universe must follow leading zero rules."),
    check("candidate evaluation complete", JSON.stringify(evaluatedCandidates) === JSON.stringify(expectedCandidateSet), "Every allowed candidate must be evaluated in ascending order."),
    check("valid digit set derived", JSON.stringify(questionPackage.solver.validDigitSet) === JSON.stringify(validDigitsFromEvaluation), "Valid digit set must be derived from evaluated candidates."),
    check("valid digit set non-empty", questionPackage.solver.validDigitSet.length >= 1, "Empty valid digit sets are forbidden."),
    check("answer rule validation", validDigitSetAnswerRuleSatisfied(questionPackage.canonicalProblemId, questionPackage.answer, questionPackage.solver.validDigitSet, questionPackage.solver.resolvedNumber), "Final answer must follow the CP-specific valid digit set rule."),
    check("graph digit list matches solver digit list", JSON.stringify(graphValidSet) === JSON.stringify(questionPackage.solver.validDigitSet), "Graph digit list must match solver digit list."),
    check(
      "question language rendered from library",
      isNsDiv001RenderedValidDigitSetQuestionLanguage({
        canonicalProblemId: questionPackage.canonicalProblemId,
        familyId: questionPackage.stemFamilyId,
        questionLanguageId: questionPackage.questionLanguageId,
        stem: questionPackage.stem,
        numberExpression: questionPackage.parameters.numberExpression,
        divisor: questionPackage.parameters.divisor,
      }),
      "Stem must be rendered from the registered valid-digit-set question language library.",
    ),
    check("explanation consumes graph", questionPackage.explanation.graphId === questionPackage.reasoningGraph.graphId, "Explanation must consume reasoning graph output."),
    check("explanation digit list matches solver digit list", explanationText.includes(validDigitListText), "Explanation digit list must match solver digit list."),
    check("explanation consistency validation", explanationText.includes(String(questionPackage.answer)), "Explanation must include the selected answer."),
    check("final answer agreement", questionPackage.answer === questionPackage.solver.answerDigit, "Final answer must match solver output."),
    check("source trace preserved", questionPackage.sourceTrace.sourceId === questionPackage.parameters.sourceTrace.sourceId, "Final package must preserve source trace."),
    check("stem family registered", Boolean(questionPackage.stemFamilyId), "Question package must report a registered stem family."),
    check("question language registered", Boolean(questionPackage.questionLanguageId), "Question package must report a registered question language entry."),
    check("explanation style registered", explanationStyleAllowed, "Question package must report a registered valid-digit-set explanation style."),
    check("approved stem language", forbiddenStemPhrases.length === 0, `Stem must avoid forbidden language: ${forbiddenStemPhrases.join(", ")}`),
    check("teacher explanation language", forbiddenExplanationPhrases.length === 0, `Explanation must avoid system language: ${forbiddenExplanationPhrases.join(", ")}`),
  ];

  return {
    valid: checks.every((item) => item.passed),
    checks,
  };
}

function isValidDigitSetCanonicalProblemId(canonicalProblemId: string) {
  return [
    NS_DIV_001_CP_003_CANONICAL_PROBLEM_ID,
    NS_DIV_001_CP_004_CANONICAL_PROBLEM_ID,
    NS_DIV_001_CP_005_CANONICAL_PROBLEM_ID,
    NS_DIV_001_CP_006_CANONICAL_PROBLEM_ID,
    NS_DIV_001_CP_007_CANONICAL_PROBLEM_ID,
  ].includes(canonicalProblemId as typeof NS_DIV_001_CP_003_CANONICAL_PROBLEM_ID);
}

function validDigitSetAnswerRuleSatisfied(canonicalProblemId: string, answer: number, validDigitSet: readonly number[], resolvedNumber: number) {
  switch (canonicalProblemId) {
    case NS_DIV_001_CP_003_CANONICAL_PROBLEM_ID:
      return answer === Math.min(...validDigitSet);
    case NS_DIV_001_CP_004_CANONICAL_PROBLEM_ID:
      return answer === validDigitSet.length;
    case NS_DIV_001_CP_005_CANONICAL_PROBLEM_ID:
      return answer === validDigitSet.reduce((sum, digit) => sum + digit, 0);
    case NS_DIV_001_CP_006_CANONICAL_PROBLEM_ID:
    case NS_DIV_001_CP_007_CANONICAL_PROBLEM_ID:
      return answer === resolvedNumber;
    default:
      return false;
  }
}
