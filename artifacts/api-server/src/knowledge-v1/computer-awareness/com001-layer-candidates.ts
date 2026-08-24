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

function layerFact(
  id: string,
  label: string,
  layerId: string,
  layerLabel: string,
  sourceId: string,
): KnowledgeFact {
  return {
    factId: `com001-${id}-layer`,
    entityId: `computer:${id}`,
    subject: "Computer Awareness",
    chapterId: "COM-001",
    cpId: "COM-001-CP-DISCOVERY",
    relation: "classified_as_memory_layer",
    entity: { canonicalName: label, label: { en: label } },
    value: {
      kind: "entity_ref",
      entityId: `memory-layer:${layerId}`,
      label: { en: layerLabel },
    },
    contextGroupId: "memory-layer-classification",
    distractorGroupIds: ["memory-layer-categories", "memory-vs-storage-layers"],
    difficulty: "Medium",
    examTags: ["SSC", "BANKING", "PUNJAB_STATE"],
    tags: ["memory-layer", layerId],
    source: source(sourceId, `${label} memory-layer classification`),
    review: { status: "REVIEW_REQUIRED", confidence: 0.8 },
    freshness: { class: "IMMUTABLE" },
  };
}

export const COM001_LAYER_CANDIDATES: KnowledgeFact[] = [
  layerFact("cpu-registers", "CPU registers", "register", "register memory", "INTEL-MEMORY-HIERARCHY-2007"),
  layerFact("cpu-cache", "Cache memory", "cache", "cache memory", "INTEL-MEMORY-HIERARCHY-2007"),
  layerFact("ram", "RAM", "primary", "primary memory", "TECHTARGET-COMPUTER-MEMORY-2025"),
  layerFact("dram", "DRAM", "primary", "primary memory", "TECHTARGET-COMPUTER-MEMORY-2025"),
  // SRAM is deliberately retained as a discovery candidate only. At the
  // editorial gate it is rejected as a hard layer-classification fact because
  // SRAM is a RAM technology commonly used to implement cache, so forcing it
  // into one hierarchy bucket creates an avoidable exam ambiguity.
  layerFact("sram", "SRAM", "primary", "primary memory", "TECHTARGET-COMPUTER-MEMORY-2025"),
  layerFact("rom", "ROM", "primary", "primary memory", "TECHTARGET-COMPUTER-MEMORY-2025"),
  layerFact("hdd", "HDD", "secondary", "secondary storage", "TECHTARGET-COMPUTER-MEMORY-2025"),
  layerFact("ssd", "SSD", "secondary", "secondary storage", "TECHTARGET-COMPUTER-MEMORY-2025"),
  layerFact("usb-flash", "USB flash drive", "secondary", "secondary storage", "IBM-DATA-STORAGE-2026"),
  layerFact("magnetic-tape", "Magnetic tape", "secondary", "secondary storage", "IBM-DATA-STORAGE-2026"),
];
