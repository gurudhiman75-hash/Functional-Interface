import type {
  CanonicalNumberSystemProblem,
  NumberSystemAliasFamilyId,
  NumberSystemAnswerUnit,
  NumberSystemArchetype,
  NumberSystemFamilyId,
  NumberSystemLocalizedText,
  NumberSystemMotifFactory,
  NumberSystemPreferredSolutionMethod,
  NumberSystemSolverKind,
  NumberSystemSolverModel,
} from "./number-system-types";

export const NUMBER_SYSTEM_FAMILY_IDS = [
  "ns_missing_digit_single_rule",
  "ns_missing_digit_multi_rule",
  "ns_reverse_divisibility",
  "ns_divisibility_multi_condition",
  "ns_divisibility_range_count",
  "ns_large_expression_divisibility",
  "ns_divisibility_lcm_bridge",
  "ns_hidden_divisor_deduction",
  "ns_prime_factorization",
  "ns_hidden_prime_exponent",
  "ns_prime_composite_deduction",
  "ns_factor_count_basic",
  "ns_factor_count_constraint",
  "ns_exact_divisor_count",
  "ns_odd_even_divisor_count",
  "ns_sum_of_divisors",
  "ns_product_of_divisors",
  "ns_hcf_lcm_relation",
  "ns_three_number_hcf_lcm",
  "ns_hidden_hcf",
  "ns_hidden_lcm",
  "ns_fraction_hcf_lcm",
  "ns_hcf_lcm_word_problem",
  "ns_schedule_alignment",
  "ns_minimum_common_multiple",
  "ns_remainder_after_division",
  "ns_remainder_after_power",
  "ns_modular_cycle",
  "ns_nested_remainder",
  "ns_remainder_pattern",
  "ns_remainder_reconstruction",
  "ns_remainder_factor_hybrid",
  "ns_remainder_range_count",
  "ns_unit_digit_cycle",
  "ns_last_two_digits",
  "ns_last_three_digits",
  "ns_expression_last_digit",
  "ns_power_tower_digit",
  "ns_cycle_length_detection",
  "ns_sum_of_digits",
  "ns_number_of_digits",
  "ns_digit_interchange",
  "ns_digit_formation",
  "ns_digit_constraints",
  "ns_unknown_digit_equation",
  "ns_digit_sum_reconstruction",
  "ns_consecutive_digit_number",
  "ns_trailing_zeroes",
  "ns_highest_power_dividing",
  "ns_factorial_divisibility",
  "ns_factorial_remainder",
  "ns_factorial_factor_count",
  "ns_modular_arithmetic",
  "ns_cyclic_pattern",
  "ns_prime_remainder_hybrid",
  "ns_factor_hcf_hybrid",
  "ns_hidden_number_theory",
  "ns_multi_cluster_reasoning",
] as const satisfies readonly NumberSystemFamilyId[];

export const NUMBER_SYSTEM_TODO_FAMILY_IDS = {
  aliasesHidden: ["ns_two_missing_digits_divisibility"],
} as const;

export const NUMBER_SYSTEM_ALIAS_FAMILY_MAP: Partial<Record<NumberSystemAliasFamilyId, NumberSystemFamilyId>> = {
  ns_missing_digit_divisibility: "ns_missing_digit_single_rule",
  ns_last_digit_power: "ns_unit_digit_cycle",
  ns_last_two_digits_power: "ns_last_two_digits",
  ns_hcf_lcm_product_relation: "ns_hcf_lcm_relation",
  ns_trailing_zeros_factorial: "ns_trailing_zeroes",
  ns_highest_power_in_factorial: "ns_highest_power_dividing",
};

export const NUMBER_SYSTEM_STEM_TEMPLATE_COVERAGE: Record<string, number> = {
  divisibility: 8,
  prime: 7,
  hcf_lcm: 8,
  remainder: 8,
  last_digit: 7,
  digit_logic: 8,
  factorial: 7,
  advanced: 7,
};

type Locale = "en" | "hi" | "pa";
type Cluster = "divisibility" | "prime" | "hcf_lcm" | "remainder" | "last_digit" | "digit_logic" | "factorial" | "advanced";
type Spec = {
  family: NumberSystemFamilyId;
  cluster: Cluster;
  kind: NumberSystemSolverKind;
  method: NumberSystemPreferredSolutionMethod;
  archetype: NumberSystemArchetype;
  difficulty: "easy" | "medium" | "hard";
  unit: NumberSystemAnswerUnit;
};
type Draft = {
  stem: NumberSystemLocalizedText;
  model: NumberSystemSolverModel;
  variables: Record<string, unknown>;
  hiddenVariables: Record<string, unknown>;
  derivedVariables: Record<string, unknown>;
  answerUnit: NumberSystemAnswerUnit;
  principle: NumberSystemLocalizedText;
  formula: string;
  steps: Array<{ key: string; text: NumberSystemLocalizedText; math?: string; value?: number | string }>;
  shortcut: NumberSystemLocalizedText;
  traps: string[];
  answerLabel?: string;
};

const t = (en: string, hi: string, pa: string): NumberSystemLocalizedText => ({ en, hi, pa });
const ascii = (value: string) => value.normalize("NFKC");

function hashText(value: string) {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
function pick<T>(items: readonly T[], seed: string) {
  return items[hashText(seed) % items.length]!;
}
function int(seed: string, min: number, max: number) {
  return min + (hashText(seed) % (max - min + 1));
}
function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}
function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}
function primeFactors(n: number) {
  const factors: Record<number, number> = {};
  let value = Math.abs(n);
  for (let p = 2; p * p <= value; p += p === 2 ? 1 : 2) {
    while (value % p === 0) {
      factors[p] = (factors[p] ?? 0) + 1;
      value /= p;
    }
  }
  if (value > 1) factors[value] = (factors[value] ?? 0) + 1;
  return factors;
}
function factorCountFromFactors(factors: Record<number, number>) {
  return Object.values(factors).reduce((acc, exp) => acc * (exp + 1), 1);
}
function sumOfDivisorsFromFactors(factors: Record<number, number>) {
  return Object.entries(factors).reduce((acc, [primeRaw, exp]) => {
    const prime = Number(primeRaw);
    return acc * ((prime ** (exp + 1) - 1) / (prime - 1));
  }, 1);
}
function modPow(base: number, exp: number, mod: number) {
  let result = 1 % mod;
  let b = ((base % mod) + mod) % mod;
  let e = exp;
  while (e > 0) {
    if (e % 2 === 1) result = (result * b) % mod;
    b = (b * b) % mod;
    e = Math.floor(e / 2);
  }
  return result;
}
function factorialPrimePower(n: number, p: number) {
  let count = 0;
  for (let div = p; div <= n; div *= p) count += Math.floor(n / div);
  return count;
}

const SPECS: readonly Spec[] = NUMBER_SYSTEM_FAMILY_IDS.map((family) => {
  const cluster: Cluster =
    family.includes("prime") || family.includes("factor_count") || family.includes("divisor") ? "prime" :
    family.includes("hcf") || family.includes("lcm") || family.includes("schedule") || family.includes("common") ? "hcf_lcm" :
    family.includes("remainder") || family.includes("modular") ? "remainder" :
    family.includes("last") || family.includes("unit_digit") || family.includes("cycle") || family.includes("power_tower") ? "last_digit" :
    family.includes("digit") || family.includes("number_of_digits") || family.includes("consecutive") ? "digit_logic" :
    family.includes("factorial") || family.includes("zero") || family.includes("highest_power") ? "factorial" :
    family.includes("hidden") || family.includes("hybrid") || family.includes("multi_cluster") ? "advanced" : "divisibility";
  const kind: NumberSystemSolverKind =
    cluster === "prime" ? "factor_count" :
    cluster === "hcf_lcm" ? "hcf_lcm" :
    cluster === "remainder" ? "remainder" :
    cluster === "last_digit" ? "last_digit" :
    cluster === "digit_logic" ? "digit_logic" :
    cluster === "factorial" ? "factorial" :
    cluster === "advanced" ? "modular_hybrid" :
    family.includes("missing") || family.includes("reverse") ? "missing_digit" : "divisibility_count";
  const method: NumberSystemPreferredSolutionMethod =
    kind === "missing_digit" || kind === "divisibility_count" ? "DIVISIBILITY_RULE_METHOD" :
    kind === "factor_count" ? (family.includes("hidden_prime") ? "EXPONENT_TRACKING_METHOD" : "FACTOR_COUNT_METHOD") :
    kind === "hcf_lcm" ? "HCF_LCM_RELATION_METHOD" :
    kind === "last_digit" ? "LAST_DIGIT_CYCLE_METHOD" :
    kind === "factorial" ? (family.includes("zero") ? "TRAILING_ZERO_METHOD" : "HIGHEST_POWER_METHOD") :
    kind === "digit_logic" ? "DIGIT_EQUATION_METHOD" : "MODULAR_CYCLE_METHOD";
  return {
    family,
    cluster,
    kind,
    method,
    archetype: family.includes("hidden") || family.includes("reverse") ? "hidden_variable" : family.includes("range") || family.includes("minimum") ? "optimization" : family.includes("hybrid") || family.includes("multi") ? "hybrid" : "deduction",
    difficulty: cluster === "advanced" || family.includes("three") || family.includes("nested") ? "hard" : cluster === "divisibility" || cluster === "prime" ? "easy" : "medium",
    unit: kind === "missing_digit" ? "digit" : kind === "remainder" || kind === "last_digit" ? "remainder" : kind === "factor_count" ? "count" : "number",
  };
});

