import {MIS_CP006_RULES,type MisCp006RuleId} from './rule-definitions';
export interface MisCp006Group {readonly top:number;readonly right:number;readonly bottom:number;readonly left:number|null;readonly centre:number;}
export interface MisCp006RuleMatch {readonly ruleId:MisCp006RuleId;readonly semanticKey:string;}
export interface MisCp006AmbiguityAudit {readonly accepted:boolean;readonly intendedSemanticKey:string;readonly matches:readonly MisCp006RuleMatch[];readonly reason:string;}
function bounded(v:number):number|null{return Number.isInteger(v)&&v>0&&v<=999?v:null;}
export function independentlyEvaluateMisCp006Rule(ruleId:MisCp006RuleId,g:Omit<MisCp006Group,'centre'>):number|null{
  const {top:t,right:r,bottom:b,left:l}=g;
  switch(ruleId){
    case 'SUM_THREE_SURROUNDING': return l==null?bounded(t+r+b):null;
    case 'TOP_RIGHT_PRODUCT_MINUS_BOTTOM': return l==null?bounded(t*r-b):null;
    case 'SUM_FOUR_SURROUNDING': return l==null?null:bounded(t+r+b+l);
    case 'OPPOSITE_SUM_DIFFERENCE': return l==null?null:bounded(Math.abs((t+b)-(l+r)));
    case 'OPPOSITE_PRODUCT_DIFFERENCE': return l==null?null:bounded(Math.abs(t*b-l*r));
    case 'OPPOSITE_PRODUCT_SUM': return l==null?null:bounded(t*b+l*r);
    case 'OPPOSITE_SUM_PRODUCT': return l==null?null:bounded((t+b)*(l+r));
  }
}
export function independentlyVerifyMisCp006Group(ruleId:MisCp006RuleId,g:MisCp006Group):boolean{
  return independentlyEvaluateMisCp006Rule(ruleId,{top:g.top,right:g.right,bottom:g.bottom,left:g.left})===g.centre;
}
export function matchingMisCp006Rules(evidence:readonly MisCp006Group[]):readonly MisCp006RuleMatch[]{
  const four=evidence.every(g=>g.left!=null);
  return MIS_CP006_RULES.filter(r=>(r.surroundingCount===4)===four&&evidence.every(g=>independentlyVerifyMisCp006Group(r.ruleId,g)))
    .map(r=>({ruleId:r.ruleId,semanticKey:r.ruleId}));
}
export function auditMisCp006Ambiguity(ruleId:MisCp006RuleId,evidence:readonly MisCp006Group[]):MisCp006AmbiguityAudit{
  const matches=matchingMisCp006Rules(evidence),keys=[...new Set(matches.map(m=>m.semanticKey))];
  if(!keys.includes(ruleId))return{accepted:false,intendedSemanticKey:ruleId,matches,reason:'Intended wheel rule does not fit all evidence.'};
  if(keys.length!==1)return{accepted:false,intendedSemanticKey:ruleId,matches,reason:'Competing wheel rules survive: '+keys.join(', ')};
  return{accepted:true,intendedSemanticKey:ruleId,matches,reason:'Exactly one circle/wheel semantic rule survives.'};
}
