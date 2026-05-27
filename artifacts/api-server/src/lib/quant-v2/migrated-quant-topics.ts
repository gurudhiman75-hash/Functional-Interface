export type MigratedQuantV2Domain =
  | "quant-v2-percentage"
  | "quant-v2-profit-loss"
  | "quant-v2-interest"
  | "quant-v2-ratio-proportion"
  | "quant-v2-time-work";

export type QuantV2TopicId =
  | "percentage"
  | "profit_loss"
  | "interest"
  | "ratio_proportion"
  | "time_work";

export type QuantV2TopologyGroupId =
  | "mixed_percentage"
  | "relational_percentage"
  | "procedural_percentage"
  | "advanced_percentage"
  | "mixed_profit_loss"
  | "direct_profit_loss"
  | "markup_discount_profit_loss"
  | "advanced_profit_loss"
  | "mixed_interest"
  | "simple_interest_core"
  | "compound_interest_core"
  | "advanced_interest"
  | "mixed_ratio_proportion"
  | "direct_ratio_core"
  | "proportion_variation"
  | "advanced_ratio_proportion"
  | "mixed_time_work"
  | "core_time_work"
  | "dynamic_time_work"
  | "cycle_efficiency_time_work"
  | "worker_systems_wages"
  | "pipes_cisterns_time_work"
  | "resource_applied_time_work"
  | "advanced_time_work";

export type QuantV2TopologyGroup = {
  id: QuantV2TopologyGroupId;
  label: string;
  description: string;
};

export type QuantV2TopicRegistryEntry = {
  topicId: QuantV2TopicId;
  displayLabel: string;
  generationDomain: MigratedQuantV2Domain;
  aliases: readonly string[];
  defaultTopology: QuantV2TopologyGroupId;
  validTopologyGroups: readonly QuantV2TopologyGroup[];
  schedulerProfiles: readonly string[];
  auditPresets: readonly string[];
  supportedLanguages: readonly ["en", "hi", "pa"];
  adminEnabled: boolean;
  corpusAuditEnabled: boolean;
  pyqPlusEnabled: boolean;
  legacyDisabled: boolean;
};

export type MigratedQuantPatternLike = {
  id?: string;
  name?: string;
  label?: string;
  topic?: string;
  subtopic?: string;
  type?: string;
  generationDomain?: string;
};

export const LEGACY_MIGRATED_QUANT_ERROR =
  "Legacy quant generation is disabled for this migrated topic. Use Quant V2.";

const topology = (
  id: QuantV2TopologyGroupId,
  label: string,
  description: string,
): QuantV2TopologyGroup => ({
  id,
  label,
  description,
});

