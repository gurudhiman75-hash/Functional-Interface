import type { Money, Rational } from "./types";
import { moneyFromPaise, multiplyMoney } from "./money";
import {
  asPercent,
  divideRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./rational";

export type ChainDirection = "PROFIT" | "LOSS";

export type TransactionStage = Readonly<{
  direction: ChainDirection;
  ratePercent: Rational;
}>;

export type TransactionStageLedger = Readonly<{
  stageNumber: number;
  purchasePrice: Money;
  sellingPrice: Money;
  direction: ChainDirection;
  amount: Money;
  ratePercent: Rational;
}>;

export type TransactionChainRequest =
  | { mode: "INITIAL_CP_AND_STAGES_TO_FINAL_SP"; initialCostPrice: Money; stages: readonly TransactionStage[] }
  | { mode: "FINAL_SP_AND_STAGES_TO_INITIAL_CP"; finalSellingPrice: Money; stages: readonly TransactionStage[] }
  | { mode: "INITIAL_CP_AND_STAGES_TO_INTERMEDIATE_PRICE"; initialCostPrice: Money; stages: readonly TransactionStage[]; afterStage: number }
  | { mode: "STAGES_TO_OVERALL_RATE"; stages: readonly TransactionStage[] }
  | { mode: "INITIAL_FINAL_KNOWN_STAGES_TO_MISSING_RATE"; initialCostPrice: Money; finalSellingPrice: Money; knownStages: readonly TransactionStage[]; missingDirection: ChainDirection }
  | { mode: "EQUAL_RATE_N_STAGE_TO_FINAL_SP"; initialCostPrice: Money; stageCount: number; direction: ChainDirection; ratePercent: Rational }
  | { mode: "CHAIN_TO_STAGE_LEDGER"; initialCostPrice: Money; stages: readonly TransactionStage[] };

export type TransactionChainResult =
  | { mode: "INITIAL_CP_AND_STAGES_TO_FINAL_SP"; finalSellingPrice: Money }
  | { mode: "FINAL_SP_AND_STAGES_TO_INITIAL_CP"; initialCostPrice: Money }
  | { mode: "INITIAL_CP_AND_STAGES_TO_INTERMEDIATE_PRICE"; intermediatePrice: Money }
  | { mode: "STAGES_TO_OVERALL_RATE"; direction: "PROFIT" | "LOSS" | "NO_CHANGE"; ratePercent: Rational }
  | { mode: "INITIAL_FINAL_KNOWN_STAGES_TO_MISSING_RATE"; missingRatePercent: Rational }
  | { mode: "EQUAL_RATE_N_STAGE_TO_FINAL_SP"; finalSellingPrice: Money }
  | { mode: "CHAIN_TO_STAGE_LEDGER"; finalSellingPrice: Money; ledger: readonly TransactionStageLedger[] };

function validateRate(stage: TransactionStage): void {
  if (stage.ratePercent.denominator <= 0n || stage.ratePercent.numerator < 0n) {
    throw new Error("A transaction rate must be non-negative.");
  }
  if (stage.direction === "LOSS" && stage.ratePercent.numerator >= 100n * stage.ratePercent.denominator) {
    throw new Error("A loss rate in a continuing chain must be below 100%.");
  }
}

function stageMultiplier(stage: TransactionStage): Rational {
  validateRate(stage);
  const hundred = rational(100);
  const rate = divideRational(stage.ratePercent, hundred);
  return stage.direction === "PROFIT"
    ? { numerator: rate.denominator + rate.numerator, denominator: rate.denominator }
    : subtractRational(rational(1), rate);
}

function chainMultiplier(stages: readonly TransactionStage[]): Rational {
  if (stages.length === 0) throw new Error("At least one transaction stage is required.");
  return stages.reduce(
    (accumulator, stage) => multiplyRational(accumulator, stageMultiplier(stage)),
    rational(1),
  );
}

function summarizeMultiplier(multiplier: Rational): {
  direction: "PROFIT" | "LOSS" | "NO_CHANGE";
  ratePercent: Rational;
} {
  const difference = multiplier.numerator - multiplier.denominator;
  const absoluteDifference = difference < 0n ? -difference : difference;
  return {
    direction: difference > 0n ? "PROFIT" : difference < 0n ? "LOSS" : "NO_CHANGE",
    ratePercent: asPercent(rational(absoluteDifference, multiplier.denominator)),
  };
}

export function solveTransactionChain(request: TransactionChainRequest): TransactionChainResult {
  switch (request.mode) {
    case "INITIAL_CP_AND_STAGES_TO_FINAL_SP":
      return {
        mode: request.mode,
        finalSellingPrice: multiplyMoney(request.initialCostPrice, chainMultiplier(request.stages)),
      };

    case "FINAL_SP_AND_STAGES_TO_INITIAL_CP": {
      const multiplier = chainMultiplier(request.stages);
      if (multiplier.numerator <= 0n) throw new Error("The chain multiplier must be positive.");
      return {
        mode: request.mode,
        initialCostPrice: multiplyMoney(
          request.finalSellingPrice,
          rational(multiplier.denominator, multiplier.numerator),
        ),
      };
    }

    case "INITIAL_CP_AND_STAGES_TO_INTERMEDIATE_PRICE": {
      if (request.afterStage < 1 || request.afterStage > request.stages.length) {
        throw new Error("afterStage must identify an existing transaction stage.");
      }
      return {
        mode: request.mode,
        intermediatePrice: multiplyMoney(
          request.initialCostPrice,
          chainMultiplier(request.stages.slice(0, request.afterStage)),
        ),
      };
    }

    case "STAGES_TO_OVERALL_RATE":
      return { mode: request.mode, ...summarizeMultiplier(chainMultiplier(request.stages)) };

    case "INITIAL_FINAL_KNOWN_STAGES_TO_MISSING_RATE": {
      if (request.initialCostPrice.paise <= 0n) throw new Error("Initial cost price must be positive.");
      const overallMultiplier = rational(request.finalSellingPrice.paise, request.initialCostPrice.paise);
      const knownMultiplier = request.knownStages.length === 0 ? rational(1) : chainMultiplier(request.knownStages);
      const missingMultiplier = divideRational(overallMultiplier, knownMultiplier);
      const difference = missingMultiplier.numerator - missingMultiplier.denominator;
      if (request.missingDirection === "PROFIT" && difference < 0n) {
        throw new Error("The supplied data imply a loss, not a profit, at the missing stage.");
      }
      if (request.missingDirection === "LOSS" && difference > 0n) {
        throw new Error("The supplied data imply a profit, not a loss, at the missing stage.");
      }
      const absoluteDifference = difference < 0n ? -difference : difference;
      return {
        mode: request.mode,
        missingRatePercent: asPercent(rational(absoluteDifference, missingMultiplier.denominator)),
      };
    }

    case "EQUAL_RATE_N_STAGE_TO_FINAL_SP": {
      if (!Number.isInteger(request.stageCount) || request.stageCount <= 0) {
        throw new Error("stageCount must be a positive integer.");
      }
      const stage: TransactionStage = {
        direction: request.direction,
        ratePercent: request.ratePercent,
      };
      const stages = Array.from({ length: request.stageCount }, () => stage);
      return {
        mode: request.mode,
        finalSellingPrice: multiplyMoney(request.initialCostPrice, chainMultiplier(stages)),
      };
    }

    case "CHAIN_TO_STAGE_LEDGER": {
      if (request.stages.length === 0) throw new Error("At least one transaction stage is required.");
      const ledger: TransactionStageLedger[] = [];
      let current = request.initialCostPrice;
      for (let index = 0; index < request.stages.length; index += 1) {
        const stage = request.stages[index]!;
        const next = multiplyMoney(current, stageMultiplier(stage));
        const delta = next.paise - current.paise;
        ledger.push({
          stageNumber: index + 1,
          purchasePrice: current,
          sellingPrice: next,
          direction: stage.direction,
          amount: moneyFromPaise(delta < 0n ? -delta : delta),
          ratePercent: stage.ratePercent,
        });
        current = next;
      }
      return { mode: request.mode, finalSellingPrice: current, ledger };
    }
  }
}
