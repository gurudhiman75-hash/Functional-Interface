import{MIS_CP013_RULES,misCp013RuleByCandidateId,type MisCp013CandidateId,type MisCp013RuleContext,type MisCp013RuleId}from'./rule-definitions';
import{independentlyEvaluateMisCp013Rule,type MisCp013Group}from'./independent-solver';

export interface MisCp013Option{readonly value:number;readonly errorLabel:string|null;}
export interface MisCp013AmbiguityAudit{readonly accepted:boolean;readonly survivingRules:readonly string[];readonly reason:string;}
export interface GeneratedMisCp013Question{
  readonly packageId:'MIS-001';readonly checkpointId:'MIS-CP-013';readonly candidateId:MisCp013CandidateId;readonly provisionalQl:true;
  readonly ruleId:MisCp013RuleId;readonly ruleFamily:string;readonly context:MisCp013RuleContext;readonly difficulty:'Medium';readonly renderer:'TABLE_GROUP';
  readonly stem:string;readonly evidenceGroups:readonly MisCp013Group[];readonly target:MisCp013Group;readonly options:readonly MisCp013Option[];
  readonly correctIndex:number;readonly answer:number;readonly explanation:string;readonly solverTrace:readonly string[];
  readonly ambiguityAudit:MisCp013AmbiguityAudit;readonly structuralFingerprint:string;readonly numericFingerprint:string;
  readonly operationDepth:2;readonly operandCount:2;readonly groupCount:3;readonly missingPosition:'RESULT';readonly forwardOrInverse:'FORWARD';
  readonly sourceBacked:true;readonly sourceNote:string;readonly semanticAuthorityCandidateId:MisCp013CandidateId;readonly createsNewSemanticAuthority:true;
}
function hash(v:string){let h=2166136261;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed:string){let s=hash(seed)||1;return()=>{s+=0x6d2b79f5;let v=s;v=Math.imul(v^(v>>>15),v|1);v^=v+Math.imul(v^(v>>>7),v|61);return((v^(v>>>14))>>>0)/4294967296;};}
function shuffle<T>(a:readonly T[],seed:string){const o=[...a],r=rng(seed);for(let i=o.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[o[i],o[j]]=[o[j]!,o[i]!];}return o;}
function nearby(rule:string,a:number,b:number,context:MisCp013RuleContext):number|null{
  switch(rule){
    case'SUM':return a+b;
    case'PRODUCT':return a*b;
    case'ABS_DIFFERENCE':return Math.abs(a-b);
    case'PAIR_PRODUCT_DIVIDE_CONSTANT':return independentlyEvaluateMisCp013Rule('PAIR_PRODUCT_DIVIDE_CONSTANT',a,b,context);
    case'PAIR_SUM_MINUS_TWICE_ABS_DIFFERENCE':return independentlyEvaluateMisCp013Rule('PAIR_SUM_MINUS_TWICE_ABS_DIFFERENCE',a,b,context);
    default:return null;
  }
}
const GRAMMAR=['SUM','PRODUCT','ABS_DIFFERENCE','PAIR_PRODUCT_DIVIDE_CONSTANT','PAIR_SUM_MINUS_TWICE_ABS_DIFFERENCE'] as const;
function ambiguity(intended:MisCp013RuleId,evidence:readonly MisCp013Group[],context:MisCp013RuleContext):MisCp013AmbiguityAudit{
  const survivors=GRAMMAR.filter(r=>evidence.every(g=>nearby(r,g.a,g.b,context)===g.result));
  return survivors.length===1&&survivors[0]===intended
    ?{accepted:true,survivingRules:survivors,reason:'Exactly one nearby semantic rule survives all evidence groups.'}
    :{accepted:false,survivingRules:survivors,reason:'Competing nearby rules survive: '+survivors.join(', ')};
}
function groups(ruleId:MisCp013RuleId,context:MisCp013RuleContext):MisCp013Group[]{
  const out:MisCp013Group[]=[];
  for(let a=4;a<=30;a++)for(let b=3;b<=30;b++){
    if(a===b)continue;
    const result=independentlyEvaluateMisCp013Rule(ruleId,a,b,context);
    if(result&&result!==a&&result!==b)out.push({a,b,result});
  }
  return out;
}
function distractors(ruleId:MisCp013RuleId,g:MisCp013Group,context:MisCp013RuleContext):MisCp013Option[]{
  const out:MisCp013Option[]=[];const add=(v:number|null,l:string)=>{if(v!=null&&Number.isInteger(v)&&v>0&&v<=999&&v!==g.result&&!out.some(x=>x.value===v))out.push({value:v,errorLabel:l});};
  add(g.a+g.b,'ADD_INSTEAD');
  add(g.a*g.b,'DIVISOR_OMITTED_OR_PRODUCT_USED');
  add(Math.abs(g.a-g.b),'DIFFERENCE_ONLY');
  add(g.a+g.b-Math.abs(g.a-g.b),'SUBTRACTED_DIFFERENCE_ONCE');
  add(g.a+g.b+2*Math.abs(g.a-g.b),'DIFFERENCE_SIGN_REVERSED');
  if(ruleId==='PAIR_PRODUCT_DIVIDE_CONSTANT'){
    const k=context.k??2;
    add((g.a*g.b)/(k+1),'WRONG_DIVISOR');
  }else{
    add(g.a+g.b-3*Math.abs(g.a-g.b),'DIFFERENCE_MULTIPLIER_TOO_LARGE');
  }
  return out;
}
function select(ruleId:MisCp013RuleId,context:MisCp013RuleContext,seed:string){
  const gs=shuffle(groups(ruleId,context),seed+':g');
  for(let i=0;i<Math.min(gs.length,80);i++)for(let j=i+1;j<Math.min(gs.length,220);j++){
    const e1=gs[i]!,e2=gs[j]!;if(e1.result===e2.result)continue;
    const evidence=[e1,e2],audit=ambiguity(ruleId,evidence,context);if(!audit.accepted)continue;
    const target=gs.find((g,k)=>k!==i&&k!==j&&g.result!==e1.result&&g.result!==e2.result&&distractors(ruleId,g,context).length>=3);
    if(target)return{evidence,target,audit};
  }
  throw new Error('Unable to construct CP013 '+ruleId);
}
function words(id:MisCp013RuleId,context:MisCp013RuleContext){
  if(id==='PAIR_PRODUCT_DIVIDE_CONSTANT')return`Multiply the two numbers and divide by ${context.k}.`;
  return'Add the two numbers, then subtract twice their positive difference.';
}
function calc(id:MisCp013RuleId,g:MisCp013Group,context:MisCp013RuleContext){
  if(id==='PAIR_PRODUCT_DIVIDE_CONSTANT'){const k=context.k!;return`${g.a} × ${g.b} = ${g.a*g.b}; ${g.a*g.b} ÷ ${k} = ${g.result}`;}
  const d=Math.abs(g.a-g.b);return`${g.a} + ${g.b} = ${g.a+g.b}; |${g.a} − ${g.b}| = ${d}; ${g.a+g.b} − 2×${d} = ${g.result}`;
}
function row(g:MisCp013Group,hide=false){return`${g.a}   ${hide?'?':g.result}   ${g.b}`;}
export function generateMisCp013Question(candidateId:MisCp013CandidateId,seed:string|number='mis-cp013-v1'):GeneratedMisCp013Question{
  const rule=misCp013RuleByCandidateId(candidateId),context=rule.contexts[hash(String(seed)+candidateId)%rule.contexts.length]!,base=String(seed),sel=select(rule.ruleId,context,base);
  const wrong=shuffle(distractors(rule.ruleId,sel.target,context),base+':o').slice(0,3);if(wrong.length!==3)throw new Error('CP013 distractor shortage');
  const ci=hash(base+candidateId)%4,options=[...wrong];options.splice(ci,0,{value:sel.target.result,errorLabel:null});
  const stem=['Find the number that will replace the question mark (?).','',...sel.evidence.map(g=>row(g)),row(sel.target,true)].join('\n');
  const explanation=['The same rule is used in every group.',words(rule.ruleId,context),'','Group 1:',calc(rule.ruleId,sel.evidence[0]!,context),'','Group 2:',calc(rule.ruleId,sel.evidence[1]!,context),'','Now apply the same rule:',calc(rule.ruleId,sel.target,context),'',`So, ? = ${sel.target.result}.`].join('\n');
  return{packageId:'MIS-001',checkpointId:'MIS-CP-013',candidateId,provisionalQl:true,ruleId:rule.ruleId,ruleFamily:rule.label,context,difficulty:'Medium',renderer:'TABLE_GROUP',stem,evidenceGroups:sel.evidence,target:sel.target,options,correctIndex:ci,answer:sel.target.result,explanation,solverTrace:[...sel.evidence.map(g=>calc(rule.ruleId,g,context)),calc(rule.ruleId,sel.target,context)],ambiguityAudit:sel.audit,structuralFingerprint:['MIS-CP-013',rule.ruleId,context.k??'_','SOURCE_BACKED'].join('|'),numericFingerprint:[...sel.evidence,sel.target].map(g=>`${g.a},${g.b}:${g.result}`).join('|'),operationDepth:2,operandCount:2,groupCount:3,missingPosition:'RESULT',forwardOrInverse:'FORWARD',sourceBacked:true,sourceNote:rule.sourceNote,semanticAuthorityCandidateId:candidateId,createsNewSemanticAuthority:true};
}
export const MIS_CP013_CANDIDATE_IDS=Object.freeze(MIS_CP013_RULES.map(r=>r.candidateId));
