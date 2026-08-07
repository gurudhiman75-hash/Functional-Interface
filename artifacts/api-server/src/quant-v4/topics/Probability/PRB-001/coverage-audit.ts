import { runPrb001Pipeline, listPrb001QuestionEntries, PRB_001_LIBRARIES } from "./index";
import { auditProbabilityQuestions, assertAutomatedBlockersZero } from "../shared/coverage-auditor";
const entries=listPrb001QuestionEntries(),questions=entries.map((entry)=>runPrb001Pipeline(entry.cpId as any,{questionLanguageId:entry.qlId,seed:`PRB-001:coverage:${entry.qlId}`}));const counters=auditProbabilityQuestions(questions,entries);assertAutomatedBlockersZero(counters);if(counters.questionCount!==120)throw new Error(`Expected 120 forced questions`);console.log(JSON.stringify(counters));
