import { createRng } from "../../../../core/deterministic-rng";
import { semanticHash } from "../../../../core/semantic-hash";
import type { PunjabiDifficulty,PunjabiGeneratedQuestion } from "../../../../core/types";
import { CP009_ANTONYM_AUTHORITIES,CP009_CONTEXT_AUTHORITIES,CP009_SYNONYM_AUTHORITIES,type CP009AntonymAuthority,type CP009SynonymAuthority } from "./CP009-authorities";

function norm(v:string){return v.normalize("NFC").trim();}
function ord(seed:number,cap:number){const n=Math.trunc(seed)-1;return ((n%cap)+cap)%cap;}
function uniq(v:readonly string[]){return [...new Set(v.map(norm).filter(Boolean))];}
function pickVariant(v:readonly string[],s:number){return v[ord(s+1,v.length)]!;}
function requireDiff(actual:PunjabiDifficulty,allowed:readonly PunjabiDifficulty[],id:string){if(!allowed.includes(actual))throw new Error(`CP009 ${id} does not support ${actual}`);}
function assemble(input:{seed:number;difficulty:PunjabiDifficulty;familyId:string;subtype:string;stem:string;correctAnswer:string;distractors:readonly string[];explanation:string;authorityIds:readonly string[]}):PunjabiGeneratedQuestion{
 const rng=createRng(`CP009:${input.familyId}:${input.seed}`);
 const correct=norm(input.correctAnswer);
 const ds=uniq(input.distractors).filter(x=>x!==correct);
 if(ds.length<3)throw new Error(`CP009 ${input.familyId}: fewer than three distractors`);
 const selected=rng.pickDistinct(ds,3);
 const options=rng.shuffle([correct,...selected]);
 const fingerprint=`CP009-${semanticHash([input.familyId,input.subtype,input.difficulty,norm(input.stem),correct,[...selected].sort().join("|"),[...input.authorityIds].sort().join(",")])}`;
 return {id:`PUN-001-CP009-${input.familyId}-${fingerprint}`,stem:norm(input.stem),options,correctIndex:options.indexOf(correct),explanation:norm(input.explanation),difficulty:input.difficulty,metadata:{engine:"punjabi-v1",packageId:"PUN-001",cpId:"PUN-001-CP009",familyId:input.familyId,subtype:input.subtype,difficulty:input.difficulty,language:"pa-Guru",seed:input.seed,authorityIds:input.authorityIds,generatorRevision:"1.0.0-forward-port",fingerprint,lifecycle:"REVIEW_ONLY"}};
}

export function generateCP009F01(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Easy"],"F01");
 const i=ord(seed,CP009_SYNONYM_AUTHORITIES.length),a=CP009_SYNONYM_AUTHORITIES[i]!;
 return assemble({seed,difficulty,familyId:"F01",subtype:"DIRECT_SYNONYM",stem:pickVariant([`‘${a.headword}’ ਦਾ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,`ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${a.headword}’ ਦੇ ਸਮਾਨ ਅਰਥ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।`,`‘${a.headword}’ ਲਈ ਢੁਕਵਾਂ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ਚੁਣੋ।`],i),correctAnswer:a.synonyms[0],distractors:a.outsiders,explanation:a.explanationPa,authorityIds:[a.id]});
}

export function generateCP009F02(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Easy"],"F02");
 const i=ord(seed,CP009_ANTONYM_AUTHORITIES.length),a=CP009_ANTONYM_AUTHORITIES[i]!;
 return assemble({seed,difficulty,familyId:"F02",subtype:"DIRECT_ANTONYM",stem:pickVariant([`‘${a.word}’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,`ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${a.word}’ ਦੇ ਉਲਟ ਅਰਥ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।`,`‘${a.word}’ ਦਾ ਸਹੀ ਵਿਰੋਧੀ ਸ਼ਬਦ ਦੱਸੋ।`],i),correctAnswer:a.antonym,distractors:a.sourceConfusables,explanation:a.explanationPa,authorityIds:[a.id]});
}

