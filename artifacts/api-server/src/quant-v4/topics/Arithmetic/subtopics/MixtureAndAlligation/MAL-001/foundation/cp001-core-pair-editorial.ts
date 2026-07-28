import { formatRational } from "./rational";
import type {
  MalCp001GeneratedPrototype,
  MalCp001SolveResult,
  Rational,
} from "./types";

function quantityText(value: Rational, unit: "kg" | "litres"): string {
  return `${formatRational(value)} ${unit}`;
}

function labelledPairText(
  question: MalCp001GeneratedPrototype,
  result: Extract<MalCp001SolveResult, { kind: "COMPONENT_QUANTITY_PAIR" }>,
): string {
  const request = question.parameters.request;
  if (request.mode !== "TWO_QUANTITIES_FROM_TOTAL_AND_TARGET") {
    throw new Error("Core pair editorial helper received a non-pair request.");
  }
  const unit = question.parameters.context.quantityUnit;
  return `${quantityText(result.firstQuantity, unit)} of ${request.lowerComponentLabel} and ${quantityText(result.secondQuantity, unit)} of ${request.higherComponentLabel}`;
}

export function applyMalCp001CorePairEditorial(
  question: MalCp001GeneratedPrototype,
): void {
  const request = question.parameters.request;
  if (
    request.mode !== "TWO_QUANTITIES_FROM_TOTAL_AND_TARGET" ||
    question.solution.kind !== "COMPONENT_QUANTITY_PAIR"
  ) {
    return;
  }

  question.stem = question.stem.replace(
    /(?:What quantity of each grade was used|How much of each grade is present|What are the two component quantities|What quantity of each was mixed)\?$/iu,
    `What are the quantities of ${request.lowerComponentLabel} and ${request.higherComponentLabel}, respectively?`,
  );
  question.optionAudit = question.optionAudit.map((option) => ({
    ...option,
    text: option.result.kind === "COMPONENT_QUANTITY_PAIR"
      ? labelledPairText(question, option.result)
      : option.text,
  }));
  question.options = question.optionAudit.map((option) => option.text);

  const conclusion = `The quantities are ${labelledPairText(question, question.solution)}.`;
  question.explanation = {
    ...question.explanation,
    conclusion,
  };
  question.reasoningGraph = {
    nodes: question.reasoningGraph.nodes.map((node) =>
      node.kind === "CONCLUSION"
        ? { ...node, text: conclusion }
        : node
    ),
  };
}
