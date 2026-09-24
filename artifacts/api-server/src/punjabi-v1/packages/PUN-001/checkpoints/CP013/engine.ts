import { createRng } from "../../../../core/deterministic-rng";
import { semanticHash } from "../../../../core/semantic-hash";
import type { PunjabiDifficulty,PunjabiGeneratedQuestion } from "../../../../core/types";
import {
  CP013_CLASSIFICATION_ITEMS,
  CP013_TRANSFORMATION_ITEMS,
  CP013_CORRECTION_ITEMS,
  type SentenceClassificationItem,
  type SentenceTransformationItem,
  type SentenceCorrectionItem,
} from "./CP013-authorities";

const STRUCTURES=["ਸਧਾਰਨ ਵਾਕ","ਸੰਯੁਕਤ ਵਾਕ","ਮਿਸ਼ਰਤ ਵਾਕ"] as const;
const FUNCTIONS=["ਹਾਂ-ਵਾਚਕ ਵਾਕ","ਨਾਂਹ-ਵਾਚਕ ਵਾਕ","ਪ੍ਰਸ਼ਨ-ਵਾਚਕ ਵਾਕ","ਹੁਕਮੀ ਵਾਕ","ਵਿਸਮਈ ਵਾਕ"] as const;

function norm(v:string){return v.normalize("NFC").trim();}
function ord(seed:number,cap:number){const n=Math.trunc(seed)-1;return ((n%cap)+cap)%cap;}
function uniq(v:readonly string[]){return [...new Set(v.map(norm).filter(Boolean))];}
function pickVariant(v:readonly string[],s:number){return v[ord(s+1,v.length)]!;}
function requireDiff(actual:PunjabiDifficulty,allowed:readonly PunjabiDifficulty[],id:string){if(!allowed.includes(actual))throw new Error(`CP013 ${id} does not support ${actual}`);}

function assemble(input:{seed:number;difficulty:PunjabiDifficulty;familyId:string;subtype:string;stem:string;correctAnswer:string;distractors:readonly string[];explanation:string;authorityIds:readonly string[]}):PunjabiGeneratedQuestion{
 const rng=createRng(`CP013:${input.familyId}:${input.seed}`);
 const correct=norm(input.correctAnswer);
 const ds=uniq(input.distractors).filter(x=>x!==correct);
 if(ds.length<3)throw new Error(`CP013 ${input.familyId}: fewer than three distractors`);
 const selected=rng.pickDistinct(ds,3);
 const options=rng.shuffle([correct,...selected]);
 const fingerprint=`CP013-${semanticHash([input.familyId,input.subtype,input.difficulty,norm(input.stem),correct,[...selected].sort().join("|"),[...input.authorityIds].sort().join(",")])}`;
 return {
  id:`PUN-001-CP013-${input.familyId}-${fingerprint}`,
  stem:norm(input.stem),
  options,
  correctIndex:options.indexOf(correct),
  explanation:norm(input.explanation),
  difficulty:input.difficulty,
  metadata:{
   engine:"punjabi-v1",packageId:"PUN-001",cpId:"PUN-001-CP013",familyId:input.familyId,subtype:input.subtype,
   difficulty:input.difficulty,language:"pa-Guru",seed:input.seed,authorityIds:input.authorityIds,
   generatorRevision:"1.1.0-blueprint-gap-closure",fingerprint,lifecycle:"REVIEW_ONLY"
  }
 };
}

function cls(seed:number){return CP013_CLASSIFICATION_ITEMS[ord(seed,CP013_CLASSIFICATION_ITEMS.length)]!;}
function trf(seed:number){return CP013_TRANSFORMATION_ITEMS[ord(seed,CP013_TRANSFORMATION_ITEMS.length)]!;}
function cor(seed:number){return CP013_CORRECTION_ITEMS[ord(seed,CP013_CORRECTION_ITEMS.length)]!;}

