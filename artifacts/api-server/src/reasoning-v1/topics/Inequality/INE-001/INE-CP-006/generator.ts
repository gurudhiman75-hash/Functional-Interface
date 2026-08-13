import { stableHash } from "../foundation/prng";
import { assertSolverAgreement } from "../foundation/solver-agreement";
import { formatStatement } from "../INE-CP-001/presentation";
import { getIneCp006PrototypeContract } from "./contracts";
import { buildIneCp006Explanation } from "./explanation";
import { buildIneCp006Options } from "./option-builder";
import { buildIneCp006Scenario } from "./scenario-builder";
import type { GeneratedIneCp006Question, IneCp006PrototypeId } from "./types";
import { validateIneCp006Question } from "./validator";

function mockSolution(
  explanation: GeneratedIneCp006Question["explanation"],
): string {
  return [
    explanation.ruleStatement,
    ...explanation.normalizedStatements,
    ...explanation.proofSteps,
    explanation.conclusion,
  ]
    .filter(Boolean)
    .join(" ");
}

function difficultyFor(
  scenario: ReturnType<typeof buildIneCp006Scenario>,
): GeneratedIneCp006Question["difficulty"] {
  if (
    scenario.taskKind === "DECODE_RELATION" ||
    scenario.taskKind === "ENCODE_RELATION"
  )
    return "EASY";
  if (
    scenario.taskKind === "SOLVE_RELATION" &&
    scenario.statements.length === 1
  )
    return "EASY";
  if (scenario.statements.length >= 4 || scenario.conclusions.length === 3)
    return "HARD";
  if (
    scenario.taskKind === "EVALUATE_CONCLUSIONS" &&
    scenario.statements.length >= 3
  )
    return "HARD";
  return "MEDIUM";
}

export function generateIneCp006Question(
  prototypeId: IneCp006PrototypeId,
  seed = 0,
): GeneratedIneCp006Question {
  const contract = getIneCp006PrototypeContract(prototypeId);
  const scenario = buildIneCp006Scenario(prototypeId, seed);
  const checkedPairs = [
    ...(scenario.query ? [scenario.query] : []),
    ...scenario.conclusions.map((entry) => ({
      leftId: entry.leftId,
      rightId: entry.rightId,
    })),
  ];
  for (const pair of checkedPairs) {
    const agreement = assertSolverAgreement(
      scenario.statements,
      pair.leftId,
      pair.rightId,
    );
    if (!agreement.graphAnalysis.consistent)
      throw new Error(`${scenario.scenarioId} is contradictory.`);
  }

  const optionResult = buildIneCp006Options(scenario, seed);
  const explanation = buildIneCp006Explanation(
    scenario,
    optionResult.options,
    optionResult.correctIndex,
  );
  const displayedStatements =
    scenario.taskKind === "ENCODE_RELATION"
      ? [formatStatement(scenario.ordinaryRelation!, scenario.entityNames)]
      : scenario.displayedCodedStatements;
  const displayedConclusions =
    scenario.displayedCodedConclusions.length > 0
      ? scenario.displayedCodedConclusions
      : undefined;
  const queryNames = scenario.query
    ? [
        scenario.entityNames[scenario.query.leftId],
        scenario.entityNames[scenario.query.rightId],
      ]
    : [];
  const stem =
    scenario.taskKind === "DECODE_RELATION"
      ? "According to the supplied code key, which ordinary relation has exactly the same meaning as the coded statement?"
      : scenario.taskKind === "ENCODE_RELATION"
        ? "According to the supplied code key, which option correctly encodes the ordinary relation?"
        : scenario.taskKind === "EVALUATE_CONCLUSIONS"
          ? "Using the supplied code key, which conclusion or conclusions definitely follow?"
          : `After decoding the statements, what is the strongest definite relation between ${queryNames[0]} and ${queryNames[1]}?`;
  const question: GeneratedIneCp006Question = {
    recordId: `INE-CP006-${stableHash([prototypeId, seed, "record-v3"]).toUpperCase()}`,
    packageId: "INE-001",
    checkpointId: "INE-CP-006",
    prototypeId,
    authorityId: contract.authorityId,
    permanentQlId: null,
    prototypeOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    seed,
    locale: "en-IN",
    difficulty: difficultyFor(scenario),
    renderer: "STRUCTURED_TEXT",
    answerType:
      scenario.taskKind === "EVALUATE_CONCLUSIONS"
        ? "CONCLUSION_MASK"
        : scenario.taskKind === "ENCODE_RELATION"
          ? "CODE_SELECTION"
          : "RELATION_SELECTION",
    stem,
    displayedCodeKey: scenario.keyEntries.map((entry) => entry.text),
    displayedStatements,
    displayedConclusions,
    structuredScenario: scenario,
    options: optionResult.options,
    correctIndex: optionResult.correctIndex,
    explanation,
    solutions: { mock: mockSolution(explanation), learning: explanation },
    metadata: {
      runtimeVersion: "ine-cp006-prototype-v3",
      reviewStatus: "CHECKPOINT_ACCEPTED",
      deliveryProfile: contract.deliveryProfile,
      symbolProfile: contract.symbolProfile,
      examApplicability: contract.examApplicability,
      localeReadiness: "ENGLISH_ONLY",
      releaseGate: "MANUAL_REVIEW_REQUIRED",
      topologyId: scenario.topologyId,
      taskKind: scenario.taskKind,
      symbolSetId: scenario.codeMap.symbolSetId,
      codeKeySize: 5,
      conclusionTruths: optionResult.conclusionTruths,
      contentHash: stableHash([
        scenario.scenarioId,
        ...scenario.keyEntries.map((entry) => entry.text),
        ...displayedStatements,
        ...(displayedConclusions ?? []),
        ...optionResult.options.map((entry) => entry.value),
        mockSolution(explanation),
      ]),
      independentSolverAgreed: true,
      graphConsistent: true,
      distractorErrorLabels: optionResult.options
        .filter((entry) => !entry.isCorrect)
        .map((entry) => entry.errorLabel!),
      sourceLedgerIds: contract.sourceLedgerIds,
    },
  };
  const validation = validateIneCp006Question(question);
  if (!validation.valid)
    throw new Error(
      `${prototypeId}/${seed} failed validation: ${validation.errors.join(" ")}`,
    );
  return question;
}
