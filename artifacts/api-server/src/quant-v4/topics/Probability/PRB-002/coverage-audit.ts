import { runPrb002Pipeline, listPrb002QuestionEntries, PRB_002_LIBRARIES } from "./index";
import { auditProbabilityQuestions, assertAutomatedBlockersZero } from "../shared/coverage-auditor";
const entries=listPrb002QuestionEntries(),questions=entries.map((entry)=>runPrb002Pipeline(entry.cpId as any,{questionLanguageId:entry.qlId,seed:`PRB-002:coverage:${entry.qlId}`}));const counters=auditProbabilityQuestions(questions,entries);assertAutomatedBlockersZero(counters);if(counters.questionCount!==96)throw new Error(`Expected 96 forced questions`);console.log(JSON.stringify(counters));
