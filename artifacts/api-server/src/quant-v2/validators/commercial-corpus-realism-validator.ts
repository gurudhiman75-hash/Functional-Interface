import type { CanonicalPercentageProblem } from "../canonical/percentage-types";
import type { EditorialRealization } from "../editorial/editorial-types";
import type { ReasoningGraph } from "../reasoning/reasoning-graph-types";
import {
  createCorpusFingerprints,
  semanticDuplicateKey,
} from "../quality/corpus-fingerprints";
import { inferExaminerIntent } from "../quality/examiner-intents";
import { leakedInternalExplanationTerms } from "../quality/teacher-explanation-normalizer";
import type { ValidationResult } from "./problem-validator";

export type CommercialCorpusSample = {
  problem: CanonicalPercentageProblem;
  graph: ReasoningGraph;
  editorial: EditorialRealization;
};

export type CommercialCorpusMetrics = {
  sampleCount: number;
  semanticDuplicateShare: number;
  topologyFamilyShare: Record<string, number>;
  examinerIntentShare: Record<string, number>;
  internalTermLeakCount: number;
  simpleTemplateShare: number;
  relationalShare: number;
  reverseLogicShare: number;
  filteredShare: number;
  hybridShare: number;
  multiStepShare: number;
};

function increment(map: Record<string, number>, key: string) {
  map[key] = (map[key] ?? 0) + 1;
}

function share(count: number, total: number) {
  return total === 0 ? 0 : count / total;
}

function family(problem: CanonicalPercentageProblem) {
  return problem.topology?.family ?? "simple_template";
}

function isReverseLogic(problem: CanonicalPercentageProblem) {
  return /reverse|restore|hidden_total|hidden_base|inverse/iu.test(
    `${problem.subtype} ${problem.reasoningPattern} ${family(problem)}`,
  );
}

function isFiltered(problem: CanonicalPercentageProblem) {
  return Boolean(problem.topology?.filteringChain) ||
    /filtered|valid|remaining|layered/iu.test(family(problem));
}

function isHybrid(problem: CanonicalPercentageProblem) {
  return /ratio|mixture|hybrid|expenditure|consumption/iu.test(
    `${problem.category} ${problem.subtype} ${family(problem)}`,
  );
}

function isMultiStep(sample: CommercialCorpusSample) {
  return sample.graph.steps.length >= 4 || sample.graph.branches.length >= 2;
}

export function validateCommercialCorpusRealism(
  samples: readonly CommercialCorpusSample[],
): ValidationResult & { metrics: CommercialCorpusMetrics } {
  const issues: string[] = [];
  const total = samples.length;
  const duplicateKeys = new Map<string, number>();
  const topologyFamilyCounts: Record<string, number> = {};
  const examinerIntentCounts: Record<string, number> = {};
  let internalTermLeakCount = 0;
  let simpleTemplateCount = 0;
  let relationalCount = 0;
  let reverseLogicCount = 0;
  let filteredCount = 0;
  let hybridCount = 0;
  let multiStepCount = 0;

  for (const sample of samples) {
    const fingerprints = createCorpusFingerprints(sample);
    const key = semanticDuplicateKey(fingerprints);
    duplicateKeys.set(key, (duplicateKeys.get(key) ?? 0) + 1);

    const topologyFamily = family(sample.problem);
    increment(topologyFamilyCounts, topologyFamily);
    increment(examinerIntentCounts, inferExaminerIntent(sample.problem, sample.graph).primaryIntent);

    if (leakedInternalExplanationTerms(sample.editorial.explanation).length > 0) {
      internalTermLeakCount += 1;
    }
    if (
      topologyFamily === "simple_template" &&
      sample.graph.steps.length <= 3 &&
      sample.problem.difficulty === "easy"
    ) {
      simpleTemplateCount += 1;
    }
    if (sample.problem.subtype === "relational_percentage") {
      relationalCount += 1;
    }
    if (isReverseLogic(sample.problem)) {
      reverseLogicCount += 1;
    }
    if (isFiltered(sample.problem)) {
      filteredCount += 1;
    }
    if (isHybrid(sample.problem)) {
      hybridCount += 1;
    }
    if (isMultiStep(sample)) {
      multiStepCount += 1;
    }
  }

  const duplicateCount = [...duplicateKeys.values()].reduce(
    (sum, count) => sum + Math.max(0, count - 1),
    0,
  );
  const semanticDuplicateShare = share(duplicateCount, total);
  const metrics: CommercialCorpusMetrics = {
    sampleCount: total,
    semanticDuplicateShare,
    topologyFamilyShare: Object.fromEntries(
      Object.entries(topologyFamilyCounts).map(([key, count]) => [
        key,
        share(count, total),
      ]),
    ),
    examinerIntentShare: Object.fromEntries(
      Object.entries(examinerIntentCounts).map(([key, count]) => [
        key,
        share(count, total),
      ]),
    ),
    internalTermLeakCount,
    simpleTemplateShare: share(simpleTemplateCount, total),
    relationalShare: share(relationalCount, total),
    reverseLogicShare: share(reverseLogicCount, total),
    filteredShare: share(filteredCount, total),
    hybridShare: share(hybridCount, total),
    multiStepShare: share(multiStepCount, total),
  };

  if (total === 0) {
    issues.push("Commercial corpus audit has no samples.");
  }
  if (semanticDuplicateShare > 0.96) {
    issues.push("Semantic duplicate share is critically high for commercial mock-test use.");
  }
  if (internalTermLeakCount > 0) {
    issues.push(`${internalTermLeakCount} explanations leaked internal engine terms.`);
  }
  if (metrics.simpleTemplateShare > 0.22) {
    issues.push("Simple template share is still too high.");
  }
  if (metrics.relationalShare < 0.12 && total >= 100) {
    issues.push("Relational percentage coverage is too low.");
  }
  if (metrics.reverseLogicShare < 0.12 && total >= 100) {
    issues.push("Reverse/hidden-base reasoning coverage is too low.");
  }
  if (metrics.filteredShare < 0.10 && total >= 100) {
    issues.push("Filtered-base reasoning coverage is too low.");
  }
  if (metrics.hybridShare < 0.10 && total >= 100) {
    issues.push("Hybrid/ratio-consumption reasoning coverage is too low.");
  }
  if (metrics.multiStepShare < 0.18 && total >= 100) {
    issues.push("Multi-step reasoning coverage is too low.");
  }

  return {
    valid: issues.length === 0,
    issues,
    metrics,
  };
}
