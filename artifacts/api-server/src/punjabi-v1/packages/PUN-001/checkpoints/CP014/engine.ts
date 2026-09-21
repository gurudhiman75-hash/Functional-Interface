import { createRng } from "../../../../core/deterministic-rng";
import { semanticHash } from "../../../../core/semantic-hash";
import type { PunjabiDifficulty,PunjabiGeneratedQuestion } from "../../../../core/types";
import {
  CP014_ADMIN_TERMS,
  type PassageQuestion,
  type ReadingPassageItem,
  type CP014AdministrativeAuthority,
} from "./CP014-authorities";
import { CP014_ALL_PASSAGES } from "./CP014-passages";

function norm(v:string){return v.normalize("NFC").trim();}
function ord(seed:number,cap:number){const n=Math.trunc(seed)-1;return ((n%cap)+cap)%cap;}
function uniq(v:readonly string[]){return [...new Set(v.map(norm).filter(Boolean))];}
function pickVariant(v:readonly string[],s:number){return v[ord(s+1,v.length)]!;}
function requireDiff(actual:PunjabiDifficulty,allowed:readonly PunjabiDifficulty[],id:string){if(!allowed.includes(actual))throw new Error(`CP014 ${id} does not support ${actual}`);}

function assemble(input:{seed:number;difficulty:PunjabiDifficulty;familyId:string;subtype:string;stem:string;correctAnswer:string;distractors:readonly string[];explanation:string;authorityIds:readonly string[]}):PunjabiGeneratedQuestion{
 const rng=createRng(`CP014:${input.familyId}:${input.seed}`);
 const correct=norm(input.correctAnswer);
 const ds=uniq(input.distractors).filter(x=>x!==correct);
 if(ds.length<3)throw new Error(`CP014 ${input.familyId}: fewer than three unique distractors`);
 const selected=rng.pickDistinct(ds,3);
 const options=rng.shuffle([correct,...selected]);
 const fingerprint=`CP014-${semanticHash([input.familyId,input.subtype,input.difficulty,norm(input.stem),correct,[...selected].sort().join("|"),[...input.authorityIds].sort().join(",")])}`;
 return {
  id:`PUN-001-CP014-${input.familyId}-${fingerprint}`,
  stem:norm(input.stem),
  options,
  correctIndex:options.indexOf(correct),
  explanation:norm(input.explanation),
  difficulty:input.difficulty,
  metadata:{
   engine:"punjabi-v1",packageId:"PUN-001",cpId:"PUN-001-CP014",familyId:input.familyId,subtype:input.subtype,
   difficulty:input.difficulty,language:"pa-Guru",seed:input.seed,authorityIds:input.authorityIds,
   generatorRevision:"1.0.0-forward-port",fingerprint,lifecycle:"REVIEW_ONLY"
  }
 };
}

type PassageAuthority={passage:ReadingPassageItem;q:PassageQuestion};
const FACTUAL:PassageAuthority[]=[],INFERENTIAL:PassageAuthority[]=[],TITLE_SUMMARY:PassageAuthority[]=[];
for(const passage of CP014_ALL_PASSAGES){
 for(const q of passage.questions){
  const item={passage,q};
  if(q.type==="factual")FACTUAL.push(item);
  else if(q.type==="inferential")INFERENTIAL.push(item);
  else TITLE_SUMMARY.push(item);
 }
}
function passageStem(item:PassageAuthority){
 return `ਹੇਠਾਂ ਦਿੱਤਾ ਪੈਰਾ ਪੜ੍ਹੋ ਅਤੇ ਪ੍ਰਸ਼ਨ ਦਾ ਉੱਤਰ ਦਿਓ।\n\n${item.passage.textPa}\n\n${item.q.questionStem}`;
}
function passageExplanation(item:PassageAuthority){return item.q.explanationPa;}

