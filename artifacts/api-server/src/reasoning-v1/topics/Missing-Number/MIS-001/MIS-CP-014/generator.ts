import{MIS_CP014_RULES,misCp014RuleByCandidateId,type MisCp014CandidateId}from'./rule-definitions';
import{independentlySolveMisCp014Missing,independentlySumMisCp014Group,type MisCp014Corner,type MisCp014Group}from'./independent-solver';

export interface MisCp014Option{readonly value:number;readonly errorLabel:string|null;}
export interface GeneratedMisCp014Question{
 readonly packageId:'MIS-001';readonly checkpointId:'MIS-CP-014';readonly candidateId:MisCp014CandidateId;readonly provisionalQl:true;
 readonly ruleId:'INVARIANT_FOUR_CORNER_SUM_MISSING_CORNER';readonly ruleFamily:string;readonly context:null;readonly difficulty:'Medium';readonly renderer:'SVG_BOX';
 readonly stem:string;readonly evidenceGroups:readonly MisCp014Group[];readonly target:MisCp014Group;readonly targetTotal:number;readonly missingCorner:MisCp014Corner;
 readonly figures:readonly {svg:string;positions:Record<string,number|'?'>}[];readonly options:readonly MisCp014Option[];readonly correctIndex:number;readonly answer:number;
 readonly explanation:string;readonly solverTrace:readonly string[];readonly ambiguityAudit:{readonly accepted:true;readonly reason:string};
 readonly structuralFingerprint:string;readonly numericFingerprint:string;readonly operationDepth:1;readonly operandCount:4;readonly groupCount:3;
 readonly missingPosition:'CORNER_MISSING';readonly forwardOrInverse:'INVERSE';readonly sourceBacked:true;readonly sourceNote:string;
 readonly semanticAuthorityCandidateId:'MIS-CAND-050';readonly createsNewSemanticAuthority:false;
}
function hash(v:string){let h=2166136261;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed:string){let s=hash(seed)||1;return()=>{s+=0x6d2b79f5;let v=s;v=Math.imul(v^(v>>>15),v|1);v^=v+Math.imul(v^(v>>>7),v|61);return((v^(v>>>14))>>>0)/4294967296;};}
function shuffle<T>(a:readonly T[],seed:string){const o=[...a],r=rng(seed);for(let i=o.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[o[i],o[j]]=[o[j]!,o[i]!];}return o;}
function renderCornerOnlySvg(values:Record<MisCp014Corner,number|'?'>):string{
 return['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 190" role="img" aria-label="four corner number square">',
 '<rect x="35" y="20" width="150" height="150" fill="none" stroke="currentColor" stroke-width="2.5"/>',
 `<text x="57" y="42" text-anchor="middle" dominant-baseline="middle" font-size="18" font-family="Arial" font-weight="600">${values.topLeft}</text>`,
 `<text x="163" y="42" text-anchor="middle" dominant-baseline="middle" font-size="18" font-family="Arial" font-weight="600">${values.topRight}</text>`,
 `<text x="57" y="148" text-anchor="middle" dominant-baseline="middle" font-size="18" font-family="Arial" font-weight="600">${values.bottomLeft}</text>`,
 `<text x="163" y="148" text-anchor="middle" dominant-baseline="middle" font-size="18" font-family="Arial" font-weight="600">${values.bottomRight}</text>`,
 '</svg>'].join('');
}
function preview(v:Record<MisCp014Corner,number|'?'>){return`${v.topLeft}       ${v.topRight}\n\n${v.bottomLeft}       ${v.bottomRight}`;}
function buildGroups(total:number):MisCp014Group[]{
 const out:MisCp014Group[]=[];
 for(let a=4;a<=20;a++)for(let b=4;b<=20;b++)for(let c=4;c<=20;c++){
   const d=total-a-b-c;
   if(d<4||d>20)continue;if(new Set([a,b,c,d]).size<3)continue;
   const g={topLeft:a,topRight:b,bottomLeft:c,bottomRight:d};if(independentlySumMisCp014Group(g)===total)out.push(g);
 }
 return out;
}
function distractors(answer:number,target:MisCp014Group,total:number,corner:MisCp014Corner):MisCp014Option[]{
 const vals=Object.values(target),out:MisCp014Option[]=[];const add=(v:number,l:string)=>{if(Number.isInteger(v)&&v>0&&v<=99&&v!==answer&&!out.some(x=>x.value===v))out.push({value:v,errorLabel:l});};
 const known=(Object.entries(target) as [MisCp014Corner,number][]).filter(([k])=>k!==corner).map(([,v])=>v);
 add(known.reduce((a,b)=>a+b,0),'USED_KNOWN_SUM_DIRECTLY');
 add(Math.abs(total-known.reduce((a,b)=>a+b,0)-1),'OFF_BY_ONE_SUBTRACTION');
 add(Math.abs(total-known[0]!-known[1]!),'SUBTRACTED_ONLY_TWO_VISIBLE_VALUES');
 add(Math.abs(known[0]!+known[1]!-known[2]!),'MIXED_ADD_SUBTRACT');
 vals.forEach(v=>add(v,'REUSED_VISIBLE_CORNER'));
 return out;
}
function select(seed:string){
 const total=32+(hash(seed+':total')%29),groups=shuffle(buildGroups(total),seed+':groups');if(groups.length<3)throw new Error('CP014 group shortage');
 const evidence=[groups[0]!,groups[1]!];
 const target=groups.find(g=>!evidence.some(e=>JSON.stringify(e)===JSON.stringify(g)))!;
 const corners:MisCp014Corner[]=['topLeft','topRight','bottomLeft','bottomRight'];
 const missingCorner=corners[hash(seed+':corner')%corners.length]!;
 const answer=independentlySolveMisCp014Missing(target,total,missingCorner);
 if((target as any)[missingCorner]!==answer)throw new Error('CP014 inverse solver disagreement');
 if(distractors(answer,target,total,missingCorner).length<3)throw new Error('CP014 distractor shortage');
 return{total,evidence,target,missingCorner,answer};
}
export function generateMisCp014Question(candidateId:MisCp014CandidateId,seed:string|number='mis-cp014-v1'):GeneratedMisCp014Question{
 const rule=misCp014RuleByCandidateId(candidateId),base=String(seed),sel=select(base),make=(g:MisCp014Group,hide=false)=>{const positions:{[K in MisCp014Corner]:number|'?'}={...g};if(hide)positions[sel.missingCorner]='?';return{positions,svg:renderCornerOnlySvg(positions)};};
 const figures=[...sel.evidence.map(g=>make(g)),make(sel.target,true)],wrong=shuffle(distractors(sel.answer,sel.target,sel.total,sel.missingCorner),base+':opts').slice(0,3),ci=hash(base+candidateId)%4,options=[...wrong];options.splice(ci,0,{value:sel.answer,errorLabel:null});
 const stem=['Find the missing number in the following figures.','',...figures.map((f,i)=>`Figure ${i+1}:\n${preview(f.positions as any)}`)].join('\n\n');
 const trace=[...sel.evidence.map((g,i)=>`Figure ${i+1}: ${g.topLeft} + ${g.topRight} + ${g.bottomLeft} + ${g.bottomRight} = ${sel.total}`),`Target total = ${sel.total}; missing corner = ${sel.total} − sum of the other three corners = ${sel.answer}`];
 const explanation=['Each completed square has the same total when its four corner numbers are added.','',...trace,'',`So, ? = ${sel.answer}.`].join('\n');
 return{packageId:'MIS-001',checkpointId:'MIS-CP-014',candidateId,provisionalQl:true,ruleId:'INVARIANT_FOUR_CORNER_SUM_MISSING_CORNER',ruleFamily:rule.label,context:null,difficulty:'Medium',renderer:'SVG_BOX',stem,evidenceGroups:sel.evidence,target:sel.target,targetTotal:sel.total,missingCorner:sel.missingCorner,figures,options,correctIndex:ci,answer:sel.answer,explanation,solverTrace:trace,ambiguityAudit:{accepted:true,reason:'The repeated figures establish one common four-corner total; the target corner is uniquely determined by subtraction.'},structuralFingerprint:['MIS-CP-014','SUM_FOUR_CORNERS','INVARIANT_TOTAL','CORNER_MISSING',sel.missingCorner].join('|'),numericFingerprint:[...sel.evidence,sel.target].map(g=>Object.values(g).join(',')).join('|')+'|T='+sel.total,operationDepth:1,operandCount:4,groupCount:3,missingPosition:'CORNER_MISSING',forwardOrInverse:'INVERSE',sourceBacked:true,sourceNote:rule.sourceNote,semanticAuthorityCandidateId:'MIS-CAND-050',createsNewSemanticAuthority:false};
}
export const MIS_CP014_CANDIDATE_IDS=Object.freeze(MIS_CP014_RULES.map(r=>r.candidateId));
