import type { MalCp005DiscoveryPrototypeId, MalCp005DiscoveryQuestion } from "./cp005-types";
import {
  freeProfitFromQuantitiesQuestion, ratioFromTargetProfitAtPureCostQuestion,
  adulterantQuantityFromPureQuestion, pureQuantityFromAdulterantQuestion,
  adulterantPercentFromProfitQuestion, profitFromAdulterantPercentQuestion,
} from "./cp005-discovery-free-adulterant";
import {
  freeBlendProfitWithSellingRateQuestion, freeBlendRatioFromCommercialTargetQuestion,
  freeBlendSellingRateQuestion,
} from "./cp005-discovery-commercial";
import { cheaperBlendProfitQuestion, cheaperBlendRatioQuestion, cheaperBlendSellingRateQuestion } from "./cp005-discovery-cheaper-impurity";

export function generateByPrototype(prototypeId: MalCp005DiscoveryPrototypeId, seed: string): MalCp005DiscoveryQuestion {
  switch (prototypeId) {
    case "MAL-CP005-PROT-PROFIT-FROM-FREE-ADULTERANT-QUANTITIES": return freeProfitFromQuantitiesQuestion(seed);
    case "MAL-CP005-PROT-RATIO-FROM-TARGET-PROFIT-AT-PURE-COST": return ratioFromTargetProfitAtPureCostQuestion(seed);
    case "MAL-CP005-PROT-ADULTERANT-QUANTITY-FROM-PURE-AND-TARGET-PROFIT": return adulterantQuantityFromPureQuestion(seed);
    case "MAL-CP005-PROT-PURE-QUANTITY-FROM-ADULTERANT-AND-TARGET-PROFIT": return pureQuantityFromAdulterantQuestion(seed);
    case "MAL-CP005-PROT-ADULTERANT-PERCENT-FROM-TARGET-PROFIT": return adulterantPercentFromProfitQuestion(seed);
    case "MAL-CP005-PROT-PROFIT-FROM-ADULTERANT-PERCENT": return profitFromAdulterantPercentQuestion(seed);
    case "MAL-CP005-PROT-PROFIT-FROM-FREE-BLEND-AND-SELLING-RATE": return freeBlendProfitWithSellingRateQuestion(seed);
    case "MAL-CP005-PROT-FREE-BLEND-RATIO-FROM-COST-SELLING-RATE-AND-TARGET-PROFIT": return freeBlendRatioFromCommercialTargetQuestion(seed);
    case "MAL-CP005-PROT-FREE-BLEND-SELLING-RATE-FROM-RATIO-AND-TARGET-PROFIT": return freeBlendSellingRateQuestion(seed);
    case "MAL-CP005-PROT-PROFIT-FROM-CHEAPER-IMPURITY-BLEND": return cheaperBlendProfitQuestion(seed);
    case "MAL-CP005-PROT-CHEAPER-IMPURITY-RATIO-FROM-TARGET-PROFIT": return cheaperBlendRatioQuestion(seed);
    case "MAL-CP005-PROT-CHEAPER-IMPURITY-SELLING-RATE-FROM-TARGET-PROFIT": return cheaperBlendSellingRateQuestion(seed);
  }
}
