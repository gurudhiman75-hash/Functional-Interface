import type {
  Money,
  PriceLedger,
  QuantityLedger,
  Rational,
  TransactionChain,
  TransactionStage,
} from "./types";

export function createPriceLedger(input: {
  costPrice: Money;
  sellingPrice: Money;
  markedPrice?: Money;
  effectiveCost?: Money;
}): PriceLedger {
  return Object.freeze({ ...input });
}

export function createQuantityLedger(input: {
  nominalQuantity: Rational;
  deliveredQuantity: Rational;
  boughtQuantity?: Rational;
  usableQuantity?: Rational;
}): QuantityLedger {
  return Object.freeze({ ...input });
}

export function createTransactionStage(input: TransactionStage): TransactionStage {
  if (!input.sellerId.trim() || !input.buyerId.trim()) {
    throw new Error("Transaction stages require seller and buyer identifiers.");
  }
  return Object.freeze({ ...input });
}

export function createTransactionChain(stages: readonly TransactionStage[]): TransactionChain {
  if (stages.length === 0) throw new Error("A transaction chain requires at least one stage.");
  return Object.freeze({ stages: Object.freeze([...stages]) });
}
