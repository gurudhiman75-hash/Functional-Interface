import type {
  NativeRealizerInput,
  RealizedLanguageBundle,
  RealizerLanguage,
} from "./types";

type Primitive = string | number | boolean | null | undefined;

type Fraction = {
  numerator: number;
  denominator: number;
};

type PercentageArchetype =
  | "productConstancy"
  | "successiveCascading"
  | "differentialBalance"
  | "asymmetricBoundaries"
  | "mixtureConcentration"
  | "populationCascade"
  | "salaryBudgetAllocation"
  | "directBase";

type PercentagePlannerId =
  | "single-increase"
  | "single-decrease"
  | "successive-appreciation"
  | "successive-depreciation"
  | "mixed-percentage-change"
  | "compound-growth"
  | "reverse-recovery"
  | "exam-threshold-gap"
  | "election-filter-chain"
  | "weighted-group-change"
  | "population-gender-system"
  | "product-constancy"
  | "comparative-price-chain"
  | "differential-balance"
  | "generic-percentage";

type PercentageContext = {
  motifId: string;
  values: Record<string, unknown>;
  answer: string;
  options: string[];
  fallbackQuestion: string;
};

const FRACTIONAL_PERCENT_MATRIX: Record<string, Fraction> = {
  "12.5": { numerator: 1, denominator: 8 },
  "16.6666666667": { numerator: 1, denominator: 6 },
  "25": { numerator: 1, denominator: 4 },
  "33.3333333333": { numerator: 1, denominator: 3 },
  "37.5": { numerator: 3, denominator: 8 },
  "50": { numerator: 1, denominator: 2 },
  "62.5": { numerator: 5, denominator: 8 },
  "66.6666666667": { numerator: 2, denominator: 3 },
  "75": { numerator: 3, denominator: 4 },
  "83.3333333333": { numerator: 5, denominator: 6 },
};

const ARCHETYPE_BY_MOTIF: Record<string, PercentageArchetype> = {
  perc_price_consumption: "productConstancy",
  perc_restore_value: "productConstancy",
  perc_cheaper_dearer_chain: "productConstancy",
  perc_successive_hike: "successiveCascading",
  perc_compound_error: "successiveCascading",
  perc_price_increase: "successiveCascading",
  perc_price_decrease: "successiveCascading",
  perc_fraction_value_change: "successiveCascading",
  perc_collection_ticket_change: "successiveCascading",
  perc_population_growth: "populationCascade",
  perc_machine_depreciation: "populationCascade",
  perc_vote_election: "differentialBalance",
  perc_election_invalid: "differentialBalance",
  perc_exam_pass_fail: "differentialBalance",
  perc_population_gender: "differentialBalance",
  perc_weighted_group_change: "differentialBalance",
  perc_a_more_than_b: "asymmetricBoundaries",
  perc_reverse_find: "asymmetricBoundaries",
  perc_basic_of: "directBase",
  perc_basic_sum: "directBase",
  perc_marks_calc: "directBase",
  perc_fraction_to_perc: "directBase",
  perc_decimal_to_perc: "directBase",
  perc_mixture_water_add: "mixtureConcentration",
  perc_mixture_replacement: "mixtureConcentration",
  perc_fruit_dry_weight: "mixtureConcentration",
  perc_alloy_composition: "mixtureConcentration",
  perc_income_savings_expense: "salaryBudgetAllocation",
  perc_sequential_spend: "salaryBudgetAllocation",
  perc_sales_commission: "salaryBudgetAllocation",
  perc_tax_income: "salaryBudgetAllocation",
};

const PLANNER_BY_MOTIF: Record<string, PercentagePlannerId> = {
  perc_price_increase: "single-increase",
  perc_price_decrease: "single-decrease",
  perc_successive_hike: "successive-appreciation",
  perc_machine_depreciation: "successive-depreciation",
  perc_compound_error: "mixed-percentage-change",
  perc_population_growth: "compound-growth",
  perc_restore_value: "reverse-recovery",
  perc_price_consumption: "product-constancy",
  perc_cheaper_dearer_chain: "comparative-price-chain",
  perc_vote_election: "differential-balance",
  perc_election_invalid: "election-filter-chain",
  perc_exam_pass_fail: "exam-threshold-gap",
  perc_population_gender: "population-gender-system",
  perc_weighted_group_change: "weighted-group-change",
};

const LABELS: Record<
  RealizerLanguage,
  {
    coreIdea: string;
    stepMath: string;
    keyInsight: string;
    finalAnswer: string;
  }
> = {
  en: {
    coreIdea: "Core Idea",
    stepMath: "Step-by-Step Math",
    keyInsight: "Key Insight",
    finalAnswer: "Final Answer",
  },
  hi: {
    coreIdea: "मुख्य बात",
    stepMath: "गणना के चरण",
    keyInsight: "छोटी समझ",
    finalAnswer: "अंतिम उत्तर",
  },
  pa: {
    coreIdea: "ਮੁੱਖ ਵਿਚਾਰ",
    stepMath: "ਹੱਲ ਕਰਨ ਦਾ ਤਰੀਕਾ",
    keyInsight: "ਯਾਦ ਰੱਖੋ",
    finalAnswer: "ਅੰਤਿਮ ਉੱਤਰ",
  },
};

const STRATEGY_MAP: Record<
  RealizerLanguage,
  Record<PercentageArchetype, string>
> = {
  en: {
    productConstancy: "The Balancing Act",
    successiveCascading: "The Chain Reaction",
    differentialBalance: "The Gap Bridge",
    asymmetricBoundaries: "The Missing Piece",
    mixtureConcentration: "The Pure Part",
    populationCascade: "The Chain Reaction",
    salaryBudgetAllocation: "The Starting Ground",
    directBase: "The Starting Ground",
  },
  hi: {
    productConstancy: "संतुलन खेल",
    successiveCascading: "क्रमिक बदलाव",
    differentialBalance: "अंतर से आधार",
    asymmetricBoundaries: "अज्ञात हिस्सा",
    mixtureConcentration: "शुद्ध हिस्सा",
    populationCascade: "क्रमिक बदलाव",
    salaryBudgetAllocation: "शुरुआती आधार",
    directBase: "शुरुआती आधार",
  },
  pa: {
    productConstancy: "ਸੰਤੁਲਨ ਖੇਡ",
    successiveCascading: "ਲੜੀਵਾਰ ਬਦਲਾਅ",
    differentialBalance: "ਫਰਕ ਤੋਂ ਅਧਾਰ",
    asymmetricBoundaries: "ਗੁਪਤ ਹਿੱਸਾ",
    mixtureConcentration: "ਸ਼ੁੱਧ ਹਿੱਸਾ",
    populationCascade: "ਲੜੀਵਾਰ ਬਦਲਾਅ",
    salaryBudgetAllocation: "ਸ਼ੁਰੂਆਤੀ ਅਧਾਰ",
    directBase: "ਸ਼ੁਰੂਆਤੀ ਅਧਾਰ",
  },
};

const LEAKAGE_PATTERN =
  /\b(Game Plan|Logical Chain|Trap Alert|Final Result|Reference|Inference|Quick Read|Working|therefore|hence|observe|clearly|base|value|price|winner|votes|ticket|salary|income|expense|mixture|population|students|group|discount|increase|decrease|answer)\b/i;

const GENERIC_LOCALIZATION_PATTERN =
  /प्रतिशत के इस प्रश्न|ਪ੍ਰਤੀਸ਼ਤ ਦੇ ਇਸ ਪ੍ਰਸ਼ਨ|percentage question/i;

const GENERIC_EXPLANATION_FILLER_PATTERN =
  /work backward from the hidden quantity|hidden quantity|concealed base relation|compute the final value|identify the correct base|break the question into small parts|bring the given information onto the same base/i;

function asRecord(
  value: unknown,
): Record<string, unknown> {
  return value &&
    typeof value === "object" &&
    !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value)
      ? value
      : null;
  }
  if (typeof value === "string") {
    const parsed = Number(
      value.replace(/[,%₹Rs.\s]/g, ""),
    );
    return Number.isFinite(parsed)
      ? parsed
      : null;
  }
  return null;
}

function pickNumber(
  values: Record<string, unknown>,
  keys: string[],
): number | null {
  for (const key of keys) {
    const value = toNumber(values[key]);
    if (value !== null) {
      return value;
    }
  }
  return null;
}

function pickString(
  values: Record<string, unknown>,
  keys: string[],
): string | null {
  for (const key of keys) {
    const value = values[key];
    if (
      typeof value === "string" &&
      value.trim()
    ) {
      return value.trim();
    }
  }
  return null;
}

function cleanOption(value: Primitive): string {
  const text =
    value === null ||
    value === undefined
      ? ""
      : String(value);
  return text
    .replace(/^\$+|\$+$/g, "")
    .replace(/\.0+%?$/g, (match) =>
      match.endsWith("%") ? "%" : "",
    )
    .trim();
}

function mathOption(value: string): string {
  if (!value) {
    return value;
  }
  if (/^\$.*\$$/.test(value)) {
    return value;
  }
  const percentMatch = value.match(/^(-?\d+(?:\.\d+)?)%$/);
  if (percentMatch) {
    return `$${percentText(Number(percentMatch[1]))}$`;
  }
  return /^-?\d+(?:\.\d+)?%?$/.test(value)
    ? `$${value}$`
    : value;
}

function normalizeNumericText(value: number): string {
  if (Number.isInteger(value)) {
    return String(value);
  }
  const rounded = Number(value.toFixed(2));
  return Number.isInteger(rounded)
    ? String(rounded)
    : String(rounded);
}

function cleanNumericAnswer(value: string): number | null {
  const parsed = Number(
    value
      .replace(/^\$|\$$/g, "")
      .replace(/%/g, "")
      .replace(/,/g, "")
      .trim(),
  );
  return Number.isFinite(parsed)
    ? parsed
    : null;
}

function assertExpectedAnswer(
  context: PercentageContext,
  expected: number | null,
  planner: string,
) {
  if (expected === null) {
    return;
  }

  const selected =
    cleanNumericAnswer(context.answer);

  if (selected === null) {
    return;
  }

  if (Math.abs(selected - expected) > 0.05) {
    throw new Error(
      `Percentage explanation planner mismatch for ${context.motifId}: ${planner} expected ${expected}, selected ${selected}.`,
    );
  }
}

function plannerIdForMotif(
  motifId: string,
): PercentagePlannerId {
  return (
    PLANNER_BY_MOTIF[motifId] ??
    "generic-percentage"
  );
}

function exactCoreIdeaText(
  language: RealizerLanguage,
  plannerId: PercentagePlannerId,
  archetype: PercentageArchetype,
): string {
  if (language !== "en") {
    return coreIdeaText(language, archetype);
  }

  switch (plannerId) {
    case "single-increase":
      return "Only one upward change is applied, so use the original value as the base.";
    case "single-decrease":
      return "Only one downward change is applied, so subtract the percentage from the original value.";
    case "successive-appreciation":
      return "Both increases happen one after another, so the second increase works on the already increased value.";
    case "successive-depreciation":
      return "Depreciation reduces the remaining value each year, not the original value again.";
    case "mixed-percentage-change":
      return "An increase followed by the same decrease does not cancel out because the bases are different.";
    case "compound-growth":
      return "Growth is compounded, so each year starts from the latest population.";
    case "reverse-recovery":
      return "After a reduction, recovery must be calculated on the smaller updated value.";
    case "exam-threshold-gap":
      return "Use the gap between scored percent and pass percent; that gap equals the missing marks.";
    case "election-filter-chain":
      return "Move through the voting filters in order: total voters, cast votes, valid votes, then winner share.";
    case "weighted-group-change":
      return "Different sized groups need weighted calculation, not a simple average of percentages.";
    case "population-gender-system":
      return "Use one growth rate as the common base, then isolate the extra growth.";
    case "product-constancy":
      return "One quantity changes, but the total spending or product is kept fixed.";
    case "comparative-price-chain":
      return "Use one shop as the reference point, then translate both comparisons through that same reference.";
    case "differential-balance":
      return "Convert the visible gap into a percentage gap, then rebuild the full base.";
    default:
      return coreIdeaText(language, archetype);
  }
}

function exactKeyInsightText(
  language: RealizerLanguage,
  plannerId: PercentagePlannerId,
  archetype: PercentageArchetype,
): string {
  if (language !== "en") {
    return keyInsightText(language, archetype);
  }

  switch (plannerId) {
    case "single-increase":
      return "For a single rise, multiply by the increased factor once.";
    case "single-decrease":
      return "For a single fall, multiply by the remaining factor once.";
    case "successive-appreciation":
      return "Successive increases multiply; they are not simply added.";
    case "successive-depreciation":
      return "Successive depreciation repeatedly works on the reduced value.";
    case "mixed-percentage-change":
      return "Same-percent rise and fall always create a small net loss.";
    case "compound-growth":
      return "The base shifts after every year of growth.";
    case "reverse-recovery":
      return "The recovery percent is measured from the reduced value, not the original value.";
    case "exam-threshold-gap":
      return "The marks shortfall belongs only to the percentage gap, not to the full scored percentage.";
    case "election-filter-chain":
      return "Winner percentage applies only after invalid votes are removed.";
    case "weighted-group-change":
      return "Weighted totals keep group-size differences visible.";
    case "population-gender-system":
      return "The extra population is created only by the difference between the two growth rates.";
    case "product-constancy":
      return "When the product must stay fixed, one side must move in the opposite direction.";
    case "comparative-price-chain":
      return "Cheaper/costlier comparisons change their meaning when the reference shop changes.";
    case "differential-balance":
      return "In gap questions, the difference between two percentages is the real working percentage.";
    default:
      return keyInsightText(language, archetype);
  }
}

function validatePlannerConsistency(
  context: PercentageContext,
  explanation: string,
  plannerId: PercentagePlannerId,
) {
  if (plannerId === "generic-percentage") {
    return;
  }

  const text = stripMath(explanation).toLowerCase();
  const hasIncrease =
    /\bincrease\b|\brise\b|\brises\b|\bgrowth\b|\bgrows\b|\bupward\b/.test(
      text,
    );
  const hasDecrease =
    /\bdecrease\b|\bfall\b|\bfalls\b|\breduce\b|\breduces\b|\breduced\b|\bdepreciation\b|\bdownward\b/.test(
      text,
    );

  if (
    (plannerId === "single-decrease" ||
      plannerId === "successive-depreciation") &&
    hasIncrease
  ) {
    throw new Error(
      `Percentage planner contradiction for ${context.motifId}: ${plannerId} explanation contains increase wording.`,
    );
  }

  if (
    (plannerId === "single-increase" ||
      plannerId === "successive-appreciation" ||
      plannerId === "compound-growth") &&
    hasDecrease
  ) {
    throw new Error(
      `Percentage planner contradiction for ${context.motifId}: ${plannerId} explanation contains decrease wording.`,
    );
  }

  if (
    plannerId === "mixed-percentage-change" &&
    (!hasIncrease || !hasDecrease)
  ) {
    throw new Error(
      `Percentage planner contradiction for ${context.motifId}: mixed change must explain both increase and decrease.`,
    );
  }
}

function percentText(value: number): string {
  const normalized = Number(value.toFixed(10));
  const whole = Math.trunc(normalized);
  const fractionPart = Math.abs(normalized - whole);
  const commonFractions: Fraction[] = [
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
    return `${normalizeNumericText(value)}\\%`;
  }

  if (whole === 0) {
    const sign = normalized < 0 ? "-" : "";
    return `${sign}\\frac{${fraction.numerator}}{${fraction.denominator}}\\%`;
  }

  return `${whole}\\frac{${fraction.numerator}}{${fraction.denominator}}\\%`;
}

function inlinePercentText(
  value: number | null | undefined,
): string {
  return typeof value === "number"
    ? `$${percentText(value)}$`
    : "";
}

function escapeLatexPercent(line: string): string {
  return line.replace(/(^|[^\\])%/g, "$1\\%");
}

function mathBlock(lines: string[]): string {
  const safeLines = lines.map(escapeLatexPercent);
  if (safeLines.length === 1) {
    return `\\[${safeLines[0]}\\]`;
  }
  return `\\[\\begin{aligned}${safeLines.join("\\\\")}\\end{aligned}\\]`;
}

function stripMath(text: string): string {
  return text
    .replace(/\\\[[\s\S]*?\\\]/g, " ")
    .replace(/\$[\s\S]*?\$/g, " ");
}

function assertNative(
  text: string,
  language: RealizerLanguage,
): string {
  const normalized =
    language === "pa"
      ? text.normalize("NFC")
      : text;

  if (language === "en") {
    if (GENERIC_EXPLANATION_FILLER_PATTERN.test(normalized)) {
      throw new Error(
        "Percentage English realization used generic filler explanation.",
      );
    }
    return normalized;
  }

  if (GENERIC_LOCALIZATION_PATTERN.test(normalized)) {
    throw new Error(
      `Percentage ${language} realization used generic placeholder text.`,
    );
  }

  const prose = stripMath(normalized);
  if (LEAKAGE_PATTERN.test(prose)) {
    throw new Error(
      `Percentage ${language} realization contains English leakage.`,
    );
  }

  return normalized;
}

function buildContext(
  input: NativeRealizerInput,
): PercentageContext | null {
  const logic = asRecord(input.logic);
  const debug = asRecord(
    input.question.debugMetadata,
  );
  const logicProcedural = asRecord(
    logic.proceduralScenario,
  );
  const debugProcedural = asRecord(
    debug.proceduralScenario,
  );
  const scenario =
    Object.keys(logicProcedural).length > 0
      ? logicProcedural
      : Object.keys(debugProcedural).length > 0
        ? debugProcedural
        : logic;
  const values = {
    ...asRecord(scenario.values),
    ...asRecord(logic.values),
    ...asRecord(logicProcedural.values),
    ...asRecord(debugProcedural.values),
  };
  const motifId = String(
    scenario.motifId ??
      scenario.scenarioType ??
      scenario.scenarioLogicBranch ??
      debug.selectedMotif ??
      "",
  );

  if (!motifId.startsWith("perc_")) {
    return null;
  }

  const options = Array.isArray(
    input.question.options,
  )
    ? input.question.options
        .map(cleanOption)
        .map(mathOption)
    : [];
  const answer = cleanOption(
    options[input.question.correct] ??
      (scenario.correctAnswer as string) ??
      "",
  );

  return {
    motifId,
    values,
    answer,
    options,
    fallbackQuestion:
      input.question.text ?? "",
  };
}

function nativeAmount(value: number | null) {
  return value === null ? "" : `₹${value}`;
}

