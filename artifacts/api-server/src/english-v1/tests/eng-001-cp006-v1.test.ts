import { strict as assert } from "node:assert";

import { COMPARISON_RULES_V1 } from "../grammar/comparison";
import { CP006_SCENES_BY_DIFFICULTY_V4, CP006_SCENES_V4 } from "../chapters/error-spotting/ENG-001/CP006/cp006-catalog-v4";
import { generateEng001Cp006QuestionV1, rulesForDifficultyCp006V1 } from "../chapters/error-spotting/ENG-001/CP006/eng-001-cp006-v1";
import { assertValidEng001Cp006QuestionV1 } from "../chapters/error-spotting/ENG-001/CP006/eng-001-cp006-v1-validator";
import type { ComparisonRuleId, Eng001QlId, EnglishDifficulty } from "../core/types";

assert.equal(COMPARISON_RULES_V1.length, 10);
assert.equal(CP006_SCENES_V4.length, 60);
assert.equal(CP006_SCENES_BY_DIFFICULTY_V4.easy.length, 20);
assert.equal(CP006_SCENES_BY_DIFFICULTY_V4.medium.length, 20);
assert.equal(CP006_SCENES_BY_DIFFICULTY_V4.hard.length, 20);
assert.equal(new Set(CP006_SCENES_V4.map((scene) => scene.id)).size, 60);
assert.equal(new Set(CP006_SCENES_V4.map((scene) => scene.domain)).size >= 20, true);

const sourceAnswerCounts = [0, 0, 0, 0];
for (const scene of CP006_SCENES_V4) {
  const changedIndices = scene.correctSegments.reduce<number[]>((out, segment, index) => {
    if (segment !== scene.errorSegments[index]) out.push(index);
    return out;
  }, []);
  assert.equal(changedIndices.length, 1, `${scene.id} must change exactly one canonical segment`);
  assert.equal(changedIndices[0], scene.errorIndex, `${scene.id} changed segment must equal errorIndex`);
  sourceAnswerCounts[scene.errorIndex] += 1;
  const question = generateEng001Cp006QuestionV1({ seed: `scene:${scene.id}`, difficulty: scene.difficulty, qlId: "ENG-001-QL001", ruleId: scene.ruleId, sceneId: scene.id });
  assertValidEng001Cp006QuestionV1(question);
  assert.equal(question.metadata.candidateId, `CMP-V1:${scene.id}`);
  assert.equal(question.metadata.reviewOnly, true);
  assert.equal(question.correctOptionIndex, scene.errorIndex);
}
for (const [index, count] of sourceAnswerCounts.entries()) {
  assert.equal(count >= 8, true, `CP006 authored QL001 Part ${String.fromCharCode(65 + index)} frequency is too low: ${count}`);
  assert.equal(count <= 24, true, `CP006 authored QL001 Part ${String.fromCharCode(65 + index)} frequency is too high: ${count}`);
}

const difficulties: readonly EnglishDifficulty[] = ["easy", "medium", "hard"];
const qls: readonly Eng001QlId[] = ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"];

for (const difficulty of difficulties) {
  const surfaces = new Set<string>();
  const rules = new Set<string>();
  const domains = new Set<string>();
  for (let index = 0; index < 3000; index += 1) {
    const seed = `cp006:${difficulty}:stress:${index}`;
    const question = generateEng001Cp006QuestionV1({ seed, difficulty });
    const replay = generateEng001Cp006QuestionV1({ seed, difficulty });
    assert.deepEqual(question, replay);
    assertValidEng001Cp006QuestionV1(question);
    assert.equal(question.metadata.cpId, "ENG-001-CP006");
    assert.equal(question.metadata.reviewOnly, true);
    surfaces.add(question.segments.join(" | "));
    rules.add(String(question.metadata.ruleId));
    const sceneId = question.metadata.candidateId.replace(/^CMP-V1:/, "");
    const scene = CP006_SCENES_V4.find((entry) => entry.id === sceneId)!;
    domains.add(scene.domain);
  }
  assert.equal(surfaces.size >= 15, true, `${difficulty} surface diversity too low`);
  assert.equal(rules.size >= 5, true, `${difficulty} rule diversity too low`);
  assert.equal(domains.size >= 10, true, `${difficulty} domain diversity too low`);
}

for (const difficulty of difficulties) {
  for (const ruleId of rulesForDifficultyCp006V1(difficulty)) {
    for (const qlId of qls) {
      const question = generateEng001Cp006QuestionV1({ seed: `matrix:${difficulty}:${ruleId}:${qlId}`, difficulty, qlId, ruleId: ruleId as ComparisonRuleId });
      assertValidEng001Cp006QuestionV1(question);
      assert.equal(question.metadata.ruleId, ruleId);
      assert.equal(question.metadata.qlId, qlId);
      assert.equal(question.metadata.difficulty, difficulty);
      if (qlId === "ENG-001-QL007") assert.equal(question.metadata.hasNoError, true);
    }
  }
}

const ql002AnswerLabels = new Set<string>();
for (const scene of CP006_SCENES_V4) {
  for (let variant = 0; variant < 8; variant += 1) {
    const q2 = generateEng001Cp006QuestionV1({
      seed: `answer-balance:ql002:${scene.id}:${variant}`,
      difficulty: scene.difficulty,
      qlId: "ENG-001-QL002",
      ruleId: scene.ruleId,
      sceneId: scene.id,
    });
    ql002AnswerLabels.add(q2.metadata.answerSegment);
  }
}
assert.deepEqual([...ql002AnswerLabels].sort(), ["A", "B", "C"]);

console.log(JSON.stringify({
  status: "PASS_ENG_001_CP006_V1",
  scenes: CP006_SCENES_V4.length,
  byDifficulty: Object.fromEntries(difficulties.map((difficulty) => [difficulty, CP006_SCENES_BY_DIFFICULTY_V4[difficulty].length])),
  rules: COMPARISON_RULES_V1.length,
  ql001SourceAnswerCounts: { A: sourceAnswerCounts[0], B: sourceAnswerCounts[1], C: sourceAnswerCounts[2], D: sourceAnswerCounts[3] },
  ql002AnswerLabels: [...ql002AnswerLabels].sort(),
}, null, 2));
