import type { KnowledgeFact } from "../types";
import { validateKnowledgeFactEligibility } from "../eligibility";

export type Com001CorpusRequirement = {
  requirementId: string;
  relationFamily: string;
  requiredRelations: string[];
  minimumEligibleFacts: number;
  minimumDistinctEntities: number;
  minimumDistinctAnswers: number;
  minimumContextGroups: number;
  minimumDistractorGroups: number;
  requiredEntityHints: string[];
  notes: string[];
};

/**
 * Readiness thresholds for COM-001 Memory & Storage discovery.
 *
 * These are corpus sufficiency gates, not QL definitions. They deliberately
 * require more breadth than a four-option MCQ needs so generation does not
 * collapse into RAM/ROM repetition.
 */
export const COM001_CORPUS_REQUIREMENTS: Com001CorpusRequirement[] = [
  {
    requirementId: "MEM-CORPUS-001",
    relationFamily: "volatility",
    requiredRelations: ["has_volatility"],
    minimumEligibleFacts: 8,
    minimumDistinctEntities: 8,
    minimumDistinctAnswers: 2,
    minimumContextGroups: 1,
    minimumDistractorGroups: 1,
    requiredEntityHints: ["RAM", "ROM", "cache", "register", "flash"],
    notes: [
      "Both volatile and non-volatile values must be represented.",
      "Do not use SSD/HDD as the only non-volatile contrast pool.",
    ],
  },
  {
    requirementId: "MEM-CORPUS-002",
    relationFamily: "memory-layer-classification",
    requiredRelations: ["classified_as_memory_layer"],
    minimumEligibleFacts: 10,
    minimumDistinctEntities: 10,
    minimumDistinctAnswers: 4,
    minimumContextGroups: 1,
    minimumDistractorGroups: 2,
    requiredEntityHints: ["register", "cache", "RAM", "ROM", "HDD", "SSD"],
    notes: [
      "Must cover register/cache/primary/secondary categories rather than binary primary-vs-secondary only.",
    ],
  },
  {
    requirementId: "MEM-CORPUS-003",
    relationFamily: "function-purpose",
    requiredRelations: ["has_primary_function"],
    minimumEligibleFacts: 10,
    minimumDistinctEntities: 10,
    minimumDistinctAnswers: 8,
    minimumContextGroups: 2,
    minimumDistractorGroups: 2,
    requiredEntityHints: ["cache", "RAM", "ROM", "HDD", "SSD"],
    notes: [
      "Function values should be concise canonical propositions, not copied textbook paragraphs.",
    ],
  },
  {
    requirementId: "MEM-CORPUS-004",
    relationFamily: "subtype-membership",
    requiredRelations: ["is_subtype_of"],
    minimumEligibleFacts: 10,
    minimumDistinctEntities: 10,
    minimumDistinctAnswers: 3,
    minimumContextGroups: 2,
    minimumDistractorGroups: 2,
    requiredEntityHints: ["SRAM", "DRAM", "PROM", "EPROM", "EEPROM"],
    notes: [
      "Do not expose subtype trivia until PYQ/source evidence supports awareness-exam ownership.",
    ],
  },
  {
    requirementId: "MEM-CORPUS-005",
    relationFamily: "storage-medium",
    requiredRelations: ["uses_storage_medium"],
    minimumEligibleFacts: 9,
    minimumDistinctEntities: 9,
    minimumDistinctAnswers: 3,
    minimumContextGroups: 2,
    minimumDistractorGroups: 2,
    requiredEntityHints: ["HDD", "magnetic tape", "CD", "DVD", "SSD", "USB"],
    notes: [
      "Canonical medium categories should include magnetic, optical and solid-state where supported.",
    ],
  },
  {
    requirementId: "MEM-CORPUS-006",
    relationFamily: "memory-hierarchy-order",
    requiredRelations: ["memory_hierarchy_rank"],
    minimumEligibleFacts: 4,
    minimumDistinctEntities: 4,
    minimumDistinctAnswers: 4,
    minimumContextGroups: 1,
    minimumDistractorGroups: 1,
    requiredEntityHints: ["register", "cache", "RAM", "secondary storage"],
    notes: [
      "Only broad hierarchy classes with source-backed ordering are admissible.",
      "Specific device benchmarks must not be encoded as timeless hierarchy truth.",
    ],
  },
  {
    requirementId: "MEM-CORPUS-007",
    relationFamily: "access-method",
    requiredRelations: ["has_access_method"],
    minimumEligibleFacts: 6,
    minimumDistinctEntities: 6,
    minimumDistinctAnswers: 2,
    minimumContextGroups: 1,
    minimumDistractorGroups: 1,
    requiredEntityHints: ["RAM", "magnetic tape", "disk"],
    notes: [
      "Random/direct/sequential terminology must be normalized to the chosen exam/reference convention.",
    ],
  },
  {
    requirementId: "MEM-CORPUS-008",
    relationFamily: "backup-storage-role",
    requiredRelations: ["has_backup_role"],
    minimumEligibleFacts: 6,
    minimumDistinctEntities: 6,
    minimumDistinctAnswers: 4,
    minimumContextGroups: 1,
    minimumDistractorGroups: 1,
    requiredEntityHints: ["external", "tape", "optical", "USB"],
    notes: [
      "Distinguish durable device capability from version-specific backup recommendations.",
    ],
  },
  {
    requirementId: "MEM-CORPUS-009",
    relationFamily: "abbreviation-expansion",
    requiredRelations: ["expands_to"],
    minimumEligibleFacts: 9,
    minimumDistinctEntities: 9,
    minimumDistinctAnswers: 9,
    minimumContextGroups: 2,
    minimumDistractorGroups: 2,
    requiredEntityHints: ["RAM", "ROM", "SRAM", "DRAM", "EPROM", "EEPROM", "HDD", "SSD"],
    notes: [
      "Only exam-relevant abbreviations should enter the production pool.",
    ],
  },
  {
    requirementId: "MEM-CORPUS-010",
    relationFamily: "virtual-memory-concept",
    requiredRelations: ["has_primary_function", "uses_backing_resource"],
    minimumEligibleFacts: 4,
    minimumDistinctEntities: 4,
    minimumDistinctAnswers: 4,
    minimumContextGroups: 1,
    minimumDistractorGroups: 1,
    requiredEntityHints: ["virtual memory", "RAM", "secondary storage"],
    notes: [
      "Keep coverage at competitive-exam awareness depth; paging algorithms are out of scope here.",
    ],
  },
  {
    requirementId: "MEM-CORPUS-011",
    relationFamily: "capacity-unit-relationship",
    requiredRelations: ["capacity_unit_relation"],
    minimumEligibleFacts: 8,
    minimumDistinctEntities: 8,
    minimumDistinctAnswers: 8,
    minimumContextGroups: 1,
    minimumDistractorGroups: 1,
    requiredEntityHints: ["bit", "byte", "KB", "MB", "GB", "TB"],
    notes: [
      "Corpus must encode an explicit binary-vs-decimal convention before generation is enabled.",
    ],
  },
];

