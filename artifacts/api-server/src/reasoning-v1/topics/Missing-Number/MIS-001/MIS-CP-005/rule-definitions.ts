export type MisCp005CandidateId =
  | 'MIS-CAND-035' | 'MIS-CAND-036' | 'MIS-CAND-037' | 'MIS-CAND-038'
  | 'MIS-CAND-039' | 'MIS-CAND-040' | 'MIS-CAND-041' | 'MIS-CAND-042';

export type MisCp005RuleId =
  | 'TOP_LEFT_PRODUCT_PLUS_RIGHT'
  | 'TOP_LEFT_PRODUCT_MINUS_RIGHT'
  | 'LEFT_RIGHT_PRODUCT_PLUS_TOP'
  | 'LEFT_RIGHT_PRODUCT_MINUS_TOP'
  | 'SUM_THREE_VERTICES'
  | 'TOP_LEFT_SUM_TIMES_RIGHT'
  | 'LEFT_RIGHT_SUM_TIMES_TOP'
  | 'LEFT_RIGHT_SQUARES_SUM';

export interface MisCp005RuleDefinition {
  readonly candidateId: MisCp005CandidateId;
  readonly ruleId: MisCp005RuleId;
  readonly label: string;
  readonly difficulty: 'Easy' | 'Medium';
  readonly operationDepth: 1 | 2;
}

export const MIS_CP005_RULES: readonly MisCp005RuleDefinition[] = Object.freeze([
  { candidateId:'MIS-CAND-035', ruleId:'TOP_LEFT_PRODUCT_PLUS_RIGHT', label:'top × left + right', difficulty:'Medium', operationDepth:2 },
  { candidateId:'MIS-CAND-036', ruleId:'TOP_LEFT_PRODUCT_MINUS_RIGHT', label:'top × left − right', difficulty:'Medium', operationDepth:2 },
  { candidateId:'MIS-CAND-037', ruleId:'LEFT_RIGHT_PRODUCT_PLUS_TOP', label:'left × right + top', difficulty:'Medium', operationDepth:2 },
  { candidateId:'MIS-CAND-038', ruleId:'LEFT_RIGHT_PRODUCT_MINUS_TOP', label:'left × right − top', difficulty:'Medium', operationDepth:2 },
  { candidateId:'MIS-CAND-039', ruleId:'SUM_THREE_VERTICES', label:'top + left + right', difficulty:'Easy', operationDepth:1 },
  { candidateId:'MIS-CAND-040', ruleId:'TOP_LEFT_SUM_TIMES_RIGHT', label:'(top + left) × right', difficulty:'Medium', operationDepth:2 },
  { candidateId:'MIS-CAND-041', ruleId:'LEFT_RIGHT_SUM_TIMES_TOP', label:'(left + right) × top', difficulty:'Medium', operationDepth:2 },
  { candidateId:'MIS-CAND-042', ruleId:'LEFT_RIGHT_SQUARES_SUM', label:'left² + right²', difficulty:'Medium', operationDepth:2 },
]);

export function misCp005RuleByCandidateId(id:string): MisCp005RuleDefinition {
  const rule=MIS_CP005_RULES.find(r=>r.candidateId===id);
  if(!rule) throw new Error('Unknown MIS-CP-005 candidate: '+id);
  return rule;
}
