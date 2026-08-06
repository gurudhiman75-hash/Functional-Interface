import { assertSolverAgreement } from "../foundation/solver-agreement";
import type {
  AtomicOrder,
  ComparisonRelation,
  SolverAgreementEvidence,
} from "../foundation/types";
import { answerLabel, formatStatement } from "../INE-CP-001/presentation";
import type {
  IneCp001AnswerSemantic,
  IneCp001Explanation,
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
    .join(" and ");
}

function queryNames(scenario: IneCp002Scenario): [string, string] {
  const query = scenario.query!;
  return [
    scenario.entityNames[query.leftId] ?? query.leftId,
    scenario.entityNames[query.rightId] ?? query.rightId,
  ];
}

function resultText(
  leftName: string,
  rightName: string,
  answer: IneCp001AnswerSemantic,
): string {
  return answer === "INDETERMINATE"
    ? `the order of ${leftName} and ${rightName} is not fixed`
    : `${leftName} ${answerLabel(answer)} ${rightName}`;
}

function connectedEntityIds(
  scenario: IneCp002Scenario,
  startId: string,
): ReadonlySet<string> {
  const seen = new Set([startId]);
  const queue = [startId];
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const statement of scenario.statements) {
      const neighbour =
        statement.leftId === current
          ? statement.rightId
          : statement.rightId === current
            ? statement.leftId
            : undefined;
      if (neighbour && !seen.has(neighbour)) {
        seen.add(neighbour);
        queue.push(neighbour);
      }
    }
  }
  return seen;
}

function comparisonSourcePath(
  scenario: IneCp002Scenario,
  startId: string,
  endId: string,
  equalityOnly: boolean,
): readonly string[] {
  const queue = [startId];
  const visited = new Set([startId]);
  const previous = new Map<
    string,
    { entityId: string; sourceStatementId: string }
  >();
  while (queue.length > 0 && !visited.has(endId)) {
    const current = queue.shift()!;
    for (const statement of scenario.statements) {
      if (equalityOnly && statement.relation !== "EQUAL_TO") continue;
      const neighbour =
        statement.leftId === current
          ? statement.rightId
          : statement.rightId === current
            ? statement.leftId
            : undefined;
      if (!neighbour || visited.has(neighbour)) continue;
      visited.add(neighbour);
      previous.set(neighbour, {
        entityId: current,
        sourceStatementId: statement.sourceStatementId,
      });
      queue.push(neighbour);
    }
  }
  if (!visited.has(endId)) return [];
  const sourceIds: string[] = [];
  let current = endId;
  while (current !== startId) {
    const step = previous.get(current);
    if (!step) return [];
    sourceIds.unshift(step.sourceStatementId);
    current = step.entityId;
  }
  return sourceIds;
}

function componentText(scenario: IneCp002Scenario, entityId: string): string {
  const ids = connectedEntityIds(scenario, entityId);
  return scenario.statements
    .filter(
      (statement) => ids.has(statement.leftId) && ids.has(statement.rightId),
    )
    .map((statement) => formatStatement(statement, scenario.entityNames))
    .join("; ");
}

function atomicSymbol(order: AtomicOrder): string {
  return order === "GT" ? ">" : order === "LT" ? "<" : "=";
}

function countermodels(
  scenario: IneCp002Scenario,
  agreement: SolverAgreementEvidence,
): readonly string[] {
  if (agreement.graphEvidence?.strongestDefiniteRelation) return [];
  const [leftName, rightName] = queryNames(scenario);
  return agreement.modelEvidence.possibleAtomicRelations
    .slice(0, 2)
    .map((order) => {
      const witness = agreement.modelEvidence.witnessByRelation[order];
      if (!witness) return "";
      const assignments = Object.entries(witness)
        .sort(([left], [right]) =>
          (scenario.entityNames[left] ?? left).localeCompare(
            scenario.entityNames[right] ?? right,
          ),
        )
        .map(
          ([entityId, value]) =>
            `${scenario.entityNames[entityId] ?? entityId}=${value}`,
        )
        .join(", ");
      return `${assignments} satisfies every statement and gives ${leftName} ${atomicSymbol(order)} ${rightName}.`;
    })
    .filter(Boolean);
}

