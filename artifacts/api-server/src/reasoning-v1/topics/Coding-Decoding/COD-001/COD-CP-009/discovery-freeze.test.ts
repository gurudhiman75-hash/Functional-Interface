import assert from "node:assert/strict";
import {
  CP009_DISCOVERED_QL_CANDIDATE_COUNT,
  CP009_DISCOVERED_TASK_CONTRACT_COUNT,
  CP009_QL_CANDIDATES,
  type Cp009QlCandidate,
} from "./discovery-candidate-registry";
import { generateCompleteCandidateSetPrototypeQuestion } from "./complete-candidate-set-generator";
import type { CompleteCandidateSetPrototypeId } from "./complete-candidate-set-types";
import { generateExactAtomicPrototypeQuestion } from "./exact-atomic-generator";
import type { ExactAtomicPrototypeId } from "./exact-atomic-types";
import { generateExactSetMissingPrototypeQuestion } from "./exact-set-missing-generator";
import type { ExactSetMissingPrototypeId } from "./exact-set-missing-types";
import { generatePossibleImpossiblePrototypeQuestion } from "./possible-impossible-generator";
import type { PossibleImpossiblePrototypeId } from "./possible-impossible-types";
import { generatePossibleSetPrototypeQuestion } from "./possible-set-generator";
import type { PossibleSetPrototypeId } from "./possible-set-types";
import { generateResolvedCompositionPrototypeQuestion } from "./resolved-composition-generator";
import type { ResolvedCompositionPrototypeId } from "./resolved-composition-types";
import type { SentenceCodeTopologyKind } from "./topology-generator";

interface GenericOption {
  value: string;
  isCorrect: boolean;
}

interface GenericRow {
  statementId: string;
  sentence: string;
  displayedCode: string;
}

interface GenericQuestion {
  prototypeId: string;
  permanentQlId: null;
  prototypeOnly: true;
  publiclyPublishable: false;
  topologyKind: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  renderer: string;
  answerType: string;
  stem: string;
  structuredPrompt: {
    rows: readonly GenericRow[];
  };
  options: readonly GenericOption[];
  correctIndex: number;
  explanation: unknown;
  metadata: {
    scenarioId: string;
  };
}

function chosenTopology(candidate: Cp009QlCandidate, seed: number): SentenceCodeTopologyKind | undefined {
  if (candidate.fixedTopology && candidate.fixedTopology !== "RESOLVED_COMPONENT_COMPOSITION") {
    return candidate.fixedTopology;
  }
  if (candidate.parameterTopologies) {
    return candidate.parameterTopologies[(seed - 1) % candidate.parameterTopologies.length];
  }
  return undefined;
}

function generateCandidateQuestion(candidate: Cp009QlCandidate, seed: number): GenericQuestion {
  const topology = chosenTopology(candidate, seed);
  switch (candidate.generatorFamily) {
    case "EXACT_ATOMIC":
      return generateExactAtomicPrototypeQuestion(
        candidate.prototypeId as ExactAtomicPrototypeId,
        seed,
        topology,
      ) as GenericQuestion;
    case "EXACT_INVARIANT_SET":
    case "MISSING_MEMBER":
      return generateExactSetMissingPrototypeQuestion(
        candidate.prototypeId as ExactSetMissingPrototypeId,
        seed,
      ) as GenericQuestion;
    case "POSSIBLE_ATOMIC":
    case "IMPOSSIBLE_ATOMIC":
      return generatePossibleImpossiblePrototypeQuestion(
        candidate.prototypeId as PossibleImpossiblePrototypeId,
        seed,
        topology as "CONTROLLED_PARTIAL_INFORMATION" | "CONTROLLED_THREE_WAY_PARTIAL_INFORMATION",
      ) as GenericQuestion;
    case "POSSIBLE_MIXED_SET":
      return generatePossibleSetPrototypeQuestion(
        candidate.prototypeId as PossibleSetPrototypeId,
        seed,
        topology as "CONTROLLED_PARTIAL_INFORMATION" | "CONTROLLED_THREE_WAY_PARTIAL_INFORMATION",
      ) as GenericQuestion;
    case "RESOLVED_COMPOSITION":
      return generateResolvedCompositionPrototypeQuestion(
        candidate.prototypeId as ResolvedCompositionPrototypeId,
        seed,
      ) as GenericQuestion;
    case "COMPLETE_CANDIDATE_SET":
      return generateCompleteCandidateSetPrototypeQuestion(
        candidate.prototypeId as CompleteCandidateSetPrototypeId,
        seed,
        topology as "CONTROLLED_PARTIAL_INFORMATION" | "CONTROLLED_THREE_WAY_PARTIAL_INFORMATION",
      ) as GenericQuestion;
  }
}

