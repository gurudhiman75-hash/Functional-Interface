import{renderSharedProductSvg,sharedProductPreview}from'../visual-runtime';
import{MIS_CP025_RULES,misCp025RuleByCandidateId,type MisCp025CandidateId}from'./rule-definitions';
import{independentlyBuildMisCp025Group,independentlySolveMisCp025RightProduct,independentlyVerifyMisCp025Group,type MisCp025Group}from'./independent-solver';

export interface MisCp025Option{readonly value:number;readonly errorLabel:string|null;}
export interface MisCp025RenderedFigure{
 readonly positions:{
  readonly leftInput:number;
  readonly shared:number;
  readonly rightInput:number;
  readonly leftProduct:number;
  readonly rightProduct:number|'?';
 };
 readonly svg:string;
}
export interface GeneratedMisCp025Question{
 readonly packageId:'MIS-001';readonly checkpointId:'MIS-CP-025';readonly candidateId:MisCp025CandidateId;readonly provisionalQl:true;
 readonly ruleId:'SHARED_FACTOR_DUAL_PRODUCT';readonly ruleFamily:string;readonly context:null;readonly difficulty:'Easy';readonly renderer:'SVG_LINKED_PRODUCT';
 readonly stem:string;readonly evidenceGroups:readonly MisCp025Group[];readonly target:MisCp025Group;readonly figures:readonly MisCp025RenderedFigure[];
 readonly options:readonly MisCp025Option[];readonly correctIndex:number;readonly answer:number;readonly explanation:string;readonly solverTrace:readonly string[];
 readonly ambiguityAudit:{readonly accepted:true;readonly survivingRules:readonly['SHARED_FACTOR_DUAL_PRODUCT'];readonly reason:string};
 readonly structuralFingerprint:string;readonly numericFingerprint:string;readonly operationDepth:1;readonly operandCount:3;readonly groupCount:3;
 readonly missingPosition:'RIGHT_PRODUCT';readonly forwardOrInverse:'FORWARD';readonly sourceBacked:true;readonly sourceNote:string;
 readonly semanticAuthorityCandidateId:'MIS-CAND-003';readonly createsNewSemanticAuthority:false;readonly wholeNumberOrDigitMode:'WHOLE_NUMBER';
 readonly semanticPositions:readonly['leftInput','shared','rightInput','leftProduct','rightProduct'];
}
function hash(v:string){let h=2166136261;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed:string){let s=hash(seed)||1;return()=>{s+=0x6d2b79f5;let v=s;v=Math.imul(v^(v>>>15),v|1);v^=v+Math.imul(v^(v>>>7),v|61);return((v^(v>>>14))>>>0)/4294967296;};}
function shuffle<T>(a:readonly T[],seed:string){const o=[...a],r=rng(seed);for(let i=o.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[o[i],o[j]]=[o[j]!,o[i]!];}return o;}
function groups():MisCp025Group[]{
 const out:MisCp025Group[]=[];
 for(let left=3;left<=15;left++)for(let shared=2;shared<=12;shared++)for(let right=2;right<=9;right++){
  if(new Set([left,shared,right]).size<2)continue;
  const g=independentlyBuildMisCp025Group(left,shared,right);
  if(g.leftProduct>180||g.rightProduct>120)continue;
  if([left,shared,right].includes(g.leftProduct)||[left,shared,right].includes(g.rightProduct))continue;
  out.push(g);
 }
 return out;
}
function distractors(g:MisCp025Group):MisCp025Option[]{
 const out:MisCp025Option[]=[];const correct=g.rightProduct;
 const add=(v:number,l:string)=>{if(Number.isInteger(v)&&v>0&&v<=999&&v!==correct&&!out.some(x=>x.value===v))out.push({value:v,errorLabel:l});};
 add(g.leftInput*g.rightInput,'USED_OUTER_INPUTS');
 add(g.shared+g.rightInput,'ADDED_INSTEAD_OF_MULTIPLYING');
 add(g.leftProduct-g.shared,'SUBTRACTED_SHARED_FROM_LEFT_PRODUCT');
 add(g.leftProduct/g.shared,'REVERSED_LEFT_RELATION');
 add(g.rightInput*(g.shared+1),'SHARED_FACTOR_OFF_BY_ONE');
 return out;
}
function select(seed:string){
 const gs=shuffle(groups(),seed+':groups');
 for(let i=0;i<gs.length;i++){
  const first=gs[i]!;
  const second=gs.find((g,j)=>j!==i&&g.shared!==first.shared&&g.leftProduct!==first.leftProduct&&g.rightProduct!==first.rightProduct);
  if(!second)continue;
  const target=gs.find(g=>g!==first&&g!==second&&g.shared!==first.shared&&g.shared!==second.shared&&distractors(g).length>=3);
  if(target)return{evidence:[first,second] as const,target};
 }
 throw new Error('Unable to construct MIS-CP-025 linked-product figure');
}
function calc(g:MisCp025Group):string{
 return`${g.leftInput}×${g.shared}=${g.leftProduct}; ${g.shared}×${g.rightInput}=${g.rightProduct}`;
}
function figure(g:MisCp025Group,hide=false):MisCp025RenderedFigure{
 const positions={leftInput:g.leftInput,shared:g.shared,rightInput:g.rightInput,leftProduct:g.leftProduct,rightProduct:hide?'?' as const:g.rightProduct};
 return{positions,svg:renderSharedProductSvg(positions)};
}
export function generateMisCp025Question(candidateId:MisCp025CandidateId,seed:string|number='mis-cp025-v1'):GeneratedMisCp025Question{
 const rule=misCp025RuleByCandidateId(candidateId),base=String(seed),sel=select(base);
 const answer=independentlySolveMisCp025RightProduct({
  leftInput:sel.target.leftInput,shared:sel.target.shared,rightInput:sel.target.rightInput,leftProduct:sel.target.leftProduct,
 });
 if(answer!==sel.target.rightProduct)throw new Error('CP025 solver disagreement');
 const wrong=shuffle(distractors(sel.target),base+':opts').slice(0,3);if(wrong.length!==3)throw new Error('CP025 distractor shortage');
 const ci=hash(base+candidateId)%4,options=[...wrong];options.splice(ci,0,{value:answer,errorLabel:null});
 const figures=[figure(sel.evidence[0]),figure(sel.evidence[1]),figure(sel.target,true)];
 const previews=figures.map((f,i)=>`Figure ${String.fromCharCode(65+i)}:\n${sharedProductPreview(f.positions)}`);
 const explanation=[
  'The same multiplication relation is used in every figure.',
  'The middle number is shared: multiply it by the left input for the left output, and by the right input for the right output.',
  '',
  'Figure A:',calc(sel.evidence[0]),'',
  'Figure B:',calc(sel.evidence[1]),'',
  'Figure C:',calc(sel.target),'',
  `So, ? = ${answer}.`
 ].join('\n');
 return{
  packageId:'MIS-001',checkpointId:'MIS-CP-025',candidateId,provisionalQl:true,ruleId:'SHARED_FACTOR_DUAL_PRODUCT',
  ruleFamily:rule.label,context:null,difficulty:'Easy',renderer:'SVG_LINKED_PRODUCT',
  stem:['Find the missing value in the following figures.','',...previews].join('\n\n'),
  evidenceGroups:sel.evidence,target:sel.target,figures,options,correctIndex:ci,answer,explanation,
  solverTrace:[...sel.evidence.map(calc),calc(sel.target)],
  ambiguityAudit:{accepted:true,survivingRules:['SHARED_FACTOR_DUAL_PRODUCT'],reason:'Both product relations must hold in each complete figure; the missing output is uniquely determined by the shared factor and right input.'},
  structuralFingerprint:'MIS-CP-025|PRODUCT|SVG_LINKED_PRODUCT|SHARED_FACTOR|RIGHT_PRODUCT_MISSING|SOURCE_BACKED',
  numericFingerprint:[...sel.evidence,sel.target].map(g=>[g.leftInput,g.shared,g.rightInput,g.leftProduct,g.rightProduct].join(',')).join('|'),
  operationDepth:1,operandCount:3,groupCount:3,missingPosition:'RIGHT_PRODUCT',forwardOrInverse:'FORWARD',sourceBacked:true,sourceNote:rule.sourceNote,
  semanticAuthorityCandidateId:'MIS-CAND-003',createsNewSemanticAuthority:false,wholeNumberOrDigitMode:'WHOLE_NUMBER',
  semanticPositions:['leftInput','shared','rightInput','leftProduct','rightProduct'],
 };
}
export const MIS_CP025_CANDIDATE_IDS=Object.freeze(MIS_CP025_RULES.map(r=>r.candidateId));
