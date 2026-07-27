import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  moneyFromRupees,
  rational,
  solveFundamental,
  verifyForwardReverseRoundTrip,
} from "../foundation";

const rupees = (value: number) => moneyFromRupees(value);
const testedModes = new Set<string>();
const test = <T extends { mode: string }>(request: T) => {
  testedModes.add(request.mode);
  return solveFundamental(request as Parameters<typeof solveFundamental>[0]);
};

const profitAmount = test({ mode: "CP_SP_TO_AMOUNT", costPrice: rupees(4800), sellingPrice: rupees(5640) });
assert.equal(profitAmount.mode, "CP_SP_TO_AMOUNT");
assert.equal(profitAmount.direction, "PROFIT");
assert.equal(profitAmount.amount.paise, rupees(840).paise);

const lossAmount = test({ mode: "CP_SP_TO_AMOUNT", costPrice: rupees(7250), sellingPrice: rupees(6525) });
assert.equal(lossAmount.direction, "LOSS");
assert.equal(lossAmount.amount.paise, rupees(725).paise);

const noChangeAmount = test({ mode: "CP_SP_TO_AMOUNT", costPrice: rupees(6400), sellingPrice: rupees(6400) });
assert.equal(noChangeAmount.direction, "NO_CHANGE");
assert.equal(noChangeAmount.amount.paise, 0n);

assert.equal(
  test({ mode: "CP_RATE_TO_AMOUNT", costPrice: rupees(8000), direction: "PROFIT", ratePercent: rational(15) }).amount.paise,
  rupees(1200).paise,
);
assert.equal(
  test({ mode: "CP_RATE_TO_AMOUNT", costPrice: rupees(8000), direction: "LOSS", ratePercent: rational(15) }).amount.paise,
  rupees(1200).paise,
);

assert.equal(
  test({ mode: "CP_AMOUNT_TO_SP", costPrice: rupees(5000), amount: rupees(750), direction: "PROFIT" }).sellingPrice.paise,
  rupees(5750).paise,
);
assert.equal(
  test({ mode: "CP_AMOUNT_TO_SP", costPrice: rupees(5000), amount: rupees(750), direction: "LOSS" }).sellingPrice.paise,
  rupees(4250).paise,
);

assert.equal(
  test({ mode: "SP_AMOUNT_TO_CP", sellingPrice: rupees(5750), amount: rupees(750), direction: "PROFIT" }).costPrice.paise,
  rupees(5000).paise,
);
assert.equal(
  test({ mode: "SP_AMOUNT_TO_CP", sellingPrice: rupees(4250), amount: rupees(750), direction: "LOSS" }).costPrice.paise,
  rupees(5000).paise,
);

const profitRate = test({ mode: "CP_SP_TO_RATE", costPrice: rupees(8000), sellingPrice: rupees(9200) });
assert.equal(profitRate.direction, "PROFIT");
assert.deepEqual(profitRate.ratePercent, rational(15));

const lossRate = test({ mode: "CP_SP_TO_RATE", costPrice: rupees(8000), sellingPrice: rupees(6800) });
assert.equal(lossRate.direction, "LOSS");
assert.deepEqual(lossRate.ratePercent, rational(15));

const noChangeRate = test({ mode: "CP_SP_TO_RATE", costPrice: rupees(8000), sellingPrice: rupees(8000) });
assert.equal(noChangeRate.direction, "NO_CHANGE");
assert.deepEqual(noChangeRate.ratePercent, rational(0));

assert.equal(
  test({ mode: "CP_RATE_TO_SP", costPrice: rupees(6400), direction: "PROFIT", ratePercent: rational(25) }).sellingPrice.paise,
  rupees(8000).paise,
);
assert.equal(
  test({ mode: "CP_RATE_TO_SP", costPrice: rupees(9600), direction: "LOSS", ratePercent: rational(25, 2) }).sellingPrice.paise,
  rupees(8400).paise,
);

assert.equal(
  test({ mode: "SP_RATE_TO_CP", sellingPrice: rupees(11500), direction: "PROFIT", ratePercent: rational(15) }).costPrice.paise,
  rupees(10000).paise,
);
assert.equal(
  test({ mode: "SP_RATE_TO_CP", sellingPrice: rupees(8100), direction: "LOSS", ratePercent: rational(10) }).costPrice.paise,
  rupees(9000).paise,
);

assert.equal(
  test({ mode: "AMOUNT_RATE_TO_CP", amount: rupees(1260), direction: "PROFIT", ratePercent: rational(18) }).costPrice.paise,
  rupees(7000).paise,
);
assert.equal(
  test({ mode: "AMOUNT_RATE_TO_CP", amount: rupees(960), direction: "LOSS", ratePercent: rational(12) }).costPrice.paise,
  rupees(8000).paise,
);

const amountToProfitRate = test({ mode: "AMOUNT_CP_TO_RATE", amount: rupees(1350), costPrice: rupees(7500), direction: "PROFIT" });
assert.equal(amountToProfitRate.direction, "PROFIT");
assert.deepEqual(amountToProfitRate.ratePercent, rational(18));
const amountToLossRate = test({ mode: "AMOUNT_CP_TO_RATE", amount: rupees(1120), costPrice: rupees(8000), direction: "LOSS" });
assert.equal(amountToLossRate.direction, "LOSS");
assert.deepEqual(amountToLossRate.ratePercent, rational(14));

const ratioProfit = test({ mode: "CP_SP_RATIO_TO_RATE", costPart: rational(5), sellingPart: rational(6) });
assert.equal(ratioProfit.direction, "PROFIT");
assert.deepEqual(ratioProfit.ratePercent, rational(20));
const ratioLoss = test({ mode: "CP_SP_RATIO_TO_RATE", costPart: rational(5), sellingPart: rational(4) });
assert.equal(ratioLoss.direction, "LOSS");
assert.deepEqual(ratioLoss.ratePercent, rational(20));

