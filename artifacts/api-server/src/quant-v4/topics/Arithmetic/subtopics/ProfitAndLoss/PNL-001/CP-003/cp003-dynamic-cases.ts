import taskRegistryJson from "./task-registry.library.json";

import {
  createSeededRandom,
  pickSeeded,
  type SeededRandom,
} from "../foundation/parameter-generator";
import {
  rational,
  rationalToNumber,
  type Rational,
} from "../foundation/rational";
import {
  moneyFromPaise,
  moneyFromRupees,
  multiplyMoney,
  type Money,
} from "../foundation/money";
import {
  solveInventory,
  type InventoryLot,
  type InventorySolveRequest,
  type InventorySolveResult,
} from "../foundation/inventory-solver";
import {
  solveInventoryAdvanced,
  type InventoryAdvancedRequest,
  type InventoryAdvancedResult,
  type RateDirection,
} from "../foundation/inventory-advanced-solver";

export const PNL_CP003_ID = "PNL-CP-003" as const;
export type PnlCp003Difficulty = "Easy" | "Medium" | "Hard";

export type PnlCp003RegistryEntry = Readonly<{
  solveMode: string;
  answerSemantic: string;
  requiredVariables: readonly string[];
  difficulty: PnlCp003Difficulty;
  representation?: string;
}>;

type RegistryFile = Readonly<{
  archetypeId: "PNL-001";
  cpId: typeof PNL_CP003_ID;
  entries: Readonly<Record<string, PnlCp003RegistryEntry>>;
}>;

export type PnlCp003SolverRequest = InventorySolveRequest | InventoryAdvancedRequest;
export type PnlCp003SolverResult = InventorySolveResult | InventoryAdvancedResult;

export type PnlCp003GeneratedCase = Readonly<{
  qlId: string;
  registry: PnlCp003RegistryEntry;
  request: PnlCp003SolverRequest;
  context: Readonly<Record<string, unknown>>;
  seed: string;
  answerOverride?: string;
  expectedDirection?: "PROFIT" | "LOSS" | "NO_CHANGE";
}>;

const taskRegistry = taskRegistryJson as RegistryFile;
export const PNL_CP003_QL_IDS = Object.keys(taskRegistry.entries);

const UNIT_COSTS = [100, 120, 150, 200, 240, 300] as const;
const QUANTITIES = [10n, 20n, 25n, 40n, 50n] as const;
const RATES = [10, 20, 25, 40] as const;
const TOTAL_COSTS = [10000, 12000, 15000, 20000, 24000] as const;
const RECOVERY_FRACTIONS = [
  [4n, 5n],
  [9n, 10n],
  [11n, 10n],
  [6n, 5n],
] as const;

const EQUAL_SP_PRESETS = [
  { common: 1200, first: ["PROFIT", 20], second: ["LOSS", 20] },
  { common: 1500, first: ["PROFIT", 25], second: ["LOSS", 25] },
  { common: 1200, first: ["PROFIT", 20], second: ["PROFIT", 25] },
  { common: 1500, first: ["LOSS", 25], second: ["PROFIT", 25] },
] as const;

const PARTIAL_PRESETS = [
  { total: 100n, sold: 60n, cost: 100, soldPrice: 120, recovery: 50 },
  { total: 100n, sold: 50n, cost: 120, soldPrice: 150, recovery: 80 },
  { total: 80n, sold: 40n, cost: 150, soldPrice: 180, recovery: 100 },
  { total: 120n, sold: 80n, cost: 100, soldPrice: 110, recovery: 60 },
] as const;

const DAMAGED_PRESETS = [
  { total: 100n, damaged: 20n, cost: 100, recovery: 20, target: 10 },
  { total: 100n, damaged: 25n, cost: 120, recovery: 40, target: 10 },
  { total: 80n, damaged: 20n, cost: 150, recovery: 60, target: 20 },
] as const;

const UNSOLD_PRESETS = [
  { total: 100n, sold: 60n, cost: 100, soldPrice: 120, remainingPrice: 110 },
  { total: 100n, sold: 50n, cost: 120, soldPrice: 150, remainingPrice: 96 },
  { total: 80n, sold: 40n, cost: 150, soldPrice: 180, remainingPrice: 135 },
  { total: 120n, sold: 80n, cost: 100, soldPrice: 110, remainingPrice: 120 },
] as const;

