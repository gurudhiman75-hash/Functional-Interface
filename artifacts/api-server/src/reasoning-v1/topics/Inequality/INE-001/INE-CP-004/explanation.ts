import { evaluateConclusion } from "../foundation/conclusion-evaluator";
import type { AtomicOrder, ComparisonConstraint } from "../foundation/types";
import { formatStatement } from "../INE-CP-001/presentation";
import type { IneCp001Explanation } from "../INE-CP-001/types";
import { evaluateComplementaryPair } from "./complementary";
import {
  CP004_PAIR_STATUS_LABELS,
  CP004_THREE_MASK_LABELS,
  CP004_TWO_MASK_LABELS,
} from "./option-builder";
import type {
  IneCp004ComplementEvidence,
  IneCp004ConclusionPair,
  IneCp004Option,
  IneCp004Scenario,
} from "./types";

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

function atomicText(
  relation: AtomicOrder,
  leftName: string,
  rightName: string,
): string {
  return `${leftName} ${relation === "LT" ? "<" : relation === "GT" ? ">" : "="} ${rightName}`;
}

function relationSetText(
  relations: readonly AtomicOrder[],
  pair: IneCp004ConclusionPair,
  scenario: IneCp004Scenario,
): string {
  if (relations.length === 0) return "no valid case";
  const leftName = scenario.entityNames[pair.first.leftId] ?? pair.first.leftId;
  const rightName =
    scenario.entityNames[pair.first.rightId] ?? pair.first.rightId;
  return joinAlternatives(
    relations.map((relation) => atomicText(relation, leftName, rightName)),
  );
}

