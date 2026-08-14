import {
  MAL_CP006_WAVE03_CANDIDATE_IDS,
  MAL_CP006_WAVE03_HELD_IDS,
  type MalCp006Wave03CandidateId,
} from "./cp006-wave03-merge-split-analysis";
import { MAL_CP006_WAVE04_FINAL_GENERALISATION_ID } from "./cp006-wave04-within-identity-generalisation-v2";
import { MAL_CP006_WAVE01_FINAL_LEARNER_AUTHORITY_ID } from "./cp006-wave01-learner-authority-final";
import { MAL_CP006_WAVE02_FINAL_AUTHORITY_V4_ID } from "./cp006-wave02-final-authority-v4";

export const MAL_CP006_PERMANENT_ALLOCATION_ID =
  "MAL-CP006-EN-PERMANENT-ALLOCATION-V1" as const;

export const MAL_CP006_PERMANENT_QL_RANGE =
  "MAL-QL-061..MAL-QL-067" as const;

export const MAL_CP006_PERMANENT_LANGUAGE = "en" as const;

export const MAL_CP006_SHARED_CORE_IDS = [
  "STAGED_VESSEL_LEDGER",
  "SIMULTANEOUS_EQUAL_EXCHANGE",
] as const;

export type MalCp006SharedCoreId = (typeof MAL_CP006_SHARED_CORE_IDS)[number];
export type MalCp006PermanentQlId =
  | "MAL-QL-061"
  | "MAL-QL-062"
  | "MAL-QL-063"
  | "MAL-QL-064"
  | "MAL-QL-065"
  | "MAL-QL-066"
  | "MAL-QL-067";
export type MalCp006PermanentSolveModeId =
  | "MAL-CP006-SM-001"
  | "MAL-CP006-SM-002"
  | "MAL-CP006-SM-003"
  | "MAL-CP006-SM-004"
  | "MAL-CP006-SM-005"
  | "MAL-CP006-SM-006"
  | "MAL-CP006-SM-007";

export type MalCp006PermanentAllocationEntry = {
  qlId: MalCp006PermanentQlId;
  solveModeId: MalCp006PermanentSolveModeId;
  prototypeId: MalCp006Wave03CandidateId;
  sharedCoreId: MalCp006SharedCoreId;
  learnerContract: string;
  authorityIds: readonly string[];
  permanentIdentityFrozen: true;
  active: false;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  testEligible: false;
};

const lockedLifecycle = {
  permanentIdentityFrozen: true,
  active: false,
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
} as const;