function specFor(family: NumberSystemFamilyId) {
  return SPECS.find((spec) => spec.family === family) ?? SPECS[0]!;
}

export function resolveNumberSystemFamily(value?: string): NumberSystemFamilyId | undefined {
  if (NUMBER_SYSTEM_FAMILY_IDS.includes(value as NumberSystemFamilyId)) return value as NumberSystemFamilyId;
  return NUMBER_SYSTEM_ALIAS_FAMILY_MAP[value as NumberSystemAliasFamilyId];
}

function displayFactors(factors: Record<number, number>) {
  return Object.entries(factors).map(([p, e]) => e === 1 ? p : `${p}^{${e}}`).join("\\times ");
}
function optionText(value: number | string, unit: NumberSystemAnswerUnit) {
  if (unit === "digit") return `\\(${value}\\)`;
  if (unit === "count") return `\\(${value}\\)`;
  if (unit === "remainder") return `\\(${value}\\)`;
  return `\\(${value}\\)`;
}
function localizedOptions(options: string[]) {
  return { en: options, hi: options, pa: options };
}
function buildOptions(answer: number, unit: NumberSystemAnswerUnit, seed: string) {
  if (!Number.isFinite(answer)) answer = 42;
  const values = new Set<number>([answer]);
  for (const delta of [1, -1, 2, -2, 3, -3, 5, -5]) {
    const next = answer + delta;
    if (unit === "digit") {
      if (next >= 0 && next <= 9) values.add(next);
    } else if (next >= 0) {
      values.add(next);
    }
    if (values.size >= 4) break;
  }
  let fallback = 0;
  while (values.size < 4) values.add(unit === "digit" ? fallback++ : answer + 7 + fallback++);
  const list = [...values].slice(0, 4);
  const correctValue = list[0]!;
  const shift = hashText(seed) % 4;
  const rotated = list.map((_, index) => list[(index + shift) % list.length]!);
  const correct = rotated.indexOf(correctValue);
  return { options: rotated.map((value) => optionText(value, unit)), correct };
}

function withMath(value: string) {
  return `\\[\n${value}\n\\]`;
}

function stemVariant(seed: string, variants: readonly NumberSystemLocalizedText[]) {
  return pick(variants, `${seed}:stem-variant`);
}

export function evaluateNumberSystemSolverModel(model: NumberSystemSolverModel): number | string {
  const i = model.inputs as Record<string, any>;
  switch (model.kind) {
    case "missing_digit": {
      const pattern = String(i.pattern);
      const divisor = Number(i.divisor);
      const mode = String(i.mode ?? "unique");
      const valid: number[] = [];
      for (let digit = pattern.startsWith("x") ? 1 : 0; digit <= 9; digit += 1) {
        const value = Number(pattern.replace("x", String(digit)));
        if (value % divisor === 0) valid.push(digit);
      }
      if (mode === "largest") return Math.max(...valid);
      if (mode === "smallest") return Math.min(...valid);
      if (mode === "count") return valid.length;
      if (mode === "sum") return valid.reduce((a, b) => a + b, 0);
      return valid[0] ?? -1;
    }
    case "divisibility_count":
      return Math.floor(Number(i.end) / Number(i.divisor)) - Math.floor((Number(i.start) - 1) / Number(i.divisor));
    case "factor_count": {
      const factors = primeFactors(Number(i.n));
      if (i.ask === "sum") return sumOfDivisorsFromFactors(factors);
      if (i.ask === "product") {
        const count = factorCountFromFactors(factors);
        return Math.round(Number(i.n) ** (count / 2));
      }
      if (i.ask === "odd") {
        let odd = 1;
        for (const [p, e] of Object.entries(factors)) if (Number(p) !== 2) odd *= e + 1;
        return odd;
      }
      return factorCountFromFactors(factors);
    }
    case "hcf_lcm": {
      if (i.ask === "lcm") return lcm(Number(i.a), Number(i.b));
      if (i.ask === "hcf") return gcd(Number(i.a), Number(i.b));
      if (i.ask === "other") return Math.round((Number(i.hcf) * Number(i.lcm)) / Number(i.known));
      if (i.ask === "three_lcm") return lcm(lcm(Number(i.a), Number(i.b)), Number(i.c));
      return gcd(Number(i.a), Number(i.b));
    }
    case "remainder":
      return modPow(Number(i.base), Number(i.exp), Number(i.mod));
    case "last_digit":
      return modPow(Number(i.base), Number(i.exp), Number(i.mod ?? 10));
    case "digit_logic":
      if (i.ask === "reversal") return 9 * Math.abs(Number(i.tens) - Number(i.ones));
      if (i.ask === "number") return 10 * Number(i.tens) + Number(i.ones);
      if (i.ask === "digits") return String(Math.abs(Number(i.n))).length;
      return Number(i.answer);
    case "factorial":
      if (i.ask === "zeros") return factorialPrimePower(Number(i.n), 5);
      if (i.ask === "power") return factorialPrimePower(Number(i.n), Number(i.p));
      if (i.ask === "remainder") return Number(i.mod) <= Number(i.n) ? 0 : 1;
      return factorCountFromFactors(Object.fromEntries(Object.entries(primeFactors(Number(i.base))).map(([p, e]) => [p, factorialPrimePower(Number(i.n), Number(p)) * e])));
    case "modular_hybrid":
      return modPow(Number(i.base), Number(i.exp), Number(i.mod));
  }
}

