import type { IopEnglishGeneratedSource, IopEnglishTrace } from "./english-production-types.ts";

function hashSeed(seed: string): number {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash || 0x9e3779b9;
}

function makeRng(seed: string): () => number {
  let state = hashSeed(seed);
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 0x100000000;
  };
}

function shuffle<T>(values: readonly T[], rng: () => number): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(rng() * (index + 1));
    [result[index], result[other]] = [result[other]!, result[index]!];
  }
  return result;
}

function rowFingerprint(row: readonly string[]): string {
  return row.join("\u241f");
}

function traceFingerprint(trace: IopEnglishTrace): string {
  return [rowFingerprint(trace.input), ...trace.steps.map(rowFingerprint)].join("\u241e");
}

function visibleRowsAreUnique(trace: IopEnglishTrace): boolean {
  const rows = [trace.input, ...trace.steps].map(rowFingerprint);
  return new Set(rows).size === rows.length;
}

function elementsAreUnique(trace: IopEnglishTrace): boolean {
  return [trace.input, ...trace.steps].every((row) => new Set(row).size === row.length);
}

// ---------------------------------------------------------------------------
// IOP-QL-005: BankersAdda source-normalized numeric parity machine.
// ---------------------------------------------------------------------------

type NumericDirection = "ASC" | "DESC";
type NumericTransform = "REVERSE" | "PLUS_ONE" | "UNCHANGED";
type FixedOrder = "PREPEND" | "APPEND";

interface NumericParityRule {
  readonly oddDirection: NumericDirection;
  readonly evenDirection: NumericDirection;
  readonly oddTransform: NumericTransform;
  readonly evenTransform: NumericTransform;
  readonly oddFixedOrder: FixedOrder;
  readonly evenFixedOrder: FixedOrder;
}

const NUMERIC_PARITY_RULE: NumericParityRule = {
  oddDirection: "ASC",
  evenDirection: "ASC",
  oddTransform: "REVERSE",
  evenTransform: "PLUS_ONE",
  oddFixedOrder: "PREPEND",
  evenFixedOrder: "APPEND",
};

const ODD_POOL = [13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 73, 79, 83, 89, 97] as const;
const EVEN_POOL = [12, 18, 24, 26, 32, 36, 42, 46, 52, 56, 62, 68, 72, 74, 82, 84, 86, 92, 94, 96] as const;

function transformNumber(value: number, transform: NumericTransform): number {
  if (transform === "PLUS_ONE") return value + 1;
  if (transform === "REVERSE") return Number(String(value).split("").reverse().join(""));
  return value;
}

function chooseNumber(values: readonly number[], parity: "ODD" | "EVEN", direction: NumericDirection): number {
  const eligible = values
    .filter((value) => (parity === "ODD" ? value % 2 === 1 : value % 2 === 0))
    .sort((a, b) => a - b);
  if (direction === "DESC") eligible.reverse();
  const selected = eligible[0];
  if (selected === undefined) throw new Error(`No ${parity.toLowerCase()} number remains`);
  return selected;
}

function executeNumericParityRule(rule: NumericParityRule, input: readonly number[]): IopEnglishTrace {
  let remaining = [...input];
  let leftFixed: string[] = [];
  let rightFixed: string[] = [];
  const steps: string[][] = [];
  const iterations = input.filter((value) => value % 2 === 1).length;
  if (iterations !== input.filter((value) => value % 2 === 0).length || iterations < 4) {
    throw new Error("Numeric parity machine needs equal odd/even counts");
  }

  for (let index = 0; index < iterations; index += 1) {
    const odd = chooseNumber(remaining, "ODD", rule.oddDirection);
    const even = chooseNumber(remaining, "EVEN", rule.evenDirection);
    remaining = remaining.filter((value) => value !== odd && value !== even);
    const oddVisible = String(transformNumber(odd, rule.oddTransform));
    const evenVisible = String(transformNumber(even, rule.evenTransform));
    leftFixed = rule.oddFixedOrder === "PREPEND" ? [oddVisible, ...leftFixed] : [...leftFixed, oddVisible];
    rightFixed = rule.evenFixedOrder === "APPEND" ? [...rightFixed, evenVisible] : [evenVisible, ...rightFixed];
    steps.push([...leftFixed, ...remaining.map(String), ...rightFixed]);
  }
  return { input: input.map(String), steps };
}