const RELATION_OPTIONS=["ਸਮਾਨਾਰਥਕ","ਵਿਰੋਧੀ","ਇੱਕੋ ਸ਼ਬਦ ਦੇ ਰੂਪ","ਕੋਈ ਨਿਸ਼ਚਿਤ ਅਰਥ-ਸੰਬੰਧ ਨਹੀਂ"] as const;
export function generateCP009F03(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Easy"],"F03");
 const cap=CP009_SYNONYM_AUTHORITIES.length+CP009_ANTONYM_AUTHORITIES.length,i=ord(seed,cap);
 if(i<CP009_SYNONYM_AUTHORITIES.length){
  const a=CP009_SYNONYM_AUTHORITIES[i]!;
  return assemble({seed,difficulty,familyId:"F03",subtype:"MEANING_RELATION",stem:`‘${a.headword}’ ਅਤੇ ‘${a.synonyms[0]}’ ਵਿਚਲਾ ਅਰਥ-ਸੰਬੰਧ ਕਿਹੜਾ ਹੈ?`,correctAnswer:"ਸਮਾਨਾਰਥਕ",distractors:RELATION_OPTIONS,explanation:`‘${a.headword}’ ਅਤੇ ‘${a.synonyms[0]}’ ਸਮਾਨ ਅਰਥ ਪ੍ਰਗਟ ਕਰਦੇ ਹਨ।`,authorityIds:[a.id]});
 }
 const a=CP009_ANTONYM_AUTHORITIES[i-CP009_SYNONYM_AUTHORITIES.length]!;
 return assemble({seed,difficulty,familyId:"F03",subtype:"MEANING_RELATION",stem:`‘${a.word}’ ਅਤੇ ‘${a.antonym}’ ਵਿਚਲਾ ਅਰਥ-ਸੰਬੰਧ ਕਿਹੜਾ ਹੈ?`,correctAnswer:"ਵਿਰੋਧੀ",distractors:RELATION_OPTIONS,explanation:a.explanationPa,authorityIds:[a.id]});
}

export function generateCP009F04(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F04");
 const i=ord(seed,CP009_CONTEXT_AUTHORITIES.length),a=CP009_CONTEXT_AUTHORITIES[i]!;
 return assemble({seed,difficulty,familyId:"F04",subtype:"CONTEXT_PRECISION",stem:pickVariant([`ਖਾਲੀ ਥਾਂ ਲਈ ਸਭ ਤੋਂ ਢੁਕਵਾਂ ਸ਼ਬਦ ਚੁਣੋ।\n${a.sentence}`,`ਵਾਕ ਦੇ ਭਾਵ ਅਨੁਸਾਰ ਸਹੀ ਸ਼ਬਦ ਚੁਣੋ।\n${a.sentence}`,`ਦਿੱਤੇ ਪ੍ਰਸੰਗ ਵਿੱਚ ਕਿਹੜਾ ਸ਼ਬਦ ਸਭ ਤੋਂ ਸਹੀ ਹੈ?\n${a.sentence}`],i),correctAnswer:a.correctTerm,distractors:a.distractors,explanation:a.explanationPa,authorityIds:[a.id]});
}

export function generateCP009F05(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F05");
 const cap=CP009_SYNONYM_AUTHORITIES.length*4,r=ord(seed,cap),a=CP009_SYNONYM_AUTHORITIES[Math.floor(r/4)]!,outsider=a.outsiders[r%4]!;
 return assemble({seed,difficulty,familyId:"F05",subtype:"SYNONYM_OUTSIDER",stem:pickVariant([`ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸ਼ਬਦ ‘${a.headword}’ ਦਾ ਸਮਾਨਾਰਥਕ ਨਹੀਂ ਹੈ?`,`‘${a.headword}’ ਦੇ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦਾਂ ਵਿੱਚੋਂ ਵੱਖਰਾ ਸ਼ਬਦ ਚੁਣੋ।`,`ਕਿਹੜਾ ਵਿਕਲਪ ‘${a.headword}’ ਦੇ ਅਰਥ-ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦਾ?`],r),correctAnswer:outsider,distractors:a.synonyms,explanation:`‘${a.synonyms.join("’, ‘")}’ ‘${a.headword}’ ਦੇ ਸਮਾਨਾਰਥਕ ਹਨ, ਪਰ ‘${outsider}’ ਨਹੀਂ ਹੈ।`,authorityIds:[a.id]});
}

export function generateCP009F06(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F06");
 const i=ord(seed,CP009_SYNONYM_AUTHORITIES.length),a=CP009_SYNONYM_AUTHORITIES[i]!,correct=a.synonyms[2];
 return assemble({seed,difficulty,familyId:"F06",subtype:"SYNONYM_SET_COMPLETION",stem:pickVariant([`‘${a.headword}’ ਦੇ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦਾਂ ਦੀ ਲੜੀ ਪੂਰੀ ਕਰੋ: ${a.synonyms[0]}, ${a.synonyms[1]}, ____`,`ਖਾਲੀ ਥਾਂ ਵਿੱਚ ‘${a.headword}’ ਦਾ ਹੋਰ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ਭਰੋ: ${a.synonyms[0]}, ${a.synonyms[1]}, ____`,`‘${a.headword}’ ਨਾਲ ਇੱਕੋ ਅਰਥ-ਸਮੂਹ ਪੂਰਾ ਕਰਨ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ: ${a.synonyms[0]}, ${a.synonyms[1]}, ____`],i),correctAnswer:correct,distractors:a.outsiders,explanation:`‘${correct}’ ਵੀ ‘${a.headword}’ ਦਾ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ਹੈ।`,authorityIds:[a.id]});
}

