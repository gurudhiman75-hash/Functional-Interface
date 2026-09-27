import{oppositeSquareWheelPreview,renderOppositeSquareWheelSvg}from'../visual-runtime';
import{MIS_CP026_RULES,misCp026RuleByCandidateId,type MisCp026CandidateId}from'./rule-definitions';
import{independentlyEvaluateMisCp026,independentlyVerifyMisCp026Pair,type MisCp026Pair}from'./independent-solver';

export interface MisCp026Option{readonly value:number;readonly errorLabel:string|null;}
export interface MisCp026RenderedFigure{
 readonly positions:{readonly pairs:readonly[
  readonly[number,number],
  readonly[number,number],
  readonly[number,number],
  readonly[number,number|'?']
 ]};
 readonly svg:string;
}
export interface GeneratedMisCp026Question{
 readonly packageId:'MIS-001';readonly checkpointId:'MIS-CP-026';readonly candidateId:MisCp026CandidateId;readonly provisionalQl:true;
 readonly ruleId:'OPPOSITE_PAIR_SQUARE';readonly ruleFamily:string;readonly context:null;readonly difficulty:'Easy';readonly renderer:'SVG_OPPOSITE_SQUARE_WHEEL';
 readonly stem:string;readonly evidenceGroups:readonly MisCp026Pair[];readonly target:MisCp026Pair;readonly figures:readonly[MisCp026RenderedFigure];
 readonly options:readonly MisCp026Option[];readonly correctIndex:number;readonly answer:number;readonly explanation:string;readonly solverTrace:readonly string[];
 readonly ambiguityAudit:{readonly accepted:true;readonly survivingRules:readonly['SQUARE_INPUT'];readonly reason:string};
 readonly structuralFingerprint:string;readonly numericFingerprint:string;readonly operationDepth:1;readonly operandCount:1;readonly groupCount:4;
 readonly missingPosition:'OPPOSITE_OUTPUT';readonly forwardOrInverse:'FORWARD';readonly sourceBacked:true;readonly sourceNote:string;
 readonly semanticAuthorityCandidateId:'MIS-CAND-016';readonly createsNewSemanticAuthority:false;readonly wholeNumberOrDigitMode:'WHOLE_NUMBER';
 readonly semanticPositions:readonly['pair1Input','pair1Output','pair2Input','pair2Output','pair3Input','pair3Output','targetInput','targetOutput'];
}
function hash(v:string){let h=2166136261;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed:string){let s=hash(seed)||1;return()=>{s+=0x6d2b79f5;let v=s;v=Math.imul(v^(v>>>15),v|1);v^=v+Math.imul(v^(v>>>7),v|61);return((v^(v>>>14))>>>0)/4294967296;};}
function shuffle<T>(a:readonly T[],seed:string){const o=[...a],r=rng(seed);for(let i=o.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[o[i],o[j]]=[o[j]!,o[i]!];}return o;}
function distractors(pair:MisCp026Pair):MisCp026Option[]{
 const n=pair.input,correct=pair.output,out:MisCp026Option[]=[];
 const add=(v:number,l:string)=>{if(Number.isInteger(v)&&v>0&&v<=999&&v!==correct&&!out.some(x=>x.value===v))out.push({value:v,errorLabel:l});};
 add(n*2,'DOUBLED_INSTEAD_OF_SQUARED');
 add(n*n+n,'ADDED_INPUT_AFTER_SQUARING');
 add(n*n-n,'SUBTRACTED_INPUT_AFTER_SQUARING');
 add(n*n*n,'CUBED_INSTEAD_OF_SQUARED');
 add((n+1)*(n+1),'SQUARED_NEXT_INTEGER');
 return out;
}
function select(seed:string){
 const inputs=shuffle(Array.from({length:11},(_,i)=>i+2),seed+':inputs').slice(0,4);
 const pairs=inputs.map(input=>({input,output:input*input}));
 const evidence=pairs.slice(0,3),target=pairs[3]!;
 if(!evidence.every(independentlyVerifyMisCp026Pair)||!independentlyVerifyMisCp026Pair(target)||distractors(target).length<3)throw new Error('CP026 construction failed');
 return{evidence,target};
}
export function generateMisCp026Question(candidateId:MisCp026CandidateId,seed:string|number='mis-cp026-v1'):GeneratedMisCp026Question{
 const rule=misCp026RuleByCandidateId(candidateId),base=String(seed),sel=select(base);
 const answer=independentlyEvaluateMisCp026(sel.target.input);
 if(answer!==sel.target.output)throw new Error('CP026 solver disagreement');
 const wrong=shuffle(distractors(sel.target),base+':opts').slice(0,3),ci=hash(base+candidateId)%4;
 const options=[...wrong];options.splice(ci,0,{value:answer,errorLabel:null});
 const pairs=[
  [sel.evidence[0]!.input,sel.evidence[0]!.output],
  [sel.evidence[1]!.input,sel.evidence[1]!.output],
  [sel.evidence[2]!.input,sel.evidence[2]!.output],
  [sel.target.input,'?' as const],
 ] as const;
 const positions={pairs},figure={positions,svg:renderOppositeSquareWheelSvg(positions)};
 const explanation=[
  'Look at the numbers placed at opposite ends of each line.',
  'The number at one end is the square of the number at the opposite end.',
  '',
  ...sel.evidence.map((p,i)=>`Pair ${i+1}: ${p.input}² = ${p.output}`),
  '',
  `Target pair: ${sel.target.input}² = ${answer}`,
  `So, ? = ${answer}.`,
 ].join('\n');
 return{
  packageId:'MIS-001',checkpointId:'MIS-CP-026',candidateId,provisionalQl:true,ruleId:'OPPOSITE_PAIR_SQUARE',ruleFamily:rule.label,context:null,
  difficulty:'Easy',renderer:'SVG_OPPOSITE_SQUARE_WHEEL',
  stem:['Study the figure and find the number that will replace the question mark (?).','',oppositeSquareWheelPreview(positions)].join('\n\n'),
  evidenceGroups:sel.evidence,target:sel.target,figures:[figure],options,correctIndex:ci,answer,explanation,
  solverTrace:[...sel.evidence.map(p=>`${p.input}²=${p.output}`),`${sel.target.input}²=${answer}`],
  ambiguityAudit:{accepted:true,survivingRules:['SQUARE_INPUT'],reason:'Three complete opposite pairs establish the square relation; the fourth output is uniquely determined.'},
  structuralFingerprint:'MIS-CP-026|SQUARE_INPUT|SVG_OPPOSITE_SQUARE_WHEEL|OPPOSITE_OUTPUT_MISSING|SOURCE_BACKED',
  numericFingerprint:[...sel.evidence,sel.target].map(p=>`${p.input}:${p.output}`).join('|'),
  operationDepth:1,operandCount:1,groupCount:4,missingPosition:'OPPOSITE_OUTPUT',forwardOrInverse:'FORWARD',sourceBacked:true,sourceNote:rule.sourceNote,
  semanticAuthorityCandidateId:'MIS-CAND-016',createsNewSemanticAuthority:false,wholeNumberOrDigitMode:'WHOLE_NUMBER',
  semanticPositions:['pair1Input','pair1Output','pair2Input','pair2Output','pair3Input','pair3Output','targetInput','targetOutput'],
 };
}
export const MIS_CP026_CANDIDATE_IDS=Object.freeze(MIS_CP026_RULES.map(r=>r.candidateId));
