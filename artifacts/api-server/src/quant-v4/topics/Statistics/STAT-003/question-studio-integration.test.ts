import {
  generateQuestionStudioQuestions,
  listQuestionStudioPackages,
  resolveQuestionStudioEngine,
} from "../../../../question-studio/engine-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const pkg = listQuestionStudioPackages().find((entry) => entry.packageId === "STAT-003");
assert(pkg, "Question Studio package discovery is missing STAT-003.");
assert(pkg.engineId === "quant-v4", "STAT-003 must be owned by the Quant V4 Question Studio engine.");
assert(pkg.enabled === true, "STAT-003 controlled-review package must be discoverable in Question Studio.");
assert(pkg.questionBankWritable === false, "STAT-003 must remain non-writable to Question Bank.");
assert(pkg.testEligible === false, "STAT-003 must remain test-ineligible.");
assert(pkg.mockTestEligible === false, "STAT-003 must remain mock-test-ineligible.");
assert(pkg.publiclyPublishable === false, "STAT-003 must remain publicly locked.");
assert(pkg.automaticStudentPublication === false, "STAT-003 must remain automatic-publication locked.");
assert(pkg.productionReleaseAuthorized === false, "STAT-003 must remain production-release locked.");
assert(resolveQuestionStudioEngine({ packageId: "STAT-003" }).engineId === "quant-v4", "STAT-003 did not resolve to Quant V4.");

const result = await generateQuestionStudioQuestions({
  packageId: "STAT-003",
  language: "en",
  count: 16,
  seed: "STAT-003-QS-INTEGRATION",
});

assert(result.engineId === "quant-v4", "STAT-003 generation returned the wrong engine id.");
assert(result.questions.length === 16, "STAT-003 Question Studio did not return the requested count.");
const qls = new Set(result.questions.map((question) => String(question.questionLanguageId ?? question.permanentQlId ?? "")));
for (let index = 13; index <= 20; index += 1) {
  const qlId = `STAT-QL-${String(index).padStart(3, "0")}`;
  assert(qls.has(qlId), `STAT-003 mixed controlled-review generation did not exercise ${qlId}.`);
}

for (const question of result.questions) {
  assert(Array.isArray(question.options) && question.options.length === 4, "STAT-003 review question must have four options.");
  assert(new Set(question.options as unknown[]).size === 4, "STAT-003 review options must be unique.");
  assert(question.questionBankWritable === false, "Generated STAT-003 question weakened Question Bank lock.");
  assert(question.testEligible === false, "Generated STAT-003 question weakened test lock.");
  assert(question.mockTestEligible === false, "Generated STAT-003 question weakened mock lock.");
  assert(question.publiclyPublishable === false, "Generated STAT-003 question weakened publication lock.");
  assert(question.automaticStudentPublication === false, "Generated STAT-003 question weakened automatic publication lock.");
  assert(question.productionReleaseAuthorized === false, "Generated STAT-003 question weakened production-release lock.");
  const explanation = String(question.explanation ?? "");
  assert(explanation.length >= 80, "STAT-003 learner explanation is unexpectedly shallow.");
  assert(!/Shortcut:|Common trap:/iu.test(explanation), "STAT-003 learner explanation leaked generic shortcut/trap boilerplate.");
}

const explicit = await generateQuestionStudioQuestions({
  packageId: "STAT-003",
  questionLanguageId: "STAT-QL-020",
  language: "en",
  count: 2,
  seed: "STAT-003-QS-HARD",
});
assert(explicit.questions.every((question) => question.questionLanguageId === "STAT-QL-020" && question.difficulty === "Hard"), "STAT-QL-020 explicit generation drifted from its permanent Hard contract.");

console.log(JSON.stringify({
  status: "PASS_STAT_003_QUESTION_STUDIO_INTEGRATION",
  packageId: "STAT-003",
  permanentQlCount: qls.size,
  generated: result.questions.length,
  lifecycle: "CONTROLLED_REVIEW_ONLY",
}));
