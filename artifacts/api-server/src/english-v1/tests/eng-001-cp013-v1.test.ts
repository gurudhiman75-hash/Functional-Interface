import { strict as assert } from "node:assert";
import { IDIOMATIC_USAGE_RULE_BY_ID, IDIOMATIC_USAGE_RULES_V1, type IdiomaticUsageRuleId } from "../grammar/idiomatic-usage";
import { CP013_SCENES_BY_DIFFICULTY_V1, CP013_SCENES_V1 } from "../chapters/error-spotting/ENG-001/CP013/cp013-catalog-v1";
import { generateEng001Cp013QuestionV1, rulesForDifficultyCp013V1 } from "../chapters/error-spotting/ENG-001/CP013/eng-001-cp013-v1";
import { assertValidEng001Cp013QuestionV1 } from "../chapters/error-spotting/ENG-001/CP013/eng-001-cp013-v1-validator";
import type { Eng001QlId, EnglishDifficulty } from "../core/types";

assert.equal(IDIOMATIC_USAGE_RULES_V1.length, 9);
assert.equal(CP013_SCENES_V1.length, 60);
assert.equal(CP013_SCENES_BY_DIFFICULTY_V1.easy.length, 20);
assert.equal(CP013_SCENES_BY_DIFFICULTY_V1.medium.length, 20);
assert.equal(CP013_SCENES_BY_DIFFICULTY_V1.hard.length, 20);
assert.equal(new Set(CP013_SCENES_V1.map((scene) => scene.id)).size, 60);
assert.equal(new Set(CP013_SCENES_V1.map((scene) => scene.domain)).size, 60);
assert.equal(new Set(CP013_SCENES_V1.map((scene) => scene.correctSegments.join(" "))).size, 60);
assert.equal(new Set(CP013_SCENES_V1.map((scene) => scene.errorSegments.join(" "))).size, 60);

const perDifficultyAnswerCounts: Record<EnglishDifficulty, number[]> = { easy: [0, 0, 0, 0], medium: [0, 0, 0, 0], hard: [0, 0, 0, 0] };
const perDifficultyRuleCounts: Record<EnglishDifficulty, Map<string, number>> = { easy: new Map(), medium: new Map(), hard: new Map() };

for (const scene of CP013_SCENES_V1) {
  const changed = scene.correctSegments.reduce<number[]>((out, segment, index) => { if (segment !== scene.errorSegments[index]) out.push(index); return out; }, []);
  assert.equal(changed.length, 1, `${scene.id} must change exactly one canonical segment`);
  assert.equal(changed[0], scene.errorIndex, `${scene.id} changed segment must equal errorIndex`);
  assert.equal(IDIOMATIC_USAGE_RULE_BY_ID[scene.ruleId].allowedDifficulties.includes(scene.difficulty), true, `${scene.id} uses ${scene.ruleId} outside its approved difficulty range`);
  perDifficultyAnswerCounts[scene.difficulty][scene.errorIndex] += 1;
  perDifficultyRuleCounts[scene.difficulty].set(scene.ruleId, (perDifficultyRuleCounts[scene.difficulty].get(scene.ruleId) ?? 0) + 1);

  const question = generateEng001Cp013QuestionV1({ seed: `scene:${scene.id}`, difficulty: scene.difficulty, qlId: "ENG-001-QL001", ruleId: scene.ruleId, sceneId: scene.id });
  assertValidEng001Cp013QuestionV1(question);
  assert.equal(String(question.metadata.cpId), "ENG-001-CP013");
  assert.equal(question.metadata.candidateId, `USG-V1:${scene.id}`);
  assert.equal(question.metadata.reviewOnly, true);
  assert.equal(question.correctOptionIndex, scene.errorIndex);
  assert.equal(question.correctedSentence.includes("  "), false);
}

for (const difficulty of ["easy", "medium", "hard"] as const) {
  assert.deepEqual(perDifficultyAnswerCounts[difficulty], [5, 5, 5, 5]);
  assert.equal(perDifficultyRuleCounts[difficulty].size, 9, `${difficulty} must contain all nine CP013 rules`);
  for (const ruleId of IDIOMATIC_USAGE_RULES_V1.map((rule) => rule.ruleId)) {
    const count = perDifficultyRuleCounts[difficulty].get(ruleId) ?? 0;
    if (ruleId === "GR-USG-008" || ruleId === "GR-USG-009") assert.equal(count, 3, `${difficulty} ${ruleId} must have three authored scenes`);
    else assert.equal(count, 2, `${difficulty} ${ruleId} must have two authored scenes`);
  }
}

