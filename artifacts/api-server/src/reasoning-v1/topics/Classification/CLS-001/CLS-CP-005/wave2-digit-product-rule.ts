import type { ClsCp005SourceGapTuple } from "./source-gap-registry";

export const CLS_CP005_WAVE2_DIGIT_PRODUCT_RULE_ID = "PAIR_FIRST_DIGIT_PRODUCT_TO_SECOND" as const;
export const CLS_CP005_WAVE2_DIGIT_PRODUCT_PROTOTYPE_ID = "CLS-CP005-PROT-W2-001" as const;
export const CLS_CP005_WAVE2_DIGIT_PRODUCT_VERSION = "cls-cp005-wave2-digit-product-v2-expanded-registry" as const;

export type ClsCp005Wave2DigitProductRuleId = typeof CLS_CP005_WAVE2_DIGIT_PRODUCT_RULE_ID;

export function clsCp005DigitProduct(value: number): number | null {
  if (!Number.isInteger(value) || value < 10 || value > 99 || value % 10 === 0) return null;
  return Math.floor(value / 10) * (value % 10);
}

export function independentlyEvaluateClsCp005Wave2DigitProductRule(
  tuple: ClsCp005SourceGapTuple,
): string | null {
  if (tuple.length !== 2) return null;
  const product = clsCp005DigitProduct(tuple[0]);
  return product !== null && product === tuple[1] ? "DIGIT_PRODUCT" : null;
}
