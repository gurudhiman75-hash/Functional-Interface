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
    coreIdea: "ਮੁੱਖ ਗੱਲ",
    stepMath: "ਹਿਸਾਬ ਦੇ ਕਦਮ",
    keyInsight: "ਛੋਟੀ ਸਮਝ",
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

function percentText(value: number): string {
  const key = Object.keys(
    FRACTIONAL_PERCENT_MATRIX,
  ).find(
    (entry) =>
      Math.abs(Number(entry) - value) <
      0.0001,
  );

  if (!key) {
    return `${normalizeNumericText(value)}%`;
  }

  const fraction =
    FRACTIONAL_PERCENT_MATRIX[key];
  const whole = Math.floor(value);
  const remainder =
    value - whole > 0.0001;

  if (!remainder) {
    return `${whole}%`;
  }

  return `${whole}\\frac{${fraction.numerator}}{${fraction.denominator}}\\%`;
}

function mathBlock(lines: string[]): string {
  if (lines.length === 1) {
    return `\\[${lines[0]}\\]`;
  }
  return `\\[\\begin{aligned}${lines.join("\\\\")}\\end{aligned}\\]`;
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
    return normalized;
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
      input.question.answer ??
      scenario.correctAnswer ??
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
  ]);
  const first = pickNumber(values, [
    "first",
    "firstRate",
    "rate1",
    "x",
  ]);
  const second = pickNumber(values, [
    "second",
    "secondRate",
    "rate2",
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
    return `The price of sugar rises by ${rate}%. By what percent should consumption be reduced so the monthly budget remains unchanged?`;
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
    return `In an election between two candidates, the winner got ${winnerText}% of the valid votes and won by ${gapText} votes. Find the total valid votes.`;
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
    return `A value increases first by ${first}% and then by ${second}%. Find the overall percentage increase.`;
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
    return `What is ${rate}% of ${total}?`;
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
    return `Find ${x}% of ${y} plus ${a}% of ${b}.`;
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
    return `A student scored ${scored} marks out of ${total}. Find the percentage.`;
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
    return `A price of ${price} is ${isIncrease ? "increased" : "decreased"} by ${rate}%. Find the new price.`;
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
    return `A population of ${total} grows at ${rate}% per year for 2 years. Find the final population.`;
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
      return `A machine worth ${value} depreciates by ${rate}% every year for 2 years. Find its value after 2 years.`;
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
    return `${noVote}% voters did not vote and ${invalid}% of cast votes were invalid. The winner got ${winnerValid}% of valid votes. If total voters are ${total}, find the winner's votes.`;
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
    return `${mixture} L mixture contains ${initial}% water. How much water must be added to make water ${target}%?`;
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
    return `Fresh fruit weighs ${fresh} kg and contains ${freshWater}% water. Dry fruit contains ${dryWater}% water. Find the dry weight.`;
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
    return `A person's income is ${income}. He saves ${savingsRate}% of it. If income increases by ${incomeIncrease}% but savings remain the same, find the percentage increase in expenditure.`;
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
    return `In a coaching centre, ${groupA} students in group A increase by ${rateA}% and ${groupB} students in group B increase by ${rateB}%. Find the overall percentage increase in students.`;
  }

  if (language === "hi") {
    return "प्रतिशत के इस प्रश्न में सही आधार पहचानकर उत्तर ज्ञात कीजिए।";
  }
  if (language === "pa") {
    return "ਪ੍ਰਤੀਸ਼ਤ ਦੇ ਇਸ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਸਹੀ ਅਧਾਰ ਪਛਾਣ ਕੇ ਉੱਤਰ ਪਤਾ ਕਰੋ।";
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

function successiveChain(
  context: PercentageContext,
  language: RealizerLanguage,
): string[] {
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
    `Use ${STRATEGY_MAP.en[archetype]} and break the question into small parts. First decide what is being treated as 100%.`,
    `1) Identify the correct base. Every percentage must be applied on that base only.`,
    base !== null && rate !== null
      ? `2) Apply the given percentage on that base.\n${mathBlock([`\\frac{${rate}}{100}\\times${base}=${answer}`])}`
      : `2) Bring the given information onto the same base before comparing.`,
    `3) Match the final value with the options.`,
    `The common mistake is mixing percentages from different bases. Always check what the percentage is "of" before calculating.`,
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
  const renderedAnswer =
    answer.startsWith("$") ? answer : `$${answer}$`;

  if (language === "hi") {
    return `${mathBlock([answer.replace(/^\$|\$$/g, "")])}\nइसलिए सही उत्तर ${renderedAnswer} है।`;
  }
  if (language === "pa") {
    return `${mathBlock([answer.replace(/^\$|\$$/g, "")])}\nਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${renderedAnswer} ਹੈ।`;
  }
  return `${mathBlock([answer.replace(/^\$|\$$/g, "")])}\nTherefore, the correct answer is ${renderedAnswer}.`;
}

function explanationText(
  context: PercentageContext,
  language: RealizerLanguage,
): string {
  const archetype =
    ARCHETYPE_BY_MOTIF[context.motifId] ??
    "directBase";
  const sections = LABELS[language];
  const chain =
    archetype === "productConstancy"
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

  return [
    `${sections.coreIdea}\n${coreIdeaText(language, archetype)}`,
    `${sections.stepMath}\n${chain[1]}\n\n${chain[2]}\n\n${chain[3]}`,
    `${sections.keyInsight}\n${keyInsightText(language, archetype)}`,
    `${sections.finalAnswer}\n${finalAnswerText(context.answer, language)}`,
  ].join("\n\n");
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
        planner:
          "examtree-minimalist-percentage",
        mathRenderer:
          "MathJax display delimiters",
      },
    );

    return {
      question,
      options: context.options,
      explanation,
    };
  } catch {
    return null;
  }
}
