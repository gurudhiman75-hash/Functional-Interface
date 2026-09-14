import { strict as assert } from "node:assert";
import { MODIFIER_RULES_V1, type ModifierRuleId } from "../grammar/modifiers";
import { CP010_SCENES_BY_DIFFICULTY_V1, CP010_SCENES_V1 } from "../chapters/error-spotting/ENG-001/CP010/cp010-catalog-v1";
import { generateEng001Cp010QuestionV1, rulesForDifficultyCp010V1 } from "../chapters/error-spotting/ENG-001/CP010/eng-001-cp010-v1";
import { assertValidEng001Cp010QuestionV1 } from "../chapters/error-spotting/ENG-001/CP010/eng-001-cp010-v1-validator";
import type { Eng001QlId, EnglishDifficulty } from "../core/types";

assert.equal(MODIFIER_RULES_V1.length, 10);
assert.equal(CP010_SCENES_V1.length, 60);
assert.equal(CP010_SCENES_BY_DIFFICULTY_V1.easy.length, 20);
assert.equal(CP010_SCENES_BY_DIFFICULTY_V1.medium.length, 20);
assert.equal(CP010_SCENES_BY_DIFFICULTY_V1.hard.length, 20);
assert.equal(new Set(CP010_SCENES_V1.map((scene) => scene.id)).size, 60);
assert.equal(new Set(CP010_SCENES_V1.map((scene) => scene.domain)).size >= 50, true);

const perDifficultyAnswerCounts: Record<EnglishDifficulty, number[]> = {
  easy: [0, 0, 0, 0],
  medium: [0, 0, 0, 0],
  hard: [0, 0, 0, 0],
};
const perDifficultyRuleCounts: Record<EnglishDifficulty, Map<string, number>> = {
  easy: new Map(), medium: new Map(), hard: new Map(),
};

for (const scene of CP010_SCENES_V1) {
  const changed = scene.correctSegments.reduce<number[]>((out, segment, index) => {
    if (segment !== scene.errorSegments[index]) out.push(index);
    return out;
  }, []);
  assert.equal(changed.length, 1, `${scene.id} must change exactly one canonical segment`);
  assert.equal(changed[0], scene.errorIndex, `${scene.id} changed segment must equal errorIndex`);
  perDifficultyAnswerCounts[scene.difficulty][scene.errorIndex] += 1;
  perDifficultyRuleCounts[scene.difficulty].set(scene.ruleId, (perDifficultyRuleCounts[scene.difficulty].get(scene.ruleId) ?? 0) + 1);

  const question = generateEng001Cp010QuestionV1({
    seed: `scene:${scene.id}`,
    difficulty: scene.difficulty,
    qlId: "ENG-001-QL001",
    ruleId: scene.ruleId,
    sceneId: scene.id,
  });
  assertValidEng001Cp010QuestionV1(question);
  assert.equal(String(question.metadata.cpId), "ENG-001-CP010");
  assert.equal(question.metadata.candidateId, `MOD-V1:${scene.id}`);
  assert.equal(question.metadata.reviewOnly, true);
  assert.equal(question.correctOptionIndex, scene.errorIndex);
}

for (const difficulty of ["easy", "medium", "hard"] as const) {
  assert.deepEqual(perDifficultyAnswerCounts[difficulty], [5, 5, 5, 5], `${difficulty} source answers must be A=5/B=5/C=5/D=5`);
  assert.equal(perDifficultyRuleCounts[difficulty].size, 10, `${difficulty} must contain all ten modifier rules`);
  for (const count of perDifficultyRuleCounts[difficulty].values()) assert.equal(count, 2, `${difficulty} must contain two scenes per rule`);
}

const difficulties: readonly EnglishDifficulty[] = ["easy", "medium", "hard"];
const qls: readonly Eng001QlId[] = ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"];

for (const difficulty of difficulties) {
  const surfaces = new Set<string>();
  const rules = new Set<string>();
  const domains = new Set<string>();
  for (let index = 0; index < 3000; index += 1) {
    const seed = `cp010:${difficulty}:stress:${index}`;
    const question = generateEng001Cp010QuestionV1({ seed, difficulty });
    assert.deepEqual(question, generateEng001Cp010QuestionV1({ seed, difficulty }));
    assertValidEng001Cp010QuestionV1(question);
    assert.equal(String(question.metadata.cpId), "ENG-001-CP010");
    surfaces.add(question.segments.join(" | "));
    rules.add(String(question.metadata.ruleId));
    const sceneId = question.metadata.candidateId.replace(/^MOD-V1:/, "");
    domains.add(CP010_SCENES_V1.find((entry) => entry.id === sceneId)!.domain);
  }
  assert.equal(surfaces.size >= 15, true, `${difficulty} surface diversity too low`);
  assert.equal(rules.size, 10, `${difficulty} must exercise all ten rules`);
  assert.equal(domains.size >= 15, true, `${difficulty} domain diversity too low`);
}

for (const difficulty of difficulties) {
  for (const ruleId of rulesForDifficultyCp010V1(difficulty)) {
    for (const qlId of qls) {
      const question = generateEng001Cp010QuestionV1({
        seed: `matrix:${difficulty}:${ruleId}:${qlId}`,
        difficulty,
        qlId,
        ruleId: ruleId as ModifierRuleId,
      });
      assertValidEng001Cp010QuestionV1(question);
      assert.equal(String(question.metadata.ruleId), ruleId);
      assert.equal(question.metadata.qlId, qlId);
      assert.equal(question.metadata.difficulty, difficulty);
    }
  }
}

const ql002AnswerLabels = new Set<string>();
for (const scene of CP010_SCENES_V1) {
  for (let variant = 0; variant < 8; variant += 1) {
    const q2 = generateEng001Cp010QuestionV1({
      seed: `answer-balance:ql002:${scene.id}:${variant}`,
      difficulty: scene.difficulty,
      qlId: "ENG-001-QL002",
      ruleId: scene.ruleId,
      sceneId: scene.id,
    });
    assertValidEng001Cp010QuestionV1(q2);
    ql002AnswerLabels.add(q2.metadata.answerSegment);
  }
}
assert.deepEqual([...ql002AnswerLabels].sort(), ["A", "B", "C"]);

console.log(JSON.stringify({
  status: "PASS_ENG_001_CP010_V1",
  scenes: CP010_SCENES_V1.length,
  rules: MODIFIER_RULES_V1.length,
  ql001SourceAnswerCountsByDifficulty: perDifficultyAnswerCounts,
  ql002AnswerLabels: [...ql002AnswerLabels].sort(),
}, null, 2));
