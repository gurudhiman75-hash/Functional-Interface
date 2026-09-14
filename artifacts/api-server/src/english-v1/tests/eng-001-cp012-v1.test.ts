import { strict as assert } from "node:assert";
import { VOICE_NARRATION_RULE_BY_ID, VOICE_NARRATION_RULES_V1, type VoiceNarrationRuleId } from "../grammar/voice-narration";
import { CP012_SCENES_BY_DIFFICULTY_V1, CP012_SCENES_V1 } from "../chapters/error-spotting/ENG-001/CP012/cp012-catalog-v1";
import { generateEng001Cp012QuestionV1, rulesForDifficultyCp012V1 } from "../chapters/error-spotting/ENG-001/CP012/eng-001-cp012-v1";
import { assertValidEng001Cp012QuestionV1 } from "../chapters/error-spotting/ENG-001/CP012/eng-001-cp012-v1-validator";
import type { Eng001QlId, EnglishDifficulty } from "../core/types";

assert.equal(VOICE_NARRATION_RULES_V1.length, 12);
assert.equal(CP012_SCENES_V1.length, 68);
assert.equal(CP012_SCENES_BY_DIFFICULTY_V1.easy.length, 20);
assert.equal(CP012_SCENES_BY_DIFFICULTY_V1.medium.length, 24);
assert.equal(CP012_SCENES_BY_DIFFICULTY_V1.hard.length, 24);
assert.equal(new Set(CP012_SCENES_V1.map((scene) => scene.id)).size, 68);
assert.equal(new Set(CP012_SCENES_V1.map((scene) => scene.domain)).size, 68);
assert.equal(new Set(CP012_SCENES_V1.map((scene) => scene.correctSegments.join(" "))).size, 68);
assert.equal(new Set(CP012_SCENES_V1.map((scene) => scene.errorSegments.join(" "))).size, 68);

const perDifficultyAnswerCounts: Record<EnglishDifficulty, number[]> = { easy: [0, 0, 0, 0], medium: [0, 0, 0, 0], hard: [0, 0, 0, 0] };
const perDifficultyRuleCounts: Record<EnglishDifficulty, Map<string, number>> = { easy: new Map(), medium: new Map(), hard: new Map() };

for (const scene of CP012_SCENES_V1) {
  const changed = scene.correctSegments.reduce<number[]>((out, segment, index) => { if (segment !== scene.errorSegments[index]) out.push(index); return out; }, []);
  assert.equal(changed.length, 1, `${scene.id} must change exactly one canonical segment`);
  assert.equal(changed[0], scene.errorIndex, `${scene.id} changed segment must equal errorIndex`);
  assert.equal(VOICE_NARRATION_RULE_BY_ID[scene.ruleId].allowedDifficulties.includes(scene.difficulty), true, `${scene.id} uses ${scene.ruleId} outside its approved difficulty range`);
  perDifficultyAnswerCounts[scene.difficulty][scene.errorIndex] += 1;
  perDifficultyRuleCounts[scene.difficulty].set(scene.ruleId, (perDifficultyRuleCounts[scene.difficulty].get(scene.ruleId) ?? 0) + 1);

  const question = generateEng001Cp012QuestionV1({ seed: `scene:${scene.id}`, difficulty: scene.difficulty, qlId: "ENG-001-QL001", ruleId: scene.ruleId, sceneId: scene.id });
  assertValidEng001Cp012QuestionV1(question);
  assert.equal(String(question.metadata.cpId), "ENG-001-CP012");
  assert.equal(question.metadata.candidateId, `VNR-V1:${scene.id}`);
  assert.equal(question.metadata.reviewOnly, true);
  assert.equal(question.correctOptionIndex, scene.errorIndex);
  assert.equal(question.correctedSentence.includes("  "), false);
}

assert.deepEqual(perDifficultyAnswerCounts.easy, [5, 5, 5, 5]);
assert.deepEqual(perDifficultyAnswerCounts.medium, [6, 6, 6, 6]);
assert.deepEqual(perDifficultyAnswerCounts.hard, [6, 6, 6, 6]);
assert.equal(perDifficultyRuleCounts.easy.size, 10);
for (const count of perDifficultyRuleCounts.easy.values()) assert.equal(count, 2, "Easy rules must each have two scenes");
assert.equal(perDifficultyRuleCounts.easy.has("GR-VNR-011"), false);
assert.equal(perDifficultyRuleCounts.easy.has("GR-VNR-012"), false);
for (const difficulty of ["medium", "hard"] as const) {
  assert.equal(perDifficultyRuleCounts[difficulty].size, 12, `${difficulty} must contain all twelve rules`);
  for (const count of perDifficultyRuleCounts[difficulty].values()) assert.equal(count, 2, `${difficulty} rules must each have two scenes`);
}

