import { stableHash } from "../foundation/prng";
import { assertSolverAgreement } from "../foundation/solver-agreement";
import type { ComparisonRelation } from "../foundation/types";
import { formatStatement } from "../INE-CP-001/presentation";
import type { IneCp001AnswerSemantic } from "../INE-CP-001/types";
import { getIneCp002PrototypeContract } from "./contracts";
import { canonicalIneCp002GraphFingerprint } from "./graph-profile";
import {
  buildIneCp002PairExplanation,
  buildIneCp002RelationExplanation,
} from "./explanation";
import {
  buildIneCp002PairOptions,
  buildIneCp002RelationOptions,
} from "./option-builder";
import { buildIneCp002Scenario } from "./scenario-builder";
import type { GeneratedIneCp002Question, IneCp002PrototypeId } from "./types";
import { validateIneCp002Question } from "./validator";

function difficultyFor(
  scenario: ReturnType<typeof buildIneCp002Scenario>,
): GeneratedIneCp002Question["difficulty"] {
  if (scenario.taskKind !== "RELATION") {
    const longestAuditPath = Math.max(
      0,
      ...scenario.proofRoutes.map((route) => route.length),
    );
    return (scenario.candidatePairs?.length ?? 0) >= 4 && longestAuditPath >= 2
      ? "HARD"
      : "MEDIUM";
  }
  if (scenario.explanationKind === "ALTERNATE_STRICT_PATH") return "HARD";
  if (
    scenario.explanationKind === "MULTIPLE_ROUTES" ||
    scenario.explanationKind === "BRANCHED_GRAPH"
  ) {
    return scenario.statements.length >= 5 ? "HARD" : "MEDIUM";
  }
  if (
    scenario.statements.length <= 3 &&
    scenario.irrelevantStatementIds.length === 0
  ) {
    return "EASY";
  }
  return "MEDIUM";
}

function scenarioNodeCount(
  scenario: ReturnType<typeof buildIneCp002Scenario>,
): number {
  return new Set(
    scenario.statements.flatMap((statement) => [
      statement.leftId,
      statement.rightId,
    ]),
  ).size;
}

function difficultyBasisFor(
  scenario: ReturnType<typeof buildIneCp002Scenario>,
): GeneratedIneCp002Question["metadata"]["difficultyBasis"] {
  if (scenario.taskKind !== "RELATION") return "PAIR_AUDIT";
  const difficulty = difficultyFor(scenario);
  if (difficulty === "EASY") return "SHORT_SINGLE_PATH";
  if (difficulty === "HARD") return "ADVANCED_GRAPH_REASONING";
  return "STANDARD_GRAPH_REASONING";
}

function releaseTierFor(
  difficulty: GeneratedIneCp002Question["difficulty"],
): GeneratedIneCp002Question["metadata"]["releaseTier"] {
  if (difficulty === "EASY") return "SSC_STANDARD_MOCK";
  if (difficulty === "HARD") return "ADVANCED_PRACTICE";
  return "BANKING_PRELIMS";
}

function mockSolutionFor(
  explanation: GeneratedIneCp002Question["explanation"],
): string {
  return [
    explanation.ruleStatement,
    ...explanation.proofSteps,
    explanation.conclusion,
  ]
    .filter((sentence) => sentence.trim().length > 0)
    .join(" ");
}