const forbiddenStudentText = [
  /study these examples/i,
  /according to this coding pattern/i,
  /apply the same rule/i,
  /use the same rule/i,
  /prototype/i,
  /topology/i,
  /COD-CP009/i,
  /COD-QL-/i,
  /\br[1-4]\b/i,
];

const candidateIds = new Set<string>();
const candidateSignatures = new Set<string>();
const renderedQuestionKeys = new Set<string>();
const contractIds = new Set<string>();
const difficultyCoverage = new Set<string>();
const answerSemanticsCounts = new Map<string, number>();
const generatorFamilyCounts = new Map<string, number>();
const queryDirectionCounts = new Map<string, number>();
const candidateReports: Record<string, {
  variants: number;
  scenarios: number;
  topologies: readonly string[];
  difficulties: readonly string[];
}> = {};
let generatedQuestions = 0;

assert.equal(CP009_DISCOVERED_TASK_CONTRACT_COUNT, 16);
assert.equal(CP009_DISCOVERED_QL_CANDIDATE_COUNT, 24);
assert.equal(CP009_QL_CANDIDATES.length, 24);

for (const candidate of CP009_QL_CANDIDATES) {
  assert.equal(candidateIds.has(candidate.candidateId), false, `Duplicate candidate ID ${candidate.candidateId}`);
  candidateIds.add(candidate.candidateId);
  contractIds.add(candidate.prototypeId);
  assert.equal(candidate.status, "DISCOVERY_FROZEN");
  assert.equal(candidate.renderer, "STATEMENT_CODE_GRID");
  assert.equal(candidate.localeMode, "LANGUAGE_ADAPTED");

  const signature = [
    candidate.queryDirection,
    candidate.answerSemantics,
    candidate.answerType,
    candidate.solveMode,
  ].join("|");
  assert.equal(candidateSignatures.has(signature), false, `Duplicate semantic candidate signature ${signature}`);
  candidateSignatures.add(signature);
  answerSemanticsCounts.set(candidate.answerSemantics, (answerSemanticsCounts.get(candidate.answerSemantics) ?? 0) + 1);
  generatorFamilyCounts.set(candidate.generatorFamily, (generatorFamilyCounts.get(candidate.generatorFamily) ?? 0) + 1);
  queryDirectionCounts.set(candidate.queryDirection, (queryDirectionCounts.get(candidate.queryDirection) ?? 0) + 1);

  const variants = new Set<string>();
  const scenarios = new Set<string>();
  const topologies = new Set<string>();
  const difficulties = new Set<string>();

  for (let seed = 1; seed <= 40; seed += 1) {
    const first = generateCandidateQuestion(candidate, seed);
    const second = generateCandidateQuestion(candidate, seed);
    assert.deepEqual(first, second, `${candidate.candidateId}/${seed} must be deterministic`);
    assert.equal(first.prototypeId, candidate.prototypeId);
    assert.equal(first.permanentQlId, null);
    assert.equal(first.prototypeOnly, true);
    assert.equal(first.publiclyPublishable, false);
    assert.equal(first.renderer, candidate.renderer);
    assert.equal(first.answerType, candidate.answerType);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options.map((option) => option.value)).size, 4);
    assert.equal(first.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(first.options[first.correctIndex]!.isCorrect, true);
    assert.equal(first.stem.startsWith("In a certain code language, "), true);
    assert.equal(first.structuredPrompt.rows.length >= 2, true);
    assert.deepEqual(
      first.structuredPrompt.rows.map((row) => row.statementId),
      first.structuredPrompt.rows.map((_, index) => `statement-${index + 1}`),
    );

    const studentPayload = JSON.stringify({
      stem: first.stem,
      structuredPrompt: first.structuredPrompt,
      options: first.options,
      explanation: first.explanation,
    });
    for (const forbidden of forbiddenStudentText) {
      assert.equal(forbidden.test(studentPayload), false, `${candidate.candidateId}/${seed} leaked ${forbidden}`);
    }

    if (candidate.fixedTopology) {
      assert.equal(first.topologyKind, candidate.fixedTopology);
    } else if (candidate.parameterTopologies) {
      assert.equal(candidate.parameterTopologies.includes(first.topologyKind as SentenceCodeTopologyKind), true);
    }

    const renderedKey = JSON.stringify({
      stem: first.stem,
      rows: first.structuredPrompt.rows.map((row) => ({ sentence: row.sentence, code: row.displayedCode })),
      options: first.options.map((option) => option.value),
    });
    assert.equal(renderedQuestionKeys.has(renderedKey), false, `Cross-candidate rendered duplicate at ${candidate.candidateId}/${seed}`);
    renderedQuestionKeys.add(renderedKey);
    variants.add(renderedKey);
    scenarios.add(first.metadata.scenarioId);
    topologies.add(first.topologyKind);
    difficulties.add(first.difficulty);
    difficultyCoverage.add(first.difficulty);
    generatedQuestions += 1;
  }

  assert.equal(variants.size, 40, `${candidate.candidateId} lacks seed variation`);
  assert.equal(scenarios.size, 5, `${candidate.candidateId} must reach all five scenarios`);
  if (candidate.parameterTopologies) {
    assert.deepEqual(new Set(topologies), new Set(candidate.parameterTopologies));
  } else {
    assert.equal(topologies.size, 1);
  }
  candidateReports[candidate.candidateId] = {
    variants: variants.size,
    scenarios: scenarios.size,
    topologies: [...topologies].sort(),
    difficulties: [...difficulties].sort(),
  };
}

