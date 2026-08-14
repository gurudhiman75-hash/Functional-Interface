import {
  add,
  div,
  eq,
  hash,
  mul,
  rat,
  sub,
  type Rational,
} from "./cp003-exam-model";
import {
  INT_CP005_QL_IDS,
  INT_CP005_REGISTRY_V2,
  INT_CP005_SOURCE_SATURATION,
  generateIntCp005QuestionV4,
  verifyIntCp005Answer,
  type IntCp005Locale,
  type IntCp005QlId,
  type IntCp005QuestionV4,
} from "./cp005-variable-growth-decay-runtime-v4";

export const INT_CP005_RUNTIME_VERSION_V5 = "INT-CP-005-VARIABLE-GROWTH-DECAY-v5" as const;
export { INT_CP005_QL_IDS, INT_CP005_REGISTRY_V2, INT_CP005_SOURCE_SATURATION, verifyIntCp005Answer };
export type { IntCp005Locale, IntCp005QlId };

export type IntCp005QuestionV5 = Omit<IntCp005QuestionV4, "runtimeVersion"> & {
  readonly runtimeVersion: typeof INT_CP005_RUNTIME_VERSION_V5;
};

const RATE_POOL = Object.freeze([5n, 8n, 10n, 12n, 15n, 20n, 25n, 30n].map((value) => rat(value)));
const BASE_MULTIPLIERS = Object.freeze([100n, 200n, 250n, 400n, 500n, 800n, 1000n, 1250n]);

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function mix32(input: number): number {
  let x = input >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

function stream(seed: string): () => number {
  let state = mix32(hash(`${seed}:cp005-v5-plan-stream`) >>> 0);
  return () => {
    state = mix32((state + 0x9e3779b9) >>> 0);
    return state;
  };
}

function growthFactor(rate: Rational): Rational {
  return add(rat(1n), div(rate, rat(100n)));
}

function product(values: readonly Rational[]): Rational {
  return values.reduce((acc, value) => mul(acc, value), rat(1n));
}

function productGrowth(rates: readonly Rational[]): Rational {
  return product(rates.map(growthFactor));
}

function absRat(value: Rational): Rational {
  return value.numerator < 0n ? rat(-value.numerator, value.denominator) : value;
}

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) [x, y] = [y, x % y];
  return x || 1n;
}

function lcm(a: bigint, b: bigint): bigint {
  return (a / gcd(a, b)) * b;
}

function stateForPlanComparison(seed: string): Extract<IntCp005QuestionV4["mathematicalState"], { qlId: "INT-QL-095" }> {
  const next = stream(seed);
  const planARates = Object.freeze(Array.from({ length: 3 }, () => RATE_POOL[next() % RATE_POOL.length]!));
  let planBRates = Object.freeze(Array.from({ length: 3 }, () => RATE_POOL[next() % RATE_POOL.length]!));
  let factorA = productGrowth(planARates);
  let factorB = productGrowth(planBRates);

  for (let guard = 0; guard < 12 && eq(factorA, factorB); guard += 1) {
    const mutable = [...planBRates];
    const slot = next() % 3;
    mutable[slot] = RATE_POOL[next() % RATE_POOL.length]!;
    planBRates = Object.freeze(mutable);
    factorB = productGrowth(planBRates);
  }
  if (eq(factorA, factorB)) {
    planBRates = Object.freeze([rat(8n), rat(15n), rat(25n)]);
    factorB = productGrowth(planBRates);
  }

  const denominatorBase = lcm(factorA.denominator, factorB.denominator);
  const multiplier = BASE_MULTIPLIERS[next() % BASE_MULTIPLIERS.length]!;
  const initial = rat(denominatorBase * multiplier);
  return deepFreeze({ qlId: "INT-QL-095", context: "INVESTMENT", initial, planARates, planBRates });
}

function amount(initial: Rational, rates: readonly Rational[]): Rational {
  return mul(initial, productGrowth(rates));
}

function simpleAmount(initial: Rational, rates: readonly Rational[]): Rational {
  const totalRate = rates.reduce((acc, value) => add(acc, value), rat(0n));
  return mul(initial, add(rat(1n), div(totalRate, rat(100n))));
}

function indianInteger(value: bigint): string {
  const sign = value < 0n ? "-" : "";
  const source = (value < 0n ? -value : value).toString();
  if (source.length <= 3) return sign + source;
  const tail = source.slice(-3);
  let head = source.slice(0, -3);
  const groups: string[] = [];
  while (head.length > 2) {
    groups.unshift(head.slice(-2));
    head = head.slice(0, -2);
  }
  if (head) groups.unshift(head);
  return `${sign}${groups.join(",")},${tail}`;
}

