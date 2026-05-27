import type {
  CanonicalRatioProportionProblem,
  RatioProportionAnswerKind,
  RatioProportionAnswerUnit,
  RatioProportionExplanationStep,
  RatioProportionFamilyId,
  RatioProportionLocalizedText,
  RatioProportionMotifFactory,
} from "./ratio-proportion-types";

export const RATIO_PROPORTION_FAMILY_IDS: readonly RatioProportionFamilyId[] = [
  "rp_direct_sharing",
  "rp_sum_based_ratio_recovery",
  "rp_difference_based_ratio_recovery",
  "rp_missing_term_proportion",
  "rp_ratio_to_fraction",
  "rp_fraction_to_ratio",
  "rp_ratio_after_increase",
  "rp_ratio_after_decrease",
  "rp_ratio_after_transfer",
  "rp_age_future_ratio",
  "rp_age_past_ratio",
  "rp_partnership_basic",
  "rp_partnership_time_variation",
  "rp_direct_variation_basic",
  "rp_inverse_variation_basic",
  "rp_joint_variation",
  "rp_combined_direct_inverse",
  "rp_map_scale_ratio",
  "rp_side_area_volume_ratio",
  "rp_chain_ratio_network",
  "rp_equivalent_ratio_generation",
  "rp_ratio_to_percentage",
  "rp_percentage_to_ratio",
  "rp_product_based_ratio_recovery",
  "rp_partial_value_ratio_recovery",
  "rp_ratio_after_exchange",
  "rp_ratio_restoration",
  "rp_reverse_ratio_scaling",
  "rp_age_difference_constant",
  "rp_age_multi_generation",
  "rp_partnership_partial_exit",
  "rp_partnership_profit_distribution",
  "rp_population_gender_ratio",
  "rp_voter_turnout_ratio",
  "rp_marks_distribution_ratio",
  "rp_recipe_scaling_ratio",
  "rp_blueprint_scaling",
  "rp_shadow_height_ratio",
  "rp_similarity_scaling",
  "rp_weighted_ratio_balancing",
  "rp_multi_equation_ratio",
  "rp_ratio_graph_deduction",
  "rp_circular_ratio_dependency",
  "rp_hidden_total_trap",
  "rp_fractional_distribution_chain",
  "rp_variable_power_variation",
  "rp_workforce_inverse_variation",
  "rp_speed_distance_inverse",
  "rp_inventory_allocation",
  "rp_liquid_replacement_ratio",
];

export const RATIO_PROPORTION_TODO_FAMILY_IDS = {
  expansion: [],
  advanced: [],
} as const;

type LocalizedUnit = {
  en: string;
  hi: string;
  pa: string;
};

const SHARE_CONTEXTS: readonly Array<{
  unit: RatioProportionAnswerUnit;
  noun: LocalizedUnit;
  totalLabel: LocalizedUnit;
  labels: readonly [LocalizedUnit, LocalizedUnit] | readonly [LocalizedUnit, LocalizedUnit, LocalizedUnit];
}> = [
  {
    unit: "rupees",
    noun: { en: "sum", hi: "राशि", pa: "ਰਕਮ" },
    totalLabel: { en: "total sum", hi: "कुल राशि", pa: "ਕੁੱਲ ਰਕਮ" },
    labels: [
      { en: "A", hi: "A", pa: "A" },
      { en: "B", hi: "B", pa: "B" },
      { en: "C", hi: "C", pa: "C" },
    ],
  },
  {
    unit: "students",
    noun: { en: "students", hi: "विद्यार्थी", pa: "ਵਿਦਿਆਰਥੀ" },
    totalLabel: { en: "total students", hi: "कुल विद्यार्थी", pa: "ਕੁੱਲ ਵਿਦਿਆਰਥੀ" },
    labels: [
      { en: "boys", hi: "लड़के", pa: "ਮੁੰਡੇ" },
      { en: "girls", hi: "लड़कियाँ", pa: "ਕੁੜੀਆਂ" },
    ],
  },
  {
    unit: "marks",
    noun: { en: "marks", hi: "अंक", pa: "ਅੰਕ" },
    totalLabel: { en: "total marks", hi: "कुल अंक", pa: "ਕੁੱਲ ਅੰਕ" },
    labels: [
      { en: "Maths", hi: "गणित", pa: "ਗਣਿਤ" },
      { en: "Science", hi: "विज्ञान", pa: "ਵਿਗਿਆਨ" },
      { en: "English", hi: "अंग्रेज़ी", pa: "ਅੰਗਰੇਜ਼ੀ" },
    ],
  },
  {
    unit: "seats",
    noun: { en: "seats", hi: "सीटें", pa: "ਸੀਟਾਂ" },
    totalLabel: { en: "total seats", hi: "कुल सीटें", pa: "ਕੁੱਲ ਸੀਟਾਂ" },
    labels: [
      { en: "Group A", hi: "समूह A", pa: "ਸਮੂਹ A" },
      { en: "Group B", hi: "समूह B", pa: "ਸਮੂਹ B" },
    ],
  },
  {
    unit: "rupees",
    noun: { en: "salary fund", hi: "वेतन राशि", pa: "ਤਨਖਾਹ ਰਕਮ" },
    totalLabel: { en: "total salary fund", hi: "कुल वेतन राशि", pa: "ਕੁੱਲ ਤਨਖਾਹ ਰਕਮ" },
    labels: [
      { en: "A", hi: "A", pa: "A" },
      { en: "B", hi: "B", pa: "B" },
    ],
  },
  {
    unit: "items",
    noun: { en: "stock units", hi: "स्टॉक इकाइयाँ", pa: "ਸਟਾਕ ਇਕਾਈਆਂ" },
    totalLabel: { en: "total stock", hi: "कुल स्टॉक", pa: "ਕੁੱਲ ਸਟਾਕ" },
    labels: [
      { en: "Shop A", hi: "दुकान A", pa: "ਦੁਕਾਨ A" },
      { en: "Shop B", hi: "दुकान B", pa: "ਦੁਕਾਨ B" },
    ],
  },
  {
    unit: "items",
    noun: { en: "votes", hi: "मत", pa: "ਵੋਟਾਂ" },
    totalLabel: { en: "total votes", hi: "कुल मत", pa: "ਕੁੱਲ ਵੋਟਾਂ" },
    labels: [
      { en: "Candidate A", hi: "उम्मीदवार A", pa: "ਉਮੀਦਵਾਰ A" },
      { en: "Candidate B", hi: "उम्मीदवार B", pa: "ਉਮੀਦਵਾਰ B" },
      { en: "Candidate C", hi: "उम्मीदवार C", pa: "ਉਮੀਦਵਾਰ C" },
    ],
  },
  {
    unit: "items",
    noun: { en: "inventory items", hi: "भंडार की वस्तुएँ", pa: "ਭੰਡਾਰ ਦੀਆਂ ਵਸਤਾਂ" },
    totalLabel: { en: "total inventory", hi: "कुल भंडार", pa: "ਕੁੱਲ ਭੰਡਾਰ" },
    labels: [
      { en: "Section A", hi: "खंड A", pa: "ਭਾਗ A" },
      { en: "Section B", hi: "खंड B", pa: "ਭਾਗ B" },
      { en: "Section C", hi: "खंड C", pa: "ਭਾਗ C" },
    ],
  },
];

function hashText(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pick<T>(items: readonly T[], seed: string) {
  return items[hashText(seed) % items.length]!;
}

function gcd(left: number, right: number): number {
  const a = Math.abs(Math.trunc(left));
  const b = Math.abs(Math.trunc(right));
  return b === 0 ? a || 1 : gcd(b, a % b);
}

function lcm(left: number, right: number) {
  return Math.abs(left * right) / gcd(left, right);
}

function simplifyPair(left: number, right: number): [number, number] {
  const divisor = gcd(left, right);
  return [left / divisor, right / divisor];
}

function simplifyTriple(a: number, b: number, c: number): [number, number, number] {
  const divisor = gcd(gcd(a, b), c);
  return [a / divisor, b / divisor, c / divisor];
}

function ratioText(parts: readonly number[]) {
  return parts.join(":");
}

function clean(value: number) {
  if (!Number.isFinite(value)) return "0";
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/u, "");
}

function money(value: number) {
  return `₹${clean(value)}`;
}

function displayMath(expression: string) {
  return `\\[\n${expression}\n\\]`;
}

function inlineMath(expression: string) {
  return `\\(${expression}\\)`;
}

function pluralYear(value: number, language: "en" | "hi" | "pa") {
  if (language === "hi") return `${clean(value)} वर्ष`;
  if (language === "pa") return `${clean(value)} ਸਾਲ`;
  return `${clean(value)} ${value === 1 ? "year" : "years"}`;
}

function pluralMonth(value: number, language: "en" | "hi" | "pa") {
  if (language === "hi") return `${clean(value)} महीने`;
  if (language === "pa") return `${clean(value)} ਮਹੀਨੇ`;
  return `${clean(value)} ${value === 1 ? "month" : "months"}`;
}

function pluralDay(value: number, language: "en" | "hi" | "pa") {
  if (language === "hi") return `${clean(value)} दिन`;
  if (language === "pa") return `${clean(value)} ਦਿਨ`;
  return `${clean(value)} ${value === 1 ? "day" : "days"}`;
}

function pluralHour(value: number, language: "en" | "hi" | "pa") {
  if (language === "hi") return `${clean(value)} घंटे`;
  if (language === "pa") return `${clean(value)} ਘੰਟੇ`;
  return `${clean(value)} ${value === 1 ? "hour" : "hours"}`;
}

function answerText(value: number | string, unit: RatioProportionAnswerUnit, language: "en" | "hi" | "pa" = "en") {
  if (typeof value === "string") return value;
  if (unit === "rupees") return money(value);
  if (unit === "years") return pluralYear(value, language);
  if (unit === "days") return pluralDay(value, language);
  if (unit === "hours") return pluralHour(value, language);
  if (unit === "cm") return `${clean(value)} cm`;
  if (unit === "km") return `${clean(value)} km`;
  if (unit === "m") return `${clean(value)} m`;
  if (unit === "percent") return `${clean(value)}%`;
  return clean(value);
}

function joinLabels(values: readonly string[], conjunction: string) {
  if (values.length <= 1) return values[0] ?? "";
  if (values.length === 2) return `${values[0]} ${conjunction} ${values[1]}`;
  return `${values.slice(0, -1).join(", ")} ${conjunction} ${values[values.length - 1]}`;
}

function localizedOptions(
  options: readonly string[],
  answerKind: RatioProportionAnswerKind,
  unit: RatioProportionAnswerUnit,
) {
  if (!["years", "days", "hours"].includes(answerKind)) {
    return { en: [...options], hi: [...options], pa: [...options] };
  }
  const values = options.map((option) => Number(option.match(/-?\d+(?:\.\d+)?/u)?.[0] ?? option));
  const localize = (value: number, language: "en" | "hi" | "pa") => {
    if (unit === "days") return pluralDay(value, language);
    if (unit === "hours") return pluralHour(value, language);
    return pluralYear(value, language);
  };
  return {
    en: options.map(String),
    hi: values.map((value) => localize(value, "hi")),
    pa: values.map((value) => localize(value, "pa")),
  };
}

function shuffleOptions(seed: string, correct: string, distractors: readonly string[]) {
  const unique = [correct, ...distractors].filter(
    (item, index, all) => item && all.indexOf(item) === index,
  );
  const filler = [...unique];
  while (filler.length < 4) {
    filler.push(`${correct} `);
  }
  const options = filler
    .slice(0, 4)
    .sort((left, right) => hashText(`${seed}:option:${left}`) - hashText(`${seed}:option:${right}`));
  return {
    options,
    correct: options.indexOf(correct),
  };
}

function numericDistractors(answer: number, unit: RatioProportionAnswerUnit, traps: readonly number[], seed: string) {
  const deltas = unit === "years"
    ? [
        answer + pick([1, 2, 3, 4, 5, 6, 8, 10], `${seed}:delta1`),
        answer - pick([1, 2, 3, 4, 5, 6, 8, 10], `${seed}:delta2`),
        Math.round(answer * 1.1),
        Math.round(answer * 0.9),
        answer + 2,
        answer - 2,
      ]
    : [
        answer + pick([1, 2, 3, 5, 10, 20, 50, 100], `${seed}:delta1`),
        Math.max(1, answer - pick([1, 2, 3, 5, 10, 20, 50, 100], `${seed}:delta2`)),
        Math.round(answer * 1.25),
        Math.round(answer * 0.75),
      ];
  return [...traps, ...deltas]
    .filter((value) => Number.isFinite(value) && value > 0 && value !== answer)
    .filter((value) => unit !== "years" || value <= 100)
    .map((value) => answerText(value, unit))
    .filter((item, index, all) => all.indexOf(item) === index)
    .slice(0, 3);
}

function ratioDistractors(correct: string, ratios: readonly (readonly number[])[]) {
  return ratios
    .filter((parts) => parts.every((part) => Number.isFinite(part) && part > 0))
    .map((parts) => ratioText(parts))
    .filter((item, index, all) => item !== correct && all.indexOf(item) === index)
    .slice(0, 3);
}

function buildExplanation(
  steps: readonly RatioProportionExplanationStep[],
  finalAnswer: RatioProportionLocalizedText,
): RatioProportionLocalizedText {
  const build = (language: "en" | "hi" | "pa") => [
    ...steps.flatMap((step) => [
      step.text[language],
      step.math ? displayMath(step.math) : "",
    ].filter(Boolean)),
    language === "hi"
      ? `उत्तर: ${finalAnswer.hi}`
      : language === "pa"
        ? `ਉੱਤਰ: ${finalAnswer.pa}`
        : `Answer: ${finalAnswer.en}`,
  ].join("\n\n");
  return {
    en: build("en"),
    hi: build("hi"),
    pa: build("pa"),
  };
}

function realismFor(family: RatioProportionFamilyId, complexity: CanonicalRatioProportionProblem["complexity"], seed: string) {
  const base =
    complexity === "easy" ? 74 :
      complexity === "medium" ? 82 :
        complexity === "hard" ? 88 : 92;
  const spread = (hashText(`${seed}:realism:${family}`) % 5) - 2;
  const shellCap = /direct_sharing|sum_based|missing_term|ratio_to_fraction|fraction_to_ratio|equivalent_ratio|ratio_to_percentage|percentage_to_ratio/u.test(family) ? 78 : 95;
  return Math.min(shellCap, Math.max(68, base + spread));
}

function difficultyReason(family: RatioProportionFamilyId) {
  if (/direct_sharing|sum_based|missing_term|ratio_to_fraction|fraction_to_ratio|equivalent_ratio|ratio_to_percentage|percentage_to_ratio/u.test(family)) {
    return "direct ratio/proportion formula";
  }
  if (/increase|decrease|age|partnership_profit|partnership_basic|partnership_time|variation_basic|map_scale|side_area|product_based|partial_value|reverse_ratio|population|voter|marks|recipe|blueprint|shadow|similarity/u.test(family)) {
    return "standard exam transformation with one proportional relation";
  }
  if (/multi_equation|graph|circular|hidden_total|fractional_distribution|variable_power|workforce|speed_distance|inventory|liquid_replacement/u.test(family)) {
    return "advanced PYQ+ proportional reasoning with hidden base or chained constraints";
  }
  return "multi-step proportional equation or trap-based structure";
}

function complexityFor(family: RatioProportionFamilyId): CanonicalRatioProportionProblem["complexity"] {
  if (/direct_sharing|sum_based|missing_term|ratio_to_fraction|fraction_to_ratio|equivalent_ratio|ratio_to_percentage|percentage_to_ratio/u.test(family)) {
    return "easy";
  }
  if (/transfer|exchange|restoration|joint_variation|combined_direct_inverse|chain_ratio|partial_exit|weighted_ratio|volume/u.test(family)) {
    return "hard";
  }
  if (/multi_equation|graph|circular|hidden_total|fractional_distribution|variable_power|workforce|speed_distance|inventory|liquid_replacement/u.test(family)) {
    return "advanced";
  }
  return "medium";
}

function stemSkeleton(value: string) {
  return value
    .replace(/₹?\d+(?:\.\d+)?/gu, "#")
    .replace(/\b[A-C]\b/gu, "X")
    .replace(/\s+/gu, " ")
    .trim();
}

function numericSignature(variables: Record<string, number | string>) {
  return Object.entries(variables)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}:${value}`)
    .join("|");
}

function finalizeProblem(input: {
  seed: string;
  runId: string;
  family: RatioProportionFamilyId;
  difficulty?: Lowercase<"Easy" | "Medium" | "Hard">;
  variables: Record<string, number | string>;
  stemData?: Record<string, number | string>;
  stem: RatioProportionLocalizedText;
  answer: number | string;
  answerKind: RatioProportionAnswerKind;
  answerUnit: RatioProportionAnswerUnit;
  steps: RatioProportionExplanationStep[];
  distractors: string[];
  traps: string[];
}) {
  const complexity = complexityFor(input.family);
  const difficulty =
    complexity === "easy" ? "easy" :
      complexity === "hard" || complexity === "advanced" ? "hard" :
        "medium";
  const answer = answerText(input.answer, input.answerUnit);
  const shuffled = shuffleOptions(input.seed, answer, input.distractors);
  const options = localizedOptions(shuffled.options, input.answerKind, input.answerUnit);
  const localizedFinalAnswer = {
    en: answer,
    hi: answerText(input.answer, input.answerUnit, "hi"),
    pa: answerText(input.answer, input.answerUnit, "pa"),
  };
  const explanation = buildExplanation(input.steps, localizedFinalAnswer);
  const realismScore = realismFor(input.family, complexity, input.seed);
  const auditMeta = {
    seed: input.seed,
    runId: input.runId,
    motifId: input.family,
    topologyId: input.family,
    stemSkeleton: stemSkeleton(input.stem.en),
    numericSignature: numericSignature(input.variables),
    solverAnswer: answer,
    explanationFinalAnswer: answer,
    difficultyReason: difficultyReason(input.family),
    realismScore,
    trapTypes: [...input.traps],
  };
  return {
    id: `${input.family}:${input.seed}`,
    topic: "ratio-proportion",
    motifId: input.family,
    family: input.family,
    topologyId: input.family,
    subtype: input.family,
    category: "ratio_proportion",
    variables: input.variables,
    stemData: input.stemData ?? input.variables,
    answer: input.answer,
    answerText: answer,
    answerKind: input.answerKind,
    answerUnit: input.answerUnit,
    options: shuffled.options,
    correct: shuffled.correct,
    difficulty,
    complexity,
    topology: {
      family: "ratio_proportion",
      variant: input.family,
    },
    traps: [...input.traps],
    distractors: shuffled.options.filter((option) => option !== answer),
    explanationSteps: [...input.steps],
    localizationData: {
      stem: input.stem,
      explanation,
      options,
    },
    auditMeta,
  } satisfies CanonicalRatioProportionProblem;
}

function step(key: string, en: string, hi: string, pa: string, math?: string): RatioProportionExplanationStep {
  return {
    key,
    text: { en, hi, pa },
    math,
  };
}

function phrase<T extends string>(seed: string, values: readonly T[]) {
  return pick(values, `${seed}:phrase`);
}

const directSharing: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const context = pick(SHARE_CONTEXTS, `${seed}:context`);
  const useThree = context.labels.length === 3 && hashText(`${seed}:three`) % 2 === 0;
  const ratios = useThree
    ? pick([[2, 3, 4], [3, 4, 5], [4, 5, 6], [5, 7, 8]], `${seed}:ratio3`)
    : pick([[2, 3], [3, 5], [4, 7], [5, 6], [7, 9]], `${seed}:ratio2`);
  const labels = context.labels.slice(0, ratios.length);
  const k = pick([30, 40, 50, 60, 75, 80, 100, 120, 150], `${seed}:k`);
  const total = ratios.reduce((sum, item) => sum + item, 0) * k;
  const askedIndex = hashText(`${seed}:asked`) % ratios.length;
  const label = labels[askedIndex]!;
  const answer = ratios[askedIndex]! * k;
  const ratio = ratioText(ratios);
  const totalText = context.unit === "rupees" ? money(total) : clean(total);
  const labelListEn = joinLabels(labels.map((item) => item.en), "and");
  const labelListHi = joinLabels(labels.map((item) => item.hi), "और");
  const labelListPa = joinLabels(labels.map((item) => item.pa), "ਅਤੇ");
  const enStem = context.unit === "rupees"
    ? phrase(seed, [
        `${totalText} is divided among ${labelListEn} in the ratio ${inlineMath(ratio)}. Find ${label.en}'s share.`,
        `The shares of ${labelListEn} are in the ratio ${inlineMath(ratio)}, and the total amount is ${totalText}. Find ${label.en}'s share.`,
        `A total amount of ${totalText} is allotted to ${labelListEn} in the ratio ${inlineMath(ratio)}. Find the share of ${label.en}.`,
        `${labelListEn} share ${totalText} in the ratio ${inlineMath(ratio)}. Find how much ${label.en} gets.`,
      ])
    : phrase(seed, [
        `The ${context.noun.en} are in the ratio ${inlineMath(ratio)}, and the ${context.totalLabel.en} is ${totalText}. Find ${label.en}'s share.`,
        `A total of ${totalText} ${context.noun.en} is divided among ${labelListEn} in the ratio ${inlineMath(ratio)}. Find ${label.en}'s share.`,
        `Out of ${totalText} ${context.noun.en}, the shares of ${labelListEn} are in the ratio ${inlineMath(ratio)}. Find the share of ${label.en}.`,
        `${labelListEn} have shares in the ratio ${inlineMath(ratio)}. If the ${context.totalLabel.en} is ${totalText}, find ${label.en}'s share.`,
      ]);
  const stem = {
    en: enStem,
    hi: `${context.totalLabel.hi} ${totalText} है। ${labelListHi} का अनुपात ${inlineMath(ratio)} है। ${label.hi} का हिस्सा ज्ञात करें।`,
    pa: `${context.totalLabel.pa} ${totalText} ਹੈ। ${labelListPa} ਦਾ ਅਨੁਪਾਤ ${inlineMath(ratio)} ਹੈ। ${label.pa} ਦਾ ਹਿੱਸਾ ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("ratio", "Write the given ratio.", "दिया गया अनुपात लिखें।", "ਦਿੱਤਾ ਅਨੁਪਾਤ ਲਿਖੋ।", `${labels.map((item, index) => `${item.en}=${ratios[index]}k`).join(",\\quad ")}`),
    step("equation", `Use the ${context.totalLabel.en}.`, `${context.totalLabel.hi} का उपयोग करें।`, `${context.totalLabel.pa} ਦੀ ਵਰਤੋਂ ਕਰੋ।`, `${ratios.join("k+")}k=${total}`.replace(/\+k/gu, "+")),
    step("k", "Solve for the common multiplier.", "सामान्य गुणक ज्ञात करें।", "ਸਾਂਝਾ ਗੁਣਕ ਪਤਾ ਕਰੋ।", `k=\\frac{${total}}{${ratios.reduce((sum, item) => sum + item, 0)}}=${k}`),
    step("answer", `Compute ${label.en}'s share.`, `${label.hi} का हिस्सा निकालें।`, `${label.pa} ਦਾ ਹਿੱਸਾ ਕੱਢੋ।`, `${label.en}=${ratios[askedIndex]}k=${ratios[askedIndex]}\\times ${k}=${answer}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { parts: ratio, total, askedPart: askedIndex + 1, k },
    stem,
    answer,
    answerKind: context.unit === "rupees" ? "amount" : "number",
    answerUnit: context.unit,
    steps,
    distractors: numericDistractors(answer, context.unit, [k, total / ratios.length, ratios[(askedIndex + 1) % ratios.length]! * k], seed),
    traps: ["gives k instead of share", "uses equal division", "selects the wrong ratio part"],
  });
};

