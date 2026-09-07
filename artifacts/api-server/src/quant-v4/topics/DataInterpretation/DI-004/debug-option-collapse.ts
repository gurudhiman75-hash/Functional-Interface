import { generateDi004LineSet } from "./index";

const seed = "DI-004-PHASE3-42";
const ssc = generateDi004LineSet({ seed, examProfile: "SSC_CGL_TIER_I" });
console.log(JSON.stringify({ seed, stimulus: ssc.stimulus, questions: ssc.questions.map((question) => ({
  kind: question.kind,
  answer: question.answer,
  evidence: question.evidence,
  optionMetadata: question.optionMetadata,
})) }));

generateDi004LineSet({ seed, examProfile: "BANKING_PRELIMS" });
console.log("PASS_DI_004_FAILING_STATE_DEBUG");