function money(value: Rational): string {
  if (value.denominator !== 1n) throw new Error(`INT-QL-095/V5: non-integral learner money ${value.numerator}/${value.denominator}`);
  return `₹${indianInteger(value.numerator)}`;
}

function rateText(value: Rational): string {
  if (value.denominator !== 1n) throw new Error("INT-QL-095/V5: non-integral rate profile");
  return `${value.numerator}%`;
}

function mathNumber(value: Rational): string {
  if (value.denominator === 1n) return value.numerator.toString();
  return `\\frac{${value.numerator}}{${value.denominator}}`;
}

function ratesLatex(rates: readonly Rational[]): string {
  return rates.map((rate) => `\\left(1+\\frac{${rate.numerator}}{100}\\right)`).join("\\times");
}

function tableFor(state: Extract<IntCp005QuestionV4["mathematicalState"], { qlId: "INT-QL-095" }>, locale: IntCp005Locale) {
  const headers = locale === "en-IN" ? ["Year", "Plan A", "Plan B"] : locale === "hi-IN" ? ["वर्ष", "योजना A", "योजना B"] : ["ਸਾਲ", "ਯੋਜਨਾ A", "ਯੋਜਨਾ B"];
  const rows = state.planARates.map((rate, index) => Object.freeze([String(index + 1), rateText(rate), rateText(state.planBRates[index]!) ]));
  return deepFreeze({ headers: Object.freeze(headers), rows: Object.freeze(rows) });
}

function tableMarkdown(table: { readonly headers: readonly string[]; readonly rows: readonly (readonly string[])[] }): string {
  return [`| ${table.headers.join(" | ")} |`, `| ${table.headers.map(() => "---").join(" | ")} |`, ...table.rows.map((row) => `| ${row.join(" | ")} |`)].join("\n");
}

function presentationFor(state: Extract<IntCp005QuestionV4["mathematicalState"], { qlId: "INT-QL-095" }>, locale: IntCp005Locale) {
  const table = tableFor(state, locale);
  const lead = locale === "en-IN"
    ? `The same sum of ${money(state.initial)} is invested for three years under the two plans shown below.`
    : locale === "hi-IN"
      ? `समान राशि ${money(state.initial)} को तीन वर्षों के लिए नीचे दी गई दो योजनाओं में निवेश किया जाता है।`
      : `ਇੱਕੋ ਜਿਹੀ ਰਕਮ ${money(state.initial)} ਨੂੰ ਤਿੰਨ ਸਾਲਾਂ ਲਈ ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਦੋ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਨਿਵੇਸ਼ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।`;
  const prompt = locale === "en-IN" ? "By how much do the final amounts differ?" : locale === "hi-IN" ? "अंतिम राशियों में कितना अंतर होगा?" : "ਅੰਤਿਮ ਰਕਮਾਂ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੋਵੇਗਾ?";
  return deepFreeze({ markdown: `${lead}\n\n${tableMarkdown(table)}\n\n${prompt}`, prompt, table });
}

function feedbackMap(source: IntCp005QuestionV4): ReadonlyMap<string, string> {
  return new Map(source.options.map((option) => [option.misconceptionId, option.studentFeedback]));
}

function optionText(value: Rational): string {
  return money(value);
}

function optionsFor(
  source: IntCp005QuestionV4,
  state: Extract<IntCp005QuestionV4["mathematicalState"], { qlId: "INT-QL-095" }>,
  seed: string,
) {
  const a = amount(state.initial, state.planARates);
  const b = amount(state.initial, state.planBRates);
  const correct = absRat(sub(a, b));
  const simpleDifference = absRat(sub(simpleAmount(state.initial, state.planARates), simpleAmount(state.initial, state.planBRates)));
  const feedback = feedbackMap(source);
  const candidates = [
    { value: correct, misconceptionId: "CORRECT", isCorrect: true },
    { value: simpleDifference, misconceptionId: "SIMPLE_PLAN_DIFFERENCE", isCorrect: false },
    { value: a, misconceptionId: "PLAN_A_AMOUNT", isCorrect: false },
    { value: b, misconceptionId: "PLAN_B_AMOUNT", isCorrect: false },
  ];
  const unique: typeof candidates = [];
  for (const candidate of candidates) {
    if (!unique.some((entry) => eq(entry.value, candidate.value))) unique.push(candidate);
  }
  let bump = 100n;
  while (unique.length < 4) {
    const value = add(correct, rat(bump));
    if (!unique.some((entry) => eq(entry.value, value))) unique.push({ value, misconceptionId: "NEARBY_ARITHMETIC", isCorrect: false });
    bump += 100n;
  }

  const items = unique.slice(0, 4).map((candidate) => deepFreeze({
    text: optionText(candidate.value),
    value: candidate.value,
    misconceptionId: candidate.misconceptionId,
    studentFeedback: feedback.get(candidate.misconceptionId) ?? (source.locale === "en-IN" ? "This result does not satisfy the complete comparison." : source.locale === "hi-IN" ? "यह परिणाम पूरी तुलना को संतुष्ट नहीं करता।" : "ਇਹ ਨਤੀਜਾ ਪੂਰੀ ਤੁਲਨਾ ਨੂੰ ਪੂਰਾ ਨਹੀਂ ਕਰਦਾ।"),
    isCorrect: candidate.isCorrect,
  }));

  const next = stream(`${seed}:option-order`);
  for (let index = items.length - 1; index > 0; index -= 1) {
    const target = next() % (index + 1);
    [items[index], items[target]] = [items[target]!, items[index]!];
  }
  return deepFreeze(items);
}

