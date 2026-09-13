import assert from "node:assert/strict";

import { candidateKey, inferSourceGapCandidates, transformSourceGapRule, type SourceGapContext, type SourceGapRuleId } from "./remediation/source-gap-prototype";
import { generateCodSourceGapPermanentQuestion } from "./source-gap-permanent-runtime";
import { COD_SOURCE_GAP_PERMANENT_CONTRACTS } from "./source-gap-permanent-contracts";
import {
  COD_SOURCE_GAP_DISCOVERY_FREEZE_VERSION,
  COD_SOURCE_GAP_EXPLICIT_NON_ALLOCATIONS,
  COD_SOURCE_GAP_FROZEN_QL_IDS,
  COD_SOURCE_GAP_FROZEN_SOLVE_CONTRACTS,
  COD_SOURCE_GAP_SOURCE_FIXTURES,
} from "./source-gap-discovery-freeze";

assert.equal(COD_SOURCE_GAP_DISCOVERY_FREEZE_VERSION, "COD_SOURCE_GAP_DISCOVERY_FREEZE_V1");
assert.deepEqual(COD_SOURCE_GAP_FROZEN_QL_IDS, ["COD-QL-200", "COD-QL-201", "COD-QL-202", "COD-QL-203"]);
assert.deepEqual(
  COD_SOURCE_GAP_PERMANENT_CONTRACTS.map((contract) => contract.qlId),
  [...COD_SOURCE_GAP_FROZEN_QL_IDS],
);
assert.deepEqual(
  COD_SOURCE_GAP_PERMANENT_CONTRACTS.map((contract) => contract.taskKind),
  ["INFER_AND_ENCODE", "INFER_AND_ENCODE", "INFER_AND_ENCODE", "INFER_AND_ENCODE"],
);
assert.deepEqual(
  COD_SOURCE_GAP_PERMANENT_CONTRACTS.map((contract) => contract.checkpointId),
  ["COD-CP-005", "COD-CP-006", "COD-CP-006", "COD-CP-007"],
);
assert.deepEqual(
  COD_SOURCE_GAP_PERMANENT_CONTRACTS.map((contract) => contract.ruleId),
  ["ALPHABETICAL_ASCENDING_SORT", "INDEXED_SHIFT_THEN_REVERSE", "REVERSE_THEN_UNIFORM_SHIFT", "MIXED_CLASS_CODE"],
);
assert.equal(COD_SOURCE_GAP_FROZEN_SOLVE_CONTRACTS.length, 4);
assert.ok(COD_SOURCE_GAP_EXPLICIT_NON_ALLOCATIONS.includes("INVERSE_DECODE"));
assert.ok(COD_SOURCE_GAP_EXPLICIT_NON_ALLOCATIONS.includes("MIXED_CLASS_VARIANT_AS_SEPARATE_QL"));

for (const fixture of COD_SOURCE_GAP_SOURCE_FIXTURES) {
  assert.equal(
    transformSourceGapRule(fixture.ruleId as SourceGapRuleId, fixture.context as SourceGapContext, fixture.source),
    fixture.code,
    `${fixture.ruleId}/${fixture.source} source fixture drifted`,
  );
}

for (const contract of COD_SOURCE_GAP_PERMANENT_CONTRACTS) {
  const difficulties = new Set<string>();
  const answerPositions = new Set<number>();
  const targetWords = new Set<string>();
  const evidencePairs = new Set<string>();

  for (let seed = 0; seed < 240; seed += 1) {
    const question = generateCodSourceGapPermanentQuestion(contract.qlId, seed);
    const replay = generateCodSourceGapPermanentQuestion(contract.qlId, seed);
    assert.deepEqual(replay, question, `${contract.qlId}/${seed} must be deterministic`);
    assert.equal(question.qlId, contract.qlId);
    assert.equal(question.permanentQlId, contract.qlId);
    assert.equal(question.checkpointId, contract.checkpointId);
    assert.equal(question.ruleId, contract.ruleId);
    assert.equal(question.solveContractId, contract.solveContractId);
    assert.equal(question.taskKind, "INFER_AND_ENCODE");
    assert.equal(question.locale, "en-IN");
    assert.equal(question.prototypeOnly, false);
    assert.equal(question.reviewOnly, true);
    assert.equal(question.questionStudioVisible, true);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.metadata.reviewOnly, true);
    assert.equal(question.metadata.questionStudioDiscoverable, true);
    assert.equal(question.metadata.questionBankWritable, false);
    assert.equal(question.metadata.mockTestEligible, false);
    assert.equal(question.metadata.inferredCandidateCount, 1);
    assert.equal(question.metadata.arbitraryFallbackUsed, false);
    assert.equal(question.metadata.sourceGapFreezeVersion, COD_SOURCE_GAP_DISCOVERY_FREEZE_VERSION);

    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => option.value)).size, 4);
    assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(question.options[question.correctIndex]!.isCorrect, true);
    assert.ok(question.options.filter((option) => !option.isCorrect).every((option) => Boolean(option.errorLabel)));

    const inferred = inferSourceGapCandidates(question.structuredPrompt.evidence);
    assert.equal(inferred.length, 1, `${contract.qlId}/${seed} evidence must identify one candidate`);
    assert.equal(candidateKey(inferred[0]!), candidateKey({ ruleId: contract.ruleId, context: generateSourceGapContext(question.metadata.hiddenFingerprint) }));

    assert.ok(question.explanation.sourceDemonstration.length >= 2);
    assert.ok(question.explanation.targetApplication.length >= 4);
    assert.ok(question.explanation.conclusion.includes(question.structuredPrompt.targetWord));
    assert.ok(question.explanation.conclusion.includes(question.structuredPrompt.targetCode));

    difficulties.add(question.difficulty);
    answerPositions.add(question.correctIndex);
    targetWords.add(question.structuredPrompt.targetWord);
    evidencePairs.add(question.structuredPrompt.evidence.map((row) => row.source).sort().join("|"));
  }

  assert.equal(answerPositions.size, 4, `${contract.qlId} must reach all answer positions`);
  assert.ok(difficulties.size >= 2, `${contract.qlId} must not have rule-fixed difficulty`);
  assert.ok(targetWords.size >= 90, `${contract.qlId} target diversity is too low`);
  assert.ok(evidencePairs.size >= 180, `${contract.qlId} evidence-pair diversity is too low`);
}

function generateSourceGapContext(fingerprint: string): SourceGapContext {
  const [, , rawContext] = fingerprint.split("::");
  if (!rawContext) throw new Error(`Malformed source-gap fingerprint '${fingerprint}'`);
  return JSON.parse(rawContext) as SourceGapContext;
}

console.log(JSON.stringify({
  status: "COD-001 SOURCE-GAP DISCOVERY FREEZE V1 PASSED",
  freezeVersion: COD_SOURCE_GAP_DISCOVERY_FREEZE_VERSION,
  qlIds: COD_SOURCE_GAP_FROZEN_QL_IDS,
  generatedQuestions: COD_SOURCE_GAP_PERMANENT_CONTRACTS.length * 240,
  sourceFixtures: COD_SOURCE_GAP_SOURCE_FIXTURES.length,
  explicitNonAllocations: COD_SOURCE_GAP_EXPLICIT_NON_ALLOCATIONS,
  questionStudioVisible: true,
  publiclyPublishable: false,
}, null, 2));
