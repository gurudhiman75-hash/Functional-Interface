import { stableHash } from "../foundation/prng";
import { assertSolverAgreement } from "../foundation/solver-agreement";
import type { ComparisonRelation } from "../foundation/types";
import { buildIneCp001Explanation } from "./explanation";
import { buildIneCp001Options } from "./option-builder";
import { buildStem, formatStatement } from "./presentation";
import { getIneCp001PrototypeContract } from "./prototype-contracts";
import { buildIneCp001Scenario } from "./scenario-builder";
import type {
  GeneratedIneCp001PrototypeQuestion,
  IneCp001AnswerSemantic,
  IneCp001Difficulty,
  IneCp001PrototypeId,
} from "./types";
import { validateIneCp001Question } from "./validator";

function difficultyFor(
  prototypeId: IneCp001PrototypeId,
  statementCount: number,
  proofPathLength: number,
  seed: number,
): IneCp001Difficulty {
  if (prototypeId === "INE-CP001-PROT-DIRECT-RELATION")
    return seed % 5 === 0 ? "MEDIUM" : "EASY";
  if (prototypeId === "INE-CP001-PROT-INDETERMINATE-BRANCH")
    return seed % 3 === 0 ? "HARD" : "MEDIUM";
  if (statementCount >= 3 || proofPathLength >= 3)
    return seed % 4 === 0 ? "MEDIUM" : "HARD";
  return "MEDIUM";
}

export function generateIneCp001PrototypeQuestion(
  prototypeId: IneCp001PrototypeId,
  seed = 0,
): GeneratedIneCp001PrototypeQuestion {
  const contract = getIneCp001PrototypeContract(prototypeId);
  const scenario = buildIneCp001Scenario(prototypeId, seed);
  const { statements, query, entityNames } = scenario.prompt;
  if (
    statements.length < contract.minimumStatementCount ||
    statements.length > contract.maximumStatementCount
  )
    throw new Error(`${prototypeId} violates its statement-count contract.`);

  const agreement = assertSolverAgreement(
    statements,
    query.leftId,
    query.rightId,
  );
  const pairEvidence = agreement.graphEvidence!;
  const correctAnswer: IneCp001AnswerSemantic =
    pairEvidence.strongestDefiniteRelation ?? "INDETERMINATE";
  if ((correctAnswer === "INDETERMINATE") !== contract.expectedIndeterminate)
    throw new Error(
      `${scenario.topologyId} violates its answer-semantic contract.`,
    );

  const { options, correctIndex } = buildIneCp001Options(
    correctAnswer,
    prototypeId,
    seed,
  );
  const proofPathLength = pairEvidence.proofPath?.steps.length ?? 0;
  const strongestDefiniteRelation: ComparisonRelation | undefined =
    pairEvidence.strongestDefiniteRelation;
  const question: GeneratedIneCp001PrototypeQuestion = {
    packageId: "INE-001",
    checkpointId: "INE-CP-001",
    prototypeId,
    authorityId: contract.authorityId,
    permanentQlId: null,
    prototypeOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    seed,
    locale: "en-IN",
    difficulty: difficultyFor(
      prototypeId,
      statements.length,
      proofPathLength,
      seed,
    ),
    renderer: "STRUCTURED_TEXT",
    answerType: "STRONGEST_DEFINITE_RELATION",
    stem: buildStem(scenario.prompt),
    displayedStatements: statements.map((statement) =>
      formatStatement(statement, entityNames),
    ),
    structuredPrompt: scenario.prompt,
    options,
    correctIndex,
    explanation: buildIneCp001Explanation(
      scenario.prompt,
      correctAnswer,
      options,
      agreement,
    ),
    metadata: {
      runtimeVersion: "ine-cp001-prototype-v1",
      hiddenFingerprint: stableHash([
        scenario.topologyId,
        ...Object.entries(scenario.hiddenValues)
          .sort(([left], [right]) => left.localeCompare(right))
          .flatMap(([entityId, value]) => [entityId, value]),
      ]),
      topologyId: scenario.topologyId,
      statementCount: statements.length,
      proofPathLength,
      possibleAtomicRelations: pairEvidence.possibleAtomicRelations,
      strongestDefiniteRelation,
      independentSolverAgreed: true,
      graphConsistent: true,
      distractorErrorLabels: options
        .filter((option) => !option.isCorrect)
        .map((option) => option.errorLabel!),
    },
  };
  const validation = validateIneCp001Question(question);
  if (!validation.valid)
    throw new Error(
      `${prototypeId}/${seed} failed validation: ${validation.errors.join(" ")}`,
    );
  return question;
}
