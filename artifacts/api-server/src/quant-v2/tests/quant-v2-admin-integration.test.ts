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
  createQuantV2ProfitLossQuestionCandidate,
  isQuantV2ProfitLossEnabled,
  isQuantV2ProfitLossPattern,
} from "../../lib/quant-v2/profit-loss-admin-adapter";
import {
  createQuantV2InterestQuestionCandidate,
  isQuantV2InterestPattern,
} from "../../lib/quant-v2/interest-admin-adapter";
import {
  createDomainAdapters,
  resolveDomainAdapter,
} from "../../lib/core/domain-adapters";
import {
  createCorpusSchedulerState,
  generateScheduledQuestion,
  interleaveScheduledPreviewQuestions,
  summarizeCorpusScheduler,
} from "../corpus-scheduler/corpus-scheduler";
import { resolveQuestionPatternToPattern } from "../../lib/pattern-registry";
import {
  validateQuantV2AdminIntegration,
} from "../../lib/quant-v2/quant-v2-integration-validator";
import {
  LEGACY_MIGRATED_QUANT_ERROR,
  resolveMigratedQuantV2DomainFromAlias,
} from "../../lib/quant-v2/migrated-quant-topics";

const SAMPLE_COUNT = 2000;

function previewFamily(question: FormulaQuestion) {
  const anyQuestion = question as any;
  return String(
    anyQuestion.debugMetadata?.quantV2?.topology?.family ??
      anyQuestion.debugMetadata?.selectedMotif ??
      anyQuestion.semanticMetadata?.problem?.subtype ??
      anyQuestion.motifs?.[0] ??
      "unknown",
  );
}

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

const profitLossPattern: Pattern = {
  id: "registry-profit-loss-admin-integration",
  type: "formula",
  section: "Quant",
  topic: "profit_loss_discount",
  subtopic: "profit_loss_discount",
  difficulty: "Medium",
  templateVariants: [
    "Quant-v2 profit loss integration pattern",
  ],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-profit-loss",
};

