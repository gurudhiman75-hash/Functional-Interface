import { createRng } from "../../../../core/deterministic-rng";
import { semanticHash } from "../../../../core/semantic-hash";
import type { PunjabiDifficulty,PunjabiGeneratedQuestion } from "../../../../core/types";
import { CP011_AUTHORITIES,CP011_THEMES,cp011ItemsInTheme,type CP011Authority } from "./CP011-authorities";

function norm(v:string){return v.normalize("NFC").trim();}
function ord(seed:number,cap:number){const n=Math.trunc(seed)-1;return ((n%cap)+cap)%cap;}
function uniq(v:readonly string[]){return [...new Set(v.map(norm).filter(Boolean))];}
function pickVariant(v:readonly string[],s:number){return v[ord(s+1,v.length)]!;}
function requireDiff(actual:PunjabiDifficulty,allowed:readonly PunjabiDifficulty[],id:string){if(!allowed.includes(actual))throw new Error(`CP011 ${id} does not support ${actual}`);}
function peers(a:CP011Authority){return cp011ItemsInTheme(a.theme).filter(x=>x.id!==a.id);}
function crossTheme(a:CP011Authority){return CP011_AUTHORITIES.filter(x=>x.theme!==a.theme);}
function contrastPeers(a:CP011Authority){
 const index=CP011_THEMES.indexOf(a.theme);
 const contrastTheme=CP011_THEMES[(index+1)%CP011_THEMES.length]!;
 return cp011ItemsInTheme(contrastTheme);
}

function assemble(input:{seed:number;difficulty:PunjabiDifficulty;familyId:string;subtype:string;stem:string;correctAnswer:string;distractors:readonly string[];explanation:string;authorityIds:readonly string[]}):PunjabiGeneratedQuestion{
 const rng=createRng(`CP011:${input.familyId}:${input.seed}`);
 const correct=norm(input.correctAnswer);
 const ds=uniq(input.distractors).filter(x=>x!==correct);
 if(ds.length<3)throw new Error(`CP011 ${input.familyId}: fewer than three distractors`);
 const selected=rng.pickDistinct(ds,3);
 const options=rng.shuffle([correct,...selected]);
 const fingerprint=`CP011-${semanticHash([input.familyId,input.subtype,input.difficulty,norm(input.stem),correct,[...selected].sort().join("|"),[...input.authorityIds].sort().join(",")])}`;
 return {id:`PUN-001-CP011-${input.familyId}-${fingerprint}`,stem:norm(input.stem),options,correctIndex:options.indexOf(correct),explanation:norm(input.explanation),difficulty:input.difficulty,metadata:{engine:"punjabi-v1",packageId:"PUN-001",cpId:"PUN-001-CP011",familyId:input.familyId,subtype:input.subtype,difficulty:input.difficulty,language:"pa-Guru",seed:input.seed,authorityIds:input.authorityIds,generatorRevision:"1.0.0-forward-port",fingerprint,lifecycle:"REVIEW_ONLY"}};
}

function easyMeaningDistractors(a:CP011Authority,seed:number){return createRng(`CP011:EM:${seed}`).pickDistinct(crossTheme(a),3).map(x=>x.meaningPa);}
function easyIdiomDistractors(a:CP011Authority,seed:number){return createRng(`CP011:EI:${seed}`).pickDistinct(crossTheme(a),3).map(x=>x.idiomPa);}
function mapping(a:CP011Authority,b:CP011Authority=a){return `${a.idiomPa} — ${b.meaningPa}`;}

export function generateCP011F01(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Easy"],"F01");
 const i=ord(seed,CP011_AUTHORITIES.length),a=CP011_AUTHORITIES[i]!;
 return assemble({seed,difficulty,familyId:"F01",subtype:"DIRECT_IDIOM_MEANING",stem:pickVariant([`ਮੁਹਾਵਰੇ ‘${a.idiomPa}’ ਦਾ ਸਹੀ ਅਰਥ ਕਿਹੜਾ ਹੈ?`,`‘${a.idiomPa}’ ਮੁਹਾਵਰਾ ਕਿਹੜਾ ਭਾਵ ਪ੍ਰਗਟ ਕਰਦਾ ਹੈ?`,`ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${a.idiomPa}’ ਦਾ ਢੁਕਵਾਂ ਅਰਥ ਚੁਣੋ।`],i),correctAnswer:a.meaningPa,distractors:easyMeaningDistractors(a,seed),explanation:a.explanationPa,authorityIds:[a.id]});
}

