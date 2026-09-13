import { strict as assert } from "node:assert";
import { NOUN_QUANTIFIER_RULES_V1 } from "../grammar/nouns-quantifiers";
import { CP008_SCENES_BY_DIFFICULTY_V2, CP008_SCENES_V2 } from "../chapters/error-spotting/ENG-001/CP008/cp008-catalog-v2";
import { generateEng001Cp008QuestionV1, rulesForDifficultyCp008V1 } from "../chapters/error-spotting/ENG-001/CP008/eng-001-cp008-v1";
import { assertValidEng001Cp008QuestionV1 } from "../chapters/error-spotting/ENG-001/CP008/eng-001-cp008-v1-validator";
import type { Eng001QlId, EnglishDifficulty, NounQuantifierRuleId } from "../core/types";

assert.equal(NOUN_QUANTIFIER_RULES_V1.length, 10);
assert.equal(CP008_SCENES_V2.length, 60);
assert.equal(CP008_SCENES_BY_DIFFICULTY_V2.easy.length, 20);
assert.equal(CP008_SCENES_BY_DIFFICULTY_V2.medium.length, 20);
assert.equal(CP008_SCENES_BY_DIFFICULTY_V2.hard.length, 20);
assert.equal(new Set(CP008_SCENES_V2.map((scene) => scene.id)).size, 60);
assert.equal(new Set(CP008_SCENES_V2.map((scene) => scene.domain)).size >= 20, true);

const sourceAnswerCounts = [0, 0, 0, 0];
for (const scene of CP008_SCENES_V2) {
  const changed = scene.correctSegments.reduce<number[]>((out, segment, index) => { if (segment !== scene.errorSegments[index]) out.push(index); return out; }, []);
  assert.equal(changed.length, 1, `${scene.id} must change exactly one canonical segment`);
  assert.equal(changed[0], scene.errorIndex, `${scene.id} changed segment must equal errorIndex`);
  sourceAnswerCounts[scene.errorIndex] += 1;
  const question = generateEng001Cp008QuestionV1({ seed: `scene:${scene.id}`, difficulty: scene.difficulty, qlId: "ENG-001-QL001", ruleId: scene.ruleId, sceneId: scene.id });
  assertValidEng001Cp008QuestionV1(question);
  assert.equal(question.metadata.candidateId, `NQN-V1:${scene.id}`);
  assert.equal(question.metadata.reviewOnly, true);
  assert.equal(question.correctOptionIndex, scene.errorIndex);
}
for (const [index, count] of sourceAnswerCounts.entries()) {
  assert.equal(count >= 8, true, `CP008 authored Part ${String.fromCharCode(65 + index)} frequency too low: ${count}`);
  assert.equal(count <= 24, true, `CP008 authored Part ${String.fromCharCode(65 + index)} frequency too high: ${count}`);
}

const difficulties: readonly EnglishDifficulty[] = ["easy", "medium", "hard"];
const qls: readonly Eng001QlId[] = ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"];
for (const difficulty of difficulties) {
  const surfaces = new Set<string>();
  const rules = new Set<string>();
  const domains = new Set<string>();
  for (let index = 0; index < 3000; index += 1) {
    const seed = `cp008:${difficulty}:stress:${index}`;
    const question = generateEng001Cp008QuestionV1({ seed, difficulty });
    assert.deepEqual(question, generateEng001Cp008QuestionV1({ seed, difficulty }));
    assertValidEng001Cp008QuestionV1(question);
    assert.equal(question.metadata.cpId, "ENG-001-CP008");
    surfaces.add(question.segments.join(" | "));
    rules.add(String(question.metadata.ruleId));
    const sceneId = question.metadata.candidateId.replace(/^NQN-V1:/, "");
    domains.add(CP008_SCENES_V2.find((entry) => entry.id === sceneId)!.domain);
  }
  assert.equal(surfaces.size >= 15, true, `${difficulty} surface diversity too low`);
  assert.equal(rules.size, 10, `${difficulty} must exercise all ten rules`);
  assert.equal(domains.size >= 10, true, `${difficulty} domain diversity too low`);
}

for (const difficulty of difficulties) {
  for (const ruleId of rulesForDifficultyCp008V1(difficulty)) {
    for (const qlId of qls) {
      const question = generateEng001Cp008QuestionV1({ seed: `matrix:${difficulty}:${ruleId}:${qlId}`, difficulty, qlId, ruleId: ruleId as NounQuantifierRuleId });
      assertValidEng001Cp008QuestionV1(question);
      assert.equal(question.metadata.ruleId, ruleId);
      assert.equal(question.metadata.qlId, qlId);
      assert.equal(question.metadata.difficulty, difficulty);
    }
  }
}

const ql002AnswerLabels = new Set<string>();
for (const scene of CP008_SCENES_V2) {
  for (let variant = 0; variant < 8; variant += 1) {
    const q2 = generateEng001Cp008QuestionV1({ seed: `answer-balance:ql002:${scene.id}:${variant}`, difficulty: scene.difficulty, qlId: "ENG-001-QL002", ruleId: scene.ruleId, sceneId: scene.id });
    ql002AnswerLabels.add(q2.metadata.answerSegment);
  }
}
assert.deepEqual([...ql002AnswerLabels].sort(), ["A", "B", "C"]);

console.log(JSON.stringify({ status: "PASS_ENG_001_CP008_V1", scenes: CP008_SCENES_V2.length, rules: NOUN_QUANTIFIER_RULES_V1.length, ql001SourceAnswerCounts: { A: sourceAnswerCounts[0], B: sourceAnswerCounts[1], C: sourceAnswerCounts[2], D: sourceAnswerCounts[3] }, ql002AnswerLabels: [...ql002AnswerLabels].sort() }, null, 2));
