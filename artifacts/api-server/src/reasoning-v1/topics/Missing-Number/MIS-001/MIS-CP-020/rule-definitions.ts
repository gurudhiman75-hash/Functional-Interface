export type MisCp020CandidateId='MIS-CAND-101'|'MIS-CAND-102'|'MIS-CAND-103';
export type MisCp020RuleId='SQUARE_ROOT_OF_PRODUCT'|'SQUARE_ROOT_DIFFERENCE'|'CUBE_ROOT_SUM';

export interface MisCp020RuleDefinition{
 readonly candidateId:MisCp020CandidateId;
 readonly ruleId:MisCp020RuleId;
 readonly label:string;
 readonly difficulty:'Medium';
 readonly operationDepth:2;
 readonly operandCount:2;
 readonly sourceBacked:true;
 readonly sourceNote:string;
}

export const MIS_CP020_RULES:readonly MisCp020RuleDefinition[]=Object.freeze([
 {
  candidateId:'MIS-CAND-101',ruleId:'SQUARE_ROOT_OF_PRODUCT',
  label:'take the square root of the product of the two displayed numbers',
  difficulty:'Medium',operationDepth:2,operandCount:2,sourceBacked:true,
  sourceNote:'SSC CHSL 7 Jan 2017 Evening Shift: √(25×144)=60; √(81×225)=135; √(49×289)=119.'
 },
 {
  candidateId:'MIS-CAND-102',ruleId:'SQUARE_ROOT_DIFFERENCE',
  label:'subtract the square root of the second displayed perfect square from the square root of the first',
  difficulty:'Medium',operationDepth:2,operandCount:2,sourceBacked:true,
  sourceNote:'SSC CHSL 25 Jan 2017 Evening Shift: √9−√4=1; √36−√25=1; √144−√81=3.'
 },
 {
  candidateId:'MIS-CAND-103',ruleId:'CUBE_ROOT_SUM',
  label:'add the cube roots of the two displayed perfect cubes',
  difficulty:'Medium',operationDepth:2,operandCount:2,sourceBacked:true,
  sourceNote:'SSC GD 9 Mar 2019 Shift 2: ∛27+∛64=7; ∛343+∛729=16.'
 }
]);

export function misCp020RuleByCandidateId(id:string):MisCp020RuleDefinition{
 const r=MIS_CP020_RULES.find(x=>x.candidateId===id);if(!r)throw new Error('Unknown MIS-CP-020 candidate: '+id);return r;
}
