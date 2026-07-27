import type {
  FundamentalSolveRequest,
  FundamentalSolveResult,
} from "../foundation/solver";
import type { Money, Rational, VerificationResult } from "../foundation/types";
import { moneyFromPaise } from "../foundation/money";
import {
  addRational,
  compareRational,
  divideRational,
  multiplyRational,
  rational,
  subtractRational,
} from "../foundation/rational";

function absoluteBigInt(value: bigint) {
  return value < 0n ? -value : value;
}

function moneyFromExactRational(value: Rational): Money {
  if (value.numerator % value.denominator !== 0n) {
    throw new Error(
      `Independent CP-001 verification produced non-integral paise: ${value.numerator}/${value.denominator}.`,
    );
  }
  return moneyFromPaise(value.numerator / value.denominator);
}

function multiplyMoneyByRational(value: Money, factor: Rational): Money {
  return moneyFromExactRational(multiplyRational(rational(value.paise), factor));
}

function commercialFactor(
  direction: "PROFIT" | "LOSS",
  ratePercent: Rational,
): Rational {
  const rate = divideRational(ratePercent, rational(100));
  return direction === "PROFIT"
    ? addRational(rational(1), rate)
    : subtractRational(rational(1), rate);
}

function directionFromDelta(delta: bigint): "PROFIT" | "LOSS" | "NO_CHANGE" {
  return delta > 0n ? "PROFIT" : delta < 0n ? "LOSS" : "NO_CHANGE";
}

function signedRate(
  direction: "PROFIT" | "LOSS",
  ratePercent: Rational,
): Rational {
  return direction === "PROFIT"
    ? ratePercent
    : rational(-ratePercent.numerator, ratePercent.denominator);
}

