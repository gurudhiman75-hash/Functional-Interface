import { evaluateConclusion } from "../foundation/conclusion-evaluator";
import { assertSolverAgreement } from "../foundation/solver-agreement";
import type {
  AtomicOrder,
  ConclusionEvaluationEvidence,
} from "../foundation/types";
import { formatStatement } from "../INE-CP-001/presentation";
import type { IneCp001Explanation } from "../INE-CP-001/types";
import {
  CP003_CONCLUSION_MASK_LABELS,
  CP003_TRUTH_LABELS,
  formatAtomicRelationSet,
} from "./option-builder";
import type { IneCp003Option, IneCp003Scenario } from "./types";

function joinNaturally(parts: readonly string[]): string {
  if (parts.length <= 1) return parts[0] ?? "";
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")}, and ${parts.at(-1)}`;
}

function joinAlternatives(parts: readonly string[]): string {
  if (parts.length <= 1) return parts[0] ?? "";
  if (parts.length === 2) return `${parts[0]} or ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")}, or ${parts.at(-1)}`;
}

function assignmentText(
  assignment: Readonly<Record<string, number>>,
  entityNames: Readonly<Record<string, string>>,
): string {
  return joinNaturally(
    Object.entries(assignment)
      .sort(([left], [right]) =>
        (entityNames[left] ?? left).localeCompare(entityNames[right] ?? right),
      )
      .map(
        ([entityId, value]) =>
          `${entityNames[entityId] ?? entityId} = ${value}`,
      ),
  );
}

function atomicText(
  order: AtomicOrder,
  leftName: string,
  rightName: string,
): string {
  return `${leftName} ${order === "GT" ? ">" : order === "LT" ? "<" : "="} ${rightName}`;
}

function allowedRelations(
  evaluation: ConclusionEvaluationEvidence,
  scenario: IneCp003Scenario,
): string {
  const leftName =
    scenario.entityNames[evaluation.conclusion.leftId] ??
    evaluation.conclusion.leftId;
  const rightName =
    scenario.entityNames[evaluation.conclusion.rightId] ??
    evaluation.conclusion.rightId;
  return joinAlternatives(
    evaluation.pairEvidence.possibleAtomicRelations.map((order) =>
      atomicText(order, leftName, rightName),
    ),
  );
}

function decisiveChain(
  evaluation: ConclusionEvaluationEvidence,
  scenario: IneCp003Scenario,
): string {
  const leftName =
    scenario.entityNames[evaluation.conclusion.leftId] ??
    evaluation.conclusion.leftId;
  const rightName =
    scenario.entityNames[evaluation.conclusion.rightId] ??
    evaluation.conclusion.rightId;
  const sourceIds = [
    ...new Set(
      evaluation.pairEvidence.proofPath?.steps.flatMap(
        (step) => step.sourceStatementIds,
      ) ?? [],
    ),
  ];
  const chainStatements = sourceIds
    .map((sourceId) =>
      scenario.statements.find(
        (statement) => statement.sourceStatementId === sourceId,
      ),
    )
    .filter((statement) => statement !== undefined);

  const connectedEntities = new Set([
    evaluation.conclusion.leftId,
    evaluation.conclusion.rightId,
    ...chainStatements.flatMap((statement) => [
      statement.leftId,
      statement.rightId,
    ]),
  ]);
  const equalityStatements = scenario.statements.filter(
    (statement) => statement.relation === "EQUAL_TO",
  );
  let addedEquality = true;
  while (addedEquality) {
    addedEquality = false;
    for (const statement of equalityStatements) {
      if (
        chainStatements.includes(statement) ||
        (!connectedEntities.has(statement.leftId) &&
          !connectedEntities.has(statement.rightId))
      )
        continue;
      chainStatements.push(statement);
      connectedEntities.add(statement.leftId);
      connectedEntities.add(statement.rightId);
      addedEquality = true;
    }
  }
  const chain = chainStatements.map((statement) =>
    formatStatement(statement, scenario.entityNames),
  );

  if (chain.length > 0) {
    const possibilities = evaluation.pairEvidence.possibleAtomicRelations;
    return possibilities.length === 1
      ? `Combine ${joinNaturally(chain)}. This gives ${allowedRelations(evaluation, scenario)}.`
      : `Combine ${joinNaturally(chain)}. This leaves ${allowedRelations(evaluation, scenario)} possible.`;
  }

  const directEqualityStatements = scenario.statements
    .filter(
      (statement) =>
        statement.relation === "EQUAL_TO" &&
        [statement.leftId, statement.rightId].some(
          (entityId) =>
            entityId === evaluation.conclusion.leftId ||
            entityId === evaluation.conclusion.rightId,
        ),
    )
    .map((statement) => formatStatement(statement, scenario.entityNames));
  if (
    directEqualityStatements.length > 0 &&
    evaluation.pairEvidence.possibleAtomicRelations.length === 1
  ) {
    return `${joinNaturally(directEqualityStatements)} fixes ${leftName} = ${rightName}.`;
  }
  if (evaluation.pairEvidence.possibleAtomicRelations.length === 3) {
    return `There is no chain fixing the relation between ${leftName} and ${rightName}; either may be greater, or they may be equal.`;
  }
  return `The useful statements leave ${allowedRelations(evaluation, scenario)} possible.`;
}

