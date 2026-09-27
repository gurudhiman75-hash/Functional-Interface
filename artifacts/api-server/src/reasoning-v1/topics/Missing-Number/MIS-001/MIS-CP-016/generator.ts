import{renderBoxSvg,figurePreview}from'../visual-runtime';
import{MIS_CP016_RULES,misCp016RuleByCandidateId,type MisCp016CandidateId,type MisCp016RuleContext}from'./rule-definitions';
import{independentlyEvaluateMisCp016Rule,type MisCp016Group}from'./independent-solver';

export interface MisCp016Option{readonly value:number;readonly errorLabel:string|null;}
export interface GeneratedMisCp016Question{
 readonly packageId:'MIS-001';readonly checkpointId:'MIS-CP-016';readonly candidateId:MisCp016CandidateId;readonly provisionalQl:true;
 readonly ruleId:'PAIR_PRODUCT_DIFFERENCE_TIMES_CONSTANT';readonly ruleFamily:string;readonly context:MisCp016RuleContext;
 readonly difficulty:'Hard';readonly renderer:'SVG_BOX';readonly stem:string;readonly evidenceGroups:readonly MisCp016Group[];
 readonly target:MisCp016Group;readonly figures:readonly {svg:string;positions:Record<string,number|'?'>}[];
 readonly options:readonly MisCp016Option[];readonly correctIndex:number;readonly answer:number;readonly explanation:string;
 readonly solverTrace:readonly string[];readonly ambiguityAudit:{readonly accepted:boolean;readonly survivingRules:readonly string[];readonly reason:string};
 readonly structuralFingerprint:string;readonly numericFingerprint:string;readonly operationDepth:3;readonly operandCount:4;readonly groupCount:3;
 readonly missingPosition:'CENTRE_MISSING';readonly forwardOrInverse:'FORWARD';readonly sourceBacked:true;readonly sourceNote:string;
 readonly semanticAuthorityCandidateId:'MIS-CAND-090';readonly createsNewSemanticAuthority:true;readonly pairingAuthority:'ROWS';
}
function hash(v:string){let h=2166136261;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed:string){let s=hash(seed)||1;return()=>{s+=0x6d2b79f5;let v=s;v=Math.imul(v^(v>>>15),v|1);v^=v+Math.imul(v^(v>>>7),v|61);return((v^(v>>>14))>>>0)/4294967296;};}
function shuffle<T>(a:readonly T[],seed:string){const o=[...a],r=rng(seed);for(let i=o.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[o[i],o[j]]=[o[j]!,o[i]!];}return o;}
type Nearby='ROW_PRODUCTS_DIFFERENCE'|'ROW_PRODUCTS_DIFFERENCE_TIMES_2'|'ROW_PRODUCTS_SUM'|'SUM_FOUR';
function nearby(rule:Nearby,g:Omit<MisCp016Group,'result'>):number{
 const p=g.a*g.b,q=g.c*g.d;
 if(rule==='ROW_PRODUCTS_DIFFERENCE')return Math.abs(p-q);
 if(rule==='ROW_PRODUCTS_DIFFERENCE_TIMES_2')return Math.abs(p-q)*2;
 if(rule==='ROW_PRODUCTS_SUM')return p+q;
 return g.a+g.b+g.c+g.d;
}
const GRAMMAR:readonly Nearby[]=['ROW_PRODUCTS_DIFFERENCE','ROW_PRODUCTS_DIFFERENCE_TIMES_2','ROW_PRODUCTS_SUM','SUM_FOUR'];
function ambiguity(evidence:readonly MisCp016Group[]){
 const survivors=GRAMMAR.filter(r=>evidence.every(g=>nearby(r,g)===g.result));
 return survivors.length===1&&survivors[0]==='ROW_PRODUCTS_DIFFERENCE_TIMES_2'
  ?{accepted:true,survivingRules:survivors,reason:'Exactly one nearby pair-product rule survives all evidence.'}
  :{accepted:false,survivingRules:survivors,reason:'Competing nearby rules survive: '+survivors.join(', ')};
}
function groups(context:MisCp016RuleContext):MisCp016Group[]{
 const out:MisCp016Group[]=[];
 for(let a=2;a<=12;a++)for(let b=2;b<=12;b++)for(let c=2;c<=12;c++)for(let d=2;d<=12;d++){
  if(new Set([a,b,c,d]).size<3)continue;
  const result=independentlyEvaluateMisCp016Rule(a,b,c,d,context);
  if(result&&result<=300&&![a,b,c,d].includes(result))out.push({a,b,c,d,result});
 }
 return out;
}
function distractors(g:MisCp016Group):MisCp016Option[]{
 const p=g.a*g.b,q=g.c*g.d,out:MisCp016Option[]=[];
 const add=(v:number,l:string)=>{if(Number.isInteger(v)&&v>0&&v<=999&&v!==g.result&&!out.some(x=>x.value===v))out.push({value:v,errorLabel:l});};
 add(Math.abs(p-q),'FINAL_MULTIPLIER_OMITTED');
 add(p+q,'ADDED_PAIR_PRODUCTS');
 add((p+q)*2,'ADDED_PAIR_PRODUCTS_THEN_DOUBLED');
 add(Math.abs(g.a-g.b)+Math.abs(g.c-g.d),'USED_PAIR_DIFFERENCES');
 add(g.a+g.b+g.c+g.d,'ADDED_ALL_VISIBLE_VALUES');
 add(Math.abs(p-q)*3,'WRONG_FINAL_MULTIPLIER');
 return out;
}
function select(context:MisCp016RuleContext,seed:string){
 const gs=shuffle(groups(context),seed+':g');
 for(let i=0;i<Math.min(gs.length,60);i++)for(let j=i+1;j<Math.min(gs.length,200);j++){
  const e=[gs[i]!,gs[j]!];if(e[0]!.result===e[1]!.result)continue;
  const audit=ambiguity(e);if(!audit.accepted)continue;
  const target=gs.find((g,k)=>k!==i&&k!==j&&g.result!==e[0]!.result&&g.result!==e[1]!.result&&distractors(g).length>=3);
  if(target)return{evidence:e,target,audit};
 }
 throw new Error('Unable to construct CP016 source-backed scenario');
}
function calc(g:MisCp016Group,k:number){
 const p=g.a*g.b,q=g.c*g.d,d=Math.abs(p-q);
 return`Top pair: ${g.a} × ${g.b} = ${p}\nBottom pair: ${g.c} × ${g.d} = ${q}\n|${p} − ${q}| = ${d}\n${d} × ${k} = ${g.result}`;
}
export function generateMisCp016Question(candidateId:MisCp016CandidateId,seed:string|number='mis-cp016-v1'):GeneratedMisCp016Question{
 const rule=misCp016RuleByCandidateId(candidateId),context=rule.contexts[0]!,base=String(seed),sel=select(context,base);
 const wrong=shuffle(distractors(sel.target),base+':opts').slice(0,3),ci=hash(base+candidateId)%4,options=[...wrong];options.splice(ci,0,{value:sel.target.result,errorLabel:null});
 const make=(g:MisCp016Group,hide=false)=>{const positions={topLeft:g.a,topRight:g.b,bottomLeft:g.c,bottomRight:g.d,centre:hide?'?' as const:g.result};return{positions,svg:renderBoxSvg(positions,'SQUARE')}};const figures=[...sel.evidence.map(g=>make(g)),make(sel.target,true)];
 const stem=['Find the missing value in the following figure.','',...figures.map((f,i)=>`Figure ${i+1}:\n${figurePreview('SVG_BOX',f.positions)}`)].join('\n\n');
 const explanation=['The same rule is used in every figure.','Multiply the two numbers in each row, take the positive difference of those products, then multiply that difference by 2.','',...sel.evidence.flatMap((g,i)=>[`Figure ${i+1}:`,calc(g,context.k),'']),'Now apply the same rule:',calc(sel.target,context.k),'',`So, ? = ${sel.target.result}.`].join('\n');
 return{packageId:'MIS-001',checkpointId:'MIS-CP-016',candidateId,provisionalQl:true,ruleId:'PAIR_PRODUCT_DIFFERENCE_TIMES_CONSTANT',ruleFamily:rule.label,context,difficulty:'Hard',renderer:'SVG_BOX',stem,evidenceGroups:sel.evidence,target:sel.target,figures,options,correctIndex:ci,answer:sel.target.result,explanation,solverTrace:[...sel.evidence.map(g=>calc(g,context.k)),calc(sel.target,context.k)],ambiguityAudit:sel.audit,structuralFingerprint:['MIS-CP-016','PAIR_PRODUCT_DIFFERENCE_TIMES_CONSTANT','K=2','ROWS','SOURCE_BACKED'].join('|'),numericFingerprint:[...sel.evidence,sel.target].map(g=>`${g.a},${g.b},${g.c},${g.d}:${g.result}`).join('|'),operationDepth:3,operandCount:4,groupCount:3,missingPosition:'CENTRE_MISSING',forwardOrInverse:'FORWARD',sourceBacked:true,sourceNote:rule.sourceNote,semanticAuthorityCandidateId:'MIS-CAND-090',createsNewSemanticAuthority:true,pairingAuthority:'ROWS'};
}
export const MIS_CP016_CANDIDATE_IDS=Object.freeze(MIS_CP016_RULES.map(r=>r.candidateId));