const sumBasedRatioRecovery: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const [a, b] = pick([[2, 5], [3, 4], [4, 7], [5, 8], [7, 9]], `${seed}:ratio`);
  const k = pick([8, 10, 12, 15, 18, 20, 25, 30], `${seed}:k`);
  const total = (a + b) * k;
  const askGirls = hashText(`${seed}:ask`) % 2 === 0;
  const answer = (askGirls ? b : a) * k;
  const label = askGirls ? "girls" : "boys";
  const enStem = phrase(seed, [
    `The ratio of boys to girls is ${inlineMath(`${a}:${b}`)}. The total number of students is ${total}. Find the number of ${label}.`,
    `In a class, boys and girls are in the ratio ${inlineMath(`${a}:${b}`)}. There are ${total} students in all. Find the number of ${label}.`,
    `Boys and girls in a class are in the ratio ${inlineMath(`${a}:${b}`)}. If the class has ${total} students, find the number of ${label}.`,
    `A class has ${total} students. The ratio of boys to girls is ${inlineMath(`${a}:${b}`)}. Find the number of ${label}.`,
    `In a class of ${total} students, the boys-to-girls ratio is ${inlineMath(`${a}:${b}`)}. Find the number of ${label}.`,
    `The class strength is ${total}, and boys and girls are in the ratio ${inlineMath(`${a}:${b}`)}. Find the number of ${label}.`,
  ]);
  const stem = {
    en: enStem,
    hi: `लड़कों और लड़कियों का अनुपात ${inlineMath(`${a}:${b}`)} है। कुल विद्यार्थी ${total} हैं। ${askGirls ? "लड़कियों" : "लड़कों"} की संख्या ज्ञात करें।`,
    pa: `ਮੁੰਡਿਆਂ ਅਤੇ ਕੁੜੀਆਂ ਦਾ ਅਨੁਪਾਤ ${inlineMath(`${a}:${b}`)} ਹੈ। ਕੁੱਲ ਵਿਦਿਆਰਥੀ ${total} ਹਨ। ${askGirls ? "ਕੁੜੀਆਂ" : "ਮੁੰਡਿਆਂ"} ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("ratio", "Let boys and girls be proportional to the ratio.", "लड़कों और लड़कियों को अनुपात के अनुसार मानें।", "ਮੁੰਡਿਆਂ ਅਤੇ ਕੁੜੀਆਂ ਨੂੰ ਅਨੁਪਾਤ ਅਨੁਸਾਰ ਮੰਨੋ।", `B=${a}k,\\quad G=${b}k`),
    step("equation", "Use the total students.", "कुल विद्यार्थियों का उपयोग करें।", "ਕੁੱਲ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਵਰਤੋਂ ਕਰੋ।", `${a}k+${b}k=${total}`),
    step("k", "Solve the equation.", "समीकरण हल करें।", "ਸਮੀਕਰਨ ਹੱਲ ਕਰੋ।", `${a + b}k=${total},\\quad k=${k}`),
    step("answer", `Find the number of ${label}.`, `${askGirls ? "लड़कियों" : "लड़कों"} की संख्या निकालें।`, `${askGirls ? "ਕੁੜੀਆਂ" : "ਮੁੰਡਿਆਂ"} ਦੀ ਗਿਣਤੀ ਕੱਢੋ।`, `${askGirls ? "G" : "B"}=${askGirls ? b : a}k=${answer}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { a, b, total, k, askedPart: askGirls ? "girls" : "boys" },
    stem,
    answer,
    answerKind: "number",
    answerUnit: "students",
    steps,
    distractors: numericDistractors(answer, "students", [k, total - answer, Math.abs(b - a) * k], seed),
    traps: ["uses difference instead of sum", "returns k", "reverses boys and girls"],
  });
};

const differenceBasedRatioRecovery: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const [a, b] = pick([[3, 5], [4, 7], [5, 9], [7, 11], [8, 13]], `${seed}:ratio`);
  const k = pick([100, 150, 200, 250, 300, 400, 500], `${seed}:k`);
  const diff = (b - a) * k;
  const askTotal = hashText(`${seed}:ask`) % 3 === 0;
  const answer = askTotal ? (a + b) * k : a * k;
  const enStem = phrase(seed, [
    `A's salary and B's salary are in the ratio ${inlineMath(`${a}:${b}`)}. B earns ${money(diff)} more than A. Find ${askTotal ? "their total salary" : "A's salary"}.`,
    `The salaries of A and B are in the ratio ${inlineMath(`${a}:${b}`)}. The difference between their salaries is ${money(diff)}. Find ${askTotal ? "their total salary" : "A's salary"}.`,
    `B earns ${money(diff)} more than A, and their salaries are in the ratio ${inlineMath(`${a}:${b}`)}. Find ${askTotal ? "their total salary" : "A's salary"}.`,
    `The salary ratio of A to B is ${inlineMath(`${a}:${b}`)}. B's salary exceeds A's by ${money(diff)}. Find ${askTotal ? "their total salary" : "A's salary"}.`,
    `A and B receive salaries in the ratio ${inlineMath(`${a}:${b}`)}. The difference is ${money(diff)}. Find ${askTotal ? "their total salary" : "A's salary"}.`,
    `B's salary is ${money(diff)} more than A's salary. If their salary ratio is ${inlineMath(`${a}:${b}`)}, find ${askTotal ? "their total salary" : "A's salary"}.`,
  ]);
  const stem = {
    en: enStem,
    hi: `A और B के वेतन का अनुपात ${inlineMath(`${a}:${b}`)} है। B, A से ${money(diff)} अधिक कमाता है। ${askTotal ? "दोनों का कुल वेतन" : "A का वेतन"} ज्ञात करें।`,
    pa: `A ਅਤੇ B ਦੀ ਤਨਖਾਹ ਦਾ ਅਨੁਪਾਤ ${inlineMath(`${a}:${b}`)} ਹੈ। B, A ਨਾਲੋਂ ${money(diff)} ਵੱਧ ਕਮਾਂਦਾ ਹੈ। ${askTotal ? "ਦੋਹਾਂ ਦੀ ਕੁੱਲ ਤਨਖਾਹ" : "A ਦੀ ਤਨਖਾਹ"} ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("ratio", "Let the salaries be in ratio form.", "वेतन को अनुपात के रूप में मानें।", "ਤਨਖਾਹਾਂ ਨੂੰ ਅਨੁਪਾਤ ਦੇ ਰੂਪ ਵਿੱਚ ਮੰਨੋ।", `A=${a}k,\\quad B=${b}k`),
    step("difference", "Use the salary difference.", "वेतन के अंतर का उपयोग करें।", "ਤਨਖਾਹ ਦੇ ਅੰਤਰ ਦੀ ਵਰਤੋਂ ਕਰੋ।", `${b}k-${a}k=${diff}`),
    step("k", "Solve for the multiplier.", "गुणक ज्ञात करें।", "ਗੁਣਕ ਪਤਾ ਕਰੋ।", `${b - a}k=${diff},\\quad k=${k}`),
    step("answer", "Compute the required value.", "आवश्यक मान निकालें।", "ਲੋੜੀਂਦਾ ਮੁੱਲ ਕੱਢੋ।", `${askTotal ? "A+B" : "A"}=${askTotal ? `${a + b}k` : `${a}k`}=${answer}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { a, b, difference: diff, k, askedTotal: askTotal ? 1 : 0 },
    stem,
    answer,
    answerKind: "amount",
    answerUnit: "rupees",
    steps,
    distractors: numericDistractors(answer, "rupees", [b * k, diff, k], seed),
    traps: ["uses sum instead of difference", "returns k", "chooses the other salary"],
  });
};

const missingTermProportion: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const [a, b] = pick([[2, 7], [3, 5], [4, 7], [5, 8], [6, 11], [7, 9], [8, 13], [9, 16]], `${seed}:ratio`);
  const multiplier = pick([3, 4, 5, 6, 7, 8, 9, 11, 12, 15], `${seed}:m`);
  const c = a * multiplier;
  const x = b * multiplier;
  const stem = {
    en: `If ${inlineMath(`${a}:${b} = ${c}:x`)}, find ${inlineMath("x")}.`,
    hi: `यदि ${inlineMath(`${a}:${b} = ${c}:x`)} है, तो ${inlineMath("x")} ज्ञात करें।`,
    pa: `ਜੇ ${inlineMath(`${a}:${b} = ${c}:x`)} ਹੈ, ਤਾਂ ${inlineMath("x")} ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("proportion", "Write the proportion as fractions.", "अनुपात को भिन्न के रूप में लिखें।", "ਅਨੁਪਾਤ ਨੂੰ ਭਿੰਨ ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।", `\\frac{${a}}{${b}}=\\frac{${c}}{x}`),
    step("cross", "Cross-multiply.", "क्रॉस-गुणा करें।", "ਕਰਾਸ-ਗੁਣਾ ਕਰੋ।", `${a}x=${b}\\times ${c}`),
    step("answer", "Solve for the missing term.", "लुप्त पद ज्ञात करें।", "ਗੁੰਮ ਪਦ ਪਤਾ ਕਰੋ।", `x=\\frac{${b}\\times ${c}}{${a}}=${x}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { a, b, c, x },
    stem,
    answer: x,
    answerKind: "number",
    answerUnit: "none",
    steps,
    distractors: numericDistractors(x, "none", [a * multiplier, Math.round((a * c) / b), b + c], seed),
    traps: ["cross-multiplies in the wrong direction", "adds terms", "uses adjacent product"],
  });
};

const ratioToFraction: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const [a, b] = pick([[2, 3], [3, 5], [4, 7], [5, 8], [7, 11], [3, 7], [5, 9], [6, 13], [8, 15], [9, 14], [11, 16], [7, 12], [10, 17], [12, 19], [13, 21], [14, 23], [15, 22], [16, 25]], `${seed}:ratio`);
  const askFirst = hashText(`${seed}:ask`) % 2 === 0;
  const numerator = askFirst ? a : b;
  const denominator = a + b;
  const divisor = gcd(numerator, denominator);
  const fraction = `${numerator / divisor}/${denominator / divisor}`;
  const stem = {
    en: `If ${inlineMath(`A:B=${a}:${b}`)}, what fraction of the total is ${askFirst ? "A" : "B"}?`,
    hi: `यदि ${inlineMath(`A:B=${a}:${b}`)} है, तो कुल का कितना भाग ${askFirst ? "A" : "B"} है?`,
    pa: `ਜੇ ${inlineMath(`A:B=${a}:${b}`)} ਹੈ, ਤਾਂ ਕੁੱਲ ਦਾ ਕਿੰਨਾ ਭਾਗ ${askFirst ? "A" : "B"} ਹੈ?`,
  };
  const steps = [
    step("parts", "Add the ratio parts to get the total parts.", "कुल भाग पाने के लिए अनुपात के भाग जोड़ें।", "ਕੁੱਲ ਭਾਗਾਂ ਲਈ ਅਨੁਪਾਤ ਦੇ ਭਾਗ ਜੋੜੋ।", `${a}+${b}=${denominator}`),
    step("fraction", "Write the required part over total parts.", "आवश्यक भाग को कुल भागों पर लिखें।", "ਲੋੜੀਂਦੇ ਭਾਗ ਨੂੰ ਕੁੱਲ ਭਾਗਾਂ ਉੱਤੇ ਲਿਖੋ।", `${askFirst ? "A" : "B"}=\\frac{${numerator}}{${denominator}}=${fraction}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { a, b, numerator, denominator },
    stem,
    answer: fraction,
    answerKind: "fraction",
    answerUnit: "fraction",
    steps,
    distractors: [`${askFirst ? b : a}/${denominator}`, `${numerator}/${Math.abs(b - a) || a}`, `${denominator}/${numerator}`, `${numerator}/${denominator + 1}`, `${Math.max(1, numerator - 1)}/${denominator}`]
      .filter((item, index, all) => item !== fraction && all.indexOf(item) === index)
      .slice(0, 3),
    traps: ["uses the other part", "uses difference as denominator", "inverts the fraction"],
  });
};

const fractionToRatio: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const [m, n] = pick([[2, 5], [3, 8], [4, 9], [5, 12], [7, 15], [3, 10], [5, 11], [7, 16], [8, 17], [9, 20], [11, 24], [13, 30], [4, 11], [5, 14], [6, 17], [7, 18], [8, 19], [9, 22], [10, 23], [11, 26], [12, 29], [14, 31], [15, 34], [16, 35], [17, 38], [18, 41]], `${seed}:fraction`);
  const [left, right] = simplifyPair(m, n - m);
  const correct = `${left}:${right}`;
  const stem = {
    en: `A is ${inlineMath(`\\frac{${m}}{${n}}`)} of the total. Find the ratio ${inlineMath("A:B")}.`,
    hi: `A, कुल का ${inlineMath(`\\frac{${m}}{${n}}`)} है। अनुपात ${inlineMath("A:B")} ज्ञात करें।`,
    pa: `A, ਕੁੱਲ ਦਾ ${inlineMath(`\\frac{${m}}{${n}}`)} ਹੈ। ਅਨੁਪਾਤ ${inlineMath("A:B")} ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("parts", "Use total parts from the fraction.", "भिन्न से कुल भाग लें।", "ਭਿੰਨ ਤੋਂ ਕੁੱਲ ਭਾਗ ਲਓ।", `A=${m},\\quad A+B=${n}`),
    step("remaining", "Find B's parts.", "B के भाग ज्ञात करें।", "B ਦੇ ਭਾਗ ਪਤਾ ਕਰੋ।", `B=${n}-${m}=${n - m}`),
    step("ratio", "Write the ratio.", "अनुपात लिखें।", "ਅਨੁਪਾਤ ਲਿਖੋ।", `A:B=${m}:${n - m}=${correct}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { m, n, left, right },
    stem,
    answer: correct,
    answerKind: "ratio",
    answerUnit: "ratio",
    steps,
    distractors: ratioDistractors(correct, [[m, n], [n - m, m], [n, m], [left + 1, right]]),
    traps: ["uses total as second part", "reverses the ratio", "uses complement incorrectly"],
  });
};

const ratioAfterIncrease: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const [a, b] = pick([[3, 4], [4, 5], [5, 7], [7, 8], [8, 9]], `${seed}:ratio`);
  const p = pick([10, 20, 25, 50], `${seed}:p`);
  const q = pick([10, 20, 25], `${seed}:q`);
  const [left, right] = simplifyPair(a * (100 + p), b * (100 + q));
  const correct = `${left}:${right}`;
  const enStem = phrase(seed, [
    `The incomes of A and B are in the ratio ${inlineMath(`${a}:${b}`)}. A's income increases by ${p}% and B's income increases by ${q}%. Find the new ratio.`,
    `A and B have incomes in the ratio ${inlineMath(`${a}:${b}`)}. After increases of ${p}% and ${q}% respectively, find the new ratio.`,
    `Initially, A's income and B's income are in the ratio ${inlineMath(`${a}:${b}`)}. They increase by ${p}% and ${q}% respectively. Find the new ratio.`,
    `A's income and B's income are in the ratio ${inlineMath(`${a}:${b}`)}. They rise by ${p}% and ${q}% respectively. Find the new ratio.`,
    `Two incomes are in the ratio ${inlineMath(`${a}:${b}`)}. After increases of ${p}% and ${q}%, find their new ratio.`,
    `The original income ratio of A and B is ${inlineMath(`${a}:${b}`)}. A's income rises by ${p}% and B's by ${q}%. Find the changed ratio.`,
  ]);
  const stem = {
    en: enStem,
    hi: `A और B की आय का अनुपात ${inlineMath(`${a}:${b}`)} है। A की आय ${p}% और B की आय ${q}% बढ़ती है। नया अनुपात ज्ञात करें।`,
    pa: `A ਅਤੇ B ਦੀ ਆਮਦਨ ਦਾ ਅਨੁਪਾਤ ${inlineMath(`${a}:${b}`)} ਹੈ। A ਦੀ ਆਮਦਨ ${p}% ਅਤੇ B ਦੀ ਆਮਦਨ ${q}% ਵਧਦੀ ਹੈ। ਨਵਾਂ ਅਨੁਪਾਤ ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("initial", "Let the original incomes be ratio parts.", "मूल आय को अनुपात के भाग मानें।", "ਮੂਲ ਆਮਦਨ ਨੂੰ ਅਨੁਪਾਤ ਦੇ ਭਾਗ ਮੰਨੋ।", `A=${a},\\quad B=${b}`),
    step("new", "Apply the percentage increases.", "प्रतिशत वृद्धि लगाएँ।", "ਪ੍ਰਤੀਸ਼ਤ ਵਾਧੇ ਲਗਾਓ।", `A':B'=${a}\\left(1+\\frac{${p}}{100}\\right):${b}\\left(1+\\frac{${q}}{100}\\right)`),
    step("ratio", "Simplify the new ratio.", "नया अनुपात सरल करें।", "ਨਵਾਂ ਅਨੁਪਾਤ ਸਰਲ ਕਰੋ।", `A':B'=${a * (100 + p)}:${b * (100 + q)}=${correct}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { a, b, p, q, left, right },
    stem,
    answer: correct,
    answerKind: "ratio",
    answerUnit: "ratio",
    steps,
    distractors: ratioDistractors(correct, [[a, b], [a * (100 + q), b * (100 + p)], [a + p, b + q], [right, left]]),
    traps: ["keeps the original ratio", "swaps the percentage changes", "adds percentages to ratio parts"],
  });
};

const ratioAfterDecrease: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const [a, b] = pick([[5, 6], [6, 7], [7, 9], [8, 11], [9, 13]], `${seed}:ratio`);
  const p = pick([10, 20, 25], `${seed}:p`);
  const q = pick([10, 20, 25, 50], `${seed}:q`);
  const [left, right] = simplifyPair(a * (100 - p), b * (100 - q));
  const correct = `${left}:${right}`;
  const enStem = phrase(seed, [
    `The quantities of two mixtures are in the ratio ${inlineMath(`${a}:${b}`)}. The first decreases by ${p}% and the second decreases by ${q}%. Find the new ratio.`,
    `Two quantities are in the ratio ${inlineMath(`${a}:${b}`)}. They decrease by ${p}% and ${q}% respectively. Find the new ratio.`,
    `Initially two mixtures are in the ratio ${inlineMath(`${a}:${b}`)}. After decreases of ${p}% and ${q}% respectively, find the new ratio.`,
    `Two mixture quantities have ratio ${inlineMath(`${a}:${b}`)}. The first falls by ${p}% and the second by ${q}%. Find the new ratio.`,
    `The original ratio of two quantities is ${inlineMath(`${a}:${b}`)}. After reductions of ${p}% and ${q}%, find the changed ratio.`,
    `In two containers, the quantities are in the ratio ${inlineMath(`${a}:${b}`)}. They reduce by ${p}% and ${q}% respectively. Find the new ratio.`,
  ]);
  const stem = {
    en: enStem,
    hi: `दो मिश्रणों की मात्राओं का अनुपात ${inlineMath(`${a}:${b}`)} है। पहली मात्रा ${p}% और दूसरी मात्रा ${q}% घटती है। नया अनुपात ज्ञात करें।`,
    pa: `ਦੋ ਮਿਸ਼ਰਣਾਂ ਦੀਆਂ ਮਾਤਰਾਂ ਦਾ ਅਨੁਪਾਤ ${inlineMath(`${a}:${b}`)} ਹੈ। ਪਹਿਲੀ ਮਾਤਰਾ ${p}% ਅਤੇ ਦੂਜੀ ਮਾਤਰਾ ${q}% ਘਟਦੀ ਹੈ। ਨਵਾਂ ਅਨੁਪਾਤ ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("initial", "Let the original quantities be ratio parts.", "मूल मात्राओं को अनुपात के भाग मानें।", "ਮੂਲ ਮਾਤਰਾਂ ਨੂੰ ਅਨੁਪਾਤ ਦੇ ਭਾਗ ਮੰਨੋ।", `A=${a},\\quad B=${b}`),
    step("new", "Apply the decreases.", "घटाव लगाएँ।", "ਘਟਾਓ ਲਗਾਓ।", `A':B'=${a}\\left(1-\\frac{${p}}{100}\\right):${b}\\left(1-\\frac{${q}}{100}\\right)`),
    step("ratio", "Simplify the ratio.", "अनुपात सरल करें।", "ਅਨੁਪਾਤ ਸਰਲ ਕਰੋ।", `A':B'=${a * (100 - p)}:${b * (100 - q)}=${correct}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { a, b, p, q, left, right },
    stem,
    answer: correct,
    answerKind: "ratio",
    answerUnit: "ratio",
    steps,
    distractors: ratioDistractors(correct, [
      [a, b],
      [a * (100 - q), b * (100 - p)],
      [a * (100 + p), b * (100 + q)],
      [a * (100 - p), b * 100],
      [a * 100, b * (100 - q)],
      [right, left],
    ]),
    traps: ["keeps original ratio", "swaps decreases", "subtracts from ratio parts directly"],
  });
};

const transferScenarios = [
  { a: 5, b: 3, k: 1000, transfer: 200 },
  { a: 7, b: 5, k: 600, transfer: 300 },
  { a: 9, b: 4, k: 400, transfer: 400 },
  { a: 11, b: 7, k: 300, transfer: 600 },
] as const;

const ratioAfterTransfer: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const baseScenario = pick(transferScenarios, `${seed}:scenario`);
  const scale = pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], `${seed}:scale`);
  const scenario = {
    ...baseScenario,
    k: baseScenario.k * scale,
    transfer: baseScenario.transfer * scale,
  };
  const initialA = scenario.a * scenario.k;
  const initialB = scenario.b * scenario.k;
  const final = simplifyPair(initialA - scenario.transfer, initialB + scenario.transfer);
  const [c, d] = final;
  const coefficient = d * scenario.a - c * scenario.b;
  const rhs = scenario.transfer * (c + d);
  const enStem = phrase(seed, [
    `A and B initially have money in the ratio ${inlineMath(`${scenario.a}:${scenario.b}`)}. A gives ${money(scenario.transfer)} to B, and the ratio becomes ${inlineMath(`${c}:${d}`)}. Find A's original amount.`,
    `A's money and B's money are in the ratio ${inlineMath(`${scenario.a}:${scenario.b}`)}. After A transfers ${money(scenario.transfer)} to B, the ratio is ${inlineMath(`${c}:${d}`)}. Find A's original amount.`,
    `The amounts with A and B are in the ratio ${inlineMath(`${scenario.a}:${scenario.b}`)}. When A gives ${money(scenario.transfer)} to B, the ratio becomes ${inlineMath(`${c}:${d}`)}. Find A's original amount.`,
    `A and B have amounts in the ratio ${inlineMath(`${scenario.a}:${scenario.b}`)}. After ${money(scenario.transfer)} is given by A to B, the ratio becomes ${inlineMath(`${c}:${d}`)}. Find A's original amount.`,
  ]);
  const stem = {
    en: enStem,
    hi: `A और B के पास धन का अनुपात ${inlineMath(`${scenario.a}:${scenario.b}`)} है। A द्वारा B को ${money(scenario.transfer)} देने के बाद अनुपात ${inlineMath(`${c}:${d}`)} हो जाता है। A की मूल राशि ज्ञात करें।`,
    pa: `A ਅਤੇ B ਕੋਲ ਪੈਸੇ ਦਾ ਅਨੁਪਾਤ ${inlineMath(`${scenario.a}:${scenario.b}`)} ਹੈ। A ਵੱਲੋਂ B ਨੂੰ ${money(scenario.transfer)} ਦੇਣ ਤੋਂ ਬਾਅਦ ਅਨੁਪਾਤ ${inlineMath(`${c}:${d}`)} ਹੋ ਜਾਂਦਾ ਹੈ। A ਦੀ ਮੂਲ ਰਕਮ ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("initial", "Let the original amounts be ratio parts.", "मूल राशियों को अनुपात के भाग मानें।", "ਮੂਲ ਰਕਮਾਂ ਨੂੰ ਅਨੁਪਾਤ ਦੇ ਭਾਗ ਮੰਨੋ।", `A=${scenario.a}k,\\quad B=${scenario.b}k`),
    step("transfer", "Form the equation after transfer.", "हस्तांतरण के बाद समीकरण बनाएँ।", "ਤਬਾਦਲੇ ਤੋਂ ਬਾਅਦ ਸਮੀਕਰਨ ਬਣਾਓ।", `\\frac{${scenario.a}k-${scenario.transfer}}{${scenario.b}k+${scenario.transfer}}=\\frac{${c}}{${d}}`),
    step("cross", "Cross-multiply and solve.", "क्रॉस-गुणा करके हल करें।", "ਕਰਾਸ-ਗੁਣਾ ਕਰਕੇ ਹੱਲ ਕਰੋ।", `${d}(${scenario.a}k-${scenario.transfer})=${c}(${scenario.b}k+${scenario.transfer})`),
    step("k", "Find the common multiplier.", "सामान्य गुणक ज्ञात करें।", "ਸਾਂਝਾ ਗੁਣਕ ਪਤਾ ਕਰੋ।", `${coefficient}k=${rhs},\\quad k=${scenario.k}`),
    step("answer", "Compute A's original amount.", "A की मूल राशि निकालें।", "A ਦੀ ਮੂਲ ਰਕਮ ਕੱਢੋ।", `A=${scenario.a}k=${scenario.a}\\times ${scenario.k}=${initialA}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { a: scenario.a, b: scenario.b, k: scenario.k, transfer: scenario.transfer, finalA: c, finalB: d },
    stem,
    answer: initialA,
    answerKind: "amount",
    answerUnit: "rupees",
    steps,
    distractors: numericDistractors(initialA, "rupees", [initialB, initialA - scenario.transfer, initialA + scenario.transfer], seed),
    traps: ["moves transfer in the wrong direction", "finds final amount instead of original", "uses final ratio as original amount"],
  });
};

const ageFutureRatio: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenarios = [
    { a: 3, b: 5, k: 8, years: 4 },
    { a: 4, b: 5, k: 9, years: 6 },
    { a: 5, b: 7, k: 7, years: 7 },
    { a: 2, b: 3, k: 15, years: 10 },
    { a: 5, b: 6, k: 8, years: 8 },
    { a: 7, b: 9, k: 6, years: 6 },
    { a: 3, b: 4, k: 12, years: 8 },
    { a: 4, b: 7, k: 7, years: 7 },
    { a: 5, b: 8, k: 6, years: 6 },
    { a: 7, b: 10, k: 5, years: 5 },
    { a: 6, b: 7, k: 8, years: 4 },
    { a: 3, b: 7, k: 8, years: 8 },
  ] as const;
  const { a, b, k, years } = pick(scenarios, `${seed}:scenario`);
  const [c, d] = simplifyPair(a * k + years, b * k + years);
  const answer = a * k;
  const enStem = phrase(seed, [
    `The present ages of A and B are in the ratio ${inlineMath(`${a}:${b}`)}. After ${pluralYear(years, "en")}, the ratio will be ${inlineMath(`${c}:${d}`)}. Find A's present age.`,
    `A and B have present ages in the ratio ${inlineMath(`${a}:${b}`)}. Their age ratio after ${pluralYear(years, "en")} will be ${inlineMath(`${c}:${d}`)}. Find A's present age.`,
    `At present, A's age and B's age are in the ratio ${inlineMath(`${a}:${b}`)}. After ${pluralYear(years, "en")}, they will be in the ratio ${inlineMath(`${c}:${d}`)}. Find A's present age.`,
    `A's age and B's age are currently in the ratio ${inlineMath(`${a}:${b}`)}. After ${pluralYear(years, "en")}, their ratio becomes ${inlineMath(`${c}:${d}`)}. Find A's present age.`,
    `At present, the age ratio of A to B is ${inlineMath(`${a}:${b}`)}. It becomes ${inlineMath(`${c}:${d}`)} after ${pluralYear(years, "en")}. Find A's present age.`,
    `The current age ratio of A and B is ${inlineMath(`${a}:${b}`)}. In ${pluralYear(years, "en")}, it will be ${inlineMath(`${c}:${d}`)}. Find A's present age.`,
  ]);
  const stem = {
    en: enStem,
    hi: `A और B की वर्तमान आयु का अनुपात ${inlineMath(`${a}:${b}`)} है। ${pluralYear(years, "hi")} बाद अनुपात ${inlineMath(`${c}:${d}`)} होगा। A की वर्तमान आयु ज्ञात करें।`,
    pa: `A ਅਤੇ B ਦੀ ਮੌਜੂਦਾ ਉਮਰ ਦਾ ਅਨੁਪਾਤ ${inlineMath(`${a}:${b}`)} ਹੈ। ${pluralYear(years, "pa")} ਬਾਅਦ ਅਨੁਪਾਤ ${inlineMath(`${c}:${d}`)} ਹੋਵੇਗਾ। A ਦੀ ਮੌਜੂਦਾ ਉਮਰ ਪਤਾ ਕਰੋ।`,
  };
  const lhsCoeff = d * a - c * b;
  const rhs = years * (c - d);
  const steps = [
    step("present", "Let present ages be ratio parts.", "वर्तमान आयु को अनुपात के भाग मानें।", "ਮੌਜੂਦਾ ਉਮਰ ਨੂੰ ਅਨੁਪਾਤ ਦੇ ਭਾਗ ਮੰਨੋ।", `A=${a}k,\\quad B=${b}k`),
    step("future", "Use the future-age ratio.", "भविष्य की आयु का अनुपात लगाएँ।", "ਭਵਿੱਖ ਦੀ ਉਮਰ ਦਾ ਅਨੁਪਾਤ ਲਗਾਓ।", `\\frac{${a}k+${years}}{${b}k+${years}}=\\frac{${c}}{${d}}`),
    step("k", "Solve for the multiplier.", "गुणक ज्ञात करें।", "ਗੁਣਕ ਪਤਾ ਕਰੋ।", `${lhsCoeff}k=${rhs},\\quad k=${k}`),
    step("answer", "Find A's present age.", "A की वर्तमान आयु निकालें।", "A ਦੀ ਮੌਜੂਦਾ ਉਮਰ ਕੱਢੋ।", `A=${a}k=${answer}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { a, b, k, years, finalA: c, finalB: d, timeDirection: 1 },
    stem,
    answer,
    answerKind: "years",
    answerUnit: "years",
    steps,
    distractors: numericDistractors(answer, "years", [b * k, answer + years, k], seed),
    traps: ["uses future age as answer", "returns the common multiplier", "uses B's age"],
  });
};

const agePastRatio: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenarios = [
    { a: 3, b: 4, k: 10, years: 6 },
    { a: 4, b: 5, k: 12, years: 8 },
    { a: 5, b: 7, k: 9, years: 10 },
    { a: 7, b: 10, k: 6, years: 5 },
    { a: 2, b: 3, k: 15, years: 10 },
    { a: 5, b: 6, k: 8, years: 4 },
    { a: 7, b: 9, k: 7, years: 7 },
    { a: 3, b: 5, k: 9, years: 6 },
    { a: 4, b: 7, k: 8, years: 8 },
    { a: 6, b: 11, k: 5, years: 5 },
  ] as const;
  const { a, b, k, years } = pick(scenarios, `${seed}:scenario`);
  const [c, d] = simplifyPair(a * k - years, b * k - years);
  const answer = b * k;
  const lhsCoeff = d * a - c * b;
  const rhs = years * (d - c);
  const enStem = phrase(seed, [
    `The present ages of A and B are in the ratio ${inlineMath(`${a}:${b}`)}. ${pluralYear(years, "en")} ago, the ratio was ${inlineMath(`${c}:${d}`)}. Find B's present age.`,
    `A and B have present ages in the ratio ${inlineMath(`${a}:${b}`)}. ${pluralYear(years, "en")} ago, their age ratio was ${inlineMath(`${c}:${d}`)}. Find B's present age.`,
    `At present, A's age and B's age are in the ratio ${inlineMath(`${a}:${b}`)}. Earlier by ${pluralYear(years, "en")}, the ratio was ${inlineMath(`${c}:${d}`)}. Find B's present age.`,
    `A's age and B's age are currently in the ratio ${inlineMath(`${a}:${b}`)}. ${pluralYear(years, "en")} ago, their ratio was ${inlineMath(`${c}:${d}`)}. Find B's present age.`,
    `The current age ratio of A and B is ${inlineMath(`${a}:${b}`)}. It was ${inlineMath(`${c}:${d}`)} ${pluralYear(years, "en")} ago. Find B's present age.`,
    `At present, the age ratio of A to B is ${inlineMath(`${a}:${b}`)}. ${pluralYear(years, "en")} earlier, it was ${inlineMath(`${c}:${d}`)}. Find B's present age.`,
  ]);
  const stem = {
    en: enStem,
    hi: `A और B की वर्तमान आयु का अनुपात ${inlineMath(`${a}:${b}`)} है। ${pluralYear(years, "hi")} पहले अनुपात ${inlineMath(`${c}:${d}`)} था। B की वर्तमान आयु ज्ञात करें।`,
    pa: `A ਅਤੇ B ਦੀ ਮੌਜੂਦਾ ਉਮਰ ਦਾ ਅਨੁਪਾਤ ${inlineMath(`${a}:${b}`)} ਹੈ। ${pluralYear(years, "pa")} ਪਹਿਲਾਂ ਅਨੁਪਾਤ ${inlineMath(`${c}:${d}`)} ਸੀ। B ਦੀ ਮੌਜੂਦਾ ਉਮਰ ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("present", "Let present ages be ratio parts.", "वर्तमान आयु को अनुपात के भाग मानें।", "ਮੌਜੂਦਾ ਉਮਰ ਨੂੰ ਅਨੁਪਾਤ ਦੇ ਭਾਗ ਮੰਨੋ।", `A=${a}k,\\quad B=${b}k`),
    step("past", "Use the past-age ratio.", "पूर्व आयु का अनुपात लगाएँ।", "ਪਿਛਲੀ ਉਮਰ ਦਾ ਅਨੁਪਾਤ ਲਗਾਓ।", `\\frac{${a}k-${years}}{${b}k-${years}}=\\frac{${c}}{${d}}`),
    step("k", "Solve for the multiplier.", "गुणक ज्ञात करें।", "ਗੁਣਕ ਪਤਾ ਕਰੋ।", `${lhsCoeff}k=${rhs},\\quad k=${k}`),
    step("answer", "Find B's present age.", "B की वर्तमान आयु निकालें।", "B ਦੀ ਮੌਜੂਦਾ ਉਮਰ ਕੱਢੋ।", `B=${b}k=${answer}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { a, b, k, years, pastA: c, pastB: d, timeDirection: -1 },
    stem,
    answer,
    answerKind: "years",
    answerUnit: "years",
    steps,
    distractors: numericDistractors(answer, "years", [a * k, answer - years, k], seed),
    traps: ["uses past age as answer", "returns the common multiplier", "uses A's age"],
  });
};

