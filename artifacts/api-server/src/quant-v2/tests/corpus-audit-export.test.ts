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

function numericAnswer(sample: any) {
  const match = String(sample.answer ?? sample.options?.[sample.correct] ?? "").match(/-?\d+(?:\.\d+)?/u);
  return match ? Number(match[0]) : undefined;
}

function closeEnough(a: number | undefined, b: number) {
  return typeof a === "number" && Math.abs(a - b) <= 0.01;
}

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
    const taxationCount = summary.scheduler?.familyDistribution?.taxation ?? 0;
    const productionAdvancedFamilies = new Set([
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
    const familyDistribution = summary.scheduler?.familyDistribution ?? {};
    const advancedCounts = Object.entries(familyDistribution).filter(([family]) =>
      productionAdvancedFamilies.has(family),
    );
    const advancedCount = advancedCounts.reduce((sum, [, count]) => sum + count, 0);
    const distinctAdvancedCount = advancedCounts.filter(([, count]) => count > 0).length;
    const mechanicalRelationRe =
      /Apply the next relation|Relation index|Final value index|topology|graph/iu;
    const genericRelationHiRe = /अंतिम मान/u;
    const genericRelationPaRe = /ਅੰਤਿਮ ਮੁੱਲ/u;
    const genericMixtureRe =
      /अपरिवर्तित मात्रा|स्थिर मात्रा|ਅਣਬਦਲੀ ਮਾਤਰਾ|ਸਥਿਰ ਮਾਤਰਾ/u;
    const salaryLeakRe = /वेतन|तਨਖਾਹ|salary/iu;
    let trivialRelationCount = 0;

    assert.equal(corpus.length, 60);
    assert.ok(electionCount <= 5, `election count ${electionCount}`);
    assert.ok(taxationCount <= 2, `taxation count ${taxationCount}`);
    assert.ok(advancedCount >= 10, `advanced count ${advancedCount}: ${JSON.stringify(familyDistribution)}`);
    assert.ok(distinctAdvancedCount >= 8, `distinct advanced count ${distinctAdvancedCount}: ${JSON.stringify(familyDistribution)}`);
    for (const [family, count] of Object.entries(familyDistribution)) {
      assert.ok(
        count <= 4 || family === "election_margin" || productionAdvancedFamilies.has(family),
        `single family exceeded cap: ${family}=${count}`,
      );
    }

    for (const sample of corpus) {
      const subtype = String(sample.id ?? "").split("|")[0];
      const combinedExplanations = [
        sample.explanation,
        sample.explanationHi,
        sample.explanationPa,
      ].join("\n");
      assert.equal(/undefined/u.test(combinedExplanations), false, combinedExplanations);
      assert.equal(
        /कुल मान|ਕੁੱਲ ਮਾਤਰਾ|अंतिम मान|ਅੰਤਿਮ ਮੁੱਲ|आवश्यक अंतर|ਲੋੜੀਂਦਾ ਅੰਤਰ/u.test(combinedExplanations),
        false,
        combinedExplanations,
      );
      const optionNumbers = (sample.options ?? [])
        .map((opt: string) => {
          const m = String(opt).match(/-?\d+(?:\.\d+)?/u);
          return m ? Number(m[0]) : undefined;
        })
        .filter((n: number | undefined): n is number => Number.isFinite(n));
      const answerNumber = numericAnswer(sample);
      for (const opt of optionNumbers) {
        if (Number.isFinite(answerNumber) && !closeEnough(opt, answerNumber ?? NaN)) {
          if ((answerNumber ?? 0) > 0) {
            assert.notEqual(opt, 0, `positive-answer distractor cannot be zero: ${sample.question}`);
          }
          if ((answerNumber ?? 0) > 0 && !/%/.test(String(sample.answer))) {
            assert.ok(
              opt >= (answerNumber ?? 0) * 0.05 && opt <= (answerNumber ?? 0) * 20,
              `distractor scale mismatch: ${opt} vs ${answerNumber}; ${sample.question}`,
            );
          }
        }
      }
      if (subtype === "relational_percentage") {
        assert.equal(mechanicalRelationRe.test(sample.explanation), false, sample.explanation);
        assert.equal(genericRelationHiRe.test(sample.explanationHi), false, sample.explanationHi);
        assert.equal(genericRelationPaRe.test(sample.explanationPa), false, sample.explanationPa);
        if (/Find by what percent A's income is more or less than B's income/iu.test(sample.question)) {
          trivialRelationCount += 1;
        }
      }
      if (subtype === "mixture_percentage") {
        assert.equal(genericMixtureRe.test(sample.explanationHi), false, sample.explanationHi);
        assert.equal(genericMixtureRe.test(sample.explanationPa), false, sample.explanationPa);
      }
      if (subtype === "price_consumption") {
        const sameExpenditure = /total expenditure is kept the same/iu.test(sample.question);
        const partialExpenditure = /increase its total expenditure by only/iu.test(sample.question);
        const priceRate = Number(/increased by ([\d.]+)%/iu.exec(sample.question)?.[1]);
        if (sameExpenditure && Number.isFinite(priceRate)) {
          assert.ok(
            closeEnough(numericAnswer(sample), priceRate * 100 / (100 + priceRate)),
            `bad same-expenditure price-consumption answer: ${JSON.stringify({ question: sample.question, answer: sample.answer })}`,
          );
        }
        if (partialExpenditure) {
          assert.ok(
            /consumption index|new consumption index/iu.test(sample.explanation),
            `price-consumption explanation missing consumption index step: ${sample.explanation}`,
          );
        }
        if (/original price per kg/iu.test(sample.question)) {
          assert.ok(/sugar/iu.test(sample.question), sample.question);
          assert.ok(/चीनी/u.test(sample.multilingual?.hi?.question ?? ""), sample.multilingual?.hi?.question ?? "");
          assert.ok(/ਚੀਨੀ/u.test(sample.multilingual?.pa?.question ?? ""), sample.multilingual?.pa?.question ?? "");
          assert.ok(/Original price per kg/iu.test(sample.explanation), sample.explanation);
          const expenditure = Number(
            sample.semanticMetadata?.problem?.variables?.totalExpenditure ??
              /₹(\d+(?:\.\d+)?)/u.exec(sample.question)?.[1],
          );
          const reduction = Number(
            sample.semanticMetadata?.problem?.variables?.quantityDifference ??
              /buy\s+(\d+(?:\.\d+)?)\s+kg less/iu.exec(sample.question)?.[1],
          );
          assert.ok(Number.isFinite(expenditure), sample.question);
          assert.ok(new RegExp(`${expenditure}\\s*/\\s*x`, "iu").test(sample.explanation), sample.explanation);
          assert.ok(new RegExp(`${expenditure}\\s*/\\s*x`, "iu").test(sample.explanationHi), sample.explanationHi);
          assert.ok(new RegExp(`${expenditure}\\s*/\\s*x`, "iu").test(sample.explanationPa), sample.explanationPa);
          assert.equal(/expenditure\s*\/\s*x|newPriceIndex/iu.test(sample.explanation), false, sample.explanation);
          assert.equal(/expenditure\s*\/\s*x|newPriceIndex|Let original price per kg = x/iu.test(sample.explanationHi), false, sample.explanationHi);
          assert.equal(/expenditure\s*\/\s*x|newPriceIndex|Let original price per kg = x/iu.test(sample.explanationPa), false, sample.explanationPa);
          assert.equal(new RegExp(`मूल कीमत प्रति किग्रा\\s*=\\s*${reduction}`, "u").test(sample.explanationHi), false, sample.explanationHi);
          assert.equal(new RegExp(`ਮੂਲ ਕੀਮਤ ਪ੍ਰਤੀ ਕਿਲੋਗ੍ਰਾਮ\\s*=\\s*${reduction}`, "u").test(sample.explanationPa), false, sample.explanationPa);
          assert.equal(/Expenditure per unit difference/iu.test(sample.explanation), false, sample.explanation);
          assert.ok(/मूल कीमत प्रति किग्रा/u.test(sample.explanationHi), sample.explanationHi);
          assert.ok(/ਮੂਲ ਕੀਮਤ ਪ੍ਰਤੀ ਕਿਲੋਗ੍ਰਾਮ/u.test(sample.explanationPa), sample.explanationPa);
          assert.equal(/consumption reduction\s*=/iu.test(sample.explanation), false, sample.explanation);
          const options = (sample.options ?? [])
            .map((opt: string) => {
              const m = String(opt).match(/-?\d+(?:\.\d+)?/u);
              return m ? Number(m[0]) : undefined;
            })
            .filter((n: number | undefined): n is number => Number.isFinite(n));
          for (const opt of options) {
            assert.ok(opt > 0, `original price options must be positive: ${opt}`);
          }
        }
      }
      if (subtype === "perc_const_absolute_offset") {
        assert.ok(/Let original price per kg = x/iu.test(sample.explanation), sample.explanation);
        assert.ok(/Old quantity = expenditure \/ x/iu.test(sample.explanation), sample.explanation);
        assert.ok(/New quantity = expenditure/iu.test(sample.explanation), sample.explanation);
        assert.ok(/expenditure\/x - expenditure\/\(x x \d+(?:\.\d+)?\s*\/\s*100\)/iu.test(sample.explanation), sample.explanation);
        assert.ok(/Quantity reduction/iu.test(sample.explanation), sample.explanation);
      }
      if (subtype === "perc_mix_alloy_replacement") {
        assert.ok(/Original liquid left index/iu.test(sample.explanation), sample.explanation);
        assert.ok(/Original liquid left =/iu.test(sample.explanation), sample.explanation);
      }
      if (subtype === "perc_exam_weighted_aggregate") {
        const p1 = Number(/scores ([\d.]+)% in Paper I/iu.exec(sample.question)?.[1]);
        const p2 = Number(/and ([\d.]+)% in Paper II/iu.exec(sample.question)?.[1]);
        assert.notEqual(p1, p2, `weighted aggregate identical paper rates are trivial: ${sample.question}`);
      }
      if (subtype === "perc_demo_cross_tab_literacy") {
        const male = Number(/Male literacy is ([\d.]+)%/iu.exec(sample.question)?.[1]);
        const female = Number(/female literacy is ([\d.]+)%/iu.exec(sample.question)?.[1]);
        assert.notEqual(male, female, `identical subgroup rates are too trivial: ${sample.question}`);
      }
      if (subtype === "perc_geom_dimensional_scale") {
        assert.equal(
          /side of a square is increased by 10%/iu.test(sample.question),
          false,
          `square +10% advanced item is too basic: ${sample.question}`,
        );
      }
      if (subtype === "taxation") {
        const taxMatch = /from ([\d.]+)% to ([\d.]+)%.*?₹([\d.]+)/iu.exec(sample.question);
        const oldRate = Number(taxMatch?.[1]);
        const newRate = Number(taxMatch?.[2]);
        const taxDecrease = Number(taxMatch?.[3]);
        const expected = taxDecrease * 100 / (oldRate - newRate);
        assert.ok(
          closeEnough(numericAnswer(sample), expected),
          `taxation answer is not taxable income: ${sample.question}`,
        );
        assert.equal(numericAnswer(sample) === taxDecrease, false, sample.question);
        assert.equal(salaryLeakRe.test(`${sample.multilingual?.hi?.question ?? ""}\n${sample.multilingual?.pa?.question ?? ""}`), false);
      }
      if (subtype === "commission") {
        const commissionMatch = /commission of ([\d.]+)%.*?up to ₹([\d.]+).*?bonus of ([\d.]+)%.*?total commission is ₹([\d.]+)/iu.exec(sample.question);
        const baseRate = Number(commissionMatch?.[1]);
        const baseSales = Number(commissionMatch?.[2]);
        const bonusRate = Number(commissionMatch?.[3]);
        const totalCommission = Number(commissionMatch?.[4]);
        const baseCommission = baseSales * baseRate / 100;
        const expected = baseSales + ((totalCommission - baseCommission) * 100 / (baseRate + bonusRate));
        assert.equal(numericAnswer(sample) === totalCommission, false, sample.question);
        assert.ok(
          closeEnough(numericAnswer(sample), expected),
          `commission asks total sales but answer is not total sales: ${sample.question}`,
        );
        assert.equal(salaryLeakRe.test(`${sample.multilingual?.hi?.question ?? ""}\n${sample.multilingual?.pa?.question ?? ""}`), false);
        assert.ok(
          /अतिरिक्त बिक्री पर प्रभावी कमीशन दर/u.test(sample.explanationHi),
          sample.explanationHi,
        );
        assert.ok(
          /ਵਾਧੂ ਵਿਕਰੀ ਉੱਤੇ ਪ੍ਰਭਾਵੀ ਕਮਿਸ਼ਨ ਦਰ/u.test(sample.explanationPa),
          sample.explanationPa,
        );
        const options = (sample.options ?? [])
          .map((opt: string) => {
            const m = String(opt).match(/-?\d+(?:\.\d+)?/u);
            return m ? Number(m[0]) : undefined;
          })
          .filter((n: number | undefined): n is number => Number.isFinite(n));
        for (const opt of options) {
          if (!closeEnough(opt, numericAnswer(sample) ?? NaN)) {
            assert.ok(opt > baseSales, `commission distractor must exceed base threshold: ${opt} <= ${baseSales}`);
            assert.ok(opt >= expected * 0.6 && opt <= expected * 1.4, `commission distractor out of range: ${opt} vs ${expected}`);
            assert.ok(opt >= 4000, `commission distractor too tiny: ${opt}`);
            assert.equal(closeEnough(opt, totalCommission), false, `commission distractor must not equal commission amount: ${opt}`);
          }
        }
      }
      if (subtype === "election_margin") {
        const margin = Number(/by (\d+(?:\.\d+)?) votes/iu.exec(sample.question)?.[1]);
        if (Number.isFinite(margin)) {
          const options = (sample.options ?? [])
            .map((opt: string) => {
              const m = String(opt).match(/-?\d+(?:\.\d+)?/u);
              return m ? Number(m[0]) : undefined;
            })
            .filter((n: number | undefined): n is number => Number.isFinite(n));
          for (const opt of options) {
            if (!closeEnough(opt, numericAnswer(sample) ?? NaN)) {
              assert.ok(opt > margin, `election distractor cannot be <= margin: ${opt} <= ${margin}`);
            }
          }
        }
      }
      if (subtype === "venn_diagram") {
        assert.equal(/Percentage failing both subjects/u.test(sample.explanation), false, sample.explanation);
        assert.ok(/passing both subjects|failing neither/u.test(sample.explanation), sample.explanation);
        assert.ok(/Total students\s*=/iu.test(sample.explanation), sample.explanation);
        assert.ok(/कुल छात्र\s*=/u.test(sample.explanationHi), sample.explanationHi);
        assert.ok(/ਕੁੱਲ ਵਿਦਿਆਰਥੀ\s*=/u.test(sample.explanationPa), sample.explanationPa);
        assert.equal(/Final value\s*=|अंतिम मान\s*=|ਅੰਤਿਮ ਮੁੱਲ\s*=/u.test(sample.explanation + "\n" + sample.explanationHi + "\n" + sample.explanationPa), false);
      }

      if (subtype === "reverse_percentage") {
        assert.equal(/Final value\s*=|अंतिम मान\s*=|ਅੰਤਿਮ ਮੁੱਲ\s*=/u.test(sample.explanation + "\n" + sample.explanationHi + "\n" + sample.explanationPa), false);
        const part = Number(
          /(\d+(?:\.\d+)?)\s*(?:kg|marks?|people|candidates?|applicants?)/iu.exec(sample.question)?.[1] ??
          /(\d+(?:\.\d+)?)/u.exec(sample.question)?.[1],
        );
        if (Number.isFinite(part)) {
          const options = (sample.options ?? [])
            .map((opt: string) => {
              const m = String(opt).match(/-?\d+(?:\.\d+)?/u);
              return m ? Number(m[0]) : undefined;
            })
            .filter((n: number | undefined): n is number => Number.isFinite(n));
          for (const opt of options) {
            assert.ok(opt > 0, `reverse percentage option must be positive: ${opt}`);
            if (!closeEnough(opt, numericAnswer(sample) ?? NaN)) {
              assert.ok(opt > part, `reverse percentage distractor cannot be <= given part: ${opt} <= ${part}`);
            }
          }
        }
      }

      if (subtype === "salary_revision") {
        const options = (sample.options ?? [])
          .map((opt: string) => {
            const m = String(opt).match(/-?\d+(?:\.\d+)?/u);
            return m ? Number(m[0]) : undefined;
          })
          .filter((n: number | undefined): n is number => Number.isFinite(n));
        for (const opt of options) {
          if (!closeEnough(opt, numericAnswer(sample) ?? NaN)) {
            assert.ok(Math.abs(opt) <= 300, `salary distractor unrealistic: ${opt}`);
          }
        }
      }
    }
    assert.ok(trivialRelationCount === 0, `trivial direct relation count ${trivialRelationCount}`);
  } finally {
    await rm(outDir, {
      recursive: true,
      force: true,
    });
  }
});

