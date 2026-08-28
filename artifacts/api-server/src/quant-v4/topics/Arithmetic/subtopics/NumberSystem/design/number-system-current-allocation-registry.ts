import {
  NUMBER_SYSTEM_FINAL_CHECKPOINT_ALLOCATIONS,
  NUMBER_SYSTEM_FINAL_NEXT_PERMANENT_QL_NUMBER,
  NUMBER_SYSTEM_FINAL_PERMANENT_QL_RANGE,
} from "./number-system-final-allocation-authority";

const LANGUAGE_BY_CP = Object.freeze({
  "NUM-CP-001": "en/hi/pa",
  "NUM-CP-002": "en",
  "NUM-CP-003": "en/hi/pa",
  "NUM-CP-004": "en/hi/pa",
  "NUM-CP-005": "en/hi/pa",
  "NUM-CP-006": "en/hi/pa",
  "NUM-CP-007": "en/hi/pa",
  "NUM-CP-008": "en/hi/pa",
  "NUM-CP-009": "en/hi/pa",
  "NUM-CP-010": "en/hi/pa",
  "NUM-CP-011": "en/hi/pa",
  "NUM-CP-012": "en/hi/pa",
  "NUM-CP-013": "en/hi/pa",
  "NUM-CP-014": "en/hi/pa",
} as const);

/**
 * Backward-compatible live allocation registry.
 *
 * Allocation maturity is deliberately separate from product activation. All
 * fourteen CPs own permanent identities, but this registry does not authorize
 * Question Bank writes, scored tests, mocks or public publication.
 */
export const NUMBER_SYSTEM_COMPLETED_CHECKPOINT_ALLOCATIONS = Object.freeze(
  NUMBER_SYSTEM_FINAL_CHECKPOINT_ALLOCATIONS.map((allocation) => Object.freeze({
    ...allocation,
    frozenLearnerTemplateCount: allocation.permanentQlCount,
    maturity: "PERMANENT_ALLOCATION_MERGED" as const,
    language: LANGUAGE_BY_CP[allocation.cpId as keyof typeof LANGUAGE_BY_CP],
    active: false as const,
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  })),
);

export const NUMBER_SYSTEM_CURRENT_PERMANENT_QL_RANGE = NUMBER_SYSTEM_FINAL_PERMANENT_QL_RANGE;
export const NUMBER_SYSTEM_NEXT_PERMANENT_QL_NUMBER_CURRENT = NUMBER_SYSTEM_FINAL_NEXT_PERMANENT_QL_NUMBER;
