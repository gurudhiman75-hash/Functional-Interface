import { stableHash } from "../foundation/prng";
import { assertSolverAgreement } from "../foundation/solver-agreement";
import type { ComparisonRelation } from "../foundation/types";
import { formatStatement } from "../INE-CP-001/presentation";
import type { IneCp001AnswerSemantic } from "../INE-CP-001/types";
import { getIneCp002PrototypeContract } from "./contracts";
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

  const question: GeneratedIneCp002Question = {
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
    difficulty:
      scenario.taskKind === "RELATION" && scenario.proofRoutes.length <= 1
        ? "MEDIUM"
        : "HARD",
    renderer: "STRUCTURED_TEXT",
    answerType:
      scenario.taskKind === "RELATION"
        ? "STRONGEST_DEFINITE_RELATION"
        : "PAIR_SELECTION",
    stem:
      scenario.taskKind === "RELATION"
        ? `What is the strongest relation that must be true for ${scenario.entityNames[scenario.query!.leftId]} compared with ${scenario.entityNames[scenario.query!.rightId]}?`
        : scenario.taskKind === "SELECT_DEFINITE_PAIR"
          ? "Which pair has a relation that is completely determined by the statements?"
          : "Which pair has a relation that cannot be determined from the statements?",
    displayedStatements: scenario.statements.map((statement) =>
      formatStatement(statement, scenario.entityNames),
    ),
    structuredPrompt: {
      statements: scenario.statements,
      entityNames: scenario.entityNames,
      query: scenario.query,
      candidatePairs: scenario.candidatePairs,
    },
    options,
    correctIndex,
    explanation:
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
          ),
    metadata: {
      runtimeVersion: "ine-cp002-prototype-v1",
      topologyId: scenario.topologyId,
      hiddenFingerprint: stableHash([
        prototypeId,
        seed,
        ...Object.entries(scenario.hiddenValues)
          .sort(([left], [right]) => left.localeCompare(right))
          .flatMap(([entityId, value]) => [entityId, value]),
      ]),
      taskKind: scenario.taskKind,
      statementCount: scenario.statements.length,
      routeCount: scenario.proofRoutes.length,
      irrelevantStatementCount: scenario.irrelevantStatementIds.length,
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
