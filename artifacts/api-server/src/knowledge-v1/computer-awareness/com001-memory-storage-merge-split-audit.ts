import { COM001_MEMORY_STORAGE_DISCOVERY } from "./com001-memory-storage-discovery";
import { COM001_PYQ_EVIDENCE } from "./com001-pyq-evidence";

export type Com001MergeSplitDecision = {
  decisionId: string;
  candidates: string[];
  decision:
    | "MERGE"
    | "KEEP_PROVISIONAL"
    | "SPLIT"
    | "REALIZER_ONLY"
    | "HOLD_FOR_EVIDENCE";
  provisionalLearnerTask?: string;
  evidenceIds: string[];
  rationale: string[];
  splitProducts?: Array<{
    label: string;
    disposition: "MERGE_WITH_OTHER" | "KEEP_PROVISIONAL" | "HOLD_FOR_EVIDENCE";
    target?: string;
  }>;
};

/**
 * Evidence-driven merge/split decisions. These are still pre-QL; no permanent
 * QL identifiers are allocated here.
 */
export const COM001_MERGE_SPLIT_DECISIONS: Com001MergeSplitDecision[] = [
  {
    decisionId: "MS-001",
    candidates: ["MEM-DISC-001", "MEM-DISC-002"],
    decision: "MERGE",
    provisionalLearnerTask: "Recognize or infer memory volatility/data-retention class",
    evidenceIds: [
      "PYQ-SSC-CGL-2017-ROM-PERSISTENCE",
      "PYQ-SSC-CGL-2024-MEMORY-STATEMENTS",
    ],
    rationale: [
      "Forward volatile/non-volatile classification and reverse retention wording test the same canonical relation.",
      "Stem direction can be a realization axis rather than a separate learner task.",
    ],
  },
  {
    decisionId: "MS-002",
    candidates: ["MEM-DISC-003", "MEM-DISC-004"],
    decision: "MERGE",
    provisionalLearnerTask: "Classify or infer memory/storage hierarchy layer",
    evidenceIds: ["PYQ-PSSSB-JAIL-WARDER-2021-RAM-PRIMARY"],
    rationale: [
      "Direct and reverse primary/secondary classification use the same hierarchy relation.",
      "Keep register/cache category depth as a difficulty/object-pool axis unless later evidence forces a split.",
    ],
  },
  {
    decisionId: "MS-003",
    candidates: ["MEM-DISC-005", "MEM-DISC-006"],
    decision: "MERGE",
    provisionalLearnerTask: "Map memory/storage components to defining functions and vice versa",
    evidenceIds: [
      "PYQ-SSC-CHSL-2019-CACHE-PURPOSE",
      "PYQ-SSC-CGL-2023-CACHE-FUNCTION",
      "PYQ-NVS-2022-SRAM-CACHE",
    ],
    rationale: [
      "SSC evidence contains both directions of cache-function recall.",
      "Direction alone does not create materially different reasoning demand.",
    ],
  },
  {
    decisionId: "MS-004",
    candidates: ["MEM-DISC-007"],
    decision: "KEEP_PROVISIONAL",
    provisionalLearnerTask: "Discriminate memory subtypes by family or defining technology property",
    evidenceIds: [
      "PYQ-KVS-2018-DRAM-REFRESH",
      "PYQ-NVS-2022-SRAM-CACHE",
    ],
    rationale: [
      "SRAM/DRAM/PROM/EPROM/EEPROM discrimination requires subtype-level knowledge beyond generic volatility or hierarchy classification.",
      "Production scope must still be bounded to competitive-exam depth.",
    ],
  },
  {
    decisionId: "MS-005",
    candidates: ["MEM-DISC-008", "MEM-DISC-009"],
    decision: "MERGE",
    provisionalLearnerTask: "Classify storage devices by storage medium/technology and infer device from medium",
    evidenceIds: [
      "PYQ-SSC-CGL-2022-SSD-ELECTRONIC-DISK",
      "PYQ-SSC-SELECTION-OPTICAL-STORAGE",
    ],
    rationale: [
      "Magnetic/optical/solid-state classification and reverse identification share one canonical medium relation.",
    ],
  },
  {
    decisionId: "MS-006",
    candidates: ["MEM-DISC-010"],
    decision: "KEEP_PROVISIONAL",
    provisionalLearnerTask: "Use the broad memory hierarchy to compare/order access speed or proximity",
    evidenceIds: [
      "PYQ-PUNJAB-PATWARI-2016-CACHE-FASTEST",
      "PYQ-RRB-CLERK-2024-REGISTER-ACCESS",
    ],
    rationale: [
      "Punjab and banking evidence both test relative speed/access position.",
      "Use broad hierarchy classes only; device-generation benchmarks remain inadmissible.",
    ],
  },
  {
    decisionId: "MS-007",
    candidates: ["MEM-DISC-011"],
    decision: "SPLIT",
    evidenceIds: [
      "PYQ-PUNJAB-PATWARI-2016-CACHE-FASTEST",
      "PYQ-KVS-2018-DRAM-REFRESH",
    ],
    rationale: [
      "The discovery candidate mixed scalar hierarchy comparisons with multi-attribute technology comparisons.",
      "Those are not one coherent learner task.",
    ],
    splitProducts: [
      {
        label: "speed/access hierarchy comparison",
        disposition: "MERGE_WITH_OTHER",
        target: "MS-006",
      },
      {
        label: "pairwise technology/property comparison such as SRAM vs DRAM or HDD vs SSD",
        disposition: "HOLD_FOR_EVIDENCE",
      },
    ],
  },
  {
    decisionId: "MS-008",
    candidates: ["MEM-DISC-012"],
    decision: "HOLD_FOR_EVIDENCE",
    provisionalLearnerTask: "Identify sequential/random/direct access method",
    evidenceIds: ["PYQ-SSC-CGL-2023-TAPE-BACKUP"],
    rationale: [
      "The observed SSC evidence uses sequential access as part of a backup-device task, not yet enough to prove a standalone access-method QL.",
    ],
  },
  {
    decisionId: "MS-009",
    candidates: ["MEM-DISC-013"],
    decision: "KEEP_PROVISIONAL",
    provisionalLearnerTask: "Select a storage/backup device from operational backup characteristics",
    evidenceIds: ["PYQ-SSC-CGL-2023-TAPE-BACKUP"],
    rationale: [
      "SSC CGL directly tests backup-device suitability using multiple device characteristics.",
      "This is more applied than generic storage-medium classification.",
    ],
  },
  {
    decisionId: "MS-010",
    candidates: ["MEM-DISC-014"],
    decision: "HOLD_FOR_EVIDENCE",
    provisionalLearnerTask: "Expand or identify memory/storage abbreviations",
    evidenceIds: [],
    rationale: [
      "Acronym knowledge is common in Computer Awareness, but the current Memory & Storage evidence pass has not yet established enough direct target-exam examples to freeze it as its own QL.",
    ],
  },
  {
    decisionId: "MS-011",
    candidates: ["MEM-DISC-015"],
    decision: "REALIZER_ONLY",
    evidenceIds: ["PYQ-SSC-CGL-2022-SECONDARY-MEMORY-INCORRECT"],
    rationale: [
      "Correct/incorrect statement wording can be generated from underlying canonical property relations.",
      "A single-concept statement shell does not by itself create a new learner task.",
    ],
  },
  {
    decisionId: "MS-012",
    candidates: ["MEM-DISC-016"],
    decision: "KEEP_PROVISIONAL",
    provisionalLearnerTask: "Evaluate a composition of multiple independent memory/storage facts",
    evidenceIds: ["PYQ-SSC-CGL-2024-MEMORY-STATEMENTS"],
    rationale: [
      "The candidate must validate more than one proposition and select a combination answer.",
      "This composition demand is materially different from simply rewording one fact as a statement.",
    ],
  },
  {
    decisionId: "MS-013",
    candidates: ["MEM-DISC-017"],
    decision: "HOLD_FOR_EVIDENCE",
    provisionalLearnerTask: "Match multiple memory/storage entities to properties/functions",
    evidenceIds: [],
    rationale: [
      "Matching is plausible but should not become permanent until target-exam evidence and an independent matching verifier are available.",
    ],
  },
  {
    decisionId: "MS-014",
    candidates: ["MEM-DISC-018"],
    decision: "HOLD_FOR_EVIDENCE",
    provisionalLearnerTask: "Recognize virtual-memory purpose/backing at awareness depth",
    evidenceIds: [],
    rationale: [
      "The concept is technically valid, but target-exam frequency must be established before permanent allocation.",
    ],
  },
  {
    decisionId: "MS-015",
    candidates: ["MEM-DISC-019"],
    decision: "KEEP_PROVISIONAL",
    provisionalLearnerTask: "Use canonical computer data-capacity units and relationships",
    evidenceIds: ["PYQ-SSC-CHSL-2020-BYTE-EIGHT-BITS"],
    rationale: [
      "SSC directly tests byte/bit relations.",
      "Production must distinguish SI decimal prefixes from IEC binary prefixes rather than encode ambiguous KB=1024 statements as universal truth.",
    ],
  },
];

