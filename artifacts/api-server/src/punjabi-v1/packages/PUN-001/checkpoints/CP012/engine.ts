import { createRng } from "../../../../core/deterministic-rng";
import { semanticHash } from "../../../../core/semantic-hash";
import type { PunjabiDifficulty,PunjabiGeneratedQuestion } from "../../../../core/types";
import { CP012_AUTHORITIES,type CP012Authority } from "./CP012-authorities";

function norm(v:string){return v.normalize("NFC").trim();}
function ord(seed:number,cap:number){const n=Math.trunc(seed)-1;return ((n%cap)+cap)%cap;}
function uniq(v:readonly string[]){return [...new Set(v.map(norm).filter(Boolean))];}
function pickVariant(v:readonly string[],s:number){return v[ord(s+1,v.length)]!;}
function requireDiff(actual:PunjabiDifficulty,allowed:readonly PunjabiDifficulty[],id:string){if(!allowed.includes(actual))throw new Error(`CP012 ${id} does not support ${actual}`);}
function meaningTokens(value:string){
 return new Set(norm(value).replace(/[‘’“”"'.,;:!?()\-–—/]/g," ").split(/\s+/).filter(t=>t.length>1));
}
function meaningSimilarity(a:string,b:string){
 const aa=meaningTokens(a),bb=meaningTokens(b);
 if(!aa.size||!bb.size)return 0;
 let shared=0; for(const t of aa)if(bb.has(t))shared++;
 return shared/Math.max(aa.size,bb.size);
}
function contrastPeers(a:CP012Authority){
 const candidates=CP012_AUTHORITIES
  .filter(x=>x.id!==a.id)
  .map(x=>({x,score:meaningSimilarity(a.meaningPa,x.meaningPa)}))
  .filter(v=>v.score<0.6)
  .sort((p,q)=>q.score-p.score||p.x.id.localeCompare(q.x.id))
  .map(v=>v.x);
 if(candidates.length<8)throw new Error(`CP012 ${a.id}: fewer than eight safe semantic peers`);
 return candidates.slice(0,8);
}
function assemble(input:{seed:number;difficulty:PunjabiDifficulty;familyId:string;subtype:string;stem:string;correctAnswer:string;distractors:readonly string[];explanation:string;authorityIds:readonly string[]}):PunjabiGeneratedQuestion{
 const rng=createRng(`CP012:${input.familyId}:${input.seed}`);
 const correct=norm(input.correctAnswer);
 const ds=uniq(input.distractors).filter(x=>x!==correct);
 if(ds.length<3)throw new Error(`CP012 ${input.familyId}: fewer than three distractors`);
 const selected=rng.pickDistinct(ds,3);
 const options=rng.shuffle([correct,...selected]);
 const fingerprint=`CP012-${semanticHash([input.familyId,input.subtype,input.difficulty,norm(input.stem),correct,[...selected].sort().join("|"),[...input.authorityIds].sort().join(",")])}`;
 return {id:`PUN-001-CP012-${input.familyId}-${fingerprint}`,stem:norm(input.stem),options,correctIndex:options.indexOf(correct),explanation:norm(input.explanation),difficulty:input.difficulty,metadata:{engine:"punjabi-v1",packageId:"PUN-001",cpId:"PUN-001-CP012",familyId:input.familyId,subtype:input.subtype,difficulty:input.difficulty,language:"pa-Guru",seed:input.seed,authorityIds:input.authorityIds,generatorRevision:"1.0.0-forward-port",fingerprint,lifecycle:"REVIEW_ONLY"}};
}

export function generateCP012F01(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Easy"],"F01");
 const i=ord(seed,CP012_AUTHORITIES.length),a=CP012_AUTHORITIES[i]!;
 return assemble({seed,difficulty,familyId:"F01",subtype:"DIRECT_PROVERB_MEANING",stem:pickVariant([`ਅਖਾਣ ‘${a.proverbPa}’ ਦਾ ਸਹੀ ਭਾਵ ਕੀ ਹੈ?`,`‘${a.proverbPa}’ ਕਿਹੜੀ ਗੱਲ ਦਰਸਾਉਂਦਾ ਹੈ?`,`ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${a.proverbPa}’ ਦਾ ਢੁਕਵਾਂ ਅਰਥ ਚੁਣੋ।`],i),correctAnswer:a.meaningPa,distractors:a.distractors,explanation:a.explanationPa,authorityIds:[a.id]});
}

export function generateCP012F02(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Easy"],"F02");
 const i=ord(seed,CP012_AUTHORITIES.length),a=CP012_AUTHORITIES[i]!,ps=contrastPeers(a);
 return assemble({seed,difficulty,familyId:"F02",subtype:"FORWARD_PROVERB_COMPLETION",stem:pickVariant([`ਅਖਾਣ ਪੂਰਾ ਕਰੋ: ‘${a.firstPartPa} ____’`,`‘${a.firstPartPa}’ ਤੋਂ ਬਾਅਦ ਅਖਾਣ ਦਾ ਸਹੀ ਹਿੱਸਾ ਕਿਹੜਾ ਹੈ?`,`ਦਿੱਤੇ ਅਖਾਣ ਦਾ ਅਗਲਾ ਹਿੱਸਾ ਚੁਣੋ: ‘${a.firstPartPa} ____’`],i),correctAnswer:a.secondPartPa,distractors:ps.map(x=>x.secondPartPa),explanation:`ਪੂਰਾ ਅਖਾਣ ‘${a.proverbPa}’ ਹੈ।`,authorityIds:[a.id,...ps.slice(0,3).map(x=>x.id)]});
}

export function generateCP012F03(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Easy"],"F03");
 const i=ord(seed,CP012_AUTHORITIES.length),a=CP012_AUTHORITIES[i]!,ps=contrastPeers(a);
 return assemble({seed,difficulty,familyId:"F03",subtype:"MEANING_TO_PROVERB",stem:pickVariant([`‘${a.meaningPa}’ ਭਾਵ ਲਈ ਢੁਕਵਾਂ ਅਖਾਣ ਕਿਹੜਾ ਹੈ?`,`ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਅਖਾਣ ‘${a.meaningPa}’ ਦਾ ਭਾਵ ਦਿੰਦਾ ਹੈ?`,`ਦਿੱਤੇ ਭਾਵ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਅਖਾਣ ਚੁਣੋ: ‘${a.meaningPa}’`],i),correctAnswer:a.proverbPa,distractors:ps.map(x=>x.proverbPa),explanation:a.explanationPa,authorityIds:[a.id,...ps.slice(0,3).map(x=>x.id)]});
}

export function generateCP012F04(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F04");
 const i=ord(seed,CP012_AUTHORITIES.length),a=CP012_AUTHORITIES[i]!,ps=contrastPeers(a);
 return assemble({seed,difficulty,familyId:"F04",subtype:"REVERSE_PROVERB_COMPLETION",stem:pickVariant([`ਅਖਾਣ ਦਾ ਪਹਿਲਾ ਹਿੱਸਾ ਚੁਣੋ: ‘____ ${a.secondPartPa}’`,`‘${a.secondPartPa}’ ਨਾਲ ਪੂਰਾ ਹੋਣ ਵਾਲੇ ਅਖਾਣ ਦਾ ਪਹਿਲਾ ਹਿੱਸਾ ਕਿਹੜਾ ਹੈ?`,`ਦਿੱਤੇ ਅੰਤ ਤੋਂ ਅਖਾਣ ਪੂਰਾ ਕਰੋ: ‘____ ${a.secondPartPa}’`],i),correctAnswer:a.firstPartPa,distractors:ps.map(x=>x.firstPartPa),explanation:`ਪੂਰਾ ਅਖਾਣ ‘${a.proverbPa}’ ਹੈ।`,authorityIds:[a.id,...ps.slice(0,3).map(x=>x.id)]});
}

export function generateCP012F05(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F05");
 const i=ord(seed,CP012_AUTHORITIES.length),a=CP012_AUTHORITIES[i]!,ps=contrastPeers(a);
 return assemble({seed,difficulty,familyId:"F05",subtype:"AUTHORED_SITUATION_TO_PROVERB",stem:pickVariant([`ਹੇਠਾਂ ਦਿੱਤੀ ਸਥਿਤੀ ਲਈ ਸਭ ਤੋਂ ਢੁਕਵਾਂ ਅਖਾਣ ਕਿਹੜਾ ਹੈ?\n${a.situationPa}`,`ਦਿੱਤੇ ਪ੍ਰਸੰਗ ਨਾਲ ਕਿਹੜਾ ਅਖਾਣ ਸਭ ਤੋਂ ਵਧੀਆ ਮੇਲ ਖਾਂਦਾ ਹੈ?\n${a.situationPa}`,`ਇਸ ਸਥਿਤੀ ਨੂੰ ਦਰਸਾਉਣ ਲਈ ਸਹੀ ਅਖਾਣ ਚੁਣੋ।\n${a.situationPa}`],i),correctAnswer:a.proverbPa,distractors:ps.map(x=>x.proverbPa),explanation:a.explanationPa,authorityIds:[a.id,...ps.slice(0,3).map(x=>x.id)]});
}

function mapping(a:CP012Authority,b:CP012Authority=a){return `${a.proverbPa} — ${b.meaningPa}`;}
export function generateCP012F06(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F06");
 const i=ord(seed,CP012_AUTHORITIES.length),target=CP012_AUTHORITIES[i]!,ps=contrastPeers(target);
 const falsePairs=[
  mapping(ps[0]!,ps[1]!),
  mapping(ps[2]!,ps[3]!),
  mapping(ps[4]!,ps[5]!),
  mapping(ps[6]!,ps[7]!),
 ];
 return assemble({seed,difficulty,familyId:"F06",subtype:"CORRECT_PROVERB_MEANING_PAIR",stem:"ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਅਖਾਣ ਅਤੇ ਭਾਵ ਦਾ ਸਹੀ ਮੇਲ ਕਿਹੜਾ ਹੈ?",correctAnswer:mapping(target),distractors:falsePairs,explanation:`‘${target.proverbPa}’ ਦਾ ਸਹੀ ਭਾਵ ‘${target.meaningPa}’ ਹੈ।`,authorityIds:[target.id,...ps.map(x=>x.id)]});
}

function orderedPair(seed:number){
 const cap=CP012_AUTHORITIES.length*8,r=ord(seed,cap),firstIndex=Math.floor(r/8),first=CP012_AUTHORITIES[firstIndex]!,ps=contrastPeers(first),second=ps[r%8]!;
 return {r,first,second,ps};
}
export function generateCP012F07(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Hard"],"F07");
 const {r,first,second,ps}=orderedPair(seed),others=ps.filter(x=>x.id!==second.id);
 const correct=`${first.proverbPa} — ${second.proverbPa}`;
 const distractors=uniq([`${second.proverbPa} — ${first.proverbPa}`,`${first.proverbPa} — ${others[0]!.proverbPa}`,`${others[1]!.proverbPa} — ${second.proverbPa}`,`${others[2]!.proverbPa} — ${others[3]!.proverbPa}`]);
 return assemble({seed,difficulty,familyId:"F07",subtype:"ORDERED_DUAL_MEANING_TO_PROVERB",stem:pickVariant([`ਦੋਵੇਂ ਭਾਵਾਂ ਲਈ ਕ੍ਰਮਵਾਰ ਸਹੀ ਅਖਾਣ ਚੁਣੋ।\n1. ${first.meaningPa}\n2. ${second.meaningPa}`,`ਪਹਿਲੇ ਅਤੇ ਦੂਜੇ ਭਾਵ ਲਈ ਸਹੀ ਅਖਾਣ ਕ੍ਰਮਵਾਰ ਕਿਹੜੇ ਹਨ?\n1. ${first.meaningPa}\n2. ${second.meaningPa}`,`ਹੇਠਲੇ ਦੋ ਭਾਵਾਂ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਸਹੀ ਅਖਾਣ-ਜੋੜਾ ਚੁਣੋ।\n1. ${first.meaningPa}\n2. ${second.meaningPa}`],r),correctAnswer:correct,distractors,explanation:`ਪਹਿਲੇ ਭਾਵ ਲਈ ‘${first.proverbPa}’ ਅਤੇ ਦੂਜੇ ਲਈ ‘${second.proverbPa}’ ਸਹੀ ਅਖਾਣ ਹੈ।`,authorityIds:[first.id,second.id,...others.slice(0,4).map(x=>x.id)]});
}

const VERDICTS=["ਦੋਵੇਂ ਕਥਨ ਸਹੀ ਹਨ","ਕੇਵਲ ਕਥਨ 1 ਸਹੀ ਹੈ","ਕੇਵਲ ਕਥਨ 2 ਸਹੀ ਹੈ","ਦੋਵੇਂ ਕਥਨ ਗਲਤ ਹਨ"] as const;
export function generateCP012F08(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Hard"],"F08");
 const pairCap=CP012_AUTHORITIES.length*8,cap=pairCap*4,r=ord(seed,cap),pattern=r%4,pairSeed=Math.floor(r/4)+1,{first,second,ps}=orderedPair(pairSeed);
 const otherForFirst=ps.find(x=>x.id!==second.id)!;
 const secondPeers=contrastPeers(second),otherForSecond=secondPeers[ord(pairSeed,secondPeers.length)]!;
 const t1=pattern===0||pattern===1,t2=pattern===0||pattern===2;
 const claim1=`‘${first.proverbPa}’ ਦਾ ਭਾਵ ‘${t1?first.meaningPa:otherForFirst.meaningPa}’ ਹੈ।`;
 const claim2=`‘${second.proverbPa}’ ਦਾ ਭਾਵ ‘${t2?second.meaningPa:otherForSecond.meaningPa}’ ਹੈ।`;
 const correct=VERDICTS[pattern]!;
 return assemble({seed,difficulty,familyId:"F08",subtype:"DUAL_STATEMENT_VERIFICATION",stem:pickVariant([`ਕਥਨਾਂ ਦੀ ਸਹੀ ਸਥਿਤੀ ਚੁਣੋ।\nਕਥਨ 1: ${claim1}\nਕਥਨ 2: ${claim2}`,`ਹੇਠਲੇ ਦੋ ਅਖਾਣ–ਭਾਵ ਕਥਨਾਂ ਨੂੰ ਪਰਖੋ।\nਕਥਨ 1: ${claim1}\nਕਥਨ 2: ${claim2}`,`ਕਿਹੜਾ ਵਿਕਲਪ ਦੋਵੇਂ ਕਥਨਾਂ ਬਾਰੇ ਸਹੀ ਹੈ?\nਕਥਨ 1: ${claim1}\nਕਥਨ 2: ${claim2}`],r),correctAnswer:correct,distractors:VERDICTS,explanation:`‘${first.proverbPa}’ ਦਾ ਸਹੀ ਭਾਵ ‘${first.meaningPa}’ ਅਤੇ ‘${second.proverbPa}’ ਦਾ ਸਹੀ ਭਾਵ ‘${second.meaningPa}’ ਹੈ। ਇਸ ਲਈ ${correct}।`,authorityIds:[first.id,second.id,otherForFirst.id,otherForSecond.id]});
}

export const CP012_FAMILIES=[
 {familyId:"F01",subtype:"DIRECT_PROVERB_MEANING",targetDifficulties:["Easy"] as PunjabiDifficulty[],semanticCapacity:CP012_AUTHORITIES.length,generate:generateCP012F01},
 {familyId:"F02",subtype:"FORWARD_PROVERB_COMPLETION",targetDifficulties:["Easy"] as PunjabiDifficulty[],semanticCapacity:CP012_AUTHORITIES.length,generate:generateCP012F02},
 {familyId:"F03",subtype:"MEANING_TO_PROVERB",targetDifficulties:["Easy"] as PunjabiDifficulty[],semanticCapacity:CP012_AUTHORITIES.length,generate:generateCP012F03},
 {familyId:"F04",subtype:"REVERSE_PROVERB_COMPLETION",targetDifficulties:["Medium"] as PunjabiDifficulty[],semanticCapacity:CP012_AUTHORITIES.length,generate:generateCP012F04},
 {familyId:"F05",subtype:"AUTHORED_SITUATION_TO_PROVERB",targetDifficulties:["Medium"] as PunjabiDifficulty[],semanticCapacity:CP012_AUTHORITIES.length,generate:generateCP012F05},
 {familyId:"F06",subtype:"CORRECT_PROVERB_MEANING_PAIR",targetDifficulties:["Medium"] as PunjabiDifficulty[],semanticCapacity:CP012_AUTHORITIES.length,generate:generateCP012F06},
 {familyId:"F07",subtype:"ORDERED_DUAL_MEANING_TO_PROVERB",targetDifficulties:["Hard"] as PunjabiDifficulty[],semanticCapacity:CP012_AUTHORITIES.length*8,generate:generateCP012F07},
 {familyId:"F08",subtype:"DUAL_STATEMENT_VERIFICATION",targetDifficulties:["Hard"] as PunjabiDifficulty[],semanticCapacity:CP012_AUTHORITIES.length*8*4,generate:generateCP012F08},
] as const;

export function generateCP012Question(seed:number,difficulty:PunjabiDifficulty="Medium",requestedFamilyId?:string){
 const eligible=CP012_FAMILIES.filter(f=>f.targetDifficulties.includes(difficulty));
 const family=requestedFamilyId?CP012_FAMILIES.find(f=>f.familyId===requestedFamilyId):eligible[ord(seed,eligible.length)];
 if(!family)throw new Error(`Unknown CP012 family ${requestedFamilyId}`);
 if(!family.targetDifficulties.includes(difficulty))throw new Error(`${family.familyId} does not support ${difficulty}`);
 return family.generate(seed,difficulty);
}
export function getCP012BreadthReport(){
 const capacities=Object.fromEntries(CP012_FAMILIES.map(f=>[f.familyId,f.semanticCapacity]));
 return {totalAtomicAuthorities:CP012_AUTHORITIES.length,totalSemanticCapacity:CP012_FAMILIES.reduce((n,f)=>n+f.semanticCapacity,0),capacities};
}
