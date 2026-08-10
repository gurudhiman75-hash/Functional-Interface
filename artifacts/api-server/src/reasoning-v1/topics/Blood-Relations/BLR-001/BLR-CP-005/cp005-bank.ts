import {
  BLR_CP005_APPROVAL_DATE,
  BLR_CP005_FREEZE_VERSION,
  BLR_CP005_OWNER_DIRECTIVE,
  BLR_CP005_RUNTIME_VERSION,
  contractForAuthority,
  difficultyFor,
  familyTreeForModel,
  graphFingerprint,
  semanticFingerprint,
  type BlrCp005PrototypeId,
  type BlrCp005QlId,
  type GeneratedBlrCp005Question,
} from "./cp005-model";
import { BLR_CP005_PROTOTYPE_CASES, prototypeCase } from "./cp005-scenarios";
import { solveBlrCp005Query } from "./cp005-solver";
import { buildOptions } from "./cp005-options";
import {
  BLR_CP005_EDITORIAL_VERSION,
  buildCp005EditorialExplanation,
  examGradeSharedPrompt,
  examGradeStem,
} from "./cp005-editorial";
import { polishCp005ModelAudit } from "./cp005-editorial-polish";
import {
  BLR_CP005_GENDER_EVIDENCE_VERSION,
  applyCp005GenderEvidence,
} from "./cp005-gender-evidence";

export function generateBlrCp005Question(
  prototypeId: BlrCp005PrototypeId,
  seed: number,
): GeneratedBlrCp005Question {
  if (!Number.isFinite(seed)) throw new Error(`CP-005 seed must be finite: ${seed}.`);
  const prototype = prototypeCase(prototypeId);
  const built = applyCp005GenderEvidence(
    prototypeId,
    prototype.build(Math.trunc(seed)),
  );
  const contract = contractForAuthority(prototype.authority);
  if (!contract.sourcePrototypeIds.includes(prototypeId)) throw new Error(`${prototypeId} is outside ${prototype.authority}.`);
  const solved = solveBlrCp005Query(built.modelSpace, built.querySpec);
  const { options, correctIndex } = buildOptions(prototypeId, seed, built, solved);
  const answerLabel = options[correctIndex]!.text;
  const sharedPrompt = examGradeSharedPrompt(built.modelSpace.sharedPrompt);
  const stem = examGradeStem({
    prototypeId,
    modelSpace: built.modelSpace,
    querySpec: built.querySpec,
    originalStem: built.stem,
  });
  const editorial = buildCp005EditorialExplanation({
    authority: prototype.authority,
    modelSpace: built.modelSpace,
    querySpec: built.querySpec,
    solved,
    options,
    correctIndex,
    answerLabel,
  });
  const relationQuery = built.querySpec.kind === "INVARIANT_RELATION" || built.querySpec.kind === "RELATION_UNCERTAINTY"
    ? { subjectId: built.querySpec.subjectId, referenceId: built.querySpec.referenceId }
    : undefined;
  const itemId = `BLR-CP005-${prototypeId.replace("BLR-CP005-PROT-", "")}-${semanticFingerprint([built.modelSpace.groupKey, seed]).slice(0, 8)}`;
  const optionStatusMix = new Set(options.map((option) => option.modelStatus).filter(Boolean)).size;
  return {
    packageId: "BLR-001", checkpointId: "BLR-CP-005",
    qlId: contract.qlId, permanentQlId: contract.qlId,
    solveAuthority: prototype.authority, sourcePrototypeId: prototypeId,
    prototypeOnly: false, reviewOnly: true, publiclyPublishable: false,
    questionStudioVisible: false, questionBankEligible: false, mockTestEligible: false,
    locale: "en-IN", seed: Math.trunc(seed), itemId,
    scenarioId: built.modelSpace.scenarioId, topologyId: built.modelSpace.topologyId,
    groupKey: built.modelSpace.groupKey, sharedPrompt,
    stem, answerType: contract.answerType,
    options, correctIndex, querySpec: built.querySpec, answer: solved.answer,
    modelSpace: {
      variables: built.modelSpace.variables,
      modelCount: built.modelSpace.models.length,
      modelFingerprints: built.modelSpace.models.map((model) => graphFingerprint(model.graph)),
      assignments: built.modelSpace.models.map((model) => model.assignment),
    },
    explanation: {
      ...editorial,
      modelAudit: polishCp005ModelAudit(editorial.modelAudit),
      familyTrees: built.modelSpace.models.map((model, index) => familyTreeForModel(model, index, built.modelSpace.models.length, answerLabel, relationQuery)),
    },
    metadata: {
      runtimeVersion: BLR_CP005_RUNTIME_VERSION, freezeVersion: BLR_CP005_FREEZE_VERSION,
      approvalDate: BLR_CP005_APPROVAL_DATE, approvedBy: "PROJECT_OWNER", ownerDirective: BLR_CP005_OWNER_DIRECTIVE,
      structuralSaturationApproved: true, finalDiscoveryFreezeApproved: true,
      completeModelEnumeration: true, independentVerifierAgreed: true,
      uniqueAnswer: true, optionSemanticsUnique: true,
      difficulty: difficultyFor(built.modelSpace.models.length, optionStatusMix, prototype.authority.includes("UNCERTAINTY") || prototype.authority.includes("COUNT")),
      modelCount: built.modelSpace.models.length,
      semanticFingerprint: semanticFingerprint([
        prototypeId, seed, built.modelSpace.scenarioId,
        BLR_CP005_EDITORIAL_VERSION, BLR_CP005_GENDER_EVIDENCE_VERSION,
        sharedPrompt, stem,
        ...built.modelSpace.models.map((model) => graphFingerprint(model.graph)),
        ...options.map((option) => option.semanticKey), correctIndex,
      ]),
    },
  };
}

