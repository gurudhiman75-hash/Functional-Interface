export type MisCp028CandidateId='MIS-CAND-112';
export type MisCp028RuleId='ROOT_FIRST_MINUS_ROOT_SECOND_PLUS_ROOT_THIRD';

export interface MisCp028RuleDefinition{
 readonly candidateId:MisCp028CandidateId;
 readonly ruleId:MisCp028RuleId;
 readonly label:string;
 readonly difficulty:'Medium';
 readonly operationDepth:3;
 readonly operandCount:3;
 readonly sourceBacked:true;
 readonly sourceNote:string;
}

export const MIS_CP028_RULES:readonly MisCp028RuleDefinition[]=Object.freeze([{
 candidateId:'MIS-CAND-112',
 ruleId:'ROOT_FIRST_MINUS_ROOT_SECOND_PLUS_ROOT_THIRD',
 label:'take the square roots of the three perfect squares, subtract the second root from the first, then add the third root',
 difficulty:'Medium',operationDepth:3,operandCount:3,sourceBacked:true,
 sourceNote:'SSC CGL 2013 Tier I, 21 Apr Shift 2: √81−√49+√16 = 9−7+4 = 6.'
}]);

export function misCp028RuleByCandidateId(id:string):MisCp028RuleDefinition{
 const r=MIS_CP028_RULES.find(x=>x.candidateId===id);if(!r)throw new Error('Unknown MIS-CP-028 candidate: '+id);return r;
}
