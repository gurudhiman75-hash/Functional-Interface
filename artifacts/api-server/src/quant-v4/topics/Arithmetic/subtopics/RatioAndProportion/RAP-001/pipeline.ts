import { renderRap001Explanation } from "./explanation-renderer";
import {
  buildRap001SemanticTrace,
  getAnswerType,
  getQuestionEntry,
  getRequiredVariables,
  getTaskKind,
  renderTemplate,
  resolveRap001EntityVariables,
} from "./library";
import { getEffectiveRap001QuestionEntry } from "./effective-question-entry";
import {
  generateRap001Parameters,
  getSelectableQuestionLanguageIds,
  type Rap001ParameterInput,
} from "./parameter-generator";
import { buildRap001ReasoningGraph } from "./reasoning-graph";
import { solveRap001 } from "./solver";
import {
  RAP_001_ARCHETYPE_ID,
  type Rap001CanonicalProblemId,
  type Rap001Language,
  type Rap001QuestionPackage,
} from "./types";
import { validateRap001QuestionPackage } from "./validator";
import { renderStemWithNumericDisplayPolicy } from "../numeric-display-policy";
import { naturalizeEnglishRapExplanation } from "../naturalize-explanation";
import { normalizeRap001EditorialParameters } from "./editorial-parameter-normalizer";
import { normalizeRap001EditorialSolver } from "./editorial-solver-normalizer";
import { polishEnglishRapStem } from "../editorial-stem";
import { stableBucket } from "./math";
import { curateDefaultQuestionLanguageIds } from "../../../../../common/default-question-language-pool";

type RapTargetedStemVariant = Readonly<{
  id: string;
  apply: (stem: string) => string;
}>;

const RAP_TARGETED_REPEAT_STEM_VARIANTS: Readonly<Record<string, readonly RapTargetedStemVariant[]>> = Object.freeze({
  "RAP-QL-022": Object.freeze([
    { id: "source", apply: (stem) => stem },
    {
      id: "number-of-coins",
      apply: (stem) => stem.replace(
        /how many coins of (.+?) are in the bag\?$/i,
        "what is the number of coins of $1 in the bag?",
      ),
    },
    {
      id: "bag-contains",
      apply: (stem) => stem.replace(
        /how many coins of (.+?) are in the bag\?$/i,
        "how many $1 coins does the bag contain?",
      ),
    },
    {
      id: "coin-count",
      apply: (stem) => stem.replace(
        /how many coins of (.+?) are in the bag\?$/i,
        "what is the count of $1 coins in the bag?",
      ),
    },
  ]),
  "RAP-QL-028": Object.freeze([
    { id: "source", apply: (stem) => stem },
    {
      id: "quantity-added",
      apply: (stem) => stem.replace(
        /How many litres of (.+?) should be added to make the ratio (.+?)\?$/i,
        "What quantity of $1, in litres, should be added so that the ratio becomes $2?",
      ),
    },
    {
      id: "litres-required",
      apply: (stem) => stem.replace(
        /How many litres of (.+?) should be added to make the ratio (.+?)\?$/i,
        "Find the quantity of $1, in litres, that must be added to obtain the ratio $2.",
      ),
    },
    {
      id: "final-ratio",
      apply: (stem) => stem.replace(
        /How many litres of (.+?) should be added to make the ratio (.+?)\?$/i,
        "How much $1 should be added, in litres, for the final ratio to become $2?",
      ),
    },
  ]),
  "RAP-QL-032": Object.freeze([
    { id: "source", apply: (stem) => stem },
    {
      id: "mixture-percent",
      apply: (stem) => stem.replace(
        /What is the percentage of acid in the solution\?$/i,
        "What percentage of the mixture is acid?",
      ),
    },
    {
      id: "find-percent",
      apply: (stem) => stem.replace(
        /What is the percentage of acid in the solution\?$/i,
        "Find the percentage of acid in the solution.",
      ),
    },
    {
      id: "concentration",
      apply: (stem) => stem.replace(
        /What is the percentage of acid in the solution\?$/i,
        "Calculate the acid concentration as a percentage.",
      ),
    },
  ]),
});

function rapTargetedStemVariantIndex(questionLanguageId: string, seed: string, variantCount: number) {
  const numericTokens = seed
    .split(":")
    .filter((part) => /^\d+$/.test(part))
    .map(Number);

  if (numericTokens.length >= 2) {
    const sectionOrdinal = numericTokens[0]!;
    const slotOrdinal = numericTokens[1]!;
    return (
      stableBucket(`${questionLanguageId}:targeted-stem-offset`, variantCount) +
      sectionOrdinal +
      Math.floor(sectionOrdinal / 3) +
      slotOrdinal
    ) % variantCount;
  }

  return stableBucket(`${seed}:${questionLanguageId}:targeted-stem`, variantCount);
}

