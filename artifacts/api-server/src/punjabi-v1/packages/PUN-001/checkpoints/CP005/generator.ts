import { createRng } from "../../../../core/deterministic-rng";
import { semanticHash } from "../../../../core/semantic-hash";
import type { PunjabiDifficulty, PunjabiGeneratedQuestion, PunjabiQuestionFamilyDefinition } from "../../../../core/types";
import { CP005_ADJECTIVES, CP005_ADVERBS, CP005_TYPE_OPTIONS } from "./CP005-authorities";

function norm(value: string): string { return value.normalize("NFC").trim(); }
function ordinal(seed: number, capacity: number): number { const n = Math.trunc(seed) - 1; return ((n % capacity) + capacity) % capacity; }
function variant(values: readonly string[], selector: number): string { return values[ordinal(selector + 1, values.length)]!; }
function unique(values: readonly string[]): string[] { return [...new Set(values.map(norm).filter(Boolean))]; }
function mask(sentence: string, target: string): string { return sentence.replace(target, "____"); }

function assemble(input: { seed:number; difficulty:PunjabiDifficulty; familyId:string; subtype:string; stem:string; correctAnswer:string; distractors:readonly string[]; explanation:string; authorityIds:readonly string[] }): PunjabiGeneratedQuestion {
  const rng = createRng(`CP005:${input.familyId}:${input.seed}`);
  const correct = norm(input.correctAnswer);
  const distractors = unique(input.distractors).filter((x) => x !== correct);
  if (distractors.length < 3) throw new Error(`CP005 ${input.familyId}: fewer than three distractors`);
  const selected = rng.pickDistinct(distractors, 3);
  const options = rng.shuffle([correct, ...selected]);
  const fingerprint = `CP005-${semanticHash([input.familyId,input.subtype,input.difficulty,norm(input.stem),correct,[...selected].sort().join("|"),[...input.authorityIds].sort().join(",")])}`;
  return { id:`PUN-001-CP005-${input.familyId}-${fingerprint}`, stem:norm(input.stem), options, correctIndex:options.indexOf(correct), explanation:norm(input.explanation), difficulty:input.difficulty, metadata:{ engine:"punjabi-v1", packageId:"PUN-001", cpId:"PUN-001-CP005", familyId:input.familyId, subtype:input.subtype, difficulty:input.difficulty, language:"pa-Guru", seed:input.seed, authorityIds:input.authorityIds, generatorRevision:"1.0.0-forward-port", fingerprint, lifecycle:"REVIEW_ONLY" } };
}

function requireDifficulty(actual: PunjabiDifficulty, allowed: readonly PunjabiDifficulty[], id: string) { if (!allowed.includes(actual)) throw new Error(`CP005 ${id} does not support ${actual}`); }

export function generateCP005F01(seed:number,difficulty:PunjabiDifficulty):PunjabiGeneratedQuestion {
  requireDifficulty(difficulty,["Easy"],"F01"); const i=ordinal(seed,CP005_ADJECTIVES.length); const a=CP005_ADJECTIVES[i]!;
  const peers=CP005_ADJECTIVES.filter((x)=>x.id!==a.id).map((x)=>x.target);
  return assemble({seed,difficulty,familyId:"F01",subtype:"ADJECTIVE_IDENTIFICATION",stem:variant([`ਵਾਕ ਵਿੱਚ ਵਿਸ਼ੇਸ਼ਣ ਕਿਹੜਾ ਹੈ?\n${a.sentence}`,`ਹੇਠਲੇ ਵਾਕ ਵਿੱਚ ਵਿਸ਼ੇਸ਼ਣ ਪਛਾਣੋ।\n${a.sentence}`,`ਵਾਕ ਵਿੱਚ ਨਾਂਵ ਦੀ ਵਿਸ਼ੇਸ਼ਤਾ ਦੱਸਣ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।\n${a.sentence}`],i),correctAnswer:a.target,distractors:peers,explanation:`‘${a.target}’ ਵਿਸ਼ੇਸ਼ਣ ਹੈ ਕਿਉਂਕਿ ਇਹ ${a.meaningPa}`,authorityIds:[a.id]});
}

