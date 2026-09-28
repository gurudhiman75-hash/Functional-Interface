import{deterministicIndex}from"../../../../core/deterministic";
import{ENG009_CP004_BLANKS_V1,ENG009_CP004_PASSAGES_V1,type Eng009Cp004Difficulty}from"./eng-009-cp004-authorities-v1";
function hash(v:string){let h=0x811c9dc5;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return h>>>0;}
function place(seed:string,correct:string,distractors:readonly string[]){const ds=[...distractors];for(let i=ds.length-1;i>0;i--){const j=deterministicIndex(`${seed}:d:${i}`,i+1);[ds[i],ds[j]]=[ds[j]!,ds[i]!];}const ci=hash(`${seed}:a`)%4,options:string[]=[];let wi=0;for(let i=0;i<4;i++)options.push(i===ci?correct:ds[wi++]!);return{options,correctOptionIndex:ci};}
export interface GenerateEng009Cp004Input{seed:string;difficulty?:Eng009Cp004Difficulty;blankId?:string;passageId?:string;}
export function renderEng009Cp004Passage(template:string){return template.replace(/__\((\d)\)__/g,(_,n)=>`____(${n})____`);}
export function generateEng009Cp004QuestionV1(input:GenerateEng009Cp004Input){
 let pool=ENG009_CP004_BLANKS_V1;
 if(input.difficulty)pool=pool.filter(x=>x.blank.difficulty===input.difficulty);
 if(input.blankId)pool=pool.filter(x=>x.blank.id===input.blankId);
 if(input.passageId)pool=pool.filter(x=>x.passage.id===input.passageId);
 if(!pool.length)throw new Error("No ENG-009 CP004 authority matches filters");
 const selected=pool[deterministicIndex(`${input.seed}:authority`,pool.length)]!,{passage,blank}=selected;
 const {options,correctOptionIndex}=place(input.seed,blank.answer,blank.distractors);
 return{questionId:`ENG-009-CP004-V1:${blank.id}:${hash(input.seed).toString(16)}`,stem:"Read the passage and select the most appropriate option to fill in the numbered blank.",passage:renderEng009Cp004Passage(passage.template),prompt:`Select the most appropriate option to fill in blank number ${blank.blankNo}.`,options,correctOptionIndex,explanation:`Answer: ${blank.answer}. ${blank.explanation}`,metadata:{chapterId:"ENG-009",cpId:"ENG-009-CP004",passageId:passage.id,blankId:blank.id,blankNo:blank.blankNo,kind:blank.kind,difficulty:blank.difficulty,clue:blank.clue,seed:input.seed,reviewOnly:true as const}};
}
export function generateEng009Cp004SetV1(seed:string,passageId?:string){
 const passages=passageId?ENG009_CP004_PASSAGES_V1.filter(x=>x.id===passageId):ENG009_CP004_PASSAGES_V1;
 if(!passages.length)throw new Error("Unknown ENG-009 CP004 passage");
 const passage=passages[deterministicIndex(`${seed}:passage`,passages.length)]!;
 return{passageId:passage.id,title:passage.title,passage:renderEng009Cp004Passage(passage.template),questions:passage.blanks.map(blank=>generateEng009Cp004QuestionV1({seed:`${seed}:${blank.id}`,blankId:blank.id}))};
}