function nativeEditorialQuestion(
  context: PercentageContext,
  language: RealizerLanguage,
): string | null {
  if (language === "en") {
    return null;
  }

  const values = context.values;
  const motifId = context.motifId;
  const n = (
    keys: string[],
    fallback: number | null = null,
  ) => pickNumber(values, keys) ?? fallback;
  const hi = (text: string) =>
    language === "hi" ? text : null;
  const pa = (text: string) =>
    language === "pa" ? text.normalize("NFC") : null;

  const rate = n([
    "rate",
    "increase",
    "decrease",
    "percent",
    "percentage",
  ]);
  const total = n([
    "total",
    "totalVotes",
    "voters",
    "population",
    "amount",
    "base",
    "y",
  ]);
  const price = n(["price"]);
  const winner = n([
    "winnerPercent",
    "winnerShare",
    "winnerRate",
    "winnerValid",
  ]);
  const gap = n([
    "margin",
    "difference",
    "voteMargin",
    "gap",
  ]);
  const p = (value: number | null) =>
    inlinePercentText(value);

  if (
    motifId === "perc_price_consumption" &&
    rate !== null
  ) {
    return (
      hi(`बाजार के उतार-चढ़ाव के कारण, चीनी की बाजार कीमत में ${p(rate)} की वृद्धि हो जाती है। कुल खर्च को अपरिवर्तित रखने के लिए एक उपभोक्ता को अपनी खपत मात्रा में कितने प्रतिशत की कमी करनी चाहिए?`) ??
      pa(`ਬਾਜ਼ਾਰ ਦੇ ਉਤਾਰ-ਚੜ੍ਹਾਅ ਕਾਰਨ, ਖੰਡ ਦੀ ਬਾਜ਼ਾਰੂ ਕੀਮਤ ਵਿੱਚ ${p(rate)} ਦਾ ਵਾਧਾ ਹੋ ਜਾਂਦਾ ਹੈ। ਕੁੱਲ ਖਰਚੇ ਨੂੰ ਬਿਨਾਂ ਬਦਲਿਆ ਰੱਖਣ ਲਈ ਇੱਕ ਉਪਭੋਗਤਾ ਨੂੰ ਆਪਣੀ ਖਪਤ ਦੀ ਮਾਤਰਾ ਵਿੱਚ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਦੀ ਕਮੀ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ?`)
    );
  }

  if (motifId === "perc_marks_calc") {
    const scored = n(["scored"]);
    if (scored !== null && total !== null) {
      return (
        hi(`एक प्रतियोगी परीक्षा में, एक आकांक्षी ने कुल ${total} अंकों में से ${scored} अंक प्राप्त किए। उम्मीदवार द्वारा प्राप्त कुल संचयी प्रतिशत अंक ज्ञात कीजिए।`) ??
        pa(`ਇੱਕ ਪ੍ਰਤੀਯੋਗੀ ਪ੍ਰੀਖਿਆ ਵਿੱਚ, ਇੱਕ ਉਮੀਦਵਾਰ ਨੇ ਕੁੱਲ ${total} ਅੰਕਾਂ ਵਿੱਚੋਂ ${scored} ਅੰਕ ਪ੍ਰਾਪਤ ਕੀਤੇ। ਉਮੀਦਵਾਰ ਦੁਆਰਾ ਪ੍ਰਾਪਤ ਕੀਤੇ ਕੁੱਲ ਸੰਚਤ ਪ੍ਰਤੀਸ਼ਤ ਅੰਕ ਪਤਾ ਕਰੋ।`)
      );
    }
  }

  if (motifId === "perc_a_more_than_b") {
    const more = n(["more"]);
    if (more !== null) {
      return (
        hi(`यदि इकाई A द्वारा उत्पन्न मासिक राजस्व इकाई B के राजस्व से ${p(more)} अधिक है, तो ज्ञात कीजिए कि इकाई B का राजस्व इकाई A के राजस्व से कितने प्रतिशत कम है।`) ??
        pa(`ਜੇਕਰ ਇਕਾਈ A ਦੁਆਰਾ ਕਮਾਇਆ ਮਾਸਿਕ ਮਾਲੀਆ ਇਕਾਈ B ਦੇ ਮਾਲੀਏ ਨਾਲੋਂ ${p(more)} ਵੱਧ ਹੈ, ਤਾਂ ਪਤਾ ਕਰੋ ਕਿ ਇਕਾਈ B ਦਾ ਮਾਲੀਆ ਇਕਾਈ A ਦੇ ਮਾਲੀਏ ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਘੱਟ ਹੈ।`)
      );
    }
  }

  if (
    context.motifId === "perc_basic_of" &&
    total !== null &&
    rate !== null
  ) {
    return (
      hi(`एक बिलिंग रिपोर्ट में ${total} की राशि दर्ज है। यदि इसका ${rate}% अलग से चिन्हित करना हो, तो कितनी राशि चिन्हित होगी?`) ??
      pa(`ਇੱਕ ਬਿਲਿੰਗ ਰਿਪੋਰਟ ਵਿੱਚ ${total} ਦੀ ਰਕਮ ਦਰਜ ਹੈ। ਜੇ ਇਸ ਦਾ ${rate}% ਵੱਖਰੇ ਤੌਰ 'ਤੇ ਨਿਸ਼ਾਨਬੱਧ ਕਰਨਾ ਹੋਵੇ, ਤਾਂ ਕਿੰਨੀ ਰਕਮ ਨਿਸ਼ਾਨਬੱਧ ਹੋਵੇਗੀ?`)
    );
  }

  if (motifId === "perc_reverse_find") {
    const value = n(["value"]);
    if (value !== null && rate !== null) {
      return (
        hi(`एक बजट समीक्षा में ${value} को पूरी राशि का ${rate}% बताया गया है। पूरी मूल राशि कितनी थी?`) ??
        pa(`ਇੱਕ ਬਜਟ ਸਮੀਖਿਆ ਵਿੱਚ ${value} ਨੂੰ ਪੂਰੀ ਰਕਮ ਦਾ ${rate}% ਦੱਸਿਆ ਗਿਆ ਹੈ। ਪੂਰੀ ਮੁੱਢਲੀ ਰਕਮ ਕਿੰਨੀ ਸੀ?`)
      );
    }
  }

  if (motifId === "perc_basic_sum") {
    const x = n(["x"]);
    const y = n(["y"]);
    const a = n(["a"]);
    const b = n(["b"]) ?? total;
    if (
      x !== null &&
      y !== null &&
      a !== null &&
      b !== null
    ) {
      return (
        hi(`एक खाते में दो अलग प्रविष्टियाँ हैं: ${y} का ${x}% और ${b} का ${a}%। दोनों को मिलाकर कुल राशि कितनी होगी?`) ??
        pa(`ਇੱਕ ਖਾਤੇ ਵਿੱਚ ਦੋ ਵੱਖਰੀਆਂ ਐਂਟਰੀਆਂ ਹਨ: ${y} ਦਾ ${x}% ਅਤੇ ${b} ਦਾ ${a}%। ਦੋਵੇਂ ਜੋੜ ਕੇ ਕੁੱਲ ਰਕਮ ਕਿੰਨੀ ਹੋਵੇਗੀ?`)
      );
    }
  }

  if (motifId === "perc_marks_calc") {
    const scored = n(["scored"]);
    if (scored !== null && total !== null) {
      return (
        hi(`एक परीक्षा रिपोर्ट में उम्मीदवार ने ${total} में से ${scored} अंक प्राप्त किए। परिणाम-पत्र में उसका प्रतिशत कितना दिखेगा?`) ??
        pa(`ਇੱਕ ਪ੍ਰੀਖਿਆ ਰਿਪੋਰਟ ਵਿੱਚ ਉਮੀਦਵਾਰ ਨੇ ${total} ਵਿੱਚੋਂ ${scored} ਅੰਕ ਪ੍ਰਾਪਤ ਕੀਤੇ। ਨਤੀਜਾ-ਪੱਤਰ ਵਿੱਚ ਉਸ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਕਿੰਨਾ ਦਿਖੇਗਾ?`)
      );
    }
  }

  if (
    motifId === "perc_vote_election" &&
    winner !== null &&
    gap !== null
  ) {
    return (
      hi(`एक निर्वाचन क्षेत्र में विजेता उम्मीदवार ने वैध मतों के ${winner}% मत प्राप्त किए। जीत का अंतिम अंतर ${gap} मत था। कुल वैध मत कितने गिने गए?`) ??
      pa(`ਇੱਕ ਚੋਣ ਖੇਤਰ ਵਿੱਚ ਜੇਤੂ ਉਮੀਦਵਾਰ ਨੇ ਵੈਧ ਵੋਟਾਂ ਦਾ ${winner}% ਹਿੱਸਾ ਪ੍ਰਾਪਤ ਕੀਤਾ। ਜਿੱਤ ਦਾ ਅੰਤਿਮ ਫਰਕ ${gap} ਵੋਟਾਂ ਸੀ। ਕੁੱਲ ਵੈਧ ਵੋਟਾਂ ਕਿੰਨੀਆਂ ਗਿਣੀਆਂ ਗਈਆਂ?`)
    );
  }

  if (motifId === "perc_exam_pass_fail") {
    const scoredRate = n(["scoredRate"]);
    const passRate = n(["passRate"]);
    const shortBy = n(["shortBy"]);
    if (
      scoredRate !== null &&
      passRate !== null &&
      shortBy !== null
    ) {
      return (
        hi(`एक भर्ती परीक्षा में उम्मीदवार ने ${scoredRate}% अंक प्राप्त किए, लेकिन उत्तीर्ण अंक से ${shortBy} अंक कम रह गया। यदि उत्तीर्ण प्रतिशत ${passRate}% था, तो अधिकतम अंक कितने थे?`) ??
        pa(`ਇੱਕ ਭਰਤੀ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ਉਮੀਦਵਾਰ ਨੇ ${scoredRate}% ਅੰਕ ਪ੍ਰਾਪਤ ਕੀਤੇ, ਪਰ ਪਾਸ ਅੰਕਾਂ ਤੋਂ ${shortBy} ਅੰਕ ਘੱਟ ਰਹਿ ਗਿਆ। ਜੇ ਪਾਸ ਪ੍ਰਤੀਸ਼ਤ ${passRate}% ਸੀ, ਤਾਂ ਕੁੱਲ ਅੰਕ ਕਿੰਨੇ ਸਨ?`)
      );
    }
  }

  if (
    motifId === "perc_election_invalid" &&
    total !== null
  ) {
    const noVote = n(["noVote"]);
    const invalid = n(["invalid"]);
    const winnerValid = n(["winnerValid"]);
    if (
      noVote !== null &&
      invalid !== null &&
      winnerValid !== null
    ) {
      return (
        hi(`एक निर्वाचन क्षेत्र में ${total} पंजीकृत मतदाता थे। इनमें से ${noVote}% ने मतदान नहीं किया और पड़े हुए मतों में से ${invalid}% अमान्य निकले। विजेता को वैध मतों के ${winnerValid}% मत मिले। विजेता को कितने मत प्राप्त हुए?`) ??
        pa(`ਇੱਕ ਚੋਣ ਖੇਤਰ ਵਿੱਚ ${total} ਰਜਿਸਟਰਡ ਵੋਟਰ ਸਨ। ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ${noVote}% ਨੇ ਵੋਟ ਨਹੀਂ ਪਾਈ ਅਤੇ ਪਈਆਂ ਵੋਟਾਂ ਵਿੱਚੋਂ ${invalid}% ਅਵੈਧ ਨਿਕਲੀਆਂ। ਜੇਤੂ ਨੂੰ ਵੈਧ ਵੋਟਾਂ ਦਾ ${winnerValid}% ਮਿਲਿਆ। ਜੇਤੂ ਨੂੰ ਕਿੰਨੀਆਂ ਵੋਟਾਂ ਮਿਲੀਆਂ?`)
      );
    }
  }

  if (
    (motifId === "perc_price_increase" ||
      motifId === "perc_price_decrease") &&
    price !== null &&
    rate !== null
  ) {
    const isIncrease =
      motifId === "perc_price_increase";
    return isIncrease
      ? (hi(`मूल्य संशोधन के बाद ${nativeAmount(price)} की वस्तु पर ${rate}% वृद्धि लागू की गई। संशोधन के बाद देय राशि कितनी होगी?`) ??
          pa(`ਕੀਮਤ ਸੋਧ ਤੋਂ ਬਾਅਦ ${nativeAmount(price)} ਵਾਲੀ ਵਸਤੂ 'ਤੇ ${rate}% ਵਾਧਾ ਲਾਗੂ ਕੀਤਾ ਗਿਆ। ਸੋਧ ਤੋਂ ਬਾਅਦ ਦੇਣਯੋਗ ਰਕਮ ਕਿੰਨੀ ਹੋਵੇਗੀ?`))
      : (hi(`छूट अवधि में ${nativeAmount(price)} अंकित मूल्य वाली वस्तु पर ${rate}% की छूट दी गई। ग्राहक को कितनी राशि चुकानी होगी?`) ??
          pa(`ਛੂਟ ਮਿਆਦ ਵਿੱਚ ${nativeAmount(price)} ਅੰਕਿਤ ਕੀਮਤ ਵਾਲੀ ਵਸਤੂ 'ਤੇ ${rate}% ਛੂਟ ਦਿੱਤੀ ਗਈ। ਗਾਹਕ ਨੂੰ ਕਿੰਨੀ ਰਕਮ ਦੇਣੀ ਪਵੇਗੀ?`));
  }

  if (motifId === "perc_successive_hike") {
    const value = n(["value"]);
    const r1 = n(["r1", "rate1", "firstRate"]);
    const r2 = n(["r2", "rate2", "secondRate"]);
    if (
      value !== null &&
      r1 !== null &&
      r2 !== null
    ) {
      return (
        hi(`एक सूचकांक की शुरुआती रीडिंग ${value} है। पहले इसमें ${r1}% वृद्धि दर्ज हुई और अगले चरण में संशोधित मान पर ${r2}% और वृद्धि हुई। दोनों चरणों के बाद अंतिम रीडिंग कितनी होगी?`) ??
        pa(`ਇੱਕ ਸੂਚਕ ਦੀ ਸ਼ੁਰੂਆਤੀ ਰੀਡਿੰਗ ${value} ਹੈ। ਪਹਿਲਾਂ ਇਸ ਵਿੱਚ ${r1}% ਵਾਧਾ ਦਰਜ ਹੋਇਆ ਅਤੇ ਅਗਲੇ ਪੜਾਅ ਵਿੱਚ ਸੋਧੇ ਮਾਨ 'ਤੇ ${r2}% ਹੋਰ ਵਾਧਾ ਹੋਇਆ। ਦੋਵੇਂ ਪੜਾਅਾਂ ਤੋਂ ਬਾਅਦ ਅੰਤਿਮ ਰੀਡਿੰਗ ਕਿੰਨੀ ਹੋਵੇਗੀ?`)
      );
    }
  }

  if (
    motifId === "perc_compound_error" &&
    rate !== null
  ) {
    return (
      hi(`एक दर्ज मान पहले ${rate}% बढ़ता है और बाद में बढ़े हुए मान से ही ${rate}% घट जाता है। मूल मान की तुलना में कुल प्रतिशत परिवर्तन कितना होगा?`) ??
      pa(`ਇੱਕ ਦਰਜ ਮਾਨ ਪਹਿਲਾਂ ${rate}% ਵਧਦਾ ਹੈ ਅਤੇ ਬਾਅਦ ਵਿੱਚ ਵਧੇ ਹੋਏ ਮਾਨ ਤੋਂ ਹੀ ${rate}% ਘਟ ਜਾਂਦਾ ਹੈ। ਮੁੱਢਲੇ ਮਾਨ ਨਾਲੋਂ ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ ਕਿੰਨਾ ਹੋਵੇਗਾ?`)
    );
  }

  if (motifId === "perc_restore_value") {
    const cut = n(["cut"]);
    if (cut !== null) {
      return (
        hi(`एक शुल्क में ${cut}% कटौती की गई। बाद में इसी घटे हुए शुल्क को पुराने स्तर पर वापस लाना है। घटे हुए शुल्क पर कितने प्रतिशत की वृद्धि चाहिए?`) ??
        pa(`ਇੱਕ ਫੀਸ ਵਿੱਚ ${cut}% ਕਟੌਤੀ ਕੀਤੀ ਗਈ। ਬਾਅਦ ਵਿੱਚ ਇਸੇ ਘਟੀ ਹੋਈ ਫੀਸ ਨੂੰ ਪੁਰਾਣੇ ਪੱਧਰ 'ਤੇ ਵਾਪਸ ਲਿਆਉਣਾ ਹੈ। ਘਟੀ ਹੋਈ ਫੀਸ 'ਤੇ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧੇ ਦੀ ਲੋੜ ਹੈ?`)
      );
    }
  }

  if (
    motifId === "perc_price_consumption" &&
    rate !== null
  ) {
    return (
      hi(`एक परिवार अपना मासिक चीनी बजट समान रखना चाहता है। चीनी की कीमत ${rate}% बढ़ गई है। बजट न बदलने के लिए खपत में कितने प्रतिशत कमी करनी होगी?`) ??
      pa(`ਇੱਕ ਪਰਿਵਾਰ ਆਪਣਾ ਮਹੀਨਾਵਾਰ ਚੀਨੀ ਬਜਟ ਇਕੋ ਜਿਹਾ ਰੱਖਣਾ ਚਾਹੁੰਦਾ ਹੈ। ਚੀਨੀ ਦੀ ਕੀਮਤ ${rate}% ਵਧ ਗਈ ਹੈ। ਬਜਟ ਨਾ ਬਦਲਣ ਲਈ ਖਪਤ ਵਿੱਚ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਕਮੀ ਕਰਨੀ ਪਵੇਗੀ?`)
    );
  }

  if (
    motifId === "perc_population_growth" &&
    total !== null &&
    rate !== null
  ) {
    return (
      hi(`एक स्थानीय सर्वे में नगर की शुरुआती जनसंख्या ${total} दर्ज की गई। अगले दो वर्षों तक जनसंख्या हर वर्ष ${rate}% बढ़ती है। दूसरे वर्ष के अंत में जनसंख्या कितनी होगी?`) ??
      pa(`ਇੱਕ ਸਥਾਨਕ ਸਰਵੇ ਵਿੱਚ ਸ਼ਹਿਰ ਦੀ ਸ਼ੁਰੂਆਤੀ ਆਬਾਦੀ ${total} ਦਰਜ ਕੀਤੀ ਗਈ। ਅਗਲੇ ਦੋ ਸਾਲਾਂ ਤੱਕ ਆਬਾਦੀ ਹਰ ਸਾਲ ${rate}% ਵਧਦੀ ਹੈ। ਦੂਜੇ ਸਾਲ ਦੇ ਅੰਤ 'ਤੇ ਆਬਾਦੀ ਕਿੰਨੀ ਹੋਵੇਗੀ?`)
    );
  }

  if (
    motifId === "perc_machine_depreciation" &&
    rate !== null
  ) {
    const value = n(["value"]) ?? total;
    if (value !== null) {
      return (
        hi(`कंपनी के परिसंपत्ति रजिस्टर में एक मशीन का मूल्य ${nativeAmount(value)} दर्ज है। हर वर्ष इसका मूल्य ${rate}% घटता है। दो पूरे वर्षों के बाद इसका पुस्तक-मूल्य कितना होगा?`) ??
        pa(`ਕੰਪਨੀ ਦੇ ਸੰਪਤੀ ਰਜਿਸਟਰ ਵਿੱਚ ਇੱਕ ਮਸ਼ੀਨ ਦੀ ਕੀਮਤ ${nativeAmount(value)} ਦਰਜ ਹੈ। ਹਰ ਸਾਲ ਇਸ ਦੀ ਕੀਮਤ ${rate}% ਘਟਦੀ ਹੈ। ਦੋ ਪੂਰੇ ਸਾਲਾਂ ਤੋਂ ਬਾਅਦ ਇਸ ਦੀ ਕਿਤਾਬੀ ਕੀਮਤ ਕਿੰਨੀ ਹੋਵੇਗੀ?`)
      );
    }
  }

  if (motifId === "perc_sequential_spend") {
    const income = n(["income"]);
    const rent = n(["rent"]);
    const food = n(["food"]);
    if (
      income !== null &&
      rent !== null &&
      food !== null
    ) {
      return (
        hi(`मासिक आय ${nativeAmount(income)} है। पहले इसका ${rent}% किराये में जाता है और फिर बची हुई राशि का ${food}% भोजन पर खर्च होता है। अंत में कितनी राशि बचेगी?`) ??
        pa(`ਮਹੀਨਾਵਾਰ ਆਮਦਨ ${nativeAmount(income)} ਹੈ। ਪਹਿਲਾਂ ਇਸ ਦਾ ${rent}% ਕਿਰਾਏ ਵਿੱਚ ਜਾਂਦਾ ਹੈ ਅਤੇ ਫਿਰ ਬਚੀ ਹੋਈ ਰਕਮ ਦਾ ${food}% ਭੋਜਨ 'ਤੇ ਖਰਚ ਹੁੰਦਾ ਹੈ। ਅੰਤ ਵਿੱਚ ਕਿੰਨੀ ਰਕਮ ਬਚੇਗੀ?`)
      );
    }
  }

  if (motifId === "perc_income_savings_expense") {
    const income = n(["income"]);
    const savingsRate = n(["savingsRate"]);
    const incomeIncrease = n([
      "incomeIncrease",
      "increase",
    ]);
    if (
      income !== null &&
      savingsRate !== null &&
      incomeIncrease !== null
    ) {
      return (
        hi(`एक परिवार की मासिक आय ${nativeAmount(income)} है और वह इसका ${savingsRate}% बचाता है। आय ${incomeIncrease}% बढ़ जाती है, लेकिन बचत की राशि पहले जैसी रहती है। खर्च में कितने प्रतिशत वृद्धि होगी?`) ??
        pa(`ਇੱਕ ਪਰਿਵਾਰ ਦੀ ਮਹੀਨਾਵਾਰ ਆਮਦਨ ${nativeAmount(income)} ਹੈ ਅਤੇ ਉਹ ਇਸ ਦਾ ${savingsRate}% ਬਚਾਉਂਦਾ ਹੈ। ਆਮਦਨ ${incomeIncrease}% ਵਧ ਜਾਂਦੀ ਹੈ, ਪਰ ਬਚਤ ਦੀ ਰਕਮ ਪਹਿਲਾਂ ਵਰਗੀ ਰਹਿੰਦੀ ਹੈ। ਖਰਚ ਵਿੱਚ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਹੋਵੇਗਾ?`)
      );
    }
  }

  if (motifId === "perc_weighted_group_change") {
    const groupA = n(["groupA"]);
    const groupB = n(["groupB"]);
    const rateA = n(["rateA"]);
    const rateB = n(["rateB"]);
    if (
      groupA !== null &&
      groupB !== null &&
      rateA !== null &&
      rateB !== null
    ) {
      return (
        hi(`एक अकादमी रिपोर्ट में समूह A में ${groupA} विद्यार्थी हैं और यह ${rateA}% बढ़ता है। समूह B में ${groupB} विद्यार्थी हैं और यह ${rateB}% बढ़ता है। दोनों समूहों को मिलाकर कुल प्रतिशत वृद्धि कितनी होगी?`) ??
        pa(`ਇੱਕ ਅਕੈਡਮੀ ਰਿਪੋਰਟ ਵਿੱਚ ਸਮੂਹ A ਵਿੱਚ ${groupA} ਵਿਦਿਆਰਥੀ ਹਨ ਅਤੇ ਇਹ ${rateA}% ਵਧਦਾ ਹੈ। ਸਮੂਹ B ਵਿੱਚ ${groupB} ਵਿਦਿਆਰਥੀ ਹਨ ਅਤੇ ਇਹ ${rateB}% ਵਧਦਾ ਹੈ। ਦੋਵੇਂ ਸਮੂਹ ਮਿਲਾ ਕੇ ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਕਿੰਨਾ ਹੋਵੇਗਾ?`)
      );
    }
  }

  if (motifId === "perc_mixture_water_add") {
    const mixture = n(["mixture"]);
    const initial = n(["initial"]);
    const target = n(["target"]);
    if (
      mixture !== null &&
      initial !== null &&
      target !== null
    ) {
      return (
        hi(`एक प्रयोगशाला पात्र में ${mixture} लीटर घोल है, जिसमें पानी ${initial}% है। केवल पानी मिलाकर पानी की मात्रा ${target}% करनी है। कितना पानी मिलाना होगा?`) ??
        pa(`ਇੱਕ ਪ੍ਰਯੋਗਸ਼ਾਲਾ ਭਾਂਡੇ ਵਿੱਚ ${mixture} ਲੀਟਰ ਘੋਲ ਹੈ, ਜਿਸ ਵਿੱਚ ਪਾਣੀ ${initial}% ਹੈ। ਸਿਰਫ਼ ਪਾਣੀ ਮਿਲਾ ਕੇ ਪਾਣੀ ਦੀ ਮਾਤਰਾ ${target}% ਕਰਨੀ ਹੈ। ਕਿੰਨਾ ਪਾਣੀ ਮਿਲਾਉਣਾ ਪਵੇਗਾ?`)
      );
    }
  }

  if (motifId === "perc_fruit_dry_weight") {
    const fresh = n(["fresh"]);
    const freshWater = n(["freshWater"]);
    const dryWater = n(["dryWater"]);
    if (
      fresh !== null &&
      freshWater !== null &&
      dryWater !== null
    ) {
      return (
        hi(`एक व्यापारी ${fresh} किलोग्राम ताजा फल सुखाता है। ताजे फल में पानी ${freshWater}% है, जबकि सूखने के बाद पानी ${dryWater}% रह जाता है। सूखे फल का अंतिम वजन कितना होगा?`) ??
        pa(`ਇੱਕ ਵਪਾਰੀ ${fresh} ਕਿਲੋਗ੍ਰਾਮ ਤਾਜ਼ਾ ਫਲ ਸੁਕਾਉਂਦਾ ਹੈ। ਤਾਜ਼ੇ ਫਲ ਵਿੱਚ ਪਾਣੀ ${freshWater}% ਹੈ, ਜਦਕਿ ਸੁੱਕਣ ਤੋਂ ਬਾਅਦ ਪਾਣੀ ${dryWater}% ਰਹਿ ਜਾਂਦਾ ਹੈ। ਸੁੱਕੇ ਫਲ ਦਾ ਅੰਤਿਮ ਵਜ਼ਨ ਕਿੰਨਾ ਹੋਵੇਗਾ?`)
      );
    }
  }

  return null;
}

