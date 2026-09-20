import { deterministicIndex } from "../../../../core/deterministic";
import { ENG004_CP001_LEXICON_V2, eng004Cp001PoolV2, type Eng004Difficulty, type Eng004LexicalEntryV2, type Eng004RelationType } from "./eng-004-cp001-lexicon-v1";

export interface Eng004Cp001QuestionV2 {
  questionId: string;
  stem: string;
  context?: string;
  options: readonly string[];
  correctOptionIndex: number;
  explanation: string;
  metadata: {
    track: "english";
    chapterId: "ENG-004";
    cpId: "ENG-004-CP001";
    difficulty: Eng004Difficulty;
    relationType: Eng004RelationType;
    entryId: string;
    word: string;
    partOfSpeech: string;
    senseRank: number;
    senseCount: number;
    sourceSynsetOffset: string;
    seed: string;
    reviewOnly: true;
  };
}

export type Eng004Cp001QuestionV1 = Eng004Cp001QuestionV2;
export interface GenerateEng004Cp001V2Input {
  seed: string;
  difficulty: Eng004Difficulty;
  relationType?: Eng004RelationType;
  entryId?: string;
}
export type GenerateEng004Cp001V1Input = GenerateEng004Cp001V2Input;

const DIRECT_SYNONYM_STEMS = [
  (word:string) => `Choose the word most similar in meaning to “${word}”.`,
  (word:string) => `Select the synonym of “${word}”.`,
  (word:string) => `Which option is closest in meaning to “${word}”?`,
] as const;
const DIRECT_ANTONYM_STEMS = [
  (word:string) => `Choose the word most opposite in meaning to “${word}”.`,
  (word:string) => `Select the antonym of “${word}”.`,
  (word:string) => `Which option is opposite in meaning to “${word}”?`,
] as const;

function stableHash(value:string){let hash=0x811c9dc5;for(let i=0;i<value.length;i+=1){hash^=value.charCodeAt(i);hash=Math.imul(hash,0x01000193)>>>0;}return hash>>>0;}

function resolveEntry(input:GenerateEng004Cp001V2Input):Eng004LexicalEntryV2{
  if(input.entryId){
    const entry=ENG004_CP001_LEXICON_V2.find((item)=>item.id===input.entryId);
    if(!entry)throw new Error(`Unknown ENG-004 CP001 entry ${input.entryId}`);
    if(entry.difficulty!==input.difficulty)throw new Error(`${input.entryId} is not ${input.difficulty}`);
    return entry;
  }
  const pool=eng004Cp001PoolV2(input.difficulty);
  return pool[deterministicIndex(`${input.seed}:eng004-cp001-entry-v2`,pool.length)]!;
}

function relationChoices(entry:Eng004LexicalEntryV2){
  const out:Eng004RelationType[]=[];
  if(entry.synonyms.length)out.push("synonym");
  if(entry.antonyms.length)out.push("antonym");
  return out;
}

function placeOptions(seed:string,correct:string,distractors:readonly string[]){
  const unique=[...new Set(distractors.map((x)=>x.toLowerCase()))].filter((x)=>x!==correct.toLowerCase());
  if(unique.length<3)throw new Error(`ENG-004 CP001 needs three distractors for ${correct}`);
  const shuffled=unique.slice(0,8);
  for(let i=shuffled.length-1;i>0;i-=1){const j=deterministicIndex(`${seed}:eng004-cp001-v2-shuffle:${i}`,i+1);[shuffled[i],shuffled[j]]=[shuffled[j]!,shuffled[i]!];}
  const picked=shuffled.slice(0,3);
  const correctOptionIndex=stableHash(`${seed}:eng004-cp001-v2-correct-position`)%4;
  const options:string[]=[];let wrong=0;
  for(let i=0;i<4;i+=1)options.push(i===correctOptionIndex?correct:picked[wrong++]!);
  return {options,correctOptionIndex};
}

export function generateEng004Cp001QuestionV2(input:GenerateEng004Cp001V2Input):Eng004Cp001QuestionV2{
  const entry=resolveEntry(input);
  const available=relationChoices(entry);
  if(!available.length)throw new Error(`${entry.id} has no approved lexical relation`);
  const relationType=input.relationType ?? available[deterministicIndex(`${input.seed}:eng004-cp001-v2-relation`,available.length)]!;
  if(!available.includes(relationType))throw new Error(`${entry.id} has no approved ${relationType}`);
  const answers=relationType==="synonym"?entry.synonyms:entry.antonyms;
  const correct=answers[deterministicIndex(`${input.seed}:eng004-cp001-v2-answer`,answers.length)]!;
  const blocked=new Set([entry.word,...entry.synonyms,...entry.antonyms].map((x)=>x.toLowerCase()));
  const distractors=entry.distractors.filter((x)=>!blocked.has(x.toLowerCase()));
  const {options,correctOptionIndex}=placeOptions(input.seed,correct,distractors);

  const requiresContext=entry.senseCount>1&&Boolean(entry.example);
  const stems=relationType==="synonym"?DIRECT_SYNONYM_STEMS:DIRECT_ANTONYM_STEMS;
  const stem=requiresContext
    ? `In the sentence below, choose the ${relationType} of “${entry.word}” as used there.`
    : stems[deterministicIndex(`${input.seed}:eng004-cp001-v2-stem`,stems.length)]!(entry.word);
  const context=requiresContext?entry.example:undefined;
  const relationText=relationType==="synonym"?"has the closest meaning":"expresses the opposite meaning";
  const explanation=`“${entry.word}” here means ${entry.meaning}. “${correct}” ${relationText} in this sense.`;

  return {
    questionId:`ENG-004-CP001-${entry.id}-${relationType.toUpperCase()}-${stableHash(input.seed).toString(16).padStart(8,"0")}`,
    stem,context,options,correctOptionIndex,explanation,
    metadata:{track:"english",chapterId:"ENG-004",cpId:"ENG-004-CP001",difficulty:entry.difficulty,relationType,entryId:entry.id,word:entry.word,partOfSpeech:entry.pos,senseRank:entry.senseRank,senseCount:entry.senseCount,sourceSynsetOffset:entry.source.synsetOffset,seed:input.seed,reviewOnly:true},
  };
}
export const generateEng004Cp001QuestionV1=generateEng004Cp001QuestionV2;
