import { stableHash } from "../foundation/prng";
import { assertSolverAgreement } from "../foundation/solver-agreement";
import { getIneCp005PrototypeContract } from "./contracts";
import { buildIneCp005Explanation } from "./explanation";
import { buildIneCp005Options } from "./option-builder";
import { buildIneCp005Scenario } from "./scenario-builder";
import type { GeneratedIneCp005Question, IneCp005PrototypeId } from "./types";
import { validateIneCp005Question } from "./validator";

function mockSolution(
  explanation: GeneratedIneCp005Question["explanation"],
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

function contextualQueryLabel(
  context: GeneratedIneCp005Question["metadata"]["context"],
  left: string,
  right: string,
): string {
  if (context === "GENERIC") return `${left} and ${right}`;
  if (context === "PRICE") return `the prices of ${left} and ${right}`;
  const property =
    context === "MARKS"
      ? "marks"
      : context === "SALARY"
        ? "salary"
        : context === "HEIGHT"
          ? "height"
          : context === "WEIGHT"
            ? "weight"
            : context === "SCORE"
              ? "score"
              : "production";
  return `${left}'s ${property} and ${right}'s ${property}`;
}

function calibrateDifficulty(
  scenario: ReturnType<typeof buildIneCp005Scenario>,
): GeneratedIneCp005Question["difficulty"] {
  if (scenario.taskKind === "INTERPRET_RELATION") return "EASY";
  if (
    scenario.taskKind === "SOLVE_RELATION" &&
    scenario.statements.length === 1
  )
    return "EASY";
  if (scenario.statements.length >= 4) return "HARD";
  if (
    (scenario.taskKind === "SOLVE_MIXED_RELATION" ||
      scenario.taskKind === "EVALUATE_CONCLUSIONS") &&
    scenario.statements.length >= 3
  )
    return "HARD";
  return "MEDIUM";
}

export function generateIneCp005Question(
  prototypeId: IneCp005PrototypeId,
  seed = 0,
): GeneratedIneCp005Question {
  const contract = getIneCp005PrototypeContract(prototypeId);
  const scenario = buildIneCp005Scenario(prototypeId, seed);
  for (const pair of [
    ...(scenario.query ? [scenario.query] : []),
    ...scenario.conclusions.map((entry) => ({
      leftId: entry.leftId,
      rightId: entry.rightId,
    })),
  ]) {
    const agreement = assertSolverAgreement(
      scenario.statements,
      pair.leftId,
      pair.rightId,
    );
    if (!agreement.graphAnalysis.consistent)
      throw new Error(`${scenario.scenarioId} is contradictory.`);
  }
  const optionResult = buildIneCp005Options(scenario, seed);
  const explanation = buildIneCp005Explanation(
    scenario,
    optionResult.options,
    optionResult.correctIndex,
  );
  const displayedStatements = scenario.renderedStatements.map(
    (entry) => entry.text,
  );
  const displayedConclusions =
    scenario.renderedConclusions.length > 0
      ? scenario.renderedConclusions.map((entry) => entry.text)
      : undefined;
  const queryNames = scenario.query
    ? [
        scenario.entityNames[scenario.query.leftId],
        scenario.entityNames[scenario.query.rightId],
      ]
    : [];
  const stem =
    scenario.taskKind === "INTERPRET_RELATION"
      ? "Which symbolic relation has exactly the same meaning as the statement?"
      : scenario.taskKind === "EVALUATE_CONCLUSIONS"
        ? "Assuming the statements to be true, which conclusion or conclusions definitely follow?"
        : `What is the strongest definite relation between ${contextualQueryLabel(
            scenario.context,
            queryNames[0]!,
            queryNames[1]!,
          )}?`;
  const question: GeneratedIneCp005Question = {
    recordId: `INE-CP005-${stableHash([prototypeId, seed, "record-v1"]).toUpperCase()}`,
    packageId: "INE-001",
    checkpointId: "INE-CP-005",
    prototypeId,
    authorityId: contract.authorityId,
    permanentQlId: null,
    prototypeOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    seed,
    locale: "en-IN",
    difficulty: calibrateDifficulty(scenario),
    renderer: "STRUCTURED_TEXT",
    answerType:
      scenario.taskKind === "EVALUATE_CONCLUSIONS"
        ? "CONCLUSION_MASK"
        : "RELATION_SELECTION",
    stem,
    displayedStatements,
    displayedConclusions,
    structuredScenario: scenario,
    options: optionResult.options,
    correctIndex: optionResult.correctIndex,
    explanation,
    solutions: { mock: mockSolution(explanation), learning: explanation },
    metadata: {
      runtimeVersion: "ine-cp005-prototype-v1",
      reviewStatus: "CHECKPOINT_ACCEPTED",
      deliveryProfile: contract.deliveryProfile,
      context: scenario.context,
      topologyId: scenario.topologyId,
      taskKind: scenario.taskKind,
      linguisticStatementCount: scenario.renderedStatements.filter(
        (entry) => entry.surfaceKind === "LINGUISTIC",
      ).length,
      symbolicStatementCount: scenario.renderedStatements.filter(
        (entry) => entry.surfaceKind === "SYMBOLIC",
      ).length,
      conclusionTruths: optionResult.conclusionTruths,
      contentHash: stableHash([
        scenario.scenarioId,
        ...displayedStatements,
        ...(displayedConclusions ?? []),
        ...optionResult.options.map((entry) => entry.value),
      ]),
      independentSolverAgreed: true,
      graphConsistent: true,
      distractorErrorLabels: optionResult.options
        .filter((entry) => !entry.isCorrect)
        .map((entry) => entry.errorLabel!),
      sourceLedgerIds: contract.sourceLedgerIds,
    },
  };
  const validation = validateIneCp005Question(question);
  if (!validation.valid)
    throw new Error(
      `${prototypeId}/${seed} failed validation: ${validation.errors.join(" ")}`,
    );
  return question;
}
