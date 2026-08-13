import { stableHash } from "../foundation/prng";
import { assertSolverAgreement } from "../foundation/solver-agreement";
import { formatStatement } from "../INE-CP-001/presentation";
import { getIneCp004PrototypeContract } from "./contracts";
import { buildIneCp004Explanation } from "./explanation";
import { buildIneCp004Options } from "./option-builder";
import { buildIneCp004Scenario } from "./scenario-builder";
import type { GeneratedIneCp004Question, IneCp004PrototypeId } from "./types";
import { validateIneCp004Question } from "./validator";

function mockSolutionFor(
  explanation: GeneratedIneCp004Question["explanation"],
  taskKind: GeneratedIneCp004Question["structuredScenario"]["taskKind"],
  correctIndex: number,
): string {
  if (taskKind === "SELECT_PAIR") {
    return [
      explanation.proofSteps[correctIndex],
      `Therefore, option ${correctIndex + 1} is the valid either-or pair.`,
    ]
      .filter(Boolean)
      .join(" ");
  }
  return [
    explanation.ruleStatement,
    ...explanation.proofSteps,
    explanation.conclusion,
  ]
    .filter(Boolean)
    .join(" ");
}

function normalizedStatementKey(
  statement: GeneratedIneCp004Question["structuredScenario"]["statements"][number],
): string {
  if (statement.relation === "LESS_THAN")
    return `${statement.rightId}:GREATER_THAN:${statement.leftId}`;
  if (statement.relation === "LESS_THAN_OR_EQUAL")
    return `${statement.rightId}:GREATER_THAN_OR_EQUAL:${statement.leftId}`;
  if (statement.relation === "EQUAL_TO")
    return [statement.leftId, statement.rightId].sort().join(":EQUAL_TO:");
  return `${statement.leftId}:${statement.relation}:${statement.rightId}`;
}

export function generateIneCp004Question(
  prototypeId: IneCp004PrototypeId,
  seed = 0,
): GeneratedIneCp004Question {
  const contract = getIneCp004PrototypeContract(prototypeId);
  const scenario = buildIneCp004Scenario(prototypeId, seed);
  if (scenario.taskKind !== contract.taskKind) {
    throw new Error(`${prototypeId} violates its task-kind contract.`);
  }
  const checkedPairs = [
    ...scenario.conclusions.map((conclusion) => ({
      leftId: conclusion.leftId,
      rightId: conclusion.rightId,
    })),
    ...(scenario.candidatePairs?.flatMap((pair) => [
      { leftId: pair.first.leftId, rightId: pair.first.rightId },
      { leftId: pair.second.leftId, rightId: pair.second.rightId },
    ]) ?? []),
  ];
  for (const pair of checkedPairs) {
    const agreement = assertSolverAgreement(
      scenario.statements,
      pair.leftId,
      pair.rightId,
    );
    if (!agreement.agreed || !agreement.graphAnalysis.consistent) {
      throw new Error(`${scenario.scenarioId} failed solver agreement.`);
    }
  }

  const optionResult = buildIneCp004Options(scenario, seed);
  const explanation = buildIneCp004Explanation(
    scenario,
    optionResult.options,
    optionResult.correctIndex,
  );
  const displayedStatements = scenario.statements.map((statement) =>
    formatStatement(statement, scenario.entityNames),
  );
  const displayedConclusions =
    scenario.taskKind === "SELECT_PAIR"
      ? undefined
      : scenario.conclusions.map((conclusion) =>
          formatStatement(conclusion, scenario.entityNames),
        );
  const answerType: GeneratedIneCp004Question["answerType"] =
    scenario.taskKind === "CLASSIFY_PAIR"
      ? "COMPLEMENTARY_PAIR_STATUS"
      : scenario.taskKind === "SELECT_PAIR"
        ? "COMPLEMENTARY_PAIR_SELECTION"
        : scenario.taskKind === "EVALUATE_TWO_CONCLUSIONS"
          ? "TWO_CONCLUSION_MASK"
          : "THREE_CONCLUSION_MASK";
  const stem =
    scenario.taskKind === "CLASSIFY_PAIR"
      ? "How should conclusions I and II be evaluated as a pair?"
      : scenario.taskKind === "SELECT_PAIR"
        ? "Which option contains a valid either-or pair?"
        : "Assuming the following statements to be true, which conclusion or conclusions definitely follow?";
  const difficulty: GeneratedIneCp004Question["difficulty"] =
    scenario.taskKind === "SELECT_PAIR" ||
    scenario.statements.length >= 5 ||
    (scenario.taskKind === "EVALUATE_THREE_CONCLUSIONS" &&
      scenario.statements.length >= 4)
      ? "HARD"
      : "MEDIUM";
  const structuralFingerprint = stableHash([
    scenario.topologyId,
    scenario.taskKind,
    ...scenario.statements.map(normalizedStatementKey).sort(),
  ]);
  const recordId = `INE-CP004-${stableHash([prototypeId, seed, "record-v1"]).toUpperCase()}`;
  const question: GeneratedIneCp004Question = {
    recordId,
    packageId: "INE-001",
    checkpointId: "INE-CP-004",
    prototypeId,
    authorityId: contract.authorityId,
    permanentQlId: null,
    prototypeOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    seed,
    locale: "en-IN",
    difficulty,
    renderer: "STRUCTURED_TEXT",
    answerType,
    stem,
    displayedStatements,
    displayedConclusions,
    structuredScenario: scenario,
    options: optionResult.options,
    correctIndex: optionResult.correctIndex,
    explanation,
    solutions: {
      mock: mockSolutionFor(
        explanation,
        scenario.taskKind,
        optionResult.correctIndex,
      ),
      learning: explanation,
    },
    metadata: {
      runtimeVersion: "ine-cp004-prototype-v3",
      competency: "COMPLEMENTARY_EXHAUSTIVENESS_REASONING",
      reviewStatus: "CHECKPOINT_ACCEPTED",
      mockAssemblyPolicy: "MIX_WITH_CP003_NON_COMPLEMENTARY_OUTCOMES",
      deliveryProfile: contract.deliveryProfile,
      topologyId: scenario.topologyId,
      structuralFingerprint,
      taskKind: scenario.taskKind,
      statementCount: scenario.statements.length,
      conclusionCount: scenario.conclusions.length,
      nodeCount: Object.keys(scenario.entityNames).length,
      conclusionTruths: optionResult.conclusionTruths,
      complementaryEvidence: optionResult.complementaryEvidence,
      contentHash: stableHash([
        recordId,
        ...displayedStatements,
        ...(displayedConclusions ?? []),
        ...optionResult.options.map((option) => option.value),
      ]),
      independentSolverAgreed: true,
      graphConsistent: true,
      distractorErrorLabels: optionResult.options
        .filter((option) => !option.isCorrect)
        .map((option) => option.errorLabel!),
      sourceLedgerIds: contract.sourceLedgerIds,
    },
  };
  const validation = validateIneCp004Question(question);
  if (!validation.valid) {
    throw new Error(
      `${prototypeId}/${seed} failed validation: ${validation.errors.join(" ")}`,
    );
  }
  return question;
}
