import type {
  SapCp005Difficulty,
  SapCp005Lifecycle,
  SapCp005Option,
  SapCp005TaskDirection,
} from "./runtime";

export const SAP_CP005_WAVE2_PROTOTYPE_IDS = [
  "SAP-CP005-PROT-COMMON-FACTOR-BEFORE-MULTIPLY",
  "SAP-CP005-PROT-REPEATED-COMMON-FACTOR-BLOCKS",
  "SAP-CP005-PROT-SYMMETRIC-FRACTION-PAIR",
  "SAP-CP005-PROT-REPEATED-BLOCK-COMPRESSION",
  "SAP-CP005-PROT-BEST-FIRST-CANCELLATION",
  "SAP-CP005-PROT-RAW-VS-STRUCTURAL-ROUTE",
] as const;

export type SapCp005Wave2PrototypeId = typeof SAP_CP005_WAVE2_PROTOTYPE_IDS[number];

export interface SapCp005Wave2CatalogueEntry {
  prototypeId: SapCp005Wave2PrototypeId;
  proposedPermanentQlId: string;
  title: string;
  difficulty: SapCp005Difficulty;
  taskDirection: SapCp005TaskDirection;
  authorityScope: string;
}

const TITLES: readonly [string, SapCp005Difficulty, SapCp005TaskDirection, string][] = [
  ["Common factor before multiplication", "EASY", "FORWARD", "common-factor cancellation before multiplication"],
  ["Repeated common-factor blocks", "MEDIUM", "FORWARD", "repeated common-factor blocks"],
  ["Symmetric fraction pair", "HARD", "FORWARD", "symmetric fraction-pair expressions"],
  ["Repeated-block compression", "HARD", "FORWARD", "repeated-block compression after legal factor extraction"],
  ["Best first cancellation step", "MEDIUM", "STRATEGY", "selecting the best first cancellation step"],
  ["Raw versus structural route", "MEDIUM", "STRATEGY", "comparing raw and structurally simplified routes"],
];

export const SAP_CP005_WAVE2_CATALOGUE: readonly SapCp005Wave2CatalogueEntry[] =
  SAP_CP005_WAVE2_PROTOTYPE_IDS.map((prototypeId, index) => ({
    prototypeId,
    proposedPermanentQlId: `SAP-QL-${String(86 + index).padStart(3, "0")}`,
    title: TITLES[index]![0],
    difficulty: TITLES[index]![1],
    taskDirection: TITLES[index]![2],
    authorityScope: TITLES[index]![3],
  }));

export const SAP_CP005_WAVE2_PROPOSED_QL_BY_PROTOTYPE = Object.fromEntries(
  SAP_CP005_WAVE2_CATALOGUE.map((entry) => [entry.prototypeId, entry.proposedPermanentQlId]),
) as Record<SapCp005Wave2PrototypeId, string>;

interface Rational {
  n: bigint;
  d: bigint;
}

export interface SapCp005Wave2Oracle {
  kind: SapCp005Wave2PrototypeId;
  data: Readonly<Record<string, number>>;
}

