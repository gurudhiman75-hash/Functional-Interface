import { createRng } from "../../../../core/deterministic-rng";
import { semanticHash } from "../../../../core/semantic-hash";
import type { PunjabiDifficulty,PunjabiGeneratedQuestion } from "../../../../core/types";
import {
 CP008_AFFIX_AUTHORITIES,CP008_DERIVATION_AUTHORITIES,CP008_PREFIX_AFFIXES,CP008_PREFIX_DERIVATIONS,
 CP008_PREFIX_WORDS,CP008_SUFFIX_AFFIXES,CP008_SUFFIX_DERIVATIONS,CP008_SUFFIX_WORDS,CP008_WORD_AUTHORITIES,
 type CP008AffixAuthority,type CP008DerivationAuthority,type CP008WordAuthority
} from "./CP008-authorities";

function norm(v:string){return v.normalize("NFC").trim();}
function ord(seed:number,cap:number){const n=Math.trunc(seed)-1;return ((n%cap)+cap)%cap;}
function uniq(v:readonly string[]){return [...new Set(v.map(norm).filter(Boolean))];}
function pickVariant(v:readonly string[],s:number){return v[ord(s+1,v.length)]!;}
function requireDiff(actual:PunjabiDifficulty,allowed:readonly PunjabiDifficulty[],id:string){if(!allowed.includes(actual))throw new Error(`CP008 ${id} does not support ${actual}`);}
function affixById(id:string){const a=CP008_AFFIX_AUTHORITIES.find(x=>x.id===id);if(!a)throw new Error(`Unknown CP008 affix ${id}`);return a;}
function assemble(input:{seed:number;difficulty:PunjabiDifficulty;familyId:string;subtype:string;stem:string;correctAnswer:string;distractors:readonly string[];explanation:string;authorityIds:readonly string[]}):PunjabiGeneratedQuestion{
 const rng=createRng(`CP008-RETROFIT:${input.familyId}:${input.seed}`);const correct=norm(input.correctAnswer);const ds=uniq(input.distractors).filter(x=>x!==correct);
 if(ds.length<3)throw new Error(`CP008 ${input.familyId}: fewer than three distractors`);
 const selected=rng.pickDistinct(ds,3),options=rng.shuffle([correct,...selected]);
 const parts=[input.familyId,input.subtype,input.difficulty,norm(input.stem),correct,[...selected].sort().join("|"),[...input.authorityIds].sort().join(",")];
 const fingerprint=`CP008-${semanticHash(parts)}${semanticHash(["SECONDARY",...parts].reverse())}`;
 return{id:`PUN-001-CP008-${input.familyId}-${fingerprint}`,stem:norm(input.stem),options,correctIndex:options.indexOf(correct),explanation:norm(input.explanation),difficulty:input.difficulty,metadata:{engine:"punjabi-v1",packageId:"PUN-001",cpId:"PUN-001-CP008",familyId:input.familyId,subtype:input.subtype,difficulty:input.difficulty,language:"pa-Guru",seed:input.seed,authorityIds:input.authorityIds,generatorRevision:"2.0.0-retrofit-exhaustive",fingerprint,lifecycle:"REVIEW_ONLY"}};
}
function affixDistractors(a:CP008AffixAuthority){return (a.type==="PREFIX"?CP008_PREFIX_AFFIXES:CP008_SUFFIX_AFFIXES).filter(x=>x.id!==a.id).map(x=>x.affix);}
function wordDistractors(w:CP008WordAuthority){return CP008_WORD_AUTHORITIES.filter(x=>x.type===w.type&&x.affixId!==w.affixId&&x.derived!==w.derived).map(x=>x.derived);}
function rootDistractors(d:CP008DerivationAuthority){return CP008_DERIVATION_AUTHORITIES.filter(x=>x.type===d.type&&x.id!==d.id).map(x=>x.root);}
function analysis(d:CP008DerivationAuthority){return d.type==="PREFIX"?`${d.affix} + ${d.root}`:`${d.root} + ${d.affix}`;}
function analysisDistractors(d:CP008DerivationAuthority){const peers=CP008_DERIVATION_AUTHORITIES.filter(x=>x.type===d.type&&x.id!==d.id);const reversed=d.type==="PREFIX"?`${d.root} + ${d.affix}`:`${d.affix} + ${d.root}`;return uniq([reversed,...peers.map(analysis)]);}

