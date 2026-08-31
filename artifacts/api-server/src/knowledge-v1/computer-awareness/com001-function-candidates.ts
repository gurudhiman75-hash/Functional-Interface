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

function functionFact(
  id: string,
  label: string,
  functionText: string,
  contextGroupId: string,
  distractorGroupId: string,
  sourceId: string,
): KnowledgeFact {
  return {
    factId: `com001-${id}-primary-function`,
    entityId: `computer:${id}`,
    subject: "Computer Awareness",
    chapterId: "COM-001",
    cpId: "COM-001-CP-DISCOVERY",
    relation: "has_primary_function",
    entity: { canonicalName: label, label: { en: label } },
    value: { kind: "text", text: { en: functionText } },
    contextGroupId,
    distractorGroupIds: [distractorGroupId],
    difficulty: "Medium",
    examTags: ["SSC", "BANKING", "PUNJAB_STATE"],
    tags: ["function", "memory-storage"],
    source: source(sourceId, `${label} defining function`),
    review: { status: "REVIEW_REQUIRED", confidence: 0.8 },
    freshness: { class: "IMMUTABLE" },
  };
}

export const COM001_FUNCTION_CANDIDATES: KnowledgeFact[] = [
  functionFact(
    "cpu-registers",
    "CPU registers",
    "hold data needed for immediate processor operations",
    "processor-near-memory-functions",
    "processor-memory-functions",
    "IBM-PRIMARY-STORAGE-2024",
  ),
  functionFact(
    "cpu-cache",
    "Cache memory",
    "keeps frequently used data closer to the processor for faster access",
    "processor-near-memory-functions",
    "processor-memory-functions",
    "TECHTARGET-COMPUTER-MEMORY-2025",
  ),
  functionFact(
    "ram",
    "RAM",
    "temporarily holds active programs and data for quick processor access",
    "working-memory-functions",
    "working-memory-functions",
    "TECHTARGET-COMPUTER-MEMORY-2025",
  ),
  functionFact(
    "dram",
    "DRAM",
    "serves as volatile main working memory for active program data",
    "working-memory-functions",
    "working-memory-functions",
    "TECHTARGET-COMPUTER-MEMORY-2025",
  ),
  functionFact(
    "rom",
    "ROM",
    "stores persistent startup or firmware instructions",
    "rom-family-functions",
    "rom-family-functions",
    "TECHTARGET-ROM-2025",
  ),
  functionFact(
    "prom",
    "PROM",
    "provides read-only memory that can be programmed once after manufacture",
    "rom-family-functions",
    "rom-family-functions",
    "TECHTARGET-ROM-2025",
  ),
  functionFact(
    "eprom",
    "EPROM",
    "provides non-volatile program storage that can be erased with ultraviolet light and reused",
    "rom-family-functions",
    "rom-family-functions",
    "TECHTARGET-ROM-2025",
  ),
  functionFact(
    "eeprom",
    "EEPROM",
    "stores non-volatile data that can be electrically erased and reprogrammed",
    "rom-family-functions",
    "rom-family-functions",
    "IBM-EEPROM-2026",
  ),
  functionFact(
    "hdd",
    "HDD",
    "provides persistent magnetic storage for files and applications",
    "secondary-storage-functions",
    "secondary-storage-functions",
    "IBM-DATA-STORAGE-2026",
  ),
  functionFact(
    "ssd",
    "SSD",
    "provides persistent solid-state storage without mechanical moving parts",
    "secondary-storage-functions",
    "secondary-storage-functions",
    "IBM-FLASH-VS-SSD-2025",
  ),
  functionFact(
    "magnetic-tape",
    "Magnetic tape",
    "provides removable sequential storage commonly used for long-term data retention and backup",
    "secondary-storage-functions",
    "secondary-storage-functions",
    "IBM-DATA-STORAGE-2026",
  ),
];
