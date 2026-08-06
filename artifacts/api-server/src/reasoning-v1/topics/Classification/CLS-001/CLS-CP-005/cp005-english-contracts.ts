import { CLS_CP005_PROTOTYPES } from "./relation-registry";
import {
  CLS_CP005_WAVE2_PROTOTYPES,
  type ClsCp005Wave2PrototypeId,
} from "./wave2-runtime";
import { CLS_CP005_WAVE2_DIGIT_PRODUCT_PROTOTYPE_ID } from "./wave2-digit-product-rule";
import { CLS_CP005_DIGIT_PRODUCT_EQUIVALENT_PROTOTYPE_ID } from "./wave2-digit-product-equivalent-runtime";
import type { ClsCp005PrototypeId } from "./types";

export const CLS_CP005_ODD_TUPLE_QL_ID = "CLS-QL-008" as const;
export const CLS_CP005_EQUIVALENT_TUPLE_QL_ID = "CLS-QL-009" as const;

export const CLS_CP005_ODD_TUPLE_SOLVE_CONTRACT_ID =
  "CP005-FIND-ODD-NUMBER-TUPLE" as const;
export const CLS_CP005_EQUIVALENT_TUPLE_SOLVE_CONTRACT_ID =
  "CP005-SELECT-EQUIVALENT-NUMBER-TUPLE" as const;

export type ClsCp005EnglishQlId =
  | typeof CLS_CP005_ODD_TUPLE_QL_ID
  | typeof CLS_CP005_EQUIVALENT_TUPLE_QL_ID;

export type ClsCp005PermanentSourceDescriptor =
  | {
      readonly sourceFamily: "WAVE_1";
      readonly prototypeId: ClsCp005PrototypeId;
    }
  | {
      readonly sourceFamily: "SOURCE_GAP_WAVE_2";
      readonly prototypeId: ClsCp005Wave2PrototypeId;
    }
  | {
      readonly sourceFamily: "DIGIT_PRODUCT_ODD";
      readonly prototypeId: typeof CLS_CP005_WAVE2_DIGIT_PRODUCT_PROTOTYPE_ID;
    }
  | {
      readonly sourceFamily: "DIGIT_PRODUCT_EQUIVALENT";
      readonly prototypeId: typeof CLS_CP005_DIGIT_PRODUCT_EQUIVALENT_PROTOTYPE_ID;
    };

const WAVE1_ODD_SOURCES: readonly ClsCp005PermanentSourceDescriptor[] =
  CLS_CP005_PROTOTYPES
    .filter((prototype) => prototype.task !== "SELECT_EQUIVALENT_NUMBER_SET")
    .map((prototype) => ({
      sourceFamily: "WAVE_1" as const,
      prototypeId: prototype.prototypeId,
    }));

const WAVE1_EQUIVALENT_SOURCES: readonly ClsCp005PermanentSourceDescriptor[] =
  CLS_CP005_PROTOTYPES
    .filter((prototype) => prototype.task === "SELECT_EQUIVALENT_NUMBER_SET")
    .map((prototype) => ({
      sourceFamily: "WAVE_1" as const,
      prototypeId: prototype.prototypeId,
    }));

const WAVE2_ODD_SOURCES: readonly ClsCp005PermanentSourceDescriptor[] =
  CLS_CP005_WAVE2_PROTOTYPES
    .filter((prototype) => prototype.task === "FIND_ODD_NUMBER_TUPLE")
    .map((prototype) => ({
      sourceFamily: "SOURCE_GAP_WAVE_2" as const,
      prototypeId: prototype.prototypeId,
    }));

const WAVE2_EQUIVALENT_SOURCES: readonly ClsCp005PermanentSourceDescriptor[] =
  CLS_CP005_WAVE2_PROTOTYPES
    .filter((prototype) => prototype.task === "SELECT_EQUIVALENT_NUMBER_SET")
    .map((prototype) => ({
      sourceFamily: "SOURCE_GAP_WAVE_2" as const,
      prototypeId: prototype.prototypeId,
    }));

export const CLS_CP005_ODD_TUPLE_SOURCES: readonly ClsCp005PermanentSourceDescriptor[] = [
  ...WAVE1_ODD_SOURCES,
  ...WAVE2_ODD_SOURCES,
  {
    sourceFamily: "DIGIT_PRODUCT_ODD",
    prototypeId: CLS_CP005_WAVE2_DIGIT_PRODUCT_PROTOTYPE_ID,
  },
];

export const CLS_CP005_EQUIVALENT_TUPLE_SOURCES: readonly ClsCp005PermanentSourceDescriptor[] = [
  ...WAVE1_EQUIVALENT_SOURCES,
  ...WAVE2_EQUIVALENT_SOURCES,
  {
    sourceFamily: "DIGIT_PRODUCT_EQUIVALENT",
    prototypeId: CLS_CP005_DIGIT_PRODUCT_EQUIVALENT_PROTOTYPE_ID,
  },
];

export const CLS_CP005_ENGLISH_CONTRACTS = [
  {
    qlId: CLS_CP005_ODD_TUPLE_QL_ID,
    checkpointId: "CLS-CP-005" as const,
    solveContractId: CLS_CP005_ODD_TUPLE_SOLVE_CONTRACT_ID,
    task: "FIND_ODD_NUMBER_TUPLE" as const,
    answerObject: "DISPLAYED_COMPLETE_NUMBER_TUPLE" as const,
    referenceState: "ABSENT" as const,
    allowedSources: CLS_CP005_ODD_TUPLE_SOURCES,
    representedArities: [2, 3, 4] as const,
    locale: "en-IN" as const,
    status: "FROZEN_ENGLISH_RUNTIME_PROOF" as const,
  },
  {
    qlId: CLS_CP005_EQUIVALENT_TUPLE_QL_ID,
    checkpointId: "CLS-CP-005" as const,
    solveContractId: CLS_CP005_EQUIVALENT_TUPLE_SOLVE_CONTRACT_ID,
    task: "SELECT_EQUIVALENT_NUMBER_SET" as const,
    answerObject: "DISPLAYED_COMPLETE_NUMBER_TUPLE" as const,
    referenceState: "REQUIRED" as const,
    allowedSources: CLS_CP005_EQUIVALENT_TUPLE_SOURCES,
    representedArities: [2, 3, 4] as const,
    locale: "en-IN" as const,
    status: "FROZEN_ENGLISH_RUNTIME_PROOF" as const,
  },
] as const;

export const CLS_CP005_ENGLISH_CONTRACT_BY_QL = new Map(
  CLS_CP005_ENGLISH_CONTRACTS.map((contract) => [contract.qlId, contract]),
);
