import type { KnowledgeFact, KnowledgeFactSource } from "../types";
import { COM001_ALL_SOURCE_AUTHORITIES } from "./com001-source-authority-extension";

function source(sourceId: string, locator: string): KnowledgeFactSource {
  const authority = COM001_ALL_SOURCE_AUTHORITIES.find((entry) => entry.sourceId === sourceId);
  if (!authority) throw new Error(`Unknown COM-001 source authority ${sourceId}`);
  return {
    sourceId: authority.sourceId,
    sourceType: "reference",
    title: authority.title,
    url: authority.url,
    locator,
  };
}

function rankFact(
  id: string,
  label: string,
  rank: number,
  sourceId: string,
): KnowledgeFact {
  return {
    factId: `com001-${id}-hierarchy-rank`,
    entityId: `computer:${id}`,
    subject: "Computer Awareness",
    chapterId: "COM-001",
    cpId: "COM-001-CP-DISCOVERY",
    relation: "memory_hierarchy_rank",
    entity: { canonicalName: label, label: { en: label } },
    value: { kind: "number", value: rank, unit: "broad-hierarchy-position" },
    contextGroupId: "broad-memory-hierarchy",
    distractorGroupIds: ["memory-hierarchy-order"],
    difficulty: "Medium",
    examTags: ["SSC", "BANKING", "PUNJAB_STATE"],
    tags: ["hierarchy", "speed", "proximity"],
    source: source(sourceId, `${label} broad memory/storage hierarchy position`),
    review: { status: "REVIEW_REQUIRED", confidence: 0.8 },
    freshness: { class: "IMMUTABLE" },
  };
}

export const COM001_HIERARCHY_CANDIDATES: KnowledgeFact[] = [
  rankFact("cpu-registers", "CPU registers", 1, "INTEL-MEMORY-HIERARCHY-2007"),
  rankFact("cpu-cache", "Cache memory", 2, "INTEL-MEMORY-HIERARCHY-2007"),
  rankFact("ram", "Main memory (RAM)", 3, "INTEL-MEMORY-HIERARCHY-2007"),
  rankFact("secondary-storage", "Secondary storage", 4, "INTEL-PERSISTENT-MEMORY-VOLATILE-TIERS"),
];
