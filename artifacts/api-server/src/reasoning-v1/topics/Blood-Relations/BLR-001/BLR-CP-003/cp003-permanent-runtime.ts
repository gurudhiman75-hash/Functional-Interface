import { stableHash } from "../foundation/prng";
import type { BlrCp003PermanentQlId } from "./cp003-final-authority-audit";
import {
  blrCp003FinalGroupKey,
  generateBlrCp003FinalApprovedBank,
  type BlrCp003FinalApprovedRecord,
  type BlrCp003FinalSourceBank,
} from "./cp003-final-approved-bank";
import {
  getBlrCp003PermanentContract,
  type BlrCp003PermanentContract,
} from "./cp003-permanent-contracts";

export const BLR_CP003_PERMANENT_RUNTIME_VERSION =
  "blr-cp003-permanent-runtime-v1" as const;

export type GeneratedBlrCp003PermanentQuestion = Omit<
  BlrCp003FinalApprovedRecord,
  "metadata"
> & {
  metadata: BlrCp003FinalApprovedRecord["metadata"] & {
    permanentRuntimeVersion: typeof BLR_CP003_PERMANENT_RUNTIME_VERSION;
    solveAuthority: BlrCp003PermanentContract["solveAuthority"];
    contractStatus: "ENGLISH_DISCOVERY_FROZEN";
    runtimeSemanticFingerprint: string;
  };
};

export interface GeneratedBlrCp003PermanentQuestionGroup {
  packageId: "BLR-001";
  checkpointId: "BLR-CP-003";
  groupId: string;
  permanentQlIds: readonly BlrCp003PermanentQlId[];
  prototypeOnly: false;
  reviewOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  questionBankEligible: false;
  mockTestEligible: false;
  locale: "en-IN";
  sourceBank: BlrCp003FinalSourceBank;
  seed: number;
  scenarioId: string;
  topologyId: string;
  sharedPrompt: string;
  questions: readonly GeneratedBlrCp003PermanentQuestion[];
  metadata: {
    runtimeVersion: typeof BLR_CP003_PERMANENT_RUNTIME_VERSION;
    finalDiscoveryFreezeApproved: true;
    sharedPromptSolvedOnce: true;
    allItemsIndependentlySolved: true;
    itemCount: number;
    semanticFingerprint: string;
  };
}

function positiveModulo(value: number, modulus: number): number {
  if (!Number.isFinite(value)) {
    throw new Error(`BLR-CP-003 seed must be finite; received ${value}.`);
  }
  return ((Math.trunc(value) % modulus) + modulus) % modulus;
}

const FINAL_BANK = generateBlrCp003FinalApprovedBank();

function toPermanentQuestion(
  record: BlrCp003FinalApprovedRecord,
): GeneratedBlrCp003PermanentQuestion {
  const contract = getBlrCp003PermanentContract(record.permanentQlId);
  if (contract.solveAuthority !== record.finalAuthority) {
    throw new Error(
      `BLR-CP-003 contract mismatch for ${record.itemId}: ${contract.solveAuthority} versus ${record.finalAuthority}.`,
    );
  }
  return {
    ...record,
    metadata: {
      ...record.metadata,
      permanentRuntimeVersion: BLR_CP003_PERMANENT_RUNTIME_VERSION,
      solveAuthority: contract.solveAuthority,
      contractStatus: "ENGLISH_DISCOVERY_FROZEN",
      runtimeSemanticFingerprint: stableHash([
        record.metadata.semanticFingerprint,
        BLR_CP003_PERMANENT_RUNTIME_VERSION,
        contract.qlId,
        contract.solveAuthority,
      ]),
    },
  };
}

export function generateBlrCp003Question(
  qlId: BlrCp003PermanentQlId,
  seed: number,
): GeneratedBlrCp003PermanentQuestion {
  const contract = getBlrCp003PermanentContract(qlId);
  const pool = FINAL_BANK.filter((record) => record.permanentQlId === qlId);
  if (!pool.length) {
    throw new Error(`No frozen BLR-CP-003 records exist for ${qlId}.`);
  }
  const selected = pool[positiveModulo(seed, pool.length)]!;
  const question = toPermanentQuestion(selected);
  if (question.metadata.solveAuthority !== contract.solveAuthority) {
    throw new Error(`BLR-CP-003 runtime selected the wrong authority for ${qlId}.`);
  }
  return question;
}

type GroupBucket = {
  key: string;
  records: BlrCp003FinalApprovedRecord[];
};

function permanentGroupBuckets(): readonly GroupBucket[] {
  const groups = new Map<string, BlrCp003FinalApprovedRecord[]>();
  for (const record of FINAL_BANK) {
    const key = blrCp003FinalGroupKey(record);
    const group = groups.get(key) ?? [];
    group.push(record);
    groups.set(key, group);
  }
  return [...groups.entries()]
    .map(([key, records]) => ({
      key,
      records: records.sort((left, right) =>
        left.itemId.localeCompare(right.itemId, "en-IN"),
      ),
    }))
    .sort((left, right) => left.key.localeCompare(right.key, "en-IN"));
}

const PERMANENT_GROUPS = permanentGroupBuckets();

export function blrCp003PermanentGroupCount(): number {
  return PERMANENT_GROUPS.length;
}

export function generateBlrCp003QuestionGroup(
  seed: number,
): GeneratedBlrCp003PermanentQuestionGroup {
  const bucket = PERMANENT_GROUPS[
    positiveModulo(seed, PERMANENT_GROUPS.length)
  ];
  if (!bucket) throw new Error("BLR-CP-003 permanent group bank is empty.");
  const [first, ...rest] = bucket.records;
  if (!first) throw new Error(`BLR-CP-003 group ${bucket.key} has no records.`);
  for (const record of rest) {
    if (
      record.sharedPrompt !== first.sharedPrompt ||
      record.scenarioId !== first.scenarioId ||
      record.topologyId !== first.topologyId ||
      record.sourceBank !== first.sourceBank ||
      record.seed !== first.seed
    ) {
      throw new Error(`BLR-CP-003 group ${bucket.key} is internally inconsistent.`);
    }
  }
  const questions = bucket.records.map(toPermanentQuestion);
  const permanentQlIds = [
    ...new Set(questions.map((question) => question.permanentQlId)),
  ];
  return {
    packageId: "BLR-001",
    checkpointId: "BLR-CP-003",
    groupId: `BLR-CP003-GRP-${stableHash([bucket.key])}`,
    permanentQlIds,
    prototypeOnly: false,
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
    locale: "en-IN",
    sourceBank: first.sourceBank,
    seed: first.seed,
    scenarioId: first.scenarioId,
    topologyId: first.topologyId,
    sharedPrompt: first.sharedPrompt,
    questions,
    metadata: {
      runtimeVersion: BLR_CP003_PERMANENT_RUNTIME_VERSION,
      finalDiscoveryFreezeApproved: true,
      sharedPromptSolvedOnce: true,
      allItemsIndependentlySolved: true,
      itemCount: questions.length,
      semanticFingerprint: stableHash([
        BLR_CP003_PERMANENT_RUNTIME_VERSION,
        bucket.key,
        ...questions.map(
          (question) => question.metadata.runtimeSemanticFingerprint,
        ),
      ]),
    },
  };
}
