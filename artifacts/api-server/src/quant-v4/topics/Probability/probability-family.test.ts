import { listPrb001QuestionEntries, runPrb001Pipeline } from "./PRB-001";
import { listPrb002QuestionEntries, runPrb002Pipeline } from "./PRB-002";
function assert(condition:unknown,message:string):asserts condition{if(!condition)throw new Error(message);}
const all=[...listPrb001QuestionEntries().map((entry)=>({entry,run:runPrb001Pipeline})),...listPrb002QuestionEntries().map((entry)=>({entry,run:runPrb002Pipeline}))];for(const {entry,run} of all){const q=run(entry.cpId as never,{questionLanguageId:entry.qlId,seed:`probability-family:${entry.qlId}`});assert(q.validation.valid,`${entry.qlId} failed`);assert(q.independentVerification.matched,`${entry.qlId} verifier failed`);}console.log(JSON.stringify({total:all.length,prb001:120,prb002:96}));