function adminIndex(item:CP014AdministrativeAuthority){return CP014_ADMIN_TERMS.findIndex(x=>x.id===item.id);}
function adminPeers(item:CP014AdministrativeAuthority,count:number){
 const i=adminIndex(item),n=CP014_ADMIN_TERMS.length;
 const offsets=[7,19,37,61,89,113,149,181,211];
 const out:CP014AdministrativeAuthority[]=[];
 const seenPa=new Set([item.punjabiTerm]),seenEn=new Set([item.englishTerm.toLowerCase()]);
 for(const o of offsets){
  const p=CP014_ADMIN_TERMS[(i+o)%n]!;
  if(p.id===item.id||seenPa.has(p.punjabiTerm)||seenEn.has(p.englishTerm.toLowerCase()))continue;
  seenPa.add(p.punjabiTerm);seenEn.add(p.englishTerm.toLowerCase());out.push(p);
  if(out.length===count)break;
 }
 if(out.length<count)throw new Error(`CP014 ${item.id}: insufficient terminology peers`);
 return out;
}
function admin(seed:number){return CP014_ADMIN_TERMS[ord(seed,CP014_ADMIN_TERMS.length)]!;}
function wrongPunjabiFor(item:CP014AdministrativeAuthority,salt:number){
 const curated=uniq(item.distractors).filter(x=>x!==item.punjabiTerm);
 if(curated.length)return curated[ord(salt+1,curated.length)]!;
 return adminPeers(item,1)[0]!.punjabiTerm;
}
function reverseEnglishDistractors(item:CP014AdministrativeAuthority,count:number){
 const out:string[]=[];
 const seen=new Set([item.englishTerm.toLowerCase()]);
 for(const pa of item.distractors){
  const match=CP014_ADMIN_TERMS.find(x=>x.punjabiTerm===pa&&x.id!==item.id);
  if(match&&!seen.has(match.englishTerm.toLowerCase())){
   seen.add(match.englishTerm.toLowerCase());out.push(match.englishTerm);
  }
  if(out.length===count)return out;
 }
 for(const peer of adminPeers(item,count+3)){
  if(seen.has(peer.englishTerm.toLowerCase()))continue;
  seen.add(peer.englishTerm.toLowerCase());out.push(peer.englishTerm);
  if(out.length===count)break;
 }
 if(out.length<count)throw new Error(`CP014 ${item.id}: insufficient reverse terminology distractors`);
 return out;
}


export function generateCP014F01(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Easy"],"F01");
 const i=ord(seed,FACTUAL.length),item=FACTUAL[i]!;
 return assemble({
  seed,difficulty,familyId:"F01",subtype:"FACTUAL_PASSAGE_RETRIEVAL",
  stem:passageStem(item),correctAnswer:item.q.correctAnswer,distractors:item.q.distractors,
  explanation:passageExplanation(item),authorityIds:[item.passage.id,item.q.qId]
 });
}

export function generateCP014F02(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F02");
 const i=ord(seed,INFERENTIAL.length),item=INFERENTIAL[i]!;
 return assemble({
  seed,difficulty,familyId:"F02",subtype:"INFERENTIAL_COMPREHENSION",
  stem:passageStem(item),correctAnswer:item.q.correctAnswer,distractors:item.q.distractors,
  explanation:passageExplanation(item),authorityIds:[item.passage.id,item.q.qId]
 });
}

export function generateCP014F03(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F03");
 const i=ord(seed,TITLE_SUMMARY.length),item=TITLE_SUMMARY[i]!;
 return assemble({
  seed,difficulty,familyId:"F03",subtype:"TITLE_SUMMARY_SELECTION",
  stem:passageStem(item),correctAnswer:item.q.correctAnswer,distractors:item.q.distractors,
  explanation:passageExplanation(item),authorityIds:[item.passage.id,item.q.qId]
 });
}

