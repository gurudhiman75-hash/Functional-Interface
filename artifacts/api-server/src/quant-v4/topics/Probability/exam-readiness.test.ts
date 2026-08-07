import { listPrb001QuestionEntries, runPrb001Pipeline } from "./PRB-001";
import { listPrb002QuestionEntries, runPrb002Pipeline } from "./PRB-002";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

const badStem = /\b[A-Z]+(?:_[A-Z]+)+\b|\btyped event\b|\bwhen applicable\b|\busing target\b|\b(?:objective|outcome-based|event-based|selection-based|counting-based|multi-stage|classical|structured)\s+(?:problem|question|exercise|scenario|task|item|drill|case|example|experiment|setup|model)\b/i;
const badExplanation = /typed event|independent check|permitted range|generated parameter|review trail|publication|validator|renderer|fingerprint/i;

let questions = 0, explanationWords = 0, fourOptionQuestions = 0, fiveOptionQuestions = 0;
for (const entry of listPrb001QuestionEntries()) {
  const question = runPrb001Pipeline(entry.cpId as any, { questionLanguageId: entry.qlId, seed: `editorial:${entry.qlId}` });
  assert(question.validation.valid, `${entry.qlId}: ${question.validation.checks.filter((item) => !item.passed).map((item) => item.name).join(", ")}`);
  assert(!badStem.test(question.stem), `${entry.qlId}: artificial stem language`);
  assert(!badExplanation.test(question.explanation.lines.join(" ")), `${entry.qlId}: QA language leaked into explanation`);
  assert(question.explanation.wordCount <= 105, `${entry.qlId}: explanation is too long`);
  questions += 1; explanationWords += question.explanation.wordCount;
  if (question.options.length === 4) fourOptionQuestions += 1; else if (question.options.length === 5) fiveOptionQuestions += 1;
}
for (const entry of listPrb002QuestionEntries()) {
  const question = runPrb002Pipeline(entry.cpId as any, { questionLanguageId: entry.qlId, seed: `editorial:${entry.qlId}` });
  assert(question.validation.valid, `${entry.qlId}: ${question.validation.checks.filter((item) => !item.passed).map((item) => item.name).join(", ")}`);
  assert(!badStem.test(question.stem), `${entry.qlId}: artificial stem language`);
  assert(!badExplanation.test(question.explanation.lines.join(" ")), `${entry.qlId}: QA language leaked into explanation`);
  assert(question.explanation.wordCount <= 105, `${entry.qlId}: explanation is too long`);
  questions += 1; explanationWords += question.explanation.wordCount;
  if (question.options.length === 4) fourOptionQuestions += 1; else if (question.options.length === 5) fiveOptionQuestions += 1;
}

const ssc = runPrb001Pipeline("PRB-CP-001", { examProfile: "SSC_CGL_CHSL", seed: "profile:ssc" });
const bank = runPrb001Pipeline("PRB-CP-001", { examProfile: "BANKING_PRELIMS", seed: "profile:bank" });
const jso = runPrb002Pipeline("PRB-CP-007", { examProfile: "SSC_CGL_JSO", seed: "profile:jso" });
const bankMains = runPrb002Pipeline("PRB-CP-007", { examProfile: "BANKING_MAINS", seed: "profile:bank-mains" });
assert(ssc.options.length === 4, "SSC profile must have four options");
assert(bank.options.length === 5, "Banking profile must have five options");
assert(jso.options.length === 4, "SSC JSO profile must have four options");
assert(bankMains.options.length === 5, "Banking mains profile must have five options");

console.log(JSON.stringify({
  questions,
  averageExplanationWords: Math.round((explanationWords / questions) * 10) / 10,
  fourOptionQuestions,
  fiveOptionQuestions,
  profiles: { ssc: ssc.examProfile, bank: bank.examProfile, jso: jso.examProfile, bankMains: bankMains.examProfile },
}));