for (const scene of CP013_SCENES_V1.filter((entry) => entry.ruleId === "GR-USG-003")) {
  assert.match(scene.correctSegments.join(" "), /\bdifferent from\b/i);
  assert.match(scene.errorSegments.join(" "), /\bdifferent with\b/i);
  assert.doesNotMatch(scene.errorSegments.join(" "), /\bdifferent (?:to|than)\b/i);
}
for (const scene of CP013_SCENES_V1.filter((entry) => entry.ruleId === "GR-USG-006")) {
  assert.match(scene.correctSegments.join(" "), /\bprevent(?:s|ed)?\b[\s\S]*\bfrom\s+\w+ing\b/i);
  assert.match(scene.errorSegments.join(" "), /\bprevent(?:s|ed)?\b[\s\S]*\bto\s+\w+\b/i);
}

const difficulties: readonly EnglishDifficulty[] = ["easy", "medium", "hard"];
const qls: readonly Eng001QlId[] = ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"];

for (const difficulty of difficulties) {
  const surfaces = new Set<string>(); const rules = new Set<string>(); const domains = new Set<string>();
  for (let index = 0; index < 3000; index += 1) {
    const seed = `cp013:${difficulty}:stress:${index}`;
    const question = generateEng001Cp013QuestionV1({ seed, difficulty });
    assert.deepEqual(question, generateEng001Cp013QuestionV1({ seed, difficulty }));
    assertValidEng001Cp013QuestionV1(question);
    assert.equal(String(question.metadata.cpId), "ENG-001-CP013");
    surfaces.add(question.segments.join(" | "));
    rules.add(String(question.metadata.ruleId));
    const sceneId = question.metadata.candidateId.replace(/^USG-V1:/, "");
    domains.add(CP013_SCENES_V1.find((entry) => entry.id === sceneId)!.domain);
  }
  assert.equal(surfaces.size >= 18, true, `${difficulty} surface diversity too low`);
  assert.equal(rules.size, 9, `${difficulty} rule diversity mismatch`);
  assert.equal(domains.size >= 18, true, `${difficulty} domain diversity too low`);
}

for (const difficulty of difficulties) {
  for (const ruleId of rulesForDifficultyCp013V1(difficulty)) {
    for (const qlId of qls) {
      const question = generateEng001Cp013QuestionV1({ seed: `matrix:${difficulty}:${ruleId}:${qlId}`, difficulty, qlId, ruleId: ruleId as IdiomaticUsageRuleId });
      assertValidEng001Cp013QuestionV1(question);
      assert.equal(String(question.metadata.ruleId), ruleId);
      assert.equal(question.metadata.qlId, qlId);
      assert.equal(question.metadata.difficulty, difficulty);
    }
  }
}

const ql002AnswerLabels = new Set<string>();
for (const scene of CP013_SCENES_V1) {
  for (let variant = 0; variant < 8; variant += 1) {
    const q2 = generateEng001Cp013QuestionV1({ seed: `answer-balance:ql002:${scene.id}:${variant}`, difficulty: scene.difficulty, qlId: "ENG-001-QL002", ruleId: scene.ruleId, sceneId: scene.id });
    assertValidEng001Cp013QuestionV1(q2);
    ql002AnswerLabels.add(q2.metadata.answerSegment);
  }
}
assert.deepEqual([...ql002AnswerLabels].sort(), ["A", "B", "C"]);

console.log(JSON.stringify({
  status: "PASS_ENG_001_CP013_V1",
  scenes: CP013_SCENES_V1.length,
  rules: IDIOMATIC_USAGE_RULES_V1.length,
  easyRuleIds: rulesForDifficultyCp013V1("easy"),
  mediumRuleIds: rulesForDifficultyCp013V1("medium"),
  hardRuleIds: rulesForDifficultyCp013V1("hard"),
  ql001SourceAnswerCountsByDifficulty: perDifficultyAnswerCounts,
  ql002AnswerLabels: [...ql002AnswerLabels].sort(),
}, null, 2));