export function generateCP014F04(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Easy"],"F04");
 const i=ord(seed,CP014_ADMIN_TERMS.length),item=CP014_ADMIN_TERMS[i]!,peers=adminPeers(item,4);
 return assemble({
  seed,difficulty,familyId:"F04",subtype:"ENGLISH_TO_PUNJABI_ADMIN_TERM",
  stem:pickVariant([
   `ਅੰਗਰੇਜ਼ੀ ਪ੍ਰਬੰਧਕੀ ਸ਼ਬਦ ‘${item.englishTerm}’ ਦਾ ਪੰਜਾਬੀ ਰੂਪ ਕਿਹੜਾ ਹੈ?`,
   `‘${item.englishTerm}’ ਲਈ ਢੁਕਵਾਂ ਪੰਜਾਬੀ ਪ੍ਰਬੰਧਕੀ ਪਦ ਚੁਣੋ।`,
   `ਦਫ਼ਤਰੀ ਵਰਤੋਂ ਵਿੱਚ ‘${item.englishTerm}’ ਦਾ ਪੰਜਾਬੀ ਸਮਕੱਖ ਕਿਹੜਾ ਹੈ?`
  ],i),
  correctAnswer:item.punjabiTerm,
  distractors:uniq([...item.distractors,...peers.map(x=>x.punjabiTerm)]),
  explanation:item.explanationPa,
  authorityIds:[item.id,...peers.map(x=>x.id)]
 });
}

