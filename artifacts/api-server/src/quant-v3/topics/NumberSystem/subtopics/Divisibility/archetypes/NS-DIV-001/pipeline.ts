import { renderCp001ExplanationFromGraph } from "./explanation-renderer";
import { renderApprovedCp001Stem } from "./language-contract";
import { generateCp001Parameters } from "./parameter-generator";
import { buildCp001ReasoningGraph } from "./reasoning-graph";
import { solveCp001 } from "./solver";
import {
  NS_DIV_001_ARCHETYPE_ID,
  NS_DIV_001_CANONICAL_PROBLEM_ID,
  type Cp001QuestionPackage,
} from "./types";
import { validateCp001AnswerContract, validateCp001QuestionPackage } from "./validator";

export function runNsDiv001Cp001Pipeline(input: { seed?: string } = {}): Cp001QuestionPackage {
  const parameters = generateCp001Parameters(input);
  const solver = solveCp001(parameters);
  const reasoningGraph = buildCp001ReasoningGraph(parameters, solver);
  const answerValidation = validateCp001AnswerContract(solver, reasoningGraph);

  if (!answerValidation.valid) {
    throw new Error("CP-001 answer validation failed before rendering.");
  }

  const renderedStem = renderApprovedCp001Stem(parameters);
  const explanation = renderCp001ExplanationFromGraph(parameters, reasoningGraph);
  const questionPackage: Cp001QuestionPackage = {
    archetypeId: NS_DIV_001_ARCHETYPE_ID,
    canonicalProblemId: NS_DIV_001_CANONICAL_PROBLEM_ID,
    reasoningPatternId: parameters.reasoningPatternId,
    sourceTrace: parameters.sourceTrace,
    stemFamilyId: renderedStem.familyId,
    stem: renderedStem.stem,
    answer: solver.answerDigit,
    parameters,
    solver,
    reasoningGraph,
    explanation,
    validation: answerValidation,
  };

  const finalValidation = validateCp001QuestionPackage(questionPackage);
  if (!finalValidation.valid) {
    throw new Error("CP-001 final validation failed.");
  }

  return {
    ...questionPackage,
    validation: finalValidation,
  };
}