export function generateCP011F02(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Easy"],"F02");
 const i=ord(seed,CP011_AUTHORITIES.length),a=CP011_AUTHORITIES[i]!;
 return assemble({seed,difficulty,familyId:"F02",subtype:"DIRECT_MEANING_TO_IDIOM",stem:pickVariant([`‘${a.meaningPa}’ ਭਾਵ ਲਈ ਢੁਕਵਾਂ ਮੁਹਾਵਰਾ ਕਿਹੜਾ ਹੈ?`,`ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਮੁਹਾਵਰਾ ‘${a.meaningPa}’ ਦਾ ਭਾਵ ਦਿੰਦਾ ਹੈ?`,`ਦਿੱਤੇ ਭਾਵ ‘${a.meaningPa}’ ਨਾਲ ਕਿਹੜਾ ਮੁਹਾਵਰਾ ਮੇਲ ਖਾਂਦਾ ਹੈ?`],i),correctAnswer:a.idiomPa,distractors:easyIdiomDistractors(a,seed),explanation:a.explanationPa,authorityIds:[a.id]});
}

export function generateCP011F03(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F03");
 const i=ord(seed,CP011_AUTHORITIES.length),a=CP011_AUTHORITIES[i]!,ps=contrastPeers(a);
 return assemble({seed,difficulty,familyId:"F03",subtype:"AUTHORED_CONTEXT_TO_IDIOM",stem:pickVariant([`ਵਾਕ ਦੇ ਪ੍ਰਸੰਗ ਅਨੁਸਾਰ ਖ਼ਾਲੀ ਥਾਂ ਲਈ ਸਭ ਤੋਂ ਢੁਕਵਾਂ ਮੁਹਾਵਰਾ ਚੁਣੋ।\n${a.contextSentence}`,`ਦਿੱਤੇ ਵਾਕ ਵਿੱਚ ਖ਼ਾਲੀ ਥਾਂ ਨੂੰ ਸਹੀ ਮੁਹਾਵਰੇ ਨਾਲ ਪੂਰਾ ਕਰੋ।\n${a.contextSentence}`,`ਪ੍ਰਸੰਗ ਦੇ ਭਾਵ ਅਨੁਸਾਰ ਸਹੀ ਮੁਹਾਵਰਾ ਕਿਹੜਾ ਹੈ?\n${a.contextSentence}`],i),correctAnswer:a.idiomPa,distractors:ps.map(x=>x.idiomPa),explanation:a.explanationPa,authorityIds:[a.id,...ps.map(x=>x.id)]});
}

export function generateCP011F04(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F04");
 const i=ord(seed,CP011_AUTHORITIES.length),a=CP011_AUTHORITIES[i]!,ps=contrastPeers(a);
 return assemble({seed,difficulty,familyId:"F04",subtype:"FIGURATIVE_PRECISION",stem:pickVariant([`‘${a.idiomPa}’ ਦਾ ਮੁਹਾਵਰੇਦਾਰ ਅਰਥ ਚੁਣੋ।`,`‘${a.idiomPa}’ ਨੂੰ ਸ਼ਾਬਦਿਕ ਨਹੀਂ, ਮੁਹਾਵਰੇਦਾਰ ਭਾਵ ਵਿੱਚ ਸਮਝੋ। ਸਹੀ ਅਰਥ ਕਿਹੜਾ ਹੈ?`,`ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${a.idiomPa}’ ਦਾ ਲੱਛਣਿਕ ਭਾਵ ਕਿਹੜਾ ਹੈ?`],i),correctAnswer:a.meaningPa,distractors:[a.literalTrapPa,ps[0]!.meaningPa,ps[1]!.meaningPa,ps[2]!.meaningPa],explanation:`‘${a.idiomPa}’ ਦਾ ਮੁਹਾਵਰੇਦਾਰ ਅਰਥ ‘${a.meaningPa}’ ਹੈ; ‘${a.literalTrapPa}’ ਕੇਵਲ ਸ਼ਾਬਦਿਕ ਪੜ੍ਹਤ ਹੈ।`,authorityIds:[a.id,...ps.slice(0,3).map(x=>x.id)]});
}

export function generateCP011F05(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F05");
 const i=ord(seed,CP011_AUTHORITIES.length),target=CP011_AUTHORITIES[i]!,ps=contrastPeers(target);
 const ownPeers=peers(target);
 const falsePairs=[
  mapping(ps[0]!,ownPeers[0]!),
  mapping(ps[1]!,ownPeers[1]!),
  mapping(ps[2]!,ownPeers[2]!),
  mapping(ps[3]!,ownPeers[3]!),
 ];
 return assemble({seed,difficulty,familyId:"F05",subtype:"CORRECT_IDIOM_MEANING_PAIR",stem:"ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਮੁਹਾਵਰੇ ਅਤੇ ਅਰਥ ਦਾ ਸਹੀ ਮੇਲ ਕਿਹੜਾ ਹੈ?",correctAnswer:mapping(target),distractors:falsePairs,explanation:`‘${target.idiomPa}’ ਦਾ ਸਹੀ ਅਰਥ ‘${target.meaningPa}’ ਹੈ।`,authorityIds:[target.id,...ps.slice(0,4).map(x=>x.id),...ownPeers.slice(0,4).map(x=>x.id)]});
}

