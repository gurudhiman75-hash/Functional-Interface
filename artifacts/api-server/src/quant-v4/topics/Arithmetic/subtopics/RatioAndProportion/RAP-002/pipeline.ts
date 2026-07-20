import { renderRap002Explanation } from "./explanation-renderer";
import { getRap002QuestionEntry, renderRap002Template } from "./library";
import { generateRap002Parameters, type Rap002ParameterInput } from "./parameter-generator";
import { solveRap002 } from "./solver";
import { RAP_002_ARCHETYPE_ID, type Rap002CanonicalProblemId, type Rap002QuestionPackage } from "./types";
import { validateRap002QuestionPackage } from "./validator";
import { renderStemWithNumericDisplayPolicy } from "../numeric-display-policy";
import { naturalizeEnglishRapExplanation } from "../naturalize-explanation";
import { renderRap002EditorialExplanation } from "./editorial-explanation";
import { compactEnglishRapExplanation } from "../editorial-compactor";
import { polishEnglishRapStem } from "../editorial-stem";
import { renderLocalizedRap002Explanation } from "./localized-explanation";
import { renderLocalizedRap002Stem } from "./localized-stem";

export function runRap002Pipeline(cpId: Rap002CanonicalProblemId = "RAP-CP-007", input: Rap002ParameterInput = {}): Rap002QuestionPackage {
  const parameters = generateRap002Parameters({ ...input, canonicalProblemId: cpId });
  const solver = solveRap002(parameters);
  const localizedExplanation = renderLocalizedRap002Explanation(
    parameters,
    solver,
    renderRap002Explanation(parameters, solver),
  );
  const naturalizedExplanation = naturalizeEnglishRapExplanation(localizedExplanation, parameters.language, solver.answer);
  const editorialExplanation = renderRap002EditorialExplanation(parameters, solver, naturalizedExplanation);
  const explanation = compactEnglishRapExplanation(editorialExplanation, parameters.language, {
    maxMeaningfulLines: 5,
    padToLength: 7,
  });
  const sourceStem = parameters.language === "en"
    ? renderRap002Template(getRap002QuestionEntry(cpId, parameters.questionLanguageId, "en").template, parameters.variables)
    : renderLocalizedRap002Stem(parameters)!;
  const stem = polishEnglishRapStem(
    renderStemWithNumericDisplayPolicy(sourceStem, solver.answer, solver.answerType, parameters.language),
    parameters.language,
  );
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
