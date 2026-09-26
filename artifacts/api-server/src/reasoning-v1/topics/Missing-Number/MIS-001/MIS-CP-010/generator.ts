import {MIS_CP010_RULES,misCp010RuleByCandidateId,type MisCp010CandidateId,type MisCp010RuleId} from './rule-definitions';
import {auditMisCp010Ambiguity,digits,reverseTwoDigit,independentlyEvaluateMisCp010Rule,type MisCp010AmbiguityAudit,type MisCp010Group} from './independent-solver';

export interface MisCp010Option{readonly value:number;readonly errorLabel:string|null;}
export interface GeneratedMisCp010Question{
 readonly packageId:'MIS-001';readonly checkpointId:'MIS-CP-010';readonly candidateId:MisCp010CandidateId;readonly provisionalQl:true;
 readonly ruleId:MisCp010RuleId;readonly ruleFamily:string;readonly context:null;readonly difficulty:'Medium'|'Hard';readonly renderer:'TABLE_GROUP';
 readonly stem:string;readonly evidenceGroups:readonly MisCp010Group[];readonly target:MisCp010Group;readonly options:readonly MisCp010Option[];
 readonly correctIndex:number;readonly answer:number;readonly explanation:string;readonly solverTrace:readonly string[];
 readonly ambiguityAudit:MisCp010AmbiguityAudit;readonly structuralFingerprint:string;readonly numericFingerprint:string;readonly operationDepth:1|2;
 readonly operandCount:1|2;readonly groupCount:number;readonly missingPosition:'RESULT';readonly forwardOrInverse:'FORWARD';
 readonly wholeNumberOrDigitMode:'DIGIT';
}
function hash(v:string):number{let h=2166136261;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed:string):()=>number{let s=hash(seed)||1;return()=>{s+=0x6d2b79f5;let v=s;v=Math.imul(v^(v>>>15),v|1);v^=v+Math.imul(v^(v>>>7),v|61);return((v^(v>>>14))>>>0)/4294967296;};}
function shuffle<T>(a:readonly T[],seed:string):T[]{const o=[...a],r=rng(seed);for(let i=o.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[o[i],o[j]]=[o[j]!,o[i]!];}return o;}
function validGroups(ruleId:MisCp010RuleId,operandCount:1|2):MisCp010Group[]{
 const out:MisCp010Group[]=[];
 for(let n=12;n<=98;n++){if(n%10===0)continue;
   if(operandCount===1){const result=independentlyEvaluateMisCp010Rule(ruleId,n,null);if(result&&result!==n)out.push({number:n,visible:null,result});continue;}
   for(let v=2;v<=30;v++){const result=independentlyEvaluateMisCp010Rule(ruleId,n,v);if(result&&result!==n&&result!==v)out.push({number:n,visible:v,result});}
 }
 return out;
}
function distractors(ruleId:MisCp010RuleId,g:MisCp010Group):MisCp010Option[]{
 const[t,u]=digits(g.number),sum=t+u,prod=t*u,diff=Math.abs(t-u),rev=reverseTwoDigit(g.number),out:MisCp010Option[]=[];
 const add=(v:number|null,l:string)=>{if(v!=null&&Number.isInteger(v)&&v>0&&v<=999&&v!==g.result&&!out.some(x=>x.value===v))out.push({value:v,errorLabel:l});};
 add(g.number,'WHOLE_NUMBER_USED_INSTEAD_OF_DIGITS');add(sum,'DIGIT_SUM_USED');add(prod,'DIGIT_PRODUCT_USED');add(diff,'DIGIT_DIFFERENCE_USED');add(rev,'DIGITS_REVERSED_ONLY');add(rev==null?null:g.number+rev,'NUMBER_PLUS_REVERSE_USED');add(sum*sum,'SQUARED_DIGIT_SUM_USED');if(g.visible!=null){add(sum+g.visible,'DIGIT_SUM_PLUS_VISIBLE');add(prod+g.visible,'DIGIT_PRODUCT_PLUS_VISIBLE');add(g.number+g.visible,'WHOLE_NUMBER_PLUS_VISIBLE');}
 return out;
}
function select(ruleId:MisCp010RuleId,count:1|2,seed:string){const gs=shuffle(validGroups(ruleId,count),seed+':g');for(let i=0;i<Math.min(gs.length,50);i++)for(let j=i+1;j<Math.min(gs.length,180);j++){const a=gs[i]!,b=gs[j]!;if(a.result===b.result)continue;const evidence=[a,b],audit=auditMisCp010Ambiguity(ruleId,evidence);if(!audit.accepted)continue;const target=gs.find((g,k)=>k!==i&&k!==j&&g.result!==a.result&&g.result!==b.result&&distractors(ruleId,g).length>=3);if(target)return{evidence,target,audit};}throw new Error('Unable to construct CP010 '+ruleId);}
function words(id:MisCp010RuleId):string{switch(id){case'DIGIT_SUM':return'Add the two digits of the number.';case'DIGIT_PRODUCT':return'Multiply the two digits of the number.';case'DIGIT_DIFFERENCE':return'Take the positive difference between the two digits.';case'NUMBER_PLUS_REVERSE':return'Reverse the two-digit number and add it to the original number.';case'DIGIT_SUM_PLUS_VISIBLE':return'Add the two digits, then add the other visible number.';case'SQUARE_OF_DIGIT_SUM':return'Add the two digits, then square that sum.';}}
function calc(id:MisCp010RuleId,g:MisCp010Group):string{const[t,u]=digits(g.number),s=t+u,r=g.result;switch(id){case'DIGIT_SUM':return`${t} + ${u} = ${r}`;case'DIGIT_PRODUCT':return`${t} × ${u} = ${r}`;case'DIGIT_DIFFERENCE':return`|${t} − ${u}| = ${r}`;case'NUMBER_PLUS_REVERSE':{const rev=reverseTwoDigit(g.number)!;return`Reverse ${g.number} → ${rev}\n${g.number} + ${rev} = ${r}`;}case'DIGIT_SUM_PLUS_VISIBLE':return`${t} + ${u} = ${s}\n${s} + ${g.visible} = ${r}`;case'SQUARE_OF_DIGIT_SUM':return`${t} + ${u} = ${s}\n${s}² = ${r}`;}}
function row(g:MisCp010Group,hide=false):string{return g.visible==null?`${g.number}   ${hide?'?':g.result}`:`${g.number}   ${g.visible}   ${hide?'?':g.result}`;}
export function generateMisCp010Question(candidateId:MisCp010CandidateId,seed:string|number='mis-cp010-v1'):GeneratedMisCp010Question{
 const rule=misCp010RuleByCandidateId(candidateId),base=String(seed),sel=select(rule.ruleId,rule.operandCount,base);
 const wrong=shuffle(distractors(rule.ruleId,sel.target),base+':o').slice(0,3);if(wrong.length!==3)throw new Error('CP010 distractor shortage');const ci=hash(base+candidateId)%4,opts=[...wrong];opts.splice(ci,0,{value:sel.target.result,errorLabel:null});
 const stem=['Find the number that will replace the question mark (?).','',...sel.evidence.map(g=>row(g)),row(sel.target,true)].join('\n');
 const explanation=['This is a digit-based pattern. Use the digits, not the whole number.',words(rule.ruleId),'','Row 1:',calc(rule.ruleId,sel.evidence[0]!),'','Row 2:',calc(rule.ruleId,sel.evidence[1]!),'','Now apply the same digit rule to the row with the question mark:',calc(rule.ruleId,sel.target),'',`So, ? = ${sel.target.result}.`].join('\n');
 return{packageId:'MIS-001',checkpointId:'MIS-CP-010',candidateId,provisionalQl:true,ruleId:rule.ruleId,ruleFamily:rule.label,context:null,difficulty:rule.difficulty,renderer:'TABLE_GROUP',stem,evidenceGroups:sel.evidence,target:sel.target,options:opts,correctIndex:ci,answer:sel.target.result,explanation,solverTrace:[...sel.evidence.map(g=>calc(rule.ruleId,g)),calc(rule.ruleId,sel.target)],ambiguityAudit:sel.audit,structuralFingerprint:['MIS-CP-010',rule.ruleId,'DIGIT_MODE',`OPERANDS_${rule.operandCount}`].join('|'),numericFingerprint:[...sel.evidence,sel.target].map(g=>`${g.number},${g.visible??'_'}:${g.result}`).join('|'),operationDepth:rule.operationDepth,operandCount:rule.operandCount,groupCount:3,missingPosition:'RESULT',forwardOrInverse:'FORWARD',wholeNumberOrDigitMode:'DIGIT'};
}
export const MIS_CP010_CANDIDATE_IDS=Object.freeze(MIS_CP010_RULES.map(r=>r.candidateId));
