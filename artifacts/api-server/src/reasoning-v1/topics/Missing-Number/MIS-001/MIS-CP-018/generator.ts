import{MIS_CP018_RULES,misCp018RuleByCandidateId,type MisCp018CandidateId,type MisCp018RuleContext,type MisCp018RuleId}from'./rule-definitions';
import{independentlyEvaluateMisCp018Rule,type MisCp018Group}from'./independent-solver';

export interface MisCp018Option{readonly value:number;readonly errorLabel:string|null;}
export interface GeneratedMisCp018Question{
 readonly packageId:'MIS-001';readonly checkpointId:'MIS-CP-018';readonly candidateId:MisCp018CandidateId;readonly provisionalQl:true;
 readonly ruleId:MisCp018RuleId;readonly ruleFamily:string;readonly context:MisCp018RuleContext;readonly difficulty:'Medium'|'Hard';
 readonly renderer:'TABLE_GROUP';readonly stem:string;readonly evidenceGroups:readonly MisCp018Group[];readonly target:MisCp018Group;
 readonly options:readonly MisCp018Option[];readonly correctIndex:number;readonly answer:number;readonly explanation:string;readonly solverTrace:readonly string[];
 readonly ambiguityAudit:{readonly accepted:boolean;readonly survivingRules:readonly string[];readonly reason:string};
 readonly structuralFingerprint:string;readonly numericFingerprint:string;readonly operationDepth:2|3;readonly operandCount:2;readonly groupCount:3;
 readonly missingPosition:'RESULT';readonly forwardOrInverse:'FORWARD';readonly sourceBacked:true;readonly sourceThin:boolean;readonly sourceNote:string;
 readonly semanticAuthorityCandidateId:MisCp018CandidateId;readonly createsNewSemanticAuthority:true;readonly wholeNumberOrDigitMode:'WHOLE_NUMBER';
}
function hash(v:string){let h=2166136261;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed:string){let s=hash(seed)||1;return()=>{s+=0x6d2b79f5;let v=s;v=Math.imul(v^(v>>>15),v|1);v^=v+Math.imul(v^(v>>>7),v|61);return((v^(v>>>14))>>>0)/4294967296;};}
function shuffle<T>(a:readonly T[],seed:string){const o=[...a],r=rng(seed);for(let i=o.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[o[i],o[j]]=[o[j]!,o[i]!];}return o;}

