import { deterministicIndex } from "../../../../core/deterministic";
import { ENG004_CP001_LEXICON_V1, eng004Cp001PoolV1, type Eng004Difficulty, type Eng004LexicalEntryV1, type Eng004RelationType } from "./eng-004-cp001-lexicon-v1";

export interface Eng004Cp001QuestionV1 {
  questionId: string;
  stem: string;
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
    seed: string;
    reviewOnly: true;
  };
}

export interface GenerateEng004Cp001V1Input {
  seed: string;
  difficulty: Eng004Difficulty;
  relationType?: Eng004RelationType;
  entryId?: string;
}

const SYNONYM_STEMS = [
  (word:string) => `Choose the word most similar in meaning to “${word}”.`,
  (word:string) => `Select the synonym of “${word}”.`,
  (word:string) => `Which option is closest in meaning to “${word}”?`,
  (word:string) => `Choose the option that best matches the meaning of “${word}”.`,
] as const;

const ANTONYM_STEMS = [
  (word:string) => `Choose the word most opposite in meaning to “${word}”.`,
  (word:string) => `Select the antonym of “${word}”.`,
  (word:string) => `Which option is opposite in meaning to “${word}”?`,
  (word:string) => `Choose the option that expresses the opposite of “${word}”.`,
] as const;

function stableHash(value:string){
  let hash=0x811c9dc5;
  for(let i=0;i<value.length;i+=1){hash^=value.charCodeAt(i);hash=Math.imul(hash,0x01000193)>>>0;}
  return hash>>>0;
}

function resolveEntry(input:GenerateEng004Cp001V1Input):Eng004LexicalEntryV1{
  if(input.entryId){
    const entry=ENG004_CP001_LEXICON_V1.find((item)=>item.id===input.entryId);
    if(!entry) throw new Error(`Unknown ENG-004 CP001 entry ${input.entryId}`);
    if(entry.difficulty!==input.difficulty) throw new Error(`${input.entryId} is not ${input.difficulty}`);
    return entry;
  }
  const pool=eng004Cp001PoolV1(input.difficulty);
  return pool[deterministicIndex(`${input.seed}:eng004-cp001-entry`,pool.length)]!;
}

function placeOptions(seed:string,correct:string,distractors:readonly string[]){
  if(distractors.length!==3) throw new Error("ENG-004 CP001 requires exactly three distractors");
  const unique=new Set([correct,...distractors].map((value)=>value.toLowerCase()));
  if(unique.size!==4) throw new Error("ENG-004 CP001 options must be unique");
  const correctOptionIndex=stableHash(`${seed}:eng004-cp001-correct-position`)%4;
  const shuffled=[...distractors];
  for(let i=shuffled.length-1;i>0;i-=1){
    const j=deterministicIndex(`${seed}:eng004-cp001-shuffle:${i}`,i+1);
    [shuffled[i],shuffled[j]]=[shuffled[j]!,shuffled[i]!];
  }
  const options:string[]=[];let wrong=0;
  for(let i=0;i<4;i+=1) options.push(i===correctOptionIndex?correct:shuffled[wrong++]!);
  return {options,correctOptionIndex};
}

export function generateEng004Cp001QuestionV1(input:GenerateEng004Cp001V1Input):Eng004Cp001QuestionV1{
  const entry=resolveEntry(input);
  const relationType=input.relationType ?? (deterministicIndex(`${input.seed}:eng004-cp001-relation`,2)===0?"synonym":"antonym");
  const correct=relationType==="synonym"?entry.synonym:entry.antonym;
  const distractors=relationType==="synonym"?entry.synonymDistractors:entry.antonymDistractors;
  const stems=relationType==="synonym"?SYNONYM_STEMS:ANTONYM_STEMS;
  const stem=stems[deterministicIndex(`${input.seed}:eng004-cp001-stem`,stems.length)]!(entry.word);
  const {options,correctOptionIndex}=placeOptions(input.seed,correct,distractors);
  const explanation=relationType==="synonym"
    ? `“${entry.word}” means ${entry.meaning}. “${entry.synonym}” has the closest meaning, so it is the correct synonym. Example: ${entry.example}`
    : `“${entry.word}” means ${entry.meaning}. “${entry.antonym}” expresses the opposite idea, so it is the correct antonym. Example: ${entry.example}`;
  return {
    questionId:`ENG-004-CP001-${entry.id}-${relationType.toUpperCase()}-${stableHash(input.seed).toString(16).padStart(8,"0")}`,
    stem,options,correctOptionIndex,explanation,
    metadata:{track:"english",chapterId:"ENG-004",cpId:"ENG-004-CP001",difficulty:entry.difficulty,relationType,entryId:entry.id,word:entry.word,partOfSpeech:entry.pos,seed:input.seed,reviewOnly:true},
  };
}