function usefulChain(
  query: ComparisonConstraint,
  scenario: IneCp004Scenario,
): string {
  const evaluation = evaluateConclusion(scenario.statements, query);
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
    query.leftId,
    query.rightId,
    ...chainStatements.flatMap((statement) => [
      statement.leftId,
      statement.rightId,
    ]),
  ]);
  let addedEquality = true;
  while (addedEquality) {
    addedEquality = false;
    for (const statement of scenario.statements) {
      if (
        statement.relation !== "EQUAL_TO" ||
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
  if (chainStatements.length === 0) {
    const leftName = scenario.entityNames[query.leftId] ?? query.leftId;
    const rightName = scenario.entityNames[query.rightId] ?? query.rightId;
    return `No chain fixes the relation between ${leftName} and ${rightName}.`;
  }
  return `Use ${joinNaturally(
    chainStatements.map((statement) =>
      formatStatement(statement, scenario.entityNames),
    ),
  )}.`;
}

function pairReason(
  pair: IneCp004ConclusionPair,
  evidence: IneCp004ComplementEvidence,
  scenario: IneCp004Scenario,
  labels: readonly [string, string] = ["I", "II"],
): string {
  const domain = relationSetText(evidence.validAtomicRelations, pair, scenario);
  const first = relationSetText(
    evidence.firstSatisfyingRelations,
    pair,
    scenario,
  );
  const second = relationSetText(
    evidence.secondSatisfyingRelations,
    pair,
    scenario,
  );
  const chain = usefulChain(pair.first, scenario);
  if (evidence.validEitherOr) {
    return `${chain} The valid possibilities are ${domain}. Conclusion ${labels[0]} covers ${first}, while conclusion ${labels[1]} covers ${second}. Neither conclusion is certain by itself. They cannot both be true, and together they cover every valid possibility.`;
  }
  if (evidence.status === "NOT_EXHAUSTIVE") {
    return `${chain} The valid possibilities are ${domain}. Conclusion ${labels[0]} covers ${first}, while conclusion ${labels[1]} covers ${second}. Together, they leave at least one valid case uncovered.`;
  }
  return `${chain} The valid possibilities are ${domain}. Conclusion ${labels[0]} covers ${first}, while conclusion ${labels[1]} covers ${second}. Their coverage overlaps, so both conclusions can be true in the same case.`;
}

function statusWarning(evidence: IneCp004ComplementEvidence): string {
  if (evidence.validEitherOr)
    return "The conclusions are individually uncertain, mutually exclusive, and jointly exhaustive.";
  if (evidence.status === "NOT_EXHAUSTIVE")
    return "The pair misses at least one relation still permitted by the statements.";
  return "The two conclusions overlap, so they are not mutually exclusive.";
}

export function buildIneCp004Explanation(
  scenario: IneCp004Scenario,
  options: readonly IneCp004Option[],
  correctIndex: number,
): IneCp001Explanation {
  if (scenario.taskKind === "CLASSIFY_PAIR") {
    const pair = {
      first: scenario.conclusions[0]!,
      second: scenario.conclusions[1]!,
    };
    const evidence = evaluateComplementaryPair(scenario.statements, pair);
    return {
      ruleStatement: pairReason(pair, evidence, scenario),
      normalizedStatements: [],
      proofSteps: [],
      modelWitnesses: [],
      conclusion: `Therefore, this is classified as “${CP004_PAIR_STATUS_LABELS[evidence.status!]}”.`,
      distractorAnalysis: options
        .filter((option) => !option.isCorrect)
        .map((option) => ({
          optionValue: option.value,
          errorLabel: option.errorLabel!,
          studentWarning:
            option.pairStatus === "VALID_EITHER_OR"
              ? "An either-or pair must be both non-overlapping and complete."
              : option.pairStatus === "NOT_EXHAUSTIVE"
                ? "The pair does cover every valid possibility, so incompleteness is not the problem."
                : "The pair does not share a valid case, so overlap is not the problem.",
        })),
    };
  }

  if (scenario.taskKind === "SELECT_PAIR") {
    const evidence = scenario.candidatePairs!.map((pair) =>
      evaluateComplementaryPair(scenario.statements, pair),
    );
    return {
      ruleStatement:
        "Check whether each pair is individually uncertain, non-overlapping, and complete over the relations allowed by the statements.",
      normalizedStatements: [],
      proofSteps: options.map((option, index) => {
        const candidateIndex = option.candidatePairIndex!;
        return `Option ${index + 1}: ${pairReason(
          scenario.candidatePairs![candidateIndex]!,
          evidence[candidateIndex]!,
          scenario,
        )}`;
      }),
      modelWitnesses: [],
      conclusion: `Only option ${correctIndex + 1} passes all three tests.`,
      distractorAnalysis: options
        .filter((option) => !option.isCorrect)
        .map((option) => ({
          optionValue: option.value,
          errorLabel: option.errorLabel!,
          studentWarning: statusWarning(evidence[option.candidatePairIndex!]!),
        })),
    };
  }

  if (scenario.taskKind === "EVALUATE_TWO_CONCLUSIONS") {
    const pair = {
      first: scenario.conclusions[0]!,
      second: scenario.conclusions[1]!,
    };
    const evidence = evaluateComplementaryPair(scenario.statements, pair);
    return {
      ruleStatement: pairReason(pair, evidence, scenario),
      normalizedStatements: [],
      proofSteps: [],
      modelWitnesses: [],
      conclusion: `Hence, ${CP004_TWO_MASK_LABELS.EITHER_I_OR_II[0]!.toLowerCase()}${CP004_TWO_MASK_LABELS.EITHER_I_OR_II.slice(1)}.`,
      distractorAnalysis: options
        .filter((option) => !option.isCorrect)
        .map((option) => ({
          optionValue: option.value,
          errorLabel: option.errorLabel!,
          studentWarning:
            option.twoConclusionMask === "BOTH"
              ? "The two conclusions cannot be true together."
              : option.twoConclusionMask === "NEITHER"
                ? "Together the conclusions cover every valid possibility."
                : "Neither single conclusion is guaranteed on its own.",
        })),
    };
  }

  const definite = scenario.conclusions[0]!;
  const pair = {
    first: scenario.conclusions[1]!,
    second: scenario.conclusions[2]!,
  };
  const evidence = evaluateComplementaryPair(scenario.statements, pair);
  return {
    ruleStatement: `${usefulChain(definite, scenario)} This proves conclusion I: ${formatStatement(definite, scenario.entityNames)}.`,
    normalizedStatements: [],
    proofSteps: [
      `For conclusions II and III: ${pairReason(pair, evidence, scenario, ["II", "III"])}`,
    ],
    modelWitnesses: [],
    conclusion: `Therefore, ${CP004_THREE_MASK_LABELS.I_AND_EITHER_II_OR_III[0]!.toLowerCase()}${CP004_THREE_MASK_LABELS.I_AND_EITHER_II_OR_III.slice(1)}.`,
    distractorAnalysis: options
      .filter((option) => !option.isCorrect)
      .map((option) => ({
        optionValue: option.value,
        errorLabel: option.errorLabel!,
        studentWarning:
          option.threeConclusionMask === "ONLY_I"
            ? "This ignores the exhaustive either-or pair formed by conclusions II and III."
            : option.threeConclusionMask === "EITHER_II_OR_III"
              ? "This leaves out conclusion I, which is separately proved."
              : "Conclusion I is definite, and conclusions II and III form an exhaustive either-or pair.",
      })),
  };
}
