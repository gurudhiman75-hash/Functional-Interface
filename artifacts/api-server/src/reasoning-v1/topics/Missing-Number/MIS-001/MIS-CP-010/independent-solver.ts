import {MIS_CP010_RULES,type MisCp010RuleId} from './rule-definitions';
export interface MisCp010Group{readonly number:number;readonly visible:number|null;readonly result:number;}
export interface MisCp010RuleMatch{readonly ruleId:MisCp010RuleId;readonly semanticKey:string;}
export interface MisCp010AmbiguityAudit{readonly accepted:boolean;readonly intendedSemanticKey:string;readonly matches:readonly MisCp010RuleMatch[];readonly reason:string;}
export function digits(n:number):readonly [number,number]{return [Math.floor(n/10),n%10];}
export function reverseTwoDigit(n:number):number|null{const[t,u]=digits(n);if(u===0)return null;return u*10+t;}
function bounded(v:number|null):number|null{return v!=null&&Number.isInteger(v)&&v>0&&v<=999?v:null;}
export function independentlyEvaluateMisCp010Rule(ruleId:MisCp010RuleId,n:number,visible:number|null):number|null{
  if(n<11||n>99||n%10===0)return null;const[t,u]=digits(n),sum=t+u;
  switch(ruleId){
    case'DIGIT_SUM':return bounded(sum);
    case'DIGIT_PRODUCT':return bounded(t*u);
    case'DIGIT_DIFFERENCE':return bounded(Math.abs(t-u));
    case'NUMBER_PLUS_REVERSE':{const rev=reverseTwoDigit(n);return rev==null?null:bounded(n+rev);}
    case'DIGIT_SUM_PLUS_VISIBLE':return visible==null?null:bounded(sum+visible);
    case'SQUARE_OF_DIGIT_SUM':return bounded(sum*sum);
  }
}
export function independentlyVerifyMisCp010Group(ruleId:MisCp010RuleId,g:MisCp010Group):boolean{
  return independentlyEvaluateMisCp010Rule(ruleId,g.number,g.visible)===g.result;
}
export function matchingMisCp010Rules(evidence:readonly MisCp010Group[]):readonly MisCp010RuleMatch[]{
  const binary=evidence.every(g=>g.visible!=null);
  return MIS_CP010_RULES.filter(r=>(r.operandCount===2)===binary&&evidence.every(g=>independentlyVerifyMisCp010Group(r.ruleId,g))).map(r=>({ruleId:r.ruleId,semanticKey:r.ruleId}));
}
export function auditMisCp010Ambiguity(ruleId:MisCp010RuleId,evidence:readonly MisCp010Group[]):MisCp010AmbiguityAudit{
  const matches=matchingMisCp010Rules(evidence),keys=[...new Set(matches.map(m=>m.semanticKey))];
  if(!keys.includes(ruleId))return{accepted:false,intendedSemanticKey:ruleId,matches,reason:'Intended digit rule does not fit every evidence group.'};
  if(keys.length!==1)return{accepted:false,intendedSemanticKey:ruleId,matches,reason:'Competing digit rules survive: '+keys.join(', ')};
  return{accepted:true,intendedSemanticKey:ruleId,matches,reason:'Exactly one explicit digit-mode rule survives.'};
}
