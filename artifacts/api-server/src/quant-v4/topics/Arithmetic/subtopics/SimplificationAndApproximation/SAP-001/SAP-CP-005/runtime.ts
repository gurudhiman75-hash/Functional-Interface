export type SapCp005Difficulty = "EASY" | "MEDIUM" | "HARD";
export type SapCp005TaskDirection = "FORWARD" | "INVERSE" | "DIAGNOSIS" | "STRATEGY";

export const SAP_CP005_PROTOTYPE_IDS = [
  "SAP-CP005-PROT-MULTI-FRACTION-CHAIN",
  "SAP-CP005-PROT-FACTOR-EXTRACTION-CANCEL",
  "SAP-CP005-PROT-RATIO-OF-PRODUCTS",
  "SAP-CP005-PROT-CONSECUTIVE-PRODUCT-RATIO",
  "SAP-CP005-PROT-LONG-FACTORIAL-RATIO",
  "SAP-CP005-PROT-PRODUCT-OF-RECIPROCALS",
  "SAP-CP005-PROT-DIFFERENCE-OF-SQUARES",
  "SAP-CP005-PROT-NUMERIC-CONJUGATE-PRODUCT",
  "SAP-CP005-PROT-NESTED-RECIPROCAL-CHAIN",
  "SAP-CP005-PROT-TELESCOPING-SUM",
  "SAP-CP005-PROT-TELESCOPING-PRODUCT",
  "SAP-CP005-PROT-ONE-PLUS-MINUS-CHAIN",
  "SAP-CP005-PROT-MISSING-FACTOR-CANCELLATION",
  "SAP-CP005-PROT-ILLEGAL-CANCELLATION-DIAGNOSIS",
] as const;

export type SapCp005PrototypeId = typeof SAP_CP005_PROTOTYPE_IDS[number];

export interface SapCp005CatalogueEntry {
  prototypeId: SapCp005PrototypeId;
  proposedPermanentQlId: string;
  title: string;
  difficulty: SapCp005Difficulty;
  taskDirection: SapCp005TaskDirection;
  authorityScope: string;
}

const TITLES: readonly [string, SapCp005Difficulty, SapCp005TaskDirection, string][] = [
  ["Multi-fraction product chain", "MEDIUM", "FORWARD", "cancellation across a multi-fraction product chain"],
  ["Factor extraction before cancellation", "MEDIUM", "FORWARD", "numeric factor extraction followed by cancellation"],
  ["Ratio of products", "MEDIUM", "FORWARD", "ratio of products"],
  ["Consecutive-product ratio", "EASY", "FORWARD", "consecutive-integer product ratios"],
  ["Long factorial ratio", "MEDIUM", "FORWARD", "long factorial ratios where expansion would be wasteful"],
  ["Product of reciprocals", "EASY", "FORWARD", "product of reciprocals"],
  ["Difference of squares", "MEDIUM", "FORWARD", "numeric difference-of-squares products"],
  ["Numeric conjugate product", "HARD", "FORWARD", "exact numeric conjugate products"],
  ["Nested reciprocal chain", "HARD", "FORWARD", "nested reciprocal chains when structure is central"],
  ["Bounded telescoping sum", "MEDIUM", "FORWARD", "bounded telescoping sums"],
  ["Bounded telescoping product", "MEDIUM", "FORWARD", "bounded telescoping products"],
  ["Product of 1 ± 1/n factors", "HARD", "FORWARD", "products of 1 ± 1/n patterns"],
  ["Missing factor from cancellation state", "MEDIUM", "INVERSE", "missing factor recoverable from a cancellation state"],
  ["Illegal cancellation diagnosis", "MEDIUM", "DIAGNOSIS", "identifying illegal cancellation across addition or subtraction"],
];

export const SAP_CP005_CATALOGUE: readonly SapCp005CatalogueEntry[] =
  SAP_CP005_PROTOTYPE_IDS.map((prototypeId, index) => ({
    prototypeId,
    proposedPermanentQlId: `SAP-QL-${String(72 + index).padStart(3, "0")}`,
    title: TITLES[index]![0],
    difficulty: TITLES[index]![1],
    taskDirection: TITLES[index]![2],
    authorityScope: TITLES[index]![3],
  }));

