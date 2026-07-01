import { projectCompatibilityLines } from "../../../../../../common/eev2/compatibility-projector";
import {
  getAnswerType,
  getExplanationId,
  getQuestionEntry,
  getRequiredVariables,
  getTaskKind,
  renderTemplate,
} from "../library";
import { solvePct001 } from "../solver";
import type {
  Pct001DifficultyBand,
  Pct001Parameters,
} from "../types";
import { renderPercentOfKnownNumberBlocks } from "../eev2/percent-of-known-number/block-renderer";
import { validatePercentOfKnownNumberBlocks } from "../eev2/percent-of-known-number/block-validator";
import { validatePercentOfKnownNumberCompatibility } from "../eev2/percent-of-known-number/compatibility-validator";
import { validatePercentOfKnownNumberEducation } from "../eev2/percent-of-known-number/educational-validator";
import { PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_V2_VERSION } from "../eev2/percent-of-known-number/english-language-family.v2";
import { buildPercentOfKnownNumberGraph } from "../eev2/percent-of-known-number/graph-builder";
import { validatePercentOfKnownNumberGraph } from "../eev2/percent-of-known-number/graph-validator";
import {
  renderPercentOfKnownNumberEnglishV2,
} from "../eev2/percent-of-known-number/language-renderer.v2";
import type { RenderedEnglishRoleSet } from "../eev2/percent-of-known-number/language-renderer";
import {
  PERCENT_OF_KNOWN_NUMBER_PLANNER_VERSION,
  planPercentOfKnownNumberExplanation,
} from "../eev2/percent-of-known-number/planner";
import { validatePercentOfKnownNumberPlan } from "../eev2/percent-of-known-number/plan-validator";
import {
  PERCENT_OF_KNOWN_NUMBER_TRACE_VERSION,
  buildPercentOfKnownNumberTrace,
} from "../eev2/percent-of-known-number/trace-builder";
import { validatePercentOfKnownNumberTrace } from "../eev2/percent-of-known-number/trace-validator";
import { getPct001QuestionDefinition } from "./registry";
import type {
  Pct001QuestionDefinition,
  Pct001QuestionDefinitionId,
  Pct001QuestionDefinitionInstance,
  RatePair,
} from "./types";