const SPOILED_PRESETS = [
  { total: 100n, good: 80n, cost: 100, goodPrice: 120, spoiledRecovery: 70, target: 10 },
  { total: 100n, good: 75n, cost: 120, goodPrice: 144, spoiledRecovery: 84, target: 8 },
  { total: 80n, good: 60n, cost: 150, goodPrice: 180, spoiledRecovery: 60, target: 0 },
] as const;

export function cp003PlainMoney(value: Money): string {
  const whole = value.paise / 100n;
  const remainder = value.paise % 100n;
  if (remainder === 0n) return whole.toString();
  return `${whole}.${remainder.toString().padStart(2, "0")}`;
}

export function cp003FormatMoney(value: Money): string {
  return `₹${cp003PlainMoney(value)}`;
}

export function cp003FormatRational(value: Rational): string {
  if (value.denominator === 1n) return value.numerator.toString();
  return rationalToNumber(value)
    .toFixed(2)
    .replace(/\.00$/, "")
    .replace(/(\.\d)0$/, "$1");
}

export function cp003FormatPercent(value: Rational): string {
  return `${cp003FormatRational(value)}%`;
}

function rupees(value: number): Money {
  return moneyFromRupees(value);
}

function pickNumber(random: SeededRandom, values: readonly number[]): number {
  return pickSeeded(random, values);
}

function ratePrice(base: Money, direction: RateDirection, ratePercent: Rational): Money {
  const delta = multiplyMoney(base, rational(ratePercent.numerator, 100n * ratePercent.denominator));
  return moneyFromPaise(
    direction === "PROFIT" ? base.paise + delta.paise : base.paise - delta.paise,
  );
}

function overallTargetFromGroupResult(
  result: Extract<InventoryAdvancedResult, { mode: "GROUP_RATES_TO_OVERALL_RESULT" }>,
): Readonly<{ direction: RateDirection; ratePercent: Rational }> {
  if (result.direction === "NO_CHANGE") {
    throw new Error("Generated group inventory unexpectedly has no overall direction.");
  }
  return { direction: result.direction, ratePercent: result.ratePercent };
}

function targetFromPartial(
  totalQuantity: bigint,
  unitCostPrice: Money,
  soldGroups: readonly Readonly<{ quantity: bigint; unitSellingPrice: Money }>[],
  unsoldQuantity: bigint,
  unsoldRecoveryPerUnit: Money,
): Readonly<{ direction: RateDirection; ratePercent: Rational }> {
  const result = solveInventory({
    mode: "PARTIAL_INVENTORY_TO_OVERALL_RESULT",
    totalQuantity,
    unitCostPrice,
    soldGroups,
    unsoldQuantity,
    unsoldRecoveryPerUnit,
  });
  if (result.direction === "NO_CHANGE") {
    return { direction: "PROFIT", ratePercent: rational(0) };
  }
  return { direction: result.direction, ratePercent: result.ratePercent };
}

function groupRow(
  label: string,
  quantity: bigint,
  unitCostPrice: Money,
  direction: RateDirection,
  ratePercent: Rational,
): readonly string[] {
  return [
    label,
    `${quantity} units at ${cp003FormatMoney(unitCostPrice)} each`,
    `${cp003FormatPercent(ratePercent)} ${direction.toLowerCase()}`,
  ];
}

function lotRow(label: string, lot: InventoryLot): readonly string[] {
  return [
    label,
    `${lot.quantity} units at ${cp003FormatMoney(lot.unitCostPrice)} each`,
    `sold at ${cp003FormatMoney(lot.unitSellingPrice)} each`,
  ];
}

function soldRow(
  label: string,
  quantity: bigint,
  unitSellingPrice: Money,
): readonly string[] {
  return [label, `${quantity} units`, `sold at ${cp003FormatMoney(unitSellingPrice)} each`];
}

function pickDirection(random: SeededRandom): RateDirection {
  return pickSeeded(random, ["PROFIT", "LOSS"] as const);
}