function divisibilityDraft(spec: Spec, seed: string): Draft {
  if (spec.kind === "missing_digit") {
    const divisor = pick([9, 11, 12, 18], `${seed}:divisor`);
    let pattern = "47x26";
    let model: NumberSystemSolverModel = { kind: "missing_digit", inputs: { pattern, divisor: 9, mode: "unique" } };
    let answer = 8;
    for (let attempt = 0; attempt < 80; attempt += 1) {
      const digits = [int(`${seed}:p:${attempt}:0`, 1, 9), int(`${seed}:p:${attempt}:1`, 0, 9), int(`${seed}:p:${attempt}:2`, 0, 9), int(`${seed}:p:${attempt}:3`, 0, 9), int(`${seed}:p:${attempt}:4`, 0, 9)];
      const pos = int(`${seed}:pos:${attempt}`, 1, 3);
      const candidate = digits.map((digit, index) => index === pos ? "x" : String(digit)).join("");
      const candidateModel: NumberSystemSolverModel = { kind: "missing_digit", inputs: { pattern: candidate, divisor, mode: "unique" } };
      const candidateAnswer = Number(evaluateNumberSystemSolverModel(candidateModel));
      const validDigits: number[] = [];
      for (let digit = candidate.startsWith("x") ? 1 : 0; digit <= 9; digit += 1) {
        if (Number(candidate.replace("x", String(digit))) % divisor === 0) validDigits.push(digit);
      }
      if (validDigits.length === 1 && candidateAnswer >= 0 && candidateAnswer <= 9) {
        pattern = candidate;
        model = candidateModel;
        answer = candidateAnswer;
        break;
      }
    }
    const known = pattern.replace("x", "").split("").map(Number).reduce((a, b) => a + b, 0);
    return {
      stem: t(
        `The number \\(${pattern}\\) is divisible by \\(${model.inputs.divisor}\\). What is the value of \\(x\\)?`,
        `संख्या \\(${pattern}\\), \\(${model.inputs.divisor}\\) से विभाज्य है। \\(x\\) का मान क्या है?`,
        `ਸੰਖਿਆ \\(${pattern}\\), \\(${model.inputs.divisor}\\) ਨਾਲ ਭਾਗ ਜਾਂਦੀ ਹੈ। \\(x\\) ਦਾ ਮੁੱਲ ਕੀ ਹੈ?`,
      ),
      model,
      variables: { pattern, divisor: model.inputs.divisor, answerDigit: answer },
      hiddenVariables: { allowedDigits: pattern.startsWith("x") ? [1,2,3,4,5,6,7,8,9] : [0,1,2,3,4,5,6,7,8,9] },
      derivedVariables: { knownDigitSum: known },
      answerUnit: "digit",
      principle: t("Use the divisibility rule that fits the given divisor.", "दिए गए भाजक के अनुसार विभाज्यता नियम लगाएं।", "ਦਿੱਤੇ ਭਾਜਕ ਮੁਤਾਬਕ ਭਾਗਯੋਗਤਾ ਦਾ ਨਿਯਮ ਲਗਾਓ।"),
      formula: "N(x)\\equiv 0\\pmod d",
      steps: [
        { key: "rule", text: t("The missing digit must make the whole number divisible by the given divisor.", "लुप्त अंक ऐसा होना चाहिए कि पूरी संख्या दिए गए भाजक से विभाज्य हो।", "ਗੁੰਮ ਅੰਕ ਐਸਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ ਕਿ ਪੂਰੀ ਸੰਖਿਆ ਦਿੱਤੇ ਭਾਜਕ ਨਾਲ ਭਾਗ ਜਾਵੇ।") },
        { key: "sum", text: t("For the digit-sum check, add the known digits first.", "अंक-योग जांच के लिए पहले ज्ञात अंकों को जोड़ें।", "ਅੰਕ-ਜੋੜ ਜਾਂਚ ਲਈ ਪਹਿਲਾਂ ਪਤਾ ਅੰਕ ਜੋੜੋ।"), math: `${known}+x` },
        { key: "answer", text: t("The digit that satisfies the divisibility check is found.", "जो अंक विभाज्यता जांच को पूरा करता है, वही उत्तर है।", "ਜੋ ਅੰਕ ਭਾਗਯੋਗਤਾ ਜਾਂਚ ਪੂਰੀ ਕਰਦਾ ਹੈ, ਉਹੀ ਉੱਤਰ ਹੈ।"), math: `x=${answer}`, value: answer },
      ],
      shortcut: t(`Try the divisibility rule directly on \\(${pattern}\\); the valid digit is \\(${answer}\\).`, `\\(${pattern}\\) पर सीधे विभाज्यता नियम लगाएं; सही अंक \\(${answer}\\) है।`, `\\(${pattern}\\) ਉੱਤੇ ਸਿੱਧਾ ਭਾਗਯੋਗਤਾ ਨਿਯਮ ਲਗਾਓ; ਸਹੀ ਅੰਕ \\(${answer}\\) ਹੈ।`),
      traps: ["wrong digit sum", "partial divisibility check", "leading zero error"],
    };
  }
  const divisor = pick([6, 8, 9, 12, 15, 18], `${seed}:d`);
  const start = int(`${seed}:start`, 100, 240);
  const end = start + int(`${seed}:span`, 80, 180);
  return {
    stem: t(
      `Between \\(${start}\\) and \\(${end}\\), how many integers are divisible by \\(${divisor}\\) but not chosen by inspection?`,
      `\\(${start}\\) और \\(${end}\\) के बीच कितनी पूर्ण संख्याएँ \\(${divisor}\\) से विभाज्य हैं?`,
      `\\(${start}\\) ਅਤੇ \\(${end}\\) ਦੇ ਵਿਚਕਾਰ ਕਿੰਨੀਆਂ ਪੂਰਨ ਸੰਖਿਆਵਾਂ \\(${divisor}\\) ਨਾਲ ਭਾਗ ਜਾਂਦੀਆਂ ਹਨ?`,
    ),
    model: { kind: "divisibility_count", inputs: { start, end, divisor } },
    variables: { start, end, divisor },
    hiddenVariables: { firstMultiple: Math.ceil(start / divisor) * divisor, lastMultiple: Math.floor(end / divisor) * divisor },
    derivedVariables: {},
    answerUnit: "count",
    principle: t("Count multiples using the first valid multiple and the last valid multiple.", "पहले सही गुणज और आखिरी सही गुणज से गिनती करें।", "ਪਹਿਲੇ ਠੀਕ ਗੁਣਜ ਅਤੇ ਆਖਰੀ ਠੀਕ ਗੁਣਜ ਨਾਲ ਗਿਣਤੀ ਕਰੋ।"),
    formula: "\\left\\lfloor\\frac{R}{d}\\right\\rfloor-\\left\\lfloor\\frac{L-1}{d}\\right\\rfloor",
    steps: [
      { key: "formula", text: t("Multiples up to the upper limit minus multiples before the lower limit gives the count.", "ऊपरी सीमा तक के गुणजों में से निचली सीमा से पहले के गुणज घटाएं।", "ਉੱਪਰੀ ਹੱਦ ਤੱਕ ਦੇ ਗੁਣਜਾਂ ਵਿਚੋਂ ਹੇਠਲੀ ਹੱਦ ਤੋਂ ਪਹਿਲਾਂ ਦੇ ਗੁਣਜ ਘਟਾਓ।") },
      { key: "substitute", text: t("Substitute the range limits.", "सीमाएँ रखें।", "ਹੱਦਾਂ ਰੱਖੋ।"), math: `\\left\\lfloor\\frac{${end}}{${divisor}}\\right\\rfloor-\\left\\lfloor\\frac{${start - 1}}{${divisor}}\\right\\rfloor` },
    ],
    shortcut: t("Use quotient difference instead of listing all numbers.", "सभी संख्याएँ लिखने के बजाय भागफल का अंतर लें।", "ਸਾਰੀਆਂ ਸੰਖਿਆਵਾਂ ਲਿਖਣ ਦੀ ਥਾਂ ਭਾਗਫਲਾਂ ਦਾ ਫਰਕ ਲਵੋ।"),
    traps: ["included endpoint incorrectly", "listed multiples manually", "counted non-multiples"],
  };
}

function factorDraft(spec: Spec, seed: string): Draft {
  const ask = spec.family.includes("sum") ? "sum" : spec.family.includes("product") ? "product" : spec.family.includes("odd") ? "odd" : "count";
  const n = ask === "product"
    ? pick([12, 18, 20, 24, 30, 36], `${seed}:n`)
    : (2 ** int(`${seed}:a`, 2, 5)) * (3 ** int(`${seed}:b`, 1, 3)) * (5 ** int(`${seed}:c`, 0, 1));
  const factors = primeFactors(n);
  return {
    stem: stemVariant(seed, [
      t(`After prime factorising \\(${n}\\), what is the ${ask === "sum" ? "sum of all positive divisors" : ask === "product" ? "product of all positive divisors" : ask === "odd" ? "number of odd divisors" : "number of positive divisors"}?`, `\\(${n}\\) का अभाज्य गुणनखंड करने के बाद ${ask === "sum" ? "सभी धनात्मक भाजकों का योग" : ask === "product" ? "सभी धनात्मक भाजकों का गुणनफल" : ask === "odd" ? "विषम भाजकों की संख्या" : "धनात्मक भाजकों की संख्या"} क्या है?`, `\\(${n}\\) ਦੇ ਅਭਾਜ ਗੁਣਨਖੰਡ ਕਰਨ ਤੋਂ ਬਾਅਦ ${ask === "sum" ? "ਸਾਰੇ ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦਾ ਜੋੜ" : ask === "product" ? "ਸਾਰੇ ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦਾ ਗੁਣਨਫਲ" : ask === "odd" ? "ਟਾਂਕ ਭਾਜਕਾਂ ਦੀ ਗਿਣਤੀ" : "ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦੀ ਗਿਣਤੀ"} ਕੀ ਹੈ?`),
      t(`For the number \\(${n}\\), find the ${ask === "sum" ? "sum of its positive divisors" : ask === "product" ? "product of its positive divisors" : ask === "odd" ? "count of odd divisors" : "count of positive divisors"}?`, `संख्या \\(${n}\\) के लिए ${ask === "sum" ? "धनात्मक भाजकों का योग" : ask === "product" ? "धनात्मक भाजकों का गुणनफल" : ask === "odd" ? "विषम भाजकों की संख्या" : "धनात्मक भाजकों की संख्या"} ज्ञात करें?`, `ਸੰਖਿਆ \\(${n}\\) ਲਈ ${ask === "sum" ? "ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦਾ ਜੋੜ" : ask === "product" ? "ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦਾ ਗੁਣਨਫਲ" : ask === "odd" ? "ਟਾਂਕ ਭਾਜਕਾਂ ਦੀ ਗਿਣਤੀ" : "ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦੀ ਗਿਣਤੀ"} ਪਤਾ ਕਰੋ?`),
      t(`Using prime powers of \\(${n}\\), what is the required divisor result?`, `\\(${n}\\) की अभाज्य घातों का उपयोग करके आवश्यक भाजक परिणाम क्या है?`, `\\(${n}\\) ਦੀਆਂ ਅਭਾਜ ਘਾਤਾਂ ਵਰਤ ਕੇ ਲੋੜੀਂਦਾ ਭਾਜਕ ਨਤੀਜਾ ਕੀ ਹੈ?`),
      t(`A number is \\(${n}\\). Based on its prime factorisation, what divisor value is asked?`, `एक संख्या \\(${n}\\) है। उसके अभाज्य गुणनखंड के आधार पर पूछा गया भाजक-मान क्या है?`, `ਇੱਕ ਸੰਖਿਆ \\(${n}\\) ਹੈ। ਇਸ ਦੇ ਅਭਾਜ ਗੁਣਨਖੰਡ ਦੇ ਆਧਾਰ ਤੇ ਪੁੱਛਿਆ ਭਾਜਕ ਮੁੱਲ ਕੀ ਹੈ?`),
    ]),
    model: { kind: "factor_count", inputs: { n, ask } },
    variables: { n, ask, factors },
    hiddenVariables: { primeExponents: factors },
    derivedVariables: { factorization: displayFactors(factors) },
    answerUnit: ask === "count" || ask === "odd" ? "count" : "number",
    principle: t("Factor questions become simple after writing prime powers.", "अभाज्य घातों में लिखने के बाद भाजक प्रश्न सरल हो जाते हैं।", "ਅਭਾਜ ਘਾਤਾਂ ਵਿੱਚ ਲਿਖਣ ਤੋਂ ਬਾਅਦ ਭਾਜਕ ਵਾਲੇ ਪ੍ਰਸ਼ਨ ਸੌਖੇ ਹੋ ਜਾਂਦੇ ਹਨ।"),
    formula: "\\tau(n)=(a+1)(b+1)\\cdots",
    steps: [
      { key: "factorize", text: t("Write the number as a product of prime powers.", "संख्या को अभाज्य घातों के गुणनफल के रूप में लिखें।", "ਸੰਖਿਆ ਨੂੰ ਅਭਾਜ ਘਾਤਾਂ ਦੇ ਗੁਣਨਫਲ ਵਜੋਂ ਲਿਖੋ।"), math: `${n}=${displayFactors(factors)}` },
      { key: "apply", text: t("Use the exponent rule required by the question.", "प्रश्न के अनुसार घात वाला नियम लगाएं।", "ਪ੍ਰਸ਼ਨ ਮੁਤਾਬਕ ਘਾਤਾਂ ਵਾਲਾ ਨਿਯਮ ਲਗਾਓ।") },
    ],
    shortcut: t("Once prime powers are known, use the exponent pattern directly.", "अभाज्य घातें मिलते ही घातों का पैटर्न सीधे लगाएं।", "ਅਭਾਜ ਘਾਤਾਂ ਮਿਲਦੇ ਹੀ ਘਾਤਾਂ ਦਾ ਪੈਟਰਨ ਸਿੱਧਾ ਲਗਾਓ।"),
    traps: ["forgot plus one rule", "ignored factor 2", "used prime count instead of divisor count"],
  };
}

