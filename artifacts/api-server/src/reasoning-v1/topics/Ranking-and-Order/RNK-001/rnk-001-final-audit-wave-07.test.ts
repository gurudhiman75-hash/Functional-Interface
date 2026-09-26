import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  generateQuestionStudioQuestions,
  listQuestionStudioPackages,
} from "../../../../question-studio/engine-registry";
import { RNK_001_CHAPTER_AUTHORITY } from "./manifest";
import { RNK_001_CURRENT_MAIN_FINAL_AUDIT_V1 as audit } from "./rnk-001-current-main-final-audit-v1";
import {
  RNK001_STANDARD_REVIEW_ONLY_PACKAGE_V2,
  generateRnk001QuestionStudioBatch,
} from "./rnk-001-question-studio-integration-v2";

assert.equal(audit.status, "CURRENT_MAIN_FINAL_AUDIT_COMPLETE_REVIEW_ONLY");
assert.equal(audit.permanentQlRange, "RNK-QL-001..042");
assert.equal(audit.permanentQlCount, 42);
assert.equal(audit.ql043Allocated, false);
assert.equal(audit.completedWaves.length, 7);
assert.deepEqual([...audit.languages], ["en", "hi", "pa"]);
assert.deepEqual([...audit.difficulties], ["Easy", "Medium", "Hard"]);

assert.equal(audit.authorityBoundary.mathematicalAuthorityChanged, false);
assert.equal(audit.authorityBoundary.permanentQlAllocationChanged, false);
assert.equal(audit.authorityBoundary.multilingualSourceAuthorityChanged, false);
assert.equal(audit.authorityBoundary.cp008OwnsPermanentQl, false);

assert.equal(RNK_001_CHAPTER_AUTHORITY.currentMainFinalAudit.version, audit.version);
assert.equal(RNK_001_CHAPTER_AUTHORITY.currentMainFinalAudit.status, audit.status);
assert.equal(RNK_001_CHAPTER_AUTHORITY.ql043Allocated, false);
assert.equal(RNK_001_CHAPTER_AUTHORITY.permanentQlIds.length, 42);
assert.equal(RNK_001_CHAPTER_AUTHORITY.permanentQlIds.includes("RNK-QL-043"), false);

assert.equal(
  RNK001_STANDARD_REVIEW_ONLY_PACKAGE_V2.metadata?.currentMainFinalAuditVersion,
  audit.version,
);
assert.equal(
  RNK001_STANDARD_REVIEW_ONLY_PACKAGE_V2.metadata?.currentMainFinalAuditStatus,
  audit.status,
);
assert.equal(
  RNK001_STANDARD_REVIEW_ONLY_PACKAGE_V2.metadata?.currentMainFinalAuditWaveCount,
  7,
);
assert.equal(
  RNK001_STANDARD_REVIEW_ONLY_PACKAGE_V2.metadata?.currentMainFinalAuditQl043Allocated,
  false,
);

const packages = listQuestionStudioPackages().filter((entry) => entry.packageId === "RNK-001");
assert.equal(packages.length, 1, "RNK-001 must have exactly one current Question Studio registration");
assert.equal(packages[0]!.engineId, "reasoning-v1");
assert.equal(packages[0]!.enabled, true);
assert.equal(packages[0]!.questionBankWritable, false);
assert.equal(packages[0]!.testEligible, false);
assert.equal(packages[0]!.mockTestEligible, false);
assert.equal(packages[0]!.publiclyPublishable, false);
assert.equal(packages[0]!.productionReleaseAuthorized, false);

const adapterSource = readFileSync(
  "src/question-studio/engines/reasoning-v1-adapter.ts",
  "utf8",
);
assert.match(adapterSource, /RNK001_STANDARD_REVIEW_ONLY_PACKAGE_V2/u);
assert.match(adapterSource, /generateRnk001QuestionStudioBatch\(request\)/u);

