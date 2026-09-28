export type MisCp027CandidateId='MIS-CAND-111';
export type MisCp027RuleId='SUM_OF_CUBES';
export interface MisCp027RuleDefinition{
 readonly candidateId:MisCp027CandidateId;readonly ruleId:MisCp027RuleId;readonly label:string;
 readonly difficulty:'Medium';readonly operationDepth:2;readonly operandCount:2;readonly sourceBacked:true;readonly sourceNote:string;
}
export const MIS_CP027_RULES:readonly MisCp027RuleDefinition[]=Object.freeze([{
 candidateId:'MIS-CAND-111',ruleId:'SUM_OF_CUBES',label:'cube each of the two inputs, then add the cubes',
 difficulty:'Medium',operationDepth:2,operandCount:2,sourceBacked:true,
 sourceNote:'SSC Stenographer 7 Feb 2019 Shift 1: 8³+2³=520; 7³+3³=370; target 6³+4³=280.'
}]);
export function misCp027RuleByCandidateId(id:string):MisCp027RuleDefinition{
 const r=MIS_CP027_RULES.find(x=>x.candidateId===id);if(!r)throw new Error('Unknown MIS-CP-027 candidate: '+id);return r;
}