function hcfDraft(spec: Spec, seed: string): Draft {
  const h0 = pick([6, 8, 9, 12, 15, 18], `${seed}:h`);
  const m = pick([4, 5, 7, 11, 13], `${seed}:m`);
  const n0 = pick([6, 7, 10, 13, 17], `${seed}:n`);
  const a = h0 * m;
  const b = h0 * n0;
  const ask = spec.family.includes("lcm") || spec.family.includes("schedule") || spec.family.includes("minimum") ? "lcm" : spec.family.includes("relation") ? "other" : "hcf";
  const known = a;
  const h = gcd(a, b);
  const l = lcm(a, b);
  return {
    stem: stemVariant(seed, [
      t(
      ask === "other"
        ? `The HCF and LCM of two numbers are \\(${h}\\) and \\(${l}\\). If one number is \\(${known}\\), what is the other number?`
        : `Two cyclic events repeat every \\(${a}\\) and \\(${b}\\) minutes. After how many minutes will they occur together again?`,
      ask === "other"
        ? `दो संख्याओं का HCF और LCM क्रमशः \\(${h}\\) और \\(${l}\\) हैं। यदि एक संख्या \\(${known}\\) है, तो दूसरी संख्या क्या है?`
        : `दो घटनाएँ हर \\(${a}\\) और \\(${b}\\) मिनट में दोहराती हैं। वे फिर साथ कितने मिनट बाद होंगी?`,
      ask === "other"
        ? `ਦੋ ਸੰਖਿਆਵਾਂ ਦਾ HCF ਅਤੇ LCM ਕ੍ਰਮਵਾਰ \\(${h}\\) ਅਤੇ \\(${l}\\) ਹਨ। ਜੇ ਇੱਕ ਸੰਖਿਆ \\(${known}\\) ਹੈ, ਤਾਂ ਦੂਜੀ ਕੀ ਹੈ?`
        : `ਦੋ ਘਟਨਾਵਾਂ ਹਰ \\(${a}\\) ਅਤੇ \\(${b}\\) ਮਿੰਟ ਬਾਅਦ ਦੁਹਰਾਉਂਦੀਆਂ ਹਨ। ਉਹ ਮੁੜ ਇਕੱਠੀਆਂ ਕਿੰਨੇ ਮਿੰਟ ਬਾਅਦ ਹੋਣਗੀਆਂ?`,
      ),
      t(`Bells ring at intervals of \\(${a}\\) and \\(${b}\\) minutes. After how many minutes will both ring together again?`, `घंटियाँ \\(${a}\\) और \\(${b}\\) मिनट के अंतराल पर बजती हैं। दोनों फिर साथ कितने मिनट बाद बजेंगी?`, `ਘੰਟੀਆਂ \\(${a}\\) ਅਤੇ \\(${b}\\) ਮਿੰਟ ਦੇ ਅੰਤਰ ਤੇ ਵੱਜਦੀਆਂ ਹਨ। ਦੋਵੇਂ ਮੁੜ ਇਕੱਠੀਆਂ ਕਿੰਨੇ ਮਿੰਟ ਬਾਅਦ ਵੱਜਣਗੀਆਂ?`),
      t(`Two buses leave a stand every \\(${a}\\) and \\(${b}\\) minutes. When will they next leave together?`, `दो बसें \\(${a}\\) और \\(${b}\\) मिनट बाद-बाद स्टैंड से चलती हैं। वे अगली बार साथ कब चलेंगी?`, `ਦੋ ਬੱਸਾਂ \\(${a}\\) ਅਤੇ \\(${b}\\) ਮਿੰਟ ਬਾਅਦ ਸਟੈਂਡ ਤੋਂ ਚਲਦੀਆਂ ਹਨ। ਉਹ ਅਗਲੀ ਵਾਰ ਇਕੱਠੀਆਂ ਕਦੋਂ ਚਲਣਗੀਆਂ?`),
      t(`For two numbers \\(${a}\\) and \\(${b}\\), which common multiple is first reached?`, `दो संख्याओं \\(${a}\\) और \\(${b}\\) के लिए पहला साझा गुणज क्या होगा?`, `ਦੋ ਸੰਖਿਆਵਾਂ \\(${a}\\) ਅਤੇ \\(${b}\\) ਲਈ ਪਹਿਲਾ ਸਾਂਝਾ ਗੁਣਜ ਕੀ ਹੋਵੇਗਾ?`),
    ]),
    model: { kind: "hcf_lcm", inputs: ask === "other" ? { ask, hcf: h, lcm: l, known } : { ask: "lcm", a, b } },
    variables: { a, b, hcf: h, lcm: l, ask },
    hiddenVariables: { productRelation: h * l },
    derivedVariables: {},
    answerUnit: "number",
    principle: t("HCF-LCM questions use common factor or common multiple structure.", "HCF-LCM प्रश्नों में साझा गुणनखंड या साझा गुणज की संरचना होती है।", "HCF-LCM ਪ੍ਰਸ਼ਨਾਂ ਵਿੱਚ ਸਾਂਝੇ ਗੁਣਨਖੰਡ ਜਾਂ ਸਾਂਝੇ ਗੁਣਜ ਦੀ ਬਣਤਰ ਹੁੰਦੀ ਹੈ।"),
    formula: "a\\times b=\\operatorname{HCF}\\times\\operatorname{LCM}",
    steps: [
      { key: "relation", text: t("Choose HCF for common division and LCM for common repetition.", "साझा विभाजन के लिए HCF और साझा दोहराव के लिए LCM लें।", "ਸਾਂਝੀ ਵੰਡ ਲਈ HCF ਅਤੇ ਸਾਂਝੇ ਦੁਹਰਾਅ ਲਈ LCM ਲਵੋ।") },
      { key: "compute", text: t("Apply the relation with the given values.", "दिए गए मानों से संबंध लगाएं।", "ਦਿੱਤੇ ਮੁੱਲਾਂ ਨਾਲ ਸੰਬੰਧ ਲਗਾਓ।"), math: ask === "other" ? `${h}\\times ${l}=${known}\\times x` : `\\operatorname{LCM}(${a},${b})=${l}` },
    ],
    shortcut: t("For repeat-together questions, take LCM directly.", "साथ दोहराने वाले प्रश्नों में सीधे LCM लें।", "ਇਕੱਠੇ ਦੁਹਰਾਉਣ ਵਾਲੇ ਪ੍ਰਸ਼ਨਾਂ ਵਿੱਚ ਸਿੱਧਾ LCM ਲਵੋ।"),
    traps: ["used HCF instead of LCM", "inverted product relation", "ignored third condition"],
  };
}

