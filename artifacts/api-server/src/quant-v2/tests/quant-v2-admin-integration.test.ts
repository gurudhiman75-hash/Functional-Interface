import assert from "node:assert/strict";
import test from "node:test";
import type {
  FormulaQuestion,
  Pattern,
} from "../../lib/core/generator-engine";
import {
  createQuantV2PercentageQuestionCandidate,
  isQuantV2PercentageEnabled,
  isQuantV2PercentagePattern,
} from "../../lib/quant-v2/percentage-admin-adapter";
import {
  createDomainAdapters,
  resolveDomainAdapter,
} from "../../lib/core/domain-adapters";
import { resolveQuestionPatternToPattern } from "../../lib/pattern-registry";
import {
  validateQuantV2AdminIntegration,
} from "../../lib/quant-v2/quant-v2-integration-validator";

const SAMPLE_COUNT = 2000;

const percentagePattern: Pattern = {
  id: "registry-percentage-admin-integration",
  type: "formula",
  section: "Quant",
  topic: "percentage",
  subtopic: "percentage",
  difficulty: "Medium",
  templateVariants: [
    "Quant-v2 percentage integration pattern",
  ],
  variables: {},
  formula: "quant-v2",
};

function asFormula(question: unknown): FormulaQuestion {
  assert.ok(question && typeof question === "object");
  assert.ok(!("questionType" in question));
  return question as FormulaQuestion;
}

function resolveRegistryPercentagePattern() {
  return resolveQuestionPatternToPattern({
    domain: "quant",
    topic: "percentage",
    pattern: "percentage",
    difficulty: "medium",
    examStyle: "ssc",
  });
}

function stubQuestion(): FormulaQuestion {
  return {
    text: "stub",
    options: ["1", "2", "3", "4"],
    correct: 0,
    explanation: "stub",
  };
}

test("percentage admin adapter generates quant-v2-compatible samples", () => {
  const previousFlag = process.env.QUANT_V2_PERCENTAGE_ENABLED;
  process.env.QUANT_V2_PERCENTAGE_ENABLED = "1";

  try {
    const signatures = new Set<string>();
    const localizedLanguages = new Set<string>();
    let svgCount = 0;
    let hiddenBaseCount = 0;
    let topologyCount = 0;

    assert.equal(isQuantV2PercentageEnabled(), true);
    assert.equal(isQuantV2PercentagePattern(percentagePattern), true);
    assert.equal(
      resolveRegistryPercentagePattern()?.generationDomain,
      "quant-v2-percentage",
    );
    const adapter = resolveDomainAdapter(
      createDomainAdapters({
        createFormulaQuestionCandidate: stubQuestion,
        createReasoningQuestionCandidate: stubQuestion,
        createSeatingQuestionCandidate: stubQuestion,
        createEnglishQuestionCandidate: stubQuestion,
        createPunjabiQuestionCandidate: stubQuestion,
        createKnowledgeQuestionCandidate: stubQuestion,
        createQuantV2PercentageQuestionCandidate,
        createDIQuestionSet: () => {
          throw new Error("DI adapter is not used in this test.");
        },
      }),
      resolveRegistryPercentagePattern()?.generationDomain ?? "quant",
    );
    assert.equal(adapter.domain, "quant-v2-percentage");

    for (let index = 0; index < SAMPLE_COUNT; index += 1) {
      const question = asFormula(
        createQuantV2PercentageQuestionCandidate(
          percentagePattern,
          {
            seed: `quant-v2-admin-integration:${index}`,
          },
        ),
      );
      const validation = validateQuantV2AdminIntegration(question);

      assert.equal(
        validation.valid,
        true,
        validation.issues.join(" | "),
      );
      assert.equal(
        question.debugMetadata?.generationDomain,
        "quant-v2-percentage",
      );
      assert.ok(question.text.length > 10);
      assert.ok(question.explanation.length > 10);
      assert.ok(question.explanationHi?.length);
      assert.ok(question.explanationPa?.length);

      const quantV2 = question.debugMetadata?.quantV2 as any;
      assert.ok(quantV2.reasoningGraph.steps.length >= 2);
      assert.ok(quantV2.validatorReports.canonical.valid);
      assert.ok(quantV2.validatorReports.reasoningGraph.valid);
      assert.ok(quantV2.svgRendering.svg.includes("<svg"));
      assert.ok(quantV2.qualityMetrics.metrics.overallQualityScore >= 60);

      signatures.add(String(quantV2.signature));
      for (const language of Object.keys(quantV2.localized ?? {})) {
        localizedLanguages.add(language);
      }
      if (quantV2.svgRendering.svg.includes("<svg")) {
        svgCount += 1;
      }
      if (quantV2.topology?.hiddenBase) {
        hiddenBaseCount += 1;
      }
      if (quantV2.topology?.family) {
        topologyCount += 1;
      }
    }

    assert.ok(signatures.size > 50);
    assert.deepEqual(
      [...localizedLanguages].sort(),
      ["en", "hi", "pa"],
    );
    assert.equal(svgCount, SAMPLE_COUNT);
    assert.ok(topologyCount > SAMPLE_COUNT * 0.2);
    assert.ok(hiddenBaseCount > 0);
  } finally {
    if (previousFlag === undefined) {
      delete process.env.QUANT_V2_PERCENTAGE_ENABLED;
    } else {
      process.env.QUANT_V2_PERCENTAGE_ENABLED = previousFlag;
    }
  }
});

test("legacy percentage fallback remains available behind feature flag", () => {
  const previousFlag = process.env.QUANT_V2_PERCENTAGE_ENABLED;
  process.env.QUANT_V2_PERCENTAGE_ENABLED = "legacy";

  try {
    assert.equal(isQuantV2PercentageEnabled(), false);
    assert.equal(isQuantV2PercentagePattern(percentagePattern), true);
    assert.equal(
      resolveRegistryPercentagePattern()?.generationDomain,
      "quant",
    );
  } finally {
    if (previousFlag === undefined) {
      delete process.env.QUANT_V2_PERCENTAGE_ENABLED;
    } else {
      process.env.QUANT_V2_PERCENTAGE_ENABLED = previousFlag;
    }
  }
});

test("non-percentage quant registry patterns stay on legacy quant", () => {
  const previousFlag = process.env.QUANT_V2_PERCENTAGE_ENABLED;
  process.env.QUANT_V2_PERCENTAGE_ENABLED = "1";

  try {
    const averagesPattern = resolveQuestionPatternToPattern({
      domain: "quant",
      topic: "averages",
      pattern: "averages",
      difficulty: "medium",
      examStyle: "ssc",
    });

    assert.equal(averagesPattern?.generationDomain, "quant");
  } finally {
    if (previousFlag === undefined) {
      delete process.env.QUANT_V2_PERCENTAGE_ENABLED;
    } else {
      process.env.QUANT_V2_PERCENTAGE_ENABLED = previousFlag;
    }
  }
});

export {};
