import{type Eng010CpId,type Eng010Difficulty,type Eng010SetV1}from"./eng-010-authorities-v1";
import{ENG010_ACTIVE_SETS_V2}from"./eng-010-active-v2";

export type Eng010QuestionInputV1={seed?:string;cpId?:Eng010CpId;difficulty?:Eng010Difficulty;setId?:string};
function hash(v:string){let h=0x811c9dc5;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return h>>>0;}
function pick<T>(xs:readonly T[],seed:string){return xs[hash(seed)%xs.length]!;}
function labels(n:number){return Array.from({length:n},(_,i)=>String.fromCharCode(65+i));}
function orderText(order:readonly number[]){return order.map(n=>String.fromCharCode(64+n)).join("-");}
function rotate<T>(xs:readonly T[],n:number){const k=((n%xs.length)+xs.length)%xs.length;return[...xs.slice(k),...xs.slice(0,k)];}
function distractors(correct:readonly number[]){
 const out:number[][]=[];
 const add=(x:number[])=>{if(x.join(",")!==correct.join(",")&&!out.some(y=>y.join(",")===x.join(",")))out.push(x);};
 if(correct.length>=5){
  const a=[...correct];[a[1],a[2]]=[a[2]!,a[1]!];add(a);
  const b=[...correct];[b[b.length-2],b[b.length-1]]=[b[b.length-1]!,b[b.length-2]!];add(b);
  add(rotate(correct,1));
  const d=[...correct];[d[0],d[1]]=[d[1]!,d[0]!];add(d);
 }
 let i=2;while(out.length<3){add(rotate(correct,i++));}
 return out.slice(0,3);
}
function shuffledOptions(set:Eng010SetV1,seed:string){
 const correct=orderText(set.order),raw=[correct,...distractors(set.order).map(orderText)];
 return raw.map((value,i)=>({value,key:hash(`${seed}:${value}:${i}`)})).sort((a,b)=>a.key-b.key).map(x=>x.value);
}
function chooseSet(input:Eng010QuestionInputV1){
 if(input.setId){const found=ENG010_ACTIVE_SETS_V2.find(x=>x.id===input.setId);if(!found)throw new Error(`Unknown ENG-010 set ${input.setId}`);return found;}
 let pool=ENG010_ACTIVE_SETS_V2;
 if(input.cpId)pool=pool.filter(x=>x.cpId===input.cpId);
 if(input.difficulty)pool=pool.filter(x=>x.difficulty===input.difficulty);
 if(!pool.length)throw new Error("No ENG-010 authority set matches the requested filters");
 return pick(pool,input.seed??"eng010-default");
}
const EXPLANATION_EMPHASIS_CUES=["introduces the topic","introduces the main idea","starts the process","explains the benefit","gives the benefit","adds the benefit","gives the contrast","adds the contrast","shows the problem","shows the result","gives the result","gives the solution","provides the solution","draws the conclusion","gives the conclusion","concludes the paragraph","closes the paragraph","final conclusion"] as const;\nfunction explanationEmphasis(text:string){return EXPLANATION_EMPHASIS_CUES.filter(cue=>text.toLowerCase().includes(cue));}\nfunction friendlyExplanation(set:Eng010SetV1){
 const correct=orderText(set.order);
 if(set.explanation.startsWith("The correct order is"))return set.explanation;
 return `The correct order is ${correct}. Start with the sentence that introduces the main idea. Then follow the linking words, references and cause-effect flow. In this set, ${set.explanation} Reading the sentences in this order gives one clear, complete paragraph.`;
}
export function generateEng010QuestionV1(input:Eng010QuestionInputV1={}){
 const seed=input.seed??"eng010-default",set=chooseSet(input),opts=shuffledOptions(set,seed),correct=orderText(set.order);
 return{
  questionId:`ENG010:${set.id}:${hash(seed).toString(16)}`,
  stem:"Arrange the following sentences to form a coherent paragraph.",
  sentences:set.sentences.map((text,i)=>({label:labels(set.sentences.length)[i],text})),
  prompt:"Choose the correct sequence.",
  options:opts,
  correctOptionIndex:opts.indexOf(correct),
  explanation:friendlyExplanation(set),\n  explanationEmphasis:explanationEmphasis(friendlyExplanation(set)),
  metadata:{chapterId:"ENG-010",cpId:set.cpId,setId:set.id,difficulty:set.difficulty,topic:set.topic,correctOrder:correct,reviewOnly:true}
 };
}
export function generateEng010SetV1(seed:string,cpId?:Eng010CpId){
 const q=generateEng010QuestionV1({seed,cpId});
 return{setId:q.metadata.setId,cpId:q.metadata.cpId,question:q};
}
export function generateEng010Cp005SetV1(seed:string,profile?:"ssc-standard"|"ssc-advanced"|"banking-prelims"|"banking-mains"){
 const map={ "ssc-standard":"ENG-010-CP001","ssc-advanced":"ENG-010-CP002","banking-prelims":"ENG-010-CP003","banking-mains":"ENG-010-CP004"} as const;
 const profiles=Object.keys(map) as (keyof typeof map)[];
 const p=profile??profiles[hash(`${seed}:profile`)%profiles.length]!;
 return{profile:p,...generateEng010SetV1(seed,map[p])};
}
