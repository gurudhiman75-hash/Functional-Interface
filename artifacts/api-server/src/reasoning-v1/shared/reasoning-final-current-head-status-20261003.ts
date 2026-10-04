import { REASONING_V1_NOVELTY_PROVIDERS_V1 } from "./reasoning-novelty-provider-registry-v1";
import { SPATIAL_FAMILY_FREEZE_AUTHORITY_V1 } from "../foundation/spatial/spatial-family-freeze-v1";

export const REASONING_V1_FINAL_CURRENT_HEAD_STATUS_VERSION =
  "REASONING_V1_FINAL_CURRENT_HEAD_STATUS_2026_10_03_V1" as const;

export type ReasoningFinalTopicStatusV1 =
  | "DEEP_AUDIT_CLOSED"
  | "DEEP_AUDIT_CLOSED_EXTERNAL_SOURCE_HOLD";

export interface ReasoningFinalTopicStatusEntryV1 {
  readonly topicDirectory: string;
  readonly chapterIds: readonly string[];
  readonly status: ReasoningFinalTopicStatusV1;
  readonly closureAuthorities: readonly string[];
  readonly internalContentBlocker: false;
  readonly externalEvidenceHold?: string;
}

export const REASONING_V1_FINAL_TOPIC_STATUS_V1 =
  Object.freeze([
    {
      topicDirectory: "Alphabet-Test",
      chapterIds: ["ALP-001"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: ["topics/Alphabet-Test/ALP-001/ALP-001-FINAL-DEEP-AUDIT-CLOSURE-20260929.md"],
      internalContentBlocker: false,
    },
    {
      topicDirectory: "Analogy",
      chapterIds: ["ANA-001"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: ["topics/Analogy/ANA-001/ANA-001-FINAL-DEEP-AUDIT-CLOSURE-20260929.md"],
      internalContentBlocker: false,
    },
    {
      topicDirectory: "Assertion-and-Reason",
      chapterIds: ["ASM-001"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: ["topics/Assertion-and-Reason/ASM-001/ASM-001-FINAL-DEEP-AUDIT-CLOSURE-20261003.md"],
      internalContentBlocker: false,
    },
    {
      topicDirectory: "Blood-Relations",
      chapterIds: ["BLR-001"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: ["topics/Blood-Relations/BLR-001/BLR-001-FINAL-DEEP-AUDIT-CLOSURE-20260929.md"],
      internalContentBlocker: false,
    },
    {
      topicDirectory: "Calendar",
      chapterIds: ["CAL-001"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: ["topics/Calendar/CAL-001/CAL-001-FINAL-DEEP-AUDIT-CLOSURE-20260927.md"],
      internalContentBlocker: false,
    },
    {
      topicDirectory: "Cause-and-Effect",
      chapterIds: ["CAE-001"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: ["topics/Cause-and-Effect/CAE-001/CAE-001-FINAL-DEEP-AUDIT-CLOSURE-20260929.md"],
      internalContentBlocker: false,
    },
    {
      topicDirectory: "Classification",
      chapterIds: ["CLS-001"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: ["topics/Classification/CLS-001/CLS-001-FINAL-DEEP-AUDIT-CLOSURE-20260929.md"],
      internalContentBlocker: false,
    },
    {
      topicDirectory: "Clocks",
      chapterIds: ["CLK-001"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: ["topics/Clocks/CLK-001/CLK-001-FINAL-DEEP-AUDIT-CLOSURE-20260929.md"],
      internalContentBlocker: false,
    },
    {
      topicDirectory: "Coding-Decoding",
      chapterIds: ["COD-001"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: ["topics/Coding-Decoding/COD-001/COD-001-FINAL-DEEP-AUDIT-CLOSURE-20260928.md"],
      internalContentBlocker: false,
    },
    {
      topicDirectory: "Course-of-Action",
      chapterIds: ["COA-001"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: ["topics/Course-of-Action/COA-001/COA-001-FINAL-DEEP-AUDIT-CLOSURE-20260929.md"],
      internalContentBlocker: false,
    },
    {
      topicDirectory: "Data-Sufficiency",
      chapterIds: ["DSF-001"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: ["topics/Data-Sufficiency/DSF-001/DSF-001-FINAL-DEEP-AUDIT-CLOSURE-20261001.md"],
      internalContentBlocker: false,
    },
    {
      topicDirectory: "Decision-Making",
      chapterIds: ["DM-001"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: ["topics/Decision-Making/DM-001/DM-001-FINAL-CLOSURE-FREEZE-20261004.md"],
      internalContentBlocker: false,
    },
    {
      topicDirectory: "Direction-Sense",
      chapterIds: ["DIR-001"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: ["topics/Direction-Sense/DIR-001/DIR-001-FINAL-DEEP-AUDIT-CLOSURE-20260929.md"],
      internalContentBlocker: false,
    },
    {
      topicDirectory: "Floor-and-Flat-Arrangement",
      chapterIds: ["FLR-001"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: ["topics/Floor-and-Flat-Arrangement/FLR-001/FLR-001-FINAL-DEEP-AUDIT-CLOSURE-20261003.md"],
      internalContentBlocker: false,
    },
    {
      topicDirectory: "Inequality",
      chapterIds: ["INE-001"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: ["topics/Inequality/INE-001/INE-001-FINAL-DEEP-AUDIT-CLOSURE-20261003.md"],
      internalContentBlocker: false,
    },
    {
      topicDirectory: "InputOutput",
      chapterIds: ["IOP-001"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: ["topics/InputOutput/IOP-001/IOP-001-FINAL-DEEP-AUDIT-CLOSURE-20260930.md"],
      internalContentBlocker: false,
    },
    {
      topicDirectory: "Logic-Puzzles",
      chapterIds: ["LP-001"],
      status: "DEEP_AUDIT_CLOSED_EXTERNAL_SOURCE_HOLD",
      closureAuthorities: [
        "topics/Logic-Puzzles/LP-001/LP-001-FINAL-CONTENT-DEEP-AUDIT-CLOSURE-20260930.md",
        "topics/Logic-Puzzles/LP-001/LP-001-011-SOURCE-PROVENANCE-WAVE04-RETRIEVAL-CEILING.md",
      ],
      internalContentBlocker: false,
      externalEvidenceHold:
        "First-party SSC/Punjab item-level source saturation remains incomplete because durable official paper retrieval is unavailable/time-limited; production source gate remains closed.",
    },
    {
      topicDirectory: "Mathematical-Operations",
      chapterIds: ["OPS-001"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: ["topics/Mathematical-Operations/OPS-001/OPS-001-FINAL-DEEP-AUDIT-CLOSURE-20260930.md"],
      internalContentBlocker: false,
    },
    {
      topicDirectory: "Missing-Number",
      chapterIds: ["MIS-001"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: ["topics/Missing-Number/MIS-001/MIS-001-FINAL-READINESS-FREEZE-V1.md"],
      internalContentBlocker: false,
    },
    {
      topicDirectory: "Non-Verbal-Reasoning",
      chapterIds: ["SPA-FND-001", "PFC-001", "CND-001", "FFM-001", "DOT-001", "FMT-001", "IDF-001"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: ["foundation/spatial/spatial-family-freeze-v1.ts"],
      internalContentBlocker: false,
    },
    {
      topicDirectory: "Ranking-and-Order",
      chapterIds: ["RNK-001"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: ["topics/Ranking-and-Order/RNK-001/RNK-001-FINAL-CONTENT-DEEP-AUDIT-CLOSURE-20260930.md"],
      internalContentBlocker: false,
    },
    {
      topicDirectory: "SeatingArrangement",
      chapterIds: ["SEA-001", "SEA-002", "SEA-003"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: [
        "topics/SeatingArrangement/SEA-001/SEA-001-FINAL-DEEP-AUDIT-CLOSURE-20261001.md",
        "topics/SeatingArrangement/SEA-002/SEA-002-FINAL-DEEP-AUDIT-CLOSURE-20261003.md",
        "topics/SeatingArrangement/SEA-003/SEA-003-FINAL-DEEP-AUDIT-CLOSURE-20261003.md",
        "topics/SeatingArrangement/SEA-FAMILY-CURRENT-CLOSURE-20261003.md",
      ],
      internalContentBlocker: false,
    },
    {
      topicDirectory: "Series",
      chapterIds: ["SER-001"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: [
        "topics/Series/SER-001/SER-001-FINAL-DEEP-AUDIT-CLOSURE-20260929.md",
        "topics/Series/SER-001/SER-CP-010-PROMOTION/SER-CP-010-PERMANENT-PROMOTION-CLOSURE.md",
      ],
      internalContentBlocker: false,
    },
    {
      topicDirectory: "Statement-and-Arguments",
      chapterIds: ["ARG-001"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: ["topics/Statement-and-Arguments/ARG-001/ARG-001-FINAL-DEEP-AUDIT-CLOSURE-20260929.md"],
      internalContentBlocker: false,
    },
    {
      topicDirectory: "Statement-and-Assumption",
      chapterIds: ["STA-001"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: ["topics/Statement-and-Assumption/STA-001/STA-001-FINAL-DEEP-AUDIT-CLOSURE-20260929.md"],
      internalContentBlocker: false,
    },
    {
      topicDirectory: "Statement-and-Conclusion",
      chapterIds: ["STC-001"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: ["topics/Statement-and-Conclusion/STC-001/STC-001-POST-CLOSURE-DEEP-AUDIT-20261003.md"],
      internalContentBlocker: false,
    },
    {
      topicDirectory: "Statement-and-Inference",
      chapterIds: ["SIF-001"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: ["topics/Statement-and-Inference/SIF-001/SIF-001-POST-CLOSURE-DEEP-AUDIT-20261004.md"],
      internalContentBlocker: false,
    },
    {
      topicDirectory: "Syllogism",
      chapterIds: ["SYL-001"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: ["topics/Syllogism/SYL-001/SYL-001-FINAL-DEEP-AUDIT-CLOSURE-20260929.md"],
      internalContentBlocker: false,
    },
    {
      topicDirectory: "Venn-Diagrams",
      chapterIds: ["VEN-001"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: ["topics/Venn-Diagrams/VEN-001/VEN-001-FINAL-DEEP-AUDIT-CLOSURE-20261001.md"],
      internalContentBlocker: false,
    },
    {
      topicDirectory: "Word-Dictionary-Order",
      chapterIds: ["WOR-001"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: [
        "topics/Word-Dictionary-Order/WOR-001/WOR-001-FINAL-CONTENT-DEEP-AUDIT-CLOSURE-20261001.md",
        "topics/Word-Dictionary-Order/WOR-001/WOR-001-FINAL-EXAM-READINESS-FREEZE.md",
      ],
      internalContentBlocker: false,
    },
    {
      topicDirectory: "Word-Formation",
      chapterIds: ["WFM-001"],
      status: "DEEP_AUDIT_CLOSED",
      closureAuthorities: ["topics/Word-Formation/WFM-001/WFM-001-FINAL-DEEP-AUDIT-CLOSURE-20261001.md"],
      internalContentBlocker: false,
    },
  ] as const satisfies readonly ReasoningFinalTopicStatusEntryV1[]);

const approvedNoveltyProviders = REASONING_V1_NOVELTY_PROVIDERS_V1.filter(
  (provider) => provider.status === "APPROVED_RUNTIME",
);
const awaitingNoveltyProviders = REASONING_V1_NOVELTY_PROVIDERS_V1.filter(
  (provider) => provider.status !== "APPROVED_RUNTIME",
);

export const REASONING_V1_FINAL_CURRENT_HEAD_STATUS_V1 = Object.freeze({
  topicDirectoryCount: REASONING_V1_FINAL_TOPIC_STATUS_V1.length,
  deepAuditClosedTopicCount: REASONING_V1_FINAL_TOPIC_STATUS_V1.filter(
    (entry) => entry.status === "DEEP_AUDIT_CLOSED",
  ).length,
  externalSourceHoldTopicCount: REASONING_V1_FINAL_TOPIC_STATUS_V1.filter(
    (entry) => entry.status === "DEEP_AUDIT_CLOSED_EXTERNAL_SOURCE_HOLD",
  ).length,
  internalContentBlockerCount: REASONING_V1_FINAL_TOPIC_STATUS_V1.filter(
    (entry) => entry.internalContentBlocker,
  ).length,
  approvedNoveltyProviderCount: approvedNoveltyProviders.length,
  nonApprovedNoveltyProviderCount: awaitingNoveltyProviders.length,
  spatialFamilyFrozen: SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.freezeContract.familyFrozen,
  spatialPermanentQlCount: SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.permanentQlCount,
  spatialUnifiedSoakPassed:
    SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.freezeContract.deterministicUnifiedSoakPassed,
  contentDeepAuditCompleteForCurrentRepository: true,
  fullTargetExamSourceSaturationComplete: false,
  onlyKnownSourceSaturationHold: "LP-001_FIRST_PARTY_SSC_PUNJAB_RETRIEVAL_CEILING",
  verdict:
    "CURRENT_REASONING_CONTENT_DEEP_AUDIT_COMPLETE__NO_INTERNAL_CONTENT_BLOCKERS__LP_EXTERNAL_SOURCE_PROVENANCE_HOLD_REMAINS",
} as const);
