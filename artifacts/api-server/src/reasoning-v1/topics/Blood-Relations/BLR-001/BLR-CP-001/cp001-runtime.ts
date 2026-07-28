import {
  getBlrCp001PermanentContract,
  type BlrCp001QlId,
  type BlrCp001SourcePrototypeId,
} from "./cp001-permanent-contracts";
import {
  getBlrCp001ReviewEntry,
  type BlrCp001ReviewQuestion,
} from "./cp001-review-registry";

export interface BlrCp001PermanentQuestion {
  packageId: "BLR-001";
  checkpointId: "BLR-CP-001";
  qlId: BlrCp001QlId;
  permanentQlId: BlrCp001QlId;
  prototypeOnly: false;
  reviewOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  mockTestEligible: false;
  ruleId: string;
  seed: number;
  locale: "en-IN";
  difficulty: string;
  renderer: string;
  answerType: string;
  stem: string;
  structuredPrompt: BlrCp001ReviewQuestion["structuredPrompt"];
  options: BlrCp001ReviewQuestion["options"];
  correctIndex: number;
  explanation: BlrCp001ReviewQuestion["explanation"];
  metadata: Readonly<Record<string, unknown>> & {
    runtimeVersion: "blr-cp001-runtime-v1";
    qlId: BlrCp001QlId;
    solveAuthority: string;
    sourcePrototypeId: BlrCp001SourcePrototypeId;
    sourceRuntimeVersion: string;
    sourceSeed: number;
    hiddenFingerprint: string;
  };
}

function chooseSourcePrototype(
  qlId: BlrCp001QlId,
  seed: number,
): BlrCp001SourcePrototypeId {
  const sourceIds = getBlrCp001PermanentContract(qlId).sourcePrototypeIds;
  const index =
    ((Math.trunc(seed) % sourceIds.length) + sourceIds.length) %
    sourceIds.length;
  return sourceIds[index]!;
}

export function generateBlrCp001Question(
  qlId: BlrCp001QlId,
  seed = 0,
): BlrCp001PermanentQuestion {
  const contract = getBlrCp001PermanentContract(qlId);
  const sourcePrototypeId = chooseSourcePrototype(qlId, seed);
  const source = getBlrCp001ReviewEntry(sourcePrototypeId).generate(seed);
  const {
    runtimeVersion: sourceRuntimeVersion,
    ...sourceMetadata
  } = source.metadata;

  if (source.answerType !== contract.answerType) {
    throw new Error(`Answer type mismatch for ${qlId}.`);
  }

  return {
    packageId: "BLR-001",
    checkpointId: "BLR-CP-001",
    qlId,
    permanentQlId: qlId,
    prototypeOnly: false,
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    mockTestEligible: false,
    ruleId: source.ruleId,
    seed,
    locale: "en-IN",
    difficulty: source.difficulty,
    renderer: source.renderer,
    answerType: source.answerType,
    stem: source.stem,
    structuredPrompt: source.structuredPrompt,
    options: source.options,
    correctIndex: source.correctIndex,
    explanation: source.explanation,
    metadata: {
      ...sourceMetadata,
      runtimeVersion: "blr-cp001-runtime-v1",
      qlId,
      solveAuthority: contract.solveAuthority,
      sourcePrototypeId,
      sourceRuntimeVersion: String(sourceRuntimeVersion),
      sourceSeed: seed,
      hiddenFingerprint: source.metadata.hiddenFingerprint,
    },
  };
}
