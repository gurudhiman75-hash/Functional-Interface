export type MisCp007CandidateId =
  | 'MIS-CAND-050' | 'MIS-CAND-051' | 'MIS-CAND-052' | 'MIS-CAND-053'
  | 'MIS-CAND-054' | 'MIS-CAND-055' | 'MIS-CAND-056';

export type MisCp007RuleId =
  | 'SUM_FOUR_CORNERS'
  | 'ROW_PRODUCTS_SUM'
  | 'COLUMN_PRODUCTS_SUM'
  | 'ROW_PRODUCTS_DIFFERENCE'
  | 'TOP_SUM_TIMES_BOTTOM_DIFFERENCE'
  | 'DIAGONAL_PRODUCTS_SUM'
  | 'DIAGONAL_PRODUCTS_DIFFERENCE';

export interface MisCp007RuleDefinition {
  readonly candidateId:MisCp007CandidateId;readonly ruleId:MisCp007RuleId;readonly label:string;
  readonly difficulty:'Easy'|'Medium';readonly operationDepth:1|2;
}
export const MIS_CP007_RULES:readonly MisCp007RuleDefinition[]=Object.freeze([
  {candidateId:'MIS-CAND-050',ruleId:'SUM_FOUR_CORNERS',label:'centre = sum of all four corners',difficulty:'Easy',operationDepth:1},
  {candidateId:'MIS-CAND-051',ruleId:'ROW_PRODUCTS_SUM',label:'centre = top-row product + bottom-row product',difficulty:'Medium',operationDepth:2},
  {candidateId:'MIS-CAND-052',ruleId:'COLUMN_PRODUCTS_SUM',label:'centre = left-column product + right-column product',difficulty:'Medium',operationDepth:2},
  {candidateId:'MIS-CAND-053',ruleId:'ROW_PRODUCTS_DIFFERENCE',label:'centre = absolute difference of row products',difficulty:'Medium',operationDepth:2},
  {candidateId:'MIS-CAND-054',ruleId:'TOP_SUM_TIMES_BOTTOM_DIFFERENCE',label:'centre = (top-left + top-right) × (bottom-left − bottom-right)',difficulty:'Medium',operationDepth:2},
  {candidateId:'MIS-CAND-055',ruleId:'DIAGONAL_PRODUCTS_SUM',label:'centre = sum of diagonal products',difficulty:'Medium',operationDepth:2},
  {candidateId:'MIS-CAND-056',ruleId:'DIAGONAL_PRODUCTS_DIFFERENCE',label:'centre = absolute difference of diagonal products',difficulty:'Medium',operationDepth:2},
]);
export function misCp007RuleByCandidateId(id:string):MisCp007RuleDefinition{
  const r=MIS_CP007_RULES.find(x=>x.candidateId===id);if(!r)throw new Error('Unknown MIS-CP-007 candidate: '+id);return r;
}
