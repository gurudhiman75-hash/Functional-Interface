import { solveFundamental } from "../../../topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/solver";
import { moneyFromRupees } from "../../../topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/money";
import { solveIntCp001 } from "../../../topics/Arithmetic/subtopics/Interest/INT-001/foundation/cp001-solver";
import { solveMalCp001 } from "../../../topics/Arithmetic/subtopics/MixtureAndAlligation/MAL-001/foundation/solver";
import { rational } from "../../../topics/Arithmetic/subtopics/MixtureAndAlligation/MAL-001/foundation/rational";
import type { Qcp001WordState, Qcp001SourceState } from "./types";
export const QCP_WORD_FAMILIES = [
  "PROFIT_LOSS",
  "INTEREST",
  "MIXTURE",
] as const;
export function isWordState(s: Qcp001SourceState): s is Qcp001WordState {
  return QCP_WORD_FAMILIES.some((k) => k === s.kind);
}
const scalar = (r: { numerator: bigint; denominator: bigint }) =>
  Number(r.numerator) / Number(r.denominator);
export function solveWordState(s: Qcp001WordState): number {
  if (s.kind === "PROFIT_LOSS") {
    const common = { direction: s.direction, ratePercent: rational(s.rate) };
    if (s.task === "SELLING_PRICE") {
      const r = solveFundamental({
        mode: "CP_RATE_TO_SP",
        costPrice: moneyFromRupees(s.amount),
        ...common,
      });
      if (r.mode !== "CP_RATE_TO_SP") throw Error("PNL source result mismatch");
      return Number(r.sellingPrice.paise) / 100;
    }
    if (s.task === "COST_PRICE") {
      const r = solveFundamental({
        mode: "SP_RATE_TO_CP",
        sellingPrice: moneyFromRupees(s.amount),
        ...common,
      });
      if (r.mode !== "SP_RATE_TO_CP") throw Error("PNL source result mismatch");
      return Number(r.costPrice.paise) / 100;
    }
    const r = solveFundamental({
      mode: "CP_RATE_TO_AMOUNT",
      costPrice: moneyFromRupees(s.amount),
      ...common,
    });
    if (r.mode !== "CP_RATE_TO_AMOUNT")
      throw Error("PNL source result mismatch");
    return Number(r.amount.paise) / 100;
  }
  if (s.kind === "INTEREST") {
    const common = {
      annualRatePercent: rational(s.rate),
      timeYears: rational(s.years),
    };
    return scalar(
      solveIntCp001(
        s.task === "PRINCIPAL"
          ? {
              mode: "PRINCIPAL_FROM_INTEREST",
              simpleInterest: rational(s.amount),
              ...common,
            }
          : {
              mode:
                s.task === "AMOUNT" ? "AMOUNT_FROM_PRT" : "INTEREST_FROM_PRT",
              principal: rational(s.amount),
              ...common,
            },
      ).value,
    );
  }
  const components = s.prices.map((value, i) => ({
    id: String(i),
    label: String(i),
    quantity: rational(s.quantities[i]!),
    value: rational(value),
  }));
  const r =
    s.task === "MEAN"
      ? solveMalCp001({ mode: "MEAN_FROM_COMPONENTS", components })
      : solveMalCp001({
          mode: "UNKNOWN_COMPONENT_VALUE",
          knownComponents: components,
          unknownComponentId: "unknown",
          unknownComponentLabel: "unknown",
          unknownQuantity: rational(s.quantities[s.prices.length]!),
          targetValue: rational(s.mean),
        });
  if (r.kind !== "MEAN_VALUE" && r.kind !== "SOURCE_VALUE")
    throw Error("MAL source result mismatch");
  return scalar(r.value);
}
export function buildWordStates(
  family: (typeof QCP_WORD_FAMILIES)[number],
  targets: readonly number[],
  variant: number,
): Qcp001WordState[] {
  return targets.map((target) => {
    if (family === "PROFIT_LOSS") {
      const rate = variant % 2 ? 25 : 20,
        direction = variant % 4 < 2 ? "PROFIT" : "LOSS";
      const factor = 100 + (direction === "PROFIT" ? rate : -rate);
      const task = (["SELLING_PRICE", "COST_PRICE", "PROFIT_AMOUNT"] as const)[
        variant % 3
      ]!;
      return {
        kind: family,
        task,
        rate,
        direction,
        amount:
          task === "SELLING_PRICE"
            ? (target * 100) / factor
            : task === "COST_PRICE"
              ? (target * factor) / 100
              : (target * 100) / rate,
      };
    }
    if (family === "INTEREST") {
      const rate = 25,
        years = 2,
        task = (["INTEREST", "AMOUNT", "PRINCIPAL"] as const)[variant % 3]!;
      return {
        kind: family,
        task,
        rate,
        years,
        amount:
          task === "PRINCIPAL"
            ? target / 2
            : task === "AMOUNT"
              ? (target * 2) / 3
              : target * 2,
      };
    }
    const gap = 6 * (1 + (variant % 4));
    if (variant % 3 === 0)
      return {
        kind: family,
        task: "MEAN",
        quantities: [1, 2],
        prices: [target - 2 * gap, target + gap],
        mean: target,
      };
    if (variant % 3 === 1)
      return {
        kind: family,
        task: "MEAN",
        quantities: [1, 2, 3],
        prices: [target - 3 * gap, target, target + gap],
        mean: target,
      };
    return {
      kind: family,
      task: "UNKNOWN_PRICE",
      quantities: [2, 1],
      prices: [target - 3 * gap],
      mean: target - 2 * gap,
    };
  });
}
