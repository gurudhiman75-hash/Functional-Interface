export type Com001PyqEvidence = {
  evidenceId: string;
  exam: string;
  heldOn?: string;
  year: number;
  sourceUrl: string;
  sourceKind: "OFFICIAL_PAPER_INDEX" | "MEMORY_BASED" | "QUESTION_COLLECTION";
  normalizedTask: string;
  discoveryCandidates: string[];
  relationSignals: string[];
  formSignals: string[];
  notes: string[];
};

/**
 * Evidence summaries only. We do not store copyrighted question text here.
 * Each record captures the learner task/form observed in a cited past-paper
 * index or exam-oriented question source.
 */
export const COM001_PYQ_EVIDENCE: Com001PyqEvidence[] = [
  {
    evidenceId: "PYQ-SSC-CGL-2017-ROM-PERSISTENCE",
    exam: "SSC CGL",
    heldOn: "2017-08-05 Shift 1",
    year: 2017,
    sourceUrl: "https://testbook.com/question-answer/which-of-the-following-stores-data-permanently-in--5b18c976f2ea0c0c7352874b",
    sourceKind: "OFFICIAL_PAPER_INDEX",
    normalizedTask: "Select the memory type that retains/stores data permanently",
    discoveryCandidates: ["MEM-DISC-001", "MEM-DISC-002"],
    relationSignals: ["volatility", "retention"],
    formSignals: ["single-fact", "forward-or-reverse-classification"],
    notes: ["Supports merging volatility and reverse-retention surfaces."],
  },
  {
    evidenceId: "PYQ-PSSSB-JAIL-WARDER-2021-RAM-PRIMARY",
    exam: "PSSSB Jail Warder",
    heldOn: "2021-08-27",
    year: 2021,
    sourceUrl: "https://img2.freejobalert.com/news/2026/04/psssb-jail-warder-previous-year-question-paper-27-august-2021-69cd08ec9988798721073.pdf",
    sourceKind: "OFFICIAL_PAPER_INDEX",
    normalizedTask: "Classify RAM as a primary-memory category",
    discoveryCandidates: ["MEM-DISC-003", "MEM-DISC-004"],
    relationSignals: ["memory-layer-classification"],
    formSignals: ["single-fact", "classification"],
    notes: ["Direct Punjab-state evidence for primary-memory classification."],
  },
  {
    evidenceId: "PYQ-SSC-CHSL-2019-CACHE-PURPOSE",
    exam: "SSC CHSL",
    heldOn: "2019-07-02 Shift 1",
    year: 2019,
    sourceUrl: "https://testbook.com/question-answer/a-region-of-computer-memory-where-frequently-acces--5d68dfb3fdb8bb66eee75069",
    sourceKind: "OFFICIAL_PAPER_INDEX",
    normalizedTask: "Identify cache from its frequently-accessed-data/faster-access purpose",
    discoveryCandidates: ["MEM-DISC-005", "MEM-DISC-006"],
    relationSignals: ["function-purpose", "cache-function"],
    formSignals: ["single-fact", "reverse-recall"],
    notes: ["Supports a function/purpose learner task rather than a dedicated cache-only QL."],
  },
  {
    evidenceId: "PYQ-SSC-CGL-2023-CACHE-FUNCTION",
    exam: "SSC CGL Tier-II",
    heldOn: "2023-10-26",
    year: 2023,
    sourceUrl: "https://testbook.com/question-answer/what-is-the-function-of-the-cache-memory-in-a-comp--6542a2650a7e99ac51ad6247",
    sourceKind: "OFFICIAL_PAPER_INDEX",
    normalizedTask: "Choose the principal function of cache memory",
    discoveryCandidates: ["MEM-DISC-005", "MEM-DISC-006"],
    relationSignals: ["function-purpose", "cache-function"],
    formSignals: ["single-fact", "forward-recall"],
    notes: ["Forward counterpart to the 2019 reverse-recall cache question."],
  },
  {
    evidenceId: "PYQ-SSC-CGL-2024-MEMORY-STATEMENTS",
    exam: "SSC CGL 2024 Tier-II",
    heldOn: "2025-01-18",
    year: 2025,
    sourceUrl: "https://testbook.com/question-answer/which-of-the-following-statements-about-computer-m--67943c932f9bec4c98ad2fdd",
    sourceKind: "OFFICIAL_PAPER_INDEX",
    normalizedTask: "Evaluate a two-statement set combining RAM volatility and ROM boot-instruction facts",
    discoveryCandidates: ["MEM-DISC-016"],
    relationSignals: ["volatility", "function-purpose", "multi-fact-composition"],
    formSignals: ["multi-statement", "combination-answer"],
    notes: ["Evidence that multi-fact statement evaluation is not merely a wording variant."],
  },
  {
    evidenceId: "PYQ-SSC-CGL-2022-SECONDARY-MEMORY-INCORRECT",
    exam: "SSC CGL 2022 Tier-II",
    heldOn: "2023-03-03",
    year: 2023,
    sourceUrl: "https://testbook.com/question-answer/which-among-the-following-statements-is-incorrect--6412b3645ed52adc42d0f063",
    sourceKind: "OFFICIAL_PAPER_INDEX",
    normalizedTask: "Select the incorrect statement about secondary memory",
    discoveryCandidates: ["MEM-DISC-015"],
    relationSignals: ["memory-layer-classification", "volatility", "function-purpose"],
    formSignals: ["single-concept-multiple-statements", "incorrect-statement"],
    notes: ["Likely a realization wrapper over canonical properties, not its own QL."],
  },
  {
    evidenceId: "PYQ-SSC-CGL-2022-SSD-ELECTRONIC-DISK",
    exam: "SSC CGL 2022 Tier-II",
    heldOn: "2023-03-02",
    year: 2023,
    sourceUrl: "https://testbook.com/question-answer/______-is-also-known-as-electronic-disk--6412bc1f99bf001f431b6208",
    sourceKind: "OFFICIAL_PAPER_INDEX",
    normalizedTask: "Identify SSD from a storage-device descriptor",
    discoveryCandidates: ["MEM-DISC-008", "MEM-DISC-009"],
    relationSignals: ["storage-medium", "storage-device-property"],
    formSignals: ["single-fact", "reverse-recall"],
    notes: ["Supports device/property recall within the storage family."],
  },
  {
    evidenceId: "PYQ-SSC-SELECTION-OPTICAL-STORAGE",
    exam: "SSC Selection Post",
    year: 2023,
    sourceUrl: "https://testbook.com/questions/ssc-selection-post-computer-questions--64919908f66391d836f141d8",
    sourceKind: "QUESTION_COLLECTION",
    normalizedTask: "Classify laser/light-based devices and CD/DVD as optical storage",
    discoveryCandidates: ["MEM-DISC-008", "MEM-DISC-009"],
    relationSignals: ["storage-medium"],
    formSignals: ["classification", "reverse-recall"],
    notes: ["Supports magnetic/optical/solid-state medium classification family."],
  },
  {
    evidenceId: "PYQ-SSC-CGL-2023-TAPE-BACKUP",
    exam: "SSC CGL Tier-II",
    heldOn: "2023-10-26",
    year: 2023,
    sourceUrl: "https://testbook.com/question-answer/which-backup-device-provides-a-convenient-way-to-c--6542a222b7d3408fefa42599",
    sourceKind: "OFFICIAL_PAPER_INDEX",
    normalizedTask: "Identify tape as a backup medium suited to full backups with slower sequential restoration",
    discoveryCandidates: ["MEM-DISC-012", "MEM-DISC-013"],
    relationSignals: ["backup-storage-role", "access-method"],
    formSignals: ["applied-property", "reverse-recall"],
    notes: ["Shows backup role and access method can combine in one learner task."],
  },
  {
    evidenceId: "PYQ-SSC-CHSL-2020-BYTE-EIGHT-BITS",
    exam: "SSC CHSL",
    heldOn: "2020-10-15 Shift 1",
    year: 2020,
    sourceUrl: "https://testbook.com/question-answer/in-the-context-of-computing-a-byte-is-equal-to-__--5fc0b4ea325ee17e93933fbb",
    sourceKind: "OFFICIAL_PAPER_INDEX",
    normalizedTask: "Recall the bit-to-byte capacity relation",
    discoveryCandidates: ["MEM-DISC-019"],
    relationSignals: ["capacity-unit-relationship"],
    formSignals: ["single-fact", "numeric-relation"],
    notes: ["Strong evidence for a dedicated capacity-unit learner task."],
  },
  {
    evidenceId: "PYQ-PUNJAB-PATWARI-2016-CACHE-FASTEST",
    exam: "Punjab Patwari",
    heldOn: "2016-01-24",
    year: 2016,
    sourceUrl: "https://testbook.com/question-answer/which-of-the-following-is-fastest-memory--602cfc35c10649fcf9c33c09",
    sourceKind: "OFFICIAL_PAPER_INDEX",
    normalizedTask: "Choose the fastest option among broad memory/storage classes",
    discoveryCandidates: ["MEM-DISC-010", "MEM-DISC-011"],
    relationSignals: ["memory-hierarchy-order", "speed-comparison"],
    formSignals: ["comparison", "extreme-selection"],
    notes: ["Punjab-state evidence for hierarchy/speed comparison."],
  },
  {
    evidenceId: "PYQ-RRB-CLERK-2024-REGISTER-ACCESS",
    exam: "RRB Office Assistant Mains",
    heldOn: "2024-10-06 Shift 1",
    year: 2024,
    sourceUrl: "https://testbook.com/question-answer/the-shortest-access-time-is-there-in-____-memory--685aa19e9c7fe413b71df19d",
    sourceKind: "MEMORY_BASED",
    normalizedTask: "Identify registers as having the shortest access time among memory options",
    discoveryCandidates: ["MEM-DISC-010", "MEM-DISC-011"],
    relationSignals: ["memory-hierarchy-order", "speed-comparison"],
    formSignals: ["comparison", "extreme-selection"],
    notes: ["Banking evidence; memory-based rather than official-paper index."],
  },
  {
    evidenceId: "PYQ-KVS-2018-DRAM-REFRESH",
    exam: "KVS Junior Secretariat Assistant",
    heldOn: "2018-02-20 Shift 3",
    year: 2018,
    sourceUrl: "https://testbook.com/question-answer/which-of-the-following-needs-to-be-refreshed-to-re--63a9ef06d4a12a57e8d13421",
    sourceKind: "OFFICIAL_PAPER_INDEX",
    normalizedTask: "Identify DRAM from the requirement for periodic refresh",
    discoveryCandidates: ["MEM-DISC-007", "MEM-DISC-011"],
    relationSignals: ["subtype-membership", "memory-technology-property"],
    formSignals: ["reverse-recall", "technology-property"],
    notes: ["Supports SRAM/DRAM property discrimination if target-exam evidence remains sufficient."],
  },
  {
    evidenceId: "PYQ-NVS-2022-SRAM-CACHE",
    exam: "NVS MTS",
    heldOn: "2022-03-10 Shift 3",
    year: 2022,
    sourceUrl: "https://testbook.com/question-answer/which-of-the-following-types-of-memories-is-used-f--691bc43eee298f3737ead487",
    sourceKind: "OFFICIAL_PAPER_INDEX",
    normalizedTask: "Identify SRAM as the memory technology commonly used for cache",
    discoveryCandidates: ["MEM-DISC-007", "MEM-DISC-005"],
    relationSignals: ["subtype-membership", "function-purpose", "used-for-cache"],
    formSignals: ["single-fact", "technology-purpose"],
    notes: ["Supports a distinct memory-subtype/property family beyond RAM-vs-ROM basics."],
  },
];

export function auditCom001PyqEvidence() {
  const issues: string[] = [];
  const ids = new Set<string>();
  for (const evidence of COM001_PYQ_EVIDENCE) {
    if (ids.has(evidence.evidenceId)) issues.push(`DUPLICATE_ID:${evidence.evidenceId}`);
    ids.add(evidence.evidenceId);
    if (!/^https:\/\//.test(evidence.sourceUrl)) {
      issues.push(`NON_HTTPS_SOURCE:${evidence.evidenceId}`);
    }
    if (evidence.discoveryCandidates.length === 0) {
      issues.push(`NO_DISCOVERY_MAPPING:${evidence.evidenceId}`);
    }
    if (evidence.relationSignals.length === 0) {
      issues.push(`NO_RELATION_SIGNAL:${evidence.evidenceId}`);
    }
  }
  return {
    valid: issues.length === 0,
    evidenceCount: COM001_PYQ_EVIDENCE.length,
    exams: [...new Set(COM001_PYQ_EVIDENCE.map((entry) => entry.exam))].sort(),
    candidateCoverage: [...new Set(COM001_PYQ_EVIDENCE.flatMap((entry) => entry.discoveryCandidates))].sort(),
    issues,
  };
}
