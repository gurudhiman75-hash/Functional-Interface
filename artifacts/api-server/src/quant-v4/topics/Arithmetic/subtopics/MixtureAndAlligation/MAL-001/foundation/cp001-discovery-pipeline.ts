import { generateMalCp001Prototype } from "./pipeline";
import { generateMalCp001GapRuntimePrototype } from "./cp001-gap-runtime";
import { isMalCp001GapPrototypeId } from "./cp001-gap-registry";
import { formatRational } from "./rational";
import type { MalCp001DiscoveryPrototypeId } from "./cp001-gap-registry";
import type {
  MalCp001GapGeneratedPrototype,
  MalCp001GapResult,
} from "./cp001-gap-types";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) =>
    typeof item === "bigint" ? item.toString() : item
  );
}

function polishPluralMaterialGrammar(stem: string): string {
  return stem
    .replace(/\btea leaves blend\b/giu, "tea blend")
    .replace(/\b((?:regular|premium|reserve) tea leaves) costs\b/giu, "$1 cost")
    .replace(/\b((?:house-blend|estate|reserve) beans) costs\b/giu, "$1 cost")
    .replace(
      /What does the ([^?]+?(?:tea leaves|beans)) cost\?/giu,
      "What is the price of the $1?",
    )
    .replace(
      /How much ([^?]+?(?:tea leaves|beans)) (is used|is present|is added)\?/giu,
      "What quantity of $1 $2?",
    )
    .replace(/^A (\d+) litres mixture\b/u, "A $1-litre mixture");
}

function quantityText(
  result: Extract<MalCp001GapResult, { kind: "COMPONENT_QUANTITY" }>["quantity"],
  unit: "kg" | "litres",
): string {
  return `${formatRational(result)} ${unit}`;
}

function labelledPairText(
  question: MalCp001GapGeneratedPrototype,
  result: Extract<MalCp001GapResult, { kind: "COMPONENT_QUANTITY_PAIR" }>,
): string {
  const request = question.parameters.request;
  if (request.mode !== "DIFFERENCE_BASED_QUANTITIES") {
    return `${quantityText(result.firstQuantity, question.parameters.context.quantityUnit)} and ${quantityText(result.secondQuantity, question.parameters.context.quantityUnit)}`;
  }
  return `${quantityText(result.firstQuantity, question.parameters.context.quantityUnit)} of ${request.lowerComponentLabel} and ${quantityText(result.secondQuantity, question.parameters.context.quantityUnit)} of ${request.higherComponentLabel}`;
}

function polishGapQuestion(
  question: MalCp001GapGeneratedPrototype,
): MalCp001GapGeneratedPrototype {
  let stem = polishPluralMaterialGrammar(question.stem);
  let optionAudit = question.optionAudit;
  let options = question.options;
  let explanation = question.explanation;

  if (
    question.parameters.request.mode === "DIFFERENCE_BASED_QUANTITIES" &&
    question.solution.kind === "COMPONENT_QUANTITY_PAIR"
  ) {
    const request = question.parameters.request;
    const labelledAnswer = labelledPairText(question, question.solution);
    stem = stem.replace(
      /What (?:are the two quantities|quantity of each is used|are both quantities|are those quantities)\?$/u,
      `What are the quantities of ${request.lowerComponentLabel} and ${request.higherComponentLabel}, respectively?`,
    );
    optionAudit = question.optionAudit.map((option) => ({
      ...option,
      text: option.result.kind === "COMPONENT_QUANTITY_PAIR"
        ? labelledPairText(question, option.result)
        : option.text,
    }));
    options = optionAudit.map((option) => option.text);
    explanation = {
      ...question.explanation,
      steps: question.explanation.steps.map((step) =>
        step.startsWith("Scaling both parts gives")
          ? `Scaling both parts gives ${labelledAnswer}.`
          : step
      ),
      conclusion: `Therefore, the quantities are ${labelledAnswer}.`,
    };
  }

  if (
    question.parameters.request.mode === "TWO_STAGE_UNKNOWN_QUANTITY" &&
    question.solution.kind === "COMPONENT_QUANTITY"
  ) {
    explanation = {
      ...explanation,
      conclusion:
        `Therefore, ${quantityText(question.solution.quantity, question.parameters.context.quantityUnit)} of ${question.parameters.request.finalComponentLabel} is required.`,
    };
  }

  return {
    ...question,
    stem,
    options,
    optionAudit,
    explanation,
    reasoningGraph: {
      nodes: question.reasoningGraph.nodes.map((node) => {
        if (node.kind !== "CONCLUSION") return node;
        const fingerprintSuffix = node.text.match(/\[[^\]]+\]$/u)?.[0] ?? "";
        return {
          ...node,
          text: `${explanation.conclusion}${fingerprintSuffix ? ` ${fingerprintSuffix}` : ""}`,
        };
      }),
    },
  };
}

/**
 * Unified discovery wrapper. Every external seed is deterministic; derived
 * retry seeds are used only when an exact hidden state is unsuitable for
 * learner-facing integral answers or four-option construction.
 */
export function generateMalCp001DiscoveryPrototype(
  prototypeId: MalCp001DiscoveryPrototypeId,
  seed: string,
) {
  if (!isMalCp001GapPrototypeId(prototypeId)) {
    return generateMalCp001Prototype(prototypeId, seed);
  }

  let lastError: unknown = null;
  for (let attempt = 0; attempt < 160; attempt += 1) {
    const candidateSeed = attempt === 0 ? seed : `${seed}@review-${attempt}`;
    try {
      const generated = generateMalCp001GapRuntimePrototype(
        prototypeId,
        candidateSeed,
      );
      return polishGapQuestion({
        ...generated,
        seed,
        parameters: {
          ...generated.parameters,
          seed,
        },
      });
    } catch (error) {
      lastError = error;
    }
  }

  const reason = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(
    `Could not generate a review-safe discovery prototype for ${prototypeId}/${seed}: ${reason}`,
  );
}

export function stableMalCp001DiscoveryPrototype(value: unknown): string {
  return stable(value);
}