function makeLots(random: SeededRandom): readonly InventoryLot[] {
  const firstCost = rupees(pickNumber(random, UNIT_COSTS));
  const secondCost = rupees(pickNumber(random, UNIT_COSTS));
  const firstDirection = pickDirection(random);
  const secondDirection = pickDirection(random);
  const firstRate = rational(pickNumber(random, RATES));
  const secondRate = rational(pickNumber(random, RATES));
  return [
    {
      quantity: pickSeeded(random, QUANTITIES),
      unitCostPrice: firstCost,
      unitSellingPrice: ratePrice(firstCost, firstDirection, firstRate),
    },
    {
      quantity: pickSeeded(random, QUANTITIES),
      unitCostPrice: secondCost,
      unitSellingPrice: ratePrice(secondCost, secondDirection, secondRate),
    },
  ];
}

function makeGroups(random: SeededRandom) {
  const first = {
    quantity: pickSeeded(random, QUANTITIES),
    unitCostPrice: rupees(pickNumber(random, UNIT_COSTS)),
    direction: pickDirection(random),
    ratePercent: rational(pickNumber(random, RATES)),
  };
  const second = {
    quantity: pickSeeded(random, QUANTITIES),
    unitCostPrice: rupees(pickNumber(random, UNIT_COSTS)),
    direction: pickDirection(random),
    ratePercent: rational(pickNumber(random, RATES)),
  };
  return [first, second] as const;
}

const ADVANCED_MODES = new Set([
  "GROUP_RATES_TO_OVERALL_RESULT",
  "UNKNOWN_GROUP_RATE_FOR_TARGET",
  "UNKNOWN_GROUP_QUANTITY_FOR_TARGET",
  "UNSOLD_STOCK_REQUIRED_UNIT_PRICE",
  "UNSOLD_STOCK_REQUIRED_RATE",
  "SPOILED_STOCK_REQUIRED_RECOVERY",
  "EQUAL_SP_EQUAL_RATES_SPECIAL",
  "EQUAL_SP_ONE_RATE_FROM_OVERALL",
  "TOTAL_CP_AND_OVERALL_RATE_TO_TOTAL_SP",
  "TOTAL_SP_AND_OVERALL_RATE_TO_TOTAL_CP",
  "RECOVERY_FRACTION_TO_OVERALL_RESULT",
]);

export function solvePnlCp003Request(
  request: PnlCp003SolverRequest,
): PnlCp003SolverResult {
  return ADVANCED_MODES.has(request.mode)
    ? solveInventoryAdvanced(request as InventoryAdvancedRequest)
    : solveInventory(request as InventorySolveRequest);
}

