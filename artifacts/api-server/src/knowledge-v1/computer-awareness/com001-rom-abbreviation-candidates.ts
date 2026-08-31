import type { KnowledgeFact, KnowledgeFactSource } from "../types";
import { COM001_SOURCE_AUTHORITIES } from "./com001-source-manifest";

function source(sourceId: string, locator: string): KnowledgeFactSource {
  const authority = COM001_SOURCE_AUTHORITIES.find((entry) => entry.sourceId === sourceId);
  if (!authority) throw new Error(`Unknown COM-001 source authority ${sourceId}`);
  return {
    sourceId: authority.sourceId,
    sourceType: authority.authorityClass === "STANDARD" ? "standard" : "reference",
    title: authority.title,
    url: authority.url,
    locator,
  };
}

function candidate(
  id: string,
  label: string,
  expansion: string,
  sourceId: string,
): KnowledgeFact {
  return {
    factId: `com001-${id}-expansion`,
    entityId: `computer:${id}-acronym`,
    subject: "Computer Awareness",
    chapterId: "COM-001",
    cpId: "COM-001-CP-DISCOVERY",
    relation: "expands_to",
    entity: { canonicalName: label, label: { en: label } },
    value: { kind: "text", text: { en: expansion } },
    contextGroupId: "rom-family-abbreviations",
    distractorGroupIds: ["rom-family-expansions"],
    difficulty: "Easy",
    examTags: ["SSC", "BANKING", "PUNJAB_STATE"],
    tags: ["abbreviation", "memory", "ROM-family"],
    source: source(sourceId, `${label} expansion`),
    review: { status: "REVIEW_REQUIRED", confidence: 0.8 },
    freshness: { class: "IMMUTABLE" },
  };
}

export const COM001_ROM_ABBREVIATION_CANDIDATES: KnowledgeFact[] = [
  candidate("rom", "ROM", "Read-Only Memory", "TECHTARGET-ROM-2025"),
  candidate("prom", "PROM", "Programmable Read-Only Memory", "TECHTARGET-ROM-2025"),
  candidate("eprom", "EPROM", "Erasable Programmable Read-Only Memory", "TECHTARGET-ROM-2025"),
  candidate(
    "eeprom",
    "EEPROM",
    "Electrically Erasable Programmable Read-Only Memory",
    "IBM-EEPROM-2026",
  ),
];
