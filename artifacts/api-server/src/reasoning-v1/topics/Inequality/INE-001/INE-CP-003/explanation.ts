import { evaluateConclusion } from "../foundation/conclusion-evaluator";
import { assertSolverAgreement } from "../foundation/solver-agreement";
import type {
  AtomicOrder,
  ConclusionEvaluationEvidence,
} from "../foundation/types";
import { formatStatement } from "../INE-CP-001/presentation";
import type { IneCp001Explanation } from "../INE-CP-001/types";
import { CP003_TRUTH_LABELS, formatAtomicRelationSet } from "./option-builder";
import type { IneCp003Option, IneCp003Scenario } from "./types";

function assignmentText(
  assignment: Readonly<Record<string, number>>,
  entityNames: Readonly<Record<string, string>>,
): string {
  return Object.entries(assignment)
    .sort(([left], [right]) =>
      (entityNames[left] ?? left).localeCompare(entityNames[right] ?? right),
    )
    .map(([entityId, value]) => `${entityNames[entityId] ?? entityId}=${value}`)
    .join(", ");
}

function atomicText(
  order: AtomicOrder,
  leftName: string,
  rightName: string,
): string {
  return `${leftName} ${order === "GT" ? ">" : order === "LT" ? "<" : "="} ${rightName}`;
}

function allowedRelationsText(
  evaluation: ConclusionEvaluationEvidence,
  scenario: IneCp003Scenario,
): string {
  const leftName =
    scenario.entityNames[evaluation.conclusion.leftId] ??
    evaluation.conclusion.leftId;
  const rightName =
    scenario.entityNames[evaluation.conclusion.rightId] ??
    evaluation.conclusion.rightId;
  return evaluation.pairEvidence.possibleAtomicRelations
    .map((order) => atomicText(order, leftName, rightName))
    .join(" or ");
}

function truthReason(
  evaluation: ConclusionEvaluationEvidence,
  scenario: IneCp003Scenario,
): string {
  const conclusion = formatStatement(
    evaluation.conclusion,
    scenario.entityNames,
  );
  const allowed = allowedRelationsText(evaluation, scenario);
  if (evaluation.truth === "DEFINITELY_TRUE") {
    return `The statements allow only ${allowed}, and every allowed case satisfies ${conclusion}. The conclusion is definitely true.`;
  }
  if (evaluation.truth === "POSSIBLY_TRUE") {
    return `The statements allow ${allowed}. At least one allowed case satisfies ${conclusion}, but another does not, so the conclusion is possible rather than definite.`;
  }
  return `The statements allow only ${allowed}. None of those cases satisfies ${conclusion}, so the conclusion is impossible.`;
}

function witnessSteps(
  evaluation: ConclusionEvaluationEvidence,
  scenario: IneCp003Scenario,
): readonly string[] {
  if (evaluation.truth !== "POSSIBLY_TRUE") return [];
  const agreement = assertSolverAgreement(
    scenario.statements,
    evaluation.conclusion.leftId,
    evaluation.conclusion.rightId,
  );
  const satisfying = evaluation.satisfyingAtomicRelations[0]!;
  const rejecting = evaluation.rejectingAtomicRelations[0]!;
  const satisfyingModel = agreement.modelEvidence.witnessByRelation[satisfying];
  const rejectingModel = agreement.modelEvidence.witnessByRelation[rejecting];
  if (!satisfyingModel || !rejectingModel) return [];
  const leftName =
    scenario.entityNames[evaluation.conclusion.leftId] ??
    evaluation.conclusion.leftId;
  const rightName =
    scenario.entityNames[evaluation.conclusion.rightId] ??
    evaluation.conclusion.rightId;
  return [
    `${assignmentText(satisfyingModel, scenario.entityNames)} satisfies the statements and gives ${atomicText(satisfying, leftName, rightName)}, so the conclusion can hold.`,
    `${assignmentText(rejectingModel, scenario.entityNames)} also satisfies the statements but gives ${atomicText(rejecting, leftName, rightName)}, so the conclusion is not guaranteed.`,
  ];
}

