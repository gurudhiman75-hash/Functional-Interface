export type MisCp009CandidateId =
  | 'MIS-CAND-063'|'MIS-CAND-064'|'MIS-CAND-065'
  | 'MIS-CAND-066'|'MIS-CAND-067'|'MIS-CAND-068';

export type MisCp009RuleId =
  | 'ROW_PRODUCTS_SUM'|'ROW_PRODUCTS_SUBTRACT'
  | 'COLUMN_PRODUCTS_SUM'|'DIAGONAL_PRODUCTS_SUM'
  | 'ROW_SUMS_PRODUCT'|'TOP_DIFFERENCE_BOTTOM_SUM_PRODUCT';

export interface MisCp009RuleDefinition {
  readonly candidateId:MisCp009CandidateId;
  readonly ruleId:MisCp009RuleId;
  readonly label:string;
  readonly pairingAuthority:'ROWS'|'COLUMNS'|'DIAGONALS'|'GROUPED_ROWS';
  readonly difficulty:'Medium'|'Hard';
  readonly operationDepth:2;
  readonly semanticAuthorityCandidateId:string;
  readonly createsNewSemanticAuthority:boolean;
}

export const MIS_CP009_RULES:readonly MisCp009RuleDefinition[]=Object.freeze([
  {candidateId:'MIS-CAND-063',ruleId:'ROW_PRODUCTS_SUM',label:'ab + cd',pairingAuthority:'ROWS',difficulty:'Medium',operationDepth:2,semanticAuthorityCandidateId:'MIS-CAND-051',createsNewSemanticAuthority:false},
  {candidateId:'MIS-CAND-064',ruleId:'ROW_PRODUCTS_SUBTRACT',label:'ab − cd',pairingAuthority:'ROWS',difficulty:'Hard',operationDepth:2,semanticAuthorityCandidateId:'MIS-CAND-064',createsNewSemanticAuthority:true},
  {candidateId:'MIS-CAND-065',ruleId:'COLUMN_PRODUCTS_SUM',label:'ac + bd',pairingAuthority:'COLUMNS',difficulty:'Medium',operationDepth:2,semanticAuthorityCandidateId:'MIS-CAND-052',createsNewSemanticAuthority:false},
  {candidateId:'MIS-CAND-066',ruleId:'DIAGONAL_PRODUCTS_SUM',label:'ad + bc',pairingAuthority:'DIAGONALS',difficulty:'Medium',operationDepth:2,semanticAuthorityCandidateId:'MIS-CAND-055',createsNewSemanticAuthority:false},
  {candidateId:'MIS-CAND-067',ruleId:'ROW_SUMS_PRODUCT',label:'(a+b)(c+d)',pairingAuthority:'GROUPED_ROWS',difficulty:'Hard',operationDepth:2,semanticAuthorityCandidateId:'MIS-CAND-067',createsNewSemanticAuthority:true},
  {candidateId:'MIS-CAND-068',ruleId:'TOP_DIFFERENCE_BOTTOM_SUM_PRODUCT',label:'(a−b)(c+d)',pairingAuthority:'GROUPED_ROWS',difficulty:'Hard',operationDepth:2,semanticAuthorityCandidateId:'MIS-CAND-068',createsNewSemanticAuthority:true},
]);
export function misCp009RuleByCandidateId(id:string):MisCp009RuleDefinition{
  const r=MIS_CP009_RULES.find(x=>x.candidateId===id);if(!r)throw new Error('Unknown MIS-CP-009 candidate: '+id);return r;
}
