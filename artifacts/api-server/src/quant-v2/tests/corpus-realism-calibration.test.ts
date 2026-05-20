import assert from "node:assert/strict";
import test from "node:test";
import type { Pattern } from "../../lib/core/generator-engine";
import { createQuantV2PercentageQuestionCandidate } from "../../lib/quant-v2/percentage-admin-adapter";
import { COMMERCIAL_OBJECT_POOL } from "../editorial/commercial-object-pools";
import { validateCorpusDiversity } from "../validators/corpus-diversity-validator";

const SAMPLE_COUNT = 20000;
const GURMUKHI_RE = /[\u0A00-\u0A7F]/u;
const OVER_COMPACT_RE = /^(?:A quantity changed\.|Find the value\.)$/iu;
const GENERIC_COMMERCIAL_RE =
  /\b(?:household appliance|warehouse stock|mixture tank|an item|the item)\b/iu;
const WINNER_ONLY_RE = /\bThe winner\b|\bwinner's votes\b/iu;

const percentagePattern: Pattern = {
  id: "corpus-realism-percentage",
  type: "formula",
  section: "Quant",
  topic: "percentage",
  subtopic: "percentage",
  difficulty: "Medium",
  templateVariants: ["Corpus realism percentage pattern"],
  variables: {},
  formula: "quant-v2",
};

function nonPercentageMax(problem: any) {
  const values = [
    ...Object.entries(problem.variables as Record<string, number>)
      .filter(([key]) => !/percent|rate|share/iu.test(key))
      .map(([, value]) => value),
    problem.answer,
  ].filter((value) => typeof value === "number" && Number.isFinite(value));
  return Math.max(0, ...values.map((value) => Math.abs(value)));
}

function hasCommercialObject(stem: string) {
  return COMMERCIAL_OBJECT_POOL.some((object) =>
    stem.toLowerCase().includes(object.en),
  );
}

test("quant-v2 corpus realism stays balanced at multilingual scale", () => {
  const previousFlag = process.env.QUANT_V2_PERCENTAGE_ENABLED;
  process.env.QUANT_V2_PERCENTAGE_ENABLED = "1";

  try {
    const corpusSamples = [];
    const difficultyCounts: Record<string, number> = {};
    const subtypeCounts: Record<string, number> = {};
    let commercialObjectCount = 0;
    let electionCount = 0;
    let punjabiElectionCount = 0;
    let ultraCompactCount = 0;
    let maxValue = 0;

    for (let index = 0; index < SAMPLE_COUNT; index += 1) {
      const question = createQuantV2PercentageQuestionCandidate(
        percentagePattern,
        {
          seed: `corpus-realism:${index}`,
          examProfile: "ssc",
        },
      );
      const quantV2 = question.debugMetadata?.quantV2 as any;
      const problem = quantV2.canonicalProblem;
      const editorial = quantV2.editorial;
      const subtype = String(problem.subtype);

      corpusSamples.push({
        problem,
        editorial,
      });
      difficultyCounts[problem.difficulty] =
        (difficultyCounts[problem.difficulty] ?? 0) + 1;
      subtypeCounts[subtype] = (subtypeCounts[subtype] ?? 0) + 1;

      assert.ok(question.text.length > 10);
      assert.ok(!OVER_COMPACT_RE.test(question.text), question.text);
      assert.ok(!GENERIC_COMMERCIAL_RE.test(question.text), question.text);
      assert.ok(nonPercentageMax(problem) <= 1_000_000, question.text);
      maxValue = Math.max(maxValue, nonPercentageMax(problem));

      if (subtype === "profit_loss") {
        assert.ok(hasCommercialObject(question.text), question.text);
        commercialObjectCount += 1;
      }

      if (subtype === "election_margin") {
        electionCount += 1;
        assert.ok(!WINNER_ONLY_RE.test(question.text), question.text);
        assert.match(question.text, /winning candidate/iu);
        assert.ok(question.textPa && GURMUKHI_RE.test(question.textPa));
        assert.ok(!/ਵੈਧ/u.test(question.textPa), question.textPa);
        if (/ਯੋਗ/u.test(question.textPa)) {
          punjabiElectionCount += 1;
        }
      }

      const corpusRealism = quantV2.validatorReports.corpusRealism;
      assert.equal(
        corpusRealism.valid,
        true,
        corpusRealism.issues.join(" | "),
      );
      if (corpusRealism.metrics.compactnessBand === "ultra_compact") {
        ultraCompactCount += 1;
      }
    }

    const diversity = validateCorpusDiversity(corpusSamples);
    assert.equal(diversity.valid, true, diversity.issues.join(" | "));
    assert.ok(commercialObjectCount > 0);
    assert.ok(electionCount > 0);
    assert.ok(punjabiElectionCount > 0);
    assert.ok(maxValue <= 1_000_000);
    assert.ok(Object.keys(subtypeCounts).length >= 8);
    assert.ok(difficultyCounts.easy > 0);
    assert.ok(difficultyCounts.medium > 0);
    assert.ok(difficultyCounts.hard > 0);
    assert.ok(ultraCompactCount / SAMPLE_COUNT < 0.35);
  } finally {
    if (previousFlag === undefined) {
      delete process.env.QUANT_V2_PERCENTAGE_ENABLED;
    } else {
      process.env.QUANT_V2_PERCENTAGE_ENABLED = previousFlag;
    }
  }
});

export {};
