export type MisCp011CandidateId='MIS-CAND-075'|'MIS-CAND-076'|'MIS-CAND-077';
export type MisCp011RuleId='PAIR_PRODUCT_MINUS_THIRD_SQUARE'|'FIRST_SQUARE_PLUS_PAIR_PRODUCT'|'PAIR_SUM_SQUARE_MINUS_THIRD';
export interface MisCp011RuleDefinition{
 readonly candidateId:MisCp011CandidateId;readonly ruleId:MisCp011RuleId;readonly label:string;
 readonly difficulty:'Medium'|'Hard';readonly operationDepth:2;readonly operandCount:3;
 readonly semanticAuthorityCandidateId:MisCp011CandidateId;readonly createsNewSemanticAuthority:true;
}
export const MIS_CP011_RULES:readonly MisCp011RuleDefinition[]=Object.freeze([
 {candidateId:'MIS-CAND-075',ruleId:'PAIR_PRODUCT_MINUS_THIRD_SQUARE',label:'a×b − c²',difficulty:'Hard',operationDepth:2,operandCount:3,semanticAuthorityCandidateId:'MIS-CAND-075',createsNewSemanticAuthority:true},
 {candidateId:'MIS-CAND-076',ruleId:'FIRST_SQUARE_PLUS_PAIR_PRODUCT',label:'a² + b×c',difficulty:'Hard',operationDepth:2,operandCount:3,semanticAuthorityCandidateId:'MIS-CAND-076',createsNewSemanticAuthority:true},
 {candidateId:'MIS-CAND-077',ruleId:'PAIR_SUM_SQUARE_MINUS_THIRD',label:'(a+b)² − c',difficulty:'Hard',operationDepth:2,operandCount:3,semanticAuthorityCandidateId:'MIS-CAND-077',createsNewSemanticAuthority:true},
]);
export function misCp011RuleByCandidateId(id:string):MisCp011RuleDefinition{const r=MIS_CP011_RULES.find(x=>x.candidateId===id);if(!r)throw new Error('Unknown MIS-CP-011 candidate: '+id);return r;}
