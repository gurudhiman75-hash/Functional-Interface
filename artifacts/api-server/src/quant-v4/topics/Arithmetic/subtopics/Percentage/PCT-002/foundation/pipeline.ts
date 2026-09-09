import { renderPct002Explanation } from "./explanation-renderer";
import {
  getAnswerType,
  getQuestionEntry,
  getRequiredVariables,
  getTaskKind,
  renderTemplate,
} from "./library";
import {
  generatePct002Parameters,
  getSelectableQuestionLanguageIds,
  type Pct002ParameterInput,
} from "./parameter-generator";
import { buildPct002ReasoningGraph } from "./reasoning-graph";
import { solvePct002 } from "./solver";
import {
  PCT_002_ARCHETYPE_ID,
  type Pct002CanonicalProblemId,
  type Pct002Language,
  type Pct002QuestionPackage,
} from "./types";
import { validatePct002QuestionPackage } from "./validator";
import { stableBucket } from "./math";
import { curateDefaultQuestionLanguageIds } from "../../../../../../common/default-question-language-pool";

function resolvePct002DefaultInput(
  cpId: Pct002CanonicalProblemId,
  input: Pct002ParameterInput,
): Pct002ParameterInput {
  if (input.questionLanguageId) return input;

  const language = input.language ?? "en";
  const availableIds = getSelectableQuestionLanguageIds(cpId, language);
  const curatedIds = curateDefaultQuestionLanguageIds(availableIds, (questionLanguageId) => {
    const englishEntry = getQuestionEntry(cpId, questionLanguageId, "en");
    return {
      taskKind: getTaskKind(cpId, questionLanguageId),
      answerType: getAnswerType(cpId, questionLanguageId),
      requiredVariables: getRequiredVariables(cpId, questionLanguageId),
      difficulty: englishEntry.difficulty,
      template: englishEntry.template,
    };
  });
  const difficultyFiltered = input.difficultyBand
    ? curatedIds.filter(
        (questionLanguageId) =>
          getQuestionEntry(cpId, questionLanguageId, "en").difficulty === input.difficultyBand,
      )
    : curatedIds;
  const source = difficultyFiltered.length > 0 ? difficultyFiltered : curatedIds;
  if (source.length === 0) return input;
  const seed = input.seed ?? `PCT-002:${cpId}`;

  return {
    ...input,
    questionLanguageId: source[stableBucket(`${seed}:curated-default-ql`, source.length)]!,
  };
}

export function runPct002Pipeline(
  cpId: Pct002CanonicalProblemId,
  input: Pct002ParameterInput = {},
): Pct002QuestionPackage {
  const resolvedInput = resolvePct002DefaultInput(cpId, input);
  const parameters = generatePct002Parameters(cpId, resolvedInput);
  const solver = solvePct002(parameters);
  const reasoningGraph = buildPct002ReasoningGraph(parameters, solver);
  const explanation = renderPct002Explanation(parameters, solver, reasoningGraph);
  const stem = renderTemplate(
    getQuestionEntry(cpId, parameters.questionLanguageId, parameters.language).template,
    parameters.variables,
  );
  const basePackage = {
    archetypeId: PCT_002_ARCHETYPE_ID,
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
    reasoningGraph,
    explanation,
    traceability: {
      questionId: parameters.questionId,
      canonicalProblemId: cpId,
      questionLanguageId: parameters.questionLanguageId,
      explanationId: parameters.explanationId,
      difficultyBand: parameters.difficultyBand,
      taskKind: parameters.taskKind,
      answerType: parameters.answerType,
      answer: solver.answer,
    },
    mathJax: solver.mathJax,
  };
  const validation = validatePct002QuestionPackage({
    ...basePackage,
    validation: { valid: false, checks: [] },
  });
  return { ...basePackage, validation };
}

export function runPct002ForLanguages(
  cpId: Pct002CanonicalProblemId,
  input: Pct002ParameterInput = {},
) {
  const baseInput = resolvePct002DefaultInput(cpId, { ...input, language: "hi" });
  const base = generatePct002Parameters(cpId, baseInput);
  return (["en", "hi", "pa"] as Pct002Language[]).map((language) =>
    runPct002Pipeline(cpId, {
      ...input,
      language,
      questionLanguageId: base.questionLanguageId,
      difficultyBand: base.difficultyBand,
      seed: input.seed,
    }),
  );
}