function oracleNumericParity(rule: NumericParityRule, input: readonly number[]): IopEnglishTrace {
  const remaining = new Set(input);
  const originalOrder = [...input];
  let left: string[] = [];
  let right: string[] = [];
  const steps: string[][] = [];

  for (let index = 0; index < input.length / 2; index += 1) {
    const odds = [...remaining].filter((value) => value % 2 === 1).sort((a, b) => a - b);
    const evens = [...remaining].filter((value) => value % 2 === 0).sort((a, b) => a - b);
    if (rule.oddDirection === "DESC") odds.reverse();
    if (rule.evenDirection === "DESC") evens.reverse();
    const odd = odds[0];
    const even = evens[0];
    if (odd === undefined || even === undefined) throw new Error("Numeric parity oracle exhausted input");
    remaining.delete(odd);
    remaining.delete(even);

    const oddValue = rule.oddTransform === "REVERSE"
      ? parseInt(String(odd).split("").reverse().join(""), 10)
      : rule.oddTransform === "PLUS_ONE" ? odd + 1 : odd;
    const evenValue = rule.evenTransform === "REVERSE"
      ? parseInt(String(even).split("").reverse().join(""), 10)
      : rule.evenTransform === "PLUS_ONE" ? even + 1 : even;

    left = rule.oddFixedOrder === "PREPEND" ? [String(oddValue), ...left] : [...left, String(oddValue)];
    right = rule.evenFixedOrder === "APPEND" ? [...right, String(evenValue)] : [String(evenValue), ...right];
    steps.push([...left, ...originalOrder.filter((value) => remaining.has(value)).map(String), ...right]);
  }
  return { input: input.map(String), steps };
}

function numericParityCandidates(): readonly NumericParityRule[] {
  const result: NumericParityRule[] = [];
  for (const oddDirection of ["ASC", "DESC"] as const) {
    for (const evenDirection of ["ASC", "DESC"] as const) {
      for (const oddTransform of ["REVERSE", "PLUS_ONE", "UNCHANGED"] as const) {
        for (const evenTransform of ["REVERSE", "PLUS_ONE", "UNCHANGED"] as const) {
          for (const oddFixedOrder of ["PREPEND", "APPEND"] as const) {
            for (const evenFixedOrder of ["PREPEND", "APPEND"] as const) {
              result.push({ oddDirection, evenDirection, oddTransform, evenTransform, oddFixedOrder, evenFixedOrder });
            }
          }
        }
      }
    }
  }
  return result;
}

function numericRuleFingerprint(rule: NumericParityRule): string {
  return [rule.oddDirection, rule.evenDirection, rule.oddTransform, rule.evenTransform, rule.oddFixedOrder, rule.evenFixedOrder].join(":");
}

function numericIdentifiable(trace: IopEnglishTrace, input: readonly number[]): boolean {
  const expected = traceFingerprint(trace);
  const matches = new Set<string>();
  for (const candidate of numericParityCandidates()) {
    try {
      if (traceFingerprint(executeNumericParityRule(candidate, input)) === expected) matches.add(numericRuleFingerprint(candidate));
    } catch {
      // Non-executable alternatives cannot explain the illustration.
    }
  }
  return matches.size === 1 && matches.has(numericRuleFingerprint(NUMERIC_PARITY_RULE));
}

function createNumericInput(seed: string): number[] {
  const rng = makeRng(seed);
  return shuffle([
    ...shuffle(ODD_POOL, rng).slice(0, 5),
    ...shuffle(EVEN_POOL, rng).slice(0, 5),
  ], rng);
}

function safeNumericTrace(seed: string, requireIdentifiable: boolean): IopEnglishTrace {
  for (let attempt = 0; attempt < 240; attempt += 1) {
    const input = createNumericInput(`${seed}|${attempt}`);
    const trace = executeNumericParityRule(NUMERIC_PARITY_RULE, input);
    const oracle = oracleNumericParity(NUMERIC_PARITY_RULE, input);
    if (traceFingerprint(trace) !== traceFingerprint(oracle)) continue;
    if (!visibleRowsAreUnique(trace) || !elementsAreUnique(trace)) continue;
    if (requireIdentifiable && !numericIdentifiable(trace, input)) continue;
    return trace;
  }
  throw new Error(`Unable to generate safe numeric parity trace for ${seed}`);
}

