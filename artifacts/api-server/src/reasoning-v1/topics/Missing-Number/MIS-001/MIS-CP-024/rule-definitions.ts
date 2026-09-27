export type MisCp024CandidateId='MIS-CAND-108';
export type MisCp024RuleId='REPEATED_AFFINE_TRANSFORM';

export interface MisCp024RuleContext{readonly multiplier:3;readonly addend:1;}
export interface MisCp024RuleDefinition{
 readonly candidateId:MisCp024CandidateId;
 readonly ruleId:MisCp024RuleId;
 readonly label:string;
 readonly difficulty:'Medium';
 readonly operationDepth:2;
 readonly operandCount:2;
 readonly contexts:readonly MisCp024RuleContext[];
 readonly sourceBacked:true;
 readonly sourceNote:string;
}
export const MIS_CP024_RULES:readonly MisCp024RuleDefinition[]=Object.freeze([{
 candidateId:'MIS-CAND-108',
 ruleId:'REPEATED_AFFINE_TRANSFORM',
 label:'apply the same multiply-then-add transform twice across each row',
 difficulty:'Medium',
 operationDepth:2,
 operandCount:2,
 contexts:Object.freeze([Object.freeze({multiplier:3 as const,addend:1 as const})]),
 sourceBacked:true,
 sourceNote:'SSC CGL 10 Jun 2019 Shift 3: 9→28→85; 16→49→148; 12→37→112, using x→3x+1 twice.'
}]);
export function misCp024RuleByCandidateId(id:string):MisCp024RuleDefinition{
 const r=MIS_CP024_RULES.find(x=>x.candidateId===id);if(!r)throw new Error('Unknown MIS-CP-024 candidate: '+id);return r;
}
