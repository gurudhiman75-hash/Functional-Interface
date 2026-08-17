import type {
  SapCp006Difficulty,
  SapCp006Option,
  SapCp006Package,
  SapCp006TaskDirection,
} from "./runtime";

export const SAP_CP006_WAVE2_PROTOTYPE_IDS = [
  "SAP-CP006-PROT-MISSING-MIXED-MINUEND",
  "SAP-CP006-PROT-MISSING-MIXED-SUBTRAHEND",
  "SAP-CP006-PROT-MISSING-MIXED-DIVIDEND",
  "SAP-CP006-PROT-MISSING-FRACTION-DENOMINATOR-CROSS",
  "SAP-CP006-PROT-COMPOSED-RADICAND-MISSING",
  "SAP-CP006-PROT-COMPOSED-FACTORIAL-MISSING",
  "SAP-CP006-PROT-TWO-SIDED-EXACT-EQUALITY",
  "SAP-CP006-PROT-FIXED-MIXED-OPERAND-MISSING",
] as const;

export type SapCp006Wave2PrototypeId = typeof SAP_CP006_WAVE2_PROTOTYPE_IDS[number];

export interface SapCp006Wave2CatalogueEntry {
  prototypeId: SapCp006Wave2PrototypeId;
  proposedPermanentQlId: string;
  title: string;
  difficulty: SapCp006Difficulty;
  taskDirection: SapCp006TaskDirection;
  authorityScope: string;
}

const TITLES: readonly [string, SapCp006Difficulty, SapCp006TaskDirection, string][] = [
  ["Missing mixed minuend", "MEDIUM", "INVERSE", "missing minuend after fraction-of and percentage-of evaluation"],
  ["Missing mixed subtrahend", "MEDIUM", "INVERSE", "missing subtrahend after mixed exact evaluation"],
  ["Missing mixed dividend", "MEDIUM", "INVERSE", "missing dividend in a composed exact expression"],
  ["Missing fraction denominator across families", "HARD", "INVERSE", "missing denominator in a fraction-of expression combined with a percentage term"],
  ["Composed missing radicand", "HARD", "INVERSE", "bounded missing radicand inside root, fraction and percentage composition"],
  ["Composed missing factorial input", "HARD", "INVERSE", "bounded missing factorial component inside a composed exact expression"],
  ["Two-sided exact equality", "MEDIUM", "INVERSE", "value making two mixed exact arithmetic sides equal"],
  ["Fixed mixed operand missing", "HARD", "INVERSE", "missing operand inside a fixed bracket/division/percentage structure"],
];

export const SAP_CP006_WAVE2_CATALOGUE: readonly SapCp006Wave2CatalogueEntry[] =
  SAP_CP006_WAVE2_PROTOTYPE_IDS.map((prototypeId, index) => ({
    prototypeId,
    proposedPermanentQlId: `SAP-QL-${String(104 + index).padStart(3, "0")}`,
    title: TITLES[index]![0],
    difficulty: TITLES[index]![1],
    taskDirection: TITLES[index]![2],
    authorityScope: TITLES[index]![3],
  }));

export interface SapCp006Wave2Oracle {
  kind: SapCp006Wave2PrototypeId;
  data: Readonly<Record<string, number>>;
}

export type SapCp006Wave2Package = Omit<SapCp006Package, "prototypeId" | "oracle"> & {
  prototypeId: SapCp006Wave2PrototypeId;
  oracle: SapCp006Wave2Oracle;
};

const LIFECYCLE: SapCp006Package["lifecycle"] = {
  permanentQlId: null,
  contentStatus: "ENGLISH_REVIEW_CANDIDATE",
  active: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
};