export function generateIopEnglishNumericSource(seed: string): IopEnglishGeneratedSource {
  return {
    demonstration: safeNumericTrace(`${seed}|DEMO`, true),
    target: safeNumericTrace(`${seed}|TARGET`, false),
    ruleExplanation: "In each step, the smallest remaining odd number is selected, its digits are reversed, and the transformed value is added at the left before earlier processed odd values. At the same time, the smallest remaining even number is selected, increased by 1, and added at the right after earlier processed even values.",
    ruleIdentifiable: true,
    oracleParity: true,
  };
}

// ---------------------------------------------------------------------------
// IOP-QL-006: PracticeMock RBI-style text transformation pipeline.
// ---------------------------------------------------------------------------

type TextDirection = "ASC" | "DESC";
type TextStage3 = "REMOVE_VOWELS" | "REVERSE_WORD" | "UNCHANGED";
type TextShift = -2 | 0 | 2;

interface TextPipelineRule {
  readonly lastLetterDirection: TextDirection;
  readonly vowelCountDirection: TextDirection;
  readonly stage3: TextStage3;
  readonly characterSortDirection: TextDirection;
  readonly finalShift: TextShift;
}

const TEXT_RBI_RULE: TextPipelineRule = {
  lastLetterDirection: "ASC",
  vowelCountDirection: "ASC",
  stage3: "REMOVE_VOWELS",
  characterSortDirection: "ASC",
  finalShift: -2,
};

const TEXT_GROUPS: readonly (readonly string[])[] = [
  ["rhythm", "crypts", "lynx", "myths", "glyph"],
  ["brick", "plant", "desk", "swift", "march"],
  ["lemon", "river", "market", "silver", "planet"],
  ["banana", "tomato", "cinema", "animal", "orange"],
  ["aerial", "audio", "seaside", "adieu", "uremia"],
] as const;

function vowelCount(word: string): number {
  return [...word.toLowerCase()].filter((letter) => "aeiou".includes(letter)).length;
}

function sortWordsByLastLetter(words: readonly string[], direction: TextDirection): string[] {
  const result = [...words].sort((a, b) => {
    const primary = a.at(-1)!.localeCompare(b.at(-1)!, "en", { sensitivity: "base" });
    return primary || a.localeCompare(b, "en", { sensitivity: "base" });
  });
  if (direction === "DESC") result.reverse();
  return result;
}

function sortWordsByVowels(words: readonly string[], direction: TextDirection): string[] {
  const result = [...words].sort((a, b) => vowelCount(a) - vowelCount(b));
  if (direction === "DESC") result.reverse();
  return result;
}

function textStage3(word: string, transform: TextStage3): string {
  if (transform === "UNCHANGED") return word;
  if (transform === "REVERSE_WORD") return [...word].reverse().join("");
  return [...word].filter((letter) => !"aeiou".includes(letter.toLowerCase())).join("");
}

function sortCharacters(word: string, direction: TextDirection): string {
  const chars = [...word].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
  if (direction === "DESC") chars.reverse();
  return chars.join("");
}

function shiftLetter(letter: string, shift: TextShift): string {
  if (shift === 0) return letter;
  const lower = letter.toLowerCase();
  const base = "a".charCodeAt(0);
  const offset = (lower.charCodeAt(0) - base + shift + 26) % 26;
  return String.fromCharCode(base + offset);
}

function executeTextPipeline(rule: TextPipelineRule, input: readonly string[]): IopEnglishTrace {
  const step1 = sortWordsByLastLetter(input, rule.lastLetterDirection);
  const step2 = sortWordsByVowels(step1, rule.vowelCountDirection);
  const step3 = step2.map((word) => textStage3(word, rule.stage3));
  const step4 = step3.map((word) => sortCharacters(word, rule.characterSortDirection));
  const step5 = step4.map((word) => [...word].map((letter) => shiftLetter(letter, rule.finalShift)).join(""));
  return { input: [...input], steps: [step1, step2, step3, step4, step5] };
}

