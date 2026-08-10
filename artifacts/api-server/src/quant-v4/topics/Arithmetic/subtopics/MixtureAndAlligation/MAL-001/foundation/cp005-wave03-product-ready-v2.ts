import {
  formatRational,
  rational,
  rationalKey,
  reduceRationalRatio,
} from "./rational";
import {
  MAL_CP005_WAVE03_CANDIDATE_ID,
  MAL_CP005_WAVE03_SOURCE_ID,
  generateMalCp005Wave03PriceChangeQuestion,
  type MalCp005Wave03PriceChangeQuestion,
} from "./cp005-wave03-price-change-candidate";

export const MAL_CP005_WAVE03_PRODUCT_READY_V2_RUNTIME_ID =
  "MAL-CP005-EN-PRICE-CHANGE-PROFIT-AMOUNT-PRODUCT-REVIEW-V2" as const;

export type MalCp005Wave03ProductReadyQuestionV2 = Omit<
  MalCp005Wave03PriceChangeQuestion,
  "runtimeId" | "stem" | "siblingStateKey" | "explanation"
> & {
  runtimeId: typeof MAL_CP005_WAVE03_PRODUCT_READY_V2_RUNTIME_ID;
  stem: string;
  siblingStateKey: string;
  explanation: MalCp005Wave03PriceChangeQuestion["explanation"];
  editorialReview: {
    status: "PRODUCT_REVIEW_REMEDIATED_V2";
    explicitSellingPriceBase: true;
    canonicalSiblingKey: true;
    fastMethodVerification: true;
    naturalPurchaseRatePhrasing: true;
  };
};

function explicitPriceBaseStem(stem: string): string {
  return stem
    .replace(
      /raises the selling price per unit by (\d+%)/u,
      "sells the mixture at a rate $1 above the purchase rate per unit",
    )
    .replace(
      /then increases the selling rate by (\d+%)/u,
      "then sells the mixture at a rate $1 above the purchase rate per unit",
    )
    .replace(/ for ₹/gu, " at ₹");
}

function canonicalCommercialSiblingKey(
  question: MalCp005Wave03PriceChangeQuestion,
): string {
  const product = question.siblingStateKey.split("|")[1];
  if (!product) throw new Error("Wave 03 candidate lost its product sibling identity.");
  const [purePart, adulterantPart] = reduceRationalRatio(
    rational(100),
    question.request.adulterantPercentOfPureQuantity,
  );
  return [
    "FREE-COMMERCIAL",
    product,
    `${rationalKey(purePart)}:${rationalKey(adulterantPart)}`,
    rationalKey(question.request.pureUnitCost),
    rationalKey(question.solution.profitPercent),
  ].join("|");
}

function fastVerification(
  question: MalCp005Wave03PriceChangeQuestion,
): string[] {
  const adulteration = formatRational(
    question.request.adulterantPercentOfPureQuantity,
  );
  const priceIncrease = formatRational(
    question.request.sellingPriceIncreasePercent,
  );
  const profitPercent = formatRational(question.solution.profitPercent);
  const actualCost = formatRational(question.solution.actualCost);
  return [
    `Fast check: combined profit percentage = ${adulteration} + ${priceIncrease} + (${adulteration} × ${priceIncrease})/100 = ${profitPercent}%.`,
    `Therefore profit = ₹${actualCost} × ${profitPercent}% = ${question.answer}.`,
  ];
}

export function generateMalCp005Wave03ProductReadyV2(
  requestedSeed = "mal-cp005-wave03-product-ready-v2:default",
): MalCp005Wave03ProductReadyQuestionV2 {
  const base = generateMalCp005Wave03PriceChangeQuestion(requestedSeed);
  const stem = explicitPriceBaseStem(base.stem);
  if (/raises the selling price per unit by|increases the selling rate by/iu.test(stem)) {
    throw new Error("Ambiguous selling-price base survived Wave 03 product remediation.");
  }
  if (!/above (?:his buying|the purchase) rate/iu.test(stem)) {
    throw new Error("Wave 03 product stem does not explicitly state the price-increase base.");
  }
  if (/ for ₹/u.test(stem)) {
    throw new Error("Unnatural purchase-rate wording survived Wave 03 product remediation.");
  }

  return {
    ...base,
    runtimeId: MAL_CP005_WAVE03_PRODUCT_READY_V2_RUNTIME_ID,
    stem,
    siblingStateKey: canonicalCommercialSiblingKey(base),
    explanation: {
      ...base.explanation,
      optionalHelp: {
        ...base.explanation.optionalHelp,
        commonMistake:
          "Do not merely add the adulteration percentage and the price increase. The higher selling rate also applies to the free adulterant, so the two effects interact.",
        verification: fastVerification(base),
      },
    },
    editorialReview: {
      status: "PRODUCT_REVIEW_REMEDIATED_V2",
      explicitSellingPriceBase: true,
      canonicalSiblingKey: true,
      fastMethodVerification: true,
      naturalPurchaseRatePhrasing: true,
    },
  };
}

export function malCp005Wave03ProductReadyV2Stable(
  question: MalCp005Wave03ProductReadyQuestionV2,
): string {
  return JSON.stringify(
    {
      candidateId: question.candidateId,
      runtimeId: question.runtimeId,
      sourceEvidenceIds: question.sourceEvidenceIds,
      selectedSeed: question.selectedSeed,
      selectionAttempt: question.selectionAttempt,
      stateKey: question.stateKey,
      siblingStateKey: question.siblingStateKey,
      request: question.request,
      solution: question.solution,
      canonicalExistingRequest: question.canonicalExistingRequest,
      stem: question.stem,
      answer: question.answer,
      options: question.options,
      correctIndex: question.correctIndex,
      optionAudit: question.optionAudit,
      explanation: question.explanation,
      equivalence: question.equivalence,
      editorialReview: question.editorialReview,
    },
    (_key, value) => (typeof value === "bigint" ? `${value}n` : value),
  );
}

if (MAL_CP005_WAVE03_CANDIDATE_ID !==
  "MAL-CP005-CAND-PROFIT-AFTER-FREE-ADULTERATION-AND-PRICE-CHANGE") {
  throw new Error("Wave 03 product-ready wrapper points at the wrong candidate.");
}
if (MAL_CP005_WAVE03_SOURCE_ID !== "RS-AGGARWAL-QA-2017-P388-Q111") {
  throw new Error("Wave 03 product-ready wrapper lost the normalized source authority.");
}
