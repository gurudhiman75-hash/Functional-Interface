export type MisCp023CandidateId='MIS-CAND-107';
export type MisCp023RuleId='ROOT_SUM_TIMES_THIRD_PLUS_TWO';

export interface MisCp023RuleDefinition{
 readonly candidateId:MisCp023CandidateId;
 readonly ruleId:MisCp023RuleId;
 readonly label:string;
 readonly difficulty:'Hard';
 readonly operationDepth:4;
 readonly operandCount:3;
 readonly sourceBacked:true;
 readonly sourceNote:string;
}

export const MIS_CP023_RULES:readonly MisCp023RuleDefinition[]=Object.freeze([
 {
  candidateId:'MIS-CAND-107',
  ruleId:'ROOT_SUM_TIMES_THIRD_PLUS_TWO',
  label:'add the exact square roots of the first two numbers, multiply by the third, then add 2',
  difficulty:'Hard',operationDepth:4,operandCount:3,sourceBacked:true,
  sourceNote:'PSPCL LDC 23 Dec 2019 Shift 2: (√25+√9)×12+2=98; (√36+√16)×15+2=152; (√49+√25)×18+2=218.'
 }
]);

export function misCp023RuleByCandidateId(id:string):MisCp023RuleDefinition{
 const r=MIS_CP023_RULES.find(x=>x.candidateId===id);if(!r)throw new Error('Unknown MIS-CP-023 candidate: '+id);return r;
}