function chooseEnglishStyle(motifId: string) {
  const styles = [
    "ssc",
    "banking",
    "editorial",
    "coaching",
    "report",
  ];
  let hash = 0;
  for (let i = 0; i < motifId.length; i++) {
    hash += motifId.charCodeAt(i);
  }
  return styles[hash % styles.length];
}

function englishRealize(
  motifId: string,
  parts: {
    opening?: string;
    metric?: string;
    implication?: string;
    ask: string;
  },
): string {
  const style = chooseEnglishStyle(motifId);
  // Simple-mode override: produce short, plain sentences for exam clarity
  const SIMPLE_ENGLISH = true;
  const o = parts.opening ? parts.opening.trim() : "";
  const m = parts.metric ? parts.metric.trim() : "";
  const i = parts.implication ? parts.implication.trim() : "";
  const a = parts.ask.trim();

  const micro = ["however", "then", "following this", "as a result", "therefore"];
  const connector = micro[motifId.length % micro.length];

  if (SIMPLE_ENGLISH) {
    // produce short, clear sentences with plain verbs and minimal connectors
    const sentences: string[] = [];
    if (o) sentences.push(o.replace(/,?\s*$/, "") + ".");
    if (m) sentences.push(m.replace(/,?\s*$/, "") + ".");
    if (i) sentences.push(i.replace(/,?\s*$/, "") + ".");
    sentences.push(a.replace(/\?$/, "?") );
    return sentences.join(" ");
  }

  switch (style) {
    case "ssc":
      // concise, exam-friendly (2 lines)
      return [
        o || `${m}`,
        `${i ? i + " " : ""}${a}`.trim(),
      ]
        .filter(Boolean)
        .join(" ");
    case "banking":
      // contextual (3 lines)
      return [
        o || `In a report, ${m}`,
        i || `Consequently, ${connector} ${a.toLowerCase()}`,
        a,
      ]
        .filter(Boolean)
        .join(" ");
    case "editorial":
      // smooth, modern phrasing
      return [
        o || `${m}`,
        i || `${connector.charAt(0).toUpperCase() + connector.slice(1)}, ${a}`,
      ]
        .filter(Boolean)
        .join(" ");
    case "coaching":
      // natural, slightly guiding
      return [
        o || `${m}`,
        `${i || "Keep this in mind:"} ${a}`,
      ]
        .filter(Boolean)
        .join(" ");
    case "report":
    default:
      // report style (compact & factual)
      return [
        o || `${m}`,
        `${i ? i + " " : ""}${a}`,
      ]
        .filter(Boolean)
        .join(" ");
  }
}