export function generateCP005F02(seed:number,difficulty:PunjabiDifficulty):PunjabiGeneratedQuestion {
  requireDifficulty(difficulty,["Easy","Medium"],"F02"); const i=ordinal(seed,CP005_ADJECTIVES.length); const a=CP005_ADJECTIVES[i]!;
  return assemble({seed,difficulty,familyId:"F02",subtype:"ADJECTIVE_TYPE",stem:variant([`ਵਾਕ ਵਿੱਚ ‘${a.target}’ ਕਿਸ ਕਿਸਮ ਦਾ ਵਿਸ਼ੇਸ਼ਣ ਹੈ?\n${a.sentence}`,`‘${a.target}’ ਦਾ ਵਿਸ਼ੇਸ਼ਣ-ਭੇਦ ਦੱਸੋ।\n${a.sentence}`,`ਹੇਠਲੇ ਵਾਕ ਵਿੱਚ ‘${a.target}’ ਦੀ ਕਿਸਮ ਚੁਣੋ।\n${a.sentence}`],i),correctAnswer:a.typePa,distractors:CP005_TYPE_OPTIONS.adjective,explanation:`‘${a.target}’ ${a.typePa} ਹੈ; ਇਹ ${a.meaningPa}`,authorityIds:[a.id]});
}

export function generateCP005F03(seed:number,difficulty:PunjabiDifficulty):PunjabiGeneratedQuestion {
  requireDifficulty(difficulty,["Medium"],"F03"); const i=ordinal(seed,CP005_ADJECTIVES.length); const a=CP005_ADJECTIVES[i]!;
  const sameType=CP005_ADJECTIVES.filter((x)=>x.id!==a.id&&x.type===a.type).map((x)=>x.target); const fallback=CP005_ADJECTIVES.filter((x)=>x.id!==a.id).map((x)=>x.target);
  return assemble({seed,difficulty,familyId:"F03",subtype:"CONTEXTUAL_ADJECTIVE",stem:variant([`ਖਾਲੀ ਥਾਂ ਲਈ ਢੁਕਵਾਂ ਵਿਸ਼ੇਸ਼ਣ ਚੁਣੋ।\n${mask(a.sentence,a.target)}`,`ਵਾਕ ਦਾ ਅਰਥ ਪੂਰਾ ਕਰਨ ਲਈ ਸਹੀ ਸ਼ਬਦ ਚੁਣੋ।\n${mask(a.sentence,a.target)}`,`ਹੇਠਲੇ ਵਾਕ ਵਿੱਚ ਖਾਲੀ ਥਾਂ ਭਰੋ।\n${mask(a.sentence,a.target)}`],i),correctAnswer:a.target,distractors:[...sameType,...fallback],explanation:`ਇੱਥੇ ‘${a.target}’ ਢੁਕਵਾਂ ਹੈ, ਕਿਉਂਕਿ ਇਹ ${a.meaningPa}`,authorityIds:[a.id]});
}

export function generateCP005F04(seed:number,difficulty:PunjabiDifficulty):PunjabiGeneratedQuestion {
  requireDifficulty(difficulty,["Easy"],"F04"); const i=ordinal(seed,CP005_ADVERBS.length); const a=CP005_ADVERBS[i]!;
  const peers=CP005_ADVERBS.filter((x)=>x.id!==a.id).map((x)=>x.target);
  return assemble({seed,difficulty,familyId:"F04",subtype:"ADVERB_IDENTIFICATION",stem:variant([`ਵਾਕ ਵਿੱਚ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਕਿਹੜਾ ਹੈ?\n${a.sentence}`,`ਹੇਠਲੇ ਵਾਕ ਵਿੱਚ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਪਛਾਣੋ।\n${a.sentence}`,`ਕਿਰਿਆ ਬਾਰੇ ਹੋਰ ਜਾਣਕਾਰੀ ਦੇਣ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।\n${a.sentence}`],i),correctAnswer:a.target,distractors:peers,explanation:`‘${a.target}’ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ ਕਿਉਂਕਿ ਇਹ ${a.meaningPa}`,authorityIds:[a.id]});
}