function transformationPeers(item:SentenceTransformationItem,count:number,seed:number){
 const same=CP013_TRANSFORMATION_ITEMS.filter(x=>x.id!==item.id&&x.originalCategory===item.originalCategory&&x.targetCategory===item.targetCategory);
 const rest=CP013_TRANSFORMATION_ITEMS.filter(x=>x.id!==item.id&&!same.some(y=>y.id===x.id));
 const pool=[...createRng(`CP013:TRF-SAME:${seed}`).shuffle(same),...createRng(`CP013:TRF-REST:${seed}`).shuffle(rest)];
 const out:SentenceTransformationItem[]=[];
 const seenOriginal=new Set([norm(item.originalSentence)]);
 const seenCorrect=new Set([norm(item.correctSentence)]);
 for(const p of pool){
  if(seenOriginal.has(norm(p.originalSentence))||seenCorrect.has(norm(p.correctSentence)))continue;
  seenOriginal.add(norm(p.originalSentence));seenCorrect.add(norm(p.correctSentence));out.push(p);
  if(out.length===count)break;
 }
 if(out.length<count)throw new Error(`CP013 ${item.id}: insufficient transformation peers`);
 return out;
}

function errorTypes(item:SentenceCorrectionItem){
 return uniq(CP013_CORRECTION_ITEMS.filter(x=>x.id!==item.id).map(x=>x.errorType)).filter(x=>x!==norm(item.errorType));
}

interface CP013BlankSurface{
 readonly authorityId:string;
 readonly template:string;
 readonly correct:string;
 readonly distractors:readonly string[];
 readonly explanation:string;
}
function buildBlankSurface(item:SentenceCorrectionItem):CP013BlankSurface|null{
 const variants=[item.correctSentence,item.incorrectSentence,...item.distractors].map(v=>norm(v).split(/\s+/));
 const minLen=Math.min(...variants.map(v=>v.length));
 let prefix=0;
 while(prefix<minLen&&variants.every(v=>v[prefix]===variants[0]![prefix]))prefix++;
 let suffix=0;
 while(suffix<minLen-prefix&&variants.every(v=>v[v.length-1-suffix]===variants[0]![variants[0]!.length-1-suffix]))suffix++;
 const mids=variants.map(v=>v.slice(prefix,v.length-suffix).join(" ").trim());
 const correct=mids[0]!;
 const distractors=uniq(mids.slice(1)).filter(v=>v!==correct);
 if(!correct||distractors.length<3)return null;
 const base=variants[0]!;
 const template=[...base.slice(0,prefix),"____",...base.slice(base.length-suffix)].join(" ").replace(/\s+([।?!,:;])/gu,"$1");
 return {authorityId:item.id,template,correct,distractors,explanation:item.explanationPa};
}
export const CP013_BLANK_SURFACES=CP013_CORRECTION_ITEMS.map(buildBlankSurface).filter((x):x is CP013BlankSurface=>Boolean(x));

const VERDICTS=["ਦੋਵੇਂ ਕਥਨ ਸਹੀ ਹਨ","ਕੇਵਲ ਕਥਨ 1 ਸਹੀ ਹੈ","ਕੇਵਲ ਕਥਨ 2 ਸਹੀ ਹੈ","ਦੋਵੇਂ ਕਥਨ ਗਲਤ ਹਨ"] as const;
function wrongClassLabel(item:SentenceClassificationItem,seed:number){
 const correct=classLabel(item),candidates:string[]=[];
 for(const structure of STRUCTURES)for(const fn of FUNCTIONS){const v=`${structure} — ${fn}`;if(v!==correct)candidates.push(v);}
 return candidates[ord(seed,candidates.length)]!;
}