const partnershipBasic: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const [a, b] = pick([[2, 3], [3, 5], [4, 7], [5, 8], [7, 9]], `${seed}:ratio`);
  const k = pick([500, 600, 800, 1000, 1200], `${seed}:capital`);
  const profitK = pick([600, 700, 800, 900, 1000], `${seed}:profit`);
  const totalProfit = (a + b) * profitK;
  const answer = a * profitK;
  const enStem = phrase(seed, [
    `A and B invest in the ratio ${inlineMath(`${a}:${b}`)} for the same time. Their total profit is ${money(totalProfit)}. Find A's share of profit.`,
    `Two partners, A and B, invest in the ratio ${inlineMath(`${a}:${b}`)} for equal time. The total profit is ${money(totalProfit)}. Find A's share.`,
    `In a partnership, A's capital and B's capital are in the ratio ${inlineMath(`${a}:${b}`)}. The profit is ${money(totalProfit)}. Find A's share.`,
    `For the same duration, A and B invest in the ratio ${inlineMath(`${a}:${b}`)}. If the total profit is ${money(totalProfit)}, find A's share.`,
    `A and B run a business with investments in the ratio ${inlineMath(`${a}:${b}`)}. The total profit is ${money(totalProfit)}. Find A's profit share.`,
  ]);
  const stem = {
    en: enStem,
    hi: `A और B समान समय के लिए ${inlineMath(`${a}:${b}`)} के अनुपात में निवेश करते हैं। कुल लाभ ${money(totalProfit)} है। A का लाभांश ज्ञात करें।`,
    pa: `A ਅਤੇ B ਇੱਕੋ ਸਮੇਂ ਲਈ ${inlineMath(`${a}:${b}`)} ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਨਿਵੇਸ਼ ਕਰਦੇ ਹਨ। ਕੁੱਲ ਲਾਭ ${money(totalProfit)} ਹੈ। A ਦਾ ਲਾਭ-ਹਿੱਸਾ ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("profitRatio", "For equal time, profit is divided in the investment ratio.", "समान समय में लाभ निवेश के अनुपात में बँटता है।", "ਇੱਕੋ ਸਮੇਂ ਵਿੱਚ ਲਾਭ ਨਿਵੇਸ਼ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡਿਆ ਜਾਂਦਾ ਹੈ।", `A:B=${a}:${b}`),
    step("k", "Use the total profit.", "कुल लाभ का उपयोग करें।", "ਕੁੱਲ ਲਾਭ ਦੀ ਵਰਤੋਂ ਕਰੋ।", `${a}k+${b}k=${totalProfit},\\quad k=${profitK}`),
    step("answer", "Find A's profit share.", "A का लाभांश निकालें।", "A ਦਾ ਲਾਭ-ਹਿੱਸਾ ਕੱਢੋ।", `A=${a}k=${answer}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { a, b, capitalA: a * k, capitalB: b * k, totalProfit, k: profitK },
    stem,
    answer,
    answerKind: "amount",
    answerUnit: "rupees",
    steps,
    distractors: numericDistractors(answer, "rupees", [b * profitK, profitK, totalProfit / 2], seed),
    traps: ["divides profit equally", "gives B's share", "returns k"],
  });
};

const partnershipTimeVariation: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenarios = [
    { capA: 6000, capB: 8000, monthsA: 12, monthsB: 9 },
    { capA: 5000, capB: 7000, monthsA: 10, monthsB: 8 },
    { capA: 9000, capB: 6000, monthsA: 8, monthsB: 12 },
    { capA: 4000, capB: 10000, monthsA: 12, monthsB: 6 },
    { capA: 7500, capB: 4500, monthsA: 8, monthsB: 10 },
    { capA: 12000, capB: 9000, monthsA: 7, monthsB: 11 },
  ] as const;
  const s = pick(scenarios, `${seed}:scenario`);
  const profitUnit = pick([400, 500, 600, 700, 800, 900, 1000, 1200], `${seed}:profit`);
  const [left, right] = simplifyPair(s.capA * s.monthsA, s.capB * s.monthsB);
  const totalProfit = (left + right) * profitUnit;
  const answer = left * profitUnit;
  const stem = {
    en: `A invests ${money(s.capA)} for ${pluralMonth(s.monthsA, "en")} and B invests ${money(s.capB)} for ${pluralMonth(s.monthsB, "en")}. If the total profit is ${money(totalProfit)}, find A's share.`,
    hi: `A ${pluralMonth(s.monthsA, "hi")} के लिए ${money(s.capA)} और B ${pluralMonth(s.monthsB, "hi")} के लिए ${money(s.capB)} निवेश करता है। यदि कुल लाभ ${money(totalProfit)} है, तो A का हिस्सा ज्ञात करें।`,
    pa: `A ${pluralMonth(s.monthsA, "pa")} ਲਈ ${money(s.capA)} ਅਤੇ B ${pluralMonth(s.monthsB, "pa")} ਲਈ ${money(s.capB)} ਨਿਵੇਸ਼ ਕਰਦਾ ਹੈ। ਜੇ ਕੁੱਲ ਲਾਭ ${money(totalProfit)} ਹੈ, ਤਾਂ A ਦਾ ਹਿੱਸਾ ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("effective", "Profit ratio is capital multiplied by time.", "लाभ अनुपात पूँजी × समय होता है।", "ਲਾਭ ਅਨੁਪਾਤ ਪੂੰਜੀ × ਸਮਾਂ ਹੁੰਦਾ ਹੈ।", `A:B=${s.capA}\\times ${s.monthsA}:${s.capB}\\times ${s.monthsB}`),
    step("ratio", "Simplify the effective capital ratio.", "प्रभावी पूँजी अनुपात सरल करें।", "ਪ੍ਰਭਾਵੀ ਪੂੰਜੀ ਅਨੁਪਾਤ ਸਰਲ ਕਰੋ।", `A:B=${s.capA * s.monthsA}:${s.capB * s.monthsB}=${left}:${right}`),
    step("share", "Use the total profit.", "कुल लाभ का उपयोग करें।", "ਕੁੱਲ ਲਾਭ ਦੀ ਵਰਤੋਂ ਕਰੋ।", `${left}k+${right}k=${totalProfit},\\quad k=${profitUnit}`),
    step("answer", "Find A's share.", "A का हिस्सा निकालें।", "A ਦਾ ਹਿੱਸਾ ਕੱਢੋ।", `A=${left}k=${answer}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { capA: s.capA, capB: s.capB, monthsA: s.monthsA, monthsB: s.monthsB, ratioA: left, ratioB: right, totalProfit },
    stem,
    answer,
    answerKind: "amount",
    answerUnit: "rupees",
    steps,
    distractors: numericDistractors(answer, "rupees", [right * profitUnit, Math.round(totalProfit / 2), s.capA], seed),
    traps: ["ignores time", "divides profit equally", "uses capital as answer"],
  });
};

const directVariationBasic: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenarios = [
    { x1: 18, y1: 6, y2: 10 },
    { x1: 45, y1: 9, y2: 14 },
    { x1: 56, y1: 8, y2: 11 },
    { x1: 72, y1: 12, y2: 15 },
  ] as const;
  const baseScenario = pick(scenarios, `${seed}:scenario`);
  const xScale = pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], `${seed}:scale`);
  const s = { ...baseScenario, x1: baseScenario.x1 * xScale };
  const answer = (s.x1 * s.y2) / s.y1;
  const enStem = phrase(seed, [
    `If ${inlineMath("x")} varies directly as ${inlineMath("y")} and ${inlineMath(`x=${s.x1}`)} when ${inlineMath(`y=${s.y1}`)}, find ${inlineMath("x")} when ${inlineMath(`y=${s.y2}`)}.`,
    `${inlineMath("x")} is directly proportional to ${inlineMath("y")}. When ${inlineMath(`y=${s.y1}`)}, ${inlineMath(`x=${s.x1}`)}. Find ${inlineMath("x")} when ${inlineMath(`y=${s.y2}`)}.`,
    `For two directly varying quantities ${inlineMath("x")} and ${inlineMath("y")}, ${inlineMath(`x=${s.x1}`)} at ${inlineMath(`y=${s.y1}`)}. Find ${inlineMath("x")} at ${inlineMath(`y=${s.y2}`)}.`,
  ]);
  const stem = {
    en: enStem,
    hi: `यदि ${inlineMath("x")}, ${inlineMath("y")} के सीधे अनुपाती है और ${inlineMath(`y=${s.y1}`)} पर ${inlineMath(`x=${s.x1}`)} है, तो ${inlineMath(`y=${s.y2}`)} पर ${inlineMath("x")} ज्ञात करें।`,
    pa: `ਜੇ ${inlineMath("x")}, ${inlineMath("y")} ਦੇ ਸਿੱਧੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹੈ ਅਤੇ ${inlineMath(`y=${s.y1}`)} ਤੇ ${inlineMath(`x=${s.x1}`)} ਹੈ, ਤਾਂ ${inlineMath(`y=${s.y2}`)} ਤੇ ${inlineMath("x")} ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("direct", "For direct variation, the ratios are equal.", "सीधे अनुपात में अनुपात बराबर होते हैं।", "ਸਿੱਧੇ ਅਨੁਪਾਤ ਵਿੱਚ ਅਨੁਪਾਤ ਬਰਾਬਰ ਹੁੰਦੇ ਹਨ।", `\\frac{x_1}{y_1}=\\frac{x_2}{y_2}`),
    step("substitute", "Substitute the values.", "मान रखें।", "ਮੁੱਲ ਰੱਖੋ।", `\\frac{${s.x1}}{${s.y1}}=\\frac{x_2}{${s.y2}}`),
    step("answer", "Solve for the new value.", "नया मान ज्ञात करें।", "ਨਵਾਂ ਮੁੱਲ ਪਤਾ ਕਰੋ।", `x_2=\\frac{${s.x1}\\times ${s.y2}}{${s.y1}}=${answer}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { x1: s.x1, y1: s.y1, y2: s.y2, x2: answer },
    stem,
    answer,
    answerKind: "number",
    answerUnit: "none",
    steps,
    distractors: numericDistractors(answer, "none", [(s.x1 * s.y1) / s.y2, s.x1 + s.y2 - s.y1, s.x1], seed),
    traps: ["uses inverse variation", "adds the change instead of scaling", "keeps old value"],
  });
};

const inverseVariationBasic: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenarios = [
    { workers1: 12, days1: 20, workers2: 15 },
    { workers1: 16, days1: 18, workers2: 24 },
    { workers1: 18, days1: 30, workers2: 27 },
    { workers1: 20, days1: 24, workers2: 30 },
  ] as const;
  const baseScenario = pick(scenarios, `${seed}:scenario`);
  const dayScale = pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], `${seed}:scale`);
  const s = { ...baseScenario, days1: baseScenario.days1 * dayScale };
  const answer = (s.workers1 * s.days1) / s.workers2;
  const enStem = phrase(seed, [
    `${s.workers1} workers finish a work in ${s.days1} days. If the number of workers is ${s.workers2}, how many days will be required?`,
    `A work is completed by ${s.workers1} workers in ${s.days1} days. How many days will ${s.workers2} workers take?`,
    `With ${s.workers1} workers, a job takes ${s.days1} days. Find the time needed when ${s.workers2} workers do the same job.`,
  ]);
  const stem = {
    en: enStem,
    hi: `${s.workers1} मजदूर एक काम को ${s.days1} दिनों में पूरा करते हैं। यदि मजदूर ${s.workers2} हों, तो कितने दिन लगेंगे?`,
    pa: `${s.workers1} ਮਜ਼ਦੂਰ ਇੱਕ ਕੰਮ ਨੂੰ ${s.days1} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ। ਜੇ ਮਜ਼ਦੂਰ ${s.workers2} ਹੋਣ, ਤਾਂ ਕਿੰਨੇ ਦਿਨ ਲੱਗਣਗੇ?`,
  };
  const steps = [
    step("inverse", "Workers and days vary inversely.", "मजदूर और दिन व्युत्क्रमानुपाती हैं।", "ਮਜ਼ਦੂਰ ਅਤੇ ਦਿਨ ਉਲਟ ਅਨੁਪਾਤ ਵਿੱਚ ਹਨ।", `W_1D_1=W_2D_2`),
    step("substitute", "Substitute the values.", "मान रखें।", "ਮੁੱਲ ਰੱਖੋ।", `${s.workers1}\\times ${s.days1}=${s.workers2}\\times D_2`),
    step("answer", "Solve for the days.", "दिनों की संख्या निकालें।", "ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।", `D_2=\\frac{${s.workers1}\\times ${s.days1}}{${s.workers2}}=${answer}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { workers1: s.workers1, days1: s.days1, workers2: s.workers2, days2: answer },
    stem,
    answer,
    answerKind: "number",
    answerUnit: "none",
    steps,
    distractors: numericDistractors(answer, "none", [(s.days1 * s.workers2) / s.workers1, s.days1, s.workers2 - s.workers1], seed),
    traps: ["uses direct variation", "keeps old days", "uses worker difference"],
  });
};

const jointVariation: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenarios = [
    { output1: 120, machines1: 4, hours1: 5, machines2: 6, hours2: 8 },
    { output1: 180, machines1: 6, hours1: 5, machines2: 9, hours2: 7 },
    { output1: 240, machines1: 8, hours1: 6, machines2: 10, hours2: 9 },
  ] as const;
  const baseScenario = pick(scenarios, `${seed}:scenario`);
  const outputScale = pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], `${seed}:scale`);
  const s = { ...baseScenario, output1: baseScenario.output1 * outputScale };
  const answer = (s.output1 * s.machines2 * s.hours2) / (s.machines1 * s.hours1);
  const enStem = phrase(seed, [
    `Output varies jointly as the number of machines and working hours. ${s.machines1} machines working for ${s.hours1} hours produce ${s.output1} units. How many units will ${s.machines2} machines produce in ${s.hours2} hours?`,
    `Production is jointly proportional to machines and hours. ${s.machines1} machines produce ${s.output1} units in ${s.hours1} hours. Find the output of ${s.machines2} machines in ${s.hours2} hours.`,
    `The output of machines varies jointly with their number and working hours. If ${s.machines1} machines make ${s.output1} units in ${s.hours1} hours, find the output for ${s.machines2} machines in ${s.hours2} hours.`,
    `${s.machines1} machines produce ${s.output1} units in ${s.hours1} hours. Output varies jointly with machines and hours. Find the output of ${s.machines2} machines in ${s.hours2} hours.`,
    `Machine output is jointly proportional to the number of machines and hours worked. ${s.machines1} machines make ${s.output1} units in ${s.hours1} hours. Find the output for ${s.machines2} machines in ${s.hours2} hours.`,
    `For a production unit, output varies jointly as machines and working hours. If ${s.machines1} machines make ${s.output1} units in ${s.hours1} hours, find the output of ${s.machines2} machines in ${s.hours2} hours.`,
  ]);
  const stem = {
    en: enStem,
    hi: `उत्पादन मशीनों की संख्या और काम के घंटों के संयुक्त अनुपात में बदलता है। ${s.machines1} मशीनें ${s.hours1} घंटे में ${s.output1} इकाइयाँ बनाती हैं। ${s.machines2} मशीनें ${s.hours2} घंटे में कितनी इकाइयाँ बनाएँगी?`,
    pa: `ਉਤਪਾਦਨ ਮਸ਼ੀਨਾਂ ਦੀ ਗਿਣਤੀ ਅਤੇ ਕੰਮ ਦੇ ਘੰਟਿਆਂ ਦੇ ਸਾਂਝੇ ਅਨੁਪਾਤ ਵਿੱਚ ਬਦਲਦਾ ਹੈ। ${s.machines1} ਮਸ਼ੀਨਾਂ ${s.hours1} ਘੰਟਿਆਂ ਵਿੱਚ ${s.output1} ਇਕਾਈਆਂ ਬਣਾਉਂਦੀਆਂ ਹਨ। ${s.machines2} ਮਸ਼ੀਨਾਂ ${s.hours2} ਘੰਟਿਆਂ ਵਿੱਚ ਕਿੰਨੀਆਂ ਇਕਾਈਆਂ ਬਣਾਉਣਗੀਆਂ?`,
  };
  const steps = [
    step("joint", "For joint variation, output is proportional to machines and hours.", "संयुक्त अनुपात में उत्पादन मशीनों और घंटों के अनुपाती है।", "ਸਾਂਝੇ ਅਨੁਪਾਤ ਵਿੱਚ ਉਤਪਾਦਨ ਮਸ਼ੀਨਾਂ ਅਤੇ ਘੰਟਿਆਂ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹੈ।", `O=kMH`),
    step("ratio", "Use the ratio form.", "अनुपात रूप का उपयोग करें।", "ਅਨੁਪਾਤ ਰੂਪ ਦੀ ਵਰਤੋਂ ਕਰੋ।", `\\frac{O_2}{O_1}=\\frac{M_2H_2}{M_1H_1}`),
    step("answer", "Compute the new output.", "नया उत्पादन निकालें।", "ਨਵਾਂ ਉਤਪਾਦਨ ਕੱਢੋ।", `O_2=${s.output1}\\times \\frac{${s.machines2}\\times ${s.hours2}}{${s.machines1}\\times ${s.hours1}}=${answer}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { output1: s.output1, machines1: s.machines1, hours1: s.hours1, machines2: s.machines2, hours2: s.hours2, output2: answer },
    stem,
    answer,
    answerKind: "number",
    answerUnit: "items",
    steps,
    distractors: numericDistractors(answer, "items", [(s.output1 * s.machines2) / s.machines1, (s.output1 * s.hours2) / s.hours1, s.output1], seed),
    traps: ["ignores one variable", "uses direct variation with only machines", "uses direct variation with only hours"],
  });
};

