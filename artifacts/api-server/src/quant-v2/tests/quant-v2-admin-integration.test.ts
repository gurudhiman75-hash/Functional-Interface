import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import type {
  GeneratorOptions,
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
  createQuantV2RatioProportionQuestionCandidate,
  isQuantV2RatioProportionPattern,
} from "../../lib/quant-v2/ratio-proportion-admin-adapter";
import {
  createQuantV2TimeWorkQuestionCandidate,
  isQuantV2TimeWorkPattern,
} from "../../lib/quant-v2/time-work-admin-adapter";
import {
  createQuantV2TimeSpeedDistanceQuestionCandidate,
  isQuantV2TimeSpeedDistancePattern,
} from "../../lib/quant-v2/time-speed-distance-admin-adapter";
import {
  createQuantV2MixtureAlligationQuestionCandidate,
  isQuantV2MixtureAlligationPattern,
} from "../../lib/quant-v2/mixture-alligation-admin-adapter";
import {
  createDomainAdapters,
  resolveDomainAdapter,
} from "../../lib/core/domain-adapters";
import {
  createCorpusSchedulerState,
  createScheduledGeneratorOptions,
  CORPUS_SCHEDULER_PROFILES,
  generateScheduledQuestion,
  interleaveScheduledPreviewQuestions,
  summarizeCorpusScheduler,
} from "../corpus-scheduler/corpus-scheduler";
import {
  getQuestionPatternRegistryConsistencyReport,
  listEnabledQuantV2AdminPatterns,
  listQuestionPatterns,
  resolveQuestionPatternToPattern,
} from "../../lib/pattern-registry";
import {
  validateQuantV2AdminIntegration,
} from "../../lib/quant-v2/quant-v2-integration-validator";
import {
  LEGACY_MIGRATED_QUANT_ERROR,
  listQuantV2Topics,
  resolveMigratedQuantV2DomainFromAlias,
  resolveQuantV2TopicForAuditPreset,
  validateQuantV2SchedulerProfileForPreset,
  validateQuantV2TopologyForPreset,
} from "../../lib/quant-v2/migrated-quant-topics";
import { CORPUS_AUDIT_PRESETS } from "../corpus-audit/corpus-audit-presets";

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

const ratioProportionPattern: Pattern = {
  id: "registry-ratio-proportion-admin-integration",
  type: "formula",
  section: "Quant",
  topic: "ratio_proportion",
  subtopic: "ratio_proportion",
  difficulty: "Medium",
  templateVariants: [
    "Quant-v2 ratio proportion integration pattern",
  ],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-ratio-proportion",
};

const timeWorkPattern: Pattern = {
  id: "registry-time-work-admin-integration",
  type: "formula",
  section: "Quant",
  topic: "time_work",
  subtopic: "time_work",
  difficulty: "Medium",
  templateVariants: [
    "Quant-v2 time work integration pattern",
  ],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-time-work",
};

const timeSpeedDistancePattern: Pattern = {
  id: "registry-time-speed-distance-admin-integration",
  type: "formula",
  section: "Quant",
  topic: "time_speed_distance",
  subtopic: "time_speed_distance",
  difficulty: "Medium",
  templateVariants: [
    "Quant-v2 time speed distance integration pattern",
  ],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-time-speed-distance",
};