export interface SapCp005Wave2Package {
  prototypeId: SapCp005Wave2PrototypeId;
  proposedPermanentQlId: string;
  seed: number;
  difficulty: SapCp005Difficulty;
  taskDirection: SapCp005TaskDirection;
  stem: string;
  canonicalAnswer: string;
  options: readonly SapCp005Option[];
  correctIndex: number;
  explanation: {
    coreConcept: string;
    steps: readonly string[];
    finalAnswer: string;
    cancellationMap: readonly string[];
  };
  oracle: SapCp005Wave2Oracle;
  canonicalPayloadKey: string;
  generationIdentity: string;
  validation: { ok: boolean; errors: readonly string[] };
  lifecycle: SapCp005Lifecycle;
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

function gcdNumber(a: number, b: number): number {
  return Number(gcd(BigInt(a), BigInt(b)));
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

function rng(seed: number): () => number {
  let state = (seed >>> 0) || 0x9e3779b9;
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

function pick<T>(random: () => number, values: readonly T[]): T {
  return values[Math.floor(random() * values.length)]!;
}

function rotate<T>(items: readonly T[], offset: number): T[] {
  const shift = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(shift), ...items.slice(0, shift)];
}

function numericOptions(answer: Rational, seed: number): readonly SapCp005Option[] {
  const candidates = [
    { v: answer, id: null, analysis: "This preserves the exact value while using the common structure before any avoidable large multiplication." },
    { v: add(answer, rat(1)), id: "INCOMPLETE_REDUCTION", analysis: "This is a nearby result caused by stopping after exposing the common block but before completing the exact reduction." },
    { v: answer.n === 0n ? rat(2) : rat(answer.d, answer.n), id: "RECIPROCAL_FLIP", analysis: "This reverses the final fraction after the structural cancellation has already established its orientation." },
    { v: sub(answer, rat(1)), id: "OVER_CANCELLATION", analysis: "This reflects removing more than a complete common factor and therefore changing the exact value." },
    { v: add(answer, rat(2)), id: "RAW_ARITHMETIC_SLIP", analysis: "This is a plausible arithmetic slip from multiplying the large visible numbers before simplifying their structure." },
  ];
  const unique = new Map<string, typeof candidates[number]>();
  for (const item of candidates) {
    const key = format(item.v);
    if (!unique.has(key)) unique.set(key, item);
  }
  let bump = 3;
  while (unique.size < 4) {
    const v = add(answer, rat(bump));
    const key = format(v);
    if (!unique.has(key)) {
      unique.set(key, { v, id: "RAW_ARITHMETIC_SLIP", analysis: "This distractor represents a raw-calculation slip after ignoring the intended structural reduction." });
    }
    bump += 1;
  }
  return rotate([...unique.values()].slice(0, 4), seed % 4).map((item) => ({
    value: format(item.v),
    isCorrect: item.id === null,
    misconceptionId: item.id,
    analysis: item.analysis,
  }));
}

function categoricalOptions(
  correct: string,
  correctAnalysis: string,
  distractors: readonly [string, string, string][],
  seed: number,
): readonly SapCp005Option[] {
  const items: SapCp005Option[] = [
    { value: correct, isCorrect: true, misconceptionId: null, analysis: correctAnalysis },
    ...distractors.map(([value, misconceptionId, analysis]) => ({
      value,
      isCorrect: false,
      misconceptionId,
      analysis,
    })),
  ];
  return rotate(items, seed % 4);
}

interface Built {
  stem: string;
  answer: Rational | string;
  data: Record<string, number>;
  steps: string[];
  map: string[];
  correctAnalysis?: string;
  distractors?: readonly [string, string, string][];
}

const COPRIME_PAIRS = [
  [2, 3], [2, 5], [3, 4], [3, 5], [4, 5], [5, 6], [5, 7], [7, 8], [7, 9], [8, 9],
] as const;

function build(prototypeId: SapCp005Wave2PrototypeId, seed: number): Built {
  const random = rng(seed * 130363 + SAP_CP005_WAVE2_PROTOTYPE_IDS.indexOf(prototypeId) * 10007 + 29);

  switch (prototypeId) {
    case "SAP-CP005-PROT-COMMON-FACTOR-BEFORE-MULTIPLY": {
      const k = pickInt(random, 4, 12);
      const [m, n] = pick(random, COPRIME_PAIRS);
      const r = pickInt(random, 3, 11);
      const p = k * m;
      const q = k * n;
      const answer = mul(rat(p, q), rat(r));
      return {
        stem: `Simplify (${p}/${q}) × ${r} without multiplying large numbers first.`,
        answer,
        data: { k, m, n, r, p, q },
        map: [`${p} = ${k} × ${m} and ${q} = ${k} × ${n}.`, `Cancel the complete common factor ${k} before multiplying by ${r}.`],
        steps: [`Reduce ${p}/${q} to ${m}/${n} first.`, `Then (${m}/${n}) × ${r} = ${format(answer)}.`],
      };
    }

    case "SAP-CP005-PROT-REPEATED-COMMON-FACTOR-BLOCKS": {
      const a = pickInt(random, 3, 9);
      const b = pickInt(random, 4, 11);
      const u = pickInt(random, 2, 9);
      const v = pickInt(random, 2, 9);
      const w = pickInt(random, 3, 10);
      const z = pickInt(random, 3, 10);
      const block = a * b;
      const answer = rat(block * u * v, block * w * z);
      return {
        stem: `Simplify [(${a} × ${b}) × ${u} × ${v}] / [(${a} × ${b}) × ${w} × ${z}].`,
        answer,
        data: { a, b, u, v, w, z, block },
        map: [`Treat (${a} × ${b}) as one complete common factor block.`, `Cancel that identical block from numerator and denominator before multiplying the remaining factors.`],
        steps: [`The repeated block has the same value ${block} on both sides of the fraction bar.`, `After cancelling the block, evaluate (${u}×${v})/(${w}×${z}) = ${format(answer)}.`],
      };
    }

    case "SAP-CP005-PROT-SYMMETRIC-FRACTION-PAIR": {
      let a = pickInt(random, 2, 9);
      let b = pickInt(random, 3, 11);
      if (a === b) b += 1;
      const left = add(rat(a, b), rat(b, a));
      const matching = rat(a * a + b * b, a * b);
      const answer = div(left, matching);
      return {
        stem: `Simplify [(${a}/${b}) + (${b}/${a})] ÷ [(${a * a + b * b})/${a * b}].`,
        answer,
        data: { a, b },
        map: [`Combine the symmetric pair: ${a}/${b} + ${b}/${a} = (${a * a}+${b * b})/${a * b}.`, `The resulting fraction is identical to the divisor, so the complete ratio cancels to 1.`],
        steps: [`Both the first bracket and the divisor reduce to ${format(matching)}.`, `A non-zero quantity divided by itself equals ${format(answer)}.`],
      };
    }

    case "SAP-CP005-PROT-REPEATED-BLOCK-COMPRESSION": {
      const k = pickInt(random, 4, 12);
      const a = pickInt(random, 2, 9);
      const b = pickInt(random, 2, 9);
      const c = pickInt(random, 2, 9);
      const numerator = k * a + k * b;
      const denominator = k * c;
      const answer = rat(numerator, denominator);
      return {
        stem: `Simplify [(${k} × ${a}) + (${k} × ${b})] / (${k} × ${c}) by compressing the repeated block first.`,
        answer,
        data: { k, a, b, c },
        map: [`Factor the whole numerator: (${k}×${a}) + (${k}×${b}) = ${k}×(${a}+${b}).`, `Only after that factorisation is ${k} a factor of the complete numerator, so it may be cancelled with denominator factor ${k}.`],
        steps: [`Rewrite the fraction as [${k}×(${a}+${b})]/[${k}×${c}].`, `Cancel the legal common factor ${k}; (${a}+${b})/${c} = ${format(answer)}.`],
      };
    }

    case "SAP-CP005-PROT-BEST-FIRST-CANCELLATION": {
      const k = pickInt(random, 5, 13);
      const [m, n] = pick(random, COPRIME_PAIRS);
      const p = k * m;
      const q = k * n;
      const r = pickInt(random, 7, 15);
      const s = pickInt(random, 7, 15);
      const correct = `Reduce ${p}/${q} by the common factor ${k} first`;
      return {
        stem: `Before evaluating (${p}/${q}) × (${r}/${s}), which first step most directly avoids unnecessary large multiplication?`,
        answer: correct,
        data: { k, m, n, p, q, r, s },
        map: [`HCF(${p}, ${q}) = ${k}, because ${p} = ${k}×${m} and ${q} = ${k}×${n}.`, `Reducing that visible fraction first changes ${p}/${q} to ${m}/${n} without changing the product.`],
        steps: [`Do not create the larger products ${p * r} and ${q * s} before using the visible common factor.`, `The clean first move is: ${correct}.`],
        correctAnalysis: "This removes the complete visible HCF before any large multiplication, preserves the exact value, and directly serves the stated efficiency goal.",
        distractors: [
          ["Multiply the two numerators first", "RAW_MULTIPLY_FIRST", "This is mathematically possible but deliberately creates a larger intermediate number before using the visible reduction."],
          ["Multiply the two denominators first", "RAW_MULTIPLY_FIRST", "This postpones the obvious exact reduction and therefore does not satisfy the request for the most efficient first structural step."],
          ["Invert the second fraction before multiplying", "UNJUSTIFIED_RECIPROCAL", "The operation shown is multiplication, so changing the second fraction to its reciprocal changes the value of the expression."],
        ],
      };
    }

    case "SAP-CP005-PROT-RAW-VS-STRUCTURAL-ROUTE": {
      const k = pickInt(random, 6, 14);
      const [m, n] = pick(random, COPRIME_PAIRS);
      const r = pickInt(random, 6, 15);
      const s = pickInt(random, 6, 15);
      const p = k * m;
      const q = k * n;
      const rawNum = p * r;
      const rawDen = q * s;
      const correct = "Both routes are valid, but Route B is more efficient";
      return {
        stem: `For (${p}/${q}) × (${r}/${s}), Route A multiplies first to get ${rawNum}/${rawDen}. Route B first reduces ${p}/${q} to ${m}/${n} and then multiplies. Which statement is correct?`,
        answer: correct,
        data: { k, m, n, p, q, r, s },
        map: [`Route A evaluates the unsimplified product ${p * r}/${q * s}.`, `Route B cancels the common factor ${k} first, giving the equivalent smaller product (${m}/${n})×(${r}/${s}).`],
        steps: ["Cancelling a complete common factor does not change a fraction's value, so both routes are exact.", "Route B keeps the intermediate numbers smaller and therefore better matches the structural-simplification objective."],
        correctAnalysis: "Both routes preserve the same exact rational value; Route B is preferred only because it uses the visible cancellation before creating larger products.",
        distractors: [
          ["Only Route A is valid", "REJECT_VALID_CANCELLATION", "This incorrectly rejects legal cancellation of a complete common factor from the numerator and denominator of a fraction."],
          ["Only Route B is valid", "REJECT_RAW_ROUTE", "Multiplying first is less efficient here, but it remains mathematically valid when the arithmetic is carried out exactly."],
          ["The two routes give different exact values", "VALUE_NOT_PRESERVED", "Legal common-factor cancellation preserves value, so exact raw evaluation and exact structural evaluation must agree."],
        ],
      };
    }
  }
}

function validate(pkg: Omit<SapCp005Wave2Package, "validation">): { ok: boolean; errors: readonly string[] } {
  const errors: string[] = [];
  if (pkg.options.length !== 4) errors.push("Exactly four options are required.");
  if (new Set(pkg.options.map((option) => option.value)).size !== 4) errors.push("Options must be unique.");
  if (pkg.options.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one option must be correct.");
  if (pkg.options[pkg.correctIndex]?.value !== pkg.canonicalAnswer) errors.push("Correct index does not point to the canonical answer.");
  if (pkg.explanation.steps.length < 2) errors.push("Explanation needs at least two learner-visible steps.");
  if (pkg.explanation.cancellationMap.length < 2) errors.push("CP-005 requires an explicit cancellation/structure map.");
  if (!pkg.explanation.finalAnswer.includes(pkg.canonicalAnswer)) errors.push("Final answer must state the canonical answer.");
  if (pkg.lifecycle.permanentQlId !== null || pkg.lifecycle.active) errors.push("Wave-two candidates must remain inactive and unallocated.");
  return { ok: errors.length === 0, errors };
}

export function generateSapCp005Wave2(prototypeId: SapCp005Wave2PrototypeId, seed: number): SapCp005Wave2Package {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("Seed must be a positive integer.");
  const built = build(prototypeId, seed);
  const catalogue = SAP_CP005_WAVE2_CATALOGUE.find((entry) => entry.prototypeId === prototypeId)!;
  const canonicalAnswer = typeof built.answer === "string" ? built.answer : format(built.answer);
  const options = typeof built.answer === "string"
    ? categoricalOptions(canonicalAnswer, built.correctAnalysis!, built.distractors!, seed)
    : numericOptions(built.answer, seed);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const payload = JSON.stringify(built.data);
  const partial: Omit<SapCp005Wave2Package, "validation"> = {
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
      coreConcept: "Use a complete common factor or repeated numeric block only when it is a factor of the whole relevant numerator or denominator; structural reduction should preserve the exact value while avoiding unnecessary large arithmetic.",
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

export function generateSapCp005Wave2Sweep(perPrototype = 100): readonly SapCp005Wave2Package[] {
  if (!Number.isInteger(perPrototype) || perPrototype < 1) throw new Error("perPrototype must be a positive integer.");
  return SAP_CP005_WAVE2_PROTOTYPE_IDS.flatMap((prototypeId, prototypeIndex) =>
    Array.from({ length: perPrototype }, (_, index) =>
      generateSapCp005Wave2(prototypeId, prototypeIndex * 20_000 + index + 1),
    ),
  );
}

export function sapCp005Wave2RawValue(oracle: SapCp005Wave2Oracle): string {
  const d = oracle.data;
  switch (oracle.kind) {
    case "SAP-CP005-PROT-COMMON-FACTOR-BEFORE-MULTIPLY":
      return format(mul(rat(d.p!, d.q!), rat(d.r!)));
    case "SAP-CP005-PROT-REPEATED-COMMON-FACTOR-BLOCKS":
      return format(rat(d.block! * d.u! * d.v!, d.block! * d.w! * d.z!));
    case "SAP-CP005-PROT-SYMMETRIC-FRACTION-PAIR": {
      const left = add(rat(d.a!, d.b!), rat(d.b!, d.a!));
      const right = rat(d.a! * d.a! + d.b! * d.b!, d.a! * d.b!);
      return format(div(left, right));
    }
    case "SAP-CP005-PROT-REPEATED-BLOCK-COMPRESSION":
      return format(rat(d.k! * d.a! + d.k! * d.b!, d.k! * d.c!));
    case "SAP-CP005-PROT-BEST-FIRST-CANCELLATION": {
      if (gcdNumber(d.p!, d.q!) !== d.k!) throw new Error("Best-first fixture lost its declared HCF.");
      return `Reduce ${d.p!}/${d.q!} by the common factor ${d.k!} first`;
    }
    case "SAP-CP005-PROT-RAW-VS-STRUCTURAL-ROUTE": {
      const raw = rat(d.p! * d.r!, d.q! * d.s!);
      const structural = mul(rat(d.m!, d.n!), rat(d.r!, d.s!));
      if (format(raw) !== format(structural)) throw new Error("Route comparison fixture does not preserve exact value.");
      return "Both routes are valid, but Route B is more efficient";
    }
  }
}
