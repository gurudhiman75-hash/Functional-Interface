import type {
  DifficultyLabel,
  Pattern,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import {
  createReasoningStep,
  pickRandomItem,
  random,
} from "../shared";
import type { QuantProceduralScenario } from "./time-work-scenarios";

type PercentageDefinition = {
  id: string;
  difficulty: DifficultyLabel[];
  create: () => Omit<
    QuantProceduralScenario,
    "topicCluster"
  >;
};

type PercentagePedagogyMetadata = {
  logicArchetype:
    | "Product Constancy"
    | "Successive Cascading"
    | "Differential Balance"
    | "Asymmetric Boundaries"
    | "Mixture Concentration"
    | "Population Cascade"
    | "Salary/Budget Allocation"
    | "Direct Base";
  category:
    | "competitive-percentage"
    | "percentage-foundation";
  difficultyRange: [number, number];
  baseStrategy: string;
  explanationStrategy: string;
  trapHooks: string[];
  reasoningAtoms: string[];
  educationalIntent: string[];
  contextFamilies: string[];
};

const DEFAULT_PERCENTAGE_PEDAGOGY: PercentagePedagogyMetadata = {
  logicArchetype: "Direct Base",
  category: "percentage-foundation",
  difficultyRange: [1, 3],
  baseStrategy:
    "Identify the quantity treated as 100 before applying the rate.",
  explanationStrategy:
    "Build from the correct base, then calculate the required value.",
  trapHooks: [
    "wrong-base",
    "direct-rate-substitution",
  ],
  reasoningAtoms: [
    "percentage_operator",
    "equivalent_fraction_mapping",
  ],
  educationalIntent: [
    "baseline awareness",
    "mental math optimization",
  ],
  contextFamilies: [
    "schools",
    "shopping",
    "business",
  ],
};

const PERCENTAGE_PEDAGOGY_BY_ID: Record<
  string,
  Partial<PercentagePedagogyMetadata>
> = {
  perc_price_consumption: {
    logicArchetype: "Product Constancy",
    category: "competitive-percentage",
    difficultyRange: [4, 8],
    baseStrategy:
      "Hold expenditure constant and balance price against consumption.",
    explanationStrategy:
      "Use a 100-index model so the shifted base is visible.",
    trapHooks: [
      "new-base-confusion",
      "constant-product",
    ],
  },
  perc_restore_value: {
    logicArchetype: "Product Constancy",
    category: "competitive-percentage",
    difficultyRange: [4, 7],
    baseStrategy:
      "Restore the reduced quantity back to its original 100-index value.",
    explanationStrategy:
      "Show why the recovery percentage is measured on the reduced value.",
    trapHooks: [
      "old-base-recovery",
      "reverse-percentage",
    ],
  },
  perc_successive_hike: {
    logicArchetype: "Successive Cascading",
    category: "competitive-percentage",
    difficultyRange: [3, 6],
    baseStrategy:
      "Apply every next change on the freshly shifted base.",
    explanationStrategy:
      "Use a visible 100-index chain instead of adding rates.",
    trapHooks: [
      "rate-addition",
      "shifted-base",
    ],
  },
  perc_compound_error: {
    logicArchetype: "Successive Cascading",
    category: "competitive-percentage",
    difficultyRange: [4, 7],
    baseStrategy:
      "Track increase and decrease as two different bases.",
    explanationStrategy:
      "Show the hidden loss after opposite percentage changes.",
    trapHooks: [
      "opposite-rates-cancel",
      "shifted-base",
    ],
  },
  perc_population_growth: {
    logicArchetype: "Population Cascade",
    category: "competitive-percentage",
    difficultyRange: [3, 6],
    baseStrategy:
      "Treat each year as a new population base.",
    explanationStrategy:
      "Create a year-wise multiplier chain.",
    trapHooks: [
      "simple-growth-assumption",
      "year-wise-base",
    ],
  },
  perc_machine_depreciation: {
    logicArchetype: "Population Cascade",
    category: "competitive-percentage",
    difficultyRange: [3, 6],
    baseStrategy:
      "Apply every depreciation on the remaining value.",
    explanationStrategy:
      "Use retained-value multipliers.",
    trapHooks: [
      "straight-subtraction",
      "remaining-value-base",
    ],
  },
  perc_vote_election: {
    logicArchetype: "Differential Balance",
    category: "competitive-percentage",
    difficultyRange: [4, 7],
    baseStrategy:
      "Convert the winning margin into the percentage gap between candidates.",
    explanationStrategy:
      "Bridge actual vote difference with percentage difference.",
    trapHooks: [
      "winner-share-as-margin",
      "valid-vote-base",
    ],
  },
  perc_election_invalid: {
    logicArchetype: "Differential Balance",
    category: "competitive-percentage",
    difficultyRange: [5, 9],
    baseStrategy:
      "Filter total voters into cast votes and valid votes before using shares.",
    explanationStrategy:
      "Use a staged voter funnel.",
    trapHooks: [
      "invalid-vote-base",
      "cast-vs-valid",
    ],
  },
  perc_mixture_water_add: {
    logicArchetype: "Mixture Concentration",
    category: "competitive-percentage",
    difficultyRange: [5, 8],
    baseStrategy:
      "Hold the non-water component constant while water changes.",
    explanationStrategy:
      "Solve through pure-part preservation.",
    trapHooks: [
      "changed-total-mixture",
      "pure-part-constant",
    ],
  },
  perc_mixture_replacement: {
    logicArchetype: "Mixture Concentration",
    category: "competitive-percentage",
    difficultyRange: [6, 9],
    baseStrategy:
      "Reduce both components proportionally, then add the pure component.",
    explanationStrategy:
      "Use ratio subtraction followed by addition.",
    trapHooks: [
      "replacement-ratio",
      "pure-addition",
    ],
  },
  perc_fruit_dry_weight: {
    logicArchetype: "Mixture Concentration",
    category: "competitive-percentage",
    difficultyRange: [6, 9],
    baseStrategy:
      "Preserve the dry matter while water percentage changes.",
    explanationStrategy:
      "Use solid weight as the fixed bridge.",
    trapHooks: [
      "water-weight-confusion",
      "solid-part-constant",
    ],
  },
  perc_income_savings_expense: {
    logicArchetype: "Salary/Budget Allocation",
    category: "competitive-percentage",
    difficultyRange: [6, 9],
    baseStrategy:
      "Separate income, saving, and expense before comparing expense change.",
    explanationStrategy:
      "Compare old and new expense, not old and new income.",
    trapHooks: [
      "income-vs-expense-base",
      "fixed-saving",
    ],
  },
  perc_sequential_spend: {
    logicArchetype: "Salary/Budget Allocation",
    category: "competitive-percentage",
    difficultyRange: [4, 7],
    baseStrategy:
      "Apply the second spending rate on the remaining money.",
    explanationStrategy:
      "Build the remaining-balance chain.",
    trapHooks: [
      "second-rate-on-original",
      "remaining-base",
    ],
  },
  perc_weighted_group_change: {
    logicArchetype: "Differential Balance",
    category: "competitive-percentage",
    difficultyRange: [7, 10],
    baseStrategy:
      "Weight each group by its original strength before averaging changes.",
    explanationStrategy:
      "Compute total increase, then compare with original total.",
    trapHooks: [
      "simple-average-of-rates",
      "weighted-base",
    ],
  },
};

function inferPercentageAtoms(id: string): string[] {
  if (
    id.includes("successive") ||
    id.includes("growth") ||
    id.includes("depreciation") ||
    id.includes("compound") ||
    id.includes("cascade") ||
    id.includes("chain")
  ) {
    return [
      "baseline_shift",
      "successive_change",
      "chained_dependency",
    ];
  }

  if (
    id.includes("election") ||
    id.includes("vote") ||
    id.includes("weighted") ||
    id.includes("population_gender")
  ) {
    return [
      "complementary_percentage",
      "weighted_distribution",
      "relative_difference",
    ];
  }

  if (
    id.includes("mixture") ||
    id.includes("fruit") ||
    id.includes("alloy")
  ) {
    return [
      "residual_balance",
      "hidden_ratio_conversion",
      "proportional_adjustment",
    ];
  }

  if (
    id.includes("income") ||
    id.includes("spend") ||
    id.includes("commission") ||
    id.includes("tax")
  ) {
    return [
      "nested_partitioning",
      "threshold_crossing",
      "residual_balance",
    ];
  }

  if (
    id.includes("more_than") ||
    id.includes("reverse") ||
    id.includes("restore")
  ) {
    return [
      "reverse_reconstruction",
      "denominator_switch",
      "asymmetric_comparison",
    ];
  }

  if (
    id.includes("consumption") ||
    id.includes("price_consumption")
  ) {
    return [
      "product_constancy",
      "inverse_scaling",
      "baseline_shift",
    ];
  }

  return [
    "percentage_operator",
    "equivalent_fraction_mapping",
  ];
}

function inferEducationalIntent(id: string): string[] {
  if (
    id.includes("reverse") ||
    id.includes("restore")
  ) {
    return [
      "reverse thinking",
      "denominator awareness",
    ];
  }

  if (
    id.includes("weighted") ||
    id.includes("election") ||
    id.includes("vote")
  ) {
    return [
      "baseline awareness",
      "ratio intuition",
    ];
  }

  if (
    id.includes("successive") ||
    id.includes("growth") ||
    id.includes("depreciation")
  ) {
    return [
      "baseline awareness",
      "shortcut training",
    ];
  }

  if (
    id.includes("mixture") ||
    id.includes("fruit") ||
    id.includes("alloy")
  ) {
    return [
      "ratio intuition",
      "hidden constant tracking",
    ];
  }

  return [
    "shortcut training",
    "mental math optimization",
  ];
}

function inferContextFamilies(id: string): string[] {
  if (id.includes("election") || id.includes("vote")) {
    return ["elections", "civics"];
  }
  if (id.includes("income") || id.includes("salary")) {
    return ["salary", "banking"];
  }
  if (id.includes("price") || id.includes("discount")) {
    return ["shopping", "online payments"];
  }
  if (id.includes("population")) {
    return ["population", "healthcare"];
  }
  if (
    id.includes("mixture") ||
    id.includes("fruit") ||
    id.includes("alloy")
  ) {
    return ["agriculture", "business"];
  }
  if (id.includes("marks") || id.includes("exam")) {
    return ["schools", "education"];
  }
  return ["business", "banking"];
}

function getPercentagePedagogy(
  id: string,
): PercentagePedagogyMetadata {
  const metadata =
    PERCENTAGE_PEDAGOGY_BY_ID[id] ?? {};
  return {
    ...DEFAULT_PERCENTAGE_PEDAGOGY,
    ...metadata,
    trapHooks:
      metadata.trapHooks ??
      DEFAULT_PERCENTAGE_PEDAGOGY.trapHooks,
    reasoningAtoms:
      metadata.reasoningAtoms ??
      inferPercentageAtoms(id),
    educationalIntent:
      metadata.educationalIntent ??
      inferEducationalIntent(id),
    contextFamilies:
      metadata.contextFamilies ??
      inferContextFamilies(id),
  };
}

const round2 = (value: number) =>
  Number(value.toFixed(2));

const pct = (
  value: number,
  rate: number,
) => (value * rate) / 100;

const gcd = (a: number, b: number): number =>
  b === 0 ? Math.abs(a) : gcd(b, a % b);

const ratioEngine = {
  reduce(a: number, b: number) {
    const factor = gcd(a, b);
    return [a / factor, b / factor] as const;
  },
  parts(total: number, a: number, b: number) {
    const sum = a + b;
    return {
      first: (total * a) / sum,
      second: (total * b) / sum,
    };
  },
};

const variation = {
  retainedSolidWeight(
    totalWeight: number,
    waterPercent: number,
  ) {
    return totalWeight * (1 - waterPercent / 100);
  },
  finalWeightFromSolid(
    solidWeight: number,
    finalWaterPercent: number,
  ) {
    return solidWeight / (1 - finalWaterPercent / 100);
  },
  applyPercent(
    base: number,
    retainedPercent: number,
  ) {
    return base * (retainedPercent / 100);
  },
};

const scenario = (
  id: string,
  values: Record<string, number>,
  text: string,
  correctAnswer: number,
  steps: string[],
): Omit<
  QuantProceduralScenario,
  "topicCluster"
> => {
  const normalizedText =
    synthesizePercentageScenarioText(
      id,
      values,
      normalizePercentageText(text),
    );
  const normalizedSteps = steps.map(
    normalizePercentageText,
  );

  if (!Number.isFinite(correctAnswer)) {
    throw new Error(
      `Percentage motif ${id} produced an invalid answer.`,
    );
  }

  if (
    normalizedText.length < 24 ||
    /\b(undefined|NaN|Infinity)\b/i.test(
      normalizedText,
    )
  ) {
    throw new Error(
      `Percentage motif ${id} produced weak wording.`,
    );
  }

  if (
    new Set(normalizedSteps).size !==
    normalizedSteps.length
  ) {
    throw new Error(
      `Percentage motif ${id} produced repetitive reasoning atoms.`,
    );
  }

  const valueSignature =
    Object.keys(values)
      .sort()
      .map((key) => `${key}=${values[key]}`)
      .join("&");

  return {
    scenarioType: id,
    motifId: id,
    scenarioLogicBranch: id,
    values,
    text: normalizedText,
    correctAnswer: round2(correctAnswer),
    formula: id,
    pedagogyMetadata:
      getPercentagePedagogy(id),
    structuralSignature: `${id}|${valueSignature}|ans=${round2(correctAnswer)}`,
    reasoningSteps: normalizedSteps.map((step, index) =>
      createReasoningStep(
        index === 0
          ? "percentage"
          : "infer",
        step,
      ),
    ),
    context: {
      entity: "percentage case",
      metric: "required value",
      context: "percentage",
    },
    validationTokens:
      id === "perc_mixture_replacement"
        ? ["ratio"]
        : ["percentage"],
  };
};

function normalizePercentageText(text: string) {
  return text
    .replace(
      /(\d+(?:\.\d+)?)\s+percentage/giu,
      "$1%",
    )
    .replace(
      /\bFind the percentage\b/giu,
      "Find the percent",
    )
    .replace(
      /\bwhat percentage\b/giu,
      "what percent",
    )
    .replace(
      /\bby what percentage\b/giu,
      "by what percent",
    )
    .replace(
      /\bpercentage\s+(change|increase|decrease|hike|cut|water|copper|marks|commission)\b/giu,
      "percent $1",
    );
}

function money(value: number | undefined) {
  return typeof value === "number"
    ? `Rs. ${value}`
    : "the amount";
}

type PercentFraction = {
  numerator: number;
  denominator: number;
};

function formatNumber(value: number) {
  if (Number.isInteger(value)) {
    return String(value);
  }
  const rounded = Number(value.toFixed(2));
  return Number.isInteger(rounded)
    ? String(rounded)
    : String(rounded);
}

function percentText(value: number | undefined) {
  if (typeof value !== "number") {
    return "the given percentage";
  }

  const normalized = Number(value.toFixed(10));
  const whole = Math.trunc(normalized);
  const fractionPart = Math.abs(normalized - whole);
  const commonFractions: PercentFraction[] = [
    { numerator: 1, denominator: 8 },
    { numerator: 1, denominator: 6 },
    { numerator: 1, denominator: 4 },
    { numerator: 1, denominator: 3 },
    { numerator: 1, denominator: 2 },
    { numerator: 2, denominator: 3 },
    { numerator: 3, denominator: 4 },
    { numerator: 7, denominator: 8 },
  ];
  const fraction = commonFractions.find(
    (item) =>
      Math.abs(
        fractionPart -
          item.numerator / item.denominator,
      ) < 0.0001,
  );

  if (!fraction) {
    return `$${formatNumber(value)}\\%$`;
  }

  if (whole === 0) {
    const sign = normalized < 0 ? "-" : "";
    return `$${sign}\\frac{${fraction.numerator}}{${fraction.denominator}}\\%$`;
  }

  return `$${whole}\\frac{${fraction.numerator}}{${fraction.denominator}}\\%$`;
}

type PercentageNarrativeSignal = {
  domain: string;
  opening: string;
  score: number;
};

type RealizationStyle =
  | "ssc_concise"
  | "banking_contextual"
  | "editorial_modern"
  | "coaching_natural"
  | "data_report";

const PERCENTAGE_CONTEXT_MEMORY = {
  domains: [] as string[],
  openings: [] as string[],
  situations: [] as string[],
  styles: [] as string[],
};

function rememberRecent(
  bucket: string[],
  value: string,
  limit = 8,
) {
  bucket.unshift(value);
  bucket.splice(limit);
}

const REALIZATION_STYLES: RealizationStyle[] = [
  "ssc_concise",
  "banking_contextual",
  "editorial_modern",
  "coaching_natural",
  "data_report",
];

const AI_EXPOSED_QUESTION_PATTERN =
  /\b(practical percentage question|hidden quantity|revised traffic|working base|percentage effect|comparison quantity|percentage operator|practical scenario|concealed relation)\b/i;

const COMPRESSED_FACT_ASK_PATTERN =
  /\b(has|gets|got|shows|rises|falls|grows|increases|decreases)\b[^.?!]{0,70}\b(find|what is|how many|how much)\b/i;

function pickRealizationStyle(
  id: string,
): RealizationStyle {
  const preferred: Record<
    string,
    RealizationStyle[]
  > = {
    perc_vote_election: [
      "data_report",
      "editorial_modern",
      "ssc_concise",
    ],
    perc_election_invalid: [
      "data_report",
      "banking_contextual",
      "editorial_modern",
    ],
    perc_exam_pass_fail: [
      "editorial_modern",
      "coaching_natural",
      "ssc_concise",
    ],
    perc_income_savings_expense: [
      "banking_contextual",
      "coaching_natural",
      "editorial_modern",
    ],
    perc_weighted_group_change: [
      "data_report",
      "editorial_modern",
      "banking_contextual",
    ],
  };

  const pool =
    preferred[id] ?? REALIZATION_STYLES;
  const fresh = pool.filter(
    (style) =>
      !PERCENTAGE_CONTEXT_MEMORY.styles.includes(
        style,
      ),
  );
  const selected =
    pickRandomItem(
      fresh.length ? fresh : pool,
    ) ?? "editorial_modern";
  rememberRecent(
    PERCENTAGE_CONTEXT_MEMORY.styles,
    selected,
    5,
  );
  return selected;
}

function inferNarrativeDomain(text: string) {
  const lower = text.toLowerCase();

  if (
    /online|subscription|smartphone|app|digital|platform|e-commerce/.test(
      lower,
    )
  ) {
    return "digital-modern";
  }
  if (
    /bank|tax|loan|emi|saving|investment|salary|stipend|fund/.test(
      lower,
    )
  ) {
    return "banking-finance";
  }
  if (
    /election|voter|constituency|valid votes/.test(
      lower,
    )
  ) {
    return "election-analysis";
  }
  if (
    /school|test|marks|candidate|scholarship|batch|students/.test(
      lower,
    )
  ) {
    return "education-exams";
  }
  if (
    /fruit|crop|rainfall|irrigation|fertilizer|produce/.test(
      lower,
    )
  ) {
    return "agriculture-environment";
  }
  if (
    /fuel|transport|travel|ticket|fare|route|passenger/.test(
      lower,
    )
  ) {
    return "transport-travel";
  }
  if (
    /sugar|grocery|household|hostel|budget|cooking|electricity|water/.test(
      lower,
    )
  ) {
    return "household-daily-life";
  }
  if (
    /business|asset|sales|commission|inventory|startup|production/.test(
      lower,
    )
  ) {
    return "business-commerce";
  }
  if (
    /population|healthcare|survey|residents|town|census/.test(
      lower,
    )
  ) {
    return "demographics-healthcare";
  }

  return "general-exam";
}

function inferNarrativeOpening(text: string) {
  const trimmed = text.trim();
  const firstWords = trimmed
    .split(/\s+/)
    .slice(0, 4)
    .join(" ")
    .toLowerCase();

  if (
    /during|after|following/.test(
      firstWords,
    )
  ) {
    return "event-based";
  }
  if (
    /to maintain|to avoid|in order|for a planning/.test(
      firstWords,
    )
  ) {
    return "goal-driven";
  }
  if (
    /report|survey|result|records|audit/.test(
      firstWords,
    )
  ) {
    return "data-driven";
  }
  if (
    /due to|as |while /.test(
      firstWords,
    )
  ) {
    return "observational";
  }
  return "direct-context";
}

function motifContextFit(
  id: string,
  domain: string,
) {
  const preferred: Record<string, string[]> = {
    perc_price_consumption: [
      "household-daily-life",
      "transport-travel",
      "digital-modern",
    ],
    perc_successive_hike: [
      "digital-modern",
      "banking-finance",
      "business-commerce",
    ],
    perc_compound_error: [
      "banking-finance",
      "digital-modern",
    ],
    perc_restore_value: [
      "business-commerce",
      "education-exams",
      "banking-finance",
    ],
    perc_vote_election: [
      "election-analysis",
    ],
    perc_election_invalid: [
      "election-analysis",
    ],
    perc_exam_pass_fail: [
      "education-exams",
    ],
    perc_population_growth: [
      "demographics-healthcare",
    ],
    perc_mixture_water_add: [
      "healthcare-medical",
      "agriculture-environment",
      "business-commerce",
    ],
    perc_fruit_dry_weight: [
      "agriculture-environment",
      "business-commerce",
    ],
    perc_income_savings_expense: [
      "banking-finance",
      "household-daily-life",
    ],
    perc_weighted_group_change: [
      "education-exams",
      "business-commerce",
    ],
  };

  return preferred[id]?.includes(domain)
    ? 12
    : 0;
}

function scorePercentageNarrative(
  id: string,
  candidate: string,
): PercentageNarrativeSignal {
  const domain =
    inferNarrativeDomain(candidate);
  const opening =
    inferNarrativeOpening(candidate);
  const wordCount =
    candidate.trim().split(/\s+/).length;
  let score = 60;

  score += motifContextFit(id, domain);

  if (
    domain === "digital-modern" ||
    domain === "banking-finance"
  ) {
    score += 6;
  }

  if (
    PERCENTAGE_CONTEXT_MEMORY.domains.includes(
      domain,
    )
  ) {
    score -= 10;
  }

  if (
    PERCENTAGE_CONTEXT_MEMORY.openings.includes(
      opening,
    )
  ) {
    score -= 7;
  }

  if (
    PERCENTAGE_CONTEXT_MEMORY.situations.some(
      (seen) =>
        candidate
          .toLowerCase()
          .includes(seen),
    )
  ) {
    score -= 8;
  }

  if (
    /^(find|what|if)\b/i.test(
      candidate.trim(),
    )
  ) {
    score -= 12;
  }

  if (AI_EXPOSED_QUESTION_PATTERN.test(candidate)) {
    score -= 80;
  }

  if (COMPRESSED_FACT_ASK_PATTERN.test(candidate)) {
    score -= 12;
  }

  if (/\bFind the\b/.test(candidate)) {
    score -= 4;
  }

  if (wordCount > 62) {
    score -= 8;
  }

  if (wordCount >= 30 && wordCount <= 54) {
    score += 12;
  } else if (wordCount >= 24 && wordCount <= 58) {
    score += 6;
  }

  if (wordCount < 24) {
    score -= 18;
  }

  if (
    /\b(in|during|after|following|with|out of|from|while|as part of)\b/i.test(
      candidate,
    )
  ) {
    score += 5;
  }

  if (
    /\b(report|reports|review|audits?|audit|register|sheet|summary|recorded|record|reported)\b/i.test(
      candidate,
    )
  ) {
    score -= 12;
  }

  if (
    /\b(marks|score|balance|cost|fare|amount|vote|votes|population|students|members|enrolment|membership|total|final)\b/i.test(
      candidate,
    )
  ) {
    score += 4;
  }

  if (
    /^[^.?!]+[.?!]\s+[A-Z]/.test(
      candidate.trim(),
    )
  ) {
    score += 7;
  }

  if (
    /\b(how many|how much|find|determine|calculate)\b/i.test(
      candidate,
    ) &&
    !/^(find|what|how)\b/i.test(
      candidate.trim(),
    )
  ) {
    score += 4;
  }

  if (
    /beautiful|surprising|emotional|story|journey/i.test(
      candidate,
    )
  ) {
    score -= 20;
  }

  return {
    domain,
    opening,
    score,
  };
}

function polishPercentageNarrative(
  id: string,
  candidate: string,
) {
  let text = candidate
    .replace(/\bpractical percentage question\b/gi, "exam question")
    .replace(/\brevised traffic\b/gi, "updated traffic count")
    .replace(/\bpercentage effect\b/gi, "net percentage change")
    .replace(/\bworking base\b/gi, "reference amount")
    .replace(/\bcomparison quantity\b/gi, "comparison amount")
    .replace(/\bThe winner has\b/g, "The winner's share is")
    .replace(/\bthe winner has\b/g, "the winner's share is")
    .replace(/\bwinner got\b/gi, "winning candidate received")
    .replace(/\bgets\b/g, "receives")
    .replace(/\bgot\b/g, "received")
    .replace(/\bApp traffic\b/g, "A mobile application's user traffic")
    .replace(/\bapp traffic\b/g, "mobile application user traffic")
    .replace(/\bFind the winner's votes\b/g, "How many votes did the winner receive")
    .replace(/\bFind the valid vote count\b/g, "Determine the valid vote count")
    .replace(/\bFind the final users\b/g, "Determine the final user count")
    .replace(/\bFind the final count\b/g, "Determine the final count")
    .replace(/\bFind the final population\b/g, "Determine the final population")
    .replace(/\bFind the amount left\b/g, "How much amount remains")
    .replace(/\bFind the payable fee\b/g, "What fee is payable")
    .replace(/\bFind the new subscription amount\b/g, "What is the revised subscription amount")
    .replace(/\bFind total marks\b/g, "determine the total marks")
    .replace(/\bFind the maximum marks\b/g, "Determine the maximum marks")
    .replace(/\bFind the percentage rise\b/g, "Determine the percentage rise")
    .replace(/\bFind the percentage increase\b/g, "Determine the percentage increase")
    .replace(/\bFind the percentage reduction\b/g, "Determine the percentage reduction")
    .replace(/\bFind the overall percentage\b/g, "Determine the overall percentage")
    .replace(/\breported change\b/g, "change")
    .replace(/\bUse the reported change\b/g, "Use the change");

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  if (
    wordCount < 26 &&
    hasEditorialFrame(text) &&
    !/[.?!]\s+[A-Z]/.test(text)
  ) {
    if (id.includes("election") || id.includes("vote")) {
      text = text.replace(
        /\.\s*$/,
        ". Use the stated margin to determine the required vote count.",
      );
    } else if (id.includes("exam") || id.includes("marks")) {
      text = text.replace(
        /\.\s*$/,
        ". Use the gap from the benchmark to determine the required total.",
      );
    } else if (
      id.includes("price") ||
      id.includes("discount") ||
      id.includes("consumption")
    ) {
      text = text.replace(
        /\.\s*$/,
        ". Use the revised amount to determine the required value.",
      );
    } else if (
      id.includes("population") ||
      id.includes("group")
    ) {
      text = text.replace(
        /\.\s*$/,
        ". Use the change to determine the final count.",
      );
    }
  }

  text = text.replace(
    /(^|[^\$\\])(\d+(?:\.\d+)?)%/g,
    (_match, prefix: string, value: string) =>
      `${prefix}${percentText(Number(value))}`,
  );

  return text;
}

function selectPercentageNarrative(
  id: string,
  candidates: string[],
) {
  const scored = candidates
    .map((candidate) =>
      polishPercentageNarrative(id, candidate),
    )
    .map((candidate) => ({
      candidate,
      signal:
        scorePercentageNarrative(
          id,
          candidate,
        ),
    }))
    .sort(
      (a, b) =>
        b.signal.score - a.signal.score,
    );
  const bestScore =
    scored[0]?.signal.score ?? 0;
  const topBand = scored.filter(
    (entry) =>
      entry.signal.score >=
      bestScore - 4,
  );
  const selected =
    pickRandomItem(topBand) ??
    scored[0];

  if (selected) {
    rememberRecent(
      PERCENTAGE_CONTEXT_MEMORY.domains,
      selected.signal.domain,
    );
    rememberRecent(
      PERCENTAGE_CONTEXT_MEMORY.openings,
      selected.signal.opening,
    );
    rememberRecent(
      PERCENTAGE_CONTEXT_MEMORY.situations,
      selected.candidate
        .toLowerCase()
        .split(/\W+/)
        .filter((word) => word.length > 6)
        .slice(0, 2)
        .join(" "),
    );
    console.info(
      "[percentage-runtime] context synthesis selected",
      {
        motifId: id,
        domain: selected.signal.domain,
        opening: selected.signal.opening,
        realismScore:
          selected.signal.score,
      },
    );
    return selected.candidate;
  }

  return candidates[0] ?? "";
}

function lowerFirstWord(text: string) {
  return text.replace(
    /^([A-Z])/,
    (match) => match.toLowerCase(),
  );
}

function editorialPacingPrefix(id: string) {
  if (
    id.includes("election") ||
    id.includes("vote")
  ) {
    return "In a constituency election";
  }
  if (
    id.includes("exam") ||
    id.includes("marks")
  ) {
    return "In an exam question";
  }
  if (
    id.includes("price") ||
    id.includes("discount") ||
    id.includes("consumption")
  ) {
    return "At a shop counter";
  }
  if (
    id.includes("salary") ||
    id.includes("income") ||
    id.includes("tax") ||
    id.includes("commission")
  ) {
    return "In a salary case";
  }
  if (
    id.includes("population") ||
    id.includes("group")
  ) {
    return "In a town survey";
  }
  if (
    id.includes("mixture") ||
    id.includes("fruit") ||
    id.includes("alloy")
  ) {
    return "In a mixture problem";
  }
  if (
    id.includes("machine") ||
    id.includes("depreciation")
  ) {
    return "In a depreciation case";
  }
  return "In a simple exam question";
}

function hasEditorialFrame(text: string) {
  return /^(in|during|after|following|according to|with|out of|from|while|as part of)\b/i.test(
    text.trim(),
  );
}

function addEditorialPacing(
  id: string,
  text: string,
) {
  const wordCount =
    text.trim().split(/\s+/).filter(Boolean)
      .length;

  if (
    wordCount >= 28 ||
    hasEditorialFrame(text)
  ) {
    return text;
  }

  return `${editorialPacingPrefix(id)}, ${lowerFirstWord(text)}`;
}

function styleRealizations(
  id: string,
  values: Record<string, number>,
  style: RealizationStyle,
) {
  const ask = (text: string) => text;

  switch (id) {
    case "perc_basic_of":
      return [
        `A transaction of ${money(values.base)} requires ${percentText(values.rate)} to be set aside. What is the amount?`,
        `A training budget of ${money(values.base)} keeps ${percentText(values.rate)} ready before spending begins. How much is kept aside?`,
        `An online bill of ${money(values.base)} has ${percentText(values.rate)} as a separate charge. What is that amount?`,
      ];

    case "perc_reverse_find":
      return [
        `A payment of ${money(values.value)} is ${percentText(values.rate)} of the full amount. What was the full amount?`,
        `A fee of ${money(values.value)} equals ${percentText(values.rate)} of the total invoice. What was the invoice amount?`,
        `A club spent ${money(values.value)}, which was ${percentText(values.rate)} of its full fund. Find the total fund.`,
      ];

    case "perc_basic_sum":
      return [
        `One entry is ${percentText(values.x)} of ${money(values.y)} and another is ${percentText(values.a)} of ${money(values.b)}. What is their combined value?`,
        `Two contributions are ${percentText(values.x)} of ${money(values.y)} and ${percentText(values.a)} of ${money(values.b)}. Find the total contribution.`,
      ];

    case "perc_marks_calc":
      return [
        `A candidate scored ${values.scored} marks out of ${values.total}. Calculate the percentage score.`,
        `A candidate got ${values.scored} marks from ${values.total}. What is the percentage score?`,
      ];

    case "perc_a_more_than_b":
      return [
        `If A's revenue is ${percentText(values.more)} higher than B's, find by what percent B's revenue is lower than A's.`,
        `A makes ${percentText(values.more)} more than B. What percent less is B's revenue than A's?`,
      ];

    case "perc_vote_election":
      return [
        ask(
          `In a constituency election, the winner earns ${percentText(values.winnerRate)} of valid votes and wins by ${values.margin} votes. How many valid votes were counted?`,
        ),
        `The winner gets ${percentText(values.winnerRate)} of valid votes with a margin of ${values.margin} votes. Find the valid vote total.`,
        `A lead of ${values.margin} votes comes when the winner has ${percentText(values.winnerRate)} of valid votes. What is the valid vote count?`,
      ];

    case "perc_exam_pass_fail":
      return [
        ask(
          `A candidate scored ${percentText(values.scoredRate)} but missed the pass mark by ${values.shortBy} marks. If passing is ${percentText(values.passRate)}, what are the maximum marks?`,
        ),
        `A candidate needed ${percentText(values.passRate)} to pass but scored ${percentText(values.scoredRate)} and lost by ${values.shortBy} marks. Find the total marks.`,
        `The qualifying score is ${percentText(values.passRate)} and the candidate scored ${percentText(values.scoredRate)}. He fell short by ${values.shortBy} marks. What is the paper's total marks?`,
      ];

    case "perc_election_invalid":
      return [
        `A constituency has ${values.voters} voters. ${values.noVote}% do not vote, and ${values.invalid}% of cast votes are invalid. The winner gets ${values.winnerValid}% of valid votes. How many votes did the winner receive?`,
        `Out of ${values.voters} voters, ${values.noVote}% stay away and ${values.invalid}% of cast votes are invalid. The winner gets ${values.winnerValid}% of valid votes. Find the winner's votes.`,
        `From ${values.voters} registered voters, ${values.noVote}% do not vote and ${values.invalid}% of cast votes are rejected. The winner gets ${values.winnerValid}% of valid votes. How many votes is that?`,
      ];

    case "perc_price_increase":
      return [
        `A price of ${money(values.price)} rises by ${values.rate}%. What is the new price?`,
        `A fee of ${money(values.price)} is increased by ${values.rate}%. Find the revised amount.`,
      ];

    case "perc_price_decrease":
      return [
        `A price of ${money(values.price)} goes down by ${values.rate}%. What is the final price?`,
        `A fee of ${money(values.price)} is reduced by ${values.rate}%. Find the payable amount.`,
      ];

    case "perc_successive_hike":
      return [
        `A value starts at ${values.value}. It rises by ${values.r1}% and then by ${values.r2}%. What is the final value?`,
        `A user base of ${values.value} grows by ${values.r1}% then by ${values.r2}%. What is the final count?`,
      ];

    case "perc_price_consumption":
      return [
        `The market price of sugar rises by ${percentText(values.increase)}. By what percent must consumption fall to keep spending unchanged?`,
        `A price rise of ${percentText(values.increase)} means a shopper must cut consumption. Find the required percent decrease in quantity.`,
      ];

    case "perc_income_savings_expense":
      return [
        `Income is ${money(values.income)} and savings are ${values.savingsRate}% of it. Income rises by ${values.incomeIncrease}% but savings stay the same. What percent does spending rise?`,
        `A person keeps the same savings amount even after income rises by ${values.incomeIncrease}%. If savings were ${values.savingsRate}% of the old income ${money(values.income)}, find the percent increase in spending.`,
      ];

    case "perc_weighted_group_change":
      return [
        `Group A has ${values.groupA} students and grows by ${values.rateA}%. Group B has ${values.groupB} students and grows by ${values.rateB}%. What is the overall percentage growth?`,
        `One batch has ${values.groupA} students growing by ${values.rateA}%, the other has ${values.groupB} growing by ${values.rateB}%. Find the combined percentage increase.`,
      ];

    case "perc_population_growth":
      return [
        `A town begins with ${values.population} residents and grows by ${values.rate}% in each of the next two years. What population will there be after the second year?`,
        `A civic count records ${values.population} residents at the start. With ${values.rate}% annual growth for two years, what is the population at the end?`,
      ];

    case "perc_machine_depreciation":
      return [
        `A machine currently valued at ${money(values.value)} depreciates by ${values.rate}% every year. What is its value after two years?`,
        `A company applies ${values.rate}% annual depreciation on equipment worth ${money(values.value)}. What is the value after two full years?`,
      ];

    default:
      return [];
  }
}

function synthesizePercentageScenarioText(
  id: string,
  values: Record<string, number>,
  fallback: string,
) {
  const contextLead = pickRandomItem([
    "A note says that",
    "A small case says that",
    "One situation says that",
    "From the given detail,",
    "For this question,",
  ]);
  const style = pickRealizationStyle(id);
  const selectCandidate = (
    candidates: string[],
  ) =>
    addEditorialPacing(
      id,
      selectPercentageNarrative(
        id,
        [
          ...candidates,
          ...styleRealizations(
            id,
            values,
            style,
          ),
        ],
      ),
    );

  switch (id) {
    case "perc_basic_of":
      return selectCandidate([
        `${contextLead} a teller needs to calculate ${values.rate}% of a transaction value of ${money(values.base)}. What amount is required?`,
        `A school collected ${money(values.base)} for an event. ${values.rate}% of this collection is kept aside for logistics. How much is kept aside?`,
        `An online order worth ${money(values.base)} has a ${values.rate}% adjustment. What is the adjustment amount?`,
        `Out of a total amount of ${money(values.base)}, ${values.rate}% is set aside. What is that amount?`,
        `${values.rate}% of a ${money(values.base)} training budget is reserved before any spending begins. How much is reserved?`,
      ])!;

    case "perc_reverse_find":
      return selectCandidate([
        `${contextLead} ${money(values.value)} is ${values.rate}% of the original budget. What was the original budget?`,
        `A rebate of ${money(values.value)} equals ${values.rate}% of the bill before rebate. What was the bill amount?`,
        `A cricket club spent ${money(values.value)}, which was ${values.rate}% of its total fund. Find the total fund.`,
        `Only ${values.rate}% of a fund was used, and that used amount was ${money(values.value)}. What was the full fund?`,
        `A platform fee of ${money(values.value)} represents ${values.rate}% of the total invoice. Find the invoice value before splitting it.`,
      ])!;

    case "perc_basic_sum":
      return selectCandidate([
        `A festival fund has two entries: ${values.x}% of ${money(values.y)} and ${values.a}% of ${money(values.b)}. What is the combined amount?`,
        `${contextLead} two departments contribute ${values.x}% of ${money(values.y)} and ${values.a}% of ${money(values.b)}. Find the total contribution.`,
      ])!;

    case "perc_marks_calc":
      return selectCandidate([
        `In a competitive examination, an aspirant secured ${values.scored} marks out of a total maximum of ${values.total} marks. Calculate the aggregate percentage score achieved by the candidate.`,
        `In a competitive examination, an aspirant secured ${values.scored} marks out of a total maximum of ${values.total} marks. Calculate the aggregate percentage score achieved by the candidate.`,
      ])!;

    case "perc_a_more_than_b":
      return selectCandidate([
        `If the monthly revenue generated by entity A is ${percentText(values.more)} higher than the revenue of entity B, then determine by what percentage the revenue of entity B is lower than that of entity A.`,
        `If the monthly revenue generated by entity A is ${percentText(values.more)} higher than the revenue of entity B, then determine by what percentage the revenue of entity B is lower than that of entity A.`,
      ])!;

    case "perc_price_increase":
      return selectCandidate([
        `A transport pass costing ${money(values.price)} is increased by ${values.rate}%. What is the revised fare?`,
        `A monthly subscription of ${money(values.price)} becomes ${values.rate}% costlier. Find the new subscription amount.`,
        `A service charge of ${money(values.price)} is raised by ${values.rate}%. What is the new amount?`,
        `The old charge was ${money(values.price)}. After a ${values.rate}% increase, calculate the payable amount now.`,
        `A pass priced at ${money(values.price)} is raised by ${values.rate}%. What is the revised price?`,
        `A product priced at ${money(values.price)} is increased by ${values.rate}%. Find the final price.`,
      ])!;

    case "perc_price_decrease":
      return selectCandidate([
        `A smartphone listed at ${money(values.price)} gets a ${values.rate}% festival markdown. What price will the customer pay?`,
        `A travel ticket priced at ${money(values.price)} is reduced by ${values.rate}%. Find the revised fare.`,
        `A product priced at ${money(values.price)} is lowered by ${values.rate}%. What amount is charged?`,
        `A course fee of ${money(values.price)} is reduced by ${values.rate}% for early registration. Find the payable amount.`,
        `At the checkout counter, a product priced at ${money(values.price)} is discounted by ${values.rate}%. What is the final amount?`,
        `For early applicants, a fee of ${money(values.price)} is reduced by ${values.rate}%. Calculate the final payable amount.`,
      ])!;

    case "perc_salary_hike":
      return selectCandidate([
        `An employee's salary moves from ${money(values.oldSalary)} to ${money(values.newSalary)} after appraisal. What is the hike percentage?`,
        `A startup revises a stipend from ${money(values.oldSalary)} to ${money(values.newSalary)}. Find the percentage rise.`,
        `After appraisal, an employee's monthly salary is revised from ${money(values.oldSalary)} to ${money(values.newSalary)}. What percentage hike was granted?`,
        `In a payroll revision, a stipend changes from ${money(values.oldSalary)} to ${money(values.newSalary)}. Find the percentage increase in the stipend.`,
      ])!;

    case "perc_population_growth":
      return selectCandidate([
        `A town has ${values.population} residents. Its population grows by ${values.rate}% each year for 2 years. What will be the population after 2 years?`,
        `A healthcare survey starts with ${values.population} people and records ${values.rate}% yearly growth for two years. Find the final count.`,
        `With ${values.population} residents at the start, a town grows by ${values.rate}% each year for two years. What is the population after the second year?`,
        `A membership drive begins with ${values.population} members. The count rises by ${values.rate}% in the first year and the same rate in the next year. Find the final membership.`,
        `A local count starts with ${values.population} residents and grows at ${values.rate}% per year for two years. What is the population at the end?`,
      ])!;

    case "perc_machine_depreciation":
      return selectCandidate([
        `A delivery machine valued at ${money(values.value)} loses ${values.rate}% of its remaining value every year. What is its value after 2 years?`,
        `A business asset worth ${money(values.value)} depreciates by ${values.rate}% annually for two years. Find its new value.`,
        `A machine worth ${money(values.value)} loses ${values.rate}% each year. What is its value after two years?`,
        `A company applies ${values.rate}% annual depreciation to a machine worth ${money(values.value)}. Find the value after two full years.`,
      ])!;

    case "perc_sequential_spend":
      return selectCandidate([
        `From a salary of ${money(values.income)}, ${values.rent}% goes to rent. Then ${values.food}% of the remaining money goes to food. How much money is left?`,
        `A monthly budget of ${money(values.income)} is split in stages: first ${values.rent}% for rent, then ${values.food}% of the balance for food. Find the balance left.`,
        `A person starts the month with ${money(values.income)}. After setting aside ${values.rent}% for rent, ${values.food}% of the remaining amount is spent on food. How much remains?`,
        `In a household budget of ${money(values.income)}, rent takes ${values.rent}% first. Food then takes ${values.food}% of what is left. Find the final balance.`,
      ])!;

    case "perc_successive_hike":
      return selectCandidate([
        `An index starts at ${values.value}. It rises first by ${values.r1}% and then by ${values.r2}%. What is the final index value?`,
        `A startup's monthly users are ${values.value}. They grow by ${values.r1}% in one month and ${values.r2}% in the next. Find the final users.`,
        `A performance score of ${values.value} increases by ${values.r1}% and then by ${values.r2}% on the new score. What is the final score?`,
        `Starting from ${values.value}, a platform's active users rise by ${values.r1}% and then by ${values.r2}% in the next cycle. What is the final count?`,
        `After two successive increases of ${values.r1}% and ${values.r2}%, what is the final value of ${values.value}?`,
      ])!;

    case "perc_restore_value":
      return selectCandidate([
        `A fee is cut by ${values.cut}%. Later it must return to its old level. What percentage rise is needed on the reduced fee?`,
        `A budget is reduced by ${values.cut}%. By what percent must the reduced budget increase to become the original budget again?`,
        `After a ${values.cut}% rollback, a subscription price has to be restored to its earlier level. What percentage increase is required from the reduced price?`,
        `A department receives a ${values.cut}% budget cut. To recover the original allocation later, what percentage jump is needed on the cut budget?`,
      ])!;

    case "perc_compound_error":
      return selectCandidate([
        `A value rises by ${values.rate}% and later falls by the same ${values.rate}%. What is the net percentage change?`,
        `A stock index gains ${values.rate}% in the morning and loses ${values.rate}% later. Find the overall percentage change.`,
        `A platform's daily visits rise by ${values.rate}% in the first half of the day, then fall by ${values.rate}% from that higher level. What is the net percentage change?`,
        `A commodity rate climbs ${values.rate}% and is later corrected downward by the same ${values.rate}%. Find the final percentage change from the original rate.`,
      ])!;

    case "perc_vote_election":
      return selectCandidate([
        `In a two-candidate election, the winning candidate receives ${values.winnerRate}% of the valid votes and the victory margin is ${values.margin} votes. How many valid votes were polled?`,
        `A constituency result shows a ${values.margin}-vote win. The winner has ${values.winnerRate}% of valid votes. Find the valid vote count.`,
        `The winning candidate secured ${values.winnerRate}% of the valid votes and won by ${values.margin} votes. How many valid votes were counted?`,
        `In a straight contest, a ${values.margin}-vote lead separates the two candidates. If the winner's share is ${values.winnerRate}% of valid votes, find the valid vote total.`,
        `A result note shows the winner at ${values.winnerRate}% of valid votes with a lead of ${values.margin} votes. What was the valid vote count?`,
        `In a constituency election, the winner secured ${values.winnerRate}% of valid votes and won by ${values.margin} votes. Find the total number of valid votes.`,
        `In a two-candidate count, the winner's valid-vote share is ${values.winnerRate}% and the lead is ${values.margin} votes. How many valid votes were counted in all?`,
      ])!;

    case "perc_exam_pass_fail":
      return selectCandidate([
        `A candidate gets ${values.scoredRate}% marks but misses the pass mark by ${values.shortBy} marks. The pass mark is ${values.passRate}%. What are the maximum marks?`,
        `In a recruitment test, ${values.scoredRate}% is short of passing by ${values.shortBy} marks. If passing requires ${values.passRate}%, find total marks.`,
        `A candidate scored ${values.scoredRate}% in a test and still fell short of the qualifying mark by ${values.shortBy} marks. The qualifying mark is ${values.passRate}%. Find the maximum marks.`,
        `The cutoff is ${values.passRate}%, but a candidate at ${values.scoredRate}% misses it by ${values.shortBy} marks. What is the total score of the paper?`,
        `A scorecard shows ${values.scoredRate}% marks. Since this is ${values.shortBy} marks below the ${values.passRate}% cutoff, find the maximum marks.`,
        `In a qualifying exam, a candidate scoring ${values.scoredRate}% falls short of the required ${values.passRate}% by ${values.shortBy} marks. Find the maximum marks of the exam.`,
        `The qualifying benchmark is ${values.passRate}%. A candidate who scored ${values.scoredRate}% missed it by ${values.shortBy} marks, so what was the paper's total marks?`,
      ])!;

    case "perc_election_invalid":
      return selectCandidate([
        `A voter list has ${values.voters} names. ${values.noVote}% do not vote, and ${values.invalid}% of the votes cast are invalid. The winner receives ${values.winnerValid}% of valid votes. How many votes does the winner get?`,
        `In an election with ${values.voters} voters, turnout and validity both reduce the count: ${values.noVote}% stay away and ${values.invalid}% of cast votes are invalid. The winner gets ${values.winnerValid}% of valid votes. Find the winner's votes.`,
        `Out of ${values.voters} registered voters, ${values.noVote}% stayed away. From the votes that were cast, ${values.invalid}% were rejected. The winner secured ${values.winnerValid}% of the valid votes; find the winner's vote count.`,
        `A polling count lists ${values.voters} voters. After ${values.noVote}% abstention and ${values.invalid}% invalid votes among those cast, the winner's share is ${values.winnerValid}% of valid votes. How many votes did the winner receive?`,
        `A polling booth has ${values.voters} registered voters. ${values.noVote}% do not vote and ${values.invalid}% of cast votes are invalid. The winner secures ${values.winnerValid}% of valid votes. Find the winner's votes.`,
        `A constituency has ${values.voters} listed voters. After ${values.noVote}% abstention and ${values.invalid}% invalid ballots, the winner receives ${values.winnerValid}% of the valid votes. How many votes is that?`,
      ])!;

    case "perc_price_consumption":
      return selectCandidate([
        `Due to market fluctuations, the market price of sugar increases by ${percentText(values.increase)}. Find the percentage reduction a consumer must make in their consumption volume to keep the total expenditure unchanged.`,
        `Due to market fluctuations, the market price of sugar increases by ${percentText(values.increase)}. Find the percentage reduction a consumer must make in their consumption volume to keep the total expenditure unchanged.`,
      ])!;

    case "perc_mixture_water_add":
      return selectCandidate([
        `A juice counter has ${values.mixture} L mixture with ${values.initial}% water. Only water is added until water becomes ${values.target}% of the new mixture. How many litres of water are added?`,
        `A tank contains ${values.mixture} L solution with ${values.initial}% water. Extra water is poured in to make the water share ${values.target}%. Find the water added.`,
        `In a ${values.mixture} L mixture, water currently forms ${values.initial}% of the content. If only water is added until its share becomes ${values.target}%, how many litres are added?`,
        `A lab container holds ${values.mixture} L of solution with ${values.initial}% water. Water is added to bring the concentration to ${values.target}%. Find the amount of water added.`,
      ])!;

    case "perc_fruit_dry_weight":
      return selectCandidate([
        `${values.fresh} kg of fresh fruit contains ${values.freshWater}% water. After drying, water becomes ${values.dryWater}% of the final weight. What is the dry fruit weight?`,
        `A fruit trader dries ${values.fresh} kg of produce. Fresh fruit has ${values.freshWater}% water, while dried fruit has ${values.dryWater}% water. Find the final weight.`,
        `A trader starts with ${values.fresh} kg of fresh fruit containing ${values.freshWater}% water. After drying, the water content is ${values.dryWater}% of the final weight. What is the dry weight?`,
        `During dehydration, ${values.fresh} kg of fruit goes from ${values.freshWater}% water content to ${values.dryWater}% water content. Find the final weight of the fruit.`,
      ])!;

    case "perc_income_savings_expense":
      return selectCandidate([
        `A person earns ${money(values.income)} and saves ${values.savingsRate}% of it. Income rises by ${values.incomeIncrease}%, but saving stays unchanged. By what percent does expenditure rise?`,
        `A household income is ${money(values.income)}. Savings are fixed at ${values.savingsRate}% of the old income. If income increases by ${values.incomeIncrease}%, find the percentage rise in spending.`,
        `Monthly income was ${money(values.income)}, with ${values.savingsRate}% saved. After a ${values.incomeIncrease}% income rise, the saving amount is kept unchanged. Find the percentage increase in spending.`,
        `A family saving target is fixed at ${values.savingsRate}% of an old income of ${money(values.income)}. When income rises by ${values.incomeIncrease}%, how much does expenditure rise in percentage terms?`,
      ])!;

    case "perc_weighted_group_change":
      return selectCandidate([
        `A coaching centre has ${values.groupA} students in group A and ${values.groupB} in group B. Group A grows by ${values.rateA}% and group B by ${values.rateB}%. Find the overall percentage growth.`,
        `Two batches grow at different rates: ${values.groupA} students rise by ${values.rateA}%, while ${values.groupB} students rise by ${values.rateB}%. What is the combined percentage increase?`,
        `Group A starts with ${values.groupA} learners and expands by ${values.rateA}%. Group B starts with ${values.groupB} learners and expands by ${values.rateB}%. What is the overall percentage increase across both groups?`,
        `A centre tracks two batches separately: ${values.groupA} students in one batch grow by ${values.rateA}%, and ${values.groupB} students in the other grow by ${values.rateB}%. Find the combined growth rate.`,
        `One batch has ${values.groupA} students and grows by ${values.rateA}%, while the other has ${values.groupB} students and grows by ${values.rateB}%. What is the overall percentage rise in enrolment?`,
      ])!;

    default:
      return fallback;
  }
}

const definitions: PercentageDefinition[] = [
  {
    id: "perc_basic_of",
    difficulty: ["Easy"],
    create: () => {
      const base = pickRandomItem([120, 160, 240, 320, 480, 600, 750, 900]);
      const rate = pickRandomItem([5, 10, 12.5, 20, 25, 40, 50, 75]);
      return scenario("perc_basic_of", { base, rate }, `What is ${rate} percentage of ${base}?`, pct(base, rate), [`Required value = ${base} x ${rate} / 100.`]);
    },
  },
  {
    id: "perc_reverse_find",
    difficulty: ["Medium"],
    create: () => {
      const base = pickRandomItem([160, 240, 320, 400, 600, 800]);
      const rate = pickRandomItem([10, 20, 25, 40, 50, 75]);
      const value = pct(base, rate);
      return scenario("perc_reverse_find", { value, rate, base }, `${value} is ${rate} percentage of what number?`, base, [`Base = ${value} x 100 / ${rate}.`]);
    },
  },
  {
    id: "perc_fraction_to_perc",
    difficulty: ["Easy"],
    create: () => {
      const pairs = [[1, 2], [1, 4], [3, 4], [2, 5], [3, 5], [7, 20]];
      const [a, b] = pickRandomItem(pairs)!;
      return scenario("perc_fraction_to_perc", { a, b }, `Convert the fraction ${a}/${b} into percentage.`, (a / b) * 100, [`Percentage = ${a}/${b} x 100.`]);
    },
  },
  {
    id: "perc_decimal_to_perc",
    difficulty: ["Easy"],
    create: () => {
      const decimal = pickRandomItem([0.12, 0.25, 0.36, 0.45, 0.64, 0.875]);
      return scenario("perc_decimal_to_perc", { decimal }, `Convert ${decimal} into percentage.`, decimal * 100, [`Percentage = ${decimal} x 100.`]);
    },
  },
  {
    id: "perc_basic_sum",
    difficulty: ["Easy", "Medium"],
    create: () => {
      const y = pickRandomItem([100, 160, 200, 240, 300]);
      const b = pickRandomItem([120, 180, 240, 360, 400]);
      const x = pickRandomItem([10, 20, 25, 40]);
      const a = pickRandomItem([5, 10, 12.5, 25]);
      return scenario("perc_basic_sum", { x, y, a, b }, `Find ${x} percentage of ${y} plus ${a} percentage of ${b}.`, pct(y, x) + pct(b, a), [`First value = ${y} x ${x}/100.`, `Second value = ${b} x ${a}/100; add both values.`]);
    },
  },
  {
    id: "perc_marks_calc",
    difficulty: ["Easy"],
    create: () => {
      const total = pickRandomItem([80, 100, 120, 150, 200]);
      const rate = pickRandomItem([55, 60, 65, 72, 75, 80]);
      const scored = pct(total, rate);
      return scenario("perc_marks_calc", { scored, total, rate }, `In a competitive examination, an aspirant secured ${scored} marks out of a total maximum of ${total} marks. Calculate the aggregate percentage score achieved by the candidate.`, rate, [`Percentage = ${scored}/${total} x 100.`]);
    },
  },
  {
    id: "perc_a_more_than_b",
    difficulty: ["Medium"],
    create: () => {
      const more = pickRandomItem([20, 25, 40, 50, 75]);
      const less = (more / (100 + more)) * 100;
      return scenario("perc_a_more_than_b", { more }, `If the monthly revenue generated by entity A is ${percentText(more)} higher than the revenue of entity B, then determine by what percentage the revenue of entity B is lower than that of entity A.`, less, [`Take B = 100, so A = ${100 + more}.`, `B is less than A by ${more}/${100 + more} x 100.`]);
    },
  },
  {
    id: "perc_price_increase",
    difficulty: ["Medium"],
    create: () => {
      const price = pickRandomItem([400, 500, 800, 1200, 1500]);
      const rate = pickRandomItem([10, 12.5, 20, 25, 40]);
      return scenario("perc_price_increase", { price, rate }, `A price of ${price} is increased by ${rate} percentage. Find the new price.`, price * (1 + rate / 100), [`New price = ${price} x (1 + ${rate}/100).`]);
    },
  },
  {
    id: "perc_price_decrease",
    difficulty: ["Medium"],
    create: () => {
      const price = pickRandomItem([400, 500, 800, 1200, 1500]);
      const rate = pickRandomItem([10, 12.5, 20, 25, 40]);
      return scenario("perc_price_decrease", { price, rate }, `A price of ${price} is decreased by ${rate} percentage. Find the new price.`, price * (1 - rate / 100), [`New price = ${price} x (1 - ${rate}/100).`]);
    },
  },
  {
    id: "perc_salary_hike",
    difficulty: ["Medium"],
    create: () => {
      const oldSalary = pickRandomItem([20000, 24000, 30000, 36000, 50000]);
      const hike = pickRandomItem([10, 15, 20, 25, 30]);
      const newSalary = oldSalary * (1 + hike / 100);
      return scenario("perc_salary_hike", { oldSalary, newSalary }, `A salary increases from ${oldSalary} to ${newSalary}. Find the percentage hike.`, hike, [`Hike percentage = (${newSalary} - ${oldSalary})/${oldSalary} x 100.`]);
    },
  },
  {
    id: "perc_population_growth",
    difficulty: ["Medium", "Hard"],
    create: () => {
      const population = pickRandomItem([10000, 20000, 50000, 80000]);
      const rate = pickRandomItem([5, 10, 12, 20]);
      return scenario("perc_population_growth", { population, rate, years: 2 }, `A population of ${population} grows at ${rate} percentage per year for 2 years. Find the final population.`, population * (1 + rate / 100) ** 2, [`Final population = ${population} x (1 + ${rate}/100)^2.`]);
    },
  },
  {
    id: "perc_machine_depreciation",
    difficulty: ["Medium", "Hard"],
    create: () => {
      const value = pickRandomItem([20000, 40000, 50000, 80000]);
      const rate = pickRandomItem([10, 12.5, 20, 25]);
      return scenario("perc_machine_depreciation", { value, rate, years: 2 }, `A machine worth ${value} depreciates by ${rate} percentage every year for 2 years. Find its value after 2 years.`, value * (1 - rate / 100) ** 2, [`Final value = ${value} x (1 - ${rate}/100)^2.`]);
    },
  },
  {
    id: "perc_sequential_spend",
    difficulty: ["Medium", "Hard"],
    create: () => {
      const income = pickRandomItem([20000, 30000, 40000, 50000]);
      const rent = pickRandomItem([20, 25, 30]);
      const food = pickRandomItem([10, 20, 25]);
      const remaining = income * (1 - rent / 100) * (1 - food / 100);
      return scenario("perc_sequential_spend", { income, rent, food }, `A person spends ${rent} percentage of income on rent and then ${food} percentage of the remaining amount on food. If income is ${income}, find the amount left.`, remaining, [`After rent, remaining = ${income} x (1 - ${rent}/100).`, `After food, remaining = previous amount x (1 - ${food}/100).`]);
    },
  },
  {
    id: "perc_successive_hike",
    difficulty: ["Medium", "Hard"],
    create: () => {
      const value = pickRandomItem([1000, 2000, 5000, 10000]);
      const r1 = pickRandomItem([10, 20, 25]);
      const r2 = pickRandomItem([10, 15, 20]);
      return scenario("perc_successive_hike", { value, r1, r2 }, `A value of ${value} receives successive hikes of ${r1} percentage and ${r2} percentage. Find the final value.`, value * (1 + r1 / 100) * (1 + r2 / 100), [`Final value = ${value} x (1 + ${r1}/100) x (1 + ${r2}/100).`]);
    },
  },
  {
    id: "perc_restore_value",
    difficulty: ["Medium", "Hard"],
    create: () => {
      const cut = pickRandomItem([10, 20, 25, 40]);
      return scenario("perc_restore_value", { cut }, `After a ${cut} percentage cut, what percentage increase is required to restore the original value?`, (cut / (100 - cut)) * 100, [`New value is ${100 - cut} when original is 100.`, `Required increase = ${cut}/${100 - cut} x 100.`]);
    },
  },
  {
    id: "perc_compound_error",
    difficulty: ["Medium", "Hard"],
    create: () => {
      const rate = pickRandomItem([10, 20, 25, 40]);
      return scenario("perc_compound_error", { rate }, `A value is increased by ${rate} percentage and then decreased by ${rate} percentage. Find the net percentage change.`, -(rate * rate) / 100, [`Net change = -(${rate} x ${rate})/100 percentage.`]);
    },
  },
  {
    id: "perc_vote_election",
    difficulty: ["Medium", "Hard"],
    create: () => {
      const winnerRate = pickRandomItem([55, 60, 65]);
      const margin = pickRandomItem([1200, 2400, 3600, 4800]);
      return scenario("perc_vote_election", { winnerRate, margin }, `In an election between two candidates, the winner got ${winnerRate} percentage of the votes and won by ${margin} votes. Find the total votes.`, margin / ((2 * winnerRate - 100) / 100), [`Vote difference percentage = ${winnerRate} - ${100 - winnerRate}.`, `Total votes = ${margin} / difference percentage.`]);
    },
  },
  {
    id: "perc_exam_pass_fail",
    difficulty: ["Medium", "Hard"],
    create: () => {
      const scoredRate = pickRandomItem([30, 35, 40]);
      const passRate = scoredRate + pickRandomItem([5, 10, 15]);
      const shortBy = pickRandomItem([20, 30, 45, 60]);
      return scenario("perc_exam_pass_fail", { scoredRate, passRate, shortBy }, `A candidate scored ${scoredRate} percentage marks and failed by ${shortBy} marks. If the pass percentage is ${passRate}, find the maximum marks.`, shortBy / ((passRate - scoredRate) / 100), [`Difference percentage = ${passRate} - ${scoredRate}.`, `Maximum marks = ${shortBy} / difference percentage.`]);
    },
  },
  {
    id: "perc_rect_length_increase",
    difficulty: ["Hard"],
    create: () => {
      const l = pickRandomItem([10, 20, 25]);
      const b = pickRandomItem([10, 15, 20]);
      return scenario("perc_rect_length_increase", { lengthChange: l, breadthChange: -b }, `The length of a rectangle is increased by ${l} percentage and breadth is decreased by ${b} percentage. Find the percentage change in area.`, ((1 + l / 100) * (1 - b / 100) - 1) * 100, [`Area multiplier = (1 + ${l}/100)(1 - ${b}/100).`]);
    },
  },
  {
    id: "perc_circle_radius_change",
    difficulty: ["Hard"],
    create: () => {
      const rate = pickRandomItem([10, 20, 25, 50]);
      return scenario("perc_circle_radius_change", { rate }, `The radius of a circle is increased by ${rate} percentage. Find the percentage change in area.`, ((1 + rate / 100) ** 2 - 1) * 100, [`Area depends on radius squared, so multiplier = (1 + ${rate}/100)^2.`]);
    },
  },
  {
    id: "perc_cube_volume_change",
    difficulty: ["Hard"],
    create: () => {
      const rate = pickRandomItem([10, 20, 25]);
      return scenario("perc_cube_volume_change", { rate }, `The side of a cube is increased by ${rate} percentage. Find the percentage change in volume.`, ((1 + rate / 100) ** 3 - 1) * 100, [`Volume depends on side cubed, so multiplier = (1 + ${rate}/100)^3.`]);
    },
  },
  {
    id: "perc_square_perimeter",
    difficulty: ["Hard"],
    create: () => {
      const rate = pickRandomItem([10, 20, 25, 40]);
      return scenario("perc_square_perimeter", { rate }, `The perimeter of a square is increased by ${rate} percentage. Find the percentage increase in side.`, rate, [`Perimeter is directly proportional to side.`]);
    },
  },
  {
    id: "perc_mixture_replacement",
    difficulty: ["Hard"],
    create: () => {
      const candidates = [
        { r1: 3, r2: 2, total: 100, replaced: 20 },
        { r1: 4, r2: 1, total: 120, replaced: 30 },
        { r1: 5, r2: 3, total: 160, replaced: 40 },
        { r1: 7, r2: 5, total: 240, replaced: 60 },
        { r1: 2, r2: 1, total: 90, replaced: 30 },
      ];
      const item = pickRandomItem(candidates);
      const initial =
        ratioEngine.parts(
          item.total,
          item.r1,
          item.r2,
        );
      const retainedTotal =
        item.total - item.replaced;
      const retained =
        ratioEngine.parts(
          retainedTotal,
          item.r1,
          item.r2,
        );
      const finalMilk = retained.first;
      const finalWater =
        retained.second + item.replaced;
      const [r3, r4] =
        ratioEngine.reduce(
          Math.round(finalMilk),
          Math.round(finalWater),
        );

      return scenario(
        "perc_mixture_replacement",
        {
          r1: item.r1,
          r2: item.r2,
          replaced: item.replaced,
          r3,
          r4,
          total: item.total,
          initialMilk: initial.first,
          initialWater: initial.second,
        },
        `A vessel contains milk and water in the ratio ${item.r1}:${item.r2}. ${item.replaced} liters of mixture are replaced with water. If the new ratio is ${r3}:${r4}, find the original quantity of mixture.`,
        item.total,
        [
          `Initial milk and water are in the ratio ${item.r1}:${item.r2}.`,
          `${item.replaced} liters removed keeps the same ratio in the remaining mixture.`,
          `${item.replaced} liters of pure water is then added, and the final ratio becomes ${r3}:${r4}.`,
        ],
      );
    },
  },
  {
    id: "perc_mixture_water_add",
    difficulty: ["Hard"],
    create: () => {
      const mixture = pickRandomItem([40, 50, 60, 80]);
      const initial = pickRandomItem([10, 20, 25]);
      const target = initial + pickRandomItem([10, 15, 20]);
      const water = pct(mixture, initial);
      const add = ((target / 100) * mixture - water) / (1 - target / 100);
      return scenario("perc_mixture_water_add", { mixture, initial, target }, `${mixture} L mixture contains ${initial} percentage water. How much water must be added to make water ${target} percentage?`, add, [`Initial water = ${mixture} x ${initial}/100.`, `Let added water be x; (initial water + x)/(mixture + x) = ${target}/100.`]);
    },
  },
  {
    id: "perc_fruit_dry_weight",
    difficulty: ["Hard"],
    create: () => {
      const fresh = pickRandomItem([100, 180, 200]);
      const freshWater = pickRandomItem([75, 80]);
      const dryWater = pickRandomItem([10, 20]);
      const solids =
        variation.retainedSolidWeight(
          fresh,
          freshWater,
        );
      return scenario("perc_fruit_dry_weight", { fresh, freshWater, dryWater }, `Fresh fruit weighs ${fresh} kg and contains ${freshWater} percentage water. Dry fruit contains ${dryWater} percentage water. Find the dry weight.`, variation.finalWeightFromSolid(solids, dryWater), [`Solid matter remains constant = ${fresh} x (1 - ${freshWater}/100).`, `Dry weight = solid matter / (1 - ${dryWater}/100).`]);
    },
  },
  {
    id: "perc_tax_income",
    difficulty: ["Hard"],
    create: () => {
      const increase = pickRandomItem([3000, 6000, 9000, 12000]);
      return scenario("perc_tax_income", { increase, oldRate: 20, newRate: 15 }, `Income increases by ${increase}, while tax rate drops from 20 percentage to 15 percentage. If total tax remains the same, find the original income.`, 3 * increase, [`Let original income be x.`, `20% of x = 15% of (x + ${increase}).`]);
    },
  },
  {
    id: "perc_election_invalid",
    difficulty: ["Hard"],
    create: () => {
      const voters = pickRandomItem([50000, 80000, 100000]);
      const noVote = 10;
      const invalid = 10;
      const winnerValid = 54;
      const castVotes =
        variation.applyPercent(
          voters,
          100 - noVote,
        );
      const validVotes =
        variation.applyPercent(
          castVotes,
          100 - invalid,
        );
      return scenario("perc_election_invalid", { voters, noVote, invalid, winnerValid }, `${noVote} percentage voters did not vote and ${invalid} percentage of cast votes were invalid. The winner got ${winnerValid} percentage of valid votes. If total voters are ${voters}, find the winner's votes.`, pct(validVotes, winnerValid), [`Cast votes = ${voters} x (1 - ${noVote}/100).`, `Valid votes = cast votes x (1 - ${invalid}/100).`, `Winner votes = valid votes x ${winnerValid}/100.`]);
    },
  },
  {
    id: "perc_sales_commission",
    difficulty: ["Hard"],
    create: () => {
      const salary = pickRandomItem([12000, 15000, 20000]);
      const threshold = pickRandomItem([50000, 80000, 100000]);
      const sales = threshold + pickRandomItem([20000, 40000, 60000]);
      const rate = pickRandomItem([5, 8, 10]);
      return scenario("perc_sales_commission", { salary, threshold, sales, rate }, `A salesperson gets fixed salary ${salary} and ${rate} percentage commission on sales above ${threshold}. If sales are ${sales}, find total income.`, salary + pct(sales - threshold, rate), [`Commission applies only on ${sales} - ${threshold}.`, `Total income = salary + commission.`]);
    },
  },
  {
    id: "perc_price_consumption",
    difficulty: ["Hard"],
    create: () => {
      const increase = pickRandomItem([20, 25, 40, 50]);
      return scenario("perc_price_consumption", { increase }, `Due to market fluctuations, the market price of sugar increases by ${percentText(increase)}. Find the percentage reduction a consumer must make in their consumption volume to keep the total expenditure unchanged.`, (increase / (100 + increase)) * 100, [`Required decrease = ${increase}/${100 + increase} x 100.`]);
    },
  },
  {
    id: "perc_population_gender",
    difficulty: ["Hard"],
    create: () => {
      const males = pickRandomItem([30000, 40000, 50000]);
      const females = pickRandomItem([20000, 30000, 40000]);
      const maleRate = pickRandomItem([10, 20, 25]);
      const femaleRate = pickRandomItem(
        [5, 10, 15].filter(
          (rate) => rate !== maleRate,
        ),
      );
      const total = males + females;
      const newTotal = males * (1 + maleRate / 100) + females * (1 + femaleRate / 100);
      return scenario("perc_population_gender", { total, maleRate, femaleRate, newTotal }, `A town has total population ${total}. Males increase by ${maleRate} percentage and females by ${femaleRate} percentage, making the new population ${newTotal}. Find the original male population.`, males, [`Let original males be x and females be ${total} - x.`, `x(1 + ${maleRate}/100) + (${total} - x)(1 + ${femaleRate}/100) = ${newTotal}.`]);
    },
  },
  {
    id: "perc_alloy_composition",
    difficulty: ["Hard"],
    create: () => {
      const high = pickRandomItem([60, 70, 80]);
      const low = pickRandomItem([20, 30, 40]);
      const target = pickRandomItem([45, 50, 55]);
      return scenario("perc_alloy_composition", { high, low, target }, `Alloy A has ${high} percentage copper and Alloy B has ${low} percentage copper. In what ratio should they be mixed to get ${target} percentage copper?`, round2((target - low) / (high - target)), [`By alligation, A:B = (${target} - ${low}) : (${high} - ${target}).`, `Numeric ratio value A/B is the required answer.`]);
    },
  },
  {
    id: "perc_cheaper_dearer_chain",
    difficulty: ["Medium", "Hard"],
    create: () => {
      const cheaperThanB = pickRandomItem([10, 20, 25, 30]);
      const dearerThanC = pickRandomItem([10, 20, 25, 50]);
      const bIndex = 100;
      const aIndex = bIndex * (1 - cheaperThanB / 100);
      const cIndex = aIndex / (1 + dearerThanC / 100);
      const cCheaperThanB =
        ((bIndex - cIndex) / bIndex) * 100;
      return scenario(
        "perc_cheaper_dearer_chain",
        {
          cheaperThanB,
          dearerThanC,
          bIndex,
          aIndex,
          cIndex: round2(cIndex),
        },
        `Shop A sells an item ${cheaperThanB} percentage cheaper than shop B and ${dearerThanC} percentage costlier than shop C. By what percentage is shop C cheaper than shop B?`,
        cCheaperThanB,
        [
          `Take shop B's price as 100, so shop A's price becomes ${aIndex}.`,
          `Since A is ${dearerThanC}% costlier than C, C = ${aIndex} / (1 + ${dearerThanC}/100).`,
          `Compare C back with B's price of 100 to find the required decrease.`,
        ],
      );
    },
  },
  {
    id: "perc_collection_ticket_change",
    difficulty: ["Hard"],
    create: () => {
      const quantityIncrease = pickRandomItem([20, 25, 40, 50]);
      const collectionDecrease = pickRandomItem([10, 20, 25]);
      const newPriceIndex =
        ((100 - collectionDecrease) /
          (100 + quantityIncrease)) *
        100;
      const priceDecrease = 100 - newPriceIndex;
      return scenario(
        "perc_collection_ticket_change",
        {
          quantityIncrease,
          collectionDecrease,
          newPriceIndex: round2(newPriceIndex),
        },
        `After the ticket price was reduced, ticket sales increased by ${quantityIncrease} percentage but total collection decreased by ${collectionDecrease} percentage. Find the percentage reduction in ticket price.`,
        priceDecrease,
        [
          `Take old price and old ticket count as 100 each, so old collection is 100 x 100.`,
          `New ticket count is ${100 + quantityIncrease} while new collection index is ${100 - collectionDecrease}.`,
          `New price index = new collection index / new ticket count index.`,
        ],
      );
    },
  },
  {
    id: "perc_fraction_value_change",
    difficulty: ["Hard"],
    create: () => {
      const numeratorIncrease = pickRandomItem([10, 20, 25, 50]);
      const denominatorDecrease = pickRandomItem([10, 20, 25]);
      const multiplier =
        (1 + numeratorIncrease / 100) /
        (1 - denominatorDecrease / 100);
      const change = (multiplier - 1) * 100;
      return scenario(
        "perc_fraction_value_change",
        { numeratorIncrease, denominatorDecrease },
        `The numerator of a fraction is increased by ${numeratorIncrease} percentage and its denominator is decreased by ${denominatorDecrease} percentage. Find the percentage change in the value of the fraction.`,
        change,
        [
          `A fraction changes like numerator multiplier divided by denominator multiplier.`,
          `Multiplier = (1 + ${numeratorIncrease}/100) / (1 - ${denominatorDecrease}/100).`,
          `Convert the multiplier change into percentage change.`,
        ],
      );
    },
  },
  {
    id: "perc_income_savings_expense",
    difficulty: ["Hard"],
    create: () => {
      const income = pickRandomItem([40000, 50000, 60000, 80000]);
      const savingsRate = pickRandomItem([10, 20, 25]);
      const incomeIncrease = pickRandomItem([20, 25, 40]);
      const oldSavings = pct(income, savingsRate);
      const oldExpense = income - oldSavings;
      const newIncome = income * (1 + incomeIncrease / 100);
      const newExpense = newIncome - oldSavings;
      const expenseIncrease =
        ((newExpense - oldExpense) / oldExpense) *
        100;
      return scenario(
        "perc_income_savings_expense",
        {
          income,
          savingsRate,
          incomeIncrease,
          oldSavings,
          oldExpense,
          newIncome,
        },
        `A person's income is ${income}. He saves ${savingsRate} percentage of it. If his income increases by ${incomeIncrease} percentage but savings remain the same, find the percentage increase in expenditure.`,
        expenseIncrease,
        [
          `Old savings = ${income} x ${savingsRate}/100; old expenditure is income minus savings.`,
          `New income = ${income} x (1 + ${incomeIncrease}/100), while savings stay unchanged.`,
          `Compare new expenditure with old expenditure.`,
        ],
      );
    },
  },
  {
    id: "perc_weighted_group_change",
    difficulty: ["Hard"],
    create: () => {
      const groupA = pickRandomItem([200, 300, 400]);
      const groupB = pickRandomItem([100, 200, 300]);
      const rateA = pickRandomItem([20, 25, 30]);
      const rateB = pickRandomItem([40, 50, 60]);
      const total = groupA + groupB;
      const finalTotal =
        groupA * (1 + rateA / 100) +
        groupB * (1 + rateB / 100);
      const overallChange =
        ((finalTotal - total) / total) * 100;
      return scenario(
        "perc_weighted_group_change",
        { groupA, groupB, rateA, rateB, total, finalTotal },
        `In a coaching centre, ${groupA} students in group A increase by ${rateA} percentage and ${groupB} students in group B increase by ${rateB} percentage. Find the overall percentage increase in students.`,
        overallChange,
        [
          `Do not average ${rateA}% and ${rateB}% directly because the group sizes are different.`,
          `Calculate the new size of each group separately, then add them.`,
          `Compare the total increase with the original total.`,
        ],
      );
    },
  },
];

const HARD_PERCENTAGE_PRIORITY_IDS = new Set([
  "perc_cheaper_dearer_chain",
  "perc_collection_ticket_change",
  "perc_fraction_value_change",
  "perc_income_savings_expense",
  "perc_weighted_group_change",
  "perc_mixture_replacement",
  "perc_mixture_water_add",
  "perc_fruit_dry_weight",
  "perc_tax_income",
  "perc_election_invalid",
  "perc_sales_commission",
  "perc_population_gender",
  "perc_alloy_composition",
  "perc_rect_length_increase",
  "perc_circle_radius_change",
  "perc_cube_volume_change",
]);

const ULTRA_HARD_PERCENTAGE_IDS = new Set([
  "perc_collection_ticket_change",
  "perc_fraction_value_change",
  "perc_income_savings_expense",
  "perc_weighted_group_change",
  "perc_mixture_replacement",
  "perc_mixture_water_add",
  "perc_fruit_dry_weight",
  "perc_tax_income",
  "perc_election_invalid",
  "perc_population_gender",
  "perc_alloy_composition",
  "perc_sales_commission",
  "perc_price_consumption",
  "perc_exam_pass_fail",
  "perc_vote_election",
  "perc_rect_length_increase",
  "perc_circle_radius_change",
  "perc_cube_volume_change",
  "perc_square_perimeter",
  "perc_restore_value",
  "perc_compound_error",
]);

const MOTIF_STEM_HONOR_RATE = 0.34;

function pickPercentageDefinition(
  difficulty: DifficultyLabel,
  motif?: (QuantMotif & { id?: string }) | null,
  options: {
    targetDifficultyScore?: number;
  } = {},
) {
  const isUltraHard =
    difficulty === "Hard" &&
    (options.targetDifficultyScore ?? 0) >= 8;
  const difficultyMatches =
    definitions.filter((definition) =>
      definition.difficulty.includes(difficulty),
    );

  let pool = difficultyMatches;

  if (difficulty === "Hard") {
    const preferredIds = isUltraHard
      ? ULTRA_HARD_PERCENTAGE_IDS
      : HARD_PERCENTAGE_PRIORITY_IDS;
    const preferred =
      difficultyMatches.filter((definition) =>
        preferredIds.has(definition.id),
      );
    if (preferred.length) {
      pool = preferred;
    }
  }

  if (!pool.length) {
    pool = difficultyMatches;
  }

  const motifDefinition =
    motif?.id &&
    pool.find(
      (definition) =>
        definition.id === motif.id,
    );

  const motifAllowedForUltra =
    !motifDefinition ||
    !isUltraHard ||
    ULTRA_HARD_PERCENTAGE_IDS.has(
      motifDefinition.id,
    );

  if (
    motifDefinition &&
    motifAllowedForUltra &&
    random() < MOTIF_STEM_HONOR_RATE
  ) {
    return motifDefinition;
  }

  return pickRandomItem(pool);
}

export function createPercentageScenario(
  pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
  options: {
    targetDifficultyScore?: number;
  } = {},
): QuantProceduralScenario {
  const selected =
    pickPercentageDefinition(
      difficulty,
      motif,
      options,
    );

  return {
    topicCluster: "percentage",
    ...selected.create(),
    context: {
      entity: pattern.topic,
      metric: "percentage value",
      context: "percentage",
    },
  };
}