const mixtureAlligationPattern: Pattern = {
  id: "registry-mixture-alligation-admin-integration",
  type: "formula",
  section: "Quant",
  topic: "mixture_alligation",
  subtopic: "mixture_alligation",
  difficulty: "Medium",
  templateVariants: [
    "Quant-v2 mixture alligation integration pattern",
  ],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-mixture-alligation",
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

function normalizedStem(question: FormulaQuestion) {
  return String(question.text ?? "")
    .toLowerCase()
    .replace(/\s+/gu, " ")
    .trim();
}

function batchStemSignature(questions: FormulaQuestion[]) {
  return questions.map(normalizedStem).join("\n---\n");
}

async function generateQuantV2Batch(
  pattern: Pattern,
  schedulerProfile: NonNullable<GeneratorOptions["schedulerProfile"]>,
  generate: (options: GeneratorOptions) => FormulaQuestion,
  seed?: string,
) {
  const state = createCorpusSchedulerState({
    targetCount: 50,
    profileId: schedulerProfile,
  });
  const seedPrefix = seed ?? `unseeded:${randomUUID()}`;
  const questions: FormulaQuestion[] = [];
  const seenStems = new Set<string>();
  for (let index = 0; index < 50; index += 1) {
    let accepted: FormulaQuestion | undefined;
    for (let replacementAttempt = 0; replacementAttempt < 30; replacementAttempt += 1) {
      const question = generateScheduledQuestion({
        state,
        index,
        seedPrefix: `${seedPrefix}:slot:${index}:replacement:${replacementAttempt}`,
        examProfile: "ssc",
        generate: (scheduledOptions) => {
          let lastError: unknown;
          for (let attempt = 0; attempt < 20; attempt += 1) {
            try {
              return generate({
                ...scheduledOptions,
                seed: `${scheduledOptions.seed}:retry:${attempt}`,
                schedulerProfile,
                examProfile: "ssc",
              });
            } catch (error) {
              lastError = error;
            }
          }
          throw lastError;
        },
      }).question;
      const stem = normalizedStem(question);
      if (!seenStems.has(stem)) {
        accepted = question;
        seenStems.add(stem);
        break;
      }
    }
    assert.ok(accepted, "Unable to generate unique Quant V2 batch stem");
    questions.push(accepted);
  }
  return interleaveScheduledPreviewQuestions(
    questions,
    seedPrefix,
    previewFamily,
  );
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
        createQuantV2RatioProportionQuestionCandidate,
        createQuantV2TimeWorkQuestionCandidate,
        createQuantV2TimeSpeedDistanceQuestionCandidate,
        createQuantV2MixtureAlligationQuestionCandidate,
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
      createQuantV2RatioProportionQuestionCandidate,
      createQuantV2TimeWorkQuestionCandidate,
      createQuantV2TimeSpeedDistanceQuestionCandidate,
      createQuantV2MixtureAlligationQuestionCandidate,
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
      createQuantV2RatioProportionQuestionCandidate,
      createQuantV2TimeWorkQuestionCandidate,
      createQuantV2TimeSpeedDistanceQuestionCandidate,
      createQuantV2MixtureAlligationQuestionCandidate,
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

test("ratio proportion admin adapter generates multilingual Quant V2 samples", () => {
  assert.equal(isQuantV2RatioProportionPattern(ratioProportionPattern), true);

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
      createQuantV2RatioProportionQuestionCandidate,
      createQuantV2TimeWorkQuestionCandidate,
      createQuantV2TimeSpeedDistanceQuestionCandidate,
      createQuantV2MixtureAlligationQuestionCandidate,
      createDIQuestionSet: () => {
        throw new Error("DI adapter is not used in this test.");
      },
    }),
    "quant-v2-ratio-proportion",
  );
  assert.equal(adapter.domain, "quant-v2-ratio-proportion");

  for (const family of [
    "rp_direct_sharing",
    "rp_ratio_after_transfer",
    "rp_partnership_time_variation",
    "rp_inverse_variation_basic",
    "rp_chain_ratio_network",
  ]) {
    const question = createQuantV2RatioProportionQuestionCandidate(
      ratioProportionPattern,
      {
        seed: `ratio-proportion-admin-${family}`,
        forcedMotifId: family,
      },
    );
    assert.equal(
      question.debugMetadata?.generationDomain,
      "quant-v2-ratio-proportion",
    );
    assert.ok(question.text.length > 10);
    assert.ok(question.textHi?.length);
    assert.ok(question.textPa?.length);
    assert.ok(question.explanation.length > 10);
    assert.ok(question.debugMetadata?.quantV2);
    assert.equal(new Set(question.options).size, question.options.length);
  }
});

test("time work admin adapter generates multilingual Quant V2 samples", () => {
  assert.equal(isQuantV2TimeWorkPattern(timeWorkPattern), true);

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
      createQuantV2RatioProportionQuestionCandidate,
      createQuantV2TimeWorkQuestionCandidate,
      createQuantV2TimeSpeedDistanceQuestionCandidate,
      createQuantV2MixtureAlligationQuestionCandidate,
      createDIQuestionSet: () => {
        throw new Error("DI adapter is not used in this test.");
      },
    }),
    "quant-v2-time-work",
  );
  assert.equal(adapter.domain, "quant-v2-time-work");

  for (const family of [
    "tw_basic_combined_work",
    "tw_delayed_join",
    "tw_alternating_days_two_workers",
    "tw_wage_distribution_efficiency",
    "pc_basic_fill_empty",
    "tw_food_resource_basic",
  ]) {
    const question = createQuantV2TimeWorkQuestionCandidate(
      timeWorkPattern,
      {
        seed: `time-work-admin-${family}`,
        forcedMotifId: family,
      },
    );
    assert.equal(
      question.debugMetadata?.generationDomain,
      "quant-v2-time-work",
    );
    assert.ok(question.text.length > 10);
    assert.ok(question.textHi?.length);
    assert.ok(question.textPa?.length);
    assert.ok(question.explanation.includes("Shortcut / Exam Method"));
    assert.ok(question.explanationHi?.includes("शॉर्टकट / परीक्षा विधि"));
    assert.ok(question.explanationPa?.includes("ਸ਼ਾਰਟਕਟ / ਇਮਤਿਹਾਨੀ ਤਰੀਕਾ"));
    assert.ok(question.debugMetadata?.quantV2);
    assert.equal(new Set(question.options).size, question.options.length);
  }
});

