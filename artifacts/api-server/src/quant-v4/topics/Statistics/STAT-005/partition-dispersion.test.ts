import { generateStat005Question, generateStat005QuestionStudioBatch, solveStat005State } from "./partition-dispersion";
import { STAT005_PERMANENT_QLS } from "./permanent-ql-registry";
import { STAT005_CONTRACTS, type Stat005ExamProfile } from "./types";

function assert(ok: unknown, message: string): asserts ok { if (!ok) throw new Error(message); }
const profiles: readonly Stat005ExamProfile[] = ["SSC_CGL_TIER_II", "SSC_CGL_JSO"];
let generated = 0;
for (const profile of profiles) for (const contractId of STAT005_CONTRACTS) for (let seedIndex = 0; seedIndex < 25; seedIndex += 1) {
  const seed = `STAT-005-PROOF:${profile}:${contractId}:${seedIndex}`;
  const question = generateStat005Question({ seed, examProfile: profile, contractId });
  const replay = generateStat005Question({ seed, examProfile: profile, contractId });
  assert(JSON.stringify(question) === JSON.stringify(replay), `Deterministic replay failed for ${seed}.`);
  assert(!/^\\s*(?:Find|Calculate|Determine|Use|Using|Select|Choose|Compute|Evaluate|Identify|Tally)\\b/im.test(question.stem)
    && !/\\b(?:use|using)\\b[^.\\n]*\\b(?:find|calculate|determine)\\b/i.test(question.stem),
  `Learner-facing stem contains procedural instructions for ${seed}: ${question.stem}`);
  assert(question.options.length === 4 && new Set(question.options).size === 4, `Options are not four unique values for ${seed}.`);
  assert(question.options[question.correctIndex] === question.answer, `Answer index mismatch for ${seed}.`);
  assert(String(Math.round(solveStat005State(question.state, contractId) * 100) / 100) === question.answer,
    `Independent state solver disagrees for ${seed}.`);
  assert(question.questionBankWritable === false && question.testEligible === false && question.mockTestEligible === false
    && question.publiclyPublishable === false && question.automaticStudentPublication === false && question.productionReleaseAuthorized === false,
  `Lifecycle lock weakened for ${seed}.`);
  generated += 1;
}
for (const contractId of ["QUARTILE_FROM_DISCRETE_FREQUENCY", "QUARTILE_FROM_GROUPED_DATA"] as const) {
  const question = generateStat005Question({ seed: "STAT-005-TABLE-HEADER-CHECK", examProfile: "SSC_CGL_JSO", contractId });
  assert(!question.stem.includes("\nValue | Frequency\n| Value | Frequency |"), "Discrete table header is duplicated.");
  assert(!question.stem.includes("\nClass interval | Frequency\n| Class interval | Frequency |"), "Grouped table header is duplicated.");
}
const batch = generateStat005QuestionStudioBatch({ packageId: "STAT-005", seed: "STAT-005-STUDIO-PROOF", count: STAT005_CONTRACTS.length, language: "en", examProfile: "SSC_CGL_JSO" });
assert(batch.questions.length === STAT005_CONTRACTS.length, "Question Studio batch size drifted.");
assert(new Set(batch.questions.map((q) => q.qlId)).size === STAT005_CONTRACTS.length, "Question Studio batch missed permanent QLs.");
assert(batch.questions.every((q) => q.examProfile === "SSC_CGL_JSO" && q.questionBankWritable === false && q.testEligible === false),
  "Question Studio batch profile or lifecycle metadata drifted.");
assert(STAT005_PERMANENT_QLS.length === STAT005_CONTRACTS.length, "Permanent QL registry and contract list differ.");
console.log(JSON.stringify({ status: "PASS_STAT_005_PARTITION_DISPERSION", contracts: STAT005_CONTRACTS.length,
  profiles: profiles.length, generated, replayChecks: generated, optionSetsChecked: generated, questionStudioBatch: batch.questions.length,
  lifecycle: "CONTROLLED_REVIEW_ONLY" }));