export const QUANT_V2_TOPIC_REGISTRY: readonly QuantV2TopicRegistryEntry[] = [
  {
    topicId: "percentage",
    displayLabel: "Percentage",
    generationDomain: "quant-v2-percentage",
    aliases: ["percentage", "percentages", "percent"],
    defaultTopology: "mixed_percentage",
    validTopologyGroups: [
      topology(
        "mixed_percentage",
        "Mixed Percentage",
        "Balanced Percentage V2 corpus across direct, relational, and procedural motifs.",
      ),
      topology(
        "relational_percentage",
        "Relational Percentage",
        "Chained comparison, reverse relation, and ratio-percentage hybrids.",
      ),
      topology(
        "procedural_percentage",
        "Procedural Percentage",
        "Stepwise percentage applications and base-shift transformations.",
      ),
      topology(
        "advanced_percentage",
        "Advanced Percentage",
        "Coverage-focused advanced percentage motifs.",
      ),
    ],
    schedulerProfiles: [
      "balanced_mock",
      "ssc_mock",
      "banking_mock",
      "railway_mock",
      "punjab_state_mock",
      "pyq_balanced",
      "pyq_hard",
      "pyq_plus",
      "ssc_mock_pyq",
      "advanced_coverage_audit",
    ],
    auditPresets: [
      "ssc_percentage_audit",
      "banking_relational_audit",
      "percentage_advanced_coverage_audit",
      "punjabi_realism_audit",
      "compactness_stress_test",
      "difficulty_distribution_audit",
    ],
    supportedLanguages: ["en", "hi", "pa"],
    adminEnabled: true,
    corpusAuditEnabled: true,
    pyqPlusEnabled: true,
    legacyDisabled: true,
  },
  {
    topicId: "profit_loss",
    displayLabel: "Profit, Loss & Discount",
    generationDomain: "quant-v2-profit-loss",
    aliases: [
      "profit loss",
      "profit and loss",
      "profit loss discount",
      "profit loss and discount",
      "profit, loss & discount",
      "profit-loss",
      "profit_loss",
      "profit-loss-discount",
    ],
    defaultTopology: "mixed_profit_loss",
    validTopologyGroups: [
      topology(
        "mixed_profit_loss",
        "Mixed Profit/Loss",
        "Balanced Profit, Loss & Discount V2 corpus.",
      ),
      topology(
        "direct_profit_loss",
        "Direct CP/SP",
        "Direct CP, SP, profit, loss, and simple overall transaction families.",
      ),
      topology(
        "markup_discount_profit_loss",
        "Markup & Discount",
        "Marked price, discount, successive discount, and target-profit-after-discount families.",
      ),
      topology(
        "advanced_profit_loss",
        "Advanced Profit/Loss",
        "Fraud, inventory, overhead, GST, cashback, supply-chain, and inverse families.",
      ),
    ],
    schedulerProfiles: [
      "profit_loss_balanced",
      "profit_loss_discount",
      "profit_loss_hard",
      "profit_loss_pyq_plus",
    ],
    auditPresets: ["profit_loss_audit"],
    supportedLanguages: ["en", "hi", "pa"],
    adminEnabled: true,
    corpusAuditEnabled: true,
    pyqPlusEnabled: true,
    legacyDisabled: true,
  },
  {
    topicId: "interest",
    displayLabel: "Interest / SI & CI",
    generationDomain: "quant-v2-interest",
    aliases: [
      "interest",
      "simple interest",
      "compound interest",
      "si ci",
      "si and ci",
      "si-ci",
      "simple compound interest",
      "simple and compound interest",
    ],
    defaultTopology: "mixed_interest",
    validTopologyGroups: [
      topology(
        "mixed_interest",
        "Mixed Interest",
        "Balanced Interest V2 corpus across SI, CI, installments, discount, and split-investment families.",
      ),
      topology(
        "simple_interest_core",
        "Simple Interest",
        "Simple-interest direct, inverse, comparison, and split-investment families.",
      ),
      topology(
        "compound_interest_core",
        "Compound Interest",
        "Compound amount, SI-CI difference, frequency, growth, and rate/time inverse families.",
      ),
      topology(
        "advanced_interest",
        "Advanced Interest",
        "Installments, partial repayment, banker's discount, mixed conditions, and PYQ+ traps.",
      ),
    ],
    schedulerProfiles: [
      "interest_balanced",
      "interest_pyq",
      "interest_hard",
      "interest_pyq_plus",
    ],
    auditPresets: ["interest_audit"],
    supportedLanguages: ["en", "hi", "pa"],
    adminEnabled: true,
    corpusAuditEnabled: true,
    pyqPlusEnabled: true,
    legacyDisabled: true,
  },
  {
    topicId: "ratio_proportion",
    displayLabel: "Ratio, Proportion & Variation V2",
    generationDomain: "quant-v2-ratio-proportion",
    aliases: [
      "ratio",
      "ratios",
      "proportion",
      "variation",
      "ratio proportion",
      "ratio and proportion",
      "ratio proportion variation",
      "ratio, proportion and variation",
      "ratio, proportion & variation",
      "ratio-proportion",
      "ratio_proportion",
      "ratio-proportion-variation",
    ],
    defaultTopology: "mixed_ratio_proportion",
    validTopologyGroups: [
      topology(
        "mixed_ratio_proportion",
        "Mixed Ratio/Proportion",
        "Balanced Ratio, Proportion & Variation V2 corpus across sharing, transformation, ages, partnership, variation, and scaling.",
      ),
      topology(
        "direct_ratio_core",
        "Direct Ratio Core",
        "Direct sharing, sum/difference recovery, missing term, and fraction-ratio conversion.",
      ),
      topology(
        "proportion_variation",
        "Proportion & Variation",
        "Direct, inverse, joint, combined variation, partnership time, and map scale families.",
      ),
      topology(
        "advanced_ratio_proportion",
        "Advanced Ratio/Proportion",
        "Transfer equations, age shifts, geometry scaling, and chained ratio networks.",
      ),
    ],
    schedulerProfiles: [
      "ratio_basic",
      "ratio_balanced",
      "ratio_hard",
      "ratio_pyq_plus",
      "ratio_review_100",
      "ratio_production_60",
    ],
    auditPresets: ["ratio_proportion_audit"],
    supportedLanguages: ["en", "hi", "pa"],
    adminEnabled: true,
    corpusAuditEnabled: true,
    pyqPlusEnabled: true,
    legacyDisabled: true,
  },
  {
    topicId: "time_work",
    displayLabel: "Time & Work V2",
    generationDomain: "quant-v2-time-work",
    aliases: [
      "time work",
      "time and work",
      "time & work",
      "time-work",
      "work and time",
      "pipes",
      "pipe",
      "pipes and cisterns",
      "pipes & cisterns",
      "pipes-cisterns",
      "cisterns",
      "work and wages",
      "work wages",
    ],
    defaultTopology: "mixed_time_work",
    validTopologyGroups: [
      topology(
        "mixed_time_work",
        "Mixed Time & Work",
        "Balanced Time & Work / Pipes & Cisterns V2 corpus across core, dynamic, cycle, system, wage, pipe, resource, and applied families.",
      ),
      topology(
        "core_time_work",
        "Core Work Rates",
        "Combined work, residual work, efficiency, one-day work, and man-days-hours families.",
      ),
      topology(
        "dynamic_time_work",
        "Dynamic Timelines",
        "Delayed joins, leaving, replacement, interruption, worker addition/removal, and phased work.",
      ),
      topology(
        "cycle_efficiency_time_work",
        "Cycles & Efficiency",
        "Alternating work, rest cycles, relative efficiency, worker equivalence, and team comparisons.",
      ),
      topology(
        "worker_systems_wages",
        "Systems & Wages",
        "Pairwise systems, unknown worker deduction, contribution, wage distribution, helper, and contract families.",
      ),
      topology(
        "pipes_cisterns_time_work",
        "Pipes & Cisterns",
        "Fill/empty pipes, leaks, alternating pipes, capacity, overflow, and tank transfer families.",
      ),
      topology(
        "resource_applied_time_work",
        "Resources & Applied Work",
        "Food/resource duration, typists, printers, harvest, construction, painting, and machines.",
      ),
      topology(
        "advanced_time_work",
        "Advanced Time & Work",
        "LCM-hidden, mixed positive/negative rates, productivity decay, machine scheduling, and deadline traps.",
      ),
    ],
    schedulerProfiles: [
      "time_work_basic",
      "time_work_balanced",
      "time_work_hard",
      "time_work_pyq_plus",
      "time_work_review_100",
      "time_work_production_60",
    ],
    auditPresets: ["time_work_audit"],
    supportedLanguages: ["en", "hi", "pa"],
    adminEnabled: true,
    corpusAuditEnabled: true,
    pyqPlusEnabled: true,
    legacyDisabled: true,
  },
] as const;