type Nearby=MisCp018RuleId|'SUM'|'PRODUCT'|'ABS_DIFFERENCE'|'PRODUCT_PLUS_FIRST';
function evaluateNearby(id:Nearby,a:number,b:number,context:MisCp018RuleContext):number|null{
 if(id==='SUM')return a+b;
 if(id==='PRODUCT')return a*b;
 if(id==='ABS_DIFFERENCE')return Math.abs(a-b);
 if(id==='PRODUCT_PLUS_FIRST')return a*b+a;
 return independentlyEvaluateMisCp018Rule(id,a,b,context);
}
const NEARBY:readonly Nearby[]=['DECREMENT_BOTH_PRODUCT','FIRST_DIVIDE_CONSTANT_PLUS_SECOND','CONTINUE_EQUAL_DIFFERENCE','FIRST_PLUS_WEIGHTED_SECOND_PLUS_CONSTANT','SUM','PRODUCT','ABS_DIFFERENCE','PRODUCT_PLUS_FIRST'];
function audit(id:MisCp018RuleId,evidence:readonly MisCp018Group[],context:MisCp018RuleContext){
 const survivors=NEARBY.filter(r=>evidence.every(g=>evaluateNearby(r,g.first,g.second,context)===g.result));
 return survivors.length===1&&survivors[0]===id
 ?{accepted:true,survivingRules:survivors,reason:'Exactly one nearby whole-number rule survives all evidence rows.'}
 :{accepted:false,survivingRules:survivors,reason:'Competing nearby rules survive: '+survivors.join(', ')};
}
function groups(id:MisCp018RuleId,context:MisCp018RuleContext):MisCp018Group[]{
 const out:MisCp018Group[]=[];
 if(id==='DECREMENT_BOTH_PRODUCT'){
  for(let a=4;a<=18;a++)for(let b=4;b<=18;b++){if(a===b)continue;const result=independentlyEvaluateMisCp018Rule(id,a,b,context);if(result&&result<=300)out.push({first:a,second:b,result});}
 }else if(id==='FIRST_DIVIDE_CONSTANT_PLUS_SECOND'){
  for(let a=30;a<=160;a+=2)for(let b=10;b<=55;b++){const result=independentlyEvaluateMisCp018Rule(id,a,b,context);if(result&&result!==a&&result!==b)out.push({first:a,second:b,result});}
 }else if(id==='CONTINUE_EQUAL_DIFFERENCE'){
  for(let a=40;a<=220;a++)for(let gap=5;gap<=30;gap++){const b=a-gap,result=independentlyEvaluateMisCp018Rule(id,a,b,context);if(result&&result>5)out.push({first:a,second:b,result});}
 }else{
  for(let a=10;a<=55;a++)for(let b=2;b<=16;b++){const result=independentlyEvaluateMisCp018Rule(id,a,b,context);if(result&&result<=250)out.push({first:a,second:b,result});}
 }
 return out;
}
function distractors(id:MisCp018RuleId,g:MisCp018Group,context:MisCp018RuleContext):MisCp018Option[]{
 const out:MisCp018Option[]=[];const add=(v:number|null,l:string)=>{if(v!=null&&Number.isInteger(v)&&v>0&&v<=999&&v!==g.result&&!out.some(x=>x.value===v))out.push({value:v,errorLabel:l});};
 add(g.first+g.second,'ADDED_VISIBLE_VALUES');add(g.first*g.second,'MULTIPLIED_VISIBLE_VALUES');add(Math.abs(g.first-g.second),'USED_DIFFERENCE_ONLY');
 add(evaluateNearby('PRODUCT_PLUS_FIRST',g.first,g.second,context),'USED_PRODUCT_PLUS_FIRST');
 if(id==='DECREMENT_BOTH_PRODUCT'){add((g.first-1)*g.second,'DECREMENTED_ONLY_FIRST');add(g.first*(g.second-1),'DECREMENTED_ONLY_SECOND');add((g.first+1)*(g.second+1),'INCREMENTED_BOTH');}
 if(id==='FIRST_DIVIDE_CONSTANT_PLUS_SECOND'){add(g.first+g.second/2,'HALVED_WRONG_INPUT');add(g.first/2,'SECOND_TERM_OMITTED');add(g.first/2-g.second,'WRONG_FINAL_OPERATION');}
 if(id==='CONTINUE_EQUAL_DIFFERENCE'){add(g.second-(g.first-g.second)*2,'DOUBLED_DIFFERENCE');add(g.second+(g.first-g.second),'REVERSED_DIRECTION');add((g.first+g.second)/2,'USED_AVERAGE');}
 if(id==='FIRST_PLUS_WEIGHTED_SECOND_PLUS_CONSTANT'){add(g.first+4*g.second,'FINAL_CONSTANT_OMITTED');add(g.first+3*g.second+1,'WRONG_WEIGHT');add((g.first+1)+4*(g.second+1),'INCREMENTED_BOTH_INPUTS');}
 return out;
}
function select(id:MisCp018RuleId,context:MisCp018RuleContext,seed:string){
 const gs=shuffle(groups(id,context),seed+':groups');
 for(let i=0;i<Math.min(gs.length,80);i++)for(let j=i+1;j<Math.min(gs.length,240);j++){
  const evidence=[gs[i]!,gs[j]!];if(evidence[0]!.result===evidence[1]!.result)continue;const ambiguity=audit(id,evidence,context);if(!ambiguity.accepted)continue;
  const target=gs.find((g,k)=>k!==i&&k!==j&&g.result!==evidence[0]!.result&&g.result!==evidence[1]!.result&&distractors(id,g,context).length>=3);
  if(target)return{evidence,target,ambiguity};
 }
 throw new Error('Unable to construct CP018 '+id);
}
function calc(id:MisCp018RuleId,g:MisCp018Group,context:MisCp018RuleContext):string{
 const a=g.first,b=g.second,r=g.result;
 if(id==='DECREMENT_BOTH_PRODUCT')return`(${a} − 1) × (${b} − 1) = ${a-1} × ${b-1} = ${r}`;
 if(id==='FIRST_DIVIDE_CONSTANT_PLUS_SECOND')return`${a} ÷ 2 = ${a/2}; ${a/2} + ${b} = ${r}`;
 if(id==='CONTINUE_EQUAL_DIFFERENCE'){const d=a-b;return`${a} − ${b} = ${d}; ${b} − ${d} = ${r}`;}
 return`${context.weight} × ${b} = ${4*b}; ${a} + ${4*b} + ${context.k} = ${r}`;
}
function ruleWords(id:MisCp018RuleId):string{
 if(id==='DECREMENT_BOTH_PRODUCT')return'Subtract 1 from each of the first two numbers, then multiply the results.';
 if(id==='FIRST_DIVIDE_CONSTANT_PLUS_SECOND')return'Divide the first number by 2, then add the second number.';
 if(id==='CONTINUE_EQUAL_DIFFERENCE')return'The three numbers form an arithmetic progression: subtract the same difference again.';
 return'Multiply the second number by 4, then add the first number and 1.';
}
function row(g:MisCp018Group,hide=false){return`${g.first}   ${g.second}   ${hide?'?':g.result}`;}
export function generateMisCp018Question(candidateId:MisCp018CandidateId,seed:string|number='mis-cp018-v1'):GeneratedMisCp018Question{
 const rule=misCp018RuleByCandidateId(candidateId),context=rule.contexts[0]!,base=String(seed),sel=select(rule.ruleId,context,base),wrong=shuffle(distractors(rule.ruleId,sel.target,context),base+':opts').slice(0,3);
 if(wrong.length!==3)throw new Error('CP018 distractor shortage');
 const ci=hash(base+candidateId)%4,options=[...wrong];options.splice(ci,0,{value:sel.target.result,errorLabel:null});
 const stem=['Find the number that will replace the question mark (?).','',...sel.evidence.map(g=>row(g)),row(sel.target,true)].join('\n');
 const explanation=['The same rule is used in every row.',ruleWords(rule.ruleId),'','Row 1:',calc(rule.ruleId,sel.evidence[0]!,context),'','Row 2:',calc(rule.ruleId,sel.evidence[1]!,context),'','Now apply the same rule:',calc(rule.ruleId,sel.target,context),'',`So, ? = ${sel.target.result}.`].join('\n');
 return{packageId:'MIS-001',checkpointId:'MIS-CP-018',candidateId,provisionalQl:true,ruleId:rule.ruleId,ruleFamily:rule.label,context,difficulty:rule.difficulty,renderer:'TABLE_GROUP',stem,evidenceGroups:sel.evidence,target:sel.target,options,correctIndex:ci,answer:sel.target.result,explanation,solverTrace:[...sel.evidence.map(g=>calc(rule.ruleId,g,context)),calc(rule.ruleId,sel.target,context)],ambiguityAudit:sel.ambiguity,structuralFingerprint:['MIS-CP-018',rule.ruleId,context.divisor?('D='+context.divisor):'',context.weight?('W='+context.weight):'',context.k!=null?('K='+context.k):'','SOURCE_BACKED'].filter(Boolean).join('|'),numericFingerprint:[...sel.evidence,sel.target].map(g=>`${g.first},${g.second}:${g.result}`).join('|'),operationDepth:rule.operationDepth,operandCount:2,groupCount:3,missingPosition:'RESULT',forwardOrInverse:'FORWARD',sourceBacked:true,sourceThin:rule.sourceThin===true,sourceNote:rule.sourceNote,semanticAuthorityCandidateId:candidateId,createsNewSemanticAuthority:true,wholeNumberOrDigitMode:'WHOLE_NUMBER'};
}
export const MIS_CP018_CANDIDATE_IDS=Object.freeze(MIS_CP018_RULES.map(r=>r.candidateId));
