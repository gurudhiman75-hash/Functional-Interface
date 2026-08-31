import type { KnowledgeFact, KnowledgeFactSource } from "../types";
import { COM001_SOURCE_AUTHORITIES } from "./com001-source-manifest";

function source(sourceId: string, locator: string): KnowledgeFactSource {
  const authority = COM001_SOURCE_AUTHORITIES.find(
    (entry) => entry.sourceId === sourceId,
  );
  if (!authority) throw new Error(`Unknown COM-001 source authority ${sourceId}`);
  return {
    sourceId: authority.sourceId,
    sourceType:
      authority.authorityClass === "OFFICIAL_EXAM"
        ? "official"
        : authority.authorityClass === "STANDARD"
          ? "standard"
          : "reference",
    title: authority.title,
    url: authority.url,
    locator,
  };
}

function candidate(input: Omit<KnowledgeFact, "subject" | "chapterId" | "review" | "freshness">): KnowledgeFact {
  return {
    ...input,
    subject: "Computer Awareness",
    chapterId: "COM-001",
    review: {
      status: "REVIEW_REQUIRED",
      confidence: 0.8,
    },
    freshness: {
      class: "IMMUTABLE",
    },
  };
}

const memoryVolatility: KnowledgeFact[] = [
  candidate({
    factId: "com001-ram-volatility",
    entityId: "computer:ram",
    cpId: "COM-001-CP-DISCOVERY",
    relation: "has_volatility",
    entity: { canonicalName: "RAM", label: { en: "RAM" } },
    value: { kind: "text", text: { en: "volatile" } },
    contextGroupId: "memory-volatility",
    distractorGroupIds: ["memory-volatility-classification"],
    difficulty: "Easy",
    examTags: ["SSC", "BANKING", "PUNJAB_STATE"],
    tags: ["memory", "RAM", "volatile"],
    source: source("KINGSTON-COMPUTER-MEMORY", "RAM is volatile; power is required to retain data"),
  }),
  candidate({
    factId: "com001-dram-volatility",
    entityId: "computer:dram",
    cpId: "COM-001-CP-DISCOVERY",
    relation: "has_volatility",
    entity: { canonicalName: "DRAM", label: { en: "DRAM" } },
    value: { kind: "text", text: { en: "volatile" } },
    contextGroupId: "memory-volatility",
    distractorGroupIds: ["memory-volatility-classification"],
    difficulty: "Medium",
    examTags: ["SSC", "BANKING"],
    tags: ["memory", "DRAM", "volatile"],
    source: source("INTEL-EMBEDDED-MEMORY-ARCH", "Memory Architectures: SRAM and DRAM lose contents if power is lost"),
  }),
  candidate({
    factId: "com001-sram-volatility",
    entityId: "computer:sram",
    cpId: "COM-001-CP-DISCOVERY",
    relation: "has_volatility",
    entity: { canonicalName: "SRAM", label: { en: "SRAM" } },
    value: { kind: "text", text: { en: "volatile" } },
    contextGroupId: "memory-volatility",
    distractorGroupIds: ["memory-volatility-classification"],
    difficulty: "Medium",
    examTags: ["SSC", "BANKING"],
    tags: ["memory", "SRAM", "volatile"],
    source: source("INTEL-EMBEDDED-MEMORY-ARCH", "Memory Architectures: SRAM and DRAM lose contents if power is lost"),
  }),
  candidate({
    factId: "com001-flash-volatility",
    entityId: "computer:flash-memory",
    cpId: "COM-001-CP-DISCOVERY",
    relation: "has_volatility",
    entity: { canonicalName: "Flash memory", label: { en: "Flash memory" } },
    value: { kind: "text", text: { en: "non-volatile" } },
    contextGroupId: "memory-volatility",
    distractorGroupIds: ["memory-volatility-classification"],
    difficulty: "Easy",
    examTags: ["SSC", "BANKING", "PUNJAB_STATE"],
    tags: ["memory", "flash", "non-volatile"],
    source: source("IBM-FLASH-VS-SSD-2025", "Flash memory retains data without power"),
  }),
  candidate({
    factId: "com001-ssd-volatility",
    entityId: "computer:ssd",
    cpId: "COM-001-CP-DISCOVERY",
    relation: "has_volatility",
    entity: { canonicalName: "SSD", label: { en: "SSD" } },
    value: { kind: "text", text: { en: "non-volatile" } },
    contextGroupId: "memory-volatility",
    distractorGroupIds: ["memory-volatility-classification"],
    difficulty: "Easy",
    examTags: ["SSC", "BANKING", "PUNJAB_STATE"],
    tags: ["storage", "SSD", "non-volatile"],
    source: source("IBM-FLASH-VS-SSD-2025", "SSD uses non-volatile solid-state memory, typically NAND flash"),
  }),
  candidate({
    factId: "com001-hdd-volatility",
    entityId: "computer:hdd",
    cpId: "COM-001-CP-DISCOVERY",
    relation: "has_volatility",
    entity: { canonicalName: "Hard disk drive", label: { en: "HDD" } },
    value: { kind: "text", text: { en: "non-volatile" } },
    contextGroupId: "memory-volatility",
    distractorGroupIds: ["memory-volatility-classification"],
    difficulty: "Easy",
    examTags: ["SSC", "BANKING", "PUNJAB_STATE"],
    tags: ["storage", "HDD", "non-volatile"],
    source: source("IBM-DATA-STORAGE-2026", "Secondary persistent storage includes HDDs"),
  }),
];