function classLabel(item:SentenceClassificationItem){return `${item.structureType} — ${item.functionType}`;}
function structureReason(item:SentenceClassificationItem){
 if(item.structureType==="ਸਧਾਰਨ ਵਾਕ")return "ਬਣਤਰ ਪੱਖੋਂ ਇਹ ਸਧਾਰਨ ਵਾਕ ਹੈ, ਕਿਉਂਕਿ ਇਸ ਵਿੱਚ ਇੱਕ ਮੁੱਖ ਸੁਤੰਤਰ ਵਾਕੀ ਇਕਾਈ ਹੈ।";
 if(item.structureType==="ਸੰਯੁਕਤ ਵਾਕ")return "ਬਣਤਰ ਪੱਖੋਂ ਇਹ ਸੰਯੁਕਤ ਵਾਕ ਹੈ, ਕਿਉਂਕਿ ਇਸ ਵਿੱਚ ਦੋ ਸੁਤੰਤਰ ਉਪਵਾਕ ਸਮਾਨ ਯੋਜਕ ਨਾਲ ਜੁੜੇ ਹਨ।";
 return "ਬਣਤਰ ਪੱਖੋਂ ਇਹ ਮਿਸ਼ਰਤ ਵਾਕ ਹੈ, ਕਿਉਂਕਿ ਮੁੱਖ ਉਪਵਾਕ ਨਾਲ ਇੱਕ ਅਧੀਨ ਉਪਵਾਕ ਜੁੜਿਆ ਹੈ।";
}
function functionReason(item:SentenceClassificationItem){
 if(item.functionType==="ਹਾਂ-ਵਾਚਕ ਵਾਕ")return "ਕਾਰਜ ਪੱਖੋਂ ਇਹ ਹਾਂ-ਵਾਚਕ ਵਾਕ ਹੈ, ਕਿਉਂਕਿ ਵਾਕ ਕਿਸੇ ਗੱਲ ਨੂੰ ਸਵੀਕਾਰਾਤਮਕ ਰੂਪ ਵਿੱਚ ਦੱਸਦਾ ਹੈ।";
 if(item.functionType==="ਨਾਂਹ-ਵਾਚਕ ਵਾਕ")return "ਕਾਰਜ ਪੱਖੋਂ ਇਹ ਨਾਂਹ-ਵਾਚਕ ਵਾਕ ਹੈ, ਕਿਉਂਕਿ ਵਾਕ ਵਿੱਚ ਨਕਾਰ ਜਾਂ ਮਨਾਹੀ ਦਾ ਭਾਵ ਹੈ।";
 if(item.functionType==="ਪ੍ਰਸ਼ਨ-ਵਾਚਕ ਵਾਕ")return "ਕਾਰਜ ਪੱਖੋਂ ਇਹ ਪ੍ਰਸ਼ਨ-ਵਾਚਕ ਵਾਕ ਹੈ, ਕਿਉਂਕਿ ਇਸ ਵਿੱਚ ਜਾਣਕਾਰੀ ਲਈ ਪ੍ਰਸ਼ਨ ਪੁੱਛਿਆ ਗਿਆ ਹੈ।";
 if(item.functionType==="ਹੁਕਮੀ ਵਾਕ")return "ਕਾਰਜ ਪੱਖੋਂ ਇਹ ਹੁਕਮੀ ਵਾਕ ਹੈ, ਕਿਉਂਕਿ ਇਸ ਵਿੱਚ ਹੁਕਮ, ਬੇਨਤੀ, ਸਲਾਹ ਜਾਂ ਹਦਾਇਤ ਦਿੱਤੀ ਗਈ ਹੈ।";
 return "ਕਾਰਜ ਪੱਖੋਂ ਇਹ ਵਿਸਮਈ ਵਾਕ ਹੈ, ਕਿਉਂਕਿ ਇਸ ਵਿੱਚ ਹੈਰਾਨੀ, ਖ਼ੁਸ਼ੀ, ਦੁੱਖ ਜਾਂ ਹੋਰ ਤੀਬਰ ਭਾਵ ਪ੍ਰਗਟ ਹੁੰਦਾ ਹੈ।";
}

