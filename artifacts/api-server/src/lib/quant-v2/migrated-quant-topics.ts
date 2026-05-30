export type MigratedQuantV2Domain =
  | "quant-v2-percentage"
  | "quant-v2-profit-loss"
  | "quant-v2-interest"
  | "quant-v2-ratio-proportion"
  | "quant-v2-time-work"
  | "quant-v2-time-speed-distance"
  | "quant-v2-mixture-alligation"
  | "quant-v2-number-system";

export type QuantV2TopicId =
  | "percentage"
  | "profit_loss"
  | "interest"
  | "ratio_proportion"
  | "time_work"
  | "time_speed_distance"
  | "mixture_alligation"
  | "number_system";

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
  | "advanced_time_work"
  | "mixed_time_speed_distance"
  | "core_time_speed_distance"
  | "relative_motion_tsd"
  | "trains_time_speed_distance"
  | "boats_races_tsd"
  | "circular_escalator_tsd"
  | "advanced_time_speed_distance"
  | "mixed_mixture_alligation"
  | "core_mixture_alligation"
  | "replacement_dilution_mixture"
  | "dealer_vessel_mixture"
  | "advanced_mixture_alligation"
  | "mixed_number_system"
  | "divisibility_number_system"
  | "prime_factor_number_system"
  | "hcf_lcm_number_system"
  | "remainder_number_system"
  | "digit_logic_number_system"
  | "factorial_number_system"
  | "advanced_number_system";

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
  {
    topicId: "time_speed_distance",
    displayLabel: "Time, Speed & Distance V2",
    generationDomain: "quant-v2-time-speed-distance",
    aliases: [
      "time speed distance",
      "time, speed and distance",
      "time speed and distance",
      "time-speed-distance",
      "speed distance",
      "speed-time-distance",
      "trains",
      "train",
      "boats",
      "boat",
      "races",
      "race",
      "circular track",
      "escalator",
      "moving walkway",
    ],
    defaultTopology: "mixed_time_speed_distance",
    validTopologyGroups: [
      topology(
        "mixed_time_speed_distance",
        "Mixed Time, Speed & Distance",
        "Balanced TSD V2 corpus across core journeys, relative motion, trains, boats, races, circular tracks, escalators, and PYQ+ traps.",
      ),
      topology(
        "core_time_speed_distance",
        "Core TSD",
        "Average speed, ratios, early/late, stoppage, partial journey, and speed-change families.",
      ),
      topology(
        "relative_motion_tsd",
        "Relative Motion",
        "Opposite/same direction, meeting, catch-up, delayed start, head start, and meeting-point families.",
      ),
      topology(
        "trains_time_speed_distance",
        "Trains",
        "Train platform, bridge, person, two-train crossing, unknown length/speed, station, and post-meeting families.",
      ),
      topology(
        "boats_races_tsd",
        "Boats & Races",
        "Upstream/downstream, stream isolation, race lead, time deficit, dead heat, and staged race families.",
      ),
      topology(
        "circular_escalator_tsd",
        "Circular & Escalator",
        "Circular-track meetings, lap differences, escalator steps, moving walkway, and dog-chase families.",
      ),
      topology(
        "advanced_time_speed_distance",
        "Advanced TSD",
        "Hidden distance/speed, train time gaps, dual platform, repeated meetings, and PYQ+ trap families.",
      ),
    ],
    schedulerProfiles: [
      "tsd_basic",
      "tsd_balanced",
      "tsd_hard",
      "tsd_pyq_plus",
      "tsd_review_100",
      "tsd_review_200",
      "tsd_production_60",
    ],
    auditPresets: ["time_speed_distance_audit"],
    supportedLanguages: ["en", "hi", "pa"],
    adminEnabled: true,
    corpusAuditEnabled: true,
    pyqPlusEnabled: true,
    legacyDisabled: true,
  },
  {
    topicId: "mixture_alligation",
    displayLabel: "Mixture & Alligation V2",
    generationDomain: "quant-v2-mixture-alligation",
    aliases: [
      "mixture",
      "mixtures",
      "alligation",
      "mixture alligation",
      "mixture and alligation",
      "mixture-alligation",
      "milk water",
      "dilution",
      "replacement",
      "concentration",
      "alloy",
    ],
    defaultTopology: "mixed_mixture_alligation",
    validTopologyGroups: [
      topology(
        "mixed_mixture_alligation",
        "Mixed Mixture & Alligation",
        "Balanced Mixture & Alligation V2 corpus across alligation, weighted average, dilution, replacement, dealer, vessel, alloy, and PYQ+ traps.",
      ),
      topology(
        "core_mixture_alligation",
        "Core Mixtures",
        "Alligation, weighted average, target mean, and price blend families.",
      ),
      topology(
        "replacement_dilution_mixture",
        "Replacement & Dilution",
        "Milk-water, repeated replacement, dilution, concentration, evaporation, and fresh/dry shifts.",
      ),
      topology(
        "dealer_vessel_mixture",
        "Dealer & Vessels",
        "Dishonest dealer, false weight, adulteration, vessel transfer, and chain mixing families.",
      ),
      topology(
        "advanced_mixture_alligation",
        "Advanced Mixture",
        "Alloy, density, GST bracket, nested mixture, and high-constraint alligation families.",
      ),
    ],
    schedulerProfiles: [
      "mix_basic",
      "mix_balanced",
      "mix_hard",
      "mix_pyq_plus",
      "mix_review_100",
      "mix_review_200",
      "mix_production_60",
    ],
    auditPresets: ["mixture_alligation_audit"],
    supportedLanguages: ["en", "hi", "pa"],
    adminEnabled: true,
    corpusAuditEnabled: true,
    pyqPlusEnabled: true,
    legacyDisabled: true,
  },
  {
    topicId: "number_system",
    displayLabel: "Number System V2",
    generationDomain: "quant-v2-number-system",
    aliases: [
      "number system",
      "number-system",
      "numbers",
      "divisibility",
      "hcf lcm",
      "hcf/lcm",
      "remainders",
      "last digit",
      "factorial",
      "factors",
      "multiples",
      "prime factorization",
    ],
    defaultTopology: "mixed_number_system",
    validTopologyGroups: [
      topology(
        "mixed_number_system",
        "Mixed Number System",
        "Balanced Number System V2 corpus across divisibility, factors, HCF/LCM, remainders, digits, factorials, and modular reasoning.",
      ),
      topology(
        "divisibility_number_system",
        "Divisibility",
        "Missing digit, multi-condition divisibility, range count, expression divisibility, and hidden divisor families.",
      ),
      topology(
        "prime_factor_number_system",
        "Prime & Factors",
        "Prime factorization, divisor counts, constrained factors, sum/product of divisors, and prime exponent deductions.",
      ),
      topology(
        "hcf_lcm_number_system",
        "HCF / LCM",
        "HCF-LCM relation, hidden HCF/LCM, schedules, fractions, and common multiple optimization.",
      ),
      topology(
        "remainder_number_system",
        "Remainders",
        "Classic, power, nested, pattern, reverse, factor-hybrid, and range-count remainder families.",
      ),
      topology(
        "digit_logic_number_system",
        "Digit Logic",
        "Digit sums, digit count, interchange, construction, constraints, and reconstruction.",
      ),
      topology(
        "factorial_number_system",
        "Factorials",
        "Trailing zeroes, highest power, factorial divisibility, factorial remainders, and factorial factor counts.",
      ),
      topology(
        "advanced_number_system",
        "Advanced Number Theory",
        "Modular arithmetic, cyclic patterns, prime-remainder hybrids, factor-HCF hybrids, and multi-cluster reasoning.",
      ),
    ],
    schedulerProfiles: [
      "number_system_basic",
      "number_system_balanced",
      "number_system_hard",
      "number_system_pyq_plus",
      "number_system_review_100",
      "number_system_review_200",
      "number_system_production_300",
      "number_system_audit_1000",
    ],
    auditPresets: ["number_system_audit"],
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
      "quant-v2-time-work" ||
    pattern.generationDomain ===
      "quant-v2-time-speed-distance" ||
    pattern.generationDomain ===
      "quant-v2-mixture-alligation" ||
    pattern.generationDomain ===
      "quant-v2-number-system"
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
