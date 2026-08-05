import type {
  ComparisonRelation,
  SolverAgreementEvidence,
} from "../foundation/types";
import { buildIneCp001Explanation } from "../INE-CP-001/explanation";
import { answerLabel, formatStatement } from "../INE-CP-001/presentation";
import type {
  IneCp001AnswerSemantic,
  IneCp001Explanation,
  IneCp001Option,
} from "../INE-CP-001/types";
import { formatPairOption } from "./option-builder";
import type { IneCp002Option, IneCp002Scenario } from "./types";

function routeText(
  scenario: IneCp002Scenario,
  sourceIds: readonly string[],
): string {
  return sourceIds
    .map((sourceId) => {
      const statement = scenario.statements.find(
        (candidate) => candidate.sourceStatementId === sourceId,
      );
      if (!statement) throw new Error(`Missing route statement ${sourceId}.`);
      return formatStatement(statement, scenario.entityNames);
    })
    .join(", ");
}

function relationProof(
  scenario: IneCp002Scenario,
  correctAnswer: IneCp001AnswerSemantic,
): { opening: string; steps: readonly string[] } {
  const query = scenario.query!;
  const leftName = scenario.entityNames[query.leftId] ?? query.leftId;
  const rightName = scenario.entityNames[query.rightId] ?? query.rightId;
  const result =
    correctAnswer === "INDETERMINATE"
      ? "no single relation is forced"
      : `${leftName} ${answerLabel(correctAnswer)} ${rightName}`;
  const routes = scenario.proofRoutes.map((route) =>
    routeText(scenario, route),
  );

  switch (scenario.explanationKind) {
    case "LONG_CHAIN":
      return {
        opening: `Follow the complete chain: ${routes[0]}.`,
        steps: [
          correctAnswer === "GREATER_THAN_OR_EQUAL" ||
          correctAnswer === "LESS_THAN_OR_EQUAL"
            ? "Every comparison on the route is inclusive, so equality at the two ends is still possible."
            : "At least one comparison on the route is strict, so equality at the two ends is impossible.",
        ],
      };
    case "MULTIPLE_ROUTES":
      return {
        opening: `There are two routes between ${leftName} and ${rightName}: ${routes[0]}; and ${routes[1]}.`,
        steps: [
          `Both routes agree, and each contains a strict comparison. Therefore, they both support ${result}.`,
        ],
      };
    case "ALTERNATE_STRICT_PATH":
      return {
        opening: `One route is ${routes[0]}. The alternate route is ${routes[1]}.`,
        steps: [
          `The first route is only inclusive, but the alternate route contains a strict comparison. That stricter route proves ${result}.`,
        ],
      };
    case "BRANCHED_GRAPH":
      return {
        opening: `The statements place ${leftName} and ${rightName} on separate branches of the same graph.`,
        steps: [
          `Sharing bounds does not compare the two branch terms with each other, so ${result}.`,
        ],
      };
    case "IRRELEVANT_EVIDENCE": {
      const ignored = scenario.irrelevantStatementIds.map((sourceId) =>
        routeText(scenario, [sourceId]),
      );
      return {
        opening: `Only ${routes[0]} connects ${leftName} with ${rightName}.`,
        steps: [
          `${ignored.join(" and ")} form a separate branch and do not change that route. The relevant chain gives ${result}.`,
        ],
      };
    }
    case "DISCONNECTED_COMPONENTS":
      return {
        opening: `${leftName} and ${rightName} belong to different connected groups of statements.`,
        steps: [
          `No comparison path joins the two groups. Either term may be above, equal to, or below the other, so ${result}.`,
        ],
      };
    case "EQUALITY_SPANNING_BRANCHES":
      return {
        opening: `The equality route is ${routes[0]}.`,
        steps: [
          `The two queried terms belong to the same equality group. Comparisons leaving that group do not change their equality, so ${result}.`,
        ],
      };
    case "PAIR_SELECTION":
      throw new Error("Pair-selection explanations use a separate builder.");
  }
}

export function buildIneCp002RelationExplanation(
  scenario: IneCp002Scenario,
  correctAnswer: IneCp001AnswerSemantic,
  options: readonly IneCp002Option[],
  agreement: SolverAgreementEvidence,
): IneCp001Explanation {
  const prompt = {
    statements: scenario.statements,
    query: scenario.query!,
    entityNames: scenario.entityNames,
  };
  const base = buildIneCp001Explanation(
    prompt,
    correctAnswer,
    options.map(
      (option): IneCp001Option => ({
        value: option.value,
        semanticValue: option.semanticRelation!,
        isCorrect: option.isCorrect,
        errorLabel: option.errorLabel,
      }),
    ),
    agreement,
  );
  const proof = relationProof(scenario, correctAnswer);
  return {
    ...base,
    ruleStatement: proof.opening,
    normalizedStatements: [],
    proofSteps: proof.steps,
  };
}

function definiteRelationText(
  scenario: IneCp002Scenario,
  option: IneCp002Option,
  relation: ComparisonRelation,
): string {
  const leftName =
    scenario.entityNames[option.pair!.leftId] ?? option.pair!.leftId;
  const rightName =
    scenario.entityNames[option.pair!.rightId] ?? option.pair!.rightId;
  return `${leftName} ${answerLabel(relation)} ${rightName}`;
}

function pairReason(
  scenario: IneCp002Scenario,
  option: IneCp002Option,
  pairRelations: Readonly<Record<string, ComparisonRelation | undefined>>,
): string {
  const relation = pairRelations[option.pair!.pairId];
  if (relation) {
    return `The statements force ${definiteRelationText(scenario, option, relation)}, so this pair has a definite relation.`;
  }
  return `No comparison path fixes the order of ${formatPairOption(option.pair!, scenario.entityNames)}; either one may be greater, or they may be equal.`;
}

export function buildIneCp002PairExplanation(
  scenario: IneCp002Scenario,
  options: readonly IneCp002Option[],
  correctIndex: number,
  pairRelations: Readonly<Record<string, ComparisonRelation | undefined>>,
): IneCp001Explanation {
  const correct = options[correctIndex]!;
  const selectingDefinite = scenario.taskKind === "SELECT_DEFINITE_PAIR";
  return {
    ruleStatement:
      "Check each pair separately. A pair is definite only when the displayed statements force one relation between its two terms.",
    normalizedStatements: [],
    proofSteps: [pairReason(scenario, correct, pairRelations)],
    modelWitnesses: [],
    conclusion: selectingDefinite
      ? `Therefore, option ${correctIndex + 1} — ${correct.value} — is the pair with a definite relation.`
      : `Therefore, option ${correctIndex + 1} — ${correct.value} — is the pair whose relation cannot be determined.`,
    distractorAnalysis: options
      .filter((option) => !option.isCorrect)
      .map((option) => ({
        optionValue: option.value,
        errorLabel: option.errorLabel!,
        studentWarning: pairReason(scenario, option, pairRelations),
      })),
  };
}
