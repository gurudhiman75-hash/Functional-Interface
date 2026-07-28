import { generateMalCp001DiscoveryPrototype } from "./cp001-discovery-pipeline";
import type { MalCp001DiscoveryPrototypeId } from "./cp001-gap-registry";
import type {
  MalCp001ProvisionalQlTemplateId,
  MalCp001ProvisionalSolveModeId,
} from "./cp001-ql-expansion-ledger";
import type { MalAnswerSemantic, MalTaskDirection } from "./types";

const bigIntPrototype = BigInt.prototype as unknown as { toJSON?: () => string };
if (typeof bigIntPrototype.toJSON !== "function") {
  Object.defineProperty(bigIntPrototype, "toJSON", {
    configurable: true,
    value(this: bigint): string {
      return this.toString();
    },
  });
}

export interface MalCp001FoundationQuestionContract {
  qlTemplateId: MalCp001ProvisionalQlTemplateId;
  solveModeId: MalCp001ProvisionalSolveModeId;
  taskDirection: MalTaskDirection;
  answerSemantic: MalAnswerSemantic;
}

export const MAL_CP001_FOUNDATION_PROTOTYPE_CONTRACTS:
  Readonly<Record<MalCp001DiscoveryPrototypeId, MalCp001FoundationQuestionContract>> = {
    "MAL-CP001-PROT-RATIO-FROM-TARGET": {
      qlTemplateId: "MAL-CP001-QLC-TARGET-RATIO",
      solveModeId: "MAL-CP001-SM-TARGET-RATIO",
      taskDirection: "INVERSE",
      answerSemantic: "COMPONENT_RATIO",
    },
    "MAL-CP001-PROT-MEAN-FROM-QUANTITIES": {
      qlTemplateId: "MAL-CP001-QLC-FINAL-MEAN-EXPLICIT-TWO",
      solveModeId: "MAL-CP001-SM-FINAL-MEAN",
      taskDirection: "FORWARD",
      answerSemantic: "FINAL_MEAN_VALUE",
    },
    "MAL-CP001-PROT-MEAN-FROM-RATIO": {
      qlTemplateId: "MAL-CP001-QLC-FINAL-MEAN-RATIO",
      solveModeId: "MAL-CP001-SM-FINAL-MEAN",
      taskDirection: "FORWARD",
      answerSemantic: "FINAL_MEAN_VALUE",
    },
    "MAL-CP001-PROT-THREE-COMPONENT-MEAN": {
      qlTemplateId: "MAL-CP001-QLC-FINAL-MEAN-MULTI-COMPONENT",
      solveModeId: "MAL-CP001-SM-FINAL-MEAN",
      taskDirection: "FORWARD",
      answerSemantic: "FINAL_MEAN_VALUE",
    },
    "MAL-CP001-PROT-UNKNOWN-SOURCE-VALUE": {
      qlTemplateId: "MAL-CP001-QLC-UNKNOWN-SOURCE-QUANTITY-EVIDENCE",
      solveModeId: "MAL-CP001-SM-UNKNOWN-SOURCE-WEIGHTED-BALANCE",
      taskDirection: "INVERSE",
      answerSemantic: "SOURCE_VALUE",
    },
    "MAL-CP001-PROT-SOURCE-VALUE-FROM-RATIO": {
      qlTemplateId: "MAL-CP001-QLC-UNKNOWN-SOURCE-RATIO-EVIDENCE",
      solveModeId: "MAL-CP001-SM-UNKNOWN-SOURCE-RATIO-EVIDENCE",
      taskDirection: "INVERSE",
      answerSemantic: "SOURCE_VALUE",
    },
    "MAL-CP001-PROT-UNKNOWN-COMPONENT-QUANTITY": {
      qlTemplateId: "MAL-CP001-QLC-UNKNOWN-QUANTITY-ONE-KNOWN",
      solveModeId: "MAL-CP001-SM-UNKNOWN-COMPONENT-QUANTITY",
      taskDirection: "INVERSE",
      answerSemantic: "COMPONENT_QUANTITY",
    },
    "MAL-CP001-PROT-ADDED-QUANTITY-FOR-TARGET": {
      qlTemplateId: "MAL-CP001-QLC-UNKNOWN-QUANTITY-ONE-KNOWN",
      solveModeId: "MAL-CP001-SM-UNKNOWN-COMPONENT-QUANTITY",
      taskDirection: "RECONSTRUCTION",
      answerSemantic: "COMPONENT_QUANTITY",
    },
    "MAL-CP001-PROT-THIRD-COMPONENT-QUANTITY": {
      qlTemplateId: "MAL-CP001-QLC-UNKNOWN-QUANTITY-MULTI-KNOWN",
      solveModeId: "MAL-CP001-SM-UNKNOWN-COMPONENT-QUANTITY",
      taskDirection: "INVERSE",
      answerSemantic: "COMPONENT_QUANTITY",
    },
    "MAL-CP001-PROT-TWO-QUANTITIES-FROM-TOTAL": {
      qlTemplateId: "MAL-CP001-QLC-RATIO-SCALE-BOTH-QUANTITIES",
      solveModeId: "MAL-CP001-SM-RATIO-SCALE-FROM-TOTAL",
      taskDirection: "RECONSTRUCTION",
      answerSemantic: "COMPONENT_QUANTITY_PAIR",
    },
    "MAL-CP001-PROT-COMPONENT-SHARE-FROM-TARGET": {
      qlTemplateId: "MAL-CP001-QLC-RATIO-SCALE-REQUESTED-SHARE",
      solveModeId: "MAL-CP001-SM-RATIO-SCALE-FROM-TOTAL",
      taskDirection: "RECONSTRUCTION",
      answerSemantic: "COMPONENT_QUANTITY",
    },
    "MAL-CP001-PROT-TWO-STAGE-BLEND-MEAN": {
      qlTemplateId: "MAL-CP001-QLC-TWO-STAGE-FINAL-MEAN",
      solveModeId: "MAL-CP001-SM-TWO-STAGE-FINAL-MEAN",
      taskDirection: "FORWARD",
      answerSemantic: "FINAL_MEAN_VALUE",
    },
    "MAL-CP001-PROT-DIFFERENCE-BASED-QUANTITIES": {
      qlTemplateId: "MAL-CP001-QLC-RATIO-SCALE-BOTH-QUANTITIES",
      solveModeId: "MAL-CP001-SM-RATIO-SCALE-FROM-TOTAL",
      taskDirection: "RECONSTRUCTION",
      answerSemantic: "COMPONENT_QUANTITY_PAIR",
    },
    "MAL-CP001-PROT-TWO-STAGE-UNKNOWN": {
      qlTemplateId: "MAL-CP001-QLC-TWO-STAGE-FINAL-MEAN",
      solveModeId: "MAL-CP001-SM-TWO-STAGE-FINAL-MEAN",
      taskDirection: "INVERSE",
      answerSemantic: "COMPONENT_QUANTITY",
    },
    "MAL-CP001-PROT-THREE-WAY-TARGET-WITH-RELATION": {
      qlTemplateId: "MAL-CP001-QLC-UNKNOWN-QUANTITY-MULTI-KNOWN",
      solveModeId: "MAL-CP001-SM-UNKNOWN-COMPONENT-QUANTITY",
      taskDirection: "RECONSTRUCTION",
      answerSemantic: "COMPONENT_QUANTITY",
    },
  };

