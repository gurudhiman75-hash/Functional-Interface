export type MisCp026CandidateId='MIS-CAND-110';
export type MisCp026RuleId='OPPOSITE_PAIR_SQUARE';

export interface MisCp026RuleDefinition{
 readonly candidateId:MisCp026CandidateId;
 readonly ruleId:MisCp026RuleId;
 readonly label:string;
 readonly difficulty:'Easy';
 readonly operationDepth:1;
 readonly operandCount:1;
 readonly sourceBacked:true;
 readonly sourceNote:string;
 readonly semanticAuthorityCandidateId:'MIS-CAND-016';
 readonly createsNewSemanticAuthority:false;
}

export const MIS_CP026_RULES:readonly MisCp026RuleDefinition[]=Object.freeze([{
 candidateId:'MIS-CAND-110',
 ruleId:'OPPOSITE_PAIR_SQUARE',
 label:'the number at one end of each diameter is the square of the opposite number',
 difficulty:'Easy',operationDepth:1,operandCount:1,sourceBacked:true,
 sourceNote:'RRB ALP Previous Paper 8, held 13 Aug 2018 Shift 3: 5↔25, 8↔64, 2↔4 and 1↔1.',
 semanticAuthorityCandidateId:'MIS-CAND-016',
 createsNewSemanticAuthority:false,
}]);

export function misCp026RuleByCandidateId(id:string):MisCp026RuleDefinition{
 const r=MIS_CP026_RULES.find(x=>x.candidateId===id);if(!r)throw new Error('Unknown MIS-CP-026 candidate: '+id);return r;
}
