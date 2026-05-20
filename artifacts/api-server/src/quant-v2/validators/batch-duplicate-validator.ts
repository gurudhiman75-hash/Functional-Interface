import type { FormulaQuestion } from "../../lib/core/generator-engine";
import {
  extractCorpusSchedulerMetadata,
} from "../corpus-scheduler/corpus-scheduler";
import type { ValidationResult } from "./problem-validator";

export type BatchDuplicateMetrics = {
  exactDuplicateCount: number;
  nearDuplicateCount: number;
  topologyVectorRepeatCount: number;
  openingTopologyRepeatCount: number;
  objectRelationRepeatCount: number;
  familyVectorRepeatCount: number;
  answerPatternRepeatCount: number;
  examinerIntentNearRepeatCount: number;
  duplicateRiskScore: number;
};

function increment(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function repeatedCount(map: Map<string, number>) {
  return [...map.values()].reduce((sum, count) => sum + Math.max(0, count - 1), 0);
}

function issueFor(
  label: string,
  count: number,
  threshold: number,
) {
  return count > threshold ? [`${label}: ${count}`] : [];
}

export function createBatchDuplicateMetrics(
  questions: readonly FormulaQuestion[],
): BatchDuplicateMetrics {
  const exact = new Map<string, number>();
  const topologyVector = new Map<string, number>();
  const openingTopology = new Map<string, number>();
  const objectRelation = new Map<string, number>();
  const operation = new Map<string, number>();
  const familyVector = new Map<string, number>();
  const answerPattern = new Map<string, number>();
  let examinerIntentNearRepeatCount = 0;
  let previousIntent = "";

  for (const question of questions) {
    const item = extractCorpusSchedulerMetadata(question);
    increment(exact, String(question.text ?? "").trim().toLowerCase());
    increment(topologyVector, item.topologyVectorKey);
    increment(openingTopology, `${item.stemOpening}::${item.topologyKey}`);
    increment(objectRelation, `${item.semanticAnchor}::${item.topologyVectorKey}`);
    increment(operation, item.operationFingerprint);
    increment(familyVector, `${item.familyKey}::${item.topologyVectorKey}`);
    increment(answerPattern, item.answerPattern);
    if (previousIntent && previousIntent === item.examinerIntent) {
      examinerIntentNearRepeatCount += 1;
    }
    previousIntent = item.examinerIntent;
  }

  const exactDuplicateCount = repeatedCount(exact);
  const topologyVectorRepeatCount = repeatedCount(topologyVector);
  const openingTopologyRepeatCount = repeatedCount(openingTopology);
  const objectRelationRepeatCount = repeatedCount(objectRelation);
  const familyVectorRepeatCount = repeatedCount(familyVector);
  const answerPatternRepeatCount = repeatedCount(answerPattern);
  const nearDuplicateCount =
    topologyVectorRepeatCount +
    openingTopologyRepeatCount +
    objectRelationRepeatCount +
    familyVectorRepeatCount +
    answerPatternRepeatCount +
    examinerIntentNearRepeatCount +
    repeatedCount(operation);
  const duplicateRiskScore = Math.max(
    0,
    Math.round(
      100 -
        exactDuplicateCount * 30 -
        topologyVectorRepeatCount * 8 -
        openingTopologyRepeatCount * 10 -
        objectRelationRepeatCount * 12 -
        familyVectorRepeatCount * 8 -
        answerPatternRepeatCount * 5 -
        examinerIntentNearRepeatCount * 4,
    ),
  );

  return {
    exactDuplicateCount,
    nearDuplicateCount,
    topologyVectorRepeatCount,
    openingTopologyRepeatCount,
    objectRelationRepeatCount,
    familyVectorRepeatCount,
    answerPatternRepeatCount,
    examinerIntentNearRepeatCount,
    duplicateRiskScore,
  };
}

export function validateBatchDuplicates(
  questions: readonly FormulaQuestion[],
): ValidationResult & { metrics: BatchDuplicateMetrics } {
  const metrics = createBatchDuplicateMetrics(questions);
  const limit = Math.max(1, Math.floor(questions.length * 0.04));
  const issues = [
    ...issueFor("Exact duplicate questions", metrics.exactDuplicateCount, 0),
    ...issueFor(
      "Topology plus percentage-vector repeats",
      metrics.topologyVectorRepeatCount,
      limit,
    ),
    ...issueFor(
      "Same opening plus same topology repeats",
      metrics.openingTopologyRepeatCount,
      0,
    ),
    ...issueFor(
      "Same semantic object plus same percentage relation repeats",
      metrics.objectRelationRepeatCount,
      limit,
    ),
    ...issueFor(
      "Same family plus percentage-vector repeats",
      metrics.familyVectorRepeatCount,
      limit,
    ),
    ...issueFor(
      "Answer-pattern repeats",
      metrics.answerPatternRepeatCount,
      Math.max(2, limit),
    ),
    ...issueFor(
      "Examiner intent repeated consecutively",
      metrics.examinerIntentNearRepeatCount,
      Math.max(1, limit),
    ),
  ];

  return {
    valid: issues.length === 0,
    issues,
    metrics,
  };
}
