export type MisCp013CandidateId='MIS-CAND-084'|'MIS-CAND-085';
export type MisCp013RuleId='PAIR_PRODUCT_DIVIDE_CONSTANT'|'PAIR_SUM_MINUS_TWICE_ABS_DIFFERENCE';

export interface MisCp013RuleContext { readonly k?: number; }
export interface MisCp013RuleDefinition {
  readonly candidateId:MisCp013CandidateId;
  readonly ruleId:MisCp013RuleId;
  readonly label:string;
  readonly baselineDifficulty:'Medium';
  readonly operationDepth:2;
  readonly operandCount:2;
  readonly contexts:readonly MisCp013RuleContext[];
  readonly sourceBacked:true;
  readonly sourceNote:string;
}

export const MIS_CP013_RULES:readonly MisCp013RuleDefinition[]=Object.freeze([
  {
    candidateId:'MIS-CAND-084',
    ruleId:'PAIR_PRODUCT_DIVIDE_CONSTANT',
    label:'multiply the two numbers, then divide by the same evidenced constant',
    baselineDifficulty:'Medium',
    operationDepth:2,
    operandCount:2,
    contexts:Object.freeze([Object.freeze({k:2})]),
    sourceBacked:true,
    sourceNote:'SSC CGL 2016 previous-paper form 15 (105) 14, 13 (?) 12 supports k=2.'
  },
  {
    candidateId:'MIS-CAND-085',
    ruleId:'PAIR_SUM_MINUS_TWICE_ABS_DIFFERENCE',
    label:'add the pair, then subtract twice their positive difference',
    baselineDifficulty:'Medium',
    operationDepth:2,
    operandCount:2,
    contexts:Object.freeze([Object.freeze({})]),
    sourceBacked:true,
    sourceNote:'SSC CGL 2016 previous-paper repeated-row form supports a+b−2|a−b|.'
  },
]);

export function misCp013RuleByCandidateId(id:string):MisCp013RuleDefinition{
  const r=MIS_CP013_RULES.find(x=>x.candidateId===id);
  if(!r)throw new Error('Unknown MIS-CP-013 candidate: '+id);
  return r;
}
