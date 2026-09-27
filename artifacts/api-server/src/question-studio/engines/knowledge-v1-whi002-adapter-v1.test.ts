import { strict as assert } from "node:assert";
import { isWhi002QuestionStudioRequestV1, knowledgeV1Whi002QuestionStudioAdapterV1 } from "./knowledge-v1-whi002-adapter-v1";
import { generateQuestionStudioQuestions, listQuestionStudioPackages } from "../engine-registry";

async function run() {
  const packages = knowledgeV1Whi002QuestionStudioAdapterV1.listPackages();
  assert.ok(listQuestionStudioPackages().some((pkg) => pkg.packageId === "WHI-002"));
  assert.equal(packages.length, 1);
  assert.equal(packages[0]!.packageId, "WHI-002");
  assert.equal(packages[0]!.lifecycleStage, "REVIEW_ONLY");
  assert.equal(packages[0]!.questionBankWritable, false);
  assert.equal(packages[0]!.automaticStudentPublication, false);
  assert.equal(packages[0]!.productionReleaseAuthorized, false);
  assert.deepEqual(packages[0]!.supportedLanguages, ["en", "hi", "pa"]);
  assert.equal(packages[0]!.metadata!.localizationStatus, "REVIEW_REQUIRED");

  for (const language of ["en", "hi", "pa"] as const) {
    const routed = await generateQuestionStudioQuestions({ packageId: "WHI-002", language, count: 5, seed: `whi002-registry-route-${language}` });
    assert.equal(routed.engineId, "knowledge-v1");
    assert.equal(routed.questions.length, 5);
    assert.ok(routed.questions.every((q) => q.cpId === "WHI-001-CP002" && q.language === language));
    assert.ok(routed.questions.every((q) => q.reviewOnly === true && q.productionReleased === false));
    assert.equal(routed.generationContext!.localizationStatus, "REVIEW_REQUIRED");
  }

  const counts = new Map<string, number>();
  for (const [difficulty, expected] of [["Easy", 18], ["Medium", 30], ["Hard", 12]] as const) {
    const result = await knowledgeV1Whi002QuestionStudioAdapterV1.generate({ packageId: "WHI-002", language: "en", count: expected, difficulty, seed: `whi002-${difficulty}` });
    counts.set(difficulty, result.generationContext!.candidateCount as number);
    assert.ok(result.questions.every((q) => q.difficulty === difficulty));
    assert.equal(result.questions.length, expected);
  }
  assert.deepEqual(Object.fromEntries(counts), { Easy: 18, Medium: 30, Hard: 12 });

  const one = await knowledgeV1Whi002QuestionStudioAdapterV1.generate({ packageId: "WHI-002", language: "en", count: 1, patternId: "WHI-CP002-Q055", seed: "whi002-selector" });
  assert.equal(one.questions[0]!.questionId, "WHI-CP002-Q055");
  assert.equal(one.questions[0]!.reviewOnly, true);
  assert.equal(one.questions[0]!.productionReleased, false);
  assert.equal(one.questions[0]!.sourceIds instanceof Array, true);

  const hiOne = await knowledgeV1Whi002QuestionStudioAdapterV1.generate({ packageId: "WHI-002", language: "hi", count: 1, patternId: "WHI-CP002-Q055", seed: "whi002-hi-selector" });
  assert.equal(hiOne.questions[0]!.sourceQuestionId, "WHI-CP002-Q055");
  assert.equal(hiOne.questions[0]!.questionId, "WHI-CP002-Q055-HI");
  assert.equal(hiOne.questions[0]!.language, "hi");
  assert.equal(hiOne.questions[0]!.localizationStatus, "REVIEW_REQUIRED");

  const paOne = await knowledgeV1Whi002QuestionStudioAdapterV1.generate({ packageId: "WHI-002", language: "pa", count: 1, questionLanguageId: "WHI-CP002-Q055", seed: "whi002-pa-selector" });
  assert.equal(paOne.questions[0]!.sourceQuestionId, "WHI-CP002-Q055");
  assert.equal(paOne.questions[0]!.questionId, "WHI-CP002-Q055-PA");
  assert.equal(paOne.questions[0]!.language, "pa");
  assert.equal(paOne.questions[0]!.localizationStatus, "REVIEW_REQUIRED");

  assert.equal(isWhi002QuestionStudioRequestV1({ packageId: "WHI-002" }), true);
  assert.equal(isWhi002QuestionStudioRequestV1({ patternId: "WHI-CP002-Q055" }), true);
  assert.equal(isWhi002QuestionStudioRequestV1({ topic: "World History" }), false);
  await assert.rejects(() => knowledgeV1Whi002QuestionStudioAdapterV1.generate({ packageId: "WHI-002", count: 51 }), /between 1 and 50/);
}
void run();
