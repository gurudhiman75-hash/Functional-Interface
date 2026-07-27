import type { Money, Rational } from "./types";
import { asPercent, divideRational, rational, subtractRational } from "./rational";

export type Cp005Verification = Readonly<{
  valid: boolean;
  expectedRatePercent?: Rational;
  actualRatePercent?: Rational;
  reason?: string;
}>;

function equalRational(a: Rational, b: Rational): boolean {
  return a.numerator * b.denominator === b.numerator * a.denominator;
}

function absolute(value: Rational): Rational {
  return rational(value.numerator < 0n ? -value.numerator : value.numerator, value.denominator);
}

export function verifyFalseQuantityRate(
  costPricePerTrueQuantity: Money,
  quotedSellingPricePerNominalQuantity: Money,
  trueQuantity: bigint,
  deliveredQuantity: bigint,
  actualRatePercent: Rational,
): Cp005Verification {
  if (
    costPricePerTrueQuantity.paise <= 0n ||
    quotedSellingPricePerNominalQuantity.paise < 0n ||
    trueQuantity <= 0n ||
    deliveredQuantity <= 0n
  ) {
    return { valid: false, reason: "Prices and quantities must be positive." };
  }
  const deliveredCost = rational(
    costPricePerTrueQuantity.paise * deliveredQuantity,
    trueQuantity,
  );
  const difference = subtractRational(
    rational(quotedSellingPricePerNominalQuantity.paise),
    deliveredCost,
  );
  const expectedRatePercent = asPercent(divideRational(absolute(difference), deliveredCost));
  return {
    valid: equalRational(expectedRatePercent, actualRatePercent),
    expectedRatePercent,
    actualRatePercent,
  };
}

export function verifyBuyHeavySellLightRate(
  purchasePricePerNominalQuantity: Money,
  sellingPricePerNominalQuantity: Money,
  receivedQuantity: bigint,
  deliveredQuantity: bigint,
  actualRatePercent: Rational,
): Cp005Verification {
  if (
    purchasePricePerNominalQuantity.paise <= 0n ||
    sellingPricePerNominalQuantity.paise < 0n ||
    receivedQuantity <= 0n ||
    deliveredQuantity <= 0n
  ) {
    return { valid: false, reason: "Prices and quantities must be positive." };
  }
  const totalRevenue = rational(
    sellingPricePerNominalQuantity.paise * receivedQuantity,
    deliveredQuantity,
  );
  const cost = rational(purchasePricePerNominalQuantity.paise);
  const difference = subtractRational(totalRevenue, cost);
  const expectedRatePercent = asPercent(divideRational(absolute(difference), cost));
  return {
    valid: equalRational(expectedRatePercent, actualRatePercent),
    expectedRatePercent,
    actualRatePercent,
  };
}

export function verifyCustomerOverchargeRate(
  trueQuantity: bigint,
  deliveredQuantity: bigint,
  actualOverchargePercent: Rational,
): Cp005Verification {
  if (trueQuantity <= 0n || deliveredQuantity <= 0n || deliveredQuantity > trueQuantity) {
    return { valid: false, reason: "Quantities are invalid." };
  }
  const expectedRatePercent = asPercent(
    subtractRational(rational(trueQuantity, deliveredQuantity), rational(1)),
  );
  return {
    valid: equalRational(expectedRatePercent, actualOverchargePercent),
    expectedRatePercent,
    actualRatePercent: actualOverchargePercent,
  };
}