const RELATION_COMBOS=["ਸਮਾਨਾਰਥਕ — ਸਮਾਨਾਰਥਕ","ਸਮਾਨਾਰਥਕ — ਵਿਰੋਧੀ","ਵਿਰੋਧੀ — ਸਮਾਨਾਰਥਕ","ਵਿਰੋਧੀ — ਵਿਰੋਧੀ"] as const;
function synPair(a:CP009SynonymAuthority){return `‘${a.headword} — ${a.synonyms[0]}’`;}
function antPair(a:CP009AntonymAuthority){return `‘${a.word} — ${a.antonym}’`;}
export function generateCP009F07(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Hard"],"F07");
 const cap=CP009_SYNONYM_AUTHORITIES.length*CP009_ANTONYM_AUTHORITIES.length*2,r=ord(seed,cap),order=r%2,p=Math.floor(r/2),s=CP009_SYNONYM_AUTHORITIES[Math.floor(p/CP009_ANTONYM_AUTHORITIES.length)]!,a=CP009_ANTONYM_AUTHORITIES[p%CP009_ANTONYM_AUTHORITIES.length]!;
 const first=order===0?synPair(s):antPair(a),second=order===0?antPair(a):synPair(s),correct=order===0?"ਸਮਾਨਾਰਥਕ — ਵਿਰੋਧੀ":"ਵਿਰੋਧੀ — ਸਮਾਨਾਰਥਕ";
 return assemble({seed,difficulty,familyId:"F07",subtype:"DUAL_RELATION_DIAGNOSIS",stem:pickVariant([`ਦੋਵੇਂ ਸ਼ਬਦ-ਜੋੜਿਆਂ ਦਾ ਸਹੀ ਅਰਥ-ਸੰਬੰਧ ਚੁਣੋ।\n1. ${first}\n2. ${second}`,`ਪਹਿਲੇ ਅਤੇ ਦੂਜੇ ਸ਼ਬਦ-ਜੋੜੇ ਨੂੰ ਕ੍ਰਮਵਾਰ ਵਰਗਬੱਧ ਕਰੋ।\n1. ${first}\n2. ${second}`,`ਹੇਠਲੇ ਦੋ ਜੋੜਿਆਂ ਲਈ ਸਹੀ ਸੰਬੰਧ-ਜੋੜਾ ਕਿਹੜਾ ਹੈ?\n1. ${first}\n2. ${second}`],r),correctAnswer:correct,distractors:RELATION_COMBOS,explanation:order===0?`ਪਹਿਲਾ ਜੋੜਾ ਸਮਾਨਾਰਥਕ ਹੈ ਅਤੇ ਦੂਜਾ ਜੋੜਾ ਵਿਰੋਧੀ ਹੈ।`:`ਪਹਿਲਾ ਜੋੜਾ ਵਿਰੋਧੀ ਹੈ ਅਤੇ ਦੂਜਾ ਜੋੜਾ ਸਮਾਨਾਰਥਕ ਹੈ।`,authorityIds:[s.id,a.id]});
}

