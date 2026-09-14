import { strict as assert } from "node:assert";
import { CONDITIONAL_RULE_BY_ID, CONDITIONAL_RULES_V1, type ConditionalRuleId } from "../grammar/conditionals";
import { CP011_SCENES_BY_DIFFICULTY_V1, CP011_SCENES_V1 } from "../chapters/error-spotting/ENG-001/CP011/cp011-catalog-v1";
import { generateEng001Cp011QuestionV1, rulesForDifficultyCp011V1 } from "../chapters/error-spotting/ENG-001/CP011/eng-001-cp011-v1";
import { assertValidEng001Cp011QuestionV1 } from "../chapters/error-spotting/ENG-001/CP011/eng-001-cp011-v1-validator";
import type { Eng001QlId, EnglishDifficulty } from "../core/types";

assert.equal(CONDITIONAL_RULES_V1.length, 10);
assert.equal(CP011_SCENES_V1.length, 60);
assert.equal(CP011_SCENES_BY_DIFFICULTY_V1.easy.length, 20);
assert.equal(CP011_SCENES_BY_DIFFICULTY_V1.medium.length, 20);
assert.equal(CP011_SCENES_BY_DIFFICULTY_V1.hard.length, 20);
assert.equal(new Set(CP011_SCENES_V1.map((scene) => scene.id)).size, 60);
assert.equal(new Set(CP011_SCENES_V1.map((scene) => scene.domain)).size, 60);

const perDifficultyAnswerCounts: Record<EnglishDifficulty, number[]> = { easy: [0, 0, 0, 0], medium: [0, 0, 0, 0], hard: [0, 0, 0, 0] };
const perDifficultyRuleCounts: Record<EnglishDifficulty, Map<string, number>> = { easy: new Map(), medium: new Map(), hard: new Map() };

for (const scene of CP011_SCENES_V1) {
  const changed = scene.correctSegments.reduce<number[]>((out, segment, index) => { if (segment !== scene.errorSegments[index]) out.push(index); return out; }, []);
  assert.equal(changed.length, 1, `${scene.id} must change exactly one canonical segment`);
  assert.equal(changed[0], scene.errorIndex, `${scene.id} changed segment must equal errorIndex`);
  assert.equal(CONDITIONAL_RULE_BY_ID[scene.ruleId].allowedDifficulties.includes(scene.difficulty), true, `${scene.id} uses ${scene.ruleId} outside its approved difficulty range`);
  perDifficultyAnswerCounts[scene.difficulty][scene.errorIndex] += 1;
  perDifficultyRuleCounts[scene.difficulty].set(scene.ruleId, (perDifficultyRuleCounts[scene.difficulty].get(scene.ruleId) ?? 0) + 1);

  const correctText = scene.correctSegments.join(" ");
  if (scene.ruleId === "GR-CND-003") assert.equal(/\bif\b[^,;.?!]*\bwill\b/i.test(correctText), false, `${scene.id} leaks neutral future will into its correct if-clause`);
  if (scene.ruleId === "GR-CND-008") assert.equal(/\bunless\b[^.?!;]*\b(?:not|never|no)\b/i.test(correctText), false, `${scene.id} contains a second negative after unless`);
  if (scene.ruleId === "GR-CND-010") assert.equal(/\bif\s+(?:should|were)\b/i.test(correctText), false, `${scene.id} keeps if before a formal inversion`);

  const question = generateEng001Cp011QuestionV1({ seed: `scene:${scene.id}`, difficulty: scene.difficulty, qlId: "ENG-001-QL001", ruleId: scene.ruleId, sceneId: scene.id });
  assertValidEng001Cp011QuestionV1(question);
  assert.equal(String(question.metadata.cpId), "ENG-001-CP011");
  assert.equal(question.metadata.candidateId, `CND-V1:${scene.id}`);
  assert.equal(question.metadata.reviewOnly, true);
  assert.equal(question.correctOptionIndex, scene.errorIndex);
}

