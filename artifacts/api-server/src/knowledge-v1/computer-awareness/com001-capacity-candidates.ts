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

function fact(
  id: string,
  label: string,
  value: KnowledgeFact["value"],
  sourceId: string,
  contextGroupId: string,
): KnowledgeFact {
  return {
    factId: `com001-${id}-capacity-relation`,
    entityId: `computer:${id}`,
    subject: "Computer Awareness",
    chapterId: "COM-001",
    cpId: "COM-001-CP-DISCOVERY",
    relation: "capacity_unit_relation",
    entity: { canonicalName: label, label: { en: label } },
    value,
    contextGroupId,
    distractorGroupIds: ["capacity-unit-relations"],
    difficulty: "Medium",
    examTags: ["SSC", "BANKING", "PUNJAB_STATE"],
    tags: ["capacity", "unit-convention"],
    source: source(sourceId, `${label} canonical unit definition/relation`),
    review: { status: "REVIEW_REQUIRED", confidence: 0.8 },
    freshness: { class: "IMMUTABLE" },
  };
}

export const COM001_CAPACITY_CANDIDATES: KnowledgeFact[] = [
  fact(
    "bit",
    "1 bit",
    { kind: "text", text: { en: "one binary digit, 0 or 1" } },
    "NIST-CSRC-BIT",
    "computer-bit-byte-units",
  ),
  fact(
    "kilobyte-decimal",
    "1 kB",
    { kind: "number", value: 1_000, unit: "bytes" },
    "NIST-BINARY-PREFIXES",
    "computer-decimal-capacity-units",
  ),
  fact(
    "megabyte-decimal",
    "1 MB",
    { kind: "number", value: 1_000_000, unit: "bytes" },
    "NIST-BINARY-PREFIXES",
    "computer-decimal-capacity-units",
  ),
  fact(
    "gigabyte-decimal",
    "1 GB",
    { kind: "number", value: 1_000_000_000, unit: "bytes" },
    "NIST-BINARY-PREFIXES",
    "computer-decimal-capacity-units",
  ),
  fact(
    "terabyte-decimal",
    "1 TB",
    { kind: "number", value: 1_000_000_000_000, unit: "bytes" },
    "NIST-BINARY-PREFIXES",
    "computer-decimal-capacity-units",
  ),
];
