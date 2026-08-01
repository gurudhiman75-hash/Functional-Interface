import { stableHash } from "../foundation/prng";
import { generateBlrCp004FrozenBank } from "./cp004-bank";
import {
  BLR_CP004_RUNTIME_VERSION,
  contractForQl,
  positiveModulo,
  type BlrCp004QlId,
  type GeneratedBlrCp004Question,
} from "./cp004-model";

export function generateBlrCp004Question(
  qlId: BlrCp004QlId,
  seed: number,
): GeneratedBlrCp004Question {
  const contract = contractForQl(qlId);
  const pool = generateBlrCp004FrozenBank().filter(
    (question) => question.qlId === qlId,
  );
  if (!pool.length) throw new Error(`No frozen BLR-CP-004 questions exist for ${qlId}.`);
  const question = pool[positiveModulo(seed, pool.length)]!;
  if (question.solveAuthority !== contract.solveAuthority) {
    throw new Error(`BLR-CP-004 runtime selected the wrong authority for ${qlId}.`);
  }
  return question;
}

export interface GeneratedBlrCp004QuestionGroup {
  packageId: "BLR-001";
  checkpointId: "BLR-CP-004";
  groupId: string;
  permanentQlIds: readonly BlrCp004QlId[];
  prototypeOnly: false;
  reviewOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  questionBankEligible: false;
  mockTestEligible: false;
  locale: "en-IN";
  sourceGroupKey: string;
  sharedPrompt: string;
  questions: readonly GeneratedBlrCp004Question[];
  metadata: {
    runtimeVersion: typeof BLR_CP004_RUNTIME_VERSION;
    finalDiscoveryFreezeApproved: true;
    sharedPromptSolvedOnce: true;
    itemCount: number;
    semanticFingerprint: string;
  };
}

export function generateBlrCp004QuestionGroup(
  seed: number,
): GeneratedBlrCp004QuestionGroup {
  const groups = new Map<string, GeneratedBlrCp004Question[]>();
  for (const question of generateBlrCp004FrozenBank()) {
    const entries = groups.get(question.sourceGroupKey) ?? [];
    entries.push(question);
    groups.set(question.sourceGroupKey, entries);
  }
  const ordered = [...groups.entries()].sort(([left], [right]) =>
    left.localeCompare(right, "en-IN"),
  );
  const selected = ordered[positiveModulo(seed, ordered.length)];
  if (!selected) throw new Error("BLR-CP-004 grouped bank is empty.");
  const [sourceGroupKey, records] = selected;
  const questions = [...records].sort((left, right) =>
    left.itemId.localeCompare(right.itemId, "en-IN"),
  );
  const sharedPrompt = questions[0]?.sharedPrompt;
  if (!sharedPrompt || questions.some((question) => question.sharedPrompt !== sharedPrompt)) {
    throw new Error(`Inconsistent BLR-CP-004 group ${sourceGroupKey}.`);
  }
  return {
    packageId: "BLR-001",
    checkpointId: "BLR-CP-004",
    groupId: `BLR-CP004-GRP-${stableHash([sourceGroupKey])}`,
    permanentQlIds: [...new Set(questions.map((question) => question.qlId))],
    prototypeOnly: false,
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
    locale: "en-IN",
    sourceGroupKey,
    sharedPrompt,
    questions,
    metadata: {
      runtimeVersion: BLR_CP004_RUNTIME_VERSION,
      finalDiscoveryFreezeApproved: true,
      sharedPromptSolvedOnce: true,
      itemCount: questions.length,
      semanticFingerprint: stableHash([
        BLR_CP004_RUNTIME_VERSION,
        sourceGroupKey,
        ...questions.map((question) => question.metadata.semanticFingerprint),
      ]),
    },
  };
}
