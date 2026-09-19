import { createRng } from "../../../../core/deterministic-rng";
import { semanticHash } from "../../../../core/semantic-hash";
import type { PunjabiDifficulty, PunjabiGeneratedQuestion, PunjabiQuestionFamilyDefinition } from "../../../../core/types";
import { CP006_ASPECT_AUTHORITIES, CP006_ASPECT_LABELS } from "./CP006-aspects";
import { CP006_COMPOUND_VERBS, CP006_TENSE_LABELS, CP006_TENSE_SHIFTS, CP006_TENSE_TRIPLETS, CP006_TRANSITIVITY_CONVERSIONS, CP006_VERB_AUTHORITIES, CP006_VERB_TYPE_LABELS } from "./CP006-authorities";

function norm(v:string){return v.normalize("NFC").trim();}
function ord(seed:number,cap:number){const n=Math.trunc(seed)-1;return ((n%cap)+cap)%cap;}
function uniq(v:readonly string[]){return [...new Set(v.map(norm).filter(Boolean))];}
function pickVariant(v:readonly string[],s:number){return v[ord(s+1,v.length)]!;}
function requireDiff(actual:PunjabiDifficulty,allowed:readonly PunjabiDifficulty[],id:string){if(!allowed.includes(actual))throw new Error(`CP006 ${id} does not support ${actual}`);}
function assemble(input:{seed:number;difficulty:PunjabiDifficulty;familyId:string;subtype:string;stem:string;correctAnswer:string;distractors:readonly string[];explanation:string;authorityIds:readonly string[]}):PunjabiGeneratedQuestion{
 const rng=createRng(`CP006:${input.familyId}:${input.seed}`);const correct=norm(input.correctAnswer);const ds=uniq(input.distractors).filter(x=>x!==correct);if(ds.length<3)throw new Error(`CP006 ${input.familyId}: fewer than three distractors`);const selected=rng.pickDistinct(ds,3);const options=rng.shuffle([correct,...selected]);const semanticParts=[input.familyId,input.subtype,input.difficulty,norm(input.stem),correct,[...selected].sort().join("|"),[...input.authorityIds].sort().join(",")];const fingerprint=`CP006-${semanticHash(semanticParts)}${semanticHash(["SECONDARY",...semanticParts].reverse())}`;return{id:`PUN-001-CP006-${input.familyId}-${fingerprint}`,stem:norm(input.stem),options,correctIndex:options.indexOf(correct),explanation:norm(input.explanation),difficulty:input.difficulty,metadata:{engine:"punjabi-v1",packageId:"PUN-001",cpId:"PUN-001-CP006",familyId:input.familyId,subtype:input.subtype,difficulty:input.difficulty,language:"pa-Guru",seed:input.seed,authorityIds:input.authorityIds,generatorRevision:"2.0.0-retrofit-exhaustive",fingerprint,lifecycle:"REVIEW_ONLY"}};
}

export function generateCP006F01(seed:number,difficulty:PunjabiDifficulty){requireDiff(difficulty,["Easy"],"F01");const i=ord(seed,CP006_VERB_AUTHORITIES.length),a=CP006_VERB_AUTHORITIES[i]!;return assemble({seed,difficulty,familyId:"F01",subtype:"VERB_PHRASE_IDENTIFICATION",stem:pickVariant([`ਵਾਕ ਵਿੱਚ ਕਿਰਿਆ ਕਿਹੜੀ ਹੈ?\n${a.sentence}`,`ਹੇਠਲੇ ਵਾਕ ਵਿੱਚ ਕਿਰਿਆ-ਭਾਗ ਪਛਾਣੋ।\n${a.sentence}`,`ਵਾਕ ਵਿੱਚ ਕੰਮ ਜਾਂ ਹਾਲਤ ਦੱਸਣ ਵਾਲਾ ਕਿਰਿਆ-ਰੂਪ ਚੁਣੋ।\n${a.sentence}`],i),correctAnswer:a.verbPhrase,distractors:a.sentenceDistractors,explanation:`ਵਾਕ ਵਿੱਚ ‘${a.verbPhrase}’ ਕਿਰਿਆ ਹੈ। ${a.explanationPa}`,authorityIds:[a.id]});}