const VERDICTS=["ਦੋਵੇਂ ਕਥਨ ਸਹੀ ਹਨ","ਕੇਵਲ ਕਥਨ 1 ਸਹੀ ਹੈ","ਕੇਵਲ ਕਥਨ 2 ਸਹੀ ਹੈ","ਦੋਵੇਂ ਕਥਨ ਗਲਤ ਹਨ"] as const;
export function generateCP009F08(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Hard"],"F08");
 const cap=CP009_SYNONYM_AUTHORITIES.length*CP009_ANTONYM_AUTHORITIES.length*4,r=ord(seed,cap),pattern=r%4,p=Math.floor(r/4),s=CP009_SYNONYM_AUTHORITIES[Math.floor(p/CP009_ANTONYM_AUTHORITIES.length)]!,a=CP009_ANTONYM_AUTHORITIES[p%CP009_ANTONYM_AUTHORITIES.length]!;
 const t1=pattern===0||pattern===1,t2=pattern===0||pattern===2;
 const claim1=`‘${s.headword}’ ਦਾ ਸਮਾਨਾਰਥਕ ‘${t1?s.synonyms[0]:s.outsiders[(p+pattern)%4]}’ ਹੈ।`;
 const claim2=`‘${a.word}’ ਦਾ ਵਿਰੋਧੀ ‘${t2?a.antonym:a.sourceConfusables[(p+pattern)%3]}’ ਹੈ।`;
 const correct=VERDICTS[pattern]!;
 return assemble({seed,difficulty,familyId:"F08",subtype:"DUAL_STATEMENT_VERIFICATION",stem:pickVariant([`ਕਥਨਾਂ ਦੀ ਸਹੀ ਸਥਿਤੀ ਚੁਣੋ।\nਕਥਨ 1: ${claim1}\nਕਥਨ 2: ${claim2}`,`ਹੇਠਲੇ ਦੋ ਕਥਨਾਂ ਨੂੰ ਅਰਥ ਅਨੁਸਾਰ ਪਰਖੋ।\nਕਥਨ 1: ${claim1}\nਕਥਨ 2: ${claim2}`,`ਕਿਹੜਾ ਵਿਕਲਪ ਦੋਵੇਂ ਕਥਨਾਂ ਬਾਰੇ ਸਹੀ ਹੈ?\nਕਥਨ 1: ${claim1}\nਕਥਨ 2: ${claim2}`],r),correctAnswer:correct,distractors:VERDICTS,explanation:`‘${s.headword}’ ਦਾ ਸਮਾਨਾਰਥਕ ‘${s.synonyms[0]}’ ਹੈ ਅਤੇ ‘${a.word}’ ਦਾ ਵਿਰੋਧੀ ‘${a.antonym}’ ਹੈ। ਇਸ ਲਈ ${correct}।`,authorityIds:[s.id,a.id]});
}

export const CP009_FAMILIES=[
 {familyId:"F01",subtype:"DIRECT_SYNONYM",targetDifficulties:["Easy"] as PunjabiDifficulty[],semanticCapacity:24,generate:generateCP009F01},
 {familyId:"F02",subtype:"DIRECT_ANTONYM",targetDifficulties:["Easy"] as PunjabiDifficulty[],semanticCapacity:32,generate:generateCP009F02},
 {familyId:"F03",subtype:"MEANING_RELATION",targetDifficulties:["Easy"] as PunjabiDifficulty[],semanticCapacity:56,generate:generateCP009F03},
 {familyId:"F04",subtype:"CONTEXT_PRECISION",targetDifficulties:["Medium"] as PunjabiDifficulty[],semanticCapacity:8,generate:generateCP009F04},
 {familyId:"F05",subtype:"SYNONYM_OUTSIDER",targetDifficulties:["Medium"] as PunjabiDifficulty[],semanticCapacity:96,generate:generateCP009F05},
 {familyId:"F06",subtype:"SYNONYM_SET_COMPLETION",targetDifficulties:["Medium"] as PunjabiDifficulty[],semanticCapacity:24,generate:generateCP009F06},
 {familyId:"F07",subtype:"DUAL_RELATION_DIAGNOSIS",targetDifficulties:["Hard"] as PunjabiDifficulty[],semanticCapacity:1536,generate:generateCP009F07},
 {familyId:"F08",subtype:"DUAL_STATEMENT_VERIFICATION",targetDifficulties:["Hard"] as PunjabiDifficulty[],semanticCapacity:3072,generate:generateCP009F08},
] as const;
export function generateCP009Question(seed:number,difficulty:PunjabiDifficulty="Medium",requestedFamilyId?:string){const eligible=CP009_FAMILIES.filter(f=>f.targetDifficulties.includes(difficulty));const family=requestedFamilyId?CP009_FAMILIES.find(f=>f.familyId===requestedFamilyId):eligible[ord(seed,eligible.length)];if(!family)throw new Error(`Unknown CP009 family ${requestedFamilyId}`);if(!family.targetDifficulties.includes(difficulty))throw new Error(`${family.familyId} does not support ${difficulty}`);return family.generate(seed,difficulty);}
export function getCP009BreadthReport(){const capacities=Object.fromEntries(CP009_FAMILIES.map(f=>[f.familyId,f.semanticCapacity]));return{totalAtomicAuthorities:CP009_SYNONYM_AUTHORITIES.length+CP009_ANTONYM_AUTHORITIES.length+CP009_CONTEXT_AUTHORITIES.length,totalSemanticCapacity:CP009_FAMILIES.reduce((n,f)=>n+f.semanticCapacity,0),capacities};}