export const MAL_CP006_PERMANENT_ALLOCATION = [
  {
    qlId: "MAL-QL-061",
    solveModeId: "MAL-CP006-SM-001",
    prototypeId: "MAL-CP006-PROT-TRANSFER-RETURN-FINAL-RATIO",
    sharedCoreId: "STAGED_VESSEL_LEDGER",
    learnerContract:
      "Track successive transfers between vessels and find the final component ratio in the requested vessel, including longer alternating transfer-return forms.",
    authorityIds: [
      MAL_CP006_WAVE01_FINAL_LEARNER_AUTHORITY_ID,
      MAL_CP006_WAVE04_FINAL_GENERALISATION_ID,
    ],
    ...lockedLifecycle,
  },
  {
    qlId: "MAL-QL-062",
    solveModeId: "MAL-CP006-SM-002",
    prototypeId:
      "MAL-CP006-PROT-EQUAL-EXCHANGE-AMOUNT-FOR-EQUAL-CONCENTRATIONS",
    sharedCoreId: "SIMULTANEOUS_EQUAL_EXCHANGE",
    learnerContract:
      "Find the equal quantity exchanged between two vessels when their final concentrations must become equal.",
    authorityIds: [MAL_CP006_WAVE01_FINAL_LEARNER_AUTHORITY_ID],
    ...lockedLifecycle,
  },
  {
    qlId: "MAL-QL-063",
    solveModeId: "MAL-CP006-SM-003",
    prototypeId: "MAL-CP006-PROT-THREE-VESSEL-CYCLE-FINAL-CONCENTRATION",
    sharedCoreId: "STAGED_VESSEL_LEDGER",
    learnerContract:
      "Track a three-vessel current-composition transfer cycle and find the requested final concentration.",
    authorityIds: [MAL_CP006_WAVE01_FINAL_LEARNER_AUTHORITY_ID],
    ...lockedLifecycle,
  },
  {
    qlId: "MAL-QL-064",
    solveModeId: "MAL-CP006-SM-004",
    prototypeId:
      "MAL-CP006-PROT-SOURCE-REFILL-RETRANSFER-DESTINATION-RATIO",
    sharedCoreId: "STAGED_VESSEL_LEDGER",
    learnerContract:
      "Transfer from a source vessel, refill that source with a pure liquid, retransfer its changed mixture, and find the destination ratio.",
    authorityIds: [MAL_CP006_WAVE01_FINAL_LEARNER_AUTHORITY_ID],
    ...lockedLifecycle,
  },
  {
    qlId: "MAL-QL-065",
    solveModeId: "MAL-CP006-SM-005",
    prototypeId:
      "MAL-CP006-PROT-ROUND-TRIP-CROSS-VESSEL-COMPONENT-RATIO",
    sharedCoreId: "STAGED_VESSEL_LEDGER",
    learnerContract:
      "Track a cross-vessel round trip and compare component quantities remaining in different vessels.",
    authorityIds: [MAL_CP006_WAVE01_FINAL_LEARNER_AUTHORITY_ID],
    ...lockedLifecycle,
  },
  {
    qlId: "MAL-QL-066",
    solveModeId: "MAL-CP006-SM-006",
    prototypeId: "MAL-CP006-PROT-INVERSE-TRANSFER-RETURN-TARGET-RATIO",
    sharedCoreId: "STAGED_VESSEL_LEDGER",
    learnerContract:
      "Use a target final ratio to infer an unknown return or transfer quantity after the source composition has changed, including equal and asymmetric return forms.",
    authorityIds: [
      MAL_CP006_WAVE02_FINAL_AUTHORITY_V4_ID,
      MAL_CP006_WAVE04_FINAL_GENERALISATION_ID,
    ],
    ...lockedLifecycle,
  },
  {
    qlId: "MAL-QL-067",
    solveModeId: "MAL-CP006-SM-007",
    prototypeId:
      "MAL-CP006-PROT-CHANGED-SOURCE-CHAIN-REMAINING-COMPONENT",
    sharedCoreId: "STAGED_VESSEL_LEDGER",
    learnerContract:
      "Use a downstream sample ratio from a changed source vessel to infer the hidden scale, then find the component quantity remaining in that source vessel.",
    authorityIds: [MAL_CP006_WAVE02_FINAL_AUTHORITY_V4_ID],
    ...lockedLifecycle,
  },
] as const satisfies readonly MalCp006PermanentAllocationEntry[];

export const MAL_CP006_PERMANENT_ALLOCATION_BY_PROTOTYPE = new Map(
  MAL_CP006_PERMANENT_ALLOCATION.map((entry) => [entry.prototypeId, entry] as const),
);

export const MAL_CP006_PERMANENT_ALLOCATION_BY_QL = new Map(
  MAL_CP006_PERMANENT_ALLOCATION.map((entry) => [entry.qlId, entry] as const),
);

export const MAL_CP006_PERMANENT_ALLOCATION_POLICY = {
  allocationId: MAL_CP006_PERMANENT_ALLOCATION_ID,
  qlRange: MAL_CP006_PERMANENT_QL_RANGE,
  language: MAL_CP006_PERMANENT_LANGUAGE,
  approvedPrototypeIds: MAL_CP006_WAVE03_CANDIDATE_IDS,
  heldPrototypeIds: MAL_CP006_WAVE03_HELD_IDS,
  permanentQlCount: 7,
  permanentSolveModeCount: 7,
  sharedCoreCount: 2,
  permanentIdentityFrozen: true,
  questionStudioPermanent: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  hindiAuthorised: false,
  punjabiAuthorised: false,
} as const;

export function getMalCp006PermanentAllocation(
  prototypeId: MalCp006Wave03CandidateId,
): MalCp006PermanentAllocationEntry {
  const entry = MAL_CP006_PERMANENT_ALLOCATION_BY_PROTOTYPE.get(prototypeId);
  if (!entry) throw new Error(`No permanent CP006 allocation for ${prototypeId}.`);
  return entry;
}
