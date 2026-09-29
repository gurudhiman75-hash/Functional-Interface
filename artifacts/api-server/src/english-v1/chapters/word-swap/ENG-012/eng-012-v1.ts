import{ENG012_AUTHORITIES_V1,type Eng012AuthorityV1,type Eng012CpId,type Eng012Difficulty}from"./eng-012-authorities-v1";
import{ENG012_BANKING_AUTHORITIES_V1}from"./eng-012-banking-authorities-v1";
const ENG012_ALL_AUTHORITIES_V1:readonly Eng012AuthorityV1[]=[...ENG012_AUTHORITIES_V1,...ENG012_BANKING_AUTHORITIES_V1];

export type Eng012QuestionInputV1={seed?:string;cpId?:Eng012CpId;difficulty?:Eng012Difficulty;authorityId?:string};

function hash(v:string){let h=0x811c9dc5;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return h>>>0;}
function pick<T>(xs:readonly T[],seed:string){return xs[hash(seed)%xs.length]!;}
function label(n:number){return String.fromCharCode(64+n);}
function pairText(pair:readonly[number,number]){return `${label(pair[0])}-${label(pair[1])}`;}
function replaceSlots(template:string,words:readonly string[]){
 return template.replace(/\{([1-4])\}/g,(_,n)=>words[Number(n)-1]??"");
}
function markedSentence(template:string,words:readonly string[]){
 return template.replace(/\{([1-4])\}/g,(_,n)=>{const i=Number(n);return `(${label(i)}) ${words[i-1]??""}`;});
}
function swapWords(words:readonly string[],pair:readonly[number,number]){
 const out=[...words];const a=pair[0]-1,b=pair[1]-1;[out[a],out[b]]=[out[b]!,out[a]!];return out;
}
function allPairs(){return [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]] as const;}
function options(correct:string,seed:string){
 const distractors=allPairs().map(pairText).filter(x=>x!==correct);
 const chosen=[correct,...distractors.map(x=>({x,k:hash(`${seed}:d:${x}`)})).sort((a,b)=>a.k-b.k).slice(0,3).map(x=>x.x)];
 return chosen.map((x,i)=>({x,k:hash(`${seed}:o:${x}:${i}`)})).sort((a,b)=>a.k-b.k).map(x=>x.x);
}
function choose(input:Eng012QuestionInputV1){
 if(input.authorityId){const x=ENG012_ALL_AUTHORITIES_V1.find(a=>a.id===input.authorityId);if(!x)throw new Error(`Unknown ENG-012 authority ${input.authorityId}`);return x;}
 let pool=ENG012_ALL_AUTHORITIES_V1;
 if(input.cpId)pool=pool.filter(x=>x.cpId===input.cpId);
 if(input.difficulty)pool=pool.filter(x=>x.difficulty===input.difficulty);
 if(!pool.length)throw new Error("No ENG-012 authority matches the requested filters");
 return pick(pool,input.seed??"eng012-default");
}
function wordsFor(a:Eng012AuthorityV1,seed:string){
 const surfaces=[a.natural,...(a.variants??[])];
 return surfaces[hash(`${seed}:surface:${a.id}`)%surfaces.length]!;
}
const EMPHASIS=["correct swap","natural phrase","fits naturally","corrected sentence"]as const;
function explanationEmphasis(text:string){return EMPHASIS.filter(x=>text.toLowerCase().includes(x));}

export function generateEng012QuestionV1(input:Eng012QuestionInputV1={}){
 const seed=input.seed??"eng012-default",authority=choose(input),natural=wordsFor(authority,seed),display=swapWords(natural,authority.swap);
 const correct=pairText(authority.swap),opts=options(correct,seed),corrected=replaceSlots(authority.template,natural);
 const explanation=`The correct swap is ${correct}. After the swap, "${authority.cue1}" becomes the natural phrase, and "${authority.cue2}" also fits naturally. The corrected sentence is: "${corrected}"`;
 return{
  questionId:`ENG012:${authority.id}:${hash(seed).toString(16)}`,
  stem:"In the following sentence, four words are marked. Choose the pair of words that should be interchanged to make the sentence grammatically and contextually correct.",
  sentence:markedSentence(authority.template,display),
  options:opts,
  correctOptionIndex:opts.indexOf(correct),
  explanation,
  explanationEmphasis:explanationEmphasis(explanation),
  metadata:{chapterId:"ENG-012",cpId:authority.cpId,authorityId:authority.id,difficulty:authority.difficulty,topic:authority.topic,correctSwap:correct,correctedSentence:corrected,reviewOnly:true}
 };
}

export function generateEng012Cp005SetV1(seed:string,profile?:"ssc-standard"|"ssc-advanced"|"banking-prelims"|"banking-mains"){
 const map={"ssc-standard":"ENG-012-CP001","ssc-advanced":"ENG-012-CP002","banking-prelims":"ENG-012-CP003","banking-mains":"ENG-012-CP004"}as const;
 const profiles=Object.keys(map)as(keyof typeof map)[];
 const selected=profile??profiles[hash(`${seed}:profile`)%profiles.length]!;
 return{profile:selected,sourceCpId:map[selected],question:generateEng012QuestionV1({seed,cpId:map[selected]})};
}
