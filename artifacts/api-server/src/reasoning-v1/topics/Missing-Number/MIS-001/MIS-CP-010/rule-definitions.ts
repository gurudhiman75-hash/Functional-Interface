export type MisCp010CandidateId =
  | 'MIS-CAND-069'|'MIS-CAND-070'|'MIS-CAND-071'
  | 'MIS-CAND-072'|'MIS-CAND-073'|'MIS-CAND-074';

export type MisCp010RuleId =
  | 'DIGIT_SUM'
  | 'DIGIT_PRODUCT'
  | 'DIGIT_DIFFERENCE'
  | 'NUMBER_PLUS_REVERSE'
  | 'DIGIT_SUM_PLUS_VISIBLE'
  | 'SQUARE_OF_DIGIT_SUM';

export interface MisCp010RuleDefinition {
  readonly candidateId:MisCp010CandidateId;
  readonly ruleId:MisCp010RuleId;
  readonly label:string;
  readonly operandCount:1|2;
  readonly difficulty:'Medium'|'Hard';
  readonly operationDepth:1|2;
  readonly wholeNumberOrDigitMode:'DIGIT';
}

export const MIS_CP010_RULES:readonly MisCp010RuleDefinition[]=Object.freeze([
  {candidateId:'MIS-CAND-069',ruleId:'DIGIT_SUM',label:'sum of digits',operandCount:1,difficulty:'Medium',operationDepth:1,wholeNumberOrDigitMode:'DIGIT'},
  {candidateId:'MIS-CAND-070',ruleId:'DIGIT_PRODUCT',label:'product of digits',operandCount:1,difficulty:'Medium',operationDepth:1,wholeNumberOrDigitMode:'DIGIT'},
  {candidateId:'MIS-CAND-071',ruleId:'DIGIT_DIFFERENCE',label:'absolute difference of digits',operandCount:1,difficulty:'Medium',operationDepth:1,wholeNumberOrDigitMode:'DIGIT'},
  {candidateId:'MIS-CAND-072',ruleId:'NUMBER_PLUS_REVERSE',label:'number + reversed number',operandCount:1,difficulty:'Hard',operationDepth:2,wholeNumberOrDigitMode:'DIGIT'},
  {candidateId:'MIS-CAND-073',ruleId:'DIGIT_SUM_PLUS_VISIBLE',label:'digit sum + another visible value',operandCount:2,difficulty:'Hard',operationDepth:2,wholeNumberOrDigitMode:'DIGIT'},
  {candidateId:'MIS-CAND-074',ruleId:'SQUARE_OF_DIGIT_SUM',label:'square of digit sum',operandCount:1,difficulty:'Hard',operationDepth:2,wholeNumberOrDigitMode:'DIGIT'},
]);

export function misCp010RuleByCandidateId(id:string):MisCp010RuleDefinition{
  const r=MIS_CP010_RULES.find(x=>x.candidateId===id);if(!r)throw new Error('Unknown MIS-CP-010 candidate: '+id);return r;
}
