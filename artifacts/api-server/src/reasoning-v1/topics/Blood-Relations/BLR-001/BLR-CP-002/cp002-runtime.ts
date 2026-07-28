import { allBlrCp002CanonicalScenarios } from "./cp002-canonical-scenario-registry";
import {
  getBlrCp002PermanentContract,
  type BlrCp002QlId,
} from "./cp002-permanent-contracts";
import { generateBlrCp002ScenarioReviewQuestion } from "./cp002-review-registry";
import type {
  BlrCp002PrototypeId,
  GeneratedBlrCp002PrototypeQuestion,
} from "./cp002-types";

export interface BlrCp002PermanentQuestion {
  packageId: "BLR-001";
  checkpointId: "BLR-CP-002";
  qlId: BlrCp002QlId;
  permanentQlId: BlrCp002QlId;
  prototypeOnly: false;
  reviewOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  questionBankEligible: false;
  mockTestEligible: false;
  ruleId: GeneratedBlrCp002PrototypeQuestion["ruleId"];
  seed: number;
  locale: "en-IN";
  difficulty: GeneratedBlrCp002PrototypeQuestion["difficulty"];
  renderer: GeneratedBlrCp002PrototypeQuestion["renderer"];
  answerType: GeneratedBlrCp002PrototypeQuestion["answerType"];
  stem: string;
  structuredPrompt: GeneratedBlrCp002PrototypeQuestion["structuredPrompt"];
  options: GeneratedBlrCp002PrototypeQuestion["options"];
  correctIndex: number;
  explanation: GeneratedBlrCp002PrototypeQuestion["explanation"];
  metadata: Omit<GeneratedBlrCp002PrototypeQuestion["metadata"], "runtimeVersion"> & {
    runtimeVersion: "blr-cp002-runtime-v1";
    qlId: BlrCp002QlId;
    solveAuthority: "RESOLVE_ANCHORED_ROLE_CHAIN_RELATION";
    sourcePrototypeId: BlrCp002PrototypeId;
    sourceScenarioId: string;
    sourceRuntimeVersion: string;
    sourceSeed: number;
  };
}

function canonicalScenarioForSeed(seed: number) {
  const scenarios = allBlrCp002CanonicalScenarios();
  const index = ((Math.trunc(seed) % scenarios.length) + scenarios.length) % scenarios.length;
  return scenarios[index]!;
}

export function generateBlrCp002Question(
  qlId: BlrCp002QlId,
  seed = 0,
): BlrCp002PermanentQuestion {
  const contract = getBlrCp002PermanentContract(qlId);
  const scenario = canonicalScenarioForSeed(seed);
  const source = generateBlrCp002ScenarioReviewQuestion(scenario.scenarioId, seed);
  const {
    runtimeVersion: sourceRuntimeVersion,
    scenarioId: sourceScenarioId,
    ...sourceMetadata
  } = source.metadata;

  if (!contract.sourcePrototypeIds.includes(source.prototypeId)) {
    throw new Error(`Source prototype mismatch for ${qlId}.`);
  }
  if (!contract.questionForms.includes(source.metadata.questionForm)) {
    throw new Error(`Question-form mismatch for ${qlId}.`);
  }
  if (source.answerType !== contract.answerType) {
    throw new Error(`Answer-type mismatch for ${qlId}.`);
  }

  return {
    packageId: "BLR-001",
    checkpointId: "BLR-CP-002",
    qlId,
    permanentQlId: qlId,
    prototypeOnly: false,
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
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
      runtimeVersion: "blr-cp002-runtime-v1",
      qlId,
      solveAuthority: contract.solveAuthority,
      sourcePrototypeId: source.prototypeId,
      sourceScenarioId,
      sourceRuntimeVersion,
      sourceSeed: seed,
    },
  };
}