const combinedDirectInverse: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenarios = [
    { x1: 30, y1: 6, z1: 4, y2: 10, z2: 5 },
    { x1: 48, y1: 8, z1: 3, y2: 12, z2: 6 },
    { x1: 72, y1: 9, z1: 5, y2: 15, z2: 6 },
  ] as const;
  const baseScenario = pick(scenarios, `${seed}:scenario`);
  const xScale = pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], `${seed}:scale`);
  const s = { ...baseScenario, x1: baseScenario.x1 * xScale };
  const answer = (s.x1 * s.y2 * s.z1) / (s.y1 * s.z2);
  const enStem = phrase(seed, [
    `${inlineMath("x")} varies directly as ${inlineMath("y")} and inversely as ${inlineMath("z")}. If ${inlineMath(`x=${s.x1}`)} when ${inlineMath(`y=${s.y1}`)} and ${inlineMath(`z=${s.z1}`)}, find ${inlineMath("x")} when ${inlineMath(`y=${s.y2}`)} and ${inlineMath(`z=${s.z2}`)}.`,
    `${inlineMath("x")} is proportional to ${inlineMath("y")} and inversely proportional to ${inlineMath("z")}. Given ${inlineMath(`x=${s.x1}`)} for ${inlineMath(`y=${s.y1}`)}, ${inlineMath(`z=${s.z1}`)}, find ${inlineMath("x")} for ${inlineMath(`y=${s.y2}`)}, ${inlineMath(`z=${s.z2}`)}.`,
    `For ${inlineMath("x\\propto \\frac{y}{z}")}, ${inlineMath(`x=${s.x1}`)} when ${inlineMath(`y=${s.y1}`)} and ${inlineMath(`z=${s.z1}`)}. Find ${inlineMath("x")} when ${inlineMath(`y=${s.y2}`)} and ${inlineMath(`z=${s.z2}`)}.`,
  ]);
  const stem = {
    en: enStem,
    hi: `${inlineMath("x")}, ${inlineMath("y")} के सीधे और ${inlineMath("z")} के व्युत्क्रमानुपाती है। यदि ${inlineMath(`y=${s.y1}`)} और ${inlineMath(`z=${s.z1}`)} पर ${inlineMath(`x=${s.x1}`)} है, तो ${inlineMath(`y=${s.y2}`)} और ${inlineMath(`z=${s.z2}`)} पर ${inlineMath("x")} ज्ञात करें।`,
    pa: `${inlineMath("x")}, ${inlineMath("y")} ਦੇ ਸਿੱਧੇ ਅਤੇ ${inlineMath("z")} ਦੇ ਉਲਟ ਅਨੁਪਾਤ ਵਿੱਚ ਹੈ। ਜੇ ${inlineMath(`y=${s.y1}`)} ਅਤੇ ${inlineMath(`z=${s.z1}`)} ਤੇ ${inlineMath(`x=${s.x1}`)} ਹੈ, ਤਾਂ ${inlineMath(`y=${s.y2}`)} ਅਤੇ ${inlineMath(`z=${s.z2}`)} ਤੇ ${inlineMath("x")} ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("rule", "Use combined direct and inverse variation.", "संयुक्त सीधे और व्युत्क्रम अनुपात का उपयोग करें।", "ਸੰਯੁਕਤ ਸਿੱਧੇ ਅਤੇ ਉਲਟ ਅਨੁਪਾਤ ਦੀ ਵਰਤੋਂ ਕਰੋ।", `x=k\\frac{y}{z}`),
    step("ratio", "Compare the two cases.", "दोनों स्थितियों की तुलना करें।", "ਦੋਹਾਂ ਹਾਲਤਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।", `\\frac{x_2}{x_1}=\\frac{y_2}{y_1}\\times \\frac{z_1}{z_2}`),
    step("answer", "Compute the new value.", "नया मान निकालें।", "ਨਵਾਂ ਮੁੱਲ ਕੱਢੋ।", `x_2=${s.x1}\\times \\frac{${s.y2}}{${s.y1}}\\times \\frac{${s.z1}}{${s.z2}}=${answer}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { x1: s.x1, y1: s.y1, z1: s.z1, y2: s.y2, z2: s.z2, x2: answer },
    stem,
    answer,
    answerKind: "number",
    answerUnit: "none",
    steps,
    distractors: numericDistractors(answer, "none", [(s.x1 * s.y2 * s.z2) / (s.y1 * s.z1), (s.x1 * s.y2) / s.y1, s.x1], seed),
    traps: ["uses z directly instead of inversely", "ignores z", "keeps old value"],
  });
};

const mapScaleRatio: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scaleKm = pick([1, 2, 3, 4, 5, 6, 8, 10], `${seed}:scale`);
  const mapDistance = pick([3, 4, 5, 6, 7, 8, 9, 11, 12, 15], `${seed}:map`);
  const actual = scaleKm * mapDistance;
  const ratioScale = scaleKm * 100000;
  const enStem = phrase(seed, [
    `The scale of a map is ${inlineMath(`1:${ratioScale}`)}, so 1 cm represents ${scaleKm} km. If a road is ${mapDistance} cm on the map, find its actual length.`,
    `A map uses the scale ${inlineMath(`1:${ratioScale}`)}. Thus 1 cm represents ${scaleKm} km. A road measures ${mapDistance} cm on the map. Find the actual length.`,
    `On a map, the scale is ${inlineMath(`1:${ratioScale}`)}. If ${mapDistance} cm on the map represents a road, find the actual distance in km.`,
    `A road is shown as ${mapDistance} cm on a map where 1 cm represents ${scaleKm} km. Find the actual road length.`,
    `In a map drawing, 1 cm represents ${scaleKm} km. A route measures ${mapDistance} cm on the map. Find the actual distance.`,
    `The map distance of a route is ${mapDistance} cm, and the scale is ${inlineMath(`1:${ratioScale}`)}. Find the actual distance in km.`,
    `A route marked ${mapDistance} cm on a map uses the scale ${inlineMath(`1:${ratioScale}`)}. Find the actual length.`,
  ]);
  const stem = {
    en: enStem,
    hi: `एक नक्शे का पैमाना ${inlineMath(`1:${ratioScale}`)} है, इसलिए 1 cm ${scaleKm} km को दर्शाता है। यदि नक्शे पर सड़क ${mapDistance} cm है, तो उसकी वास्तविक लंबाई ज्ञात करें।`,
    pa: `ਇੱਕ ਨਕਸ਼ੇ ਦਾ ਪੈਮਾਨਾ ${inlineMath(`1:${ratioScale}`)} ਹੈ, ਇਸ ਲਈ 1 cm ${scaleKm} km ਦਰਸਾਉਂਦਾ ਹੈ। ਜੇ ਨਕਸ਼ੇ ਤੇ ਸੜਕ ${mapDistance} cm ਹੈ, ਤਾਂ ਉਸਦੀ ਅਸਲ ਲੰਬਾਈ ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("scale", "Use the map scale.", "नक्शे के पैमाने का उपयोग करें।", "ਨਕਸ਼ੇ ਦੇ ਪੈਮਾਨੇ ਦੀ ਵਰਤੋਂ ਕਰੋ।", `1\\,\\mathrm{cm}=${scaleKm}\\,\\mathrm{km}`),
    step("actual", "Multiply by the map distance.", "नक्शे की दूरी से गुणा करें।", "ਨਕਸ਼ੇ ਦੀ ਦੂਰੀ ਨਾਲ ਗੁਣਾ ਕਰੋ।", `D=${mapDistance}\\times ${scaleKm}=${actual}\\,\\mathrm{km}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { scaleKm, ratioScale, mapDistance, actual },
    stem,
    answer: actual,
    answerKind: "distance",
    answerUnit: "km",
    steps,
    distractors: numericDistractors(actual, "km", [mapDistance, ratioScale / 100000, actual * 10], seed),
    traps: ["uses map distance as actual distance", "uses scale denominator directly", "wrong cm-to-km conversion"],
  });
};

const sideAreaVolumeRatio: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const [a, b] = pick([[2, 3], [3, 4], [4, 5], [5, 7], [6, 7], [3, 5], [5, 8], [7, 9], [8, 11], [9, 13], [10, 11], [11, 14]], `${seed}:ratio`);
  const volume = hashText(`${seed}:mode`) % 3 === 0;
  const power = volume ? 3 : 2;
  const [left, right] = simplifyPair(a ** power, b ** power);
  const correct = `${left}:${right}`;
  const figureWord = volume ? "solids" : "figures";
  const targetWord = volume ? "volumes" : "areas";
  const enStem = phrase(seed, [
    `The sides of two similar ${figureWord} are in the ratio ${inlineMath(`${a}:${b}`)}. Find the ratio of their ${targetWord}.`,
    `Two similar ${figureWord} have corresponding sides in the ratio ${inlineMath(`${a}:${b}`)}. Find the ratio of their ${targetWord}.`,
    `Corresponding sides of two similar ${figureWord} are in the ratio ${inlineMath(`${a}:${b}`)}. What is the ratio of their ${targetWord}?`,
    `For two similar ${figureWord}, the side ratio is ${inlineMath(`${a}:${b}`)}. Find the ${targetWord} ratio.`,
    `In two similar ${figureWord}, corresponding side lengths are in the ratio ${inlineMath(`${a}:${b}`)}. Find the ratio of their ${targetWord}.`,
  ]);
  const stem = {
    en: enStem,
    hi: `दो समान ${volume ? "घनों/ठोसों" : "आकृतियों"} की भुजाओं का अनुपात ${inlineMath(`${a}:${b}`)} है। उनके ${volume ? "आयतनों" : "क्षेत्रफलों"} का अनुपात ज्ञात करें।`,
    pa: `ਦੋ ਸਮਰੂਪ ${volume ? "ਠੋਸਾਂ" : "ਆਕ੍ਰਿਤੀਆਂ"} ਦੀਆਂ ਭੁਜਾਵਾਂ ਦਾ ਅਨੁਪਾਤ ${inlineMath(`${a}:${b}`)} ਹੈ। ਉਨ੍ਹਾਂ ਦੇ ${volume ? "ਆਇਤਨਾਂ" : "ਖੇਤਰਫਲਾਂ"} ਦਾ ਅਨੁਪਾਤ ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("side", "Start with the side ratio.", "भुजा अनुपात से शुरू करें।", "ਭੁਜਾ ਅਨੁਪਾਤ ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ।", `S_1:S_2=${a}:${b}`),
    step("power", volume ? "Volume ratio is the cube of side ratio." : "Area ratio is the square of side ratio.", volume ? "आयतन अनुपात भुजा अनुपात का घन होता है।" : "क्षेत्रफल अनुपात भुजा अनुपात का वर्ग होता है।", volume ? "ਆਇਤਨ ਅਨੁਪਾਤ ਭੁਜਾ ਅਨੁਪਾਤ ਦਾ ਘਨ ਹੁੰਦਾ ਹੈ।" : "ਖੇਤਰਫਲ ਅਨੁਪਾਤ ਭੁਜਾ ਅਨੁਪਾਤ ਦਾ ਵਰਗ ਹੁੰਦਾ ਹੈ।", `${volume ? "V_1:V_2" : "A_1:A_2"}=${a}^{${power}}:${b}^{${power}}=${correct}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { a, b, power, left, right },
    stem,
    answer: correct,
    answerKind: "ratio",
    answerUnit: "ratio",
    steps,
    distractors: ratioDistractors(correct, [[a, b], [a ** (volume ? 2 : 3), b ** (volume ? 2 : 3)], [b ** power, a ** power], [a + power, b + power]]),
    traps: ["uses side ratio", "uses wrong power", "reverses the ratio"],
  });
};

const chainRatioNetwork: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenarios = [
    { a: 2, b: 3, c: 4, d: 5 },
    { a: 3, b: 4, c: 6, d: 7 },
    { a: 5, b: 6, c: 8, d: 9 },
    { a: 4, b: 7, c: 5, d: 8 },
    { a: 5, b: 8, c: 6, d: 11 },
    { a: 7, b: 9, c: 12, d: 13 },
    { a: 3, b: 5, c: 7, d: 9 },
    { a: 8, b: 11, c: 6, d: 7 },
    { a: 9, b: 10, c: 15, d: 16 },
    { a: 11, b: 12, c: 8, d: 13 },
    { a: 4, b: 9, c: 6, d: 11 },
    { a: 6, b: 13, c: 8, d: 15 },
  ] as const;
  const s = pick(scenarios, `${seed}:scenario`);
  const common = lcm(s.b, s.c);
  const factorAB = common / s.b;
  const factorBC = common / s.c;
  const result: [number, number, number] = [s.a * factorAB, common, s.d * factorBC];
  const simplified = simplifyTriple(result[0], result[1], result[2]);
  const correct = ratioText(simplified);
  const stem = {
    en: `If ${inlineMath(`A:B=${s.a}:${s.b}`)} and ${inlineMath(`B:C=${s.c}:${s.d}`)}, find ${inlineMath("A:B:C")}.`,
    hi: `यदि ${inlineMath(`A:B=${s.a}:${s.b}`)} और ${inlineMath(`B:C=${s.c}:${s.d}`)} है, तो ${inlineMath("A:B:C")} ज्ञात करें।`,
    pa: `ਜੇ ${inlineMath(`A:B=${s.a}:${s.b}`)} ਅਤੇ ${inlineMath(`B:C=${s.c}:${s.d}`)} ਹੈ, ਤਾਂ ${inlineMath("A:B:C")} ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("common", "Make the B part common.", "B के भाग को समान करें।", "B ਦੇ ਭਾਗ ਨੂੰ ਸਾਂਝਾ ਕਰੋ।", `L=\\operatorname{lcm}(${s.b},${s.c})=${common}`),
    step("scaleAB", "Scale the first ratio.", "पहले अनुपात को बढ़ाएँ।", "ਪਹਿਲੇ ਅਨੁਪਾਤ ਨੂੰ ਸਕੇਲ ਕਰੋ।", `A:B=${s.a * factorAB}:${common}`),
    step("scaleBC", "Scale the second ratio.", "दूसरे अनुपात को बढ़ाएँ।", "ਦੂਜੇ ਅਨੁਪਾਤ ਨੂੰ ਸਕੇਲ ਕਰੋ।", `B:C=${common}:${s.d * factorBC}`),
    step("answer", "Combine the ratios.", "अनुपातों को मिलाएँ।", "ਅਨੁਪਾਤਾਂ ਨੂੰ ਜੋੜੋ।", `A:B:C=${correct}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { a: s.a, b: s.b, c: s.c, d: s.d, common, result: correct },
    stem,
    answer: correct,
    answerKind: "ratio",
    answerUnit: "ratio",
    steps,
    distractors: ratioDistractors(correct, [[s.a, s.b, s.d], [s.a * s.c, s.b * s.c, s.d * s.b], [simplified[2], simplified[1], simplified[0]], [s.a, common, s.d]]),
    traps: ["does not make B common", "multiplies all parts blindly", "reverses A and C"],
  });
};

const equivalentRatioGeneration: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const [a, b, multiplier] = pick([[2, 3, 4], [3, 5, 3], [4, 7, 5], [5, 8, 4], [7, 9, 3], [8, 11, 2]], `${seed}:scenario`);
  const correct = ratioText([a * multiplier, b * multiplier]);
  const stem = {
    en: phrase(seed, [
      `Which of the following ratios is equivalent to ${inlineMath(`${a}:${b}`)}?`,
      `Find an equivalent form of the ratio ${inlineMath(`${a}:${b}`)}.`,
      `The ratio ${inlineMath(`${a}:${b}`)} is multiplied by the same number in both terms. Which ratio can result?`,
    ]),
    hi: `${inlineMath(`${a}:${b}`)} के बराबर अनुपात ज्ञात करें।`,
    pa: `${inlineMath(`${a}:${b}`)} ਦੇ ਬਰਾਬਰ ਅਨੁਪਾਤ ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("ratio", "Multiply both terms by the same number.", "दोनों पदों को एक ही संख्या से गुणा करें।", "ਦੋਵੇਂ ਪਦਾਂ ਨੂੰ ਇੱਕੋ ਸੰਖਿਆ ਨਾਲ ਗੁਣਾ ਕਰੋ।", `${a}:${b}=(${a}\\times ${multiplier}):(${b}\\times ${multiplier})`),
    step("answer", "So the equivalent ratio is obtained.", "इसलिए बराबर अनुपात मिलता है।", "ਇਸ ਲਈ ਬਰਾਬਰ ਅਨੁਪਾਤ ਮਿਲਦਾ ਹੈ।", `${a * multiplier}:${b * multiplier}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { a, b, multiplier, result: correct },
    stem,
    answer: correct,
    answerKind: "ratio",
    answerUnit: "ratio",
    steps,
    distractors: ratioDistractors(correct, [[b * multiplier, a * multiplier], [a + multiplier, b + multiplier], [a * multiplier, b], [a, b * multiplier]]),
    traps: ["reverses the ratio", "adds instead of multiplying", "scales only one term"],
  });
};

const ratioToPercentage: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenario = pick([
    { a: 1, b: 4, mode: "total", answer: 20 },
    { a: 2, b: 3, mode: "total", answer: 40 },
    { a: 3, b: 2, mode: "total", answer: 60 },
    { a: 4, b: 5, mode: "other", answer: 80 },
    { a: 3, b: 5, mode: "other", answer: 60 },
    { a: 5, b: 4, mode: "other", answer: 125 },
  ] as const, `${seed}:scenario`);
  const target = scenario.mode === "total" ? "total" : "B";
  const stem = {
    en: phrase(seed, [
      `If ${inlineMath(`A:B=${scenario.a}:${scenario.b}`)}, what percentage is A of ${target}?`,
      `The ratio of A to B is ${inlineMath(`${scenario.a}:${scenario.b}`)}. Express A as a percentage of ${target}.`,
      `For ${inlineMath(`A:B=${scenario.a}:${scenario.b}`)}, find A as a percentage of ${target}.`,
    ]),
    hi: `यदि ${inlineMath(`A:B=${scenario.a}:${scenario.b}`)} है, तो A को ${target === "total" ? "कुल" : "B"} के प्रतिशत के रूप में ज्ञात करें।`,
    pa: `ਜੇ ${inlineMath(`A:B=${scenario.a}:${scenario.b}`)} ਹੈ, ਤਾਂ A ਨੂੰ ${target === "total" ? "ਕੁੱਲ" : "B"} ਦੇ ਪ੍ਰਤੀਸ਼ਤ ਵਜੋਂ ਪਤਾ ਕਰੋ।`,
  };
  const denominator = scenario.mode === "total" ? scenario.a + scenario.b : scenario.b;
  const steps = [
    step("fraction", "Write the required fraction first.", "पहले आवश्यक भिन्न लिखें।", "ਪਹਿਲਾਂ ਲੋੜੀਂਦੀ ਭਿੰਨ ਲਿਖੋ।", `A=${scenario.a},\\quad ${scenario.mode === "total" ? "A+B" : "B"}=${denominator}`),
    step("percent", "Convert the fraction into percentage.", "भिन्न को प्रतिशत में बदलें।", "ਭਿੰਨ ਨੂੰ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਬਦਲੋ।", `P=\\frac{${scenario.a}}{${denominator}}\\times 100=${scenario.answer}\\%`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { a: scenario.a, b: scenario.b, denominator, mode: scenario.mode, percentage: scenario.answer },
    stem,
    answer: scenario.answer,
    answerKind: "percent",
    answerUnit: "percent",
    steps,
    distractors: numericDistractors(scenario.answer, "percent", [100 - scenario.answer, Math.round((scenario.b / denominator) * 100), scenario.a + scenario.b], seed),
    traps: ["uses the other part", "uses wrong denominator", "treats ratio sum as percent"],
  });
};

const percentageToRatio: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenario = pick([
    { percent: 40, total: true, ratio: [2, 3] },
    { percent: 25, total: true, ratio: [1, 3] },
    { percent: 60, total: true, ratio: [3, 2] },
    { percent: 75, total: false, ratio: [3, 4] },
    { percent: 125, total: false, ratio: [5, 4] },
    { percent: 80, total: false, ratio: [4, 5] },
  ] as const, `${seed}:scenario`);
  const correct = ratioText(scenario.ratio);
  const stem = {
    en: phrase(seed, [
      `A is ${scenario.percent}% of ${scenario.total ? "the total of A and B" : "B"}. Find ${inlineMath("A:B")}.`,
      `If A forms ${scenario.percent}% of ${scenario.total ? "the whole" : "B"}, what is the ratio ${inlineMath("A:B")}?`,
      `A is given as ${scenario.percent}% of ${scenario.total ? "A+B" : "B"}. Express ${inlineMath("A:B")}.`,
    ]),
    hi: `A, ${scenario.total ? "A और B के कुल" : "B"} का ${scenario.percent}% है। ${inlineMath("A:B")} ज्ञात करें।`,
    pa: `A, ${scenario.total ? "A ਅਤੇ B ਦੇ ਕੁੱਲ" : "B"} ਦਾ ${scenario.percent}% ਹੈ। ${inlineMath("A:B")} ਪਤਾ ਕਰੋ।`,
  };
  const steps = scenario.total
    ? [
        step("fraction", "Convert the percentage of total into a fraction.", "कुल का प्रतिशत भिन्न में बदलें।", "ਕੁੱਲ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਭਿੰਨ ਵਿੱਚ ਬਦਲੋ।", `A=\\frac{${scenario.percent}}{100}(A+B)`),
        step("ratio", "The remaining part belongs to B.", "शेष भाग B का होगा।", "ਬਾਕੀ ਭਾਗ B ਦਾ ਹੋਵੇਗਾ।", `A:B=${scenario.percent}:${100 - scenario.percent}=${correct}`),
      ]
    : [
        step("fraction", "Write A as a fraction of B.", "A को B के भिन्न के रूप में लिखें।", "A ਨੂੰ B ਦੀ ਭਿੰਨ ਵਜੋਂ ਲਿਖੋ।", `A=\\frac{${scenario.percent}}{100}B`),
        step("ratio", "Clear the denominator to get the ratio.", "हर हटाकर अनुपात निकालें।", "ਹਰ ਹਟਾ ਕੇ ਅਨੁਪਾਤ ਕੱਢੋ।", `A:B=${scenario.percent}:100=${correct}`),
      ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { percent: scenario.percent, totalMode: scenario.total ? 1 : 0, result: correct },
    stem,
    answer: correct,
    answerKind: "ratio",
    answerUnit: "ratio",
    steps,
    distractors: ratioDistractors(correct, [[scenario.ratio[1], scenario.ratio[0]], [scenario.percent, 100], [100, scenario.percent], [scenario.percent, 100 - scenario.percent]]),
    traps: ["uses B denominator in total case", "reverses ratio", "does not simplify"],
  });
};

