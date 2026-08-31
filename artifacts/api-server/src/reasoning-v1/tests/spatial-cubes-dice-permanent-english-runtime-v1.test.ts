import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  CND_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1,
  generateCubesDicePermanentEnglishBatchV1,
  generateCubesDicePermanentEnglishQuestionV1,
} from "../foundation/spatial/cubes-dice-permanent-english-runtime-v1";
import type { CubesDiceCp004TaskKindV1 } from "../foundation/spatial/cubes-dice-cp004-distractors-allocation-v1";

assert.equal(CND_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.permanentQlRange, "SPA-QL-043..SPA-QL-045");
assert.equal(CND_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.nextPermanentQlId, "SPA-QL-046");
assert.equal(CND_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.governance.englishRuntimeImplemented, true);
assert.equal(CND_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.governance.englishImplementationFrozen, false);
assert.equal(CND_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.governance.localizationGenerationAllowed, false);
assert.equal(CND_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.governance.questionStudioRegistrationAuthorized, false);
assert.equal(CND_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.governance.automaticPublicationAuthorized, false);

const batch = generateCubesDicePermanentEnglishBatchV1({ seed: "CND-PERM-EN-RUNTIME-V1", countPerQl: 80 });
assert.equal(batch.length, 240);

const EXPECTED_QL: Readonly<Record<CubesDiceCp004TaskKindV1, string>> = Object.freeze({
  DICE_OPPOSITE_FROM_TWO_VIEWS: "SPA-QL-043",
  CUBE_NET_OPPOSITE_FACE: "SPA-QL-044",
  PAINTED_CUBE_EXACT_FACE_COUNT: "SPA-QL-045",
});
const qlCounts = new Map<string, number>();
const answerPositions = new Map<string, Set<number>>();
const stemVariants = new Map<string, Set<string>>();
const distractorFamilies = new Set<string>();
const sampleRows: Record<string, unknown>[] = [];

for (const question of batch) {
  assert.equal(question.version, "CND-001-PERMANENT-ENGLISH-QUESTION-V1");
  assert.equal(question.permanentQlId, EXPECTED_QL[question.taskKind as CubesDiceCp004TaskKindV1]);
  assert.equal(question.language, "en");
  assert.equal(question.locale, "en-IN");
  assert.equal(question.qlStatus, "PERMANENT_QL_ALLOCATED_ENGLISH_RUNTIME");
  assert.equal(question.allocationAuthorityId, "SPA-FND-001-PERMANENT-QL-ALLOCATION-V7-CND");
  assert.equal(question.runtimeAuthorityId, "CND-001-PERMANENT-ENGLISH-RUNTIME-V1");
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map(String)).size, 4, `${question.seed}: options must be unique.`);
  assert.equal(question.options[question.correctIndex], question.answer, `${question.seed}: answer index mismatch.`);
  assert.equal(question.options.filter((option) => option === question.answer).length, 1, `${question.seed}: answer must occur once.`);
  assert.equal(question.distractorEvidence.length, 3);
  assert.ok(question.distractorEvidence.every((entry) => entry.solverAttestedIncorrect && entry.value !== question.answer));
  assert.match(question.stimulusSvgs[0], /fill="white"/);
  assert.match(question.stimulusSvgs[0], /stroke-width="1\.35"/);
  assert.equal(question.renderer.randomWholeFigureTiltAllowed, false);
  assert.equal(question.lifecycle.englishRuntimeImplemented, true);
  assert.equal(question.lifecycle.englishImplementationFrozen, false);
  assert.equal(question.lifecycle.questionStudioRegistered, false);
  assert.equal(question.lifecycle.persistenceAllowed, false);
  assert.equal(question.lifecycle.questionBankWritable, false);
  assert.equal(question.lifecycle.testEligible, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);
  assert.equal(question.lifecycle.automaticStudentPublication, false);

  const replay = generateCubesDicePermanentEnglishQuestionV1({
    seed: question.seed,
    taskKind: question.taskKind as CubesDiceCp004TaskKindV1,
  });
  assert.equal(replay.stem, question.stem);
  assert.equal(replay.stimulusSvgs[0], question.stimulusSvgs[0]);
  assert.deepEqual(replay.options, question.options);
  assert.equal(replay.answer, question.answer);
  assert.equal(replay.correctIndex, question.correctIndex);

  qlCounts.set(question.permanentQlId, (qlCounts.get(question.permanentQlId) ?? 0) + 1);
  const positions = answerPositions.get(question.permanentQlId) ?? new Set<number>();
  positions.add(question.correctIndex);
  answerPositions.set(question.permanentQlId, positions);
  const variants = stemVariants.get(question.permanentQlId) ?? new Set<string>();
  variants.add(question.stemVariantId);
  stemVariants.set(question.permanentQlId, variants);
  for (const entry of question.distractorEvidence) distractorFamilies.add(entry.family);
  if (sampleRows.length < 18) {
    sampleRows.push({
      seed: question.seed,
      permanentQlId: question.permanentQlId,
      taskKind: question.taskKind,
      difficulty: question.difficulty,
      stemVariantId: question.stemVariantId,
      stem: question.stem,
      answer: question.answer,
      options: question.options,
      distractorEvidence: question.distractorEvidence,
    });
  }
}

