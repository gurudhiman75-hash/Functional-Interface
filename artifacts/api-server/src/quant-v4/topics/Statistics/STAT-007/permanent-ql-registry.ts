import type { Stat007ContractId, Stat007ExamProfile } from "./types";
export const STAT007_PERMANENT_OWNERSHIP = { packageId: "STAT-007", canonicalProblemId: "STAT-CP-007", releaseId: "STAT-007-ENGLISH-REVIEW-P0", lifecycle: "CONTROLLED_REVIEW" } as const;
const profiles: readonly Stat007ExamProfile[] = ["SSC_CGL_TIER_II", "SSC_CGL_JSO"];
const labels: readonly [Stat007ContractId,string][] = [
  ["SCATTER_DIAGRAM_TREND","Scatter diagram trend"],["PEARSON_FROM_RAW_PAIRS","Pearson correlation from paired data"],
  ["PEARSON_FROM_COVARIANCE","Pearson correlation from covariance and standard deviations"],["CORRELATION_BOUNDS","Meaning and bounds of the correlation coefficient"],
  ["COVARIANCE_FROM_PAIRS","Covariance from paired observations"],["REGRESSION_Y_ON_X","Regression line of Y on X"],
  ["REGRESSION_X_ON_Y","Regression line of X on Y"],["REGRESSION_PREDICTION","Prediction from a regression line"],
  ["REGRESSION_COEFFICIENT_RELATION","Correlation from regression coefficients"],["SPEARMAN_NO_TIES","Spearman rank correlation without ties"],
  ["SPEARMAN_WITH_TIES","Spearman rank correlation with tied ranks"],["YULE_ASSOCIATION","Yule coefficient of association"],
  ["PARTIAL_CORRELATION_THREE_VARIABLES","Partial correlation for three variables"],["MULTIPLE_CORRELATION_THREE_VARIABLES","Multiple correlation for three variables"],
];
export const STAT007_PERMANENT_QLS = labels.map(([contractId,label],i)=>({qlId:`STAT-QL-${String(70+i).padStart(3,"0")}`,contractId,label,supportedProfiles:profiles,difficulty:(i%3===0?"easy":i%3===1?"medium":"hard") as "easy"|"medium"|"hard",lifecycle:"CONTROLLED_REVIEW" as const}));
export function getStat007PermanentQl(id:string){return STAT007_PERMANENT_QLS.find(x=>x.qlId===id);}
