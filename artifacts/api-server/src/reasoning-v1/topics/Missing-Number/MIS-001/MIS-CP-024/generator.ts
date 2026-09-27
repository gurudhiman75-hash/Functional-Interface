import{MIS_CP024_RULES,misCp024RuleByCandidateId,type MisCp024CandidateId,type MisCp024RuleContext}from'./rule-definitions';
import{applyMisCp024Transform,independentlyEvaluateMisCp024Rule,type MisCp024Group}from'./independent-solver';

export interface MisCp024Option{readonly value:number;readonly errorLabel:string|null;}
export interface GeneratedMisCp024Question{
 readonly packageId:'MIS-001';readonly checkpointId:'MIS-CP-024';readonly candidateId:MisCp024CandidateId;readonly provisionalQl:true;
 readonly ruleId:'SECOND_INPUT_AFFINE';readonly ruleFamily:string;readonly context:MisCp024RuleContext;readonly difficulty:'Medium';readonly renderer:'TABLE_GROUP';
 readonly stem:string;readonly evidenceGroups:readonly MisCp024Group[];readonly target:MisCp024Group;readonly options:readonly MisCp024Option[];
 readonly correctIndex:number;readonly answer:number;readonly explanation:string;readonly solverTrace:readonly string[];
 readonly ambiguityAudit:{readonly accepted:boolean;readonly survivingRules:readonly string[];readonly reason:string};
 readonly structuralFingerprint:string;readonly numericFingerprint:string;readonly operationDepth:2;readonly operandCount:1;readonly groupCount:3;
 readonly missingPosition:'RESULT';readonly forwardOrInverse:'FORWARD';readonly sourceBacked:true;readonly sourceNote:string;
 readonly semanticAuthorityCandidateId:MisCp024CandidateId;readonly createsNewSemanticAuthority:true;readonly wholeNumberOrDigitMode:'WHOLE_NUMBER';
}
function hash(v:string){let h=2166136261;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed:string){let s=hash(seed)||1;return()=>{s+=0x6d2b79f5;let v=s;v=Math.imul(v^(v>>>15),v|1);v^=v+Math.imul(v^(v>>>7),v|61);return((v^(v>>>14))>>>0)/4294967296;};}
function shuffle<T>(a:readonly T[],seed:string){const o=[...a],r=rng(seed);for(let i=o.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[o[i],o[j]]=[o[j]!,o[i]!];}return o;}