export function generateCP013F01(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F01");
 const i=ord(seed,CP013_CLASSIFICATION_ITEMS.length),a=CP013_CLASSIFICATION_ITEMS[i]!,correct=classLabel(a);
 const candidates:string[]=[];
 for(const structure of STRUCTURES)for(const fn of FUNCTIONS){
  const v=`${structure} — ${fn}`; if(v!==correct)candidates.push(v);
 }
 return assemble({
  seed,difficulty,familyId:"F01",subtype:"COMBINED_STRUCTURE_FUNCTION_CLASSIFICATION",
  stem:pickVariant([
   `ਵਾਕ “${a.sentencePa}” ਦਾ ਬਣਤਰ ਅਤੇ ਕਾਰਜ ਪੱਖੋਂ ਸਹੀ ਵਰਗੀਕਰਨ ਕਿਹੜਾ ਹੈ?`,
   `“${a.sentencePa}” ਨੂੰ ਬਣਤਰ ਅਤੇ ਕਾਰਜ ਦੋਵਾਂ ਪੱਖਾਂ ਤੋਂ ਪਛਾਣੋ।`,
   `ਦਿੱਤੇ ਵਾਕ ਦਾ ਸਹੀ ਬਣਤਰ–ਕਾਰਜ ਜੋੜਾ ਚੁਣੋ।\n${a.sentencePa}`
  ],i),
  correctAnswer:correct,distractors:candidates,explanation:structureReason(a)+" "+functionReason(a),authorityIds:[a.id]
 });
}

export function generateCP013F02(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Easy"],"F02");
 const i=ord(seed,CP013_CLASSIFICATION_ITEMS.length),a=CP013_CLASSIFICATION_ITEMS[i]!;
 return assemble({
  seed,difficulty,familyId:"F02",subtype:"FUNCTION_CLASSIFICATION",
  stem:pickVariant([
   `ਕਾਰਜ ਪੱਖੋਂ ਵਾਕ “${a.sentencePa}” ਦੀ ਕਿਸਮ ਕਿਹੜੀ ਹੈ?`,
   `“${a.sentencePa}” ਕਿਹੜੀ ਕਾਰਜਕ ਕਿਸਮ ਦਾ ਵਾਕ ਹੈ?`,
   `ਦਿੱਤੇ ਵਾਕ ਦਾ ਕਾਰਜ ਪੱਖੋਂ ਸਹੀ ਵਰਗ ਚੁਣੋ।\n${a.sentencePa}`
  ],i),
  correctAnswer:a.functionType,distractors:FUNCTIONS.filter(x=>x!==a.functionType),explanation:functionReason(a),authorityIds:[a.id]
 });
}

export function generateCP013F03(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Easy"],"F03");
 const i=ord(seed,CP013_TRANSFORMATION_ITEMS.length),a=CP013_TRANSFORMATION_ITEMS[i]!;
 return assemble({
  seed,difficulty,familyId:"F03",subtype:"FORWARD_MEANING_PRESERVING_TRANSFORMATION",
  stem:pickVariant([
   `ਵਾਕ “${a.originalSentence}” ਨੂੰ ਭਾਵ ਬਿਨਾਂ ਬਦਲੇ ‘${a.targetCategory}’ ਵਿੱਚ ਬਦਲੋ।`,
   `‘${a.targetCategory}’ ਵਿੱਚ “${a.originalSentence}” ਦਾ ਢੁਕਵਾਂ ਰੂਪ ਕਿਹੜਾ ਹੈ?`,
   `ਦਿੱਤੇ ਵਾਕ ਦਾ ਭਾਵ ਕਾਇਮ ਰੱਖਦਿਆਂ ਸਹੀ ਰੂਪਾਂਤਰਣ ਚੁਣੋ।\n${a.originalSentence}`
  ],i),
  correctAnswer:a.correctSentence,distractors:a.distractors,explanation:a.explanationPa,authorityIds:[a.id]
 });
}

export function generateCP013F04(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F04");
 const i=ord(seed,CP013_TRANSFORMATION_ITEMS.length),a=CP013_TRANSFORMATION_ITEMS[i]!,peers=transformationPeers(a,3,seed);
 return assemble({
  seed,difficulty,familyId:"F04",subtype:"REVERSE_TRANSFORMATION",
  stem:pickVariant([
   `ਰੂਪਾਂਤਰਿਤ ਵਾਕ “${a.correctSentence}” ਦਾ ਮੂਲ ‘${a.originalCategory}’ ਰੂਪ ਕਿਹੜਾ ਹੈ?`,
   `“${a.correctSentence}” ਕਿਸ ਮੂਲ ਵਾਕ ਦਾ ਭਾਵ-ਸਮਾਨ ਰੂਪ ਹੈ?`,
   `ਦਿੱਤੇ ਰੂਪਾਂਤਰਣ ਤੋਂ ਮੂਲ ਵਾਕ ਪਛਾਣੋ।\n${a.correctSentence}`
  ],i),
  correctAnswer:a.originalSentence,distractors:peers.map(x=>x.originalSentence),
  explanation:`ਇਸ ਰੂਪਾਂਤਰਣ ਦਾ ਮੂਲ ਵਾਕ “${a.originalSentence}” ਹੈ। ${a.explanationPa}`,
  authorityIds:[a.id,...peers.map(x=>x.id)]
 });
}

