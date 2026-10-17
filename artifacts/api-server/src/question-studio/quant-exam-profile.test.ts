import assert from "node:assert/strict";
import test from "node:test";

import {
  allocateQuantDifficultyCounts,
  buildQuantExamProfilePlan,
  resolveQuantExamProfile,
  scoreQuantQuestionForProfile,
} from "./quant-exam-profile";

test("resolves known exam aliases and keeps the existing fallback", () => {
  assert.equal(resolveQuantExamProfile("IBPS PO Prelims").id, "IBPS_PO_PRE");
  assert.equal(resolveQuantExamProfile("punjab psssb clerk").id, "PUNJAB_PSSSB_CLERK");
  assert.equal(resolveQuantExamProfile("unknown exam").id, "SSC_CGL_T1");
});

test("allocates mixed difficulty counts exactly", () => {
  assert.deepEqual(
    allocateQuantDifficultyCounts(10, { Easy: 20, Medium: 50, Hard: 30 }),
    { Easy: 2, Medium: 5, Hard: 3 },
  );
});

test("builds an exact mixed plan across multiple selected CPs", () => {
  const plan = buildQuantExamProfilePlan({
    exam: "SSC CGL Tier 1",
    requestedDifficulty: "Mixed",
    difficultyDistribution: { Easy: 20, Medium: 50, Hard: 30 },
    count: 10,
    seed: "mixed-multi-cp",
    selectedCpIds: ["CP-001", "CP-002", "CP-003"],
  });

  assert.equal(plan.mixed, true);
  assert.deepEqual(plan.difficultyCounts, { Easy: 2, Medium: 5, Hard: 3 });
  assert.deepEqual(plan.cpCounts, {
    "CP-001": 4,
    "CP-002": 3,
    "CP-003": 3,
  });

  const total = plan.assignments.reduce((sum, entry) => sum + entry.count, 0);
  assert.equal(total, 10);

  const byDifficulty = { Easy: 0, Medium: 0, Hard: 0 };
  const byCp = new Map<string, number>();
  for (const assignment of plan.assignments) {
    byDifficulty[assignment.difficulty] += assignment.count;
    const cpId = assignment.cpId ?? "__chapter_mix__";
    byCp.set(cpId, (byCp.get(cpId) ?? 0) + assignment.count);
  }

  assert.deepEqual(byDifficulty, { Easy: 2, Medium: 5, Hard: 3 });
  assert.equal(byCp.get("CP-001"), 4);
  assert.equal(byCp.get("CP-002"), 3);
  assert.equal(byCp.get("CP-003"), 3);
});

test("rejects a batch smaller than the selected CP count", () => {
  assert.throws(
    () => buildQuantExamProfilePlan({
      exam: "SSC CGL",
      requestedDifficulty: "Medium",
      count: 2,
      seed: "too-small",
      selectedCpIds: ["CP-1", "CP-2", "CP-3"],
    }),
    /Question count must be at least the number of selected CPs/,
  );
});

test("keeps exam-profile context scoring semantics", () => {
  const profile = resolveQuantExamProfile("IBPS PO Prelims");
  const finance = scoreQuantQuestionForProfile(
    { text: "An account has income, expenditure and profit values 1200, 800 and 400." },
    profile,
  );
  const votes = scoreQuantQuestionForProfile(
    { text: "A candidate received 1200 votes out of 2000 votes." },
    profile,
  );
  assert.ok(finance > votes);
});


test("GEO-001 source-aware mixed CP plan never assigns unsupported Hard", () => {
  const plan = buildQuantExamProfilePlan({
    exam: "SSC CGL Tier 1", requestedDifficulty: "Mixed", count: 3,
    selectedCpIds: ["GEO-CP-001"], seed: "qs197-geo001-cp001-regression",
    supportedDifficultiesByCp: { "GEO-CP-001": ["Easy", "Medium"] },
  });
  assert.equal(plan.sourceDifficultyConstrained, true);
  assert.equal(plan.difficultyCounts.Hard, 0);
  assert.equal(plan.assignments.reduce((sum, a) => sum + a.count, 0), 3);
  assert.ok(plan.assignments.every(a => a.cpId === "GEO-CP-001" && a.difficulty !== "Hard"));
  assert.deepEqual(plan.cpCounts, { "GEO-CP-001": 3 });
});

test("source-constrained mixed batches respect distinct CP eligibility", () => {
  const plan = buildQuantExamProfilePlan({
    requestedDifficulty: "Mixed", count: 6, seed: "source-two-cps",
    selectedCpIds: ["CP-EASY", "CP-HARD"],
    supportedDifficultiesByCp: { "CP-EASY": ["Easy"], "CP-HARD": ["Hard"] },
  });
  assert.equal(plan.difficultyCounts.Easy, 3);
  assert.equal(plan.difficultyCounts.Hard, 3);
  assert.equal(plan.difficultyCounts.Medium, 0);
  assert.ok(plan.assignments.every(a => a.difficulty === (a.cpId === "CP-EASY" ? "Easy" : "Hard")));
});

test("explicit unsupported difficulty is rejected rather than silently relabeled", () => {
  assert.throws(() => buildQuantExamProfilePlan({
    requestedDifficulty: "Hard", count: 1, seed: "source-explicit-hard",
    selectedCpIds: ["GEO-CP-001"],
    supportedDifficultiesByCp: { "GEO-CP-001": ["Easy", "Medium"] },
  }), (error: any) => error.code === "SOURCE_DIFFICULTY_UNAVAILABLE");
});

test("source-constrained input cannot invent missing CP availability", () => {
  assert.throws(() => buildQuantExamProfilePlan({
    requestedDifficulty: "Mixed", count: 1, seed: "source-missing-cp",
    selectedCpIds: ["UNKNOWN"], supportedDifficultiesByCp: {},
  }), (error: any) => error.code === "SOURCE_DIFFICULTY_UNAVAILABLE");
});
