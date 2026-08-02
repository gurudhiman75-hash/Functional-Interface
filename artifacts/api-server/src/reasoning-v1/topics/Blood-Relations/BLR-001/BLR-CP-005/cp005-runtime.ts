import { generateBlrCp005FrozenBank, questionsForQl } from "./cp005-bank";
import { BLR_CP005_FREEZE_VERSION, BLR_CP005_RUNTIME_VERSION, type BlrCp005QlId, type GeneratedBlrCp005Question } from "./cp005-model";

function positiveModulo(value: number, modulus: number): number {
  if (!Number.isFinite(value)) throw new Error(`CP-005 seed must be finite: ${value}.`);
  return ((Math.trunc(value) % modulus) + modulus) % modulus;
}

export interface GeneratedBlrCp005QuestionGroup {
  packageId: "BLR-001";
  checkpointId: "BLR-CP-005";
  groupId: string;
  seed: number;
  locale: "en-IN";
  sharedPrompt: string;
  scenarioId: string;
  topologyId: string;
  permanentQlIds: readonly BlrCp005QlId[];
  questions: readonly GeneratedBlrCp005Question[];
  modelCount: number;
  familyTrees: GeneratedBlrCp005Question["explanation"]["familyTrees"];
  metadata: {
    runtimeVersion: typeof BLR_CP005_RUNTIME_VERSION;
    freezeVersion: typeof BLR_CP005_FREEZE_VERSION;
    sharedModelSpaceSolvedOnce: true;
    completeModelEnumeration: true;
    finalDiscoveryFreezeApproved: true;
  };
}

let cachedBank: readonly GeneratedBlrCp005Question[] | null = null;
function bank(): readonly GeneratedBlrCp005Question[] {
  cachedBank ??= generateBlrCp005FrozenBank();
  return cachedBank;
}

export function generateBlrCp005Question(
  qlId: BlrCp005QlId,
  seed: number,
): GeneratedBlrCp005Question {
  const pool = questionsForQl(qlId);
  if (!pool.length) throw new Error(`No CP-005 frozen questions for ${qlId}.`);
  return pool[positiveModulo(seed, pool.length)]!;
}

export function generateBlrCp005QuestionGroup(seed: number): GeneratedBlrCp005QuestionGroup {
  const groups = new Map<string, GeneratedBlrCp005Question[]>();
  for (const question of bank()) {
    const rows = groups.get(question.groupKey) ?? [];
    rows.push(question);
    groups.set(question.groupKey, rows);
  }
  const entries = [...groups.entries()].sort(([left], [right]) => left.localeCompare(right, "en-IN"));
  const [groupId, questions] = entries[positiveModulo(seed, entries.length)]!;
  const ordered = [...questions].sort((left, right) =>
    `${left.qlId}:${left.sourcePrototypeId}`.localeCompare(`${right.qlId}:${right.sourcePrototypeId}`, "en-IN"),
  );
  const first = ordered[0]!;
  for (const question of ordered) {
    if (question.sharedPrompt !== first.sharedPrompt) throw new Error(`${groupId}: shared prompt mismatch.`);
    if (question.scenarioId !== first.scenarioId || question.topologyId !== first.topologyId) {
      throw new Error(`${groupId}: model-space identity mismatch.`);
    }
    if (JSON.stringify(question.modelSpace.modelFingerprints) !== JSON.stringify(first.modelSpace.modelFingerprints)) {
      throw new Error(`${groupId}: model fingerprints mismatch.`);
    }
  }
  return {
    packageId: "BLR-001",
    checkpointId: "BLR-CP-005",
    groupId,
    seed: Math.trunc(seed),
    locale: "en-IN",
    sharedPrompt: first.sharedPrompt,
    scenarioId: first.scenarioId,
    topologyId: first.topologyId,
    permanentQlIds: [...new Set(ordered.map((question) => question.qlId))],
    questions: ordered,
    modelCount: first.modelSpace.modelCount,
    familyTrees: first.explanation.familyTrees,
    metadata: {
      runtimeVersion: BLR_CP005_RUNTIME_VERSION,
      freezeVersion: BLR_CP005_FREEZE_VERSION,
      sharedModelSpaceSolvedOnce: true,
      completeModelEnumeration: true,
      finalDiscoveryFreezeApproved: true,
    },
  };
}
