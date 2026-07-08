import { renderRap003Explanation } from "./explanation-renderer";
import { getRap003QuestionEntry, renderRap003Template } from "./library";
import { generateRap003Parameters } from "./parameter-generator";
import { solveRap003 } from "./solver";
import { RAP_003_ARCHETYPE_ID, type Rap003CanonicalProblemId, type Rap003ParameterInput, type Rap003QuestionPackage } from "./types";
import { validateRap003QuestionPackage } from "./validator";

export function runRap003Pipeline(cpId: Rap003CanonicalProblemId = "RAP-CP-014", input: Rap003ParameterInput = {}): Rap003QuestionPackage {
  const parameters = generateRap003Parameters({ ...input, canonicalProblemId: cpId });
  const solver = solveRap003(parameters);
  const explanation = renderRap003Explanation(parameters, solver);
  const stem = renderRap003Template(getRap003QuestionEntry(cpId, parameters.questionLanguageId, parameters.language).template, parameters.variables);
  const basePackage = {
    archetypeId: RAP_003_ARCHETYPE_ID,
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
  const validation = validateRap003QuestionPackage({ ...basePackage, validation: { valid: false, checks: [] } });
  return { ...basePackage, validation };
}

export const runRap003Cp014Pipeline = (input: Rap003ParameterInput = {}) => runRap003Pipeline("RAP-CP-014", input);
export const runRap003Cp013Pipeline = (input: Rap003ParameterInput = {}) => runRap003Pipeline("RAP-CP-013", input);
export const runRap003Cp015Pipeline = (input: Rap003ParameterInput = {}) => runRap003Pipeline("RAP-CP-015", input);
export const runRap003Cp016Pipeline = (input: Rap003ParameterInput = {}) => runRap003Pipeline("RAP-CP-016", input);
export const runRap003Cp017Pipeline = (input: Rap003ParameterInput = {}) => runRap003Pipeline("RAP-CP-017", input);
export const runRap003Cp018Pipeline = (input: Rap003ParameterInput = {}) => runRap003Pipeline("RAP-CP-018", input);
export const runRap003Cp019Pipeline = (input: Rap003ParameterInput = {}) => runRap003Pipeline("RAP-CP-019", input);
export const runRap003Cp020Pipeline = (input: Rap003ParameterInput = {}) => runRap003Pipeline("RAP-CP-020", input);
export const runRap003Cp021Pipeline = (input: Rap003ParameterInput = {}) => runRap003Pipeline("RAP-CP-021", input);
export const runRap003Cp022Pipeline = (input: Rap003ParameterInput = {}) => runRap003Pipeline("RAP-CP-022", input);

function runRap003ForLanguages(cpId: Rap003CanonicalProblemId, input: Rap003ParameterInput = {}) {
  const base = generateRap003Parameters({ ...input, canonicalProblemId: cpId, language: "en" });
  return (["en", "hi", "pa"] as const).map((language) =>
    runRap003Pipeline(cpId, {
      ...input,
      language,
      questionLanguageId: base.questionLanguageId,
      difficultyBand: base.difficultyBand,
      seed: input.seed,
    }),
  );
}

export const runRap003Cp013ForLanguages = (input: Rap003ParameterInput = {}) => runRap003ForLanguages("RAP-CP-013", input);
export const runRap003Cp014ForLanguages = (input: Rap003ParameterInput = {}) => runRap003ForLanguages("RAP-CP-014", input);
export const runRap003Cp015ForLanguages = (input: Rap003ParameterInput = {}) => runRap003ForLanguages("RAP-CP-015", input);
export const runRap003Cp016ForLanguages = (input: Rap003ParameterInput = {}) => runRap003ForLanguages("RAP-CP-016", input);
export const runRap003Cp017ForLanguages = (input: Rap003ParameterInput = {}) => runRap003ForLanguages("RAP-CP-017", input);
export const runRap003Cp018ForLanguages = (input: Rap003ParameterInput = {}) => runRap003ForLanguages("RAP-CP-018", input);
export const runRap003Cp019ForLanguages = (input: Rap003ParameterInput = {}) => runRap003ForLanguages("RAP-CP-019", input);
export const runRap003Cp020ForLanguages = (input: Rap003ParameterInput = {}) => runRap003ForLanguages("RAP-CP-020", input);
export const runRap003Cp021ForLanguages = (input: Rap003ParameterInput = {}) => runRap003ForLanguages("RAP-CP-021", input);
export const runRap003Cp022ForLanguages = (input: Rap003ParameterInput = {}) => runRap003ForLanguages("RAP-CP-022", input);
