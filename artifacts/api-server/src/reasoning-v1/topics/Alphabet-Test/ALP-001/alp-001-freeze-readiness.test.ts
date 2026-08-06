import { ALP_001_CHECKPOINTS, ALP_001_QLS } from "./ql-registry";
import { generateAlp001Question } from "./runtime";
import type { AlpLocale } from "./types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function learnerText(question: ReturnType<typeof generateAlp001Question>): string {
  return [
    question.stem,
    question.explanation.coreConcept,
    question.explanation.ruleStatement,
    ...question.explanation.steps,
    ...question.explanation.visualWorking,
    question.explanation.examShortcut,
    question.explanation.conclusion,
    ...question.explanation.distractorAnalyses.map((analysis) => analysis.explanation),
  ].join("\n");
}

const locales: readonly AlpLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const expectedQlIds = Array.from(
  { length: 156 },
  (_, index) => `ALP-QL-${String(index + 1).padStart(3, "0")}`,
);
const actualQlIds = ALP_001_QLS.map((ql) => ql.qlId);

assert(ALP_001_QLS.length === 156, `Expected 156 QLs, found ${ALP_001_QLS.length}.`);
assert(new Set(actualQlIds).size === 156, "ALP-001 QL identities are not unique.");
assert(JSON.stringify(actualQlIds) === JSON.stringify(expectedQlIds), "ALP-001 QL identities are not continuous from 001 through 156.");
assert(ALP_001_CHECKPOINTS.length === 10, `Expected 10 checkpoints, found ${ALP_001_CHECKPOINTS.length}.`);
assert(ALP_001_CHECKPOINTS.reduce((total, checkpoint) => total + checkpoint.qlCount, 0) === 156, "Checkpoint QL totals do not equal 156.");
assert(ALP_001_QLS.every((ql) => ql.status === "IMPLEMENTED"), "A QL was marked frozen before explicit editorial approval.");

const rejectedInternal = /ALP_|COMPLETION_TRAP_|WORD_TRANSFORM_|ALPHA_TRANSFORM_|undefined|null|\{\{|\}\}/;
const rejectedLanguage = /माँगी श्रेणी|ਮੰਗੀ ਸ਼੍ਰੇਣੀ|ਪਦ|ਸਾਦ੍ਰਿਸ਼ਤਾ|ਸਦ੍ਰਿਸ਼ਤਾ/;
const rejectedRawTransform = /\b(?:ASC|DESC|REV|SWAP|VOWEL_SHIFT|CONSONANT_SHIFT)\b/;
let generated = 0;
let completionTrapChecks = 0;
let optionOnlyChecks = 0;

for (const ql of ALP_001_QLS) {
  for (const locale of locales) {
    const question = generateAlp001Question(ql.qlId, 0, locale);
    generated += 1;

    assert(question.metadata.runtimeVersion === "ALP-001-RUNTIME-V3", `${ql.qlId} ${locale} runtime version drift.`);
    assert(question.explanation.schemaVersion === "ALP-001-PEDAGOGY-V2", `${ql.qlId} ${locale} pedagogy schema drift.`);
    assert(question.options.length === 4, `${ql.qlId} ${locale} does not have four options.`);
    assert(new Set(question.options.map((option) => option.value)).size === 4, `${ql.qlId} ${locale} has duplicate options.`);
    assert(question.options[question.correctIndex]?.value === question.answer, `${ql.qlId} ${locale} answer/index mismatch.`);
    assert(question.explanation.conclusion.includes(question.answer), `${ql.qlId} ${locale} conclusion omits the answer.`);
    assert(question.explanation.distractorAnalyses.length === 3, `${ql.qlId} ${locale} does not explain all three wrong options.`);

    for (const analysis of question.explanation.distractorAnalyses) {
      assert(question.options[analysis.optionIndex]?.value === analysis.optionValue, `${ql.qlId} ${locale} trap/option mismatch.`);
      assert(analysis.explanation.includes(analysis.optionValue), `${ql.qlId} ${locale} trap omits its displayed option.`);
      if (Number(ql.checkpointId.slice(-3)) >= 6) {
        completionTrapChecks += 1;
        assert(analysis.explanation.includes(question.answer), `${ql.qlId} ${locale} completion trap omits the verified answer.`);
      }
    }

    const text = learnerText(question);
    assert(!rejectedInternal.test(text), `${ql.qlId} ${locale} leaks an internal identifier.`);
    assert(!rejectedLanguage.test(text), `${ql.qlId} ${locale} retains blocked literal terminology.`);
    if (Number(ql.checkpointId.slice(-3)) >= 6) {
      assert(!rejectedRawTransform.test(text), `${ql.qlId} ${locale} exposes a raw transform code.`);
      assert(!/^Given\b.*\bFirst\b.*\bthen\b/i.test(question.stem), `${ql.qlId} ${locale} retains a procedural synthetic stem.`);
    }

    if (ql.solveMode === "IDENTIFY_WORD_BY_ALPHA_PAIR_COUNT") {
      optionOnlyChecks += 1;
      assert(!question.structuredPrompt.sequence?.length, `${ql.qlId} ${locale} leaks the source sequence.`);
      assert(!question.structuredPrompt.word, `${ql.qlId} ${locale} leaks the source word.`);
      assert(!/exactly 1 pairs/i.test(question.stem), `${ql.qlId} ${locale} retains singular/plural grammar error.`);
      assert(question.explanation.steps.some((step) => step.includes(question.answer)), `${ql.qlId} ${locale} worked solution omits the chosen option.`);
      assert(question.explanation.visualWorking.some((line) => line.includes(question.answer)), `${ql.qlId} ${locale} visual proof omits the chosen option.`);
    }
  }
}

assert(generated === 468, `Expected 468 readiness samples, generated ${generated}.`);
assert(completionTrapChecks === 468, `Expected 468 advanced trap checks, found ${completionTrapChecks}.`);
assert(optionOnlyChecks === 3, `Expected three locale checks for ALP-QL-109, found ${optionOnlyChecks}.`);

console.log("ALP-001 technical freeze-readiness guard passed.", {
  verdict: "TECHNICALLY_READY_AWAITING_EXPLICIT_EDITORIAL_APPROVAL",
  qlCount: ALP_001_QLS.length,
  checkpointCount: ALP_001_CHECKPOINTS.length,
  generated,
  completionTrapChecks,
  optionOnlyChecks,
  lifecycle: {
    qlStatus: "IMPLEMENTED",
    questionStudio: "CHAPTER_LOCAL_ONLY",
    questionBank: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  },
});
