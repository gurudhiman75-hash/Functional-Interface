export type MisCp021CandidateId='MIS-CAND-104'|'MIS-CAND-105';
export type MisCp021RuleId='CUBE_ROOT_OF_DIFFERENCE'|'PAIR_PRODUCT_PLUS_ONE_TIMES_THIRD';

export interface MisCp021RuleDefinition{
 readonly candidateId:MisCp021CandidateId;
 readonly ruleId:MisCp021RuleId;
 readonly label:string;
 readonly difficulty:'Medium'|'Hard';
 readonly operationDepth:2|3;
 readonly operandCount:2|3;
 readonly sourceBacked:true;
 readonly sourceNote:string;
}

export const MIS_CP021_RULES:readonly MisCp021RuleDefinition[]=Object.freeze([
 {
  candidateId:'MIS-CAND-104',
  ruleId:'CUBE_ROOT_OF_DIFFERENCE',
  label:'take the positive difference of the displayed numbers, then its exact cube root',
  difficulty:'Medium',operationDepth:2,operandCount:2,sourceBacked:true,
  sourceNote:'SSC GD 7 Mar 2019 Shift 1: 565−222=343=7³ and 899−387=512=8³.'
 },
 {
  candidateId:'MIS-CAND-105',
  ruleId:'PAIR_PRODUCT_PLUS_ONE_TIMES_THIRD',
  label:'multiply the first two numbers, add 1, then multiply by the third',
  difficulty:'Hard',operationDepth:3,operandCount:3,sourceBacked:true,
  sourceNote:'SSC CGL 10 Aug 2017 Shift 3: (3×10+1)×6=186; (9×5+1)×3=138; (5×7+1)×1=36; target (3×2+1)×5=35.'
 }
]);

export function misCp021RuleByCandidateId(id:string):MisCp021RuleDefinition{
 const r=MIS_CP021_RULES.find(x=>x.candidateId===id);if(!r)throw new Error('Unknown MIS-CP-021 candidate: '+id);return r;
}
