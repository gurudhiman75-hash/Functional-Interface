import type { KnowledgeFact, KnowledgeFactSource } from "../types";
import { COM002_SOURCE_AUTHORITIES } from "./com002-source-manifest";
import { COM002_SOURCE_AUTHORITY_EXTENSION } from "./com002-source-authority-extension";

const ALL_AUTHORITIES = [...COM002_SOURCE_AUTHORITIES, ...COM002_SOURCE_AUTHORITY_EXTENSION];

function source(sourceId: string, locator: string): KnowledgeFactSource {
  const authority = ALL_AUTHORITIES.find((entry) => entry.sourceId === sourceId);
  if (!authority) throw new Error(`Unknown COM-002 source authority ${sourceId}`);
  return {
    sourceId: authority.sourceId,
    sourceType:
      authority.authorityClass === "OFFICIAL_CURRICULUM" || authority.authorityClass === "GOVERNMENT_REFERENCE"
        ? "textbook"
        : "reference",
    title: authority.title,
    url: authority.url,
    locator,
  };
}

function fact(input: {
  factId: string;
  entityId: string;
  relation: string;
  entity: string;
  value: string;
  contextGroupId: string;
  sourceId: string;
  locator: string;
  tags: string[];
  slowMutable?: boolean;
}): KnowledgeFact {
  return {
    factId: input.factId,
    entityId: input.entityId,
    subject: "Computer Awareness",
    chapterId: "COM-002",
    cpId: "COM-002-CP-001",
    relation: input.relation,
    entity: { canonicalName: input.entity, label: { en: input.entity } },
    value: { kind: "text", text: { en: input.value } },
    contextGroupId: input.contextGroupId,
    distractorGroupIds: [input.contextGroupId],
    difficulty: "Medium",
    examTags: ["SSC", "BANKING", "PUNJAB_STATE"],
    tags: input.tags,
    source: source(input.sourceId, input.locator),
    review: { status: "REVIEW_REQUIRED", confidence: 0.82 },
    freshness: input.slowMutable
      ? { class: "SLOW_MUTABLE", lastVerifiedAt: "2026-08-26" }
      : { class: "IMMUTABLE" },
  };
}

export const COM002_CANDIDATE_FACT_EXTENSION2: KnowledgeFact[] = [
  fact({
    factId: "com002-process-scheduler-role",
    entityId: "computer:os-component:process-scheduler",
    relation: "component_role",
    entity: "Process scheduler",
    value: "allocates CPU time to processes and coordinates process execution",
    contextGroupId: "os-component-role",
    sourceId: "IBM-OPERATING-SYSTEMS-2025",
    locator: "Operating-system components: process scheduler",
    tags: ["operating-system", "process-scheduler", "CPU"],
  }),
  fact({
    factId: "com002-memory-manager-role",
    entityId: "computer:os-component:memory-manager",
    relation: "component_role",
    entity: "Memory manager",
    value: "allocates and reallocates memory to processes",
    contextGroupId: "os-component-role",
    sourceId: "IBM-OPERATING-SYSTEMS-2025",
    locator: "Operating-system components: memory manager",
    tags: ["operating-system", "memory-manager", "memory"],
  }),
  fact({
    factId: "com002-file-system-manager-role",
    entityId: "computer:os-component:file-system-manager",
    relation: "component_role",
    entity: "File system manager",
    value: "organizes and retrieves files while managing file-system access",
    contextGroupId: "os-component-role",
    sourceId: "IBM-OPERATING-SYSTEMS-2025",
    locator: "Operating-system components: file system manager",
    tags: ["operating-system", "file-system-manager", "files"],
  }),
  fact({
    factId: "com002-sleep-power-state",
    entityId: "computer:system-action:sleep",
    relation: "system_start_stop_meaning",
    entity: "Sleep",
    value: "uses very little power and allows the PC to resume quickly",
    contextGroupId: "system-start-stop",
    sourceId: "MICROSOFT-WINDOWS-SHUTDOWN-2026",
    locator: "Sleep power-state description",
    tags: ["Windows", "sleep", "power"],
    slowMutable: true,
  }),
  fact({
    factId: "com002-hibernate-power-state",
    entityId: "computer:system-action:hibernate",
    relation: "system_start_stop_meaning",
    entity: "Hibernate",
    value: "saves the current session state and uses less power than sleep until the PC resumes",
    contextGroupId: "system-start-stop",
    sourceId: "MICROSOFT-WINDOWS-SHUTDOWN-2026",
    locator: "Hibernate power-state description",
    tags: ["Windows", "hibernate", "power"],
    slowMutable: true,
  }),
];

export function auditCom002CandidateCorpusExtension2() {
  const issues: string[] = [];
  const ids = new Set<string>();
  for (const candidate of COM002_CANDIDATE_FACT_EXTENSION2) {
    if (ids.has(candidate.factId)) issues.push(`DUPLICATE_FACT_ID:${candidate.factId}`);
    ids.add(candidate.factId);
    if (candidate.review.status !== "REVIEW_REQUIRED") issues.push(`PREMATURE_APPROVAL:${candidate.factId}`);
    if (candidate.chapterId !== "COM-002" || candidate.cpId !== "COM-002-CP-001") {
      issues.push(`OWNERSHIP_MISMATCH:${candidate.factId}`);
    }
  }
  return {
    valid: issues.length === 0,
    factCount: COM002_CANDIDATE_FACT_EXTENSION2.length,
    productionEligible: false,
    issues,
  };
}