test("time speed distance admin adapter generates multilingual Quant V2 samples", () => {
  assert.equal(isQuantV2TimeSpeedDistancePattern(timeSpeedDistancePattern), true);

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
      createQuantV2RatioProportionQuestionCandidate,
      createQuantV2TimeWorkQuestionCandidate,
      createQuantV2TimeSpeedDistanceQuestionCandidate,
      createQuantV2MixtureAlligationQuestionCandidate,
      createDIQuestionSet: () => {
        throw new Error("DI adapter is not used in this test.");
      },
    }),
    "quant-v2-time-speed-distance",
  );
  assert.equal(adapter.domain, "quant-v2-time-speed-distance");

  for (const family of [
    "tsd_average_speed_equal_distance",
    "tsd_delayed_start_catch_up",
    "train_cross_platform",
    "boat_downstream_upstream_basic",
    "race_basic_lead_distance",
    "circular_track_first_meeting_same_direction",
    "escalator_steps_basic",
  ]) {
    const question = createQuantV2TimeSpeedDistanceQuestionCandidate(
      timeSpeedDistancePattern,
      {
        seed: `time-speed-distance-admin-${family}`,
        forcedMotifId: family,
      },
    );
    assert.equal(
      question.debugMetadata?.generationDomain,
      "quant-v2-time-speed-distance",
    );
    assert.ok(question.text.length > 10);
    assert.ok(question.text.endsWith("?"));
    assert.ok(question.textHi?.length);
    assert.ok(question.textPa?.length);
    assert.ok(question.explanation.includes("Shortcut / Exam Method"));
    assert.ok(question.debugMetadata?.quantV2);
    assert.equal(new Set(question.options).size, question.options.length);
  }
});

test("mixture alligation admin adapter generates multilingual Quant V2 samples", () => {
  assert.equal(isQuantV2MixtureAlligationPattern(mixtureAlligationPattern), true);

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
      createQuantV2RatioProportionQuestionCandidate,
      createQuantV2TimeWorkQuestionCandidate,
      createQuantV2TimeSpeedDistanceQuestionCandidate,
      createQuantV2MixtureAlligationQuestionCandidate,
      createDIQuestionSet: () => {
        throw new Error("DI adapter is not used in this test.");
      },
    }),
    "quant-v2-mixture-alligation",
  );
  assert.equal(adapter.domain, "quant-v2-mixture-alligation");

  for (const family of [
    "alligation_cheaper_dearer_ratio",
    "replacement_repeated_operation",
    "concentration_target_percent_by_adding_water",
    "dealer_profit_by_mixing_water",
    "vessel_transfer_between_vessels",
    "alloy_density_matrix",
  ]) {
    const question = createQuantV2MixtureAlligationQuestionCandidate(
      mixtureAlligationPattern,
      {
        seed: `mixture-alligation-admin-${family}`,
        forcedMotifId: family,
      },
    );
    assert.equal(
      question.debugMetadata?.generationDomain,
      "quant-v2-mixture-alligation",
    );
    assert.ok(question.text.length > 10);
    assert.ok(question.text.endsWith("?"));
    assert.ok(question.textHi?.length);
    assert.ok(question.textPa?.length);
    assert.ok(question.explanation.includes("Shortcut / Exam Method"));
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
  }) ?? profitLossPattern;

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
      ["ratio", "quant-v2-ratio-proportion"],
      ["ratios", "quant-v2-ratio-proportion"],
      ["proportion", "quant-v2-ratio-proportion"],
      ["variation", "quant-v2-ratio-proportion"],
      ["ratio-proportion", "quant-v2-ratio-proportion"],
      ["ratio, proportion & variation", "quant-v2-ratio-proportion"],
      ["time-work", "quant-v2-time-work"],
      ["time and work", "quant-v2-time-work"],
      ["pipes", "quant-v2-time-work"],
      ["pipes and cisterns", "quant-v2-time-work"],
      ["work and wages", "quant-v2-time-work"],
      ["time-speed-distance", "quant-v2-time-speed-distance"],
      ["time speed distance", "quant-v2-time-speed-distance"],
      ["speed distance", "quant-v2-time-speed-distance"],
      ["trains", "quant-v2-time-speed-distance"],
      ["boats", "quant-v2-time-speed-distance"],
      ["races", "quant-v2-time-speed-distance"],
      ["circular track", "quant-v2-time-speed-distance"],
      ["escalator", "quant-v2-time-speed-distance"],
      ["mixture", "quant-v2-mixture-alligation"],
      ["alligation", "quant-v2-mixture-alligation"],
      ["mixture-alligation", "quant-v2-mixture-alligation"],
      ["milk water", "quant-v2-mixture-alligation"],
      ["dilution", "quant-v2-mixture-alligation"],
      ["replacement", "quant-v2-mixture-alligation"],
      ["concentration", "quant-v2-mixture-alligation"],
      ["alloy", "quant-v2-mixture-alligation"],
      ["number system", "quant-v2-number-system"],
      ["number-system", "quant-v2-number-system"],
      ["divisibility", "quant-v2-number-system"],
      ["hcf lcm", "quant-v2-number-system"],
      ["remainders", "quant-v2-number-system"],
      ["last digit", "quant-v2-number-system"],
      ["factorial", "quant-v2-number-system"],
      ["prime factorization", "quant-v2-number-system"],
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

