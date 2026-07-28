import taskRegistryJson from "./task-registry.library.json";

import {
  createSeededRandom,
  pickSeeded,
  type SeededRandom,
} from "../foundation/parameter-generator";
import { rational, rationalToNumber, type Rational } from "../foundation/rational";
import { moneyFromPaise, moneyFromRupees, type Money } from "../foundation/money";
import {
  solveTransactionChain,
  type TransactionChainRequest,
  type TransactionChainResult,
  type TransactionStage,
} from "../foundation/transaction-chain-solver";
import {
  solveTransactionFee,
  type TransactionFeeRequest,
  type TransactionFeeResult,
} from "../foundation/transaction-fee-solver";

export const PNL_CP004_ID = "PNL-CP-004" as const;
export type PnlCp004Difficulty = "Easy" | "Medium" | "Hard";

export type PnlCp004RegistryEntry = Readonly<{
  solveMode: string;
  answerSemantic: string;
  requiredVariables: readonly string[];
  difficulty: PnlCp004Difficulty;
  representation?: string;
  presentation?: string;
}>;

type RegistryFile = Readonly<{
  archetypeId: "PNL-001";
  cpId: typeof PNL_CP004_ID;
  entries: Readonly<Record<string, PnlCp004RegistryEntry>>;
}>;

export type PnlCp004SolverRequest = TransactionChainRequest | TransactionFeeRequest;
export type PnlCp004SolverResult = TransactionChainResult | TransactionFeeResult;

export type PnlCp004GeneratedCase = Readonly<{
  qlId: string;
  registry: PnlCp004RegistryEntry;
  request: PnlCp004SolverRequest;
  context: Readonly<Record<string, unknown>>;
  seed: string;
  answerOverride?: string;
}>;

const taskRegistry = taskRegistryJson as RegistryFile;
export const PNL_CP004_QL_IDS = Object.keys(taskRegistry.entries);

const BASE_PRICES = [8000, 10000, 12000, 16000, 20000, 24000, 30000, 40000] as const;
const EXPENSES = [400, 500, 800, 1000, 1200, 1500] as const;
const COMMISSION_RATES = [5, 10, 20, 25] as const;
const TARGET_RATES = [10, 20, 25] as const;

const TWO_STAGE_PRESETS = [
  [["PROFIT", 20], ["LOSS", 10]],
  [["PROFIT", 25], ["PROFIT", 20]],
  [["LOSS", 20], ["PROFIT", 25]],
  [["PROFIT", 10], ["PROFIT", 20]],
  [["LOSS", 10], ["LOSS", 20]],
  [["PROFIT", 40], ["LOSS", 25]],
] as const;

const THREE_STAGE_PRESETS = [
  [["PROFIT", 20], ["LOSS", 10], ["PROFIT", 25]],
  [["LOSS", 20], ["PROFIT", 25], ["PROFIT", 20]],
  [["PROFIT", 10], ["PROFIT", 20], ["LOSS", 25]],
  [["LOSS", 10], ["LOSS", 20], ["PROFIT", 25]],
  [["PROFIT", 25], ["LOSS", 20], ["PROFIT", 10]],
  [["PROFIT", 20], ["PROFIT", 25], ["LOSS", 20]],
] as const;

export function cp004PlainMoney(value: Money): string {
  const whole = value.paise / 100n;
  const remainder = value.paise % 100n;
  if (remainder === 0n) return whole.toString();
  return `${whole}.${remainder.toString().padStart(2, "0")}`;
}

export function cp004FormatMoney(value: Money): string {
  return `₹${cp004PlainMoney(value)}`;
}

export function cp004FormatRational(value: Rational): string {
  if (value.denominator === 1n) return value.numerator.toString();
  return rationalToNumber(value)
    .toFixed(2)
    .replace(/\.00$/, "")
    .replace(/(\.\d)0$/, "$1");
}

export function cp004FormatPercent(value: Rational): string {
  return `${cp004FormatRational(value)}%`;
}

function rupees(value: number): Money {
  return moneyFromRupees(value);
}

function pickNumber(random: SeededRandom, values: readonly number[]): number {
  return pickSeeded(random, values);
}

function stage(direction: "PROFIT" | "LOSS", ratePercent: number): TransactionStage {
  return { direction, ratePercent: rational(ratePercent) };
}

function stagesFromPreset(
  preset: readonly (readonly ["PROFIT" | "LOSS", number])[],
): readonly TransactionStage[] {
  return preset.map(([direction, ratePercent]) => stage(direction, ratePercent));
}