export function generateCP006F02(seed:number,difficulty:PunjabiDifficulty){requireDiff(difficulty,["Easy"],"F02");const i=ord(seed,CP006_VERB_AUTHORITIES.length),a=CP006_VERB_AUTHORITIES[i]!;return assemble({seed,difficulty,familyId:"F02",subtype:"TRANSITIVITY_CLASSIFICATION",stem:pickVariant([`ਵਾਕ ਵਿੱਚ ‘${a.verbPhrase}’ ਕਿਸ ਕਿਸਮ ਦੀ ਕਿਰਿਆ ਹੈ?\n${a.sentence}`,`ਹੇਠਲੇ ਵਾਕ ਦੀ ਕਿਰਿਆ ਦਾ ਭੇਦ ਚੁਣੋ।\n${a.sentence}`,`‘${a.verbPhrase}’ ਨੂੰ ਸਕਰਮਕ ਜਾਂ ਅਕਰਮਕ ਹੋਣ ਦੇ ਆਧਾਰ ਤੇ ਪਛਾਣੋ।\n${a.sentence}`],i),correctAnswer:CP006_VERB_TYPE_LABELS[a.verbType],distractors:[a.verbType==="SAKARMAK"?"ਅਕਰਮਕ ਕਿਰਿਆ":"ਸਕਰਮਕ ਕਿਰਿਆ","ਸਹਾਇਕ ਕਿਰਿਆ","ਸੰਯੁਕਤ ਕਿਰਿਆ"],explanation:a.explanationPa,authorityIds:[a.id]});}

export function generateCP006F03(seed:number,difficulty:PunjabiDifficulty){requireDiff(difficulty,["Easy"],"F03");const i=ord(seed,CP006_VERB_AUTHORITIES.length),a=CP006_VERB_AUTHORITIES[i]!;return assemble({seed,difficulty,familyId:"F03",subtype:"TENSE_IDENTIFICATION",stem:pickVariant([`ਵਾਕ ਦਾ ਕਾਲ ਪਛਾਣੋ।\n${a.sentence}`,`‘${a.verbPhrase}’ ਕਿਹੜਾ ਕਾਲ ਦਰਸਾਉਂਦਾ ਹੈ?\n${a.sentence}`,`ਹੇਠਲੇ ਵਾਕ ਵਿੱਚ ਕਿਰਿਆ ਦਾ ਸਮਾਂ ਦੱਸੋ।\n${a.sentence}`],i),correctAnswer:CP006_TENSE_LABELS[a.tense],distractors:["ਵਰਤਮਾਨ ਕਾਲ","ਭੂਤਕਾਲ","ਭਵਿੱਖਤ ਕਾਲ","ਕਾਲ ਸਪਸ਼ਟ ਨਹੀਂ"],explanation:`‘${a.verbPhrase}’ ${CP006_TENSE_LABELS[a.tense]} ਦਰਸਾਉਂਦਾ ਹੈ।`,authorityIds:[a.id]});}

const AUX=CP006_VERB_AUTHORITIES.filter(x=>x.auxiliaryVerb);
export function generateCP006F04(seed:number,difficulty:PunjabiDifficulty){requireDiff(difficulty,["Medium"],"F04");const i=ord(seed,AUX.length),a=AUX[i]!;return assemble({seed,difficulty,familyId:"F04",subtype:"AUXILIARY_IDENTIFICATION",stem:pickVariant([`ਵਾਕ ਵਿੱਚ ਸਹਾਇਕ ਕਿਰਿਆ ਕਿਹੜੀ ਹੈ?\n${a.sentence}`,`‘${a.verbPhrase}’ ਵਿੱਚ ਸਹਾਇਕ ਕਿਰਿਆ ਪਛਾਣੋ।\n${a.sentence}`,`ਮੁੱਖ ਕਿਰਿਆ ਨਾਲ ਆਇਆ ਸਹਾਇਕ ਰੂਪ ਚੁਣੋ।\n${a.sentence}`],i),correctAnswer:a.auxiliaryVerb!,distractors:[a.mainVerb,...a.sentenceDistractors],explanation:`‘${a.verbPhrase}’ ਵਿੱਚ ‘${a.auxiliaryVerb}’ ਸਹਾਇਕ ਕਿਰਿਆ ਹੈ ਅਤੇ ‘${a.mainVerb}’ ਮੁੱਖ ਕਿਰਿਆ-ਭਾਗ ਹੈ।`,authorityIds:[a.id]});}

