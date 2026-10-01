import assert from "node:assert/strict";
import { generateVen001QuestionStudioBatch } from "./question-studio-integration.ts";
import { generateVen001NextCheckpointBatch } from "./ven-001-next-checkpoints.ts";

const assignmentLeak = /(?:^|[;,.।])\s*[ABC]\s*=|\bA\s*=|\bB\s*=|\bC\s*=/u;
const symbolicQuestionLeak = /relationship among A, B and C|A, B और C|A, B ਅਤੇ C/iu;

let checked = 0;
for (const language of ["en", "hi", "pa"] as const) {
  for (const cp of ["VEN-CP001", "VEN-CP002"] as const) {
    const result = generateVen001NextCheckpointBatch({
      packageId: "VEN-001",
      patternId: cp,
      language,
      count: 4,
      seed: `ven-logical-editorial:${cp}:${language}`,
    });
    for (const question of result.questions) {
      const stem = String(question.stem);
      assert.doesNotMatch(stem, assignmentLeak, `${cp}/${language}: A/B/C assignment leaked into learner stem`);
      assert.doesNotMatch(stem, symbolicQuestionLeak, `${cp}/${language}: symbolic A/B/C question leaked`);
      assert.ok(stem.length > 30);
      checked += 1;
    }
  }

  const direct = generateVen001QuestionStudioBatch({
    packageId: "VEN-001",
    patternId: "VEN-CP003-DIRECT",
    language,
    count: 8,
    seed: `ven-cp003-editorial:${language}`,
  });
  for (const question of direct.questions) {
    const stem = String(question.stem);
    assert.doesNotMatch(stem, assignmentLeak, `VEN-CP003/${language}: A/B/C assignment leaked into learner stem`);
    assert.doesNotMatch(stem, symbolicQuestionLeak, `VEN-CP003/${language}: symbolic A/B/C question leaked`);
    assert.ok(stem.length > 30);
    checked += 1;
  }
}

console.log(JSON.stringify({
  status: "PASS_VEN_001_LOGICAL_STEM_EDITORIAL_AUDIT_V1",
  checkedQuestions: checked,
  checkpoints: ["VEN-CP001", "VEN-CP002", "VEN-CP003"],
  languages: ["en", "hi", "pa"],
  symbolicAssignmentsInLearnerStems: 0,
}, null, 2));
