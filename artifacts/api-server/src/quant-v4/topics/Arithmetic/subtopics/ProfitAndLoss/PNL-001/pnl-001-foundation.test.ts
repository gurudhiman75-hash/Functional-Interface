import assert from "node:assert/strict";
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
  solveFundamental,
  verifyForwardReverseRoundTrip,
  verifyTransactionChain,
} from "./foundation";

function run() {
  assert.deepEqual(rational(1, 3), { numerator: 1n, denominator: 3n });
  assert.deepEqual(asPercent(rational(1, 3)), { numerator: 100n, denominator: 3n });

  assert.deepEqual(
    verifyForwardReverseRoundTrip({
      costPrice: moneyFromRupees(800),
      direction: "PROFIT",
      ratePercent: rational(25),
    }),
    { ok: true, errors: [] },
  );

  assert.deepEqual(
    sellingPriceAfterDiscount(moneyFromRupees(1600), rational(12)),
    moneyFromRupees(1408),
  );

  const aggregate = aggregateLedgers([
    createPriceLedger({ costPrice: moneyFromRupees(500), sellingPrice: moneyFromRupees(600) }),
    createPriceLedger({ costPrice: moneyFromRupees(1000), sellingPrice: moneyFromRupees(900) }),
  ]);
  assert.equal(profitOrLossRateOnCost(aggregate).direction, "NO_CHANGE");

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
  assert.deepEqual(verifyTransactionChain(chain), { ok: true, errors: [] });

  const dishonestRate = dishonestTradeProfitPercent({
    unitCostForNominalQuantity: moneyFromRupees(100),
    chargedPriceForNominalQuantity: moneyFromRupees(100),
    nominalQuantity: rational(1000),
    deliveredQuantity: rational(800),
  });
  assert.equal(compareRational(dishonestRate, rational(25)), 0);

  assert.deepEqual(
    solveFundamental({
      mode: "CP_SP_TO_AMOUNT",
      costPrice: moneyFromRupees(800),
      sellingPrice: moneyFromRupees(920),
    }),
    {
      mode: "CP_SP_TO_AMOUNT",
      direction: "PROFIT",
      amount: moneyFromRupees(120),
    },
  );

  assert.deepEqual(
    solveFundamental({
      mode: "CP_RATE_TO_SP",
      costPrice: moneyFromRupees(800),
      direction: "PROFIT",
      ratePercent: rational(25),
    }),
    { mode: "CP_RATE_TO_SP", sellingPrice: moneyFromRupees(1000) },
  );

  assert.deepEqual(
    solveFundamental({
      mode: "SP_RATE_TO_CP",
      sellingPrice: moneyFromRupees(900),
      direction: "LOSS",
      ratePercent: rational(10),
    }),
    { mode: "SP_RATE_TO_CP", costPrice: moneyFromRupees(1000) },
  );

  console.log("PNL-001 foundation runtime proof passed.");
}

run();