function questionText(
  context: PercentageContext,
  language: RealizerLanguage,
): string {
  const { motifId, values } = context;

  if (
    language === "en" &&
    context.fallbackQuestion.trim()
  ) {
    return context.fallbackQuestion;
  }

  const nativeQuestion =
    nativeEditorialQuestion(context, language);
  if (nativeQuestion) {
    return nativeQuestion;
  }

  const rate = pickNumber(values, [
    "rate",
    "increase",
    "decrease",
    "percent",
    "percentage",
  ]);
  const total = pickNumber(values, [
    "total",
    "totalVotes",
    "voters",
    "population",
    "amount",
    "base",
    "y",
  ]);
  const gap = pickNumber(values, [
    "margin",
    "difference",
    "voteMargin",
    "gap",
  ]);
  const winner = pickNumber(values, [
    "winnerPercent",
    "winnerShare",
    "winnerRate",
    "winnerValid",
  ]);
  const first = pickNumber(values, [
    "first",
    "firstRate",
    "rate1",
    "r1",
    "x",
  ]);
  const second = pickNumber(values, [
    "second",
    "secondRate",
    "rate2",
    "r2",
    "y",
    "a",
  ]);
  const price = pickNumber(values, [
    "price",
  ]);
  const scored = pickNumber(values, [
    "scored",
  ]);
  const noVote = pickNumber(values, [
    "noVote",
  ]);
  const invalid = pickNumber(values, [
    "invalid",
  ]);
  const winnerValid = pickNumber(values, [
    "winnerValid",
  ]);
  const mixture = pickNumber(values, [
    "mixture",
  ]);
  const initial = pickNumber(values, [
    "initial",
  ]);
  const target = pickNumber(values, [
    "target",
  ]);
  const fresh = pickNumber(values, [
    "fresh",
  ]);
  const freshWater = pickNumber(values, [
    "freshWater",
  ]);
  const dryWater = pickNumber(values, [
    "dryWater",
  ]);
  const income = pickNumber(values, [
    "income",
  ]);
  const savingsRate = pickNumber(values, [
    "savingsRate",
  ]);
  const incomeIncrease = pickNumber(values, [
    "incomeIncrease",
    "increase",
  ]);
  const groupA = pickNumber(values, [
    "groupA",
  ]);
  const groupB = pickNumber(values, [
    "groupB",
  ]);
  const rateA = pickNumber(values, [
    "rateA",
  ]);
  const rateB = pickNumber(values, [
    "rateB",
  ]);

  if (motifId === "perc_price_consumption" && rate !== null) {
    if (language === "hi") {
      return `चीनी की कीमत ${rate}% बढ़ जाती है। मासिक बजट समान रखने के लिए खपत कितने प्रतिशत घटानी होगी?`;
    }
    if (language === "pa") {
      return `ਚੀਨੀ ਦੀ ਕੀਮਤ ${rate}% ਵੱਧ ਜਾਂਦੀ ਹੈ। ਮਹੀਨਾਵਾਰ ਬਜਟ ਇੱਕੋ ਜਿਹਾ ਰੱਖਣ ਲਈ ਖਪਤ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਘਟਾਉਣੀ ਪਵੇਗੀ?`;
    }
    return englishRealize(motifId, {
      opening: "During a household budget review,",
      metric: `the price of sugar increased by ${rate}%`,
      implication: "To keep the monthly spending unchanged, consumption must be reduced accordingly.",
      ask: "By what percent should consumption be reduced?",
    });
  }

  if (motifId === "perc_vote_election") {
    const winnerText =
      winner ?? rate ?? 60;
    const gapText = gap ?? 2400;
    if (language === "hi") {
      return `दो उम्मीदवारों के चुनाव में विजेता को वैध मतों के ${winnerText}% मत मिले और वह ${gapText} मतों से जीता। कुल वैध मत ज्ञात कीजिए।`;
    }
    if (language === "pa") {
      return `ਦੋ ਉਮੀਦਵਾਰਾਂ ਦੇ ਚੋਣ ਵਿੱਚ ਜੇਤੂ ਨੂੰ ਵੈਧ ਵੋਟਾਂ ਦੇ ${winnerText}% ਵੋਟ ਮਿਲੇ ਅਤੇ ਉਹ ${gapText} ਵੋਟਾਂ ਨਾਲ ਜਿੱਤਿਆ। ਕੁੱਲ ਵੈਧ ਵੋਟਾਂ ਪਤਾ ਕਰੋ।`;
    }
    return englishRealize(motifId, {
      opening: "In a constituency election,",
      metric: `the winning candidate secured ${winnerText}% of the valid votes`,
      implication: `The final margin of victory was ${gapText} votes.`,
      ask: "Find the total number of valid votes.",
    });
  }

  if (
    motifId === "perc_successive_hike" &&
    first !== null &&
    second !== null
  ) {
    if (language === "hi") {
      return `किसी राशि में पहले ${first}% और फिर ${second}% की वृद्धि होती है। कुल प्रतिशत वृद्धि ज्ञात कीजिए।`;
    }
    if (language === "pa") {
      return `ਕਿਸੇ ਰਕਮ ਵਿੱਚ ਪਹਿਲਾਂ ${first}% ਅਤੇ ਫਿਰ ${second}% ਦਾ ਵਾਧਾ ਹੁੰਦਾ ਹੈ। ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਪਤਾ ਕਰੋ।`;
    }
    return englishRealize(motifId, {
      opening: "For a measured quantity,",
      metric: `it first increases by ${first}% and then by ${second}%`,
      implication: "Each step compounds on the previous one.",
      ask: "Find the overall percentage increase.",
    });
  }

  if (
    motifId === "perc_basic_of" &&
    total !== null &&
    rate !== null
  ) {
    if (language === "hi") {
      return `${total} का ${rate}% कितना होगा?`;
    }
    if (language === "pa") {
      return `${total} ਦਾ ${rate}% ਕਿੰਨਾ ਹੋਵੇਗਾ?`;
    }
    return englishRealize(motifId, {
      opening: "In a billing entry,",
      metric: `the amount recorded is ${total}`,
      implication: `If ${rate}% of this amount is required separately, compute that share.`,
      ask: `What is ${rate}% of ${total}?`,
    });
  }

  if (
    motifId === "perc_basic_sum"
  ) {
    const x = pickNumber(values, ["x"]);
    const y = pickNumber(values, ["y"]);
    const a = pickNumber(values, ["a"]);
    const b = pickNumber(values, ["b"]) ?? total;
    if (
      x === null ||
      y === null ||
      a === null ||
      b === null
    ) {
      return context.fallbackQuestion;
    }
    if (language === "hi") {
      return `${y} का ${x}% और ${b} का ${a}% जोड़कर मान ज्ञात कीजिए।`;
    }
    if (language === "pa") {
      return `${y} ਦਾ ${x}% ਅਤੇ ${b} ਦਾ ${a}% ਜੋੜ ਕੇ ਮਾਨ ਪਤਾ ਕਰੋ।`;
    }
    return englishRealize(motifId, {
      opening: "In an account summary,",
      metric: `${x}% of ${y} and ${a}% of ${b} are listed as two separate entries`,
      implication: "Compute each part and combine them.",
      ask: `Find ${x}% of ${y} plus ${a}% of ${b}.`,
    });
  }

  if (
    motifId === "perc_marks_calc" &&
    scored !== null &&
    total !== null
  ) {
    if (language === "hi") {
      return `एक विद्यार्थी ने ${total} में से ${scored} अंक प्राप्त किए। प्रतिशत ज्ञात कीजिए।`;
    }
    if (language === "pa") {
      return `ਇੱਕ ਵਿਦਿਆਰਥੀ ਨੇ ${total} ਵਿੱਚੋਂ ${scored} ਅੰਕ ਪ੍ਰਾਪਤ ਕੀਤੇ। ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।`;
    }
    return englishRealize(motifId, {
      opening: "In an examination report,",
      metric: `a student scored ${scored} out of ${total}`,
      implication: "Express the result as a percentage of the maximum marks.",
      ask: "Find the percentage.",
    });
  }

  if (
    (motifId === "perc_price_increase" ||
      motifId === "perc_price_decrease") &&
    price !== null &&
    rate !== null
  ) {
    const isIncrease =
      motifId === "perc_price_increase";
    if (language === "hi") {
      return `किसी वस्तु की कीमत ${price} है। इसमें ${rate}% ${isIncrease ? "वृद्धि" : "कमी"} होती है। नई कीमत ज्ञात कीजिए।`;
    }
    if (language === "pa") {
      return `ਕਿਸੇ ਵਸਤੂ ਦੀ ਕੀਮਤ ${price} ਹੈ। ਇਸ ਵਿੱਚ ${rate}% ${isIncrease ? "ਵਾਧਾ" : "ਕਮੀ"} ਹੁੰਦੀ ਹੈ। ਨਵੀਂ ਕੀਮਤ ਪਤਾ ਕਰੋ।`;
    }
    return englishRealize(motifId, {
      opening: isIncrease ? "After a price revision," : "During a discount period,",
      metric: `an item priced at ${price} is ${isIncrease ? "increased" : "reduced"} by ${rate}%`,
      implication: "Compute the adjusted amount based on the revised price.",
      ask: "What is the new price?",
    });
  }

  if (
    motifId === "perc_population_growth" &&
    total !== null &&
    rate !== null
  ) {
    if (language === "hi") {
      return `${total} की जनसंख्या ${rate}% वार्षिक दर से 2 वर्ष तक बढ़ती है। अंतिम जनसंख्या ज्ञात कीजिए।`;
    }
    if (language === "pa") {
      return `${total} ਦੀ ਆਬਾਦੀ ${rate}% ਸਾਲਾਨਾ ਦਰ ਨਾਲ 2 ਸਾਲ ਤੱਕ ਵਧਦੀ ਹੈ। ਅੰਤਿਮ ਆਬਾਦੀ ਪਤਾ ਕਰੋ।`;
    }
    return englishRealize(motifId, {
      opening: "According to a local survey,",
      metric: `the town's population is ${total} and grows at ${rate}% per year`,
      implication: "Growth is compounded annually for two years.",
      ask: "Find the population at the end of the second year.",
    });
  }

  if (
    motifId === "perc_machine_depreciation" &&
    rate !== null
  ) {
    const value =
      pickNumber(values, ["value"]) ?? total;
    if (value !== null) {
      if (language === "hi") {
        return `${value} मूल्य की मशीन हर वर्ष ${rate}% घटती है। 2 वर्ष बाद उसका मूल्य ज्ञात कीजिए।`;
      }
      if (language === "pa") {
        return `${value} ਮੁੱਲ ਦੀ ਮਸ਼ੀਨ ਹਰ ਸਾਲ ${rate}% ਘਟਦੀ ਹੈ। 2 ਸਾਲ ਬਾਅਦ ਇਸ ਦਾ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;
      }
      return englishRealize(motifId, {
        opening: "From the asset register,",
        metric: `a machine valued at ${value} depreciates by ${rate}% each year`,
        implication: "Depreciation is applied on the reduced book value each year.",
        ask: "Find its book value after two years.",
      });
    }
  }

  if (
    motifId === "perc_election_invalid" &&
    total !== null &&
    noVote !== null &&
    invalid !== null &&
    winnerValid !== null
  ) {
    if (language === "hi") {
      return `${total} मतदाताओं में से ${noVote}% ने मतदान नहीं किया और पड़े हुए मतों में से ${invalid}% अमान्य निकले। विजेता को वैध मतों के ${winnerValid}% मत मिले। विजेता के मत ज्ञात कीजिए।`;
    }
    if (language === "pa") {
      return `${total} ਵੋਟਰਾਂ ਵਿੱਚੋਂ ${noVote}% ਨੇ ਵੋਟ ਨਹੀਂ ਪਾਈ ਅਤੇ ਪਈਆਂ ਵੋਟਾਂ ਵਿੱਚੋਂ ${invalid}% ਅਵੈਧ ਨਿਕਲੀਆਂ। ਜੇਤੂ ਨੂੰ ਵੈਧ ਵੋਟਾਂ ਦੇ ${winnerValid}% ਵੋਟ ਮਿਲੇ। ਜੇਤੂ ਦੇ ਵੋਟ ਪਤਾ ਕਰੋ।`;
    }
    return englishRealize(motifId, {
      opening: "In a constituency record,",
      metric: `${total} registered voters include ${noVote}% who did not vote and ${invalid}% invalid among cast votes`,
      implication: `After excluding these, the winner received ${winnerValid}% of the valid votes.`,
      ask: "Find the number of votes the winner received.",
    });
  }

  if (
    motifId === "perc_mixture_water_add" &&
    mixture !== null &&
    initial !== null &&
    target !== null
  ) {
    if (language === "hi") {
      return `${mixture} लीटर मिश्रण में ${initial}% पानी है। पानी की मात्रा ${target}% करने के लिए कितना पानी मिलाना होगा?`;
    }
    if (language === "pa") {
      return `${mixture} ਲੀਟਰ ਮਿਸ਼ਰਣ ਵਿੱਚ ${initial}% ਪਾਣੀ ਹੈ। ਪਾਣੀ ਦੀ ਮਾਤਰਾ ${target}% ਕਰਨ ਲਈ ਕਿੰਨਾ ਪਾਣੀ ਮਿਲਾਉਣਾ ਪਵੇਗਾ?`;
    }
    return englishRealize(motifId, {
      opening: "In a laboratory setup,",
      metric: `${mixture} L of solution contains ${initial}% water`,
      implication: `Only water is to be added to raise the water content to ${target}%.`,
      ask: "How much water must be added?",
    });
  }

  if (
    motifId === "perc_fruit_dry_weight" &&
    fresh !== null &&
    freshWater !== null &&
    dryWater !== null
  ) {
    if (language === "hi") {
      return `${fresh} किग्रा ताजे फल में ${freshWater}% पानी है। सूखे फल में ${dryWater}% पानी रहता है। सूखे फल का वजन ज्ञात कीजिए।`;
    }
    if (language === "pa") {
      return `${fresh} ਕਿਲੋਗ੍ਰਾਮ ਤਾਜ਼ੇ ਫਲ ਵਿੱਚ ${freshWater}% ਪਾਣੀ ਹੈ। ਸੁੱਕੇ ਫਲ ਵਿੱਚ ${dryWater}% ਪਾਣੀ ਰਹਿੰਦਾ ਹੈ। ਸੁੱਕੇ ਫਲ ਦਾ ਵਜ਼ਨ ਪਤਾ ਕਰੋ।`;
    }
    return englishRealize(motifId, {
      opening: "A trader dries freshly harvested fruit,",
      metric: `the fresh fruit weighs ${fresh} kg with ${freshWater}% water`,
      implication: `After drying, the water reduces to ${dryWater}% and the solid matter remains unchanged.`,
      ask: "Find the final dry weight.",
    });
  }

  if (
    motifId === "perc_income_savings_expense" &&
    income !== null &&
    savingsRate !== null &&
    incomeIncrease !== null
  ) {
    if (language === "hi") {
      return `एक व्यक्ति की आय ${income} है। वह इसका ${savingsRate}% बचाता है। यदि आय ${incomeIncrease}% बढ़े लेकिन बचत समान रहे, तो खर्च में कितने प्रतिशत वृद्धि होगी?`;
    }
    if (language === "pa") {
      return `ਇੱਕ ਵਿਅਕਤੀ ਦੀ ਆਮਦਨ ${income} ਹੈ। ਉਹ ਇਸ ਦਾ ${savingsRate}% ਬਚਾਉਂਦਾ ਹੈ। ਜੇ ਆਮਦਨ ${incomeIncrease}% ਵਧੇ ਪਰ ਬਚਤ ਉਹੀ ਰਹੇ, ਤਾਂ ਖਰਚ ਵਿੱਚ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਹੋਵੇਗਾ?`;
    }
    return englishRealize(motifId, {
      opening: "In a household report,",
      metric: `monthly income is ${income} and savings are ${savingsRate}% of it`,
      implication: `If income rises by ${incomeIncrease}% while the absolute saved amount stays unchanged, expenditure must adjust.`,
      ask: "Find the percentage increase in expenditure.",
    });
  }

  if (
    motifId === "perc_weighted_group_change" &&
    groupA !== null &&
    groupB !== null &&
    rateA !== null &&
    rateB !== null
  ) {
    if (language === "hi") {
      return `एक कोचिंग केंद्र में समूह A के ${groupA} विद्यार्थी ${rateA}% बढ़ते हैं और समूह B के ${groupB} विद्यार्थी ${rateB}% बढ़ते हैं। कुल विद्यार्थियों में प्रतिशत वृद्धि ज्ञात कीजिए।`;
    }
    if (language === "pa") {
      return `ਇੱਕ ਕੋਚਿੰਗ ਕੇਂਦਰ ਵਿੱਚ ਸਮੂਹ A ਦੇ ${groupA} ਵਿਦਿਆਰਥੀ ${rateA}% ਵਧਦੇ ਹਨ ਅਤੇ ਸਮੂਹ B ਦੇ ${groupB} ਵਿਦਿਆਰਥੀ ${rateB}% ਵਧਦੇ ਹਨ। ਕੁੱਲ ਵਿਦਿਆਰਥੀਆਂ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਪਤਾ ਕਰੋ।`;
    }
    return englishRealize(motifId, {
      opening: "In an academy report,",
      metric: `${groupA} students in group A grow by ${rateA}% and ${groupB} in group B grow by ${rateB}%`,
      implication: "Compute the weighted effect on total enrollment.",
      ask: "Find the overall percentage increase in the total number of students.",
    });
  }

  const value = pickNumber(values, ["value"]);
  const base = pickNumber(values, ["base"]);
  const a = pickNumber(values, ["a"]);
  const b = pickNumber(values, ["b"]);
  const decimal = pickNumber(values, ["decimal"]);
  const oldSalary = pickNumber(values, ["oldSalary"]);
  const newSalary = pickNumber(values, ["newSalary"]);
  const rent = pickNumber(values, ["rent"]);
  const food = pickNumber(values, ["food"]);
  const cut = pickNumber(values, ["cut"]);
  const salary = pickNumber(values, ["salary"]);
  const threshold = pickNumber(values, ["threshold"]);
  const sales = pickNumber(values, ["sales"]);
  const high = pickNumber(values, ["high"]);
  const low = pickNumber(values, ["low"]);
  const maleRate = pickNumber(values, ["maleRate"]);
  const femaleRate = pickNumber(values, ["femaleRate"]);
  const newTotal = pickNumber(values, ["newTotal"]);
  const scoredRate = pickNumber(values, ["scoredRate"]);
  const passRate = pickNumber(values, ["passRate"]);
  const shortBy = pickNumber(values, ["shortBy"]);
  const cheaperThanB = pickNumber(values, ["cheaperThanB"]);
  const dearerThanC = pickNumber(values, ["dearerThanC"]);
  const quantityIncrease = pickNumber(values, ["quantityIncrease"]);
  const collectionDecrease = pickNumber(values, ["collectionDecrease"]);
  const numeratorIncrease = pickNumber(values, ["numeratorIncrease"]);
  const denominatorDecrease = pickNumber(values, ["denominatorDecrease"]);
  const oldRate = pickNumber(values, ["oldRate"]);
  const newRate = pickNumber(values, ["newRate"]);
  const replaced = pickNumber(values, ["replaced"]);
  const r1 = pickNumber(values, ["r1"]);
  const r2 = pickNumber(values, ["r2"]);
  const r3 = pickNumber(values, ["r3"]);
  const r4 = pickNumber(values, ["r4"]);
  const lengthChange = pickNumber(values, ["lengthChange"]);
  const breadthChange = pickNumber(values, ["breadthChange"]);

  if (motifId === "perc_reverse_find" && value !== null && rate !== null) {
    if (language === "hi") {
      return `${value}, किस संख्या का ${rate}% है?`;
    }
    if (language === "pa") {
      return `${value}, ਕਿਹੜੀ ਸੰਖਿਆ ਦਾ ${rate}% ਹੈ?`;
    }
    return englishRealize(motifId, {
      opening: "During a budget review,",
      metric: `${value} represents ${rate}% of a total`,
      implication: "Scale this partial value back to 100% to find the original total.",
      ask: `What is the full number?`,
    });
  }

  if (motifId === "perc_fraction_to_perc" && a !== null && b !== null) {
    if (language === "hi") {
      return `भिन्न ${a}/${b} को प्रतिशत में बदलिए।`;
    }
    if (language === "pa") {
      return `ਭਿੰਨ ${a}/${b} ਨੂੰ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਬਦਲੋ।`;
    }
    return englishRealize(motifId, {
      opening: "Given a fractional value,",
      metric: `the fraction is ${a}/${b}`,
      implication: "Convert it into an equivalent percentage by scaling to 100.",
      ask: `Express ${a}/${b} as a percent.`,
    });
  }

  if (motifId === "perc_decimal_to_perc" && decimal !== null) {
    if (language === "hi") {
      return `${decimal} को प्रतिशत में बदलिए।`;
    }
    if (language === "pa") {
      return `${decimal} ਨੂੰ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਬਦਲੋ।`;
    }
    return englishRealize(motifId, {
      opening: "Given a decimal value,",
      metric: `the number is ${decimal}`,
      implication: "Multiply by 100 to change the scale to percent.",
      ask: `Convert ${decimal} into a percentage.`,
    });
  }

  if (
    motifId === "perc_salary_hike" &&
    oldSalary !== null &&
    newSalary !== null
  ) {
    if (language === "hi") {
      return `एक कर्मचारी का वेतन ${oldSalary} से ${newSalary} हो गया। वेतन में प्रतिशत वृद्धि ज्ञात कीजिए।`;
    }
    if (language === "pa") {
      return `ਇੱਕ ਕਰਮਚਾਰੀ ਦੀ ਤਨਖਾਹ ${oldSalary} ਤੋਂ ${newSalary} ਹੋ ਗਈ। ਤਨਖਾਹ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਪਤਾ ਕਰੋ।`;
    }
    return englishRealize(motifId, {
      opening: "In a payroll summary,",
      metric: `an employee's pay rises from ${oldSalary} to ${newSalary}`,
      implication: "Express the change as a percentage of the original salary.",
      ask: "Find the percentage increase in salary.",
    });
  }

  if (
    motifId === "perc_sequential_spend" &&
    income !== null &&
    rent !== null &&
    food !== null
  ) {
    if (language === "hi") {
      return `कुल आय ${income} है। पहले ${rent}% किराये पर खर्च होता है, फिर बचे हुए धन का ${food}% भोजन पर खर्च होता है। शेष राशि ज्ञात कीजिए।`;
    }
    if (language === "pa") {
      return `ਕੁੱਲ ਆਮਦਨ ${income} ਹੈ। ਪਹਿਲਾਂ ${rent}% ਕਿਰਾਏ 'ਤੇ ਖਰਚ ਹੁੰਦਾ ਹੈ, ਫਿਰ ਬਚੀ ਰਕਮ ਦਾ ${food}% ਭੋਜਨ 'ਤੇ ਖਰਚ ਹੁੰਦਾ ਹੈ। ਬਚੀ ਰਕਮ ਪਤਾ ਕਰੋ।`;
    }
    return englishRealize(motifId, {
      opening: "From a monthly income statement,",
      metric: `income is ${income}; ${rent}% goes to rent, then ${food}% of the remainder to food`,
      implication: "Work sequentially: remove rent first, then compute food from the remainder.",
      ask: "Find the final amount left.",
    });
  }

  if (motifId === "perc_restore_value" && cut !== null) {
    if (language === "hi") {
      return `किसी राशि में ${cut}% की कटौती हुई। पुराना मान वापस पाने के लिए घटे हुए मान में कितने प्रतिशत वृद्धि चाहिए?`;
    }
    if (language === "pa") {
      return `ਕਿਸੇ ਰਕਮ ਵਿੱਚ ${cut}% ਦੀ ਕਟੌਤੀ ਹੋਈ। ਪੁਰਾਣਾ ਮਾਨ ਵਾਪਸ ਲਿਆਉਣ ਲਈ ਘਟੇ ਹੋਏ ਮਾਨ ਵਿੱਚ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧੇ ਦੀ ਲੋੜ ਹੈ?`;
    }
    return englishRealize(motifId, {
      opening: "After a reduction in price,",
      metric: `the amount is cut by ${cut}%`,
      implication: "Any recovery percent applies to the reduced amount, not the original.",
      ask: "What percent increase returns the amount to its original value?",
    });
  }

  if (motifId === "perc_compound_error" && rate !== null) {
    if (language === "hi") {
      return `किसी मान में पहले ${rate}% वृद्धि और फिर उतने ही ${rate}% की कमी होती है। कुल प्रतिशत परिवर्तन ज्ञात कीजिए।`;
    }
    if (language === "pa") {
      return `ਕਿਸੇ ਮਾਨ ਵਿੱਚ ਪਹਿਲਾਂ ${rate}% ਵਾਧਾ ਅਤੇ ਫਿਰ ਉਹੀ ${rate}% ਕਮੀ ਹੁੰਦੀ ਹੈ। ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ ਪਤਾ ਕਰੋ।`;
    }
    return englishRealize(motifId, {
      opening: "For a measured quantity,",
      metric: `it increases by ${rate}% and later decreases by the same ${rate}%`,
      implication: "Since bases differ, the net change is not zero.",
      ask: "Find the overall percentage change.",
    });
  }

  if (
    motifId === "perc_exam_pass_fail" &&
    scoredRate !== null &&
    passRate !== null &&
    shortBy !== null
  ) {
    if (language === "hi") {
      return `एक उम्मीदवार ने ${scoredRate}% अंक प्राप्त किए और ${shortBy} अंकों से असफल रहा। यदि उत्तीर्ण प्रतिशत ${passRate}% है, तो अधिकतम अंक ज्ञात कीजिए।`;
    }
    if (language === "pa") {
      return `ਇੱਕ ਉਮੀਦਵਾਰ ਨੇ ${scoredRate}% ਅੰਕ ਪ੍ਰਾਪਤ ਕੀਤੇ ਅਤੇ ${shortBy} ਅੰਕਾਂ ਨਾਲ ਫੇਲ੍ਹ ਹੋ ਗਿਆ। ਜੇ ਪਾਸ ਪ੍ਰਤੀਸ਼ਤ ${passRate}% ਹੈ, ਤਾਂ ਕੁੱਲ ਅੰਕ ਪਤਾ ਕਰੋ।`;
    }
    return englishRealize(motifId, {
      opening: "In a recruitment exam report,",
      metric: `a candidate scored ${scoredRate}% but fell short by ${shortBy} marks`,
      implication: `The pass cut-off was ${passRate}%. Use the gap to recover the maximum marks.`,
      ask: "Find the total marks of the exam.",
    });
  }

  if (
    motifId === "perc_sales_commission" &&
    salary !== null &&
    threshold !== null &&
    sales !== null &&
    rate !== null
  ) {
    if (language === "hi") {
      return `एक विक्रेता को ${salary} निश्चित वेतन और ${threshold} से ऊपर की बिक्री पर ${rate}% कमीशन मिलता है। यदि बिक्री ${sales} है, तो कुल आय ज्ञात कीजिए।`;
    }
    if (language === "pa") {
      return `ਇੱਕ ਵਿਕਰੇਤਾ ਨੂੰ ${salary} ਨਿਸ਼ਚਿਤ ਤਨਖਾਹ ਅਤੇ ${threshold} ਤੋਂ ਵੱਧ ਵਿਕਰੀ 'ਤੇ ${rate}% ਕਮਿਸ਼ਨ ਮਿਲਦਾ ਹੈ। ਜੇ ਵਿਕਰੀ ${sales} ਹੈ, ਤਾਂ ਕੁੱਲ ਆਮਦਨ ਪਤਾ ਕਰੋ।`;
    }
    return englishRealize(motifId, {
      opening: "In a compensation statement,",
      metric: `fixed salary ${salary} plus ${rate}% commission on sales above ${threshold}`,
      implication: `Compute commission only on the excess over ${threshold} and add it to base salary.`,
      ask: "Find the salesperson's total income.",
    });
  }

  if (
    motifId === "perc_population_gender" &&
    total !== null &&
    maleRate !== null &&
    femaleRate !== null &&
    newTotal !== null
  ) {
    if (language === "hi") {
      return `किसी नगर की कुल जनसंख्या ${total} है। पुरुष ${maleRate}% और महिलाएँ ${femaleRate}% बढ़ती हैं, जिससे नई जनसंख्या ${newTotal} हो जाती है। मूल पुरुष जनसंख्या ज्ञात कीजिए।`;
    }
    if (language === "pa") {
      return `ਕਿਸੇ ਸ਼ਹਿਰ ਦੀ ਕੁੱਲ ਆਬਾਦੀ ${total} ਹੈ। ਪੁਰਸ਼ ${maleRate}% ਅਤੇ ਔਰਤਾਂ ${femaleRate}% ਵਧਦੀਆਂ ਹਨ, ਜਿਸ ਨਾਲ ਨਵੀਂ ਆਬਾਦੀ ${newTotal} ਹੋ ਜਾਂਦੀ ਹੈ। ਮੁੱਢਲੀ ਪੁਰਸ਼ ਆਬਾਦੀ ਪਤਾ ਕਰੋ।`;
    }
    return englishRealize(motifId, {
      opening: "According to municipal data,",
      metric: `the town's population was ${total}; males grew by ${maleRate}% and females by ${femaleRate}%`,
      implication: `After these changes the total becomes ${newTotal}; isolate the original male count.`,
      ask: "Find the original male population.",
    });
  }

  if (
    motifId === "perc_alloy_composition" &&
    high !== null &&
    low !== null &&
    target !== null
  ) {
    if (language === "hi") {
      return `मिश्रधातु A में ${high}% तांबा और मिश्रधातु B में ${low}% तांबा है। ${target}% तांबा पाने के लिए दोनों को किस अनुपात में मिलाना चाहिए?`;
    }
    if (language === "pa") {
      return `ਮਿਸ਼ਰ ਧਾਤ A ਵਿੱਚ ${high}% ਤਾਂਬਾ ਅਤੇ ਮਿਸ਼ਰ ਧਾਤ B ਵਿੱਚ ${low}% ਤਾਂਬਾ ਹੈ। ${target}% ਤਾਂਬਾ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਦੋਵਾਂ ਨੂੰ ਕਿਸ ਅਨੁਪਾਤ ਵਿੱਚ ਮਿਲਾਉਣਾ ਚਾਹੀਦਾ ਹੈ?`;
    }
    return englishRealize(motifId, {
      opening: "In an alloy mixing problem,",
      metric: `Alloy A contains ${high}% copper and Alloy B contains ${low}% copper`,
      implication: `Find the proportion of A and B that yields ${target}% copper in the blend.`,
      ask: `In what ratio should they be mixed?`,
    });
  }

  if (
    motifId === "perc_tax_income" &&
    incomeIncrease !== null &&
    oldRate !== null &&
    newRate !== null
  ) {
    if (language === "hi") {
      return `आय ${incomeIncrease} बढ़ती है और कर दर ${oldRate}% से घटकर ${newRate}% हो जाती है। यदि कुल कर समान रहता है, तो मूल आय ज्ञात कीजिए।`;
    }
    if (language === "pa") {
      return `ਆਮਦਨ ${incomeIncrease} ਵਧਦੀ ਹੈ ਅਤੇ ਟੈਕਸ ਦਰ ${oldRate}% ਤੋਂ ਘਟ ਕੇ ${newRate}% ਹੋ ਜਾਂਦੀ ਹੈ। ਜੇ ਕੁੱਲ ਟੈਕਸ ਇੱਕੋ ਰਹਿੰਦਾ ਹੈ, ਤਾਂ ਮੂਲ ਆਮਦਨ ਪਤਾ ਕਰੋ।`;
    }
    return englishRealize(motifId, {
      opening: "In a fiscal report,",
      metric: `income rises by ${incomeIncrease} while tax rate falls from ${oldRate}% to ${newRate}%`,
      implication: `If total tax collected stays unchanged, adjust for the rate change to recover the original income.`,
      ask: "Find the original income amount.",
    });
  }

  if (
    motifId === "perc_mixture_replacement" &&
    r1 !== null &&
    r2 !== null &&
    replaced !== null &&
    r3 !== null &&
    r4 !== null
  ) {
    if (language === "hi") {
      return `एक बर्तन में दूध और पानी का अनुपात ${r1}:${r2} है। मिश्रण के ${replaced} लीटर निकालकर उतना ही पानी मिला दिया जाता है। नया अनुपात ${r3}:${r4} हो जाता है। मूल मिश्रण की मात्रा ज्ञात कीजिए।`;
    }
    if (language === "pa") {
      return `ਇੱਕ ਭਾਂਡੇ ਵਿੱਚ ਦੁੱਧ ਅਤੇ ਪਾਣੀ ਦਾ ਅਨੁਪਾਤ ${r1}:${r2} ਹੈ। ਮਿਸ਼ਰਣ ਦੇ ${replaced} ਲੀਟਰ ਕੱਢ ਕੇ ਉੱਨਾ ਹੀ ਪਾਣੀ ਮਿਲਾਇਆ ਜਾਂਦਾ ਹੈ। ਨਵਾਂ ਅਨੁਪਾਤ ${r3}:${r4} ਹੋ ਜਾਂਦਾ ਹੈ। ਮੂਲ ਮਿਸ਼ਰਣ ਦੀ ਮਾਤਰਾ ਪਤਾ ਕਰੋ।`;
    }
    return englishRealize(motifId, {
      opening: "In a container experiment,",
      metric: `milk and water are in ratio ${r1}:${r2} and ${replaced} L of mixture is replaced by water`,
      implication: `The replacement changes the ratio to ${r3}:${r4}; use this to find the original volume.`,
      ask: "Find the original quantity of the mixture.",
    });
  }

  if (
    motifId === "perc_cheaper_dearer_chain" &&
    cheaperThanB !== null &&
    dearerThanC !== null
  ) {
    if (language === "hi") {
      return `दुकान A किसी वस्तु को दुकान B से ${cheaperThanB}% सस्ता और दुकान C से ${dearerThanC}% महंगा बेचती है। दुकान C, दुकान B से कितने प्रतिशत सस्ती है?`;
    }
    if (language === "pa") {
      return `ਦੁਕਾਨ A ਕੋਈ ਵਸਤੂ ਦੁਕਾਨ B ਨਾਲੋਂ ${cheaperThanB}% ਸਸਤੀ ਅਤੇ ਦੁਕਾਨ C ਨਾਲੋਂ ${dearerThanC}% ਮਹਿੰਗੀ ਵੇਚਦੀ ਹੈ। ਦੁਕਾਨ C, ਦੁਕਾਨ B ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਸਸਤੀ ਹੈ?`;
    }
    return englishRealize(motifId, {
      opening: "Comparing retail prices,",
      metric: `shop A is ${cheaperThanB}% cheaper than B and ${dearerThanC}% costlier than C`,
      implication: `Translate both comparisons to a common reference to compare B and C directly.`,
      ask: "By what percent is shop C cheaper than shop B?",
    });
  }

  if (
    motifId === "perc_collection_ticket_change" &&
    quantityIncrease !== null &&
    collectionDecrease !== null
  ) {
    if (language === "hi") {
      return `टिकट का मूल्य घटने के बाद टिकट बिक्री ${quantityIncrease}% बढ़ी, लेकिन कुल संग्रह ${collectionDecrease}% घट गया। टिकट मूल्य में प्रतिशत कमी ज्ञात कीजिए।`;
    }
    if (language === "pa") {
      return `ਟਿਕਟ ਦੀ ਕੀਮਤ ਘਟਣ ਤੋਂ ਬਾਅਦ ਟਿਕਟਾਂ ਦੀ ਵਿਕਰੀ ${quantityIncrease}% ਵਧੀ, ਪਰ ਕੁੱਲ ਇਕੱਠ ${collectionDecrease}% ਘਟ ਗਿਆ। ਟਿਕਟ ਕੀਮਤ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਕਮੀ ਪਤਾ ਕਰੋ।`;
    }
    return englishRealize(motifId, {
      opening: "After a pricing change for event tickets,",
      metric: `sales rose by ${quantityIncrease}% while total collection fell by ${collectionDecrease}%`,
      implication: `The change in collection reflects both quantity and price effects.`,
      ask: "Find the percent reduction in ticket price.",
    });
  }

  if (
    motifId === "perc_fraction_value_change" &&
    numeratorIncrease !== null &&
    denominatorDecrease !== null
  ) {
    if (language === "hi") {
      return `किसी भिन्न के अंश में ${numeratorIncrease}% वृद्धि और हर में ${denominatorDecrease}% कमी होती है। भिन्न के मान में प्रतिशत परिवर्तन ज्ञात कीजिए।`;
    }
    if (language === "pa") {
      return `ਕਿਸੇ ਭਿੰਨ ਦੇ ਅੰਸ਼ ਵਿੱਚ ${numeratorIncrease}% ਵਾਧਾ ਅਤੇ ਹਰ ਵਿੱਚ ${denominatorDecrease}% ਕਮੀ ਹੁੰਦੀ ਹੈ। ਭਿੰਨ ਦੇ ਮਾਨ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ ਪਤਾ ਕਰੋ।`;
    }
    return englishRealize(motifId, {
      opening: "For a fractional quantity,",
      metric: `the numerator increases by ${numeratorIncrease}% while the denominator decreases by ${denominatorDecrease}%`,
      implication: `Combine the two effects to compute the net percent change in the fraction's value.`,
      ask: "Find the percentage change in the fraction's value.",
    });
  }

  if (
    motifId === "perc_rect_length_increase" &&
    lengthChange !== null &&
    breadthChange !== null
  ) {
    const breadthText = Math.abs(breadthChange);
    if (language === "hi") {
      return `एक आयत की लंबाई ${lengthChange}% बढ़ाई जाती है और चौड़ाई ${breadthText}% घटाई जाती है। क्षेत्रफल में प्रतिशत परिवर्तन ज्ञात कीजिए।`;
    }
    if (language === "pa") {
      return `ਇੱਕ ਆਇਤ ਦੀ ਲੰਬਾਈ ${lengthChange}% ਵਧਾਈ ਜਾਂਦੀ ਹੈ ਅਤੇ ਚੌੜਾਈ ${breadthText}% ਘਟਾਈ ਜਾਂਦੀ ਹੈ। ਖੇਤਰਫਲ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ ਪਤਾ ਕਰੋ।`;
    }
    return englishRealize(motifId, {
      opening: "In a geometry exercise,",
      metric: `length increases by ${lengthChange}% while breadth decreases by ${breadthText}%`,
      implication: `Area depends on both dimensions; combine effects multiplicatively.`,
      ask: "Find the percent change in area.",
    });
  }

  if (motifId === "perc_circle_radius_change" && rate !== null) {
    if (language === "hi") {
      return `किसी वृत्त की त्रिज्या ${rate}% बढ़ाई जाती है। क्षेत्रफल में प्रतिशत परिवर्तन ज्ञात कीजिए।`;
    }
    if (language === "pa") {
      return `ਕਿਸੇ ਵਰਤੁਲ ਦੀ ਤ੍ਰਿਜਿਆ ${rate}% ਵਧਾਈ ਜਾਂਦੀ ਹੈ। ਖੇਤਰਫਲ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ ਪਤਾ ਕਰੋ।`;
    }
    return englishRealize(motifId, {
      opening: "For a circle,",
      metric: `the radius is increased by ${rate}%`,
      implication: "Area scales with the square of the radius.",
      ask: "Find the percentage change in area.",
    });
  }

  if (motifId === "perc_cube_volume_change" && rate !== null) {
    if (language === "hi") {
      return `किसी घन की भुजा ${rate}% बढ़ाई जाती है। आयतन में प्रतिशत परिवर्तन ज्ञात कीजिए।`;
    }
    if (language === "pa") {
      return `ਕਿਸੇ ਘਣ ਦੀ ਭੁਜਾ ${rate}% ਵਧਾਈ ਜਾਂਦੀ ਹੈ। ਆਇਤਨ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ ਪਤਾ ਕਰੋ।`;
    }
    return englishRealize(motifId, {
      opening: "In a solids question,",
      metric: `the cube's side is increased by ${rate}%`,
      implication: "Volume scales with the cube of the side length.",
      ask: "Find the percent change in volume.",
    });
  }

  if (motifId === "perc_square_perimeter" && rate !== null) {
    if (language === "hi") {
      return `किसी वर्ग का परिमाप ${rate}% बढ़ता है। भुजा में प्रतिशत वृद्धि ज्ञात कीजिए।`;
    }
    if (language === "pa") {
      return `ਕਿਸੇ ਵਰਗ ਦਾ ਪਰਿਮਾਪ ${rate}% ਵਧਦਾ ਹੈ। ਭੁਜਾ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਪਤਾ ਕਰੋ।`;
    }
    return englishRealize(motifId, {
      opening: "Given a square's perimeter change,",
      metric: `the perimeter increases by ${rate}%`,
      implication: "Side length changes proportionally to the perimeter change.",
      ask: "Find the percent increase in the side length.",
    });
  }

  if (language === "hi") {
    throw new Error(
      `Missing Hindi question realization for ${motifId}.`,
    );
  }
  if (language === "pa") {
    throw new Error(
      `Missing Punjabi question realization for ${motifId}.`,
    );
  }
  return context.fallbackQuestion;
}

