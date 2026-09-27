import{renderBoxSvg,figurePreview}from'../visual-runtime';
import{MIS_CP012_PROFILES,misCp012ProfileByCandidateId,type MisCp012CandidateId}from'./rule-definitions';
import{evaluateMisCp012Rule,survivingMisCp012Rules,type MisCp012GenericGroup}from'./independent-solver';

export interface MisCp012Option{readonly value:number;readonly errorLabel:string|null;}
export interface GeneratedMisCp012Question{
 readonly packageId:'MIS-001';readonly checkpointId:'MIS-CP-012';readonly candidateId:MisCp012CandidateId;readonly provisionalQl:true;
 readonly ruleId:string;readonly ruleFamily:string;readonly context:null;readonly difficulty:'Hard';readonly renderer:'TABLE_GROUP'|'SVG_BOX';
 readonly stem:string;readonly evidenceGroups:readonly MisCp012GenericGroup[];readonly target:MisCp012GenericGroup;readonly figures:readonly {svg:string;positions:Record<string,number|'?'>}[]|null;
 readonly options:readonly MisCp012Option[];readonly correctIndex:number;readonly answer:number;readonly explanation:string;readonly solverTrace:readonly string[];
 readonly ambiguityAudit:{readonly accepted:boolean;readonly intendedSemanticKey:string;readonly matches:readonly {ruleId:string;semanticKey:string}[];readonly reason:string};
 readonly structuralFingerprint:string;readonly numericFingerprint:string;readonly operationDepth:2;readonly operandCount:2|3|4;readonly groupCount:4;
 readonly missingPosition:'RESULT'|'CENTRE_MISSING';readonly forwardOrInverse:'FORWARD';readonly semanticAuthorityCandidateId:string;readonly createsNewSemanticAuthority:false;
 readonly firstGroupCompetingRuleCount:number;readonly finalCompetingRuleCount:number;
}
function hash(v:string){let h=2166136261;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed:string){let s=hash(seed)||1;return()=>{s+=0x6d2b79f5;let v=s;v=Math.imul(v^(v>>>15),v|1);v^=v+Math.imul(v^(v>>>7),v|61);return((v^(v>>>14))>>>0)/4294967296;};}
function shuffle<T>(a:readonly T[],seed:string){const o=[...a],r=rng(seed);for(let i=o.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[o[i],o[j]]=[o[j]!,o[i]!];}return o;}
function candidates(profile:string):number[][]{
 const out:number[][]=[];
 if(profile==='SUM_VS_PRODUCT'||profile==='SQUARE_PLUS_SECOND_VS_PRODUCT'){
  for(let a=2;a<=20;a++)for(let b=2;b<=20;b++)out.push([a,b]);
 }else if(profile==='COMPOUND_RULE_COMPETITION'){
  for(let a=2;a<=14;a++)for(let b=2;b<=14;b++)for(let c=2;c<=10;c++)out.push([a,b,c]);
 }else{
  for(let a=2;a<=12;a++)for(let b=2;b<=12;b++)for(let c=2;c<=12;c++)for(let d=2;d<=12;d++)out.push([a,b,c,d]);
 }
 return out;
}
function group(rule:string,values:number[]):MisCp012GenericGroup|null{const result=evaluateMisCp012Rule(rule,values);return result==null?null:{values,result};}
function pick(profileId:string,intended:string,competitor:string,seed:string){
 const vals=shuffle(candidates(profileId),seed+':vals'),rules=[intended,competitor];
 let first:MisCp012GenericGroup|null=null;
 for(const v of vals){const g=group(intended,v);if(!g)continue;if(evaluateMisCp012Rule(competitor,v)===g.result){first=g;break;}}
 if(!first)throw new Error('No deliberately ambiguous first group for '+profileId);
 const evidence=[first];
 for(const v of vals){const g=group(intended,v);if(!g)continue;if(g.result===first.result)continue;
   const survivors=survivingMisCp012Rules(rules,[...evidence,g]);
   if(survivors.length===1&&survivors[0]===intended){evidence.push(g);break;}
 }
 if(evidence.length!==2)throw new Error('No disambiguating second group for '+profileId);
 const third=vals.map(v=>group(intended,v)).find(g=>g&&g.result!==evidence[0]!.result&&g.result!==evidence[1]!.result&&survivingMisCp012Rules(rules,[...evidence,g]).length===1)!;
 if(!third)throw new Error('No third evidence group for '+profileId);evidence.push(third);
 const target=vals.map(v=>group(intended,v)).find(g=>g&&![...evidence].some(e=>e.result===g.result)&&distractors(g,rules,intended).length>=3)!;
 if(!target)throw new Error('No target with three misconception distractors for '+profileId);
 return{evidence,target,rules};
}
function distractors(target:MisCp012GenericGroup,rules:readonly string[],intended:string):MisCp012Option[]{
 const out:MisCp012Option[]=[];const add=(v:number|null,l:string)=>{if(v!=null&&Number.isInteger(v)&&v>0&&v<=999&&v!==target.result&&!out.some(x=>x.value===v))out.push({value:v,errorLabel:l});};
 for(const r of rules)if(r!==intended)add(evaluateMisCp012Rule(r,target.values),'USED_REJECTED_COMPETING_RULE');
 const v=target.values,a=v[0]!,b=v[1]!;
 add(v.reduce((x,y)=>x+y,0),'ADDED_VISIBLE_VALUES');
 add(v.reduce((x,y)=>x*y,1),'MULTIPLIED_VISIBLE_VALUES');
 add(Math.abs(a-b),'USED_SIMPLE_DIFFERENCE');
 if(v.length===2){
   add(a*a+b,'SQUARE_FIRST_PLUS_SECOND');
   add(b*b+a,'SQUARE_SECOND_PLUS_FIRST');
   add((a+b)*(a+b),'SQUARED_PAIR_SUM');
   add(a*a+b*b,'SUM_OF_SQUARES');
 }
 if(v.length===3){
   const d=v[2]!;
   add((a+b)*d,'PAIR_SUM_TIMES_THIRD');
   add(a*b-d,'THIRD_NOT_SQUARED');
   add(a*b-d*d,'PAIR_PRODUCT_MINUS_THIRD_SQUARE');
   add(a*a+b*d,'FIRST_SQUARE_PLUS_PAIR_PRODUCT');
   add((a+b)*(a+b)-d,'PAIR_SUM_SQUARE_MINUS_THIRD');
   add(a*b+Math.abs(a-b),'PAIR_PRODUCT_PLUS_DIFFERENCE');
 }
 if(v.length===4){
   const d=v[2]!,e=v[3]!;
   add(a*b+d*e,'ROW_PRODUCTS_SUM');
   add(a*d+b*e,'COLUMN_PRODUCTS_SUM');
   add(a*e+b*d,'DIAGONAL_PRODUCTS_SUM');
   add(Math.abs(a*b-d*e),'ROW_PRODUCTS_DIFFERENCE');
   add(Math.abs(a*e-b*d),'DIAGONAL_PRODUCTS_DIFFERENCE');
   add((a+b)*(d+e),'ROW_SUMS_PRODUCT');
 }
 return out;
}
function row(g:MisCp012GenericGroup,hide=false){return[...g.values,hide?'?':g.result].join('   ');}
function explainCalc(rule:string,g:MisCp012GenericGroup){const v=g.values,r=g.result;switch(rule){
 case'SUM':return`${v[0]} + ${v[1]} = ${r}`;case'PRODUCT':return`${v[0]} × ${v[1]} = ${r}`;
 case'SQUARE_FIRST_PLUS_SECOND':return`${v[0]}² + ${v[1]} = ${r}`;
 case'ROW_PRODUCTS_SUM':return`${v[0]}×${v[1]} + ${v[2]}×${v[3]} = ${r}`;
 case'COLUMN_PRODUCTS_SUM':return`${v[0]}×${v[2]} + ${v[1]}×${v[3]} = ${r}`;
 case'DIAGONAL_PRODUCTS_SUM':return`${v[0]}×${v[3]} + ${v[1]}×${v[2]} = ${r}`;
 case'PAIR_PRODUCT_MINUS_THIRD_SQUARE':return`${v[0]}×${v[1]} − ${v[2]}² = ${r}`;
 case'FIRST_SQUARE_PLUS_PAIR_PRODUCT':return`${v[0]}² + ${v[1]}×${v[2]} = ${r}`;default:return'';}}