const OBJECTS=CP006_VERB_AUTHORITIES.filter(x=>x.directObject&&x.objectDistractors);
export function generateCP006F05(seed:number,difficulty:PunjabiDifficulty){requireDiff(difficulty,["Medium"],"F05");const i=ord(seed,OBJECTS.length),a=OBJECTS[i]!;return assemble({seed,difficulty,familyId:"F05",subtype:"DIRECT_OBJECT_IDENTIFICATION",stem:pickVariant([`ਵਾਕ ਵਿੱਚ ਕਿਰਿਆ ਦਾ ਕਰਮ ਕਿਹੜਾ ਹੈ?\n${a.sentence}`,`‘${a.verbPhrase}’ ਦਾ ਕਰਮ ਪਛਾਣੋ।\n${a.sentence}`,`ਹੇਠਲੇ ਵਾਕ ਵਿੱਚ ਕਿਰਿਆ ਦਾ ਅਸਰ ਕਿਸ ਸ਼ਬਦ ਉੱਤੇ ਪੈਂਦਾ ਹੈ?\n${a.sentence}`],i),correctAnswer:a.directObject!,distractors:a.objectDistractors!,explanation:`ਵਾਕ ਵਿੱਚ ‘${a.directObject}’ ਕਿਰਿਆ ‘${a.verbPhrase}’ ਦਾ ਕਰਮ ਹੈ। ਇਸ ਲਈ ਕਿਰਿਆ ਸਕਰਮਕ ਹੈ।`,authorityIds:[a.id]});}

type K="present"|"past"|"future";const N:Record<K,string>={present:"ਵਰਤਮਾਨ ਕਾਲ",past:"ਭੂਤਕਾਲ",future:"ਭਵਿੱਖਤ ਕਾਲ"};const DIR:readonly [K,K][]=[["present","past"],["present","future"],["past","present"],["past","future"],["future","present"],["future","past"]];
export function generateCP006F06(seed:number,difficulty:PunjabiDifficulty){requireDiff(difficulty,["Medium"],"F06");const r=ord(seed,CP006_TENSE_TRIPLETS.length*DIR.length),t=CP006_TENSE_TRIPLETS[Math.floor(r/DIR.length)]!,[from,to]=DIR[r%DIR.length]!;return assemble({seed,difficulty,familyId:"F06",subtype:"TENSE_TRANSFORMATION",stem:pickVariant([`ਹੇਠਲੇ ਵਾਕ ਨੂੰ ${N[to]} ਵਿੱਚ ਬਦਲੋ।\n${t[from]}`,`ਵਾਕ ਦਾ ਅਰਥ ਕਾਇਮ ਰੱਖਦੇ ਹੋਏ ਇਸ ਨੂੰ ${N[to]} ਵਿੱਚ ਲਿਖਿਆ ਰੂਪ ਚੁਣੋ।\n${t[from]}`,`${N[from]} ਦੇ ਇਸ ਵਾਕ ਦਾ ${N[to]} ਰੂਪ ਕਿਹੜਾ ਹੈ?\n${t[from]}`],r),correctAnswer:t[to],distractors:[t.present,t.past,t.future,t.pastNearMiss,t.futureNearMiss],explanation:`${N[to]} ਦਾ ਸਹੀ ਰੂਪ ‘${t[to]}’ ਹੈ। ${t.explanationPa}`,authorityIds:[t.id]});}