export function generateCP013F05(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Easy"],"F05");
 const i=ord(seed,CP013_CORRECTION_ITEMS.length),a=CP013_CORRECTION_ITEMS[i]!;
 return assemble({
  seed,difficulty,familyId:"F05",subtype:"SENTENCE_CORRECTION",
  stem:pickVariant([
   `ਅਸ਼ੁੱਧ ਵਾਕ “${a.incorrectSentence}” ਦਾ ਸ਼ੁੱਧ ਰੂਪ ਕਿਹੜਾ ਹੈ?`,
   `“${a.incorrectSentence}” ਨੂੰ ਠੀਕ ਕਰਕੇ ਸਹੀ ਵਾਕ ਚੁਣੋ।`,
   `ਹੇਠ ਦਿੱਤੇ ਅਸ਼ੁੱਧ ਵਾਕ ਦੀ ਸਹੀ ਸ਼ੁੱਧੀ ਕਿਹੜੀ ਹੈ?\n${a.incorrectSentence}`
  ],i),
  correctAnswer:a.correctSentence,distractors:a.distractors,explanation:a.explanationPa,authorityIds:[a.id]
 });
}

export function generateCP013F06(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F06");
 const i=ord(seed,CP013_CORRECTION_ITEMS.length),a=CP013_CORRECTION_ITEMS[i]!;
 return assemble({
  seed,difficulty,familyId:"F06",subtype:"GRAMMATICAL_ERROR_DIAGNOSIS",
  stem:pickVariant([
   `ਵਾਕ “${a.incorrectSentence}” ਵਿੱਚ ਮੁੱਖ ਵਿਆਕਰਨਕ ਗਲਤੀ ਕਿਸ ਕਿਸਮ ਦੀ ਹੈ?`,
   `“${a.incorrectSentence}” ਦੀ ਅਸ਼ੁੱਧੀ ਨੂੰ ਸਹੀ ਤਰ੍ਹਾਂ ਪਛਾਣੋ।`,
   `ਦਿੱਤੇ ਵਾਕ ਵਿੱਚ ਕਿਹੜੀ ਵਿਆਕਰਨਕ ਅਸ਼ੁੱਧੀ ਹੈ?\n${a.incorrectSentence}`
  ],i),
  correctAnswer:a.errorType,distractors:errorTypes(a),explanation:a.explanationPa,authorityIds:[a.id]
 });
}

export function generateCP013F07(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Hard"],"F07");
 const i=ord(seed,CP013_TRANSFORMATION_ITEMS.length),a=CP013_TRANSFORMATION_ITEMS[i]!;
 const correct=`${a.originalSentence} → ${a.correctSentence}`;
 const wrong=a.distractors.map(x=>`${a.originalSentence} → ${x}`);
 return assemble({
  seed,difficulty,familyId:"F07",subtype:"VALID_TRANSFORMATION_PAIR",
  stem:pickVariant([
   "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਾਕ-ਰੂਪਾਂਤਰਣ ਮੂਲ ਭਾਵ ਨੂੰ ਬਿਨਾਂ ਬਦਲੇ ਸਹੀ ਕੀਤਾ ਗਿਆ ਹੈ?",
   "ਮੂਲ ਭਾਵ ਕਾਇਮ ਰੱਖਣ ਵਾਲਾ ਸਹੀ ਵਾਕ-ਜੋੜਾ ਚੁਣੋ।",
   "ਕਿਹੜੇ ਵਿਕਲਪ ਵਿੱਚ ਵਾਕ ਦਾ ਰੂਪ ਬਦਲਿਆ ਹੈ ਪਰ ਭਾਵ ਨਹੀਂ?"
  ],i),
  correctAnswer:correct,distractors:wrong,
  explanation:`“${a.originalSentence}” ਦਾ ‘${a.targetCategory}’ ਵਿੱਚ ਸਹੀ ਰੂਪ “${a.correctSentence}” ਹੈ।`,
  authorityIds:[a.id]
 });
}