function productConstancyChain(
  context: PercentageContext,
  language: RealizerLanguage,
): string[] {
  const rate =
    pickNumber(context.values, [
      "rate",
      "increase",
      "percent",
    ]) ?? 25;
  const shifted = 100 + rate;
  const newIndex =
    (100 * 100) / shifted;
  const reduction = 100 - newIndex;
  const answer =
    context.answer || `${normalizeNumericText(reduction)}%`;

  if (language === "hi") {
    return [
      `खर्च को स्थिर रखना है, इसलिए कीमत और खपत एक-दूसरे को संतुलित करेंगे। पुराने बजट को 100 मानना सबसे आसान रहेगा।`,
      `1) पुराना बजट 100 माना। कीमत ${rate}% बढ़ी, इसलिए नई कीमत का सूचकांक ${shifted} हो गया।\n${mathBlock([`100 \\rightarrow ${shifted}`])}`,
      `2) बजट 100 ही रखना है, इसलिए नई खपत इतनी होगी कि गुणनफल फिर 100 बने।\n${mathBlock([`\\frac{100\\times100}{${shifted}}=${normalizeNumericText(newIndex)}`])}`,
      `3) खपत में कमी पुराने 100 से नापी जाएगी।\n${mathBlock([`100-${normalizeNumericText(newIndex)}=${normalizeNumericText(reduction)}\\%`])}`,
      `अक्सर गलती नई कीमत ${shifted} को आधार बनाकर होती है। यहाँ कमी खपत में है, इसलिए तुलना पुराने खपत सूचकांक 100 से करनी है।`,
      `अतः आवश्यक कमी ${answer} है।`,
    ];
  }

  if (language === "pa") {
    return [
      `ਖਰਚ ਇੱਕੋ ਜਿਹਾ ਰੱਖਣਾ ਹੈ, ਇਸ ਲਈ ਕੀਮਤ ਅਤੇ ਖਪਤ ਇਕ-ਦੂਜੇ ਨੂੰ ਸੰਤੁਲਿਤ ਕਰਨਗੇ। ਪੁਰਾਣੇ ਬਜਟ ਨੂੰ 100 ਮੰਨਣਾ ਸਭ ਤੋਂ ਆਸਾਨ ਹੈ।`,
      `1) ਪੁਰਾਣਾ ਬਜਟ 100 ਮੰਨਿਆ। ਕੀਮਤ ${rate}% ਵਧੀ, ਇਸ ਲਈ ਨਵੀਂ ਕੀਮਤ ਦਾ ਸੂਚਕ ${shifted} ਹੋ ਗਿਆ।\n${mathBlock([`100 \\rightarrow ${shifted}`])}`,
      `2) ਬਜਟ 100 ਹੀ ਰੱਖਣਾ ਹੈ, ਇਸ ਲਈ ਨਵੀਂ ਖਪਤ ਇੰਨੀ ਹੋਵੇਗੀ ਕਿ ਗੁਣਨਫਲ ਮੁੜ 100 ਬਣੇ।\n${mathBlock([`\\frac{100\\times100}{${shifted}}=${normalizeNumericText(newIndex)}`])}`,
      `3) ਖਪਤ ਵਿੱਚ ਘਟਾਅ ਪੁਰਾਣੇ 100 ਤੋਂ ਮਾਪੀ ਜਾਵੇਗੀ।\n${mathBlock([`100-${normalizeNumericText(newIndex)}=${normalizeNumericText(reduction)}\\%`])}`,
      `ਅਕਸਰ ਗਲਤੀ ਨਵੀਂ ਕੀਮਤ ${shifted} ਨੂੰ ਅਧਾਰ ਬਣਾ ਕੇ ਹੁੰਦੀ ਹੈ। ਇੱਥੇ ਘਟਾਅ ਖਪਤ ਵਿੱਚ ਹੈ, ਇਸ ਲਈ ਤੁਲਨਾ ਪੁਰਾਣੇ ਖਪਤ ਸੂਚਕ 100 ਨਾਲ ਕਰਨੀ ਹੈ।`,
      `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਘਟਾਅ ${answer} ਹੈ।`,
    ];
  }

  return [
    `Keep the monthly spend fixed and treat the old budget as 100. Price and consumption must balance each other.`,
    `1) Old budget index is 100. After a ${rate}% rise, the price index becomes ${shifted}.\n${mathBlock([`100 \\rightarrow ${shifted}`])}`,
    `2) The budget must still remain 100, so the new consumption index is:\n${mathBlock([`\\frac{100\\times100}{${shifted}}=${normalizeNumericText(newIndex)}`])}`,
    `3) Reduction is measured from the old consumption index 100.\n${mathBlock([`100-${normalizeNumericText(newIndex)}=${normalizeNumericText(reduction)}\\%`])}`,
    `Most students use the old base for the price rise but forget that the reduction is on the shifted consumption index. Keep the budget constant throughout.`,
    `Therefore, the required reduction is ${answer}.`,
  ];
}

function restoreValueChain(
  context: PercentageContext,
  language: RealizerLanguage,
): string[] {
  const cut =
    pickNumber(context.values, ["cut", "rate"]) ?? 20;
  const reduced = 100 - cut;
  const required = (cut * 100) / reduced;
  assertExpectedAnswer(
    context,
    required,
    "reverse-recovery",
  );
  const answer =
    context.answer || `${normalizeNumericText(required)}%`;

  if (language === "hi") {
    return [
      `कटौती के बाद नई राशि छोटी हो जाती है। पुरानी राशि वापस पाने के लिए बढ़ोतरी इसी छोटी राशि पर निकलेगी।`,
      `1) पुरानी राशि 100 मानते हैं। ${cut}% कटौती के बाद नई राशि:\n${mathBlock([`100-${cut}=${reduced}`])}`,
      `2) वापस 100 तक जाने के लिए बढ़ोतरी ${cut} की चाहिए।`,
      `3) यह बढ़ोतरी ${reduced} पर मापी जाएगी:\n${mathBlock([`\\frac{${cut}}{${reduced}}\\times100=${normalizeNumericText(required)}\\%`])}`,
      `यहाँ गलती तब होती है जब ${cut}% को ही वापसी की बढ़ोतरी मान लिया जाता है। वापसी का प्रतिशत घटे हुए मान पर निकलेगा।`,
      `इसलिए आवश्यक बढ़ोतरी ${answer} है।`,
    ];
  }

  if (language === "pa") {
    return [
      `ਕਟੌਤੀ ਤੋਂ ਬਾਅਦ ਨਵੀਂ ਰਕਮ ਛੋਟੀ ਹੋ ਜਾਂਦੀ ਹੈ। ਪੁਰਾਣੀ ਰਕਮ ਵਾਪਸ ਲਿਆਉਣ ਲਈ ਵਾਧਾ ਇਸੇ ਘਟੀ ਹੋਈ ਰਕਮ ਉੱਤੇ ਕੱਢਿਆ ਜਾਵੇਗਾ।`,
      `1) ਪੁਰਾਣੀ ਰਕਮ 100 ਮੰਨਦੇ ਹਾਂ। ${cut}% ਕਟੌਤੀ ਤੋਂ ਬਾਅਦ ਨਵੀਂ ਰਕਮ:\n${mathBlock([`100-${cut}=${reduced}`])}`,
      `2) ਮੁੜ 100 ਤੱਕ ਪਹੁੰਚਣ ਲਈ ${cut} ਦਾ ਵਾਧਾ ਚਾਹੀਦਾ ਹੈ।`,
      `3) ਇਹ ਵਾਧਾ ${reduced} ਉੱਤੇ ਮਾਪਿਆ ਜਾਵੇਗਾ:\n${mathBlock([`\\frac{${cut}}{${reduced}}\\times100=${normalizeNumericText(required)}\\%`])}`,
      `ਇੱਥੇ ਆਮ ਗਲਤੀ ${cut}% ਨੂੰ ਹੀ ਵਾਪਸੀ ਵਾਲਾ ਵਾਧਾ ਮੰਨਣ ਦੀ ਹੁੰਦੀ ਹੈ। ਵਾਪਸੀ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਘਟੀ ਹੋਈ ਰਕਮ ਉੱਤੇ ਨਿਕਲੇਗਾ।`,
      `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਵਾਧਾ ${answer} ਹੈ।`,
    ];
  }

  return [
    `After the cut, the reduced amount becomes the working value. The recovery percentage must be measured on this smaller amount.`,
    `1) Take the original amount as 100. After a ${cut}% cut:\n${mathBlock([`100-${cut}=${reduced}`])}`,
    `2) To return from ${reduced} to 100, the increase needed is ${cut}.`,
    `3) Recovery percent:\n${mathBlock([`\\frac{${cut}}{${reduced}}\\times100=${normalizeNumericText(required)}\\%`])}`,
    `The usual mistake is calling the answer ${cut}%. The increase is not on the old 100; it is on the reduced value ${reduced}.`,
    `Therefore, the required increase is ${answer}.`,
  ];
}

function cheaperDearerChain(
  context: PercentageContext,
  language: RealizerLanguage,
): string[] {
  const cheaper =
    pickNumber(context.values, ["cheaperThanB"]) ?? 20;
  const dearer =
    pickNumber(context.values, ["dearerThanC"]) ?? 25;
  const bPrice = 100;
  const aPrice = bPrice - cheaper;
  const cPrice = (aPrice * 100) / (100 + dearer);
  const cheaperPercent = bPrice - cPrice;
  assertExpectedAnswer(
    context,
    cheaperPercent,
    "comparative-price-chain",
  );
  const answer =
    context.answer ||
    `${normalizeNumericText(cheaperPercent)}%`;

  if (language === "hi") {
    return [
      `तुलना आसान रखने के लिए दुकान B की कीमत 100 मानते हैं। अब A और C दोनों को इसी संदर्भ से जोड़ेंगे।`,
      `1) A, B से ${cheaper}% सस्ती है, इसलिए A की कीमत:\n${mathBlock([`100-${cheaper}=${normalizeNumericText(aPrice)}`])}`,
      `2) A, C से ${dearer}% महंगी है। इसलिए C की कीमत:\n${mathBlock([`\\frac{${normalizeNumericText(aPrice)}\\times100}{${100 + dearer}}=${normalizeNumericText(cPrice)}`])}`,
      `3) अब B और C की सीधी तुलना:\n${mathBlock([`100-${normalizeNumericText(cPrice)}=${normalizeNumericText(cheaperPercent)}\\%`])}`,
      `सस्ती और महंगी वाली तुलना में आधार बदलता है। इसलिए सीधे ${cheaper}% और ${dearer}% को जोड़ना या घटाना सही नहीं होगा।`,
      `इसलिए दुकान C, दुकान B से ${answer} सस्ती है।`,
    ];
  }

  if (language === "pa") {
    return [
      `ਤੁਲਨਾ ਸੌਖੀ ਰੱਖਣ ਲਈ ਦੁਕਾਨ B ਦੀ ਕੀਮਤ 100 ਮੰਨਦੇ ਹਾਂ। ਹੁਣ A ਅਤੇ C ਦੋਵਾਂ ਨੂੰ ਇਸੇ ਹਵਾਲੇ ਨਾਲ ਜੋੜਾਂਗੇ।`,
      `1) A, B ਨਾਲੋਂ ${cheaper}% ਸਸਤੀ ਹੈ, ਇਸ ਲਈ A ਦੀ ਕੀਮਤ:\n${mathBlock([`100-${cheaper}=${normalizeNumericText(aPrice)}`])}`,
      `2) A, C ਨਾਲੋਂ ${dearer}% ਮਹਿੰਗੀ ਹੈ। ਇਸ ਲਈ C ਦੀ ਕੀਮਤ:\n${mathBlock([`\\frac{${normalizeNumericText(aPrice)}\\times100}{${100 + dearer}}=${normalizeNumericText(cPrice)}`])}`,
      `3) ਹੁਣ B ਅਤੇ C ਦੀ ਸਿੱਧੀ ਤੁਲਨਾ:\n${mathBlock([`100-${normalizeNumericText(cPrice)}=${normalizeNumericText(cheaperPercent)}\\%`])}`,
      `ਸਸਤੀ ਅਤੇ ਮਹਿੰਗੀ ਵਾਲੀ ਤੁਲਨਾ ਵਿੱਚ ਅਧਾਰ ਬਦਲ ਜਾਂਦਾ ਹੈ। ਇਸ ਲਈ ${cheaper}% ਅਤੇ ${dearer}% ਨੂੰ ਸਿੱਧਾ ਜੋੜਣਾ ਜਾਂ ਘਟਾਉਣਾ ਠੀਕ ਨਹੀਂ।`,
      `ਇਸ ਲਈ ਦੁਕਾਨ C, ਦੁਕਾਨ B ਨਾਲੋਂ ${answer} ਸਸਤੀ ਹੈ।`,
    ];
  }

  return [
    `Use shop B as the reference price. This keeps both comparisons connected to one clean number.`,
    `1) Take shop B's price as 100. Since A is ${cheaper}% cheaper than B:\n${mathBlock([`100-${cheaper}=${normalizeNumericText(aPrice)}`])}`,
    `2) A is ${dearer}% costlier than C, so C's price is:\n${mathBlock([`\\frac{${normalizeNumericText(aPrice)}\\times100}{${100 + dearer}}=${normalizeNumericText(cPrice)}`])}`,
    `3) Compare C directly with B:\n${mathBlock([`100-${normalizeNumericText(cPrice)}=${normalizeNumericText(cheaperPercent)}\\%`])}`,
    `The trap is treating the two percentages as if they use the same reference. Cheaper than B and costlier than C do not share the same reference price.`,
    `Therefore, shop C is ${answer} cheaper than shop B.`,
  ];
}

