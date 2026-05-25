import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import type { Pattern } from "../../lib/core/generator-engine";
import { createQuantV2PercentageQuestionCandidate } from "../../lib/quant-v2/percentage-admin-adapter";
import { runCorpusAuditExport } from "../corpus-audit/corpus-audit-exporter";
import {
  createCorpusSchedulerState,
  assessCorpusSchedulerCandidate,
  extractCorpusSchedulerMetadata,
  generateScheduledQuestion,
  interleaveScheduledPreviewQuestions,
  summarizeCorpusScheduler,
  type CorpusSchedulerProfileId,
} from "../corpus-scheduler/corpus-scheduler";
import { evaluateCorpusQuality } from "../corpus-scheduler/corpus-quality-evaluator";

const MOCK_SET_COUNT = 100;
const AUDIT_COUNT = 20000;
const PRODUCTION_ADVANCED_FAMILIES = new Set([
  "perc_geom_dimensional_scale",
  "perc_demo_cross_tab_literacy",
  "perc_budget_cascading_remainder",
  "perc_const_absolute_offset",
  "perc_exam_weighted_aggregate",
  "perc_asset_variable_depreciation",
  "perc_workforce_hierarchical_attrition",
  "perc_agri_land_yield_compound",
  "perc_demo_multi_factor_growth",
  "perc_comm_tiered_salary_override",
  "perc_asset_compound_leakage",
  "perc_num_linear_equation_balancing",
  "perc_num_fractional_perturbation_complex",
  "perc_tax_bracket_retained_income",
  "perc_num_square_proportional_delta",
  "perc_mix_alloy_replacement",
]);