function orderedClassificationPair(seed:number){
 const n=CP013_CLASSIFICATION_ITEMS.length;
 const cap=n*(n-1),r=ord(seed,cap),firstIndex=Math.floor(r/(n-1)),offset=r%(n-1);
 const secondIndex=offset>=firstIndex?offset+1:offset;
 return {r,first:CP013_CLASSIFICATION_ITEMS[firstIndex]!,second:CP013_CLASSIFICATION_ITEMS[secondIndex]!};
}

export function generateCP013F08(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Hard"],"F08");
 const {r,first,second}=orderedClassificationPair(seed);
 const correct=`${classLabel(first)} | ${classLabel(second)}`;
 const allLabels:string[]=[];
 for(const s1 of STRUCTURES)for(const f1 of FUNCTIONS)for(const s2 of STRUCTURES)for(const f2 of FUNCTIONS){
  const value=`${s1} — ${f1} | ${s2} — ${f2}`; if(value!==correct)allLabels.push(value);
 }
 return assemble({
  seed,difficulty,familyId:"F08",subtype:"DUAL_STRUCTURAL_ANALYSIS",
  stem:pickVariant([
   `ਦੋਵੇਂ ਵਾਕਾਂ ਦਾ ਬਣਤਰ ਅਤੇ ਕਾਰਜ ਪੱਖੋਂ ਕ੍ਰਮਵਾਰ ਸਹੀ ਵਰਗੀਕਰਨ ਚੁਣੋ।\n1. ${first.sentencePa}\n2. ${second.sentencePa}`,
   `ਪਹਿਲੇ ਅਤੇ ਦੂਜੇ ਵਾਕ ਲਈ ਸਹੀ ਬਣਤਰ–ਕਾਰਜ ਜੋੜੇ ਕ੍ਰਮਵਾਰ ਕਿਹੜੇ ਹਨ?\n1. ${first.sentencePa}\n2. ${second.sentencePa}`,
   `ਹੇਠਲੇ ਦੋ ਵਾਕਾਂ ਦਾ ਪੂਰਾ ਵਿਆਕਰਨਕ ਵਰਗੀਕਰਨ ਕਰੋ।\n1. ${first.sentencePa}\n2. ${second.sentencePa}`
  ],r),
  correctAnswer:correct,distractors:allLabels,
  explanation:`ਪਹਿਲਾ ਵਾਕ ‘${first.structureType}’ ਅਤੇ ‘${first.functionType}’ ਹੈ; ਦੂਜਾ ਵਾਕ ‘${second.structureType}’ ਅਤੇ ‘${second.functionType}’ ਹੈ।`,
  authorityIds:[first.id,second.id]
 });
}

export function generateCP013F09(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Easy"],"F09");
 const i=ord(seed,CP013_CORRECTION_ITEMS.length),a=CP013_CORRECTION_ITEMS[i]!;
 return assemble({
  seed,difficulty,familyId:"F09",subtype:"NO_ERROR_SENTENCE_SELECTION",
  stem:pickVariant([
   "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਸ਼ੁੱਧ ਵਾਕ ਚੁਣੋ।",
   "ਕਿਹੜਾ ਵਾਕ ਵਿਆਕਰਨ ਪੱਖੋਂ ਸਹੀ ਹੈ?",
   "ਹੇਠ ਦਿੱਤੇ ਵਾਕਾਂ ਵਿੱਚੋਂ ਅਸ਼ੁੱਧੀ-ਰਹਿਤ ਵਾਕ ਕਿਹੜਾ ਹੈ?"
  ],i),
  correctAnswer:a.correctSentence,distractors:[a.incorrectSentence,...a.distractors],
  explanation:a.explanationPa,authorityIds:[a.id]
 });
}