for (const difficulty of ["easy", "medium", "hard"] as const) {
  assert.deepEqual(perDifficultyAnswerCounts[difficulty], [5, 5, 5, 5], `${difficulty} source answers must be A=5/B=5/C=5/D=5`);
}
assert.deepEqual(Object.fromEntries(perDifficultyRuleCounts.easy), {
  "GR-CND-001": 4, "GR-CND-002": 3, "GR-CND-003": 3,
  "GR-CND-004": 3, "GR-CND-005": 3, "GR-CND-008": 4,
});
for (const difficulty of ["medium", "hard"] as const) {
  assert.equal(perDifficultyRuleCounts[difficulty].size, 10, `${difficulty} must contain all ten conditional rules`);
  for (const count of perDifficultyRuleCounts[difficulty].values()) assert.equal(count, 2, `${difficulty} must contain two scenes per rule`);
}

const difficulties: readonly EnglishDifficulty[] = ["easy", "medium", "hard"];
const qls: readonly Eng001QlId[] = ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"];
const expectedRuleDiversity: Record<EnglishDifficulty, number> = { easy: 6, medium: 10, hard: 10 };

for (const difficulty of difficulties) {
  const surfaces = new Set<string>(); const rules = new Set<string>(); const domains = new Set<string>();
  for (let index = 0; index < 3000; index += 1) {
    const seed = `cp011:${difficulty}:stress:${index}`;
    const question = generateEng001Cp011QuestionV1({ seed, difficulty });
    assert.deepEqual(question, generateEng001Cp011QuestionV1({ seed, difficulty }));
    assertValidEng001Cp011QuestionV1(question);
    assert.equal(String(question.metadata.cpId), "ENG-001-CP011");
    surfaces.add(question.segments.join(" | "));
    rules.add(String(question.metadata.ruleId));
    const sceneId = question.metadata.candidateId.replace(/^CND-V1:/, "");
    domains.add(CP011_SCENES_V1.find((entry) => entry.id === sceneId)!.domain);
  }
  assert.equal(surfaces.size >= 15, true, `${difficulty} surface diversity too low`);
  assert.equal(rules.size, expectedRuleDiversity[difficulty], `${difficulty} rule diversity mismatch`);
  assert.equal(domains.size >= 15, true, `${difficulty} domain diversity too low`);
}

for (const difficulty of difficulties) {
  for (const ruleId of rulesForDifficultyCp011V1(difficulty)) {
    for (const qlId of qls) {
      const question = generateEng001Cp011QuestionV1({ seed: `matrix:${difficulty}:${ruleId}:${qlId}`, difficulty, qlId, ruleId: ruleId as ConditionalRuleId });
      assertValidEng001Cp011QuestionV1(question);
      assert.equal(String(question.metadata.ruleId), ruleId);
      assert.equal(question.metadata.qlId, qlId);
      assert.equal(question.metadata.difficulty, difficulty);
    }
  }
}
for (const advancedRule of ["GR-CND-006", "GR-CND-007", "GR-CND-009", "GR-CND-010"] as const) {
  assert.throws(() => generateEng001Cp011QuestionV1({ seed: `easy-block:${advancedRule}`, difficulty: "easy", qlId: "ENG-001-QL001", ruleId: advancedRule }), /No CP011 easy scene is available/);
}

const ql002AnswerLabels = new Set<string>();
for (const scene of CP011_SCENES_V1) {
  for (let variant = 0; variant < 8; variant += 1) {
    const q2 = generateEng001Cp011QuestionV1({ seed: `answer-balance:ql002:${scene.id}:${variant}`, difficulty: scene.difficulty, qlId: "ENG-001-QL002", ruleId: scene.ruleId, sceneId: scene.id });
    assertValidEng001Cp011QuestionV1(q2);
    ql002AnswerLabels.add(q2.metadata.answerSegment);
  }
}
assert.deepEqual([...ql002AnswerLabels].sort(), ["A", "B", "C"]);

console.log(JSON.stringify({ status: "PASS_ENG_001_CP011_V1", scenes: CP011_SCENES_V1.length, rules: CONDITIONAL_RULES_V1.length, easyRuleIds: rulesForDifficultyCp011V1("easy"), mediumRuleIds: rulesForDifficultyCp011V1("medium"), hardRuleIds: rulesForDifficultyCp011V1("hard"), ql001SourceAnswerCountsByDifficulty: perDifficultyAnswerCounts, ql002AnswerLabels: [...ql002AnswerLabels].sort() }, null, 2));