const percentagePattern: Pattern = {
  id: "r7-corpus-scheduler-percentage",
  type: "formula",
  section: "Quant",
  topic: "percentage",
  subtopic: "percentage",
  difficulty: "Medium",
  templateVariants: ["R7 corpus scheduler percentage pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-percentage",
};

function generateSet(profileId: CorpusSchedulerProfileId, count: number, seed: string) {
  const state = createCorpusSchedulerState({
    targetCount: count,
    profileId,
  });
  const questions = [];

  for (let index = 0; index < count; index += 1) {
    const { question, assessment } = generateScheduledQuestion({
      state,
      index,
      seedPrefix: seed,
      examProfile: profileId === "banking_mock" ? "ibps" : "ssc",
      generate: (options) =>
        createQuantV2PercentageQuestionCandidate(percentagePattern, options),
    });

    assert.ok(question.text.length > 8);
    assert.ok(Number.isFinite(assessment.score));
    questions.push(question);
  }

  const summary = summarizeCorpusScheduler(state);
  const quality = evaluateCorpusQuality(summary);
  return { questions, summary, quality };
}

function previewFamilies(questions: any[], seed: string) {
  return interleaveScheduledPreviewQuestions(
    questions,
    seed,
    (question) => extractCorpusSchedulerMetadata(question).familyKey,
  )
    .slice(0, 6)
    .map((question) => extractCorpusSchedulerMetadata(question).familyKey);
}

function macroFamily(family: string) {
  return /relation|reverse_relation|relational_chain|inverse_percentage/u.test(family)
    ? "relation_macro"
    : family;
}

test("corpus scheduler balances 100-question mock sets across exam profiles", () => {
  const previousFlag = process.env.QUANT_V2_PERCENTAGE_ENABLED;
  process.env.QUANT_V2_PERCENTAGE_ENABLED = "1";

  try {
    const profiles: CorpusSchedulerProfileId[] = [
      "ssc_mock",
      "banking_mock",
      "railway_mock",
      "punjab_state_mock",
      "balanced_mock",
    ];

    for (const profileId of profiles) {
      const { summary, quality } = generateSet(
        profileId,
        MOCK_SET_COUNT,
        `r7-mock:${profileId}`,
      );

      assert.equal(summary.acceptedCount, MOCK_SET_COUNT);
      assert.ok(
        Object.keys(summary.examinerIntentDistribution).length >= 5,
        JSON.stringify(summary.examinerIntentDistribution),
      );
      assert.ok(
        Object.keys(summary.topologyGroupDistribution).length >= 4,
        JSON.stringify(summary.topologyGroupDistribution),
      );
      assert.ok(
        summary.duplicateRisk.repeatedFingerprintShare <= 0.55,
        JSON.stringify(summary.duplicateRisk),
      );
      assert.ok(quality.score >= 58, JSON.stringify(quality));
      assert.notEqual(quality.tier, "C", JSON.stringify(quality));
    }
  } finally {
    if (previousFlag === undefined) {
      delete process.env.QUANT_V2_PERCENTAGE_ENABLED;
    } else {
      process.env.QUANT_V2_PERCENTAGE_ENABLED = previousFlag;
    }
  }
});

test("corpus scheduler enforces small-batch family caps for percentage sets", () => {
  const previousFlag = process.env.QUANT_V2_PERCENTAGE_ENABLED;
  process.env.QUANT_V2_PERCENTAGE_ENABLED = "1";

  try {
    const { questions } = generateSet("ssc_mock", 50, "r7-small-family-caps");
    const counts: Record<string, number> = {};
    for (const question of questions) {
      const family = extractCorpusSchedulerMetadata(question).familyKey;
      counts[family] = (counts[family] ?? 0) + 1;
    }

    const caps: Record<string, number> = {
      election_margin: 5,
      price_consumption: 3,
      salary_revision: 2,
      single_relation: 0,
      two_step_relation_chain: 4,
      mixture_percentage: 3,
      reverse_percentage: 3,
      restore_original: 3,
      venn_diagram: 3,
      commission: 4,
      taxation: 2,
      population_growth: 4,
      pass_fail: 4,
    };

    for (const [family, cap] of Object.entries(caps)) {
      assert.ok(
        (counts[family] ?? 0) <= cap,
        `${family} exceeded cap ${cap}: ${JSON.stringify(counts)}`,
      );
    }
  } finally {
    if (previousFlag === undefined) {
      delete process.env.QUANT_V2_PERCENTAGE_ENABLED;
    } else {
      process.env.QUANT_V2_PERCENTAGE_ENABLED = previousFlag;
    }
  }
});

test("corpus scheduler hard-rejects final rendered cross-topology duplicates", () => {
  const previousFlag = process.env.QUANT_V2_PERCENTAGE_ENABLED;
  process.env.QUANT_V2_PERCENTAGE_ENABLED = "1";

  try {
    const state = createCorpusSchedulerState({
      targetCount: 60,
      profileId: "balanced_mock",
    });
    const first = generateScheduledQuestion({
      state,
      index: 0,
      seedPrefix: "duplicate-fingerprint-guard",
      examProfile: "ssc",
      generate: (options) =>
        createQuantV2PercentageQuestionCandidate(percentagePattern, options),
    }).question;
    const duplicateAssessment = assessCorpusSchedulerCandidate({
      state,
      question: {
        ...first,
        debugMetadata: {
          ...first.debugMetadata,
          quantV2: {
            ...(first.debugMetadata?.quantV2 as any),
            topology: {
              family: "reverse_relation",
              variant: "reverse_relation_inference",
            },
          },
        },
      },
      index: 1,
    });

    assert.equal(duplicateAssessment.accepted, false);
    assert.ok(duplicateAssessment.reasons.includes("final rendered duplicate"));
  } finally {
    if (previousFlag === undefined) {
      delete process.env.QUANT_V2_PERCENTAGE_ENABLED;
    } else {
      process.env.QUANT_V2_PERCENTAGE_ENABLED = previousFlag;
    }
  }
});

test("scheduled percentage preview window is varied and seed-stable", () => {
  const previousFlag = process.env.QUANT_V2_PERCENTAGE_ENABLED;
  process.env.QUANT_V2_PERCENTAGE_ENABLED = "1";

  try {
    const setA = generateSet("balanced_mock", 60, "scheduler-preview-a").questions;
    const first = previewFamilies(setA, "scheduler-preview-a");
    const firstAgain = previewFamilies(setA, "scheduler-preview-a");
    const second = previewFamilies(
      generateSet("balanced_mock", 60, "scheduler-preview-b").questions,
      "scheduler-preview-b",
    );
    const third = previewFamilies(
      generateSet("balanced_mock", 60, "scheduler-preview-c").questions,
      "scheduler-preview-c",
    );

    for (const families of [first, second, third]) {
      assert.ok(new Set(families).size >= 4, families.join(", "));
      assert.ok(
        new Set(families.slice(0, 3).map(macroFamily)).size > 1,
        families.join(", "),
      );
    }
    assert.deepEqual(firstAgain, first);
    assert.notDeepEqual(second, first);
    assert.notDeepEqual(third, second);
  } finally {
    if (previousFlag === undefined) {
      delete process.env.QUANT_V2_PERCENTAGE_ENABLED;
    } else {
      process.env.QUANT_V2_PERCENTAGE_ENABLED = previousFlag;
    }
  }
});

test("corpus scheduler remains stable on a large audit corpus", () => {
  const previousFlag = process.env.QUANT_V2_PERCENTAGE_ENABLED;
  process.env.QUANT_V2_PERCENTAGE_ENABLED = "1";

  try {
    const { summary, quality } = generateSet(
      "balanced_mock",
      AUDIT_COUNT,
      "r7-large-audit",
    );

    assert.equal(summary.acceptedCount, AUDIT_COUNT);
    assert.ok(
      summary.topologyGroupDistribution.relational >= AUDIT_COUNT * 0.12,
      JSON.stringify(summary.topologyGroupDistribution),
    );
    assert.ok(
      summary.topologyGroupDistribution.reverse_logic >= AUDIT_COUNT * 0.1,
      JSON.stringify(summary.topologyGroupDistribution),
    );
    assert.ok(
      summary.topologyGroupDistribution.hybrid >= AUDIT_COUNT * 0.1,
      JSON.stringify(summary.topologyGroupDistribution),
    );
    assert.ok(
      Object.keys(summary.semanticAnchorDistribution).length >= 8,
      JSON.stringify(summary.semanticAnchorDistribution),
    );
    assert.ok(quality.score >= 58, JSON.stringify(quality));
  } finally {
    if (previousFlag === undefined) {
      delete process.env.QUANT_V2_PERCENTAGE_ENABLED;
    } else {
      process.env.QUANT_V2_PERCENTAGE_ENABLED = previousFlag;
    }
  }
});

test("corpus scheduler metadata is exported in audit summaries", async () => {
  const outDir = await mkdtemp(path.join(os.tmpdir(), "quant-v2-r7-scheduler-"));

  try {
    const result = await runCorpusAuditExport({
      count: 60,
      outDir,
      presetId: "ssc_percentage_audit",
      exportProfile: "topology_audit",
      useScheduler: true,
      schedulerProfile: "banking_mock",
      includeSvg: false,
    });
    const summary = JSON.parse(
      await readFile(result.files.summary, "utf8"),
    ) as typeof result.summary;

    assert.equal(summary.scheduler?.profileId, "banking_mock");
    assert.equal(summary.scheduler?.acceptedCount, 60);
    assert.ok(
      (summary.scheduler?.familyDistribution?.election_margin ?? 0) <= 5,
      JSON.stringify(summary.scheduler?.familyDistribution ?? {}),
    );
    assert.ok(summary.corpusQuality);
    assert.ok(summary.corpusQuality.score >= 50);
    assert.ok(
      Object.keys(summary.scheduler?.examinerIntentDistribution ?? {}).length >= 3,
      JSON.stringify(summary.scheduler?.examinerIntentDistribution ?? {}),
    );
  } finally {
    await rm(outDir, {
      recursive: true,
      force: true,
    });
  }
});

test("scheduled percentage audit batches cap election family and force advanced production variety", async () => {
  const outDir = await mkdtemp(path.join(os.tmpdir(), "quant-v2-election-cap-"));

  try {
    const result = await runCorpusAuditExport({
      count: 60,
      outDir,
      presetId: "ssc_percentage_audit",
      exportProfile: "multilingual_review",
      useScheduler: true,
      schedulerProfile: "balanced_mock",
      includeMultilingualExplanations: true,
      includeSvg: false,
    });
    const summary = JSON.parse(
      await readFile(result.files.summary, "utf8"),
    ) as typeof result.summary;
    const families = summary.scheduler?.familyDistribution ?? {};
    const electionCount = families.election_margin ?? 0;
    const advancedCounts = Object.entries(families).filter(([family]) =>
      PRODUCTION_ADVANCED_FAMILIES.has(family),
    );
    const advancedCount = advancedCounts.reduce((sum, [, count]) => sum + count, 0);
    const distinctAdvancedCount = advancedCounts.filter(([, count]) => count > 0).length;

    assert.ok(
      electionCount <= 5,
      `election family exceeded 5-question cap: ${electionCount}`,
    );
    assert.ok(
      advancedCount >= 10,
      `advanced production count below 10: ${advancedCount}; ${JSON.stringify(families)}`,
    );
    assert.ok(
      distinctAdvancedCount >= 8,
      `advanced distinct family count below 8: ${distinctAdvancedCount}; ${JSON.stringify(families)}`,
    );
    for (const [family, count] of Object.entries(families)) {
      if (family !== "unknown") {
        assert.ok(count <= 4 || family === "election_margin" || PRODUCTION_ADVANCED_FAMILIES.has(family), `family exceeded production cap: ${family}=${count}`);
      }
    }
  } finally {
    await rm(outDir, {
      recursive: true,
      force: true,
    });
  }
});

test("advanced coverage profile bypasses density caps and covers pass B/C motifs", async () => {
  const outDir = await mkdtemp(path.join(os.tmpdir(), "quant-v2-advanced-coverage-"));

  try {
    const result = await runCorpusAuditExport({
      count: 100,
      outDir,
      presetId: "percentage_advanced_coverage_audit",
      exportProfile: "multilingual_review",
      useScheduler: true,
      schedulerProfile: "advanced_coverage_audit",
      includeMultilingualExplanations: true,
      includeSvg: false,
    });
    const corpus = JSON.parse(await readFile(result.files.json, "utf8")) as any[];
    const subtypes = new Set(
      corpus.map((sample) => String(sample.id ?? "").split("|")[0]),
    );

    assert.equal(corpus.length, 100);
    for (const subtype of [
      "perc_geom_dimensional_scale",
      "perc_demo_cross_tab_literacy",
      "perc_budget_cascading_remainder",
      "perc_const_absolute_offset",
      "perc_exam_weighted_aggregate",
      "perc_asset_variable_depreciation",
      "perc_workforce_hierarchical_attrition",
      "perc_elect_three_candidate_forfeiture",
      "perc_agri_land_yield_compound",
      "perc_demo_multi_factor_growth",
      "perc_comm_tiered_salary_override",
      "perc_asset_compound_leakage",
      "perc_num_linear_equation_balancing",
      "perc_num_fractional_perturbation_complex",
      "perc_tax_bracket_retained_income",
      "perc_num_square_proportional_delta",
      "perc_mix_alloy_replacement",
    ]) {
      assert.ok(subtypes.has(subtype), `missing advanced subtype ${subtype}`);
    }
  } finally {
    await rm(outDir, {
      recursive: true,
      force: true,
    });
  }
});

export {};
