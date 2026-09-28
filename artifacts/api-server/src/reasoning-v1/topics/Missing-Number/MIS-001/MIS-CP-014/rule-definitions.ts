export type MisCp014CandidateId='MIS-CAND-086';
export interface MisCp014RuleDefinition{
  readonly candidateId:MisCp014CandidateId;
  readonly ruleId:'INVARIANT_FOUR_CORNER_SUM_MISSING_CORNER';
  readonly label:string;
  readonly difficulty:'Medium';
  readonly semanticAuthorityCandidateId:'MIS-CAND-050';
  readonly createsNewSemanticAuthority:false;
  readonly sourceBacked:true;
  readonly sourceNote:string;
}
export const MIS_CP014_RULES:readonly MisCp014RuleDefinition[]=Object.freeze([{
  candidateId:'MIS-CAND-086',
  ruleId:'INVARIANT_FOUR_CORNER_SUM_MISSING_CORNER',
  label:'same four-corner total across repeated squares; one corner is missing',
  difficulty:'Medium',
  semanticAuthorityCandidateId:'MIS-CAND-050',
  createsNewSemanticAuthority:false,
  sourceBacked:true,
  sourceNote:'PSPCL LDC 4 Jan 2020 Shift 2: each square sums to 40; one corner is missing.'
}]);
export function misCp014RuleByCandidateId(id:string):MisCp014RuleDefinition{
  const r=MIS_CP014_RULES.find(x=>x.candidateId===id);if(!r)throw new Error('Unknown MIS-CP-014 candidate: '+id);return r;
}
