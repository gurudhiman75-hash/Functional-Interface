import { COM004_CANDIDATE_FACTS, auditCom004CandidateFactCorpus } from "./com004-candidate-fact-corpus";
import { COM004_PROVISIONAL_LEARNER_TASKS } from "./com004-merge-split-audit";
import { COM004_SOURCE_AUTHORITIES } from "./com004-source-manifest";
import { COM004_SOURCE_AUTHORITY_EXTENSION } from "./com004-source-authority-extension";

export type Com004TaskCoverageRule = {
  taskId: string;
  minimumFactCount: number;
  minimumEntityCount: number;
  minimumSourceCount: number;
};

export const COM004_TASK_COVERAGE_RULES: readonly Com004TaskCoverageRule[] = [
  { taskId: "COM004-PT-001", minimumFactCount: 6, minimumEntityCount: 6, minimumSourceCount: 1 },
  { taskId: "COM004-PT-002", minimumFactCount: 6, minimumEntityCount: 6, minimumSourceCount: 1 },
  { taskId: "COM004-PT-003", minimumFactCount: 2, minimumEntityCount: 2, minimumSourceCount: 1 },
  { taskId: "COM004-PT-004", minimumFactCount: 4, minimumEntityCount: 4, minimumSourceCount: 1 },
  { taskId: "COM004-PT-005", minimumFactCount: 5, minimumEntityCount: 4, minimumSourceCount: 1 },
  { taskId: "COM004-PT-006", minimumFactCount: 4, minimumEntityCount: 3, minimumSourceCount: 2 },
  { taskId: "COM004-PT-007", minimumFactCount: 7, minimumEntityCount: 7, minimumSourceCount: 1 },
  { taskId: "COM004-PT-008", minimumFactCount: 6, minimumEntityCount: 6, minimumSourceCount: 1 },
  { taskId: "COM004-PT-009", minimumFactCount: 5, minimumEntityCount: 5, minimumSourceCount: 1 },
  { taskId: "COM004-PT-010", minimumFactCount: 6, minimumEntityCount: 3, minimumSourceCount: 4 },
  { taskId: "COM004-PT-011", minimumFactCount: 4, minimumEntityCount: 4, minimumSourceCount: 1 },
  { taskId: "COM004-PT-012", minimumFactCount: 4, minimumEntityCount: 4, minimumSourceCount: 1 },
  { taskId: "COM004-PT-013", minimumFactCount: 4, minimumEntityCount: 2, minimumSourceCount: 2 },
  { taskId: "COM004-PT-014", minimumFactCount: 4, minimumEntityCount: 3, minimumSourceCount: 1 },
  { taskId: "COM004-PT-015", minimumFactCount: 6, minimumEntityCount: 5, minimumSourceCount: 2 },
  { taskId: "COM004-PT-016", minimumFactCount: 7, minimumEntityCount: 6, minimumSourceCount: 3 },
  { taskId: "COM004-PT-017", minimumFactCount: 4, minimumEntityCount: 4, minimumSourceCount: 2 },
  { taskId: "COM004-PT-018", minimumFactCount: 9, minimumEntityCount: 9, minimumSourceCount: 4 },
  { taskId: "COM004-PT-019", minimumFactCount: 7, minimumEntityCount: 7, minimumSourceCount: 2 },
] as const;

function taskIdForFact(tags: string[]): string | null {
  const tag = tags.find((entry) => entry.startsWith("provisional-task:"));
  return tag ? tag.replace("provisional-task:", "") : null;
}

