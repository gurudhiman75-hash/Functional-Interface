import type { KnowledgeFact } from "../types";
import { COM002_CANDIDATE_FACTS } from "./com002-candidate-corpus";
import { COM002_CANDIDATE_FACT_EXTENSION } from "./com002-candidate-corpus-extension";
import { COM002_CANDIDATE_FACT_EXTENSION2 } from "./com002-candidate-corpus-extension2";
import { COM002_CANDIDATE_FACT_EXTENSION3 } from "./com002-candidate-corpus-extension3";
import { COM002_PERMANENT_QLS } from "./com002-permanent-ql-allocation";

export const COM002_ALL_CANDIDATE_FACTS: KnowledgeFact[] = [
  ...COM002_CANDIDATE_FACTS,
  ...COM002_CANDIDATE_FACT_EXTENSION,
  ...COM002_CANDIDATE_FACT_EXTENSION2,
  ...COM002_CANDIDATE_FACT_EXTENSION3,
];

type CoverageRule = {
  qlId: string;
  minimumFactCount: number;
  minimumEntityCount: number;
  select: (fact: KnowledgeFact) => boolean;
};

const COVERAGE_RULES: CoverageRule[] = [
  { qlId: "COM-002-QL-001", minimumFactCount: 5, minimumEntityCount: 1, select: (fact) => ["has_primary_role", "manages_resource"].includes(fact.relation) },
  { qlId: "COM-002-QL-002", minimumFactCount: 12, minimumEntityCount: 6, select: (fact) => ["software_classification", "license_class", "platform_class"].includes(fact.relation) },
  { qlId: "COM-002-QL-003", minimumFactCount: 11, minimumEntityCount: 10, select: (fact) => fact.relation === "os_type_property" },
  { qlId: "COM-002-QL-004", minimumFactCount: 6, minimumEntityCount: 5, select: (fact) => fact.relation === "component_role" },
  { qlId: "COM-002-QL-005", minimumFactCount: 2, minimumEntityCount: 2, select: (fact) => fact.relation === "interface_property" },
  { qlId: "COM-002-QL-006", minimumFactCount: 5, minimumEntityCount: 5, select: (fact) => fact.relation === "system_start_stop_meaning" },
  { qlId: "COM-002-QL-007", minimumFactCount: 9, minimumEntityCount: 9, select: (fact) => ["ui_component_function", "settings_task"].includes(fact.relation) },
  { qlId: "COM-002-QL-008", minimumFactCount: 6, minimumEntityCount: 4, select: (fact) => ["file-explorer-purpose", "file-explorer-view-properties", "file-folder-path-concepts"].includes(fact.contextGroupId) },
  { qlId: "COM-002-QL-009", minimumFactCount: 11, minimumEntityCount: 10, select: (fact) => ["general-file-extensions", "file-extension-concept"].includes(fact.contextGroupId) },
  { qlId: "COM-002-QL-010", minimumFactCount: 5, minimumEntityCount: 5, select: (fact) => fact.relation === "file_operation_effect" },
  { qlId: "COM-002-QL-011", minimumFactCount: 4, minimumEntityCount: 4, select: (fact) => ["delete_behavior", "delete_behavior_caveat", "delete_recovery_action"].includes(fact.relation) },
  { qlId: "COM-002-QL-012", minimumFactCount: 9, minimumEntityCount: 9, select: (fact) => fact.relation === "shortcut_action" },
  { qlId: "COM-002-QL-013", minimumFactCount: 60, minimumEntityCount: 40, select: () => true },
];

export function auditCom002CorpusCoverage() {
  const issues: string[] = [];
  const allIds = new Set<string>();
  for (const fact of COM002_ALL_CANDIDATE_FACTS) {
    if (allIds.has(fact.factId)) issues.push(`DUPLICATE_FACT_ID_ACROSS_CORPUS:${fact.factId}`);
    allIds.add(fact.factId);
    if (fact.review.status !== "REVIEW_REQUIRED") issues.push(`NON_REVIEW_CANDIDATE:${fact.factId}`);
    if (fact.chapterId !== "COM-002") issues.push(`CHAPTER_OWNERSHIP_DRIFT:${fact.factId}:${fact.chapterId}`);
    if (/dos|matching/i.test(`${fact.factId} ${fact.tags.join(" ")}`)) issues.push(`HELD_TASK_LEAK:${fact.factId}`);
  }

  const permanentQlIds = COM002_PERMANENT_QLS.map((ql) => ql.qlId).sort();
  const ruleQlIds = COVERAGE_RULES.map((rule) => rule.qlId).sort();
  if (JSON.stringify(permanentQlIds) !== JSON.stringify(ruleQlIds)) issues.push("COVERAGE_RULES_DO_NOT_MATCH_PERMANENT_QLS");

  const coverage = COVERAGE_RULES.map((rule) => {
    const facts = COM002_ALL_CANDIDATE_FACTS.filter(rule.select);
    const entities = new Set(facts.map((fact) => fact.entityId));
    const cpIds = new Set(facts.map((fact) => fact.cpId));
    if (facts.length < rule.minimumFactCount) issues.push(`THIN_QL_FACT_COVERAGE:${rule.qlId}:${facts.length}<${rule.minimumFactCount}`);
    if (entities.size < rule.minimumEntityCount) issues.push(`THIN_QL_ENTITY_COVERAGE:${rule.qlId}:${entities.size}<${rule.minimumEntityCount}`);
    if (rule.qlId === "COM-002-QL-013" && cpIds.size < 2) issues.push("MULTI_STATEMENT_CORPUS_MUST_SPAN_BOTH_CPS");
    return { qlId: rule.qlId, factCount: facts.length, entityCount: entities.size, cpIds: [...cpIds].sort() };
  });

  const requiredGapClosures = [
    "com002-restart-reboot", "com002-shutdown-turn-off", "com002-recycle-bin-restore",
    "com002-linux-classification", "com002-macos-classification",
    "com002-multi-user-os-property", "com002-multitasking-os-property", "com002-single-tasking-os-property", "com002-time-sharing-os-property",
    "com002-embedded-os-property", "com002-distributed-os-property", "com002-network-os-property",
    "com002-process-scheduler-role", "com002-memory-manager-role", "com002-file-system-manager-role", "com002-file-concept",
  ];
  for (const factId of requiredGapClosures) if (!allIds.has(factId)) issues.push(`MISSING_GAP_CLOSURE_FACT:${factId}`);

  return {
    valid: issues.length === 0,
    factCount: COM002_ALL_CANDIDATE_FACTS.length,
    permanentQlCount: COM002_PERMANENT_QLS.length,
    coverage,
    status: issues.length === 0 ? "READY_FOR_EDITORIAL_REVIEW" as const : "BLOCKED" as const,
    productionEligible: false,
    issues,
  };
}