const productBasedRatioRecovery: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const [a, b, k] = pick([[2, 3, 20], [3, 4, 15], [4, 5, 12], [5, 7, 10], [6, 11, 8], [7, 9, 10]], `${seed}:scenario`);
  const product = a * b * k * k;
  const askA = hashText(`${seed}:ask`) % 2 === 0;
  const answer = (askA ? a : b) * k;
  const stem = {
    en: phrase(seed, [
      `Two numbers are in the ratio ${inlineMath(`${a}:${b}`)} and their product is ${product}. Find the ${askA ? "smaller" : "larger"} number.`,
      `The ratio of two quantities is ${inlineMath(`${a}:${b}`)}. Their product is ${product}. Find ${askA ? "the first quantity" : "the second quantity"}.`,
      `If ${inlineMath(`A:B=${a}:${b}`)} and ${inlineMath(`AB=${product}`)}, find ${askA ? "A" : "B"}.`,
    ]),
    hi: `दो संख्याओं का अनुपात ${inlineMath(`${a}:${b}`)} है और उनका गुणनफल ${product} है। ${askA ? "पहली संख्या" : "दूसरी संख्या"} ज्ञात करें।`,
    pa: `ਦੋ ਸੰਖਿਆਵਾਂ ਦਾ ਅਨੁਪਾਤ ${inlineMath(`${a}:${b}`)} ਹੈ ਅਤੇ ਉਨ੍ਹਾਂ ਦਾ ਗੁਣਨਫਲ ${product} ਹੈ। ${askA ? "ਪਹਿਲੀ ਸੰਖਿਆ" : "ਦੂਜੀ ਸੰਖਿਆ"} ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("let", "Let the two numbers be proportional parts.", "मान लें संख्याएँ अनुपाती भाग हैं।", "ਮੰਨ ਲਓ ਸੰਖਿਆਵਾਂ ਅਨੁਪਾਤੀ ਭਾਗ ਹਨ।", `A=${a}k,\\quad B=${b}k`),
    step("product", "Use the product condition.", "गुणनफल की शर्त लगाएँ।", "ਗੁਣਨਫਲ ਦੀ ਸ਼ਰਤ ਲਗਾਓ।", `${a}k\\times ${b}k=${product}`),
    step("k", "Solve for k.", "k का मान निकालें।", "k ਦਾ ਮੁੱਲ ਕੱਢੋ।", `${a * b}k^2=${product},\\quad k=${k}`),
    step("answer", "Find the required number.", "आवश्यक संख्या ज्ञात करें।", "ਲੋੜੀਂਦੀ ਸੰਖਿਆ ਪਤਾ ਕਰੋ।", `${askA ? "A" : "B"}=${askA ? a : b}\\times ${k}=${answer}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { a, b, k, product, askA: askA ? 1 : 0, answer },
    stem,
    answer,
    answerKind: "number",
    answerUnit: "none",
    steps,
    distractors: numericDistractors(answer, "none", [k, product / (a + b), (askA ? b : a) * k], seed),
    traps: ["gives k", "uses sum instead of product", "gives the other number"],
  });
};

const partialValueRatioRecovery: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const [a, b, k] = pick([[3, 5, 12], [4, 7, 9], [5, 8, 10], [7, 11, 6], [6, 13, 5], [8, 9, 7]], `${seed}:scenario`);
  const givenA = hashText(`${seed}:given`) % 2 === 0;
  const findTotal = hashText(`${seed}:target`) % 3 === 0;
  const given = (givenA ? a : b) * k;
  const answer = findTotal ? (a + b) * k : (givenA ? b : a) * k;
  const stem = {
    en: phrase(seed, [
      `A and B are in the ratio ${inlineMath(`${a}:${b}`)}. If ${givenA ? "A" : "B"} is ${given}, find ${findTotal ? "A+B" : givenA ? "B" : "A"}.`,
      `The ratio ${inlineMath(`A:B=${a}:${b}`)} is given. ${givenA ? "A" : "B"} equals ${given}. Find ${findTotal ? "the total" : givenA ? "B" : "A"}.`,
      `In a ratio ${inlineMath(`${a}:${b}`)}, the ${givenA ? "first" : "second"} quantity is ${given}. What is ${findTotal ? "the sum of both quantities" : "the other quantity"}?`,
    ]),
    hi: `${inlineMath(`A:B=${a}:${b}`)} है। यदि ${givenA ? "A" : "B"} = ${given}, तो ${findTotal ? "A+B" : givenA ? "B" : "A"} ज्ञात करें।`,
    pa: `${inlineMath(`A:B=${a}:${b}`)} ਹੈ। ਜੇ ${givenA ? "A" : "B"} = ${given}, ਤਾਂ ${findTotal ? "A+B" : givenA ? "B" : "A"} ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("let", "Let the common multiplier be k.", "साझा गुणक k मानें।", "ਸਾਂਝਾ ਗੁਣਕ k ਮੰਨੋ।", `A=${a}k,\\quad B=${b}k`),
    step("k", "Use the given part to find k.", "दिए गए भाग से k निकालें।", "ਦਿੱਤੇ ਭਾਗ ਤੋਂ k ਕੱਢੋ।", `${givenA ? a : b}k=${given},\\quad k=${k}`),
    step("answer", "Compute the required value.", "आवश्यक मान निकालें।", "ਲੋੜੀਂਦਾ ਮੁੱਲ ਕੱਢੋ।", `${findTotal ? "A+B" : givenA ? "B" : "A"}=${findTotal ? `${a + b}\\times ${k}` : `${givenA ? b : a}\\times ${k}`}=${answer}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { a, b, k, given, givenA: givenA ? 1 : 0, findTotal: findTotal ? 1 : 0, answer },
    stem,
    answer,
    answerKind: "number",
    answerUnit: "none",
    steps,
    distractors: numericDistractors(answer, "none", [k, given, (givenA ? a : b) * k, (a + b) * k], seed),
    traps: ["gives k", "reuses the given part", "finds total instead of part"],
  });
};

const ratioAfterExchange: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenario = pick([
    { a: 5, b: 3, k: 120, fromA: 80, fromB: 20 },
    { a: 7, b: 4, k: 90, fromA: 60, fromB: 30 },
    { a: 9, b: 5, k: 70, fromA: 50, fromB: 10 },
    { a: 4, b: 7, k: 80, fromA: 40, fromB: 70 },
    { a: 11, b: 8, k: 50, fromA: 40, fromB: 20 },
  ] as const, `${seed}:scenario`);
  const initialA = scenario.a * scenario.k;
  const initialB = scenario.b * scenario.k;
  const finalA = initialA - scenario.fromA + scenario.fromB;
  const finalB = initialB - scenario.fromB + scenario.fromA;
  const [left, right] = simplifyPair(finalA, finalB);
  const correct = ratioText([left, right]);
  const stem = {
    en: phrase(seed, [
      `A and B have money in the ratio ${inlineMath(`${scenario.a}:${scenario.b}`)}. A gives ₹${scenario.fromA} to B and B gives ₹${scenario.fromB} to A. Find the new ratio.`,
      `The amounts with A and B are in the ratio ${inlineMath(`${scenario.a}:${scenario.b}`)}. After exchanging ₹${scenario.fromA} from A to B and ₹${scenario.fromB} from B to A, find the final ratio.`,
      `A:B is ${inlineMath(`${scenario.a}:${scenario.b}`)}. A transfers ₹${scenario.fromA} to B, while B transfers ₹${scenario.fromB} to A. What is the resulting ratio?`,
    ]),
    hi: `A और B के पास राशि का अनुपात ${inlineMath(`${scenario.a}:${scenario.b}`)} है। A, B को ₹${scenario.fromA} देता है और B, A को ₹${scenario.fromB} देता है। नया अनुपात ज्ञात करें।`,
    pa: `A ਅਤੇ B ਕੋਲ ਰਕਮ ਦਾ ਅਨੁਪਾਤ ${inlineMath(`${scenario.a}:${scenario.b}`)} ਹੈ। A, B ਨੂੰ ₹${scenario.fromA} ਦਿੰਦਾ ਹੈ ਅਤੇ B, A ਨੂੰ ₹${scenario.fromB} ਦਿੰਦਾ ਹੈ। ਨਵਾਂ ਅਨੁਪਾਤ ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("initial", "Write the initial amounts.", "प्रारंभिक राशियाँ लिखें।", "ਸ਼ੁਰੂਆਤੀ ਰਕਮਾਂ ਲਿਖੋ।", `A=${scenario.a}k=${initialA},\\quad B=${scenario.b}k=${initialB}`),
    step("exchange", "Apply both transfers.", "दोनों लेन-देन लगाएँ।", "ਦੋਵੇਂ ਲੈਣ-ਦੇਣ ਲਗਾਓ।", `A'=${initialA}-${scenario.fromA}+${scenario.fromB}=${finalA},\\quad B'=${initialB}-${scenario.fromB}+${scenario.fromA}=${finalB}`),
    step("ratio", "Simplify the final ratio.", "अंतिम अनुपात सरल करें।", "ਅੰਤਿਮ ਅਨੁਪਾਤ ਸਧਾਰੋ।", `A':B'=${finalA}:${finalB}=${correct}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { ...scenario, initialA, initialB, finalA, finalB, left, right },
    stem,
    answer: correct,
    answerKind: "ratio",
    answerUnit: "ratio",
    steps,
    distractors: ratioDistractors(correct, [[scenario.a, scenario.b], [finalB, finalA], [initialA - scenario.fromA, initialB + scenario.fromA], [initialA + scenario.fromB, initialB - scenario.fromB]]),
    traps: ["ignores exchange", "uses only one transfer", "reverses final ratio"],
  });
};

const ratioRestoration: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenario = pick([
    { a: 3, b: 2, k: 200, extraA: 90 },
    { a: 5, b: 4, k: 150, extraA: 125 },
    { a: 7, b: 5, k: 100, extraA: 140 },
    { a: 4, b: 3, k: 180, extraA: 80 },
    { a: 9, b: 7, k: 80, extraA: 90 },
  ] as const, `${seed}:scenario`);
  const currentA = scenario.a * scenario.k + scenario.extraA;
  const currentB = scenario.b * scenario.k;
  const addB = (currentA * scenario.b) / scenario.a - currentB;
  const stem = {
    en: phrase(seed, [
      `A and B should be in the ratio ${inlineMath(`${scenario.a}:${scenario.b}`)}. A has ₹${currentA} and B has ₹${currentB}. How much should be added to B to restore the ratio?`,
      `The required ratio of A to B is ${inlineMath(`${scenario.a}:${scenario.b}`)}. Presently A has ₹${currentA} and B has ₹${currentB}. Find the amount to add to B.`,
      `A:B must remain ${inlineMath(`${scenario.a}:${scenario.b}`)}. If A is ₹${currentA} and B is ₹${currentB}, what addition to B restores the ratio?`,
    ]),
    hi: `A और B का आवश्यक अनुपात ${inlineMath(`${scenario.a}:${scenario.b}`)} है। अभी A के पास ₹${currentA} और B के पास ₹${currentB} हैं। अनुपात वापस लाने के लिए B में कितनी राशि जोड़नी होगी?`,
    pa: `A ਅਤੇ B ਦਾ ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ ${inlineMath(`${scenario.a}:${scenario.b}`)} ਹੈ। ਹੁਣ A ਕੋਲ ₹${currentA} ਅਤੇ B ਕੋਲ ₹${currentB} ਹਨ। ਅਨੁਪਾਤ ਵਾਪਸ ਲਿਆਉਣ ਲਈ B ਵਿੱਚ ਕਿੰਨੀ ਰਕਮ ਜੋੜਨੀ ਪਵੇਗੀ?`,
  };
  const steps = [
    step("equation", "Let the amount added to B be x.", "मान लें B में जोड़ी गई राशि x है।", "ਮੰਨ ਲਓ B ਵਿੱਚ ਜੋੜੀ ਰਕਮ x ਹੈ।", `\\frac{${currentA}}{${currentB}+x}=\\frac{${scenario.a}}{${scenario.b}}`),
    step("solve", "Cross-multiply and solve.", "क्रॉस-गुणा करके हल करें।", "ਕਰਾਸ-ਗੁਣਾ ਕਰਕੇ ਹੱਲ ਕਰੋ।", `${scenario.b}\\times ${currentA}=${scenario.a}(${currentB}+x)`),
    step("answer", "Find x.", "x का मान निकालें।", "x ਦਾ ਮੁੱਲ ਕੱਢੋ।", `x=${clean(addB)}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { ...scenario, currentA, currentB, addB },
    stem,
    answer: addB,
    answerKind: "amount",
    answerUnit: "rupees",
    steps,
    distractors: numericDistractors(addB, "rupees", [scenario.extraA, currentA - currentB, currentB / scenario.b], seed),
    traps: ["adds the original excess", "uses current difference", "gives k"],
  });
};

const reverseRatioScaling: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenario = pick([
    { a: 2, b: 3, m: 3, n: 2 },
    { a: 3, b: 5, m: 4, n: 3 },
    { a: 5, b: 7, m: 2, n: 5 },
    { a: 4, b: 9, m: 3, n: 4 },
    { a: 7, b: 8, m: 5, n: 2 },
  ] as const, `${seed}:scenario`);
  const [scaledA, scaledB] = simplifyPair(scenario.a * scenario.m, scenario.b * scenario.n);
  const correct = ratioText([scenario.a, scenario.b]);
  const stem = {
    en: phrase(seed, [
      `When the first term of a ratio is multiplied by ${scenario.m} and the second by ${scenario.n}, the ratio becomes ${inlineMath(`${scaledA}:${scaledB}`)}. Find the original ratio.`,
      `After scaling A by ${scenario.m} and B by ${scenario.n}, ${inlineMath(`A:B=${scaledA}:${scaledB}`)}. What was the original ratio?`,
      `A ratio changes to ${inlineMath(`${scaledA}:${scaledB}`)} after multiplying its terms by ${scenario.m} and ${scenario.n} respectively. Find the original ratio.`,
    ]),
    hi: `किसी अनुपात के पहले पद को ${scenario.m} और दूसरे पद को ${scenario.n} से गुणा करने पर अनुपात ${inlineMath(`${scaledA}:${scaledB}`)} हो जाता है। मूल अनुपात ज्ञात करें।`,
    pa: `ਕਿਸੇ ਅਨੁਪਾਤ ਦੇ ਪਹਿਲੇ ਪਦ ਨੂੰ ${scenario.m} ਅਤੇ ਦੂਜੇ ਪਦ ਨੂੰ ${scenario.n} ਨਾਲ ਗੁਣਾ ਕਰਨ ਤੇ ਅਨੁਪਾਤ ${inlineMath(`${scaledA}:${scaledB}`)} ਹੋ ਜਾਂਦਾ ਹੈ। ਅਸਲ ਅਨੁਪਾਤ ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("reverse", "Undo the two scale factors.", "दोनों गुणकों को उल्टा लगाएँ।", "ਦੋਵੇਂ ਗੁਣਕ ਉਲਟੇ ਲਗਾਓ।", `A:B=\\frac{${scaledA}}{${scenario.m}}:\\frac{${scaledB}}{${scenario.n}}`),
    step("answer", "Simplify the ratio.", "अनुपात सरल करें।", "ਅਨੁਪਾਤ ਸਧਾਰੋ।", `A:B=${correct}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { ...scenario, scaledA, scaledB, result: correct },
    stem,
    answer: correct,
    answerKind: "ratio",
    answerUnit: "ratio",
    steps,
    distractors: ratioDistractors(correct, [[scaledA, scaledB], [scenario.b, scenario.a], [scaledA * scenario.m, scaledB * scenario.n], [scenario.a * scenario.n, scenario.b * scenario.m]]),
    traps: ["returns scaled ratio", "reverses original ratio", "scales again"],
  });
};

const ageDifferenceConstant: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenario = pick([
    { a: 3, b: 5, k: 8 },
    { a: 4, b: 7, k: 6 },
    { a: 5, b: 9, k: 5 },
    { a: 7, b: 11, k: 4 },
    { a: 2, b: 3, k: 18 },
  ] as const, `${seed}:scenario`);
  const difference = (scenario.b - scenario.a) * scenario.k;
  const askOlder = hashText(`${seed}:ask`) % 2 === 0;
  const answer = (askOlder ? scenario.b : scenario.a) * scenario.k;
  const stem = {
    en: phrase(seed, [
      `The present ages of A and B are in the ratio ${inlineMath(`${scenario.a}:${scenario.b}`)}. Their age difference is ${difference} years. Find the age of ${askOlder ? "B" : "A"}.`,
      `A:B in age is ${inlineMath(`${scenario.a}:${scenario.b}`)} and B is ${difference} years older than A. Find ${askOlder ? "B's" : "A's"} present age.`,
      `The ratio of two present ages is ${inlineMath(`${scenario.a}:${scenario.b}`)}. The difference is ${difference} years. What is the ${askOlder ? "larger" : "smaller"} age?`,
    ]),
    hi: `A और B की वर्तमान आयु का अनुपात ${inlineMath(`${scenario.a}:${scenario.b}`)} है। आयु का अंतर ${difference} वर्ष है। ${askOlder ? "B" : "A"} की आयु ज्ञात करें।`,
    pa: `A ਅਤੇ B ਦੀ ਮੌਜੂਦਾ ਉਮਰ ਦਾ ਅਨੁਪਾਤ ${inlineMath(`${scenario.a}:${scenario.b}`)} ਹੈ। ਉਮਰ ਦਾ ਫਰਕ ${difference} ਸਾਲ ਹੈ। ${askOlder ? "B" : "A"} ਦੀ ਉਮਰ ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("let", "Let the ages be proportional parts.", "आयु को अनुपाती भाग मानें।", "ਉਮਰਾਂ ਨੂੰ ਅਨੁਪਾਤੀ ਭਾਗ ਮੰਨੋ।", `A=${scenario.a}k,\\quad B=${scenario.b}k`),
    step("difference", "Use the constant age difference.", "स्थिर आयु अंतर का उपयोग करें।", "ਸਥਿਰ ਉਮਰ ਫਰਕ ਵਰਤੋ।", `${scenario.b}k-${scenario.a}k=${difference}`),
    step("k", "Find k and the required age.", "k और आवश्यक आयु निकालें।", "k ਅਤੇ ਲੋੜੀਂਦੀ ਉਮਰ ਕੱਢੋ।", `k=${scenario.k},\\quad ${askOlder ? "B" : "A"}=${askOlder ? scenario.b : scenario.a}\\times ${scenario.k}=${answer}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { a: scenario.a, b: scenario.b, k: scenario.k, difference, askOlder: askOlder ? 1 : 0, answer },
    stem,
    answer,
    answerKind: "years",
    answerUnit: "years",
    steps,
    distractors: numericDistractors(answer, "years", [difference, scenario.k, (askOlder ? scenario.a : scenario.b) * scenario.k], seed),
    traps: ["uses difference as age", "gives k", "gives the other age"],
  });
};

const ageMultiGeneration: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenario = pick([
    { parent: 36, child: 12, years: 6, afterParent: 42, afterChild: 18 },
    { parent: 45, child: 15, years: 5, afterParent: 50, afterChild: 20 },
    { parent: 50, child: 20, years: 10, afterParent: 60, afterChild: 30 },
    { parent: 40, child: 16, years: 8, afterParent: 48, afterChild: 24 },
    { parent: 48, child: 18, years: 6, afterParent: 54, afterChild: 24 },
  ] as const, `${seed}:scenario`);
  const [a, b] = simplifyPair(scenario.parent, scenario.child);
  const [c, d] = simplifyPair(scenario.afterParent, scenario.afterChild);
  const askChild = hashText(`${seed}:ask`) % 2 === 0;
  const answer = askChild ? scenario.child : scenario.parent;
  const stem = {
    en: phrase(seed, [
      `The present ages of a parent and child are in the ratio ${inlineMath(`${a}:${b}`)}. After ${scenario.years} years, the ratio will be ${inlineMath(`${c}:${d}`)}. Find the present age of the ${askChild ? "child" : "parent"}.`,
      `A parent's age and a child's age are in the ratio ${inlineMath(`${a}:${b}`)}. In ${scenario.years} years the ratio becomes ${inlineMath(`${c}:${d}`)}. Find the ${askChild ? "child's" : "parent's"} present age.`,
      `Presently, parent:child age ratio is ${inlineMath(`${a}:${b}`)}. After ${scenario.years} years it is ${inlineMath(`${c}:${d}`)}. What is the present age of the ${askChild ? "child" : "parent"}?`,
    ]),
    hi: `माता/पिता और बच्चे की वर्तमान आयु का अनुपात ${inlineMath(`${a}:${b}`)} है। ${scenario.years} वर्ष बाद अनुपात ${inlineMath(`${c}:${d}`)} होगा। ${askChild ? "बच्चे" : "माता/पिता"} की वर्तमान आयु ज्ञात करें।`,
    pa: `ਮਾਤਾ/ਪਿਤਾ ਅਤੇ ਬੱਚੇ ਦੀ ਮੌਜੂਦਾ ਉਮਰ ਦਾ ਅਨੁਪਾਤ ${inlineMath(`${a}:${b}`)} ਹੈ। ${scenario.years} ਸਾਲ ਬਾਅਦ ਅਨੁਪਾਤ ${inlineMath(`${c}:${d}`)} ਹੋਵੇਗਾ। ${askChild ? "ਬੱਚੇ" : "ਮਾਤਾ/ਪਿਤਾ"} ਦੀ ਮੌਜੂਦਾ ਉਮਰ ਪਤਾ ਕਰੋ।`,
  };
  const k = scenario.parent / a;
  const steps = [
    step("let", "Let present ages be proportional parts.", "वर्तमान आयु अनुपाती भाग मानें।", "ਮੌਜੂਦਾ ਉਮਰਾਂ ਅਨੁਪਾਤੀ ਭਾਗ ਮੰਨੋ।", `P=${a}k,\\quad C=${b}k`),
    step("future", "Use the future ratio.", "भविष्य अनुपात का उपयोग करें।", "ਭਵਿੱਖ ਅਨੁਪਾਤ ਵਰਤੋ।", `\\frac{${a}k+${scenario.years}}{${b}k+${scenario.years}}=\\frac{${c}}{${d}}`),
    step("k", "Solve and find the required age.", "हल करके आवश्यक आयु निकालें।", "ਹੱਲ ਕਰਕੇ ਲੋੜੀਂਦੀ ਉਮਰ ਕੱਢੋ।", `k=${k},\\quad ${askChild ? "C" : "P"}=${askChild ? b : a}\\times ${k}=${answer}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { a, b, c, d, k, years: scenario.years, parent: scenario.parent, child: scenario.child, askChild: askChild ? 1 : 0, answer },
    stem,
    answer,
    answerKind: "years",
    answerUnit: "years",
    steps,
    distractors: numericDistractors(answer, "years", [scenario.years, askChild ? scenario.afterChild : scenario.afterParent, askChild ? scenario.parent : scenario.child], seed),
    traps: ["gives future age", "gives time gap", "gives the other person's age"],
  });
};

const partnershipPartialExit: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenario = pick([
    { capA: 6000, capB: 8000, monthsA: 12, monthsB: 9, profit: 9000 },
    { capA: 5000, capB: 7000, monthsA: 12, monthsB: 6, profit: 8700 },
    { capA: 9000, capB: 6000, monthsA: 8, monthsB: 12, profit: 9600 },
    { capA: 12000, capB: 9000, monthsA: 10, monthsB: 12, profit: 14000 },
    { capA: 7500, capB: 5000, monthsA: 12, monthsB: 8, profit: 11500 },
  ] as const, `${seed}:scenario`);
  const effA = scenario.capA * scenario.monthsA;
  const effB = scenario.capB * scenario.monthsB;
  const answer = (scenario.profit * effA) / (effA + effB);
  const [left, right] = simplifyPair(effA, effB);
  const stem = {
    en: phrase(seed, [
      `A invests ₹${scenario.capA} for ${scenario.monthsA} months and B invests ₹${scenario.capB} for ${scenario.monthsB} months. If the profit is ₹${scenario.profit}, find A's share.`,
      `In a partnership, A's capital is ₹${scenario.capA} for ${scenario.monthsA} months and B's capital is ₹${scenario.capB} for ${scenario.monthsB} months. Find A's share of ₹${scenario.profit}.`,
      `A and B invest for different durations: ₹${scenario.capA} for ${scenario.monthsA} months and ₹${scenario.capB} for ${scenario.monthsB} months. Divide the ₹${scenario.profit} profit and find A's share.`,
    ]),
    hi: `A ₹${scenario.capA} को ${scenario.monthsA} महीने के लिए और B ₹${scenario.capB} को ${scenario.monthsB} महीने के लिए लगाता है। कुल लाभ ₹${scenario.profit} है। A का हिस्सा ज्ञात करें।`,
    pa: `A ₹${scenario.capA} ਨੂੰ ${scenario.monthsA} ਮਹੀਨੇ ਲਈ ਅਤੇ B ₹${scenario.capB} ਨੂੰ ${scenario.monthsB} ਮਹੀਨੇ ਲਈ ਲਗਾਉਂਦਾ ਹੈ। ਕੁੱਲ ਲਾਭ ₹${scenario.profit} ਹੈ। A ਦਾ ਹਿੱਸਾ ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("effective", "Profit is divided in the ratio of effective capitals.", "लाभ प्रभावी पूँजी के अनुपात में बँटता है।", "ਲਾਭ ਪ੍ਰਭਾਵੀ ਪੂੰਜੀ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡਿਆ ਜਾਂਦਾ ਹੈ।", `A:B=${scenario.capA}\\times ${scenario.monthsA}:${scenario.capB}\\times ${scenario.monthsB}=${left}:${right}`),
    step("share", "Find A's share.", "A का हिस्सा निकालें।", "A ਦਾ ਹਿੱਸਾ ਕੱਢੋ।", `A=\\frac{${left}}{${left}+${right}}\\times ${scenario.profit}=${clean(answer)}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { ...scenario, effA, effB, ratioA: left, ratioB: right, answer },
    stem,
    answer,
    answerKind: "amount",
    answerUnit: "rupees",
    steps,
    distractors: numericDistractors(answer, "rupees", [(scenario.profit * scenario.capA) / (scenario.capA + scenario.capB), scenario.profit / 2, scenario.profit - answer], seed),
    traps: ["ignores time", "splits equally", "gives B's share"],
  });
};

