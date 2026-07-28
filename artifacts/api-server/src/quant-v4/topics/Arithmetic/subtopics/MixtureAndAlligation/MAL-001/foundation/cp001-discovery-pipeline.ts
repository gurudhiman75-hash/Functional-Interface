import { generateMalCp001Prototype } from "./pipeline";
import { generateMalCp001GapRuntimePrototype } from "./cp001-gap-runtime";
import { isMalCp001GapPrototypeId } from "./cp001-gap-registry";
import { formatRational } from "./rational";
import type { MalCp001DiscoveryPrototypeId } from "./cp001-gap-registry";
import type {
  MalCp001GeneratedPrototype,
  MalCp001SolveResult,
  MalReasoningGraph,
  Rational,
} from "./types";
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
    .replace(/\bcoffee beans blend\b/giu, "coffee blend")
    .replace(/\b((?:regular|premium|reserve) tea leaves) costs\b/giu, "$1 cost")
    .replace(/\b((?:house-blend|estate|reserve) beans) costs\b/giu, "$1 cost")
    .replace(
      /What does the ([^?]+?(?:tea leaves|beans)) cost\?/giu,
      "What is the price of the $1?",
    )
    .replace(
      /How much ([^?]+?(?:tea leaves|beans)) (?:is|was) (used|present|added)\?/giu,
      "What quantity of $1 is $2?",
    )
    .replace(/^A (\d+) litres mixture\b/u, "A $1-litre mixture");
}

function polishPortionGrammar(stem: string): string {
  return stem
    .replace(
      /From this blend, (\d+(?:\s+\d+\/\d+)?\s+(?:kg|litres)) is mixed with/giu,
      "A $1 portion of this blend is mixed with",
    )
    .replace(
      /Then (\d+(?:\s+\d+\/\d+)?\s+(?:kg|litres)) of this blend is mixed with/giu,
      "Then a $1 portion of this blend is mixed with",
    )
    .replace(
      /If (\d+(?:\s+\d+\/\d+)?\s+(?:kg|litres)) of it is combined with/giu,
      "If a $1 portion of it is combined with",
    )
    .replace(
      /Next, (\d+(?:\s+\d+\/\d+)?\s+(?:kg|litres)) of that uniform blend is combined with/giu,
      "Next, a $1 portion of that uniform blend is combined with",
    )
    .replace(
      /, (\d+(?:\s+\d+\/\d+)?\s+(?:kg|litres)) is taken\. What quantity/giu,
      ", a $1 portion is taken. What quantity",
    )
    .replace(
      /^First, (\d+(?:\s+\d+\/\d+)?\s+(?:kg|litres)) of (.+?) is blended with/giu,
      "First, $1 of $2 are blended with",
    );
}

function polishCommonStem(stem: string): string {
  return polishPortionGrammar(polishPluralMaterialGrammar(stem.trim()));
}

function quantityText(value: Rational, unit: "kg" | "litres"): string {
  return `${formatRational(value)} ${unit}`;
}

function labelledCorePairText(
  question: MalCp001GeneratedPrototype,
  result: Extract<MalCp001SolveResult, { kind: "COMPONENT_QUANTITY_PAIR" }>,
): string {
  const request = question.parameters.request;
  if (request.mode !== "TWO_QUANTITIES_FROM_TOTAL_AND_TARGET") {
    return `${quantityText(result.firstQuantity, question.parameters.context.quantityUnit)} and ${quantityText(result.secondQuantity, question.parameters.context.quantityUnit)}`;
  }
  return `${quantityText(result.firstQuantity, question.parameters.context.quantityUnit)} of ${request.lowerComponentLabel} and ${quantityText(result.secondQuantity, question.parameters.context.quantityUnit)} of ${request.higherComponentLabel}`;
}

function labelledGapPairText(
  question: MalCp001GapGeneratedPrototype,
  result: Extract<MalCp001GapResult, { kind: "COMPONENT_QUANTITY_PAIR" }>,
): string {
  const request = question.parameters.request;
  if (request.mode !== "DIFFERENCE_BASED_QUANTITIES") {
    return `${quantityText(result.firstQuantity, question.parameters.context.quantityUnit)} and ${quantityText(result.secondQuantity, question.parameters.context.quantityUnit)}`;
  }
  return `${quantityText(result.firstQuantity, question.parameters.context.quantityUnit)} of ${request.lowerComponentLabel} and ${quantityText(result.secondQuantity, question.parameters.context.quantityUnit)} of ${request.higherComponentLabel}`;
}

function replaceConclusionNode<T extends MalCp001GeneratedPrototype | MalCp001GapGeneratedPrototype>(
  question: T,
  conclusion: string,
): MalReasoningGraph {
  return {
    nodes: question.reasoningGraph.nodes.map((node) => {
      if (node.kind !== "CONCLUSION") return node;
      const fingerprintSuffix = node.text.match(/\[[^\]]+\]$/u)?.[0] ?? "";
      return {
        ...node,
        text: `${conclusion}${fingerprintSuffix ? ` ${fingerprintSuffix}` : ""}`,
      };
    }),
  };
}