export function generateBlrCp005FrozenBank(): readonly GeneratedBlrCp005Question[] {
  const records: GeneratedBlrCp005Question[] = [];
  for (const prototype of BLR_CP005_PROTOTYPE_CASES) {
    for (let seed = 0; seed < 8; seed += 1) records.push(generateBlrCp005Question(prototype.prototypeId, seed));
  }
  return records;
}

export interface BlrCp005Telemetry {
  recordCount: number;
  groupCount: number;
  scenarioCount: number;
  topologyCount: number;
  prototypeCount: number;
  authorityCount: number;
  permanentQlCount: number;
  modelCountRange: readonly [number, number];
  totalEnumeratedModels: number;
  answerPositions: readonly [number, number, number, number];
  difficultyCounts: Readonly<Record<string, number>>;
  prototypeCounts: Readonly<Record<string, number>>;
  qlCounts: Readonly<Record<string, number>>;
  uniqueQuestionSignatureCount: number;
  questionSignatureUniquenessRatio: number;
  permanentQlRange: "BLR-QL-018..BLR-QL-025";
  nextAvailableChapterQlId: "BLR-QL-026";
}

export function buildBlrCp005Telemetry(bank = generateBlrCp005FrozenBank()): BlrCp005Telemetry {
  const countBy = (selector: (question: GeneratedBlrCp005Question) => string) => {
    const result: Record<string, number> = {};
    for (const question of bank) {
      const key = selector(question);
      result[key] = (result[key] ?? 0) + 1;
    }
    return result;
  };
  const signatures = new Set(bank.map((question) => semanticFingerprint([
    question.sharedPrompt, question.stem, ...question.options.map((option) => option.text), question.correctIndex,
  ])));
  const modelCounts = bank.map((question) => question.modelSpace.modelCount);
  return {
    recordCount: bank.length,
    groupCount: new Set(bank.map((question) => question.groupKey)).size,
    scenarioCount: new Set(bank.map((question) => question.scenarioId)).size,
    topologyCount: new Set(bank.map((question) => question.topologyId)).size,
    prototypeCount: new Set(bank.map((question) => question.sourcePrototypeId)).size,
    authorityCount: new Set(bank.map((question) => question.solveAuthority)).size,
    permanentQlCount: new Set(bank.map((question) => question.qlId)).size,
    modelCountRange: [Math.min(...modelCounts), Math.max(...modelCounts)],
    totalEnumeratedModels: modelCounts.reduce((total, count) => total + count, 0),
    answerPositions: [0, 1, 2, 3].map((index) => bank.filter((question) => question.correctIndex === index).length) as [number, number, number, number],
    difficultyCounts: countBy((question) => question.metadata.difficulty),
    prototypeCounts: countBy((question) => question.sourcePrototypeId),
    qlCounts: countBy((question) => question.qlId),
    uniqueQuestionSignatureCount: signatures.size,
    questionSignatureUniquenessRatio: signatures.size / bank.length,
    permanentQlRange: "BLR-QL-018..BLR-QL-025",
    nextAvailableChapterQlId: "BLR-QL-026",
  };
}

export function questionsForQl(qlId: BlrCp005QlId): readonly GeneratedBlrCp005Question[] {
  return generateBlrCp005FrozenBank().filter((question) => question.qlId === qlId);
}