export function auditCom004CorpusSaturation() {
  const issues: string[] = [];
  const factAudit = auditCom004CandidateFactCorpus();
  if (!factAudit.valid) issues.push(...factAudit.issues.map((issue) => `FACT_CORPUS:${issue}`));

  const authorities = [...COM004_SOURCE_AUTHORITIES, ...COM004_SOURCE_AUTHORITY_EXTENSION];
  const authorityById = new Map(authorities.map((entry) => [entry.sourceId, entry]));
  const provisionalTasks = COM004_PROVISIONAL_LEARNER_TASKS.filter((task) => task.disposition === "PROVISIONAL_TASK");
  const heldTasks = COM004_PROVISIONAL_LEARNER_TASKS.filter((task) => task.disposition === "HOLD");
  const provisionalTaskIds = provisionalTasks.map((task) => task.provisionalTaskId).sort();
  const coverageRuleTaskIds = COM004_TASK_COVERAGE_RULES.map((rule) => rule.taskId).sort();

  if (JSON.stringify(provisionalTaskIds) !== JSON.stringify(coverageRuleTaskIds)) {
    issues.push("COVERAGE_RULES_DO_NOT_MATCH_PROVISIONAL_TASKS");
  }

  const coverage = COM004_TASK_COVERAGE_RULES.map((rule) => {
    const facts = COM004_CANDIDATE_FACTS.filter((fact) => taskIdForFact(fact.tags) === rule.taskId);
    const entities = new Set(facts.map((fact) => fact.entityId));
    const sources = new Set(facts.map((fact) => fact.source.sourceId));
    const relations = new Set(facts.map((fact) => fact.relation));
    const cpIds = new Set(facts.map((fact) => fact.cpId));
    const versionScopedFacts = facts.filter((fact) => fact.tags.includes("version-scoped"));

    if (facts.length < rule.minimumFactCount) issues.push(`THIN_TASK_FACT_COVERAGE:${rule.taskId}:${facts.length}<${rule.minimumFactCount}`);
    if (entities.size < rule.minimumEntityCount) issues.push(`THIN_TASK_ENTITY_COVERAGE:${rule.taskId}:${entities.size}<${rule.minimumEntityCount}`);
    if (sources.size < rule.minimumSourceCount) issues.push(`THIN_TASK_SOURCE_COVERAGE:${rule.taskId}:${sources.size}<${rule.minimumSourceCount}`);

    for (const fact of facts) {
      const authority = authorityById.get(fact.source.sourceId);
      if (!authority) issues.push(`UNKNOWN_TASK_SOURCE:${rule.taskId}:${fact.factId}`);
      if (authority?.authorityClass === "PYQ_EVIDENCE") issues.push(`PYQ_TRUTH_SOURCE_LEAK:${rule.taskId}:${fact.factId}`);
    }

    return {
      taskId: rule.taskId,
      factCount: facts.length,
      entityCount: entities.size,
      sourceCount: sources.size,
      relationCount: relations.size,
      cpIds: [...cpIds].sort(),
      versionScopedFactCount: versionScopedFacts.length,
      versionReviewRequired: versionScopedFacts.length > 0,
      saturated: facts.length >= rule.minimumFactCount && entities.size >= rule.minimumEntityCount && sources.size >= rule.minimumSourceCount,
    };
  });

  const heldTaskIds = new Set(heldTasks.map((task) => task.provisionalTaskId));
  for (const fact of COM004_CANDIDATE_FACTS) {
    const taskId = taskIdForFact(fact.tags);
    if (!taskId) issues.push(`FACT_WITHOUT_TASK:${fact.factId}`);
    if (taskId && heldTaskIds.has(taskId)) issues.push(`HELD_TASK_LEAK:${fact.factId}:${taskId}`);
    if (fact.review.status !== "REVIEW_REQUIRED") issues.push(`NON_REVIEW_CANDIDATE:${fact.factId}`);
  }

  const contextGroupCounts = Object.fromEntries(
    [...new Set(COM004_CANDIDATE_FACTS.map((fact) => fact.contextGroupId))]
      .sort()
      .map((groupId) => [groupId, new Set(COM004_CANDIDATE_FACTS.filter((fact) => fact.contextGroupId === groupId).map((fact) => fact.entityId)).size]),
  );
  const directDistractorEligibleContextGroups = Object.entries(contextGroupCounts)
    .filter(([, entityCount]) => entityCount >= 4)
    .map(([groupId]) => groupId);
  const thinDistractorContextGroups = Object.entries(contextGroupCounts)
    .filter(([, entityCount]) => entityCount < 4)
    .map(([groupId, entityCount]) => ({ groupId, entityCount }));

  const versionScopedTaskIds = coverage.filter((entry) => entry.versionReviewRequired).map((entry) => entry.taskId);
  const corpusSaturated = coverage.every((entry) => entry.saturated);

  if (!corpusSaturated) issues.push("PROVISIONAL_TASK_CORPUS_NOT_SATURATED");
  if (COM004_CANDIDATE_FACTS.length !== 100) issues.push(`UNEXPECTED_FACT_COUNT:${COM004_CANDIDATE_FACTS.length}`);
  if (coverage.length !== 19) issues.push(`UNEXPECTED_TASK_COVERAGE_COUNT:${coverage.length}`);
  if (heldTasks.length !== 2) issues.push(`UNEXPECTED_HOLD_COUNT:${heldTasks.length}`);
  if (versionScopedTaskIds.length !== 4) issues.push(`UNEXPECTED_VERSION_SCOPED_TASK_COUNT:${versionScopedTaskIds.length}`);

  return {
    valid: issues.length === 0,
    factCount: COM004_CANDIDATE_FACTS.length,
    provisionalTaskCount: provisionalTasks.length,
    heldTaskCount: heldTasks.length,
    coverage,
    corpusSaturated,
    versionScopedTaskIds,
    directDistractorEligibleContextGroups,
    thinDistractorContextGroups,
    readyForDistractorCapacityAudit: issues.length === 0 && corpusSaturated,
    permanentQlCount: 0,
    allocationReady: false,
    productionEligible: false,
    status: issues.length === 0 && corpusSaturated ? "READY_FOR_DISTRACTOR_CAPACITY_AUDIT" as const : "BLOCKED" as const,
    issues,
  };
}