export function generateCP014F05(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F05");
 const i=ord(seed,CP014_ADMIN_TERMS.length),item=CP014_ADMIN_TERMS[i]!,peers=adminPeers(item,4);
 return assemble({
  seed,difficulty,familyId:"F05",subtype:"PUNJABI_TO_ENGLISH_ADMIN_TERM",
  stem:pickVariant([
   `ਪੰਜਾਬੀ ਪ੍ਰਬੰਧਕੀ ਪਦ ‘${item.punjabiTerm}’ ਲਈ ਸਹੀ ਅੰਗਰੇਜ਼ੀ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
   `‘${item.punjabiTerm}’ ਦਾ ਅੰਗਰੇਜ਼ੀ ਦਫ਼ਤਰੀ ਸਮਕੱਖ ਚੁਣੋ।`,
   `ਦਫ਼ਤਰੀ ਸ਼ਬਦਾਵਲੀ ਵਿੱਚ ‘${item.punjabiTerm}’ ਨੂੰ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਕੀ ਕਹਿੰਦੇ ਹਨ?`
  ],i),
  correctAnswer:item.englishTerm,distractors:reverseEnglishDistractors(item,3),
  explanation:item.explanationPa,authorityIds:[item.id,...peers.map(x=>x.id)]
 });
}

function pair(a:CP014AdministrativeAuthority,b:CP014AdministrativeAuthority=a){return `${a.englishTerm} — ${b.punjabiTerm}`;}
export function generateCP014F06(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F06");
 const i=ord(seed,CP014_ADMIN_TERMS.length),item=CP014_ADMIN_TERMS[i]!,peers=adminPeers(item,8);
 return assemble({
  seed,difficulty,familyId:"F06",subtype:"CORRECT_ADMIN_TERMINOLOGY_PAIR",
  stem:"ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਅੰਗਰੇਜ਼ੀ ਅਤੇ ਪੰਜਾਬੀ ਪ੍ਰਬੰਧਕੀ ਸ਼ਬਦ ਦਾ ਸਹੀ ਮੇਲ ਕਿਹੜਾ ਹੈ?",
  correctAnswer:pair(item),
  distractors:[
   `${peers[0]!.englishTerm} — ${wrongPunjabiFor(peers[0]!,seed)}`,
   `${peers[1]!.englishTerm} — ${wrongPunjabiFor(peers[1]!,seed+1)}`,
   `${peers[2]!.englishTerm} — ${wrongPunjabiFor(peers[2]!,seed+2)}`,
   `${peers[3]!.englishTerm} — ${wrongPunjabiFor(peers[3]!,seed+3)}`
  ],
  explanation:item.explanationPa,authorityIds:[item.id,...peers.slice(0,4).map(x=>x.id)]
 });
}

type PassagePair={passage:ReadingPassageItem;q1:PassageQuestion;q2:PassageQuestion};
const PASSAGE_PAIRS:PassagePair[]=[];
for(const passage of CP014_ALL_PASSAGES){
 for(const q1 of passage.questions)for(const q2 of passage.questions)if(q1.qId!==q2.qId)PASSAGE_PAIRS.push({passage,q1,q2});
}
export function generateCP014F07(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Hard"],"F07");
 const i=ord(seed,PASSAGE_PAIRS.length),item=PASSAGE_PAIRS[i]!;
 const correct=`${item.q1.correctAnswer} — ${item.q2.correctAnswer}`;
 const d1=`${item.q2.correctAnswer} — ${item.q1.correctAnswer}`;
 const d2=`${item.q1.distractors[0]??item.q2.correctAnswer} — ${item.q2.correctAnswer}`;
 const d3=`${item.q1.correctAnswer} — ${item.q2.distractors[0]??item.q1.correctAnswer}`;
 const d4=`${item.q1.distractors[1]??item.q2.correctAnswer} — ${item.q2.distractors[1]??item.q1.correctAnswer}`;
 return assemble({
  seed,difficulty,familyId:"F07",subtype:"DUAL_PASSAGE_RESOLUTION",
  stem:`ਹੇਠਾਂ ਦਿੱਤਾ ਪੈਰਾ ਪੜ੍ਹੋ। ਦੋਵੇਂ ਪ੍ਰਸ਼ਨਾਂ ਦੇ ਉੱਤਰ ਕ੍ਰਮਵਾਰ ਚੁਣੋ।\n\n${item.passage.textPa}\n\n1. ${item.q1.questionStem}\n2. ${item.q2.questionStem}`,
  correctAnswer:correct,distractors:[d1,d2,d3,d4],
  explanation:`ਪਹਿਲੇ ਪ੍ਰਸ਼ਨ ਦਾ ਉੱਤਰ ‘${item.q1.correctAnswer}’ ਅਤੇ ਦੂਜੇ ਦਾ ‘${item.q2.correctAnswer}’ ਹੈ।`,
  authorityIds:[item.passage.id,item.q1.qId,item.q2.qId]
 });
}

const VERDICTS=["ਦੋਵੇਂ ਕਥਨ ਸਹੀ ਹਨ","ਕੇਵਲ ਕਥਨ 1 ਸਹੀ ਹੈ","ਕੇਵਲ ਕਥਨ 2 ਸਹੀ ਹੈ","ਦੋਵੇਂ ਕਥਨ ਗਲਤ ਹਨ"] as const;
export function generateCP014F08(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Hard"],"F08");
 const n=CP014_ADMIN_TERMS.length,cap=n*4,r=ord(seed,cap),pattern=r%4,firstIndex=Math.floor(r/4);
 const first=CP014_ADMIN_TERMS[firstIndex]!,second=CP014_ADMIN_TERMS[(firstIndex+97)%n]!;
 const firstWrong=wrongPunjabiFor(first,seed),secondWrong=wrongPunjabiFor(second,seed+1);
 const t1=pattern===0||pattern===1,t2=pattern===0||pattern===2;
 const claim1=`‘${first.englishTerm}’ ਦਾ ਪੰਜਾਬੀ ਰੂਪ ‘${t1?first.punjabiTerm:firstWrong}’ ਹੈ।`;
 const claim2=`‘${second.englishTerm}’ ਦਾ ਪੰਜਾਬੀ ਰੂਪ ‘${t2?second.punjabiTerm:secondWrong}’ ਹੈ।`;
 return assemble({
  seed,difficulty,familyId:"F08",subtype:"DUAL_TERMINOLOGY_VERIFICATION",
  stem:pickVariant([
   `ਦੋਵੇਂ ਪ੍ਰਬੰਧਕੀ ਸ਼ਬਦ-ਜੋੜਿਆਂ ਨੂੰ ਪਰਖ ਕੇ ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ।\nਕਥਨ 1: ${claim1}\nਕਥਨ 2: ${claim2}`,
   `ਹੇਠਲੇ ਦੋ ਅਨੁਵਾਦਾਂ ਦੀ ਸਹੀ ਸਥਿਤੀ ਦੱਸੋ।\nਕਥਨ 1: ${claim1}\nਕਥਨ 2: ${claim2}`,
   `ਕਿਹੜਾ ਵਿਕਲਪ ਦੋਵੇਂ ਕਥਨਾਂ ਬਾਰੇ ਸਹੀ ਹੈ?\nਕਥਨ 1: ${claim1}\nਕਥਨ 2: ${claim2}`
  ],r),
  correctAnswer:VERDICTS[pattern]!,distractors:VERDICTS,
  explanation:`‘${first.englishTerm}’ ਦਾ ਪੰਜਾਬੀ ਰੂਪ ‘${first.punjabiTerm}’ ਅਤੇ ‘${second.englishTerm}’ ਦਾ ਪੰਜਾਬੀ ਰੂਪ ‘${second.punjabiTerm}’ ਹੈ। ਇਸ ਲਈ ${VERDICTS[pattern]}।`,
  authorityIds:[first.id,second.id]
 });
}

export const CP014_FAMILIES=[
 {familyId:"F01",subtype:"FACTUAL_PASSAGE_RETRIEVAL",targetDifficulties:["Easy"] as PunjabiDifficulty[],semanticCapacity:FACTUAL.length,generate:generateCP014F01},
 {familyId:"F02",subtype:"INFERENTIAL_COMPREHENSION",targetDifficulties:["Medium"] as PunjabiDifficulty[],semanticCapacity:INFERENTIAL.length,generate:generateCP014F02},
 {familyId:"F03",subtype:"TITLE_SUMMARY_SELECTION",targetDifficulties:["Medium"] as PunjabiDifficulty[],semanticCapacity:TITLE_SUMMARY.length,generate:generateCP014F03},
 {familyId:"F04",subtype:"ENGLISH_TO_PUNJABI_ADMIN_TERM",targetDifficulties:["Easy"] as PunjabiDifficulty[],semanticCapacity:CP014_ADMIN_TERMS.length,generate:generateCP014F04},
 {familyId:"F05",subtype:"PUNJABI_TO_ENGLISH_ADMIN_TERM",targetDifficulties:["Medium"] as PunjabiDifficulty[],semanticCapacity:CP014_ADMIN_TERMS.length,generate:generateCP014F05},
 {familyId:"F06",subtype:"CORRECT_ADMIN_TERMINOLOGY_PAIR",targetDifficulties:["Medium"] as PunjabiDifficulty[],semanticCapacity:CP014_ADMIN_TERMS.length,generate:generateCP014F06},
 {familyId:"F07",subtype:"DUAL_PASSAGE_RESOLUTION",targetDifficulties:["Hard"] as PunjabiDifficulty[],semanticCapacity:PASSAGE_PAIRS.length,generate:generateCP014F07},
 {familyId:"F08",subtype:"DUAL_TERMINOLOGY_VERIFICATION",targetDifficulties:["Hard"] as PunjabiDifficulty[],semanticCapacity:CP014_ADMIN_TERMS.length*4,generate:generateCP014F08},
] as const;

export function generateCP014Question(seed:number,difficulty:PunjabiDifficulty="Medium",requestedFamilyId?:string){
 const eligible=CP014_FAMILIES.filter(f=>f.targetDifficulties.includes(difficulty));
 const family=requestedFamilyId?CP014_FAMILIES.find(f=>f.familyId===requestedFamilyId):eligible[ord(seed,eligible.length)];
 if(!family)throw new Error(`Unknown CP014 family ${requestedFamilyId}`);
 if(!family.targetDifficulties.includes(difficulty))throw new Error(`${family.familyId} does not support ${difficulty}`);
 return family.generate(seed,difficulty);
}

export function getCP014BreadthReport(){
 const capacities=Object.fromEntries(CP014_FAMILIES.map(f=>[f.familyId,f.semanticCapacity]));
 return {
  passageCount:CP014_ALL_PASSAGES.length,
  passageQuestionAuthorities:CP014_ALL_PASSAGES.reduce((n,p)=>n+p.questions.length,0),
  administrativeAuthorities:CP014_ADMIN_TERMS.length,
  totalAtomicAuthorities:CP014_ALL_PASSAGES.reduce((n,p)=>n+p.questions.length,0)+CP014_ADMIN_TERMS.length,
  totalSemanticCapacity:CP014_FAMILIES.reduce((n,f)=>n+f.semanticCapacity,0),
  capacities
 };
}
