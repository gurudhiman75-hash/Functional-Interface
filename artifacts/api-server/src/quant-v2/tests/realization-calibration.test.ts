import assert from "node:assert/strict";
import test from "node:test";
import type { Pattern } from "../../lib/core/generator-engine";
import { createQuantV2PercentageQuestionCandidate } from "../../lib/quant-v2/percentage-admin-adapter";

const SAMPLE_COUNT = 10000;
const DEVANAGARI_RE = /[\u0900-\u097F]/u;
const GURMUKHI_RE = /[\u0A00-\u0A7F]/u;
const OVER_NARRATIVE_RE =
  /warehouse stock reduction|quantity in a mixture tank|retail electronics vendor|operating in a busy market|household appliance/iu;
const DUPLICATED_STEM_FRAGMENT_RE =
  /\b(?:the marked price|the price|the quantity|a quantity),\s+(?:the marked price|the price|the quantity|a quantity)\b/iu;

const percentagePattern: Pattern = {
  id: "realization-calibration-percentage",
  type: "formula",
  section: "Quant",
  topic: "percentage",
  subtopic: "percentage",
  difficulty: "Medium",
  templateVariants: ["Realization calibration percentage pattern"],
  variables: {},
  formula: "quant-v2",
};

test("quant-v2 realization is compact, localized, and exam-natural at scale", () => {
  const previousFlag = process.env.QUANT_V2_PERCENTAGE_ENABLED;
  process.env.QUANT_V2_PERCENTAGE_ENABLED = "1";

  try {
    let profitLossCount = 0;
    let reductionOptionCount = 0;
    let currencyStemCount = 0;
    let fuelConsumptionCount = 0;
    let totalStemWords = 0;

    for (let index = 0; index < SAMPLE_COUNT; index += 1) {
      const question = createQuantV2PercentageQuestionCandidate(
        percentagePattern,
        {
          seed: `realization-calibration:${index}`,
          examProfile: "ssc",
        },
      );
      const quantV2 = question.debugMetadata?.quantV2 as any;
      const subtype = String(quantV2.subtype);

      assert.ok(question.text.length > 10);
      assert.ok(!OVER_NARRATIVE_RE.test(question.text), question.text);
      assert.ok(!DUPLICATED_STEM_FRAGMENT_RE.test(question.text), question.text);
      assert.ok(question.text.split(/\s+/u).length <= 60, question.text);

      assert.ok(question.textHi && DEVANAGARI_RE.test(question.textHi));
      assert.ok(question.textPa && GURMUKHI_RE.test(question.textPa));
      assert.notEqual(question.textHi, question.text);
      assert.notEqual(question.textPa, question.text);

      assert.ok(Array.isArray(question.optionsHi));
      assert.ok(Array.isArray(question.optionsPa));
      assert.equal(question.optionsHi.length, question.options.length);
      assert.equal(question.optionsPa.length, question.options.length);

      if (subtype === "profit_loss") {
        profitLossCount += 1;
        assert.ok(question.optionsHi.join(" ").match(/लाभ|हानि/u));
        assert.ok(question.optionsPa.join(" ").match(/ਲਾਭ|ਨੁਕਸਾਨ/u));
        assert.ok(/[₹]|Rs\./u.test(question.text), question.text);
      }
      if (
        subtype === "increase_then_decrease" &&
        /\b(?:marked price|price of an item)\b/iu.test(question.text)
      ) {
        assert.ok(/[\u20B9]|Rs\./u.test(question.text), question.text);
      }
      if (subtype === "salary_revision") {
        assert.ok(/[₹]|Rs\./u.test(question.text), question.text);
        currencyStemCount += 1;
      }
      if (subtype === "price_consumption") {
        fuelConsumptionCount += 1;
        assert.match(question.text, /^Fuel price increased by \d+(?:\.\d+)?%\./u);
        reductionOptionCount += 1;
        assert.ok(question.optionsHi.join(" ").match(/कमी/u));
        assert.ok(question.optionsPa.join(" ").match(/ਕਮੀ/u));
      }

      assert.equal(
        quantV2.validatorReports.realizationNaturalness.valid,
        true,
        quantV2.validatorReports.realizationNaturalness.issues.join(" | "),
      );
      assert.ok(
        quantV2.validatorReports.realizationNaturalness.metrics
          .naturalnessScore >= 90,
      );
      assert.ok(
        !/Profit percentage is:|Loss percentage is:|Percentage change is:/u.test(
          question.explanation,
        ),
        question.explanation,
      );

      totalStemWords += question.text.split(/\s+/u).length;
    }

    assert.ok(profitLossCount > 0);
    assert.ok(reductionOptionCount > 0);
    assert.ok(fuelConsumptionCount > 0);
    assert.ok(currencyStemCount > 0);
    assert.ok(totalStemWords / SAMPLE_COUNT < 34);
  } finally {
    if (previousFlag === undefined) {
      delete process.env.QUANT_V2_PERCENTAGE_ENABLED;
    } else {
      process.env.QUANT_V2_PERCENTAGE_ENABLED = previousFlag;
    }
  }
});

export {};
