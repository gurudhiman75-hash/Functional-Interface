import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { CND_001_ENGLISH_FREEZE_AUTHORITY_V1 } from "../foundation/spatial/cubes-dice-english-freeze-v1";
import {
  CND_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1,
  generateCubesDicePermanentEnglishBatchV1,
} from "../foundation/spatial/cubes-dice-permanent-english-runtime-v1";

const freeze = CND_001_ENGLISH_FREEZE_AUTHORITY_V1;
assert.equal(freeze.status, "CND_001_PERMANENT_ENGLISH_RUNTIME_V1_FROZEN");
assert.equal(freeze.permanentQlRange, "SPA-QL-043..SPA-QL-045");
assert.deepEqual(freeze.permanentQlIds, ["SPA-QL-043", "SPA-QL-044", "SPA-QL-045"]);
assert.equal(freeze.frozenRuntime.nextAvailablePermanentQlId, "SPA-QL-046");
assert.equal(freeze.exactAllocationGate.conclusion, "success");
assert.equal(freeze.exactAllocationGate.workflowRunId, 33348599315);
assert.equal(freeze.exactRuntimeGate.conclusion, "success");
assert.equal(freeze.exactRuntimeGate.workflowRunId, 33348831804);
assert.equal(freeze.exactRuntimeGate.reviewedQuestions, 240);
assert.equal(freeze.exactRuntimeGate.allFourAnswerPositionsPerQl, true);
assert.equal(freeze.exactRuntimeGate.allSixStemVariantsPerQl, true);
assert.equal(freeze.governance.englishFrozen, true);
assert.equal(freeze.governance.hindiPunjabiGenerationAllowed, true);
assert.equal(freeze.governance.localizationFrozen, false);
assert.equal(freeze.governance.questionStudioRegistrationAuthorized, false);
assert.equal(freeze.governance.persistenceAllowed, false);
assert.equal(freeze.governance.questionBankWritesAuthorized, false);
assert.equal(freeze.governance.testEligibilityAuthorized, false);
assert.equal(freeze.governance.automaticPublicationAuthorized, false);
assert.equal(freeze.governance.generatedItemManualApprovalRequired, true);
assert.deepEqual(freeze.localizationContract.localizedFieldsOnly, ["permanentQlTitle", "stem", "explanation", "language", "locale"]);

const batch = generateCubesDicePermanentEnglishBatchV1({ seed: "CND-EN-FREEZE-V1", countPerQl: 80 });
assert.equal(batch.length, 240);
const qlCounts = new Map<string, number>();
const stemVariants = new Map<string, Set<string>>();
const answerPositions = new Map<string, Set<number>>();

for (const question of batch) {
  assert.equal(question.runtimeAuthorityId, CND_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.authorityId);
  assert.equal(question.language, "en");
  assert.equal(question.locale, "en-IN");
  assert.ok(freeze.permanentQlIds.includes(question.permanentQlId));
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map(String)).size, 4);
  assert.equal(question.options[question.correctIndex], question.answer);
  assert.equal(question.options.filter((value) => value === question.answer).length, 1);
  assert.equal(question.distractorEvidence.length, 3);
  assert.ok(question.distractorEvidence.every((entry) => entry.solverAttestedIncorrect && entry.value !== question.answer));
  assert.match(question.stimulusSvgs[0], /fill="white"/);
  assert.match(question.stimulusSvgs[0], /stroke-width="1\.35"/);
  assert.equal(question.renderer.randomWholeFigureTiltAllowed, false);
  assert.equal(question.lifecycle.questionStudioRegistered, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);

  qlCounts.set(question.permanentQlId, (qlCounts.get(question.permanentQlId) ?? 0) + 1);
  const variants = stemVariants.get(question.permanentQlId) ?? new Set<string>();
  variants.add(question.stemVariantId);
  stemVariants.set(question.permanentQlId, variants);
  const positions = answerPositions.get(question.permanentQlId) ?? new Set<number>();
  positions.add(question.correctIndex);
  answerPositions.set(question.permanentQlId, positions);
}

assert.deepEqual(Object.fromEntries([...qlCounts.entries()].sort()), {
  "SPA-QL-043": 80,
  "SPA-QL-044": 80,
  "SPA-QL-045": 80,
});
for (const variants of stemVariants.values()) assert.equal(variants.size, 6);
for (const positions of answerPositions.values()) assert.equal(positions.size, 4);

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
const evidence = {
  result: "PASS",
  authority: freeze.authorityId,
  frozenRuntimeAuthority: freeze.runtimeAuthorityId,
  reviewed: batch.length,
  qlCounts: Object.fromEntries([...qlCounts.entries()].sort()),
  stemVariantCoverage: Object.fromEntries([...stemVariants.entries()].map(([qlId, values]) => [qlId, [...values].sort()])),
  answerPositionCoverage: Object.fromEntries([...answerPositions.entries()].map(([qlId, values]) => [qlId, [...values].sort()])),
  exactAllocationGate: freeze.exactAllocationGate,
  exactRuntimeGate: freeze.exactRuntimeGate,
  localizationContract: freeze.localizationContract,
  governance: freeze.governance,
  invariants: [
    "ENGLISH_RUNTIME_EXACT_HEAD_EVIDENCE_PINNED",
    "SPA_QL_043_TO_045_FROZEN",
    "240_ITEM_FREEZE_REVALIDATION",
    "ALL_SIX_STEM_VARIANTS_PER_QL",
    "ALL_FOUR_ANSWER_POSITIONS_PER_QL",
    "SOLVER_AND_DIAGRAM_FIELDS_INVARIANT_FOR_LOCALIZATION",
    "ONLY_TEXTUAL_FIELDS_MAY_LOCALIZE",
    "HINDI_PUNJABI_GENERATION_ALLOWED",
    "QUESTION_STUDIO_AND_PUBLICATION_REMAIN_LOCKED",
  ],
};
writeFileSync("dist/reasoning-v1/spatial/spa-cnd-001-english-freeze-v1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify({ result: evidence.result, reviewed: evidence.reviewed, qlCounts: evidence.qlCounts, nextGate: freeze.nextGate }, null, 2));