export function independentlySolveFundamental(
  request: FundamentalSolveRequest,
): FundamentalSolveResult {
  switch (request.mode) {
    case "CP_SP_TO_AMOUNT": {
      const delta = request.sellingPrice.paise - request.costPrice.paise;
      return {
        mode: request.mode,
        direction: directionFromDelta(delta),
        amount: moneyFromPaise(absoluteBigInt(delta)),
      };
    }
    case "CP_RATE_TO_AMOUNT": {
      const amount = multiplyMoneyByRational(
        request.costPrice,
        divideRational(request.ratePercent, rational(100)),
      );
      return { mode: request.mode, amount };
    }
    case "CP_AMOUNT_TO_SP": {
      const sellingPrice = moneyFromPaise(
        request.direction === "PROFIT"
          ? request.costPrice.paise + request.amount.paise
          : request.costPrice.paise - request.amount.paise,
      );
      return { mode: request.mode, sellingPrice };
    }
    case "SP_AMOUNT_TO_CP": {
      const costPrice = moneyFromPaise(
        request.direction === "PROFIT"
          ? request.sellingPrice.paise - request.amount.paise
          : request.sellingPrice.paise + request.amount.paise,
      );
      return { mode: request.mode, costPrice };
    }
    case "CP_SP_TO_RATE": {
      const delta = request.sellingPrice.paise - request.costPrice.paise;
      const ratePercent = multiplyRational(
        divideRational(
          rational(absoluteBigInt(delta)),
          rational(request.costPrice.paise),
        ),
        rational(100),
      );
      return {
        mode: request.mode,
        direction: directionFromDelta(delta),
        ratePercent,
      };
    }
    case "CP_RATE_TO_SP": {
      return {
        mode: request.mode,
        sellingPrice: multiplyMoneyByRational(
          request.costPrice,
          commercialFactor(request.direction, request.ratePercent),
        ),
      };
    }
    case "SP_RATE_TO_CP": {
      return {
        mode: request.mode,
        costPrice: moneyFromExactRational(
          divideRational(
            rational(request.sellingPrice.paise),
            commercialFactor(request.direction, request.ratePercent),
          ),
        ),
      };
    }
    case "AMOUNT_RATE_TO_CP": {
      return {
        mode: request.mode,
        costPrice: moneyFromExactRational(
          divideRational(
            multiplyRational(rational(request.amount.paise), rational(100)),
            request.ratePercent,
          ),
        ),
      };
    }
    case "AMOUNT_CP_TO_RATE": {
      return {
        mode: request.mode,
        direction: request.direction,
        ratePercent: multiplyRational(
          divideRational(
            rational(request.amount.paise),
            rational(request.costPrice.paise),
          ),
          rational(100),
        ),
      };
    }
    case "CP_SP_RATIO_TO_RATE": {
      const difference = subtractRational(request.sellingPart, request.costPart);
      const direction =
        compareRational(difference, rational(0)) > 0
          ? "PROFIT"
          : compareRational(difference, rational(0)) < 0
            ? "LOSS"
            : "NO_CHANGE";
      return {
        mode: request.mode,
        direction,
        ratePercent: multiplyRational(
          divideRational(
            rational(
              absoluteBigInt(difference.numerator),
              difference.denominator,
            ),
            request.costPart,
          ),
          rational(100),
        ),
      };
    }
    case "RATE_TO_CP_SP_RATIO": {
      return {
        mode: request.mode,
        costPart: rational(1),
        sellingPart: commercialFactor(request.direction, request.ratePercent),
      };
    }
    case "MARGIN_SP_TO_PROFIT_CP": {
      return {
        mode: request.mode,
        profitPercent: multiplyRational(
          divideRational(
            request.marginPercent,
            subtractRational(rational(100), request.marginPercent),
          ),
          rational(100),
        ),
      };
    }
    case "PROFIT_CP_TO_MARGIN_SP": {
      return {
        mode: request.mode,
        marginPercent: multiplyRational(
          divideRational(
            request.profitPercent,
            addRational(rational(100), request.profitPercent),
          ),
          rational(100),
        ),
      };
    }
    case "FRACTION_TO_RATE": {
      const ratePercent =
        request.fractionBase === "COST_PRICE"
          ? multiplyRational(request.amountFraction, rational(100))
          : request.direction === "PROFIT"
            ? multiplyRational(
                divideRational(
                  request.amountFraction,
                  subtractRational(rational(1), request.amountFraction),
                ),
                rational(100),
              )
            : multiplyRational(
                divideRational(
                  request.amountFraction,
                  addRational(rational(1), request.amountFraction),
                ),
                rational(100),
              );
      return { mode: request.mode, ratePercent };
    }
    case "RATE_TO_FRACTION": {
      const rate = divideRational(request.ratePercent, rational(100));
      const amountFraction =
        request.fractionBase === "COST_PRICE"
          ? rate
          : request.direction === "PROFIT"
            ? divideRational(rate, addRational(rational(1), rate))
            : divideRational(rate, subtractRational(rational(1), rate));
      return { mode: request.mode, amountFraction };
    }
    case "CP_TWO_RATES_TO_SP_DIFFERENCE": {
      const gap = subtractRational(
        signedRate(request.firstDirection, request.firstRatePercent),
        signedRate(request.secondDirection, request.secondRatePercent),
      );
      return {
        mode: request.mode,
        difference: multiplyMoneyByRational(
          request.costPrice,
          divideRational(
            rational(absoluteBigInt(gap.numerator), gap.denominator),
            rational(100),
          ),
        ),
      };
    }
    case "SP_DIFFERENCE_TWO_RATES_TO_CP": {
      const gap = subtractRational(
        signedRate(request.firstDirection, request.firstRatePercent),
        signedRate(request.secondDirection, request.secondRatePercent),
      );
      const absoluteGap = rational(
        absoluteBigInt(gap.numerator),
        gap.denominator,
      );
      return {
        mode: request.mode,
        costPrice: moneyFromExactRational(
          divideRational(
            multiplyRational(rational(request.difference.paise), rational(100)),
            absoluteGap,
          ),
        ),
      };
    }
    case "TWO_SELLING_CONDITIONS_TO_SECOND_RATE": {
      const costPrice = moneyFromExactRational(
        divideRational(
          rational(request.firstSellingPrice.paise),
          commercialFactor(request.firstDirection, request.firstRatePercent),
        ),
      );
      const delta = request.secondSellingPrice.paise - costPrice.paise;
      return {
        mode: request.mode,
        direction: directionFromDelta(delta),
        ratePercent: multiplyRational(
          divideRational(
            rational(absoluteBigInt(delta)),
            rational(costPrice.paise),
          ),
          rational(100),
        ),
      };
    }
  }
}

function sameMoney(left: Money, right: Money) {
  return left.paise === right.paise;
}

function sameRational(left: Rational, right: Rational) {
  return compareRational(left, right) === 0;
}

