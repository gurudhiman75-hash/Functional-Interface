export type MisCp016CandidateId='MIS-CAND-090';
export interface MisCp016RuleContext{readonly k:2;}
export interface MisCp016RuleDefinition{
 readonly candidateId:MisCp016CandidateId;
 readonly ruleId:'PAIR_PRODUCT_DIFFERENCE_TIMES_CONSTANT';
 readonly label:string;
 readonly difficulty:'Hard';
 readonly operationDepth:3;
 readonly operandCount:4;
 readonly contexts:readonly MisCp016RuleContext[];
 readonly sourceBacked:true;
 readonly sourceNote:string;
}
export const MIS_CP016_RULES:readonly MisCp016RuleDefinition[]=Object.freeze([{
 candidateId:'MIS-CAND-090',
 ruleId:'PAIR_PRODUCT_DIFFERENCE_TIMES_CONSTANT',
 label:'take the positive difference of two pair products, then multiply by the evidenced constant',
 difficulty:'Hard',
 operationDepth:3,
 operandCount:4,
 contexts:Object.freeze([Object.freeze({k:2 as const})]),
 sourceBacked:true,
 sourceNote:'SSC GD 3 Mar 2019 Shift 3: {(5×3)−(4×2)}×2=14 and {(5×6)−(4×7)}×2=4.'
}]);
export function misCp016RuleByCandidateId(id:string):MisCp016RuleDefinition{
 const r=MIS_CP016_RULES.find(x=>x.candidateId===id);if(!r)throw new Error('Unknown MIS-CP-016 candidate: '+id);return r;
}