export const SAP_CP005_PROPOSED_QL_BY_PROTOTYPE = Object.fromEntries(
  SAP_CP005_CATALOGUE.map((entry) => [entry.prototypeId, entry.proposedPermanentQlId]),
) as Record<SapCp005PrototypeId, string>;

export interface SapCp005Option {
  value: string;
  isCorrect: boolean;
  misconceptionId: string | null;
  analysis: string;
}

export interface SapCp005Explanation {
  coreConcept: string;
  steps: readonly string[];
  finalAnswer: string;
  cancellationMap: readonly string[];
}

export interface SapCp005Lifecycle {
  permanentQlId: null;
  contentStatus: "ENGLISH_REVIEW_CANDIDATE";
  active: false;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
}

export interface SapCp005Oracle {
  kind: SapCp005PrototypeId;
  data: Readonly<Record<string, number>>;
}

export interface SapCp005Package {
  prototypeId: SapCp005PrototypeId;
  proposedPermanentQlId: string;
  seed: number;
  difficulty: SapCp005Difficulty;
  taskDirection: SapCp005TaskDirection;
  stem: string;
  canonicalAnswer: string;
  options: readonly SapCp005Option[];
  correctIndex: number;
  explanation: SapCp005Explanation;
  oracle: SapCp005Oracle;
  canonicalPayloadKey: string;
  generationIdentity: string;
  validation: { ok: boolean; errors: readonly string[] };
  lifecycle: SapCp005Lifecycle;
}

interface Rational {
  n: bigint;
  d: bigint;
}

const LIFECYCLE: SapCp005Lifecycle = {
  permanentQlId: null,
  contentStatus: "ENGLISH_REVIEW_CANDIDATE",
  active: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
};

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) [x, y] = [y, x % y];
  return x || 1n;
}

function rat(n: bigint | number, d: bigint | number = 1n): Rational {
  let numerator = BigInt(n);
  let denominator = BigInt(d);
  if (denominator === 0n) throw new Error("Zero denominator.");
  if (denominator < 0n) {
    numerator = -numerator;
    denominator = -denominator;
  }
  const divisor = gcd(numerator, denominator);
  return { n: numerator / divisor, d: denominator / divisor };
}

function mul(a: Rational, b: Rational): Rational {
  return rat(a.n * b.n, a.d * b.d);
}

function div(a: Rational, b: Rational): Rational {
  if (b.n === 0n) throw new Error("Division by zero.");
  return rat(a.n * b.d, a.d * b.n);
}

function add(a: Rational, b: Rational): Rational {
  return rat(a.n * b.d + b.n * a.d, a.d * b.d);
}

function sub(a: Rational, b: Rational): Rational {
  return rat(a.n * b.d - b.n * a.d, a.d * b.d);
}

function format(value: Rational): string {
  return value.d === 1n ? value.n.toString() : `${value.n}/${value.d}`;
}

function factorial(n: number): bigint {
  if (!Number.isInteger(n) || n < 0 || n > 20) throw new Error("Factorial bound exceeded.");
  let result = 1n;
  for (let value = 2; value <= n; value += 1) result *= BigInt(value);
  return result;
}

function rng(seed: number): () => number {
  let state = (seed >>> 0) || 0x6d2b79f5;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickInt(random: () => number, min: number, max: number): number {
  return min + Math.floor(random() * (max - min + 1));
}

function rotate<T>(items: readonly T[], offset: number): T[] {
  const shift = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(shift), ...items.slice(0, shift)];
}

