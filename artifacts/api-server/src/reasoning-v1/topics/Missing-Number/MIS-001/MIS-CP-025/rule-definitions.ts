export type MisCp025CandidateId='MIS-CAND-109';
export type MisCp025RuleId='SHARED_FACTOR_DUAL_PRODUCT';

export interface MisCp025RuleDefinition{
 readonly candidateId:MisCp025CandidateId;
 readonly ruleId:MisCp025RuleId;
 readonly label:string;
 readonly difficulty:'Easy';
 readonly operationDepth:1;
 readonly operandCount:3;
 readonly sourceBacked:true;
 readonly sourceNote:string;
 readonly semanticAuthorityCandidateId:'MIS-CAND-003';
 readonly createsNewSemanticAuthority:false;
}

export const MIS_CP025_RULES:readonly MisCp025RuleDefinition[]=Object.freeze([{
 candidateId:'MIS-CAND-109',
 ruleId:'SHARED_FACTOR_DUAL_PRODUCT',
 label:'multiply the shared middle number by each adjacent input to obtain the two outputs',
 difficulty:'Easy',operationDepth:1,operandCount:3,sourceBacked:true,
 sourceNote:'RRB ALP Previous Paper 13, held 20 Aug 2018 Shift 2: 12×7=84 and 7×2=14; 9×9=81 and 9×2=18; target 11×8=88 and 8×2=16.',
 semanticAuthorityCandidateId:'MIS-CAND-003',
 createsNewSemanticAuthority:false,
}]);

export function misCp025RuleByCandidateId(id:string):MisCp025RuleDefinition{
 const r=MIS_CP025_RULES.find(x=>x.candidateId===id);if(!r)throw new Error('Unknown MIS-CP-025 candidate: '+id);return r;
}