function valueKey(fact: KnowledgeFact) {
  if (fact.value.kind === "text") return `text:${fact.value.text.en.trim().toLowerCase()}`;
  if (fact.value.kind === "entity_ref") return `entity:${fact.value.entityId}`;
  if (fact.value.kind === "number") return `number:${fact.value.value}:${fact.value.unit ?? ""}`;
  if (fact.value.kind === "date") return `date:${fact.value.isoDate}`;
  return `boolean:${fact.value.value}`;
}

function entityMatchesHint(fact: KnowledgeFact, hint: string) {
  const haystack = [
    fact.entity.canonicalName,
    fact.entity.label.en,
    ...(fact.entity.aliases?.en ?? []),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(hint.toLowerCase());
}

export type Com001CorpusAuditResult = {
  ready: boolean;
  requirementId: string;
  relationFamily: string;
  eligibleFactCount: number;
  distinctEntityCount: number;
  distinctAnswerCount: number;
  contextGroupCount: number;
  distractorGroupCount: number;
  missingEntityHints: string[];
  issues: string[];
};

export function auditCom001CorpusRequirement(
  facts: readonly KnowledgeFact[],
  requirement: Com001CorpusRequirement,
  asOf: string,
): Com001CorpusAuditResult {
  const eligible = facts.filter(
    (fact) =>
      fact.subject === "Computer Awareness" &&
      fact.chapterId === "COM-001" &&
      requirement.requiredRelations.includes(fact.relation) &&
      validateKnowledgeFactEligibility(fact, { asOf }).eligible,
  );

  const entityIds = new Set(eligible.map((fact) => fact.entityId));
  const answers = new Set(eligible.map(valueKey));
  const contextGroups = new Set(eligible.map((fact) => fact.contextGroupId));
  const distractorGroups = new Set(
    eligible.flatMap((fact) => fact.distractorGroupIds ?? []),
  );
  const missingEntityHints = requirement.requiredEntityHints.filter(
    (hint) => !eligible.some((fact) => entityMatchesHint(fact, hint)),
  );

  const issues: string[] = [];
  if (eligible.length < requirement.minimumEligibleFacts) {
    issues.push(
      `ELIGIBLE_FACTS:${eligible.length}<${requirement.minimumEligibleFacts}`,
    );
  }
  if (entityIds.size < requirement.minimumDistinctEntities) {
    issues.push(
      `DISTINCT_ENTITIES:${entityIds.size}<${requirement.minimumDistinctEntities}`,
    );
  }
  if (answers.size < requirement.minimumDistinctAnswers) {
    issues.push(
      `DISTINCT_ANSWERS:${answers.size}<${requirement.minimumDistinctAnswers}`,
    );
  }
  if (contextGroups.size < requirement.minimumContextGroups) {
    issues.push(
      `CONTEXT_GROUPS:${contextGroups.size}<${requirement.minimumContextGroups}`,
    );
  }
  if (distractorGroups.size < requirement.minimumDistractorGroups) {
    issues.push(
      `DISTRACTOR_GROUPS:${distractorGroups.size}<${requirement.minimumDistractorGroups}`,
    );
  }
  if (missingEntityHints.length > 0) {
    issues.push(`MISSING_ENTITY_HINTS:${missingEntityHints.join("|")}`);
  }

  return {
    ready: issues.length === 0,
    requirementId: requirement.requirementId,
    relationFamily: requirement.relationFamily,
    eligibleFactCount: eligible.length,
    distinctEntityCount: entityIds.size,
    distinctAnswerCount: answers.size,
    contextGroupCount: contextGroups.size,
    distractorGroupCount: distractorGroups.size,
    missingEntityHints,
    issues,
  };
}

export function auditCom001Corpus(
  facts: readonly KnowledgeFact[],
  asOf: string,
) {
  const results = COM001_CORPUS_REQUIREMENTS.map((requirement) =>
    auditCom001CorpusRequirement(facts, requirement, asOf),
  );
  return {
    ready: results.every((result) => result.ready),
    passed: results.filter((result) => result.ready).length,
    total: results.length,
    results,
  };
}