const interestPattern: Pattern = {
  id: "registry-interest-admin-integration",
  type: "formula",
  section: "Quant",
  topic: "interest",
  subtopic: "si-ci",
  difficulty: "Medium",
  templateVariants: [
    "Quant-v2 interest integration pattern",
  ],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-interest",
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

function combinedQuestionText(question: FormulaQuestion) {
  return [
    question.text,
    question.textHi,
    question.textPa,
    question.explanation,
    question.explanationHi,
    question.explanationPa,
    ...(question.options ?? []),
    ...((question as any).optionsHi ?? []),
    ...((question as any).optionsPa ?? []),
  ].filter(Boolean).join("\n");
}

function hasUglyDecimalAnswer(question: FormulaQuestion) {
  const answer = String(question.options?.[question.correct ?? 0] ?? "");
  const decimals = answer.match(/\d+\.\d+/gu) ?? [];
  return decimals.some((value) => {
    const [, decimal = ""] = value.split(".");
    if (decimal.length <= 1) return false;
    return !/^(25|33|5|50|67|75)$/u.test(decimal);
  });
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
        createQuantV2ProfitLossQuestionCandidate,
        createQuantV2InterestQuestionCandidate,
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

test("profit loss admin adapter generates multilingual phase-1 samples", () => {
  assert.equal(isQuantV2ProfitLossEnabled(), true);
  assert.equal(isQuantV2ProfitLossPattern(profitLossPattern), true);

  const adapter = resolveDomainAdapter(
    createDomainAdapters({
      createFormulaQuestionCandidate: stubQuestion,
      createReasoningQuestionCandidate: stubQuestion,
      createSeatingQuestionCandidate: stubQuestion,
      createEnglishQuestionCandidate: stubQuestion,
      createPunjabiQuestionCandidate: stubQuestion,
      createKnowledgeQuestionCandidate: stubQuestion,
      createQuantV2PercentageQuestionCandidate,
      createQuantV2ProfitLossQuestionCandidate,
      createQuantV2InterestQuestionCandidate,
      createDIQuestionSet: () => {
        throw new Error("DI adapter is not used in this test.");
      },
    }),
    "quant-v2-profit-loss",
  );
  assert.equal(adapter.domain, "quant-v2-profit-loss");

  const families = [
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
  ];

  for (const family of families) {
    const question = asFormula(
      createQuantV2ProfitLossQuestionCandidate(
        profitLossPattern,
        {
          seed: `profit-loss-admin:${family}`,
          forcedMotifId: family,
          examProfile: "ssc",
        },
      ),
    );
    const quantV2 = question.debugMetadata?.quantV2 as any;

    assert.equal(
      question.debugMetadata?.generationDomain,
      "quant-v2-profit-loss",
    );
    assert.ok(question.text.length > 20);
    assert.ok(question.explanation.length > 20);
    assert.ok(question.textHi && /[\u0900-\u097F]/u.test(question.textHi));
    assert.ok(question.textPa && /[\u0A00-\u0A7F]/u.test(question.textPa));
    assert.ok(question.explanationHi?.length);
    assert.ok(question.explanationPa?.length);
    assert.equal(question.options.length, 4);
    assert.equal(question.correct, 0);
    assert.equal(quantV2.canonicalProblem.family, family);
    assert.ok(quantV2.reasoningGraph.steps.length >= 2);
    assert.ok(quantV2.validatorReports.canonical.valid);
    assert.ok(quantV2.svgRendering.svg.includes("<svg"));
    assert.ok(quantV2.qualityMetrics.metrics.overallQualityScore >= 60);
  }
});

test("interest admin adapter generates multilingual Quant V2 samples", () => {
  assert.equal(isQuantV2InterestPattern(interestPattern), true);

  const adapter = resolveDomainAdapter(
    createDomainAdapters({
      createFormulaQuestionCandidate: stubQuestion,
      createReasoningQuestionCandidate: stubQuestion,
      createSeatingQuestionCandidate: stubQuestion,
      createEnglishQuestionCandidate: stubQuestion,
      createPunjabiQuestionCandidate: stubQuestion,
      createKnowledgeQuestionCandidate: stubQuestion,
      createQuantV2PercentageQuestionCandidate,
      createQuantV2ProfitLossQuestionCandidate,
      createQuantV2InterestQuestionCandidate,
      createDIQuestionSet: () => {
        throw new Error("DI adapter is not used in this test.");
      },
    }),
    "quant-v2-interest",
  );
  assert.equal(adapter.domain, "quant-v2-interest");

  for (const family of [
    "int_si_from_prt",
    "int_ci_amount_annual",
    "int_ci_si_difference_2_years",
    "int_present_worth",
    "int_equal_annual_installments_ci",
  ]) {
    const question = createQuantV2InterestQuestionCandidate(
      interestPattern,
      {
        seed: `interest-admin-${family}`,
        forcedMotifId: family,
      },
    );
    assert.equal(
      question.debugMetadata?.generationDomain,
      "quant-v2-interest",
    );
    assert.ok(question.text.length > 10);
    assert.ok(question.textHi?.length);
    assert.ok(question.textPa?.length);
    assert.ok(question.explanation.length > 10);
    assert.ok(question.debugMetadata?.quantV2);
    assert.equal(new Set(question.options).size, question.options.length);
  }
});

test("profit loss registry path routes admin batches to quant-v2 adapter", async () => {
  const pattern = resolveQuestionPatternToPattern({
    domain: "quant",
    topic: "profit-loss",
    pattern: "profit-loss",
    difficulty: "medium",
    examStyle: "ssc",
  });

  assert.ok(pattern);
  assert.equal(pattern.generationDomain, "quant-v2-profit-loss");

  const makeBatch = (count: number) => {
    const state = createCorpusSchedulerState({
      targetCount: count,
      profileId: "balanced_mock",
    });
    const questions = Array.from({ length: count }, (_, index) =>
      generateScheduledQuestion({
        state,
        index,
        seedPrefix: `profit-loss-ui-path-${count}`,
        examProfile: "ssc",
        generate: (options) =>
          createQuantV2ProfitLossQuestionCandidate(pattern, options),
      }).question,
    );

    return {
      questions,
      schedulerSummary: summarizeCorpusScheduler(state),
    };
  };
  const five = makeBatch(5);
  const fifty = makeBatch(50);

  assert.equal(five.questions.length, 5);
  assert.equal(fifty.questions.length, 50);
  assert.equal(five.schedulerSummary.acceptedCount, 5);
  assert.equal(fifty.schedulerSummary.acceptedCount, 50);

  for (const question of [
    ...five.questions,
    ...fifty.questions.slice(0, 5),
  ]) {
    const formula = asFormula(question);
    assert.equal(
      formula.debugMetadata?.generationDomain,
      "quant-v2-profit-loss",
    );
    assert.ok(formula.text.length > 10);
    assert.ok(formula.textHi && /[\u0900-\u097F]/u.test(formula.textHi));
    assert.ok(formula.textPa && /[\u0A00-\u0A7F]/u.test(formula.textPa));
    assert.ok(formula.explanation.length > 10);
    assert.ok(formula.explanationHi?.length);
    assert.ok(formula.explanationPa?.length);
    assert.equal(formula.options.length, 4);
  }

  const familyDistribution = new Map<string, number>();
  let uglyDecimalCount = 0;
  for (const question of fifty.questions) {
    const formula = asFormula(question);
    const text = combinedQuestionText(formula);
    const family = String((formula.debugMetadata?.quantV2 as any)?.canonicalProblem?.family ?? "");
    familyDistribution.set(family, (familyDistribution.get(family) ?? 0) + 1);

    assert.equal(/watchs/iu.test(text), false, text);
    assert.equal(/ਲਾਗਤ ਮੁੱਲ|ਵੇਚਣ ਮੁੱਲ/u.test(text), false, text);
    assert.equal(/(?<!\d)0%\s*(profit|loss)/iu.test(text), false, text);
    if (hasUglyDecimalAnswer(formula)) {
      uglyDecimalCount += 1;
    }
  }

  assert.ok(familyDistribution.size >= 8);
  assert.ok(new Set(familyDistribution.values()).size > 1);
  assert.ok(
    uglyDecimalCount <= 3,
    `Too many ugly decimal answers in 50-question Profit/Loss batch: ${uglyDecimalCount}`,
  );
});

test("percentage scheduled admin preview first window is seed-stable and varied", async () => {
  const makeQuestions = (seed: string) => {
    const state = createCorpusSchedulerState({
      targetCount: 60,
      profileId: "balanced_mock",
    });
    const questions = Array.from({ length: 60 }, (_, index) =>
      generateScheduledQuestion({
        state,
        index,
        seedPrefix: seed,
        examProfile: "ssc",
        generate: (options) =>
          createQuantV2PercentageQuestionCandidate(percentagePattern, options),
      }).question as FormulaQuestion,
    );
    return questions;
  };
  const makePreview = (questions: FormulaQuestion[], seed: string) => {
    return interleaveScheduledPreviewQuestions(
      questions,
      seed,
      previewFamily,
    )
      .slice(0, 6)
      .map(previewFamily);
  };

  const firstQuestions = makeQuestions("percentage-preview-diversity-a");
  const first = makePreview(firstQuestions, "percentage-preview-diversity-a");
  const firstAgain = makePreview(firstQuestions, "percentage-preview-diversity-a");
  const second = makePreview(makeQuestions("percentage-preview-diversity-b"), "percentage-preview-diversity-b");
  const third = makePreview(makeQuestions("percentage-preview-diversity-c"), "percentage-preview-diversity-c");

  for (const preview of [first, second, third]) {
    assert.ok(
      new Set(preview).size >= 4,
      `first 6 families need variety: ${preview.join(", ")}`,
    );
    assert.ok(
      new Set(preview.slice(0, 3)).size > 1,
      `first 3 families cannot be identical: ${preview.join(", ")}`,
    );
  }

  assert.deepEqual(firstAgain, first);
  assert.notDeepEqual(second, first);
  assert.notDeepEqual(third, second);

  const previewTriples = [first, second, third].map((preview) => preview.slice(0, 3));
  for (let position = 0; position < 3; position += 1) {
    assert.ok(
      new Set(previewTriples.map((preview) => preview[position])).size > 1,
      `family ${first[position]} occupied position ${position + 1} in every preview`,
    );
  }
});

test("migrated quant aliases always route to Quant V2", () => {
  const previousFlag = process.env.QUANT_V2_PERCENTAGE_ENABLED;
  process.env.QUANT_V2_PERCENTAGE_ENABLED = "legacy";

  try {
    assert.equal(isQuantV2PercentageEnabled(), false);
    assert.equal(isQuantV2PercentagePattern(percentagePattern), true);
    assert.equal(
      resolveRegistryPercentagePattern()?.generationDomain,
      "quant-v2-percentage",
    );
    const aliases: Array<[string, string]> = [
      ["percentage", "quant-v2-percentage"],
      ["percentages", "quant-v2-percentage"],
      ["percent", "quant-v2-percentage"],
      ["profit-loss", "quant-v2-profit-loss"],
      ["profit_loss", "quant-v2-profit-loss"],
      ["profit-loss-discount", "quant-v2-profit-loss"],
      ["profit-loss-and-discount", "quant-v2-profit-loss"],
      ["profit loss", "quant-v2-profit-loss"],
      ["profit, loss & discount", "quant-v2-profit-loss"],
      ["interest", "quant-v2-interest"],
      ["simple-interest", "quant-v2-interest"],
      ["compound-interest", "quant-v2-interest"],
      ["si-ci", "quant-v2-interest"],
      ["si and ci", "quant-v2-interest"],
      ["simple and compound interest", "quant-v2-interest"],
    ];

    for (const [alias, expectedDomain] of aliases) {
      assert.equal(
        resolveMigratedQuantV2DomainFromAlias(alias),
        expectedDomain,
      );
      assert.equal(
        resolveMigratedQuantV2DomainFromAlias(alias),
        expectedDomain,
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

test("legacy quant adapter is not reachable for migrated topics", () => {
  const registry = createDomainAdapters({
    createFormulaQuestionCandidate: () => {
      throw new Error(LEGACY_MIGRATED_QUANT_ERROR);
    },
    createReasoningQuestionCandidate: stubQuestion,
    createSeatingQuestionCandidate: stubQuestion,
    createEnglishQuestionCandidate: stubQuestion,
    createPunjabiQuestionCandidate: stubQuestion,
    createKnowledgeQuestionCandidate: stubQuestion,
    createQuantV2PercentageQuestionCandidate,
    createQuantV2ProfitLossQuestionCandidate,
    createQuantV2InterestQuestionCandidate,
    createDIQuestionSet: () => {
      throw new Error("DI adapter is not used in this test.");
    },
  });

  for (const [pattern, expectedDomain] of [
    [
      {
        ...percentagePattern,
        topic: "percent",
        subtopic: "percent",
        generationDomain: "quant" as const,
      },
      "quant-v2-percentage",
    ],
    [
      {
        ...profitLossPattern,
        topic: "profit, loss & discount",
        subtopic: "profit, loss & discount",
        generationDomain: "quant" as const,
      },
      "quant-v2-profit-loss",
    ],
    [
      {
        ...interestPattern,
        topic: "simple and compound interest",
        subtopic: "si-ci",
        generationDomain: "quant" as const,
      },
      "quant-v2-interest",
    ],
  ] as const) {
    const adapter = resolveDomainAdapter(
      registry,
      expectedDomain,
    );
    assert.equal(
      adapter.domain,
      expectedDomain,
    );
    const question = asFormula(
      expectedDomain === "quant-v2-percentage"
        ? createQuantV2PercentageQuestionCandidate(
            pattern,
            {
              seed: `migrated-routing-${pattern.topic}`,
            },
          )
        : expectedDomain === "quant-v2-profit-loss"
          ? createQuantV2ProfitLossQuestionCandidate(
              pattern,
              {
                seed: `migrated-routing-${pattern.topic}`,
              },
            )
          : createQuantV2InterestQuestionCandidate(
              pattern,
              {
                seed: `migrated-routing-${pattern.topic}`,
              },
            ),
    );

    assert.match(
      String(question.debugMetadata?.generationDomain),
      /^quant-v2-(percentage|profit-loss|interest)$/u,
    );
    assert.ok(question.debugMetadata?.quantV2);
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