export function generateMisCp012Question(candidateId:MisCp012CandidateId,seed:string|number='mis-cp012-v1'):GeneratedMisCp012Question{
 const p=misCp012ProfileByCandidateId(candidateId),base=String(seed),sel=pick(p.profileId,p.intendedRule,p.competingRule,base);
 const firstSurvivors=survivingMisCp012Rules(sel.rules,[sel.evidence[0]!]),finalSurvivors=survivingMisCp012Rules(sel.rules,sel.evidence);
 if(firstSurvivors.length<2||finalSurvivors.length!==1||finalSurvivors[0]!==p.intendedRule)throw new Error('CP012 competition contract failed');
 const wrong=shuffle(distractors(sel.target,sel.rules,p.intendedRule),base+':o').slice(0,3);if(wrong.length!==3)throw new Error('CP012 distractor shortage');
 const ci=hash(base+candidateId)%4,options=[...wrong];options.splice(ci,0,{value:sel.target.result,errorLabel:null});
 let figures:null|{svg:string;positions:Record<string,number|'?'>}[]=null,stem:string,renderer:'TABLE_GROUP'|'SVG_BOX'='TABLE_GROUP',missing:'RESULT'|'CENTRE_MISSING'='RESULT';
 if(p.renderer==='SVG_BOX'){renderer='SVG_BOX';missing='CENTRE_MISSING';const make=(g:MisCp012GenericGroup,hide=false)=>{const [a,b,c,d]=g.values;const positions={topLeft:a!,topRight:b!,bottomLeft:c!,bottomRight:d!,centre:hide?'?' as const:g.result};return{positions,svg:renderBoxSvg(positions,'SQUARE')}};figures=[...sel.evidence.map(g=>make(g)),make(sel.target,true)];stem=['Find the missing value in the following figures.','',...figures.map((f,i)=>`Figure ${i+1}:\n${figurePreview('SVG_BOX',f.positions)}`)].join('\n\n');}
 else stem=['Find the number that will replace the question mark (?).','',...sel.evidence.map(g=>row(g)),row(sel.target,true)].join('\n');
 const explanation=['The first example alone can suggest more than one rule, so check all the completed examples.','',`Possible after Example 1: ${firstSurvivors.join(' or ')}.`,'',`The later examples reject ${p.competingRule} and keep ${p.intendedRule}.`,'',...sel.evidence.map((g,i)=>`Example ${i+1}: ${explainCalc(p.intendedRule,g)}`),'',`Target: ${explainCalc(p.intendedRule,sel.target)}`,'',`So, ? = ${sel.target.result}.`].join('\n');
 return{packageId:'MIS-001',checkpointId:'MIS-CP-012',candidateId,provisionalQl:true,ruleId:p.intendedRule,ruleFamily:p.label,context:null,difficulty:'Hard',renderer,stem,evidenceGroups:sel.evidence,target:sel.target,figures,options,correctIndex:ci,answer:sel.target.result,explanation,solverTrace:[...sel.evidence.map(g=>explainCalc(p.intendedRule,g)),explainCalc(p.intendedRule,sel.target)],ambiguityAudit:{accepted:true,intendedSemanticKey:p.intendedRule,matches:finalSurvivors.map(r=>({ruleId:r,semanticKey:r})),reason:'Multiple rules fit the first example; exactly one survives the complete evidence set.'},structuralFingerprint:['MIS-CP-012',p.profileId,p.intendedRule,p.competingRule].join('|'),numericFingerprint:[...sel.evidence,sel.target].map(g=>g.values.join(',')+':'+g.result).join('|'),operationDepth:2,operandCount:sel.target.values.length as 2|3|4,groupCount:4,missingPosition:missing,forwardOrInverse:'FORWARD',semanticAuthorityCandidateId:p.semanticAuthorityCandidateId,createsNewSemanticAuthority:false,firstGroupCompetingRuleCount:firstSurvivors.length,finalCompetingRuleCount:finalSurvivors.length};
}
export const MIS_CP012_CANDIDATE_IDS=Object.freeze(MIS_CP012_PROFILES.map(p=>p.candidateId));