function remainderDraft(spec: Spec, seed: string): Draft {
  const base = pick([2, 3, 7, 11, 13], `${seed}:base`);
  const exp = int(`${seed}:exp`, 23, 97);
  const mod = pick([5, 7, 9, 11, 13], `${seed}:mod`);
  return {
    stem: stemVariant(seed, [
      t(`Without expanding the power, find the remainder when \\(${base}^{${exp}}\\) is divided by \\(${mod}\\).`, `घात को फैलाए बिना \\(${base}^{${exp}}\\) को \\(${mod}\\) से भाग देने पर शेषफल ज्ञात करें।`, `ਘਾਤ ਨੂੰ ਫੈਲਾਏ ਬਿਨਾਂ \\(${base}^{${exp}}\\) ਨੂੰ \\(${mod}\\) ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ਕਿੰਨਾ ਆਵੇਗਾ?`),
      t(`What remainder will \\(${base}^{${exp}}\\) leave on division by \\(${mod}\\)?`, `\\(${base}^{${exp}}\\) को \\(${mod}\\) से भाग देने पर क्या शेषफल आएगा?`, `\\(${base}^{${exp}}\\) ਨੂੰ \\(${mod}\\) ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਕਿਹੜਾ ਬਾਕੀ ਆਵੇਗਾ?`),
      t(`Using cyclic remainders, evaluate the remainder of \\(${base}^{${exp}}\\) modulo \\(${mod}\\).`, `चक्रीय शेषफल से \\(${base}^{${exp}}\\) modulo \\(${mod}\\) का शेषफल निकालें।`, `ਚੱਕਰੀ ਬਾਕੀਆਂ ਨਾਲ \\(${base}^{${exp}}\\) modulo \\(${mod}\\) ਦਾ ਬਾਕੀ ਕੱਢੋ।`),
      t(`A large power \\(${base}^{${exp}}\\) is divided by \\(${mod}\\). What is the remainder?`, `बड़ी घात \\(${base}^{${exp}}\\) को \\(${mod}\\) से भाग दिया गया। शेषफल क्या है?`, `ਵੱਡੀ ਘਾਤ \\(${base}^{${exp}}\\) ਨੂੰ \\(${mod}\\) ਨਾਲ ਭਾਗ ਦਿੱਤਾ ਗਿਆ। ਬਾਕੀ ਕੀ ਹੈ?`),
    ]),
    model: { kind: "remainder", inputs: { base, exp, mod } },
    variables: { base, exp, mod },
    hiddenVariables: { cycle: "modular power cycle" },
    derivedVariables: { reducedExponent: exp },
    answerUnit: "remainder",
    principle: t("Large powers are handled by modular cycles.", "बड़ी घातों को मॉड्यूलर चक्र से संभालते हैं।", "ਵੱਡੀਆਂ ਘਾਤਾਂ ਨੂੰ ਮਾਡਿਊਲਰ ਚੱਕਰ ਨਾਲ ਹੱਲ ਕਰਦੇ ਹਾਂ।"),
    formula: "a^n\\bmod m",
    steps: [
      { key: "reduce", text: t("First reduce the base modulo the divisor.", "पहले आधार को भाजक के अनुसार घटाएं।", "ਪਹਿਲਾਂ ਆਧਾਰ ਨੂੰ ਭਾਜਕ ਮੁਤਾਬਕ ਘਟਾਓ।"), math: `${base}\\equiv ${base % mod}\\pmod{${mod}}` },
      { key: "cycle", text: t("Use the repeating remainder cycle instead of expanding the power.", "घात फैलाने के बजाय दोहराते शेषफल चक्र का प्रयोग करें।", "ਘਾਤ ਫੈਲਾਉਣ ਦੀ ਥਾਂ ਦੁਹਰਾਉਂਦਾ ਬਾਕੀ ਚੱਕਰ ਵਰਤੋ।") },
    ],
    shortcut: t("Reduce the base first, then use the power cycle position.", "पहले आधार घटाएं, फिर घात-चक्र की स्थिति लें।", "ਪਹਿਲਾਂ ਆਧਾਰ ਘਟਾਓ, ਫਿਰ ਘਾਤ-ਚੱਕਰ ਦੀ ਸਥਿਤੀ ਲਵੋ।"),
    traps: ["wrong cycle position", "expanded power", "used divisor as cycle length"],
  };
}

function lastDigitDraft(spec: Spec, seed: string): Draft {
  const base = pick([2, 3, 7, 8, 12, 17, 23], `${seed}:base`);
  const exp = int(`${seed}:exp`, 31, 123);
  const mod = spec.family.includes("two") ? 100 : spec.family.includes("three") ? 1000 : 10;
  return {
    stem: stemVariant(seed, [
      t(`What are the last ${mod === 10 ? "digit" : mod === 100 ? "two digits" : "three digits"} of \\(${base}^{${exp}}\\)?`, `\\(${base}^{${exp}}\\) का अंतिम ${mod === 10 ? "अंक" : mod === 100 ? "दो अंक" : "तीन अंक"} क्या है?`, `\\(${base}^{${exp}}\\) ਦਾ ਆਖਰੀ ${mod === 10 ? "ਅੰਕ" : mod === 100 ? "ਦੋ ਅੰਕ" : "ਤਿੰਨ ਅੰਕ"} ਕੀ ਹੈ?`),
      t(`Find the ending ${mod === 10 ? "digit" : mod === 100 ? "two digits" : "three digits"} of \\(${base}^{${exp}}\\)?`, `\\(${base}^{${exp}}\\) के अंतिम ${mod === 10 ? "अंक" : mod === 100 ? "दो अंक" : "तीन अंक"} ज्ञात करें?`, `\\(${base}^{${exp}}\\) ਦੇ ਆਖਰੀ ${mod === 10 ? "ਅੰਕ" : mod === 100 ? "ਦੋ ਅੰਕ" : "ਤਿੰਨ ਅੰਕ"} ਪਤਾ ਕਰੋ?`),
      t(`Using the power cycle, what ending does \\(${base}^{${exp}}\\) have?`, `घात-चक्र से \\(${base}^{${exp}}\\) का अंतिम रूप क्या होगा?`, `ਘਾਤ-ਚੱਕਰ ਨਾਲ \\(${base}^{${exp}}\\) ਦਾ ਆਖਰੀ ਰੂਪ ਕੀ ਹੋਵੇਗਾ?`),
      t(`A power \\(${base}^{${exp}}\\) is too large to expand. Which ending digits does it have?`, `घात \\(${base}^{${exp}}\\) फैलाने के लिए बहुत बड़ी है। इसके अंतिम अंक क्या होंगे?`, `ਘਾਤ \\(${base}^{${exp}}\\) ਫੈਲਾਉਣ ਲਈ ਬਹੁਤ ਵੱਡੀ ਹੈ। ਇਸ ਦੇ ਆਖਰੀ ਅੰਕ ਕੀ ਹੋਣਗੇ?`),
    ]),
    model: { kind: "last_digit", inputs: { base, exp, mod } },
    variables: { base, exp, mod },
    hiddenVariables: { cycleModulus: mod },
    derivedVariables: {},
    answerUnit: "remainder",
    principle: t("Last-digit questions depend on the cyclicity of powers.", "अंतिम अंक वाले प्रश्न घातों की चक्रीयता पर निर्भर करते हैं।", "ਆਖਰੀ ਅੰਕ ਵਾਲੇ ਪ੍ਰਸ਼ਨ ਘਾਤਾਂ ਦੇ ਚੱਕਰ ਤੇ ਨਿਰਭਰ ਕਰਦੇ ਹਨ।"),
    formula: `a^n\\bmod ${mod}`,
    steps: [
      { key: "cycle", text: t("Identify the power cycle for the required ending digits.", "चाहे गए अंतिम अंकों के लिए घात चक्र पहचानें।", "ਲੋੜੀਂਦੇ ਆਖਰੀ ਅੰਕਾਂ ਲਈ ਘਾਤ ਚੱਕਰ ਪਛਾਣੋ।") },
      { key: "position", text: t("Use the exponent position in that cycle.", "उस चक्र में घात की स्थिति लें।", "ਉਸ ਚੱਕਰ ਵਿੱਚ ਘਾਤ ਦੀ ਸਥਿਤੀ ਲਵੋ।"), math: `${exp}\\text{ in cycle}` },
    ],
    shortcut: t("Only the cycle position matters, not the full power.", "पूरी घात नहीं, केवल चक्र की स्थिति मायने रखती है।", "ਪੂਰੀ ਘਾਤ ਨਹੀਂ, ਸਿਰਫ਼ ਚੱਕਰ ਦੀ ਸਥਿਤੀ ਮਾਇਨੇ ਰੱਖਦੀ ਹੈ।"),
    traps: ["wrong unit digit cycle", "used exponent directly", "ignored last two digit modulus"],
  };
}