function numericOptions(answer: Rational, seed: number): readonly SapCp005Option[] {
  const candidates = [
    { v: answer, id: null, analysis: "This is the value obtained after preserving every factor and carrying out only legal cancellations." },
    { v: add(answer, rat(1)), id: "INCOMPLETE_CANCELLATION", analysis: "This typically comes from stopping the structural reduction early and carrying an extra unit into the result." },
    { v: answer.n === 0n ? rat(2) : rat(answer.d, answer.n), id: "RECIPROCAL_FLIP", analysis: "This is the reciprocal trap: the final numerator and denominator are interchanged after the chain has already been simplified." },
    { v: sub(answer, rat(1)), id: "LOST_FACTOR", analysis: "This represents dropping or over-cancelling one surviving factor instead of preserving the exact product ratio." },
    { v: add(answer, rat(2)), id: "RAW_ARITHMETIC_SLIP", analysis: "This is a nearby arithmetic distractor produced when the visible pattern is ignored and raw multiplication is attempted." },
  ];
  const unique = new Map<string, typeof candidates[number]>();
  for (const item of candidates) {
    const key = format(item.v);
    if (!unique.has(key)) unique.set(key, item);
  }
  let bump = 3;
  while (unique.size < 4) {
    const v = add(answer, rat(bump));
    unique.set(format(v), { v, id: "RAW_ARITHMETIC_SLIP", analysis: "This distractor reflects an arithmetic slip after bypassing the intended cancellation structure." });
    bump += 1;
  }
  const selected = [...unique.values()].slice(0, 4);
  const positioned = rotate(selected, seed % 4);
  return positioned.map((item) => ({
    value: format(item.v),
    isCorrect: item.id === null,
    misconceptionId: item.id,
    analysis: item.analysis,
  }));
}

function categoricalOptions(correct: string, distractors: readonly [string, string, string][], seed: number): readonly SapCp005Option[] {
  const items: SapCp005Option[] = [
    { value: correct, isCorrect: true, misconceptionId: null, analysis: "This identifies the first mathematically valid structural decision for the displayed expression." },
    ...distractors.map(([value, misconceptionId, analysis]) => ({ value, isCorrect: false, misconceptionId, analysis })),
  ];
  return rotate(items, seed % 4);
}

interface Built {
  stem: string;
  answer: Rational | string;
  data: Record<string, number>;
  steps: string[];
  map: string[];
}

