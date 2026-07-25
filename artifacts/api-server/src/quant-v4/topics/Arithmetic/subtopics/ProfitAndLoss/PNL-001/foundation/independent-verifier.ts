import type {
  Money,
  PriceLedger,
  QuantityLedger,
  Rational,
  TransactionChain,
  VerificationResult,
} from "./types";
import { compareMoney, multiplyMoney } from "./money";
import { compareRational, divideRational, multiplyRational, rational } from "./rational";
import { costPriceFromSellingPriceAndRate, sellingPriceFromCostAndRate } from "./math";

function result(errors: string[]): VerificationResult {
  return { ok: errors.length === 0, errors };
}

export function verifyPriceLedger(ledger: PriceLedger): VerificationResult {
  const errors: string[] = [];
  if (ledger.costPrice.paise <= 0n) errors.push("Cost price must be positive.");
  if (ledger.sellingPrice.paise < 0n) errors.push("Selling price cannot be negative.");
  if (ledger.markedPrice && ledger.markedPrice.paise < ledger.sellingPrice.paise) {
    errors.push("Marked price is below selling price; verify whether this is an intended markup case.");
  }
  if (ledger.effectiveCost && ledger.effectiveCost.paise <= 0n) {
    errors.push("Effective cost must be positive.");
  }
  return result(errors);
}

export function verifyForwardReverseRoundTrip(input: {
  costPrice: Money;
  direction: "PROFIT" | "LOSS";
  ratePercent: Rational;
}): VerificationResult {
  const errors: string[] = [];
  const sellingPrice = sellingPriceFromCostAndRate(input);
  const reconstructed = costPriceFromSellingPriceAndRate({
    sellingPrice,
    direction: input.direction,
    ratePercent: input.ratePercent,
  });
  if (compareMoney(input.costPrice, reconstructed) !== 0) {
    errors.push("Forward/reverse CP-SP round trip failed.");
  }
  return result(errors);
}

export function verifyTransactionChain(chain: TransactionChain): VerificationResult {
  const errors: string[] = [];
  chain.stages.forEach((stage, index) => {
    if (stage.inputPrice.paise <= 0n || stage.outputPrice.paise <= 0n) {
      errors.push(`Stage ${index + 1} prices must be positive.`);
    }
    const next = chain.stages[index + 1];
    if (next && compareMoney(stage.outputPrice, next.inputPrice) !== 0) {
      errors.push(`Stage ${index + 1} output does not equal stage ${index + 2} input.`);
    }
  });
  return result(errors);
}

export function verifyQuantityLedger(ledger: QuantityLedger): VerificationResult {
  const errors: string[] = [];
  if (compareRational(ledger.nominalQuantity, rational(0)) <= 0) {
    errors.push("Nominal quantity must be positive.");
  }
  if (compareRational(ledger.deliveredQuantity, rational(0)) <= 0) {
    errors.push("Delivered quantity must be positive.");
  }
  if (compareRational(ledger.deliveredQuantity, ledger.nominalQuantity) > 0) {
    errors.push("Delivered quantity exceeds nominal quantity.");
  }
  if (ledger.usableQuantity && ledger.boughtQuantity && compareRational(ledger.usableQuantity, ledger.boughtQuantity) > 0) {
    errors.push("Usable quantity exceeds bought quantity.");
  }
  return result(errors);
}

export function dishonestTradeProfitPercent(input: {
  unitCostForNominalQuantity: Money;
  chargedPriceForNominalQuantity: Money;
  nominalQuantity: Rational;
  deliveredQuantity: Rational;
}): Rational {
  const deliveredFraction = divideRational(input.deliveredQuantity, input.nominalQuantity);
  const deliveredCost = multiplyMoney(input.unitCostForNominalQuantity, deliveredFraction);
  const profit = input.chargedPriceForNominalQuantity.paise - deliveredCost.paise;
  return multiplyRational(
    divideRational(rational(profit), rational(deliveredCost.paise)),
    rational(100),
  );
}
