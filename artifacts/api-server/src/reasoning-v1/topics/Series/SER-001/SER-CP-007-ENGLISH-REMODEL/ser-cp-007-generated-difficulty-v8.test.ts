import assert from "node:assert/strict";
import { SER_CP007_TEMPLATE_PROBES_V71 } from "../SER-CP-007-AUTHORITY-FREEZE-CANDIDATE/authority-compression-contract-v7-1";
import type { SerCp007EditorialQuestion } from "./adaptive-review";
import { buildAdaptiveSerCp007ReviewV71Final } from "./adaptive-review-v7-1-final";
import { analyzeSerCp007GeneratedDifficultyV8 } from "./generated-instance-difficulty-v8";

type Row = {
  readonly templateId: string;
  readonly seed: number;
  readonly sourceRuleId: string;
  readonly taskKind: string;
  readonly difficulty: "EASY" | "MEDIUM" | "HARD";
  readonly maximumTermLength: number;
  readonly visibleCharacterLoad: number;
  readonly score: number;
};

const rows: Row[] = [];
const bySourceRule = new Map<string, Set<string>>();
const difficultyCounts = new Map<string, number>();

for (const probe of SER_CP007_TEMPLATE_PROBES_V71) {
  for (let seed = 1; seed <= 6; seed += 1) {
    const question = probe.generate(seed) as unknown as SerCp007EditorialQuestion;
    const review = buildAdaptiveSerCp007ReviewV71Final(question);
    const profile = analyzeSerCp007GeneratedDifficultyV8(question, review);

    assert.equal(review.difficulty, profile.difficulty, `${question.temporaryTemplateId}:${seed} did not use generated difficulty.`);
    assert.equal(profile.usesRuleIdentityAsDifficultyInput, false);
    assert.equal(profile.usesMagnitudeOrTermLengthAsPrimaryInput, false);
    assert.ok(profile.score >= 0);
    assert.ok(Object.values(profile.factors).every((value) => Number.isInteger(value) && value >= 0));
    assert.ok(profile.rowCount >= 1);
    assert.ok(profile.targetCount >= 1);

    rows.push({
      templateId: question.temporaryTemplateId,
      seed,
      sourceRuleId: question.sourceRuleId,
      taskKind: question.taskKind,
      difficulty: review.difficulty,
      maximumTermLength: review.maximumTermLength,
      visibleCharacterLoad: review.visibleCharacterLoad,
      score: profile.score,
    });

    if (!bySourceRule.has(question.sourceRuleId)) bySourceRule.set(question.sourceRuleId, new Set());
    bySourceRule.get(question.sourceRuleId)!.add(review.difficulty);
    difficultyCounts.set(review.difficulty, (difficultyCounts.get(review.difficulty) ?? 0) + 1);
  }
}

assert.equal(rows.length, SER_CP007_TEMPLATE_PROBES_V71.length * 6);
assert.ok(difficultyCounts.get("EASY"), "Generated difficulty produced no Easy instances.");
assert.ok(difficultyCounts.get("MEDIUM"), "Generated difficulty produced no Medium instances.");
assert.ok(difficultyCounts.get("HARD"), "Generated difficulty produced no Hard instances.");

const varyingRules = [...bySourceRule.entries()].filter(([, bands]) => bands.size >= 2);
assert.ok(
  varyingRules.length >= 3,
  `Difficulty still behaves too much like a source-rule label; only ${varyingRules.length} source rules span multiple bands.`,
);

const hardRows = rows.filter((row) => row.difficulty === "HARD");
const nonHardRows = rows.filter((row) => row.difficulty !== "HARD");
assert.ok(hardRows.length > 0 && nonHardRows.length > 0);
assert.ok(
  hardRows.some((hard) => nonHardRows.some((other) => other.maximumTermLength >= hard.maximumTermLength)),
  "Hard difficulty appears monotonic with maximum term length.",
);
assert.ok(
  hardRows.some((hard) => nonHardRows.some((other) => other.visibleCharacterLoad >= hard.visibleCharacterLoad)),
  "Hard difficulty appears monotonic with visible character load.",
);

const sameRuleDifferentTaskAndBand = [...bySourceRule.keys()].some((sourceRuleId) => {
  const sourceRows = rows.filter((row) => row.sourceRuleId === sourceRuleId);
  const tasks = new Set(sourceRows.map((row) => row.taskKind));
  const bands = new Set(sourceRows.map((row) => row.difficulty));
  return tasks.size >= 2 && bands.size >= 2;
});
assert.ok(sameRuleDifferentTaskAndBand, "Task/inference burden is not affecting difficulty within a shared rule family.");

console.log("SER-CP-007 generated-instance difficulty V8 audit passed.", {
  questionsAudited: rows.length,
  difficultyCounts: Object.fromEntries(difficultyCounts),
  varyingSourceRules: varyingRules.map(([sourceRuleId, bands]) => ({ sourceRuleId, bands: [...bands] })),
  minimumHardTermLength: Math.min(...hardRows.map((row) => row.maximumTermLength)),
  maximumNonHardTermLength: Math.max(...nonHardRows.map((row) => row.maximumTermLength)),
  minimumHardVisibleLoad: Math.min(...hardRows.map((row) => row.visibleCharacterLoad)),
  maximumNonHardVisibleLoad: Math.max(...nonHardRows.map((row) => row.visibleCharacterLoad)),
});
