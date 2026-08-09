import { runPrb001Pipeline, listPrb001QuestionEntries, PRB_001_LIBRARIES } from "./index";
import { auditProbabilityQuestions, assertAutomatedBlockersZero } from "../shared/coverage-auditor";
const entries=listPrb001QuestionEntries(),questions=Array.from({length:1500},(_,index)=>{const entry=entries[index%entries.length]!;return runPrb001Pipeline(entry.cpId as any,{questionLanguageId:entry.qlId,seed:`PRB-001:residual:${index}`});});const counters=auditProbabilityQuestions(questions,entries);assertAutomatedBlockersZero(counters);console.log(JSON.stringify(counters));