function relationProof(
  scenario: IneCp002Scenario,
  correctAnswer: IneCp001AnswerSemantic,
): { opening: string; steps: readonly string[] } {
  const [leftName, rightName] = queryNames(scenario);
  const result = resultText(leftName, rightName, correctAnswer);
  const routes = scenario.proofRoutes.map((route) =>
    routeText(scenario, route),
  );

  switch (scenario.explanationKind) {
    case "LONG_CHAIN":
      return {
        opening: `Read the links as one chain: ${routes[0]}.`,
        steps: [
          correctAnswer === "GREATER_THAN_OR_EQUAL" ||
          correctAnswer === "LESS_THAN_OR_EQUAL"
            ? `None of those links forces the end values apart. Equality is still possible, so the guaranteed relation is ${result}.`
            : `A strict link occurs on the route, so the two ends cannot be equal. This proves ${result}.`,
        ],
      };
    case "MULTIPLE_ROUTES":
      return {
        opening: `Two separate routes connect ${leftName} and ${rightName}.`,
        steps: [
          `Route 1: ${routes[0]} — this gives ${result}.`,
          `Route 2: ${routes[1]} — this independently gives the same result.`,
        ],
      };
    case "ALTERNATE_STRICT_PATH":
      return {
        opening: `Compare the two available routes from ${leftName} to ${rightName}.`,
        steps: [
          `Direct route: ${routes[0]} — this is only inclusive.`,
          `Alternate route: ${routes[1]} — its strict link rules out equality, proving ${result}.`,
        ],
      };
    case "BRANCHED_GRAPH":
      return {
        opening: `${leftName} and ${rightName} sit on different branches of the same connected graph.`,
        steps: [
          `The branches share other terms, but neither branch provides a directed comparison path to the other. Therefore, ${result}.`,
        ],
      };
    case "IRRELEVANT_EVIDENCE": {
      const ignored = scenario.irrelevantStatementIds.map((sourceId) =>
        routeText(scenario, [sourceId]),
      );
      return {
        opening: `Relevant route: ${routes[0]}.`,
        steps: [
          `The remaining clues — ${ignored.join(" and ")} — do not complete another route between ${leftName} and ${rightName}. The relevant route proves ${result}.`,
        ],
      };
    }
    case "DISCONNECTED_COMPONENTS":
      return {
        opening: `${leftName} and ${rightName} belong to two separate groups of statements.`,
        steps: [
          `Group containing ${leftName}: ${componentText(scenario, scenario.query!.leftId)}.`,
          `Group containing ${rightName}: ${componentText(scenario, scenario.query!.rightId)}. No comparison joins the groups, so ${result}.`,
        ],
      };
    case "EQUALITY_SPANNING_BRANCHES":
      return {
        opening: `Collapse the equality route first: ${routes[0]}.`,
        steps: [
          `This places ${leftName} and ${rightName} in the same equality group. The other comparisons leave that group but cannot separate its members, so ${result}.`,
        ],
      };
    case "PAIR_SELECTION":
      throw new Error("Pair-selection explanations use a separate builder.");
  }
}

function relationDistractorReason(
  scenario: IneCp002Scenario,
  correctAnswer: IneCp001AnswerSemantic,
  option: IneCp002Option,
): string {
  const [leftName, rightName] = queryNames(scenario);
  const optionAnswer = option.semanticRelation!;
  if (correctAnswer === "INDETERMINATE") {
    return `The valid arrangements above give different orders for ${leftName} and ${rightName}, so ${option.value} is not guaranteed.`;
  }
  if (correctAnswer === "EQUAL_TO") {
    return optionAnswer === "INDETERMINATE"
      ? `The equality route fixes ${leftName} and ${rightName} exactly; their relation is known.`
      : `The equality route proves ${leftName} = ${rightName}, so neither term can be strictly above the other.`;
  }
  if (optionAnswer === "INDETERMINATE") {
    return `A complete route connects ${leftName} and ${rightName}, so their relation is determined.`;
  }
  if (optionAnswer === "EQUAL_TO") {
    return correctAnswer === "GREATER_THAN_OR_EQUAL" ||
      correctAnswer === "LESS_THAN_OR_EQUAL"
      ? "Equality is possible, but the inclusive chain does not force it."
      : "The strict link on the decisive route makes equality impossible.";
  }
  if (
    (correctAnswer === "GREATER_THAN_OR_EQUAL" &&
      optionAnswer === "GREATER_THAN") ||
    (correctAnswer === "LESS_THAN_OR_EQUAL" && optionAnswer === "LESS_THAN")
  ) {
    return "Every link on the decisive route is inclusive, so equality remains possible and a strict answer is not guaranteed.";
  }
  return `${option.value} points in the wrong direction; the decisive route establishes ${resultText(leftName, rightName, correctAnswer)}.`;
}