function explanationFor(
  source: IntCp005QuestionV4,
  state: Extract<IntCp005QuestionV4["mathematicalState"], { qlId: "INT-QL-095" }>,
  solution: Rational,
  locale: IntCp005Locale,
) {
  const a = amount(state.initial, state.planARates);
  const b = amount(state.initial, state.planBRates);
  const prefix = locale === "en-IN" ? "Formula:" : locale === "hi-IN" ? "सूत्र:" : "ਸੂਤਰ:";
  const planValues = locale === "en-IN" ? "Plan values:" : locale === "hi-IN" ? "योजना मान:" : "ਯੋਜਨਾ ਮੁੱਲ:";
  const difference = locale === "en-IN" ? "Difference:" : locale === "hi-IN" ? "अंतर:" : "ਅੰਤਰ:";
  const final = locale === "en-IN" ? `Therefore, the difference is ${money(solution)}.` : locale === "hi-IN" ? `अतः अंतर ${money(solution)} है।` : `ਇਸ ਲਈ ਅੰਤਰ ${money(solution)} ਹੈ।`;
  return deepFreeze({
    keyIdea: source.explanation.keyIdea,
    steps: Object.freeze([
      `${prefix} \\(A=P\\prod(1+r_{A,k}/100),\\quad B=P\\prod(1+r_{B,k}/100)\\).`,
      `${planValues} \\(A=${mathNumber(state.initial)}\\times${ratesLatex(state.planARates)}=${mathNumber(a)},\\quad B=${mathNumber(state.initial)}\\times${ratesLatex(state.planBRates)}=${mathNumber(b)}\\).`,
      `${difference} \\(|A-B|=${mathNumber(solution)}\\).`,
      final,
    ]),
    finalAnswer: money(solution),
    commonMistake: source.explanation.commonMistake,
  });
}

function fingerprint(state: Extract<IntCp005QuestionV4["mathematicalState"], { qlId: "INT-QL-095" }>): string {
  const r = (value: Rational) => `${value.numerator}/${value.denominator}`;
  return `INT-QL-095|${r(state.initial)}|${state.planARates.map(r).join(",")}|${state.planBRates.map(r).join(",")}`;
}

export function generateIntCp005QuestionV5(
  qlId: IntCp005QlId,
  seed: string,
  locale: IntCp005Locale = "en-IN",
): IntCp005QuestionV5 {
  const source = generateIntCp005QuestionV4(qlId, seed, locale);
  if (qlId !== "INT-QL-095") return deepFreeze({ ...source, runtimeVersion: INT_CP005_RUNTIME_VERSION_V5 });

  const state = stateForPlanComparison(seed);
  const solution = absRat(sub(amount(state.initial, state.planARates), amount(state.initial, state.planBRates)));
  if (!verifyIntCp005Answer(state, solution)) throw new Error(`${qlId}/${seed}: V5 plan solution fails independent verifier`);
  const options = optionsFor(source, state, seed);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0 || options.filter((option) => option.isCorrect).length !== 1) throw new Error(`${qlId}/${seed}: V5 plan correct-option ownership failure`);

  return deepFreeze({
    ...source,
    runtimeVersion: INT_CP005_RUNTIME_VERSION_V5,
    seed,
    mathematicalState: state,
    mathematicalFingerprint: fingerprint(state),
    representation: "COMPARISON_TABLE",
    presentation: presentationFor(state, locale),
    options,
    correctIndex,
    correctAnswer: options[correctIndex]!.text,
    solution,
    explanation: explanationFor(source, state, solution, locale),
  });
}
