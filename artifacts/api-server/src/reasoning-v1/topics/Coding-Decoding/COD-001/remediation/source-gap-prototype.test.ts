import assert from "node:assert/strict";

import {
  COD_SOURCE_GAP_RULES,
  candidateKey,
  generateSourceGapPrototype,
  inferSourceGapCandidates,
  transformSourceGapRule,
  type SourceGapOwnerCheckpoint,
  type SourceGapRuleId,
} from "./source-gap-prototype";

const EXPECTED_OWNER: Record<SourceGapRuleId, SourceGapOwnerCheckpoint> = {
  ALPHABETICAL_ASCENDING_SORT: "COD-CP-005",
  INDEXED_SHIFT_THEN_REVERSE: "COD-CP-006",
  REVERSE_THEN_UNIFORM_SHIFT: "COD-CP-006",
  MIXED_CLASS_CODE: "COD-CP-007",
};

// Direct reproduction of the source examples that reopened COD-001.
assert.equal(transformSourceGapRule("ALPHABETICAL_ASCENDING_SORT", {}, "BEHOLD"), "BDEHLO");
assert.equal(transformSourceGapRule("ALPHABETICAL_ASCENDING_SORT", {}, "INDEED"), "DDEEIN");
assert.equal(transformSourceGapRule("ALPHABETICAL_ASCENDING_SORT", {}, "COURSE"), "CEORSU");

assert.equal(transformSourceGapRule("INDEXED_SHIFT_THEN_REVERSE", { baseShift: 1, direction: -1 }, "PLIERS"), "MMAFJO");
assert.equal(transformSourceGapRule("INDEXED_SHIFT_THEN_REVERSE", { baseShift: 1, direction: -1 }, "SHOVEL"), "FZRLFR");
assert.equal(transformSourceGapRule("INDEXED_SHIFT_THEN_REVERSE", { baseShift: 1, direction: -1 }, "WRENCH"), "BXJBPV");

assert.equal(transformSourceGapRule("REVERSE_THEN_UNIFORM_SHIFT", { shift: 1 }, "NAME"), "FNBO");
assert.equal(transformSourceGapRule("REVERSE_THEN_UNIFORM_SHIFT", { shift: 1 }, "NANO"), "POBO");
assert.equal(transformSourceGapRule("REVERSE_THEN_UNIFORM_SHIFT", { shift: 1 }, "NAIL"), "MJBO");

assert.equal(transformSourceGapRule("MIXED_CLASS_CODE", { mixedVariant: "VOWEL_INDEX_CONSONANT_PREVIOUS" }, "HONEY"), "G4M2X");
assert.equal(transformSourceGapRule("MIXED_CLASS_CODE", { mixedVariant: "VOWEL_INDEX_CONSONANT_PREVIOUS" }, "STATUE"), "RS1S52");
assert.equal(transformSourceGapRule("MIXED_CLASS_CODE", { mixedVariant: "REVERSE_VOWEL_INDEX_CONSONANT_OPPOSITE" }, "CATHODE"), "X5GS2W4");
assert.equal(transformSourceGapRule("MIXED_CLASS_CODE", { mixedVariant: "REVERSE_VOWEL_INDEX_CONSONANT_OPPOSITE" }, "RELATION"), "I4O5G32M");

const counts = new Map<SourceGapRuleId, number>();
const visibleFingerprints = new Map<SourceGapRuleId, Set<string>>();
const answerPositions = new Map<SourceGapRuleId, Set<number>>();

for (const ruleId of COD_SOURCE_GAP_RULES) {
  counts.set(ruleId, 0);
  visibleFingerprints.set(ruleId, new Set());
  answerPositions.set(ruleId, new Set());

  for (let seed = 0; seed < 120; seed += 1) {
    const question = generateSourceGapPrototype(ruleId, seed);
    const replay = generateSourceGapPrototype(ruleId, seed);

    assert.deepEqual(replay, question, `${ruleId} seed ${seed}: generation must be deterministic`);
    assert.equal(question.permanentQlId, null);
    assert.equal(question.ownerCheckpoint, EXPECTED_OWNER[ruleId]);
    assert.equal(question.ruleId, ruleId);
    assert.equal(question.locale, "en-IN");
    assert.equal(question.metadata.maturity, "SOURCE_GAP_PROTOTYPE");
    assert.equal(question.metadata.reviewOnly, true);
    assert.equal(question.metadata.publiclyPublishable, false);
    assert.equal(question.metadata.questionStudioDiscoverable, false);
    assert.equal(question.metadata.questionBankWritable, false);
    assert.equal(question.metadata.mockTestEligible, false);

    assert.equal(question.evidence.length, 2);
    assert.notEqual(question.evidence[0]!.source, question.evidence[1]!.source);
    assert.ok(question.evidence.every((row) => row.source !== question.targetWord));
    assert.notEqual(question.targetWord, question.targetCode, `${ruleId} seed ${seed}: both stages/rule must materially affect target`);

    const candidates = inferSourceGapCandidates(question.evidence);
    assert.equal(candidates.length, 1, `${ruleId} seed ${seed}: displayed evidence must identify one rule/context`);
    assert.equal(candidateKey(candidates[0]!), candidateKey({ ruleId: question.ruleId, context: question.context }));
    assert.equal(question.metadata.inferredCandidateCount, 1);

    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4, `${ruleId} seed ${seed}: options must be unique`);
    assert.equal(question.options[question.correctIndex], question.targetCode);
    assert.equal(question.options.filter((option) => option === question.targetCode).length, 1);

    assert.match(question.stem, /^(In a certain code language|In a code language|In a certain coding system),/u);
    assert.match(question.stem, /How will '.+' be coded in the same language\?$/u);
    assert.doesNotMatch(question.stem, /prototype|checkpoint|ruleId|context|source-gap|stage one|stage two/iu);

    const explanationText = [
      question.explanation.coreRule,
      ...question.explanation.stepByStep,
      ...question.explanation.visualAlignment,
      question.explanation.examShortcut,
      question.explanation.commonTrap,
    ].join("\n");
    assert.ok(explanationText.includes(question.targetWord));
    assert.ok(explanationText.includes(question.targetCode));
    assert.ok(question.explanation.stepByStep.length >= 2);
    assert.ok(question.explanation.visualAlignment.length >= 2);

    visibleFingerprints.get(ruleId)!.add(`${question.stem}|${question.options.join("|")}`);
    answerPositions.get(ruleId)!.add(question.correctIndex);
    counts.set(ruleId, counts.get(ruleId)! + 1);
  }
}

for (const ruleId of COD_SOURCE_GAP_RULES) {
  assert.equal(counts.get(ruleId), 120);
  assert.ok(visibleFingerprints.get(ruleId)!.size >= 80, `${ruleId}: insufficient visible surface variation`);
  assert.equal(answerPositions.get(ruleId)!.size, 4, `${ruleId}: all four answer positions must be reachable`);
}

console.log("COD-001 source-gap remediation prototype audit passed");
console.log(`Generated questions: ${COD_SOURCE_GAP_RULES.length * 120}`);
for (const ruleId of COD_SOURCE_GAP_RULES) {
  console.log(`${ruleId}: ${counts.get(ruleId)} questions, ${visibleFingerprints.get(ruleId)!.size} visible variants`);
}