test("Quant V2 topic registry is the single source for migrated admin topics", () => {
  const topics = listQuantV2Topics().filter(
    (topic) => topic.adminEnabled,
  );
  const domains = new Set(
    topics.map((topic) => topic.generationDomain),
  );
  assert.deepEqual(
    [...domains].sort(),
    [
      "quant-v2-interest",
      "quant-v2-mixture-alligation",
      "quant-v2-number-system",
      "quant-v2-percentage",
      "quant-v2-profit-loss",
      "quant-v2-ratio-proportion",
      "quant-v2-time-speed-distance",
      "quant-v2-time-work",
    ],
  );

  const adminPatterns =
    listEnabledQuantV2AdminPatterns();
  assert.deepEqual(
    adminPatterns.map((pattern) => pattern.label).sort(),
    topics.map((topic) => topic.displayLabel).sort(),
  );
  assert.deepEqual(
    adminPatterns.map((pattern) => pattern.id).sort(),
    ["interest", "mixture-alligation", "number-system", "percentage", "profit-loss", "ratio-proportion", "time-speed-distance", "time-work"],
  );

  const visiblePatternIds = new Set(
    listQuestionPatterns(false).map(
      (pattern) => pattern.id,
    ),
  );
  for (const legacyId of [
    "profit-loss-discount",
    "profit-loss-dishonest-dealer",
    "profit-loss-equivalent-change",
    "simple-compound-interest",
    "simple-interest",
    "compound-interest",
    "interest-si-vs-ci",
    "interest-fractional-compounding",
    "interest-growth-decay",
    "time-work-phases",
    "time-work-efficiency",
    "time-work-pipes",
    "speed-distance",
    "speed-distance-trains",
    "speed-distance-races",
    "speed-distance-circular",
    "speed-distance-boats",
    "number-system-advanced",
  ]) {
    assert.equal(
      visiblePatternIds.has(legacyId),
      false,
      `${legacyId} should not be selectable from admin registry`,
    );
  }

  const report =
    getQuestionPatternRegistryConsistencyReport();
  assert.deepEqual(report.duplicateIds, []);
  assert.deepEqual(
    report.enabledQuantV2AdminPatternIds.sort(),
    ["interest", "mixture-alligation", "number-system", "percentage", "profit-loss", "ratio-proportion", "time-speed-distance", "time-work"],
  );
});

