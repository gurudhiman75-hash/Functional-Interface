import { strict as assert } from "node:assert";

import { CP004_PRONOUN_SCENES_V1, CP004_SCENES_BY_DIFFICULTY_V1 } from "../chapters/error-spotting/ENG-001/CP004/cp004-catalog-v1";
import { generateEng001Cp004QuestionV1, rulesForDifficultyCp004V1 } from "../chapters/error-spotting/ENG-001/CP004/eng-001-cp004-v1";
import { validateEng001Cp004QuestionV1 } from "../chapters/error-spotting/ENG-001/CP004/eng-001-cp004-v1-validator";
import { PRONOUN_RULES_V1 } from "../grammar/pronouns";
import type { Eng001QlId, EnglishDifficulty } from "../core/types";

assert.equal(CP004_PRONOUN_SCENES_V1.length, 60);
assert.equal(CP004_SCENES_BY_DIFFICULTY_V1.easy.length, 20);
assert.equal(CP004_SCENES_BY_DIFFICULTY_V1.medium.length, 20);
assert.equal(CP004_SCENES_BY_DIFFICULTY_V1.hard.length, 20);
assert.equal(PRONOUN_RULES_V1.length, 10);
assert.deepEqual(rulesForDifficultyCp004V1("easy"), ["GR-PRN-001", "GR-PRN-002", "GR-PRN-003", "GR-PRN-008", "GR-PRN-009"]);
assert.deepEqual(rulesForDifficultyCp004V1("medium"), ["GR-PRN-001", "GR-PRN-002", "GR-PRN-003", "GR-PRN-004", "GR-PRN-005", "GR-PRN-006", "GR-PRN-007", "GR-PRN-008", "GR-PRN-009", "GR-PRN-010"]);
assert.deepEqual(rulesForDifficultyCp004V1("hard"), ["GR-PRN-002", "GR-PRN-004", "GR-PRN-005", "GR-PRN-006", "GR-PRN-007", "GR-PRN-008", "GR-PRN-010"]);

for (const scene of CP004_PRONOUN_SCENES_V1) {
  const changed = scene.correctSegments.reduce<number[]>((out, segment, index) => {
    if (segment !== scene.errorSegments[index]) out.push(index);
    return out;
  }, []);
  assert.deepEqual(changed, [scene.errorIndex], `${scene.id} must change exactly its keyed segment`);
  assert.equal(scene.correction.trim().length > 0, true, `${scene.id} correction missing`);
  assert.equal(scene.reason.trim().length > 20, true, `${scene.id} reason is too generic`);
}

const qls: readonly Eng001QlId[] = ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"];
for (const [index, scene] of CP004_PRONOUN_SCENES_V1.entries()) {
  for (const qlId of qls) {
    const question = generateEng001Cp004QuestionV1({
      seed: `cp004:scene:${index}:${qlId}`,
      difficulty: scene.difficulty,
      qlId,
      ruleId: scene.ruleId,
      sceneId: scene.id,
    });
    const replay = generateEng001Cp004QuestionV1({
      seed: `cp004:scene:${index}:${qlId}`,
      difficulty: scene.difficulty,
      qlId,
      ruleId: scene.ruleId,
      sceneId: scene.id,
    });
    assert.deepEqual(question, replay, `${scene.id}/${qlId} must replay deterministically`);
    const result = validateEng001Cp004QuestionV1(question);
    assert.equal(result.ok, true, `${scene.id}/${qlId}: ${result.issues.map((issue) => issue.message).join(" | ")}`);
    assert.equal(question.metadata.cpId, "ENG-001-CP004");
    assert.equal(question.metadata.reviewOnly, true);
    assert.equal(question.metadata.ruleId, scene.ruleId);
    assert.equal(question.metadata.difficulty, scene.difficulty);
    assert.equal(question.explanation.includes(scene.correction), true);
    assert.equal(question.correctedSentence.length > 0, true);
    if (qlId === "ENG-001-QL007") {
      assert.equal(question.metadata.hasNoError, true);
      assert.equal(question.options[question.correctOptionIndex], "No error");
    } else {
      assert.equal(question.metadata.hasNoError, false);
      assert.notEqual(question.options[question.correctOptionIndex], "No error");
    }
  }
}

const diversity: Record<EnglishDifficulty, { candidates: Set<string>; rules: Set<string>; domains: Set<string>; explanationStarts: Set<string> }> = {
  easy: { candidates: new Set(), rules: new Set(), domains: new Set(), explanationStarts: new Set() },
  medium: { candidates: new Set(), rules: new Set(), domains: new Set(), explanationStarts: new Set() },
  hard: { candidates: new Set(), rules: new Set(), domains: new Set(), explanationStarts: new Set() },
};

for (const difficulty of ["easy", "medium", "hard"] as const) {
  for (let i = 0; i < 3000; i += 1) {
    const question = generateEng001Cp004QuestionV1({ seed: `cp004:stress:${difficulty}:${i}`, difficulty });
    const result = validateEng001Cp004QuestionV1(question);
    assert.equal(result.ok, true, `${difficulty}/${i}: ${result.issues.map((issue) => issue.message).join(" | ")}`);
    diversity[difficulty].candidates.add(question.metadata.candidateId);
    diversity[difficulty].rules.add(String(question.metadata.ruleId));
    const scene = CP004_PRONOUN_SCENES_V1.find((entry) => `PRN-V1:${entry.id}` === question.metadata.candidateId)!;
    diversity[difficulty].domains.add(scene.domain);
    diversity[difficulty].explanationStarts.add(question.explanation.split(".")[0] ?? question.explanation);
  }
}

for (const difficulty of ["easy", "medium", "hard"] as const) {
  assert.equal(diversity[difficulty].candidates.size, 20, `${difficulty} must expose all 20 authored scenes`);
  assert.equal(diversity[difficulty].domains.size >= 12, true, `${difficulty} domain coverage is too narrow`);
  assert.equal(diversity[difficulty].explanationStarts.size >= 5, true, `${difficulty} explanation style variation is too narrow`);
}
assert.equal(diversity.easy.rules.size, 5);
assert.equal(diversity.medium.rules.size, 10);
assert.equal(diversity.hard.rules.size, 7);

assert.throws(
  () => generateEng001Cp004QuestionV1({ seed: "bad-hard", difficulty: "hard", ruleId: "GR-PRN-001" }),
  /No CP004 hard scene is available for GR-PRN-001/,
);

console.log(JSON.stringify({
  status: "PASS_ENG_001_CP004_V1",
  scenes: {
    easy: CP004_SCENES_BY_DIFFICULTY_V1.easy.length,
    medium: CP004_SCENES_BY_DIFFICULTY_V1.medium.length,
    hard: CP004_SCENES_BY_DIFFICULTY_V1.hard.length,
  },
  rules: PRONOUN_RULES_V1.length,
  diversity: Object.fromEntries(Object.entries(diversity).map(([difficulty, value]) => [difficulty, {
    candidates: value.candidates.size,
    domains: value.domains.size,
    rules: value.rules.size,
    explanationStarts: value.explanationStarts.size,
  }])),
}, null, 2));
