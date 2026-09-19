import { createRng } from "../../../../core/deterministic-rng";
import { semanticHash } from "../../../../core/semantic-hash";
import type { PunjabiDifficulty, PunjabiGeneratedQuestion, PunjabiQuestionFamilyDefinition } from "../../../../core/types";
import { CP005_ADJECTIVES, CP005_ADVERBS, CP005_TYPE_OPTIONS } from "./CP005-authorities";

function norm(value: string): string { return value.normalize("NFC").trim(); }
function ordinal(seed: number, capacity: number): number { const n = Math.trunc(seed) - 1; return ((n % capacity) + capacity) % capacity; }
function variant(values: readonly string[], selector: number): string { return values[ordinal(selector + 1, values.length)]!; }
function unique(values: readonly string[]): string[] { return [...new Set(values.map(norm).filter(Boolean))]; }
function mark(sentence: string, target: string): string { return sentence.replace(target, `‘${target}’`); }

function assemble(input: { seed:number; difficulty:PunjabiDifficulty; familyId:string; subtype:string; stem:string; correctAnswer:string; distractors:readonly string[]; explanation:string; authorityIds:readonly string[] }): PunjabiGeneratedQuestion {
  const rng = createRng(`CP005:${input.familyId}:${input.seed}`);
  const correct = norm(input.correctAnswer);
  const distractors = unique(input.distractors).filter((x) => x !== correct);
  if (distractors.length < 3) throw new Error(`CP005 ${input.familyId}: fewer than three distractors`);
  const selected = rng.pickDistinct(distractors, 3);
  const options = rng.shuffle([correct, ...selected]);
  const semanticParts=[input.familyId,input.subtype,input.difficulty,norm(input.stem),correct,[...selected].sort().join("|"),[...input.authorityIds].sort().join(",")];
  const fingerprint = `CP005-${semanticHash(semanticParts)}${semanticHash(["SECONDARY",...semanticParts].reverse())}`;
  return { id:`PUN-001-CP005-${input.familyId}-${fingerprint}`, stem:norm(input.stem), options, correctIndex:options.indexOf(correct), explanation:norm(input.explanation), difficulty:input.difficulty, metadata:{ engine:"punjabi-v1", packageId:"PUN-001", cpId:"PUN-001-CP005", familyId:input.familyId, subtype:input.subtype, difficulty:input.difficulty, language:"pa-Guru", seed:input.seed, authorityIds:input.authorityIds, generatorRevision:"2.0.0-retrofit-exhaustive", fingerprint, lifecycle:"REVIEW_ONLY" } };
}

function requireDifficulty(actual: PunjabiDifficulty, allowed: readonly PunjabiDifficulty[], id: string) { if (!allowed.includes(actual)) throw new Error(`CP005 ${id} does not support ${actual}`); }

const ADJECTIVE_ROLE_EXPLANATIONS: Record<string,string> = {
  "ਗੁਣ-ਵਾਚਕ ਵਿਸ਼ੇਸ਼ਣ": "ਗੁਣ, ਰੰਗ, ਆਕਾਰ, ਸੁਆਦ ਜਾਂ ਅਵਸਥਾ ਦੱਸਦਾ ਹੈ",
  "ਸੰਖਿਆ-ਵਾਚਕ ਵਿਸ਼ੇਸ਼ਣ": "ਗਿਣਤੀ ਜਾਂ ਕ੍ਰਮ ਦੱਸਦਾ ਹੈ",
  "ਪਰਿਮਾਣ-ਵਾਚਕ ਵਿਸ਼ੇਸ਼ਣ": "ਮਾਤਰਾ ਜਾਂ ਮਾਪ ਦੱਸਦਾ ਹੈ",
  "ਨਿਸ਼ਚੇ-ਵਾਚਕ ਵਿਸ਼ੇਸ਼ਣ": "ਕਿਸੇ ਖ਼ਾਸ ਨਾਂਵ ਵੱਲ ਸੰਕੇਤ ਕਰਦਾ ਹੈ",
  "ਪੜਨਾਂਵੀ ਵਿਸ਼ੇਸ਼ਣ": "ਪੜਨਾਂਵ-ਮੂਲ ਰੂਪ ਨਾਲ ਨਾਂਵ ਦੀ ਵਿਸ਼ੇਸ਼ਤਾ ਦੱਸਦਾ ਹੈ",
};