function pickStages(random: SeededRandom, count: 2 | 3): readonly TransactionStage[] {
  return stagesFromPreset(
    pickSeeded(random, count === 2 ? TWO_STAGE_PRESETS : THREE_STAGE_PRESETS),
  );
}

function stagePhrase(item: TransactionStage): string {
  return `${cp004FormatRational(item.ratePercent)}% ${item.direction.toLowerCase()}`;
}

export function cp004StagesText(stages: readonly TransactionStage[]): string {
  return stages
    .map((item, index) => `transaction ${index + 1}: ${stagePhrase(item)}`)
    .join("; ");
}

function stageTable(stages: readonly TransactionStage[]): readonly (readonly string[])[] {
  return stages.map((item, index) => [
    `Transfer ${index + 1}`,
    `${cp004FormatRational(item.ratePercent)}% ${item.direction.toLowerCase()}`,
  ]);
}

export function solvePnlCp004Request(
  request: PnlCp004SolverRequest,
): PnlCp004SolverResult {
  switch (request.mode) {
    case "INITIAL_CP_AND_STAGES_TO_FINAL_SP":
    case "FINAL_SP_AND_STAGES_TO_INITIAL_CP":
    case "INITIAL_CP_AND_STAGES_TO_INTERMEDIATE_PRICE":
    case "STAGES_TO_OVERALL_RATE":
    case "INITIAL_FINAL_KNOWN_STAGES_TO_MISSING_RATE":
    case "EQUAL_RATE_N_STAGE_TO_FINAL_SP":
    case "CHAIN_TO_STAGE_LEDGER":
      return solveTransactionChain(request);
    default:
      return solveTransactionFee(request);
  }
}

function middleTraderCase(random: SeededRandom) {
  const effectiveCost = rupees(pickNumber(random, BASE_PRICES));
  const buyerExpense = rupees(pickNumber(random, EXPENSES));
  const purchasePrice = moneyFromPaise(effectiveCost.paise - buyerExpense.paise);
  const direction = pickSeeded(random, ["PROFIT", "LOSS"] as const);
  const targetRate = pickNumber(random, TARGET_RATES);
  const targetNet = moneyFromPaise(
    direction === "PROFIT"
      ? (effectiveCost.paise * BigInt(100 + targetRate)) / 100n
      : (effectiveCost.paise * BigInt(100 - targetRate)) / 100n,
  );
  const commissionPercent = rational(pickNumber(random, COMMISSION_RATES));
  const grossSellingPrice = solveTransactionFee({
    mode: "NET_TARGET_AND_COMMISSION_TO_GROSS_SP",
    requiredNetReceipt: targetNet,
    commissionPercent,
  }).grossSellingPrice;
  return {
    request: {
      mode: "MIDDLE_TRADER_NET_RESULT" as const,
      purchasePrice,
      buyerExpense,
      grossSellingPrice,
      commissionPercent,
    },
    context: {
      purchasePrice: cp004PlainMoney(purchasePrice),
      buyerExpense: cp004PlainMoney(buyerExpense),
      grossSellingPrice: cp004PlainMoney(grossSellingPrice),
      commissionPercent: cp004FormatRational(commissionPercent),
    },
  };
}

function forwardContext(
  initialCostPrice: Money,
  stages: readonly TransactionStage[],
): Readonly<Record<string, unknown>> {
  return {
    initialCostPrice: cp004PlainMoney(initialCostPrice),
    stages: cp004StagesText(stages),
    firstDirection: stages[0]!.direction.toLowerCase(),
    firstRatePercent: cp004FormatRational(stages[0]!.ratePercent),
    secondDirection: stages[1]!.direction.toLowerCase(),
    secondRatePercent: cp004FormatRational(stages[1]!.ratePercent),
    ...(stages[2]
      ? {
          thirdDirection: stages[2].direction.toLowerCase(),
          thirdRatePercent: cp004FormatRational(stages[2].ratePercent),
        }
      : {}),
    transactionTable: stageTable(stages),
  };
}

