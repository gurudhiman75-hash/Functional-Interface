import assert from "node:assert/strict";

import { inferSourceGapCandidates, candidateKey, type SourceGapRuleId } from "./source-gap-prototype";
import { COD_SOURCE_GAP_WORD_POOL, COD_SOURCE_GAP_WORD_POOL_STATS } from "./source-gap-word-pool.en";
import { COD_SOURCE_GAP_V2_RULES, generateSourceGapV2 } from "./source-gap-v2";

assert.ok(COD_SOURCE_GAP_WORD_POOL_STATS.total >= 180, "source-gap production pool must contain at least 180 words");
assert.equal(COD_SOURCE_GAP_WORD_POOL_STATS.unique, COD_SOURCE_GAP_WORD_POOL_STATS.total, "source-gap pool must be unique");
assert.ok(COD_SOURCE_GAP_WORD_POOL_STATS.minLength <= 3);
assert.ok(COD_SOURCE_GAP_WORD_POOL_STATS.maxLength >= 9);
assert.ok(COD_SOURCE_GAP_WORD_POOL.every((word) => /^[A-Z]+$/u.test(word)));

const difficultyByRule = new Map<SourceGapRuleId, Set<string>>();
const answerPositions = new Map<SourceGapRuleId, Set<number>>();
const seenTargets = new Map<SourceGapRuleId, Set<string>>();
const seenEvidencePairs = new Map<SourceGapRuleId, Set<string>>();
const provenanceByRule = new Map<SourceGapRuleId, Set<string>>();
const fingerprints = new Set<string>();

for (const ruleId of COD_SOURCE_GAP_V2_RULES) {
  difficultyByRule.set(ruleId, new Set());
  answerPositions.set(ruleId, new Set());
  seenTargets.set(ruleId, new Set());
  seenEvidencePairs.set(ruleId, new Set());
  provenanceByRule.set(ruleId, new Set());

  const rollingTargets: string[] = [];
  const rollingEvidence: string[] = [];

  for (let seed = 0; seed < 240; seed += 1) {
    const question = generateSourceGapV2(ruleId, seed);
    const replay = generateSourceGapV2(ruleId, seed);
    assert.deepEqual(replay, question, `${ruleId}/${seed}: generation must be deterministic`);

    assert.equal(question.permanentQlId, null);
    assert.equal(question.metadata.maturity, "SOURCE_GAP_V2_CANDIDATE");
    assert.equal(question.metadata.reviewOnly, true);
    assert.equal(question.metadata.publiclyPublishable, false);
    assert.equal(question.metadata.questionStudioDiscoverable, false);
    assert.equal(question.metadata.questionBankWritable, false);
    assert.equal(question.metadata.mockTestEligible, false);
    assert.equal(question.metadata.arbitraryFallbackUsed, false);

    const inferred = inferSourceGapCandidates(question.evidence);
    assert.equal(inferred.length, 1, `${ruleId}/${seed}: evidence must identify one rule/context`);
    assert.equal(candidateKey(inferred[0]!), candidateKey({ ruleId, context: question.context }));

    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.targetCode);
    assert.equal(question.options.filter((option) => option === question.targetCode).length, 1);
    assert.equal(question.distractors.length, 3);
    assert.equal(new Set(question.distractors.map((item) => item.value)).size, 3);
    assert.ok(question.distractors.every((item) => item.value !== question.targetCode));
    assert.ok(question.distractors.every((item) => item.provenance.length > 0));

    assert.ok(question.difficultyFeatures.length >= 1);
    assert.ok(Number.isInteger(question.difficultyScore));
    assert.ok(question.explanation.steps.length >= 2);
    assert.ok(question.explanation.working.length >= 2);
    assert.ok(question.explanation.steps.join(" ").includes(question.targetWord));
    assert.ok(question.explanation.steps.join(" ").includes(question.targetCode));
    assert.equal("examShortcut" in question.explanation, false);
    assert.equal("commonTrap" in question.explanation, false);

    if (ruleId === "MIXED_CLASS_CODE") {
      const allWords = [...question.evidence.map((row) => row.source), question.targetWord];
      for (const word of allWords) {
        assert.match(word, /[AEIOU]/u, `${word} must exercise the vowel channel`);
        assert.match(word, /[^AEIOU]/u, `${word} must exercise the consonant channel`);
      }
    }

    difficultyByRule.get(ruleId)!.add(question.difficulty);
    answerPositions.get(ruleId)!.add(question.correctIndex);
    seenTargets.get(ruleId)!.add(question.targetWord);
    for (const distractor of question.distractors) provenanceByRule.get(ruleId)!.add(distractor.provenance);
    const evidencePair = question.evidence.map((row) => row.source).sort().join("|");
    seenEvidencePairs.get(ruleId)!.add(evidencePair);
    fingerprints.add(`${ruleId}|${question.stem}|${question.options.join("|")}`);

    rollingTargets.push(question.targetWord);
    rollingEvidence.push(evidencePair);
    if (rollingTargets.length > 24) rollingTargets.shift();
    if (rollingEvidence.length > 24) rollingEvidence.shift();
    if (rollingTargets.length === 24) {
      assert.ok(new Set(rollingTargets).size >= 16, `${ruleId}/${seed}: target fatigue in rolling window`);
      assert.ok(new Set(rollingEvidence).size >= 20, `${ruleId}/${seed}: evidence-pair fatigue in rolling window`);
    }
  }
}

for (const ruleId of COD_SOURCE_GAP_V2_RULES) {
  assert.equal(answerPositions.get(ruleId)!.size, 4, `${ruleId}: all answer positions must occur`);
  assert.ok(seenTargets.get(ruleId)!.size >= 90, `${ruleId}: insufficient target diversity`);
  assert.ok(seenEvidencePairs.get(ruleId)!.size >= 180, `${ruleId}: insufficient evidence-pair diversity`);
  assert.ok(provenanceByRule.get(ruleId)!.size >= 3, `${ruleId}: distractor provenance too narrow`);
  assert.ok(difficultyByRule.get(ruleId)!.size >= 2, `${ruleId}: difficulty remains rule-fixed`);
}

assert.ok(fingerprints.size >= 900, "V2 visible surface diversity is too low");

console.log("COD-001 source-gap V2 quality gate passed");
console.log(`Pool: ${COD_SOURCE_GAP_WORD_POOL_STATS.total} governed words`);
console.log(`Generated: ${COD_SOURCE_GAP_V2_RULES.length * 240} V2 questions`);
for (const ruleId of COD_SOURCE_GAP_V2_RULES) {
  console.log(`${ruleId}: difficulties=${[...difficultyByRule.get(ruleId)!].sort().join(",")}; targets=${seenTargets.get(ruleId)!.size}; evidencePairs=${seenEvidencePairs.get(ruleId)!.size}`);
}