export function generateCP005F01(seed:number,difficulty:PunjabiDifficulty):PunjabiGeneratedQuestion {
  requireDifficulty(difficulty,["Easy"],"F01"); const i=ordinal(seed,CP005_ADJECTIVES.length); const a=CP005_ADJECTIVES[i]!;
  const peers=CP005_ADJECTIVES.filter((x)=>x.id!==a.id).map((x)=>x.target);
  return assemble({seed,difficulty,familyId:"F01",subtype:"ADJECTIVE_IDENTIFICATION",stem:variant([`ਵਾਕ ਵਿੱਚ ਵਿਸ਼ੇਸ਼ਣ ਕਿਹੜਾ ਹੈ?\n${a.sentence}`,`ਹੇਠਲੇ ਵਾਕ ਵਿੱਚ ਵਿਸ਼ੇਸ਼ਣ ਪਛਾਣੋ।\n${a.sentence}`,`ਵਾਕ ਵਿੱਚ ਨਾਂਵ ਦੀ ਵਿਸ਼ੇਸ਼ਤਾ ਦੱਸਣ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।\n${a.sentence}`],i),correctAnswer:a.target,distractors:peers,explanation:`‘${a.target}’ ਵਿਸ਼ੇਸ਼ਣ ਹੈ ਕਿਉਂਕਿ ਇਹ ${a.meaningPa}`,authorityIds:[a.id]});
}

export function generateCP005F02(seed:number,difficulty:PunjabiDifficulty):PunjabiGeneratedQuestion {
  requireDifficulty(difficulty,["Easy"],"F02"); const i=ordinal(seed,CP005_ADJECTIVES.length); const a=CP005_ADJECTIVES[i]!;
  return assemble({seed,difficulty,familyId:"F02",subtype:"ADJECTIVE_TYPE",stem:variant([`ਵਾਕ ਵਿੱਚ ‘${a.target}’ ਕਿਸ ਕਿਸਮ ਦਾ ਵਿਸ਼ੇਸ਼ਣ ਹੈ?\n${a.sentence}`,`‘${a.target}’ ਦਾ ਵਿਸ਼ੇਸ਼ਣ-ਭੇਦ ਦੱਸੋ।\n${a.sentence}`,`ਹੇਠਲੇ ਵਾਕ ਵਿੱਚ ‘${a.target}’ ਦੀ ਕਿਸਮ ਚੁਣੋ।\n${a.sentence}`],i),correctAnswer:a.typePa,distractors:CP005_TYPE_OPTIONS.adjective,explanation:`‘${a.target}’ ${a.typePa} ਹੈ; ਇਹ ${a.meaningPa}`,authorityIds:[a.id]});
}