function oracleTextPipeline(rule: TextPipelineRule, input: readonly string[]): IopEnglishTrace {
  const byLast = [...input];
  byLast.sort((a, b) => a[a.length - 1]!.localeCompare(b[b.length - 1]!, "en"));
  if (rule.lastLetterDirection === "DESC") byLast.reverse();

  const byVowels = [...byLast];
  byVowels.sort((a, b) => {
    let av = 0;
    let bv = 0;
    for (const ch of a) if ("aeiou".includes(ch)) av += 1;
    for (const ch of b) if ("aeiou".includes(ch)) bv += 1;
    return av - bv;
  });
  if (rule.vowelCountDirection === "DESC") byVowels.reverse();

  const third = byVowels.map((word) => {
    if (rule.stage3 === "UNCHANGED") return word;
    if (rule.stage3 === "REVERSE_WORD") return word.split("").reverse().join("");
    let output = "";
    for (const ch of word) if (!"aeiou".includes(ch)) output += ch;
    return output;
  });

  const fourth = third.map((word) => {
    const chars = word.split("").sort();
    if (rule.characterSortDirection === "DESC") chars.reverse();
    return chars.join("");
  });

  const fifth = fourth.map((word) => {
    let result = "";
    for (const ch of word) {
      if (rule.finalShift === 0) result += ch;
      else result += String.fromCharCode(97 + ((ch.charCodeAt(0) - 97 + rule.finalShift + 26) % 26));
    }
    return result;
  });

  return { input: [...input], steps: [byLast, byVowels, third, fourth, fifth] };
}

function textCandidates(): readonly TextPipelineRule[] {
  const result: TextPipelineRule[] = [];
  for (const lastLetterDirection of ["ASC", "DESC"] as const) {
    for (const vowelCountDirection of ["ASC", "DESC"] as const) {
      for (const stage3 of ["REMOVE_VOWELS", "REVERSE_WORD", "UNCHANGED"] as const) {
        for (const characterSortDirection of ["ASC", "DESC"] as const) {
          for (const finalShift of [-2, 0, 2] as const) {
            result.push({ lastLetterDirection, vowelCountDirection, stage3, characterSortDirection, finalShift });
          }
        }
      }
    }
  }
  return result;
}

function textRuleFingerprint(rule: TextPipelineRule): string {
  return [rule.lastLetterDirection, rule.vowelCountDirection, rule.stage3, rule.characterSortDirection, rule.finalShift].join(":");
}

function createTextInput(seed: string): string[] {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const words = TEXT_GROUPS.map((group, index) => shuffle(group, makeRng(`${seed}|GROUP|${index}|${attempt}`))[0]!);
    if (new Set(words.map((word) => word.at(-1))).size !== words.length) continue;
    if (new Set(words.map(vowelCount)).size !== words.length) continue;
    return shuffle(words, makeRng(`${seed}|ORDER|${attempt}`));
  }
  throw new Error(`Unable to create tie-free text input for ${seed}`);
}

function textIdentifiable(trace: IopEnglishTrace, input: readonly string[]): boolean {
  const expected = traceFingerprint(trace);
  const matches = new Set<string>();
  for (const candidate of textCandidates()) {
    if (traceFingerprint(executeTextPipeline(candidate, input)) === expected) matches.add(textRuleFingerprint(candidate));
  }
  return matches.size === 1 && matches.has(textRuleFingerprint(TEXT_RBI_RULE));
}

function safeTextTrace(seed: string, requireIdentifiable: boolean): IopEnglishTrace {
  for (let attempt = 0; attempt < 160; attempt += 1) {
    const input = createTextInput(`${seed}|${attempt}`);
    const trace = executeTextPipeline(TEXT_RBI_RULE, input);
    const oracle = oracleTextPipeline(TEXT_RBI_RULE, input);
    if (traceFingerprint(trace) !== traceFingerprint(oracle)) continue;
    if (!visibleRowsAreUnique(trace) || !elementsAreUnique(trace)) continue;
    if (requireIdentifiable && !textIdentifiable(trace, input)) continue;
    return trace;
  }
  throw new Error(`Unable to generate safe RBI text trace for ${seed}`);
}

export function generateIopEnglishTextSource(seed: string): IopEnglishGeneratedSource {
  return {
    demonstration: safeTextTrace(`${seed}|DEMO`, true),
    target: safeTextTrace(`${seed}|TARGET`, false),
    ruleExplanation: "Step 1 arranges the words by their last letters. Step 2 arranges them by increasing vowel count. Step 3 removes all vowels, Step 4 alphabetizes the remaining letters inside each word, and Step 5 replaces each remaining letter by the second preceding alphabet letter.",
    ruleIdentifiable: true,
    oracleParity: true,
  };
}

// ---------------------------------------------------------------------------
// IOP-QL-008: AffairsCloud Set-37 source-normalized box arithmetic machine.
// ---------------------------------------------------------------------------