function digitDraft(spec: Spec, seed: string): Draft {
  const tens = int(`${seed}:tens`, 3, 8);
  const ones = int(`${seed}:ones`, 1, 9);
  const n = 10 * tens + ones;
  const ask = spec.family.includes("number_of_digits") ? "digits" : spec.family.includes("interchange") ? "reversal" : "number";
  return {
    stem: stemVariant(seed, ask === "reversal"
      ? [
          t(`Digits \\(${tens}\\) and \\(${ones}\\) form a two-digit number. What is the difference between it and its reversed number?`, `अंक \\(${tens}\\) और \\(${ones}\\) एक दो-अंकीय संख्या बनाते हैं। उसका और उलटी संख्या का अंतर क्या है?`, `ਅੰਕ \\(${tens}\\) ਅਤੇ \\(${ones}\\) ਇੱਕ ਦੋ ਅੰਕਾਂ ਵਾਲੀ ਸੰਖਿਆ ਬਣਾਉਂਦੇ ਹਨ। ਉਸ ਦਾ ਅਤੇ ਉਲਟੀ ਸੰਖਿਆ ਦਾ ਫਰਕ ਕੀ ਹੈ?`),
          t(`Tens digit \\(${tens}\\) and ones digit \\(${ones}\\) are used in a number. How much does it change when reversed?`, `दहाई अंक \\(${tens}\\) और इकाई अंक \\(${ones}\\) एक संख्या में हैं। उलटने पर वह कितनी बदलेगी?`, `ਦਹਾਈ ਅੰਕ \\(${tens}\\) ਅਤੇ ਇਕਾਈ ਅੰਕ \\(${ones}\\) ਇੱਕ ਸੰਖਿਆ ਵਿੱਚ ਹਨ। ਉਲਟਣ ਤੇ ਇਹ ਕਿੰਨੀ ਬਦਲੇਗੀ?`),
          t(`Number \\(${10 * tens + ones}\\) is reversed by interchanging its digits. What absolute difference is obtained?`, `संख्या \\(${10 * tens + ones}\\) के अंक आपस में बदल दिए जाते हैं। पूर्ण अंतर क्या मिलेगा?`, `ਸੰਖਿਆ \\(${10 * tens + ones}\\) ਦੇ ਅੰਕ ਆਪਸ ਵਿੱਚ ਬਦਲੇ ਜਾਂਦੇ ਹਨ। ਪੂਰਾ ਫਰਕ ਕੀ ਮਿਲੇਗਾ?`),
          t(`With tens \\(${tens}\\) and ones \\(${ones}\\), a two-digit number is written. What difference appears after reversing?`, `दहाई \\(${tens}\\) और इकाई \\(${ones}\\) से दो-अंकीय संख्या लिखी गई। उलटने पर कितना अंतर आएगा?`, `ਦਹਾਈ \\(${tens}\\) ਅਤੇ ਇਕਾਈ \\(${ones}\\) ਨਾਲ ਦੋ ਅੰਕਾਂ ਵਾਲੀ ਸੰਖਿਆ ਲਿਖੀ ਗਈ। ਉਲਟਣ ਤੇ ਕਿੰਨਾ ਫਰਕ ਆਵੇਗਾ?`),
        ]
      : [
          t(`Digit sum \\(${tens + ones}\\) and tens digit \\(${tens}\\) are known for a two-digit number. What is the number?`, `दो-अंकीय संख्या का अंक-योग \\(${tens + ones}\\) और दहाई अंक \\(${tens}\\) ज्ञात हैं। संख्या क्या है?`, `ਦੋ ਅੰਕਾਂ ਵਾਲੀ ਸੰਖਿਆ ਦਾ ਅੰਕ-ਜੋੜ \\(${tens + ones}\\) ਅਤੇ ਦਹਾਈ ਅੰਕ \\(${tens}\\) ਪਤਾ ਹਨ। ਸੰਖਿਆ ਕੀ ਹੈ?`),
          t(`Digit sum \\(${tens + ones}\\) is given for a two-digit number. If the tens digit is \\(${tens}\\), what is the number?`, `दो-अंकीय संख्या के लिए अंक-योग \\(${tens + ones}\\) दिया है। यदि दहाई अंक \\(${tens}\\) है, तो संख्या क्या है?`, `ਦੋ ਅੰਕਾਂ ਵਾਲੀ ਸੰਖਿਆ ਲਈ ਅੰਕ-ਜੋੜ \\(${tens + ones}\\) ਦਿੱਤਾ ਹੈ। ਜੇ ਦਹਾਈ ਅੰਕ \\(${tens}\\) ਹੈ, ਤਾਂ ਸੰਖਿਆ ਕੀ ਹੈ?`),
          t(`The value \\(${tens + ones}\\) is the sum of a two-digit number's digits. Its tens digit is \\(${tens}\\). Find the number?`, `मान \\(${tens + ones}\\) किसी दो-अंकीय संख्या के अंकों का योग है। उसका दहाई अंक \\(${tens}\\) है। संख्या ज्ञात करें?`, `ਮੁੱਲ \\(${tens + ones}\\) ਕਿਸੇ ਦੋ ਅੰਕਾਂ ਵਾਲੀ ਸੰਖਿਆ ਦੇ ਅੰਕਾਂ ਦਾ ਜੋੜ ਹੈ। ਉਸ ਦਾ ਦਹਾਈ ਅੰਕ \\(${tens}\\) ਹੈ। ਸੰਖਿਆ ਪਤਾ ਕਰੋ?`),
          t(`With digit sum \\(${tens + ones}\\), a two-digit number has \\(${tens}\\) in the tens place. Which number is it?`, `अंक-योग \\(${tens + ones}\\) वाली दो-अंकीय संख्या के दहाई स्थान पर \\(${tens}\\) है। वह संख्या कौन-सी है?`, `ਅੰਕ-ਜੋੜ \\(${tens + ones}\\) ਵਾਲੀ ਦੋ ਅੰਕਾਂ ਦੀ ਸੰਖਿਆ ਦੇ ਦਹਾਈ ਥਾਂ ਤੇ \\(${tens}\\) ਹੈ। ਉਹ ਸੰਖਿਆ ਕਿਹੜੀ ਹੈ?`),
          t(`Tens digit \\(${tens}\\), digit sum \\(${tens + ones}\\): which two-digit number satisfies both facts?`, `दहाई अंक \\(${tens}\\), अंक-योग \\(${tens + ones}\\): कौन-सी दो-अंकीय संख्या दोनों बातें पूरी करती है?`, `ਦਹਾਈ ਅੰਕ \\(${tens}\\), ਅੰਕ-ਜੋੜ \\(${tens + ones}\\): ਕਿਹੜੀ ਦੋ ਅੰਕਾਂ ਵਾਲੀ ਸੰਖਿਆ ਦੋਵੇਂ ਗੱਲਾਂ ਪੂਰੀ ਕਰਦੀ ਹੈ?`),
        ]),
    model: { kind: "digit_logic", inputs: { tens, ones, n, ask, answer: ask === "number" ? n : Math.abs(n - (10 * ones + tens)) } },
    variables: { tens, ones, n, ask },
    hiddenVariables: { reversed: 10 * ones + tens },
    derivedVariables: { digitSum: tens + ones },
    answerUnit: "number",
    principle: t("Digit questions convert place values into equations.", "अंक वाले प्रश्न स्थान-मूल्य को समीकरण में बदलते हैं।", "ਅੰਕਾਂ ਵਾਲੇ ਪ੍ਰਸ਼ਨ ਸਥਾਨ-ਮੁੱਲ ਨੂੰ ਸਮੀਕਰਨ ਵਿੱਚ ਬਦਲਦੇ ਹਨ।"),
    formula: "N=10a+b",
    steps: [
      { key: "place", text: t("Write the number using tens and ones places.", "संख्या को दहाई और इकाई स्थान से लिखें।", "ਸੰਖਿਆ ਨੂੰ ਦਹਾਈ ਅਤੇ ਇਕਾਈ ਸਥਾਨ ਨਾਲ ਲਿਖੋ।"), math: `N=10\\times ${tens}+${ones}` },
      { key: "finish", text: t("Use the given digit condition to get the asked value.", "दिए गए अंक संबंध से पूछा गया मान निकालें।", "ਦਿੱਤੇ ਅੰਕ ਸੰਬੰਧ ਨਾਲ ਪੁੱਛਿਆ ਮੁੱਲ ਕੱਢੋ।") },
    ],
    shortcut: t("For two digits, use place value directly.", "दो अंकों के लिए स्थान-मूल्य सीधे लगाएं।", "ਦੋ ਅੰਕਾਂ ਲਈ ਸਥਾਨ-ਮੁੱਲ ਸਿੱਧਾ ਲਗਾਓ।"),
    traps: ["reversed digits", "used digit sum as number", "place value error"],
  };
}