export function generatePnlCp003Case(
  qlId: string,
  seedValue: string,
): PnlCp003GeneratedCase {
  const registry = taskRegistry.entries[qlId];
  if (!registry) throw new Error(`Unknown CP-003 QL: ${qlId}`);
  const random = createSeededRandom(`${seedValue}:${qlId}:parameters`);

  switch (qlId) {
    case "PNL-QL-071":
    case "PNL-QL-093": {
      const lots = makeLots(random);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: { mode: "MULTIPLE_LOTS_TO_OVERALL_RESULT", lots },
        context: { lots: lots.map((lot, index) => lotRow(`Lot ${index + 1}`, lot)) },
      };
    }

    case "PNL-QL-072": {
      const preset = pickSeeded(random, EQUAL_SP_PRESETS);
      const firstDirection = preset.first[0];
      const secondDirection = preset.second[0];
      const firstRatePercent = rational(preset.first[1]);
      const secondRatePercent = rational(preset.second[1]);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "EQUAL_SP_TWO_ARTICLES_TO_OVERALL_RATE",
          commonSellingPrice: rupees(preset.common),
          firstDirection,
          firstRatePercent,
          secondDirection,
          secondRatePercent,
        },
        context: {
          commonSellingPrice: preset.common,
          firstDirection: firstDirection.toLowerCase(),
          firstRatePercent: cp003FormatRational(firstRatePercent),
          secondDirection: secondDirection.toLowerCase(),
          secondRatePercent: cp003FormatRational(secondRatePercent),
        },
      };
    }

    case "PNL-QL-073": {
      const commonCostPrice = rupees(pickNumber(random, UNIT_COSTS));
      const firstDirection = pickDirection(random);
      const secondDirection = pickDirection(random);
      const firstRatePercent = rational(pickNumber(random, RATES));
      const secondRatePercent = rational(pickNumber(random, RATES));
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "EQUAL_CP_TWO_ARTICLES_TO_OVERALL_RATE",
          commonCostPrice,
          firstDirection,
          firstRatePercent,
          secondDirection,
          secondRatePercent,
        },
        context: {
          commonCostPrice: cp003PlainMoney(commonCostPrice),
          firstDirection: firstDirection.toLowerCase(),
          firstRatePercent: cp003FormatRational(firstRatePercent),
          secondDirection: secondDirection.toLowerCase(),
          secondRatePercent: cp003FormatRational(secondRatePercent),
        },
      };
    }

    case "PNL-QL-074":
    case "PNL-QL-089": {
      const preset = pickSeeded(random, PARTIAL_PRESETS);
      const totalQuantity = preset.total;
      const unitCostPrice = rupees(preset.cost);
      const soldGroups = [
        { quantity: preset.sold, unitSellingPrice: rupees(preset.soldPrice) },
      ];
      const unsoldQuantity = totalQuantity - preset.sold;
      const unsoldRecoveryPerUnit = rupees(preset.recovery);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "PARTIAL_INVENTORY_TO_OVERALL_RESULT",
          totalQuantity,
          unitCostPrice,
          soldGroups,
          unsoldQuantity,
          unsoldRecoveryPerUnit,
        },
        context: {
          totalQuantity: totalQuantity.toString(),
          unitCostPrice: cp003PlainMoney(unitCostPrice),
          soldGroups: soldGroups.map((group, index) =>
            soldRow(`Sold group ${index + 1}`, group.quantity, group.unitSellingPrice),
          ),
          unsoldQuantity: unsoldQuantity.toString(),
          unsoldRecoveryPerUnit: cp003PlainMoney(unsoldRecoveryPerUnit),
          caseletData: [
            `The dealer bought ${totalQuantity} units at ${cp003FormatMoney(unitCostPrice)} each.`,
            `${preset.sold} units were sold at ${cp003FormatMoney(rupees(preset.soldPrice))} each, while ${unsoldQuantity} units recovered ${cp003FormatMoney(unsoldRecoveryPerUnit)} each.`,
          ],
        },
      };
    }

    case "PNL-QL-075": {
      const preset = pickSeeded(random, DAMAGED_PRESETS);
      const targetDirection = "PROFIT" as const;
      const targetRatePercent = rational(preset.target);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "DAMAGED_STOCK_REQUIRED_RATE_ON_REMAINDER",
          totalQuantity: preset.total,
          unitCostPrice: rupees(preset.cost),
          damagedQuantity: preset.damaged,
          damagedRecoveryPerUnit: rupees(preset.recovery),
          targetDirection,
          targetRatePercent,
        },
        context: {
          totalQuantity: preset.total.toString(),
          unitCostPrice: preset.cost,
          damagedQuantity: preset.damaged.toString(),
          damagedRecoveryPerUnit: preset.recovery,
          targetDirection: targetDirection.toLowerCase(),
          targetRatePercent: cp003FormatRational(targetRatePercent),
        },
      };
    }

    case "PNL-QL-076": {
      const paidQuantity = pickSeeded(random, [50n, 80n, 100n] as const);
      const freeQuantity = pickSeeded(random, [5n, 10n, 20n] as const);
      const unitCostPrice = rupees(pickNumber(random, UNIT_COSTS));
      const unitSellingPrice = ratePrice(
        unitCostPrice,
        pickDirection(random),
        rational(pickNumber(random, [10, 20] as const)),
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "FREE_UNITS_AND_SOLD_UNITS_TO_RESULT",
          paidQuantity,
          freeQuantity,
          unitCostPrice,
          unitSellingPrice,
        },
        context: {
          paidQuantity: paidQuantity.toString(),
          freeQuantity: freeQuantity.toString(),
          unitCostPrice: cp003PlainMoney(unitCostPrice),
          unitSellingPrice: cp003PlainMoney(unitSellingPrice),
        },
      };
    }

    case "PNL-QL-077":
    case "PNL-QL-088": {
      const groups = makeGroups(random);
      const rows = groups.map((group, index) =>
        groupRow(
          `Group ${index + 1}`,
          group.quantity,
          group.unitCostPrice,
          group.direction,
          group.ratePercent,
        ),
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: { mode: "GROUP_RATES_TO_OVERALL_RESULT", groups },
        context: { groups: rows, inventoryTable: rows },
      };
    }

    case "PNL-QL-078":
    case "PNL-QL-091": {
      const knownGroups = [makeGroups(random)[0]!];
      const unknownQuantity = pickSeeded(random, [10n, 20n, 40n] as const);
      const unknownUnitCostPrice = rupees(pickNumber(random, UNIT_COSTS));
      const unknownDirection = pickDirection(random);
      const unknownRatePercent = rational(pickNumber(random, [10, 20, 25] as const));
      const complete = solveInventoryAdvanced({
        mode: "GROUP_RATES_TO_OVERALL_RESULT",
        groups: [
          ...knownGroups,
          {
            quantity: unknownQuantity,
            unitCostPrice: unknownUnitCostPrice,
            direction: unknownDirection,
            ratePercent: unknownRatePercent,
          },
        ],
      });
      const target = overallTargetFromGroupResult(complete);
      const rows = knownGroups.map((group, index) =>
        groupRow(
          `Known group ${index + 1}`,
          group.quantity,
          group.unitCostPrice,
          group.direction,
          group.ratePercent,
        ),
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "UNKNOWN_GROUP_RATE_FOR_TARGET",
          knownGroups,
          unknownQuantity,
          unknownUnitCostPrice,
          unknownDirection,
          targetDirection: target.direction,
          targetRatePercent: target.ratePercent,
        },
        context: {
          knownGroups: rows,
          unknownQuantity: unknownQuantity.toString(),
          unknownUnitCostPrice: cp003PlainMoney(unknownUnitCostPrice),
          unknownDirection: unknownDirection.toLowerCase(),
          targetDirection: target.direction.toLowerCase(),
          targetRatePercent: cp003FormatRational(target.ratePercent),
          groupCostExpressions: `${rows[0]![1]}, ${rows[0]![2]}; unknown group: ${unknownQuantity}x${cp003FormatMoney(unknownUnitCostPrice)} at r% ${unknownDirection.toLowerCase()}`,
        },
        expectedDirection: unknownDirection,
      };
    }

    case "PNL-QL-079": {
      const fixedGroups = [makeGroups(random)[0]!];
      const unknownQuantity = pickSeeded(random, [10n, 20n, 40n] as const);
      const unknownUnitCostPrice = rupees(pickNumber(random, UNIT_COSTS));
      const unknownDirection = pickDirection(random);
      const unknownRatePercent = rational(pickNumber(random, [10, 20, 25] as const));
      const complete = solveInventoryAdvanced({
        mode: "GROUP_RATES_TO_OVERALL_RESULT",
        groups: [
          ...fixedGroups,
          {
            quantity: unknownQuantity,
            unitCostPrice: unknownUnitCostPrice,
            direction: unknownDirection,
            ratePercent: unknownRatePercent,
          },
        ],
      });
      const target = overallTargetFromGroupResult(complete);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "UNKNOWN_GROUP_QUANTITY_FOR_TARGET",
          fixedGroups,
          unknownUnitCostPrice,
          unknownDirection,
          unknownRatePercent,
          targetDirection: target.direction,
          targetRatePercent: target.ratePercent,
        },
        context: {
          fixedGroups: fixedGroups.map((group, index) =>
            groupRow(
              `Fixed group ${index + 1}`,
              group.quantity,
              group.unitCostPrice,
              group.direction,
              group.ratePercent,
            ),
          ),
          unknownUnitCostPrice: cp003PlainMoney(unknownUnitCostPrice),
          unknownDirection: unknownDirection.toLowerCase(),
          unknownRatePercent: cp003FormatRational(unknownRatePercent),
          targetDirection: target.direction.toLowerCase(),
          targetRatePercent: cp003FormatRational(target.ratePercent),
        },
      };
    }

    case "PNL-QL-080":
    case "PNL-QL-081":
    case "PNL-QL-092": {
      const preset = pickSeeded(random, UNSOLD_PRESETS);
      const totalQuantity = preset.total;
      const unitCostPrice = rupees(preset.cost);
      const soldGroups = [
        { quantity: preset.sold, unitSellingPrice: rupees(preset.soldPrice) },
      ];
      const remainingQuantity = totalQuantity - preset.sold;
      const intendedRemainingPrice = rupees(preset.remainingPrice);
      const target = targetFromPartial(
        totalQuantity,
        unitCostPrice,
        soldGroups,
        remainingQuantity,
        intendedRemainingPrice,
      );
      const baseContext = {
        totalQuantity: totalQuantity.toString(),
        unitCostPrice: cp003PlainMoney(unitCostPrice),
        soldGroups: soldGroups.map((group, index) =>
          soldRow(`Sold group ${index + 1}`, group.quantity, group.unitSellingPrice),
        ),
        targetDirection: target.direction.toLowerCase(),
        targetRatePercent: cp003FormatRational(target.ratePercent),
        remainingDirection:
          intendedRemainingPrice.paise >= unitCostPrice.paise ? "profit" : "loss",
      };
      if (qlId !== "PNL-QL-092") {
        return {
          qlId,
          registry,
          seed: seedValue,
          request: {
            mode:
              qlId === "PNL-QL-080"
                ? "UNSOLD_STOCK_REQUIRED_UNIT_PRICE"
                : "UNSOLD_STOCK_REQUIRED_RATE",
            totalQuantity,
            unitCostPrice,
            soldGroups,
            targetDirection: target.direction,
            targetRatePercent: target.ratePercent,
          } as InventoryAdvancedRequest,
          context: baseContext,
          expectedDirection:
            intendedRemainingPrice.paise >= unitCostPrice.paise ? "PROFIT" : "LOSS",
        };
      }

      const complete = `The dealer bought ${totalQuantity} units at ${cp003FormatMoney(unitCostPrice)} each and sold ${preset.sold} units at ${cp003FormatMoney(rupees(preset.soldPrice))} each.`;
      const purchaseOnly = `The dealer bought ${totalQuantity} units at ${cp003FormatMoney(unitCostPrice)} each.`;
      const salesOnly = `${preset.sold} units were sold at ${cp003FormatMoney(rupees(preset.soldPrice))} each.`;
      const irrelevant = "The stock is stored in two warehouse sections.";
      const pattern = pickSeeded(random, ["BOTH", "ONE", "TWO", "EITHER"] as const);
      const statementOne =
        pattern === "ONE" || pattern === "EITHER"
          ? complete
          : pattern === "BOTH"
            ? purchaseOnly
            : irrelevant;
      const statementTwo =
        pattern === "TWO" || pattern === "EITHER"
          ? complete
          : pattern === "BOTH"
            ? salesOnly
            : irrelevant;
      const answerOverride =
        pattern === "BOTH"
          ? "Both statements together are required"
          : pattern === "ONE"
            ? "Statement 1 alone is sufficient"
            : pattern === "TWO"
              ? "Statement 2 alone is sufficient"
              : "Either statement alone is sufficient";
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "UNSOLD_STOCK_REQUIRED_UNIT_PRICE",
          totalQuantity,
          unitCostPrice,
          soldGroups,
          targetDirection: target.direction,
          targetRatePercent: target.ratePercent,
        },
        context: { ...baseContext, statementOne, statementTwo },
        answerOverride,
      };
    }

    case "PNL-QL-082":
    case "PNL-QL-094": {
      const preset = pickSeeded(random, SPOILED_PRESETS);
      const targetDirection = "PROFIT" as const;
      const targetRatePercent = rational(qlId === "PNL-QL-094" ? 0 : preset.target);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "SPOILED_STOCK_REQUIRED_RECOVERY",
          totalQuantity: preset.total,
          unitCostPrice: rupees(preset.cost),
          goodQuantity: preset.good,
          goodUnitSellingPrice: rupees(preset.goodPrice),
          spoiledQuantity: preset.total - preset.good,
          targetDirection,
          targetRatePercent,
        },
        context: {
          totalQuantity: preset.total.toString(),
          unitCostPrice: preset.cost,
          goodQuantity: preset.good.toString(),
          goodUnitSellingPrice: preset.goodPrice,
          spoiledQuantity: (preset.total - preset.good).toString(),
          targetDirection: targetDirection.toLowerCase(),
          targetRatePercent: cp003FormatRational(targetRatePercent),
        },
      };
    }

    case "PNL-QL-083":
    case "PNL-QL-090": {
      const ratePercent = rational(pickSeeded(random, [10, 20, 25, 30] as const));
      return {
        qlId,
        registry,
        seed: seedValue,
        request: { mode: "EQUAL_SP_EQUAL_RATES_SPECIAL", ratePercent },
        context: { ratePercent: cp003FormatRational(ratePercent) },
        ...(qlId === "PNL-QL-090" ? { answerOverride: "Statement 2 only" } : {}),
      };
    }

    case "PNL-QL-084": {
      const knownDirection = pickDirection(random);
      const unknownDirection = pickDirection(random);
      const knownRatePercent = rational(pickSeeded(random, [10, 20, 25] as const));
      const unknownRatePercent = rational(pickSeeded(random, [10, 20, 25] as const));
      const forward = solveInventory({
        mode: "EQUAL_SP_TWO_ARTICLES_TO_OVERALL_RATE",
        commonSellingPrice: rupees(1200),
        firstDirection: knownDirection,
        firstRatePercent: knownRatePercent,
        secondDirection: unknownDirection,
        secondRatePercent: unknownRatePercent,
      });
      if (forward.direction === "NO_CHANGE") {
        throw new Error(`${qlId}: generated equal-SP inverse has no overall direction.`);
      }
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "EQUAL_SP_ONE_RATE_FROM_OVERALL",
          knownDirection,
          knownRatePercent,
          unknownDirection,
          targetDirection: forward.direction,
          targetRatePercent: forward.ratePercent,
        },
        context: {
          knownDirection: knownDirection.toLowerCase(),
          knownRatePercent: cp003FormatRational(knownRatePercent),
          unknownDirection: unknownDirection.toLowerCase(),
          targetDirection: forward.direction.toLowerCase(),
          targetRatePercent: cp003FormatRational(forward.ratePercent),
        },
        expectedDirection: unknownDirection,
      };
    }

    case "PNL-QL-085": {
      const totalCostPrice = rupees(pickNumber(random, TOTAL_COSTS));
      const direction = pickDirection(random);
      const ratePercent = rational(pickNumber(random, RATES));
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "TOTAL_CP_AND_OVERALL_RATE_TO_TOTAL_SP",
          totalCostPrice,
          direction,
          ratePercent,
        },
        context: {
          totalCostPrice: cp003PlainMoney(totalCostPrice),
          direction: direction.toLowerCase(),
          ratePercent: cp003FormatRational(ratePercent),
        },
      };
    }

    case "PNL-QL-086": {
      const totalCostPrice = rupees(pickNumber(random, TOTAL_COSTS));
      const direction = pickDirection(random);
      const ratePercent = rational(pickNumber(random, RATES));
      const totalSellingPrice = solveInventoryAdvanced({
        mode: "TOTAL_CP_AND_OVERALL_RATE_TO_TOTAL_SP",
        totalCostPrice,
        direction,
        ratePercent,
      }).totalSellingPrice;
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "TOTAL_SP_AND_OVERALL_RATE_TO_TOTAL_CP",
          totalSellingPrice,
          direction,
          ratePercent,
        },
        context: {
          totalSellingPrice: cp003PlainMoney(totalSellingPrice),
          direction: direction.toLowerCase(),
          ratePercent: cp003FormatRational(ratePercent),
        },
      };
    }

    case "PNL-QL-087": {
      const totalCostPrice = rupees(pickNumber(random, TOTAL_COSTS));
      const fraction = pickSeeded(random, RECOVERY_FRACTIONS);
      const recoveredFraction = rational(fraction[0], fraction[1]);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "RECOVERY_FRACTION_TO_OVERALL_RESULT",
          totalCostPrice,
          recoveredFraction,
        },
        context: {
          totalCostPrice: cp003PlainMoney(totalCostPrice),
          recoveredFraction: `${fraction[0]}/${fraction[1]}`,
        },
      };
    }

    default:
      throw new Error(`${qlId}: CP-003 dynamic generator is not implemented.`);
  }
}
