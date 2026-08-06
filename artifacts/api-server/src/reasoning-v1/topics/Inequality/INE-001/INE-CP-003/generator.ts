import { stableHash } from "../foundation/prng";
import { assertSolverAgreement } from "../foundation/solver-agreement";
import { formatStatement } from "../INE-CP-001/presentation";
import { getIneCp003PrototypeContract } from "./contracts";
import { buildIneCp003Explanation } from "./explanation";
import { buildIneCp003Options } from "./option-builder";
import { buildIneCp003Scenario } from "./scenario-builder";
import type { GeneratedIneCp003Question, IneCp003PrototypeId } from "./types";
import { validateIneCp003Question } from "./validator";

function difficultyFor(
  scenario: ReturnType<typeof buildIneCp003Scenario>,
  possibleRelationCount: number,
): GeneratedIneCp003Question["difficulty"] {
  if (scenario.taskKind === "SELECT_CONCLUSION") {
    return scenario.statements.length >= 4 ? "HARD" : "MEDIUM";
  }
  if (scenario.taskKind === "SELECT_RELATION_SET") {
    return possibleRelationCount >= 3 ? "HARD" : "MEDIUM";
  }
  if (
    scenario.taskKind === "CLASSIFY_CONCLUSION" &&
    scenario.statements.length <= 2 &&
    scenario.targetTruth !== "POSSIBLY_TRUE"
  ) {
    return "EASY";
  }
  return "MEDIUM";
}

function releaseTierFor(
  difficulty: GeneratedIneCp003Question["difficulty"],
): GeneratedIneCp003Question["metadata"]["releaseTier"] {
  if (difficulty === "EASY") return "SSC_STANDARD_MOCK";
  if (difficulty === "HARD") return "ADVANCED_PRACTICE";
  return "BANKING_PRELIMS";
}

function mockSolutionFor(
  explanation: GeneratedIneCp003Question["explanation"],
): string {
  return [
    explanation.ruleStatement,
    ...explanation.proofSteps,
    explanation.conclusion,
  ].join(" ");
}

export function generateIneCp003Question(
  prototypeId: IneCp003PrototypeId,
  seed = 0,
): GeneratedIneCp003Question {
  const contract = getIneCp003PrototypeContract(prototypeId);
  const scenario = buildIneCp003Scenario(prototypeId, seed);
  if (scenario.taskKind !== contract.taskKind) {
    throw new Error(`${prototypeId} violates its task-kind contract.`);
  }
  for (const conclusion of scenario.conclusions) {
    const agreement = assertSolverAgreement(
      scenario.statements,
      conclusion.leftId,
      conclusion.rightId,
    );
    if (!agreement.agreed || !agreement.graphAnalysis.consistent) {
      throw new Error(`${scenario.scenarioId} failed solver agreement.`);
    }
  }
  if (scenario.query) {
    const agreement = assertSolverAgreement(
      scenario.statements,
      scenario.query.leftId,
      scenario.query.rightId,
    );
    if (!agreement.agreed || !agreement.graphAnalysis.consistent) {
      throw new Error(`${scenario.scenarioId} failed query solver agreement.`);
    }
  }

  const optionResult = buildIneCp003Options(scenario, seed);
  const explanation = buildIneCp003Explanation(
    scenario,
    optionResult.options,
    optionResult.correctIndex,
  );
  const displayedStatements = scenario.statements.map((statement) =>
    formatStatement(statement, scenario.entityNames),
  );
  const displayedConclusion =
    scenario.taskKind === "CLASSIFY_CONCLUSION"
      ? formatStatement(scenario.conclusions[0]!, scenario.entityNames)
      : undefined;
  const difficulty = difficultyFor(
    scenario,
    optionResult.possibleAtomicRelations?.length ?? 0,
  );
  const recordId = `INE-CP003-${stableHash([prototypeId, seed, "record-v1"]).toUpperCase()}`;
  const answerType: GeneratedIneCp003Question["answerType"] =
    scenario.taskKind === "CLASSIFY_CONCLUSION"
      ? "CONCLUSION_TRUTH"
      : scenario.taskKind === "SELECT_CONCLUSION"
        ? "CONCLUSION_SELECTION"
        : "POSSIBLE_RELATION_SET";
  const stem =
    scenario.taskKind === "CLASSIFY_CONCLUSION"
      ? "Based only on the statements, how should the conclusion be classified?"
      : scenario.taskKind === "SELECT_RELATION_SET"
        ? `Which option lists every possible relation between ${scenario.entityNames[scenario.query!.leftId]} and ${scenario.entityNames[scenario.query!.rightId]}?`
        : scenario.targetTruth === "DEFINITELY_TRUE"
          ? "Which conclusion is definitely true?"
          : scenario.targetTruth === "POSSIBLY_TRUE"
            ? "Which conclusion is possible, but not definitely true?"
            : "Which conclusion is impossible?";

  const question: GeneratedIneCp003Question = {
    recordId,
    packageId: "INE-001",
    checkpointId: "INE-CP-003",
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
    displayedConclusion,
    structuredScenario: scenario,
    options: optionResult.options,
    correctIndex: optionResult.correctIndex,
    explanation,
    solutions: { mock: mockSolutionFor(explanation), learning: explanation },
    metadata: {
      runtimeVersion: "ine-cp003-prototype-v1",
      competency: "CONCLUSION_CERTAINTY_REASONING",
      reviewStatus: "PENDING_MANUAL_REVIEW",
      releaseTier: releaseTierFor(difficulty),
      topologyId: scenario.topologyId,
      taskKind: scenario.taskKind,
      explanationMode: scenario.explanationKind,
      statementCount: scenario.statements.length,
      conclusionCount: scenario.conclusions.length,
      nodeCount: Object.keys(scenario.entityNames).length,
      conclusionTruths: optionResult.conclusionTruths,
      possibleAtomicRelations: optionResult.possibleAtomicRelations,
      contentHash: stableHash([
        recordId,
        ...displayedStatements,
        displayedConclusion ?? "",
        ...optionResult.options.map((option) => option.value),
      ]),
      independentSolverAgreed: true,
      graphConsistent: true,
      distractorErrorLabels: optionResult.options
        .filter((option) => !option.isCorrect)
        .map((option) => option.errorLabel!),
    },
  };
  const validation = validateIneCp003Question(question);
  if (!validation.valid) {
    throw new Error(
      `${prototypeId}/${seed} failed validation: ${validation.errors.join(" ")}`,
    );
  }
  return question;
}
