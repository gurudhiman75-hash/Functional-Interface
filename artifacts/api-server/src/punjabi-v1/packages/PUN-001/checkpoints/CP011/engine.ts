import { createRng } from "../../../../core/deterministic-rng";
import { semanticHash } from "../../../../core/semantic-hash";
import type { PunjabiDifficulty,PunjabiGeneratedQuestion } from "../../../../core/types";
import { CP011_AUTHORITIES,type CP011Authority } from "./CP011-authorities";

function norm(v:string){return v.normalize("NFC").trim();}
function ord(seed:number,cap:number){const n=Math.trunc(seed)-1;return ((n%cap)+cap)%cap;}
function uniq(v:readonly string[]){return [...new Set(v.map(norm).filter(Boolean))];}
function pickVariant(v:readonly string[],s:number){return v[ord(s+1,v.length)]!;}
function requireDiff(actual:PunjabiDifficulty,allowed:readonly PunjabiDifficulty[],id:string){if(!allowed.includes(actual))throw new Error(`CP011 ${id} does not support ${actual}`);}
function tokens(s:string){return new Set(norm(s).replace(/[‘’“”"'.,;:!?()\-–—/]/g," ").split(/\s+/).filter(x=>x.length>1));}
function similarity(a:string,b:string){const A=tokens(a),B=tokens(b);let shared=0;for(const x of A)if(B.has(x))shared++;return shared/(A.size+B.size-shared||1);}
function safePeers(a:CP011Authority){return CP011_AUTHORITIES.filter(x=>x.id!==a.id&&similarity(a.meaningPa,x.meaningPa)<=0.2);}
const SAFE_ORDERED_PAIRS:{first:CP011Authority;second:CP011Authority}[]=[];
for(const first of CP011_AUTHORITIES)for(const second of safePeers(first))SAFE_ORDERED_PAIRS.push({first,second});

function assemble(input:{seed:number;difficulty:PunjabiDifficulty;familyId:string;subtype:string;stem:string;correctAnswer:string;distractors:readonly string[];explanation:string;authorityIds:readonly string[]}):PunjabiGeneratedQuestion{
 const rng=createRng(`CP011-RETROFIT:${input.familyId}:${input.seed}`);
 const correct=norm(input.correctAnswer);
 const ds=uniq(input.distractors).filter(x=>x!==correct);
 if(ds.length<3)throw new Error(`CP011 ${input.familyId}: fewer than three distractors`);
 const selected=rng.pickDistinct(ds,3);
 const options=rng.shuffle([correct,...selected]);
 const semanticParts=[input.familyId,input.subtype,input.difficulty,norm(input.stem),correct,[...selected].sort().join("|"),[...input.authorityIds].sort().join(",")];
 const fingerprint=`CP011-${semanticHash(semanticParts)}${semanticHash(["SECONDARY",...semanticParts].reverse())}`;
 return {id:`PUN-001-CP011-${input.familyId}-${fingerprint}`,stem:norm(input.stem),options,correctIndex:options.indexOf(correct),explanation:norm(input.explanation),difficulty:input.difficulty,metadata:{engine:"punjabi-v1",packageId:"PUN-001",cpId:"PUN-001-CP011",familyId:input.familyId,subtype:input.subtype,difficulty:input.difficulty,language:"pa-Guru",seed:input.seed,authorityIds:input.authorityIds,generatorRevision:"2.0.0-retrofit-exhaustive",fingerprint,lifecycle:"REVIEW_ONLY"}};
}
function pickSafe(a:CP011Authority,count:number,seed:number){const p=safePeers(a);if(p.length<count)throw new Error(`CP011 ${a.id}: insufficient safe peers`);return createRng(`CP011:SAFE:${a.id}:${seed}`).pickDistinct(p,count);}
function mapping(a:CP011Authority,b:CP011Authority=a){return `${a.idiomPa} — ${b.meaningPa}`;}

export function generateCP011F01(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Easy"],"F01");const i=ord(seed,CP011_AUTHORITIES.length),a=CP011_AUTHORITIES[i]!,ps=pickSafe(a,4,seed);
 return assemble({seed,difficulty,familyId:"F01",subtype:"DIRECT_IDIOM_MEANING",stem:pickVariant([`ਮੁਹਾਵਰੇ ‘${a.idiomPa}’ ਦਾ ਸਹੀ ਅਰਥ ਕਿਹੜਾ ਹੈ?`,`‘${a.idiomPa}’ ਮੁਹਾਵਰਾ ਕਿਹੜਾ ਭਾਵ ਪ੍ਰਗਟ ਕਰਦਾ ਹੈ?`,`ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${a.idiomPa}’ ਦਾ ਢੁਕਵਾਂ ਅਰਥ ਚੁਣੋ।`],i),correctAnswer:a.meaningPa,distractors:ps.map(x=>x.meaningPa),explanation:a.explanationPa,authorityIds:[a.id,...ps.map(x=>x.id)]});
}
export function generateCP011F02(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Easy"],"F02");const i=ord(seed,CP011_AUTHORITIES.length),a=CP011_AUTHORITIES[i]!,ps=pickSafe(a,4,seed+17);
 return assemble({seed,difficulty,familyId:"F02",subtype:"DIRECT_MEANING_TO_IDIOM",stem:pickVariant([`‘${a.meaningPa}’ ਭਾਵ ਲਈ ਢੁਕਵਾਂ ਮੁਹਾਵਰਾ ਕਿਹੜਾ ਹੈ?`,`ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਮੁਹਾਵਰਾ ‘${a.meaningPa}’ ਦਾ ਭਾਵ ਦਿੰਦਾ ਹੈ?`,`ਦਿੱਤੇ ਭਾਵ ‘${a.meaningPa}’ ਨਾਲ ਕਿਹੜਾ ਮੁਹਾਵਰਾ ਮੇਲ ਖਾਂਦਾ ਹੈ?`],i),correctAnswer:a.idiomPa,distractors:ps.map(x=>x.idiomPa),explanation:a.explanationPa,authorityIds:[a.id,...ps.map(x=>x.id)]});
}
export function generateCP011F03(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F03");const i=ord(seed,CP011_AUTHORITIES.length),a=CP011_AUTHORITIES[i]!,ps=pickSafe(a,4,seed+29);
 return assemble({seed,difficulty,familyId:"F03",subtype:"AUTHORED_CONTEXT_TO_IDIOM",stem:pickVariant([`ਵਾਕ ਦੇ ਪ੍ਰਸੰਗ ਅਨੁਸਾਰ ਖ਼ਾਲੀ ਥਾਂ ਲਈ ਸਭ ਤੋਂ ਢੁਕਵਾਂ ਮੁਹਾਵਰਾ ਚੁਣੋ।\n${a.contextSentence}`,`ਦਿੱਤੇ ਵਾਕ ਵਿੱਚ ਖ਼ਾਲੀ ਥਾਂ ਨੂੰ ਸਹੀ ਮੁਹਾਵਰੇ ਨਾਲ ਪੂਰਾ ਕਰੋ।\n${a.contextSentence}`,`ਪ੍ਰਸੰਗ ਦੇ ਭਾਵ ਅਨੁਸਾਰ ਸਹੀ ਮੁਹਾਵਰਾ ਕਿਹੜਾ ਹੈ?\n${a.contextSentence}`],i),correctAnswer:a.idiomPa,distractors:ps.map(x=>x.idiomPa),explanation:a.explanationPa,authorityIds:[a.id,...ps.map(x=>x.id)]});
}
export function generateCP011F04(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F04");const i=ord(seed,CP011_AUTHORITIES.length),a=CP011_AUTHORITIES[i]!,ps=pickSafe(a,3,seed+41);
 return assemble({seed,difficulty,familyId:"F04",subtype:"FIGURATIVE_PRECISION",stem:pickVariant([`‘${a.idiomPa}’ ਦਾ ਮੁਹਾਵਰੇਦਾਰ ਅਰਥ ਚੁਣੋ।`,`‘${a.idiomPa}’ ਨੂੰ ਸ਼ਾਬਦਿਕ ਨਹੀਂ, ਮੁਹਾਵਰੇਦਾਰ ਭਾਵ ਵਿੱਚ ਸਮਝੋ। ਸਹੀ ਅਰਥ ਕਿਹੜਾ ਹੈ?`,`ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${a.idiomPa}’ ਦਾ ਲੱਛਣਿਕ ਭਾਵ ਕਿਹੜਾ ਹੈ?`],i),correctAnswer:a.meaningPa,distractors:[a.literalTrapPa,ps[0]!.meaningPa,ps[1]!.meaningPa,ps[2]!.meaningPa],explanation:a.explanationPa,authorityIds:[a.id,...ps.map(x=>x.id)]});
}
export function generateCP011F05(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F05");const i=ord(seed,CP011_AUTHORITIES.length),a=CP011_AUTHORITIES[i]!,ps=pickSafe(a,8,seed+53);
 return assemble({seed,difficulty,familyId:"F05",subtype:"CORRECT_IDIOM_MEANING_PAIR",stem:"ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਮੁਹਾਵਰੇ ਅਤੇ ਅਰਥ ਦਾ ਸਹੀ ਮੇਲ ਕਿਹੜਾ ਹੈ?",correctAnswer:mapping(a),distractors:[mapping(ps[0]!,ps[1]!),mapping(ps[2]!,ps[3]!),mapping(ps[4]!,ps[5]!),mapping(ps[6]!,ps[7]!)],explanation:`‘${a.idiomPa}’ ਦਾ ਸਹੀ ਅਰਥ ‘${a.meaningPa}’ ਹੈ।`,authorityIds:[a.id,...ps.map(x=>x.id)]});
}
export function generateCP011F06(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F06");const i=ord(seed,SAFE_ORDERED_PAIRS.length),{first,second}=SAFE_ORDERED_PAIRS[i]!,valid=pickSafe(first,3,seed+67);
 return assemble({seed,difficulty,familyId:"F06",subtype:"INCORRECT_IDIOM_MEANING_PAIR",stem:"ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਮੁਹਾਵਰੇ ਅਤੇ ਅਰਥ ਦਾ ਗ਼ਲਤ ਮੇਲ ਕਿਹੜਾ ਹੈ?",correctAnswer:mapping(first,second),distractors:valid.map(x=>mapping(x)),explanation:`‘${first.idiomPa}’ ਦਾ ਸਹੀ ਅਰਥ ‘${first.meaningPa}’ ਹੈ।`,authorityIds:[first.id,second.id,...valid.map(x=>x.id)]});
}
export function generateCP011F07(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Hard"],"F07");const i=ord(seed,SAFE_ORDERED_PAIRS.length),{first,second}=SAFE_ORDERED_PAIRS[i]!,ps=pickSafe(first,4,seed+79).filter(x=>x.id!==second.id);const alt=ps.length>=3?ps:pickSafe(first,6,seed+83).filter(x=>x.id!==second.id);
 const correct=`${first.idiomPa} — ${second.idiomPa}`,distractors=uniq([`${second.idiomPa} — ${first.idiomPa}`,`${first.idiomPa} — ${alt[0]!.idiomPa}`,`${alt[1]!.idiomPa} — ${second.idiomPa}`,`${alt[1]!.idiomPa} — ${alt[2]!.idiomPa}`]);
 return assemble({seed,difficulty,familyId:"F07",subtype:"ORDERED_DUAL_MEANING_TO_IDIOM",stem:pickVariant([`ਦੋਵੇਂ ਅਰਥਾਂ ਲਈ ਕ੍ਰਮਵਾਰ ਸਹੀ ਮੁਹਾਵਰੇ ਚੁਣੋ।\n1. ${first.meaningPa}\n2. ${second.meaningPa}`,`ਪਹਿਲੇ ਅਤੇ ਦੂਜੇ ਭਾਵ ਲਈ ਸਹੀ ਮੁਹਾਵਰੇ ਕ੍ਰਮਵਾਰ ਕਿਹੜੇ ਹਨ?\n1. ${first.meaningPa}\n2. ${second.meaningPa}`,`ਹੇਠਲੇ ਦੋ ਭਾਵਾਂ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਸਹੀ ਮੁਹਾਵਰਾ-ਜੋੜਾ ਚੁਣੋ।\n1. ${first.meaningPa}\n2. ${second.meaningPa}`],i),correctAnswer:correct,distractors,explanation:`ਪਹਿਲੇ ਭਾਵ ਲਈ ‘${first.idiomPa}’ ਅਤੇ ਦੂਜੇ ਲਈ ‘${second.idiomPa}’ ਸਹੀ ਮੁਹਾਵਰਾ ਹੈ।`,authorityIds:[first.id,second.id,...alt.slice(0,3).map(x=>x.id)]});
}
const VERDICTS=["ਦੋਵੇਂ ਕਥਨ ਸਹੀ ਹਨ","ਕੇਵਲ ਕਥਨ 1 ਸਹੀ ਹੈ","ਕੇਵਲ ਕਥਨ 2 ਸਹੀ ਹੈ","ਦੋਵੇਂ ਕਥਨ ਗਲਤ ਹਨ"] as const;
export function generateCP011F08(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Hard"],"F08");const pairCap=SAFE_ORDERED_PAIRS.length,cap=pairCap*4,r=ord(seed,cap),pattern=r%4,pairIndex=Math.floor(r/4),{first,second}=SAFE_ORDERED_PAIRS[pairIndex]!;
 const firstWrong=pickSafe(first,1,pairIndex+101)[0]!,secondWrong=pickSafe(second,1,pairIndex+131)[0]!,t1=pattern===0||pattern===1,t2=pattern===0||pattern===2;
 const claim1=`‘${first.idiomPa}’ ਦਾ ਅਰਥ ‘${t1?first.meaningPa:firstWrong.meaningPa}’ ਹੈ।`,claim2=`‘${second.idiomPa}’ ਦਾ ਅਰਥ ‘${t2?second.meaningPa:secondWrong.meaningPa}’ ਹੈ।`,correct=VERDICTS[pattern]!;
 return assemble({seed,difficulty,familyId:"F08",subtype:"DUAL_STATEMENT_VERIFICATION",stem:pickVariant([`ਕਥਨਾਂ ਦੀ ਸਹੀ ਸਥਿਤੀ ਚੁਣੋ।\nਕਥਨ 1: ${claim1}\nਕਥਨ 2: ${claim2}`,`ਹੇਠਲੇ ਦੋ ਮੁਹਾਵਰਾ–ਅਰਥ ਕਥਨਾਂ ਨੂੰ ਪਰਖੋ।\nਕਥਨ 1: ${claim1}\nਕਥਨ 2: ${claim2}`,`ਕਿਹੜਾ ਵਿਕਲਪ ਦੋਵੇਂ ਕਥਨਾਂ ਬਾਰੇ ਸਹੀ ਹੈ?\nਕਥਨ 1: ${claim1}\nਕਥਨ 2: ${claim2}`],r),correctAnswer:correct,distractors:VERDICTS,explanation:`‘${first.idiomPa}’ ਦਾ ਸਹੀ ਅਰਥ ‘${first.meaningPa}’ ਅਤੇ ‘${second.idiomPa}’ ਦਾ ਸਹੀ ਅਰਥ ‘${second.meaningPa}’ ਹੈ। ਇਸ ਲਈ ${correct}।`,authorityIds:[first.id,second.id,firstWrong.id,secondWrong.id]});
}
export const CP011_FAMILIES=[
 {familyId:"F01",subtype:"DIRECT_IDIOM_MEANING",targetDifficulties:["Easy"] as PunjabiDifficulty[],semanticCapacity:CP011_AUTHORITIES.length,generate:generateCP011F01},
 {familyId:"F02",subtype:"DIRECT_MEANING_TO_IDIOM",targetDifficulties:["Easy"] as PunjabiDifficulty[],semanticCapacity:CP011_AUTHORITIES.length,generate:generateCP011F02},
 {familyId:"F03",subtype:"AUTHORED_CONTEXT_TO_IDIOM",targetDifficulties:["Medium"] as PunjabiDifficulty[],semanticCapacity:CP011_AUTHORITIES.length,generate:generateCP011F03},
 {familyId:"F04",subtype:"FIGURATIVE_PRECISION",targetDifficulties:["Medium"] as PunjabiDifficulty[],semanticCapacity:CP011_AUTHORITIES.length,generate:generateCP011F04},
 {familyId:"F05",subtype:"CORRECT_IDIOM_MEANING_PAIR",targetDifficulties:["Medium"] as PunjabiDifficulty[],semanticCapacity:CP011_AUTHORITIES.length,generate:generateCP011F05},
 {familyId:"F06",subtype:"INCORRECT_IDIOM_MEANING_PAIR",targetDifficulties:["Medium"] as PunjabiDifficulty[],semanticCapacity:SAFE_ORDERED_PAIRS.length,generate:generateCP011F06},
 {familyId:"F07",subtype:"ORDERED_DUAL_MEANING_TO_IDIOM",targetDifficulties:["Hard"] as PunjabiDifficulty[],semanticCapacity:SAFE_ORDERED_PAIRS.length,generate:generateCP011F07},
 {familyId:"F08",subtype:"DUAL_STATEMENT_VERIFICATION",targetDifficulties:["Hard"] as PunjabiDifficulty[],semanticCapacity:SAFE_ORDERED_PAIRS.length*4,generate:generateCP011F08},
] as const;
export function generateCP011Question(seed:number,difficulty:PunjabiDifficulty="Medium",requestedFamilyId?:string){const eligible=CP011_FAMILIES.filter(f=>f.targetDifficulties.includes(difficulty));const family=requestedFamilyId?CP011_FAMILIES.find(f=>f.familyId===requestedFamilyId):eligible[ord(seed,eligible.length)];if(!family)throw new Error(`Unknown CP011 family ${requestedFamilyId}`);if(!family.targetDifficulties.includes(difficulty))throw new Error(`${family.familyId} does not support ${difficulty}`);return family.generate(seed,difficulty);}
export function getCP011BreadthReport(){const capacities=Object.fromEntries(CP011_FAMILIES.map(f=>[f.familyId,f.semanticCapacity]));return{totalAtomicAuthorities:CP011_AUTHORITIES.length,safeOrderedPairs:SAFE_ORDERED_PAIRS.length,totalSemanticCapacity:CP011_FAMILIES.reduce((n,f)=>n+f.semanticCapacity,0),capacities};}
