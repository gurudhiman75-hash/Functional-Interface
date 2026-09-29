import type { Stat007ContractId, Stat007ExamProfile } from "./types";
export const STAT007_PERMANENT_OWNERSHIP = { packageId: "STAT-007", canonicalProblemId: "STAT-CP-007", releaseId: "STAT-007-ENGLISH-REVIEW-P0", lifecycle: "CONTROLLED_REVIEW" } as const;
const profiles: readonly Stat007ExamProfile[] = ["SSC_CGL_TIER_II", "SSC_CGL_JSO"];
const rows: readonly [Stat007ContractId,string,string][] = [
  ["SCATTER_DIAGRAM_TREND","Scatter diagram trend","STAT-QL-070"],
  ["PEARSON_FROM_RAW_PAIRS","Pearson correlation from paired data","STAT-QL-071"],
  ["PEARSON_FROM_COVARIANCE","Pearson correlation from covariance and standard deviations","STAT-QL-072"],
  ["CORRELATION_BOUNDS","Meaning and bounds of the correlation coefficient","STAT-QL-073"],
  ["COVARIANCE_FROM_PAIRS","Covariance from paired observations","STAT-QL-074"],
  ["REGRESSION_Y_ON_X","Regression line of Y on X","STAT-QL-075"],
  ["REGRESSION_X_ON_Y","Regression line of X on Y","STAT-QL-076"],
  ["REGRESSION_PREDICTION","Prediction from a regression line","STAT-QL-077"],
  ["REGRESSION_COEFFICIENT_RELATION","Correlation from regression coefficients","STAT-QL-078"],
  ["SPEARMAN_NO_TIES","Spearman rank correlation without ties","STAT-QL-079"],
  ["SPEARMAN_WITH_TIES","Spearman rank correlation with tied ranks","STAT-QL-080"],
  ["YULE_ASSOCIATION","Yule coefficient of association","STAT-QL-081"],
  ["PARTIAL_CORRELATION_THREE_VARIABLES","Partial correlation for three variables","STAT-QL-082"],
  ["MULTIPLE_CORRELATION_THREE_VARIABLES","Multiple correlation for three variables","STAT-QL-083"],
  ["MULTIPLE_REGRESSION_FORM","Form of a multiple regression equation","STAT-QL-176"],
  ["MULTIPLE_REGRESSION_COEFFICIENT_INTERPRETATION","Interpret a partial regression coefficient","STAT-QL-177"],
  ["MULTIPLE_REGRESSION_PREDICTION","Prediction from a multiple regression equation","STAT-QL-178"],
  ["MULTIPLE_REGRESSION_COEFFICIENTS_FROM_CROSS_PRODUCTS","Estimate multiple regression coefficients from cross-products","STAT-QL-179"],
  ["MULTIPLE_REGRESSION_RESIDUAL","Residual from a multiple regression equation","STAT-QL-180"],
];
export const STAT007_PERMANENT_QLS = rows.map(([contractId,label,qlId],i)=>({qlId,contractId,label,supportedProfiles:profiles,difficulty:(i%3===0?"easy":i%3===1?"medium":"hard") as "easy"|"medium"|"hard",lifecycle:"CONTROLLED_REVIEW" as const}));
export function getStat007PermanentQl(id:string){return STAT007_PERMANENT_QLS.find(x=>x.qlId===id);}
