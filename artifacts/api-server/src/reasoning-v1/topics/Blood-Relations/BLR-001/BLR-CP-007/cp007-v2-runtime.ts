import {
  BLR_CP007_CONTRACTS,
  semanticFingerprint,
  type BlrCp007PrototypeId,
  type BlrCp007QlId,
} from "./cp007-model";
import { BLR_CP007_PROTOTYPES } from "./cp007-prototypes";
import {
  completeBlrCp007V2Key,
  blrCp007V2KeyPrompt,
} from "./cp007-v2-key";
import {
  decodeBlrCp007V2,
  orderBlrCp007V2Options,
  targetForQuery,
} from "./cp007-v2-option-builder";
import { buildBlrCp007V2EnhancedOptions } from "./cp007-v2-enhanced-option-builder";
import {
  BLR_CP007_V2_DATASET_VERSION,
  BLR_CP007_V2_RUNTIME_VERSION,
  type BlrCp007V2Question,
} from "./cp007-v2-model";
import { buildManualReviewedBlrCp007V2Explanation } from "./cp007-v2-manual-review";
import { blrCp007V2EnhancedScenario } from "./cp007-v2-enhanced-scenarios";
import { blrCp007V2GraphPath } from "./cp007-v2-presentation";

function answerTypeFor(
  qlId: BlrCp007QlId,
): BlrCp007V2Question["answerType"] {
  const contract = BLR_CP007_CONTRACTS.find((entry) => entry.qlId === qlId);
  if (!contract) throw new Error(`Missing CP-007 contract for ${qlId}.`);
  return contract.answerType;
}

function difficultyFor(
  statementCount: number,
  taskKind: BlrCp007V2Question["query"]["kind"],
): "EASY" | "MEDIUM" | "HARD" {
  if (
    statementCount >= 3 ||
    taskKind === "SELECT_VALIDITY" ||
    taskKind === "MISSING_PERSON"
  ) return "HARD";
  if (statementCount === 2 || taskKind === "MISSING_TOKEN_PAIR") return "MEDIUM";
  return "EASY";
}

