import{MIS_CP020_RULES,misCp020RuleByCandidateId,type MisCp020CandidateId,type MisCp020RuleId}from'./rule-definitions';
import{independentlyEvaluateMisCp020Rule,type MisCp020Group}from'./independent-solver';

export interface MisCp020Option{readonly value:number;readonly errorLabel:string|null;}
export interface GeneratedMisCp020Question{
 readonly packageId:'MIS-001';readonly checkpointId:'MIS-CP-020';readonly candidateId:MisCp020CandidateId;readonly provisionalQl:true;
 readonly ruleId:MisCp020RuleId;readonly ruleFamily:string;readonly context:null;readonly difficulty:'Medium';readonly renderer:'TABLE_GROUP';
 readonly stem:string;readonly evidenceGroups:readonly MisCp020Group[];readonly target:MisCp020Group;readonly options:readonly MisCp020Option[];
 readonly correctIndex:number;readonly answer:number;readonly explanation:string;readonly solverTrace:readonly string[];
 readonly ambiguityAudit:{readonly accepted:boolean;readonly survivingRules:readonly string[];readonly reason:string};
 readonly structuralFingerprint:string;readonly numericFingerprint:string;readonly operationDepth:2;readonly operandCount:2;readonly groupCount:3;
 readonly missingPosition:'RESULT';readonly forwardOrInverse:'FORWARD';readonly sourceBacked:true;readonly sourceNote:string;
 readonly semanticAuthorityCandidateId:MisCp020CandidateId;readonly createsNewSemanticAuthority:true;readonly wholeNumberOrDigitMode:'WHOLE_NUMBER';
}
function hash(v:string){let h=2166136261;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed:string){let s=hash(seed)||1;return()=>{s+=0x6d2b79f5;let v=s;v=Math.imul(v^(v>>>15),v|1);v^=v+Math.imul(v^(v>>>7),v|61);return((v^(v>>>14))>>>0)/4294967296;};}
function shuffle<T>(a:readonly T[],seed:string){const o=[...a],r=rng(seed);for(let i=o.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[o[i],o[j]]=[o[j]!,o[i]!];}return o;}

type Nearby=MisCp020RuleId|'SUM'|'PRODUCT'|'ABS_DIFFERENCE'|'SUM_SQUARE_ROOTS'|'CUBE_ROOT_DIFFERENCE';
const NEARBY:readonly Nearby[]=['SQUARE_ROOT_OF_PRODUCT','SQUARE_ROOT_DIFFERENCE','CUBE_ROOT_SUM','SUM','PRODUCT','ABS_DIFFERENCE','SUM_SQUARE_ROOTS','CUBE_ROOT_DIFFERENCE'];

