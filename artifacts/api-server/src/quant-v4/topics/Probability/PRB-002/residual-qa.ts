import { runPrb002Pipeline, listPrb002QuestionEntries, PRB_002_LIBRARIES } from "./index";
import { auditProbabilityQuestions, assertAutomatedBlockersZero } from "../shared/coverage-auditor";
const entries=listPrb002QuestionEntries(),questions=Array.from({length:1500},(_,index)=>{const entry=entries[index%entries.length]!;return runPrb002Pipeline(entry.cpId as any,{questionLanguageId:entry.qlId,seed:`PRB-002:residual:${index}`});});const counters=auditProbabilityQuestions(questions,entries);assertAutomatedBlockersZero(counters);console.log(JSON.stringify(counters));