export function generatePnlCp004Case(
  qlId: string,
  seedValue: string,
): PnlCp004GeneratedCase {
  const registry = taskRegistry.entries[qlId];
  if (!registry) throw new Error(`Unknown CP-004 QL: ${qlId}`);
  const random = createSeededRandom(`${seedValue}:${qlId}:parameters`);
  const initialCostPrice = rupees(pickNumber(random, BASE_PRICES));

  switch (qlId) {
    case "PNL-QL-095":
    case "PNL-QL-115": {
      const stages = pickStages(random, 2);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: { mode: "INITIAL_CP_AND_STAGES_TO_FINAL_SP", initialCostPrice, stages },
        context: forwardContext(initialCostPrice, stages),
      };
    }

    case "PNL-QL-096": {
      const stages = pickStages(random, 3);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: { mode: "INITIAL_CP_AND_STAGES_TO_FINAL_SP", initialCostPrice, stages },
        context: forwardContext(initialCostPrice, stages),
      };
    }

    case "PNL-QL-097":
    case "PNL-QL-098":
    case "PNL-QL-113": {
      const count = qlId === "PNL-QL-097" ? 2 : 3;
      const stages = pickStages(random, count);
      const finalSellingPrice = solveTransactionChain({
        mode: "INITIAL_CP_AND_STAGES_TO_FINAL_SP",
        initialCostPrice,
        stages,
      }).finalSellingPrice;
      return {
        qlId,
        registry,
        seed: seedValue,
        request: { mode: "FINAL_SP_AND_STAGES_TO_INITIAL_CP", finalSellingPrice, stages },
        context: {
          ...forwardContext(initialCostPrice, stages),
          finalSellingPrice: cp004PlainMoney(finalSellingPrice),
        },
      };
    }

    case "PNL-QL-099": {
      const stages = pickStages(random, 3);
      const afterStage = pickSeeded(random, [1, 2] as const);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "INITIAL_CP_AND_STAGES_TO_INTERMEDIATE_PRICE",
          initialCostPrice,
          stages,
          afterStage,
        },
        context: {
          initialCostPrice: cp004PlainMoney(initialCostPrice),
          stages: cp004StagesText(stages),
          afterStage,
        },
      };
    }

    case "PNL-QL-100":
    case "PNL-QL-112":
    case "PNL-QL-117": {
      const stages = pickStages(random, 2);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: { mode: "STAGES_TO_OVERALL_RATE", stages },
        context: { stages: cp004StagesText(stages) },
        ...(qlId === "PNL-QL-117" ? { answerOverride: "Statement 2 only" } : {}),
      };
    }

    case "PNL-QL-101": {
      const stages = pickStages(random, 3);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: { mode: "STAGES_TO_OVERALL_RATE", stages },
        context: forwardContext(initialCostPrice, stages),
      };
    }

    case "PNL-QL-102":
    case "PNL-QL-103":
    case "PNL-QL-118": {
      const knownStage = pickStages(random, 2)[0]!;
      const missingDirection = qlId === "PNL-QL-103" ? "LOSS" : "PROFIT";
      const missingStage = stage(missingDirection, pickNumber(random, TARGET_RATES));
      const finalSellingPrice = solveTransactionChain({
        mode: "INITIAL_CP_AND_STAGES_TO_FINAL_SP",
        initialCostPrice,
        stages: [knownStage, missingStage],
      }).finalSellingPrice;
      const context =
        qlId === "PNL-QL-118"
          ? {
              initialPriceExpression: `${cp004PlainMoney(initialCostPrice)}x`,
              finalPriceExpression: `${cp004PlainMoney(finalSellingPrice)}x`,
              knownStageExpression: stagePhrase(knownStage),
              missingDirection: missingDirection.toLowerCase(),
            }
          : {
              initialCostPrice: cp004PlainMoney(initialCostPrice),
              finalSellingPrice: cp004PlainMoney(finalSellingPrice),
              knownStages: stagePhrase(knownStage),
              missingDirection: missingDirection.toLowerCase(),
            };
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "INITIAL_FINAL_KNOWN_STAGES_TO_MISSING_RATE",
          initialCostPrice,
          finalSellingPrice,
          knownStages: [knownStage],
          missingDirection,
        },
        context,
      };
    }

    case "PNL-QL-104": {
      const stageCount = pickSeeded(random, [2, 3] as const);
      const direction = pickSeeded(random, ["PROFIT", "LOSS"] as const);
      const ratePercent = rational(pickNumber(random, TARGET_RATES));
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "EQUAL_RATE_N_STAGE_TO_FINAL_SP",
          initialCostPrice,
          stageCount,
          direction,
          ratePercent,
        },
        context: {
          initialCostPrice: cp004PlainMoney(initialCostPrice),
          stageCount,
          direction: direction.toLowerCase(),
          ratePercent: cp004FormatRational(ratePercent),
        },
      };
    }

    case "PNL-QL-105":
    case "PNL-QL-106":
    case "PNL-QL-111":
    case "PNL-QL-114":
    case "PNL-QL-116": {
      const stages = pickStages(random, 3);
      const selectedStage = pickSeeded(random, [1, 2, 3] as const);
      const secondStageNumber = pickSeeded(random, [2, 3] as const);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: { mode: "CHAIN_TO_STAGE_LEDGER", initialCostPrice, stages },
        context: {
          initialCostPrice: cp004PlainMoney(initialCostPrice),
          stages: cp004StagesText(stages),
          selectedStage,
          firstStageNumber: 1,
          secondStageNumber,
          caseletData: [
            "Three traders handle the same consignment in the order stated below.",
            `The selected result belongs to transaction ${selectedStage}; every percentage uses that trader's purchase price.`,
          ],
        },
      };
    }

    case "PNL-QL-107": {
      const purchasePrice = rupees(pickNumber(random, BASE_PRICES));
      const buyerExpense = rupees(pickNumber(random, EXPENSES));
      const direction = pickSeeded(random, ["PROFIT", "LOSS"] as const);
      const ratePercent = rational(pickNumber(random, TARGET_RATES));
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "BUYER_EXPENSE_THEN_RATE_TO_SP",
          purchasePrice,
          buyerExpense,
          direction,
          ratePercent,
        },
        context: {
          purchasePrice: cp004PlainMoney(purchasePrice),
          buyerExpense: cp004PlainMoney(buyerExpense),
          direction: direction.toLowerCase(),
          ratePercent: cp004FormatRational(ratePercent),
        },
      };
    }

    case "PNL-QL-108": {
      const grossSellingPrice = rupees(pickNumber(random, BASE_PRICES));
      const commissionPercent = rational(pickNumber(random, COMMISSION_RATES));
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "GROSS_SP_AND_COMMISSION_TO_NET_RECEIPT",
          grossSellingPrice,
          commissionPercent,
        },
        context: {
          grossSellingPrice: cp004PlainMoney(grossSellingPrice),
          commissionPercent: cp004FormatRational(commissionPercent),
        },
      };
    }

    case "PNL-QL-109": {
      const grossSellingPrice = rupees(pickNumber(random, BASE_PRICES));
      const commissionPercent = rational(pickNumber(random, COMMISSION_RATES));
      const requiredNetReceipt = solveTransactionFee({
        mode: "GROSS_SP_AND_COMMISSION_TO_NET_RECEIPT",
        grossSellingPrice,
        commissionPercent,
      }).netReceipt;
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "NET_TARGET_AND_COMMISSION_TO_GROSS_SP",
          requiredNetReceipt,
          commissionPercent,
        },
        context: {
          requiredNetReceipt: cp004PlainMoney(requiredNetReceipt),
          commissionPercent: cp004FormatRational(commissionPercent),
        },
      };
    }

    case "PNL-QL-110":
    case "PNL-QL-120": {
      const generated = middleTraderCase(random);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: generated.request,
        context: generated.context,
      };
    }

    case "PNL-QL-119": {
      const stages = pickStages(random, 2);
      const finalSellingPrice = solveTransactionChain({
        mode: "INITIAL_CP_AND_STAGES_TO_FINAL_SP",
        initialCostPrice,
        stages,
      }).finalSellingPrice;
      const pattern = pickSeeded(
        random,
        ["BOTH_TOGETHER", "STATEMENT_ONE", "STATEMENT_TWO", "EITHER"] as const,
      );
      const complete = `The final selling price is ${cp004FormatMoney(finalSellingPrice)} and the stages are ${cp004StagesText(stages)}.`;
      const finalOnly = `The final selling price is ${cp004FormatMoney(finalSellingPrice)}.`;
      const stagesOnly = `The stages are ${cp004StagesText(stages)}.`;
      const irrelevant = "The item was handled by two traders in the same city.";
      const statementOne =
        pattern === "STATEMENT_ONE" || pattern === "EITHER"
          ? complete
          : pattern === "BOTH_TOGETHER"
            ? finalOnly
            : irrelevant;
      const statementTwo =
        pattern === "STATEMENT_TWO" || pattern === "EITHER"
          ? complete
          : pattern === "BOTH_TOGETHER"
            ? stagesOnly
            : irrelevant;
      const answerOverride =
        pattern === "BOTH_TOGETHER"
          ? "Both statements together are required"
          : pattern === "STATEMENT_ONE"
            ? "Statement 1 alone is sufficient"
            : pattern === "STATEMENT_TWO"
              ? "Statement 2 alone is sufficient"
              : "Either statement alone is sufficient";
      return {
        qlId,
        registry,
        seed: seedValue,
        request: { mode: "FINAL_SP_AND_STAGES_TO_INITIAL_CP", finalSellingPrice, stages },
        context: { statementOne, statementTwo, dataSufficiencyAnswer: answerOverride },
        answerOverride,
      };
    }

    default:
      throw new Error(`${qlId}: CP-004 dynamic generator is not implemented.`);
  }
}
