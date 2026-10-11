/** Source review models; these candidates do not carry student release approval. */
export type SubsetMode = "nonemptyDistinct" | "eachDistinctCategory" | "boundedIdentical" | "optionalQuestions" | "atMostDistinct";
export const subsetModes: SubsetMode[] = ["nonemptyDistinct","eachDistinctCategory","boundedIdentical","optionalQuestions","atMostDistinct"];
export interface SubsetInput {mode:SubsetMode; counts:number[]; maximumSelected?:number; includeEmpty?:boolean;}
function valid(input:SubsetInput):void {
 if(!subsetModes.includes(input.mode) || input.counts.length<1 || input.counts.length>4 || input.counts.some(n=>!Number.isInteger(n)||n<1||n>18) || input.counts.reduce((a,b)=>a+b,0)>20) throw new Error("Expected 1–4 positive category counts with total at most 20");
 if(input.mode==="optionalQuestions" && input.counts.length!==2) throw new Error("Expected [questions, choices per question]");
 if(input.mode==="atMostDistinct" && (!Number.isInteger(input.maximumSelected)||input.maximumSelected!<1||input.maximumSelected!>input.counts[0])) throw new Error("Invalid selection limit");
}
function choose(n:number,r:number):number {let c=1;for(let i=1;i<=r;i++) c=c*(n-i+1)/i;return Math.round(c);}
export function solveSubset(input:SubsetInput):{answer:number;steps:string[]} {
 valid(input);const n=input.counts.reduce((a,b)=>a+b,0), {counts,mode}=input;
 switch(mode) {
 case "nonemptyDistinct":return {answer:2**n-1,steps:[`Each of the ${n} different items is either selected or left out.`,`Total selections = 2^${n} = ${2**n}.`,`Remove the empty selection: ${2**n} − 1 = ${2**n-1}.`]};
 case "eachDistinctCategory": {const factors=counts.map(c=>2**c-1),answer=factors.reduce((a,b)=>a*b,1);return {answer,steps:counts.map((c,i)=>`Category ${i+1}: 2^${c} − 1 = ${factors[i]} non-empty selections.`).concat(`Multiply independent category selections: ${factors.join(' × ')} = ${answer}.`)};}
 case "boundedIdentical": {const answer=counts.reduce((a,b)=>a*(b+1),1)-1;return {answer,steps:counts.map((c,i)=>`Type ${i+1}: choose 0 through ${c} items, giving ${c+1} choices.`).concat(`Remove the all-zero choice: ${counts.map(c=>c+1).join(' × ')} − 1 = ${answer}.`)};}
 case "optionalQuestions": {const [q,c]=counts,answer=(c+1)**q-1;return {answer,steps:[`For each question, choose one of ${c} alternatives or leave it unanswered: ${c+1} choices.`,`For ${q} questions: ${c+1}^${q} = ${(c+1)**q}.`,`Remove the case in which every question is left unanswered: ${answer}.`]};}
 case "atMostDistinct": {const start=input.includeEmpty?0:1,terms=Array.from({length:input.maximumSelected!-start+1},(_,i)=>choose(counts[0],i+start)),answer=terms.reduce((a,b)=>a+b,0);return {answer,steps:[`Allowed selection sizes: ${start} through ${input.maximumSelected}.`,`Add disjoint size cases: ${terms.join(' + ')} = ${answer}.`,input.includeEmpty?'The empty selection is included.':'The empty selection is excluded.']};}
 }
}
/** Counts choices directly: binary membership, quantity vectors or question outcomes. */
export function verifySubset(input:SubsetInput):number {
 valid(input);const {mode,counts}=input;
 if(mode==="boundedIdentical" || mode==="optionalQuestions") {
  const limits=mode==="boundedIdentical"?counts:Array(counts[0]).fill(counts[1]);
  let total=0;
  function visit(index:number,used:boolean):void {if(index===limits.length){if(used)total++;return;}for(let value=0;value<=limits[index];value++)visit(index+1,used||value>0);}
  visit(0,false);return total;
 }
 const n=mode==="atMostDistinct"?counts[0]:counts.reduce((a,b)=>a+b,0);let total=0;
 for(let mask=input.includeEmpty?0:1;mask<2**n;mask++) {
  let selected=0,offset=0,allPresent=true;
  for(const count of (mode==="atMostDistinct"?[n]:counts)) {
   let present=false;
   for(let j=0;j<count;j++) if(mask & (1<<(offset+j))){selected++;present=true;}
   allPresent=allPresent&&present;offset+=count;
  }
  if(mode==="atMostDistinct" ? selected<=input.maximumSelected! : mode!=="eachDistinctCategory" || allPresent)total++;
 }
 return total;
}
export function buildSubsetReview(input:SubsetInput) {
 const solved=solveSubset(input),n=input.counts.reduce((a,b)=>a+b,0);
 const stem=input.mode==="nonemptyDistinct"?`In how many ways can at least one item be selected from ${n} different items?`
 :input.mode==="eachDistinctCategory"?`A library has ${input.counts.map((c,i)=>`${c} different books in category ${i+1}`).join(', ')}. In how many ways can books be selected with at least one from every category?`
 :input.mode==="boundedIdentical"?`A shop has ${input.counts.map((c,i)=>`${c} identical items of type ${i+1}`).join(', ')}. In how many ways can at least one item be selected?`
 :input.mode==="optionalQuestions"?`A paper has ${input.counts[0]} questions, each with ${input.counts[1]} alternatives. A student may answer one alternative per question or leave that question unanswered. In how many ways can at least one question be answered?`
 :`In how many ways can ${input.includeEmpty?'at most':'at least one and at most'} ${input.maximumSelected} items be selected from ${input.counts[0]} different items${input.includeEmpty?', including the empty selection':''}?`;
 const values=[solved.answer];
 const candidates=input.mode==="optionalQuestions" ? [input.counts[1]**input.counts[0], solved.answer+1, solved.answer-input.counts[0]]
  : input.mode==="boundedIdentical" ? [2**n-1,solved.answer+1,input.counts.reduce((a,b)=>a*b,1)]
  : [solved.answer+1,2**n-1,choose(n,Math.min(n,input.maximumSelected??2)),solved.answer-1];
 for(const value of [...candidates,solved.answer+2,solved.answer+3,solved.answer+4]) {
  if(value>=0 && Number.isSafeInteger(value) && !values.includes(value))values.push(value);
  if(values.length===4)break;
 }
 const correctIndex=(n+subsetModes.indexOf(input.mode))%4;
 [values[0],values[correctIndex]]=[values[correctIndex],values[0]];
 return {packageId:"PNC-SOURCE-SUBSET-REVIEW",mode:input.mode,stem,options:values.map(String),correctIndex,answer:String(solved.answer),explanation:solved.steps,independentAnswer:verifySubset(input),publiclyPublishable:false,reviewStatus:"REVIEW_REQUIRED",language:"en"};
}