export function generateBlrCp007V2Question(
  prototypeId: BlrCp007PrototypeId,
  seed: number,
): BlrCp007V2Question {
  if (!Number.isFinite(seed)) throw new Error("CP-007 V2 seed must be finite.");
  const normalizedSeed = Math.trunc(seed);
  const sourceScenario = blrCp007V2EnhancedScenario(prototypeId, normalizedSeed);
  const completeKey = completeBlrCp007V2Key(normalizedSeed);
  const constructionScenario = prototypeId.includes("MISSING-PERSON")
    ? sourceScenario
    : {
        ...sourceScenario,
        keyStyle: completeKey.keyStyle,
        codeKey: completeKey.codeKey,
        sharedPrompt: blrCp007V2KeyPrompt(completeKey.codeKey),
      };
  const rawOptions = buildBlrCp007V2EnhancedOptions(constructionScenario);
  const options = orderBlrCp007V2Options(
    prototypeId,
    normalizedSeed,
    rawOptions,
  );
  const usedTokens = new Set(
    options.flatMap((option) => option.statements.map((statement) => statement.token)),
  );
  const visibleCodeKey = constructionScenario.codeKey.filter((entry) =>
    usedTokens.has(entry.token),
  );
  const scenario = {
    ...constructionScenario,
    codeKey: visibleCodeKey,
    sharedPrompt: blrCp007V2KeyPrompt(visibleCodeKey),
  };
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const selected = options[correctIndex]!;
  const decoded = decodeBlrCp007V2(
    scenario,
    selected.statements,
    "SELECTED_ANSWER",
  );
  const target = targetForQuery(scenario.query) ?? selected.claim;
  const targetPath = blrCp007V2GraphPath(
    decoded.graph,
    target?.subjectId,
    target?.referenceId,
  );
  const questionFingerprint = semanticFingerprint([
    BLR_CP007_V2_RUNTIME_VERSION,
    prototypeId,
    normalizedSeed,
    scenario.sharedPrompt,
    scenario.stem,
    ...options.flatMap((option) => [
      option.text,
      option.isCorrect ? 1 : 0,
      option.failureCode ?? "",
      ...option.statements.flatMap((statement) => [
        statement.leftId,
        statement.token,
        statement.rightId,
      ]),
    ]),
  ]);
  const itemId = `BLR-CP007-V2-${prototypeId.replace(
    "BLR-CP007-PROT-",
    "",
  )}-${questionFingerprint.slice(0, 12)}`;
  const difficulty = difficultyFor(
    selected.statements.length,
    scenario.query.kind,
  );
  const stem =
    scenario.query.kind === "MISSING_TOKEN" ||
    scenario.query.kind === "MISSING_TOKEN_PAIR" ||
    scenario.query.kind === "MISSING_PERSON"
      ? `${scenario.stem}\n\n${scenario.query.expressionLines.join("\n")}`
      : scenario.stem;

  return {
    packageId: "BLR-001",
    checkpointId: "BLR-CP-007",
    qlId: scenario.qlId,
    permanentQlId: scenario.qlId,
    solveAuthority: scenario.authority,
    sourcePrototypeId: prototypeId,
    prototypeOnly: false,
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
    locale: "en-IN",
    seed: normalizedSeed,
    itemId,
    scenarioId: scenario.scenarioId,
    topologyId: scenario.topologyId,
    keyStyle: scenario.keyStyle,
    codeKey: scenario.codeKey,
    query: scenario.query,
    sharedPrompt: scenario.sharedPrompt,
    stem,
    answerType: answerTypeFor(scenario.qlId),
    options,
    correctIndex,
    answer: selected.text,
    completedStatements: selected.statements,
    decodedStatements: decoded.decodedStatements,
    graph: decoded.graph,
    explanation: buildManualReviewedBlrCp007V2Explanation(
      scenario,
      options,
      selected,
      decoded.graph,
    ),
    adminProof: {
      questionId: itemId,
      seed: normalizedSeed,
      qlId: scenario.qlId,
      prototypeId,
      taskKind: scenario.query.kind,
      difficulty,
      tokenMapId: semanticFingerprint(
        scenario.codeKey.flatMap((entry) => [entry.token, entry.relationId]),
      ).slice(0, 16),
      familyTopologyId: scenario.topologyId,
      targetRelation: target?.relationId,
      targetPath,
      semanticFingerprint: questionFingerprint,
      independentSolverStatus: "AWAITING_EXTERNAL_VERIFIER",
      uniqueCorrectOptionCount: 1,
      allOptionGraphsValid: true,
      rendererValidationStatus: "AWAITING_EXPORT_VALIDATION",
      datasetVersion: BLR_CP007_V2_DATASET_VERSION,
      runtimeVersion: BLR_CP007_V2_RUNTIME_VERSION,
      siblingPolicy: "FULL_SIBLING_UNLESS_EXPLICITLY_QUALIFIED",
      halfRelationsInScope: false,
      reviewStatus: "HUMAN_REVIEW_REQUIRED",
      reviewerNote: "",
    },
  };
}

export function generateBlrCp007V2Bank(): readonly BlrCp007V2Question[] {
  return BLR_CP007_PROTOTYPES.flatMap((prototype) =>
    Array.from({ length: 8 }, (_, seed) =>
      generateBlrCp007V2Question(prototype.prototypeId, seed),
    ),
  );
}

export function buildBlrCp007V2Telemetry(
  bank = generateBlrCp007V2Bank(),
) {
  const qlCounts: Record<string, number> = {};
  const answerPositions = [0, 0, 0, 0] as [number, number, number, number];
  for (const question of bank) {
    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    answerPositions[question.correctIndex] += 1;
  }
  return {
    recordCount: bank.length,
    prototypeCount: new Set(bank.map((question) => question.sourcePrototypeId)).size,
    authorityCount: new Set(bank.map((question) => question.solveAuthority)).size,
    permanentQlCount: new Set(bank.map((question) => question.qlId)).size,
    qlCounts,
    answerPositions,
    optionCount: bank.reduce((total, question) => total + question.options.length, 0),
    uniqueQuestionSignatureCount: new Set(
      bank.map((question) => question.adminProof.semanticFingerprint),
    ).size,
    semicolonCorrectOptionCount: bank.filter((question) =>
      question.options[question.correctIndex]!.text.includes(";"),
    ).length,
    semicolonWrongOptionCount: bank.reduce(
      (total, question) =>
        total +
        question.options.filter(
          (option) => !option.isCorrect && option.text.includes(";"),
        ).length,
      0,
    ),
    permanentQlRange: "BLR-QL-031..BLR-QL-035" as const,
    nextAvailableChapterQlId: "BLR-QL-036" as const,
    status: "REMEDIATION_REVIEW_REQUIRED" as const,
  };
}