const storageMedium: KnowledgeFact[] = [
  ["hdd", "HDD", "magnetic"],
  ["magnetic-tape", "Magnetic tape", "magnetic"],
  ["cd", "CD", "optical"],
  ["dvd", "DVD", "optical"],
  ["blu-ray", "Blu-ray Disc", "optical"],
  ["ssd", "SSD", "solid-state"],
  ["usb-flash", "USB flash drive", "solid-state"],
].map(([id, label, medium], index) =>
  candidate({
    factId: `com001-${id}-medium`,
    entityId: `computer:${id}`,
    cpId: "COM-001-CP-DISCOVERY",
    relation: "uses_storage_medium",
    entity: { canonicalName: label, label: { en: label } },
    value: { kind: "text", text: { en: medium } },
    contextGroupId: "storage-medium-classification",
    distractorGroupIds: ["magnetic-optical-solid-state"],
    difficulty: index < 5 ? "Easy" : "Medium",
    examTags: ["SSC", "BANKING", "PUNJAB_STATE"],
    tags: ["storage", "medium", medium],
    source: source(
      medium === "solid-state" ? "IBM-FLASH-VS-SSD-2025" : "IBM-DATA-STORAGE-2026",
      `${label} storage-medium classification`,
    ),
  }),
);

const expansions: KnowledgeFact[] = [
  ["ram", "RAM", "Random Access Memory", "KINGSTON-COMPUTER-MEMORY"],
  ["dram", "DRAM", "Dynamic Random Access Memory", "KINGSTON-COMPUTER-MEMORY"],
  ["sram", "SRAM", "Static Random Access Memory", "INTEL-EMBEDDED-MEMORY-ARCH"],
  ["ssd", "SSD", "Solid-State Drive", "IBM-FLASH-VS-SSD-2025"],
  ["hdd", "HDD", "Hard Disk Drive", "IBM-DATA-STORAGE-2026"],
].map(([id, label, expansion, sourceId]) =>
  candidate({
    factId: `com001-${id}-expansion`,
    entityId: `computer:${id}-acronym`,
    cpId: "COM-001-CP-DISCOVERY",
    relation: "expands_to",
    entity: { canonicalName: label, label: { en: label } },
    value: { kind: "text", text: { en: expansion } },
    contextGroupId: "memory-storage-abbreviations",
    distractorGroupIds: ["memory-storage-expansions"],
    difficulty: "Easy",
    examTags: ["SSC", "BANKING", "PUNJAB_STATE"],
    tags: ["abbreviation", "memory", "storage"],
    source: source(sourceId, `${label} expansion`),
  }),
);

const capacityUnits: KnowledgeFact[] = [
  candidate({
    factId: "com001-byte-bits",
    entityId: "computer:byte",
    cpId: "COM-001-CP-DISCOVERY",
    relation: "capacity_unit_relation",
    entity: { canonicalName: "Byte", label: { en: "1 byte" } },
    value: { kind: "number", value: 8, unit: "bits" },
    contextGroupId: "computer-capacity-units",
    distractorGroupIds: ["bit-byte-unit-relations"],
    difficulty: "Easy",
    examTags: ["SSC", "BANKING", "PUNJAB_STATE"],
    tags: ["capacity", "byte", "bit"],
    source: source("NIST-CSRC-BYTE", "Byte: a sequence of eight bits"),
  }),
  candidate({
    factId: "com001-kib-bytes",
    entityId: "computer:kibibyte",
    cpId: "COM-001-CP-DISCOVERY",
    relation: "capacity_unit_relation",
    entity: { canonicalName: "Kibibyte", label: { en: "1 KiB" } },
    value: { kind: "number", value: 1024, unit: "bytes" },
    contextGroupId: "computer-binary-capacity-units",
    distractorGroupIds: ["binary-prefix-unit-relations"],
    difficulty: "Medium",
    examTags: ["SSC", "BANKING"],
    tags: ["capacity", "KiB", "binary-prefix"],
    source: source("NIST-BINARY-PREFIXES", "1 KiB = 2^10 bytes"),
  }),
  candidate({
    factId: "com001-mib-bytes",
    entityId: "computer:mebibyte",
    cpId: "COM-001-CP-DISCOVERY",
    relation: "capacity_unit_relation",
    entity: { canonicalName: "Mebibyte", label: { en: "1 MiB" } },
    value: { kind: "number", value: 1_048_576, unit: "bytes" },
    contextGroupId: "computer-binary-capacity-units",
    distractorGroupIds: ["binary-prefix-unit-relations"],
    difficulty: "Medium",
    examTags: ["SSC", "BANKING"],
    tags: ["capacity", "MiB", "binary-prefix"],
    source: source("NIST-BINARY-PREFIXES", "1 MiB = 2^20 bytes"),
  }),
  candidate({
    factId: "com001-gib-bytes",
    entityId: "computer:gibibyte",
    cpId: "COM-001-CP-DISCOVERY",
    relation: "capacity_unit_relation",
    entity: { canonicalName: "Gibibyte", label: { en: "1 GiB" } },
    value: { kind: "number", value: 1_073_741_824, unit: "bytes" },
    contextGroupId: "computer-binary-capacity-units",
    distractorGroupIds: ["binary-prefix-unit-relations"],
    difficulty: "Medium",
    examTags: ["SSC", "BANKING"],
    tags: ["capacity", "GiB", "binary-prefix"],
    source: source("NIST-BINARY-PREFIXES", "1 GiB = 2^30 bytes"),
  }),
];