const partnershipProfitDistribution: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenario = pick([
    { a: 4000, b: 5000, c: 6000, profit: 15000 },
    { a: 6000, b: 9000, c: 12000, profit: 18000 },
    { a: 8000, b: 10000, c: 14000, profit: 24000 },
    { a: 5000, b: 7500, c: 10000, profit: 27000 },
    { a: 7000, b: 9000, c: 11000, profit: 27000 },
  ] as const, `${seed}:scenario`);
  const ask = pick(["A", "B", "C"] as const, `${seed}:ask`);
  const totalCapital = scenario.a + scenario.b + scenario.c;
  const capital = ask === "A" ? scenario.a : ask === "B" ? scenario.b : scenario.c;
  const answer = (scenario.profit * capital) / totalCapital;
  const [ra, rb, rc] = simplifyTriple(scenario.a, scenario.b, scenario.c);
  const stem = {
    en: phrase(seed, [
      `A, B and C invest ₹${scenario.a}, ₹${scenario.b} and ₹${scenario.c} respectively for the same time. If profit is ₹${scenario.profit}, find ${ask}'s share.`,
      `Three partners put in ₹${scenario.a}, ₹${scenario.b} and ₹${scenario.c}. The profit is ₹${scenario.profit}. What is ${ask}'s share?`,
      `A:B:C capital amounts are ₹${scenario.a}, ₹${scenario.b}, ₹${scenario.c}. Divide ₹${scenario.profit} profit and find ${ask}'s part.`,
    ]),
    hi: `A, B और C क्रमशः ₹${scenario.a}, ₹${scenario.b} और ₹${scenario.c} लगाते हैं। कुल लाभ ₹${scenario.profit} है। ${ask} का हिस्सा ज्ञात करें।`,
    pa: `A, B ਅਤੇ C ਕ੍ਰਮਵਾਰ ₹${scenario.a}, ₹${scenario.b} ਅਤੇ ₹${scenario.c} ਲਗਾਉਂਦੇ ਹਨ। ਕੁੱਲ ਲਾਭ ₹${scenario.profit} ਹੈ। ${ask} ਦਾ ਹਿੱਸਾ ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("ratio", "For the same time, profit ratio equals capital ratio.", "समान समय के लिए लाभ अनुपात पूँजी अनुपात के बराबर होता है।", "ਇੱਕੋ ਸਮੇਂ ਲਈ ਲਾਭ ਅਨੁਪਾਤ ਪੂੰਜੀ ਅਨੁਪਾਤ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ।", `A:B:C=${ra}:${rb}:${rc}`),
    step("share", "Find the required share.", "आवश्यक हिस्सा निकालें।", "ਲੋੜੀਂਦਾ ਹਿੱਸਾ ਕੱਢੋ।", `${ask}=\\frac{${capital}}{${totalCapital}}\\times ${scenario.profit}=${clean(answer)}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { ...scenario, ask, totalCapital, capital, answer },
    stem,
    answer,
    answerKind: "amount",
    answerUnit: "rupees",
    steps,
    distractors: numericDistractors(answer, "rupees", [scenario.profit / 3, scenario.profit - answer, (scenario.profit * (ask === "A" ? scenario.b : scenario.a)) / totalCapital], seed),
    traps: ["splits equally", "gives remaining profit", "uses another partner's capital"],
  });
};

const populationGenderRatio: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const [male, female, k] = pick([[4, 5, 1200], [7, 8, 900], [9, 11, 700], [5, 6, 1500], [11, 13, 500]], `${seed}:scenario`);
  const total = (male + female) * k;
  const askFemale = hashText(`${seed}:ask`) % 2 === 0;
  const answer = (askFemale ? female : male) * k;
  const stem = {
    en: phrase(seed, [
      `In a town, the ratio of males to females is ${inlineMath(`${male}:${female}`)}. The population is ${total}. Find the number of ${askFemale ? "females" : "males"}.`,
      `The male:female ratio in a village is ${inlineMath(`${male}:${female}`)} and total population is ${total}. How many ${askFemale ? "females" : "males"} are there?`,
      `A population of ${total} is divided between males and females in the ratio ${inlineMath(`${male}:${female}`)}. Find the ${askFemale ? "female" : "male"} population.`,
    ]),
    hi: `एक नगर में पुरुषों और महिलाओं का अनुपात ${inlineMath(`${male}:${female}`)} है। कुल जनसंख्या ${total} है। ${askFemale ? "महिलाओं" : "पुरुषों"} की संख्या ज्ञात करें।`,
    pa: `ਇੱਕ ਸ਼ਹਿਰ ਵਿੱਚ ਮਰਦਾਂ ਅਤੇ ਔਰਤਾਂ ਦਾ ਅਨੁਪਾਤ ${inlineMath(`${male}:${female}`)} ਹੈ। ਕੁੱਲ ਆਬਾਦੀ ${total} ਹੈ। ${askFemale ? "ਔਰਤਾਂ" : "ਮਰਦਾਂ"} ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("k", "Find one ratio unit from the total population.", "कुल जनसंख्या से एक अनुपात इकाई निकालें।", "ਕੁੱਲ ਆਬਾਦੀ ਤੋਂ ਇੱਕ ਅਨੁਪਾਤ ਇਕਾਈ ਕੱਢੋ।", `k=\\frac{${total}}{${male}+${female}}=${k}`),
    step("answer", "Multiply by the required part.", "आवश्यक भाग से गुणा करें।", "ਲੋੜੀਂਦੇ ਭਾਗ ਨਾਲ ਗੁਣਾ ਕਰੋ।", `${askFemale ? "F" : "M"}=${askFemale ? female : male}\\times ${k}=${answer}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { male, female, k, total, askFemale: askFemale ? 1 : 0, answer },
    stem,
    answer,
    answerKind: "number",
    answerUnit: "items",
    steps,
    distractors: numericDistractors(answer, "items", [k, total - answer, total / Math.abs(female - male)], seed),
    traps: ["gives k", "gives other group", "uses difference denominator"],
  });
};

const voterTurnoutRatio: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenario = pick([
    { validRatio: [7, 3], totalVotes: 6000, candidateRatio: [5, 4], invalid: 1800 },
    { validRatio: [4, 1], totalVotes: 7500, candidateRatio: [2, 3], invalid: 1500 },
    { validRatio: [9, 1], totalVotes: 10000, candidateRatio: [7, 5], invalid: 1000 },
    { validRatio: [5, 2], totalVotes: 8400, candidateRatio: [3, 4], invalid: 2400 },
  ] as const, `${seed}:scenario`);
  const valid = scenario.totalVotes - scenario.invalid;
  const [x, y] = scenario.candidateRatio;
  const answer = (valid * x) / (x + y);
  const stem = {
    en: phrase(seed, [
      `In an election, ${scenario.totalVotes} votes are polled and invalid votes are ${scenario.invalid}. Valid votes are divided between A and B in the ratio ${inlineMath(`${x}:${y}`)}. Find A's votes.`,
      `${scenario.totalVotes} votes were cast, out of which ${scenario.invalid} were invalid. The valid votes for A and B are in the ratio ${inlineMath(`${x}:${y}`)}. Find A's valid votes.`,
      `After rejecting ${scenario.invalid} invalid votes from ${scenario.totalVotes}, A:B valid votes are ${inlineMath(`${x}:${y}`)}. How many valid votes did A get?`,
    ]),
    hi: `एक चुनाव में ${scenario.totalVotes} मत पड़े, जिनमें ${scenario.invalid} अमान्य थे। A और B के वैध मतों का अनुपात ${inlineMath(`${x}:${y}`)} है। A के मत ज्ञात करें।`,
    pa: `ਇੱਕ ਚੋਣ ਵਿੱਚ ${scenario.totalVotes} ਵੋਟਾਂ ਪਈਆਂ, ਜਿਨ੍ਹਾਂ ਵਿੱਚੋਂ ${scenario.invalid} ਅਵੈਧ ਸਨ। A ਅਤੇ B ਦੇ ਵੈਧ ਵੋਟਾਂ ਦਾ ਅਨੁਪਾਤ ${inlineMath(`${x}:${y}`)} ਹੈ। A ਦੇ ਵੋਟ ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("valid", "First find the valid votes.", "पहले वैध मत निकालें।", "ਪਹਿਲਾਂ ਵੈਧ ਵੋਟਾਂ ਕੱਢੋ।", `V=${scenario.totalVotes}-${scenario.invalid}=${valid}`),
    step("share", "Divide valid votes in the given ratio.", "वैध मतों को दिए अनुपात में बाँटें।", "ਵੈਧ ਵੋਟਾਂ ਨੂੰ ਦਿੱਤੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡੋ।", `A=\\frac{${x}}{${x}+${y}}\\times ${valid}=${answer}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { totalVotes: scenario.totalVotes, invalid: scenario.invalid, valid, a: x, b: y, answer },
    stem,
    answer,
    answerKind: "number",
    answerUnit: "items",
    steps,
    distractors: numericDistractors(answer, "items", [(scenario.totalVotes * x) / (x + y), valid - answer, scenario.invalid], seed),
    traps: ["uses total instead of valid votes", "gives B's votes", "gives invalid votes"],
  });
};

const marksDistributionRatio: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenario = pick([
    { parts: [3, 4, 5], total: 240, ask: 2 },
    { parts: [5, 6, 7], total: 360, ask: 1 },
    { parts: [2, 3, 4], total: 270, ask: 3 },
    { parts: [4, 5, 6], total: 300, ask: 2 },
    { parts: [7, 8, 10], total: 500, ask: 1 },
  ] as const, `${seed}:scenario`);
  const sum = scenario.parts.reduce((acc, part) => acc + part, 0);
  const k = scenario.total / sum;
  const answer = scenario.parts[scenario.ask - 1]! * k;
  const subject = ["Maths", "Science", "English"][scenario.ask - 1]!;
  const stem = {
    en: phrase(seed, [
      `Marks in Maths, Science and English are in the ratio ${inlineMath(ratioText(scenario.parts))}. Total marks are ${scenario.total}. Find the marks in ${subject}.`,
      `A student's marks in three subjects are proportional to ${inlineMath(ratioText(scenario.parts))}. If the total is ${scenario.total}, find ${subject} marks.`,
      `The marks of three subjects are divided in the ratio ${inlineMath(ratioText(scenario.parts))}. Out of ${scenario.total} total marks, how many are in ${subject}?`,
    ]),
    hi: `गणित, विज्ञान और अंग्रेज़ी के अंक ${inlineMath(ratioText(scenario.parts))} के अनुपात में हैं। कुल अंक ${scenario.total} हैं। ${subject} के अंक ज्ञात करें।`,
    pa: `ਗਣਿਤ, ਵਿਗਿਆਨ ਅਤੇ ਅੰਗਰੇਜ਼ੀ ਦੇ ਅੰਕ ${inlineMath(ratioText(scenario.parts))} ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹਨ। ਕੁੱਲ ਅੰਕ ${scenario.total} ਹਨ। ${subject} ਦੇ ਅੰਕ ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("k", "Find one ratio unit.", "एक अनुपात इकाई निकालें।", "ਇੱਕ ਅਨੁਪਾਤ ਇਕਾਈ ਕੱਢੋ।", `k=\\frac{${scenario.total}}{${sum}}=${k}`),
    step("answer", "Multiply by the required subject part.", "आवश्यक विषय के भाग से गुणा करें।", "ਲੋੜੀਂਦੇ ਵਿਸ਼ੇ ਦੇ ਭਾਗ ਨਾਲ ਗੁਣਾ ਕਰੋ।", `${subject}=${scenario.parts[scenario.ask - 1]}\\times ${k}=${answer}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { parts: ratioText(scenario.parts), total: scenario.total, ask: scenario.ask, k, answer },
    stem,
    answer,
    answerKind: "number",
    answerUnit: "marks",
    steps,
    distractors: numericDistractors(answer, "marks", [k, scenario.total - answer, scenario.parts[0] * k], seed),
    traps: ["gives k", "gives remaining marks", "uses wrong subject part"],
  });
};

const recipeScalingRatio: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenario = pick([
    { flour: 3, sugar: 2, givenFlour: 900 },
    { flour: 5, sugar: 3, givenFlour: 1500 },
    { flour: 4, sugar: 1, givenFlour: 1200 },
    { flour: 7, sugar: 4, givenFlour: 2100 },
    { flour: 6, sugar: 5, givenFlour: 1800 },
  ] as const, `${seed}:scenario`);
  const k = scenario.givenFlour / scenario.flour;
  const answer = scenario.sugar * k;
  const stem = {
    en: phrase(seed, [
      `In a recipe, flour and sugar are mixed in the ratio ${inlineMath(`${scenario.flour}:${scenario.sugar}`)}. If flour is ${scenario.givenFlour} g, find the sugar required.`,
      `Flour:sugar is ${inlineMath(`${scenario.flour}:${scenario.sugar}`)}. For ${scenario.givenFlour} g of flour, how much sugar is needed?`,
      `A mixture uses flour and sugar in the ratio ${inlineMath(`${scenario.flour}:${scenario.sugar}`)}. Find sugar when flour is ${scenario.givenFlour} g.`,
    ]),
    hi: `एक विधि में आटा और चीनी का अनुपात ${inlineMath(`${scenario.flour}:${scenario.sugar}`)} है। यदि आटा ${scenario.givenFlour} g है, तो चीनी की मात्रा ज्ञात करें।`,
    pa: `ਇੱਕ ਵਿਧੀ ਵਿੱਚ ਆਟਾ ਅਤੇ ਚੀਨੀ ਦਾ ਅਨੁਪਾਤ ${inlineMath(`${scenario.flour}:${scenario.sugar}`)} ਹੈ। ਜੇ ਆਟਾ ${scenario.givenFlour} g ਹੈ, ਤਾਂ ਚੀਨੀ ਦੀ ਮਾਤਰਾ ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("k", "Find one ratio unit from flour.", "आटे से एक अनुपात इकाई निकालें।", "ਆਟੇ ਤੋਂ ਇੱਕ ਅਨੁਪਾਤ ਇਕਾਈ ਕੱਢੋ।", `k=\\frac{${scenario.givenFlour}}{${scenario.flour}}=${k}`),
    step("sugar", "Multiply by the sugar part.", "चीनी के भाग से गुणा करें।", "ਚੀਨੀ ਦੇ ਭਾਗ ਨਾਲ ਗੁਣਾ ਕਰੋ।", `S=${scenario.sugar}\\times ${k}=${answer}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { ...scenario, k, answer },
    stem,
    answer,
    answerKind: "number",
    answerUnit: "items",
    steps,
    distractors: numericDistractors(answer, "items", [k, scenario.givenFlour - answer, scenario.givenFlour + answer], seed),
    traps: ["gives k", "uses remaining amount", "finds total mixture"],
  });
};

const blueprintScaling: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenario = pick([
    { scale: 50, drawing: 6 },
    { scale: 100, drawing: 4.5 },
    { scale: 200, drawing: 3 },
    { scale: 75, drawing: 8 },
    { scale: 125, drawing: 4 },
  ] as const, `${seed}:scenario`);
  const actual = scenario.scale * scenario.drawing;
  const stem = {
    en: phrase(seed, [
      `A blueprint is drawn to the scale ${inlineMath(`1:${scenario.scale}`)}. A wall measures ${scenario.drawing} cm on the drawing. Find its actual length in cm.`,
      `On a blueprint, ${inlineMath("1")} cm represents ${scenario.scale} cm. If a line is ${scenario.drawing} cm, find the actual length.`,
      `The scale of a drawing is ${inlineMath(`1:${scenario.scale}`)}. What actual length corresponds to ${scenario.drawing} cm on the drawing?`,
    ]),
    hi: `एक नक्शे का पैमाना ${inlineMath(`1:${scenario.scale}`)} है। चित्र में दीवार ${scenario.drawing} cm है। वास्तविक लंबाई cm में ज्ञात करें।`,
    pa: `ਇੱਕ ਨਕਸ਼ੇ ਦਾ ਪੈਮਾਨਾ ${inlineMath(`1:${scenario.scale}`)} ਹੈ। ਚਿੱਤਰ ਵਿੱਚ ਕੰਧ ${scenario.drawing} cm ਹੈ। ਅਸਲ ਲੰਬਾਈ cm ਵਿੱਚ ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("scale", "Multiply drawing length by the scale factor.", "चित्र की लंबाई को पैमाना गुणक से गुणा करें।", "ਚਿੱਤਰ ਦੀ ਲੰਬਾਈ ਨੂੰ ਪੈਮਾਨੇ ਦੇ ਗੁਣਕ ਨਾਲ ਗੁਣਾ ਕਰੋ।", `L=${scenario.drawing}\\times ${scenario.scale}=${clean(actual)}\\,\\mathrm{cm}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { scale: scenario.scale, drawing: scenario.drawing, actual },
    stem,
    answer: actual,
    answerKind: "distance",
    answerUnit: "cm",
    steps,
    distractors: numericDistractors(actual, "cm", [scenario.drawing, scenario.scale, actual / 10], seed),
    traps: ["uses drawing length", "uses scale number only", "wrong unit conversion"],
  });
};

const shadowHeightRatio: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenario = pick([
    { poleHeight: 6, poleShadow: 4, treeShadow: 14 },
    { poleHeight: 9, poleShadow: 6, treeShadow: 18 },
    { poleHeight: 12, poleShadow: 8, treeShadow: 20 },
    { poleHeight: 5, poleShadow: 3, treeShadow: 12 },
    { poleHeight: 8, poleShadow: 5, treeShadow: 15 },
  ] as const, `${seed}:scenario`);
  const answer = (scenario.poleHeight * scenario.treeShadow) / scenario.poleShadow;
  const stem = {
    en: phrase(seed, [
      `A pole ${scenario.poleHeight} m high casts a shadow of ${scenario.poleShadow} m. At the same time, a tree casts a shadow of ${scenario.treeShadow} m. Find the height of the tree.`,
      `The shadow of a ${scenario.poleHeight} m pole is ${scenario.poleShadow} m. If a tree's shadow is ${scenario.treeShadow} m at the same time, find the tree's height.`,
      `Under the same sunlight, heights and shadows are proportional. A ${scenario.poleHeight} m pole has a ${scenario.poleShadow} m shadow; a tree has a ${scenario.treeShadow} m shadow. Find the tree height.`,
    ]),
    hi: `${scenario.poleHeight} m ऊँचे खंभे की छाया ${scenario.poleShadow} m है। उसी समय एक पेड़ की छाया ${scenario.treeShadow} m है। पेड़ की ऊँचाई ज्ञात करें।`,
    pa: `${scenario.poleHeight} m ਉੱਚੇ ਖੰਭੇ ਦੀ ਛਾਂ ${scenario.poleShadow} m ਹੈ। ਉਸੇ ਸਮੇਂ ਇੱਕ ਦਰੱਖਤ ਦੀ ਛਾਂ ${scenario.treeShadow} m ਹੈ। ਦਰੱਖਤ ਦੀ ਉਚਾਈ ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("proportion", "Use proportional heights and shadows.", "ऊँचाई और छाया समानुपाती हैं।", "ਉਚਾਈ ਅਤੇ ਛਾਂ ਸਮਾਨੁਪਾਤੀ ਹਨ।", `\\frac{H}{${scenario.treeShadow}}=\\frac{${scenario.poleHeight}}{${scenario.poleShadow}}`),
    step("height", "Solve for the tree height.", "पेड़ की ऊँचाई निकालें।", "ਦਰੱਖਤ ਦੀ ਉਚਾਈ ਕੱਢੋ।", `H=\\frac{${scenario.poleHeight}\\times ${scenario.treeShadow}}{${scenario.poleShadow}}=${clean(answer)}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { ...scenario, answer },
    stem,
    answer,
    answerKind: "distance",
    answerUnit: "m",
    steps,
    distractors: numericDistractors(answer, "m", [scenario.treeShadow, scenario.poleHeight + scenario.treeShadow, (scenario.poleShadow * scenario.treeShadow) / scenario.poleHeight], seed),
    traps: ["uses shadow as height", "adds lengths", "uses inverse proportion"],
  });
};

const similarityScaling: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const [a, b] = pick([[2, 3], [3, 5], [4, 7], [5, 8], [6, 11], [7, 12]], `${seed}:scenario`);
  const [areaLeft, areaRight] = simplifyPair(a * a, b * b);
  const correct = ratioText([a, b]);
  const stem = {
    en: phrase(seed, [
      `The areas of two similar figures are in the ratio ${inlineMath(`${areaLeft}:${areaRight}`)}. Find the ratio of their corresponding sides.`,
      `For two similar figures, the area ratio is ${inlineMath(`${areaLeft}:${areaRight}`)}. What is the side ratio?`,
      `Two similar shapes have areas in the ratio ${inlineMath(`${areaLeft}:${areaRight}`)}. Find their side ratio.`,
    ]),
    hi: `दो समान आकृतियों के क्षेत्रफलों का अनुपात ${inlineMath(`${areaLeft}:${areaRight}`)} है। उनकी संबंधित भुजाओं का अनुपात ज्ञात करें।`,
    pa: `ਦੋ ਸਮਰੂਪ ਆਕ੍ਰਿਤੀਆਂ ਦੇ ਖੇਤਰਫਲਾਂ ਦਾ ਅਨੁਪਾਤ ${inlineMath(`${areaLeft}:${areaRight}`)} ਹੈ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਸੰਬੰਧਿਤ ਭੁਜਾਵਾਂ ਦਾ ਅਨੁਪਾਤ ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("area", "Area ratio is the square of side ratio.", "क्षेत्रफल अनुपात भुजा अनुपात का वर्ग होता है।", "ਖੇਤਰਫਲ ਅਨੁਪਾਤ ਭੁਜਾ ਅਨੁਪਾਤ ਦਾ ਵਰਗ ਹੁੰਦਾ ਹੈ।", `A_1:A_2=${areaLeft}:${areaRight}`),
    step("side", "Take square roots of both parts.", "दोनों भागों का वर्गमूल लें।", "ਦੋਵੇਂ ਭਾਗਾਂ ਦਾ ਵਰਗਮੂਲ ਲਵੋ।", `S_1:S_2=\\sqrt{${areaLeft}}:\\sqrt{${areaRight}}=${correct}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { a, b, areaLeft, areaRight, result: correct },
    stem,
    answer: correct,
    answerKind: "ratio",
    answerUnit: "ratio",
    steps,
    distractors: ratioDistractors(correct, [[areaLeft, areaRight], [b, a], [a * a * a, b * b * b], [a + 1, b + 1]]),
    traps: ["uses area ratio as side ratio", "reverses sides", "uses cube relation"],
  });
};

