export const STAT009_CONTRACTS=["PMF_NORMALIZATION","DISCRETE_EXPECTATION","DISCRETE_VARIANCE","DISCRETE_THIRD_CENTRAL_MOMENT","EXPECTATION_AFFINE_TRANSFORM","BINOMIAL_POINT_PROBABILITY","BINOMIAL_MEAN_VARIANCE","POISSON_POINT_PROBABILITY","POISSON_MEAN_VARIANCE","NORMAL_STANDARDIZATION","EXPONENTIAL_SURVIVAL","JOINT_MARGINAL_PROBABILITY","JOINT_CONDITIONAL_PROBABILITY","JOINT_INDEPENDENCE","JOINT_COVARIANCE"]as const;export type Stat009ContractId=typeof STAT009_CONTRACTS[number];export type Stat009ExamProfile="SSC_CGL_TIER_II"|"SSC_CGL_JSO";
export type Stat009State=
 |{kind:"WEIGHTS";weights:number[];selected?:number}
 |{kind:"DISTRIBUTION";values:number[];weights:number[];output:"expectation"|"variance"|"third"|"affine-expectation";a?:number;b?:number}
 |{kind:"BINOMIAL";n:number;p:number;k:number;output:"point"|"mean"|"variance"}
 |{kind:"POISSON";lambda:number;k:number;output:"point"|"mean"|"variance"}
 |{kind:"NORMAL_Z";x:number;mean:number;sd:number}
 |{kind:"EXPONENTIAL";rate:number;t:number}
 |{kind:"JOINT";cells:[number,number,number,number];xValues:[number,number];yValues:[number,number];output:"marginal"|"conditional"|"independent"|"covariance"};
export type Stat009Question=Readonly<{packageId:"STAT-009";questionId:string;qlId:string;contractId:Stat009ContractId;seed:string;examProfile:Stat009ExamProfile;stem:string;options:readonly[string,string,string,string];correctIndex:number;answer:string;explanation:string;state:Stat009State;questionBankWritable:false;testEligible:false;mockTestEligible:false;publiclyPublishable:false;automaticStudentPublication:false;productionReleaseAuthorized:false}>;
