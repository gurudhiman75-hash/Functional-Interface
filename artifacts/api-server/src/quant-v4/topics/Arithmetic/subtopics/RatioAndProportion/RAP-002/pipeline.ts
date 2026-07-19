import { renderRap002Explanation } from "./explanation-renderer";
import { getRap002QuestionEntry, renderRap002Template } from "./library";
import { generateRap002Parameters, type Rap002ParameterInput } from "./parameter-generator";
import { solveRap002 } from "./solver";
import { RAP_002_ARCHETYPE_ID, type Rap002CanonicalProblemId, type Rap002QuestionPackage } from "./types";
import { validateRap002QuestionPackage } from "./validator";
import { renderStemWithNumericDisplayPolicy } from "../numeric-display-policy";
import { naturalizeEnglishRapExplanation } from "../naturalize-explanation";

export function runRap002Pipeline(cpId: Rap002CanonicalProblemId = "RAP-CP-007", input: Rap002ParameterInput = {}): Rap002QuestionPackage {
  const parameters = generateRap002Parameters({ ...input, canonicalProblemId: cpId });
  const solver = solveRap002(parameters);
  const explanation = naturalizeEnglishRapExplanation(
    renderRap002Explanation(parameters, solver),
    parameters.language,
    solver.answer,
    { minimumLines: 7 },
  );
  const renderedStem = renderRap002Template(getRap002QuestionEntry(cpId, parameters.questionLanguageId, parameters.language).template, parameters.variables);
  const stem = renderStemWithNumericDisplayPolicy(renderedStem, solver.answer, solver.answerType, parameters.language);
  const basePackage = {
    archetypeId: RAP_002_ARCHETYPE_ID,
    canonicalProblemId: cpId,
    questionId: parameters.questionId,
    questionLanguageId: parameters.questionLanguageId,
    explanationId: parameters.explanationId,
    language: parameters.language,
    difficultyBand: parameters.difficultyBand,
    stem,
    answer: solver.answer,
    parameters,
    solver,
    explanation,
    mathJax: solver.mathJax,
  };
  const validation = validateRap002QuestionPackage({ ...basePackage, validation: { valid: false, checks: [] } });
  return { ...basePackage, validation };
}

export const runRap002Cp007Pipeline = (input: Rap002ParameterInput = {}) => runRap002Pipeline("RAP-CP-007", input);
export const runRap002Cp008Pipeline = (input: Rap002ParameterInput = {}) => runRap002Pipeline("RAP-CP-008", input);
export const runRap002Cp009Pipeline = (input: Rap002ParameterInput = {}) => runRap002Pipeline("RAP-CP-009", input);
export const runRap002Cp010Pipeline = (input: Rap002ParameterInput = {}) => runRap002Pipeline("RAP-CP-010", input);
export const runRap002Cp011Pipeline = (input: Rap002ParameterInput = {}) => runRap002Pipeline("RAP-CP-011", input);
export const runRap002Cp012Pipeline = (input: Rap002ParameterInput = {}) => runRap002Pipeline("RAP-CP-012", input);
