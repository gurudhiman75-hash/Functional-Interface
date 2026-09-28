export type MisCp022CandidateId='MIS-CAND-106';
export type MisCp022RuleId='PAIR_ARITHMETIC_MEAN';

export interface MisCp022RuleDefinition{
 readonly candidateId:MisCp022CandidateId;
 readonly ruleId:MisCp022RuleId;
 readonly label:string;
 readonly difficulty:'Medium';
 readonly operationDepth:2;
 readonly operandCount:2;
 readonly sourceBacked:true;
 readonly sourceNote:string;
}

export const MIS_CP022_RULES:readonly MisCp022RuleDefinition[]=Object.freeze([
 {
  candidateId:'MIS-CAND-106',
  ruleId:'PAIR_ARITHMETIC_MEAN',
  label:'add the two displayed numbers and divide the sum by 2',
  difficulty:'Medium',operationDepth:2,operandCount:2,sourceBacked:true,
  sourceNote:'SSC CGL 13 Jun 2019 Shift 2: (36+28)÷2=32; (52+40)÷2=46; (86+12)÷2=49.'
 }
]);

export function misCp022RuleByCandidateId(id:string):MisCp022RuleDefinition{
 const r=MIS_CP022_RULES.find(x=>x.candidateId===id);if(!r)throw new Error('Unknown MIS-CP-022 candidate: '+id);return r;
}
