export const STAT008_CONTRACTS=["CLASSICAL_PROBABILITY","EMPIRICAL_PROBABILITY","COMPLEMENT_RULE","MUTUALLY_EXCLUSIVE_UNION","GENERAL_ADDITION_RULE","CONDITIONAL_PROBABILITY","INTERSECTION_FROM_CONDITIONAL","TEST_INDEPENDENCE","INDEPENDENT_INTERSECTION","TOTAL_PROBABILITY","BAYES_THEOREM","COMPOUND_EVENT_COMPLEMENT"] as const;
export type Stat008ContractId=typeof STAT008_CONTRACTS[number];export type Stat008ExamProfile="SSC_CGL_TIER_II"|"SSC_CGL_JSO";
export type Stat008State=
 |{kind:"RATIO";numerator:number;denominator:number}
 |{kind:"COMPLEMENT";p:number}
 |{kind:"UNION";pA:number;pB:number;pAB:number}
 |{kind:"CONDITIONAL";pAB:number;pB:number}
 |{kind:"CONDITIONAL_PRODUCT";pGivenB:number;pB:number}
 |{kind:"INDEPENDENCE";pA:number;pB:number;pAB:number;output:"yesno"|"intersection"}
 |{kind:"TOTAL";priorA:number;priorB:number;likelihoodA:number;likelihoodB:number}
 |{kind:"BAYES";priorA:number;priorB:number;likelihoodA:number;likelihoodB:number}
 |{kind:"COMPOUND_COMPLEMENT";pA:number;pB:number;pAB:number};
export type Stat008Question=Readonly<{packageId:"STAT-008";questionId:string;qlId:string;contractId:Stat008ContractId;seed:string;examProfile:Stat008ExamProfile;stem:string;options:readonly[string,string,string,string];correctIndex:number;answer:string;explanation:string;state:Stat008State;questionBankWritable:false;testEligible:false;mockTestEligible:false;publiclyPublishable:false;automaticStudentPublication:false;productionReleaseAuthorized:false}>;
