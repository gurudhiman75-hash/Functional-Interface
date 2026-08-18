import {
  WOR_001_PERMANENT_QL_REGISTRY,
  WOR_001_SOURCE_DEFERRED_PROTOTYPE_IDS,
  worPermanentQlIdForPrototype,
} from "./permanent-ql-registry";
import {
  WOR_001_ALL_CHECKPOINTS,
  WOR_001_ALL_PROTOTYPES,
} from "./prototype-registry";

export const WOR_001_QUESTION_STUDIO_EXAM_READINESS_STATUS =
  "EXAM_READY_CONTENT_AUTHORITY_FROZEN" as const;
export const WOR_001_QUESTION_STUDIO_ENGLISH_REVIEW_STATUS =
  "FROZEN_APPROVED" as const;
export const WOR_001_QUESTION_STUDIO_NATIVE_SIGNOFF_STATUS =
  "PENDING_HI_PA" as const;
export const WOR_001_QUESTION_STUDIO_PRODUCTION_REVIEW_STATUS =
  "EXAM_READY_FROZEN_REVIEW_ONLY" as const;
export const WOR_001_QUESTION_STUDIO_RELEASE_FREEZE_STATUS =
  "EXAM_READY_CONTENT_AUTHORITY_FROZEN_PENDING_NATIVE_SIGNOFF" as const;

const productionPrototypeIdSet = new Set(
  WOR_001_PERMANENT_QL_REGISTRY.flatMap((entry) => entry.mappedPrototypeIds),
);

export const WOR_001_QUESTION_STUDIO_PRODUCTION_PROTOTYPES = Object.freeze(
  WOR_001_ALL_PROTOTYPES.filter((prototype) => productionPrototypeIdSet.has(prototype.prototypeId)),
);

export const WOR_001_QUESTION_STUDIO_PRODUCTION_CHECKPOINTS = Object.freeze(
  WOR_001_ALL_CHECKPOINTS.filter((checkpoint) =>
    WOR_001_QUESTION_STUDIO_PRODUCTION_PROTOTYPES.some(
      (prototype) => prototype.checkpointId === checkpoint.checkpointId,
    ),
  ),
);

export const WOR_001_QUESTION_STUDIO_SOURCE_DEFERRED_PROTOTYPE_IDS =
  WOR_001_SOURCE_DEFERRED_PROTOTYPE_IDS;

export function isWor001ProductionQuestionStudioPrototype(prototypeId: string) {
  return productionPrototypeIdSet.has(prototypeId)
    && worPermanentQlIdForPrototype(prototypeId) !== null;
}

export function assertWor001ProductionQuestionStudioPrototype(prototypeId: string) {
  if (!isWor001ProductionQuestionStudioPrototype(prototypeId)) {
    throw new Error(
      `${prototypeId} is source/research-only and is not enabled in the frozen WOR-001 production Question Studio package.`,
    );
  }
}

export function assertWor001ProductionQuestionStudioCheckpoint(checkpointId: string) {
  if (!WOR_001_QUESTION_STUDIO_PRODUCTION_CHECKPOINTS.some(
    (checkpoint) => checkpoint.checkpointId === checkpointId,
  )) {
    throw new Error(
      `${checkpointId} has no frozen release-candidate WOR-001 prototypes enabled for production Question Studio.`,
    );
  }
}

if (WOR_001_QUESTION_STUDIO_PRODUCTION_PROTOTYPES.length !== 15) {
  throw new Error(
    `WOR-001 production Question Studio expected 15 frozen mapped prototypes, found ${WOR_001_QUESTION_STUDIO_PRODUCTION_PROTOTYPES.length}.`,
  );
}
if (WOR_001_QUESTION_STUDIO_SOURCE_DEFERRED_PROTOTYPE_IDS.length !== 9) {
  throw new Error("WOR-001 production Question Studio source-deferred boundary changed unexpectedly.");
}