let generatedCount = 0;

for (const language of ["en", "hi", "pa"] as const) {
  const batch = await generateQuestionStudioQuestions({
    packageId: "RNK-001",
    language,
    count: 8,
    seed: `rnk-wave07:${language}:chapter-smoke`,
  });

  assert.equal(batch.questions.length, 8);
  for (const raw of batch.questions as Array<Record<string, any>>) {
    generatedCount += 1;
    assert.match(String(raw.qlId), /^RNK-QL-0(?:0[1-9]|[1-3][0-9]|4[0-2])$/u);
    assert.equal(raw.validation.valid, true);
    assert.equal(raw.questionBankWritable, false);
    assert.equal(raw.testEligible, false);
    assert.equal(raw.mockTestEligible, false);
    assert.equal(raw.publiclyPublishable, false);
    assert.equal(raw.automaticStudentPublication, false);
    assert.equal(raw.productionReleaseAuthorized, false);
    assert.equal(raw.manualApprovalRequired, true);
  }

  const advanced = (await generateRnk001QuestionStudioBatch({
    packageId: "RNK-001",
    canonicalProblemId: "RNK-QL-036",
    language,
    count: 1,
    seed: `rnk-wave07:${language}:ql036`,
  })).questions[0] as Record<string, any>;

  const advancedSource = advanced.source as Record<string, any>;
  const clues = Array.isArray(advancedSource.clues)
    ? advancedSource.clues.map(String).filter(Boolean)
    : [];
  assert.ok(clues.length >= 3);
  for (const clue of clues) {
    assert.ok(String(advanced.stem).includes(clue));
  }
  assert.doesNotMatch(String(advanced.explanation), /^\s*\[/u);
}

for (const difficulty of ["Medium", "Hard"] as const) {
  const ql042 = (await generateRnk001QuestionStudioBatch({
    packageId: "RNK-001",
    canonicalProblemId: "RNK-QL-042",
    language: "en",
    difficulty,
    count: 1,
    seed: `rnk-wave07:ql042:${difficulty}`,
  })).questions[0] as Record<string, any>;

  assert.equal(ql042.difficulty, difficulty);
  assert.equal(ql042.difficultyCalibrationStatus, "GENERATED_INSTANCE_DERIVED_V2");
  assert.equal(typeof ql042.difficultyScore, "number");
  assert.ok(Array.isArray(ql042.difficultyFactors));
  assert.ok(ql042.difficultyFactors.length >= 1);
}

await assert.rejects(
  () => generateRnk001QuestionStudioBatch({
    packageId: "RNK-001",
    canonicalProblemId: "RNK-CP-008",
    language: "en",
    count: 1,
    seed: "rnk-wave07-cp008",
  }),
  /owns no permanent QL/u,
);

await assert.rejects(
  () => generateRnk001QuestionStudioBatch({
    packageId: "RNK-001",
    canonicalProblemId: "RNK-QL-043",
    language: "en",
    count: 1,
    seed: "rnk-wave07-ql043",
  }),
  /Unknown RNK-001 selector/u,
);

for (const [key, value] of Object.entries(audit.deliveryBoundary)) {
  if (key === "questionBankStatus" || key === "testEligibility") continue;
  if (key === "manualApprovalRequired") assert.equal(value, true);
  else assert.equal(value, false, `${key} must remain locked at closure`);
}

console.log(JSON.stringify({
  verdict: "PASS_RNK_001_FINAL_AUDIT_WAVE_07_CURRENT_MAIN_CLOSURE",
  version: audit.version,
  status: audit.status,
  completedWaves: audit.completedWaves.length,
  generatedClosureSmokeQuestions: generatedCount,
  qlRange: audit.permanentQlRange,
  ql043Allocated: audit.ql043Allocated,
  languages: audit.languages,
  currentRegistryBound: true,
  delivery: "LOCKED_REVIEW_ONLY",
}, null, 2));