const TT=["ਸਕਰਮਕ ਕਿਰਿਆ — ਵਰਤਮਾਨ ਕਾਲ","ਸਕਰਮਕ ਕਿਰਿਆ — ਭੂਤਕਾਲ","ਸਕਰਮਕ ਕਿਰਿਆ — ਭਵਿੱਖਤ ਕਾਲ","ਅਕਰਮਕ ਕਿਰਿਆ — ਵਰਤਮਾਨ ਕਾਲ","ਅਕਰਮਕ ਕਿਰਿਆ — ਭੂਤਕਾਲ","ਅਕਰਮਕ ਕਿਰਿਆ — ਭਵਿੱਖਤ ਕਾਲ"] as const;
export function generateCP006F07(seed:number,difficulty:PunjabiDifficulty){requireDiff(difficulty,["Hard"],"F07");const i=ord(seed,CP006_VERB_AUTHORITIES.length),a=CP006_VERB_AUTHORITIES[i]!,correct=`${CP006_VERB_TYPE_LABELS[a.verbType]} — ${CP006_TENSE_LABELS[a.tense]}`;return assemble({seed,difficulty,familyId:"F07",subtype:"TYPE_TENSE_DUAL_DIAGNOSIS",stem:pickVariant([`ਵਾਕ ਦੀ ਕਿਰਿਆ ਦਾ ਭੇਦ ਅਤੇ ਕਾਲ ਦੋਵੇਂ ਸਹੀ ਦੱਸਣ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।\n${a.sentence}`,`‘${a.verbPhrase}’ ਲਈ ਕਿਰਿਆ-ਭੇਦ ਅਤੇ ਕਾਲ ਦਾ ਸਹੀ ਜੋੜਾ ਕਿਹੜਾ ਹੈ?\n${a.sentence}`,`ਹੇਠਲੇ ਵਾਕ ਦੀ ਕਿਰਿਆ ਨੂੰ ਭੇਦ ਅਤੇ ਕਾਲ ਦੋਵੇਂ ਦੇ ਆਧਾਰ ਤੇ ਪਛਾਣੋ।\n${a.sentence}`],i),correctAnswer:correct,distractors:TT,explanation:`${a.explanationPa} ਨਾਲ ਹੀ ‘${a.verbPhrase}’ ${CP006_TENSE_LABELS[a.tense]} ਵਿੱਚ ਹੈ।`,authorityIds:[a.id]});}

function trueClaim(t:(typeof CP006_TENSE_TRIPLETS)[number],s:K,to:K){return `‘${t[s]}’ ਦਾ ${N[to]} ਰੂਪ ‘${t[to]}’ ਹੈ।`;}
function falseClaim(t:(typeof CP006_TENSE_TRIPLETS)[number],s:K,to:K){const wrong=(['present','past','future'] as K[]).find(x=>x!==to&&x!==s)!;return `‘${t[s]}’ ਦਾ ${N[to]} ਰੂਪ ‘${t[wrong]}’ ਹੈ।`;}
export function generateCP006F08(seed:number,difficulty:PunjabiDifficulty){requireDiff(difficulty,["Hard"],"F08");const cap=CP006_TENSE_TRIPLETS.length*(CP006_TENSE_TRIPLETS.length-1)*4,r=ord(seed,cap),mode=r%4,p=Math.floor(r/4),ai=p%CP006_TENSE_TRIPLETS.length,bo=Math.floor(p/CP006_TENSE_TRIPLETS.length)%(CP006_TENSE_TRIPLETS.length-1),bi=bo>=ai?bo+1:bo,a=CP006_TENSE_TRIPLETS[ai]!,b=CP006_TENSE_TRIPLETS[bi]!,s1=mode===0||mode===1?trueClaim(a,"present","past"):falseClaim(a,"present","past"),s2=mode===0||mode===2?trueClaim(b,"past","future"):falseClaim(b,"past","future"),correct=["ਦੋਵੇਂ ਕਥਨ ਸਹੀ ਹਨ","ਕੇਵਲ ਕਥਨ 1 ਸਹੀ ਹੈ","ਕੇਵਲ ਕਥਨ 2 ਸਹੀ ਹੈ","ਦੋਵੇਂ ਕਥਨ ਗਲਤ ਹਨ"][mode]!;return assemble({seed,difficulty,familyId:"F08",subtype:"TENSE_SHIFT_STATEMENT_ANALYSIS",stem:pickVariant([`ਕਥਨ 1: ${s1}\nਕਥਨ 2: ${s2}\nਸਹੀ ਵਿਕਲਪ ਚੁਣੋ।`,`ਹੇਠਲੇ ਦੋ ਕਥਨਾਂ ਦੀ ਜਾਂਚ ਕਰੋ।\nਕਥਨ 1: ${s1}\nਕਥਨ 2: ${s2}`],p),correctAnswer:correct,distractors:["ਦੋਵੇਂ ਕਥਨ ਸਹੀ ਹਨ","ਕੇਵਲ ਕਥਨ 1 ਸਹੀ ਹੈ","ਕੇਵਲ ਕਥਨ 2 ਸਹੀ ਹੈ","ਦੋਵੇਂ ਕਥਨ ਗਲਤ ਹਨ"],explanation:`ਕਥਨ 1 ਦਾ ਸਹੀ ਭੂਤਕਾਲੀ ਰੂਪ ‘${a.past}’ ਹੈ। ਕਥਨ 2 ਦਾ ਸਹੀ ਭਵਿੱਖਤ ਰੂਪ ‘${b.future}’ ਹੈ।`,authorityIds:[a.id,b.id]});}

