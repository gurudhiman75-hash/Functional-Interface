import { createRng } from "../../../../core/deterministic-rng";
import { semanticHash } from "../../../../core/semantic-hash";
import type { PunjabiDifficulty,PunjabiGeneratedQuestion } from "../../../../core/types";
import { CP010_AUTHORITIES,CP010_DOMAINS,cp010ItemsInDomain,type CP010Authority } from "./CP010-authorities";

function norm(v:string){return v.normalize("NFC").trim();}
function ord(seed:number,cap:number){const n=Math.trunc(seed)-1;return ((n%cap)+cap)%cap;}
function uniq(v:readonly string[]){return [...new Set(v.map(norm).filter(Boolean))];}
function pickVariant(v:readonly string[],s:number){return v[ord(s+1,v.length)]!;}
function requireDiff(actual:PunjabiDifficulty,allowed:readonly PunjabiDifficulty[],id:string){if(!allowed.includes(actual))throw new Error(`CP010 ${id} does not support ${actual}`);}
function peers(a:CP010Authority){return cp010ItemsInDomain(a.domain).filter(x=>x.id!==a.id);}
function crossDomain(a:CP010Authority){return CP010_AUTHORITIES.filter(x=>x.domain!==a.domain);}

const ORDERED_DOMAIN_PAIRS:{first:CP010Authority;second:CP010Authority}[]=[];
for(const domain of CP010_DOMAINS){
 const items=cp010ItemsInDomain(domain);
 for(const first of items)for(const second of items)if(first.id!==second.id)ORDERED_DOMAIN_PAIRS.push({first,second});
}

function assemble(input:{seed:number;difficulty:PunjabiDifficulty;familyId:string;subtype:string;stem:string;correctAnswer:string;distractors:readonly string[];explanation:string;authorityIds:readonly string[]}):PunjabiGeneratedQuestion{
 const rng=createRng(`CP010-RETROFIT:${input.familyId}:${input.seed}`);
 const correct=norm(input.correctAnswer);
 const ds=uniq(input.distractors).filter(x=>x!==correct);
 if(ds.length<3)throw new Error(`CP010 ${input.familyId}: fewer than three distractors`);
 const selected=rng.pickDistinct(ds,3);
 const options=rng.shuffle([correct,...selected]);
 const fingerprint=`CP010-${semanticHash([input.familyId,input.subtype,input.difficulty,norm(input.stem),correct,[...selected].sort().join("|"),[...input.authorityIds].sort().join(",")])}`;
 return {id:`PUN-001-CP010-${input.familyId}-${fingerprint}`,stem:norm(input.stem),options,correctIndex:options.indexOf(correct),explanation:norm(input.explanation),difficulty:input.difficulty,metadata:{engine:"punjabi-v1",packageId:"PUN-001",cpId:"PUN-001-CP010",familyId:input.familyId,subtype:input.subtype,difficulty:input.difficulty,language:"pa-Guru",seed:input.seed,authorityIds:input.authorityIds,generatorRevision:"2.0.0-retrofit-exhaustive",fingerprint,lifecycle:"REVIEW_ONLY"}};
}

function easyWordDistractors(a:CP010Authority,seed:number){return createRng(`CP010:EW:${seed}`).pickDistinct(crossDomain(a),3).map(x=>x.wordPa);}
function easyPhraseDistractors(a:CP010Authority,seed:number){return createRng(`CP010:EP:${seed}`).pickDistinct(crossDomain(a),3).map(x=>x.phrasePa);}
function mapping(a:CP010Authority,b:CP010Authority=a){return `${a.phrasePa} — ${b.wordPa}`;}