export function buildIneCp002RelationExplanation(
  scenario: IneCp002Scenario,
  correctAnswer: IneCp001AnswerSemantic,
  options: readonly IneCp002Option[],
  agreement: SolverAgreementEvidence,
): IneCp001Explanation {
  const [leftName, rightName] = queryNames(scenario);
  const proof = relationProof(scenario, correctAnswer);
  return {
    ruleStatement: proof.opening,
    normalizedStatements: [],
    proofSteps: proof.steps,
    modelWitnesses: countermodels(scenario, agreement),
    conclusion:
      correctAnswer === "INDETERMINATE"
        ? `Because valid arrangements give different results, the relation between ${leftName} and ${rightName} cannot be determined.`
        : `Therefore, ${resultText(leftName, rightName, correctAnswer)} is definitely established.`,
    distractorAnalysis: options
      .filter((option) => !option.isCorrect)
      .map((option) => ({
        optionValue: option.value,
        errorLabel: option.errorLabel!,
        studentWarning: relationDistractorReason(
          scenario,
          correctAnswer,
          option,
        ),
      })),
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
): string {
  const pair = option.pair!;
  const agreement = assertSolverAgreement(
    scenario.statements,
    pair.leftId,
    pair.rightId,
  );
  const relation = agreement.graphEvidence?.strongestDefiniteRelation;
  if (relation) {
    let sourceIds: readonly string[] =
      agreement.graphEvidence?.proofPath?.steps.flatMap(
        (step) => step.sourceStatementIds,
      ) ?? [];
    if (sourceIds.length === 0) {
      sourceIds = comparisonSourcePath(
        scenario,
        pair.leftId,
        pair.rightId,
        relation === "EQUAL_TO",
      );
    }
    if (sourceIds.length === 0) {
      throw new Error(
        `${scenario.scenarioId} has a definite pair without a displayable proof path.`,
      );
    }
    const path = routeText(scenario, [...new Set(sourceIds)]);
    return `${formatPairOption(pair, scenario.entityNames)}: ${path}, so ${definiteRelationText(scenario, option, relation)}.`;
  }
  const [leftName, rightName] = [
    scenario.entityNames[pair.leftId] ?? pair.leftId,
    scenario.entityNames[pair.rightId] ?? pair.rightId,
  ];
  const connected = connectedEntityIds(scenario, pair.leftId).has(pair.rightId);
  return connected
    ? `${leftName} and ${rightName} are on separate branches of one graph, with no directed path fixing their order.`
    : `${leftName} and ${rightName} are in disconnected groups, so no comparison path fixes their order.`;
}

export function buildIneCp002PairExplanation(
  scenario: IneCp002Scenario,
  options: readonly IneCp002Option[],
  correctIndex: number,
  _pairRelations: Readonly<Record<string, ComparisonRelation | undefined>>,
): IneCp001Explanation {
  const correct = options[correctIndex]!;
  const selectingDefinite = scenario.taskKind === "SELECT_DEFINITE_PAIR";
  return {
    ruleStatement:
      "Check each pair by tracing an actual comparison path. A shared name or nearby branch is not enough on its own.",
    normalizedStatements: [],
    proofSteps: [pairReason(scenario, correct)],
    modelWitnesses: [],
    conclusion: selectingDefinite
      ? `Therefore, option ${correctIndex + 1} — ${correct.value} — is the only pair with a definite relation.`
      : `Therefore, option ${correctIndex + 1} — ${correct.value} — is the only pair whose relation is not determined.`,
    distractorAnalysis: options
      .filter((option) => !option.isCorrect)
      .map((option) => ({
        optionValue: option.value,
        errorLabel: option.errorLabel!,
        studentWarning: pairReason(scenario, option),
      })),
  };
}