export function generateCP011F06(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Medium"],"F06");
 const cap=CP011_AUTHORITIES.length*8,r=ord(seed,cap),target=CP011_AUTHORITIES[Math.floor(r/8)]!,wrongPool=contrastPeers(target),wrong=wrongPool[r%8]!;
 const valid=peers(target).slice(0,3);
 return assemble({seed,difficulty,familyId:"F06",subtype:"INCORRECT_IDIOM_MEANING_PAIR",stem:"ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਮੁਹਾਵਰੇ ਅਤੇ ਅਰਥ ਦਾ ਗ਼ਲਤ ਮੇਲ ਕਿਹੜਾ ਹੈ?",correctAnswer:mapping(target,wrong),distractors:valid.map(x=>mapping(x)),explanation:`‘${target.idiomPa}’ ਦਾ ਸਹੀ ਅਰਥ ‘${target.meaningPa}’ ਹੈ।`,authorityIds:[target.id,wrong.id,...valid.map(x=>x.id)]});
}

function orderedPair(seed:number){
 const r=ord(seed,512),firstIndex=Math.floor(r/8),first=CP011_AUTHORITIES[firstIndex]!,ps=contrastPeers(first),second=ps[r%8]!;
 return {r,first,second,ps};
}

export function generateCP011F07(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Hard"],"F07");
 const {r,first,second,ps}=orderedPair(seed),others=ps.filter(x=>x.id!==second.id);
 const correct=`${first.idiomPa} — ${second.idiomPa}`;
 const distractors=uniq([`${second.idiomPa} — ${first.idiomPa}`,`${first.idiomPa} — ${others[0]!.idiomPa}`,`${others[1]!.idiomPa} — ${second.idiomPa}`,`${others[2]!.idiomPa} — ${others[3]!.idiomPa}`]);
 return assemble({seed,difficulty,familyId:"F07",subtype:"ORDERED_DUAL_MEANING_TO_IDIOM",stem:pickVariant([`ਦੋਵੇਂ ਅਰਥਾਂ ਲਈ ਕ੍ਰਮਵਾਰ ਸਹੀ ਮੁਹਾਵਰੇ ਚੁਣੋ।\n1. ${first.meaningPa}\n2. ${second.meaningPa}`,`ਪਹਿਲੇ ਅਤੇ ਦੂਜੇ ਭਾਵ ਲਈ ਸਹੀ ਮੁਹਾਵਰੇ ਕ੍ਰਮਵਾਰ ਕਿਹੜੇ ਹਨ?\n1. ${first.meaningPa}\n2. ${second.meaningPa}`,`ਹੇਠਲੇ ਦੋ ਭਾਵਾਂ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਸਹੀ ਮੁਹਾਵਰਾ-ਜੋੜਾ ਚੁਣੋ।\n1. ${first.meaningPa}\n2. ${second.meaningPa}`],r),correctAnswer:correct,distractors,explanation:`ਪਹਿਲੇ ਭਾਵ ਲਈ ‘${first.idiomPa}’ ਅਤੇ ਦੂਜੇ ਲਈ ‘${second.idiomPa}’ ਸਹੀ ਮੁਹਾਵਰਾ ਹੈ।`,authorityIds:[first.id,second.id,...others.slice(0,4).map(x=>x.id)]});
}