export function generateCP013F10(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Easy"],"F10");
 const i=ord(seed,CP013_BLANK_SURFACES.length),a=CP013_BLANK_SURFACES[i]!;
 return assemble({
  seed,difficulty,familyId:"F10",subtype:"GRAMMATICAL_BLANK_COMPLETION",
  stem:pickVariant([
   `ਖਾਲੀ ਥਾਂ ਲਈ ਸਹੀ ਰੂਪ ਚੁਣੋ।\n${a.template}`,
   `ਵਾਕ ਨੂੰ ਵਿਆਕਰਨ ਪੱਖੋਂ ਸ਼ੁੱਧ ਕਰਨ ਲਈ ਖਾਲੀ ਥਾਂ ਭਰੋ।\n${a.template}`,
   `ਦਿੱਤੇ ਵਾਕ ਵਿੱਚ ਖਾਲੀ ਥਾਂ ਉੱਤੇ ਕਿਹੜਾ ਰੂਪ ਢੁਕਵਾਂ ਹੈ?\n${a.template}`
  ],i),
  correctAnswer:a.correct,distractors:a.distractors,
  explanation:a.explanation,authorityIds:[a.authorityId]
 });
}

export function generateCP013F11(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Hard"],"F11");
 const nC=CP013_CLASSIFICATION_ITEMS.length,nR=CP013_CORRECTION_ITEMS.length,cap=nC*nR*4;
 const r=ord(seed,cap),pattern=r%4,pairIndex=Math.floor(r/4);
 const first=CP013_CLASSIFICATION_ITEMS[Math.floor(pairIndex/nR)]!;
 const second=CP013_CORRECTION_ITEMS[pairIndex%nR]!;
 const t1=pattern===0||pattern===1,t2=pattern===0||pattern===2;
 const classClaim=t1?classLabel(first):wrongClassLabel(first,r+7);
 const correctionClaim=t2?second.correctSentence:second.distractors[ord(r+11,second.distractors.length)]!;
 const claim1=`“${first.sentencePa}” ਦਾ ਸਹੀ ਵਰਗੀਕਰਨ ‘${classClaim}’ ਹੈ।`;
 const claim2=`“${second.incorrectSentence}” ਦਾ ਸ਼ੁੱਧ ਰੂਪ “${correctionClaim}” ਹੈ।`;
 return assemble({
  seed,difficulty,familyId:"F11",subtype:"MIXED_RULE_VERIFICATION",
  stem:pickVariant([
   `ਹੇਠਲੇ ਦੋ ਕਥਨਾਂ ਨੂੰ ਵਿਆਕਰਨ ਅਨੁਸਾਰ ਪਰਖੋ।\nਕਥਨ 1: ${claim1}\nਕਥਨ 2: ${claim2}`,
   `ਦੋਵੇਂ ਕਥਨਾਂ ਦੀ ਸਹੀ ਸਥਿਤੀ ਚੁਣੋ।\nਕਥਨ 1: ${claim1}\nਕਥਨ 2: ${claim2}`,
   `ਵਾਕ-ਵਰਗੀਕਰਨ ਅਤੇ ਵਾਕ-ਸ਼ੁੱਧੀ ਬਾਰੇ ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਪਰਖੋ।\nਕਥਨ 1: ${claim1}\nਕਥਨ 2: ${claim2}`
  ],r),
  correctAnswer:VERDICTS[pattern]!,distractors:VERDICTS,
  explanation:`ਪਹਿਲੇ ਵਾਕ ਦਾ ਸਹੀ ਵਰਗੀਕਰਨ ‘${classLabel(first)}’ ਹੈ। ਦੂਜੇ ਵਾਕ ਦਾ ਸ਼ੁੱਧ ਰੂਪ “${second.correctSentence}” ਹੈ। ਇਸ ਲਈ ${VERDICTS[pattern]}।`,
  authorityIds:[first.id,second.id]
 });
}