const difficulties: readonly EnglishDifficulty[] = ["easy", "medium", "hard"];
const qls: readonly Eng001QlId[] = ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"];
const expectedRuleDiversity: Record<EnglishDifficulty, number> = { easy: 10, medium: 12, hard: 12 };
const minimumSurfaceDiversity: Record<EnglishDifficulty, number> = { easy: 18, medium: 22, hard: 22 };

for (const difficulty of difficulties) {
  const surfaces = new Set<string>(); const rules = new Set<string>(); const domains = new Set<string>();
  for (let index = 0; index < 3000; index += 1) {
    const seed = `cp012:${difficulty}:stress:${index}`;
    const question = generateEng001Cp012QuestionV1({ seed, difficulty });
    assert.deepEqual(question, generateEng001Cp012QuestionV1({ seed, difficulty }));
    assertValidEng001Cp012QuestionV1(question);
    assert.equal(String(question.metadata.cpId), "ENG-001-CP012");
    surfaces.add(question.segments.join(" | "));
    rules.add(String(question.metadata.ruleId));
    const sceneId = question.metadata.candidateId.replace(/^VNR-V1:/, "");
    domains.add(CP012_SCENES_V1.find((entry) => entry.id === sceneId)!.domain);
  }
  assert.equal(surfaces.size >= minimumSurfaceDiversity[difficulty], true, `${difficulty} surface diversity too low`);
  assert.equal(rules.size, expectedRuleDiversity[difficulty], `${difficulty} rule diversity mismatch`);
  assert.equal(domains.size >= minimumSurfaceDiversity[difficulty], true, `${difficulty} domain diversity too low`);
}

for (const difficulty of difficulties) {
  for (const ruleId of rulesForDifficultyCp012V1(difficulty)) {
    for (const qlId of qls) {
      const question = generateEng001Cp012QuestionV1({ seed: `matrix:${difficulty}:${ruleId}:${qlId}`, difficulty, qlId, ruleId: ruleId as VoiceNarrationRuleId });
      assertValidEng001Cp012QuestionV1(question);
      assert.equal(String(question.metadata.ruleId), ruleId);
      assert.equal(question.metadata.qlId, qlId);
      assert.equal(question.metadata.difficulty, difficulty);
    }
  }
}

for (const advancedRule of ["GR-VNR-011", "GR-VNR-012"] as const) {
  assert.throws(() => generateEng001Cp012QuestionV1({ seed: `easy-block:${advancedRule}`, difficulty: "easy", qlId: "ENG-001-QL001", ruleId: advancedRule }), /No CP012 easy scene is available/);
}

const ql002AnswerLabels = new Set<string>();
for (const scene of CP012_SCENES_V1) {
  for (let variant = 0; variant < 8; variant += 1) {
    const q2 = generateEng001Cp012QuestionV1({ seed: `answer-balance:ql002:${scene.id}:${variant}`, difficulty: scene.difficulty, qlId: "ENG-001-QL002", ruleId: scene.ruleId, sceneId: scene.id });
    assertValidEng001Cp012QuestionV1(q2);
    ql002AnswerLabels.add(q2.metadata.answerSegment);
  }
}
assert.deepEqual([...ql002AnswerLabels].sort(), ["A", "B", "C"]);

console.log(JSON.stringify({
  status: "PASS_ENG_001_CP012_V1",
  scenes: CP012_SCENES_V1.length,
  rules: VOICE_NARRATION_RULES_V1.length,
  easyRuleIds: rulesForDifficultyCp012V1("easy"),
  mediumRuleIds: rulesForDifficultyCp012V1("medium"),
  hardRuleIds: rulesForDifficultyCp012V1("hard"),
  ql001SourceAnswerCountsByDifficulty: perDifficultyAnswerCounts,
  ql002AnswerLabels: [...ql002AnswerLabels].sort(),
}, null, 2));
