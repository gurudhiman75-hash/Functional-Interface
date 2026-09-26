import {MIS_CP009_RULES,type MisCp009RuleId} from './rule-definitions';
export interface MisCp009Group{readonly a:number;readonly b:number;readonly c:number;readonly d:number;readonly result:number;}
export interface MisCp009RuleMatch{readonly ruleId:MisCp009RuleId;readonly semanticKey:string;}
export interface MisCp009AmbiguityAudit{readonly accepted:boolean;readonly intendedSemanticKey:string;readonly matches:readonly MisCp009RuleMatch[];readonly reason:string;}
function bounded(v:number):number|null{return Number.isInteger(v)&&v>0&&v<=999?v:null;}
export function independentlyEvaluateMisCp009Rule(ruleId:MisCp009RuleId,a:number,b:number,c:number,d:number):number|null{
  switch(ruleId){
    case 'ROW_PRODUCTS_SUM':return bounded(a*b+c*d);
    case 'ROW_PRODUCTS_SUBTRACT':return a*b>c*d?bounded(a*b-c*d):null;
    case 'COLUMN_PRODUCTS_SUM':return bounded(a*c+b*d);
    case 'DIAGONAL_PRODUCTS_SUM':return bounded(a*d+b*c);
    case 'ROW_SUMS_PRODUCT':return bounded((a+b)*(c+d));
    case 'TOP_DIFFERENCE_BOTTOM_SUM_PRODUCT':return a>b?bounded((a-b)*(c+d)):null;
  }
}
export function independentlyVerifyMisCp009Group(ruleId:MisCp009RuleId,g:MisCp009Group):boolean{
  return independentlyEvaluateMisCp009Rule(ruleId,g.a,g.b,g.c,g.d)===g.result;
}
export function matchingMisCp009Rules(evidence:readonly MisCp009Group[]):readonly MisCp009RuleMatch[]{
  return MIS_CP009_RULES.filter(r=>evidence.every(g=>independentlyVerifyMisCp009Group(r.ruleId,g))).map(r=>({ruleId:r.ruleId,semanticKey:r.ruleId}));
}
export function auditMisCp009Ambiguity(ruleId:MisCp009RuleId,evidence:readonly MisCp009Group[]):MisCp009AmbiguityAudit{
  const matches=matchingMisCp009Rules(evidence),keys=[...new Set(matches.map(m=>m.semanticKey))];
  if(!keys.includes(ruleId))return{accepted:false,intendedSemanticKey:ruleId,matches,reason:'Intended pair/cross rule does not fit every evidence group.'};
  if(keys.length!==1)return{accepted:false,intendedSemanticKey:ruleId,matches,reason:'Competing pair/cross rules survive: '+keys.join(', ')};
  return{accepted:true,intendedSemanticKey:ruleId,matches,reason:'Exactly one authoritative pairing survives.'};
}
