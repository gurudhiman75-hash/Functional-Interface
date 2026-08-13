import type { AtomicOrder, SolverAgreementEvidence } from "../foundation/types";
import { answerLabel, formatStatement } from "./presentation";
import type {
  IneCp001AnswerSemantic,
  IneCp001Explanation,
  IneCp001Option,
  IneCp001StructuredPrompt,
} from "./types";

function queryNames(prompt: IneCp001StructuredPrompt): [string, string] {
  return [
    prompt.entityNames[prompt.query.leftId] ?? prompt.query.leftId,
    prompt.entityNames[prompt.query.rightId] ?? prompt.query.rightId,
  ];
}

function naturalList(values: readonly string[]): string {
  if (values.length === 1) return values[0]!;
  if (values.length === 2) return `${values[0]} or ${values[1]}`;
  return `${values.slice(0, -1).join(", ")}, or ${values.at(-1)}`;
}

function atomicRelationText(
  order: AtomicOrder,
  leftName: string,
  rightName: string,
): string {
  const symbol = order === "GT" ? ">" : order === "LT" ? "<" : "=";
  return `${leftName} ${symbol} ${rightName}`;
}

function proofSteps(
  prompt: IneCp001StructuredPrompt,
  correctAnswer: IneCp001AnswerSemantic,
  agreement: SolverAgreementEvidence,
): string[] {
  const [leftName, rightName] = queryNames(prompt);
  const evidence = agreement.graphEvidence!;

  if (correctAnswer === "INDETERMINATE") {
    return [
      `The statements compare ${leftName} and ${rightName} with other terms, but they never force one fixed order between the two.`,
    ];
  }

  if (correctAnswer === "EQUAL_TO") {
    return [
      `The equality information places ${leftName} and ${rightName} at exactly the same value.`,
    ];
  }

  const equality = prompt.statements.find(
    (statement) =>
      statement.relation === "EQUAL_TO" &&
      [statement.leftId, statement.rightId].some(
        (entityId) =>
          entityId === prompt.query.leftId || entityId === prompt.query.rightId,
      ),
  );
  if (equality) {
    const equalIds = new Set([equality.leftId, equality.rightId]);
    const comparison = prompt.statements.find(
      (statement) =>
        statement.relation !== "EQUAL_TO" &&
        (equalIds.has(statement.leftId) || equalIds.has(statement.rightId)),
    );
    if (comparison) {
      return [
        `Because ${formatStatement(equality, prompt.entityNames)}, the comparison ${formatStatement(comparison, prompt.entityNames)} also fixes the relation between ${leftName} and ${rightName}. In the order asked, this gives ${leftName} ${answerLabel(correctAnswer)} ${rightName}.`,
      ];
    }
  }

  if (evidence.proofPath?.strict) {
    return [
      evidence.proofPath.steps.length === 1
        ? `The relevant comparison fixes a strict order between ${leftName} and ${rightName}; equality is not possible.`
        : `Following the chain from ${leftName} to ${rightName}, at least one link is strict. That strict link rules out equality at the two ends.`,
    ];
  }

  const direction =
    correctAnswer === "GREATER_THAN_OR_EQUAL"
      ? "greater than or equal to"
      : "less than or equal to";
  return [
    `The chain keeps ${leftName} ${direction} ${rightName}. None of its links is strict, so equality is still possible.`,
  ];
}

function possibleRelations(
  prompt: IneCp001StructuredPrompt,
  agreement: SolverAgreementEvidence,
): string[] {
  if (agreement.graphEvidence?.strongestDefiniteRelation) return [];
  const [leftName, rightName] = queryNames(prompt);
  const possibilities = agreement.modelEvidence.possibleAtomicRelations.map(
    (order) => atomicRelationText(order, leftName, rightName),
  );
  return [
    `All three arrangements remain possible: ${naturalList(possibilities)}.`,
  ];
}