export function generateCP010F01(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Easy"],"F01");
 const i=ord(seed,CP010_AUTHORITIES.length),a=CP010_AUTHORITIES[i]!;
 return assemble({seed,difficulty,familyId:"F01",subtype:"DIRECT_PHRASE_TO_WORD",stem:pickVariant([`‘${a.phrasePa}’ ਲਈ ਢੁਕਵਾਂ ਇੱਕ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,`ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${a.phrasePa}’ ਦਾ ਭਾਵ ਇੱਕ ਸ਼ਬਦ ਵਿੱਚ ਕਿਹੜਾ ਹੈ?`,`‘${a.phrasePa}’ ਦੀ ਥਾਂ ਵਰਤਿਆ ਜਾਣ ਵਾਲਾ ਸਹੀ ਸ਼ਬਦ ਚੁਣੋ।`],i),correctAnswer:a.wordPa,distractors:easyWordDistractors(a,seed),explanation:a.explanationPa,authorityIds:[a.id]});
}

export function generateCP010F02(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Easy"],"F02");
 const i=ord(seed,CP010_AUTHORITIES.length),a=CP010_AUTHORITIES[i]!;
 return assemble({seed,difficulty,familyId:"F02",subtype:"DIRECT_WORD_TO_PHRASE",stem:pickVariant([`‘${a.wordPa}’ ਦਾ ਸਹੀ ਅਰਥ ਕਿਹੜਾ ਹੈ?`,`ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਾਕੰਸ਼ ‘${a.wordPa}’ ਦਾ ਭਾਵ ਦੱਸਦਾ ਹੈ?`,`‘${a.wordPa}’ ਕਿਸ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?`],i),correctAnswer:a.phrasePa,distractors:easyPhraseDistractors(a,seed),explanation:a.explanationPa,authorityIds:[a.id]});
}

export function generateCP010F03(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F03");
 const i=ord(seed,CP010_AUTHORITIES.length),a=CP010_AUTHORITIES[i]!,ps=peers(a);
 return assemble({seed,difficulty,familyId:"F03",subtype:"SAME_DOMAIN_PHRASE_PRECISION",stem:pickVariant([`‘${a.phrasePa}’ ਲਈ ਸਭ ਤੋਂ ਸਹੀ ਸ਼ਬਦ ਚੁਣੋ।`,`ਇੱਕੋ ਅਰਥ-ਖੇਤਰ ਦੇ ਸ਼ਬਦਾਂ ਵਿੱਚੋਂ ‘${a.phrasePa}’ ਲਈ ਢੁਕਵਾਂ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,`ਦਿੱਤੇ ਨੇੜਲੇ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ‘${a.phrasePa}’ ਦਾ ਸਹੀ ਇੱਕ-ਸ਼ਬਦੀ ਰੂਪ ਚੁਣੋ।`],i),correctAnswer:a.wordPa,distractors:ps.map(x=>x.wordPa),explanation:a.explanationPa,authorityIds:[a.id,...ps.map(x=>x.id)]});
}

export function generateCP010F04(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F04");
 const i=ord(seed,CP010_AUTHORITIES.length),a=CP010_AUTHORITIES[i]!,ps=peers(a);
 return assemble({seed,difficulty,familyId:"F04",subtype:"SAME_DOMAIN_DEFINITION_PRECISION",stem:pickVariant([`‘${a.wordPa}’ ਦੀ ਸਭ ਤੋਂ ਸਹੀ ਪਰਿਭਾਸ਼ਾ ਚੁਣੋ।`,`ਇੱਕੋ ਅਰਥ-ਖੇਤਰ ਦੀਆਂ ਪਰਿਭਾਸ਼ਾਵਾਂ ਵਿੱਚੋਂ ‘${a.wordPa}’ ਲਈ ਸਹੀ ਪਰਿਭਾਸ਼ਾ ਕਿਹੜੀ ਹੈ?`,`‘${a.wordPa}’ ਦਾ ਠੀਕ ਭਾਵ ਦਰਸਾਉਣ ਵਾਲਾ ਵਾਕੰਸ਼ ਚੁਣੋ।`],i),correctAnswer:a.phrasePa,distractors:ps.map(x=>x.phrasePa),explanation:a.explanationPa,authorityIds:[a.id,...ps.map(x=>x.id)]});
}

export function generateCP010F05(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F05");
 const i=ord(seed,ORDERED_DOMAIN_PAIRS.length),{first:target,second:wrong}=ORDERED_DOMAIN_PAIRS[i]!;
 const otherPeers=peers(target).filter(x=>x.id!==wrong.id);
 const valid=[target,...otherPeers].slice(0,3);
 return assemble({seed,difficulty,familyId:"F05",subtype:"INCORRECT_MAPPING",stem:"ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਾਕੰਸ਼–ਸ਼ਬਦ ਮੇਲ ਗ਼ਲਤ ਹੈ?",correctAnswer:mapping(target,wrong),distractors:valid.map(x=>mapping(x)),explanation:`‘${target.phrasePa}’ ਲਈ ਸਹੀ ਸ਼ਬਦ ‘${target.wordPa}’ ਹੈ।`,authorityIds:[target.id,wrong.id,...valid.map(x=>x.id)]});
}

