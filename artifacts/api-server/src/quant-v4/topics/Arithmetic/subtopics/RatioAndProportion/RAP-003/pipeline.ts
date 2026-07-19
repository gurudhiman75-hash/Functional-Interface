import { renderRap003Explanation } from "./explanation-renderer";
import { getRap003QuestionEntry, renderRap003Template } from "./library";
import { generateRap003Parameters } from "./parameter-generator";
import { solveRap003 } from "./solver";
import { RAP_003_ARCHETYPE_ID, type Rap003CanonicalProblemId, type Rap003ParameterInput, type Rap003QuestionPackage } from "./types";
import { validateRap003QuestionPackage } from "./validator";
import { renderStemWithNumericDisplayPolicy } from "../numeric-display-policy";
import { naturalizeEnglishRapExplanation } from "../naturalize-explanation";
import { renderRap003EditorialExplanation } from "./editorial-explanation";
import { renderRap003PartnershipExplanation } from "./editorial-partnership";
import { renderRap003AgeExplanation } from "./editorial-age";
import { renderRap003IncomeExplanation } from "./editorial-income";
import { renderRap003IncomeRatioExplanation } from "./editorial-income-ratio";
import { renderRap003EqualSavingsExplanation } from "./editorial-equal-savings";
import { renderRap003ExpenditureRatioExplanation } from "./editorial-expenditure-ratio";
import { renderRap003MixtureExplanation } from "./editorial-mixture";
import { renderRap003ReplacementExplanation } from "./editorial-replacement";
import { renderRap003DenominationExplanation } from "./editorial-denomination";
import { renderRap003RateExplanation } from "./editorial-rate";
import { renderRap003PopulationExplanation } from "./editorial-population";
import { renderRap003ElectionExplanationWithSolverVariables } from "./editorial-election-adapter";
import { renderRap003GeometryExplanation } from "./editorial-geometry";
import { ensureRap003MeaningfulSupport } from "./editorial-support";
import { ensureRap003EditorialConclusion } from "./editorial-conclusion";
import { polishRap003EditorialLines } from "./editorial-line-polish";
import { polishEnglishRapStem } from "../editorial-stem";

function addValidationContext(
  parameters: ReturnType<typeof generateRap003Parameters>,
  solver: ReturnType<typeof solveRap003>,
  stem: string,
  explanation: { lines: string[] },
  validation: ReturnType<typeof validateRap003QuestionPackage>,
) {
  if (validation.valid) return validation;
  const visible = [stem, solver.answer, explanation.lines.join("\n"), JSON.stringify(solver.workingValues)].join("\n");
  const leaked = visible.match(/\b(undefined|null|NaN|Infinity|taskKind|canonicalProblemId|questionLanguageId)\b|\[object Object\]/i)?.[0] ?? "none";
  return {
    ...validation,
    checks: validation.checks.map((check) => check.passed ? check : {
      ...check,
      message: `${check.message} qlId=${parameters.questionLanguageId}; cpId=${parameters.canonicalProblemId}; taskKind=${parameters.taskKind}; leakedToken=${leaked}; variables=${JSON.stringify(parameters.variables)}`,
    }),
  };
}

export function runRap003Pipeline(cpId: Rap003CanonicalProblemId = "RAP-CP-014", input: Rap003ParameterInput = {}): Rap003QuestionPackage {
  const parameters = generateRap003Parameters({ ...input, canonicalProblemId: cpId });
  const solver = solveRap003(parameters);
  const naturalizedExplanation = naturalizeEnglishRapExplanation(
    renderRap003Explanation(parameters, solver),
    parameters.language,
    solver.answer,
    { minimumLines: 7 },
  );
  const editorialExplanation = renderRap003EditorialExplanation(parameters, solver, naturalizedExplanation);
  const partnershipExplanation = renderRap003PartnershipExplanation(parameters, solver, editorialExplanation);
  const ageExplanation = renderRap003AgeExplanation(parameters, solver, partnershipExplanation);
  const incomeExplanation = renderRap003IncomeExplanation(parameters, solver, ageExplanation);
  const incomeRatioExplanation = renderRap003IncomeRatioExplanation(parameters, solver, incomeExplanation);
  const equalSavingsExplanation = renderRap003EqualSavingsExplanation(parameters, solver, incomeRatioExplanation);
  const expenditureRatioExplanation = renderRap003ExpenditureRatioExplanation(parameters, solver, equalSavingsExplanation);
  const mixtureExplanation = renderRap003MixtureExplanation(parameters, solver, expenditureRatioExplanation);
  const replacementExplanation = renderRap003ReplacementExplanation(parameters, solver, mixtureExplanation);
  const denominationExplanation = renderRap003DenominationExplanation(parameters, solver, replacementExplanation);
  const rateExplanation = renderRap003RateExplanation(parameters, solver, denominationExplanation);
  const populationExplanation = renderRap003PopulationExplanation(parameters, solver, rateExplanation);
  const electionExplanation = renderRap003ElectionExplanationWithSolverVariables(parameters, solver, populationExplanation);
  const geometryExplanation = renderRap003GeometryExplanation(parameters, solver, electionExplanation);
  const supportedExplanation = ensureRap003MeaningfulSupport(parameters, geometryExplanation);
  const concludedExplanation = ensureRap003EditorialConclusion(parameters, solver, supportedExplanation);
  const explanation = polishRap003EditorialLines(parameters, concludedExplanation);
  const renderedStem = renderRap003Template(getRap003QuestionEntry(cpId, parameters.questionLanguageId, parameters.language).template, parameters.variables);
  const stem = polishEnglishRapStem(
    renderStemWithNumericDisplayPolicy(renderedStem, solver.answer, solver.answerType, parameters.language),
    parameters.language,
  );
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
  const rawValidation = validateRap003QuestionPackage({ ...basePackage, validation: { valid: false, checks: [] } });
  const validation = addValidationContext(parameters, solver, stem, explanation, rawValidation);
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