assert.deepEqual(Object.fromEntries([...qlCounts.entries()].sort()), {
  "SPA-QL-043": 80,
  "SPA-QL-044": 80,
  "SPA-QL-045": 80,
});
for (const [qlId, positions] of answerPositions) {
  assert.equal(positions.size, 4, `${qlId}: all four answer positions must be exercised.`);
}
for (const [qlId, variants] of stemVariants) {
  assert.ok(variants.size >= 5, `${qlId}: expected at least five English stem variants, got ${variants.size}.`);
}
assert.deepEqual([...distractorFamilies].sort(), [
  "ADJACENT_FACE_CONFUSED_WITH_OPPOSITE",
  "BOUNDARY_FORMULA_CONFUSION",
  "NET_NEIGHBOUR_CONFUSED_WITH_OPPOSITE",
  "WRONG_PAINTED_FACE_CATEGORY",
]);

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
const evidence = {
  result: "PASS",
  authority: CND_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.authorityId,
  reviewed: batch.length,
  reviewedPerPermanentQl: 80,
  permanentQlRange: CND_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.permanentQlRange,
  nextPermanentQlId: CND_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.nextPermanentQlId,
  qlCounts: Object.fromEntries([...qlCounts.entries()].sort()),
  answerPositionCoverage: Object.fromEntries([...answerPositions.entries()].map(([qlId, positions]) => [qlId, [...positions].sort()])),
  stemVariantCoverage: Object.fromEntries([...stemVariants.entries()].map(([qlId, variants]) => [qlId, [...variants].sort()])),
  distractorFamilies: [...distractorFamilies].sort(),
  governance: CND_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.governance,
  sampleRows,
  invariants: [
    "THREE_ALLOCATED_QLS_ONLY",
    "PERMANENT_QL_043_TO_045_PINNED",
    "240_SEEDED_ENGLISH_RUNTIME_REVIEW",
    "DETERMINISTIC_REPLAY",
    "FOUR_UNIQUE_OPTIONS_SINGLE_SOLVER_ANSWER",
    "ALL_FOUR_ANSWER_POSITIONS_PER_QL",
    "AT_LEAST_FIVE_STEM_VARIANTS_PER_QL",
    "SOLVER_ATTESTED_MISCONCEPTION_DISTRACTORS",
    "WHITE_BACKGROUND_EXAM_STROKE_NO_RANDOM_TILT",
    "LOCALIZATION_QUESTION_STUDIO_AND_PUBLICATION_LOCKED",
  ],
};
writeFileSync("dist/reasoning-v1/spatial/spa-cnd-001-permanent-english-runtime-v1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify({
  result: evidence.result,
  reviewed: evidence.reviewed,
  qlCounts: evidence.qlCounts,
  answerPositionCoverage: evidence.answerPositionCoverage,
  stemVariantCoverage: evidence.stemVariantCoverage,
  distractorFamilies: evidence.distractorFamilies,
}, null, 2));