function openingSentence(
  prompt: IneCp001StructuredPrompt,
  correctAnswer: IneCp001AnswerSemantic,
  agreement: SolverAgreementEvidence,
): string {
  const allStatements = prompt.statements.map((statement) =>
    formatStatement(statement, prompt.entityNames),
  );
  if (correctAnswer === "INDETERMINATE") {
    return `The statements tell us ${allStatements.join(" and ")}.`;
  }

  const sourceIds = new Set(
    agreement.graphEvidence?.proofPath?.steps.flatMap(
      (step) => step.sourceStatementIds,
    ) ?? [],
  );
  const relevantComponentIds = new Set(
    agreement.graphEvidence?.proofPath?.componentIds ?? [],
  );
  for (const component of agreement.graphAnalysis.equalityComponents) {
    if (
      component.includes(prompt.query.leftId) ||
      component.includes(prompt.query.rightId)
    ) {
      relevantComponentIds.add(component[0]!);
    }
  }
  const relevantStatements = prompt.statements.filter((statement) => {
    if (sourceIds.has(statement.sourceStatementId)) return true;
    if (statement.relation !== "EQUAL_TO") return false;
    return agreement.graphAnalysis.equalityComponents.some(
      (component) =>
        relevantComponentIds.has(component[0]!) &&
        component.includes(statement.leftId) &&
        component.includes(statement.rightId),
    );
  });
  const rendered = (
    relevantStatements.length > 0 ? relevantStatements : prompt.statements
  ).map((statement) => formatStatement(statement, prompt.entityNames));
  return rendered.length === 1
    ? `Start with ${rendered[0]}.`
    : `Use ${rendered.join(" and ")} together.`;
}

function warningFor(
  errorLabel: string,
  leftName: string,
  rightName: string,
  correctAnswer: IneCp001AnswerSemantic,
): string {
  switch (errorLabel) {
    case "MISREAD_QUERY_DIRECTION":
      return `That reads the comparison backwards. The question asks for ${leftName} relative to ${rightName}.`;
    case "DEMOTE_STRICT_TO_INCLUSIVE":
      return `That answer is weaker than the result proved by the strict link in the chain. The strongest answer is ${leftName} ${answerLabel(correctAnswer)} ${rightName}.`;
    case "IGNORE_STRICTNESS":
      return "Equality is ruled out because the chain contains a strict comparison.";
    case "DROP_VALID_PROOF_PATH":
      return `The displayed statements do connect ${leftName} to ${rightName}, so their relation is not unknown.`;
    case "IGNORE_EQUALITY_PROPAGATION":
      return "Equal terms must keep the same comparison with every other term.";
    case "TREAT_EQUALITY_AS_UNKNOWN":
      return "An equality sign gives an exact relation; it is not missing information.";
    case "WEAKEN_EXACT_EQUALITY":
      return "The statements prove equality exactly, so a weaker inclusive relation is not the strongest answer.";
    case "PROMOTE_INCLUSIVE_TO_STRICT":
      return "The inclusive chain still allows the two end terms to be equal, so a strict answer is not guaranteed.";
    case "KEEP_ONLY_EQUALITY_CASE":
      return "Equality is allowed, but it is not forced; the end terms may also be strictly ordered.";
    case "TREAT_UNKNOWN_AS_EQUAL":
      return "A missing comparison does not imply equality.";
    case "ASSUME_LEFT_BRANCH_HIGHER":
    case "ASSUME_RIGHT_BRANCH_HIGHER":
    case "ASSUME_SHARED_BOUND_IMPLIES_ORDER":
      return `A shared upper or lower bound does not tell us whether ${leftName} is above, equal to, or below ${rightName}.`;
    default:
      return "That relation is not guaranteed by the displayed statements.";
  }
}

export function buildIneCp001Explanation(
  prompt: IneCp001StructuredPrompt,
  correctAnswer: IneCp001AnswerSemantic,
  options: readonly IneCp001Option[],
  agreement: SolverAgreementEvidence,
): IneCp001Explanation {
  const [leftName, rightName] = queryNames(prompt);

  return {
    ruleStatement: openingSentence(prompt, correctAnswer, agreement),
    normalizedStatements: [],
    proofSteps: proofSteps(prompt, correctAnswer, agreement),
    modelWitnesses: possibleRelations(prompt, agreement),
    conclusion:
      correctAnswer === "INDETERMINATE"
        ? `So the relation between ${leftName} and ${rightName} cannot be determined.`
        : `Therefore, ${leftName} ${answerLabel(correctAnswer)} ${rightName}.`,
    distractorAnalysis: options
      .filter((option) => !option.isCorrect)
      .map((option) => ({
        optionValue: option.value,
        errorLabel: option.errorLabel!,
        studentWarning: warningFor(
          option.errorLabel!,
          leftName,
          rightName,
          correctAnswer,
        ),
      })),
  };
}
