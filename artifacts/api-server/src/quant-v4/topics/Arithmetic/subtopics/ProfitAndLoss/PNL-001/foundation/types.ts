export type Rational = Readonly<{
  numerator: bigint;
  denominator: bigint;
}>;

export type Money = Readonly<{
  paise: bigint;
}>;

export type PercentageBase =
  | "COST_PRICE"
  | "SELLING_PRICE"
  | "MARKED_PRICE"
  | "EFFECTIVE_COST"
  | "BILLED_QUANTITY"
  | "DELIVERED_QUANTITY";

export type ProfitLossDirection = "PROFIT" | "LOSS" | "NO_CHANGE";

export type PriceLedger = Readonly<{
  costPrice: Money;
  sellingPrice: Money;
  markedPrice?: Money;
  effectiveCost?: Money;
}>;

export type QuantityLedger = Readonly<{
  nominalQuantity: Rational;
  deliveredQuantity: Rational;
  boughtQuantity?: Rational;
  usableQuantity?: Rational;
}>;

export type TransactionStage = Readonly<{
  sellerId: string;
  buyerId: string;
  inputPrice: Money;
  outputPrice: Money;
}>;

export type TransactionChain = Readonly<{
  stages: readonly TransactionStage[];
}>;

export type RateResult = Readonly<{
  direction: ProfitLossDirection;
  rate: Rational;
  base: PercentageBase;
}>;

export type VerificationResult = Readonly<{
  ok: boolean;
  errors: readonly string[];
}>;