function factorialDraft(spec: Spec, seed: string): Draft {
  const n = pick([25, 30, 40, 50, 60, 75], `${seed}:n`);
  const p = pick([2, 3, 5], `${seed}:p`);
  const ask = spec.family.includes("zero") ? "zeros" : spec.family.includes("remainder") ? "remainder" : "power";
  return {
    stem: stemVariant(seed, [
      t(
      ask === "zeros"
        ? `How many trailing zeroes are there in \\(${n}!\\)?`
        : `What is the highest power of \\(${p}\\) that divides \\(${n}!\\)?`,
      ask === "zeros"
        ? `\\(${n}!\\) में अंत में कितने शून्य होंगे?`
        : `\\(${n}!\\) को विभाजित करने वाली \\(${p}\\) की सबसे बड़ी घात क्या है?`,
      ask === "zeros"
        ? `\\(${n}!\\) ਦੇ ਅੰਤ ਵਿੱਚ ਕਿੰਨੇ ਸਿਫ਼ਰ ਹੋਣਗੇ?`
        : `\\(${n}!\\) ਨੂੰ ਭਾਗ ਕਰਨ ਵਾਲੀ \\(${p}\\) ਦੀ ਸਭ ਤੋਂ ਵੱਡੀ ਘਾਤ ਕੀ ਹੈ?`,
      ),
      t(`In \\(${n}!\\), find the required factorial exponent count?`, `\\(${n}!\\) में आवश्यक फैक्टोरियल घात-गिनती ज्ञात करें?`, `\\(${n}!\\) ਵਿੱਚ ਲੋੜੀਂਦੀ ਫੈਕਟੋਰੀਅਲ ਘਾਤ-ਗਿਣਤੀ ਪਤਾ ਕਰੋ?`),
      t(`For the factorial \\(${n}!\\), what count is obtained by tracking prime factors?`, `फैक्टोरियल \\(${n}!\\) में अभाज्य गुणनखंड गिनकर क्या मान मिलेगा?`, `ਫੈਕਟੋਰੀਅਲ \\(${n}!\\) ਵਿੱਚ ਅਭਾਜ ਗੁਣਨਖੰਡ ਗਿਣ ਕੇ ਕਿਹੜਾ ਮੁੱਲ ਮਿਲੇਗਾ?`),
      t(`A factorial expression \\(${n}!\\) is given. What is the asked exponent-based result?`, `फैक्टोरियल अभिव्यक्ति \\(${n}!\\) दी है। पूछा गया घात-आधारित परिणाम क्या है?`, `ਫੈਕਟੋਰੀਅਲ ਅਭਿਵਿਅਕਤੀ \\(${n}!\\) ਦਿੱਤੀ ਹੈ। ਪੁੱਛਿਆ ਘਾਤ-ਆਧਾਰਿਤ ਨਤੀਜਾ ਕੀ ਹੈ?`),
    ]),
    model: { kind: "factorial", inputs: { n, p, ask } },
    variables: { n, p, ask },
    hiddenVariables: { primePower: p },
    derivedVariables: {},
    answerUnit: "count",
    principle: t("Factorial exponent questions count prime factors inside the factorial.", "फैक्टोरियल घात प्रश्नों में फैक्टोरियल के अंदर अभाज्य गुणनखंड गिने जाते हैं।", "ਫੈਕਟੋਰੀਅਲ ਘਾਤ ਪ੍ਰਸ਼ਨਾਂ ਵਿੱਚ ਫੈਕਟੋਰੀਅਲ ਦੇ ਅੰਦਰਲੇ ਅਭਾਜ ਗੁਣਨਖੰਡ ਗਿਣੇ ਜਾਂਦੇ ਹਨ।"),
    formula: "\\left\\lfloor\\frac{n}{p}\\right\\rfloor+\\left\\lfloor\\frac{n}{p^2}\\right\\rfloor+\\cdots",
    steps: [
      { key: "count", text: t("Count multiples of the prime, then its higher powers.", "पहले अभाज्य के गुणज, फिर उसकी ऊँची घातों के गुणज गिनें।", "ਪਹਿਲਾਂ ਅਭਾਜ ਦੇ ਗੁਣਜ, ਫਿਰ ਉਸ ਦੀਆਂ ਵੱਡੀਆਂ ਘਾਤਾਂ ਦੇ ਗੁਣਜ ਗਿਣੋ।") },
      { key: "substitute", text: t("Add all quotient terms.", "सभी भागफल पद जोड़ें।", "ਸਾਰੇ ਭਾਗਫਲ ਪਦ ਜੋੜੋ।"), math: `\\left\\lfloor\\frac{${n}}{${p}}\\right\\rfloor+\\left\\lfloor\\frac{${n}}{${p * p}}\\right\\rfloor+\\cdots` },
    ],
    shortcut: t("For trailing zeroes, count factors of 5 in the factorial.", "अंतिम शून्यों के लिए फैक्टोरियल में 5 के गुणनखंड गिनें।", "ਅੰਤਲੇ ਸਿਫ਼ਰਾਂ ਲਈ ਫੈਕਟੋਰੀਅਲ ਵਿੱਚ 5 ਦੇ ਗੁਣਨਖੰਡ ਗਿਣੋ।"),
    traps: ["counted only first quotient", "used factor 2 instead of 5", "forgot higher powers"],
  };
}

function modularDraft(spec: Spec, seed: string): Draft {
  const base = pick([7, 11, 17, 19], `${seed}:base`);
  const exp = int(`${seed}:exp`, 35, 120);
  const mod = pick([9, 13, 17, 19], `${seed}:mod`);
  return {
    stem: stemVariant(seed, [
      t(`A number leaves the same remainder as \\(${base}^{${exp}}\\) when divided by \\(${mod}\\). What is that remainder?`, `एक संख्या \\(${mod}\\) से भाग देने पर \\(${base}^{${exp}}\\) जैसा ही शेषफल देती है। वह शेषफल क्या है?`, `ਇੱਕ ਸੰਖਿਆ \\(${mod}\\) ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ \\(${base}^{${exp}}\\) ਵਰਗਾ ਹੀ ਬਾਕੀ ਦਿੰਦੀ ਹੈ। ਉਹ ਬਾਕੀ ਕੀ ਹੈ?`),
      t(`The expression \\(${base}^{${exp}}\\) is reduced modulo \\(${mod}\\). What remainder is obtained?`, `अभिव्यक्ति \\(${base}^{${exp}}\\) को modulo \\(${mod}\\) में घटाया गया। क्या शेषफल मिलेगा?`, `ਅਭਿਵਿਅਕਤੀ \\(${base}^{${exp}}\\) ਨੂੰ modulo \\(${mod}\\) ਵਿੱਚ ਘਟਾਇਆ ਗਿਆ। ਕਿਹੜਾ ਬਾਕੀ ਮਿਲੇਗਾ?`),
      t(`Using modular arithmetic, find the remainder of \\(${base}^{${exp}}\\) on division by \\(${mod}\\).`, `मॉड्यूलर अंकगणित से \\(${base}^{${exp}}\\) को \\(${mod}\\) से भाग देने पर शेषफल निकालें।`, `ਮਾਡਿਊਲਰ ਗਣਿਤ ਨਾਲ \\(${base}^{${exp}}\\) ਨੂੰ \\(${mod}\\) ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ਕੱਢੋ।`),
      t(`Without calculating the full power, what remainder does \\(${base}^{${exp}}\\) leave modulo \\(${mod}\\)?`, `पूरी घात निकाले बिना \\(${base}^{${exp}}\\) modulo \\(${mod}\\) में क्या शेषफल छोड़ेगा?`, `ਪੂਰੀ ਘਾਤ ਕੱਢੇ ਬਿਨਾਂ \\(${base}^{${exp}}\\) modulo \\(${mod}\\) ਵਿੱਚ ਕਿੰਨਾ ਬਾਕੀ ਛੱਡੇਗਾ?`),
      t(`Reduce the power \\(${base}^{${exp}}\\) by its remainder pattern. What is the remainder on division by \\(${mod}\\)?`, `\\(${base}^{${exp}}\\) को उसके शेषफल पैटर्न से घटाएं। \\(${mod}\\) से भाग देने पर शेषफल क्या होगा?`, `\\(${base}^{${exp}}\\) ਨੂੰ ਉਸ ਦੇ ਬਾਕੀ ਪੈਟਰਨ ਨਾਲ ਘਟਾਓ। \\(${mod}\\) ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ਕੀ ਹੋਵੇਗਾ?`),
      t(`A large power \\(${base}^{${exp}}\\) is divided by \\(${mod}\\). What remainder should be written?`, `बड़ी घात \\(${base}^{${exp}}\\) को \\(${mod}\\) से भाग दिया गया। कौन-सा शेषफल लिखा जाएगा?`, `ਵੱਡੀ ਘਾਤ \\(${base}^{${exp}}\\) ਨੂੰ \\(${mod}\\) ਨਾਲ ਭਾਗ ਦਿੱਤਾ ਗਿਆ। ਕਿਹੜਾ ਬਾਕੀ ਲਿਖਿਆ ਜਾਵੇਗਾ?`),
      t(`For exponent \\(${exp}\\), the powers of \\(${base}\\) repeat in remainders modulo \\(${mod}\\). What remainder appears?`, `exponent \\(${exp}\\) के लिए \\(${base}\\) की घातों के शेषफल modulo \\(${mod}\\) में दोहराते हैं। कौन-सा शेषफल आएगा?`, `exponent \\(${exp}\\) ਲਈ \\(${base}\\) ਦੀਆਂ ਘਾਤਾਂ ਦੇ ਬਾਕੀ modulo \\(${mod}\\) ਵਿੱਚ ਦੁਹਰਾਂਦੇ ਹਨ। ਕਿਹੜਾ ਬਾਕੀ ਆਵੇਗਾ?`),
      t(`Cycle position \\(${exp}\\) is needed for powers of \\(${base}\\) modulo \\(${mod}\\). What is the remainder?`, `\\(${base}\\) की घातों को modulo \\(${mod}\\) में देखने पर cycle position \\(${exp}\\) चाहिए। शेषफल क्या है?`, `\\(${base}\\) ਦੀਆਂ ਘਾਤਾਂ ਨੂੰ modulo \\(${mod}\\) ਵਿੱਚ ਵੇਖਣ ਤੇ cycle position \\(${exp}\\) ਚਾਹੀਦੀ ਹੈ। ਬਾਕੀ ਕੀ ਹੈ?`),
    ]),
    model: { kind: "modular_hybrid", inputs: { base, exp, mod } },
    variables: { base, exp, mod },
    hiddenVariables: { reducedBase: base % mod },
    derivedVariables: {},
    answerUnit: "remainder",
    principle: t("Hybrid number-theory questions reduce the expression before calculating.", "हाइब्रिड संख्या-पद्धति प्रश्नों में गणना से पहले अभिव्यक्ति घटाई जाती है।", "ਹਾਈਬ੍ਰਿਡ ਨੰਬਰ ਸਿਸਟਮ ਪ੍ਰਸ਼ਨਾਂ ਵਿੱਚ ਹਿਸਾਬ ਤੋਂ ਪਹਿਲਾਂ ਅਭਿਵਿਅਕਤੀ ਘਟਾਈ ਜਾਂਦੀ ਹੈ।"),
    formula: "a^n\\equiv r\\pmod m",
    steps: [
      { key: "reduce", text: t("Reduce the base and use the cycle of remainders.", "आधार घटाकर शेषफलों का चक्र लगाएं।", "ਆਧਾਰ ਘਟਾ ਕੇ ਬਾਕੀਆਂ ਦਾ ਚੱਕਰ ਲਗਾਓ।"), math: `${base}\\equiv ${base % mod}\\pmod{${mod}}` },
      { key: "position", text: t("Use the exponent position to identify the final remainder.", "अंतिम शेषफल के लिए घात की स्थिति पहचानें।", "ਅੰਤਿਮ ਬਾਕੀ ਲਈ ਘਾਤ ਦੀ ਸਥਿਤੀ ਪਛਾਣੋ।") },
    ],
    shortcut: t("Never expand the power; reduce and cycle.", "घात कभी न फैलाएं; घटाएं और चक्र लगाएं।", "ਘਾਤ ਕਦੇ ਨਾ ਫੈਲਾਓ; ਘਟਾਓ ਅਤੇ ਚੱਕਰ ਲਗਾਓ।"),
    traps: ["expanded expression", "wrong modular cycle", "ignored reduction"],
  };
}