type Nearby='SECOND_INPUT_AFFINE'|'SUM_FIRST_SECOND'|'PRODUCT_FIRST_SECOND'|'ABS_DIFFERENCE'|'SECOND_TIMES_3';
const NEARBY:readonly Nearby[]=['SECOND_INPUT_AFFINE','SUM_FIRST_SECOND','PRODUCT_FIRST_SECOND','ABS_DIFFERENCE','SECOND_TIMES_3'];
function evalNearby(id:Nearby,g:MisCp024Group,context:MisCp024RuleContext):number|null{
 if(id==='SECOND_INPUT_AFFINE')return independentlyEvaluateMisCp024Rule(g.second,context);
 if(id==='SUM_FIRST_SECOND')return g.first+g.second;
 if(id==='PRODUCT_FIRST_SECOND')return g.first*g.second;
 if(id==='ABS_DIFFERENCE')return Math.abs(g.first-g.second);
 return g.second*context.multiplier;
}
function audit(evidence:readonly MisCp024Group[],context:MisCp024RuleContext){
 const survivors=NEARBY.filter(r=>evidence.every(g=>evalNearby(r,g,context)===g.result));
 return survivors.length===1&&survivors[0]==='SECOND_INPUT_AFFINE'
 ?{accepted:true,survivingRules:survivors,reason:'Only second×3+1 fits every asked result among the nearby solve rules.'}
 :{accepted:false,survivingRules:survivors,reason:'Competing nearby solve rules survive: '+survivors.join(', ')};
}
function groups(context:MisCp024RuleContext):MisCp024Group[]{
 const out:MisCp024Group[]=[];
 for(let first=3;first<=45;first++){
  const second=applyMisCp024Transform(first,context);
  const result=independentlyEvaluateMisCp024Rule(second,context);
  if(result!=null)out.push({first,second,result});
 }
 return out;
}
function distractors(g:MisCp024Group,context:MisCp024RuleContext):MisCp024Option[]{
 const out:MisCp024Option[]=[];const add=(v:number,l:string)=>{if(Number.isInteger(v)&&v>0&&v<=999&&v!==g.result&&!out.some(x=>x.value===v))out.push({value:v,errorLabel:l});};
 add(g.second*context.multiplier,'OMITTED_ADDEND');
 add(g.first*context.multiplier+context.addend,'USED_FIRST_INPUT');
 add(g.first+g.second,'ADDED_VISIBLE_VALUES');
 add(g.second*(context.multiplier+1)+context.addend,'WRONG_MULTIPLIER');
 add(g.second*context.multiplier+context.addend+1,'ADDEND_OFF_BY_ONE');
 return out;
}
function select(context:MisCp024RuleContext,seed:string){
 const gs=shuffle(groups(context),seed+':groups');
 for(let i=0;i<gs.length;i++)for(let j=i+1;j<gs.length;j++){
  const evidence=[gs[i]!,gs[j]!];const ambiguity=audit(evidence,context);if(!ambiguity.accepted)continue;
  const target=gs.find((g,k)=>k!==i&&k!==j&&g.result!==evidence[0]!.result&&g.result!==evidence[1]!.result&&distractors(g,context).length>=3);
  if(target)return{evidence,target,ambiguity};
 }
 throw new Error('Unable to construct CP024 source-backed affine row');
}
function calc(g:MisCp024Group,context:MisCp024RuleContext):string{
 return`${g.second} × ${context.multiplier} + ${context.addend} = ${g.result}`;
}
function sourceCheck(g:MisCp024Group,context:MisCp024RuleContext):string{
 return`Source row check: ${g.first} × ${context.multiplier} + ${context.addend} = ${g.second}`;
}
function row(g:MisCp024Group,hide=false){return`${g.first}   ${g.second}   ${hide?'?':g.result}`;}
export function generateMisCp024Question(candidateId:MisCp024CandidateId,seed:string|number='mis-cp024-v2'):GeneratedMisCp024Question{
 const rule=misCp024RuleByCandidateId(candidateId),context=rule.contexts[0]!,base=String(seed),sel=select(context,base),wrong=shuffle(distractors(sel.target,context),base+':opts').slice(0,3);
 if(wrong.length!==3)throw new Error('CP024 distractor shortage');
 const ci=hash(base+candidateId)%4,options=[...wrong];options.splice(ci,0,{value:sel.target.result,errorLabel:null});
 const stem=['Study the pattern and find the number that will replace the question mark (?).','',...sel.evidence.map(g=>row(g)),row(sel.target,true)].join('\n');
 const explanation=['In the completed rows, the same ×3 + 1 pattern appears between adjacent numbers.','For the missing last number, use the second number: multiply it by 3 and add 1.','',
  'Row 1:',sourceCheck(sel.evidence[0]!,context),calc(sel.evidence[0]!,context),'',
  'Row 2:',sourceCheck(sel.evidence[1]!,context),calc(sel.evidence[1]!,context),'',
  'Target:',calc(sel.target,context),'',`So, ? = ${sel.target.result}.`].join('\n');
 return{packageId:'MIS-001',checkpointId:'MIS-CP-024',candidateId,provisionalQl:true,ruleId:'SECOND_INPUT_AFFINE',ruleFamily:rule.label,context,difficulty:'Medium',renderer:'TABLE_GROUP',stem,evidenceGroups:sel.evidence,target:sel.target,options,correctIndex:ci,answer:sel.target.result,explanation,solverTrace:[...sel.evidence.map(g=>calc(g,context)),calc(sel.target,context)],ambiguityAudit:sel.ambiguity,structuralFingerprint:['MIS-CP-024','SECOND_INPUT_AFFINE','M=3','K=1','SOURCE_BACKED'].join('|'),numericFingerprint:[...sel.evidence,sel.target].map(g=>`${g.first},${g.second}:${g.result}`).join('|'),operationDepth:2,operandCount:1,groupCount:3,missingPosition:'RESULT',forwardOrInverse:'FORWARD',sourceBacked:true,sourceNote:rule.sourceNote,semanticAuthorityCandidateId:candidateId,createsNewSemanticAuthority:true,wholeNumberOrDigitMode:'WHOLE_NUMBER'};
}
export const MIS_CP024_CANDIDATE_IDS=Object.freeze(MIS_CP024_RULES.map(r=>r.candidateId));
