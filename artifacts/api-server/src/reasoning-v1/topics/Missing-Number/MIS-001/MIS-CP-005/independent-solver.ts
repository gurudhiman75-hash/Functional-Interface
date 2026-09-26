import { MIS_CP005_RULES, type MisCp005RuleId } from './rule-definitions';

export interface MisCp005Group { readonly top:number; readonly left:number; readonly right:number; readonly centre:number; }
export interface MisCp005RuleMatch { readonly ruleId:MisCp005RuleId; readonly semanticKey:string; }
export interface MisCp005AmbiguityAudit { readonly accepted:boolean; readonly intendedSemanticKey:string; readonly matches:readonly MisCp005RuleMatch[]; readonly reason:string; }

function bounded(v:number):number|null { return Number.isInteger(v)&&v>0&&v<=999?v:null; }

export function independentlyEvaluateMisCp005Rule(ruleId:MisCp005RuleId, top:number,left:number,right:number):number|null {
  switch(ruleId){
    case 'TOP_LEFT_PRODUCT_PLUS_RIGHT': return bounded(top*left+right);
    case 'TOP_LEFT_PRODUCT_MINUS_RIGHT': return bounded(top*left-right);
    case 'LEFT_RIGHT_PRODUCT_PLUS_TOP': return bounded(left*right+top);
    case 'LEFT_RIGHT_PRODUCT_MINUS_TOP': return bounded(left*right-top);
    case 'SUM_THREE_VERTICES': return bounded(top+left+right);
    case 'TOP_LEFT_SUM_TIMES_RIGHT': return bounded((top+left)*right);
    case 'LEFT_RIGHT_SUM_TIMES_TOP': return bounded((left+right)*top);
    case 'LEFT_RIGHT_SQUARES_SUM': return bounded(left*left+right*right);
  }
}
export function independentlyVerifyMisCp005Group(ruleId:MisCp005RuleId,g:MisCp005Group):boolean {
  return independentlyEvaluateMisCp005Rule(ruleId,g.top,g.left,g.right)===g.centre;
}
export function matchingMisCp005Rules(evidence:readonly MisCp005Group[]):readonly MisCp005RuleMatch[]{
  return MIS_CP005_RULES.filter(r=>evidence.every(g=>independentlyVerifyMisCp005Group(r.ruleId,g)))
    .map(r=>({ruleId:r.ruleId,semanticKey:r.ruleId}));
}
export function auditMisCp005Ambiguity(ruleId:MisCp005RuleId,evidence:readonly MisCp005Group[]):MisCp005AmbiguityAudit{
  const matches=matchingMisCp005Rules(evidence); const keys=[...new Set(matches.map(m=>m.semanticKey))];
  if(!keys.includes(ruleId)) return {accepted:false,intendedSemanticKey:ruleId,matches,reason:'Intended triangle rule does not fit all evidence.'};
  if(keys.length!==1) return {accepted:false,intendedSemanticKey:ruleId,matches,reason:'Competing triangle rules survive: '+keys.join(', ')};
  return {accepted:true,intendedSemanticKey:ruleId,matches,reason:'Exactly one triangle semantic rule survives.'};
}