function sqrtInt(n:number):number|null{const r=Math.sqrt(n);return Number.isInteger(r)?r:null;}
function cbrtInt(n:number):number|null{const r=Math.round(Math.cbrt(n));return r*r*r===n?r:null;}
function evalNearby(id:Nearby,a:number,b:number):number|null{
 if(id==='SUM')return a+b;
 if(id==='PRODUCT')return a*b;
 if(id==='ABS_DIFFERENCE')return Math.abs(a-b);
 if(id==='SUM_SQUARE_ROOTS'){const x=sqrtInt(a),y=sqrtInt(b);return x!=null&&y!=null?x+y:null;}
 if(id==='CUBE_ROOT_DIFFERENCE'){const x=cbrtInt(a),y=cbrtInt(b);return x!=null&&y!=null&&x>y?x-y:null;}
 return independentlyEvaluateMisCp020Rule(id,a,b);
}
function audit(id:MisCp020RuleId,evidence:readonly MisCp020Group[]){
 const survivors=NEARBY.filter(r=>evidence.every(g=>evalNearby(r,g.first,g.second)===g.result));
 return survivors.length===1&&survivors[0]===id
  ?{accepted:true,survivingRules:survivors,reason:'Exactly one nearby root/arithmetic rule survives all evidence rows.'}
  :{accepted:false,survivingRules:survivors,reason:'Competing nearby rules survive: '+survivors.join(', ')};
}
function groups(id:MisCp020RuleId):MisCp020Group[]{
 const out:MisCp020Group[]=[];
 if(id==='SQUARE_ROOT_OF_PRODUCT'){
  for(let x=3;x<=25;x++)for(let y=4;y<=25;y++){if(x===y)continue;const first=x*x,second=y*y,result=independentlyEvaluateMisCp020Rule(id,first,second);if(result&&result<=300)out.push({first,second,result});}
 }else if(id==='SQUARE_ROOT_DIFFERENCE'){
  for(let x=5;x<=30;x++)for(let y=2;y<x;y++){const first=x*x,second=y*y,result=independentlyEvaluateMisCp020Rule(id,first,second);if(result&&result<=50)out.push({first,second,result});}
 }else{
  for(let x=2;x<=12;x++)for(let y=2;y<=12;y++){if(x===y)continue;const first=x*x*x,second=y*y*y,result=independentlyEvaluateMisCp020Rule(id,first,second);if(result&&result<=30)out.push({first,second,result});}
 }
 return out;
}
function distractors(id:MisCp020RuleId,g:MisCp020Group):MisCp020Option[]{
 const out:MisCp020Option[]=[];const add=(v:number|null,l:string)=>{if(v!=null&&Number.isInteger(v)&&v>0&&v<=999&&v!==g.result&&!out.some(x=>x.value===v))out.push({value:v,errorLabel:l});};
 const a=g.first,b=g.second;
 add(a+b,'ADDED_VISIBLE_VALUES');add(Math.abs(a-b),'USED_VISIBLE_DIFFERENCE');
 if(id==='SQUARE_ROOT_OF_PRODUCT'){
  const x=sqrtInt(a)!,y=sqrtInt(b)!;
  add(x+y,'ADDED_ROOTS');add(Math.abs(x-y),'SUBTRACTED_ROOTS');add(x*y+1,'ROOT_PRODUCT_OFF_BY_ONE');
 }else if(id==='SQUARE_ROOT_DIFFERENCE'){
  const x=sqrtInt(a)!,y=sqrtInt(b)!;
  add(x+y,'ADDED_ROOTS');add(x-y+1,'ROOT_DIFFERENCE_OFF_BY_ONE');add(Math.abs(a-b),'SUBTRACTED_SQUARES');
 }else{
  const x=cbrtInt(a)!,y=cbrtInt(b)!;
  add(Math.abs(x-y),'SUBTRACTED_CUBE_ROOTS');add(x*y,'MULTIPLIED_CUBE_ROOTS');add(x+y+1,'CUBE_ROOT_SUM_OFF_BY_ONE');
 }
 return out;
}
function select(id:MisCp020RuleId,seed:string){
 const gs=shuffle(groups(id),seed+':groups');
 for(let i=0;i<Math.min(gs.length,90);i++)for(let j=i+1;j<Math.min(gs.length,250);j++){
  const evidence=[gs[i]!,gs[j]!];if(evidence[0]!.result===evidence[1]!.result)continue;const ambiguity=audit(id,evidence);if(!ambiguity.accepted)continue;
  const target=gs.find((g,k)=>k!==i&&k!==j&&g.result!==evidence[0]!.result&&g.result!==evidence[1]!.result&&distractors(id,g).length>=3);
  if(target)return{evidence,target,ambiguity};
 }
 throw new Error('Unable to construct CP020 '+id);
}
function words(id:MisCp020RuleId):string{
 if(id==='SQUARE_ROOT_OF_PRODUCT')return'Multiply the two displayed numbers and take the exact square root of the product.';
 if(id==='SQUARE_ROOT_DIFFERENCE')return'Take the exact square root of each displayed number and subtract the second root from the first.';
 return'Take the exact cube root of each displayed number and add the two roots.';
}
function calc(id:MisCp020RuleId,g:MisCp020Group):string{
 const a=g.first,b=g.second;
 if(id==='SQUARE_ROOT_OF_PRODUCT')return`${a}×${b}=${a*b}; √${a*b}=${g.result}`;
 if(id==='SQUARE_ROOT_DIFFERENCE')return`√${a}=${sqrtInt(a)}; √${b}=${sqrtInt(b)}; ${sqrtInt(a)}−${sqrtInt(b)}=${g.result}`;
 return`∛${a}=${cbrtInt(a)}; ∛${b}=${cbrtInt(b)}; ${cbrtInt(a)}+${cbrtInt(b)}=${g.result}`;
}
function row(g:MisCp020Group,hide=false){return`${g.first}   ${g.second}   ${hide?'?':g.result}`;}
export function generateMisCp020Question(candidateId:MisCp020CandidateId,seed:string|number='mis-cp020-v1'):GeneratedMisCp020Question{
 const rule=misCp020RuleByCandidateId(candidateId),base=String(seed),sel=select(rule.ruleId,base),wrong=shuffle(distractors(rule.ruleId,sel.target),base+':opts').slice(0,3);
 if(wrong.length!==3)throw new Error('CP020 distractor shortage');
 const ci=hash(base+candidateId)%4,options=[...wrong];options.splice(ci,0,{value:sel.target.result,errorLabel:null});
 const stem=['Study the pattern and find the number that will replace the question mark (?).','',...sel.evidence.map(g=>row(g)),row(sel.target,true)].join('\n');
 const explanation=['The same rule is used in every row.',words(rule.ruleId),'','Row 1:',calc(rule.ruleId,sel.evidence[0]!),'','Row 2:',calc(rule.ruleId,sel.evidence[1]!),'','Now apply the same rule:',calc(rule.ruleId,sel.target),'',`So, ? = ${sel.target.result}.`].join('\n');
 return{packageId:'MIS-001',checkpointId:'MIS-CP-020',candidateId,provisionalQl:true,ruleId:rule.ruleId,ruleFamily:rule.label,context:null,difficulty:'Medium',renderer:'TABLE_GROUP',stem,evidenceGroups:sel.evidence,target:sel.target,options,correctIndex:ci,answer:sel.target.result,explanation,solverTrace:[...sel.evidence.map(g=>calc(rule.ruleId,g)),calc(rule.ruleId,sel.target)],ambiguityAudit:sel.ambiguity,structuralFingerprint:['MIS-CP-020',rule.ruleId,'EXACT_ROOT','SOURCE_BACKED'].join('|'),numericFingerprint:[...sel.evidence,sel.target].map(g=>`${g.first},${g.second}:${g.result}`).join('|'),operationDepth:2,operandCount:2,groupCount:3,missingPosition:'RESULT',forwardOrInverse:'FORWARD',sourceBacked:true,sourceNote:rule.sourceNote,semanticAuthorityCandidateId:candidateId,createsNewSemanticAuthority:true,wholeNumberOrDigitMode:'WHOLE_NUMBER'};
}
export const MIS_CP020_CANDIDATE_IDS=Object.freeze(MIS_CP020_RULES.map(r=>r.candidateId));
