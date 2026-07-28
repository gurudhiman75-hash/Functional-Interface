import { TMW_CP_008_ID, type TmwCp008RegistryEntry } from "./cp008-types";
export const TMW_CP008_REGISTRY:readonly TmwCp008RegistryEntry[]=[
{qlId:"TMW-QL-144",cpId:TMW_CP_008_ID,solveMode:"findPaymentRatioFromContributionFactors",answerType:"RATIO",ruleId:"TMW_CONTRIBUTION_RATIO",difficulty:"Easy",publiclyPublishable:false},
{qlId:"TMW-QL-145",cpId:TMW_CP_008_ID,solveMode:"findSelectedPartyPayment",answerType:"MONEY",ruleId:"TMW_PAYMENT_SHARE",difficulty:"Easy",publiclyPublishable:false},
{qlId:"TMW-QL-146",cpId:TMW_CP_008_ID,solveMode:"findTotalPaymentPoolFromKnownShare",answerType:"MONEY",ruleId:"TMW_PAYMENT_INVERSE",difficulty:"Medium",publiclyPublishable:false},
{qlId:"TMW-QL-147",cpId:TMW_CP_008_ID,solveMode:"findResidualPayment",answerType:"MONEY",ruleId:"TMW_PAYMENT_SHARE",difficulty:"Easy",publiclyPublishable:false},
{qlId:"TMW-QL-148",cpId:TMW_CP_008_ID,solveMode:"findPaymentAfterStagedParticipation",answerType:"MONEY",ruleId:"TMW_STAGED_PAYMENT",difficulty:"Medium",publiclyPublishable:false},
{qlId:"TMW-QL-149",cpId:TMW_CP_008_ID,solveMode:"findPaymentFromCompletedFractions",answerType:"MONEY",ruleId:"TMW_PAYMENT_SHARE",difficulty:"Easy",publiclyPublishable:false},
{qlId:"TMW-QL-150",cpId:TMW_CP_008_ID,solveMode:"findContributionFactorRatioFromPayments",answerType:"RATIO",ruleId:"TMW_PAYMENT_INVERSE",difficulty:"Medium",publiclyPublishable:false},
{qlId:"TMW-QL-151",cpId:TMW_CP_008_ID,solveMode:"findMissingTimeFromPayment",answerType:"TIME",ruleId:"TMW_PAYMENT_INVERSE",difficulty:"Hard",publiclyPublishable:false},
{qlId:"TMW-QL-152",cpId:TMW_CP_008_ID,solveMode:"findMissingEfficiencyFromPayment",answerType:"EFFICIENCY",ruleId:"TMW_PAYMENT_INVERSE",difficulty:"Hard",publiclyPublishable:false},
{qlId:"TMW-QL-153",cpId:TMW_CP_008_ID,solveMode:"findMixedCategoryPaymentDistribution",answerType:"MONEY_TRIPLE",ruleId:"TMW_PAYMENT_SHARE",difficulty:"Medium",publiclyPublishable:false},
{qlId:"TMW-QL-154",cpId:TMW_CP_008_ID,solveMode:"findPieceRatePaymentFromOutput",answerType:"MONEY",ruleId:"TMW_PIECE_RATE",difficulty:"Easy",publiclyPublishable:false},
{qlId:"TMW-QL-155",cpId:TMW_CP_008_ID,solveMode:"findBonusShareFromExtraContribution",answerType:"MONEY",ruleId:"TMW_EXTRA_CONTRIBUTION",difficulty:"Medium",publiclyPublishable:false},
{qlId:"TMW-QL-156",cpId:TMW_CP_008_ID,solveMode:"findPaymentAfterSignedContribution",answerType:"MONEY",ruleId:"TMW_SIGNED_CONTRIBUTION",difficulty:"Hard",publiclyPublishable:false},
] as const;
export function getTmwCp008Entry(qlId:string):TmwCp008RegistryEntry{const entry=TMW_CP008_REGISTRY.find(candidate=>candidate.qlId===qlId);if(!entry)throw new Error(`Unknown TMW-CP-008 QL: ${qlId}`);return entry;}