function truthResult(
  evaluation: ConclusionEvaluationEvidence,
  scenario: IneCp003Scenario,
): string {
  const conclusion = formatStatement(
    evaluation.conclusion,
    scenario.entityNames,
  );
  if (evaluation.truth === "DEFINITELY_TRUE") {
    return `This proves ${conclusion}.`;
  }
  if (evaluation.truth === "POSSIBLY_TRUE") {
    return `${conclusion} works in one valid case but fails in another. It is possible, not certain.`;
  }
  return evaluation.pairEvidence.possibleAtomicRelations.length === 1
    ? `${allowedRelations(evaluation, scenario)} contradicts ${conclusion}, so the conclusion cannot be true.`
    : `None of those possibilities satisfies ${conclusion}, so the conclusion cannot be true.`;
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
    `For example, ${assignmentText(satisfyingModel, scenario.entityNames)} satisfies every statement and gives ${atomicText(satisfying, leftName, rightName)}.`,
    `But ${assignmentText(rejectingModel, scenario.entityNames)} also satisfies every statement and gives ${atomicText(rejecting, leftName, rightName)}. This is why the conclusion is not guaranteed.`,
  ];
}

function classificationWarning(
  option: IneCp003Option,
  actualTruth: ConclusionEvaluationEvidence["truth"],
): string {
  if (option.truth === "DEFINITELY_TRUE") {
    return actualTruth === "POSSIBLY_TRUE"
      ? "This treats a result that works only sometimes as if it must always hold."
      : "The permitted relation is the opposite of the conclusion, so it cannot be definite.";
  }
  if (option.truth === "POSSIBLY_TRUE") {
    return actualTruth === "DEFINITELY_TRUE"
      ? "The chain proves the conclusion in every valid arrangement, not merely one of them."
      : "No valid arrangement supports the conclusion, so it is not possible.";
  }
  return actualTruth === "DEFINITELY_TRUE"
    ? "The chain proves the conclusion, so calling it impossible reverses the result."
    : "At least one valid arrangement supports the conclusion, so it is not impossible.";
}

function singleOrSelectionExplanation(
  scenario: IneCp003Scenario,
  options: readonly IneCp003Option[],
  correctIndex: number,
): IneCp001Explanation {
  const evaluations = scenario.conclusions.map((conclusion) =>
    evaluateConclusion(scenario.statements, conclusion),
  );
  const selecting = scenario.taskKind === "SELECT_CONCLUSION";
  const selectedConclusion = options[correctIndex]!.conclusion;
  const primary = selectedConclusion
    ? evaluations.find(
        (evaluation) => evaluation.conclusion === selectedConclusion,
      )!
    : evaluations[0]!;

  if (!selecting) {
    return {
      ruleStatement: decisiveChain(primary, scenario),
      normalizedStatements: [],
      proofSteps: [truthResult(primary, scenario)],
      modelWitnesses: witnessSteps(primary, scenario),
      conclusion: `So the conclusion is ${CP003_TRUTH_LABELS[primary.truth].toLowerCase()}.`,
      distractorAnalysis: options
        .filter((option) => !option.isCorrect)
        .map((option) => ({
          optionValue: option.value,
          errorLabel: option.errorLabel!,
          studentWarning: classificationWarning(option, primary.truth),
        })),
    };
  }

  return {
    ruleStatement: decisiveChain(primary, scenario),
    normalizedStatements: [],
    proofSteps: [truthResult(primary, scenario)],
    modelWitnesses: witnessSteps(primary, scenario),
    conclusion: `Therefore, option ${correctIndex + 1} is correct.`,
    distractorAnalysis: options
      .filter((option) => !option.isCorrect)
      .map((option) => {
        const evaluation = evaluations.find(
          (candidate) => candidate.conclusion === option.conclusion,
        )!;
        return {
          optionValue: option.value,
          errorLabel: option.errorLabel!,
          studentWarning: truthResult(evaluation, scenario),
        };
      }),
  };
}

