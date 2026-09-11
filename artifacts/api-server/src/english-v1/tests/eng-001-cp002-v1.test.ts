import { strict as assert } from "node:assert";

import type { Eng001QlId, EnglishDifficulty, TenseRuleId } from "../core/types";
import { TENSE_SEQUENCE_RULES } from "../grammar/tenses-sequence";
import {
  ENG001_CP002_V1_NO_ERROR_RULE_IDS,
  buildEng001Cp002CandidateV1,
  rulesForDifficultyCp002V1,
  semanticDomainOfCp002V1,
} from "../chapters/error-spotting/ENG-001/CP002/cp002-patterns-v1";
import { generateEng001Cp002QuestionV1 } from "../chapters/error-spotting/ENG-001/CP002/eng-001-cp002-v1";
import {
  validateEng001Cp002CandidateV1,
  validateEng001Cp002QuestionV1,
} from "../chapters/error-spotting/ENG-001/CP002/eng-001-cp002-v1-validator";

const difficulties: readonly EnglishDifficulty[] = ["easy", "medium", "hard"];
const qlIds: readonly Eng001QlId[] = ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"];

assert.equal(TENSE_SEQUENCE_RULES.length, 10);
assert.deepEqual(rulesForDifficultyCp002V1("easy"), ["GR-TNS-001", "GR-TNS-003", "GR-TNS-004", "GR-TNS-006"]);
assert.deepEqual(rulesForDifficultyCp002V1("hard"), ["GR-TNS-002", "GR-TNS-007", "GR-TNS-008"]);

for (const difficulty of difficulties) {
  for (const ruleId of rulesForDifficultyCp002V1(difficulty)) {
    for (let i = 0; i < 40; i += 1) {
      const seed = `cp002:candidate:${difficulty}:${ruleId}:${i}`;
      const candidate = buildEng001Cp002CandidateV1({ ruleId, difficulty, seed });
      const validation = validateEng001Cp002CandidateV1(candidate);
      assert.equal(validation.ok, true, `${seed}: ${JSON.stringify(validation.issues)}`);
      assert.ok(semanticDomainOfCp002V1(candidate), `${seed}: missing semantic domain`);
    }
  }
}

for (const difficulty of difficulties) {
  const surfaces = new Set<string>();
  const domains = new Set<string>();
  const rules = new Set<string>();
  for (let i = 0; i < 1500; i += 1) {
    const seed = `cp002:stress:${difficulty}:${i}`;
    const qlId = qlIds[i % qlIds.length]!;
    const question = generateEng001Cp002QuestionV1({ seed, difficulty, qlId });
    const replay = generateEng001Cp002QuestionV1({ seed, difficulty, qlId });
    assert.deepEqual(question, replay, `${seed}: deterministic replay failed`);
    const validation = validateEng001Cp002QuestionV1(question);
    assert.equal(validation.ok, true, `${seed}: ${JSON.stringify(validation.issues)}`);
    assert.equal(question.metadata.reviewOnly, true);
    assert.equal(question.metadata.cpId, "ENG-001-CP002");
    surfaces.add(question.correctedSentence);
    rules.add(question.metadata.ruleId);
    const candidate = buildEng001Cp002CandidateV1({
      ruleId: question.metadata.ruleId as TenseRuleId,
      difficulty,
      seed: `${seed}:${question.metadata.ruleId}`,
    });
    domains.add(semanticDomainOfCp002V1(candidate)!);
  }

  const minimumSurfaces = difficulty === "easy" ? 150 : difficulty === "medium" ? 250 : 30;
  const minimumDomains = difficulty === "hard" ? 10 : 18;
  assert.ok(surfaces.size >= minimumSurfaces, `${difficulty}: only ${surfaces.size} distinct corrected surfaces`);
  assert.ok(domains.size >= minimumDomains, `${difficulty}: only ${domains.size} semantic domains`);
  assert.ok(rules.size >= (difficulty === "hard" ? 3 : 4), `${difficulty}: insufficient rule coverage`);
}

for (const difficulty of difficulties) {
  for (const ruleId of rulesForDifficultyCp002V1(difficulty)) {
    for (const qlId of qlIds) {
      if (qlId === "ENG-001-QL007" && !ENG001_CP002_V1_NO_ERROR_RULE_IDS.includes(ruleId)) continue;
      const question = generateEng001Cp002QuestionV1({
        seed: `cp002:matrix:${difficulty}:${ruleId}:${qlId}`,
        difficulty,
        ruleId,
        qlId,
      });
      const validation = validateEng001Cp002QuestionV1(question);
      assert.equal(validation.ok, true, `${difficulty}/${ruleId}/${qlId}: ${JSON.stringify(validation.issues)}`);
      if (qlId === "ENG-001-QL007") {
        assert.equal(question.metadata.hasNoError, true);
        assert.equal(question.options[question.correctOptionIndex], "No error");
      } else {
        assert.equal(question.metadata.hasNoError, false);
      }
    }
  }
}

assert.throws(
  () => generateEng001Cp002QuestionV1({ seed: "bad-hard", difficulty: "hard", ruleId: "GR-TNS-001" }),
  /does not support hard/i,
);

console.log("ENG-001 CP002 V1 tense generation and validation tests passed.");