test("Quant V2 corpus audit topology options are topic-specific", () => {
  const ownership = new Map<string, string>();
  for (const topic of listQuantV2Topics()) {
    assert.ok(topic.generationDomain.startsWith("quant-v2-"));
    assert.ok(
      topic.validTopologyGroups.some(
        (group) =>
          group.id === topic.defaultTopology,
      ),
    );
    for (const group of topic.validTopologyGroups) {
      assert.equal(
        ownership.has(group.id),
        false,
        `${group.id} belongs to multiple Quant V2 topics`,
      );
      ownership.set(group.id, topic.topicId);
    }
    for (const alias of topic.aliases) {
      assert.equal(
        resolveMigratedQuantV2DomainFromAlias(alias),
        topic.generationDomain,
      );
    }
  }

  for (const preset of CORPUS_AUDIT_PRESETS) {
    const topic =
      resolveQuantV2TopicForAuditPreset(
        preset.id,
      );
    assert.ok(topic);
    assert.equal(
      preset.generationDomain,
      topic.generationDomain,
    );
    assert.equal(
      preset.defaultTopology,
      topic.defaultTopology,
    );
    assert.deepEqual(
      preset.topologyOptions?.map(
        (option) => option.id,
      ),
      topic.validTopologyGroups.map(
        (option) => option.id,
      ),
    );
  }

  const interestPreset =
    CORPUS_AUDIT_PRESETS.find(
      (preset) => preset.id === "interest_audit",
    );
  const profitLossPreset =
    CORPUS_AUDIT_PRESETS.find(
      (preset) => preset.id === "profit_loss_audit",
    );
  const ratioPreset =
    CORPUS_AUDIT_PRESETS.find(
      (preset) => preset.id === "ratio_proportion_audit",
    );
  const timeWorkPreset =
    CORPUS_AUDIT_PRESETS.find(
      (preset) => preset.id === "time_work_audit",
    );
  const timeSpeedDistancePreset =
    CORPUS_AUDIT_PRESETS.find(
      (preset) => preset.id === "time_speed_distance_audit",
    );
  const mixtureAlligationPreset =
    CORPUS_AUDIT_PRESETS.find(
      (preset) => preset.id === "mixture_alligation_audit",
    );
  assert.ok(interestPreset);
  assert.ok(profitLossPreset);
  assert.ok(ratioPreset);
  assert.ok(timeWorkPreset);
  assert.ok(timeSpeedDistancePreset);
  assert.ok(mixtureAlligationPreset);
  assert.equal(
    interestPreset.topologyOptions?.some(
      (option) =>
        option.id.includes("percentage"),
    ),
    false,
  );
  assert.equal(
    profitLossPreset.topologyOptions?.some(
      (option) =>
        option.id.includes("percentage"),
    ),
    false,
  );
  assert.equal(
    ratioPreset.topologyOptions?.some(
      (option) =>
        option.id.includes("percentage"),
    ),
    false,
  );
  assert.equal(
    timeWorkPreset.topologyOptions?.some(
      (option) =>
        option.id.includes("percentage"),
    ),
    false,
  );
  assert.equal(
    timeSpeedDistancePreset.topologyOptions?.some(
      (option) =>
        option.id.includes("percentage"),
    ),
    false,
  );
  assert.equal(
    mixtureAlligationPreset.topologyOptions?.some(
      (option) =>
        option.id.includes("percentage"),
    ),
    false,
  );

  assert.equal(
    validateQuantV2TopologyForPreset(
      "interest_audit",
      "mixed_percentage",
    ).valid,
    false,
  );
  assert.equal(
    validateQuantV2TopologyForPreset(
      "profit_loss_audit",
      "mixed_percentage",
    ).valid,
    false,
  );
  assert.equal(
    validateQuantV2TopologyForPreset(
      "ratio_proportion_audit",
      "mixed_percentage",
    ).valid,
    false,
  );
  assert.equal(
    validateQuantV2TopologyForPreset(
      "time_work_audit",
      "mixed_percentage",
    ).valid,
    false,
  );
  assert.equal(
    validateQuantV2TopologyForPreset(
      "time_speed_distance_audit",
      "mixed_percentage",
    ).valid,
    false,
  );
  assert.equal(
    validateQuantV2TopologyForPreset(
      "mixture_alligation_audit",
      "mixed_percentage",
    ).valid,
    false,
  );
  assert.deepEqual(
    validateQuantV2TopologyForPreset(
      "interest_audit",
      undefined,
    ),
    {
      valid: true,
      topology: "mixed_interest",
    },
  );
  assert.deepEqual(
    validateQuantV2TopologyForPreset(
      "ratio_proportion_audit",
      undefined,
    ),
    {
      valid: true,
      topology: "mixed_ratio_proportion",
    },
  );
  assert.deepEqual(
    validateQuantV2TopologyForPreset(
      "time_work_audit",
      undefined,
    ),
    {
      valid: true,
      topology: "mixed_time_work",
    },
  );
  assert.deepEqual(
    validateQuantV2TopologyForPreset(
      "time_speed_distance_audit",
      undefined,
    ),
    {
      valid: true,
      topology: "mixed_time_speed_distance",
    },
  );
  assert.deepEqual(
    validateQuantV2TopologyForPreset(
      "mixture_alligation_audit",
      undefined,
    ),
    {
      valid: true,
      topology: "mixed_mixture_alligation",
    },
  );
  assert.equal(
    validateQuantV2SchedulerProfileForPreset(
      "interest_audit",
      "balanced_mock",
    ).valid,
    false,
  );
  assert.deepEqual(
    validateQuantV2SchedulerProfileForPreset(
      "profit_loss_audit",
      undefined,
    ),
    {
      valid: true,
      schedulerProfile:
        "profit_loss_balanced",
    },
  );
  assert.deepEqual(
    validateQuantV2SchedulerProfileForPreset(
      "ratio_proportion_audit",
      undefined,
    ),
    {
      valid: true,
      schedulerProfile:
        "ratio_basic",
    },
  );
  assert.deepEqual(
    validateQuantV2SchedulerProfileForPreset(
      "time_work_audit",
      undefined,
    ),
    {
      valid: true,
      schedulerProfile:
        "time_work_basic",
    },
  );
  assert.deepEqual(
    validateQuantV2SchedulerProfileForPreset(
      "time_speed_distance_audit",
      undefined,
    ),
    {
      valid: true,
      schedulerProfile:
        "tsd_basic",
    },
  );
  assert.deepEqual(
    validateQuantV2SchedulerProfileForPreset(
      "mixture_alligation_audit",
      undefined,
    ),
    {
      valid: true,
      schedulerProfile:
        "mix_basic",
    },
  );
});

