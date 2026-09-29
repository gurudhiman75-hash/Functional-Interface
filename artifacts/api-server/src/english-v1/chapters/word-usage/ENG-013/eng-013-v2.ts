import{ENG013_ACTIVE_AUTHORITIES_V2}from"./eng-013-active-v2";
import type{Eng013AuthorityV1,Eng013CpId,Eng013Difficulty,Eng013Mode}from"./eng-013-authorities-v1";

export type Eng013QuestionInputV2={seed?:string;cpId?:Eng013CpId;difficulty?:Eng013Difficulty;mode?:Eng013Mode;authorityId?:string};

function hash(v:string){let h=0x811c9dc5;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return h>>>0;}
function pick<T>(xs:readonly T[],seed:string){return xs[hash(seed)%xs.length]!;}
function choose(input:Eng013QuestionInputV2){
 if(input.authorityId){const x=ENG013_ACTIVE_AUTHORITIES_V2.find(a=>a.id===input.authorityId);if(!x)throw new Error(`Unknown ENG-013 authority ${input.authorityId}`);return x;}
 let pool=ENG013_ACTIVE_AUTHORITIES_V2;
 if(input.cpId)pool=pool.filter(x=>x.cpId===input.cpId);
 if(input.difficulty)pool=pool.filter(x=>x.difficulty===input.difficulty);
 if(input.mode)pool=pool.filter(x=>x.mode===input.mode);
 if(!pool.length)throw new Error("No ENG-013 authority matches the requested filters");
 return pick(pool,input.seed??"eng013-default");
}
function shuffledOptions(a:Eng013AuthorityV1,seed:string){
 return a.sentences.map((text,index)=>({text,index,key:hash(`${seed}:option:${a.id}:${index}`)})).sort((x,y)=>x.key-y.key);
}
const EMPHASIS=["correct usage","incorrect usage","intended meaning","natural collocation","context"]as const;
function explanationEmphasis(text:string){return EMPHASIS.filter(x=>text.toLowerCase().includes(x));}

export function generateEng013QuestionV2(input:Eng013QuestionInputV2={}){
 const seed=input.seed??"eng013-default",authority=choose(input),ordered=shuffledOptions(authority,seed);
 const answer=ordered.findIndex(x=>x.index===authority.answerIndex);
 const prompt=authority.mode==="correct"
  ? `In which of the following sentences is the word "${authority.word}" used correctly?`
  : `In which of the following sentences is the word "${authority.word}" used incorrectly?`;
 const explanation=`${authority.mode==="correct"?"The correct usage":"The incorrect usage"} is option ${String.fromCharCode(65+answer)}. ${authority.explanation} The intended meaning and context determine the answer.`;
 return{
  questionId:`ENG013:${authority.id}:${hash(seed).toString(16)}`,
  stem:prompt,targetWord:authority.word,options:ordered.map(x=>x.text),correctOptionIndex:answer,explanation,
  explanationEmphasis:explanationEmphasis(explanation),
  metadata:{chapterId:"ENG-013",cpId:authority.cpId,authorityId:authority.id,difficulty:authority.difficulty,mode:authority.mode,word:authority.word,reviewOnly:true}
 };
}
export function generateEng013Cp005SetV2(seed:string,profile?:"ssc-standard"|"ssc-advanced"|"banking-prelims"|"banking-mains"){
 const map={"ssc-standard":"ENG-013-CP001","ssc-advanced":"ENG-013-CP002","banking-prelims":"ENG-013-CP003","banking-mains":"ENG-013-CP004"}as const;
 const profiles=Object.keys(map)as(keyof typeof map)[],selected=profile??profiles[hash(`${seed}:profile`)%profiles.length]!;
 return{profile:selected,sourceCpId:map[selected],question:generateEng013QuestionV2({seed,cpId:map[selected]})};
}