function rng(seed: number): () => number {
  let state = (seed >>> 0) || 0x85a308d3;
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

function integerOptions(
  answer: number,
  seed: number,
  special: readonly { value: number; misconceptionId: string; analysis: string }[] = [],
): readonly SapCp006Option[] {
  const seen = new Set<number>([answer]);
  const wrong = special.filter((item) => item.value > 0 && item.value !== answer && !seen.has(item.value) && Boolean(seen.add(item.value)));
  const fallback = [Math.max(1, answer - 1), answer + 1, answer + 2, answer * 2];
  for (const value of fallback) {
    if (wrong.length >= 3) break;
    if (value <= 0 || seen.has(value)) continue;
    seen.add(value);
    wrong.push({
      value,
      misconceptionId: value < answer ? "INVERSE_UNDERCOUNT" : value === answer * 2 ? "INVERSE_SCALE_ERROR" : "INVERSE_NEAR_MISS",
      analysis: value < answer
        ? "This candidate is too small and makes the reconstructed expression fall short of the displayed target."
        : value === answer * 2
          ? "This carries an extra scale factor into the unknown instead of reversing the known operation completely."
          : "This nearby integer fails when substituted into the complete displayed expression.",
    });
  }
  const items: SapCp006Option[] = [
    { value: String(answer), isCorrect: true, misconceptionId: null, analysis: "This integer restores the complete displayed equality exactly." },
    ...wrong.slice(0, 3).map((item) => ({ value: String(item.value), isCorrect: false, misconceptionId: item.misconceptionId, analysis: item.analysis })),
  ];
  return Object.freeze(rotate(items, seed % 4));
}

interface Built {
  stem: string;
  answer: number;
  options: readonly SapCp006Option[];
  data: Record<string, number>;
  steps: string[];
  verification: string[];
}

const FRACTIONS = [[1,2],[1,4],[3,4],[2,5],[3,5],[4,5],[2,3],[5,6],[3,8],[5,8]] as const;

function fractionFixture(random: () => number, seed: number): { a: number; b: number; base: number; value: number } {
  const [a, b] = pick(random, FRACTIONS);
  const scale = 4 + ((seed * 5 + b) % 8);
  return { a, b, base: b * scale, value: a * scale };
}

function percentFixture(random: () => number, seed: number): { p: number; base: number; value: number } {
  const p = pickInt(random, 10, 60);
  const scale = 2 + ((seed * 7 + p) % 6);
  return { p, base: 100 * scale, value: p * scale };
}

function build(prototypeId: SapCp006Wave2PrototypeId, seed: number): Built {
  const random = rng(seed * 49979687 + SAP_CP006_WAVE2_PROTOTYPE_IDS.indexOf(prototypeId) * 67867967 + 43);
  const f = fractionFixture(random, seed);
  const p = percentFixture(random, seed);

  switch (prototypeId) {
    case "SAP-CP006-PROT-MISSING-MIXED-MINUEND": {
      const target = pickInt(random, 20, 80);
      const answer = target + f.value + p.value;
      const options = integerOptions(answer, seed, [
        { value: target + f.value, misconceptionId: "PERCENT_TERM_NOT_RESTORED", analysis: "This restores the fraction term but forgets that the percentage term was also subtracted from the missing minuend." },
        { value: target + p.value, misconceptionId: "FRACTION_TERM_NOT_RESTORED", analysis: "This restores the percentage term but omits the fraction-of quantity that was also subtracted." },
      ]);
      return {
        stem: `Find ?: ? − ${f.a}/${f.b} of ${f.base} − ${p.p}% of ${p.base} = ${target}.`,
        answer, options,
        data: { ...f, p: p.p, percentBase: p.base, percentValue: p.value, target, answer },
        steps: [`${f.a}/${f.b} of ${f.base} = ${f.value}, and ${p.p}% of ${p.base} = ${p.value}.`, `Add both subtracted values back to ${target}: ? = ${target} + ${f.value} + ${p.value} = ${answer}.`],
        verification: [`Substitute ? = ${answer}.`, `${answer} − ${f.value} − ${p.value} = ${target}.`],
      };
    }

    case "SAP-CP006-PROT-MISSING-MIXED-SUBTRAHEND": {
      const known = f.value + p.value;
      const answer = Math.min(pickInt(random, 4, 30), Math.max(2, known - 2));
      const target = known - answer;
      const options = integerOptions(answer, seed, [
        { value: target, misconceptionId: "TARGET_AS_SUBTRAHEND", analysis: "This copies the final difference into the box instead of subtracting that difference from the known mixed total." },
        { value: known, misconceptionId: "KNOWN_TOTAL_AS_SUBTRAHEND", analysis: "This uses the entire known mixed total as the missing subtrahend and ignores the displayed final difference." },
      ]);
      return {
        stem: `Find ?: ${f.a}/${f.b} of ${f.base} + ${p.p}% of ${p.base} − ? = ${target}.`,
        answer, options,
        data: { ...f, p: p.p, percentBase: p.base, percentValue: p.value, known, target, answer },
        steps: [`The known total is ${f.value} + ${p.value} = ${known}.`, `Since ${known} − ? = ${target}, ? = ${known} − ${target} = ${answer}.`],
        verification: [`Substitute ? = ${answer}.`, `${known} − ${answer} = ${target}.`],
      };
    }

    case "SAP-CP006-PROT-MISSING-MIXED-DIVIDEND": {
      const divisor = pickInt(random, 2, 9), quotient = pickInt(random, 4, 20);
      const answer = divisor * quotient;
      const target = quotient + f.value + p.value;
      const options = integerOptions(answer, seed, [
        { value: quotient, misconceptionId: "QUOTIENT_AS_DIVIDEND", analysis: "This uses the isolated quotient as the missing dividend and forgets to multiply it by the displayed divisor." },
        { value: answer + divisor, misconceptionId: "DIVIDEND_ONE_QUOTIENT_STEP_HIGH", analysis: "This adds one extra divisor-sized step after the quotient has already been isolated correctly." },
      ]);
      return {
        stem: `Find ?: ? ÷ ${divisor} + ${f.a}/${f.b} of ${f.base} + ${p.p}% of ${p.base} = ${target}.`,
        answer, options,
        data: { ...f, p: p.p, percentBase: p.base, percentValue: p.value, divisor, quotient, target, answer },
        steps: [`Remove the known terms ${f.value} and ${p.value}: ? ÷ ${divisor} = ${quotient}.`, `Multiply by ${divisor}; ? = ${quotient} × ${divisor} = ${answer}.`],
        verification: [`${answer} ÷ ${divisor} = ${quotient}.`, `${quotient} + ${f.value} + ${p.value} = ${target}.`],
      };
    }

    case "SAP-CP006-PROT-MISSING-FRACTION-DENOMINATOR-CROSS": {
      const denominator = pickInt(random, 3, 10), numerator = pickInt(random, 1, denominator - 1), scale = pickInt(random, 4, 12);
      const fractionBase = denominator * scale, fractionValue = numerator * scale;
      const target = fractionValue + p.value;
      const options = integerOptions(denominator, seed, [
        { value: numerator, misconceptionId: "NUMERATOR_AS_DENOMINATOR", analysis: "This copies the visible numerator into the denominator box instead of recovering the divisor that makes the fraction-of value correct." },
        { value: scale, misconceptionId: "SCALE_AS_DENOMINATOR", analysis: "This mistakes the multiplier left after division for the missing denominator itself." },
      ]);
      return {
        stem: `Find the integer ?: ${numerator}/? of ${fractionBase} + ${p.p}% of ${p.base} = ${target}.`,
        answer: denominator, options,
        data: { numerator, denominator, scale, fractionBase, fractionValue, p: p.p, percentBase: p.base, percentValue: p.value, target },
        steps: [`Subtract ${p.value}; the fraction-of term must equal ${fractionValue}.`, `${numerator}/? of ${fractionBase} = ${fractionValue}. Testing the integer denominator candidates gives ? = ${denominator}.`],
        verification: [`With ? = ${denominator}, ${numerator}/${denominator} of ${fractionBase} = ${fractionValue}.`, `${fractionValue} + ${p.value} = ${target}.`],
      };
    }

    case "SAP-CP006-PROT-COMPOSED-RADICAND-MISSING": {
      const root = pickInt(random, 3, 12), answer = root * root;
      const target = root + f.value + p.value;
      const options = integerOptions(answer, seed, [
        { value: root, misconceptionId: "ROOT_AS_RADICAND", analysis: "This gives the square-root value itself, not the number that must be placed under the radical sign." },
        { value: (root + 1) * (root + 1), misconceptionId: "ADJACENT_SQUARE", analysis: "This uses the next perfect square, whose square root makes the complete expression one unit too large." },
      ]);
      return {
        stem: `Find ?: √? + ${f.a}/${f.b} of ${f.base} + ${p.p}% of ${p.base} = ${target}.`,
        answer, options,
        data: { root, answer, ...f, p: p.p, percentBase: p.base, percentValue: p.value, target },
        steps: [`Subtract ${f.value} and ${p.value}; √? = ${root}.`, `Therefore ? = ${root}² = ${answer}.`],
        verification: [`√${answer} = ${root}.`, `${root} + ${f.value} + ${p.value} = ${target}.`],
      };
    }

    case "SAP-CP006-PROT-COMPOSED-FACTORIAL-MISSING": {
      const answer = pickInt(random, 3, 6);
      let factorialValue = 1;
      for (let value = 2; value <= answer; value += 1) factorialValue *= value;
      const target = factorialValue + f.value + p.value;
      const options = integerOptions(answer, seed, [
        { value: answer + 1, misconceptionId: "ADJACENT_FACTORIAL_INPUT", analysis: "This uses the next factorial input; its factorial is much larger and does not reproduce the target." },
        { value: Math.max(2, answer - 1), misconceptionId: "PREVIOUS_FACTORIAL_INPUT", analysis: "This uses the previous factorial input, whose factorial is too small after the known terms are removed." },
      ]);
      return {
        stem: `Find the integer ?: ?! + ${f.a}/${f.b} of ${f.base} + ${p.p}% of ${p.base} = ${target}.`,
        answer, options,
        data: { answer, factorialValue, ...f, p: p.p, percentBase: p.base, percentValue: p.value, target },
        steps: [`Remove ${f.value} and ${p.value}; ?! = ${factorialValue}.`, `${answer}! = ${factorialValue}, so ? = ${answer}.`],
        verification: [`Evaluate ${answer}! = ${factorialValue}.`, `${factorialValue} + ${f.value} + ${p.value} = ${target}.`],
      };
    }

    case "SAP-CP006-PROT-TWO-SIDED-EXACT-EQUALITY": {
      const squareBase = pickInt(random, 5, 12), squareValue = squareBase * squareBase;
      const right = p.value + squareValue;
      const answer = right - f.value > 0 ? right - f.value : right + f.value;
      const usePlus = right - f.value > 0;
      const leftKnown = f.value;
      const options = integerOptions(answer, seed, [
        { value: right, misconceptionId: "RIGHT_SIDE_AS_UNKNOWN", analysis: "This copies the complete right side into the box without accounting for the known fraction-of term on the left." },
        { value: Math.abs(right - leftKnown) + 1, misconceptionId: "EQUALITY_BALANCE_OFF_BY_ONE", analysis: "This is one unit away from the value required to balance the two exact sides." },
      ]);
      const stem = usePlus
        ? `Find ?: ? + ${f.a}/${f.b} of ${f.base} = ${p.p}% of ${p.base} + ${squareBase}².`
        : `Find ?: ? − ${f.a}/${f.b} of ${f.base} = ${p.p}% of ${p.base} + ${squareBase}².`;
      return {
        stem, answer, options,
        data: { ...f, p: p.p, percentBase: p.base, percentValue: p.value, squareBase, squareValue, right, answer, usePlus: usePlus ? 1 : 0 },
        steps: [`The right side is ${p.value} + ${squareValue} = ${right}; the fraction-of term is ${f.value}.`, usePlus ? `So ? + ${f.value} = ${right}; ? = ${answer}.` : `So ? − ${f.value} = ${right}; ? = ${answer}.`],
        verification: [usePlus ? `${answer} + ${f.value} = ${right}.` : `${answer} − ${f.value} = ${right}.`, `${p.value} + ${squareValue} = ${right}, so both sides are equal.`],
      };
    }

    case "SAP-CP006-PROT-FIXED-MIXED-OPERAND-MISSING": {
      const divisor = pickInt(random, 2, 6), quotient = pickInt(random, 15, 35);
      const answer = divisor * quotient - f.value;
      const safeAnswer = answer > 1 ? answer : divisor * (quotient + 10) - f.value;
      const actualQuotient = (safeAnswer + f.value) / divisor;
      const target = actualQuotient + p.value;
      const options = integerOptions(safeAnswer, seed, [
        { value: divisor * actualQuotient, misconceptionId: "KNOWN_BRACKET_TERM_NOT_REMOVED", analysis: "This reconstructs the complete bracket total but forgets to subtract the known fraction-of term inside the bracket." },
        { value: actualQuotient, misconceptionId: "QUOTIENT_AS_OPERAND", analysis: "This stops after undoing the percentage term and treats the quotient itself as the missing operand." },
      ]);
      return {
        stem: `Find ?: [${f.a}/${f.b} of ${f.base} + ?] ÷ ${divisor} + ${p.p}% of ${p.base} = ${target}.`,
        answer: safeAnswer, options,
        data: { ...f, p: p.p, percentBase: p.base, percentValue: p.value, divisor, quotient: actualQuotient, target, answer: safeAnswer },
        steps: [`Subtract ${p.value}; the bracket divided by ${divisor} equals ${actualQuotient}.`, `The bracket is ${actualQuotient} × ${divisor} = ${actualQuotient * divisor}; subtract the known ${f.value} to get ? = ${safeAnswer}.`],
        verification: [`Inside the bracket, ${f.value} + ${safeAnswer} = ${actualQuotient * divisor}.`, `${actualQuotient * divisor} ÷ ${divisor} + ${p.value} = ${target}.`],
      };
    }
  }
}

const CORE: Record<SapCp006Wave2PrototypeId, string> = {
  "SAP-CP006-PROT-MISSING-MIXED-MINUEND": "A missing minuend is recovered by adding back every quantity that was subtracted. Evaluate fraction-of and percentage-of terms first, then reverse the subtraction in one exact step.",
  "SAP-CP006-PROT-MISSING-MIXED-SUBTRAHEND": "For a missing subtrahend, evaluate the known mixed total first. The unknown equals that total minus the displayed final difference, and substitution confirms the direction of subtraction.",
  "SAP-CP006-PROT-MISSING-MIXED-DIVIDEND": "A missing dividend is recovered only after the additive mixed terms are removed. Once the quotient is isolated, multiply by the fixed divisor and verify the original expression.",
  "SAP-CP006-PROT-MISSING-FRACTION-DENOMINATOR-CROSS": "The unknown denominator belongs to a fraction-of term embedded in a larger exact expression. Isolate that term first, then use bounded integer substitution to avoid turning the task into general algebra.",
  "SAP-CP006-PROT-COMPOSED-RADICAND-MISSING": "When a square-root component is embedded with other exact terms, isolate the root value first and square it only after the surrounding fraction and percentage quantities have been removed.",
  "SAP-CP006-PROT-COMPOSED-FACTORIAL-MISSING": "A missing factorial input inside a composed exact expression is found by isolating the factorial value and matching it to a bounded integer factorial, then checking the full original sum.",
  "SAP-CP006-PROT-TWO-SIDED-EXACT-EQUALITY": "A two-sided exact equality should be balanced after each side's fixed arithmetic is evaluated. The missing value is accepted only when direct substitution makes both numeric sides identical.",
  "SAP-CP006-PROT-FIXED-MIXED-OPERAND-MISSING": "For an unknown nested inside a fixed bracket and division structure, reverse operations from outside inward: remove the additive term, undo division, then remove the known bracket component.",
};

function validate(pkg: Omit<SapCp006Wave2Package, "validation">): { ok: boolean; errors: readonly string[] } {
  const errors: string[] = [];
  if (pkg.options.length !== 4) errors.push("Exactly four options are required.");
  if (new Set(pkg.options.map((option) => option.value)).size !== 4) errors.push("Options must be distinct.");
  if (pkg.options.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one option must be correct.");
  if (pkg.options[pkg.correctIndex]?.value !== pkg.canonicalAnswer) errors.push("Correct index is not answer-bound.");
  if (pkg.explanation.steps.length < 2 || pkg.explanation.verification.length < 2) errors.push("Explanation and verification each need two steps.");
  if (pkg.lifecycle.permanentQlId !== null || pkg.lifecycle.active || pkg.lifecycle.questionStudioDiscoverable) errors.push("Wave-two lifecycle must remain inactive and unallocated.");
  return { ok: errors.length === 0, errors: Object.freeze(errors) };
}

export function generateSapCp006Wave2(prototypeId: SapCp006Wave2PrototypeId, seed: number): SapCp006Wave2Package {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("Seed must be a positive integer.");
  const catalogue = SAP_CP006_WAVE2_CATALOGUE.find((entry) => entry.prototypeId === prototypeId)!;
  const built = build(prototypeId, seed);
  const correctIndex = built.options.findIndex((option) => option.isCorrect);
  const oracle: SapCp006Wave2Oracle = { kind: prototypeId, data: Object.freeze({ ...built.data }) };
  const partial: Omit<SapCp006Wave2Package, "validation"> = {
    prototypeId,
    proposedPermanentQlId: catalogue.proposedPermanentQlId,
    seed,
    difficulty: catalogue.difficulty,
    taskDirection: catalogue.taskDirection,
    stem: built.stem,
    canonicalAnswer: String(built.answer),
    options: built.options,
    correctIndex,
    explanation: {
      coreConcept: CORE[prototypeId],
      steps: Object.freeze(built.steps),
      finalAnswer: `Therefore, the answer is ${built.answer}.`,
      verification: Object.freeze(built.verification),
    },
    oracle,
    canonicalPayloadKey: JSON.stringify({ prototypeId, stem: built.stem, answer: built.answer, data: built.data }),
    generationIdentity: `${prototypeId}:seed:${seed}:${JSON.stringify(built.data)}`,
    lifecycle: LIFECYCLE,
  };
  return Object.freeze({ ...partial, validation: validate(partial) });
}

export function generateSapCp006Wave2Sweep(perPrototype = 100): readonly SapCp006Wave2Package[] {
  if (!Number.isInteger(perPrototype) || perPrototype < 1) throw new Error("perPrototype must be positive.");
  return SAP_CP006_WAVE2_PROTOTYPE_IDS.flatMap((prototypeId, index) =>
    Array.from({ length: perPrototype }, (_, seedIndex) => generateSapCp006Wave2(prototypeId, index * 30_000 + seedIndex + 1)),
  );
}
