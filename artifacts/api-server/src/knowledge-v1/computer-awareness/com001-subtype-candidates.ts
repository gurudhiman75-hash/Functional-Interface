import type { KnowledgeFact, KnowledgeFactSource } from "../types";
import { COM001_ALL_SOURCE_AUTHORITIES } from "./com001-source-authority-extension";

function source(sourceId: string, locator: string): KnowledgeFactSource {
  const authority = COM001_ALL_SOURCE_AUTHORITIES.find((entry) => entry.sourceId === sourceId);
  if (!authority) throw new Error(`Unknown COM-001 source authority ${sourceId}`);
  return {
    sourceId: authority.sourceId,
    sourceType: authority.authorityClass === "STANDARD" ? "standard" : "reference",
    title: authority.title,
    url: authority.url,
    locator,
  };
}

function subtypeFact(
  id: string,
  label: string,
  parentId: string,
  parentLabel: string,
  contextGroupId: string,
  distractorGroupId: string,
  sourceId: string,
): KnowledgeFact {
  return {
    factId: `com001-${id}-subtype`,
    entityId: `computer:${id}`,
    subject: "Computer Awareness",
    chapterId: "COM-001",
    cpId: "COM-001-CP-DISCOVERY",
    relation: "is_subtype_of",
    entity: { canonicalName: label, label: { en: label } },
    value: {
      kind: "entity_ref",
      entityId: `computer-class:${parentId}`,
      label: { en: parentLabel },
    },
    contextGroupId,
    distractorGroupIds: [distractorGroupId],
    difficulty: "Medium",
    examTags: ["SSC", "BANKING", "PUNJAB_STATE"],
    tags: ["subtype", parentId],
    source: source(sourceId, `${label} family/type membership`),
    review: { status: "REVIEW_REQUIRED", confidence: 0.8 },
    freshness: { class: "IMMUTABLE" },
  };
}

export const COM001_SUBTYPE_CANDIDATES: KnowledgeFact[] = [
  subtypeFact("dram", "DRAM", "ram", "RAM", "ram-subtypes", "memory-family-types", "TECHTARGET-COMPUTER-MEMORY-2025"),
  subtypeFact("sram", "SRAM", "ram", "RAM", "ram-subtypes", "memory-family-types", "TECHTARGET-COMPUTER-MEMORY-2025"),
  subtypeFact("prom", "PROM", "rom", "ROM", "rom-subtypes", "memory-family-types", "TECHTARGET-ROM-2025"),
  subtypeFact("eprom", "EPROM", "rom", "ROM", "rom-subtypes", "memory-family-types", "TECHTARGET-ROM-2025"),
  subtypeFact("eeprom", "EEPROM", "rom", "ROM", "rom-subtypes", "memory-family-types", "IBM-EEPROM-2026"),
  subtypeFact("hdd", "HDD", "magnetic-storage", "magnetic storage", "storage-technology-subtypes", "storage-technology-types", "IBM-DATA-STORAGE-2026"),
  subtypeFact("floppy", "Floppy disk", "magnetic-storage", "magnetic storage", "storage-technology-subtypes", "storage-technology-types", "IBM-FLOPPY-HISTORY"),
  subtypeFact("cd", "CD", "optical-storage", "optical storage", "storage-technology-subtypes", "storage-technology-types", "IBM-DATA-STORAGE-2026"),
  subtypeFact("dvd", "DVD", "optical-storage", "optical storage", "storage-technology-subtypes", "storage-technology-types", "IBM-DATA-STORAGE-2026"),
  subtypeFact("ssd", "SSD", "solid-state-storage", "solid-state storage", "storage-technology-subtypes", "storage-technology-types", "IBM-FLASH-VS-SSD-2025"),
  subtypeFact("sd-card", "SD memory card", "solid-state-storage", "solid-state storage", "storage-technology-subtypes", "storage-technology-types", "KINGSTON-SD-MICROSD-CARDS"),
];