test("profit loss audit export covers phase-1 and comprehensive families", async () => {
  const outDir = await mkdtemp(path.join(os.tmpdir(), "quant-v2-profit-loss-audit-"));

  try {
    const result = await runCorpusAuditExport({
      count: 60,
      outDir,
      presetId: "profit_loss_audit",
      exportProfile: "multilingual_review",
      useScheduler: true,
      schedulerProfile: "balanced_mock",
      includeMultilingualExplanations: true,
      includeSvg: false,
    });
    const corpus = JSON.parse(await readFile(result.files.json, "utf8")) as any[];
    const summary = JSON.parse(await readFile(result.files.summary, "utf8")) as typeof result.summary;
    const families = new Set(
      corpus.map((sample) =>
        String((sample.semanticMetadata as any)?.problem?.family ?? ""),
      ),
    );

    assert.equal(corpus.length, 60);
    assert.equal(summary.generatedCount, 60);
    for (const family of [
      "pl_cp_sp_percent",
      "pl_cp_percent_to_sp",
      "pl_sp_percent_to_cp",
      "pl_mp_discount_to_sp",
      "pl_mp_sp_discount_percent",
      "pl_cp_mp_discount_to_percent",
      "pl_successive_discounts",
      "pl_mp_for_target_profit",
      "pl_equal_sp_profit_loss",
      "pl_two_article_overall",
    ]) {
      assert.ok(families.has(family), `missing family ${family}`);
    }
    for (const family of [
      "pl_dishonest_dealer_weight_fraud",
      "pl_gst_after_discount",
      "pl_repair_overhead_cost",
      "pl_markup_discount_triangle",
      "pl_partial_inventory_allocation",
    ]) {
      assert.ok(families.has(family), `missing comprehensive family ${family}`);
    }
    for (const sample of corpus) {
      assert.ok(sample.multilingual.hi.question.length > 5);
      assert.ok(sample.multilingual.pa.question.length > 5);
      assert.ok(sample.explanationHi.length > 5);
      assert.ok(sample.explanationPa.length > 5);
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
