export type MisCp008CandidateId =
  | 'MIS-CAND-057' | 'MIS-CAND-058' | 'MIS-CAND-059'
  | 'MIS-CAND-060' | 'MIS-CAND-061' | 'MIS-CAND-062';

export type MisCp008RuleId =
  | 'INVERSE_SUM'
  | 'INVERSE_PRODUCT'
  | 'INVERSE_PRODUCT_MINUS_SECOND'
  | 'INVERSE_SQUARE_PLUS_SECOND'
  | 'INVERSE_SUM_TIMES_THIRD'
  | 'INVERSE_TRIANGLE_PRODUCT_MINUS_TOP';

export type MisCp008MissingPosition =
  | 'FIRST_INPUT' | 'SECOND_INPUT' | 'THIRD_INPUT' | 'RESULT'
  | 'TOP_VERTEX' | 'LEFT_VERTEX' | 'RIGHT_VERTEX' | 'CENTRE';

export interface MisCp008RuleDefinition {
  readonly candidateId: MisCp008CandidateId;
  readonly ruleId: MisCp008RuleId;
  readonly label: string;
  readonly arity: 2 | 3;
  readonly renderer: 'TABLE_GROUP' | 'SVG_TRIANGLE';
  readonly operationDepth: 1 | 2;
  readonly difficulty: 'Medium' | 'Hard';
  readonly supportedMissingPositions: readonly MisCp008MissingPosition[];
  readonly minInput: number;
  readonly maxInput: number;
  readonly semanticAuthorityCandidateId: string;
  readonly createsNewSemanticAuthority: boolean;
}

export const MIS_CP008_RULES: readonly MisCp008RuleDefinition[] = Object.freeze([
  { candidateId:'MIS-CAND-057', ruleId:'INVERSE_SUM', label:'inverse a + b = result', arity:2, renderer:'TABLE_GROUP', operationDepth:1, difficulty:'Medium', supportedMissingPositions:['FIRST_INPUT','SECOND_INPUT','RESULT'], minInput:2, maxInput:30, semanticAuthorityCandidateId:'MIS-CAND-001', createsNewSemanticAuthority:false },
  { candidateId:'MIS-CAND-058', ruleId:'INVERSE_PRODUCT', label:'inverse a × b = result', arity:2, renderer:'TABLE_GROUP', operationDepth:1, difficulty:'Medium', supportedMissingPositions:['FIRST_INPUT','SECOND_INPUT','RESULT'], minInput:2, maxInput:18, semanticAuthorityCandidateId:'MIS-CAND-003', createsNewSemanticAuthority:false },
  { candidateId:'MIS-CAND-059', ruleId:'INVERSE_PRODUCT_MINUS_SECOND', label:'inverse a × b − b = result', arity:2, renderer:'TABLE_GROUP', operationDepth:2, difficulty:'Hard', supportedMissingPositions:['FIRST_INPUT','SECOND_INPUT','RESULT'], minInput:3, maxInput:18, semanticAuthorityCandidateId:'MIS-CAND-059', createsNewSemanticAuthority:true },
  { candidateId:'MIS-CAND-060', ruleId:'INVERSE_SQUARE_PLUS_SECOND', label:'inverse a² + b = result', arity:2, renderer:'TABLE_GROUP', operationDepth:2, difficulty:'Hard', supportedMissingPositions:['FIRST_INPUT','SECOND_INPUT','RESULT'], minInput:2, maxInput:15, semanticAuthorityCandidateId:'MIS-CAND-017', createsNewSemanticAuthority:false },
  { candidateId:'MIS-CAND-061', ruleId:'INVERSE_SUM_TIMES_THIRD', label:'inverse (a + b) × c = result', arity:3, renderer:'TABLE_GROUP', operationDepth:2, difficulty:'Hard', supportedMissingPositions:['FIRST_INPUT','SECOND_INPUT','THIRD_INPUT','RESULT'], minInput:2, maxInput:12, semanticAuthorityCandidateId:'MIS-CAND-012', createsNewSemanticAuthority:false },
  { candidateId:'MIS-CAND-062', ruleId:'INVERSE_TRIANGLE_PRODUCT_MINUS_TOP', label:'inverse triangle: left × right − top = centre', arity:3, renderer:'SVG_TRIANGLE', operationDepth:2, difficulty:'Hard', supportedMissingPositions:['TOP_VERTEX','LEFT_VERTEX','RIGHT_VERTEX','CENTRE'], minInput:2, maxInput:14, semanticAuthorityCandidateId:'MIS-CAND-038', createsNewSemanticAuthority:false },
]);

export function misCp008RuleByCandidateId(id:string): MisCp008RuleDefinition {
  const rule=MIS_CP008_RULES.find(r=>r.candidateId===id);
  if(!rule) throw new Error('Unknown MIS-CP-008 candidate: '+id);
  return rule;
}
