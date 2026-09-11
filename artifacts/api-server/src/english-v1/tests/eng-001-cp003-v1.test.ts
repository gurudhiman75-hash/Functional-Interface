import { strict as assert } from "node:assert";
import type { Eng001QlId, EnglishDifficulty } from "../core/types";
import { ARTICLE_DETERMINER_RULES } from "../grammar/articles-determiners";
import { ARTICLE_SCENES_BY_DIFFICULTY_V1, ARTICLE_SCENES_V1 } from "../chapters/error-spotting/ENG-001/CP003/cp003-catalog-v1";
import { buildEng001Cp003CandidateV1, generateEng001Cp003QuestionV1 } from "../chapters/error-spotting/ENG-001/CP003/eng-001-cp003-v1";
import { validateEng001Cp003CandidateV1, validateEng001Cp003QuestionV1 } from "../chapters/error-spotting/ENG-001/CP003/eng-001-cp003-v1-validator";

const difficulties: readonly EnglishDifficulty[] = ["easy", "medium", "hard"];
const qls: readonly Eng001QlId[] = ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"];

assert.equal(ARTICLE_DETERMINER_RULES.length, 10);
assert.ok(ARTICLE_SCENES_V1.length >= 80);
assert.ok(ARTICLE_SCENES_BY_DIFFICULTY_V1.easy.length >= 20);
assert.ok(ARTICLE_SCENES_BY_DIFFICULTY_V1.medium.length >= 20);
assert.ok(ARTICLE_SCENES_BY_DIFFICULTY_V1.hard.length >= 20);

for (const scene of ARTICLE_SCENES_V1) {
  const candidate = buildEng001Cp003CandidateV1({ seed: `scene:${scene.id}`, difficulty: scene.difficulty, ruleId: scene.ruleId });
  const validation = validateEng001Cp003CandidateV1(candidate);
  assert.equal(validation.ok, true, `${scene.id}: ${JSON.stringify(validation.issues)}`);
}

for (const difficulty of difficulties) {
  const seenRules = new Set<string>();
  const seenSurfaces = new Set<string>();
  for (let i = 0; i < 3000; i += 1) {
    const seed = `cp003:stress:${difficulty}:${i}`;
    const qlId = qls[i % qls.length]!;
    const q = generateEng001Cp003QuestionV1({ seed, difficulty, qlId });
    const replay = generateEng001Cp003QuestionV1({ seed, difficulty, qlId });
    assert.deepEqual(q, replay, `${seed}: replay differs`);
    const validation = validateEng001Cp003QuestionV1(q);
    assert.equal(validation.ok, true, `${seed}: ${JSON.stringify(validation.issues)}`);
    assert.equal(q.metadata.reviewOnly, true);
    assert.equal(q.metadata.cpId, "ENG-001-CP003");
    seenRules.add(q.metadata.ruleId);
    seenSurfaces.add(q.correctedSentence);
  }
  assert.ok(seenSurfaces.size >= 20, `${difficulty}: insufficient surface variety`);
  assert.ok(seenRules.size >= 3, `${difficulty}: insufficient rule variety`);
}

for (const rule of ARTICLE_DETERMINER_RULES) {
  for (const difficulty of rule.allowedDifficulties) {
    if (!ARTICLE_SCENES_BY_DIFFICULTY_V1[difficulty].some((scene) => scene.ruleId === rule.ruleId)) continue;
    for (const qlId of qls) {
      const q = generateEng001Cp003QuestionV1({ seed: `matrix:${rule.ruleId}:${difficulty}:${qlId}`, difficulty, ruleId: rule.ruleId, qlId });
      const validation = validateEng001Cp003QuestionV1(q);
      assert.equal(validation.ok, true, `${rule.ruleId}/${difficulty}/${qlId}: ${JSON.stringify(validation.issues)}`);
    }
  }
}

console.log(JSON.stringify({
  status: "PASS_ENG_001_CP003_V1",
  scenes: ARTICLE_SCENES_V1.length,
  byDifficulty: Object.fromEntries(difficulties.map((d) => [d, ARTICLE_SCENES_BY_DIFFICULTY_V1[d].length])),
  rules: ARTICLE_DETERMINER_RULES.length,
}, null, 2));
