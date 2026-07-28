import type { Money, Rational } from "./types";
import { moneyFromPaise, multiplyMoney } from "./money";
import { asPercent, divideRational, rational } from "./rational";

export type TransactionFeeRequest =
  | { mode: "BUYER_EXPENSE_THEN_RATE_TO_SP"; purchasePrice: Money; buyerExpense: Money; direction: "PROFIT" | "LOSS"; ratePercent: Rational }
  | { mode: "GROSS_SP_AND_COMMISSION_TO_NET_RECEIPT"; grossSellingPrice: Money; commissionPercent: Rational }
  | { mode: "NET_TARGET_AND_COMMISSION_TO_GROSS_SP"; requiredNetReceipt: Money; commissionPercent: Rational }
  | { mode: "MIDDLE_TRADER_NET_RESULT"; purchasePrice: Money; buyerExpense: Money; grossSellingPrice: Money; commissionPercent: Rational };

export type TransactionFeeResult =
  | { mode: "BUYER_EXPENSE_THEN_RATE_TO_SP"; effectiveCost: Money; sellingPrice: Money }
  | { mode: "GROSS_SP_AND_COMMISSION_TO_NET_RECEIPT"; commissionAmount: Money; netReceipt: Money }
  | { mode: "NET_TARGET_AND_COMMISSION_TO_GROSS_SP"; grossSellingPrice: Money }
  | { mode: "MIDDLE_TRADER_NET_RESULT"; effectiveCost: Money; netReceipt: Money; direction: "PROFIT" | "LOSS" | "NO_CHANGE"; amount: Money; ratePercent: Rational };

function validateNonNegativeRate(rate: Rational): void {
  if (rate.denominator <= 0n || rate.numerator < 0n) {
    throw new Error("Rate must be non-negative with a positive denominator.");
  }
}

function validateCommission(rate: Rational): void {
  validateNonNegativeRate(rate);
  if (rate.numerator >= 100n * rate.denominator) {
    throw new Error("Commission must be below 100%.");
  }
}

function salePrice(base: Money, direction: "PROFIT" | "LOSS", rate: Rational): Money {
  validateNonNegativeRate(rate);
  if (direction === "LOSS" && rate.numerator >= 100n * rate.denominator) {
    throw new Error("Loss rate must be below 100%.");
  }
  const change = multiplyMoney(base, divideRational(rate, rational(100)));
  return moneyFromPaise(direction === "PROFIT" ? base.paise + change.paise : base.paise - change.paise);
}

function netReceipt(gross: Money, commissionPercent: Rational) {
  validateCommission(commissionPercent);
  const commissionAmount = multiplyMoney(gross, divideRational(commissionPercent, rational(100)));
  return { commissionAmount, netReceipt: moneyFromPaise(gross.paise - commissionAmount.paise) };
}

export function solveTransactionFee(request: TransactionFeeRequest): TransactionFeeResult {
  switch (request.mode) {
    case "BUYER_EXPENSE_THEN_RATE_TO_SP": {
      if (request.buyerExpense.paise < 0n) throw new Error("Expense cannot be negative.");
      const effectiveCost = moneyFromPaise(request.purchasePrice.paise + request.buyerExpense.paise);
      return { mode: request.mode, effectiveCost, sellingPrice: salePrice(effectiveCost, request.direction, request.ratePercent) };
    }
    case "GROSS_SP_AND_COMMISSION_TO_NET_RECEIPT":
      return { mode: request.mode, ...netReceipt(request.grossSellingPrice, request.commissionPercent) };
    case "NET_TARGET_AND_COMMISSION_TO_GROSS_SP": {
      validateCommission(request.commissionPercent);
      const retained = 100n * request.commissionPercent.denominator - request.commissionPercent.numerator;
      return {
        mode: request.mode,
        grossSellingPrice: multiplyMoney(request.requiredNetReceipt, rational(100n * request.commissionPercent.denominator, retained)),
      };
    }
    case "MIDDLE_TRADER_NET_RESULT": {
      if (request.buyerExpense.paise < 0n) throw new Error("Expense cannot be negative.");
      const effectiveCost = moneyFromPaise(request.purchasePrice.paise + request.buyerExpense.paise);
      const receipt = netReceipt(request.grossSellingPrice, request.commissionPercent).netReceipt;
      const difference = receipt.paise - effectiveCost.paise;
      const absolute = difference < 0n ? -difference : difference;
      return {
        mode: request.mode,
        effectiveCost,
        netReceipt: receipt,
        direction: difference > 0n ? "PROFIT" : difference < 0n ? "LOSS" : "NO_CHANGE",
        amount: moneyFromPaise(absolute),
        ratePercent: asPercent(rational(absolute, effectiveCost.paise)),
      };
    }
  }
}