test("Quant V2 scheduler profiles are topic-specific", () => {
  const profileIds = new Set(
    CORPUS_SCHEDULER_PROFILES.map(
      (profile) => profile.id,
    ),
  );

  for (const topic of listQuantV2Topics()) {
    for (const profileId of topic.schedulerProfiles) {
      assert.equal(
        profileIds.has(profileId as any),
        true,
        `${topic.topicId} references missing scheduler profile ${profileId}`,
      );
    }
  }

  const profitLossTopic = listQuantV2Topics().find(
    (topic) => topic.topicId === "profit_loss",
  );
  const interestTopic = listQuantV2Topics().find(
    (topic) => topic.topicId === "interest",
  );
  const ratioTopic = listQuantV2Topics().find(
    (topic) => topic.topicId === "ratio_proportion",
  );
  const timeWorkTopic = listQuantV2Topics().find(
    (topic) => topic.topicId === "time_work",
  );
  const timeSpeedDistanceTopic = listQuantV2Topics().find(
    (topic) => topic.topicId === "time_speed_distance",
  );
  const mixtureAlligationTopic = listQuantV2Topics().find(
    (topic) => topic.topicId === "mixture_alligation",
  );
  assert.ok(profitLossTopic);
  assert.ok(interestTopic);
  assert.ok(ratioTopic);
  assert.ok(timeWorkTopic);
  assert.ok(timeSpeedDistanceTopic);
  assert.ok(mixtureAlligationTopic);
  assert.equal(
    profitLossTopic.schedulerProfiles.some(
      (profile) => profile.includes("percentage") || profile.startsWith("pyq_"),
    ),
    false,
  );
  assert.equal(
    interestTopic.schedulerProfiles.every(
      (profile) => profile.startsWith("interest_"),
    ),
    true,
  );
  assert.equal(
    ratioTopic.schedulerProfiles.every(
      (profile) => profile.startsWith("ratio_"),
    ),
    true,
  );
  assert.equal(
    timeWorkTopic.schedulerProfiles.every(
      (profile) => profile.startsWith("time_work_"),
    ),
    true,
  );
  assert.equal(
    timeSpeedDistanceTopic.schedulerProfiles.every(
      (profile) => profile.startsWith("tsd_"),
    ),
    true,
  );
  assert.equal(
    mixtureAlligationTopic.schedulerProfiles.every(
      (profile) => profile.startsWith("mix_"),
    ),
    true,
  );

  const interestState =
    createCorpusSchedulerState({
      targetCount: 10,
      profileId: "interest_balanced",
    });
  const interestOptions =
    createScheduledGeneratorOptions({
      state: interestState,
      index: 0,
      attempt: 0,
      seedPrefix: "registry-scheduler-interest",
    });
  assert.match(
    String(interestOptions.forcedMotifId),
    /^int_/u,
  );

  const profitLossState =
    createCorpusSchedulerState({
      targetCount: 10,
      profileId: "profit_loss_balanced",
    });
  const profitLossOptions =
    createScheduledGeneratorOptions({
      state: profitLossState,
      index: 0,
      attempt: 0,
      seedPrefix: "registry-scheduler-profit-loss",
    });
  assert.match(
    String(profitLossOptions.forcedMotifId),
    /^pl_/u,
  );

  const ratioState =
    createCorpusSchedulerState({
      targetCount: 10,
      profileId: "ratio_balanced",
    });
  const ratioOptions =
    createScheduledGeneratorOptions({
      state: ratioState,
      index: 0,
      attempt: 0,
      seedPrefix: "registry-scheduler-ratio",
    });
  assert.match(
    String(ratioOptions.forcedMotifId),
    /^rp_/u,
  );

  const timeWorkState =
    createCorpusSchedulerState({
      targetCount: 10,
      profileId: "time_work_balanced",
    });
  const timeWorkOptions =
    createScheduledGeneratorOptions({
      state: timeWorkState,
      index: 0,
      attempt: 0,
      seedPrefix: "registry-scheduler-time-work",
    });
  assert.match(
    String(timeWorkOptions.forcedMotifId),
    /^(tw|pc)_/u,
  );

  const timeSpeedDistanceState =
    createCorpusSchedulerState({
      targetCount: 10,
      profileId: "tsd_balanced",
    });
  const timeSpeedDistanceOptions =
    createScheduledGeneratorOptions({
      state: timeSpeedDistanceState,
      index: 0,
      attempt: 0,
      seedPrefix: "registry-scheduler-time-speed-distance",
    });
  assert.match(
    String(timeSpeedDistanceOptions.forcedMotifId),
    /^(tsd|train|boat|race|circular|escalator|moving_walkway|dog)_/u,
  );

  const mixtureAlligationState =
    createCorpusSchedulerState({
      targetCount: 10,
      profileId: "mix_balanced",
    });
  const mixtureAlligationOptions =
    createScheduledGeneratorOptions({
      state: mixtureAlligationState,
      index: 0,
      attempt: 0,
      seedPrefix: "registry-scheduler-mixture-alligation",
    });
  assert.match(
    String(mixtureAlligationOptions.forcedMotifId),
    /^(mix|alligation|replacement|dilution|concentration|vessel|dealer|alloy|solution)_/u,
  );
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
    createQuantV2RatioProportionQuestionCandidate,
    createQuantV2TimeWorkQuestionCandidate,
    createQuantV2TimeSpeedDistanceQuestionCandidate,
    createQuantV2MixtureAlligationQuestionCandidate,
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
    [
      {
        ...ratioProportionPattern,
        topic: "ratio, proportion & variation",
        subtopic: "ratio-proportion",
        generationDomain: "quant" as const,
      },
      "quant-v2-ratio-proportion",
    ],
    [
      {
        ...timeWorkPattern,
        topic: "time and work",
        subtopic: "pipes and cisterns",
        generationDomain: "quant" as const,
      },
      "quant-v2-time-work",
    ],
    [
      {
        ...timeSpeedDistancePattern,
        topic: "time speed distance",
        subtopic: "trains",
        generationDomain: "quant" as const,
      },
      "quant-v2-time-speed-distance",
    ],
    [
      {
        ...mixtureAlligationPattern,
        topic: "mixture and alligation",
        subtopic: "milk water",
        generationDomain: "quant" as const,
      },
      "quant-v2-mixture-alligation",
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
          : expectedDomain === "quant-v2-interest"
            ? createQuantV2InterestQuestionCandidate(
                pattern,
                {
                  seed: `migrated-routing-${pattern.topic}`,
                },
              )
            : expectedDomain === "quant-v2-ratio-proportion"
              ? createQuantV2RatioProportionQuestionCandidate(
                pattern,
                {
                  seed: `migrated-routing-${pattern.topic}`,
                },
              )
              : expectedDomain === "quant-v2-time-work"
                ? createQuantV2TimeWorkQuestionCandidate(
                  pattern,
                  {
                    seed: `migrated-routing-${pattern.topic}`,
                  },
                )
                : expectedDomain === "quant-v2-time-speed-distance"
                  ? createQuantV2TimeSpeedDistanceQuestionCandidate(
                    pattern,
                    {
                      seed: `migrated-routing-${pattern.topic}`,
                    },
                  )
                  : createQuantV2MixtureAlligationQuestionCandidate(
                    pattern,
                    {
                      seed: `migrated-routing-${pattern.topic}`,
                    },
                  ),
    );

    assert.match(
      String(question.debugMetadata?.generationDomain),
      /^quant-v2-(percentage|profit-loss|interest|ratio-proportion|time-work|time-speed-distance|mixture-alligation)$/u,
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

test("Quant V2 unseeded corpus batches are fresh while explicit seeds are reproducible", async () => {
  const cases = [
    {
      pattern: percentagePattern,
      schedulerProfile: "balanced_mock" as const,
      generate: (options: GeneratorOptions) =>
        createQuantV2PercentageQuestionCandidate(
          percentagePattern,
          options,
        ),
      label: "Percentage",
    },
    {
      pattern: profitLossPattern,
      schedulerProfile: "profit_loss_balanced" as const,
      generate: (options: GeneratorOptions) =>
        createQuantV2ProfitLossQuestionCandidate(
          profitLossPattern,
          options,
        ),
      label: "Profit/Loss",
    },
    {
      pattern: interestPattern,
      schedulerProfile: "interest_balanced" as const,
      generate: (options: GeneratorOptions) =>
        createQuantV2InterestQuestionCandidate(
          interestPattern,
          options,
        ),
      label: "Interest",
    },
    {
      pattern: ratioProportionPattern,
      schedulerProfile: "ratio_balanced" as const,
      generate: (options: GeneratorOptions) =>
        createQuantV2RatioProportionQuestionCandidate(
          ratioProportionPattern,
          options,
        ),
      label: "Ratio/Proportion",
    },
    {
      pattern: timeWorkPattern,
      schedulerProfile: "time_work_balanced" as const,
      generate: (options: GeneratorOptions) =>
        createQuantV2TimeWorkQuestionCandidate(
          timeWorkPattern,
          options,
        ),
      label: "Time Work",
    },
    {
      pattern: timeSpeedDistancePattern,
      schedulerProfile: "tsd_balanced" as const,
      generate: (options: GeneratorOptions) =>
        createQuantV2TimeSpeedDistanceQuestionCandidate(
          timeSpeedDistancePattern,
          options,
        ),
      label: "Time Speed Distance",
    },
    {
      pattern: mixtureAlligationPattern,
      schedulerProfile: "mix_balanced" as const,
      generate: (options: GeneratorOptions) =>
        createQuantV2MixtureAlligationQuestionCandidate(
          mixtureAlligationPattern,
          options,
        ),
      label: "Mixture Alligation",
    },
  ];

  for (const item of cases) {
    const first = await generateQuantV2Batch(
      item.pattern,
      item.schedulerProfile,
      item.generate,
    );
    const second = await generateQuantV2Batch(
      item.pattern,
      item.schedulerProfile,
      item.generate,
    );

    assert.notEqual(
      batchStemSignature(first),
      batchStemSignature(second),
      `${item.label} unseeded runs should not produce identical 50Q batches`,
    );
    assert.notEqual(
      batchStemSignature(first.slice(0, 6)),
      batchStemSignature(second.slice(0, 6)),
      `${item.label} unseeded preview window should vary`,
    );

    const stemSet = new Set(first.map(normalizedStem));
    assert.equal(
      stemSet.size,
      first.length,
      `${item.label} batch contains duplicate normalized stems`,
    );
  }

  const seededA = await generateQuantV2Batch(
    profitLossPattern,
    "profit_loss_balanced",
    (options) =>
      createQuantV2ProfitLossQuestionCandidate(
        profitLossPattern,
        options,
      ),
    "quant-v2-repeatability-check",
  );
  const seededB = await generateQuantV2Batch(
    profitLossPattern,
    "profit_loss_balanced",
    (options) =>
      createQuantV2ProfitLossQuestionCandidate(
        profitLossPattern,
        options,
      ),
    "quant-v2-repeatability-check",
  );

  assert.equal(
    batchStemSignature(seededA),
    batchStemSignature(seededB),
    "Explicit seed should reproduce the same Profit/Loss batch",
  );
});

export {};
