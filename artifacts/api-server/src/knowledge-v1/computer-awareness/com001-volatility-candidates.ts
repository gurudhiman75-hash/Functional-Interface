import type { KnowledgeFact, KnowledgeFactSource } from "../types";
import { COM001_SOURCE_AUTHORITIES } from "./com001-source-manifest";

function source(sourceId: string, locator: string): KnowledgeFactSource {
  const authority = COM001_SOURCE_AUTHORITIES.find((entry) => entry.sourceId === sourceId);
  if (!authority) throw new Error(`Unknown COM-001 source authority ${sourceId}`);
  return {
    sourceId: authority.sourceId,
    sourceType: "reference",
    title: authority.title,
    url: authority.url,
    locator,
  };
}

function volatilityFact(
  id: string,
  label: string,
  value: "volatile" | "non-volatile",
  sourceId: string,
  locator: string,
): KnowledgeFact {
  return {
    factId: `com001-${id}-volatility`,
    entityId: `computer:${id}`,
    subject: "Computer Awareness",
    chapterId: "COM-001",
    cpId: "COM-001-CP-DISCOVERY",
    relation: "has_volatility",
    entity: { canonicalName: label, label: { en: label } },
    value: { kind: "text", text: { en: value } },
    contextGroupId: "memory-volatility",
    distractorGroupIds: ["memory-volatility-classification"],
    difficulty: "Medium",
    examTags: ["SSC", "BANKING", "PUNJAB_STATE"],
    tags: ["memory", value],
    source: source(sourceId, locator),
    review: { status: "REVIEW_REQUIRED", confidence: 0.8 },
    freshness: { class: "IMMUTABLE" },
  };
}

export const COM001_VOLATILITY_CANDIDATES: KnowledgeFact[] = [
  volatilityFact(
    "rom",
    "ROM",
    "non-volatile",
    "TECHTARGET-ROM-2025",
    "ROM-family memory is non-volatile",
  ),
  volatilityFact(
    "prom",
    "PROM",
    "non-volatile",
    "TECHTARGET-ROM-2025",
    "PROM belongs to the non-volatile ROM family",
  ),
  volatilityFact(
    "eprom",
    "EPROM",
    "non-volatile",
    "TECHTARGET-ROM-2025",
    "EPROM belongs to the non-volatile ROM family",
  ),
  volatilityFact(
    "eeprom",
    "EEPROM",
    "non-volatile",
    "IBM-EEPROM-2026",
    "EEPROM retains data when power is off",
  ),
  volatilityFact(
    "cpu-cache",
    "Cache memory",
    "volatile",
    "INTEL-PERSISTENT-MEMORY-VOLATILE-TIERS",
    "Cache state remains volatile",
  ),
  volatilityFact(
    "cpu-registers",
    "CPU registers",
    "volatile",
    "INTEL-PERSISTENT-MEMORY-VOLATILE-TIERS",
    "Register state remains volatile",
  ),
];
