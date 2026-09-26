export type MisCp006CandidateId =
  | 'MIS-CAND-043' | 'MIS-CAND-044' | 'MIS-CAND-045' | 'MIS-CAND-046'
  | 'MIS-CAND-047' | 'MIS-CAND-048' | 'MIS-CAND-049';

export type MisCp006RuleId =
  | 'SUM_THREE_SURROUNDING'
  | 'SUM_FOUR_SURROUNDING'
  | 'TOP_RIGHT_PRODUCT_MINUS_BOTTOM'
  | 'OPPOSITE_SUM_DIFFERENCE'
  | 'OPPOSITE_PRODUCT_DIFFERENCE'
  | 'OPPOSITE_PRODUCT_SUM'
  | 'OPPOSITE_SUM_PRODUCT';

export interface MisCp006RuleDefinition {
  readonly candidateId:MisCp006CandidateId; readonly ruleId:MisCp006RuleId; readonly label:string;
  readonly difficulty:'Easy'|'Medium'; readonly operationDepth:1|2; readonly surroundingCount:3|4;
}
export const MIS_CP006_RULES:readonly MisCp006RuleDefinition[]=Object.freeze([
  {candidateId:'MIS-CAND-043',ruleId:'SUM_THREE_SURROUNDING',label:'centre = sum of three surrounding values',difficulty:'Easy',operationDepth:1,surroundingCount:3},
  {candidateId:'MIS-CAND-044',ruleId:'SUM_FOUR_SURROUNDING',label:'centre = sum of four surrounding values',difficulty:'Easy',operationDepth:1,surroundingCount:4},
  {candidateId:'MIS-CAND-045',ruleId:'TOP_RIGHT_PRODUCT_MINUS_BOTTOM',label:'centre = top × right − bottom',difficulty:'Medium',operationDepth:2,surroundingCount:3},
  {candidateId:'MIS-CAND-046',ruleId:'OPPOSITE_SUM_DIFFERENCE',label:'centre = absolute difference of opposite-pair sums',difficulty:'Medium',operationDepth:2,surroundingCount:4},
  {candidateId:'MIS-CAND-047',ruleId:'OPPOSITE_PRODUCT_DIFFERENCE',label:'centre = absolute difference of opposite-pair products',difficulty:'Medium',operationDepth:2,surroundingCount:4},
  {candidateId:'MIS-CAND-048',ruleId:'OPPOSITE_PRODUCT_SUM',label:'centre = sum of opposite-pair products',difficulty:'Medium',operationDepth:2,surroundingCount:4},
  {candidateId:'MIS-CAND-049',ruleId:'OPPOSITE_SUM_PRODUCT',label:'centre = product of opposite-pair sums',difficulty:'Medium',operationDepth:2,surroundingCount:4},
]);
export function misCp006RuleByCandidateId(id:string):MisCp006RuleDefinition{
  const r=MIS_CP006_RULES.find(x=>x.candidateId===id); if(!r)throw new Error('Unknown MIS-CP-006 candidate: '+id); return r;
}
