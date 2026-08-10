import { addRational, compareRational, divideRational, multiplyRational, rational, reduceRationalRatio, subtractRational } from "./rational";
import type { Rational } from "./types";
import type { MalCp005SolveRequest, MalCp005SolveResult } from "./cp005-types";

const HUNDRED = rational(100);
function assertPositive(value: Rational, label: string): void { if (compareRational(value, rational(0)) <= 0) throw new Error(`${label} must be positive.`); }
function assertNonNegative(value: Rational, label: string): void { if (compareRational(value, rational(0)) < 0) throw new Error(`${label} cannot be negative.`); }
function assertPercentBelowHundred(value: Rational, label: string): void { assertPositive(value,label); if (compareRational(value,HUNDRED)>=0) throw new Error(`${label} must be below 100%.`); }
function profitPercent(actualCost: Rational, revenue: Rational): Rational { assertPositive(actualCost,"Actual cost"); return multiplyRational(divideRational(subtractRational(revenue,actualCost),actualCost),HUNDRED); }
function targetAverageCost(sellingRate: Rational, profitPercentValue: Rational): Rational { return divideRational(multiplyRational(sellingRate,HUNDRED), addRational(HUNDRED,profitPercentValue)); }

export function solveMalCp005(request: MalCp005SolveRequest): MalCp005SolveResult {
  switch (request.mode) {
    case "FREE_ADULTERANT_PROFIT_FROM_QUANTITIES": {
      assertPositive(request.pureQuantity,"Pure quantity"); assertPositive(request.adulterantQuantity,"Adulterant quantity");
      return { kind:"PERCENT", value:multiplyRational(divideRational(request.adulterantQuantity,request.pureQuantity),HUNDRED) };
    }
    case "FREE_ADULTERANT_RATIO_FROM_TARGET_PROFIT": {
      assertPositive(request.targetProfitPercent,"Target profit");
      const [firstPart,secondPart]=reduceRationalRatio(HUNDRED,request.targetProfitPercent);
      return { kind:"RATIO", firstPart, secondPart };
    }
    case "FREE_ADULTERANT_QUANTITY_FROM_PURE_AND_TARGET": {
      assertPositive(request.pureQuantity,"Pure quantity"); assertPositive(request.targetProfitPercent,"Target profit");
      return { kind:"QUANTITY", value:divideRational(multiplyRational(request.pureQuantity,request.targetProfitPercent),HUNDRED) };
    }
    case "PURE_QUANTITY_FROM_FREE_ADULTERANT_AND_TARGET": {
      assertPositive(request.adulterantQuantity,"Adulterant quantity"); assertPositive(request.targetProfitPercent,"Target profit");
      return { kind:"QUANTITY", value:divideRational(multiplyRational(request.adulterantQuantity,HUNDRED),request.targetProfitPercent) };
    }
    case "ADULTERANT_PERCENT_FROM_TARGET_PROFIT": {
      assertPositive(request.targetProfitPercent,"Target profit");
      return { kind:"PERCENT", value:divideRational(multiplyRational(HUNDRED,request.targetProfitPercent),addRational(HUNDRED,request.targetProfitPercent)) };
    }
    case "TARGET_PROFIT_FROM_ADULTERANT_PERCENT": {
      assertPercentBelowHundred(request.adulterantPercentOfMixture,"Adulterant percentage");
      return { kind:"PERCENT", value:divideRational(multiplyRational(HUNDRED,request.adulterantPercentOfMixture),subtractRational(HUNDRED,request.adulterantPercentOfMixture)) };
    }
    case "FREE_BLEND_PROFIT_FROM_COST_AND_SELLING_RATE": {
      assertPositive(request.pureQuantity,"Pure quantity"); assertPositive(request.adulterantQuantity,"Adulterant quantity"); assertPositive(request.pureUnitCost,"Pure unit cost"); assertPositive(request.sellingRate,"Selling rate");
      const actualCost=multiplyRational(request.pureQuantity,request.pureUnitCost);
      const revenue=multiplyRational(addRational(request.pureQuantity,request.adulterantQuantity),request.sellingRate);
      return { kind:"PERCENT", value:profitPercent(actualCost,revenue) };
    }
    case "FREE_BLEND_RATIO_FROM_COST_SELLING_RATE_AND_TARGET_PROFIT": {
      assertPositive(request.pureUnitCost,"Pure unit cost"); assertPositive(request.sellingRate,"Selling rate"); assertNonNegative(request.targetProfitPercent,"Target profit");
      const average=targetAverageCost(request.sellingRate,request.targetProfitPercent);
      if (compareRational(average,rational(0))<=0 || compareRational(average,request.pureUnitCost)>=0) throw new Error("Required average cost must lie between zero and pure-product cost.");
      const [firstPart,secondPart]=reduceRationalRatio(average,subtractRational(request.pureUnitCost,average));
      return { kind:"RATIO", firstPart, secondPart };
    }
    case "FREE_BLEND_SELLING_RATE_FROM_RATIO_AND_TARGET_PROFIT": {
      assertPositive(request.pureQuantity,"Pure ratio part"); assertPositive(request.adulterantQuantity,"Adulterant ratio part"); assertPositive(request.pureUnitCost,"Pure unit cost"); assertNonNegative(request.targetProfitPercent,"Target profit");
      const average=divideRational(multiplyRational(request.pureQuantity,request.pureUnitCost),addRational(request.pureQuantity,request.adulterantQuantity));
      return { kind:"SELLING_RATE", value:divideRational(multiplyRational(average,addRational(HUNDRED,request.targetProfitPercent)),HUNDRED) };
    }
    case "CHEAPER_BLEND_PROFIT_FROM_COSTS_QUANTITIES_AND_SELLING_RATE": {
      assertPositive(request.pureQuantity,"Higher-cost quantity"); assertPositive(request.adulterantQuantity,"Cheaper quantity"); assertPositive(request.pureUnitCost,"Higher cost"); assertPositive(request.adulterantUnitCost,"Cheaper cost"); assertPositive(request.sellingRate,"Selling rate");
      if (compareRational(request.adulterantUnitCost,request.pureUnitCost)>=0) throw new Error("Adulterant must be cheaper than the pure product.");
      const actualCost=addRational(multiplyRational(request.pureQuantity,request.pureUnitCost),multiplyRational(request.adulterantQuantity,request.adulterantUnitCost));
      const revenue=multiplyRational(addRational(request.pureQuantity,request.adulterantQuantity),request.sellingRate);
      return { kind:"PERCENT", value:profitPercent(actualCost,revenue) };
    }
    case "CHEAPER_BLEND_RATIO_FROM_COSTS_SELLING_RATE_AND_TARGET_PROFIT": {
      assertPositive(request.pureUnitCost,"Higher cost"); assertPositive(request.adulterantUnitCost,"Cheaper cost"); assertPositive(request.sellingRate,"Selling rate"); assertNonNegative(request.targetProfitPercent,"Target profit");
      if (compareRational(request.adulterantUnitCost,request.pureUnitCost)>=0) throw new Error("Adulterant must be cheaper than the pure product.");
      const average=targetAverageCost(request.sellingRate,request.targetProfitPercent);
      if (compareRational(average,request.adulterantUnitCost)<=0 || compareRational(average,request.pureUnitCost)>=0) throw new Error("Required average cost must lie between component costs.");
      const [firstPart,secondPart]=reduceRationalRatio(subtractRational(average,request.adulterantUnitCost),subtractRational(request.pureUnitCost,average));
      return { kind:"RATIO", firstPart, secondPart };
    }
    case "CHEAPER_BLEND_SELLING_RATE_FROM_RATIO_AND_TARGET_PROFIT": {
      assertPositive(request.pureQuantity,"Higher-cost ratio part"); assertPositive(request.adulterantQuantity,"Cheaper ratio part"); assertPositive(request.pureUnitCost,"Higher cost"); assertPositive(request.adulterantUnitCost,"Cheaper cost"); assertNonNegative(request.targetProfitPercent,"Target profit");
      const total=addRational(request.pureQuantity,request.adulterantQuantity);
      const average=divideRational(addRational(multiplyRational(request.pureQuantity,request.pureUnitCost),multiplyRational(request.adulterantQuantity,request.adulterantUnitCost)),total);
      return { kind:"SELLING_RATE", value:divideRational(multiplyRational(average,addRational(HUNDRED,request.targetProfitPercent)),HUNDRED) };
    }
  }
}