export function generateCP008F01(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Easy"],"F01");const i=ord(seed,CP008_PREFIX_WORDS.length),w=CP008_PREFIX_WORDS[i]!,a=affixById(w.affixId);
 return assemble({seed,difficulty,familyId:"F01",subtype:"PREFIX_IDENTIFICATION",stem:pickVariant([`‘${w.derived}’ ਸ਼ਬਦ ਵਿੱਚ ਅਗੇਤਰ ਕਿਹੜਾ ਹੈ?`,`ਸ਼ਬਦ ‘${w.derived}’ ਵਿੱਚ ਵਰਤਿਆ ਅਗੇਤਰ ਪਛਾਣੋ।`,`‘${w.derived}’ ਦੀ ਰਚਨਾ ਵਿੱਚ ਕਿਹੜਾ ਅਗੇਤਰ ਵਰਤਿਆ ਗਿਆ ਹੈ?`],i),correctAnswer:w.affix,distractors:affixDistractors(a),explanation:w.explanationPa,authorityIds:[a.id,w.id]});
}
export function generateCP008F02(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Easy"],"F02");const i=ord(seed,CP008_SUFFIX_WORDS.length),w=CP008_SUFFIX_WORDS[i]!,a=affixById(w.affixId);
 return assemble({seed,difficulty,familyId:"F02",subtype:"SUFFIX_IDENTIFICATION",stem:pickVariant([`‘${w.derived}’ ਸ਼ਬਦ ਵਿੱਚ ਪਿਛੇਤਰ ਕਿਹੜਾ ਹੈ?`,`ਸ਼ਬਦ ‘${w.derived}’ ਵਿੱਚ ਵਰਤਿਆ ਪਿਛੇਤਰ ਪਛਾਣੋ।`,`‘${w.derived}’ ਦੀ ਰਚਨਾ ਵਿੱਚ ਕਿਹੜਾ ਪਿਛੇਤਰ ਵਰਤਿਆ ਗਿਆ ਹੈ?`],i),correctAnswer:w.affix,distractors:affixDistractors(a),explanation:w.explanationPa,authorityIds:[a.id,w.id]});
}
export function generateCP008F03(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F03");const i=ord(seed,CP008_DERIVATION_AUTHORITIES.length),d=CP008_DERIVATION_AUTHORITIES[i]!;
 return assemble({seed,difficulty,familyId:"F03",subtype:"ROOT_RECOVERY",stem:pickVariant([`‘${d.derived}’ ਦਾ ਮੂਲ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,`‘${d.derived}’ ਵਿੱਚੋਂ ${d.type==="PREFIX"?"ਅਗੇਤਰ":"ਪਿਛੇਤਰ"} ਵੱਖ ਕਰਨ ਤੇ ਮੂਲ ਸ਼ਬਦ ਕਿਹੜਾ ਮਿਲਦਾ ਹੈ?`,`ਸ਼ਬਦ-ਰਚਨਾ ਅਨੁਸਾਰ ‘${d.derived}’ ਦਾ ਮੂਲ ਅੰਗ ਚੁਣੋ।`],i),correctAnswer:d.root,distractors:rootDistractors(d),explanation:d.explanationPa,authorityIds:[d.affixId,d.id]});
}
export function generateCP008F04(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F04");const i=ord(seed,CP008_AFFIX_AUTHORITIES.length),a=CP008_AFFIX_AUTHORITIES[i]!;
 const labels=CP008_AFFIX_AUTHORITIES.filter(x=>x.id!==a.id).map(x=>x.functionLabelPa);
 return assemble({seed,difficulty,familyId:"F04",subtype:"AFFIX_FUNCTION",stem:pickVariant([`‘${a.affix}’ ${a.type==="PREFIX"?"ਅਗੇਤਰ":"ਪਿਛੇਤਰ"} ਆਮ ਤੌਰ ਤੇ ਕਿਹੜਾ ਭਾਵ ਪ੍ਰਗਟ ਕਰਦਾ ਹੈ?`,`ਦਿੱਤੇ ${a.type==="PREFIX"?"ਅਗੇਤਰ":"ਪਿਛੇਤਰ"} ‘${a.affix}’ ਦਾ ਢੁਕਵਾਂ ਕਾਰਜ-ਭਾਵ ਚੁਣੋ।`,`‘${a.affix}’ ਨਾਲ ਬਣੇ ਸ਼ਬਦਾਂ ਵਿੱਚ ਮੁੱਖ ਭਾਵ ਕਿਹੜਾ ਹੁੰਦਾ ਹੈ?`],i),correctAnswer:a.functionLabelPa,distractors:labels,explanation:`‘${a.affix}’ ${a.meaningPa}।`,authorityIds:[a.id]});
}
export function generateCP008F05(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Easy"],"F05");const i=ord(seed,CP008_WORD_AUTHORITIES.length),w=CP008_WORD_AUTHORITIES[i]!,a=affixById(w.affixId);
 return assemble({seed,difficulty,familyId:"F05",subtype:"VALID_AFFIX_WORD",stem:pickVariant([`ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${a.affix}’ ${a.type==="PREFIX"?"ਅਗੇਤਰ":"ਪਿਛੇਤਰ"} ਨਾਲ ਬਣਿਆ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,`ਕਿਹੜੇ ਸ਼ਬਦ ਵਿੱਚ ‘${a.affix}’ ਨੂੰ ${a.type==="PREFIX"?"ਅਗੇਤਰ":"ਪਿਛੇਤਰ"} ਵਜੋਂ ਵਰਤਿਆ ਗਿਆ ਹੈ?`,`‘${a.affix}’ ਨਾਲ ਬਣਿਆ ਸਹੀ ਸ਼ਬਦ ਚੁਣੋ।`],i),correctAnswer:w.derived,distractors:wordDistractors(w),explanation:w.explanationPa,authorityIds:[a.id,w.id]});
}
export function generateCP008F06(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F06");const i=ord(seed,CP008_DERIVATION_AUTHORITIES.length),d=CP008_DERIVATION_AUTHORITIES[i]!;
 return assemble({seed,difficulty,familyId:"F06",subtype:"FORMATION_ANALYSIS",stem:pickVariant([`‘${d.derived}’ ਦਾ ਸਹੀ ਸ਼ਬਦ-ਨਿਖੇੜ ਕਿਹੜਾ ਹੈ?`,`‘${d.derived}’ ਦੀ ਬਣਤਰ ਨੂੰ ਸਹੀ ਤਰ੍ਹਾਂ ਵੱਖ ਕਰਕੇ ਦਰਸਾਉਣ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।`,`‘${d.derived}’ ਵਿੱਚ ਮੂਲ ਸ਼ਬਦ ਅਤੇ ${d.type==="PREFIX"?"ਅਗੇਤਰ":"ਪਿਛੇਤਰ"} ਦੀ ਸਹੀ ਵੰਡ ਕਿਹੜੀ ਹੈ?`],i),correctAnswer:analysis(d),distractors:analysisDistractors(d),explanation:d.explanationPa,authorityIds:[d.affixId,d.id]});
}
export function generateCP008F07(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Hard"],"F07");const cap=CP008_PREFIX_WORDS.length*CP008_SUFFIX_WORDS.length,r=ord(seed,cap),p=CP008_PREFIX_WORDS[Math.floor(r/CP008_SUFFIX_WORDS.length)]!,s=CP008_SUFFIX_WORDS[r%CP008_SUFFIX_WORDS.length]!;
 const correct=`${p.affix} — ${s.affix}`,combos:string[]=[];for(const pa of CP008_PREFIX_AFFIXES)for(const sa of CP008_SUFFIX_AFFIXES)combos.push(`${pa.affix} — ${sa.affix}`);
 return assemble({seed,difficulty,familyId:"F07",subtype:"DUAL_AFFIX_DIAGNOSIS",stem:pickVariant([`ਦੋਵੇਂ ਸ਼ਬਦਾਂ ਲਈ ਸਹੀ ਅਗੇਤਰ–ਪਿਛੇਤਰ ਜੋੜਾ ਚੁਣੋ।\n1. ${p.derived}\n2. ${s.derived}`,`ਪਹਿਲੇ ਸ਼ਬਦ ਦਾ ਅਗੇਤਰ ਅਤੇ ਦੂਜੇ ਸ਼ਬਦ ਦਾ ਪਿਛੇਤਰ ਦੋਵੇਂ ਸਹੀ ਪਛਾਣੋ।\n1. ${p.derived}\n2. ${s.derived}`,`ਹੇਠਲੇ ਦੋ ਸ਼ਬਦਾਂ ਦੀ ਮਿਲੀ-ਜੁਲੀ ਰਚਨਾ ਪਛਾਣੋ।\n‘${p.derived}’ + ‘${s.derived}’`],r),correctAnswer:correct,distractors:combos,explanation:`‘${p.derived}’ ਵਿੱਚ ‘${p.affix}’ ਅਗੇਤਰ ਹੈ ਅਤੇ ‘${s.derived}’ ਵਿੱਚ ‘${s.affix}’ ਪਿਛੇਤਰ ਹੈ।`,authorityIds:[p.affixId,p.id,s.affixId,s.id]});
}
const VERDICTS=["ਦੋਵੇਂ ਕਥਨ ਸਹੀ ਹਨ","ਕੇਵਲ ਕਥਨ 1 ਸਹੀ ਹੈ","ਕੇਵਲ ਕਥਨ 2 ਸਹੀ ਹੈ","ਦੋਵੇਂ ਕਥਨ ਗਲਤ ਹਨ"] as const;
function wrongAffix(a:CP008AffixAuthority){const pool=a.type==="PREFIX"?CP008_PREFIX_AFFIXES:CP008_SUFFIX_AFFIXES;return pool.find(x=>x.id!==a.id)!.affix;}
export function generateCP008F08(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Hard"],"F08");const pairCap=CP008_PREFIX_DERIVATIONS.length*CP008_SUFFIX_DERIVATIONS.length,cap=pairCap*4,r=ord(seed,cap),pattern=r%4,pair=Math.floor(r/4),p=CP008_PREFIX_DERIVATIONS[Math.floor(pair/CP008_SUFFIX_DERIVATIONS.length)]!,s=CP008_SUFFIX_DERIVATIONS[pair%CP008_SUFFIX_DERIVATIONS.length]!;
 const pa=affixById(p.affixId),sa=affixById(s.affixId),t1=pattern===0||pattern===1,t2=pattern===0||pattern===2;
 const claim1=`‘${p.derived}’ = ‘${t1?p.affix:wrongAffix(pa)}’ + ‘${p.root}’।`,claim2=`‘${s.derived}’ = ‘${s.root}’ + ‘${t2?s.affix:wrongAffix(sa)}’।`,correct=VERDICTS[pattern]!;
 return assemble({seed,difficulty,familyId:"F08",subtype:"DUAL_STATEMENT_VERIFICATION",stem:pickVariant([`ਕਥਨਾਂ ਦੀ ਸਹੀ ਸਥਿਤੀ ਚੁਣੋ।\nਕਥਨ 1: ${claim1}\nਕਥਨ 2: ${claim2}`,`ਹੇਠਲੇ ਦੋ ਸ਼ਬਦ-ਨਿਖੇੜਾਂ ਨੂੰ ਪਰਖੋ।\nਕਥਨ 1: ${claim1}\nਕਥਨ 2: ${claim2}`,`ਕਿਹੜਾ ਵਿਕਲਪ ਦੋਵੇਂ ਕਥਨਾਂ ਬਾਰੇ ਸਹੀ ਹੈ?\nਕਥਨ 1: ${claim1}\nਕਥਨ 2: ${claim2}`],r),correctAnswer:correct,distractors:VERDICTS,explanation:`ਸਹੀ ਨਿਖੇੜ: ${analysis(p)} = ${p.derived}; ${analysis(s)} = ${s.derived}। ਇਸ ਲਈ ${correct}।`,authorityIds:[p.affixId,p.id,s.affixId,s.id]});
}
export const CP008_FAMILIES=[
 {familyId:"F01",subtype:"PREFIX_IDENTIFICATION",targetDifficulties:["Easy"] as PunjabiDifficulty[],semanticCapacity:CP008_PREFIX_WORDS.length,generate:generateCP008F01},
 {familyId:"F02",subtype:"SUFFIX_IDENTIFICATION",targetDifficulties:["Easy"] as PunjabiDifficulty[],semanticCapacity:CP008_SUFFIX_WORDS.length,generate:generateCP008F02},
 {familyId:"F03",subtype:"ROOT_RECOVERY",targetDifficulties:["Medium"] as PunjabiDifficulty[],semanticCapacity:CP008_DERIVATION_AUTHORITIES.length,generate:generateCP008F03},
 {familyId:"F04",subtype:"AFFIX_FUNCTION",targetDifficulties:["Medium"] as PunjabiDifficulty[],semanticCapacity:CP008_AFFIX_AUTHORITIES.length,generate:generateCP008F04},
 {familyId:"F05",subtype:"VALID_AFFIX_WORD",targetDifficulties:["Easy"] as PunjabiDifficulty[],semanticCapacity:CP008_WORD_AUTHORITIES.length,generate:generateCP008F05},
 {familyId:"F06",subtype:"FORMATION_ANALYSIS",targetDifficulties:["Medium"] as PunjabiDifficulty[],semanticCapacity:CP008_DERIVATION_AUTHORITIES.length,generate:generateCP008F06},
 {familyId:"F07",subtype:"DUAL_AFFIX_DIAGNOSIS",targetDifficulties:["Hard"] as PunjabiDifficulty[],semanticCapacity:CP008_PREFIX_WORDS.length*CP008_SUFFIX_WORDS.length,generate:generateCP008F07},
 {familyId:"F08",subtype:"DUAL_STATEMENT_VERIFICATION",targetDifficulties:["Hard"] as PunjabiDifficulty[],semanticCapacity:CP008_PREFIX_DERIVATIONS.length*CP008_SUFFIX_DERIVATIONS.length*4,generate:generateCP008F08},
] as const;
export function generateCP008Question(seed:number,difficulty:PunjabiDifficulty="Medium",requestedFamilyId?:string){const eligible=CP008_FAMILIES.filter(f=>f.targetDifficulties.includes(difficulty));const family=requestedFamilyId?CP008_FAMILIES.find(f=>f.familyId===requestedFamilyId):eligible[ord(seed,eligible.length)];if(!family)throw new Error(`Unknown CP008 family ${requestedFamilyId}`);if(!family.targetDifficulties.includes(difficulty))throw new Error(`${family.familyId} does not support ${difficulty}`);return family.generate(seed,difficulty);}
export function getCP008BreadthReport(){const capacities=Object.fromEntries(CP008_FAMILIES.map(f=>[f.familyId,f.semanticCapacity]));return{affixConcepts:CP008_AFFIX_AUTHORITIES.length,wordMembershipAuthorities:CP008_WORD_AUTHORITIES.length,rootDerivationAuthorities:CP008_DERIVATION_AUTHORITIES.length,prefixWords:CP008_PREFIX_WORDS.length,suffixWords:CP008_SUFFIX_WORDS.length,prefixRoots:CP008_PREFIX_DERIVATIONS.length,suffixRoots:CP008_SUFFIX_DERIVATIONS.length,totalAtomicAuthorities:CP008_AFFIX_AUTHORITIES.length+CP008_WORD_AUTHORITIES.length+CP008_DERIVATION_AUTHORITIES.length,totalSemanticCapacity:CP008_FAMILIES.reduce((n,f)=>n+f.semanticCapacity,0),capacities};}
