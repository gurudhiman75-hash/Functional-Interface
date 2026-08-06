import {
  generateClsCp007QualityQuestion,
  type QualityClsCp007Question,
} from "./quality-runtime-final";
import { generateClsCp007PairQuestion } from "./cluster-pair-runtime";
import type { GeneratedClsCp007PairQuestion } from "./cluster-pair-types";
import type { ClsCp007PrototypeId } from "./types";

export const CLS_CP007_PERMANENT_QLS = ["CLS-QL-012", "CLS-QL-013"] as const;
export type ClsCp007PermanentQlId = typeof CLS_CP007_PERMANENT_QLS[number];

export const CLS_CP007_SOLVE_CONTRACTS = {
  "CLS-QL-012": "CP007-FIND-ODD-LETTER-CLUSTER",
  "CLS-QL-013": "CP007-FIND-ODD-LETTER-CLUSTER-PAIR",
} as const;

const FROZEN_LIFECYCLE = {
  reviewStatus: "FROZEN_ENGLISH_RUNTIME_PROOF" as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
  questionStudioDiscoverable: false as const,
};

type PermanentSingleMetadata = Omit<
  QualityClsCp007Question["metadata"],
  "runtimeVersion" | "sourceSaturationStatus"
> & {
  readonly runtimeVersion: "cls-cp007-permanent-english-v1";
  readonly sourceSaturationStatus: "SOURCE_GAP_CLOSED__TWO_CONTRACTS_FROZEN";
};

export type GeneratedClsCp007PermanentClusterQuestion = Omit<
  QualityClsCp007Question,
  "permanentQlId" | "metadata" | "lifecycle"
> & {
  readonly permanentQlId: "CLS-QL-012";
  readonly solveContract: "CP007-FIND-ODD-LETTER-CLUSTER";
  readonly metadata: PermanentSingleMetadata;
  readonly lifecycle: typeof FROZEN_LIFECYCLE & {
    readonly permanentQlId: "CLS-QL-012";
  };
};

type PermanentPairMetadata = Omit<
  GeneratedClsCp007PairQuestion["metadata"],
  "runtimeVersion" | "sourceSaturationStatus"
> & {
  readonly runtimeVersion: "cls-cp007-permanent-english-v1";
  readonly sourceSaturationStatus: "SOURCE_GAP_CLOSED__TWO_CONTRACTS_FROZEN";
};

export type GeneratedClsCp007PermanentClusterPairQuestion = Omit<
  GeneratedClsCp007PairQuestion,
  "permanentQlId" | "metadata" | "lifecycle"
> & {
  readonly permanentQlId: "CLS-QL-013";
  readonly solveContract: "CP007-FIND-ODD-LETTER-CLUSTER-PAIR";
  readonly metadata: PermanentPairMetadata;
  readonly lifecycle: typeof FROZEN_LIFECYCLE & {
    readonly permanentQlId: "CLS-QL-013";
  };
};

export type GeneratedClsCp007PermanentQuestion =
  | GeneratedClsCp007PermanentClusterQuestion
  | GeneratedClsCp007PermanentClusterPairQuestion;

export function generateClsCp007PermanentClusterQuestion(
  prototypeId: ClsCp007PrototypeId,
  seed: number,
  optionCount: 4 | 5 = 4,
): GeneratedClsCp007PermanentClusterQuestion {
  const question = generateClsCp007QualityQuestion(prototypeId, seed, optionCount);
  return {
    ...question,
    permanentQlId: "CLS-QL-012",
    solveContract: "CP007-FIND-ODD-LETTER-CLUSTER",
    metadata: {
      ...question.metadata,
      runtimeVersion: "cls-cp007-permanent-english-v1",
      sourceSaturationStatus: "SOURCE_GAP_CLOSED__TWO_CONTRACTS_FROZEN",
    },
    lifecycle: {
      ...FROZEN_LIFECYCLE,
      permanentQlId: "CLS-QL-012",
    },
  };
}

export function generateClsCp007PermanentClusterPairQuestion(
  seed: number,
  optionCount: 4 | 5 = 4,
): GeneratedClsCp007PermanentClusterPairQuestion {
  const question = generateClsCp007PairQuestion(seed, optionCount);
  return {
    ...question,
    permanentQlId: "CLS-QL-013",
    solveContract: "CP007-FIND-ODD-LETTER-CLUSTER-PAIR",
    metadata: {
      ...question.metadata,
      runtimeVersion: "cls-cp007-permanent-english-v1",
      sourceSaturationStatus: "SOURCE_GAP_CLOSED__TWO_CONTRACTS_FROZEN",
    },
    lifecycle: {
      ...FROZEN_LIFECYCLE,
      permanentQlId: "CLS-QL-013",
    },
  };
}
