import{deterministicIndex}from"../../../../core/deterministic";
import{ENG009_CP005_BLANKS_V1,ENG009_CP005_PASSAGES_V1,type Eng009Cp005Difficulty,type Eng009Cp005Mode}from"./eng-009-cp005-authorities-v1";
function hash(v:string){let h=0x811c9dc5;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return h>>>0;}
function shuffle<T>(seed:string,items:readonly T[]){const out=[...items];for(let i=out.length-1;i>0;i--){const j=deterministicIndex(`${seed}:${i}`,i+1);[out[i],out[j]]=[out[j]!,out[i]!];}return out;}
export interface GenerateEng009Cp005Input{seed:string;difficulty?:Eng009Cp005Difficulty;mode?:Eng009Cp005Mode;blankId?:string;passageId?:string;}
export function renderEng009Cp005Passage(template:string){return template.replace(/__\((\d)\)__/g,(_,n)=>`____(${n})____`);}
export function generateEng009Cp005QuestionV1(input:GenerateEng009Cp005Input){
 let pool=ENG009_CP005_BLANKS_V1;
 if(input.difficulty)pool=pool.filter(x=>x.blank.difficulty===input.difficulty);
 if(input.mode)pool=pool.filter(x=>x.blank.mode===input.mode);
 if(input.blankId)pool=pool.filter(x=>x.blank.id===input.blankId);
 if(input.passageId)pool=pool.filter(x=>x.passage.id===input.passageId);
 if(!pool.length)throw new Error("No ENG-009 CP005 authority matches filters");
 const {passage,blank}=pool[deterministicIndex(`${input.seed}:authority`,pool.length)]!;
 let options:string[],correctOptionIndex:number,prompt:string,answer:string;
 if(blank.mode==="cannot-fit"){
   const correct=blank.rejected[0]!,others=blank.accepted.slice(0,3);
   options=shuffle(`${input.seed}:options`,[correct,...others]);
   correctOptionIndex=options.indexOf(correct);answer=correct;
   prompt=`Which option CANNOT appropriately fill blank number ${blank.blankNo}?`;
 }else if(blank.mode==="can-fit"){
   const correct=blank.accepted[0]!,others=[...blank.accepted.slice(1),...blank.rejected].slice(0,3);
   options=shuffle(`${input.seed}:options`,[correct,...others]);
   correctOptionIndex=options.indexOf(correct);answer=correct;
   prompt=`Which option can appropriately fill blank number ${blank.blankNo}?`;
 }else{
   const correct=blank.accepted[0]!,others=blank.rejected.slice(0,3);
   options=shuffle(`${input.seed}:options`,[correct,...others]);
   correctOptionIndex=options.indexOf(correct);answer=correct;
   prompt=`Select the most appropriate word or phrase for blank number ${blank.blankNo}.`;
 }
 return{questionId:`ENG-009-CP005-V1:${blank.id}:${hash(input.seed).toString(16)}`,stem:"Read the passage and answer the question based on the numbered blank.",passage:renderEng009Cp005Passage(passage.template),prompt,options,correctOptionIndex,explanation:`Answer: ${answer}. ${blank.explanation}`,metadata:{chapterId:"ENG-009",cpId:"ENG-009-CP005",passageId:passage.id,blankId:blank.id,blankNo:blank.blankNo,mode:blank.mode,difficulty:blank.difficulty,clue:blank.clue,seed:input.seed,reviewOnly:true as const}};
}
export function generateEng009Cp005SetV1(seed:string,passageId?:string){
 const passages=passageId?ENG009_CP005_PASSAGES_V1.filter(x=>x.id===passageId):ENG009_CP005_PASSAGES_V1;
 if(!passages.length)throw new Error("Unknown ENG-009 CP005 passage");
 const passage=passages[deterministicIndex(`${seed}:passage`,passages.length)]!;
 return{passageId:passage.id,title:passage.title,passage:renderEng009Cp005Passage(passage.template),questions:passage.blanks.map(blank=>generateEng009Cp005QuestionV1({seed:`${seed}:${blank.id}`,blankId:blank.id}))};
}