const VERDICTS=["ਦੋਵੇਂ ਕਥਨ ਸਹੀ ਹਨ","ਕੇਵਲ ਕਥਨ 1 ਸਹੀ ਹੈ","ਕੇਵਲ ਕਥਨ 2 ਸਹੀ ਹੈ","ਦੋਵੇਂ ਕਥਨ ਗਲਤ ਹਨ"] as const;
export function generateCP011F08(seed:number,difficulty:PunjabiDifficulty){
 requireDiff(difficulty,["Hard"],"F08");
 const cap=512*4,r=ord(seed,cap),pattern=r%4,pairSeed=Math.floor(r/4)+1,{first,second,ps}=orderedPair(pairSeed);
 const otherForFirst=ps.find(x=>x.id!==second.id)!;
 const secondPeers=contrastPeers(second),otherForSecond=secondPeers[ord(pairSeed,secondPeers.length)]!;
 const t1=pattern===0||pattern===1,t2=pattern===0||pattern===2;
 const claim1=`‘${first.idiomPa}’ ਦਾ ਅਰਥ ‘${t1?first.meaningPa:otherForFirst.meaningPa}’ ਹੈ।`;
 const claim2=`‘${second.idiomPa}’ ਦਾ ਅਰਥ ‘${t2?second.meaningPa:otherForSecond.meaningPa}’ ਹੈ।`;
 const correct=VERDICTS[pattern]!;
 return assemble({seed,difficulty,familyId:"F08",subtype:"DUAL_STATEMENT_VERIFICATION",stem:pickVariant([`ਕਥਨਾਂ ਦੀ ਸਹੀ ਸਥਿਤੀ ਚੁਣੋ।\nਕਥਨ 1: ${claim1}\nਕਥਨ 2: ${claim2}`,`ਹੇਠਲੇ ਦੋ ਮੁਹਾਵਰਾ–ਅਰਥ ਕਥਨਾਂ ਨੂੰ ਪਰਖੋ।\nਕਥਨ 1: ${claim1}\nਕਥਨ 2: ${claim2}`,`ਕਿਹੜਾ ਵਿਕਲਪ ਦੋਵੇਂ ਕਥਨਾਂ ਬਾਰੇ ਸਹੀ ਹੈ?\nਕਥਨ 1: ${claim1}\nਕਥਨ 2: ${claim2}`],r),correctAnswer:correct,distractors:VERDICTS,explanation:`‘${first.idiomPa}’ ਦਾ ਸਹੀ ਅਰਥ ‘${first.meaningPa}’ ਅਤੇ ‘${second.idiomPa}’ ਦਾ ਸਹੀ ਅਰਥ ‘${second.meaningPa}’ ਹੈ। ਇਸ ਲਈ ${correct}।`,authorityIds:[first.id,second.id,otherForFirst.id,otherForSecond.id]});
}

export const CP011_FAMILIES=[
 {familyId:"F01",subtype:"DIRECT_IDIOM_MEANING",targetDifficulties:["Easy"] as PunjabiDifficulty[],semanticCapacity:64,generate:generateCP011F01},
 {familyId:"F02",subtype:"DIRECT_MEANING_TO_IDIOM",targetDifficulties:["Easy"] as PunjabiDifficulty[],semanticCapacity:64,generate:generateCP011F02},
 {familyId:"F03",subtype:"AUTHORED_CONTEXT_TO_IDIOM",targetDifficulties:["Medium"] as PunjabiDifficulty[],semanticCapacity:64,generate:generateCP011F03},
 {familyId:"F04",subtype:"FIGURATIVE_PRECISION",targetDifficulties:["Medium"] as PunjabiDifficulty[],semanticCapacity:64,generate:generateCP011F04},
 {familyId:"F05",subtype:"CORRECT_IDIOM_MEANING_PAIR",targetDifficulties:["Medium"] as PunjabiDifficulty[],semanticCapacity:64,generate:generateCP011F05},
 {familyId:"F06",subtype:"INCORRECT_IDIOM_MEANING_PAIR",targetDifficulties:["Medium"] as PunjabiDifficulty[],semanticCapacity:512,generate:generateCP011F06},
 {familyId:"F07",subtype:"ORDERED_DUAL_MEANING_TO_IDIOM",targetDifficulties:["Hard"] as PunjabiDifficulty[],semanticCapacity:512,generate:generateCP011F07},
 {familyId:"F08",subtype:"DUAL_STATEMENT_VERIFICATION",targetDifficulties:["Hard"] as PunjabiDifficulty[],semanticCapacity:2048,generate:generateCP011F08},
] as const;

export function generateCP011Question(seed:number,difficulty:PunjabiDifficulty="Medium",requestedFamilyId?:string){
 const eligible=CP011_FAMILIES.filter(f=>f.targetDifficulties.includes(difficulty));
 const family=requestedFamilyId?CP011_FAMILIES.find(f=>f.familyId===requestedFamilyId):eligible[ord(seed,eligible.length)];
 if(!family)throw new Error(`Unknown CP011 family ${requestedFamilyId}`);
 if(!family.targetDifficulties.includes(difficulty))throw new Error(`${family.familyId} does not support ${difficulty}`);
 return family.generate(seed,difficulty);
}

export function getCP011BreadthReport(){
 const capacities=Object.fromEntries(CP011_FAMILIES.map(f=>[f.familyId,f.semanticCapacity]));
 return {totalAtomicAuthorities:CP011_AUTHORITIES.length,totalThemes:CP011_THEMES.length,totalSemanticCapacity:CP011_FAMILIES.reduce((n,f)=>n+f.semanticCapacity,0),capacities};
}
