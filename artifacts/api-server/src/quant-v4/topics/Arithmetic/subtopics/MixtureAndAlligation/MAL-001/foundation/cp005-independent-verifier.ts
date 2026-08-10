import { addRational, compareRational, equalsRational, multiplyRational, rational, subtractRational } from "./rational";
import type { Rational } from "./types";
import type { MalCp005SolveRequest, MalCp005SolveResult } from "./cp005-types";

const HUNDRED=rational(100);
function resultPercent(result: MalCp005SolveResult): Rational { if(result.kind!=="PERCENT") throw new Error("Expected percent result."); return result.value; }
function resultQuantity(result: MalCp005SolveResult): Rational { if(result.kind!=="QUANTITY") throw new Error("Expected quantity result."); return result.value; }
function resultRate(result: MalCp005SolveResult): Rational { if(result.kind!=="SELLING_RATE") throw new Error("Expected selling-rate result."); return result.value; }
function commercialEquation(cost: Rational,revenue: Rational,p: Rational): boolean { return equalsRational(multiplyRational(cost,addRational(HUNDRED,p)),multiplyRational(revenue,HUNDRED)); }

export function verifyMalCp005Solution(request: MalCp005SolveRequest,result: MalCp005SolveResult): {ok:boolean;errors:string[]} {
  const errors:string[]=[];
  try {
    switch(request.mode) {
      case "FREE_ADULTERANT_PROFIT_FROM_QUANTITIES": {
        const p=resultPercent(result); if(!commercialEquation(request.pureQuantity,addRational(request.pureQuantity,request.adulterantQuantity),p)) errors.push("Free-adulterant profit equation failed."); break;
      }
      case "FREE_ADULTERANT_RATIO_FROM_TARGET_PROFIT": {
        if(result.kind!=="RATIO") throw new Error("Expected ratio result.");
        if(!commercialEquation(result.firstPart,addRational(result.firstPart,result.secondPart),request.targetProfitPercent)) errors.push("Target-profit ratio does not reproduce the stated gain."); break;
      }
      case "FREE_ADULTERANT_QUANTITY_FROM_PURE_AND_TARGET": {
        const w=resultQuantity(result); if(!commercialEquation(request.pureQuantity,addRational(request.pureQuantity,w),request.targetProfitPercent)) errors.push("Adulterant quantity does not reproduce target gain."); break;
      }
      case "PURE_QUANTITY_FROM_FREE_ADULTERANT_AND_TARGET": {
        const m=resultQuantity(result); if(!commercialEquation(m,addRational(m,request.adulterantQuantity),request.targetProfitPercent)) errors.push("Recovered pure quantity does not reproduce target gain."); break;
      }
      case "ADULTERANT_PERCENT_FROM_TARGET_PROFIT": {
        const a=resultPercent(result); const pure=subtractRational(HUNDRED,a); if(!commercialEquation(pure,HUNDRED,request.targetProfitPercent)) errors.push("Final-mixture adulterant percentage does not reproduce target gain."); break;
      }
      case "TARGET_PROFIT_FROM_ADULTERANT_PERCENT": {
        const p=resultPercent(result); const pure=subtractRational(HUNDRED,request.adulterantPercentOfMixture); if(!commercialEquation(pure,HUNDRED,p)) errors.push("Profit does not match the stated final-mixture adulterant percentage."); break;
      }
      case "FREE_BLEND_PROFIT_FROM_COST_AND_SELLING_RATE": {
        const p=resultPercent(result); const cost=multiplyRational(request.pureQuantity,request.pureUnitCost); const revenue=multiplyRational(addRational(request.pureQuantity,request.adulterantQuantity),request.sellingRate); if(!commercialEquation(cost,revenue,p)) errors.push("Free-blend commercial equation failed."); break;
      }
      case "FREE_BLEND_RATIO_FROM_COST_SELLING_RATE_AND_TARGET_PROFIT": {
        if(result.kind!=="RATIO") throw new Error("Expected ratio result."); const cost=multiplyRational(result.firstPart,request.pureUnitCost); const revenue=multiplyRational(addRational(result.firstPart,result.secondPart),request.sellingRate); if(!commercialEquation(cost,revenue,request.targetProfitPercent)) errors.push("Recovered free-blend ratio does not reproduce target gain."); break;
      }
      case "FREE_BLEND_SELLING_RATE_FROM_RATIO_AND_TARGET_PROFIT": {
        const s=resultRate(result); const cost=multiplyRational(request.pureQuantity,request.pureUnitCost); const revenue=multiplyRational(addRational(request.pureQuantity,request.adulterantQuantity),s); if(!commercialEquation(cost,revenue,request.targetProfitPercent)) errors.push("Recovered selling rate does not reproduce target gain."); break;
      }
      case "CHEAPER_BLEND_PROFIT_FROM_COSTS_QUANTITIES_AND_SELLING_RATE": {
        const p=resultPercent(result); const cost=addRational(multiplyRational(request.pureQuantity,request.pureUnitCost),multiplyRational(request.adulterantQuantity,request.adulterantUnitCost)); const revenue=multiplyRational(addRational(request.pureQuantity,request.adulterantQuantity),request.sellingRate); if(!commercialEquation(cost,revenue,p)) errors.push("Cheaper-impurity commercial equation failed."); break;
      }
      case "CHEAPER_BLEND_RATIO_FROM_COSTS_SELLING_RATE_AND_TARGET_PROFIT": {
        if(result.kind!=="RATIO") throw new Error("Expected ratio result."); const cost=addRational(multiplyRational(result.firstPart,request.pureUnitCost),multiplyRational(result.secondPart,request.adulterantUnitCost)); const revenue=multiplyRational(addRational(result.firstPart,result.secondPart),request.sellingRate); if(!commercialEquation(cost,revenue,request.targetProfitPercent)) errors.push("Recovered cheaper-impurity ratio does not reproduce target gain."); break;
      }
      case "CHEAPER_BLEND_SELLING_RATE_FROM_RATIO_AND_TARGET_PROFIT": {
        const s=resultRate(result); const cost=addRational(multiplyRational(request.pureQuantity,request.pureUnitCost),multiplyRational(request.adulterantQuantity,request.adulterantUnitCost)); const revenue=multiplyRational(addRational(request.pureQuantity,request.adulterantQuantity),s); if(!commercialEquation(cost,revenue,request.targetProfitPercent)) errors.push("Recovered selling rate does not reproduce target gain."); break;
      }
    }
  } catch(error) { errors.push(error instanceof Error?error.message:String(error)); }
  if(result.kind==="PERCENT" && compareRational(result.value,rational(0))<0) errors.push("Discovery case unexpectedly produced a loss.");
  return {ok:errors.length===0,errors};
}