export function verifyFundamentalResultIndependently(
  request: FundamentalSolveRequest,
  actual: FundamentalSolveResult,
): VerificationResult {
  const expected = independentlySolveFundamental(request);
  const errors: string[] = [];

  if (expected.mode !== actual.mode) {
    errors.push(`Mode mismatch: expected ${expected.mode}, received ${actual.mode}.`);
    return { ok: false, errors };
  }

  switch (actual.mode) {
    case "CP_SP_TO_AMOUNT":
      if (expected.mode !== actual.mode) break;
      if (expected.direction !== actual.direction) errors.push("Profit/loss direction mismatch.");
      if (!sameMoney(expected.amount, actual.amount)) errors.push("Amount mismatch.");
      break;
    case "CP_RATE_TO_AMOUNT":
      if (expected.mode !== actual.mode || !sameMoney(expected.amount, actual.amount)) errors.push("Amount mismatch.");
      break;
    case "CP_AMOUNT_TO_SP":
      if (expected.mode !== actual.mode || !sameMoney(expected.sellingPrice, actual.sellingPrice)) errors.push("Selling price mismatch.");
      break;
    case "SP_AMOUNT_TO_CP":
      if (expected.mode !== actual.mode || !sameMoney(expected.costPrice, actual.costPrice)) errors.push("Cost price mismatch.");
      break;
    case "CP_SP_TO_RATE":
      if (expected.mode !== actual.mode) break;
      if (expected.direction !== actual.direction) errors.push("Profit/loss direction mismatch.");
      if (!sameRational(expected.ratePercent, actual.ratePercent)) errors.push("Rate mismatch.");
      break;
    case "CP_RATE_TO_SP":
      if (expected.mode !== actual.mode || !sameMoney(expected.sellingPrice, actual.sellingPrice)) errors.push("Selling price mismatch.");
      break;
    case "SP_RATE_TO_CP":
    case "AMOUNT_RATE_TO_CP":
    case "SP_DIFFERENCE_TWO_RATES_TO_CP":
      if (expected.mode !== actual.mode || !sameMoney(expected.costPrice, actual.costPrice)) errors.push("Cost price mismatch.");
      break;
    case "AMOUNT_CP_TO_RATE":
      if (expected.mode !== actual.mode) break;
      if (expected.direction !== actual.direction) errors.push("Direction mismatch.");
      if (!sameRational(expected.ratePercent, actual.ratePercent)) errors.push("Rate mismatch.");
      break;
    case "CP_SP_RATIO_TO_RATE":
      if (expected.mode !== actual.mode) break;
      if (expected.direction !== actual.direction) errors.push("Direction mismatch.");
      if (!sameRational(expected.ratePercent, actual.ratePercent)) errors.push("Rate mismatch.");
      break;
    case "RATE_TO_CP_SP_RATIO":
      if (expected.mode !== actual.mode) break;
      if (!sameRational(expected.costPart, actual.costPart)) errors.push("Cost-part mismatch.");
      if (!sameRational(expected.sellingPart, actual.sellingPart)) errors.push("Selling-part mismatch.");
      break;
    case "MARGIN_SP_TO_PROFIT_CP":
      if (expected.mode !== actual.mode || !sameRational(expected.profitPercent, actual.profitPercent)) errors.push("Profit-percent mismatch.");
      break;
    case "PROFIT_CP_TO_MARGIN_SP":
      if (expected.mode !== actual.mode || !sameRational(expected.marginPercent, actual.marginPercent)) errors.push("Margin-percent mismatch.");
      break;
    case "FRACTION_TO_RATE":
      if (expected.mode !== actual.mode || !sameRational(expected.ratePercent, actual.ratePercent)) errors.push("Rate mismatch.");
      break;
    case "RATE_TO_FRACTION":
      if (expected.mode !== actual.mode || !sameRational(expected.amountFraction, actual.amountFraction)) errors.push("Fraction mismatch.");
      break;
    case "CP_TWO_RATES_TO_SP_DIFFERENCE":
      if (expected.mode !== actual.mode || !sameMoney(expected.difference, actual.difference)) errors.push("Selling-price difference mismatch.");
      break;
    case "TWO_SELLING_CONDITIONS_TO_SECOND_RATE":
      if (expected.mode !== actual.mode) break;
      if (expected.direction !== actual.direction) errors.push("Second-condition direction mismatch.");
      if (!sameRational(expected.ratePercent, actual.ratePercent)) errors.push("Second-condition rate mismatch.");
      break;
  }

  return { ok: errors.length === 0, errors };
}
