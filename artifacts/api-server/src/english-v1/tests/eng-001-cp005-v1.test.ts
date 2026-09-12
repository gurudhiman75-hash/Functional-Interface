import { strict as assert } from "node:assert";

import { PREPOSITION_RULES_V1 } from "../grammar/prepositions";
import { CP005_ALL_SCENES_V1, CP005_SCENES_BY_DIFFICULTY_V1 } from "../chapters/error-spotting/ENG-001/CP005/cp005-catalog-v1";
import { generateEng001Cp005QuestionV1, rulesForDifficultyCp005V1 } from "../chapters/error-spotting/ENG-001/CP005/eng-001-cp005-v1";
import { assertValidEng001Cp005QuestionV1 } from "../chapters/error-spotting/ENG-001/CP005/eng-001-cp005-v1-validator";
import type { Eng001QlId, EnglishDifficulty, PrepositionRuleId } from "../core/types";

assert.equal(PREPOSITION_RULES_V1.length, 10);
assert.equal(CP005_ALL_SCENES_V1.length, 60);
assert.equal(CP005_SCENES_BY_DIFFICULTY_V1.easy.length, 20);
assert.equal(CP005_SCENES_BY_DIFFICULTY_V1.medium.length, 20);
assert.equal(CP005_SCENES_BY_DIFFICULTY_V1.hard.length, 20);
assert.equal(new Set(CP005_ALL_SCENES_V1.map((scene) => scene.id)).size, 60);
assert.equal(new Set(CP005_ALL_SCENES_V1.map((scene) => scene.domain)).size >= 20, true);

for (const scene of CP005_ALL_SCENES_V1) {
  const changed = scene.correctSegments.filter((segment, index) => segment !== scene.errorSegments[index]);
  assert.equal(changed.length, 1, `${scene.id} must change exactly one canonical segment`);
  const question = generateEng001Cp005QuestionV1({ seed: `scene:${scene.id}`, difficulty: scene.difficulty, qlId: "ENG-001-QL001", ruleId: scene.ruleId, sceneId: scene.id });
  assertValidEng001Cp005QuestionV1(question);
  assert.equal(question.metadata.candidateId, `PRP-V1:${scene.id}`);
  assert.equal(question.metadata.reviewOnly, true);
}

const difficulties: readonly EnglishDifficulty[] = ["easy", "medium", "hard"];
const qls: readonly Eng001QlId[] = ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"];

for (const difficulty of difficulties) {
  const surfaces = new Set<string>();
  const rules = new Set<string>();
  const domains = new Set<string>();
  for (let index = 0; index < 3000; index += 1) {
    const seed = `cp005:${difficulty}:stress:${index}`;
    const question = generateEng001Cp005QuestionV1({ seed, difficulty });
    const replay = generateEng001Cp005QuestionV1({ seed, difficulty });
    assert.deepEqual(question, replay);
    assertValidEng001Cp005QuestionV1(question);
    assert.equal(question.metadata.cpId, "ENG-001-CP005");
    assert.equal(question.metadata.reviewOnly, true);
    surfaces.add(question.segments.join(" | "));
    rules.add(String(question.metadata.ruleId));
    const sceneId = question.metadata.candidateId.replace(/^PRP-V1:/, "");
    const scene = CP005_ALL_SCENES_V1.find((entry) => entry.id === sceneId)!;
    domains.add(scene.domain);
  }
  assert.equal(surfaces.size >= 15, true, `${difficulty} surface diversity too low`);
  assert.equal(rules.size >= 5, true, `${difficulty} rule diversity too low`);
  assert.equal(domains.size >= 10, true, `${difficulty} domain diversity too low`);
}

for (const difficulty of difficulties) {
  for (const ruleId of rulesForDifficultyCp005V1(difficulty)) {
    for (const qlId of qls) {
      const question = generateEng001Cp005QuestionV1({ seed: `matrix:${difficulty}:${ruleId}:${qlId}`, difficulty, qlId, ruleId: ruleId as PrepositionRuleId });
      assertValidEng001Cp005QuestionV1(question);
      assert.equal(question.metadata.ruleId, ruleId);
      assert.equal(question.metadata.qlId, qlId);
      assert.equal(question.metadata.difficulty, difficulty);
      if (qlId === "ENG-001-QL007") assert.equal(question.metadata.hasNoError, true);
    }
  }
}

console.log(JSON.stringify({
  status: "PASS_ENG_001_CP005_V1",
  scenes: CP005_ALL_SCENES_V1.length,
  byDifficulty: Object.fromEntries(difficulties.map((difficulty) => [difficulty, CP005_SCENES_BY_DIFFICULTY_V1[difficulty].length])),
  rules: PREPOSITION_RULES_V1.length,
}, null, 2));