export function auditCom001MergeSplit() {
  const issues: string[] = [];
  const discoveryIds = new Set(
    COM001_MEMORY_STORAGE_DISCOVERY.map((entry) => entry.candidateId),
  );
  const evidenceIds = new Set(COM001_PYQ_EVIDENCE.map((entry) => entry.evidenceId));
  const coveredCandidates = new Set<string>();
  const decisionIds = new Set<string>();

  for (const decision of COM001_MERGE_SPLIT_DECISIONS) {
    if (decisionIds.has(decision.decisionId)) {
      issues.push(`DUPLICATE_DECISION_ID:${decision.decisionId}`);
    }
    decisionIds.add(decision.decisionId);

    for (const candidateId of decision.candidates) {
      if (!discoveryIds.has(candidateId)) {
        issues.push(`UNKNOWN_CANDIDATE:${decision.decisionId}:${candidateId}`);
      }
      if (coveredCandidates.has(candidateId)) {
        issues.push(`DUPLICATE_CANDIDATE_DECISION:${candidateId}`);
      }
      coveredCandidates.add(candidateId);
    }

    for (const evidenceId of decision.evidenceIds) {
      if (!evidenceIds.has(evidenceId)) {
        issues.push(`UNKNOWN_EVIDENCE:${decision.decisionId}:${evidenceId}`);
      }
    }

    if (
      decision.decision === "KEEP_PROVISIONAL" &&
      !decision.provisionalLearnerTask?.trim()
    ) {
      issues.push(`MISSING_PROVISIONAL_TASK:${decision.decisionId}`);
    }

    if (decision.decision === "SPLIT" && !decision.splitProducts?.length) {
      issues.push(`SPLIT_WITHOUT_PRODUCTS:${decision.decisionId}`);
    }
  }

  for (const discoveryId of discoveryIds) {
    if (!coveredCandidates.has(discoveryId)) {
      issues.push(`UNDECIDED_CANDIDATE:${discoveryId}`);
    }
  }

  const provisionalTasks = COM001_MERGE_SPLIT_DECISIONS.filter(
    (entry) => entry.decision === "MERGE" || entry.decision === "KEEP_PROVISIONAL",
  );

  return {
    valid: issues.length === 0,
    discoveryCandidateCount: discoveryIds.size,
    decisionCount: COM001_MERGE_SPLIT_DECISIONS.length,
    provisionalLearnerTaskCount: provisionalTasks.length,
    holdCount: COM001_MERGE_SPLIT_DECISIONS.filter(
      (entry) => entry.decision === "HOLD_FOR_EVIDENCE",
    ).length,
    realizerOnlyCount: COM001_MERGE_SPLIT_DECISIONS.filter(
      (entry) => entry.decision === "REALIZER_ONLY",
    ).length,
    splitCount: COM001_MERGE_SPLIT_DECISIONS.filter(
      (entry) => entry.decision === "SPLIT",
    ).length,
    issues,
  };
}