export function generateCP010F06(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F06");
 const i=ord(seed,CP010_AUTHORITIES.length),target=CP010_AUTHORITIES[i]!,ps=peers(target);
 const chosen=ps.slice(0,3);
 const falsePairs=chosen.map((p,j)=>mapping(p,chosen[(j+1)%chosen.length]!));
 return assemble({seed,difficulty,familyId:"F06",subtype:"CORRECT_MAPPING",stem:"ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਵਾਕੰਸ਼ ਅਤੇ ਇੱਕ ਸ਼ਬਦ ਦਾ ਸਹੀ ਮੇਲ ਕਿਹੜਾ ਹੈ?",correctAnswer:mapping(target),distractors:falsePairs,explanation:`‘${target.phrasePa}’ ਲਈ ‘${target.wordPa}’ ਸਹੀ ਇੱਕ-ਸ਼ਬਦੀ ਰੂਪ ਹੈ।`,authorityIds:[target.id,...chosen.map(x=>x.id)]});
}

export function generateCP010F07(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Hard"],"F07");
 const i=ord(seed,ORDERED_DOMAIN_PAIRS.length),{first,second}=ORDERED_DOMAIN_PAIRS[i]!,ps=peers(first).filter(x=>x.id!==second.id);
 const cross=crossDomain(first);
 const correct=`${first.wordPa} — ${second.wordPa}`;
 const distractors=uniq([
  `${second.wordPa} — ${first.wordPa}`,
  `${first.wordPa} — ${ps[0]?.wordPa??cross[0]!.wordPa}`,
  `${ps[1]?.wordPa??cross[1]!.wordPa} — ${second.wordPa}`,
  `${ps[2]?.wordPa??cross[2]!.wordPa} — ${ps[0]?.wordPa??cross[3]!.wordPa}`,
 ]);
 return assemble({seed,difficulty,familyId:"F07",subtype:"ORDERED_DUAL_MAPPING",stem:pickVariant([`ਦੋਵੇਂ ਵਾਕੰਸ਼ਾਂ ਲਈ ਕ੍ਰਮਵਾਰ ਸਹੀ ਸ਼ਬਦ ਚੁਣੋ।\n1. ${first.phrasePa}\n2. ${second.phrasePa}`,`ਪਹਿਲੇ ਅਤੇ ਦੂਜੇ ਵਾਕੰਸ਼ ਦਾ ਇੱਕ-ਸ਼ਬਦੀ ਰੂਪ ਕ੍ਰਮਵਾਰ ਕਿਹੜਾ ਹੈ?\n1. ${first.phrasePa}\n2. ${second.phrasePa}`,`ਹੇਠਲੇ ਦੋ ਵਾਕੰਸ਼ਾਂ ਲਈ ਸਹੀ ਸ਼ਬਦ-ਜੋੜਾ ਚੁਣੋ।\n1. ${first.phrasePa}\n2. ${second.phrasePa}`],i),correctAnswer:correct,distractors,explanation:`ਪਹਿਲੇ ਵਾਕੰਸ਼ ਲਈ ‘${first.wordPa}’ ਅਤੇ ਦੂਜੇ ਲਈ ‘${second.wordPa}’ ਸਹੀ ਸ਼ਬਦ ਹੈ।`,authorityIds:[first.id,second.id]});
}

const VERDICTS=["ਦੋਵੇਂ ਕਥਨ ਸਹੀ ਹਨ","ਕੇਵਲ ਕਥਨ 1 ਸਹੀ ਹੈ","ਕੇਵਲ ਕਥਨ 2 ਸਹੀ ਹੈ","ਦੋਵੇਂ ਕਥਨ ਗਲਤ ਹਨ"] as const;
export function generateCP010F08(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Hard"],"F08");
 const pairCap=ORDERED_DOMAIN_PAIRS.length,cap=pairCap*4,r=ord(seed,cap),pattern=r%4,pairIndex=Math.floor(r/4),{first,second}=ORDERED_DOMAIN_PAIRS[pairIndex]!;
 const firstWrong=peers(first).find(x=>x.id!==second.id)??crossDomain(first)[0]!;
 const secondWrong=peers(second).find(x=>x.id!==first.id)??crossDomain(second)[0]!;
 const t1=pattern===0||pattern===1,t2=pattern===0||pattern===2;
 const claim1=`‘${first.phrasePa}’ ਲਈ ਇੱਕ ਸ਼ਬਦ ‘${t1?first.wordPa:firstWrong.wordPa}’ ਹੈ।`;
 const claim2=`‘${second.phrasePa}’ ਲਈ ਇੱਕ ਸ਼ਬਦ ‘${t2?second.wordPa:secondWrong.wordPa}’ ਹੈ।`;
 const correct=VERDICTS[pattern]!;
 return assemble({seed,difficulty,familyId:"F08",subtype:"DUAL_STATEMENT_VERIFICATION",stem:pickVariant([`ਕਥਨਾਂ ਦੀ ਸਹੀ ਸਥਿਤੀ ਚੁਣੋ।\nਕਥਨ 1: ${claim1}\nਕਥਨ 2: ${claim2}`,`ਹੇਠਲੇ ਦੋ ਇੱਕ-ਸ਼ਬਦੀ ਮੇਲਾਂ ਨੂੰ ਪਰਖੋ।\nਕਥਨ 1: ${claim1}\nਕਥਨ 2: ${claim2}`,`ਕਿਹੜਾ ਵਿਕਲਪ ਦੋਵੇਂ ਕਥਨਾਂ ਬਾਰੇ ਸਹੀ ਹੈ?\nਕਥਨ 1: ${claim1}\nਕਥਨ 2: ${claim2}`],r),correctAnswer:correct,distractors:VERDICTS,explanation:`ਪਹਿਲੇ ਵਾਕੰਸ਼ ਲਈ ‘${first.wordPa}’ ਅਤੇ ਦੂਜੇ ਲਈ ‘${second.wordPa}’ ਸਹੀ ਸ਼ਬਦ ਹੈ। ਇਸ ਲਈ ${correct}।`,authorityIds:[first.id,second.id,firstWrong.id,secondWrong.id]});
}