function perUnitNoun(question: any): "kg" | "litre" {
  return question.parameters?.context?.quantityUnit === "kg" ? "kg" : "litre";
}

function unknownSourceLabel(question: any): string | null {
  const request = question.parameters?.request;
  if (!request) return null;
  if (request.mode === "UNKNOWN_COMPONENT_VALUE") {
    return request.unknownComponentLabel;
  }
  if (request.mode === "SOURCE_VALUE_FROM_RATIO") {
    return request.knownSide === "LOWER"
      ? request.higherComponentLabel
      : request.lowerComponentLabel;
  }
  return null;
}

function unknownQuantityLabel(question: any): string | null {
  const request = question.parameters?.request;
  if (!request) return null;
  if (request.mode === "ADD_SOURCE_TO_REACH_TARGET") {
    return request.addedComponentLabel;
  }
  if (request.mode === "UNKNOWN_COMPONENT_QUANTITY") {
    return request.unknownComponentLabel;
  }
  return null;
}

function requestedShareLabel(question: any): string | null {
  const request = question.parameters?.request;
  if (request?.mode !== "COMPONENT_SHARE_FROM_TARGET") return null;
  return request.requestedSide === "LOWER"
    ? request.lowerComponentLabel
    : request.higherComponentLabel;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isPluralMaterialLabel(label: string): boolean {
  return /(?:leaves|beans)$/iu.test(label);
}

function costVerb(label: string): "cost" | "costs" {
  return isPluralMaterialLabel(label) ? "cost" : "costs";
}

function sentenceCaseLabel(label: string): string {
  return label.length === 0 ? label : `${label[0]!.toUpperCase()}${label.slice(1)}`;
}

function normalizeStem(question: any): string {
  const unit = perUnitNoun(question);
  const request = question.parameters?.request;
  let stem = String(question.stem);

  stem = stem
    .replace(/\bA edible oil blend\b/g, "An edible oil blend")
    .replace(/\bIf the ([^,.?]*(?:tea leaves|beans)) is priced at\b/giu, "If the $1 are priced at")
    .replace(/\ba (\d+(?:\s+\d+\/\d+)?) litres portion\b/giu, "a $1-litre portion")
    .replace(/\bA (\d+(?:\s+\d+\/\d+)?) litres portion\b/gu, "A $1-litre portion")
    .replace(/\.\s+a (\d+(?:\s+\d+\/\d+)?-litre portion)\b/giu, ". A $1")
    .replace(/,\s+What\b/g, ", what")
    .replace(/,\s+How\b/g, ", how")
    .replace(/\bto obtain (\d+(?:\s+\d+\/\d+)? (?:kg|litres)) worth\b/giu, "to obtain $1 of a blend worth")
    .replace(/\bits average value is\b/giu, "its average price is")
    .replace(/\bWhat is the final blend's value per unit\?/giu, `What is the final blend's price per ${unit}?`)
    .replace(/\bwhat is the resulting value per unit\?/giu, `what is the resulting price per ${unit}?`)
    .replace(/\bWhat is the weighted average value of the blend\?/giu, `What is the blend's weighted average price per ${unit}?`)
    .replace(/\bWhat is the average value per unit of the resulting blend\?/giu, `What is the resulting blend's average price per ${unit}?`)
    .replace(/\bWhat is the average value per unit of the blend made by\b/giu, `What is the average price per ${unit} of the blend made by`)
    .replace(/\bwhat is the blend's average value\?/giu, `what is the blend's average price per ${unit}?`)
    .replace(/\bWhat will the mixed ([^?]+?) be worth per unit\?/giu, `What will the mixed $1 cost per ${unit}?`)
    .replace(/\bWhat is the average value of the blend\?/giu, `What is the blend's average price per ${unit}?`)
    .replace(/\bWhat is the final average value when\b/giu, `What is the final average price per ${unit} when`)
    .replace(/\bWhat value per unit does the complete mixture have\?/giu, `What is the complete mixture's average price per ${unit}?`)
    .replace(/\bWhat is the weighted value per unit of the resulting blend\?/giu, `What is the resulting blend's weighted average price per ${unit}?`)
    .replace(/\bWhat does the final blend cost per unit\?/giu, `What is the final blend's price per ${unit}?`)
    .replace(/\bWhat is the final average price\?/giu, `What is the final average price per ${unit}?`)
    .replace(/\bwhat is the final mean price\?/giu, `what is the final mean price per ${unit}?`)
    .replace(/\bWhat is the resulting average price\?/giu, `What is the resulting average price per ${unit}?`);

  const unknownLabel = unknownSourceLabel(question);
  if (unknownLabel) {
    const escapedUnknownLabel = escapeRegExp(unknownLabel);
    const replacement = `What is the price of ${unknownLabel} per ${unit}?`;
    stem = stem
      .replace(/[Ww]hat is the value of [^?]+(?: per unit)?\?$/u, replacement)
      .replace(/[Ww]hat is the unknown grade's value per unit\?$/u, replacement)
      .replace(/[Ww]hat is its value per unit\?$/u, replacement)
      .replace(/[Ww]hat is the unit price of [^?]+\?$/u, replacement)
      .replace(/[Ww]hat is the cost of [^?]+\?$/u, replacement)
      .replace(/[Ww]hat does [^?]+ cost\?$/u, replacement)
      .replace(/[Ww]hat price must [^?]+ have\?$/u, replacement)
      .replace(
        new RegExp(`[Ww]hat is the price of (?:the )?${escapedUnknownLabel}(?: per (?:kg|litre))?\\?$`, "u"),
        replacement,
      );
  }

  const quantityLabel = unknownQuantityLabel(question);
  if (quantityLabel) {
    const escapedQuantityLabel = escapeRegExp(quantityLabel);
    stem = stem
      .replace(/What quantity should be added\?$/u, `What quantity of ${quantityLabel} should be added?`)
      .replace(/What quantity of the third grade is present\?$/u, `What quantity of ${quantityLabel} is present?`)
      .replace(/[Ww]hat is that quantity\?$/u, `What quantity of ${quantityLabel} is used?`);

    if (
      question.parameters?.context?.quantityUnit === "kg" &&
      isPluralMaterialLabel(quantityLabel)
    ) {
      const pluralAction =
        request.mode === "ADD_SOURCE_TO_REACH_TARGET" ? "added" : "present";
      const clearPluralPrompt =
        `How many kilograms of ${quantityLabel} are ${pluralAction}?`;
      stem = stem
        .replace(
          new RegExp(`What quantity of ${escapedQuantityLabel} (?:should be added|is present|is used)\\?`, "u"),
          clearPluralPrompt,
        )
        .replace(
          new RegExp(`How much ${escapedQuantityLabel} (?:was used|was added|must be added)\\?`, "u"),
          clearPluralPrompt,
        );
    }
  }

  const shareLabel = requestedShareLabel(question);
  if (shareLabel) {
    const escapedShareLabel = escapeRegExp(shareLabel);
    stem = stem.replace(
      new RegExp(`What is the share of ${escapedShareLabel}\\?`, "u"),
      `What quantity of ${shareLabel} is used?`,
    );

    if (
      question.parameters?.context?.quantityUnit === "kg" &&
      isPluralMaterialLabel(shareLabel)
    ) {
      const clearPluralPrompt = `How many kilograms of ${shareLabel} are used?`;
      stem = stem
        .replace(
          new RegExp(`What quantity of ${escapedShareLabel} (?:is used|is present)\\?`, "u"),
          clearPluralPrompt,
        )
        .replace(
          new RegExp(`What quantity of ${escapedShareLabel} does it contain\\?`, "u"),
          clearPluralPrompt,
        )
        .replace(
          new RegExp(`How much ${escapedShareLabel} (?:is used|is present)\\?`, "u"),
          clearPluralPrompt,
        );
    }
  }

  return stem;
}

function normalizeCommonTrap(value: unknown): string {
  let normalized = String(value).replace(/^Common Trap:/u, "Common trap:");
  normalized = normalized.replace(
    /^Common trap:\s+([A-Z])/u,
    (_match, firstLetter: string) => `Common trap: ${firstLetter.toLowerCase()}`,
  );
  return normalized.replace(/\btwo stage\b/giu, "two-stage");
}

function normalizeExplanation(question: any): any {
  const explanation = { ...question.explanation };
  explanation.commonTrap = normalizeCommonTrap(explanation.commonTrap);

  const unknownLabel = unknownSourceLabel(question);
  if (unknownLabel) {
    const answer = question.options[question.correctIndex];
    const conclusionLabel = sentenceCaseLabel(unknownLabel);
    explanation.conclusion = `${conclusionLabel} ${costVerb(unknownLabel)} ${answer}.`;
  }

  const shareLabel = requestedShareLabel(question);
  if (shareLabel) {
    explanation.conclusion = String(explanation.conclusion).replace(
      "the required component quantity is",
      `the required quantity of ${shareLabel} is`,
    );
  }

  return explanation;
}

/**
 * Canonical review-only foundation surface. It leaves the exact mathematical
 * package untouched and normalises learner metadata and English presentation.
 */
export function generateMalCp001FoundationQuestion(
  prototypeId: MalCp001DiscoveryPrototypeId,
  seed: string,
): ReturnType<typeof generateMalCp001DiscoveryPrototype> & {
  foundationQlTemplateId: MalCp001ProvisionalQlTemplateId;
  foundationSolveModeId: MalCp001ProvisionalSolveModeId;
} {
  const question: any = generateMalCp001DiscoveryPrototype(prototypeId, seed);
  const contract = MAL_CP001_FOUNDATION_PROTOTYPE_CONTRACTS[prototypeId];

  question.taskDirection = contract.taskDirection;
  question.answerSemantic = contract.answerSemantic;
  question.stem = normalizeStem(question);
  question.explanation = normalizeExplanation(question);
  question.foundationQlTemplateId = contract.qlTemplateId;
  question.foundationSolveModeId = contract.solveModeId;

  return question;
}
