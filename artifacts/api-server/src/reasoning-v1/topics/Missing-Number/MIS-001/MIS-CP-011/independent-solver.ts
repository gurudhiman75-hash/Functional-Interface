import{MIS_CP011_RULES,type MisCp011RuleId}from'./rule-definitions';
export interface MisCp011Group{readonly a:number;readonly b:number;readonly c:number;readonly result:number;}
export interface MisCp011RuleMatch{readonly ruleId:MisCp011RuleId;readonly semanticKey:string;}
export interface MisCp011AmbiguityAudit{readonly accepted:boolean;readonly intendedSemanticKey:string;readonly matches:readonly MisCp011RuleMatch[];readonly reason:string;}
function bounded(v:number){return Number.isInteger(v)&&v>0&&v<=999?v:null;}
export function independentlyEvaluateMisCp011Rule(id:MisCp011RuleId,a:number,b:number,c:number):number|null{
 switch(id){
  case'PAIR_PRODUCT_MINUS_THIRD_SQUARE':return bounded(a*b-c*c);
  case'FIRST_SQUARE_PLUS_PAIR_PRODUCT':return bounded(a*a+b*c);
  case'PAIR_SUM_SQUARE_MINUS_THIRD':return bounded((a+b)*(a+b)-c);
  case'PAIR_PRODUCT_PLUS_ABS_DIFFERENCE':return bounded(a*b+Math.abs(a-b));
 }
}
export function independentlyVerifyMisCp011Group(id:MisCp011RuleId,g:MisCp011Group){return independentlyEvaluateMisCp011Rule(id,g.a,g.b,g.c)===g.result;}
export function matchingMisCp011Rules(evidence:readonly MisCp011Group[]):readonly MisCp011RuleMatch[]{return MIS_CP011_RULES.filter(r=>evidence.every(g=>independentlyVerifyMisCp011Group(r.ruleId,g))).map(r=>({ruleId:r.ruleId,semanticKey:r.ruleId}));}
export function auditMisCp011Ambiguity(id:MisCp011RuleId,evidence:readonly MisCp011Group[]):MisCp011AmbiguityAudit{const m=matchingMisCp011Rules(evidence),k=[...new Set(m.map(x=>x.semanticKey))];if(!k.includes(id))return{accepted:false,intendedSemanticKey:id,matches:m,reason:'Intended compound rule does not fit every evidence group.'};if(k.length!==1)return{accepted:false,intendedSemanticKey:id,matches:m,reason:'Competing compound rules survive: '+k.join(', ')};return{accepted:true,intendedSemanticKey:id,matches:m,reason:'Exactly one compound rule survives.'};}
