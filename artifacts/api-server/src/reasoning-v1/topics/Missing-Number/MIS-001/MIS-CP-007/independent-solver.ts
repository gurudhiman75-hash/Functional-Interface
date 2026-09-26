import {MIS_CP007_RULES,type MisCp007RuleId} from './rule-definitions';
export interface MisCp007Group{readonly topLeft:number;readonly topRight:number;readonly bottomLeft:number;readonly bottomRight:number;readonly centre:number;}
export interface MisCp007RuleMatch{readonly ruleId:MisCp007RuleId;readonly semanticKey:string;}
export interface MisCp007AmbiguityAudit{readonly accepted:boolean;readonly intendedSemanticKey:string;readonly matches:readonly MisCp007RuleMatch[];readonly reason:string;}
function bounded(v:number):number|null{return Number.isInteger(v)&&v>0&&v<=999?v:null;}
export function independentlyEvaluateMisCp007Rule(ruleId:MisCp007RuleId,g:Omit<MisCp007Group,'centre'>):number|null{
  const {topLeft:a,topRight:b,bottomLeft:c,bottomRight:d}=g;
  switch(ruleId){
    case 'SUM_FOUR_CORNERS':return bounded(a+b+c+d);
    case 'ROW_PRODUCTS_SUM':return bounded(a*b+c*d);
    case 'COLUMN_PRODUCTS_SUM':return bounded(a*c+b*d);
    case 'ROW_PRODUCTS_DIFFERENCE':return bounded(Math.abs(a*b-c*d));
    case 'TOP_SUM_TIMES_BOTTOM_DIFFERENCE':return c>d?bounded((a+b)*(c-d)):null;
    case 'DIAGONAL_PRODUCTS_SUM':return bounded(a*d+b*c);
    case 'DIAGONAL_PRODUCTS_DIFFERENCE':return bounded(Math.abs(a*d-b*c));
  }
}
export function independentlyVerifyMisCp007Group(ruleId:MisCp007RuleId,g:MisCp007Group):boolean{
  return independentlyEvaluateMisCp007Rule(ruleId,{topLeft:g.topLeft,topRight:g.topRight,bottomLeft:g.bottomLeft,bottomRight:g.bottomRight})===g.centre;
}
export function matchingMisCp007Rules(evidence:readonly MisCp007Group[]):readonly MisCp007RuleMatch[]{
  return MIS_CP007_RULES.filter(r=>evidence.every(g=>independentlyVerifyMisCp007Group(r.ruleId,g))).map(r=>({ruleId:r.ruleId,semanticKey:r.ruleId}));
}
export function auditMisCp007Ambiguity(ruleId:MisCp007RuleId,evidence:readonly MisCp007Group[]):MisCp007AmbiguityAudit{
  const matches=matchingMisCp007Rules(evidence),keys=[...new Set(matches.map(m=>m.semanticKey))];
  if(!keys.includes(ruleId))return{accepted:false,intendedSemanticKey:ruleId,matches,reason:'Intended box rule does not fit all evidence.'};
  if(keys.length!==1)return{accepted:false,intendedSemanticKey:ruleId,matches,reason:'Competing box rules survive: '+keys.join(', ')};
  return{accepted:true,intendedSemanticKey:ruleId,matches,reason:'Exactly one box/corner-centre semantic rule survives.'};
}
