import { describe, expect, it } from "vitest";
import {
  aggregateLedgers,
  asPercent,
  compareRational,
  createPriceLedger,
  createTransactionChain,
  createTransactionStage,
  dishonestTradeProfitPercent,
  moneyFromRupees,
  profitOrLossRateOnCost,
  rational,
  sellingPriceAfterDiscount,
  verifyForwardReverseRoundTrip,
  verifyTransactionChain,
} from "./foundation";

describe("PNL-001 foundation runtime proof", () => {
  it("keeps repeating percentages exact", () => {
    expect(rational(1, 3)).toEqual({ numerator: 1n, denominator: 3n });
    expect(asPercent(rational(1, 3))).toEqual({ numerator: 100n, denominator: 3n });
  });

  it("round-trips cost and selling price", () => {
    expect(verifyForwardReverseRoundTrip({
      costPrice: moneyFromRupees(800),
      direction: "PROFIT",
      ratePercent: rational(25),
    })).toEqual({ ok: true, errors: [] });
  });

  it("computes discount without floating-point drift", () => {
    expect(sellingPriceAfterDiscount(moneyFromRupees(1600), rational(12, 1))).toEqual(
      moneyFromRupees(1408),
    );
  });

  it("aggregates against total cost and total selling price", () => {
    const aggregate = aggregateLedgers([
      createPriceLedger({ costPrice: moneyFromRupees(500), sellingPrice: moneyFromRupees(600) }),
      createPriceLedger({ costPrice: moneyFromRupees(1000), sellingPrice: moneyFromRupees(900) }),
    ]);
    expect(profitOrLossRateOnCost(aggregate).direction).toBe("NO_CHANGE");
  });

  it("validates transaction-chain continuity", () => {
    const chain = createTransactionChain([
      createTransactionStage({
        sellerId: "A",
        buyerId: "B",
        inputPrice: moneyFromRupees(800),
        outputPrice: moneyFromRupees(1000),
      }),
      createTransactionStage({
        sellerId: "B",
        buyerId: "C",
        inputPrice: moneyFromRupees(1000),
        outputPrice: moneyFromRupees(1200),
      }),
    ]);
    expect(verifyTransactionChain(chain)).toEqual({ ok: true, errors: [] });
  });

  it("uses delivered-quantity cost for dishonest trade", () => {
    const rate = dishonestTradeProfitPercent({
      unitCostForNominalQuantity: moneyFromRupees(100),
      chargedPriceForNominalQuantity: moneyFromRupees(100),
      nominalQuantity: rational(1000),
      deliveredQuantity: rational(800),
    });
    expect(compareRational(rate, rational(25))).toBe(0);
  });
});
