import {
  MEN_CP_012_SATURATION_V3_AUTHORITY,
  generateMenCp012SaturationV3,
  type MenCp012SaturationQuestion,
  type MenCp012SaturationV3Id,
} from "./saturation-v3";

export const MEN_CP_012_SATURATION_V3_SAFE_AUTHORITY = "MEN-CP012-SATURATION-WAVE-03-SAFE-V2" as const;
const LABELS=["A","B","C","D"] as const;

function hash(text:string){let h=2166136261>>>0;for(const c of text){h^=c.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}return h>>>0;}
function requestedPosition(seed:string,id:MenCp012SaturationV3Id){const m=/(\d+)$/.exec(seed);return m?Number(m[1])%4:hash(`${id}:${seed}:safe-pos`)%4;}
function gcd(a:number,b:number){a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a||1;}
function ratio(a:number,b:number){const g=gcd(a,b);return `${a/g}:${b/g}`;}
function tidy(value:number,digits=4){return value.toFixed(digits).replace(/0+$/,'').replace(/\.$/,'');}

function safeDistractors(answer:string){
  const ratioMatch=/^(\d+):(\d+)$/.exec(answer);
  if(ratioMatch){
    const a=Number(ratioMatch[1]),b=Number(ratioMatch[2]);
    const candidates=[ratio(b,a),ratio(a,2*b),ratio(2*a,b),ratio(a+b,b),ratio(a,a+b)];
    return [...new Set(candidates.filter((value)=>value!==answer))].slice(0,3);
  }
  const numeric=/^(-?\d+(?:\.\d+)?)\s*(.*)$/.exec(answer);
  if(!numeric) throw new Error(`Cannot build Wave 03 distractors for ${answer}`);
  const value=Number(numeric[1]),unit=numeric[2];
  const countLike=unit==="coins"||unit==="spheres"||unit==="cubes"||unit==="cylinders"||unit==="";
  const candidates:number[]=countLike
    ? [value/2,value*2,value*3,value+1,value+2]
    : unit==="%"
      ? [value+4,Math.max(1,value-4),value/2,value*2,value+10]
      : [value/2,value*2,value*3,value+1,value+2];
  const result:string[]=[];
  const seen=new Set([answer]);
  for(const candidate of candidates){
    if(!Number.isFinite(candidate)||candidate<=0)continue;
    if(countLike&&!Number.isInteger(candidate))continue;
    const display=`${Number.isInteger(candidate)?candidate:tidy(candidate)}${unit?` ${unit}`:''}`;
    if(seen.has(display))continue;
    seen.add(display);result.push(display);
    if(result.length===3)break;
  }
  if(result.length<3)throw new Error(`Could not build three Wave 03 distractors for ${answer}`);
  return result;
}

function rebuildOptions(question:MenCp012SaturationQuestion,position:number){
  const wrong=safeDistractors(question.answer);let wi=0;
  return LABELS.map((label,index)=>index===position
    ? {label,display:question.answer,isCorrect:true}
    : {label,display:wrong[wi++]!,isCorrect:false});
}

export function generateMenCp012SaturationV3Safe(id:MenCp012SaturationV3Id,seed:string):MenCp012SaturationQuestion&{
  safeAuthority:typeof MEN_CP_012_SATURATION_V3_SAFE_AUTHORITY;
  requestedSeed:string;
  constructionSeed:string;
}{
  const target=requestedPosition(seed,id);
  let base:MenCp012SaturationQuestion|null=null;
  let constructionSeed=seed;
  for(let cycle=0;cycle<96&&!base;cycle+=1){
    const attempt=target+cycle*4;
    constructionSeed=cycle===0?seed:`${seed}:safe:${attempt}`;
    try{
      const candidate=generateMenCp012SaturationV3(id,constructionSeed);
      if(candidate.correctIndex!==target)continue;
      base=candidate;
    }catch(error){
      if(!(error instanceof Error))throw error;
      if(!/distractor collapse|option displays not unique|verification failed/.test(error.message))throw error;
    }
  }
  if(!base)throw new Error(`${id}/${seed}: unable to construct safe source-backed state.`);
  const options=rebuildOptions(base,target);
  if(new Set(options.map((option)=>option.display)).size!==4)throw new Error(`${id}/${seed}: safe option uniqueness failed.`);
  return {...base,authority:MEN_CP_012_SATURATION_V3_AUTHORITY,seed,correctIndex:target,options,
    safeAuthority:MEN_CP_012_SATURATION_V3_SAFE_AUTHORITY,requestedSeed:seed,constructionSeed};
}
