export type ComputerDiscoveryEvidence =
  | "OFFICIAL_SYLLABUS"
  | "LEGACY_HINT"
  | "DOMAIN_HYPOTHESIS"
  | "PYQ_REQUIRED";

export type ComputerDiscoveryCandidate = {
  candidateId: string;
  learnerTask: string;
  relationFamily: string;
  candidateMode:
    | "FORWARD_RECALL"
    | "REVERSE_RECALL"
    | "CLASSIFICATION"
    | "COMPARISON"
    | "ORDERING"
    | "STATEMENT_SET"
    | "MATCHING"
    | "LEXICAL_EXPANSION";
  objectFamilies: string[];
  surfaceVariants: string[];
  evidence: ComputerDiscoveryEvidence[];
  likelyMergeWith?: string[];
  splitIf?: string[];
  ownershipNotes?: string[];
  ambiguityRisks?: string[];
  productionState: "DISCOVERY_ONLY";
};

/**
 * Provisional learner-task inventory for COM-001 / Memory & Storage.
 *
 * These are NOT permanent QLs. They exist to drive source/PYQ discovery,
 * merge/split review, corpus design and verifier requirements.
 */
export const COM001_MEMORY_STORAGE_DISCOVERY: ComputerDiscoveryCandidate[] = [
  {
    candidateId: "MEM-DISC-001",
    learnerTask: "Identify whether a memory/storage type is volatile or non-volatile",
    relationFamily: "volatility",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["RAM", "ROM", "cache", "registers", "flash", "SSD"],
    surfaceVariants: [
      "Which of the following is volatile memory?",
      "Which memory loses its contents when power is removed?",
      "Classify the given memory as volatile/non-volatile.",
    ],
    evidence: ["OFFICIAL_SYLLABUS", "LEGACY_HINT"],
    likelyMergeWith: ["MEM-DISC-002"],
    splitIf: [
      "reverse identification proves materially different in PYQs or difficulty behavior",
    ],
    ambiguityRisks: [
      "avoid treating all modern firmware storage as traditional mask ROM",
    ],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "MEM-DISC-002",
    learnerTask: "Identify a memory/storage type from a defining volatility or retention property",
    relationFamily: "volatility",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["RAM", "ROM", "flash", "SSD"],
    surfaceVariants: [
      "Which memory retains data without power?",
      "A memory loses data when power is switched off. Identify it.",
    ],
    evidence: ["OFFICIAL_SYLLABUS", "DOMAIN_HYPOTHESIS"],
    likelyMergeWith: ["MEM-DISC-001"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "MEM-DISC-003",
    learnerTask: "Classify memory/storage as primary, secondary, cache or register-level storage",
    relationFamily: "memory-layer-classification",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["registers", "cache", "RAM", "ROM", "HDD", "SSD", "optical media"],
    surfaceVariants: [
      "Which is primary memory?",
      "Which device belongs to secondary storage?",
      "Classify the component by memory hierarchy layer.",
    ],
    evidence: ["OFFICIAL_SYLLABUS", "DOMAIN_HYPOTHESIS"],
    splitIf: [
      "register/cache hierarchy proves distinct from primary-vs-secondary classification",
    ],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "MEM-DISC-004",
    learnerTask: "Identify a memory/storage component from its hierarchy-layer description",
    relationFamily: "memory-layer-classification",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["registers", "cache", "RAM", "ROM", "HDD", "SSD"],
    surfaceVariants: [
      "Which component is closest to the CPU in the memory hierarchy?",
      "Identify the secondary-storage device from its description.",
    ],
    evidence: ["OFFICIAL_SYLLABUS", "DOMAIN_HYPOTHESIS"],
    likelyMergeWith: ["MEM-DISC-003"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "MEM-DISC-005",
    learnerTask: "Map a memory/storage component to its principal purpose or function",
    relationFamily: "function-purpose",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["registers", "cache", "RAM", "ROM", "HDD", "SSD", "backup media"],
    surfaceVariants: [
      "What is the main purpose of cache memory?",
      "RAM primarily provides which function?",
      "Which use best describes the given storage type?",
    ],
    evidence: ["OFFICIAL_SYLLABUS", "LEGACY_HINT"],
    splitIf: [
      "backup-purpose questions require a separate learner task from working-memory purpose",
    ],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "MEM-DISC-006",
    learnerTask: "Identify a component from its principal memory/storage function",
    relationFamily: "function-purpose",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["registers", "cache", "RAM", "ROM", "HDD", "SSD"],
    surfaceVariants: [
      "Which memory holds frequently used data close to the processor?",
      "Which storage type is intended for persistent mass storage?",
    ],
    evidence: ["OFFICIAL_SYLLABUS", "DOMAIN_HYPOTHESIS"],
    likelyMergeWith: ["MEM-DISC-005"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "MEM-DISC-007",
    learnerTask: "Identify subtype membership within RAM, ROM, cache or storage-media families",
    relationFamily: "subtype-membership",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["SRAM", "DRAM", "PROM", "EPROM", "EEPROM", "L1", "L2", "L3", "flash"],
    surfaceVariants: [
      "Which of the following is a type of RAM?",
      "EPROM belongs to which memory family?",
      "Which item is not a ROM-family type?",
    ],
    evidence: ["DOMAIN_HYPOTHESIS", "PYQ_REQUIRED"],
    ambiguityRisks: [
      "avoid forcing implementation details beyond awareness-exam depth",
    ],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "MEM-DISC-008",
    learnerTask: "Identify or compare the technology/medium used by a storage device",
    relationFamily: "storage-medium",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["HDD", "magnetic tape", "CD", "DVD", "Blu-ray", "SSD", "USB flash drive"],
    surfaceVariants: [
      "Which device uses magnetic storage?",
      "Which is an optical storage medium?",
      "Classify the storage device as magnetic/optical/solid-state.",
    ],
    evidence: ["OFFICIAL_SYLLABUS", "DOMAIN_HYPOTHESIS"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "MEM-DISC-009",
    learnerTask: "Identify a storage device from its medium/technology description",
    relationFamily: "storage-medium",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["HDD", "magnetic tape", "CD", "DVD", "SSD", "USB flash drive"],
    surfaceVariants: [
      "Which device stores data on magnetic platters?",
      "Identify the solid-state secondary-storage device.",
    ],
    evidence: ["OFFICIAL_SYLLABUS", "DOMAIN_HYPOTHESIS"],
    likelyMergeWith: ["MEM-DISC-008"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "MEM-DISC-010",
    learnerTask: "Order broad memory/storage layers by speed or proximity in the standard exam abstraction",
    relationFamily: "memory-hierarchy-order",
    candidateMode: "ORDERING",
    objectFamilies: ["registers", "cache", "RAM", "secondary storage"],
    surfaceVariants: [
      "Arrange the following from fastest to slowest.",
      "Which sequence correctly represents the memory hierarchy?",
    ],
    evidence: ["DOMAIN_HYPOTHESIS", "PYQ_REQUIRED"],
    ambiguityRisks: [
      "specific device generations can violate simplistic speed claims",
      "use only broad hierarchy classes with source-backed ordering",
    ],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "MEM-DISC-011",
    learnerTask: "Compare two memory/storage types on a specific canonical attribute",
    relationFamily: "attribute-comparison",
    candidateMode: "COMPARISON",
    objectFamilies: ["RAM-vs-ROM", "SRAM-vs-DRAM", "HDD-vs-SSD", "cache-vs-RAM"],
    surfaceVariants: [
      "Which statement correctly distinguishes RAM and ROM?",
      "How does SRAM differ from DRAM?",
      "Which property correctly contrasts HDD and SSD?",
    ],
    evidence: ["DOMAIN_HYPOTHESIS", "PYQ_REQUIRED"],
    splitIf: [
      "a comparison requires a multi-attribute reasoning model rather than one fact relation",
    ],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "MEM-DISC-012",
    learnerTask: "Identify the access method associated with a memory/storage medium",
    relationFamily: "access-method",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["RAM", "magnetic tape", "disk storage"],
    surfaceVariants: [
      "Which medium is primarily sequential-access?",
      "Which memory supports direct/random access in the exam abstraction?",
    ],
    evidence: ["DOMAIN_HYPOTHESIS", "PYQ_REQUIRED"],
    ambiguityRisks: [
      "terminology such as random/direct access must match the source and exam convention",
    ],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "MEM-DISC-013",
    learnerTask: "Identify backup/removable storage devices and their appropriate role",
    relationFamily: "backup-storage-role",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["external drives", "optical media", "magnetic tape", "USB storage"],
    surfaceVariants: [
      "Which of the following can be used as a backup device?",
      "Which medium is commonly used for archival backup?",
    ],
    evidence: ["OFFICIAL_SYLLABUS", "PYQ_REQUIRED"],
    splitIf: [
      "backup strategy becomes operational/security knowledge rather than device classification",
    ],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "MEM-DISC-014",
    learnerTask: "Expand or identify standard memory/storage abbreviations",
    relationFamily: "abbreviation-expansion",
    candidateMode: "LEXICAL_EXPANSION",
    objectFamilies: ["RAM", "ROM", "SRAM", "DRAM", "PROM", "EPROM", "EEPROM", "HDD", "SSD"],
    surfaceVariants: [
      "What does RAM stand for?",
      "Which abbreviation means Electrically Erasable Programmable Read-Only Memory?",
    ],
    evidence: ["LEGACY_HINT", "PYQ_REQUIRED"],
    ownershipNotes: [
      "retain only abbreviations that are exam-relevant; do not create acronym trivia for its own sake",
    ],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "MEM-DISC-015",
    learnerTask: "Evaluate a single statement about a memory/storage concept",
    relationFamily: "single-statement-truth",
    candidateMode: "STATEMENT_SET",
    objectFamilies: ["all memory/storage entities"],
    surfaceVariants: [
      "Which statement about cache memory is correct?",
      "Which of the following statements about ROM is incorrect?",
    ],
    evidence: ["DOMAIN_HYPOTHESIS", "PYQ_REQUIRED"],
    ownershipNotes: [
      "statement wording alone must not create a permanent QL; it is realized through the underlying relation-family QL",
    ],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "MEM-DISC-016",
    learnerTask: "Evaluate a multi-statement set combining two or more memory/storage facts",
    relationFamily: "multi-fact-statement-set",
    candidateMode: "STATEMENT_SET",
    objectFamilies: ["all memory/storage entities"],
    surfaceVariants: [
      "Which of statements I, II and III are correct?",
      "Select the correct combination of memory facts.",
    ],
    evidence: ["DOMAIN_HYPOTHESIS", "PYQ_REQUIRED"],
    splitIf: [
      "source evidence shows this multi-fact composition is a recurring exam learner task",
    ],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "MEM-DISC-017",
    learnerTask: "Match multiple memory/storage entities with properties, classes or functions",
    relationFamily: "multi-pair-matching",
    candidateMode: "MATCHING",
    objectFamilies: ["memory types", "storage devices", "functions", "media"],
    surfaceVariants: [
      "Match List I with List II.",
      "Match each memory type to its characteristic.",
    ],
    evidence: ["DOMAIN_HYPOTHESIS", "PYQ_REQUIRED"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "MEM-DISC-018",
    learnerTask: "Recognize virtual memory at awareness-exam depth",
    relationFamily: "virtual-memory-concept",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["virtual memory", "RAM", "secondary storage"],
    surfaceVariants: [
      "Virtual memory uses which storage resource to extend apparent main memory?",
      "What is the purpose of virtual memory?",
    ],
    evidence: ["DOMAIN_HYPOTHESIS", "PYQ_REQUIRED"],
    ownershipNotes: [
      "keep only awareness-level concept here; paging/replacement algorithms belong to Operating Systems if ever required",
    ],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "MEM-DISC-019",
    learnerTask: "Use standard data-capacity units and relationships in a computer-memory context",
    relationFamily: "capacity-unit-relationship",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["bit", "nibble", "byte", "KB", "MB", "GB", "TB"],
    surfaceVariants: [
      "How many bits are in a byte?",
      "Which unit is larger/smaller?",
      "Identify the correct capacity relation.",
    ],
    evidence: ["DOMAIN_HYPOTHESIS", "PYQ_REQUIRED"],
    ownershipNotes: [
      "ownership stays Computer Awareness when testing computer units, not arithmetic conversion skill",
    ],
    ambiguityRisks: [
      "binary vs decimal kilo/mega conventions must be explicitly normalized by source/exam convention",
    ],
    productionState: "DISCOVERY_ONLY",
  },
];

export function auditCom001MemoryStorageDiscovery() {
  const issues: string[] = [];
  const ids = new Set<string>();

  for (const candidate of COM001_MEMORY_STORAGE_DISCOVERY) {
    if (ids.has(candidate.candidateId)) {
      issues.push(`DUPLICATE_ID:${candidate.candidateId}`);
    }
    ids.add(candidate.candidateId);

    if (candidate.productionState !== "DISCOVERY_ONLY") {
      issues.push(`PREMATURE_PRODUCTION_STATE:${candidate.candidateId}`);
    }
    if (!candidate.learnerTask.trim()) {
      issues.push(`EMPTY_LEARNER_TASK:${candidate.candidateId}`);
    }
    if (!candidate.relationFamily.trim()) {
      issues.push(`EMPTY_RELATION_FAMILY:${candidate.candidateId}`);
    }
    if (candidate.surfaceVariants.length < 2) {
      issues.push(`THIN_SURFACE_DISCOVERY:${candidate.candidateId}`);
    }
    if (candidate.objectFamilies.length === 0) {
      issues.push(`EMPTY_OBJECT_FAMILY:${candidate.candidateId}`);
    }
    if (candidate.evidence.length === 0) {
      issues.push(`NO_EVIDENCE_TAG:${candidate.candidateId}`);
    }
  }

  return {
    valid: issues.length === 0,
    candidateCount: COM001_MEMORY_STORAGE_DISCOVERY.length,
    relationFamilies: [
      ...new Set(COM001_MEMORY_STORAGE_DISCOVERY.map((entry) => entry.relationFamily)),
    ].sort(),
    issues,
  };
}