function build(prototypeId: SapCp005PrototypeId, seed: number): Built {
  const random = rng(seed * 104729 + SAP_CP005_PROTOTYPE_IDS.indexOf(prototypeId) * 7919 + 17);
  const a = pickInt(random, 2, 9);
  const b = pickInt(random, 3, 11);

  switch (prototypeId) {
    case "SAP-CP005-PROT-MULTI-FRACTION-CHAIN": {
      const x = pickInt(random, 2, 7), y = pickInt(random, 3, 9), z = pickInt(random, 2, 8);
      const answer = rat(a, b);
      return {
        stem: `Simplify: (${x}/${y}) × (${y}/${z}) × (${z * a}/${x * b}).`,
        answer,
        data: { x, y, z, a, b },
        map: [`Cancel ${y} with ${y}.`, `Cancel ${z} with the factor ${z} in ${z * a}.`, `Cancel ${x} with the factor ${x} in ${x * b}.`],
        steps: ["Write the chain as one product of numerators over one product of denominators.", `After cancelling the matching factors, only ${a}/${b} remains.`],
      };
    }
    case "SAP-CP005-PROT-FACTOR-EXTRACTION-CANCEL": {
      const k = pickInt(random, 4, 12), m = pickInt(random, 2, 7), n = pickInt(random, 2, 9);
      const p = k * m, q = k * n;
      const answer = rat(m, n);
      return {
        stem: `Simplify ${p}/${q} by extracting the common factor before dividing.`,
        answer,
        data: { k, m, n, p, q },
        map: [`${p} = ${k} × ${m}.`, `${q} = ${k} × ${n}.`, `Cancel the common factor ${k}.`],
        steps: [`Factor both numbers so the shared factor is visible: (${k}×${m})/(${k}×${n}).`, `Cancel ${k}; the reduced value is ${format(answer)}.`],
      };
    }
    case "SAP-CP005-PROT-RATIO-OF-PRODUCTS": {
      const x = pickInt(random, 2, 8), y = pickInt(random, 3, 9);
      const answer = rat(a * x * y, b * x * y);
      return {
        stem: `Find the value of (${a} × ${x} × ${y}) ÷ (${b} × ${x} × ${y}).`,
        answer,
        data: { a, b, x, y },
        map: [`Cancel the common factor ${x}.`, `Cancel the common factor ${y}.`],
        steps: ["Treat the division as a ratio of the two products.", `The repeated factors ${x} and ${y} cancel, leaving ${a}/${b}.`],
      };
    }
    case "SAP-CP005-PROT-CONSECUTIVE-PRODUCT-RATIO": {
      const n = pickInt(random, 6, 14), span = pickInt(random, 3, 5);
      let num = 1n, den = 1n;
      for (let i = 0; i < span; i += 1) num *= BigInt(n - i);
      for (let i = 1; i < span; i += 1) den *= BigInt(n - i);
      const answer = rat(num, den);
      const chain = Array.from({ length: span }, (_, i) => n - i);
      return {
        stem: `Simplify (${chain.join(" × ")}) ÷ (${chain.slice(1).join(" × ")}).`,
        answer,
        data: { n, span },
        map: chain.slice(1).map((value) => `Cancel the common factor ${value}.`),
        steps: ["The denominator is exactly the tail of the numerator product.", `All common consecutive factors cancel, leaving ${n}.`],
      };
    }
    case "SAP-CP005-PROT-LONG-FACTORIAL-RATIO": {
      const n = pickInt(random, 8, 13), k = pickInt(random, 3, 5);
      const answer = rat(factorial(n), factorial(n - k));
      const expansion = Array.from({ length: k }, (_, i) => n - i);
      return {
        stem: `Simplify ${n}! / ${n - k}! without expanding both factorials completely.`,
        answer,
        data: { n, k },
        map: [`Expand only ${n}! down to ${n - k}!: ${expansion.join(" × ")} × ${n - k}!.`, `Cancel the common ${n - k}! block.`],
        steps: [`Use ${n}! = ${expansion.join("×")}×${n - k}!.`, `After cancellation, multiply only the surviving factors ${expansion.join(", ")} to get ${format(answer)}.`],
      };
    }
    case "SAP-CP005-PROT-PRODUCT-OF-RECIPROCALS": {
      const n = pickInt(random, 4, 20);
      const answer = rat(1, n + 1);
      const factors = Array.from({ length: n }, (_, i) => {
        const v = i + 2;
        return `${v - 1}/${v}`;
      });
      return {
        stem: `Simplify the reciprocal product ${factors.join(" × ")}.`,
        answer,
        data: { n },
        map: Array.from({ length: n - 1 }, (_, i) => `The interior factor ${i + 2} cancels between a numerator and denominator position.`),
        steps: [`Write the full product and cancel each interior integer from 2 through ${n}.`, `Only 1 in the numerator and ${n + 1} in the denominator survive.`],
      };
    }
    case "SAP-CP005-PROT-DIFFERENCE-OF-SQUARES": {
      const x = pickInt(random, 8, 20), y = pickInt(random, 2, x - 2);
      const denominator = x - y;
      const answer = rat(x + y);
      return {
        stem: `Simplify (${x}² − ${y}²) / ${denominator}.`,
        answer,
        data: { x, y },
        map: [`Use ${x}² − ${y}² = (${x}−${y})(${x}+${y}).`, `Cancel the factor (${x}−${y}) = ${denominator}.`],
        steps: ["Factor the numerator as a difference of squares.", `The denominator cancels only after factorisation, leaving ${x + y}.`],
      };
    }
    case "SAP-CP005-PROT-NUMERIC-CONJUGATE-PRODUCT": {
      const x = pickInt(random, 8, 20), y = pickInt(random, 2, x - 2);
      const answer = rat(x * x - y * y);
      return {
        stem: `Evaluate (${x} + ${y})(${x} − ${y}) using the structural shortcut.`,
        answer,
        data: { x, y },
        map: ["Recognise the conjugate pair (a+b)(a−b).", "Replace it with a²−b² before multiplying large terms."],
        steps: [`(${x}+${y})(${x}−${y}) = ${x}²−${y}².`, `${x * x}−${y * y} = ${format(answer)}.`],
      };
    }
    case "SAP-CP005-PROT-NESTED-RECIPROCAL-CHAIN": {
      const x = pickInt(random, 2, 7), y = pickInt(random, 2, 8), z = pickInt(random, 2, 9);
      const inner = div(rat(y), rat(z));
      const answer = div(rat(x), inner);
      return {
        stem: `Simplify ${x} ÷ (${y} ÷ ${z}).`,
        answer,
        data: { x, y, z },
        map: [`First resolve the grouped ratio ${y} ÷ ${z} = ${y}/${z}.`, `Dividing by ${y}/${z} means multiplying by its reciprocal ${z}/${y}.`],
        steps: ["Keep the inner division grouped; do not read the expression left to right across the brackets.", `${x} × ${z}/${y} = ${format(answer)}.`],
      };
    }
    case "SAP-CP005-PROT-TELESCOPING-SUM": {
      const start = pickInt(random, 2, 20), end = start + pickInt(random, 3, 10);
      let answer = rat(0);
      const terms: string[] = [];
      for (let n = start; n <= end; n += 1) {
        answer = add(answer, sub(rat(1, n), rat(1, n + 1)));
        terms.push(`(1/${n} − 1/${n + 1})`);
      }
      return {
        stem: `Evaluate ${terms.join(" + ")}.`,
        answer,
        data: { start, end },
        map: [`Adjacent terms cancel: −1/${start + 1} with +1/${start + 1}, continuing through −1/${end} with +1/${end}.`, `Only 1/${start} − 1/${end + 1} survives.`],
        steps: ["Expand the brackets just enough to see the repeated positive and negative unit fractions.", `The surviving endpoints give 1/${start} − 1/${end + 1} = ${format(answer)}.`],
      };
    }
    case "SAP-CP005-PROT-TELESCOPING-PRODUCT": {
      const start = pickInt(random, 2, 20), end = start + pickInt(random, 3, 10);
      let answer = rat(1);
      const terms: string[] = [];
      for (let n = start; n <= end; n += 1) {
        answer = mul(answer, rat(n + 1, n));
        terms.push(`${n + 1}/${n}`);
      }
      return {
        stem: `Evaluate ${terms.join(" × ")}.`,
        answer,
        data: { start, end },
        map: ["Each interior integer cancels between one numerator and the next denominator.", `Only ${end + 1} over ${start} survives.`],
        steps: [`Write the chain as (${start + 1}×...×${end + 1})/(${start}×...×${end}).`, `Cancel the common interior block to get ${format(answer)}.`],
      };
    }
    case "SAP-CP005-PROT-ONE-PLUS-MINUS-CHAIN": {
      const start = pickInt(random, 3, 20), end = start + pickInt(random, 2, 7);
      let answer = rat(1);
      const terms: string[] = [];
      for (let n = start; n <= end; n += 1) {
        answer = mul(answer, rat(n - 1, n));
        answer = mul(answer, rat(n + 1, n));
        terms.push(`(1−1/${n})(1+1/${n})`);
      }
      return {
        stem: `Simplify ${terms.join(" × ")}.`,
        answer,
        data: { start, end },
        map: ["For each n, (1−1/n)(1+1/n) = (n−1)(n+1)/n².", "After writing all factors, cancel repeated consecutive factors across the product."],
        steps: ["Convert every conjugate pair to (n²−1)/n² = (n−1)(n+1)/n².", `Perform legal factor cancellation across the product; the exact value is ${format(answer)}.`],
      };
    }
    case "SAP-CP005-PROT-MISSING-FACTOR-CANCELLATION": {
      const x = pickInt(random, 2, 9), y = pickInt(random, 2, 9), target = pickInt(random, 2, 8);
      const missing = target * y;
      return {
        stem: `If (${x}/${y}) × (□/${x}) = ${target}, find □.`,
        answer: rat(missing),
        data: { x, y, target, missing },
        map: [`Cancel the common factor ${x} across the two fractions.`, `The expression becomes □/${y} = ${target}.`],
        steps: [`After cancelling ${x}, the only unknown relation is □/${y} = ${target}.`, `Therefore □ = ${target} × ${y} = ${missing}.`],
      };
    }
    case "SAP-CP005-PROT-ILLEGAL-CANCELLATION-DIAGNOSIS": {
      const x = pickInt(random, 3, 9), y = pickInt(random, 2, 8);
      return {
        stem: `A student simplifies (${x} + ${y})/${x} as 1 + ${y} by cancelling ${x} from the numerator and denominator. What is the first error?`,
        answer: "Cancellation across addition is invalid",
        data: { x, y },
        map: [`The numerator ${x}+${y} is a sum, not a product with ${x} as a factor of the whole numerator.`, "Cancellation is legal only for common factors multiplying the entire numerator and denominator."],
        steps: [`Rewrite (${x}+${y})/${x} as ${x}/${x} + ${y}/${x} if you want to split the fraction.`, `The valid result is 1 + ${y}/${x}, so replacing it by 1 + ${y} is the first incorrect step.`],
      };
    }
  }
}