assert.equal(contractIds.size, 16);
assert.equal(candidateIds.size, 24);
assert.equal(candidateSignatures.size, 24);
assert.equal(generatedQuestions, 24 * 40);
assert.equal(renderedQuestionKeys.size, generatedQuestions);
assert.deepEqual(difficultyCoverage, new Set(["EASY", "MEDIUM", "HARD"]));
assert.deepEqual(Object.fromEntries(answerSemanticsCounts), {
  EXACT: 16,
  POSSIBLE: 4,
  IMPOSSIBLE: 2,
  COMPLETE_CANDIDATE_SET: 2,
});
assert.deepEqual(Object.fromEntries(generatorFamilyCounts), {
  EXACT_ATOMIC: 10,
  EXACT_INVARIANT_SET: 2,
  MISSING_MEMBER: 2,
  POSSIBLE_ATOMIC: 2,
  IMPOSSIBLE_ATOMIC: 2,
  POSSIBLE_MIXED_SET: 2,
  RESOLVED_COMPOSITION: 2,
  COMPLETE_CANDIDATE_SET: 2,
});

console.log(JSON.stringify({
  checkpoint: "COD-CP-009",
  maturity: "DISCOVERY_INVENTORY_FROZEN",
  permanentQlsCreated: 0,
  taskContracts: contractIds.size,
  qlCandidates: candidateIds.size,
  generatedQuestions,
  seedsPerCandidate: 40,
  uniqueRenderedQuestions: renderedQuestionKeys.size,
  difficultyCoverage: [...difficultyCoverage].sort(),
  answerSemanticsCounts: Object.fromEntries(answerSemanticsCounts),
  generatorFamilyCounts: Object.fromEntries(generatorFamilyCounts),
  queryDirectionCounts: Object.fromEntries(queryDirectionCounts),
  candidateReports,
  identityAllocation: "DEFERRED_UNTIL_CP007_CP008_SEQUENCE_RESOLVED",
  verdict: "PASS — CP-009 EXECUTABLE DISCOVERY INVENTORY",
}, null, 2));
