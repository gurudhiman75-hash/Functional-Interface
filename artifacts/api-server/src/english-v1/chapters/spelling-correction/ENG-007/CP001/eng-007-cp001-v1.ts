import{deterministicIndex}from"../../../../core/deterministic";
import{ENG007_CP001_ENTRIES_V1,eng007Cp001PoolV1,type Eng007Cp001EntryV1,type Eng007Difficulty,type Eng007Trap}from"./eng-007-cp001-lexicon-v1";

export type Eng007Cp001Mode="correct-spelling"|"misspelt-word";
export interface GenerateEng007Cp001V1Input{seed:string;difficulty:Eng007Difficulty;mode?:Eng007Cp001Mode;entryId?:string;}
export interface Eng007Cp001QuestionV1{
  questionId:string;stem:string;options:readonly string[];correctOptionIndex:number;explanation:string;
  metadata:{chapterId:"ENG-007";cpId:"ENG-007-CP001";difficulty:Eng007Difficulty;mode:Eng007Cp001Mode;entryId:string;correctSpelling:string;misspelling:string;trap:Eng007Trap;seed:string;reviewOnly:true};
}

function hash(v:string){let h=0x811c9dc5;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return h>>>0;}
function resolve(input:GenerateEng007Cp001V1Input){
  if(input.entryId){
    const e=ENG007_CP001_ENTRIES_V1.find(x=>x.id===input.entryId);
    if(!e)throw new Error("Unknown ENG-007 CP001 entry");
    if(e.difficulty!==input.difficulty)throw new Error("ENG-007 CP001 difficulty mismatch");
    return e;
  }
  const pool=eng007Cp001PoolV1(input.difficulty);
  return pool[deterministicIndex(`${input.seed}:entry`,pool.length)]!;
}
function mode(input:GenerateEng007Cp001V1Input):Eng007Cp001Mode{
  return input.mode??(deterministicIndex(`${input.seed}:mode`,2)===0?"correct-spelling":"misspelt-word");
}
function candidates(e:Eng007Cp001EntryV1,seed:string){
  const pool=eng007Cp001PoolV1(e.difficulty).filter(x=>x.id!==e.id);
  pool.sort((a,b)=>(a.trap===e.trap?0:1)-(b.trap===e.trap?0:1)||Math.abs(a.correct.length-e.correct.length)-Math.abs(b.correct.length-e.correct.length)||a.id.localeCompare(b.id));
  const shortlist=pool.slice(0,Math.min(28,pool.length));
  for(let i=shortlist.length-1;i>0;i--){const j=deterministicIndex(`${seed}:shuffle:${i}`,i+1);[shortlist[i],shortlist[j]]=[shortlist[j]!,shortlist[i]!];}
  return shortlist.slice(0,3);
}
function trapHelp(trap:Eng007Trap){
  switch(trap){
    case"omitted-letter":return"Do not drop a letter from the standard form.";
    case"extra-letter":return"Do not add an extra letter to the standard form.";
    case"letter-order":return"Keep the letters in the standard order.";
    case"vowel-pattern":return"Watch the vowel sequence.";
    case"consonant-pattern":return"Watch the consonant pattern, especially doubled consonants.";
    case"ending-pattern":return"Watch the word ending.";
    default:return"Keep the standard letter sequence.";
  }
}
function explanation(e:Eng007Cp001EntryV1,m:Eng007Cp001Mode){
  return m==="correct-spelling"
    ?`“${e.correct}” is correctly spelt. A common error is “${e.misspelling}”. ${trapHelp(e.trap)}`
    :`“${e.misspelling}” is misspelt; the correct form is “${e.correct}”. ${trapHelp(e.trap)}`;
}
export function generateEng007Cp001QuestionV1(input:GenerateEng007Cp001V1Input):Eng007Cp001QuestionV1{
  const e=resolve(input),m=mode(input),others=candidates(e,input.seed);
  const answer=m==="correct-spelling"?e.correct:e.misspelling;
  const wrong=m==="correct-spelling"?others.map(x=>x.misspelling):others.map(x=>x.correct);
  const ci=hash(`${input.seed}:position`)%4,options:string[]=[];let wi=0;
  for(let i=0;i<4;i++)options.push(i===ci?answer:wrong[wi++]!);
  const stems=m==="correct-spelling"
    ?["Select the correctly spelt word.","Choose the word that is spelt correctly.","Identify the correctly spelt word."]
    :["Select the incorrectly spelt word.","Identify the misspelt word.","Choose the word that is spelt incorrectly."];
  return{
    questionId:`ENG-007-CP001-${e.id}-${hash(input.seed).toString(16)}`,
    stem:stems[deterministicIndex(`${input.seed}:stem`,stems.length)]!,
    options,correctOptionIndex:ci,explanation:explanation(e,m),
    metadata:{chapterId:"ENG-007",cpId:"ENG-007-CP001",difficulty:e.difficulty,mode:m,entryId:e.id,correctSpelling:e.correct,misspelling:e.misspelling,trap:e.trap,seed:input.seed,reviewOnly:true}
  };
}
