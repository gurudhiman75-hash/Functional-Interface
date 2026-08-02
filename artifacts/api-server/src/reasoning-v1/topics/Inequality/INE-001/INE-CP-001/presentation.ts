import type {
  ComparisonConstraint,
  ComparisonRelation,
} from "../foundation/types";
import type { IneCp001AnswerSemantic, IneCp001StructuredPrompt } from "./types";

const SYMBOL_BY_RELATION: Readonly<Record<ComparisonRelation, string>> = {
  GREATER_THAN: ">",
  LESS_THAN: "<",
  EQUAL_TO: "=",
  GREATER_THAN_OR_EQUAL: "≥",
  LESS_THAN_OR_EQUAL: "≤",
};

export function relationSymbol(relation: ComparisonRelation): string {
  return SYMBOL_BY_RELATION[relation];
}

export function answerLabel(answer: IneCp001AnswerSemantic): string {
  return answer === "INDETERMINATE"
    ? "Relation cannot be determined"
    : relationSymbol(answer);
}

export function answerOptionLabel(
  answer: IneCp001AnswerSemantic,
  prompt: IneCp001StructuredPrompt,
): string {
  if (answer === "INDETERMINATE") return "The relation cannot be determined";
  const leftName =
    prompt.entityNames[prompt.query.leftId] ?? prompt.query.leftId;
  const rightName =
    prompt.entityNames[prompt.query.rightId] ?? prompt.query.rightId;
  return `${leftName} ${relationSymbol(answer)} ${rightName}`;
}

export function formatStatement(
  statement: ComparisonConstraint,
  entityNames: Readonly<Record<string, string>>,
): string {
  return `${entityNames[statement.leftId] ?? statement.leftId} ${relationSymbol(statement.relation)} ${entityNames[statement.rightId] ?? statement.rightId}`;
}

export function buildStem(prompt: IneCp001StructuredPrompt): string {
  const leftName =
    prompt.entityNames[prompt.query.leftId] ?? prompt.query.leftId;
  const rightName =
    prompt.entityNames[prompt.query.rightId] ?? prompt.query.rightId;
  return `What is the strongest relation that must be true for ${leftName} compared with ${rightName}?`;
}
