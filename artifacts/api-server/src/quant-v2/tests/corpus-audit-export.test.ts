import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  getCorpusAuditJob,
  runCorpusAuditExport,
  startCorpusAuditExportJob,
} from "../corpus-audit/corpus-audit-exporter";
import { validateCorpusAuditBatch } from "../validators/corpus-audit-validator";

test("corpus audit export writes JSON, TXT, and summary artifacts", async () => {
  const outDir = await mkdtemp(path.join(os.tmpdir(), "quant-v2-corpus-audit-"));

  try {
    const result = await runCorpusAuditExport({
      count: 50,
      outDir,
      presetId: "ssc_percentage_audit",
      seed: "corpus-audit-export-test",
      includeSvg: false,
    });

    assert.equal(result.count, 50);
    assert.equal(result.summary.generatedCount, 50);
    assert.ok(result.files.json.endsWith("corpus.json"));
    assert.ok(result.files.txt.endsWith("corpus.txt"));
    assert.ok(result.files.summary.endsWith("audit-summary.json"));

    const corpus = JSON.parse(await readFile(result.files.json, "utf8")) as any[];
    const txt = await readFile(result.files.txt, "utf8");
    const summary = JSON.parse(await readFile(result.files.summary, "utf8")) as typeof result.summary;

    assert.equal(corpus.length, 50);
    assert.ok(txt.includes("[Q1]"));
    assert.equal(corpus[0].explanationHi, undefined);
    assert.equal(corpus[0].multilingual.hi.explanation, undefined);
    assert.equal(summary.generatedCount, 50);
    assert.equal(summary.exportProfile, "audit_light");
    assert.equal(summary.includeMultilingualExplanations, false);
    assert.ok(Object.keys(summary.subtypeDistribution).length >= 3);
    assert.ok(summary.multilingualConsistency.hindiCoverage >= 0.98);
    assert.ok(summary.multilingualConsistency.punjabiCoverage >= 0.98);

    const validation = validateCorpusAuditBatch({
      samples: corpus,
      summary,
    });
    assert.equal(validation.valid, true, validation.issues.join(" | "));
  } finally {
    await rm(outDir, {
      recursive: true,
      force: true,
    });
  }
});

test("multilingual review profile exports Hindi and Punjabi explanations", async () => {
  const outDir = await mkdtemp(path.join(os.tmpdir(), "quant-v2-corpus-audit-multi-"));

  try {
    const result = await runCorpusAuditExport({
      count: 25,
      outDir,
      presetId: "ssc_percentage_audit",
      exportProfile: "multilingual_review",
      includeSvg: false,
    });

    const corpus = JSON.parse(await readFile(result.files.json, "utf8")) as any[];
    const txt = await readFile(result.files.txt, "utf8");
    const summary = JSON.parse(await readFile(result.files.summary, "utf8")) as typeof result.summary;

    assert.equal(summary.exportProfile, "multilingual_review");
    assert.equal(summary.includeMultilingualExplanations, true);
    assert.ok(corpus[0].explanationHi.length > 5);
    assert.ok(corpus[0].explanationPa.length > 5);
    assert.ok(corpus[0].multilingual.hi.explanation.length > 5);
    assert.ok(txt.includes("Explanation HI:"));
    assert.ok(summary.multilingualConsistency.hindiExplanationCoverage >= 0.98);
    assert.ok(summary.multilingualConsistency.punjabiExplanationCoverage >= 0.98);
  } finally {
    await rm(outDir, {
      recursive: true,
      force: true,
    });
  }
});

test("scheduled multilingual percentage export blocks final polish regressions", async () => {
  const outDir = await mkdtemp(path.join(os.tmpdir(), "quant-v2-final-polish-"));

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
    const corpus = JSON.parse(await readFile(result.files.json, "utf8")) as any[];
    const summary = JSON.parse(await readFile(result.files.summary, "utf8")) as typeof result.summary;
    const electionCount = summary.scheduler?.familyDistribution?.election_margin ?? 0;
    const mechanicalRelationRe =
      /Apply the next relation|Relation index|Final value index|topology|graph/iu;
    const genericRelationHiRe = /अंतिम मान/u;
    const genericRelationPaRe = /ਅੰਤਿਮ ਮੁੱਲ/u;
    const genericMixtureRe =
      /अपरिवर्तित मात्रा|स्थिर मात्रा|ਅਣਬਦਲੀ ਮਾਤਰਾ|ਸਥਿਰ ਮਾਤਰਾ/u;

    assert.equal(corpus.length, 60);
    assert.ok(electionCount <= 12, `election count ${electionCount}`);

    for (const sample of corpus) {
      const subtype = String(sample.id ?? "").split("|")[0];
      if (subtype === "relational_percentage") {
        assert.equal(mechanicalRelationRe.test(sample.explanation), false, sample.explanation);
        assert.equal(genericRelationHiRe.test(sample.explanationHi), false, sample.explanationHi);
        assert.equal(genericRelationPaRe.test(sample.explanationPa), false, sample.explanationPa);
      }
      if (subtype === "mixture_percentage") {
        assert.equal(genericMixtureRe.test(sample.explanationHi), false, sample.explanationHi);
        assert.equal(genericMixtureRe.test(sample.explanationPa), false, sample.explanationPa);
      }
    }
  } finally {
    await rm(outDir, {
      recursive: true,
      force: true,
    });
  }
});

test("corpus audit background job exposes progressive status", async () => {
  const outDir = await mkdtemp(path.join(os.tmpdir(), "quant-v2-corpus-audit-job-"));

  try {
    const job = startCorpusAuditExportJob({
      count: 20,
      outDir,
      presetId: "banking_relational_audit",
      includeSvg: false,
    });

    assert.equal(job.status, "queued");

    let snapshot = getCorpusAuditJob(job.id);
    for (let attempt = 0; attempt < 60; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      snapshot = getCorpusAuditJob(job.id);
      if (snapshot?.status === "completed" || snapshot?.status === "failed") {
        break;
      }
    }

    assert.ok(snapshot);
    assert.equal(snapshot.status, "completed", snapshot.errorMessage);
    assert.equal(snapshot.generatedCount, 20);
    assert.equal(snapshot.progress, 1);
    assert.ok(snapshot.files?.json.endsWith("corpus.json"));
  } finally {
    await rm(outDir, {
      recursive: true,
      force: true,
    });
  }
});

test("corpus audit pipeline can stress-generate 20000 samples without materializing an API payload", async () => {
  const outDir = await mkdtemp(path.join(os.tmpdir(), "quant-v2-corpus-audit-stress-"));

  try {
    const result = await runCorpusAuditExport({
      count: 20000,
      outDir,
      presetId: "difficulty_distribution_audit",
      seed: "corpus-audit-stress-test",
      includeSvg: false,
      batchSize: 1000,
    });

    assert.equal(result.count, 20000);
    assert.equal(result.summary.generatedCount, 20000);
    assert.ok(Object.keys(result.summary.topologyDistribution).length >= 5);
    assert.ok(Object.keys(result.summary.difficultyDistribution).length >= 2);
    assert.ok(result.summary.multilingualConsistency.hindiCoverage >= 0.98);
    assert.ok(result.summary.multilingualConsistency.punjabiCoverage >= 0.98);
  } finally {
    await rm(outDir, {
      recursive: true,
      force: true,
    });
  }
});

export {};