const weightedRatioBalancing: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenario = pick([
    { s1Total: 50, s1: [3, 2], s2Total: 40, s2: [1, 1] },
    { s1Total: 60, s1: [2, 3], s2Total: 75, s2: [3, 2] },
    { s1Total: 80, s1: [5, 3], s2Total: 70, s2: [4, 3] },
    { s1Total: 90, s1: [4, 5], s2Total: 60, s2: [2, 1] },
    { s1Total: 100, s1: [3, 7], s2Total: 80, s2: [5, 3] },
  ] as const, `${seed}:scenario`);
  const s1Boys = (scenario.s1Total * scenario.s1[0]) / (scenario.s1[0] + scenario.s1[1]);
  const s1Girls = scenario.s1Total - s1Boys;
  const s2Boys = (scenario.s2Total * scenario.s2[0]) / (scenario.s2[0] + scenario.s2[1]);
  const s2Girls = scenario.s2Total - s2Boys;
  const totalBoys = s1Boys + s2Boys;
  const totalGirls = s1Girls + s2Girls;
  const [left, right] = simplifyPair(totalBoys, totalGirls);
  const correct = ratioText([left, right]);
  const stem = {
    en: phrase(seed, [
      `Section I has ${scenario.s1Total} students with boys:girls ${inlineMath(ratioText(scenario.s1))}. Section II has ${scenario.s2Total} students with boys:girls ${inlineMath(ratioText(scenario.s2))}. Find the overall boys:girls ratio.`,
      `In two sections, boys:girls ratios are ${inlineMath(ratioText(scenario.s1))} and ${inlineMath(ratioText(scenario.s2))}. Their strengths are ${scenario.s1Total} and ${scenario.s2Total}. Find the combined ratio.`,
      `A school combines two groups of ${scenario.s1Total} and ${scenario.s2Total} students. Their boys:girls ratios are ${inlineMath(ratioText(scenario.s1))} and ${inlineMath(ratioText(scenario.s2))}. Find the final ratio.`,
    ]),
    hi: `पहले वर्ग में ${scenario.s1Total} विद्यार्थी हैं और लड़के:लड़कियाँ ${inlineMath(ratioText(scenario.s1))} हैं। दूसरे वर्ग में ${scenario.s2Total} विद्यार्थी हैं और अनुपात ${inlineMath(ratioText(scenario.s2))} है। कुल लड़के:लड़कियाँ अनुपात ज्ञात करें।`,
    pa: `ਪਹਿਲੇ ਸੈਕਸ਼ਨ ਵਿੱਚ ${scenario.s1Total} ਵਿਦਿਆਰਥੀ ਹਨ ਅਤੇ ਮੁੰਡੇ:ਕੁੜੀਆਂ ${inlineMath(ratioText(scenario.s1))} ਹਨ। ਦੂਜੇ ਸੈਕਸ਼ਨ ਵਿੱਚ ${scenario.s2Total} ਵਿਦਿਆਰਥੀ ਹਨ ਅਤੇ ਅਨੁਪਾਤ ${inlineMath(ratioText(scenario.s2))} ਹੈ। ਕੁੱਲ ਮੁੰਡੇ:ਕੁੜੀਆਂ ਅਨੁਪਾਤ ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("section1", "Find boys and girls in Section I.", "पहले वर्ग में लड़के और लड़कियाँ निकालें।", "ਪਹਿਲੇ ਸੈਕਸ਼ਨ ਵਿੱਚ ਮੁੰਡੇ ਅਤੇ ਕੁੜੀਆਂ ਕੱਢੋ।", `B_1=${s1Boys},\\quad G_1=${s1Girls}`),
    step("section2", "Find boys and girls in Section II.", "दूसरे वर्ग में लड़के और लड़कियाँ निकालें।", "ਦੂਜੇ ਸੈਕਸ਼ਨ ਵਿੱਚ ਮੁੰਡੇ ਅਤੇ ਕੁੜੀਆਂ ਕੱਢੋ।", `B_2=${s2Boys},\\quad G_2=${s2Girls}`),
    step("ratio", "Combine and simplify.", "मिलाकर सरल करें।", "ਮਿਲਾ ਕੇ ਸਧਾਰੋ।", `B:G=${totalBoys}:${totalGirls}=${correct}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { s1Total: scenario.s1Total, s1: ratioText(scenario.s1), s2Total: scenario.s2Total, s2: ratioText(scenario.s2), totalBoys, totalGirls, result: correct },
    stem,
    answer: correct,
    answerKind: "ratio",
    answerUnit: "ratio",
    steps,
    distractors: ratioDistractors(correct, [scenario.s1, scenario.s2, [scenario.s1[0] + scenario.s2[0], scenario.s1[1] + scenario.s2[1]], [right, left]]),
    traps: ["averages ratios directly", "uses one section only", "reverses combined ratio"],
  });
};

const multiEquationRatio: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenario = pick([
    { a: 2, b: 3, c: 4, d: 5, k: 12, ask: "B" },
    { a: 3, b: 4, c: 5, d: 7, k: 10, ask: "C" },
    { a: 4, b: 5, c: 3, d: 8, k: 9, ask: "A" },
    { a: 5, b: 6, c: 4, d: 9, k: 8, ask: "B" },
    { a: 7, b: 8, c: 6, d: 11, k: 6, ask: "C" },
  ] as const, `${seed}:scenario`);
  const common = lcm(scenario.b, scenario.c);
  const factorAB = common / scenario.b;
  const factorBC = common / scenario.c;
  const parts = simplifyTriple(scenario.a * factorAB, common, scenario.d * factorBC);
  const totalAC = (parts[0] + parts[2]) * scenario.k;
  const askedIndex = scenario.ask === "A" ? 0 : scenario.ask === "B" ? 1 : 2;
  const answer = parts[askedIndex] * scenario.k;
  const stem = {
    en: phrase(seed, [
      `If ${inlineMath(`A:B=${scenario.a}:${scenario.b}`)}, ${inlineMath(`B:C=${scenario.c}:${scenario.d}`)} and ${inlineMath(`A+C=${totalAC}`)}, find ${scenario.ask}.`,
      `${inlineMath(`A:B=${scenario.a}:${scenario.b}`)} and ${inlineMath(`B:C=${scenario.c}:${scenario.d}`)}. The sum of A and C is ${totalAC}. Find ${scenario.ask}.`,
      `Three quantities satisfy ${inlineMath(`A:B=${scenario.a}:${scenario.b}`)} and ${inlineMath(`B:C=${scenario.c}:${scenario.d}`)}. If A plus C is ${totalAC}, what is ${scenario.ask}?`,
    ]),
    hi: `यदि ${inlineMath(`A:B=${scenario.a}:${scenario.b}`)}, ${inlineMath(`B:C=${scenario.c}:${scenario.d}`)} और ${inlineMath(`A+C=${totalAC}`)} है, तो ${scenario.ask} ज्ञात करें।`,
    pa: `ਜੇ ${inlineMath(`A:B=${scenario.a}:${scenario.b}`)}, ${inlineMath(`B:C=${scenario.c}:${scenario.d}`)} ਅਤੇ ${inlineMath(`A+C=${totalAC}`)} ਹੈ, ਤਾਂ ${scenario.ask} ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("common", "Make B common in both ratios.", "दोनों अनुपातों में B को समान करें।", "ਦੋਵੇਂ ਅਨੁਪਾਤਾਂ ਵਿੱਚ B ਨੂੰ ਸਾਂਝਾ ਕਰੋ।", `L=\\operatorname{lcm}(${scenario.b},${scenario.c})=${common}`),
    step("triple", "Write the combined ratio.", "संयुक्त अनुपात लिखें।", "ਸੰਯੁਕਤ ਅਨੁਪਾਤ ਲਿਖੋ।", `A:B:C=${ratioText(parts)}`),
    step("k", "Use the given sum of A and C.", "A और C के दिए गए योग का उपयोग करें।", "A ਅਤੇ C ਦੇ ਦਿੱਤੇ ਜੋੜ ਦੀ ਵਰਤੋਂ ਕਰੋ।", `(${parts[0]}+${parts[2]})k=${totalAC},\\quad k=${scenario.k}`),
    step("answer", "Find the required quantity.", "आवश्यक राशि निकालें।", "ਲੋੜੀਂਦੀ ਰਕਮ ਕੱਢੋ।", `${scenario.ask}=${parts[askedIndex]}\\times ${scenario.k}=${answer}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { a: scenario.a, b: scenario.b, c: scenario.c, d: scenario.d, common, parts: ratioText(parts), k: scenario.k, totalAC, ask: scenario.ask, answer },
    stem,
    answer,
    answerKind: "number",
    answerUnit: "none",
    steps,
    distractors: numericDistractors(answer, "none", [scenario.k, totalAC, parts[(askedIndex + 1) % 3] * scenario.k], seed),
    traps: ["does not make B common", "uses A+C as total", "gives another quantity"],
  });
};

const ratioGraphDeduction: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenario = pick([
    { ab: [2, 3], bc: [4, 5], cd: [6, 7] },
    { ab: [3, 5], bc: [2, 3], cd: [4, 9] },
    { ab: [5, 6], bc: [7, 8], cd: [3, 4] },
    { ab: [4, 7], bc: [5, 6], cd: [8, 9] },
    { ab: [7, 9], bc: [3, 5], cd: [4, 11] },
  ] as const, `${seed}:scenario`);
  const bCommon = lcm(scenario.ab[1], scenario.bc[0]);
  const a = scenario.ab[0] * (bCommon / scenario.ab[1]);
  const b = bCommon;
  const c = scenario.bc[1] * (bCommon / scenario.bc[0]);
  const cCommon = lcm(c, scenario.cd[0]);
  const scaleABC = cCommon / c;
  const scaleCD = cCommon / scenario.cd[0];
  const parts = [a * scaleABC, b * scaleABC, cCommon, scenario.cd[1] * scaleCD];
  const divisor = gcd(gcd(parts[0], parts[1]), gcd(parts[2], parts[3]));
  const simplified = parts.map((part) => part / divisor);
  const correct = ratioText(simplified);
  const stem = {
    en: phrase(seed, [
      `Given ${inlineMath(`A:B=${ratioText(scenario.ab)}`)}, ${inlineMath(`B:C=${ratioText(scenario.bc)}`)} and ${inlineMath(`C:D=${ratioText(scenario.cd)}`)}, find ${inlineMath("A:B:C:D")}.`,
      `A, B, C and D are connected by ${inlineMath(`A:B=${ratioText(scenario.ab)}`)}, ${inlineMath(`B:C=${ratioText(scenario.bc)}`)}, ${inlineMath(`C:D=${ratioText(scenario.cd)}`)}. Find the combined ratio.`,
      `In a ratio chain, ${inlineMath(`A:B=${ratioText(scenario.ab)}`)}, ${inlineMath(`B:C=${ratioText(scenario.bc)}`)} and ${inlineMath(`C:D=${ratioText(scenario.cd)}`)}. What is ${inlineMath("A:B:C:D")}?`,
    ]),
    hi: `यदि ${inlineMath(`A:B=${ratioText(scenario.ab)}`)}, ${inlineMath(`B:C=${ratioText(scenario.bc)}`)} और ${inlineMath(`C:D=${ratioText(scenario.cd)}`)} है, तो ${inlineMath("A:B:C:D")} ज्ञात करें।`,
    pa: `ਜੇ ${inlineMath(`A:B=${ratioText(scenario.ab)}`)}, ${inlineMath(`B:C=${ratioText(scenario.bc)}`)} ਅਤੇ ${inlineMath(`C:D=${ratioText(scenario.cd)}`)} ਹੈ, ਤਾਂ ${inlineMath("A:B:C:D")} ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("b", "First make B common.", "पहले B को समान करें।", "ਪਹਿਲਾਂ B ਨੂੰ ਸਾਂਝਾ ਕਰੋ।", `A:B:C=${a}:${b}:${c}`),
    step("c", "Then make C common with the third ratio.", "फिर C को तीसरे अनुपात से समान करें।", "ਫਿਰ C ਨੂੰ ਤੀਜੇ ਅਨੁਪਾਤ ਨਾਲ ਸਾਂਝਾ ਕਰੋ।", `A:B:C:D=${ratioText(parts)}`),
    step("answer", "Simplify the graph ratio.", "ग्राफ अनुपात को सरल करें।", "ਗ੍ਰਾਫ ਅਨੁਪਾਤ ਸਧਾਰੋ।", `A:B:C:D=${correct}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { ab: ratioText(scenario.ab), bc: ratioText(scenario.bc), cd: ratioText(scenario.cd), result: correct },
    stem,
    answer: correct,
    answerKind: "ratio",
    answerUnit: "ratio",
    steps,
    distractors: ratioDistractors(correct, [[scenario.ab[0], scenario.ab[1], scenario.bc[1], scenario.cd[1]], [simplified[3], simplified[2], simplified[1], simplified[0]], [a, b, c, scenario.cd[1]], [parts[0], parts[1], parts[2], parts[3]]]),
    traps: ["stops after two ratios", "reverses graph order", "does not make C common"],
  });
};

const circularRatioDependency: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const base = pick([[6, 10, 15], [8, 12, 21], [9, 15, 20], [10, 14, 35], [12, 18, 25]], `${seed}:scenario`);
  const [a, b, c] = simplifyTriple(base[0], base[1], base[2]);
  const ab = simplifyPair(a, b);
  const bc = simplifyPair(b, c);
  const ca = simplifyPair(c, a);
  const correct = ratioText([a, b, c]);
  const stem = {
    en: phrase(seed, [
      `For three quantities, ${inlineMath(`A:B=${ratioText(ab)}`)}, ${inlineMath(`B:C=${ratioText(bc)}`)} and ${inlineMath(`C:A=${ratioText(ca)}`)}. Find ${inlineMath("A:B:C")}.`,
      `A circular ratio gives ${inlineMath(`A:B=${ratioText(ab)}`)}, ${inlineMath(`B:C=${ratioText(bc)}`)} and ${inlineMath(`C:A=${ratioText(ca)}`)}. Find the combined ratio.`,
      `If pairwise ratios around A, B and C are ${inlineMath(ratioText(ab))}, ${inlineMath(ratioText(bc))} and ${inlineMath(ratioText(ca))}, find ${inlineMath("A:B:C")}.`,
    ]),
    hi: `तीन राशियों के लिए ${inlineMath(`A:B=${ratioText(ab)}`)}, ${inlineMath(`B:C=${ratioText(bc)}`)} और ${inlineMath(`C:A=${ratioText(ca)}`)} है। ${inlineMath("A:B:C")} ज्ञात करें।`,
    pa: `ਤਿੰਨ ਰਕਮਾਂ ਲਈ ${inlineMath(`A:B=${ratioText(ab)}`)}, ${inlineMath(`B:C=${ratioText(bc)}`)} ਅਤੇ ${inlineMath(`C:A=${ratioText(ca)}`)} ਹੈ। ${inlineMath("A:B:C")} ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("pairs", "Use the consistent pairwise ratios.", "संगत युग्म अनुपातों का उपयोग करें।", "ਸੰਗਤ ਜੋੜੇ ਅਨੁਪਾਤ ਵਰਤੋ।", `A:B=${ratioText(ab)},\\quad B:C=${ratioText(bc)},\\quad C:A=${ratioText(ca)}`),
    step("answer", "The common triple satisfying all three is obtained.", "तीनों को संतुष्ट करने वाला साझा अनुपात मिलता है।", "ਤਿੰਨਾਂ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲਾ ਸਾਂਝਾ ਅਨੁਪਾਤ ਮਿਲਦਾ ਹੈ।", `A:B:C=${correct}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { ab: ratioText(ab), bc: ratioText(bc), ca: ratioText(ca), result: correct },
    stem,
    answer: correct,
    answerKind: "ratio",
    answerUnit: "ratio",
    steps,
    distractors: ratioDistractors(correct, [[ab[0], ab[1], bc[1]], [a, c, b], [ca[1], ab[1], ca[0]], [a + 1, b + 1, c + 1]]),
    traps: ["ignores circular check", "swaps B and C", "uses only adjacent ratios"],
  });
};

const hiddenTotalTrap: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenario = pick([
    { a: 3, b: 5, leave: 16, finalB: 4 },
    { a: 4, b: 7, leave: 24, finalB: 5 },
    { a: 5, b: 9, leave: 28, finalB: 7 },
    { a: 2, b: 5, leave: 18, finalB: 3 },
    { a: 7, b: 11, leave: 32, finalB: 9 },
  ] as const, `${seed}:scenario`);
  const k = scenario.leave / (scenario.b - scenario.finalB);
  const total = (scenario.a + scenario.b) * k;
  const stem = {
    en: phrase(seed, [
      `Boys and girls are in the ratio ${inlineMath(`${scenario.a}:${scenario.b}`)}. If ${scenario.leave} girls leave, the ratio becomes ${inlineMath(`${scenario.a}:${scenario.finalB}`)}. Find the original total students.`,
      `In a class, boys:girls is ${inlineMath(`${scenario.a}:${scenario.b}`)}. After ${scenario.leave} girls leave, it becomes ${inlineMath(`${scenario.a}:${scenario.finalB}`)}. Find the original strength.`,
      `The ratio of boys to girls is ${inlineMath(`${scenario.a}:${scenario.b}`)}. Removing ${scenario.leave} girls changes it to ${inlineMath(`${scenario.a}:${scenario.finalB}`)}. What was the original total?`,
    ]),
    hi: `लड़के और लड़कियों का अनुपात ${inlineMath(`${scenario.a}:${scenario.b}`)} है। ${scenario.leave} लड़कियाँ जाने पर अनुपात ${inlineMath(`${scenario.a}:${scenario.finalB}`)} हो जाता है। मूल कुल विद्यार्थी ज्ञात करें।`,
    pa: `ਮੁੰਡਿਆਂ ਅਤੇ ਕੁੜੀਆਂ ਦਾ ਅਨੁਪਾਤ ${inlineMath(`${scenario.a}:${scenario.b}`)} ਹੈ। ${scenario.leave} ਕੁੜੀਆਂ ਜਾਣ ਤੇ ਅਨੁਪਾਤ ${inlineMath(`${scenario.a}:${scenario.finalB}`)} ਹੋ ਜਾਂਦਾ ਹੈ। ਅਸਲ ਕੁੱਲ ਵਿਦਿਆਰਥੀ ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("let", "Let boys and girls be proportional parts.", "लड़के और लड़कियाँ अनुपाती भाग मानें।", "ਮੁੰਡੇ ਅਤੇ ਕੁੜੀਆਂ ਅਨੁਪਾਤੀ ਭਾਗ ਮੰਨੋ।", `B=${scenario.a}k,\\quad G=${scenario.b}k`),
    step("equation", "Use the changed ratio after girls leave.", "लड़कियाँ जाने के बाद बदला अनुपात लगाएँ।", "ਕੁੜੀਆਂ ਜਾਣ ਤੋਂ ਬਾਅਦ ਬਦਲਿਆ ਅਨੁਪਾਤ ਲਗਾਓ।", `\\frac{${scenario.a}k}{${scenario.b}k-${scenario.leave}}=\\frac{${scenario.a}}{${scenario.finalB}}`),
    step("k", "Solve for k.", "k का मान निकालें।", "k ਦਾ ਮੁੱਲ ਕੱਢੋ।", `k=${k}`),
    step("total", "Find the original total.", "मूल कुल निकालें।", "ਅਸਲ ਕੁੱਲ ਕੱਢੋ।", `T=(${scenario.a}+${scenario.b})\\times ${k}=${total}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { a: scenario.a, b: scenario.b, leave: scenario.leave, finalB: scenario.finalB, k, total },
    stem,
    answer: total,
    answerKind: "number",
    answerUnit: "students",
    steps,
    distractors: numericDistractors(total, "students", [k, scenario.leave * (scenario.a + scenario.b), scenario.b * k], seed),
    traps: ["uses leaving count as k", "finds original girls only", "uses final total"],
  });
};

const fractionalDistributionChain: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenario = pick([
    { total: 900, aNum: 1, aDen: 3, bNum: 2, bDen: 5 },
    { total: 1200, aNum: 1, aDen: 4, bNum: 1, bDen: 3 },
    { total: 1500, aNum: 2, aDen: 5, bNum: 1, bDen: 2 },
    { total: 1800, aNum: 1, aDen: 6, bNum: 3, bDen: 5 },
    { total: 2100, aNum: 2, aDen: 7, bNum: 1, bDen: 4 },
  ] as const, `${seed}:scenario`);
  const first = (scenario.total * scenario.aNum) / scenario.aDen;
  const remaining = scenario.total - first;
  const second = (remaining * scenario.bNum) / scenario.bDen;
  const last = scenario.total - first - second;
  const ask = pick(["first", "second", "last"] as const, `${seed}:ask`);
  const answer = ask === "first" ? first : ask === "second" ? second : last;
  const stem = {
    en: phrase(seed, [
      `A sum is distributed in steps. First, ${inlineMath(`\\frac{${scenario.aNum}}{${scenario.aDen}}`)} of it is given to A. Then ${inlineMath(`\\frac{${scenario.bNum}}{${scenario.bDen}}`)} of the remainder is given to B. The rest goes to C. If the sum is ₹${scenario.total}, find ${ask === "last" ? "C's share" : ask === "second" ? "B's share" : "A's share"}.`,
      `From ₹${scenario.total}, A receives ${inlineMath(`\\frac{${scenario.aNum}}{${scenario.aDen}}`)}. B receives ${inlineMath(`\\frac{${scenario.bNum}}{${scenario.bDen}}`)} of what remains. Find ${ask === "last" ? "the remaining share" : ask === "second" ? "B's share" : "A's share"}.`,
      `A distribution starts with ₹${scenario.total}. A takes ${inlineMath(`\\frac{${scenario.aNum}}{${scenario.aDen}}`)}, B takes ${inlineMath(`\\frac{${scenario.bNum}}{${scenario.bDen}}`)} of the balance, and C gets the balance. Find the required share.`,
    ]),
    hi: `₹${scenario.total} में से पहले A को ${inlineMath(`\\frac{${scenario.aNum}}{${scenario.aDen}}`)} भाग दिया जाता है। शेष में से B को ${inlineMath(`\\frac{${scenario.bNum}}{${scenario.bDen}}`)} भाग मिलता है। बाकी C को मिलता है। आवश्यक हिस्सा ज्ञात करें।`,
    pa: `₹${scenario.total} ਵਿੱਚੋਂ ਪਹਿਲਾਂ A ਨੂੰ ${inlineMath(`\\frac{${scenario.aNum}}{${scenario.aDen}}`)} ਭਾਗ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ। ਬਚੇ ਹੋਏ ਵਿੱਚੋਂ B ਨੂੰ ${inlineMath(`\\frac{${scenario.bNum}}{${scenario.bDen}}`)} ਭਾਗ ਮਿਲਦਾ ਹੈ। ਬਾਕੀ C ਨੂੰ ਮਿਲਦਾ ਹੈ। ਲੋੜੀਂਦਾ ਹਿੱਸਾ ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("first", "Find A's share.", "A का हिस्सा निकालें।", "A ਦਾ ਹਿੱਸਾ ਕੱਢੋ।", `A=${scenario.total}\\times \\frac{${scenario.aNum}}{${scenario.aDen}}=${first}`),
    step("remaining", "Find the remainder after A.", "A के बाद शेष निकालें।", "A ਤੋਂ ਬਾਅਦ ਬਚਤ ਕੱਢੋ।", `R=${scenario.total}-${first}=${remaining}`),
    step("second", "Find B's share from the remainder.", "शेष से B का हिस्सा निकालें।", "ਬਚਤ ਵਿੱਚੋਂ B ਦਾ ਹਿੱਸਾ ਕੱਢੋ।", `B=${remaining}\\times \\frac{${scenario.bNum}}{${scenario.bDen}}=${second}`),
    step("answer", "Compute the asked share.", "पूछा गया हिस्सा निकालें।", "ਪੁੱਛਿਆ ਗਿਆ ਹਿੱਸਾ ਕੱਢੋ।", `${ask === "last" ? "C" : ask === "second" ? "B" : "A"}=${answer}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { ...scenario, first, remaining, second, last, ask, answer },
    stem,
    answer,
    answerKind: "amount",
    answerUnit: "rupees",
    steps,
    distractors: numericDistractors(answer, "rupees", [remaining, scenario.total - answer, scenario.total * scenario.bNum / scenario.bDen], seed),
    traps: ["applies second fraction to total", "gives remainder instead of share", "uses complement incorrectly"],
  });
};

