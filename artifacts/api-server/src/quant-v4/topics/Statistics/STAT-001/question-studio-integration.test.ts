import {
  generateQuestionStudioQuestions,
  listQuestionStudioPackages,
  resolveQuestionStudioEngine,
} from "../../../../question-studio/engine-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const pkg = listQuestionStudioPackages().find((entry) => entry.packageId === "STAT-001");
assert(pkg, "Question Studio package discovery is missing STAT-001.");
assert(pkg.engineId === "quant-v4", "STAT-001 must be owned by the Quant V4 Question Studio engine.");
assert(pkg.enabled === true, "STAT-001 review package must be discoverable in Question Studio.");
assert(pkg.questionBankWritable === false, "STAT-001 must remain non-writable to Question Bank.");
assert(pkg.testEligible === false, "STAT-001 must remain test-ineligible.");
assert(pkg.mockTestEligible === false, "STAT-001 must remain mock-test-ineligible.");
assert(pkg.publiclyPublishable === false, "STAT-001 must remain publicly locked.");
assert(pkg.automaticStudentPublication === false, "STAT-001 must remain automatic-publication locked.");
assert(resolveQuestionStudioEngine({ packageId: "STAT-001" }).engineId === "quant-v4", "STAT-001 did not resolve to Quant V4.");

const result = await generateQuestionStudioQuestions({
  packageId: "STAT-001",
  language: "en",
  count: 12,
  seed: "STAT-001-QS-INTEGRATION",
});

assert(result.engineId === "quant-v4", "STAT-001 generation returned the wrong engine id.");
assert(result.questions.length === 12, "STAT-001 Question Studio did not return the requested count.");
const qls = new Set(result.questions.map((question) => String(question.questionLanguageId ?? question.permanentQlId ?? "")));
for (let index = 1; index <= 6; index += 1) {
  const qlId = `STAT-QL-${String(index).padStart(3, "0")}`;
  assert(qls.has(qlId), `STAT-001 mixed review generation did not exercise ${qlId}.`);
}

for (const question of result.questions) {
  assert(Array.isArray(question.options) && question.options.length === 4, "STAT-001 review question must have four options.");
  assert(new Set(question.options as unknown[]).size === 4, "STAT-001 review options must be unique.");
  assert(question.questionBankWritable === false, "Generated STAT-001 question weakened Question Bank lock.");
  assert(question.testEligible === false, "Generated STAT-001 question weakened test lock.");
  assert(question.mockTestEligible === false, "Generated STAT-001 question weakened mock lock.");
  assert(question.publiclyPublishable === false, "Generated STAT-001 question weakened publication lock.");
  const explanation = String(question.explanation ?? "");
  assert(!/Shortcut:/iu.test(explanation), "STAT-001 learner explanation leaked shortcut boilerplate.");
  assert(!/Common trap:/iu.test(explanation), "STAT-001 learner explanation leaked trap boilerplate.");
}

console.log(JSON.stringify({
  status: "PASS_STAT_001_QUESTION_STUDIO_INTEGRATION",
  packageId: "STAT-001",
  permanentQlCount: qls.size,
  generated: result.questions.length,
  lifecycle: "REVIEW_ONLY",
}));