function conclusionSetExplanation(
  scenario: IneCp003Scenario,
  options: readonly IneCp003Option[],
  correctIndex: number,
): IneCp001Explanation {
  const evaluations = scenario.conclusions.map((conclusion) =>
    evaluateConclusion(scenario.statements, conclusion),
  );
  const labels = ["I", "II"] as const;
  const correct = options[correctIndex]!;
  return {
    ruleStatement:
      "A conclusion follows only when it is true in every arrangement allowed by the statements.",
    normalizedStatements: [],
    proofSteps: evaluations.map(
      (evaluation, index) =>
        `Conclusion ${labels[index]}: ${decisiveChain(evaluation, scenario)} ${truthResult(evaluation, scenario)}`,
    ),
    modelWitnesses: evaluations.flatMap((evaluation) =>
      witnessSteps(evaluation, scenario),
    ),
    conclusion: (() => {
      const label = CP003_CONCLUSION_MASK_LABELS[correct.conclusionMask!];
      return `Hence, ${label[0]!.toLowerCase()}${label.slice(1)}.`;
    })(),
    distractorAnalysis: options
      .filter((option) => !option.isCorrect)
      .map((option) => ({
        optionValue: option.value,
        errorLabel: option.errorLabel!,
        studentWarning:
          option.errorLabel === "DEFINITE_CONCLUSION_REJECTED"
            ? "This option leaves out a conclusion that the chain proves."
            : option.errorLabel ===
                "NON_DEFINITE_CONCLUSION_TREATED_AS_FOLLOWING"
              ? "This option counts a conclusion that is not guaranteed."
              : "This option rejects the proven conclusion and accepts the one that is not guaranteed.",
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
  const evaluation = evaluateConclusion(scenario.statements, {
    leftId: query.leftId,
    relation: "GREATER_THAN_OR_EQUAL",
    rightId: query.rightId,
    sourceStatementId: "QUERY",
  });
  const agreement = assertSolverAgreement(
    scenario.statements,
    query.leftId,
    query.rightId,
  );
  const possible = agreement.modelEvidence.possibleAtomicRelations;
  const witnesses = possible.flatMap((order) => {
    const assignment = agreement.modelEvidence.witnessByRelation[order];
    return assignment
      ? [
          `For ${atomicText(order, leftName, rightName)}, one valid arrangement is ${assignmentText(assignment, scenario.entityNames)}.`,
        ]
      : [];
  });
  return {
    ruleStatement: decisiveChain(evaluation, scenario),
    normalizedStatements: [],
    proofSteps: [
      `So the complete set is ${formatAtomicRelationSet(possible, leftName, rightName)}.`,
    ],
    modelWitnesses: witnesses,
    conclusion: `Option ${correctIndex + 1} includes every valid relation and no invalid one.`,
    distractorAnalysis: options
      .filter((option) => !option.isCorrect)
      .map((option) => ({
        optionValue: option.value,
        errorLabel: option.errorLabel!,
        studentWarning:
          option.errorLabel === "OMITTED_POSSIBLE_RELATION"
            ? "This option misses a relation that a valid arrangement demonstrates."
            : "This option adds a relation that breaks at least one statement.",
      })),
  };
}

export function buildIneCp003Explanation(
  scenario: IneCp003Scenario,
  options: readonly IneCp003Option[],
  correctIndex: number,
): IneCp001Explanation {
  if (scenario.taskKind === "SELECT_RELATION_SET")
    return relationSetExplanation(scenario, options, correctIndex);
  if (scenario.taskKind === "EVALUATE_CONCLUSION_SET")
    return conclusionSetExplanation(scenario, options, correctIndex);
  return singleOrSelectionExplanation(scenario, options, correctIndex);
}
