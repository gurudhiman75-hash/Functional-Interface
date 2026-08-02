import type { SolverAgreementEvidence } from "../foundation/types";
import { answerLabel, formatStatement } from "./presentation";
import type {
  IneCp001AnswerSemantic,
  IneCp001Explanation,
  IneCp001Option,
  IneCp001StructuredPrompt,
} from "./types";

const WARNING_BY_ERROR: Readonly<Record<string, string>> = {
  MISREAD_QUERY_DIRECTION: "This reverses the order asked in the question.",
  DEMOTE_STRICT_TO_INCLUSIVE:
    "A strict step makes the complete consistent path strict.",
  IGNORE_STRICTNESS:
    "Equality cannot survive a path that contains a strict step.",
  DROP_VALID_PROOF_PATH:
    "The displayed statements contain a valid connecting proof path.",
  IGNORE_EQUALITY_PROPAGATION:
    "Equal entities inherit the same relation to the third entity.",
  TREAT_EQUALITY_AS_UNKNOWN:
    "Displayed equality is exact evidence, not missing information.",
  WEAKEN_EXACT_EQUALITY:
    "The evidence proves exact equality, so a weaker inclusive label is not the strongest answer.",
  PROMOTE_INCLUSIVE_TO_STRICT:
    "Inclusive steps allow equality, so strictness is not guaranteed.",
  KEEP_ONLY_EQUALITY_CASE:
    "An inclusive relation also permits the strict case.",
  TREAT_UNKNOWN_AS_EQUAL:
    "No fixed relation does not mean the two entities are equal.",
  ASSUME_LEFT_BRANCH_HIGHER:
    "Sharing a lower bound does not order the two upper entities.",
  ASSUME_RIGHT_BRANCH_HIGHER:
    "Sharing a lower bound does not order the two upper entities.",
  ASSUME_SHARED_BOUND_IMPLIES_ORDER:
    "A common bound does not create a comparison edge between the queried entities.",
};

function queryNames(prompt: IneCp001StructuredPrompt): [string, string] {
  return [
    prompt.entityNames[prompt.query.leftId] ?? prompt.query.leftId,
    prompt.entityNames[prompt.query.rightId] ?? prompt.query.rightId,
  ];
}

function proofSteps(
  prompt: IneCp001StructuredPrompt,
  agreement: SolverAgreementEvidence,
): string[] {
  const [leftName, rightName] = queryNames(prompt);
  const evidence = agreement.graphEvidence!;
  if (!evidence.proofPath) {
    return [
      `There is no directed comparison path connecting ${leftName} to ${rightName}.`,
    ];
  }
  const sourceIds = [
    ...new Set(
      evidence.proofPath.steps.flatMap((step) => step.sourceStatementIds),
    ),
  ];
  return [
    `Use ${sourceIds.join(" and ")} to connect ${leftName} with ${rightName}.`,
    evidence.proofPath.strict
      ? "The consistent path contains a strict step, so the endpoint relation is strict."
      : "Every step on the consistent path is inclusive, so equality remains possible.",
  ];
}

function modelWitnesses(
  prompt: IneCp001StructuredPrompt,
  agreement: SolverAgreementEvidence,
): string[] {
  if (agreement.graphEvidence?.strongestDefiniteRelation) return [];
  const [leftName, rightName] = queryNames(prompt);
  return agreement.modelEvidence.possibleAtomicRelations.map((order) => {
    const assignment = agreement.modelEvidence.witnessByRelation[order]!;
    const symbol = order === "GT" ? ">" : order === "LT" ? "<" : "=";
    return `A valid model has ${leftName}=${assignment[prompt.query.leftId]} and ${rightName}=${assignment[prompt.query.rightId]}, so ${leftName} ${symbol} ${rightName}.`;
  });
}

export function buildIneCp001Explanation(
  prompt: IneCp001StructuredPrompt,
  correctAnswer: IneCp001AnswerSemantic,
  options: readonly IneCp001Option[],
  agreement: SolverAgreementEvidence,
): IneCp001Explanation {
  const [leftName, rightName] = queryNames(prompt);
  return {
    ruleStatement:
      "Follow only consistently directed comparison paths. A strict step makes that path strict, while an all-inclusive path keeps equality possible.",
    normalizedStatements: prompt.statements.map(
      (statement) =>
        `${statement.sourceStatementId}: ${formatStatement(statement, prompt.entityNames)}.`,
    ),
    proofSteps: proofSteps(prompt, agreement),
    modelWitnesses: modelWitnesses(prompt, agreement),
    conclusion:
      correctAnswer === "INDETERMINATE"
        ? `The valid models give different relations between ${leftName} and ${rightName}; therefore, the relation cannot be determined.`
        : `Therefore, the strongest relation that definitely follows is ${leftName} ${answerLabel(correctAnswer)} ${rightName}.`,
    distractorAnalysis: options
      .filter((option) => !option.isCorrect)
      .map((option) => ({
        optionValue: option.value,
        errorLabel: option.errorLabel!,
        studentWarning:
          WARNING_BY_ERROR[option.errorLabel!] ??
          "This option is not supported by every valid model.",
      })),
  };
}
