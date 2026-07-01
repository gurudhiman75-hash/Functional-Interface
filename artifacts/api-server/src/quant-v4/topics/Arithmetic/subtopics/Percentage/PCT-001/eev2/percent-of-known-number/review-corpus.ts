import type { EEV2DetailMode } from "../../../../../../../common/eev2/contracts";
export const PERCENT_OF_KNOWN_NUMBER_REVIEW_CORPUS_VERSION = "1.0.0" as const;
export const PERCENT_OF_KNOWN_NUMBER_REVIEW_CATEGORIES = [
  "REQUESTED_GREATER", "REQUESTED_SMALLER", "EQUAL_RATES",
  "INTEGER_UNIT_VALUE", "DECIMAL_UNIT_VALUE", "COUNT_CONTEXT",
  "CURRENCY_CONTEXT", "ABSTRACT_CONTEXT", "WEAK_STUDENT",
] as const;
export type PercentOfKnownNumberReviewCategory =
  (typeof PERCENT_OF_KNOWN_NUMBER_REVIEW_CATEGORIES)[number];
export interface PercentOfKnownNumberReviewCorpusItem {
  corpusId: string;
  questionLanguageId: "PCT-QL-017" | "PCT-QL-117" | "PCT-QL-217" | "PCT-QL-317" | "PCT-QL-417";
  detailMode: EEV2DetailMode;
  knownUnitCount: number;
  knownQuantity: number;
  targetUnitCount: number;
  quantityContext: "count" | "currency" | "abstract";
  categories: readonly PercentOfKnownNumberReviewCategory[];
}
const raw = [
  ["017","standard",20,600,25,"abstract",["REQUESTED_GREATER","INTEGER_UNIT_VALUE","ABSTRACT_CONTEXT","WEAK_STUDENT"]],
  ["117","short",40,200,10,"count",["REQUESTED_SMALLER","INTEGER_UNIT_VALUE","COUNT_CONTEXT"]],
  ["217","detailed",25,100,20,"currency",["REQUESTED_SMALLER","INTEGER_UNIT_VALUE","CURRENCY_CONTEXT"]],
  ["317","standard",25,300,50,"count",["REQUESTED_GREATER","INTEGER_UNIT_VALUE","COUNT_CONTEXT"]],
  ["417","detailed",15,200,10,"abstract",["REQUESTED_SMALLER","DECIMAL_UNIT_VALUE","ABSTRACT_CONTEXT","WEAK_STUDENT"]],
  ["017","short",30,150,30,"abstract",["EQUAL_RATES","INTEGER_UNIT_VALUE","ABSTRACT_CONTEXT"]],
  ["117","standard",12,50,18,"currency",["REQUESTED_GREATER","DECIMAL_UNIT_VALUE","CURRENCY_CONTEXT"]],
  ["217","detailed",80,500,30,"count",["REQUESTED_SMALLER","DECIMAL_UNIT_VALUE","COUNT_CONTEXT","WEAK_STUDENT"]],
  ["317","short",50,2400,75,"currency",["REQUESTED_GREATER","INTEGER_UNIT_VALUE","CURRENCY_CONTEXT"]],
  ["417","standard",16,120,8,"abstract",["REQUESTED_SMALLER","DECIMAL_UNIT_VALUE","ABSTRACT_CONTEXT"]],
  ["017","detailed",20,250,60,"count",["REQUESTED_GREATER","DECIMAL_UNIT_VALUE","COUNT_CONTEXT","WEAK_STUDENT"]],
  ["117","standard",75,900,75,"currency",["EQUAL_RATES","INTEGER_UNIT_VALUE","CURRENCY_CONTEXT"]],
] as const;
export const PERCENT_OF_KNOWN_NUMBER_REVIEW_CORPUS:
readonly PercentOfKnownNumberReviewCorpusItem[] = raw.map((item, index) => ({
  corpusId: `unit-value-review-${String(index + 1).padStart(3, "0")}`,
  questionLanguageId: `PCT-QL-${item[0]}` as PercentOfKnownNumberReviewCorpusItem["questionLanguageId"],
  detailMode: item[1], knownUnitCount: item[2], knownQuantity: item[3],
  targetUnitCount: item[4], quantityContext: item[5], categories: item[6],
}));