function stableHash(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function pick<T>(values: readonly T[], key: string): T {
  if (values.length === 0) throw new Error("Question definition range is empty.");
  return values[stableHash(key) % values.length]!;
}

export function deriveQuestionDifficulty(
  pair: RatePair,
  unitValue: number,
): Pct001DifficultyBand {
  if (
    !Number.isInteger(pair.knownRate) ||
    !Number.isInteger(pair.targetRate) ||
    !Number.isInteger(unitValue)
  ) {
    return "Hard";
  }
  const knownQuantity = pair.knownRate * unitValue;
  const scale = Math.max(
    pair.targetRate / pair.knownRate,
    pair.knownRate / pair.targetRate,
  );
  if (knownQuantity >= 5_000 || scale >= 5) return "Medium";
  return "Easy";
}

export function validateQuestionDefinition(
  definition: Pct001QuestionDefinition,
): readonly string[] {
  const failures: string[] = [];
  if (getTaskKind("PCT-CP-002", definition.stem.qlId) !== definition.taskKind) {
    failures.push("TASK_KIND_MISMATCH");
  }
  if (getAnswerType("PCT-CP-002", definition.stem.qlId) !== "ABSOLUTE") {
    failures.push("ANSWER_TYPE_MISMATCH");
  }
  if (
    getQuestionEntry("PCT-CP-002", definition.stem.qlId, "en").template.length ===
    0
  ) {
    failures.push("EMPTY_APPROVED_STEM");
  }
  if (definition.variables.ratePairs.length === 0) failures.push("EMPTY_RATE_RANGE");
  if (definition.variables.unitValues.length === 0) failures.push("EMPTY_UNIT_RANGE");
  for (const pair of definition.variables.ratePairs) {
    if (pair.knownRate <= 0 || pair.targetRate <= 0) failures.push("NON_POSITIVE_RATE");
    if (pair.targetRate > 100) failures.push("TARGET_ABOVE_REALISM_BOUNDARY");
    if (
      (pair.targetRate > pair.knownRate ? "TARGET_GREATER" : "TARGET_SMALLER") !==
      pair.direction
    ) {
      failures.push("RATE_DIRECTION_MISMATCH");
    }
  }
  if (definition.variables.unitValues.some((value) => value <= 0)) {
    failures.push("NON_POSITIVE_UNIT_VALUE");
  }
  if (!definition.explanation.requiredRoles.includes("SINGLE_UNIT_DERIVATION")) {
    failures.push("MISSING_ONE_UNIT_ROLE");
  }
  return [...new Set(failures)];
}

function buildParameters(
  definition: Pct001QuestionDefinition,
  seed: string,
  pair: RatePair,
  unitValue: number,
): Pct001Parameters {
  const knownQuantity = pair.knownRate * unitValue;
  const difficultyBand = deriveQuestionDifficulty(pair, unitValue);
  return {
    archetypeId: "PCT-001",
    canonicalProblemId: "PCT-CP-002",
    questionId: `PCT-001:${definition.definitionId}:${stableHash(seed).toString(16).padStart(8, "0")}`,
    questionLanguageId: definition.stem.qlId,
    explanationId: getExplanationId("PCT-CP-002"),
    language: "en",
    difficultyBand,
    taskKind: "percentOfKnownNumber",
    answerType: "ABSOLUTE",
    requiredVariables: getRequiredVariables(
      "PCT-CP-002",
      definition.stem.qlId,
    ),
    variables: {
      rate1: pair.knownRate,
      value1: knownQuantity,
      rate2: pair.targetRate,
    },
    sourceTrace: {
      questionLanguageSource: definition.stem.sourceFile,
      explanationSource:
        "eev2/percent-of-known-number/english-language-family.v2.ts",
      variableRangeSource:
        `question-definitions/${definition.definitionId}/definition.ts`,
    },
  };
}

export function instantiatePct001QuestionDefinition(
  definitionId: Pct001QuestionDefinitionId,
  seed: string,
): Pct001QuestionDefinitionInstance {
  const definition = getPct001QuestionDefinition(definitionId);
  const definitionFailures = validateQuestionDefinition(definition);
  if (definitionFailures.length > 0) {
    throw new Error(
      `Invalid question definition ${definitionId}: ${definitionFailures.join(",")}`,
    );
  }
  const pair = pick(
    definition.variables.ratePairs,
    `${definitionId}:${seed}:rate-pair`,
  );
  const unitValue = pick(
    definition.variables.unitValues,
    `${definitionId}:${seed}:unit-value`,
  );
  const parameters = buildParameters(definition, seed, pair, unitValue);
  const stem = renderTemplate(
    getQuestionEntry("PCT-CP-002", definition.stem.qlId, "en").template,
    parameters.variables,
  );
  const solver = solvePct001(parameters);
  const evidence = solver.educationalEvidence;
  if (!evidence) throw new Error("Missing percentOfKnownNumber evidence.");
  const trace = buildPercentOfKnownNumberTrace(evidence);
  const graph = buildPercentOfKnownNumberGraph(trace);
  const plan = planPercentOfKnownNumberExplanation(
    graph,
    definition.explanation.detailMode,
  );
  const renderedRoles = renderPercentOfKnownNumberEnglishV2(plan, trace);
  const blocks = renderPercentOfKnownNumberBlocks(
    plan,
    renderedRoles as unknown as RenderedEnglishRoleSet,
    graph,
    {
      solverVersion: "PCT-001-solver-v1",
      traceVersion: PERCENT_OF_KNOWN_NUMBER_TRACE_VERSION,
      graphVersion: graph.graphVersion,
      plannerVersion: PERCENT_OF_KNOWN_NUMBER_PLANNER_VERSION,
      languageFamilyVersion:
        PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_V2_VERSION,
    },
  );
  const lines = projectCompatibilityLines(blocks);
  const validations = [
    validatePercentOfKnownNumberTrace(trace),
    validatePercentOfKnownNumberGraph(graph, trace),
    validatePercentOfKnownNumberPlan(plan, graph),
    validatePercentOfKnownNumberBlocks(blocks, plan, graph, trace),
    validatePercentOfKnownNumberEducation(blocks, plan),
    validatePercentOfKnownNumberCompatibility(blocks, lines),
  ];
  return {
    definition,
    seed,
    difficulty: parameters.difficultyBand,
    parameters,
    stem,
    solver,
    trace,
    graph,
    plan,
    renderedRoles,
    blocks,
    lines,
    validations,
  };
}