function directPercentageChain(
  context: PercentageContext,
  language: RealizerLanguage,
): string[] | null {
  const rate =
    pickNumber(context.values, [
      "rate",
      "percent",
      "percentage",
    ]) ?? null;
  const base =
    pickNumber(context.values, [
      "base",
      "amount",
      "total",
      "value",
    ]) ?? null;
  const value = pickNumber(context.values, ["value"]);
  const scored = pickNumber(context.values, ["scored"]);
  const total = pickNumber(context.values, ["total"]);
  const a = pickNumber(context.values, ["a", "x"]);
  const b = pickNumber(context.values, ["b", "y"]);
  const x = pickNumber(context.values, ["x"]);
  const y = pickNumber(context.values, ["y"]);
  const decimal = pickNumber(context.values, ["decimal"]);
  const answer = context.answer;

  if (
    context.motifId === "perc_basic_of" &&
    rate !== null &&
    base !== null
  ) {
    const result = (rate * base) / 100;
    assertExpectedAnswer(context, result, "direct-percent-of");
    if (language === "hi") {
      return [
        `यह सीधा प्रतिशत वाला प्रश्न है। दी गई राशि पर ही प्रतिशत लगाना है।`,
        `1) राशि ${base} है और उसका ${rate}% चाहिए।`,
        `2) गणना:\n${mathBlock([`\\frac{${rate}}{100}\\times${base}=${normalizeNumericText(result)}`])}`,
        `3) यही आवश्यक राशि है।`,
        `ध्यान रखें, प्रतिशत हमेशा उसी राशि पर लगाया जाएगा जो प्रश्न में दी गई है।`,
        `इसलिए उत्तर ${answer} है।`,
      ];
    }
    if (language === "pa") {
      return [
        `ਇਹ ਸਿੱਧਾ ਪ੍ਰਤੀਸ਼ਤ ਵਾਲਾ ਪ੍ਰਸ਼ਨ ਹੈ। ਦਿੱਤੀ ਰਕਮ ਉੱਤੇ ਹੀ ਪ੍ਰਤੀਸ਼ਤ ਲਗਾਉਣਾ ਹੈ।`,
        `1) ਰਕਮ ${base} ਹੈ ਅਤੇ ਇਸ ਦਾ ${rate}% ਚਾਹੀਦਾ ਹੈ।`,
        `2) ਗਿਣਤੀ:\n${mathBlock([`\\frac{${rate}}{100}\\times${base}=${normalizeNumericText(result)}`])}`,
        `3) ਇਹੀ ਲੋੜੀਂਦੀ ਰਕਮ ਹੈ।`,
        `ਧਿਆਨ ਰੱਖੋ, ਪ੍ਰਤੀਸ਼ਤ ਹਮੇਸ਼ਾ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੀ ਰਕਮ ਉੱਤੇ ਹੀ ਲਗੇਗਾ।`,
        `ਇਸ ਲਈ ਉੱਤਰ ${answer} ਹੈ।`,
      ];
    }
    return [
      `This is a direct percent-of question. Apply the percent to the amount named in the question.`,
      `1) Required amount is ${rate}% of ${base}.`,
      `2) Calculate it directly:\n${mathBlock([`\\frac{${rate}}{100}\\times${base}=${normalizeNumericText(result)}`])}`,
      `3) This gives the required value.`,
      `Do not shift the percent to any other amount; it belongs to ${base}.`,
      `Therefore, the answer is ${answer}.`,
    ];
  }

  if (
    context.motifId === "perc_reverse_find" &&
    value !== null &&
    rate !== null
  ) {
    const result = (value * 100) / rate;
    assertExpectedAnswer(context, result, "reverse-percent-find");
    if (language === "hi") {
      return [
        `${value}, पूरी संख्या का ${rate}% है। पूरी संख्या निकालने के लिए ${rate}% से 100% तक लौटते हैं।`,
        `1) ${rate}% = ${value}`,
        `2) इसलिए 100%:\n${mathBlock([`\\frac{${value}\\times100}{${rate}}=${normalizeNumericText(result)}`])}`,
        `3) यही मूल संख्या है।`,
        `यहाँ ${value} को पूरी संख्या मानने की गलती नहीं करनी है।`,
        `इसलिए उत्तर ${answer} है।`,
      ];
    }
    if (language === "pa") {
      return [
        `${value}, ਪੂਰੀ ਸੰਖਿਆ ਦਾ ${rate}% ਹੈ। ਪੂਰੀ ਸੰਖਿਆ ਲਈ ${rate}% ਤੋਂ 100% ਤੱਕ ਵਾਪਸ ਜਾਂਦੇ ਹਾਂ।`,
        `1) ${rate}% = ${value}`,
        `2) ਇਸ ਲਈ 100%:\n${mathBlock([`\\frac{${value}\\times100}{${rate}}=${normalizeNumericText(result)}`])}`,
        `3) ਇਹੀ ਅਸਲ ਸੰਖਿਆ ਹੈ।`,
        `ਇੱਥੇ ${value} ਨੂੰ ਪੂਰੀ ਸੰਖਿਆ ਮੰਨਣ ਦੀ ਗਲਤੀ ਨਹੀਂ ਕਰਨੀ।`,
        `ਇਸ ਲਈ ਉੱਤਰ ${answer} ਹੈ।`,
      ];
    }
    return [
      `${value} represents ${rate}% of the number. Scale it back to 100%.`,
      `1) ${rate}% = ${value}`,
      `2) So 100% is:\n${mathBlock([`\\frac{${value}\\times100}{${rate}}=${normalizeNumericText(result)}`])}`,
      `3) This is the original number.`,
      `The mistake is treating ${value} as the full number. It is only the ${rate}% part.`,
      `Therefore, the answer is ${answer}.`,
    ];
  }

  if (
    context.motifId === "perc_marks_calc" &&
    scored !== null &&
    total !== null
  ) {
    const result = (scored * 100) / total;
    assertExpectedAnswer(context, result, "marks-percent");
    if (language === "hi") {
      return [
        `अंक प्रतिशत में बदलने के लिए प्राप्त अंक को कुल अंकों से तुलना करते हैं।`,
        `1) प्राप्त अंक = ${scored}, कुल अंक = ${total}`,
        `2) प्रतिशत:\n${mathBlock([`\\frac{${scored}}{${total}}\\times100=${normalizeNumericText(result)}\\%`])}`,
        `3) यही स्कोर प्रतिशत है।`,
        `कुल अंकों को हर में रखना जरूरी है।`,
        `इसलिए उत्तर ${answer} है।`,
      ];
    }
    if (language === "pa") {
      return [
        `ਅੰਕਾਂ ਨੂੰ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਬਦਲਣ ਲਈ ਪ੍ਰਾਪਤ ਅੰਕਾਂ ਦੀ ਕੁੱਲ ਅੰਕਾਂ ਨਾਲ ਤੁਲਨਾ ਕਰਦੇ ਹਾਂ।`,
        `1) ਪ੍ਰਾਪਤ ਅੰਕ = ${scored}, ਕੁੱਲ ਅੰਕ = ${total}`,
        `2) ਪ੍ਰਤੀਸ਼ਤ:\n${mathBlock([`\\frac{${scored}}{${total}}\\times100=${normalizeNumericText(result)}\\%`])}`,
        `3) ਇਹੀ ਸਕੋਰ ਪ੍ਰਤੀਸ਼ਤ ਹੈ।`,
        `ਕੁੱਲ ਅੰਕਾਂ ਨੂੰ ਹਰ ਵਿੱਚ ਰੱਖਣਾ ਜ਼ਰੂਰੀ ਹੈ।`,
        `ਇਸ ਲਈ ਉੱਤਰ ${answer} ਹੈ।`,
      ];
    }
    return [
      `A score percent compares marks obtained with the maximum marks.`,
      `1) Marks obtained = ${scored}, maximum marks = ${total}.`,
      `2) Percentage score:\n${mathBlock([`\\frac{${scored}}{${total}}\\times100=${normalizeNumericText(result)}\\%`])}`,
      `3) This is the score shown on the result card.`,
      `Keep the maximum marks in the denominator.`,
      `Therefore, the answer is ${answer}.`,
    ];
  }

  if (
    context.motifId === "perc_fraction_to_perc" &&
    a !== null &&
    b !== null
  ) {
    const result = (a * 100) / b;
    assertExpectedAnswer(context, result, "fraction-to-percent");
    return [
      language === "hi"
        ? `भिन्न को प्रतिशत में बदलने के लिए उसे 100 से गुणा करते हैं।`
        : language === "pa"
          ? `ਭਿੰਨ ਨੂੰ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਬਦਲਣ ਲਈ ਇਸ ਨੂੰ 100 ਨਾਲ ਗੁਣਾ ਕਰਦੇ ਹਾਂ।`
          : `To convert a fraction into a percent, multiply it by 100.`,
      `1) ${a}/${b}`,
      `2) ${mathBlock([`\\frac{${a}}{${b}}\\times100=${normalizeNumericText(result)}\\%`])}`,
      language === "hi"
        ? `3) यही प्रतिशत रूप है।`
        : language === "pa"
          ? `3) ਇਹੀ ਪ੍ਰਤੀਸ਼ਤ ਰੂਪ ਹੈ।`
          : `3) This is the percentage form.`,
      language === "hi"
        ? `भिन्न का हर पूरी मात्रा दिखाता है, इसलिए 100 से गुणा करना पर्याप्त है।`
        : language === "pa"
          ? `ਭਿੰਨ ਦਾ ਹਰ ਪੂਰੀ ਮਾਤਰਾ ਦਿਖਾਉਂਦਾ ਹੈ, ਇਸ ਲਈ 100 ਨਾਲ ਗੁਣਾ ਕਰਨਾ ਕਾਫ਼ੀ ਹੈ।`
          : `The denominator already represents the whole, so multiplying by 100 is enough.`,
      language === "hi"
        ? `इसलिए उत्तर ${answer} है।`
        : language === "pa"
          ? `ਇਸ ਲਈ ਉੱਤਰ ${answer} ਹੈ।`
          : `Therefore, the answer is ${answer}.`,
    ];
  }

  if (
    context.motifId === "perc_decimal_to_perc" &&
    decimal !== null
  ) {
    const result = decimal * 100;
    assertExpectedAnswer(context, result, "decimal-to-percent");
    return [
      language === "hi"
        ? `दशमलव को प्रतिशत में बदलने के लिए 100 से गुणा करते हैं।`
        : language === "pa"
          ? `ਦਸ਼ਮਲਵ ਨੂੰ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਬਦਲਣ ਲਈ 100 ਨਾਲ ਗੁਣਾ ਕਰਦੇ ਹਾਂ।`
          : `To convert a decimal into a percent, multiply it by 100.`,
      `1) ${decimal}`,
      `2) ${mathBlock([`${decimal}\\times100=${normalizeNumericText(result)}\\%`])}`,
      language === "hi"
        ? `3) यही प्रतिशत रूप है।`
        : language === "pa"
          ? `3) ਇਹੀ ਪ੍ਰਤੀਸ਼ਤ ਰੂਪ ਹੈ।`
          : `3) This is the percentage form.`,
      language === "hi"
        ? `दशमलव में छिपा हुआ 100 का आधार प्रतिशत में खुल जाता है।`
        : language === "pa"
          ? `ਦਸ਼ਮਲਵ ਵਿੱਚ 100 ਵਾਲਾ ਅਧਾਰ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਸਾਫ਼ ਹੋ ਜਾਂਦਾ ਹੈ।`
          : `The decimal becomes a percent after shifting to a scale of 100.`,
      language === "hi"
        ? `इसलिए उत्तर ${answer} है।`
        : language === "pa"
          ? `ਇਸ ਲਈ ਉੱਤਰ ${answer} ਹੈ।`
          : `Therefore, the answer is ${answer}.`,
    ];
  }

  if (
    context.motifId === "perc_basic_sum" &&
    x !== null &&
    y !== null &&
    a !== null &&
    b !== null
  ) {
    const first = (x * y) / 100;
    const second = (a * b) / 100;
    const result = first + second;
    assertExpectedAnswer(context, result, "sum-of-percents");
    return [
      language === "hi"
        ? `दोनों प्रतिशत अलग-अलग राशियों पर लगेंगे, फिर दोनों मान जोड़ेंगे।`
        : language === "pa"
          ? `ਦੋਵੇਂ ਪ੍ਰਤੀਸ਼ਤ ਵੱਖ-ਵੱਖ ਰਕਮਾਂ ਉੱਤੇ ਲੱਗਣਗੇ, ਫਿਰ ਦੋਵੇਂ ਮੁੱਲ ਜੋੜਾਂਗੇ।`
          : `Calculate both percentage parts separately, then add them.`,
      `1) ${mathBlock([`\\frac{${x}}{100}\\times${y}=${normalizeNumericText(first)}`])}`,
      `2) ${mathBlock([`\\frac{${a}}{100}\\times${b}=${normalizeNumericText(second)}`])}`,
      `3) ${mathBlock([`${normalizeNumericText(first)}+${normalizeNumericText(second)}=${normalizeNumericText(result)}`])}`,
      language === "hi"
        ? `प्रतिशत अलग-अलग राशियों पर हैं, इसलिए पहले अलग गणना जरूरी है।`
        : language === "pa"
          ? `ਪ੍ਰਤੀਸ਼ਤ ਵੱਖ-ਵੱਖ ਰਕਮਾਂ ਉੱਤੇ ਹਨ, ਇਸ ਲਈ ਪਹਿਲਾਂ ਵੱਖਰੀ ਗਿਣਤੀ ਜ਼ਰੂਰੀ ਹੈ।`
          : `Because the two percentages belong to different amounts, calculate them separately first.`,
      language === "hi"
        ? `इसलिए उत्तर ${answer} है।`
        : language === "pa"
          ? `ਇਸ ਲਈ ਉੱਤਰ ${answer} ਹੈ।`
          : `Therefore, the answer is ${answer}.`,
    ];
  }

  return null;
}

function differentialBalanceChain(
  context: PercentageContext,
  language: RealizerLanguage,
): string[] {
  const winner =
    pickNumber(context.values, [
      "winnerPercent",
      "winnerShare",
      "rate",
    ]) ?? 60;
  const loser = 100 - winner;
  const gapPercent = Math.abs(winner - loser);
  const gap =
    pickNumber(context.values, [
      "margin",
      "difference",
      "voteMargin",
      "gap",
    ]) ?? 2400;
  const total = (gap * 100) / gapPercent;
  const answer =
    context.answer || normalizeNumericText(total);

  if (language === "hi") {
    return [
      `चुनाव में सीधे कुल मत नहीं निकालते। पहले विजेता और हारने वाले के बीच का प्रतिशत अंतर पकड़ते हैं। यही अंतर वास्तविक मतों से जुड़ता है।`,
      `1) विजेता को ${winner}% मत मिले, इसलिए दूसरे उम्मीदवार को ${loser}% मत मिले।`,
      `2) दोनों के बीच अंतर:\n${mathBlock([`${winner}-${loser}=${gapPercent}\\%`])}`,
      `3) यही ${gapPercent}% अंतर ${gap} मतों के बराबर है। अब पूरा आधार निकलेगा।\n${mathBlock([`\\frac{${gap}\\times100}{${gapPercent}}=${normalizeNumericText(total)}`])}`,
      `मुख्य गलती यह है कि ${winner}% को ही जीत का अंतर मान लिया जाता है। जीत का अंतर हमेशा विजेता और दूसरे उम्मीदवार के मतों का फर्क होता है।`,
      `अतः कुल वैध मत ${answer} हैं।`,
    ];
  }

  if (language === "pa") {
    return [
      `ਚੋਣ ਵਾਲੇ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਸਿੱਧਾ ਕੁੱਲ ਵੋਟ ਨਹੀਂ ਕੱਢਦੇ। ਪਹਿਲਾਂ ਜੇਤੂ ਅਤੇ ਦੂਜੇ ਉਮੀਦਵਾਰ ਦੇ ਵਿਚਕਾਰ ਪ੍ਰਤੀਸ਼ਤ ਫਰਕ ਪਕੜਦੇ ਹਾਂ। ਇਹੀ ਫਰਕ ਅਸਲ ਵੋਟਾਂ ਨਾਲ ਜੁੜਦਾ ਹੈ।`,
      `1) ਜੇਤੂ ਨੂੰ ${winner}% ਵੋਟ ਮਿਲੇ, ਇਸ ਲਈ ਦੂਜੇ ਉਮੀਦਵਾਰ ਨੂੰ ${loser}% ਵੋਟ ਮਿਲੇ।`,
      `2) ਦੋਹਾਂ ਦੇ ਵਿਚਕਾਰ ਫਰਕ:\n${mathBlock([`${winner}-${loser}=${gapPercent}\\%`])}`,
      `3) ਇਹੀ ${gapPercent}% ਫਰਕ ${gap} ਵੋਟਾਂ ਦੇ ਬਰਾਬਰ ਹੈ। ਹੁਣ ਪੂਰਾ ਅਧਾਰ ਨਿਕਲੇਗਾ।\n${mathBlock([`\\frac{${gap}\\times100}{${gapPercent}}=${normalizeNumericText(total)}`])}`,
      `ਮੁੱਖ ਗਲਤੀ ${winner}% ਨੂੰ ਹੀ ਜਿੱਤ ਦਾ ਫਰਕ ਮੰਨਣ ਦੀ ਹੁੰਦੀ ਹੈ। ਜਿੱਤ ਦਾ ਫਰਕ ਹਮੇਸ਼ਾ ਜੇਤੂ ਅਤੇ ਦੂਜੇ ਉਮੀਦਵਾਰ ਦੇ ਵੋਟਾਂ ਦਾ ਅੰਤਰ ਹੁੰਦਾ ਹੈ।`,
      `ਇਸ ਲਈ ਕੁੱਲ ਵੈਧ ਵੋਟ ${answer} ਹਨ।`,
    ];
  }

  return [
    `Do not start with the total. First convert the winning margin into a percentage gap between the two candidates.`,
    `1) The winner has ${winner}%, so the other candidate has ${loser}%.`,
    `2) Their gap is:\n${mathBlock([`${winner}-${loser}=${gapPercent}\\%`])}`,
    `3) This ${gapPercent}% gap equals ${gap} votes, so the full valid vote base is:\n${mathBlock([`\\frac{${gap}\\times100}{${gapPercent}}=${normalizeNumericText(total)}`])}`,
    `A common mistake is treating ${winner}% as the victory margin. The margin is the difference between the winner and the other candidate.`,
    `Therefore, the total valid votes are ${answer}.`,
  ];
}

function examPassFailChain(
  context: PercentageContext,
  language: RealizerLanguage,
): string[] {
  const scored =
    pickNumber(context.values, ["scoredRate"]) ?? 35;
  const pass =
    pickNumber(context.values, ["passRate"]) ?? 40;
  const shortBy =
    pickNumber(context.values, ["shortBy"]) ?? 20;
  const gap = pass - scored;
  const total = (shortBy * 100) / gap;
  assertExpectedAnswer(
    context,
    total,
    "exam-threshold-gap",
  );
  const answer =
    context.answer || normalizeNumericText(total);

  if (language === "hi") {
    return [
      `यह चुनाव वाला अंतर नहीं है। यहाँ पास प्रतिशत और प्राप्त प्रतिशत का अंतर सीधे अंकों की कमी से जुड़ा है।`,
      `1) पास प्रतिशत और प्राप्त प्रतिशत का अंतर:\n${mathBlock([`${pass}-${scored}=${gap}\\%`])}`,
      `2) यही ${gap}% अंतर ${shortBy} अंकों के बराबर है।`,
      `3) कुल अंक:\n${mathBlock([`\\frac{${shortBy}\\times100}{${gap}}=${normalizeNumericText(total)}`])}`,
      `ध्यान रखें, ${scored}% को कुल अंकों से सीधे नहीं जोड़ना है। काम केवल ${gap}% की कमी से बनेगा।`,
      `इसलिए कुल अंक ${answer} हैं।`,
    ];
  }

  if (language === "pa") {
    return [
      `ਇਹ ਚੋਣਾਂ ਵਾਲਾ ਫਰਕ ਨਹੀਂ ਹੈ। ਇੱਥੇ ਪਾਸ ਪ੍ਰਤੀਸ਼ਤ ਅਤੇ ਪ੍ਰਾਪਤ ਪ੍ਰਤੀਸ਼ਤ ਦਾ ਫਰਕ ਸਿੱਧਾ ਘੱਟ ਰਹੇ ਅੰਕਾਂ ਨਾਲ ਜੁੜਿਆ ਹੈ।`,
      `1) ਪਾਸ ਪ੍ਰਤੀਸ਼ਤ ਅਤੇ ਪ੍ਰਾਪਤ ਪ੍ਰਤੀਸ਼ਤ ਦਾ ਫਰਕ:\n${mathBlock([`${pass}-${scored}=${gap}\\%`])}`,
      `2) ਇਹੀ ${gap}% ਫਰਕ ${shortBy} ਅੰਕਾਂ ਦੇ ਬਰਾਬਰ ਹੈ।`,
      `3) ਕੁੱਲ ਅੰਕ:\n${mathBlock([`\\frac{${shortBy}\\times100}{${gap}}=${normalizeNumericText(total)}`])}`,
      `ਧਿਆਨ ਰੱਖੋ, ${scored}% ਨੂੰ ਸਿੱਧਾ ਕੁੱਲ ਅੰਕਾਂ ਨਾਲ ਨਹੀਂ ਜੋੜਨਾ। ਹਿਸਾਬ ${gap}% ਦੀ ਘਾਟ ਤੋਂ ਬਣੇਗਾ।`,
      `ਇਸ ਲਈ ਕੁੱਲ ਅੰਕ ${answer} ਹਨ।`,
    ];
  }

  return [
    `This is not an election gap. The gap between pass percentage and scored percentage is tied to the marks shortfall.`,
    `1) Percentage gap:\n${mathBlock([`${pass}-${scored}=${gap}\\%`])}`,
    `2) This ${gap}% gap equals ${shortBy} marks.`,
    `3) Maximum marks:\n${mathBlock([`\\frac{${shortBy}\\times100}{${gap}}=${normalizeNumericText(total)}`])}`,
    `Do not use ${scored}% directly as the shortfall. Only the ${gap}% gap is linked to the missing marks.`,
    `Therefore, the maximum marks are ${answer}.`,
  ];
}