export function generateCP005F05(seed:number,difficulty:PunjabiDifficulty):PunjabiGeneratedQuestion {
  requireDifficulty(difficulty,["Medium"],"F05"); const i=ordinal(seed,CP005_ADVERBS.length); const a=CP005_ADVERBS[i]!;
  return assemble({seed,difficulty,familyId:"F05",subtype:"ADVERB_TYPE",stem:variant([`ਵਾਕ ਵਿੱਚ ‘${a.target}’ ਕਿਸ ਕਿਸਮ ਦਾ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ?\n${a.sentence}`,`‘${a.target}’ ਦਾ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਭੇਦ ਚੁਣੋ।\n${a.sentence}`,`ਹੇਠਲੇ ਵਾਕ ਵਿੱਚ ‘${a.target}’ ਦੀ ਕਿਸਮ ਪਛਾਣੋ।\n${a.sentence}`],i),correctAnswer:a.typePa,distractors:CP005_TYPE_OPTIONS.adverb,explanation:`‘${a.target}’ ${a.typePa} ਹੈ; ਇਹ ${a.meaningPa}`,authorityIds:[a.id]});
}

export function generateCP005F06(seed:number,difficulty:PunjabiDifficulty):PunjabiGeneratedQuestion {
  requireDifficulty(difficulty,["Medium"],"F06"); const ai=ordinal(seed,CP005_ADJECTIVES.length); const vi=ordinal(seed*7,CP005_ADVERBS.length); const a=CP005_ADJECTIVES[ai]!; const v=CP005_ADVERBS[vi]!;
  const correct=`ਵਾਕ 1: ਵਿਸ਼ੇਸ਼ਣ; ਵਾਕ 2: ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ`; const opts=["ਵਾਕ 1: ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ; ਵਾਕ 2: ਵਿਸ਼ੇਸ਼ਣ","ਦੋਵੇਂ ਵਿਸ਼ੇਸ਼ਣ","ਦੋਵੇਂ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ"];
  return assemble({seed,difficulty,familyId:"F06",subtype:"ADJECTIVE_ADVERB_DISCRIMINATION",stem:variant([`ਦੋਵੇਂ ਰੇਖਾਂਕਿਤ ਸ਼ਬਦਾਂ ਦੀ ਭੂਮਿਕਾ ਦੱਸੋ।\nਵਾਕ 1: ${a.sentence.replace(a.target,`‘${a.target}’`)}\nਵਾਕ 2: ${v.sentence.replace(v.target,`‘${v.target}’`)}`,`ਵਾਕ 1 ਅਤੇ ਵਾਕ 2 ਵਿੱਚ ਦਿੱਤੇ ਸ਼ਬਦਾਂ ਦੀ ਸਹੀ ਪਛਾਣ ਚੁਣੋ।\nਵਾਕ 1: ${a.sentence.replace(a.target,`‘${a.target}’`)}\nਵਾਕ 2: ${v.sentence.replace(v.target,`‘${v.target}’`)}`],seed),correctAnswer:correct,distractors:opts,explanation:`ਵਾਕ 1 ਵਿੱਚ ‘${a.target}’ ਨਾਂਵ ਦੀ ਵਿਸ਼ੇਸ਼ਤਾ ਦੱਸਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਵਿਸ਼ੇਸ਼ਣ ਹੈ। ਵਾਕ 2 ਵਿੱਚ ‘${v.target}’ ਕਿਰਿਆ ਬਾਰੇ ਜਾਣਕਾਰੀ ਦਿੰਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ।`,authorityIds:[a.id,v.id]});
}

export function generateCP005F07(seed:number,difficulty:PunjabiDifficulty):PunjabiGeneratedQuestion {
  requireDifficulty(difficulty,["Hard"],"F07"); const i=ordinal(seed,CP005_ADVERBS.length); const v=CP005_ADVERBS[i]!; const adjective=CP005_ADJECTIVES[ordinal(seed*11,CP005_ADJECTIVES.length)]!;
  const correct=v.sentence; const wrong1=v.sentence.replace(v.target,adjective.target); const wrong2=mask(v.sentence,v.target); const wrong3=`${adjective.target} ${v.sentence}`;
  return assemble({seed,difficulty,familyId:"F07",subtype:"MODIFIER_CORRECTION",stem:variant(["ਕਿਰਿਆ ਦੀ ਵਿਸ਼ੇਸ਼ਤਾ ਸਹੀ ਤਰ੍ਹਾਂ ਦੱਸਣ ਵਾਲਾ ਵਾਕ ਚੁਣੋ।","ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਵਿਆਕਰਨ ਅਨੁਸਾਰ ਢੁਕਵਾਂ ਵਾਕ ਚੁਣੋ।","ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਦੀ ਸਹੀ ਵਰਤੋਂ ਵਾਲਾ ਵਾਕ ਪਛਾਣੋ।"],i),correctAnswer:correct,distractors:[wrong1,wrong2,wrong3],explanation:`‘${v.target}’ ${v.typePa} ਹੈ ਅਤੇ ਇਸ ਵਾਕ ਵਿੱਚ ${v.meaningPa}`,authorityIds:[v.id,adjective.id]});
}