const rateToProfitRatio = test({ mode: "RATE_TO_CP_SP_RATIO", direction: "PROFIT", ratePercent: rational(25) });
assert.deepEqual(rateToProfitRatio.costPart, rational(1));
assert.deepEqual(rateToProfitRatio.sellingPart, rational(5, 4));
const rateToLossRatio = test({ mode: "RATE_TO_CP_SP_RATIO", direction: "LOSS", ratePercent: rational(20) });
assert.deepEqual(rateToLossRatio.costPart, rational(1));
assert.deepEqual(rateToLossRatio.sellingPart, rational(4, 5));

assert.deepEqual(
  test({ mode: "MARGIN_SP_TO_PROFIT_CP", marginPercent: rational(20) }).profitPercent,
  rational(25),
);
assert.deepEqual(
  test({ mode: "PROFIT_CP_TO_MARGIN_SP", profitPercent: rational(25) }).marginPercent,
  rational(20),
);

assert.deepEqual(
  test({ mode: "FRACTION_TO_RATE", direction: "PROFIT", amountFraction: rational(1, 8), fractionBase: "COST_PRICE" }).ratePercent,
  rational(25, 2),
);
assert.deepEqual(
  test({ mode: "FRACTION_TO_RATE", direction: "PROFIT", amountFraction: rational(1, 6), fractionBase: "SELLING_PRICE" }).ratePercent,
  rational(20),
);
assert.deepEqual(
  test({ mode: "FRACTION_TO_RATE", direction: "LOSS", amountFraction: rational(1, 9), fractionBase: "SELLING_PRICE" }).ratePercent,
  rational(10),
);

assert.deepEqual(
  test({ mode: "RATE_TO_FRACTION", direction: "PROFIT", ratePercent: rational(25, 2), fractionBase: "COST_PRICE" }).amountFraction,
  rational(1, 8),
);
assert.deepEqual(
  test({ mode: "RATE_TO_FRACTION", direction: "PROFIT", ratePercent: rational(20), fractionBase: "SELLING_PRICE" }).amountFraction,
  rational(1, 6),
);
assert.deepEqual(
  test({ mode: "RATE_TO_FRACTION", direction: "LOSS", ratePercent: rational(10), fractionBase: "SELLING_PRICE" }).amountFraction,
  rational(1, 9),
);

assert.equal(
  test({
    mode: "CP_TWO_RATES_TO_SP_DIFFERENCE",
    costPrice: rupees(7500),
    firstDirection: "PROFIT",
    firstRatePercent: rational(18),
    secondDirection: "PROFIT",
    secondRatePercent: rational(14),
  }).difference.paise,
  rupees(300).paise,
);
assert.equal(
  test({
    mode: "CP_TWO_RATES_TO_SP_DIFFERENCE",
    costPrice: rupees(600),
    firstDirection: "PROFIT",
    firstRatePercent: rational(20),
    secondDirection: "LOSS",
    secondRatePercent: rational(10),
  }).difference.paise,
  rupees(180).paise,
);

assert.equal(
  test({
    mode: "SP_DIFFERENCE_TWO_RATES_TO_CP",
    difference: rupees(440),
    firstDirection: "PROFIT",
    firstRatePercent: rational(18),
    secondDirection: "PROFIT",
    secondRatePercent: rational(7),
  }).costPrice.paise,
  rupees(4000).paise,
);
assert.equal(
  test({
    mode: "SP_DIFFERENCE_TWO_RATES_TO_CP",
    difference: rupees(180),
    firstDirection: "PROFIT",
    firstRatePercent: rational(20),
    secondDirection: "LOSS",
    secondRatePercent: rational(10),
  }).costPrice.paise,
  rupees(600).paise,
);

const secondProfit = test({
  mode: "TWO_SELLING_CONDITIONS_TO_SECOND_RATE",
  firstSellingPrice: rupees(5750),
  firstDirection: "PROFIT",
  firstRatePercent: rational(15),
  secondSellingPrice: rupees(5250),
});
assert.equal(secondProfit.direction, "PROFIT");
assert.deepEqual(secondProfit.ratePercent, rational(5));

const secondAfterLoss = test({
  mode: "TWO_SELLING_CONDITIONS_TO_SECOND_RATE",
  firstSellingPrice: rupees(7200),
  firstDirection: "LOSS",
  firstRatePercent: rational(10),
  secondSellingPrice: rupees(8400),
});
assert.equal(secondAfterLoss.direction, "PROFIT");
assert.deepEqual(secondAfterLoss.ratePercent, rational(5));

assert.equal(verifyForwardReverseRoundTrip({ costPrice: rupees(10000), direction: "PROFIT", ratePercent: rational(15) }).ok, true);
assert.equal(verifyForwardReverseRoundTrip({ costPrice: rupees(9000), direction: "LOSS", ratePercent: rational(10) }).ok, true);

const root = dirname(fileURLToPath(import.meta.url));
const registry = JSON.parse(readFileSync(join(root, "task-registry.library.json"), "utf8")) as {
  entries: Record<string, { solveMode: string }>;
};
const registryModes = [...new Set(Object.values(registry.entries).map((entry) => entry.solveMode))].sort();
assert.deepEqual([...testedModes].sort(), registryModes, "Every unique CP-001 registry solve mode must have runtime proof coverage.");
assert.equal(Object.keys(registry.entries).length, 36);

console.log(JSON.stringify({
  ok: true,
  cpId: "PNL-CP-001",
  qlCount: 36,
  uniqueSolveModes: registryModes.length,
  testedModes: registryModes,
}, null, 2));