function conclusionExplanation(
  scenario: IneCp003Scenario,
  options: readonly IneCp003Option[],
  correctIndex: number,
): IneCp001Explanation {
  const evaluations = scenario.conclusions.map((conclusion) =>
    evaluateConclusion(scenario.statements, conclusion),
  );
  const selectedConclusion = options[correctIndex]!.conclusion;
  const primary = selectedConclusion
    ? evaluations.find(
        (evaluation) => evaluation.conclusion === selectedConclusion,
      )!
    : evaluations[0]!;
  const selecting = scenario.taskKind === "SELECT_CONCLUSION";
  const targetDescription =
    scenario.targetTruth === "DEFINITELY_TRUE"
      ? "the only conclusion that must be true"
      : scenario.targetTruth === "POSSIBLY_TRUE"
        ? "the only conclusion that can be true but is not guaranteed"
        : "the only conclusion that cannot be true";
  return {
    ruleStatement: selecting
      ? "Check each conclusion against what the statements allow: it must either always hold, hold only in some cases, or never hold."
      : `First find every relation the statements allow, then see whether ${formatStatement(primary.conclusion, scenario.entityNames)} holds in all, some, or none of those cases.`,
    normalizedStatements: [],
    proofSteps: [truthReason(primary, scenario)],
    modelWitnesses: witnessSteps(primary, scenario),
    conclusion: selecting
      ? `So option ${correctIndex + 1}, ${options[correctIndex]!.value}, is ${targetDescription}.`
      : `Therefore, the conclusion is ${CP003_TRUTH_LABELS[primary.truth].toLowerCase()}.`,
    distractorAnalysis: selecting
      ? options
          .filter((option) => !option.isCorrect)
          .map((option) => {
            const evaluation = evaluations.find(
              (candidate) => candidate.conclusion === option.conclusion,
            )!;
            return {
              optionValue: option.value,
              errorLabel: option.errorLabel!,
              studentWarning: truthReason(evaluation, scenario),
            };
          })
      : options
          .filter((option) => !option.isCorrect)
          .map((option) => ({
            optionValue: option.value,
            errorLabel: option.errorLabel!,
            studentWarning:
              option.truth === "DEFINITELY_TRUE"
                ? "A conclusion is definite only when every allowed arrangement makes it true."
                : option.truth === "POSSIBLY_TRUE"
                  ? "A possible conclusion needs at least one valid arrangement that supports it and another that rejects it."
                  : option.truth === "IMPOSSIBLE"
                    ? "A conclusion is impossible only when no allowed arrangement can satisfy it."
                    : "The statements are consistent; no contradiction is present.",
          })),
  };
}

function relationSetExplanation(
  scenario: IneCp003Scenario,
  options: readonly IneCp003Option[],
  correctIndex: number,
): IneCp001Explanation {
  const query = scenario.query!;
  const leftName = scenario.entityNames[query.leftId] ?? query.leftId;
  const rightName = scenario.entityNames[query.rightId] ?? query.rightId;
  const agreement = assertSolverAgreement(
    scenario.statements,
    query.leftId,
    query.rightId,
  );
  const possible = agreement.modelEvidence.possibleAtomicRelations;
  const witnesses = possible
    .map((order) => {
      const assignment = agreement.modelEvidence.witnessByRelation[order];
      return assignment
        ? `${assignmentText(assignment, scenario.entityNames)} gives ${atomicText(order, leftName, rightName)}.`
        : "";
    })
    .filter(Boolean);
  return {
    ruleStatement: `List every relation between ${leftName} and ${rightName} that can occur without breaking a statement.`,
    normalizedStatements: [],
    proofSteps: [
      `The complete possible set is ${formatAtomicRelationSet(possible, leftName, rightName)}.`,
    ],
    modelWitnesses: witnesses,
    conclusion: `Therefore, option ${correctIndex + 1} gives all and only the possible relations.`,
    distractorAnalysis: options
      .filter((option) => !option.isCorrect)
      .map((option) => ({
        optionValue: option.value,
        errorLabel: option.errorLabel!,
        studentWarning:
          option.errorLabel === "OMITTED_POSSIBLE_RELATION"
            ? "This option leaves out a relation demonstrated by a valid arrangement."
            : "This option includes a relation that the statements do not permit.",
      })),
  };
}

export function buildIneCp003Explanation(
  scenario: IneCp003Scenario,
  options: readonly IneCp003Option[],
  correctIndex: number,
): IneCp001Explanation {
  return scenario.taskKind === "SELECT_RELATION_SET"
    ? relationSetExplanation(scenario, options, correctIndex)
    : conclusionExplanation(scenario, options, correctIndex);
}