export function generateCP005F08(seed:number,difficulty:PunjabiDifficulty):PunjabiGeneratedQuestion {
  requireDifficulty(difficulty,["Hard"],"F08"); const a=CP005_ADJECTIVES[ordinal(seed,CP005_ADJECTIVES.length)]!; const v=CP005_ADVERBS[ordinal(seed*13,CP005_ADVERBS.length)]!;
  const stem=`ਕਥਨ 1: ‘${a.target}’ ${a.typePa} ਹੈ।\nਕਥਨ 2: ‘${v.target}’ ${v.typePa} ਹੈ।\nਸਹੀ ਵਿਕਲਪ ਚੁਣੋ।`;
  return assemble({seed,difficulty,familyId:"F08",subtype:"DUAL_STATEMENT_ANALYSIS",stem:variant([stem,stem.replace("ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ।","ਦੋਵੇਂ ਕਥਨਾਂ ਬਾਰੇ ਸਹੀ ਜਵਾਬ ਦਿਓ।")],seed),correctAnswer:"ਦੋਵੇਂ ਕਥਨ ਸਹੀ ਹਨ",distractors:["ਕੇਵਲ ਕਥਨ 1 ਸਹੀ ਹੈ","ਕੇਵਲ ਕਥਨ 2 ਸਹੀ ਹੈ","ਦੋਵੇਂ ਕਥਨ ਗਲਤ ਹਨ"],explanation:`ਕਥਨ 1 ਸਹੀ ਹੈ ਕਿਉਂਕਿ ‘${a.target}’ ${a.meaningPa} ਕਥਨ 2 ਵੀ ਸਹੀ ਹੈ ਕਿਉਂਕਿ ‘${v.target}’ ${v.meaningPa}`,authorityIds:[a.id,v.id]});
}

export const CP005_FAMILIES: readonly PunjabiQuestionFamilyDefinition[] = [
  {familyId:"F01",subtype:"ADJECTIVE_IDENTIFICATION",name:"Adjective identification",targetDifficulties:["Easy"],generate:generateCP005F01},
  {familyId:"F02",subtype:"ADJECTIVE_TYPE",name:"Adjective type",targetDifficulties:["Easy","Medium"],generate:generateCP005F02},
  {familyId:"F03",subtype:"CONTEXTUAL_ADJECTIVE",name:"Contextual adjective",targetDifficulties:["Medium"],generate:generateCP005F03},
  {familyId:"F04",subtype:"ADVERB_IDENTIFICATION",name:"Adverb identification",targetDifficulties:["Easy"],generate:generateCP005F04},
  {familyId:"F05",subtype:"ADVERB_TYPE",name:"Adverb type",targetDifficulties:["Medium"],generate:generateCP005F05},
  {familyId:"F06",subtype:"ADJECTIVE_ADVERB_DISCRIMINATION",name:"Adjective/adverb discrimination",targetDifficulties:["Medium"],generate:generateCP005F06},
  {familyId:"F07",subtype:"MODIFIER_CORRECTION",name:"Modifier correction",targetDifficulties:["Hard"],generate:generateCP005F07},
  {familyId:"F08",subtype:"DUAL_STATEMENT_ANALYSIS",name:"Dual statement analysis",targetDifficulties:["Hard"],generate:generateCP005F08},
];

export function getCP005BreadthReport() { return { adjectiveAuthorities:CP005_ADJECTIVES.length, adverbAuthorities:CP005_ADVERBS.length, totalAtomicAuthorities:CP005_ADJECTIVES.length+CP005_ADVERBS.length, familyCount:CP005_FAMILIES.length, capacities:{F01:25,F02:25,F03:25,F04:20,F05:20,F06:500,F07:500,F08:500}, totalSemanticCapacity:1615 }; }