type BoxPairing = "SYMMETRIC" | "ADJACENT";
type BoxProductPattern = "CROSS" | "STRAIGHT";
type BoxCombine = "Q_PLUS_TENS_MINUS_ONES" | "Q_PLUS_TENS_PLUS_ONES" | "Q_PLUS_ONES_MINUS_TENS";
type BoxQuotient = "NEXT_OVER_CURRENT" | "CURRENT_OVER_NEXT";
type BoxFinal = "ABS_DIFF" | "SUM";

interface BoxRule {
  readonly pairing: BoxPairing;
  readonly productPattern: BoxProductPattern;
  readonly combine: BoxCombine;
  readonly quotient: BoxQuotient;
  readonly final: BoxFinal;
}

interface BoxInput {
  readonly a: number;
  readonly b: number;
}

const BOX_RULE: BoxRule = {
  pairing: "SYMMETRIC",
  productPattern: "CROSS",
  combine: "Q_PLUS_TENS_MINUS_ONES",
  quotient: "NEXT_OVER_CURRENT",
  final: "ABS_DIFF",
};

function pairIndices(pairing: BoxPairing): readonly (readonly [number, number])[] {
  return pairing === "SYMMETRIC" ? [[0, 3], [1, 4], [2, 5]] : [[0, 1], [2, 3], [4, 5]];
}

function products(left: BoxInput, right: BoxInput, pattern: BoxProductPattern): readonly [number, number] {
  return pattern === "CROSS" ? [left.a * right.b, left.b * right.a] : [left.a * right.a, left.b * right.b];
}

function combineBox(p: number, q: number, rule: BoxCombine): number {
  const tens = Math.floor(Math.abs(p) / 10) % 10;
  const ones = Math.abs(p) % 10;
  if (rule === "Q_PLUS_TENS_PLUS_ONES") return q + tens + ones;
  if (rule === "Q_PLUS_ONES_MINUS_TENS") return q + ones - tens;
  return q + tens - ones;
}

function fixed2(value: number): string {
  return (Math.round(value * 100) / 100).toFixed(2);
}

function executeBoxRule(rule: BoxRule, input: readonly BoxInput[]): IopEnglishTrace {
  if (input.length !== 6) throw new Error("Box source mode requires six input boxes");
  const stage1 = pairIndices(rule.pairing).map(([leftIndex, rightIndex]) => products(input[leftIndex]!, input[rightIndex]!, rule.productPattern));
  const stage2 = stage1.map(([p, q]) => combineBox(p, q, rule.combine));
  if (stage2.some((value) => value === 0)) throw new Error("Box source mode generated a zero divisor");
  const ratios = [0, 1].map((index) => rule.quotient === "NEXT_OVER_CURRENT"
    ? stage2[index + 1]! / stage2[index]!
    : stage2[index]! / stage2[index + 1]!);
  const finalValue = rule.final === "ABS_DIFF" ? Math.abs(ratios[0]! - ratios[1]!) : ratios[0]! + ratios[1]!;
  return {
    input: input.map((box, index) => `B${index + 1}[${box.a},${box.b}]`),
    steps: [
      stage1.map(([p, q], index) => `G${index + 1}(${p},${q})`),
      stage2.map(String),
      ratios.map(fixed2),
      [fixed2(finalValue)],
    ],
  };
}

function oracleBoxRule(rule: BoxRule, input: readonly BoxInput[]): IopEnglishTrace {
  const pairs = rule.pairing === "SYMMETRIC" ? [[0, 3], [1, 4], [2, 5]] as const : [[0, 1], [2, 3], [4, 5]] as const;
  const stage1: [number, number][] = [];
  for (const [leftIndex, rightIndex] of pairs) {
    const left = input[leftIndex]!;
    const right = input[rightIndex]!;
    stage1.push(rule.productPattern === "CROSS" ? [left.a * right.b, left.b * right.a] : [left.a * right.a, left.b * right.b]);
  }

  const stage2: number[] = [];
  for (const [p, q] of stage1) {
    const tens = Math.trunc(p / 10) % 10;
    const ones = p % 10;
    if (rule.combine === "Q_PLUS_TENS_PLUS_ONES") stage2.push(q + tens + ones);
    else if (rule.combine === "Q_PLUS_ONES_MINUS_TENS") stage2.push(q + ones - tens);
    else stage2.push(q + tens - ones);
  }
  if (stage2.some((value) => value === 0)) throw new Error("Box oracle zero divisor");

  const ratio1 = rule.quotient === "NEXT_OVER_CURRENT" ? stage2[1]! / stage2[0]! : stage2[0]! / stage2[1]!;
  const ratio2 = rule.quotient === "NEXT_OVER_CURRENT" ? stage2[2]! / stage2[1]! : stage2[1]! / stage2[2]!;
  const finalValue = rule.final === "ABS_DIFF" ? Math.abs(ratio1 - ratio2) : ratio1 + ratio2;
  return {
    input: input.map((box, index) => `B${index + 1}[${box.a},${box.b}]`),
    steps: [
      stage1.map(([p, q], index) => `G${index + 1}(${p},${q})`),
      stage2.map(String),
      [fixed2(ratio1), fixed2(ratio2)],
      [fixed2(finalValue)],
    ],
  };
}