function polishCoreQuestion(
  question: MalCp001GeneratedPrototype,
): MalCp001GeneratedPrototype {
  const request = question.parameters.request;
  let stem = polishCommonStem(question.stem);
  let options = question.options;
  let optionAudit = question.optionAudit;
  let explanation = question.explanation;

  if (request.mode === "MEAN_FROM_COMPONENTS") {
    stem = stem
      .replace(
        /What is the average value of the resulting [^?]+\?$/u,
        "What is the average value per unit of the resulting blend?",
      )
      .replace(
        /What value per unit does the final [^?]+ have\?$/u,
        "What is the final blend's value per unit?",
      )
      .replace(
        /What is the average value of [^?]+ made by mixing/u,
        "What is the average value per unit of the blend made by mixing",
      );
  }

  if (request.mode === "UNKNOWN_COMPONENT_QUANTITY") {
    stem = stem.replace(
      /What quantity of the latter was included\?$/u,
      `What quantity of ${request.unknownComponentLabel} was included?`,
    );
    stem = stem.replace(
      /^How much (.+?) at /u,
      "What quantity of $1 at ",
    );
  }

  if (request.mode === "ADD_SOURCE_TO_REACH_TARGET") {
    stem = stem.replace(
      /^(.+?) wants to change (.+?) into a blend worth (.+?) by adding (.+?)\. How much should be added\?$/u,
      "$1 starts with $2 and adds $4 to obtain a blend worth $3. What quantity should be added?",
    );
  }

  if (
    request.mode === "TWO_QUANTITIES_FROM_TOTAL_AND_TARGET" &&
    question.solution.kind === "COMPONENT_QUANTITY_PAIR"
  ) {
    const labelledAnswer = labelledCorePairText(question, question.solution);
    stem = stem.replace(
      /(?:What quantity of each grade was used|How much of each grade is present|What are the two component quantities|What quantity of each was mixed)\?$/u,
      `What are the quantities of ${request.lowerComponentLabel} and ${request.higherComponentLabel}, respectively?`,
    );
    optionAudit = question.optionAudit.map((option) => ({
      ...option,
      text: option.result.kind === "COMPONENT_QUANTITY_PAIR"
        ? labelledCorePairText(question, option.result)
        : option.text,
    }));
    options = optionAudit.map((option) => option.text);
    explanation = {
      ...question.explanation,
      conclusion: `The quantities are ${labelledAnswer}.`,
    };
  }

  return {
    ...question,
    stem,
    options,
    optionAudit,
    explanation,
    reasoningGraph: replaceConclusionNode(question, explanation.conclusion),
  };
}

function polishGapQuestion(
  question: MalCp001GapGeneratedPrototype,
): MalCp001GapGeneratedPrototype {
  const request = question.parameters.request;
  let stem = polishCommonStem(question.stem);
  let optionAudit = question.optionAudit;
  let options = question.options;
  let explanation = question.explanation;

  if (
    request.mode === "COMPONENT_SHARE_FROM_TARGET" &&
    question.solution.kind === "COMPONENT_QUANTITY"
  ) {
    const requestedLabel = request.requestedSide === "LOWER"
      ? request.lowerComponentLabel
      : request.higherComponentLabel;
    stem = stem
      .replace(/What is the share of [^?]+\?$/u, `What quantity of ${requestedLabel} is used?`)
      .replace(/How much [^?]+ is present\?$/u, `What quantity of ${requestedLabel} is present?`);
    explanation = {
      ...explanation,
      conclusion: `Hence, the required quantity of ${requestedLabel} is ${quantityText(question.solution.quantity, question.parameters.context.quantityUnit)}.`,
    };
  }

  if (
    request.mode === "DIFFERENCE_BASED_QUANTITIES" &&
    question.solution.kind === "COMPONENT_QUANTITY_PAIR"
  ) {
    const labelledAnswer = labelledGapPairText(question, question.solution);
    stem = stem.replace(
      /What (?:are the two quantities|quantity of each is used|are both quantities|are those quantities)\?$/u,
      `What are the quantities of ${request.lowerComponentLabel} and ${request.higherComponentLabel}, respectively?`,
    );
    optionAudit = question.optionAudit.map((option) => ({
      ...option,
      text: option.result.kind === "COMPONENT_QUANTITY_PAIR"
        ? labelledGapPairText(question, option.result)
        : option.text,
    }));
    options = optionAudit.map((option) => option.text);
    explanation = {
      ...explanation,
      steps: explanation.steps.map((step) =>
        step.startsWith("Scaling both parts gives")
          ? `Scaling both parts gives ${labelledAnswer}.`
          : step
      ),
      conclusion: `Therefore, the quantities are ${labelledAnswer}.`,
    };
  }

  if (
    request.mode === "TWO_STAGE_UNKNOWN_QUANTITY" &&
    question.solution.kind === "COMPONENT_QUANTITY"
  ) {
    explanation = {
      ...explanation,
      conclusion:
        `Therefore, ${quantityText(question.solution.quantity, question.parameters.context.quantityUnit)} of ${request.finalComponentLabel} is required.`,
    };
  }

  if (request.mode === "THREE_WAY_TARGET_WITH_RELATION") {
    stem = stem
      .replace(
        /The middle component is used in ([^ ]+) times the quantity of the lower component\./u,
        "The middle component is used in a quantity $1 times that of the lower component.",
      )
      .replace(
        /what is the quantity of the highest-priced component\?$/iu,
        `what is the quantity of ${request.higherComponentLabel}?`,
      )
      .replace(
        /how much of the higher component is used\?$/iu,
        `what quantity of ${request.higherComponentLabel} is used?`,
      );
    if (question.solution.kind === "COMPONENT_QUANTITY") {
      explanation = {
        ...explanation,
        conclusion:
          `Hence, the quantity of ${request.higherComponentLabel} is ${quantityText(question.solution.quantity, question.parameters.context.quantityUnit)}.`,
      };
    }
  }

  return {
    ...question,
    stem,
    options,
    optionAudit,
    explanation,
    reasoningGraph: replaceConclusionNode(question, explanation.conclusion),
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
    return polishCoreQuestion(generateMalCp001Prototype(prototypeId, seed));
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
