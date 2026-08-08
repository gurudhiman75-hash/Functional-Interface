import { CALENDAR_PROTOTYPE_IDS } from "./registry.ts";
import { CALENDAR_SOURCE_GAP_PROTOTYPES } from "./source-gap-runtime.ts";
import { FINAL_CALENDAR_SOURCE_AUDIT_GATE } from "./final-source-audit-gate.ts";
import { CALENDAR_PERMANENT_CONTRACTS, CALENDAR_PERMANENT_QL_IDS } from "./permanent-contracts.ts";

export const CAL_001_ENGLISH_DISCOVERY_FREEZE_VERSION = "CAL_001_ENGLISH_DISCOVERY_FREEZE_V1" as const;

export const CAL_001_FROZEN_SOURCE_PROTOTYPE_IDS = [
  ...CALENDAR_PROTOTYPE_IDS,
  ...CALENDAR_SOURCE_GAP_PROTOTYPES,
] as const;

export const CAL_001_INSTANCE_PROPERTIES = [
  "FORWARD_OR_BACKWARD_DIRECTION",
  "KNOWN_ANCHOR_BOUNDARY",
  "INCLUSIVE_OR_EXCLUSIVE_COUNTING",
  "ORDINARY_OR_LEAP_YEAR",
  "CENTURY_EXCEPTION_EXPOSURE",
  "DATE_MONTH_AND_YEAR_VALUES",
  "NAMED_WEEKDAY",
  "OPTION_SELECTION_RENDERER",
  "DIRECT_OR_INVERSE_WORDING",
  "DIFFICULTY",
  "STEM_TEMPLATE",
] as const;

export const CAL_001_SOURCE_EVIDENCE_LEDGER = [
  {
    source: "Uploaded competitive-exam Calendar references",
    strength: "DIRECT",
    supports: ["ABSOLUTE_DATE", "ODD_DAYS", "YEAR_CLASSIFICATION", "CALENDAR_MATCHING", "DATE_RECURRENCE", "MONTH_DATE_SET", "FEB29_RANGE_COUNT"],
  },
  {
    source: "SSC and RRB official-paper-labelled previous-question repositories",
    strength: "DIRECT",
    supports: ["ABSOLUTE_DATE", "YEAR_MOVEMENT", "IDENTICAL_CALENDAR"],
  },
  {
    source: "Punjab-state previous-paper archive and PSSSB Calendar examples",
    strength: "DIRECT",
    supports: ["CONDITIONAL_DATE_RELATION", "JANUARY_FIRST_YEAR_SHIFT"],
  },
  {
    source: "Current Banking reasoning-topic boundary review",
    strength: "BOUNDARY",
    supports: ["NO_BANK_ONLY_SOLVE_AUTHORITY_REQUIRED"],
  },
  {
    source: "Approved CAL-001 English review evidence",
    strength: "HUMAN_REVIEW",
    supports: ["FORTY_FOUR_DISCOVERY_PROTOTYPES", "EXAM_NATURAL_STEMS", "DISTRACTOR_QUALITY", "STUDENT_EXPLANATIONS"],
  },
  {
    source: "Executable Gregorian, source-gap and permanent-identity proofs",
    strength: "EXECUTABLE",
    supports: ["FORTY_SEVEN_SOURCE_PROTOTYPES", "THIRTY_SIX_PERMANENT_IDENTITIES", "INDEPENDENT_SOLVER_PARITY", "RELEASE_LOCKS"],
  },
] as const;

export const CAL_001_RELEASE_LOCK = {
  freezeVersion: CAL_001_ENGLISH_DISCOVERY_FREEZE_VERSION,
  permanentQlRange: "CAL-QL-001..036",
  permanentQlCount: CALENDAR_PERMANENT_QL_IDS.length,
  nextAvailableChapterQlId: "CAL-QL-037",
  approvedDiscoveryPrototypeCount: CALENDAR_PROTOTYPE_IDS.length,
  sourceGapPrototypeCount: CALENDAR_SOURCE_GAP_PROTOTYPES.length,
  frozenSourcePrototypeCount: CAL_001_FROZEN_SOURCE_PROTOTYPE_IDS.length,
  englishEditorialReviewApproved: true,
  englishIdentityFrozen: true,
  finalSourceAuditPassed: FINAL_CALENDAR_SOURCE_AUDIT_GATE.passed,
  reviewOnly: true,
  hindiHumanFreeze: false,
  punjabiHumanFreeze: false,
  multilingualParityFreeze: false,
  questionStudioAllowed: false,
  questionBankWriteAllowed: false,
  mockTestAllowed: false,
  publicPublicationAllowed: false,
} as const;

export const CAL_001_FINAL_DISCOVERY_FREEZE = {
  version: CAL_001_ENGLISH_DISCOVERY_FREEZE_VERSION,
  sourceAudit: FINAL_CALENDAR_SOURCE_AUDIT_GATE,
  frozenSourcePrototypeIds: CAL_001_FROZEN_SOURCE_PROTOTYPE_IDS,
  permanentContracts: CALENDAR_PERMANENT_CONTRACTS,
  instanceProperties: CAL_001_INSTANCE_PROPERTIES,
  releaseLock: CAL_001_RELEASE_LOCK,
} as const;
