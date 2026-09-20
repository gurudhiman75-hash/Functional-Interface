import{deterministicIndex}from"../../../../core/deterministic";
import{ENG004_CP005_LEXICON_V1,eng004Cp005PoolV1,type Eng004Cp005Difficulty,type Eng004Cp005LexicalEntryV1,type Eng004Cp005RelationType}from"./eng-004-cp005-lexicon-v1";

export interface GenerateEng004Cp005V1Input{seed:string;difficulty:Eng004Cp005Difficulty;relationType?:Eng004Cp005RelationType;entryId?:string;}
export interface Eng004Cp005QuestionV1{questionId:string;stem:string;context?:string;options:readonly string[];correctOptionIndex:number;explanation:string;metadata:{track:"english";chapterId:"ENG-004";cpId:"ENG-004-CP005";difficulty:Eng004Cp005Difficulty;relationType:Eng004Cp005RelationType;entryId:string;word:string;partOfSpeech:string;senseRank:number;senseCount:number;sourceSynsetOffset:string;seed:string;reviewOnly:true};}

const SYN=[(w:string)=>`Choose the word most similar in meaning to “${w}”.`,(w:string)=>`Select the synonym of “${w}”.`,(w:string)=>`Which option is closest in meaning to “${w}”?`]as const;
const ANT=[(w:string)=>`Choose the word most opposite in meaning to “${w}”.`,(w:string)=>`Select the antonym of “${w}”.`,(w:string)=>`Which option is opposite in meaning to “${w}”?`]as const;
function hash(v:string){let h=0x811c9dc5;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return h>>>0;}
function resolve(input:GenerateEng004Cp005V1Input):Eng004Cp005LexicalEntryV1{
  if(input.entryId){const e=ENG004_CP005_LEXICON_V1.find(x=>x.id===input.entryId);if(!e)throw new Error(`Unknown ENG-004 CP005 entry ${input.entryId}`);if(e.difficulty!==input.difficulty)throw new Error(`${e.id} is not ${input.difficulty}`);return e;}
  const pool=eng004Cp005PoolV1(input.difficulty);return pool[deterministicIndex(`${input.seed}:eng004-cp005-entry`,pool.length)]!;
}
function place(seed:string,correct:string,distractors:readonly string[]){
  let xs=[...new Set(distractors.map(x=>x.toLowerCase()))].filter(x=>x!==correct.toLowerCase());
  if(xs.length<3)throw new Error(`ENG-004 CP005 needs three distractors for ${correct}`);
  for(let i=xs.length-1;i>0;i--){const j=deterministicIndex(`${seed}:eng004-cp005-shuffle:${i}`,i+1);[xs[i],xs[j]]=[xs[j]!,xs[i]!];}
  xs=xs.slice(0,3);const ci=hash(`${seed}:eng004-cp005-position`)%4,options:string[]=[];let w=0;
  for(let i=0;i<4;i++)options.push(i===ci?correct:xs[w++]!);
  return{options,correctOptionIndex:ci};
}
export function generateEng004Cp005QuestionV1(input:GenerateEng004Cp005V1Input):Eng004Cp005QuestionV1{
  const e=resolve(input),modes:Eng004Cp005RelationType[]=[];if(e.synonyms.length)modes.push("synonym");if(e.antonyms.length)modes.push("antonym");if(!modes.length)throw new Error(`${e.id} has no lexical relation`);
  const relationType=input.relationType??modes[deterministicIndex(`${input.seed}:eng004-cp005-relation`,modes.length)]!;if(!modes.includes(relationType))throw new Error(`${e.id} has no approved ${relationType}`);
  const answers=relationType==="synonym"?e.synonyms:e.antonyms,correct=answers[deterministicIndex(`${input.seed}:eng004-cp005-answer`,answers.length)]!;
  const blocked=new Set([e.word,...e.synonyms,...e.antonyms,...e.blockedOtherSenseRelations].map(x=>x.toLowerCase()));
  const placed=place(input.seed,correct,e.distractors.filter(x=>!blocked.has(x.toLowerCase())));
  const contextual=e.senseCount>1&&Boolean(e.example),stem=contextual?`In the sentence below, choose the ${relationType} of “${e.word}” as used there.`:(relationType==="synonym"?SYN:ANT)[deterministicIndex(`${input.seed}:eng004-cp005-stem`,3)]!(e.word);
  const rt=relationType==="synonym"?"has the closest meaning":"expresses the opposite meaning";
  return{questionId:`ENG-004-CP005-${e.id}-${relationType.toUpperCase()}-${hash(input.seed).toString(16).padStart(8,"0")}`,stem,context:contextual?e.example:undefined,options:placed.options,correctOptionIndex:placed.correctOptionIndex,explanation:`“${e.word}” here means ${e.meaning}. “${correct}” ${rt} in this sense.`,metadata:{track:"english",chapterId:"ENG-004",cpId:"ENG-004-CP005",difficulty:e.difficulty,relationType,entryId:e.id,word:e.word,partOfSpeech:e.pos,senseRank:e.senseRank,senseCount:e.senseCount,sourceSynsetOffset:e.source.synsetOffset,seed:input.seed,reviewOnly:true}};
}