export const CP010_FAMILIES=[
 {familyId:"F01",subtype:"DIRECT_PHRASE_TO_WORD",targetDifficulties:["Easy"] as PunjabiDifficulty[],semanticCapacity:CP010_AUTHORITIES.length,generate:generateCP010F01},
 {familyId:"F02",subtype:"DIRECT_WORD_TO_PHRASE",targetDifficulties:["Easy"] as PunjabiDifficulty[],semanticCapacity:CP010_AUTHORITIES.length,generate:generateCP010F02},
 {familyId:"F03",subtype:"SAME_DOMAIN_PHRASE_PRECISION",targetDifficulties:["Medium"] as PunjabiDifficulty[],semanticCapacity:CP010_AUTHORITIES.length,generate:generateCP010F03},
 {familyId:"F04",subtype:"SAME_DOMAIN_DEFINITION_PRECISION",targetDifficulties:["Medium"] as PunjabiDifficulty[],semanticCapacity:CP010_AUTHORITIES.length,generate:generateCP010F04},
 {familyId:"F05",subtype:"INCORRECT_MAPPING",targetDifficulties:["Medium"] as PunjabiDifficulty[],semanticCapacity:ORDERED_DOMAIN_PAIRS.length,generate:generateCP010F05},
 {familyId:"F06",subtype:"CORRECT_MAPPING",targetDifficulties:["Medium"] as PunjabiDifficulty[],semanticCapacity:CP010_AUTHORITIES.length,generate:generateCP010F06},
 {familyId:"F07",subtype:"ORDERED_DUAL_MAPPING",targetDifficulties:["Hard"] as PunjabiDifficulty[],semanticCapacity:ORDERED_DOMAIN_PAIRS.length,generate:generateCP010F07},
 {familyId:"F08",subtype:"DUAL_STATEMENT_VERIFICATION",targetDifficulties:["Hard"] as PunjabiDifficulty[],semanticCapacity:ORDERED_DOMAIN_PAIRS.length*4,generate:generateCP010F08},
] as const;

export function generateCP010Question(seed:number,difficulty:PunjabiDifficulty="Medium",requestedFamilyId?:string){
 const eligible=CP010_FAMILIES.filter(f=>f.targetDifficulties.includes(difficulty));
 const family=requestedFamilyId?CP010_FAMILIES.find(f=>f.familyId===requestedFamilyId):eligible[ord(seed,eligible.length)];
 if(!family)throw new Error(`Unknown CP010 family ${requestedFamilyId}`);
 if(!family.targetDifficulties.includes(difficulty))throw new Error(`${family.familyId} does not support ${difficulty}`);
 return family.generate(seed,difficulty);
}

export function getCP010BreadthReport(){
 const capacities=Object.fromEntries(CP010_FAMILIES.map(f=>[f.familyId,f.semanticCapacity]));
 return {totalAtomicAuthorities:CP010_AUTHORITIES.length,totalDomains:CP010_DOMAINS.length,orderedSameDomainPairs:ORDERED_DOMAIN_PAIRS.length,totalSemanticCapacity:CP010_FAMILIES.reduce((n,f)=>n+f.semanticCapacity,0),capacities};
}
