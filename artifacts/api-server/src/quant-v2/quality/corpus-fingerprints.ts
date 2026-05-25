import type { CanonicalPercentageProblem } from "../canonical/percentage-types";
import type { EditorialRealization } from "../editorial/editorial-types";
import type { ReasoningGraph } from "../reasoning/reasoning-graph-types";
import { deriveCanonicalScenario } from "../semantic/canonical-scenario";
import { inferExaminerIntent } from "./examiner-intents";

export type CorpusFingerprints = {
  topologyFingerprint: string;
  operationFingerprint: string;
  percentageVectorFingerprint: string;
  numericInstantiationFingerprint: string;
  semanticIntentFingerprint: string;
  distractorPatternFingerprint: string;
  compositeFingerprint: string;
};

function stableNumber(value: number) {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

function percentageVector(problem: CanonicalPercentageProblem) {
  const vector = Object.entries(problem.variables)
    .filter(([key]) => /percent|rate|share|direction/iu.test(key))
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}:${stableNumber(Math.abs(value))}`)
    .join(",");
  return vector || `answer:${stableNumber(Math.abs(problem.answer))}`;
}

function numericInstantiation(problem: CanonicalPercentageProblem) {
  return Object.entries(problem.variables)
    .filter(([, value]) => typeof value === "number" && Number.isFinite(value))
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}:${stableNumber(value)}`)
    .join(",");
}

export function createCorpusFingerprints(input: {
  problem: CanonicalPercentageProblem;
  graph: ReasoningGraph;
  editorial: EditorialRealization;
}): CorpusFingerprints {
  const scenario = deriveCanonicalScenario({
    problem: input.problem,
    editorial: input.editorial,
  });
  const examinerIntent = inferExaminerIntent(input.problem, input.graph);
  const topologyFingerprint = [
    input.problem.subtype,
    input.problem.topology?.family ?? "none",
    input.problem.topology?.variant ?? "none",
  ].join("|");
  const operationFingerprint = input.graph.steps
    .map((step) => `${step.type}:${step.descriptionKey}`)
    .join(">");
  const percentageVectorFingerprint = percentageVector(input.problem);
  const numericInstantiationFingerprint = numericInstantiation(input.problem);
  const semanticIntentFingerprint = [
    examinerIntent.primaryIntent,
    scenario.domain,
    scenario.object,
    input.problem.reasoningPattern,
  ].join("|");
  const distractorPatternFingerprint = [
    ...input.problem.traps,
    ...(input.problem.topology?.misconceptionDistractors ?? []).map(
      (item) => item.misconception,
    ),
  ].join("|");
  const compositeFingerprint = [
    topologyFingerprint,
    operationFingerprint,
    percentageVectorFingerprint,
    numericInstantiationFingerprint,
    semanticIntentFingerprint,
  ].join("::");

  return {
    topologyFingerprint,
    operationFingerprint,
    percentageVectorFingerprint,
    numericInstantiationFingerprint,
    semanticIntentFingerprint,
    distractorPatternFingerprint,
    compositeFingerprint,
  };
}

export function semanticDuplicateKey(fingerprints: CorpusFingerprints) {
  return [
    fingerprints.compositeFingerprint,
    fingerprints.distractorPatternFingerprint,
  ].join("::");
}