function electionInvalidChain(
  context: PercentageContext,
  language: RealizerLanguage,
): string[] {
  const voters =
    pickNumber(context.values, ["voters", "total"]) ?? 100000;
  const noVote =
    pickNumber(context.values, ["noVote"]) ?? 10;
  const invalid =
    pickNumber(context.values, ["invalid"]) ?? 10;
  const winnerValid =
    pickNumber(context.values, ["winnerValid", "winnerRate"]) ?? 54;
  const castVotes = voters * (1 - noVote / 100);
  const validVotes = castVotes * (1 - invalid / 100);
  const winnerVotes = validVotes * (winnerValid / 100);
  assertExpectedAnswer(
    context,
    winnerVotes,
    "election-filter-chain",
  );
  const answer =
    context.answer ||
    normalizeNumericText(winnerVotes);

  if (language === "hi") {
    return [
      `यह फ़िल्टर वाला प्रश्न है। पहले कुल मतदाताओं से मतदान करने वालों तक, फिर वैध मतों तक जाएँगे।`,
      `1) डाले गए मत:\n${mathBlock([`${voters}\\times\\frac{${100 - noVote}}{100}=${normalizeNumericText(castVotes)}`])}`,
      `2) वैध मत:\n${mathBlock([`${normalizeNumericText(castVotes)}\\times\\frac{${100 - invalid}}{100}=${normalizeNumericText(validVotes)}`])}`,
      `3) विजेता के मत:\n${mathBlock([`${normalizeNumericText(validVotes)}\\times\\frac{${winnerValid}}{100}=${normalizeNumericText(winnerVotes)}`])}`,
      `गलती तब होती है जब ${winnerValid}% को कुल मतदाताओं पर लगा दिया जाता है। यह प्रतिशत केवल वैध मतों पर लगेगा।`,
      `इसलिए विजेता के मत ${answer} हैं।`,
    ];
  }

  if (language === "pa") {
    return [
      `ਇਹ ਫਿਲਟਰ ਵਾਲਾ ਪ੍ਰਸ਼ਨ ਹੈ। ਪਹਿਲਾਂ ਕੁੱਲ ਵੋਟਰਾਂ ਤੋਂ ਪਈਆਂ ਵੋਟਾਂ ਤੱਕ, ਫਿਰ ਵੈਧ ਵੋਟਾਂ ਤੱਕ ਜਾਵਾਂਗੇ।`,
      `1) ਪਈਆਂ ਵੋਟਾਂ:\n${mathBlock([`${voters}\\times\\frac{${100 - noVote}}{100}=${normalizeNumericText(castVotes)}`])}`,
      `2) ਵੈਧ ਵੋਟਾਂ:\n${mathBlock([`${normalizeNumericText(castVotes)}\\times\\frac{${100 - invalid}}{100}=${normalizeNumericText(validVotes)}`])}`,
      `3) ਜੇਤੂ ਦੀਆਂ ਵੋਟਾਂ:\n${mathBlock([`${normalizeNumericText(validVotes)}\\times\\frac{${winnerValid}}{100}=${normalizeNumericText(winnerVotes)}`])}`,
      `ਗਲਤੀ ਤਦ ਹੁੰਦੀ ਹੈ ਜਦੋਂ ${winnerValid}% ਨੂੰ ਕੁੱਲ ਵੋਟਰਾਂ ਉੱਤੇ ਲਗਾ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ। ਇਹ ਪ੍ਰਤੀਸ਼ਤ ਸਿਰਫ਼ ਵੈਧ ਵੋਟਾਂ ਉੱਤੇ ਲੱਗੇਗਾ।`,
      `ਇਸ ਲਈ ਜੇਤੂ ਦੀਆਂ ਵੋਟਾਂ ${answer} ਹਨ।`,
    ];
  }

  return [
    `This is a filtering chain: total voters → cast votes → valid votes → winner's votes.`,
    `1) Cast votes:\n${mathBlock([`${voters}\\times\\frac{${100 - noVote}}{100}=${normalizeNumericText(castVotes)}`])}`,
    `2) Valid votes:\n${mathBlock([`${normalizeNumericText(castVotes)}\\times\\frac{${100 - invalid}}{100}=${normalizeNumericText(validVotes)}`])}`,
    `3) Winner's votes:\n${mathBlock([`${normalizeNumericText(validVotes)}\\times\\frac{${winnerValid}}{100}=${normalizeNumericText(winnerVotes)}`])}`,
    `The trap is applying ${winnerValid}% to total voters. It applies only to valid votes.`,
    `Therefore, the winner got ${answer} votes.`,
  ];
}

function weightedGroupChain(
  context: PercentageContext,
  language: RealizerLanguage,
): string[] {
  const groupA =
    pickNumber(context.values, ["groupA"]) ?? 200;
  const groupB =
    pickNumber(context.values, ["groupB"]) ?? 100;
  const rateA =
    pickNumber(context.values, ["rateA"]) ?? 20;
  const rateB =
    pickNumber(context.values, ["rateB"]) ?? 40;
  const oldTotal = groupA + groupB;
  const newTotal =
    groupA * (1 + rateA / 100) +
    groupB * (1 + rateB / 100);
  const change =
    ((newTotal - oldTotal) / oldTotal) * 100;
  assertExpectedAnswer(
    context,
    change,
    "weighted-group-change",
  );
  const answer =
    context.answer || normalizeNumericText(change);

  if (language === "hi") {
    return [
      `दोनों समूह बराबर नहीं हैं, इसलिए प्रतिशतों का सीधा औसत नहीं लिया जाएगा।`,
      `1) पुराना कुल:\n${mathBlock([`${groupA}+${groupB}=${oldTotal}`])}`,
      `2) नया कुल:\n${mathBlock([`${groupA}\\times\\frac{${100 + rateA}}{100}+${groupB}\\times\\frac{${100 + rateB}}{100}=${normalizeNumericText(newTotal)}`])}`,
      `3) कुल प्रतिशत वृद्धि:\n${mathBlock([`\\frac{${normalizeNumericText(newTotal)}-${oldTotal}}{${oldTotal}}\\times100=${normalizeNumericText(change)}\\%`])}`,
      `गलती ${rateA}% और ${rateB}% का साधारण औसत लेने से होती है। समूहों का आकार अलग है।`,
      `इसलिए कुल वृद्धि ${answer} है।`,
    ];
  }

  if (language === "pa") {
    return [
      `ਦੋਵੇਂ ਸਮੂਹ ਬਰਾਬਰ ਨਹੀਂ ਹਨ, ਇਸ ਲਈ ਪ੍ਰਤੀਸ਼ਤਾਂ ਦਾ ਸਿੱਧਾ ਔਸਤ ਨਹੀਂ ਲਿਆ ਜਾਵੇਗਾ।`,
      `1) ਪੁਰਾਣਾ ਕੁੱਲ:\n${mathBlock([`${groupA}+${groupB}=${oldTotal}`])}`,
      `2) ਨਵਾਂ ਕੁੱਲ:\n${mathBlock([`${groupA}\\times\\frac{${100 + rateA}}{100}+${groupB}\\times\\frac{${100 + rateB}}{100}=${normalizeNumericText(newTotal)}`])}`,
      `3) ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ:\n${mathBlock([`\\frac{${normalizeNumericText(newTotal)}-${oldTotal}}{${oldTotal}}\\times100=${normalizeNumericText(change)}\\%`])}`,
      `ਗਲਤੀ ${rateA}% ਅਤੇ ${rateB}% ਦਾ ਸਧਾਰਨ ਔਸਤ ਲੈਣ ਨਾਲ ਹੁੰਦੀ ਹੈ। ਸਮੂਹਾਂ ਦਾ ਆਕਾਰ ਵੱਖਰਾ ਹੈ।`,
      `ਇਸ ਲਈ ਕੁੱਲ ਵਾਧਾ ${answer} ਹੈ।`,
    ];
  }

  return [
    `The groups are not equal, so do not average the two percentages directly.`,
    `1) Old total:\n${mathBlock([`${groupA}+${groupB}=${oldTotal}`])}`,
    `2) New total:\n${mathBlock([`${groupA}\\times\\frac{${100 + rateA}}{100}+${groupB}\\times\\frac{${100 + rateB}}{100}=${normalizeNumericText(newTotal)}`])}`,
    `3) Overall percentage increase:\n${mathBlock([`\\frac{${normalizeNumericText(newTotal)}-${oldTotal}}{${oldTotal}}\\times100=${normalizeNumericText(change)}\\%`])}`,
    `The trap is taking a simple average of ${rateA}% and ${rateB}%. The group sizes are different.`,
    `Therefore, the overall increase is ${answer}.`,
  ];
}

function populationGenderChain(
  context: PercentageContext,
  language: RealizerLanguage,
): string[] {
  const total =
    pickNumber(context.values, ["total"]) ?? 70000;
  const maleRate =
    pickNumber(context.values, ["maleRate"]) ?? 10;
  const femaleRate =
    pickNumber(context.values, ["femaleRate"]) ?? 5;
  const newTotal =
    pickNumber(context.values, ["newTotal"]) ?? total;
  const rateGap = maleRate - femaleRate;
  const baseGrowth =
    total * (1 + femaleRate / 100);
  const extraGrowth = newTotal - baseGrowth;
  const males =
    rateGap === 0 ? null : (extraGrowth * 100) / rateGap;
  assertExpectedAnswer(
    context,
    males,
    "population-gender-system",
  );
  const answer =
    context.answer ||
    normalizeNumericText(males ?? 0);

  if (language === "hi") {
    return [
      `पहले पूरी जनसंख्या पर छोटी वृद्धि लगाकर आधार बनाते हैं। अतिरिक्त वृद्धि पुरुषों की अधिक दर से आएगी।`,
      `1) यदि सब ${femaleRate}% बढ़ते, तो नई जनसंख्या होती:\n${mathBlock([`${total}\\times\\frac{${100 + femaleRate}}{100}=${normalizeNumericText(baseGrowth)}`])}`,
      `2) वास्तविक नई जनसंख्या ${normalizeNumericText(newTotal)} है, इसलिए अतिरिक्त भाग:\n${mathBlock([`${normalizeNumericText(newTotal)}-${normalizeNumericText(baseGrowth)}=${normalizeNumericText(extraGrowth)}`])}`,
      `3) यह अतिरिक्त भाग पुरुषों की ${rateGap}% अतिरिक्त वृद्धि से आया:\n${mathBlock([`\\frac{${normalizeNumericText(extraGrowth)}\\times100}{${rateGap}}=${normalizeNumericText(males ?? 0)}`])}`,
      `गलती पुरुष और महिला दरों को सीधे कुल जनसंख्या पर अलग-अलग बिना आधार बनाए लगाने से होती है।`,
      `इसलिए मूल पुरुष जनसंख्या ${answer} है।`,
    ];
  }

  if (language === "pa") {
    return [
      `ਪਹਿਲਾਂ ਪੂਰੀ ਆਬਾਦੀ ਉੱਤੇ ਛੋਟਾ ਵਾਧਾ ਲਗਾ ਕੇ ਅਧਾਰ ਬਣਾਉਂਦੇ ਹਾਂ। ਵਾਧੂ ਵਾਧਾ ਪੁਰਸ਼ਾਂ ਦੀ ਵੱਧ ਦਰ ਤੋਂ ਆਵੇਗਾ।`,
      `1) ਜੇ ਸਭ ${femaleRate}% ਵਧਦੇ, ਤਾਂ ਨਵੀਂ ਆਬਾਦੀ ਹੁੰਦੀ:\n${mathBlock([`${total}\\times\\frac{${100 + femaleRate}}{100}=${normalizeNumericText(baseGrowth)}`])}`,
      `2) ਅਸਲ ਨਵੀਂ ਆਬਾਦੀ ${normalizeNumericText(newTotal)} ਹੈ, ਇਸ ਲਈ ਵਾਧੂ ਹਿੱਸਾ:\n${mathBlock([`${normalizeNumericText(newTotal)}-${normalizeNumericText(baseGrowth)}=${normalizeNumericText(extraGrowth)}`])}`,
      `3) ਇਹ ਵਾਧੂ ਹਿੱਸਾ ਪੁਰਸ਼ਾਂ ਦੀ ${rateGap}% ਵਾਧੂ ਵਾਧੇ ਤੋਂ ਆਇਆ:\n${mathBlock([`\\frac{${normalizeNumericText(extraGrowth)}\\times100}{${rateGap}}=${normalizeNumericText(males ?? 0)}`])}`,
      `ਗਲਤੀ ਪੁਰਸ਼ ਅਤੇ ਔਰਤਾਂ ਦੀਆਂ ਦਰਾਂ ਨੂੰ ਬਿਨਾਂ ਅਧਾਰ ਬਣਾਏ ਸਿੱਧਾ ਕੁੱਲ ਆਬਾਦੀ ਉੱਤੇ ਲਗਾਉਣ ਨਾਲ ਹੁੰਦੀ ਹੈ।`,
      `ਇਸ ਲਈ ਮੁੱਢਲੀ ਪੁਰਸ਼ ਆਬਾਦੀ ${answer} ਹੈ।`,
    ];
  }

  return [
    `Use the smaller growth rate as a common base. The extra population comes from the higher male growth rate.`,
    `1) If everyone grew by ${femaleRate}%:\n${mathBlock([`${total}\\times\\frac{${100 + femaleRate}}{100}=${normalizeNumericText(baseGrowth)}`])}`,
    `2) Extra population:\n${mathBlock([`${normalizeNumericText(newTotal)}-${normalizeNumericText(baseGrowth)}=${normalizeNumericText(extraGrowth)}`])}`,
    `3) This extra is due to the ${rateGap}% extra growth of males:\n${mathBlock([`\\frac{${normalizeNumericText(extraGrowth)}\\times100}{${rateGap}}=${normalizeNumericText(males ?? 0)}`])}`,
    `The trap is trying to split the total directly without isolating the extra growth.`,
    `Therefore, the original male population is ${answer}.`,
  ];
}

function successiveChain(
  context: PercentageContext,
  language: RealizerLanguage,
): string[] {
  const motifId = context.motifId;
  const value =
    pickNumber(context.values, [
      "value",
      "population",
      "price",
    ]) ?? 100;
  const rate =
    pickNumber(context.values, [
      "rate",
      "increase",
      "decrease",
    ]) ?? 10;
  const exactFinal = (
    start: number,
    rates: number[],
  ) =>
    rates.reduce(
      (current, item) =>
        current * (1 + item / 100),
      start,
    );
  const exactCascade = (
    planner: string,
    start: number,
    rates: number[],
  ) => {
    const firstValue = exactFinal(start, [
      rates[0] ?? 0,
    ]);
    const finalValue = exactFinal(
      start,
      rates,
    );
    assertExpectedAnswer(
      context,
      planner === "compound-error"
        ? finalValue - start
        : finalValue,
      planner,
    );

    const rateLabel = (item: number) => {
      if (language === "hi") {
        return item >= 0
          ? `${item}% की वृद्धि`
          : `${Math.abs(item)}% की कमी`;
      }
      if (language === "pa") {
        return item >= 0
          ? `${item}% ਦਾ ਵਾਧਾ`
          : `${Math.abs(item)}% ਦੀ ਕਮੀ`;
      }
      return item >= 0
        ? `${item}% increase`
        : `${Math.abs(item)}% decrease`;
    };
    const factor = (item: number) =>
      `\\frac{${100 + item}}{100}`;
    const answer =
      context.answer ||
      normalizeNumericText(
        planner === "compound-error"
          ? finalValue - start
          : finalValue,
      );

    if (language === "hi") {
      return [
        `इस प्रश्न में हर बदलाव अपने नए आधार पर लगेगा।`,
        `1) शुरुआती मान ${start} है। ${rateLabel(rates[0] ?? 0)} के बाद:\n${mathBlock([`${start}\\times${factor(rates[0] ?? 0)}=${normalizeNumericText(firstValue)}`])}`,
        rates.length > 1
          ? `2) अगला बदलाव ${normalizeNumericText(firstValue)} पर लगेगा।\n${mathBlock([`${normalizeNumericText(firstValue)}\\times${factor(rates[1] ?? 0)}=${normalizeNumericText(finalValue)}`])}`
          : `2) बदलाव एक ही चरण में पूरा हो गया।\n${mathBlock([`${normalizeNumericText(finalValue)}`])}`,
        planner === "compound-error"
          ? `3) कुल बदलाव:\n${mathBlock([`${normalizeNumericText(finalValue)}-${start}=${normalizeNumericText(finalValue - start)}\\%`])}`
          : `3) अंतिम मान:\n${mathBlock([`${normalizeNumericText(finalValue)}`])}`,
        `मुख्य बात यह है कि अगला प्रतिशत पुराने आधार पर नहीं, बदले हुए मान पर लगता है।`,
        `अतः उत्तर ${answer} है।`,
      ];
    }

    if (language === "pa") {
      return [
        `ਇਸ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਹਰ ਬਦਲਾਅ ਆਪਣੇ ਨਵੇਂ ਅਧਾਰ ਉੱਤੇ ਲੱਗੇਗਾ।`,
        `1) ਸ਼ੁਰੂਆਤੀ ਮਾਨ ${start} ਹੈ। ${rateLabel(rates[0] ?? 0)} ਤੋਂ ਬਾਅਦ:\n${mathBlock([`${start}\\times${factor(rates[0] ?? 0)}=${normalizeNumericText(firstValue)}`])}`,
        rates.length > 1
          ? `2) ਅਗਲਾ ਬਦਲਾਅ ${normalizeNumericText(firstValue)} ਉੱਤੇ ਲੱਗੇਗਾ।\n${mathBlock([`${normalizeNumericText(firstValue)}\\times${factor(rates[1] ?? 0)}=${normalizeNumericText(finalValue)}`])}`
          : `2) ਬਦਲਾਅ ਇੱਕ ਹੀ ਕਦਮ ਵਿੱਚ ਪੂਰਾ ਹੋ ਗਿਆ।\n${mathBlock([`${normalizeNumericText(finalValue)}`])}`,
        planner === "compound-error"
          ? `3) ਕੁੱਲ ਬਦਲਾਅ:\n${mathBlock([`${normalizeNumericText(finalValue)}-${start}=${normalizeNumericText(finalValue - start)}\\%`])}`
          : `3) ਅੰਤਿਮ ਮਾਨ:\n${mathBlock([`${normalizeNumericText(finalValue)}`])}`,
        `ਮੁੱਖ ਗੱਲ ਇਹ ਹੈ ਕਿ ਅਗਲਾ ਪ੍ਰਤੀਸ਼ਤ ਪੁਰਾਣੇ ਅਧਾਰ ਉੱਤੇ ਨਹੀਂ, ਬਦਲੇ ਹੋਏ ਮਾਨ ਉੱਤੇ ਲੱਗਦਾ ਹੈ।`,
        `ਇਸ ਲਈ ਉੱਤਰ ${answer} ਹੈ।`,
      ];
    }

    return [
      `Each change must be applied to the latest value, not to the original value again.`,
      `1) Starting value is ${start}. After ${rateLabel(rates[0] ?? 0)}:\n${mathBlock([`${start}\\times${factor(rates[0] ?? 0)}=${normalizeNumericText(firstValue)}`])}`,
      rates.length > 1
        ? `2) The next change applies to ${normalizeNumericText(firstValue)}.\n${mathBlock([`${normalizeNumericText(firstValue)}\\times${factor(rates[1] ?? 0)}=${normalizeNumericText(finalValue)}`])}`
        : `2) The change is completed in one stage.\n${mathBlock([`${normalizeNumericText(finalValue)}`])}`,
      planner === "compound-error"
        ? `3) Overall change:\n${mathBlock([`${normalizeNumericText(finalValue)}-${start}=${normalizeNumericText(finalValue - start)}\\%`])}`
        : `3) Final value:\n${mathBlock([`${normalizeNumericText(finalValue)}`])}`,
      `The key is the base shift: the next percent uses the updated value.`,
      `Therefore, the answer is ${answer}.`,
    ];
  };

  if (motifId === "perc_machine_depreciation") {
    return exactCascade(
      "successive-depreciation",
      value,
      [-rate, -rate],
    );
  }

  if (motifId === "perc_population_growth") {
    return exactCascade(
      "compound-growth",
      value,
      [rate, rate],
    );
  }

  if (motifId === "perc_price_decrease") {
    return exactCascade(
      "single-decrease",
      value,
      [-rate],
    );
  }

  if (motifId === "perc_price_increase") {
    return exactCascade(
      "single-increase",
      value,
      [rate],
    );
  }

  if (motifId === "perc_compound_error") {
    return exactCascade(
      "compound-error",
      100,
      [rate, -rate],
    );
  }

  if (motifId === "perc_successive_hike") {
    const start =
      pickNumber(context.values, [
        "value",
      ]) ?? 100;
    const r1 =
      pickNumber(context.values, [
        "r1",
        "rate1",
        "firstRate",
      ]) ?? 10;
    const r2 =
      pickNumber(context.values, [
        "r2",
        "rate2",
        "secondRate",
      ]) ?? 20;
    return exactCascade(
      "successive-appreciation",
      start,
      [r1, r2],
    );
  }

  const first =
    pickNumber(context.values, [
      "first",
      "firstRate",
      "rate1",
      "increase1",
      "x",
    ]) ?? 10;
  const second =
    pickNumber(context.values, [
      "second",
      "secondRate",
      "rate2",
      "increase2",
      "y",
    ]) ?? 20;
  const afterFirst = 100 * (1 + first / 100);
  const afterSecond =
    afterFirst * (1 + second / 100);
  const change = afterSecond - 100;
  const answer =
    context.answer || `${normalizeNumericText(change)}%`;

  if (language === "hi") {
    return [
      `क्रमिक प्रतिशत में हर अगला बदलाव नए बने हुए आधार पर लगता है। इसलिए 100 से शुरू करना सबसे साफ तरीका है।`,
      `1) शुरुआती मान 100 माना। पहले ${first}% बदलाव के बाद:\n${mathBlock([`100\\times\\frac{${100 + first}}{100}=${normalizeNumericText(afterFirst)}`])}`,
      `2) अब दूसरा ${second}% बदलाव ${normalizeNumericText(afterFirst)} पर लगेगा, पुराने 100 पर नहीं।\n${mathBlock([`${normalizeNumericText(afterFirst)}\\times\\frac{${100 + second}}{100}=${normalizeNumericText(afterSecond)}`])}`,
      `3) कुल बदलाव:\n${mathBlock([`${normalizeNumericText(afterSecond)}-100=${normalizeNumericText(change)}\\%`])}`,
      `गलती तब होती है जब दोनों प्रतिशत सीधे जोड़ दिए जाते हैं। दूसरा प्रतिशत बदले हुए आधार पर लगता है।`,
      `अतः कुल परिवर्तन ${answer} है।`,
    ];
  }

  if (language === "pa") {
    return [
      `ਲੜੀਵਾਰ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਹਰ ਅਗਲਾ ਬਦਲਾਅ ਨਵੇਂ ਬਣੇ ਅਧਾਰ ਉੱਤੇ ਲੱਗਦਾ ਹੈ। ਇਸ ਲਈ 100 ਤੋਂ ਸ਼ੁਰੂ ਕਰਨਾ ਸਭ ਤੋਂ ਸਾਫ਼ ਤਰੀਕਾ ਹੈ।`,
      `1) ਸ਼ੁਰੂਆਤੀ ਮਾਨ 100 ਮੰਨਿਆ। ਪਹਿਲੇ ${first}% ਬਦਲਾਅ ਤੋਂ ਬਾਅਦ:\n${mathBlock([`100\\times\\frac{${100 + first}}{100}=${normalizeNumericText(afterFirst)}`])}`,
      `2) ਹੁਣ ਦੂਜਾ ${second}% ਬਦਲਾਅ ${normalizeNumericText(afterFirst)} ਉੱਤੇ ਲੱਗੇਗਾ, ਪੁਰਾਣੇ 100 ਉੱਤੇ ਨਹੀਂ।\n${mathBlock([`${normalizeNumericText(afterFirst)}\\times\\frac{${100 + second}}{100}=${normalizeNumericText(afterSecond)}`])}`,
      `3) ਕੁੱਲ ਬਦਲਾਅ:\n${mathBlock([`${normalizeNumericText(afterSecond)}-100=${normalizeNumericText(change)}\\%`])}`,
      `ਗਲਤੀ ਤਦ ਹੁੰਦੀ ਹੈ ਜਦੋਂ ਦੋਵੇਂ ਪ੍ਰਤੀਸ਼ਤ ਸਿੱਧੇ ਜੋੜ ਦਿੱਤੇ ਜਾਂਦੇ ਹਨ। ਦੂਜਾ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲੇ ਹੋਏ ਅਧਾਰ ਉੱਤੇ ਲੱਗਦਾ ਹੈ।`,
      `ਇਸ ਲਈ ਕੁੱਲ ਬਦਲਾਅ ${answer} ਹੈ।`,
    ];
  }

  return [
    `In successive percentage questions, each next change applies to the new base. Starting from 100 keeps the calculation clean.`,
    `1) Assume the starting value is 100. After the first ${first}% change:\n${mathBlock([`100\\times\\frac{${100 + first}}{100}=${normalizeNumericText(afterFirst)}`])}`,
    `2) The second ${second}% change applies to ${normalizeNumericText(afterFirst)}, not to the old 100.\n${mathBlock([`${normalizeNumericText(afterFirst)}\\times\\frac{${100 + second}}{100}=${normalizeNumericText(afterSecond)}`])}`,
    `3) Overall change:\n${mathBlock([`${normalizeNumericText(afterSecond)}-100=${normalizeNumericText(change)}\\%`])}`,
    `The trap is adding percentages directly. The second percentage is always on the shifted base.`,
    `Therefore, the overall change is ${answer}.`,
  ];
}