const variablePowerVariation: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenario = pick([
    { x1: 3, y1: 45, x2: 5, power: 2 },
    { x1: 4, y1: 48, x2: 6, power: 2 },
    { x1: 2, y1: 40, x2: 3, power: 3 },
    { x1: 5, y1: 75, x2: 4, power: 2 },
    { x1: 3, y1: 81, x2: 2, power: 3 },
  ] as const, `${seed}:scenario`);
  const k = scenario.y1 / (scenario.x1 ** scenario.power);
  const answer = k * scenario.x2 ** scenario.power;
  const stem = {
    en: phrase(seed, [
      `If y varies as the ${scenario.power === 2 ? "square" : "cube"} of x, and ${inlineMath(`y=${scenario.y1}`)} when ${inlineMath(`x=${scenario.x1}`)}, find y when ${inlineMath(`x=${scenario.x2}`)}.`,
      `y is proportional to ${inlineMath(`x^${scenario.power}`)}. For ${inlineMath(`x=${scenario.x1}`)}, ${inlineMath(`y=${scenario.y1}`)}. Find y for ${inlineMath(`x=${scenario.x2}`)}.`,
      `A variable y varies directly as ${inlineMath(`x^${scenario.power}`)}. Given ${inlineMath(`(${scenario.x1},${scenario.y1})`)}, find y at ${inlineMath(`x=${scenario.x2}`)}.`,
    ]),
    hi: `y, ${inlineMath(`x^${scenario.power}`)} के समानुपाती है। यदि ${inlineMath(`x=${scenario.x1}`)} पर ${inlineMath(`y=${scenario.y1}`)} है, तो ${inlineMath(`x=${scenario.x2}`)} पर y ज्ञात करें।`,
    pa: `y, ${inlineMath(`x^${scenario.power}`)} ਦੇ ਸਮਾਨੁਪਾਤੀ ਹੈ। ਜੇ ${inlineMath(`x=${scenario.x1}`)} ਤੇ ${inlineMath(`y=${scenario.y1}`)} ਹੈ, ਤਾਂ ${inlineMath(`x=${scenario.x2}`)} ਤੇ y ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("rule", "Use the power variation rule.", "घात समानुपात नियम लगाएँ।", "ਘਾਤ ਸਮਾਨੁਪਾਤ ਨਿਯਮ ਲਗਾਓ।", `y=kx^{${scenario.power}}`),
    step("k", "Find the constant k.", "स्थिरांक k निकालें।", "ਸਥਿਰਾਂਕ k ਕੱਢੋ।", `${scenario.y1}=k(${scenario.x1})^{${scenario.power}},\\quad k=${clean(k)}`),
    step("answer", "Substitute the new x value.", "नया x मान रखें।", "ਨਵਾਂ x ਮੁੱਲ ਰੱਖੋ।", `y=${clean(k)}(${scenario.x2})^{${scenario.power}}=${clean(answer)}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { ...scenario, k, answer },
    stem,
    answer,
    answerKind: "number",
    answerUnit: "none",
    steps,
    distractors: numericDistractors(answer, "none", [(scenario.y1 * scenario.x2) / scenario.x1, scenario.y1 + scenario.x2, k * scenario.x2], seed),
    traps: ["uses simple direct variation", "uses x instead of power", "adds values"],
  });
};

const workforceInverseVariation: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenario = pick([
    { w1: 12, d1: 15, h1: 8, w2: 18, h2: 10 },
    { w1: 20, d1: 18, h1: 6, w2: 24, h2: 9 },
    { w1: 15, d1: 24, h1: 7, w2: 21, h2: 8 },
    { w1: 16, d1: 30, h1: 5, w2: 25, h2: 6 },
    { w1: 30, d1: 20, h1: 6, w2: 24, h2: 10 },
  ] as const, `${seed}:scenario`);
  const answer = (scenario.w1 * scenario.d1 * scenario.h1) / (scenario.w2 * scenario.h2);
  const stem = {
    en: phrase(seed, [
      `${scenario.w1} workers working ${scenario.h1} hours per day finish a job in ${scenario.d1} days. How many days will ${scenario.w2} workers take if they work ${scenario.h2} hours per day?`,
      `A job takes ${scenario.d1} days for ${scenario.w1} workers at ${scenario.h1} hours daily. Find the time for ${scenario.w2} workers working ${scenario.h2} hours daily.`,
      `For the same work, ${scenario.w1} workers need ${scenario.d1} days at ${scenario.h1} hours/day. How long will ${scenario.w2} workers need at ${scenario.h2} hours/day?`,
    ]),
    hi: `${scenario.w1} मजदूर प्रतिदिन ${scenario.h1} घंटे काम करके एक काम ${scenario.d1} दिन में पूरा करते हैं। ${scenario.w2} मजदूर प्रतिदिन ${scenario.h2} घंटे काम करें तो कितने दिन लगेंगे?`,
    pa: `${scenario.w1} ਮਜ਼ਦੂਰ ਰੋਜ਼ ${scenario.h1} ਘੰਟੇ ਕੰਮ ਕਰਕੇ ਇੱਕ ਕੰਮ ${scenario.d1} ਦਿਨ ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ। ${scenario.w2} ਮਜ਼ਦੂਰ ਰੋਜ਼ ${scenario.h2} ਘੰਟੇ ਕੰਮ ਕਰਨ ਤਾਂ ਕਿੰਨੇ ਦਿਨ ਲੱਗਣਗੇ?`,
  };
  const steps = [
    step("work", "For the same work, workers, days and hours multiply to a constant.", "समान काम के लिए मजदूर, दिन और घंटे का गुणनफल स्थिर होता है।", "ਇੱਕੋ ਕੰਮ ਲਈ ਮਜ਼ਦੂਰ, ਦਿਨ ਅਤੇ ਘੰਟਿਆਂ ਦਾ ਗੁਣਨਫਲ ਸਥਿਰ ਹੁੰਦਾ ਹੈ।", `W_1D_1H_1=W_2D_2H_2`),
    step("days", "Solve for the required days.", "आवश्यक दिन निकालें।", "ਲੋੜੀਂਦੇ ਦਿਨ ਕੱਢੋ।", `D_2=\\frac{${scenario.w1}\\times ${scenario.d1}\\times ${scenario.h1}}{${scenario.w2}\\times ${scenario.h2}}=${clean(answer)}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { ...scenario, answer },
    stem,
    answer,
    answerKind: "days",
    answerUnit: "days",
    steps,
    distractors: numericDistractors(answer, "days", [(scenario.d1 * scenario.w2) / scenario.w1, scenario.d1, (scenario.w1 * scenario.d1) / scenario.w2], seed),
    traps: ["uses direct workers relation", "ignores working hours", "keeps old days"],
  });
};

const speedDistanceInverse: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenario = pick([
    { slow: 40, fast: 60, diff: 2 },
    { slow: 45, fast: 75, diff: 2 },
    { slow: 50, fast: 80, diff: 1.5 },
    { slow: 36, fast: 54, diff: 3 },
    { slow: 60, fast: 90, diff: 1 },
  ] as const, `${seed}:scenario`);
  const distance = (scenario.diff * scenario.slow * scenario.fast) / (scenario.fast - scenario.slow);
  const fastTime = distance / scenario.fast;
  const stem = {
    en: phrase(seed, [
      `For the same distance, speeds are ${scenario.slow} km/h and ${scenario.fast} km/h. The slower trip takes ${scenario.diff} hours more. Find the time taken at ${scenario.fast} km/h.`,
      `A journey is made at ${scenario.slow} km/h and at ${scenario.fast} km/h over the same distance. The time difference is ${scenario.diff} hours. Find the faster time.`,
      `Over an equal distance, speed increases from ${scenario.slow} km/h to ${scenario.fast} km/h and time reduces by ${scenario.diff} hours. Find the time at the higher speed.`,
    ]),
    hi: `समान दूरी पर गति ${scenario.slow} km/h और ${scenario.fast} km/h है। धीमी यात्रा में ${scenario.diff} घंटे अधिक लगते हैं। ${scenario.fast} km/h पर समय ज्ञात करें।`,
    pa: `ਇੱਕੋ ਦੂਰੀ ਲਈ ਗਤੀ ${scenario.slow} km/h ਅਤੇ ${scenario.fast} km/h ਹੈ। ਹੌਲੀ ਯਾਤਰਾ ਵਿੱਚ ${scenario.diff} ਘੰਟੇ ਵੱਧ ਲੱਗਦੇ ਹਨ। ${scenario.fast} km/h ਤੇ ਸਮਾਂ ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("distance", "Use the time difference for the same distance.", "समान दूरी के लिए समय अंतर का उपयोग करें।", "ਇੱਕੋ ਦੂਰੀ ਲਈ ਸਮੇਂ ਦਾ ਫਰਕ ਵਰਤੋ।", `\\frac{D}{${scenario.slow}}-\\frac{D}{${scenario.fast}}=${scenario.diff}`),
    step("d", "Solve for distance.", "दूरी निकालें।", "ਦੂਰੀ ਕੱਢੋ।", `D=${clean(distance)}`),
    step("time", "Find the faster time.", "तेज़ गति का समय निकालें।", "ਤੇਜ਼ ਗਤੀ ਦਾ ਸਮਾਂ ਕੱਢੋ।", `T=\\frac{${clean(distance)}}{${scenario.fast}}=${clean(fastTime)}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { ...scenario, distance, answer: fastTime },
    stem,
    answer: fastTime,
    answerKind: "hours",
    answerUnit: "hours",
    steps,
    distractors: numericDistractors(fastTime, "hours", [fastTime + scenario.diff, scenario.diff, distance / scenario.slow], seed),
    traps: ["gives slower time", "gives time difference", "uses speed difference directly"],
  });
};

const inventoryAllocation: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenario = pick([
    { parts: [2, 3, 5], total: 1000, sell: [1, 3, 2, 5, 1, 5] },
    { parts: [3, 4, 5], total: 1200, sell: [1, 4, 1, 2, 1, 5] },
    { parts: [4, 5, 6], total: 1500, sell: [1, 5, 2, 5, 1, 3] },
    { parts: [5, 6, 9], total: 2000, sell: [2, 5, 1, 3, 1, 6] },
    { parts: [3, 7, 10], total: 1800, sell: [1, 3, 2, 7, 1, 4] },
  ] as const, `${seed}:scenario`);
  const sum = scenario.parts.reduce((acc, part) => acc + part, 0);
  const k = scenario.total / sum;
  const initial = scenario.parts.map((part) => part * k);
  const soldA = initial[0] * scenario.sell[0] / scenario.sell[1];
  const soldB = initial[1] * scenario.sell[2] / scenario.sell[3];
  const soldC = initial[2] * scenario.sell[4] / scenario.sell[5];
  const remaining = scenario.total - soldA - soldB - soldC;
  const stem = {
    en: phrase(seed, [
      `Stock is allocated to A, B and C in the ratio ${inlineMath(ratioText(scenario.parts))}. Total stock is ${scenario.total}. A sells ${inlineMath(`\\frac{${scenario.sell[0]}}{${scenario.sell[1]}}`)}, B sells ${inlineMath(`\\frac{${scenario.sell[2]}}{${scenario.sell[3]}}`)}, and C sells ${inlineMath(`\\frac{${scenario.sell[4]}}{${scenario.sell[5]}}`)} of their own stock. Find the total stock left.`,
      `A, B and C receive stock in the ratio ${inlineMath(ratioText(scenario.parts))} from ${scenario.total} units. After their respective sales ${inlineMath(`\\frac{${scenario.sell[0]}}{${scenario.sell[1]}}`)}, ${inlineMath(`\\frac{${scenario.sell[2]}}{${scenario.sell[3]}}`)}, ${inlineMath(`\\frac{${scenario.sell[4]}}{${scenario.sell[5]}}`)}, find the remaining stock.`,
      `An inventory of ${scenario.total} units is split as ${inlineMath(ratioText(scenario.parts))}. A, B and C sell fixed fractions of their shares. Find how much inventory remains.`,
    ]),
    hi: `${scenario.total} वस्तुओं का भंडार A, B और C में ${inlineMath(ratioText(scenario.parts))} के अनुपात में बाँटा गया। A, B और C अपने-अपने हिस्से का क्रमशः ${inlineMath(`\\frac{${scenario.sell[0]}}{${scenario.sell[1]}}`)}, ${inlineMath(`\\frac{${scenario.sell[2]}}{${scenario.sell[3]}}`)}, ${inlineMath(`\\frac{${scenario.sell[4]}}{${scenario.sell[5]}}`)} बेचते हैं। बचा हुआ कुल भंडार ज्ञात करें।`,
    pa: `${scenario.total} ਵਸਤਾਂ ਦਾ ਸਟਾਕ A, B ਅਤੇ C ਵਿੱਚ ${inlineMath(ratioText(scenario.parts))} ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡਿਆ ਗਿਆ। A, B ਅਤੇ C ਆਪਣੇ-ਆਪਣੇ ਹਿੱਸੇ ਦਾ ਕ੍ਰਮਵਾਰ ${inlineMath(`\\frac{${scenario.sell[0]}}{${scenario.sell[1]}}`)}, ${inlineMath(`\\frac{${scenario.sell[2]}}{${scenario.sell[3]}}`)}, ${inlineMath(`\\frac{${scenario.sell[4]}}{${scenario.sell[5]}}`)} ਵੇਚਦੇ ਹਨ। ਬਚਿਆ ਕੁੱਲ ਸਟਾਕ ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("shares", "Find the initial shares.", "प्रारंभिक हिस्से निकालें।", "ਸ਼ੁਰੂਆਤੀ ਹਿੱਸੇ ਕੱਢੋ।", `A=${clean(initial[0])},\\quad B=${clean(initial[1])},\\quad C=${clean(initial[2])}`),
    step("sold", "Find the total sold stock.", "कुल बेचा गया भंडार निकालें।", "ਕੁੱਲ ਵੇਚਿਆ ਸਟਾਕ ਕੱਢੋ।", `S=${clean(soldA)}+${clean(soldB)}+${clean(soldC)}=${clean(soldA + soldB + soldC)}`),
    step("remaining", "Subtract sold stock from total stock.", "बेचे गए भंडार को कुल से घटाएँ।", "ਵੇਚੇ ਸਟਾਕ ਨੂੰ ਕੁੱਲ ਵਿੱਚੋਂ ਘਟਾਓ।", `R=${scenario.total}-${clean(soldA + soldB + soldC)}=${clean(remaining)}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { parts: ratioText(scenario.parts), total: scenario.total, k, initialA: initial[0], initialB: initial[1], initialC: initial[2], soldA, soldB, soldC, answer: remaining },
    stem,
    answer: remaining,
    answerKind: "number",
    answerUnit: "items",
    steps,
    distractors: numericDistractors(remaining, "items", [scenario.total - remaining, initial[2], scenario.total / 2], seed),
    traps: ["subtracts fractions from total directly", "gives total sold", "uses one section stock"],
  });
};

const liquidReplacementRatio: RatioProportionMotifFactory = ({ seed, runId, family }) => {
  const scenario = pick([
    { milk: 3, water: 2, fraction: [1, 5] },
    { milk: 4, water: 1, fraction: [1, 4] },
    { milk: 5, water: 3, fraction: [1, 8] },
    { milk: 7, water: 5, fraction: [1, 6] },
    { milk: 9, water: 4, fraction: [1, 13] },
  ] as const, `${seed}:scenario`);
  const total = scenario.milk + scenario.water;
  const remainNumerator = scenario.fraction[1] - scenario.fraction[0];
  const milkAfter = scenario.milk * remainNumerator;
  const waterAfter = scenario.water * remainNumerator + total * scenario.fraction[0];
  const [left, right] = simplifyPair(milkAfter, waterAfter);
  const correct = ratioText([left, right]);
  const stem = {
    en: phrase(seed, [
      `A vessel contains milk and water in the ratio ${inlineMath(`${scenario.milk}:${scenario.water}`)}. ${inlineMath(`\\frac{${scenario.fraction[0]}}{${scenario.fraction[1]}}`)} of the mixture is removed and replaced by water. Find the new ratio of milk to water.`,
      `Milk:water is ${inlineMath(`${scenario.milk}:${scenario.water}`)}. After removing ${inlineMath(`\\frac{${scenario.fraction[0]}}{${scenario.fraction[1]}}`)} of the mixture and filling water, find the new ratio.`,
      `From a mixture with milk:water ${inlineMath(`${scenario.milk}:${scenario.water}`)}, ${inlineMath(`\\frac{${scenario.fraction[0]}}{${scenario.fraction[1]}}`)} is drawn out and replaced with water. What is the final milk:water ratio?`,
    ]),
    hi: `एक बर्तन में दूध और पानी का अनुपात ${inlineMath(`${scenario.milk}:${scenario.water}`)} है। मिश्रण का ${inlineMath(`\\frac{${scenario.fraction[0]}}{${scenario.fraction[1]}}`)} भाग निकालकर पानी भर दिया जाता है। दूध और पानी का नया अनुपात ज्ञात करें।`,
    pa: `ਇੱਕ ਭਾਂਡੇ ਵਿੱਚ ਦੁੱਧ ਅਤੇ ਪਾਣੀ ਦਾ ਅਨੁਪਾਤ ${inlineMath(`${scenario.milk}:${scenario.water}`)} ਹੈ। ਮਿਸ਼ਰਣ ਦਾ ${inlineMath(`\\frac{${scenario.fraction[0]}}{${scenario.fraction[1]}}`)} ਭਾਗ ਕੱਢ ਕੇ ਪਾਣੀ ਭਰ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ। ਦੁੱਧ ਅਤੇ ਪਾਣੀ ਦਾ ਨਵਾਂ ਅਨੁਪਾਤ ਪਤਾ ਕਰੋ।`,
  };
  const steps = [
    step("milk", "The same fraction of milk is removed with the mixture.", "मिश्रण के साथ दूध का वही भाग निकलता है।", "ਮਿਸ਼ਰਣ ਨਾਲ ਦੁੱਧ ਦਾ ਉਹੀ ਭਾਗ ਨਿਕਲਦਾ ਹੈ।", `M'=${scenario.milk}\\left(1-\\frac{${scenario.fraction[0]}}{${scenario.fraction[1]}}\\right)`),
    step("water", "Removed mixture is replaced by water.", "निकले मिश्रण की जगह पानी आता है।", "ਨਿਕਲੇ ਮਿਸ਼ਰਣ ਦੀ ਥਾਂ ਪਾਣੀ ਆਉਂਦਾ ਹੈ।", `W'=${scenario.water}\\left(1-\\frac{${scenario.fraction[0]}}{${scenario.fraction[1]}}\\right)+${total}\\times \\frac{${scenario.fraction[0]}}{${scenario.fraction[1]}}`),
    step("ratio", "Clear the denominator and simplify.", "हर हटाकर सरल करें।", "ਹਰ ਹਟਾ ਕੇ ਸਧਾਰੋ।", `M':W'=${milkAfter}:${waterAfter}=${correct}`),
  ];
  return finalizeProblem({
    seed,
    runId,
    family,
    variables: { milk: scenario.milk, water: scenario.water, fraction: `${scenario.fraction[0]}/${scenario.fraction[1]}`, milkAfter, waterAfter, result: correct },
    stem,
    answer: correct,
    answerKind: "ratio",
    answerUnit: "ratio",
    steps,
    distractors: ratioDistractors(correct, [[scenario.milk, scenario.water], [waterAfter, milkAfter], [scenario.milk * remainNumerator, scenario.water * remainNumerator], [scenario.milk, scenario.water + scenario.fraction[0]]]),
    traps: ["keeps original ratio", "reverses final ratio", "does not add replacement water"],
  });
};

export const RATIO_PROPORTION_MOTIF_FACTORIES: Record<RatioProportionFamilyId, RatioProportionMotifFactory> = {
  rp_direct_sharing: directSharing,
  rp_sum_based_ratio_recovery: sumBasedRatioRecovery,
  rp_difference_based_ratio_recovery: differenceBasedRatioRecovery,
  rp_missing_term_proportion: missingTermProportion,
  rp_ratio_to_fraction: ratioToFraction,
  rp_fraction_to_ratio: fractionToRatio,
  rp_ratio_after_increase: ratioAfterIncrease,
  rp_ratio_after_decrease: ratioAfterDecrease,
  rp_ratio_after_transfer: ratioAfterTransfer,
  rp_age_future_ratio: ageFutureRatio,
  rp_age_past_ratio: agePastRatio,
  rp_partnership_basic: partnershipBasic,
  rp_partnership_time_variation: partnershipTimeVariation,
  rp_direct_variation_basic: directVariationBasic,
  rp_inverse_variation_basic: inverseVariationBasic,
  rp_joint_variation: jointVariation,
  rp_combined_direct_inverse: combinedDirectInverse,
  rp_map_scale_ratio: mapScaleRatio,
  rp_side_area_volume_ratio: sideAreaVolumeRatio,
  rp_chain_ratio_network: chainRatioNetwork,
  rp_equivalent_ratio_generation: equivalentRatioGeneration,
  rp_ratio_to_percentage: ratioToPercentage,
  rp_percentage_to_ratio: percentageToRatio,
  rp_product_based_ratio_recovery: productBasedRatioRecovery,
  rp_partial_value_ratio_recovery: partialValueRatioRecovery,
  rp_ratio_after_exchange: ratioAfterExchange,
  rp_ratio_restoration: ratioRestoration,
  rp_reverse_ratio_scaling: reverseRatioScaling,
  rp_age_difference_constant: ageDifferenceConstant,
  rp_age_multi_generation: ageMultiGeneration,
  rp_partnership_partial_exit: partnershipPartialExit,
  rp_partnership_profit_distribution: partnershipProfitDistribution,
  rp_population_gender_ratio: populationGenderRatio,
  rp_voter_turnout_ratio: voterTurnoutRatio,
  rp_marks_distribution_ratio: marksDistributionRatio,
  rp_recipe_scaling_ratio: recipeScalingRatio,
  rp_blueprint_scaling: blueprintScaling,
  rp_shadow_height_ratio: shadowHeightRatio,
  rp_similarity_scaling: similarityScaling,
  rp_weighted_ratio_balancing: weightedRatioBalancing,
  rp_multi_equation_ratio: multiEquationRatio,
  rp_ratio_graph_deduction: ratioGraphDeduction,
  rp_circular_ratio_dependency: circularRatioDependency,
  rp_hidden_total_trap: hiddenTotalTrap,
  rp_fractional_distribution_chain: fractionalDistributionChain,
  rp_variable_power_variation: variablePowerVariation,
  rp_workforce_inverse_variation: workforceInverseVariation,
  rp_speed_distance_inverse: speedDistanceInverse,
  rp_inventory_allocation: inventoryAllocation,
  rp_liquid_replacement_ratio: liquidReplacementRatio,
};

const EASY_FAMILIES: readonly RatioProportionFamilyId[] = [
  "rp_direct_sharing",
  "rp_sum_based_ratio_recovery",
  "rp_missing_term_proportion",
  "rp_ratio_to_fraction",
  "rp_fraction_to_ratio",
  "rp_equivalent_ratio_generation",
  "rp_ratio_to_percentage",
  "rp_percentage_to_ratio",
];

const MEDIUM_FAMILIES: readonly RatioProportionFamilyId[] = [
  "rp_difference_based_ratio_recovery",
  "rp_ratio_after_increase",
  "rp_ratio_after_decrease",
  "rp_age_future_ratio",
  "rp_age_past_ratio",
  "rp_partnership_basic",
  "rp_partnership_time_variation",
  "rp_direct_variation_basic",
  "rp_inverse_variation_basic",
  "rp_map_scale_ratio",
  "rp_side_area_volume_ratio",
  "rp_product_based_ratio_recovery",
  "rp_partial_value_ratio_recovery",
  "rp_reverse_ratio_scaling",
  "rp_age_difference_constant",
  "rp_age_multi_generation",
  "rp_partnership_profit_distribution",
  "rp_population_gender_ratio",
  "rp_voter_turnout_ratio",
  "rp_marks_distribution_ratio",
  "rp_recipe_scaling_ratio",
  "rp_blueprint_scaling",
  "rp_shadow_height_ratio",
  "rp_similarity_scaling",
];

const HARD_FAMILIES: readonly RatioProportionFamilyId[] = [
  "rp_ratio_after_transfer",
  "rp_joint_variation",
  "rp_combined_direct_inverse",
  "rp_chain_ratio_network",
  "rp_ratio_after_exchange",
  "rp_ratio_restoration",
  "rp_partnership_partial_exit",
  "rp_weighted_ratio_balancing",
  "rp_multi_equation_ratio",
  "rp_ratio_graph_deduction",
  "rp_circular_ratio_dependency",
  "rp_hidden_total_trap",
  "rp_fractional_distribution_chain",
  "rp_variable_power_variation",
  "rp_workforce_inverse_variation",
  "rp_speed_distance_inverse",
  "rp_inventory_allocation",
  "rp_liquid_replacement_ratio",
];

function familyPool(difficulty: Lowercase<"Easy" | "Medium" | "Hard">) {
  if (difficulty === "easy") return EASY_FAMILIES;
  if (difficulty === "hard") return HARD_FAMILIES;
  return [...MEDIUM_FAMILIES, ...EASY_FAMILIES, ...HARD_FAMILIES] as const;
}

export function createRatioProportionProblem(input: {
  seed: string;
  runId?: string;
  difficulty?: Lowercase<"Easy" | "Medium" | "Hard">;
  family?: RatioProportionFamilyId;
}) {
  const difficulty = input.difficulty ?? "medium";
  const family =
    input.family && RATIO_PROPORTION_FAMILY_IDS.includes(input.family)
      ? input.family
      : pick(familyPool(difficulty), `${input.seed}:family`);
  return RATIO_PROPORTION_MOTIF_FACTORIES[family]({
    seed: input.seed,
    runId: input.runId ?? input.seed,
    difficulty,
    family,
  });
}