function validate(pkg: Omit<SapCp005Package, "validation">): { ok: boolean; errors: readonly string[] } {
  const errors: string[] = [];
  if (pkg.options.length !== 4) errors.push("Exactly four options are required.");
  if (new Set(pkg.options.map((option) => option.value)).size !== 4) errors.push("Options must be unique.");
  if (pkg.options.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one option must be correct.");
  if (pkg.options[pkg.correctIndex]?.value !== pkg.canonicalAnswer) errors.push("Correct index does not point to the canonical answer.");
  if (pkg.explanation.steps.length < 2) errors.push("Explanation needs at least two learner-visible steps.");
  if (pkg.explanation.cancellationMap.length < 2) errors.push("CP-005 requires an explicit cancellation/structure map.");
  if (!pkg.explanation.finalAnswer.includes(pkg.canonicalAnswer)) errors.push("Final answer must state the canonical value.");
  if (pkg.lifecycle.permanentQlId !== null || pkg.lifecycle.active) errors.push("Foundation candidates must remain inactive and unallocated.");
  return { ok: errors.length === 0, errors };
}

export function generateSapCp005(prototypeId: SapCp005PrototypeId, seed: number): SapCp005Package {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("Seed must be a positive integer.");
  const built = build(prototypeId, seed);
  const catalogue = SAP_CP005_CATALOGUE.find((entry) => entry.prototypeId === prototypeId)!;
  const canonicalAnswer = typeof built.answer === "string" ? built.answer : format(built.answer);
  const options = typeof built.answer === "string"
    ? categoricalOptions(
        canonicalAnswer,
        [
          ["Cancel the common-looking term immediately", "CANCEL_ACROSS_SUM", "This treats a term inside a sum as though it were a factor of the whole numerator, which changes the expression."],
          ["Multiply numerator and denominator by the same term first", "UNNECESSARY_TRANSFORM", "This adds work but does not repair the invalid cancellation; the structural issue is that the numerator is a sum."],
          ["The shown cancellation is valid", "ACCEPT_ILLEGAL_CANCELLATION", "A common symbol cannot be cancelled unless it is a factor multiplying the complete numerator and denominator."],
        ],
        seed,
      )
    : numericOptions(built.answer, seed);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const payload = JSON.stringify(built.data);
  const partial: Omit<SapCp005Package, "validation"> = {
    prototypeId,
    proposedPermanentQlId: catalogue.proposedPermanentQlId,
    seed,
    difficulty: catalogue.difficulty,
    taskDirection: catalogue.taskDirection,
    stem: built.stem,
    canonicalAnswer,
    options,
    correctIndex,
    explanation: {
      coreConcept: "Look for factors or endpoint terms that disappear by a valid structural reduction before doing heavy arithmetic; never cancel pieces joined by addition or subtraction.",
      steps: built.steps,
      finalAnswer: `Therefore, the answer is ${canonicalAnswer}.`,
      cancellationMap: built.map,
    },
    oracle: { kind: prototypeId, data: built.data },
    canonicalPayloadKey: `${prototypeId}:${payload}`,
    generationIdentity: `${prototypeId}:seed:${seed}:${payload}`,
    lifecycle: LIFECYCLE,
  };
  return { ...partial, validation: validate(partial) };
}

export function generateSapCp005Sweep(perPrototype = 100): readonly SapCp005Package[] {
  if (!Number.isInteger(perPrototype) || perPrototype < 1) throw new Error("perPrototype must be a positive integer.");
  return SAP_CP005_PROTOTYPE_IDS.flatMap((prototypeId, prototypeIndex) =>
    Array.from({ length: perPrototype }, (_, index) =>
      generateSapCp005(prototypeId, prototypeIndex * 10_000 + index + 1),
    ),
  );
}