function applyRapTargetedRepeatStemVariant(
  questionLanguageId: string,
  seed: string,
  stem: string,
  language: Rap001Language,
) {
  if (language !== "en") return stem;
  const variants = RAP_TARGETED_REPEAT_STEM_VARIANTS[questionLanguageId];
  if (!variants?.length) return stem;
  const variantIndex = rapTargetedStemVariantIndex(questionLanguageId, seed, variants.length);
  const variant = variants[variantIndex]!;
  const transformed = variant.apply(stem);
  if (variantIndex > 0 && transformed === stem) {
    throw new Error(
      `${questionLanguageId}: RAP targeted stem variant '${variant.id}' did not match the source stem.`,
    );
  }
  return transformed;
}

function resolveRap001DefaultInput(
  cpId: Rap001CanonicalProblemId,
  input: Rap001ParameterInput,
): Rap001ParameterInput {
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
  const seed = input.seed ?? `RAP-001:${cpId}`;

  return {
    ...input,
    questionLanguageId: source[stableBucket(`${seed}:curated-default-ql`, source.length)]!,
  };
}

export function runRap001Pipeline(
  cpId: Rap001CanonicalProblemId,
  input: Rap001ParameterInput = {},
): Rap001QuestionPackage {
  const resolvedInput = resolveRap001DefaultInput(cpId, input);
  const parameters = normalizeRap001EditorialParameters(
    generateRap001Parameters(cpId, resolvedInput),
  );
  const solver = normalizeRap001EditorialSolver(parameters, solveRap001(parameters));
  const reasoningGraph = buildRap001ReasoningGraph(parameters, solver);
  let renderedExplanation;
  try {
    renderedExplanation = renderRap001Explanation(parameters, solver, reasoningGraph);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `RAP-001 explanation rendering failed: cpId=${cpId}; qlId=${parameters.questionLanguageId}; taskKind=${parameters.taskKind}; seed=${String(resolvedInput.seed ?? "")}; ${message}`,
      { cause: error },
    );
  }
  const explanation = naturalizeEnglishRapExplanation(
    renderedExplanation,
    parameters.language,
    solver.answer,
  );
  const renderVariables = resolveRap001EntityVariables(
    parameters.variables,
    parameters.language,
    parameters.entityReferences,
  );
  const renderedStem = renderTemplate(
    getEffectiveRap001QuestionEntry(
      cpId,
      parameters.questionLanguageId,
      parameters.language,
    ).template,
    renderVariables,
  );
  const polishedStem = polishEnglishRapStem(
    renderStemWithNumericDisplayPolicy(
      renderedStem,
      solver.answer,
      solver.answerType,
      parameters.language,
    ),
    parameters.language,
  );
  const stem = applyRapTargetedRepeatStemVariant(
    parameters.questionLanguageId,
    String(resolvedInput.seed ?? ""),
    polishedStem,
    parameters.language,
  );
  const semanticTrace = buildRap001SemanticTrace(parameters.semanticContext);
  const basePackage = {
    archetypeId: RAP_001_ARCHETYPE_ID,
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
      scenario: semanticTrace.scenarioId,
      scenarioId: semanticTrace.scenarioId,
      semanticDomain: semanticTrace.semanticDomain,
      entityIds: semanticTrace.entityIds,
      frequencyMetadata: semanticTrace.frequencyMetadata,
      grammarMetadata: semanticTrace.grammarMetadata,
      graphId: reasoningGraph.graphId,
      answer: solver.answer,
    },
    mathJax: solver.mathJax,
  };
  const validation = validateRap001QuestionPackage({
    ...basePackage,
    validation: { valid: false, checks: [] },
  });
  return { ...basePackage, validation };
}

export function runRap001ForLanguages(
  cpId: Rap001CanonicalProblemId,
  input: Rap001ParameterInput = {},
) {
  const baseInput = resolveRap001DefaultInput(cpId, { ...input, language: "en" });
  const base = generateRap001Parameters(cpId, baseInput);
  return (["en", "hi", "pa"] as Rap001Language[]).map((language) =>
    runRap001Pipeline(cpId, {
      ...input,
      language,
      questionLanguageId: base.questionLanguageId,
      difficultyBand: base.difficultyBand,
      seed: input.seed,
    }),
  );
}

export const runRap001Cp001Pipeline = (input: Rap001ParameterInput = {}) =>
  runRap001Pipeline("RAP-CP-001", input);
export const runRap001Cp002Pipeline = (input: Rap001ParameterInput = {}) =>
  runRap001Pipeline("RAP-CP-002", input);
export const runRap001Cp003Pipeline = (input: Rap001ParameterInput = {}) =>
  runRap001Pipeline("RAP-CP-003", input);
export const runRap001Cp004Pipeline = (input: Rap001ParameterInput = {}) =>
  runRap001Pipeline("RAP-CP-004", input);
export const runRap001Cp005Pipeline = (input: Rap001ParameterInput = {}) =>
  runRap001Pipeline("RAP-CP-005", input);
export const runRap001Cp006Pipeline = (input: Rap001ParameterInput = {}) =>
  runRap001Pipeline("RAP-CP-006", input);