const virtualMemory: KnowledgeFact[] = [
  candidate({
    factId: "com001-windows-pagefile-purpose",
    entityId: "computer:windows-pagefile",
    cpId: "COM-001-CP-DISCOVERY",
    relation: "has_primary_function",
    entity: { canonicalName: "Windows page file", label: { en: "Windows page file" } },
    value: {
      kind: "text",
      text: { en: "extends the system commit limit and can hold paged memory data" },
    },
    contextGroupId: "virtual-memory-awareness",
    distractorGroupIds: ["memory-management-functions"],
    difficulty: "Hard",
    examTags: ["SSC"],
    tags: ["virtual-memory", "pagefile", "Windows"],
    source: source("MICROSOFT-PAGEFILE-2026", "Page-file functionality and system committed memory"),
  }),
  candidate({
    factId: "com001-windows-paging-backing-resource",
    entityId: "computer:windows-virtual-memory",
    cpId: "COM-001-CP-DISCOVERY",
    relation: "uses_backing_resource",
    entity: { canonicalName: "Windows virtual memory paging", label: { en: "Windows virtual memory paging" } },
    value: {
      kind: "text",
      text: { en: "a paging file on disk when pages are moved out of physical memory" },
    },
    contextGroupId: "virtual-memory-awareness",
    distractorGroupIds: ["memory-management-functions"],
    difficulty: "Hard",
    examTags: ["SSC"],
    tags: ["virtual-memory", "paging", "Windows"],
    source: source("MICROSOFT-VIRTUAL-ADDRESS-PHYSICAL-STORAGE", "Windows moves pages between physical memory and paging file on disk"),
  }),
];

export const COM001_MEMORY_STORAGE_CANDIDATE_FACTS: KnowledgeFact[] = [
  ...memoryVolatility,
  ...storageMedium,
  ...expansions,
  ...capacityUnits,
  ...virtualMemory,
];

export function auditCom001CandidateCorpus() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const sourceIds = new Set(COM001_SOURCE_AUTHORITIES.map((entry) => entry.sourceId));

  for (const fact of COM001_MEMORY_STORAGE_CANDIDATE_FACTS) {
    if (ids.has(fact.factId)) issues.push(`DUPLICATE_FACT_ID:${fact.factId}`);
    ids.add(fact.factId);
    if (fact.review.status !== "REVIEW_REQUIRED") {
      issues.push(`PREMATURE_APPROVAL:${fact.factId}`);
    }
    if (fact.review.reviewedAt || fact.review.reviewedBy) {
      issues.push(`CANDIDATE_HAS_REVIEWER:${fact.factId}`);
    }
    if (!sourceIds.has(fact.source.sourceId)) {
      issues.push(`UNAPPROVED_SOURCE:${fact.factId}:${fact.source.sourceId}`);
    }
    if (fact.subject !== "Computer Awareness" || fact.chapterId !== "COM-001") {
      issues.push(`OWNERSHIP_MISMATCH:${fact.factId}`);
    }
  }

  return {
    valid: issues.length === 0,
    factCount: COM001_MEMORY_STORAGE_CANDIDATE_FACTS.length,
    relationCounts: Object.fromEntries(
      [...new Set(COM001_MEMORY_STORAGE_CANDIDATE_FACTS.map((fact) => fact.relation))]
        .sort()
        .map((relation) => [
          relation,
          COM001_MEMORY_STORAGE_CANDIDATE_FACTS.filter((fact) => fact.relation === relation).length,
        ]),
    ),
    issues,
  };
}
