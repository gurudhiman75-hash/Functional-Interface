export type MisCp018CandidateId='MIS-CAND-092'|'MIS-CAND-093'|'MIS-CAND-094'|'MIS-CAND-095';
export type MisCp018RuleId=
  |'DECREMENT_BOTH_PRODUCT'
  |'FIRST_DIVIDE_CONSTANT_PLUS_SECOND'
  |'CONTINUE_EQUAL_DIFFERENCE'
  |'FIRST_PLUS_WEIGHTED_SECOND_PLUS_CONSTANT';

export interface MisCp018RuleContext{readonly divisor?:2;readonly weight?:4;readonly k?:1;}
export interface MisCp018RuleDefinition{
 readonly candidateId:MisCp018CandidateId;
 readonly ruleId:MisCp018RuleId;
 readonly label:string;
 readonly difficulty:'Medium'|'Hard';
 readonly operationDepth:2|3;
 readonly operandCount:2;
 readonly contexts:readonly MisCp018RuleContext[];
 readonly sourceBacked:true;
 readonly sourceThin?:boolean;
 readonly sourceNote:string;
}

export const MIS_CP018_RULES:readonly MisCp018RuleDefinition[]=Object.freeze([
 {
  candidateId:'MIS-CAND-092',ruleId:'DECREMENT_BOTH_PRODUCT',
  label:'subtract 1 from each visible number, then multiply',
  difficulty:'Medium',operationDepth:2,operandCount:2,contexts:Object.freeze([Object.freeze({})]),
  sourceBacked:true,
  sourceNote:'SSC CHSL 2021, held 1 Jun 2022 Shift 1: (9−1)(7−1)=48; (12−1)(5−1)=44; (8−1)(13−1)=84.'
 },
 {
  candidateId:'MIS-CAND-093',ruleId:'FIRST_DIVIDE_CONSTANT_PLUS_SECOND',
  label:'divide the first number by 2, then add the second',
  difficulty:'Medium',operationDepth:2,operandCount:2,contexts:Object.freeze([Object.freeze({divisor:2 as const})]),
  sourceBacked:true,
  sourceNote:'SSC CHSL 2021, held 8 Jun 2022 Shift 1: 124÷2+38=100; 78÷2+25=64; 94÷2+31=78.'
 },
 {
  candidateId:'MIS-CAND-094',ruleId:'CONTINUE_EQUAL_DIFFERENCE',
  label:'continue the same arithmetic difference to obtain the third value',
  difficulty:'Medium',operationDepth:2,operandCount:2,contexts:Object.freeze([Object.freeze({})]),
  sourceBacked:true,
  sourceNote:'SSC CHSL 2021, held 31 May 2022 Shift 2: 187,164,141; 215,192,169; 178,155,132.'
 },
 {
  candidateId:'MIS-CAND-095',ruleId:'FIRST_PLUS_WEIGHTED_SECOND_PLUS_CONSTANT',
  label:'first + 4×second + 1',
  difficulty:'Hard',operationDepth:3,operandCount:2,
  contexts:Object.freeze([Object.freeze({weight:4 as const,k:1 as const})]),
  sourceBacked:true,sourceThin:true,
  sourceNote:'SSC CHSL 2021, held 1 Jun 2022 Shift 2: 14,4→31; 38,10→79; 30,8→63.'
 }
]);

export function misCp018RuleByCandidateId(id:string):MisCp018RuleDefinition{
 const r=MIS_CP018_RULES.find(x=>x.candidateId===id);if(!r)throw new Error('Unknown MIS-CP-018 candidate: '+id);return r;
}