export const CP013_FAMILIES=[
 {familyId:"F01",subtype:"COMBINED_STRUCTURE_FUNCTION_CLASSIFICATION",targetDifficulties:["Medium"] as PunjabiDifficulty[],semanticCapacity:CP013_CLASSIFICATION_ITEMS.length,generate:generateCP013F01},
 {familyId:"F02",subtype:"FUNCTION_CLASSIFICATION",targetDifficulties:["Easy"] as PunjabiDifficulty[],semanticCapacity:CP013_CLASSIFICATION_ITEMS.length,generate:generateCP013F02},
 {familyId:"F03",subtype:"FORWARD_MEANING_PRESERVING_TRANSFORMATION",targetDifficulties:["Easy"] as PunjabiDifficulty[],semanticCapacity:CP013_TRANSFORMATION_ITEMS.length,generate:generateCP013F03},
 {familyId:"F04",subtype:"REVERSE_TRANSFORMATION",targetDifficulties:["Medium"] as PunjabiDifficulty[],semanticCapacity:CP013_TRANSFORMATION_ITEMS.length,generate:generateCP013F04},
 {familyId:"F05",subtype:"SENTENCE_CORRECTION",targetDifficulties:["Easy"] as PunjabiDifficulty[],semanticCapacity:CP013_CORRECTION_ITEMS.length,generate:generateCP013F05},
 {familyId:"F06",subtype:"GRAMMATICAL_ERROR_DIAGNOSIS",targetDifficulties:["Medium"] as PunjabiDifficulty[],semanticCapacity:CP013_CORRECTION_ITEMS.length,generate:generateCP013F06},
 {familyId:"F07",subtype:"VALID_TRANSFORMATION_PAIR",targetDifficulties:["Hard"] as PunjabiDifficulty[],semanticCapacity:CP013_TRANSFORMATION_ITEMS.length,generate:generateCP013F07},
 {familyId:"F08",subtype:"DUAL_STRUCTURAL_ANALYSIS",targetDifficulties:["Hard"] as PunjabiDifficulty[],semanticCapacity:CP013_CLASSIFICATION_ITEMS.length*(CP013_CLASSIFICATION_ITEMS.length-1),generate:generateCP013F08},
 {familyId:"F09",subtype:"NO_ERROR_SENTENCE_SELECTION",targetDifficulties:["Easy"] as PunjabiDifficulty[],semanticCapacity:CP013_CORRECTION_ITEMS.length,generate:generateCP013F09},
 {familyId:"F10",subtype:"GRAMMATICAL_BLANK_COMPLETION",targetDifficulties:["Easy"] as PunjabiDifficulty[],semanticCapacity:CP013_BLANK_SURFACES.length,generate:generateCP013F10},
 {familyId:"F11",subtype:"MIXED_RULE_VERIFICATION",targetDifficulties:["Hard"] as PunjabiDifficulty[],semanticCapacity:CP013_CLASSIFICATION_ITEMS.length*CP013_CORRECTION_ITEMS.length*4,generate:generateCP013F11},
] as const;

export function generateCP013Question(seed:number,difficulty:PunjabiDifficulty="Medium",requestedFamilyId?:string){
 const eligible=CP013_FAMILIES.filter(f=>f.targetDifficulties.includes(difficulty));
 const family=requestedFamilyId?CP013_FAMILIES.find(f=>f.familyId===requestedFamilyId):eligible[ord(seed,eligible.length)];
 if(!family)throw new Error(`Unknown CP013 family ${requestedFamilyId}`);
 if(!family.targetDifficulties.includes(difficulty))throw new Error(`${family.familyId} does not support ${difficulty}`);
 return family.generate(seed,difficulty);
}

export function getCP013BreadthReport(){
 const capacities=Object.fromEntries(CP013_FAMILIES.map(f=>[f.familyId,f.semanticCapacity]));
 return {
  classificationAuthorities:CP013_CLASSIFICATION_ITEMS.length,
  transformationAuthorities:CP013_TRANSFORMATION_ITEMS.length,
  correctionAuthorities:CP013_CORRECTION_ITEMS.length,
  blankCompletionAuthorities:CP013_BLANK_SURFACES.length,
  totalAtomicAuthorities:CP013_CLASSIFICATION_ITEMS.length+CP013_TRANSFORMATION_ITEMS.length+CP013_CORRECTION_ITEMS.length,
  totalSemanticCapacity:CP013_FAMILIES.reduce((n,f)=>n+f.semanticCapacity,0),
  capacities
 };
}