export function generateIneCp002Question(
  prototypeId: IneCp002PrototypeId,
  seed = 0,
): GeneratedIneCp002Question {
  const contract = getIneCp002PrototypeContract(prototypeId);
  const scenario = buildIneCp002Scenario(prototypeId, seed);
  if (scenario.taskKind !== contract.taskKind) {
    throw new Error(`${prototypeId} violates its task-kind contract.`);
  }
  if (
    scenario.statements.length < contract.minimumStatementCount ||
    scenario.statements.length > contract.maximumStatementCount
  ) {
    throw new Error(`${prototypeId} violates its statement-count contract.`);
  }

  let strongestDefiniteRelation: ComparisonRelation | undefined;
  let answerRelation: IneCp001AnswerSemantic | undefined;
  let possibleAtomicRelations: GeneratedIneCp002Question["metadata"]["possibleAtomicRelations"];
  let candidatePairDefiniteness:
    | GeneratedIneCp002Question["metadata"]["candidatePairDefiniteness"]
    | undefined;
  let pairRelations:
    | ReturnType<typeof buildIneCp002PairOptions>["pairRelations"]
    | undefined;
  let relationAgreement: ReturnType<typeof assertSolverAgreement> | undefined;
  let options: GeneratedIneCp002Question["options"];
  let correctIndex: number;

  if (scenario.taskKind === "RELATION") {
    const agreement = assertSolverAgreement(
      scenario.statements,
      scenario.query!.leftId,
      scenario.query!.rightId,
    );
    relationAgreement = agreement;
    strongestDefiniteRelation =
      agreement.graphEvidence?.strongestDefiniteRelation;
    possibleAtomicRelations = agreement.graphEvidence?.possibleAtomicRelations;
    const correctAnswer: IneCp001AnswerSemantic =
      strongestDefiniteRelation ?? "INDETERMINATE";
    answerRelation = correctAnswer;
    const result = buildIneCp002RelationOptions(scenario, correctAnswer, seed);
    options = result.options;
    correctIndex = result.correctIndex;
  } else {
    const result = buildIneCp002PairOptions(scenario, seed);
    options = result.options;
    correctIndex = result.correctIndex;
    candidatePairDefiniteness = result.pairDefiniteness;
    pairRelations = result.pairRelations;
  }

  const displayedStatements = scenario.statements.map((statement) =>
    formatStatement(statement, scenario.entityNames),
  );
  const difficulty = difficultyFor(scenario);
  const learningExplanation =
    scenario.taskKind === "RELATION"
      ? buildIneCp002RelationExplanation(
          scenario,
          strongestDefiniteRelation ?? "INDETERMINATE",
          options,
          relationAgreement!,
        )
      : buildIneCp002PairExplanation(
          scenario,
          options,
          correctIndex,
          pairRelations!,
        );
  const recordId = `INE-CP002-${stableHash([prototypeId, seed, "record-v2"]).toUpperCase()}`;
  const question: GeneratedIneCp002Question = {
    recordId,
    packageId: "INE-001",
    checkpointId: "INE-CP-002",
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
    answerType:
      scenario.taskKind === "RELATION"
        ? "DEFINITELY_ESTABLISHED_RELATION"
        : "PAIR_SELECTION",
    stem:
      scenario.taskKind === "RELATION"
        ? `Which relation between ${scenario.entityNames[scenario.query!.leftId]} and ${scenario.entityNames[scenario.query!.rightId]} is definitely established by the statements?`
        : scenario.taskKind === "SELECT_DEFINITE_PAIR"
          ? "Which pair has a relation that is completely determined by the statements?"
          : "Which pair has a relation that cannot be determined from the statements?",
    displayedStatements,
    structuredPrompt: {
      statements: scenario.statements,
      entityNames: scenario.entityNames,
      query: scenario.query,
      candidatePairs: scenario.candidatePairs,
    },
    options,
    correctIndex,
    explanation: learningExplanation,
    solutions: {
      mock: mockSolutionFor(learningExplanation),
      learning: learningExplanation,
    },
    metadata: {
      runtimeVersion: "ine-cp002-prototype-v4",
      competency: "MULTI_LINK_INEQUALITY_REASONING",
      reviewStatus: "CHECKPOINT_ACCEPTED",
      releaseTier: releaseTierFor(difficulty),
      difficultyBasis: difficultyBasisFor(scenario),
      contentHash: stableHash([
        recordId,
        ...displayedStatements,
        ...options.map((option) => option.value),
      ]),
      topologyId: scenario.topologyId,
      graphFingerprint: canonicalIneCp002GraphFingerprint(scenario),
      hiddenFingerprint: stableHash([
        prototypeId,
        seed,
        ...Object.entries(scenario.hiddenValues)
          .sort(([left], [right]) => left.localeCompare(right))
          .flatMap(([entityId, value]) => [entityId, value]),
      ]),
      taskKind: scenario.taskKind,
      explanationMode: scenario.explanationKind,
      nodeCount: scenarioNodeCount(scenario),
      statementCount: scenario.statements.length,
      relevantStatementCount:
        scenario.statements.length - scenario.irrelevantStatementIds.length,
      routeCount: scenario.proofRoutes.length,
      irrelevantStatementCount: scenario.irrelevantStatementIds.length,
      equalityStatementCount: scenario.statements.filter(
        (statement) => statement.relation === "EQUAL_TO",
      ).length,
      strictStatementCount: scenario.statements.filter(
        (statement) =>
          statement.relation === "GREATER_THAN" ||
          statement.relation === "LESS_THAN",
      ).length,
      answerRelation,
      optionRoles: options.map((option, index) => ({
        index,
        role: option.isCorrect ? "CORRECT" : "DISTRACTOR",
        errorLabel: option.errorLabel,
      })),
      possibleAtomicRelations,
      strongestDefiniteRelation,
      candidatePairDefiniteness,
      independentSolverAgreed: true,
      graphConsistent: true,
      distractorErrorLabels: options
        .filter((option) => !option.isCorrect)
        .map((option) => option.errorLabel!),
    },
  };
  const validation = validateIneCp002Question(question);
  if (!validation.valid) {
    throw new Error(
      `${prototypeId}/${seed} failed validation: ${validation.errors.join(" ")}`,
    );
  }
  return question;
}