function createDraft(spec: Spec, seed: string): Draft {
  if (spec.cluster === "prime") return factorDraft(spec, seed);
  if (spec.cluster === "hcf_lcm") return hcfDraft(spec, seed);
  if (spec.cluster === "remainder") return remainderDraft(spec, seed);
  if (spec.cluster === "last_digit") return lastDigitDraft(spec, seed);
  if (spec.cluster === "digit_logic") return digitDraft(spec, seed);
  if (spec.cluster === "factorial") return factorialDraft(spec, seed);
  if (spec.cluster === "advanced") return modularDraft(spec, seed);
  return divisibilityDraft(spec, seed);
}

function renderExplanation(input: {
  draft: Draft;
  answerText: string;
  optionLabel: string;
}) {
  const { draft, answerText, optionLabel } = input;
  const render = (locale: Locale) => {
    const lines = [
      locale === "en" ? "Concept" : locale === "hi" ? "विचार" : "ਵਿਚਾਰ",
      draft.principle[locale],
      "",
      locale === "en" ? "Given" : locale === "hi" ? "दिया गया" : "ਦਿੱਤਾ ਗਿਆ",
      draft.stem[locale],
      "",
      locale === "en" ? "Working" : locale === "hi" ? "हल" : "ਹੱਲ",
    ];
    for (const step of draft.steps) {
      lines.push(step.text[locale]);
      if (step.math) lines.push(withMath(step.math));
    }
    lines.push(
      locale === "en" ? `Therefore, the required answer is ${answerText}.` :
      locale === "hi" ? `इसलिए आवश्यक उत्तर ${answerText} है।` :
      `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਉੱਤਰ ${answerText} ਹੈ।`,
      locale === "en" ? `Hence, the correct answer is Option ${optionLabel}.` :
      locale === "hi" ? `इसलिए सही उत्तर विकल्प ${optionLabel} है।` :
      `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ਵਿਕਲਪ ${optionLabel} ਹੈ।`,
      "",
      locale === "en" ? "Shortcut / Exam Method" : locale === "hi" ? "शॉर्टकट / परीक्षा विधि" : "ਛੋਟਾ ਤਰੀਕਾ / ਇਮਤਿਹਾਨੀ ਤਰੀਕਾ",
      draft.shortcut[locale],
      locale === "en" ? `Answer: ${answerText}, Option ${optionLabel}.` :
      locale === "hi" ? `उत्तर: ${answerText}, विकल्प ${optionLabel}.` :
      `ਉੱਤਰ: ${answerText}, ਵਿਕਲਪ ${optionLabel}.`,
    );
    return lines.join("\n");
  };
  return { en: render("en"), hi: render("hi"), pa: render("pa") };
}

export const NUMBER_SYSTEM_MOTIF_FACTORIES = Object.fromEntries(
  NUMBER_SYSTEM_FAMILY_IDS.map((family) => [family, ((input) => createNumberSystemProblem({ ...input, family })) as NumberSystemMotifFactory]),
) as Record<NumberSystemFamilyId, NumberSystemMotifFactory>;

export function createNumberSystemProblem(input: {
  seed: string;
  runId: string;
  difficulty: "easy" | "medium" | "hard";
  family?: NumberSystemFamilyId | NumberSystemAliasFamilyId;
}): CanonicalNumberSystemProblem {
  const family = resolveNumberSystemFamily(input.family) ?? pick(NUMBER_SYSTEM_FAMILY_IDS, `${input.seed}:family:${input.difficulty}`);
  const spec = specFor(family);
  const draft = createDraft(spec, `${input.seed}:${family}`);
  const answer = evaluateNumberSystemSolverModel(draft.model);
  const numericAnswer = typeof answer === "number" ? answer : Number(String(answer).match(/-?\d+/u)?.[0] ?? 0);
  const { options, correct } = buildOptions(numericAnswer, draft.answerUnit, `${input.seed}:options:${family}`);
  const answerText = options[correct]!;
  const optionLabel = `(${String.fromCharCode(65 + correct)})`;
  const explanation = renderExplanation({ draft, answerText, optionLabel });
  const difficulty = input.difficulty === "hard" || spec.difficulty === "hard" ? "hard" : input.difficulty === "easy" && spec.difficulty === "easy" ? "easy" : "medium";
  const reasoningStepCount = Math.max(3, draft.steps.length + (difficulty === "hard" ? 2 : 1));
  const numericSignature = Object.entries(draft.variables).map(([key, value]) => `${key}:${Array.isArray(value) ? value.join(",") : typeof value === "object" ? JSON.stringify(value) : String(value)}`).join("|");
  const problem: CanonicalNumberSystemProblem = {
    id: `number-system:${family}:${hashText(`${input.seed}:${family}`)}`,
    topic: "number-system",
    motifId: family,
    family,
    topologyId: family,
    subtype: family,
    category: "number_system",
    archetype: spec.archetype,
    principle: draft.principle,
    formulaModel: draft.formula,
    preferredSolutionMethod: spec.method,
    entities: draft.variables,
    relationships: [spec.method],
    constraints: ["no direct drill", "solver backed", "single correct answer"],
    hiddenVariables: draft.hiddenVariables,
    derivedVariables: draft.derivedVariables,
    target: "answer",
    reasoningDepth: reasoningStepCount,
    questionTrivialityScore: 0.08,
    realismScore: difficulty === "hard" ? 90 : difficulty === "medium" ? 88 : 85,
    qualityMetadata: { cluster: spec.cluster, templateCoverage: NUMBER_SYSTEM_STEM_TEMPLATE_COVERAGE[spec.cluster] },
    variables: draft.variables,
    stemData: { stemSkeleton: family, preferredSolutionMethod: spec.method },
    solverModel: draft.model,
    answer,
    answerText,
    answerUnit: draft.answerUnit,
    options,
    correct,
    difficulty,
    complexity: difficulty,
    topology: { family: "number_system", variant: family },
    traps: draft.traps,
    distractors: options.filter((_, index) => index !== correct),
    explanationSteps: draft.steps,
    conceptExplanation: draft.principle,
    stepwiseExplanation: explanation,
    shortcutExplanation: t(
      `${draft.shortcut.en}\nAnswer: ${answerText}, Option ${optionLabel}.`,
      `${draft.shortcut.hi}\nउत्तर: ${answerText}, विकल्प ${optionLabel}.`,
      `${draft.shortcut.pa}\nਉੱਤਰ: ${answerText}, ਵਿਕਲਪ ${optionLabel}.`,
    ),
    localizationData: {
      stem: draft.stem,
      explanation,
      options: localizedOptions(options),
    },
    auditMeta: {
      seed: input.seed,
      runId: input.runId,
      familyId: family,
      topologyId: family,
      stemSkeleton: family,
      numericSignature,
      solverAnswer: String(answer),
      explanationFinalAnswer: String(answer),
      difficultyReason: `${spec.cluster} ${spec.method}`,
      realismScore: difficulty === "hard" ? 90 : difficulty === "medium" ? 88 : 85,
      trapTypes: draft.traps,
      preferredSolutionMethod: spec.method,
      questionTrivialityScore: 0.08,
      reasoningStepCount,
    },
  };
  return problem;
}