export function normalizeMigratedQuantAlias(value: unknown) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/&/gu, " and ")
    .replace(/,/gu, " ")
    .replace(/[_-]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

const TOPICS_BY_DOMAIN = new Map(
  QUANT_V2_TOPIC_REGISTRY.map((topic) => [
    topic.generationDomain,
    topic,
  ]),
);

const TOPICS_BY_ID = new Map(
  QUANT_V2_TOPIC_REGISTRY.map((topic) => [
    topic.topicId,
    topic,
  ]),
);

const TOPICS_BY_ALIAS = new Map(
  QUANT_V2_TOPIC_REGISTRY.flatMap((topic) =>
    [
      topic.topicId,
      topic.displayLabel,
      topic.generationDomain,
      ...topic.aliases,
    ].map((alias) => [
      normalizeMigratedQuantAlias(alias),
      topic,
    ] as const),
  ),
);

export function listQuantV2Topics() {
  return [...QUANT_V2_TOPIC_REGISTRY];
}

export function getQuantV2TopicById(topicId: unknown) {
  return TOPICS_BY_ID.get(
    normalizeMigratedQuantAlias(topicId).replace(
      /\s+/gu,
      "_",
    ) as QuantV2TopicId,
  );
}

export function resolveQuantV2TopicByDomain(domain: unknown) {
  return TOPICS_BY_DOMAIN.get(
    domain as MigratedQuantV2Domain,
  );
}

export function resolveQuantV2TopicByAlias(value: unknown) {
  return TOPICS_BY_ALIAS.get(
    normalizeMigratedQuantAlias(value),
  );
}

export function resolveQuantV2TopicForAuditPreset(presetId: unknown) {
  const normalized = String(presetId ?? "");
  return QUANT_V2_TOPIC_REGISTRY.find((topic) =>
    topic.auditPresets.includes(normalized),
  );
}

export function getQuantV2TopologyOptionsForPreset(presetId: unknown) {
  return (
    resolveQuantV2TopicForAuditPreset(presetId)
      ?.validTopologyGroups ?? []
  );
}

export function getDefaultQuantV2TopologyForPreset(presetId: unknown) {
  return (
    resolveQuantV2TopicForAuditPreset(presetId)
      ?.defaultTopology ?? "mixed_percentage"
  );
}

export function getDefaultQuantV2SchedulerProfileForPreset(
  presetId: unknown,
) {
  return (
    resolveQuantV2TopicForAuditPreset(presetId)
      ?.schedulerProfiles[0] ?? "balanced_mock"
  );
}

export function isQuantV2TopologyGroupId(
  value: unknown,
): value is QuantV2TopologyGroupId {
  const normalized = String(value ?? "");
  return QUANT_V2_TOPIC_REGISTRY.some((topic) =>
    topic.validTopologyGroups.some(
      (group) => group.id === normalized,
    ),
  );
}

export function validateQuantV2TopologyForPreset(
  presetId: unknown,
  topologyId: unknown,
) {
  if (topologyId === undefined || topologyId === null || topologyId === "") {
    return {
      valid: true,
      topology:
        getDefaultQuantV2TopologyForPreset(presetId),
    };
  }

  const topic = resolveQuantV2TopicForAuditPreset(presetId);
  if (!topic) {
    return {
      valid: false,
      error: "Invalid corpus audit preset.",
    };
  }

  const normalized = String(topologyId);
  const match = topic.validTopologyGroups.find(
    (group) => group.id === normalized,
  );

  if (match) {
    return {
      valid: true,
      topology: match.id,
    };
  }

  return {
    valid: false,
    error: `Invalid topology '${normalized}' for ${topic.displayLabel}.`,
  };
}

export function validateQuantV2SchedulerProfileForPreset(
  presetId: unknown,
  schedulerProfileId: unknown,
) {
  if (
    schedulerProfileId === undefined ||
    schedulerProfileId === null ||
    schedulerProfileId === ""
  ) {
    return {
      valid: true,
      schedulerProfile:
        getDefaultQuantV2SchedulerProfileForPreset(
          presetId,
        ),
    };
  }

  const topic = resolveQuantV2TopicForAuditPreset(presetId);
  if (!topic) {
    return {
      valid: false,
      error: "Invalid corpus audit preset.",
    };
  }

  const normalized = String(schedulerProfileId);
  if (topic.schedulerProfiles.includes(normalized)) {
    return {
      valid: true,
      schedulerProfile: normalized,
    };
  }

  return {
    valid: false,
    error: `Invalid scheduler profile '${normalized}' for ${topic.displayLabel}.`,
  };
}

export function resolveMigratedQuantV2DomainFromAlias(
  value: unknown,
): MigratedQuantV2Domain | undefined {
  return resolveQuantV2TopicByAlias(value)
    ?.generationDomain;
}

export function resolveMigratedQuantV2Domain(
  pattern: MigratedQuantPatternLike,
): MigratedQuantV2Domain | undefined {
  if (
    pattern.generationDomain ===
      "quant-v2-percentage" ||
    pattern.generationDomain ===
      "quant-v2-profit-loss" ||
    pattern.generationDomain ===
      "quant-v2-interest" ||
    pattern.generationDomain ===
      "quant-v2-ratio-proportion" ||
    pattern.generationDomain ===
      "quant-v2-time-work"
  ) {
    return pattern.generationDomain;
  }

  const fields = [
    pattern.topic,
    pattern.subtopic,
    pattern.type,
    pattern.id,
    pattern.name,
    pattern.label,
  ];

  for (const field of fields) {
    const domain =
      resolveMigratedQuantV2DomainFromAlias(field);
    if (domain) {
      return domain;
    }
  }

  return undefined;
}

export function assertLegacyQuantNotMigrated(
  pattern: MigratedQuantPatternLike,
) {
  if (resolveMigratedQuantV2Domain(pattern)) {
    throw new Error(LEGACY_MIGRATED_QUANT_ERROR);
  }
}
