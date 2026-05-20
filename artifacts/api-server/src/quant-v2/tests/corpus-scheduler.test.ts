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
  extractCorpusSchedulerMetadata,
  generateScheduledQuestion,
  summarizeCorpusScheduler,
  type CorpusSchedulerProfileId,
} from "../corpus-scheduler/corpus-scheduler";
import { evaluateCorpusQuality } from "../corpus-scheduler/corpus-quality-evaluator";

const MOCK_SET_COUNT = 100;
const AUDIT_COUNT = 20000;

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
      examProfile: profileId === "banking_mock" ? "banking" : "ssc",
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
      price_consumption: 3,
      salary_revision: 2,
      single_relation: 2,
      two_step_relation_chain: 3,
      mixture_percentage: 3,
      reverse_percentage: 3,
      restore_original: 3,
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

export {};