export function generateCP005F03(seed:number,difficulty:PunjabiDifficulty):PunjabiGeneratedQuestion {
  requireDifficulty(difficulty,["Medium"],"F03"); const i=ordinal(seed,CP005_ADJECTIVES.length); const a=CP005_ADJECTIVES[i]!;
  const correct=`${a.typePa} — ${ADJECTIVE_ROLE_EXPLANATIONS[a.typePa]}`;
  const distractors=CP005_TYPE_OPTIONS.adjective.filter((type)=>type!==a.typePa).map((type)=>`${type} — ${ADJECTIVE_ROLE_EXPLANATIONS[type]}`);
  return assemble({seed,difficulty,familyId:"F03",subtype:"ADJECTIVE_TYPE_AND_FUNCTION",stem:variant([`ਵਾਕ ਵਿੱਚ ‘${a.target}’ ਦੀ ਕਿਸਮ ਅਤੇ ਕੰਮ ਦਾ ਸਹੀ ਜੋੜਾ ਚੁਣੋ।\n${a.sentence}`,`‘${a.target}’ ਬਾਰੇ ਸਹੀ ਵਿਆਕਰਨਕ ਪਛਾਣ ਚੁਣੋ।\n${a.sentence}`,`ਹੇਠਲੇ ਵਾਕ ਵਿੱਚ ‘${a.target}’ ਲਈ ਸਹੀ ਭੇਦ ਅਤੇ ਕੰਮ ਦੱਸਣ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।\n${a.sentence}`],i),correctAnswer:correct,distractors,explanation:`‘${a.target}’ ${a.typePa} ਹੈ, ਕਿਉਂਕਿ ਇਹ ${a.meaningPa}`,authorityIds:[a.id]});
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

function pairAuthorities(seed:number, capacity=CP005_ADJECTIVES.length*CP005_ADVERBS.length) {
  const rank=ordinal(seed,capacity); const ai=Math.floor(rank/CP005_ADVERBS.length); const vi=rank%CP005_ADVERBS.length;
  return { a:CP005_ADJECTIVES[ai]!, v:CP005_ADVERBS[vi]!, rank };
}

export function generateCP005F06(seed:number,difficulty:PunjabiDifficulty):PunjabiGeneratedQuestion {
  requireDifficulty(difficulty,["Medium"],"F06"); const {a,v,rank}=pairAuthorities(seed);
  const correct=`ਵਾਕ 1: ਵਿਸ਼ੇਸ਼ਣ; ਵਾਕ 2: ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ`; const opts=["ਵਾਕ 1: ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ; ਵਾਕ 2: ਵਿਸ਼ੇਸ਼ਣ","ਦੋਵੇਂ ਵਿਸ਼ੇਸ਼ਣ","ਦੋਵੇਂ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ"];
  return assemble({seed,difficulty,familyId:"F06",subtype:"ADJECTIVE_ADVERB_DISCRIMINATION",stem:variant([`ਦੋਵੇਂ ਚਿੰਨ੍ਹਿਤ ਸ਼ਬਦਾਂ ਦੀ ਭੂਮਿਕਾ ਦੱਸੋ।\nਵਾਕ 1: ${mark(a.sentence,a.target)}\nਵਾਕ 2: ${mark(v.sentence,v.target)}`,`ਵਾਕ 1 ਅਤੇ ਵਾਕ 2 ਵਿੱਚ ਚਿੰਨ੍ਹਿਤ ਸ਼ਬਦਾਂ ਦੀ ਸਹੀ ਪਛਾਣ ਚੁਣੋ।\nਵਾਕ 1: ${mark(a.sentence,a.target)}\nਵਾਕ 2: ${mark(v.sentence,v.target)}`],rank),correctAnswer:correct,distractors:opts,explanation:`ਵਾਕ 1 ਵਿੱਚ ‘${a.target}’ ਨਾਂਵ ਦੀ ਵਿਸ਼ੇਸ਼ਤਾ ਦੱਸਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਵਿਸ਼ੇਸ਼ਣ ਹੈ। ਵਾਕ 2 ਵਿੱਚ ‘${v.target}’ ਕਿਰਿਆ ਬਾਰੇ ਜਾਣਕਾਰੀ ਦਿੰਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ।`,authorityIds:[a.id,v.id]});
}

export function generateCP005F07(seed:number,difficulty:PunjabiDifficulty):PunjabiGeneratedQuestion {
  requireDifficulty(difficulty,["Hard"],"F07"); const {a,v,rank}=pairAuthorities(seed);
  const wrongAdj=CP005_TYPE_OPTIONS.adjective.filter((x)=>x!==a.typePa)[ordinal(rank,4)]!;
  const wrongAdvOptions=CP005_TYPE_OPTIONS.adverb.filter((x)=>x!==v.typePa); const wrongAdv=wrongAdvOptions[ordinal(rank+1,wrongAdvOptions.length)]!;
  const correct=`ਵਾਕ 1: ${a.typePa}; ਵਾਕ 2: ${v.typePa}`;
  const distractors=[`ਵਾਕ 1: ${wrongAdj}; ਵਾਕ 2: ${v.typePa}`,`ਵਾਕ 1: ${a.typePa}; ਵਾਕ 2: ${wrongAdv}`,`ਵਾਕ 1: ${wrongAdj}; ਵਾਕ 2: ${wrongAdv}`];
  return assemble({seed,difficulty,familyId:"F07",subtype:"DUAL_SUBTYPE_CLASSIFICATION",stem:variant([`ਦੋਵੇਂ ਚਿੰਨ੍ਹਿਤ ਸ਼ਬਦਾਂ ਦੇ ਸਹੀ ਭੇਦ ਚੁਣੋ।\nਵਾਕ 1: ${mark(a.sentence,a.target)}\nਵਾਕ 2: ${mark(v.sentence,v.target)}`,`ਵਾਕ 1 ਅਤੇ ਵਾਕ 2 ਵਿੱਚ ਚਿੰਨ੍ਹਿਤ ਸ਼ਬਦਾਂ ਦੀ ਪੂਰੀ ਵਿਆਕਰਨਕ ਪਛਾਣ ਦੱਸੋ।\nਵਾਕ 1: ${mark(a.sentence,a.target)}\nਵਾਕ 2: ${mark(v.sentence,v.target)}`],rank),correctAnswer:correct,distractors,explanation:`ਵਾਕ 1 ਵਿੱਚ ‘${a.target}’ ${a.typePa} ਹੈ; ਇਹ ${a.meaningPa} ਵਾਕ 2 ਵਿੱਚ ‘${v.target}’ ${v.typePa} ਹੈ; ਇਹ ${v.meaningPa}`,authorityIds:[a.id,v.id]});
}

export function generateCP005F08(seed:number,difficulty:PunjabiDifficulty):PunjabiGeneratedQuestion {
  requireDifficulty(difficulty,["Hard"],"F08");
  const rank=ordinal(seed,CP005_ADJECTIVES.length*CP005_ADVERBS.length*4); const pattern=rank%4; const pairRank=Math.floor(rank/4); const ai=Math.floor(pairRank/CP005_ADVERBS.length); const vi=pairRank%CP005_ADVERBS.length; const a=CP005_ADJECTIVES[ai]!; const v=CP005_ADVERBS[vi]!;
  const statement1True=pattern===0||pattern===1; const statement2True=pattern===0||pattern===2;
  const wrongAdj=CP005_TYPE_OPTIONS.adjective.filter((x)=>x!==a.typePa)[ordinal(pairRank,4)]!;
  const wrongAdvOptions=CP005_TYPE_OPTIONS.adverb.filter((x)=>x!==v.typePa); const wrongAdv=wrongAdvOptions[ordinal(pairRank+1,wrongAdvOptions.length)]!;
  const label1=statement1True?a.typePa:wrongAdj; const label2=statement2True?v.typePa:wrongAdv;
  const verdicts=["ਦੋਵੇਂ ਕਥਨ ਸਹੀ ਹਨ","ਕੇਵਲ ਕਥਨ 1 ਸਹੀ ਹੈ","ਕੇਵਲ ਕਥਨ 2 ਸਹੀ ਹੈ","ਦੋਵੇਂ ਕਥਨ ਗਲਤ ਹਨ"] as const;
  const correctAnswer=verdicts[pattern]!;
  const stem=variant([`ਵਾਕ 1: ${mark(a.sentence,a.target)}\nਕਥਨ 1: ਇਸ ਵਾਕ ਵਿੱਚ ‘${a.target}’ ${label1} ਹੈ।\nਵਾਕ 2: ${mark(v.sentence,v.target)}\nਕਥਨ 2: ਇਸ ਵਾਕ ਵਿੱਚ ‘${v.target}’ ${label2} ਹੈ।\nਦੋਵੇਂ ਕਥਨਾਂ ਬਾਰੇ ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ।`,`ਹੇਠਲੇ ਦੋ ਵਾਕਾਂ ਦੇ ਆਧਾਰ ਤੇ ਕਥਨਾਂ ਦੀ ਜਾਂਚ ਕਰੋ।\nਵਾਕ 1: ${mark(a.sentence,a.target)}\nਕਥਨ 1: ‘${a.target}’ ${label1} ਹੈ।\nਵਾਕ 2: ${mark(v.sentence,v.target)}\nਕਥਨ 2: ‘${v.target}’ ${label2} ਹੈ।`],pairRank);
  const explanation=`ਕਥਨ 1 ${statement1True?"ਸਹੀ":"ਗਲਤ"} ਹੈ; ਵਾਕ 1 ਵਿੱਚ ‘${a.target}’ ਦਾ ਸਹੀ ਭੇਦ ${a.typePa} ਹੈ। ਕਥਨ 2 ${statement2True?"ਸਹੀ":"ਗਲਤ"} ਹੈ; ਵਾਕ 2 ਵਿੱਚ ‘${v.target}’ ਦਾ ਸਹੀ ਭੇਦ ${v.typePa} ਹੈ।`;
  return assemble({seed,difficulty,familyId:"F08",subtype:"CONTEXTUAL_STATEMENT_VERIFICATION",stem,correctAnswer,distractors:verdicts,explanation,authorityIds:[a.id,v.id]});
}

export const CP005_FAMILIES: readonly PunjabiQuestionFamilyDefinition[] = [
  {familyId:"F01",subtype:"ADJECTIVE_IDENTIFICATION",name:"Adjective identification",targetDifficulties:["Easy"],generate:generateCP005F01},
  {familyId:"F02",subtype:"ADJECTIVE_TYPE",name:"Adjective type",targetDifficulties:["Easy"],generate:generateCP005F02},
  {familyId:"F03",subtype:"ADJECTIVE_TYPE_AND_FUNCTION",name:"Adjective type and function",targetDifficulties:["Medium"],generate:generateCP005F03},
  {familyId:"F04",subtype:"ADVERB_IDENTIFICATION",name:"Adverb identification",targetDifficulties:["Easy"],generate:generateCP005F04},
  {familyId:"F05",subtype:"ADVERB_TYPE",name:"Adverb type",targetDifficulties:["Medium"],generate:generateCP005F05},
  {familyId:"F06",subtype:"ADJECTIVE_ADVERB_DISCRIMINATION",name:"Adjective/adverb discrimination",targetDifficulties:["Medium"],generate:generateCP005F06},
  {familyId:"F07",subtype:"DUAL_SUBTYPE_CLASSIFICATION",name:"Dual subtype classification",targetDifficulties:["Hard"],generate:generateCP005F07},
  {familyId:"F08",subtype:"CONTEXTUAL_STATEMENT_VERIFICATION",name:"Contextual statement verification",targetDifficulties:["Hard"],generate:generateCP005F08},
];

export function getCP005BreadthReport() { const a=CP005_ADJECTIVES.length,v=CP005_ADVERBS.length; const capacities={F01:a,F02:a,F03:a,F04:v,F05:v,F06:a*v,F07:a*v,F08:a*v*4}; return { adjectiveAuthorities:a, adverbAuthorities:v, totalAtomicAuthorities:a+v, familyCount:CP005_FAMILIES.length, capacities, totalSemanticCapacity:Object.values(capacities).reduce((sum,n)=>sum+n,0) }; }
