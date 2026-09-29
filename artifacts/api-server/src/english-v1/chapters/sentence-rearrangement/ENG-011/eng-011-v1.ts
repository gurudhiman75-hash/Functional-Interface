import{type Eng011CpId,type Eng011Difficulty,type Eng011SetV1}from"./eng-011-authorities-v1";
import{ENG011_ACTIVE_SETS_V2}from"./eng-011-active-v2";
export type Eng011QuestionInputV1={seed?:string;cpId?:Eng011CpId;difficulty?:Eng011Difficulty;setId?:string};
function hash(v:string){let h=0x811c9dc5;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return h>>>0;}
function pick<T>(xs:readonly T[],seed:string){return xs[hash(seed)%xs.length]!;}
function orderText(order:readonly number[]){return order.map(n=>String.fromCharCode(64+n)).join("-");}
function rotate<T>(xs:readonly T[],n:number){const k=((n%xs.length)+xs.length)%xs.length;return[...xs.slice(k),...xs.slice(0,k)];}
function distractors(correct:readonly number[]){
 const out:number[][]=[];const add=(x:number[])=>{if(x.join(",")!==correct.join(",")&&!out.some(y=>y.join(",")===x.join(",")))out.push(x);};
 const a=[...correct];[a[0],a[1]]=[a[1]!,a[0]!];add(a);
 const b=[...correct];[b[b.length-2],b[b.length-1]]=[b[b.length-1]!,b[b.length-2]!];add(b);
 add(rotate(correct,1));add(rotate(correct,2));return out.slice(0,3);
}
function presentation(set:Eng011SetV1,seed:string){
 const logical=set.order.map(n=>set.fragments[n-1]!);
 const keyed=logical.map((text,i)=>({text,key:hash(`${seed}:present:${set.id}:${i}`)})).sort((a,b)=>a.key-b.key);
 let presented=keyed.map(x=>x.text);
 let correct=logical.map(text=>presented.indexOf(text)+1);
 if(correct.every((n,i)=>n===i+1)){presented=[...presented.slice(1),presented[0]!];correct=logical.map(text=>presented.indexOf(text)+1);}
 return{logical,presented,correct};
}
function chooseSet(input:Eng011QuestionInputV1){
 if(input.setId){const x=ENG011_ACTIVE_SETS_V2.find(s=>s.id===input.setId);if(!x)throw new Error(`Unknown ENG-011 set ${input.setId}`);return x;}
 let pool=ENG011_ACTIVE_SETS_V2;if(input.cpId)pool=pool.filter(x=>x.cpId===input.cpId);if(input.difficulty)pool=pool.filter(x=>x.difficulty===input.difficulty);
 if(!pool.length)throw new Error("No ENG-011 authority set matches requested filters");return pick(pool,input.seed??"eng011-default");
}
const EXPLANATION_EMPHASIS_CUES=["main grammatical link","subject with its verb","time phrase","reason phrase","contrast phrase","purpose phrase","complete sentence","comes first","follows naturally","completes the clause"] as const;
function explanationEmphasis(text:string){return EXPLANATION_EMPHASIS_CUES.filter(cue=>text.toLowerCase().includes(cue));}
function friendlyExplanation(logical:readonly string[],correct:string){
 const sentence=logical.join(" ");
 const names=["First","Second","Third","Fourth","Fifth","Sixth"];
 const steps=logical.map((part,i)=>`${names[i]??`Step ${i+1}`} place "${part}" because it completes the grammar and meaning of the sentence at that point.`);
 return `The correct order is ${correct}. First find the main subject and verb. Then attach the object and place time, reason, condition, contrast or purpose phrases where they fit naturally. ${steps.join(" ")} The complete sentence reads: "${sentence}."`;
}
export function generateEng011QuestionV1(input:Eng011QuestionInputV1={}){
 const seed=input.seed??"eng011-default",set=chooseSet(input),p=presentation(set,seed),correct=orderText(p.correct),raw=[correct,...distractors(p.correct).map(orderText)];
 const options=raw.map((v,i)=>({v,k:hash(`${seed}:${v}:${i}`)})).sort((a,b)=>a.k-b.k).map(x=>x.v);
 const explanation=friendlyExplanation(p.logical,correct);
 return{questionId:`ENG011:${set.id}:${hash(seed).toString(16)}`,stem:"Arrange the following parts to form a meaningful sentence.",
 fragments:p.presented.map((text,i)=>({label:String.fromCharCode(65+i),text})),prompt:"Choose the correct sequence.",options,correctOptionIndex:options.indexOf(correct),explanation,explanationEmphasis:explanationEmphasis(explanation),
 metadata:{chapterId:"ENG-011",cpId:set.cpId,setId:set.id,difficulty:set.difficulty,topic:set.topic,correctOrder:correct,reviewOnly:true}};
}
export function generateEng011Cp005SetV1(seed:string,profile?:"ssc-standard"|"ssc-advanced"|"banking-prelims"|"banking-mains"){
 const map={"ssc-standard":"ENG-011-CP001","ssc-advanced":"ENG-011-CP002","banking-prelims":"ENG-011-CP003","banking-mains":"ENG-011-CP004"}as const;
 const ps=Object.keys(map)as(keyof typeof map)[];const p=profile??ps[hash(`${seed}:profile`)%ps.length]!;
 return{profile:p,sourceCpId:map[p],question:generateEng011QuestionV1({seed,cpId:map[p]})};
}
