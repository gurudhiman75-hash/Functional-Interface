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

function mediumFact(
  id: string,
  label: string,
  medium: string,
  sourceId: string,
): KnowledgeFact {
  return {
    factId: `com001-${id}-medium-expansion`,
    entityId: `computer:${id}`,
    subject: "Computer Awareness",
    chapterId: "COM-001",
    cpId: "COM-001-CP-DISCOVERY",
    relation: "uses_storage_medium",
    entity: { canonicalName: label, label: { en: label } },
    value: { kind: "text", text: { en: medium } },
    contextGroupId: "removable-storage-medium-classification",
    distractorGroupIds: ["removable-storage-technologies"],
    difficulty: "Medium",
    examTags: ["SSC", "BANKING", "PUNJAB_STATE"],
    tags: ["storage", "medium", medium],
    source: source(sourceId, `${label} storage-medium classification`),
    review: { status: "REVIEW_REQUIRED", confidence: 0.8 },
    freshness: { class: "IMMUTABLE" },
  };
}

export const COM001_STORAGE_MEDIUM_EXPANSION: KnowledgeFact[] = [
  mediumFact("floppy", "Floppy disk", "magnetic", "IBM-FLOPPY-HISTORY"),
  mediumFact("sd-card", "SD memory card", "solid-state", "KINGSTON-SD-MICROSD-CARDS"),
];