function genericChain(
  context: PercentageContext,
  language: RealizerLanguage,
  archetype: PercentageArchetype,
): string[] {
  const rate =
    pickNumber(context.values, [
      "rate",
      "percent",
      "percentage",
    ]) ?? null;
  const base =
    pickNumber(context.values, [
      "base",
      "amount",
      "total",
      "value",
    ]) ?? null;
  const answer = context.answer;

  if (language === "hi") {
    return [
      `${STRATEGY_MAP.hi[archetype]} को पकड़कर प्रश्न को छोटे हिस्सों में तोड़ेंगे। पहले यह तय करें कि 100% किस मात्रा को माना गया है।`,
      `1) सही आधार पहचानें। प्रतिशत हमेशा इसी आधार पर लगाया जाएगा।`,
      base !== null && rate !== null
        ? `2) अब दिए गए प्रतिशत को इसी आधार पर लगाते हैं।\n${mathBlock([`\\frac{${rate}}{100}\\times${base}=${answer}`])}`
        : `2) अब दी गई जानकारी को एक ही आधार पर रखकर तुलना करें।`,
      `3) अंतिम मान विकल्पों से मिलाएँ।`,
      `सबसे सामान्य गलती अलग-अलग आधारों के प्रतिशत को सीधे जोड़ना या घटाना है। हर पंक्ति में यह देखना जरूरी है कि प्रतिशत किस पर लग रहा है।`,
      `अतः सही उत्तर ${answer} है।`,
    ];
  }

  if (language === "pa") {
    return [
      `${STRATEGY_MAP.pa[archetype]} ਨੂੰ ਪਕੜ ਕੇ ਪ੍ਰਸ਼ਨ ਨੂੰ ਛੋਟੇ ਹਿੱਸਿਆਂ ਵਿੱਚ ਤੋੜਾਂਗੇ। ਪਹਿਲਾਂ ਇਹ ਤੈਅ ਕਰੋ ਕਿ 100% ਕਿਸ ਮਾਤਰਾ ਨੂੰ ਮੰਨਿਆ ਗਿਆ ਹੈ।`,
      `1) ਸਹੀ ਅਧਾਰ ਪਛਾਣੋ। ਪ੍ਰਤੀਸ਼ਤ ਹਮੇਸ਼ਾ ਇਸੇ ਅਧਾਰ ਉੱਤੇ ਲੱਗੇਗਾ।`,
      base !== null && rate !== null
        ? `2) ਹੁਣ ਦਿੱਤਾ ਪ੍ਰਤੀਸ਼ਤ ਇਸੇ ਅਧਾਰ ਉੱਤੇ ਲਗਾਉਂਦੇ ਹਾਂ।\n${mathBlock([`\\frac{${rate}}{100}\\times${base}=${answer}`])}`
        : `2) ਹੁਣ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਨੂੰ ਇੱਕੋ ਅਧਾਰ ਉੱਤੇ ਰੱਖ ਕੇ ਤੁਲਨਾ ਕਰੋ।`,
      `3) ਅੰਤਿਮ ਮਾਨ ਨੂੰ ਵਿਕਲਪਾਂ ਨਾਲ ਮਿਲਾਓ।`,
      `ਸਭ ਤੋਂ ਆਮ ਗਲਤੀ ਵੱਖ-ਵੱਖ ਅਧਾਰਾਂ ਦੇ ਪ੍ਰਤੀਸ਼ਤ ਨੂੰ ਸਿੱਧਾ ਜੋੜਣ ਜਾਂ ਘਟਾਉਣ ਦੀ ਹੁੰਦੀ ਹੈ। ਹਰ ਲਾਈਨ ਵਿੱਚ ਦੇਖਣਾ ਜ਼ਰੂਰੀ ਹੈ ਕਿ ਪ੍ਰਤੀਸ਼ਤ ਕਿਸ ਉੱਤੇ ਲੱਗ ਰਿਹਾ ਹੈ।`,
      `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`,
    ];
  }

  return [
    `Keep each percentage attached to the quantity named in the question. That prevents the calculation from drifting.`,
    base !== null
      ? `1) The stated quantity is ${base}, so any direct percentage is applied to ${base}.`
      : `1) Translate the stated relationship into the required percentage expression.`,
    base !== null && rate !== null
      ? `2) Calculate the required part:\n${mathBlock([`\\frac{${rate}}{100}\\times${base}=${answer}`])}`
      : `2) Keep the given quantities in the same comparison before using the options.`,
    `3) Match the final value with the options.`,
    `The common mistake is moving a percentage to a different quantity. Use the quantity explicitly mentioned with that percent.`,
    `Therefore, the correct answer is ${answer}.`,
  ];
}

function coreIdeaText(
  language: RealizerLanguage,
  archetype: PercentageArchetype,
): string {
  if (language === "hi") {
    switch (archetype) {
      case "productConstancy":
        return "कुल खर्च को स्थिर रखना है। इसलिए कीमत बदलेगी तो खपत उलटी दिशा में बदलेगी।";
      case "successiveCascading":
      case "populationCascade":
        return "हर अगला प्रतिशत नए बने हुए मान पर लगेगा। पुराने मान पर वापस नहीं जाना है।";
      case "differentialBalance":
        return "पहले प्रतिशत का अंतर पकड़ें। वही अंतर असली संख्या से जुड़ता है।";
      case "mixtureConcentration":
        return "जो हिस्सा नहीं बदल रहा, उसी को पकड़कर पूरा प्रश्न आसान हो जाता है।";
      case "salaryBudgetAllocation":
        return "आय, बचत और खर्च को अलग-अलग रखकर तुलना करनी है।";
      case "asymmetricBoundaries":
        return "दोनों तुलना अलग आधारों पर हैं। पहले सही आधार तय करें।";
      default:
        return "पहले यह तय करें कि 100% किस मात्रा को माना गया है।";
    }
  }

  if (language === "pa") {
    switch (archetype) {
      case "productConstancy":
        return "ਕੁੱਲ ਖਰਚ ਇੱਕੋ ਜਿਹਾ ਰੱਖਣਾ ਹੈ। ਇਸ ਲਈ ਕੀਮਤ ਬਦਲੇਗੀ ਤਾਂ ਖਪਤ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ ਬਦਲੇਗੀ।";
      case "successiveCascading":
      case "populationCascade":
        return "ਹਰ ਅਗਲਾ ਪ੍ਰਤੀਸ਼ਤ ਨਵੇਂ ਬਣੇ ਮਾਨ ਉੱਤੇ ਲੱਗੇਗਾ। ਪੁਰਾਣੇ ਮਾਨ ਉੱਤੇ ਵਾਪਸ ਨਹੀਂ ਜਾਣਾ।";
      case "differentialBalance":
        return "ਪਹਿਲਾਂ ਪ੍ਰਤੀਸ਼ਤ ਦਾ ਫਰਕ ਪਕੜੋ। ਉਹੀ ਫਰਕ ਅਸਲ ਗਿਣਤੀ ਨਾਲ ਜੁੜਦਾ ਹੈ।";
      case "mixtureConcentration":
        return "ਜੋ ਹਿੱਸਾ ਨਹੀਂ ਬਦਲ ਰਿਹਾ, ਉਸ ਨੂੰ ਪਕੜ ਕੇ ਪ੍ਰਸ਼ਨ ਆਸਾਨ ਹੋ ਜਾਂਦਾ ਹੈ।";
      case "salaryBudgetAllocation":
        return "ਆਮਦਨ, ਬਚਤ ਅਤੇ ਖਰਚ ਨੂੰ ਵੱਖ-ਵੱਖ ਰੱਖ ਕੇ ਤੁਲਨਾ ਕਰਨੀ ਹੈ।";
      case "asymmetricBoundaries":
        return "ਦੋਵੇਂ ਤੁਲਨਾਵਾਂ ਵੱਖਰੇ ਅਧਾਰਾਂ ਉੱਤੇ ਹਨ। ਪਹਿਲਾਂ ਸਹੀ ਅਧਾਰ ਤੈਅ ਕਰੋ।";
      default:
        return "ਪਹਿਲਾਂ ਇਹ ਤੈਅ ਕਰੋ ਕਿ 100% ਕਿਸ ਮਾਤਰਾ ਨੂੰ ਮੰਨਿਆ ਗਿਆ ਹੈ।";
    }
  }

  switch (archetype) {
    case "productConstancy":
      return "Keep the total spend unchanged. If price goes up, consumption must move the other way.";
    case "successiveCascading":
    case "populationCascade":
      return "Each percentage change works on the latest value, not on the old starting value.";
    case "differentialBalance":
      return "First find the percentage gap. That gap connects the story to the real number.";
    case "mixtureConcentration":
      return "Hold the unchanged part steady. That makes the mixture question much simpler.";
    case "salaryBudgetAllocation":
      return "Keep income, saving, and expense separate before comparing them.";
    case "asymmetricBoundaries":
      return "The two comparisons use different bases. Fix the base before calculating.";
    default:
      return "First decide what quantity is being treated as 100%.";
  }
}

function keyInsightText(
  language: RealizerLanguage,
  archetype: PercentageArchetype,
): string {
  if (language === "hi") {
    switch (archetype) {
      case "productConstancy":
        return "जब कुल खर्च समान रहता है, तो कीमत और खपत का गुणनफल समान रहता है।";
      case "successiveCascading":
      case "populationCascade":
        return "प्रतिशत जोड़ने से उत्तर नहीं मिलता; हर बार नया आधार बनता है।";
      case "differentialBalance":
        return "जीत, अंतर या कमी वाले प्रश्नों में प्रतिशत फर्क सबसे जरूरी संकेत होता है।";
      case "mixtureConcentration":
        return "मिश्रण में स्थिर रहने वाला हिस्सा सबसे अच्छा रास्ता देता है।";
      case "salaryBudgetAllocation":
        return "खर्च की वृद्धि आय की वृद्धि से अलग हो सकती है। तुलना खर्च से ही करें।";
      case "asymmetricBoundaries":
        return "A से B और B से A की तुलना समान नहीं होती, क्योंकि आधार बदल जाता है।";
      default:
        return "प्रतिशत हमेशा अपने सही आधार पर ही लगाएँ।";
    }
  }

  if (language === "pa") {
    switch (archetype) {
      case "productConstancy":
        return "ਜਦੋਂ ਕੁੱਲ ਖਰਚ ਇੱਕੋ ਜਿਹਾ ਰਹਿੰਦਾ ਹੈ, ਤਾਂ ਕੀਮਤ ਅਤੇ ਖਪਤ ਦਾ ਗੁਣਨਫਲ ਇੱਕੋ ਰਹਿੰਦਾ ਹੈ।";
      case "successiveCascading":
      case "populationCascade":
        return "ਪ੍ਰਤੀਸ਼ਤ ਜੋੜਣ ਨਾਲ ਉੱਤਰ ਨਹੀਂ ਮਿਲਦਾ; ਹਰ ਵਾਰ ਨਵਾਂ ਅਧਾਰ ਬਣਦਾ ਹੈ।";
      case "differentialBalance":
        return "ਜਿੱਤ, ਫਰਕ ਜਾਂ ਕਮੀ ਵਾਲੇ ਪ੍ਰਸ਼ਨਾਂ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਫਰਕ ਸਭ ਤੋਂ ਜ਼ਰੂਰੀ ਇਸ਼ਾਰਾ ਹੁੰਦਾ ਹੈ।";
      case "mixtureConcentration":
        return "ਮਿਸ਼ਰਣ ਵਿੱਚ ਜੋ ਹਿੱਸਾ ਸਥਿਰ ਰਹਿੰਦਾ ਹੈ, ਉਹੀ ਸਭ ਤੋਂ ਸਾਫ਼ ਰਸਤਾ ਦਿੰਦਾ ਹੈ।";
      case "salaryBudgetAllocation":
        return "ਖਰਚ ਦਾ ਵਾਧਾ ਆਮਦਨ ਦੇ ਵਾਧੇ ਤੋਂ ਵੱਖ ਹੋ ਸਕਦਾ ਹੈ। ਤੁਲਨਾ ਖਰਚ ਨਾਲ ਹੀ ਕਰੋ।";
      case "asymmetricBoundaries":
        return "A ਤੋਂ B ਅਤੇ B ਤੋਂ A ਦੀ ਤੁਲਨਾ ਇੱਕੋ ਨਹੀਂ ਹੁੰਦੀ, ਕਿਉਂਕਿ ਅਧਾਰ ਬਦਲ ਜਾਂਦਾ ਹੈ।";
      default:
        return "ਪ੍ਰਤੀਸ਼ਤ ਹਮੇਸ਼ਾ ਆਪਣੇ ਸਹੀ ਅਧਾਰ ਉੱਤੇ ਹੀ ਲਗਾਓ।";
    }
  }

  switch (archetype) {
    case "productConstancy":
      return "When spend is fixed, price and consumption keep the same product.";
    case "successiveCascading":
    case "populationCascade":
      return "Do not add percentage changes directly; each step creates a new base.";
    case "differentialBalance":
      return "In margin questions, the percentage gap is the fastest route to the total.";
    case "mixtureConcentration":
      return "The unchanged part is the cleanest anchor in concentration questions.";
    case "salaryBudgetAllocation":
      return "Expense change can be different from income change; compare expense with expense.";
    case "asymmetricBoundaries":
      return "A-to-B and B-to-A comparisons are different because the base changes.";
    default:
      return "Percentages only make sense after the correct base is fixed.";
  }
}

function finalAnswerText(
  answer: string,
  language: RealizerLanguage,
): string {
  const answerBody = escapeLatexPercent(
    answer.replace(/^\$|\$$/g, ""),
  );
  const renderedAnswer = `$${answerBody}$`;

  if (language === "hi") {
    return `${mathBlock([answerBody])}\nइसलिए सही उत्तर ${renderedAnswer} है।`;
  }
  if (language === "pa") {
    return `${mathBlock([answerBody])}\nਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${renderedAnswer} ਹੈ।`;
  }
  return `${mathBlock([answerBody])}\nTherefore, the correct answer is ${renderedAnswer}.`;
}

function explanationText(
  context: PercentageContext,
  language: RealizerLanguage,
): string {
  const archetype =
    ARCHETYPE_BY_MOTIF[context.motifId] ??
    "directBase";
  const plannerId = plannerIdForMotif(
    context.motifId,
  );
  const sections = LABELS[language];
  const directChain =
    directPercentageChain(context, language);
  const chain =
    context.motifId === "perc_exam_pass_fail"
      ? examPassFailChain(context, language)
      : context.motifId === "perc_election_invalid"
        ? electionInvalidChain(context, language)
        : context.motifId === "perc_weighted_group_change"
          ? weightedGroupChain(context, language)
          : context.motifId === "perc_population_gender"
            ? populationGenderChain(context, language)
            : context.motifId === "perc_restore_value"
              ? restoreValueChain(context, language)
              : context.motifId === "perc_cheaper_dearer_chain"
                ? cheaperDearerChain(context, language)
                : directChain
                  ? directChain
                  : archetype === "productConstancy"
                    ? productConstancyChain(context, language)
                    : archetype === "differentialBalance"
                      ? differentialBalanceChain(context, language)
                      : archetype === "successiveCascading" ||
                          archetype === "populationCascade"
                        ? successiveChain(context, language)
                        : genericChain(
                            context,
                            language,
                            archetype,
                          );

  const stepMathBody = chain && chain.length > 0 ? chain.join("\n\n") : "";

  const explanation = [
    `${sections.coreIdea}\n${exactCoreIdeaText(language, plannerId, archetype)}`,
    `${sections.stepMath}\n${stepMathBody}`,
    `${sections.keyInsight}\n${exactKeyInsightText(language, plannerId, archetype)}`,
    `${sections.finalAnswer}\n${finalAnswerText(context.answer, language)}`,
  ].join("\n\n");

  if (language === "en") {
    validatePlannerConsistency(
      context,
      explanation,
      plannerId,
    );
  }

  return explanation;
}

export function isPercentageNativeInput(
  input: NativeRealizerInput,
): boolean {
  return buildContext(input) !== null;
}

export function realizePercentagePedagogy(
  input: NativeRealizerInput,
  language: RealizerLanguage,
): RealizedLanguageBundle | null {
  const context = buildContext(input);
  if (!context) {
    return null;
  }

  try {
    const question = assertNative(
      questionText(context, language),
      language,
    );
    const explanation = assertNative(
      explanationText(context, language),
      language,
    );

    console.info(
      "[percentage-runtime] explanation planner selected",
      {
        motifId: context.motifId,
        language,
        planner: plannerIdForMotif(
          context.motifId,
        ),
        mathRenderer:
          "MathJax display delimiters",
      },
    );

    return {
      question,
      options: context.options,
      explanation,
    };
  } catch (error) {
    console.error(
      "[percentage-runtime] explanation planner validation failed",
      {
        motifId: context.motifId,
        language,
        planner: plannerIdForMotif(
          context.motifId,
        ),
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
    );
    return null;
  }
}