function boxCandidates(): readonly BoxRule[] {
  const result: BoxRule[] = [];
  for (const pairing of ["SYMMETRIC", "ADJACENT"] as const) {
    for (const productPattern of ["CROSS", "STRAIGHT"] as const) {
      for (const combine of ["Q_PLUS_TENS_MINUS_ONES", "Q_PLUS_TENS_PLUS_ONES", "Q_PLUS_ONES_MINUS_TENS"] as const) {
        for (const quotient of ["NEXT_OVER_CURRENT", "CURRENT_OVER_NEXT"] as const) {
          for (const final of ["ABS_DIFF", "SUM"] as const) result.push({ pairing, productPattern, combine, quotient, final });
        }
      }
    }
  }
  return result;
}

function boxRuleFingerprint(rule: BoxRule): string {
  return [rule.pairing, rule.productPattern, rule.combine, rule.quotient, rule.final].join(":");
}

function boxIdentifiable(trace: IopEnglishTrace, input: readonly BoxInput[]): boolean {
  const expected = traceFingerprint(trace);
  const matches = new Set<string>();
  for (const candidate of boxCandidates()) {
    try {
      if (traceFingerprint(executeBoxRule(candidate, input)) === expected) matches.add(boxRuleFingerprint(candidate));
    } catch {
      // Invalid alternatives cannot explain the visible pipeline.
    }
  }
  return matches.size === 1 && matches.has(boxRuleFingerprint(BOX_RULE));
}

function createBoxInput(seed: string): BoxInput[] {
  const rng = makeRng(seed);
  return Array.from({ length: 6 }, () => ({ a: 1 + Math.floor(rng() * 9), b: 1 + Math.floor(rng() * 9) }));
}

function boxSourceShapeIsSafe(input: readonly BoxInput[], trace: IopEnglishTrace): boolean {
  const stage1 = pairIndices("SYMMETRIC").map(([i, j]) => products(input[i]!, input[j]!, "CROSS"));
  if (stage1.some(([p, q]) => p < 10 || p > 99 || q < 1 || q > 9)) return false;
  const stage2 = stage1.map(([p, q]) => combineBox(p, q, "Q_PLUS_TENS_MINUS_ONES"));
  if (stage2.some((value) => value <= 0)) return false;
  if (new Set(stage2).size !== stage2.length) return false;
  return visibleRowsAreUnique(trace) && elementsAreUnique(trace);
}

function safeBoxTrace(seed: string, requireIdentifiable: boolean): IopEnglishTrace {
  for (let attempt = 0; attempt < 600; attempt += 1) {
    const input = createBoxInput(`${seed}|${attempt}`);
    let trace: IopEnglishTrace;
    try {
      trace = executeBoxRule(BOX_RULE, input);
      if (traceFingerprint(trace) !== traceFingerprint(oracleBoxRule(BOX_RULE, input))) continue;
    } catch {
      continue;
    }
    if (!boxSourceShapeIsSafe(input, trace)) continue;
    if (requireIdentifiable && !boxIdentifiable(trace, input)) continue;
    return trace;
  }
  throw new Error(`Unable to generate safe box source trace for ${seed}`);
}

export function generateIopEnglishBoxSource(seed: string): IopEnglishGeneratedSource {
  return {
    demonstration: safeBoxTrace(`${seed}|DEMO`, true),
    target: safeBoxTrace(`${seed}|TARGET`, false),
    ruleExplanation: "The six input boxes are paired symmetrically (1 with 4, 2 with 5, 3 with 6). Step 1 forms the two cross-products for each pair. In Step 2, add the one-digit cross-product to the tens digit of the two-digit cross-product and subtract its units digit. Step 3 divides the next Step-2 value by the current one for adjacent pairs. Step 4 is the absolute difference of the two quotients.",
    ruleIdentifiable: true,
    oracleParity: true,
  };
}
