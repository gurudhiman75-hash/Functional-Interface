import assert from "node:assert/strict";
import {
  moneyFromRupees,
  rational,
  solveTransactionChain,
  solveTransactionFee,
  verifyCommissionNetReceipt,
  verifyTransactionChainFinal,
  verifyTransactionChainInitial,
} from "../foundation";

const twoStageChain = [
  { direction: "PROFIT" as const, ratePercent: rational(20) },
  { direction: "LOSS" as const, ratePercent: rational(10) },
];

const forward = solveTransactionChain({
  mode: "INITIAL_CP_AND_STAGES_TO_FINAL_SP",
  initialCostPrice: moneyFromRupees(10000),
  stages: twoStageChain,
});
assert.equal(forward.finalSellingPrice.paise, 1080000n);
assert.equal(
  verifyTransactionChainFinal(moneyFromRupees(10000), twoStageChain, forward.finalSellingPrice).valid,
  true,
);

const reverse = solveTransactionChain({
  mode: "FINAL_SP_AND_STAGES_TO_INITIAL_CP",
  finalSellingPrice: moneyFromRupees(10800),
  stages: twoStageChain,
});
assert.equal(reverse.initialCostPrice.paise, 1000000n);
assert.equal(
  verifyTransactionChainInitial(moneyFromRupees(10800), twoStageChain, reverse.initialCostPrice).valid,
  true,
);

const missing = solveTransactionChain({
  mode: "INITIAL_FINAL_KNOWN_STAGES_TO_MISSING_RATE",
  initialCostPrice: moneyFromRupees(10000),
  finalSellingPrice: moneyFromRupees(13800),
  knownStages: [{ direction: "PROFIT", ratePercent: rational(20) }],
  missingDirection: "PROFIT",
});
assert.equal(missing.missingRatePercent.numerator, 15n);
assert.equal(missing.missingRatePercent.denominator, 1n);

const equalStages = solveTransactionChain({
  mode: "EQUAL_RATE_N_STAGE_TO_FINAL_SP",
  initialCostPrice: moneyFromRupees(10000),
  stageCount: 2,
  direction: "PROFIT",
  ratePercent: rational(10),
});
assert.equal(equalStages.finalSellingPrice.paise, 1210000n);

const ledger = solveTransactionChain({
  mode: "CHAIN_TO_STAGE_LEDGER",
  initialCostPrice: moneyFromRupees(10000),
  stages: twoStageChain,
});
assert.equal(ledger.ledger[0]!.amount.paise, 200000n);
assert.equal(ledger.ledger[1]!.amount.paise, 120000n);

const expenseSale = solveTransactionFee({
  mode: "BUYER_EXPENSE_THEN_RATE_TO_SP",
  purchasePrice: moneyFromRupees(10000),
  buyerExpense: moneyFromRupees(500),
  direction: "PROFIT",
  ratePercent: rational(20),
});
assert.equal(expenseSale.sellingPrice.paise, 1260000n);

const commission = solveTransactionFee({
  mode: "GROSS_SP_AND_COMMISSION_TO_NET_RECEIPT",
  grossSellingPrice: moneyFromRupees(20000),
  commissionPercent: rational(5),
});
assert.equal(commission.netReceipt.paise, 1900000n);
assert.equal(
  verifyCommissionNetReceipt(moneyFromRupees(20000), rational(5), commission.netReceipt).valid,
  true,
);

const requiredGross = solveTransactionFee({
  mode: "NET_TARGET_AND_COMMISSION_TO_GROSS_SP",
  requiredNetReceipt: moneyFromRupees(19000),
  commissionPercent: rational(5),
});
assert.equal(requiredGross.grossSellingPrice.paise, 2000000n);

const middleTrader = solveTransactionFee({
  mode: "MIDDLE_TRADER_NET_RESULT",
  purchasePrice: moneyFromRupees(10000),
  buyerExpense: moneyFromRupees(500),
  grossSellingPrice: moneyFromRupees(12000),
  commissionPercent: rational(5),
});
assert.equal(middleTrader.direction, "PROFIT");
assert.equal(middleTrader.amount.paise, 90000n);
assert.equal(middleTrader.ratePercent.numerator, 60n);
assert.equal(middleTrader.ratePercent.denominator, 7n);
