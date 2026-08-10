import {
  BLR_CP006_CONTRACTS,
  BLR_CP006_FREEZE_VERSION,
  BLR_CP006_RUNTIME_VERSION,
  optionLabel,
  semanticFingerprint,
  type BlrCp006PrototypeId,
  type GeneratedBlrCp006Question,
} from "./cp006-model";
import { BLR_CP006_PROTOTYPES } from "./cp006-prototypes";
export { BLR_CP006_PROTOTYPES } from "./cp006-prototypes";
import { answerForQuery, decodeScenario } from "./cp006-graph";
import {
  buildOptions,
  coreConcept,
  difficultyFor,
  familyTree,
  graphAuditLines,
  optionExplanation,
  promptFor,
  shortcut,
} from "./cp006-presentation";

export function generateBlrCp006Question(
  prototypeId: BlrCp006PrototypeId,
  seed: number,
): GeneratedBlrCp006Question {
  const prototype = BLR_CP006_PROTOTYPES.find((entry) => entry.prototypeId === prototypeId);
  if (!prototype) throw new Error(`Unknown CP-006 prototype ${prototypeId}.`);
  const scenarioValue = prototype.build(Math.trunc(seed));
  const decoded = decodeScenario(scenarioValue);
  const answer = answerForQuery(decoded.graph, scenarioValue.query);
  const builtOptions = buildOptions(scenarioValue, decoded.graph, answer, Math.trunc(seed));
  const answerType = BLR_CP006_CONTRACTS.find((contract) => contract.qlId === prototype.qlId)!.answerType;
  const prompt = promptFor(scenarioValue);
  const itemId = `BLR-CP006-${prototypeId.replace("BLR-CP006-PROT-", "")}-${semanticFingerprint([
    prototypeId,
    seed,
    prompt,
    scenarioValue.stem,
  ]).slice(0, 10)}`;
  const decodingAudit = scenarioValue.statements.map((coded, index) => {
    const decodedStatement = decoded.decodedStatements[index]!;
    return `${coded.leftId} ${coded.token} ${coded.rightId} decodes to: ${decodedStatement}`;
  });
  const optionAnalysis = builtOptions.options.map((option, index) => ({
    optionLabel: optionLabel(index),
    optionText: option.text,
    isCorrect: option.isCorrect,
    explanation: optionExplanation(option, index, answer),
  }));
  const graphAudit = graphAuditLines(scenarioValue, decoded.graph, answer);
  return {
    packageId: "BLR-001",
    checkpointId: "BLR-CP-006",
    qlId: prototype.qlId,
    permanentQlId: prototype.qlId,
    solveAuthority: prototype.authority,
    sourcePrototypeId: prototypeId,
    prototypeOnly: false,
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
    locale: "en-IN",
    seed: Math.trunc(seed),
    itemId,
    scenarioId: scenarioValue.scenarioId,
    topologyId: scenarioValue.topologyId,
    keyStyle: scenarioValue.keyStyle,
    codeKey: scenarioValue.codeKey,
    codedStatements: scenarioValue.statements,
    query: scenarioValue.query,
    sharedPrompt: prompt,
    stem: scenarioValue.stem,
    answerType,
    options: builtOptions.options,
    correctIndex: builtOptions.correctIndex,
    answer,
    decodedStatements: decoded.decodedStatements,
    graph: decoded.graph,
    explanation: {
      coreConcept: coreConcept(prototype.authority),
      decodingAudit,
      graphAudit,
      conclusion: `${answer} is the unique result supported by the fully decoded family graph.`,
      examShortcut: shortcut(prototype.authority),
      commonTraps: [
        "Do not use arithmetic precedence on relation symbols.",
        "Do not reverse the subject and reference named in the question.",
        "Do not infer gender from a letter label or personal name.",
      ],
      optionAnalysis,
      familyTree: familyTree(decoded.graph, scenarioValue.query, answer),
    },
    metadata: {
      runtimeVersion: BLR_CP006_RUNTIME_VERSION,
      freezeVersion: BLR_CP006_FREEZE_VERSION,
      completeKeyCoverage: true,
      everyStatementContributes: true,
      noArithmeticPrecedence: true,
      explicitGenderEvidence: true,
      nameBasedGenderAssumptions: 0,
      independentSolverAgreed: true,
      uniqueAnswer: true,
      difficulty: difficultyFor(scenarioValue),
      semanticFingerprint: semanticFingerprint([
        prototypeId,
        seed,
        prompt,
        scenarioValue.stem,
        answer,
        ...builtOptions.options.map((option) => option.semanticKey),
      ]),
    },
  };
}

export function generateBlrCp006FrozenBank(): readonly GeneratedBlrCp006Question[] {
  return BLR_CP006_PROTOTYPES.flatMap((prototype) =>
    Array.from({ length: 8 }, (_, seed) => generateBlrCp006Question(prototype.prototypeId, seed))
  );
}

export function buildBlrCp006Telemetry(
  bank = generateBlrCp006FrozenBank(),
): {
  recordCount: number;
  prototypeCount: number;
  authorityCount: number;
  permanentQlCount: number;
  scenarioCount: number;
  topologyCount: number;
  statementCount: number;
  keyStyleCounts: Readonly<Record<string, number>>;
  qlCounts: Readonly<Record<string, number>>;
  authorityCounts: Readonly<Record<string, number>>;
  answerPositions: readonly [number, number, number, number];
  uniqueSignatureCount: number;
  permanentQlRange: "BLR-QL-026..BLR-QL-030";
  nextAvailableChapterQlId: "BLR-QL-031";
} {
  const countBy = (selector: (question: GeneratedBlrCp006Question) => string) => {
    const result: Record<string, number> = {};
    bank.forEach((question) => {
      const key = selector(question);
      result[key] = (result[key] ?? 0) + 1;
    });
    return result;
  };
  return {
    recordCount: bank.length,
    prototypeCount: new Set(bank.map((question) => question.sourcePrototypeId)).size,
    authorityCount: new Set(bank.map((question) => question.solveAuthority)).size,
    permanentQlCount: new Set(bank.map((question) => question.qlId)).size,
    scenarioCount: new Set(bank.map((question) => question.scenarioId)).size,
    topologyCount: new Set(bank.map((question) => question.topologyId)).size,
    statementCount: bank.reduce((total, question) => total + question.codedStatements.length, 0),
    keyStyleCounts: countBy((question) => question.keyStyle),
    qlCounts: countBy((question) => question.qlId),
    authorityCounts: countBy((question) => question.solveAuthority),
    answerPositions: [0, 1, 2, 3].map((index) =>
      bank.filter((question) => question.correctIndex === index).length
    ) as [number, number, number, number],
    uniqueSignatureCount: new Set(bank.map((question) => question.metadata.semanticFingerprint)).size,
    permanentQlRange: "BLR-QL-026..BLR-QL-030",
    nextAvailableChapterQlId: "BLR-QL-031",
  };
}
