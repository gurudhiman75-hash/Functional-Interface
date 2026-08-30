import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const shared = await import("../../../../question-studio/shared-generation-engine.ts");

const ALL_QLS = [
  "STA-QL-001",
  "STA-QL-002",
  "STA-QL-003",
  "STA-QL-004",
  "STA-QL-005",
  "STA-QL-006",
] as const;
const LANGUAGES = ["en", "hi", "pa"] as const;

const packages = shared.listQuestionStudioPackages();
const packageIds = packages.map((entry: any) => String(entry.packageId));
assert.equal(
  new Set(packageIds).size,
  packageIds.length,
  "Shared Question Studio package IDs must remain unique after additive chapter integration.",
);

const staPackages = packages.filter((entry: any) => entry.packageId === "STA-001");
assert.equal(staPackages.length, 1, "STA-001 must appear exactly once in shared Question Studio capabilities.");

const sta = staPackages[0] as any;
assert.equal(sta.enabled, true);
assert.equal(sta.reviewOnly, true);
assert.equal(sta.permanentQlCount, 6);
assert.deepEqual(sta.permanentQlIds, ALL_QLS);
assert.equal(sta.candidateQlCount, 6);
assert.deepEqual(sta.candidateQlIds, ALL_QLS);
assert.deepEqual(sta.supportedLanguages, LANGUAGES);
assert.equal(sta.multilingualChapterFrozen, true);
assert.equal(sta.questionBankStatus, "NOT_STORED");
assert.equal(sta.questionBankWritable, false);
assert.equal(sta.testEligibility, "INELIGIBLE");
assert.equal(sta.testEligible, false);
assert.equal(sta.mockTestEligible, false);
assert.equal(sta.publiclyPublishable, false);
assert.equal(sta.automaticStudentPublication, false);
assert.equal(sta.releaseFreezeStatus, "STA-001-V4-1-FROZEN");

assert.equal(shared.isSta001QuestionStudioRequest({ packageId: "STA-001" }), true);
assert.equal(shared.isSta001QuestionStudioRequest({ canonicalProblemId: "STA-QL-006" }), true);
assert.equal(shared.isSta001QuestionStudioRequest({ cpId: "STA-CP-004" }), true);
assert.equal(
  shared.isSta001QuestionStudioRequest({ topic: "Reasoning", subtopic: "Statement & Assumption" }),
  true,
);

for (const qlId of ALL_QLS) {
  for (const language of LANGUAGES) {
    const request = {
      packageId: "STA-001",
      canonicalProblemId: qlId,
      patternId: "BANK_4X5",
      language,
      count: 1,
      seed: `sta-post-merge:${qlId}:${language}`,
    } as const;

    const first = await shared.generateQuestion(request) as any;
    const replay = await shared.generateQuestion(request) as any;

    assert.equal(first.questions.length, 1);
    assert.equal(first.questionPackages.length, 1);
    assert.deepEqual(first.questions, replay.questions, `${qlId}/${language} must replay deterministically.`);

    assert.equal(first.generationContext.packageId, "STA-001");
    assert.equal(first.generationContext.qlId, qlId);
    assert.equal(first.generationContext.language, language);
    assert.equal(first.generationContext.lifecycleStatus, "REVIEW_ONLY");
    assert.equal(first.generationContext.multilingualChapterFrozen, true);
    assert.equal(first.generationContext.questionBankStatus, "NOT_STORED");
    assert.equal(first.generationContext.questionBankWritable, false);
    assert.equal(first.generationContext.testEligibility, "INELIGIBLE");
    assert.equal(first.generationContext.testEligible, false);
    assert.equal(first.generationContext.mockTestEligible, false);
    assert.equal(first.generationContext.publiclyPublishable, false);
    assert.equal(first.generationContext.automaticStudentPublication, false);
    assert.equal(first.generationContext.releaseFreezeStatus, "STA-001-V4-1-FROZEN");

    const payload = first.questions[0] as Record<string, any>;
    assert.equal(payload.packageId, "STA-001");
    assert.equal(payload.qlId, qlId);
    assert.equal(payload.candidateQlId, qlId);
    assert.equal(payload.permanentQlId, qlId);
    assert.equal(payload.language, language);
    assert.equal(payload.questionBankWritable, false);
    assert.equal(payload.testEligible, false);
    assert.equal(payload.mockTestEligible, false);
    assert.equal(payload.publiclyPublishable, false);
    assert.equal(payload.automaticStudentPublication, false);
    assert.equal(payload.releaseFreezeStatus, "STA-001-V4-1-FROZEN");
  }
}

const routeSource = readFileSync(
  new URL("../../../../routes/admin-question-studio-average.ts", import.meta.url),
  "utf8",
);
assert.match(routeSource, /const\s+staRequest\s*=\s*isSta001QuestionStudioRequest\(/u);
assert.match(routeSource, /staRequest\s*\?\s*"STA-001"/u);
assert.match(routeSource, /const\s+reasoningRequest\s*=\s*staRequest\s*\|\|\s*worRequest/u);
assert.ok(routeSource.includes("reasoning-v1-sta-001"));
assert.ok(routeSource.includes("generateQuestionStudioQuestions({"));
assert.ok(routeSource.includes("cpId,"));
assert.ok(routeSource.includes("questionLanguageId,"));

console.log("PASS_STA_001_POST_MERGE_CONTINUITY_GUARD");