export function generateCP006F09(seed:number,difficulty:PunjabiDifficulty){requireDiff(difficulty,["Medium"],"F09");const i=ord(seed,CP006_ASPECT_AUTHORITIES.length),a=CP006_ASPECT_AUTHORITIES[i]!;return assemble({seed,difficulty,familyId:"F09",subtype:"ASPECT_IDENTIFICATION",stem:pickVariant([`ਵਾਕ ਵਿੱਚ ਕਿਰਿਆ ਦਾ ਪੱਖ ਪਛਾਣੋ।\n${a.sentence}`,`‘${a.verbPhrase}’ ਕਿਹੜਾ ਕਿਰਿਆ-ਪੱਖ ਦਰਸਾਉਂਦਾ ਹੈ?\n${a.sentence}`,`ਹੇਠਲੇ ਵਾਕ ਵਿੱਚ ਕਿਰਿਆ ਦੀ ਅਵਸਥਾ ਅਨੁਸਾਰ ਸਹੀ ਪੱਖ ਚੁਣੋ।\n${a.sentence}`],i),correctAnswer:a.aspectPa,distractors:CP006_ASPECT_LABELS,explanation:a.explanationPa,authorityIds:[a.id]});}


function sentencePieces(sentence:string,forbidden:readonly string[]){
 const clean=sentence.replace(/[।,.!?;:“”‘’"'()]/g," ").split(/\s+/).map(norm).filter(Boolean);
 const forbiddenTokens=new Set(forbidden.flatMap(x=>x.replace(/[।,.!?;:“”‘’"'()]/g," ").split(/\s+/).map(norm).filter(Boolean)));
 const out:string[]=[];const add=(v:string)=>{v=norm(v);if(v&&!forbidden.includes(v)&&!out.includes(v))out.push(v);};
 for(const token of clean)if(!forbiddenTokens.has(token))add(token);
 for(let n=2;n<=3;n++)for(let i=0;i<=clean.length-n;i++){const chunk=clean.slice(i,i+n);if(chunk.some(t=>forbiddenTokens.has(t)))continue;add(chunk.join(" "));}
 return out;
}

export function generateCP006F10(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F10");const i=ord(seed,CP006_TENSE_SHIFTS.length),a=CP006_TENSE_SHIFTS[i]!;
 return assemble({seed,difficulty,familyId:"F10",subtype:"AUDITED_TENSE_SHIFT",stem:pickVariant([
  `ਹੇਠਲੇ ਵਾਕ ਦਾ ${a.targetTense} ਰੂਪ ਚੁਣੋ।\n${a.baseSentence}`,
  `ਵਾਕ ਦਾ ਮੂਲ ਅਰਥ ਕਾਇਮ ਰੱਖਦੇ ਹੋਏ ਇਸ ਨੂੰ ${a.targetTense} ਵਿੱਚ ਬਦਲੋ।\n${a.baseSentence}`,
  `${a.targetTense} ਵਿੱਚ ਸਹੀ ਬਦਲਿਆ ਵਾਕ ਕਿਹੜਾ ਹੈ?\n${a.baseSentence}`
 ],i),correctAnswer:a.convertedSentence,distractors:a.distractors,explanation:a.explanationPa,authorityIds:[a.id]});
}

const TRANSITIVITY_RELATIONS=[
 "ਪਹਿਲੀ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ ਅਤੇ ਦੂਜੀ ਉਸ ਦਾ ਸਕਰਮਕ ਰੂਪ ਹੈ",
 "ਪਹਿਲੀ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ ਅਤੇ ਦੂਜੀ ਉਸ ਦਾ ਅਕਰਮਕ ਰੂਪ ਹੈ",
 "ਦੋਵੇਂ ਅਕਰਮਕ ਕਿਰਿਆਵਾਂ ਹਨ",
 "ਦੋਵੇਂ ਸਕਰਮਕ ਕਿਰਿਆਵਾਂ ਹਨ",
] as const;
export function generateCP006F11(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F11");const i=ord(seed,CP006_TRANSITIVITY_CONVERSIONS.length),a=CP006_TRANSITIVITY_CONVERSIONS[i]!;
 return assemble({seed,difficulty,familyId:"F11",subtype:"TRANSITIVITY_CONVERSION_RELATION",stem:pickVariant([
  `‘${a.intransitive}’ ਅਤੇ ‘${a.transitive}’ ਦਾ ਸਹੀ ਵਿਆਕਰਨਕ ਸੰਬੰਧ ਕਿਹੜਾ ਹੈ?`,
  `ਦਿੱਤੇ ਕਿਰਿਆ-ਜੋੜੇ ਦੀ ਸਹੀ ਪਛਾਣ ਚੁਣੋ: ‘${a.intransitive}’ — ‘${a.transitive}’`,
  `‘${a.intransitive}’ ਤੋਂ ‘${a.transitive}’ ਬਣਨ ਨਾਲ ਕਿਰਿਆ-ਭੇਦ ਵਿੱਚ ਕੀ ਬਦਲਾਅ ਆਉਂਦਾ ਹੈ?`
 ],i),correctAnswer:TRANSITIVITY_RELATIONS[0],distractors:TRANSITIVITY_RELATIONS,explanation:a.explanationPa,authorityIds:[a.id]});
}

export function generateCP006F12(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F12");const i=ord(seed,CP006_COMPOUND_VERBS.length),a=CP006_COMPOUND_VERBS[i]!;
 const ds=uniq([a.mainVerb,...sentencePieces(a.sentence,[a.compoundVerb,a.sanchalakVerb])]);
 return assemble({seed,difficulty,familyId:"F12",subtype:"COMPOUND_VERB_OPERATOR",stem:pickVariant([
  `ਵਾਕ ਵਿੱਚ ‘${a.compoundVerb}’ ਦੀ ਸੰਚਾਲਕ ਕਿਰਿਆ ਕਿਹੜੀ ਹੈ?\n${a.sentence}`,
  `‘${a.compoundVerb}’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਵਿੱਚ ਮੁੱਖ ਕਿਰਿਆ ਨਾਲ ਜੁੜਿਆ ਸੰਚਾਲਕ ਰੂਪ ਚੁਣੋ।\n${a.sentence}`,
  `ਹੇਠਲੇ ਵਾਕ ਦੀ ਸੰਯੁਕਤ ਕਿਰਿਆ ‘${a.compoundVerb}’ ਵਿੱਚ ਸੰਚਾਲਕ ਕਿਰਿਆ ਪਛਾਣੋ।\n${a.sentence}`
 ],i),correctAnswer:a.sanchalakVerb,distractors:ds,explanation:a.explanationPa,authorityIds:[a.id]});
}

export const CP006_FAMILIES:readonly PunjabiQuestionFamilyDefinition[]=[
 {familyId:"F01",subtype:"VERB_PHRASE_IDENTIFICATION",name:"Verb identification",targetDifficulties:["Easy"],generate:generateCP006F01},
 {familyId:"F02",subtype:"TRANSITIVITY_CLASSIFICATION",name:"Transitivity",targetDifficulties:["Easy"],generate:generateCP006F02},
 {familyId:"F03",subtype:"TENSE_IDENTIFICATION",name:"Tense identification",targetDifficulties:["Easy"],generate:generateCP006F03},
 {familyId:"F04",subtype:"AUXILIARY_IDENTIFICATION",name:"Auxiliary identification",targetDifficulties:["Medium"],generate:generateCP006F04},
 {familyId:"F05",subtype:"DIRECT_OBJECT_IDENTIFICATION",name:"Object identification",targetDifficulties:["Medium"],generate:generateCP006F05},
 {familyId:"F06",subtype:"TENSE_TRANSFORMATION",name:"Tense transformation",targetDifficulties:["Medium"],generate:generateCP006F06},
 {familyId:"F07",subtype:"TYPE_TENSE_DUAL_DIAGNOSIS",name:"Type and tense diagnosis",targetDifficulties:["Hard"],generate:generateCP006F07},
 {familyId:"F08",subtype:"TENSE_SHIFT_STATEMENT_ANALYSIS",name:"Tense statement analysis",targetDifficulties:["Hard"],generate:generateCP006F08},
 {familyId:"F09",subtype:"ASPECT_IDENTIFICATION",name:"Aspect identification",targetDifficulties:["Medium"],generate:generateCP006F09},
 {familyId:"F10",subtype:"AUDITED_TENSE_SHIFT",name:"Audited tense shift",targetDifficulties:["Medium"],generate:generateCP006F10},
 {familyId:"F11",subtype:"TRANSITIVITY_CONVERSION_RELATION",name:"Transitivity conversion",targetDifficulties:["Medium"],generate:generateCP006F11},
 {familyId:"F12",subtype:"COMPOUND_VERB_OPERATOR",name:"Compound verb operator",targetDifficulties:["Medium"],generate:generateCP006F12},
];
export function getCP006BreadthReport(){
 const capacities={
  F01:CP006_VERB_AUTHORITIES.length,
  F02:CP006_VERB_AUTHORITIES.length,
  F03:CP006_VERB_AUTHORITIES.length,
  F04:AUX.length,
  F05:OBJECTS.length,
  F06:CP006_TENSE_TRIPLETS.length*DIR.length,
  F07:CP006_VERB_AUTHORITIES.length,
  F08:CP006_TENSE_TRIPLETS.length*(CP006_TENSE_TRIPLETS.length-1)*4,
  F09:CP006_ASPECT_AUTHORITIES.length,
  F10:CP006_TENSE_SHIFTS.length,
  F11:CP006_TRANSITIVITY_CONVERSIONS.length,
  F12:CP006_COMPOUND_VERBS.length,
 };
 return{
  verbAuthorityCount:CP006_VERB_AUTHORITIES.length,
  auxiliaryAuthorityCount:AUX.length,
  objectAuthorityCount:OBJECTS.length,
  tenseTripletCount:CP006_TENSE_TRIPLETS.length,
  tenseShiftCount:CP006_TENSE_SHIFTS.length,
  transitivityConversionCount:CP006_TRANSITIVITY_CONVERSIONS.length,
  compoundVerbCount:CP006_COMPOUND_VERBS.length,
  aspectAuthorityCount:CP006_ASPECT_AUTHORITIES.length,
  totalAtomicAuthorities:CP006_VERB_AUTHORITIES.length+CP006_TENSE_TRIPLETS.length+CP006_TENSE_SHIFTS.length+CP006_TRANSITIVITY_CONVERSIONS.length+CP006_COMPOUND_VERBS.length+CP006_ASPECT_AUTHORITIES.length,
  familyCount:CP006_FAMILIES.length,
  capacities,
  totalSemanticCapacity:Object.values(capacities).reduce((a,b)=>a+b,0),
 };
}
