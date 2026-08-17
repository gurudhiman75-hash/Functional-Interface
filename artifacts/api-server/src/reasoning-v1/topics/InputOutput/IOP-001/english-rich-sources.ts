import { executeAdvancedProgram } from "./advanced-engine.ts";
import { evaluateAdvancedIdentifiability } from "./advanced-identifiability.ts";
import { assertAdvancedOracleParity, reconstructAdvancedTraceOracle } from "./advanced-oracle.ts";
import { IOP_ADVANCED_PROTOTYPES } from "./advanced-prototypes.ts";
import type { IopAdvancedPrototypeId, IopAdvancedToken, IopAdvancedTrace } from "./advanced-types.ts";
import { executeMachine } from "./engine.ts";
import { evaluateRuleIdentifiability } from "./identifiability.ts";
import { assertOracleParity, reconstructTraceOracle } from "./oracle.ts";
import { IOP_FOUNDATION_PROTOTYPES } from "./prototypes.ts";
import type { IopMachineTrace, IopPrototypeId, IopToken } from "./types.ts";
import { explainMachineRule } from "./generator.ts";
import { explainAdvancedProgram } from "./advanced-generator.ts";
import {
  assertIopMixedSourceOracleParity,
  evaluateIopMixedSourceIdentifiability,
  executeIopMixedSourceRule,
  IOP_MIXED_SOURCE_RULE,
  reconstructIopMixedSourceOracle,
  type IopMixedSourceToken,
  type IopMixedSourceTrace,
} from "./mixed-source-gap.ts";
import type { IopEnglishGeneratedSource, IopEnglishTrace } from "./english-production-types.ts";
import type { IopEnglishEngineKind } from "./english-production.ts";

export interface IopRichEnglishSourceRequest {
  readonly sourceModeId: string;
  readonly engineKind: IopEnglishEngineKind;
  readonly prototypeId?: IopPrototypeId | IopAdvancedPrototypeId;
}

const LENGTH_WORD_BUCKETS = Object.freeze({
  3: ["ant", "axe", "bee", "box", "cat", "cup", "dog", "fan", "gem", "hut", "ink", "jar", "key", "log", "map", "net", "owl", "pen", "rug", "sun", "van", "web", "yak", "zip"],
  4: ["arch", "bark", "beam", "bird", "blue", "book", "cave", "clay", "coin", "dawn", "drum", "farm", "fish", "gate", "gold", "hill", "lamp", "leaf", "moon", "nest", "pine", "road", "star", "wave"],
  5: ["apple", "brick", "cloud", "dream", "eagle", "flame", "grape", "horse", "ivory", "lemon", "mango", "night", "ocean", "pearl", "queen", "river", "stone", "tiger", "urban", "wheat", "youth", "zebra", "plant", "chair"],
  6: ["anchor", "basket", "candle", "desert", "forest", "garden", "harbor", "island", "jacket", "kernel", "magnet", "nectar", "orange", "planet", "silver", "temple", "valley", "winter", "yellow", "bridge", "castle", "dragon", "fabric", "hunter"],
  7: ["airport", "blanket", "crystal", "dolphin", "emerald", "freedom", "gallery", "highway", "journey", "kingdom", "lantern", "machine", "orchard", "picture", "rainbow", "station", "thunder", "village", "weather", "bicycle", "captain", "diamond", "evening", "harvest"],
  8: ["elephant", "mountain", "notebook", "building", "hospital", "sunshine", "computer", "football", "daughter", "festival", "language", "medicine", "painting", "sandwich", "shoulder", "umbrella", "vacation", "wildlife", "airplane", "calendar", "dinosaur", "envelope", "fountain", "headache"],
  9: ["adventure", "chocolate", "education", "fireplace", "happiness", "newspaper", "orchestra", "telephone", "vegetable", "waterfall", "apartment", "breakfast", "chemistry", "direction", "evergreen", "furniture", "geography", "household", "important", "jellyfish", "knowledge", "landscape", "moonlight", "passenger"],
  10: ["strawberry", "basketball", "blackboard", "friendship", "playground", "restaurant", "toothbrush", "understand", "volleyball", "watermelon", "earthquake", "everywhere", "flashlight", "helicopter", "lighthouse", "motorcycle", "population", "spacecraft", "television", "university"],
} satisfies Readonly<Record<number, readonly string[]>>);

const ZERO_VOWEL_WORDS = Object.freeze([
  "rhythm", "crypt", "crypts", "myths", "myth", "glyph", "glyphs", "lynx", "sync", "cyst", "nymph", "nymphs",
  "tryst", "trysts", "gypsy", "flyby", "myrrh", "psych", "sphynx", "syzygy", "dryly", "slyly", "shyly", "spryly",
]);

export const IOP_RICH_GENERAL_WORD_POOL = Object.freeze([...new Set(Object.values(LENGTH_WORD_BUCKETS).flat())]);
export const IOP_RICH_GENERAL_NUMBER_POOL = Object.freeze(Array.from({ length: 89 }, (_, index) => index + 11));
export const IOP_RICH_MIXED_NUMBER_POOL = Object.freeze(Array.from({ length: 900 }, (_, index) => index + 100));

function vowelCount(word: string): number {
  return [...word.toLowerCase()].filter((letter) => "aeiou".includes(letter)).length;
}

export const IOP_RICH_TEXT_VOWEL_BUCKETS = Object.freeze({
  0: ZERO_VOWEL_WORDS,
  1: Object.freeze(IOP_RICH_GENERAL_WORD_POOL.filter((word) => vowelCount(word) === 1)),
  2: Object.freeze(IOP_RICH_GENERAL_WORD_POOL.filter((word) => vowelCount(word) === 2)),
  3: Object.freeze(IOP_RICH_GENERAL_WORD_POOL.filter((word) => vowelCount(word) === 3)),
  4: Object.freeze(IOP_RICH_GENERAL_WORD_POOL.filter((word) => vowelCount(word) === 4)),
} satisfies Readonly<Record<number, readonly string[]>>);

const LENGTH_BUCKET_SIZES = Object.values(LENGTH_WORD_BUCKETS).map((bucket) => bucket.length);
const TEXT_BUCKET_SIZES = Object.values(IOP_RICH_TEXT_VOWEL_BUCKETS).map((bucket) => bucket.length);

export const IOP_RICH_OBJECT_POOL_STATS = Object.freeze({
  generalWordCount: IOP_RICH_GENERAL_WORD_POOL.length,
  generalNumberCount: IOP_RICH_GENERAL_NUMBER_POOL.length,
  lengthBucketCount: Object.keys(LENGTH_WORD_BUCKETS).length,
  minWordsPerLengthBucket: Math.min(...LENGTH_BUCKET_SIZES),
  textVowelBucketCount: Object.keys(IOP_RICH_TEXT_VOWEL_BUCKETS).length,
  minWordsPerTextVowelBucket: Math.min(...TEXT_BUCKET_SIZES),
  mixedNumberCandidateCount: IOP_RICH_MIXED_NUMBER_POOL.length,
  numericOddCandidateCount: IOP_RICH_GENERAL_NUMBER_POOL.filter((value) => value % 2 === 1).length,
  numericEvenCandidateCount: IOP_RICH_GENERAL_NUMBER_POOL.filter((value) => value % 2 === 0).length,
});

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

function pickDistinct<T>(pool: readonly T[], count: number, rng: () => number): T[] {
  if (count > pool.length) throw new Error(`Cannot select ${count} objects from a rich pool of ${pool.length}`);
  return shuffle(pool, rng).slice(0, count);
}

function rowFingerprint(row: readonly string[]): string {
  return row.join("\u241f");
}

function traceFingerprint(trace: IopEnglishTrace): string {
  return [trace.input, ...trace.steps].map(rowFingerprint).join("\u241e");
}

function traceRowsAreUnique(trace: IopEnglishTrace): boolean {
  const rows = [trace.input, ...trace.steps].map(rowFingerprint);
  return new Set(rows).size === rows.length;
}

function traceElementsAreUnique(trace: IopEnglishTrace): boolean {
  return [trace.input, ...trace.steps].every((row) => new Set(row).size === row.length);
}

function normalizeFoundation(trace: IopMachineTrace): IopEnglishTrace {
  return {
    input: trace.input.map((token) => token.visibleValue),
    steps: trace.steps.map((step) => step.tokens.map((token) => token.visibleValue)),
  };
}

function makeFoundationInput(prototypeId: IopPrototypeId, seed: string): readonly IopToken[] {
  const authority = IOP_FOUNDATION_PROTOTYPES.find((candidate) => candidate.prototypeId === prototypeId);
  if (!authority) throw new Error(`Unknown foundation authority ${prototypeId}`);
  const rng = makeRng(seed);
  const words = pickDistinct(IOP_RICH_GENERAL_WORD_POOL, authority.wordCount, rng).map((value, index) => ({
    id: `W${index + 1}`,
    kind: "WORD" as const,
    visibleValue: value,
    originalPosition: -1,
  }));
  const numbers = pickDistinct(IOP_RICH_GENERAL_NUMBER_POOL, authority.numberCount, rng).map((value, index) => ({
    id: `N${index + 1}`,
    kind: "NUMBER" as const,
    visibleValue: String(value),
    originalPosition: -1,
  }));
  return shuffle([...words, ...numbers], rng).map((token, originalPosition) => ({ ...token, originalPosition }));
}

function safeFoundationTrace(prototypeId: IopPrototypeId, seed: string, requireIdentifiable: boolean): IopMachineTrace {
  const authority = IOP_FOUNDATION_PROTOTYPES.find((candidate) => candidate.prototypeId === prototypeId);
  if (!authority) throw new Error(`Unknown foundation authority ${prototypeId}`);
  for (let attempt = 0; attempt < 240; attempt += 1) {
    const input = makeFoundationInput(prototypeId, `${seed}|${attempt}`);
    const trace = executeMachine(authority.rule, input);
    if (trace.steps.length < 4) continue;
    try {
      assertOracleParity(trace, reconstructTraceOracle(authority.rule, input));
    } catch {
      continue;
    }
    const normalized = normalizeFoundation(trace);
    if (!traceRowsAreUnique(normalized) || !traceElementsAreUnique(normalized)) continue;
    if (requireIdentifiable && !evaluateRuleIdentifiability(authority.rule, trace).passed) continue;
    return trace;
  }
  throw new Error(`Unable to generate rich foundation trace for ${prototypeId}/${seed}`);
}

function generateRichFoundation(seed: string, prototypeId: IopPrototypeId): IopEnglishGeneratedSource {
  const authority = IOP_FOUNDATION_PROTOTYPES.find((candidate) => candidate.prototypeId === prototypeId);
  if (!authority) throw new Error(`Unknown foundation authority ${prototypeId}`);
  return {
    demonstration: normalizeFoundation(safeFoundationTrace(prototypeId, `${seed}|DEMO`, true)),
    target: normalizeFoundation(safeFoundationTrace(prototypeId, `${seed}|TARGET`, false)),
    ruleExplanation: explainMachineRule(authority.rule),
    ruleIdentifiable: true,
    oracleParity: true,
  };
}

function digitSum(value: number | string): number {
  return [...String(value)].reduce((sum, digit) => sum + Number(digit), 0);
}

function advancedInput(prototypeId: IopAdvancedPrototypeId, seed: string): readonly IopAdvancedToken[] {
  const authority = IOP_ADVANCED_PROTOTYPES.find((candidate) => candidate.prototypeId === prototypeId);
  if (!authority) throw new Error(`Unknown advanced authority ${prototypeId}`);
  const rng = makeRng(seed);
  let selected: string[];

  if (prototypeId === "IOP-CP005-PROT-001" || prototypeId === "IOP-CP005-PROT-003") {
    const lengths = shuffle(Object.keys(LENGTH_WORD_BUCKETS).map(Number), rng).slice(0, authority.tokenCount);
    selected = lengths.map((length, index) => {
      const bucket = LENGTH_WORD_BUCKETS[length as keyof typeof LENGTH_WORD_BUCKETS];
      return shuffle(bucket, makeRng(`${seed}|LENGTH|${length}|${index}`))[0]!;
    });
  } else if (prototypeId === "IOP-CP005-PROT-002") {
    const bySum = new Map<number, number[]>();
    for (const value of IOP_RICH_GENERAL_NUMBER_POOL) {
      const sum = digitSum(value);
      const bucket = bySum.get(sum) ?? [];
      bucket.push(value);
      bySum.set(sum, bucket);
    }
    const sums = shuffle([...bySum.keys()], rng).slice(0, authority.tokenCount);
    selected = sums.map((sum, index) => String(shuffle(bySum.get(sum)!, makeRng(`${seed}|SUM|${sum}|${index}`))[0]!));
  } else {
    throw new Error(`${prototypeId} is not part of the rich English attribute authority`);
  }

  return shuffle(selected, rng).map((visibleValue, originalPosition) => ({
    id: `${authority.tokenKind[0]}${originalPosition + 1}`,
    kind: authority.tokenKind,
    originalValue: visibleValue,
    visibleValue,
    originalPosition,
  }));
}

function normalizeAdvanced(trace: IopAdvancedTrace): IopEnglishTrace {
  return {
    input: trace.input.map((token) => token.visibleValue),
    steps: trace.steps.map((step) => step.tokens.map((token) => token.visibleValue)),
  };
}

function safeAdvancedTrace(prototypeId: IopAdvancedPrototypeId, seed: string, requireIdentifiable: boolean): IopAdvancedTrace {
  const authority = IOP_ADVANCED_PROTOTYPES.find((candidate) => candidate.prototypeId === prototypeId);
  if (!authority) throw new Error(`Unknown advanced authority ${prototypeId}`);
  for (let attempt = 0; attempt < 320; attempt += 1) {
    const input = advancedInput(prototypeId, `${seed}|${attempt}`);
    let trace: IopAdvancedTrace;
    try {
      trace = executeAdvancedProgram(authority.program, input);
      if (trace.steps.length < 4) continue;
      assertAdvancedOracleParity(trace, reconstructAdvancedTraceOracle(authority.program, input));
    } catch {
      continue;
    }
    const normalized = normalizeAdvanced(trace);
    if (!traceRowsAreUnique(normalized) || !traceElementsAreUnique(normalized)) continue;
    if (requireIdentifiable && !evaluateAdvancedIdentifiability(authority.program, trace).passed) continue;
    return trace;
  }
  throw new Error(`Unable to generate rich advanced trace for ${prototypeId}/${seed}`);
}

function generateRichAdvanced(seed: string, prototypeId: IopAdvancedPrototypeId): IopEnglishGeneratedSource {
  const authority = IOP_ADVANCED_PROTOTYPES.find((candidate) => candidate.prototypeId === prototypeId);
  if (!authority) throw new Error(`Unknown advanced authority ${prototypeId}`);
  return {
    demonstration: normalizeAdvanced(safeAdvancedTrace(prototypeId, `${seed}|DEMO`, true)),
    target: normalizeAdvanced(safeAdvancedTrace(prototypeId, `${seed}|TARGET`, false)),
    ruleExplanation: explainAdvancedProgram(authority.program),
    ruleIdentifiable: true,
    oracleParity: true,
  };
}

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

function transformNumber(value: number, transform: NumericTransform): number {
  if (transform === "PLUS_ONE") return value + 1;
  if (transform === "REVERSE") return Number(String(value).split("").reverse().join(""));
  return value;
}

function chooseNumeric(values: readonly number[], parity: "ODD" | "EVEN", direction: NumericDirection): number {
  const eligible = values.filter((value) => parity === "ODD" ? value % 2 === 1 : value % 2 === 0).sort((a, b) => a - b);
  if (direction === "DESC") eligible.reverse();
  const selected = eligible[0];
  if (selected === undefined) throw new Error(`No ${parity.toLowerCase()} number remains`);
  return selected;
}

function executeNumericParity(rule: NumericParityRule, input: readonly number[]): IopEnglishTrace {
  let remaining = [...input];
  let left: string[] = [];
  let right: string[] = [];
  const steps: string[][] = [];
  for (let index = 0; index < input.length / 2; index += 1) {
    const odd = chooseNumeric(remaining, "ODD", rule.oddDirection);
    const even = chooseNumeric(remaining, "EVEN", rule.evenDirection);
    remaining = remaining.filter((value) => value !== odd && value !== even);
    const oddVisible = String(transformNumber(odd, rule.oddTransform));
    const evenVisible = String(transformNumber(even, rule.evenTransform));
    left = rule.oddFixedOrder === "PREPEND" ? [oddVisible, ...left] : [...left, oddVisible];
    right = rule.evenFixedOrder === "APPEND" ? [...right, evenVisible] : [evenVisible, ...right];
    steps.push([...left, ...remaining.map(String), ...right]);
  }
  return { input: input.map(String), steps };
}

function oracleNumericParity(rule: NumericParityRule, input: readonly number[]): IopEnglishTrace {
  const remaining = new Set(input);
  const original = [...input];
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
    const oddVisible = String(transformNumber(odd, rule.oddTransform));
    const evenVisible = String(transformNumber(even, rule.evenTransform));
    left = rule.oddFixedOrder === "PREPEND" ? [oddVisible, ...left] : [...left, oddVisible];
    right = rule.evenFixedOrder === "APPEND" ? [...right, evenVisible] : [evenVisible, ...right];
    steps.push([...left, ...original.filter((value) => remaining.has(value)).map(String), ...right]);
  }
  return { input: input.map(String), steps };
}

function numericCandidates(): readonly NumericParityRule[] {
  const candidates: NumericParityRule[] = [];
  for (const oddDirection of ["ASC", "DESC"] as const) {
    for (const evenDirection of ["ASC", "DESC"] as const) {
      for (const oddTransform of ["REVERSE", "PLUS_ONE", "UNCHANGED"] as const) {
        for (const evenTransform of ["REVERSE", "PLUS_ONE", "UNCHANGED"] as const) {
          for (const oddFixedOrder of ["PREPEND", "APPEND"] as const) {
            for (const evenFixedOrder of ["PREPEND", "APPEND"] as const) {
              candidates.push({ oddDirection, evenDirection, oddTransform, evenTransform, oddFixedOrder, evenFixedOrder });
            }
          }
        }
      }
    }
  }
  return candidates;
}

function numericRuleFingerprint(rule: NumericParityRule): string {
  return [rule.oddDirection, rule.evenDirection, rule.oddTransform, rule.evenTransform, rule.oddFixedOrder, rule.evenFixedOrder].join(":");
}

function numericIdentifiable(trace: IopEnglishTrace, input: readonly number[]): boolean {
  const expected = traceFingerprint(trace);
  const matches = new Set<string>();
  for (const candidate of numericCandidates()) {
    try {
      if (traceFingerprint(executeNumericParity(candidate, input)) === expected) matches.add(numericRuleFingerprint(candidate));
    } catch {
      // Candidate does not explain the visible trace.
    }
  }
  return matches.size === 1 && matches.has(numericRuleFingerprint(NUMERIC_PARITY_RULE));
}

function richNumericInput(seed: string): number[] {
  const rng = makeRng(seed);
  const odds = IOP_RICH_GENERAL_NUMBER_POOL.filter((value) => value % 2 === 1);
  const evens = IOP_RICH_GENERAL_NUMBER_POOL.filter((value) => value % 2 === 0);
  return shuffle([...pickDistinct(odds, 5, rng), ...pickDistinct(evens, 5, rng)], rng);
}

function safeNumericParityTrace(seed: string, requireIdentifiable: boolean): IopEnglishTrace {
  for (let attempt = 0; attempt < 320; attempt += 1) {
    const input = richNumericInput(`${seed}|${attempt}`);
    const trace = executeNumericParity(NUMERIC_PARITY_RULE, input);
    if (traceFingerprint(trace) !== traceFingerprint(oracleNumericParity(NUMERIC_PARITY_RULE, input))) continue;
    if (!traceRowsAreUnique(trace) || !traceElementsAreUnique(trace)) continue;
    if (requireIdentifiable && !numericIdentifiable(trace, input)) continue;
    return trace;
  }
  throw new Error(`Unable to generate rich numeric parity trace for ${seed}`);
}

function generateRichNumeric(seed: string): IopEnglishGeneratedSource {
  return {
    demonstration: safeNumericParityTrace(`${seed}|DEMO`, true),
    target: safeNumericParityTrace(`${seed}|TARGET`, false),
    ruleExplanation: "In each step, select the smallest remaining odd number and the smallest remaining even number. Reverse the digits of the odd number and place that result at the left before earlier processed odd results. Increase the even number by 1 and place that result at the right after earlier processed even results.",
    ruleIdentifiable: true,
    oracleParity: true,
  };
}

type TextDirection = "ASC" | "DESC";
type TextStage3 = "REMOVE_VOWELS" | "REVERSE_WORD" | "UNCHANGED";
type TextShift = -2 | 0 | 2;

interface TextRule {
  readonly lastLetterDirection: TextDirection;
  readonly vowelCountDirection: TextDirection;
  readonly stage3: TextStage3;
  readonly characterSortDirection: TextDirection;
  readonly finalShift: TextShift;
}

const TEXT_RULE: TextRule = {
  lastLetterDirection: "ASC",
  vowelCountDirection: "ASC",
  stage3: "REMOVE_VOWELS",
  characterSortDirection: "ASC",
  finalShift: -2,
};

function sortByLastLetter(words: readonly string[], direction: TextDirection): string[] {
  const result = [...words].sort((a, b) => {
    const primary = a.at(-1)!.localeCompare(b.at(-1)!, "en", { sensitivity: "base" });
    return primary || a.localeCompare(b, "en", { sensitivity: "base" });
  });
  if (direction === "DESC") result.reverse();
  return result;
}

function sortByVowelCount(words: readonly string[], direction: TextDirection): string[] {
  const result = [...words].sort((a, b) => vowelCount(a) - vowelCount(b));
  if (direction === "DESC") result.reverse();
  return result;
}

function textTransform(word: string, stage: TextStage3): string {
  if (stage === "UNCHANGED") return word;
  if (stage === "REVERSE_WORD") return [...word].reverse().join("");
  return [...word].filter((letter) => !"aeiou".includes(letter.toLowerCase())).join("");
}

function sortCharacters(word: string, direction: TextDirection): string {
  const chars = [...word].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
  if (direction === "DESC") chars.reverse();
  return chars.join("");
}

function shiftLetter(letter: string, shift: TextShift): string {
  if (shift === 0) return letter;
  const code = letter.toLowerCase().charCodeAt(0) - 97;
  return String.fromCharCode(97 + ((code + shift + 26) % 26));
}

function executeTextRule(rule: TextRule, input: readonly string[]): IopEnglishTrace {
  const step1 = sortByLastLetter(input, rule.lastLetterDirection);
  const step2 = sortByVowelCount(step1, rule.vowelCountDirection);
  const step3 = step2.map((word) => textTransform(word, rule.stage3));
  const step4 = step3.map((word) => sortCharacters(word, rule.characterSortDirection));
  const step5 = step4.map((word) => [...word].map((letter) => shiftLetter(letter, rule.finalShift)).join(""));
  return { input: [...input], steps: [step1, step2, step3, step4, step5] };
}

function oracleTextRule(rule: TextRule, input: readonly string[]): IopEnglishTrace {
  const first = [...input].sort((a, b) => a[a.length - 1]!.localeCompare(b[b.length - 1]!, "en"));
  if (rule.lastLetterDirection === "DESC") first.reverse();
  const second = [...first].sort((a, b) => vowelCount(a) - vowelCount(b));
  if (rule.vowelCountDirection === "DESC") second.reverse();
  const third = second.map((word) => {
    if (rule.stage3 === "UNCHANGED") return word;
    if (rule.stage3 === "REVERSE_WORD") return word.split("").reverse().join("");
    let result = "";
    for (const ch of word) if (!"aeiou".includes(ch.toLowerCase())) result += ch;
    return result;
  });
  const fourth = third.map((word) => {
    const chars = word.split("").sort();
    if (rule.characterSortDirection === "DESC") chars.reverse();
    return chars.join("");
  });
  const fifth = fourth.map((word) => word.split("").map((ch) => shiftLetter(ch, rule.finalShift)).join(""));
  return { input: [...input], steps: [first, second, third, fourth, fifth] };
}

function textCandidates(): readonly TextRule[] {
  const result: TextRule[] = [];
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

function textRuleFingerprint(rule: TextRule): string {
  return [rule.lastLetterDirection, rule.vowelCountDirection, rule.stage3, rule.characterSortDirection, rule.finalShift].join(":");
}

function richTextInput(seed: string): string[] {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const words = ([0, 1, 2, 3, 4] as const).map((count, index) => {
      const bucket = IOP_RICH_TEXT_VOWEL_BUCKETS[count];
      return shuffle(bucket, makeRng(`${seed}|VOWEL|${count}|${index}|${attempt}`))[0]!;
    });
    if (new Set(words.map((word) => word.at(-1))).size !== words.length) continue;
    return shuffle(words, makeRng(`${seed}|ORDER|${attempt}`));
  }
  throw new Error(`Unable to construct rich text input for ${seed}`);
}

function textIdentifiable(trace: IopEnglishTrace, input: readonly string[]): boolean {
  const expected = traceFingerprint(trace);
  const matches = new Set<string>();
  for (const candidate of textCandidates()) {
    if (traceFingerprint(executeTextRule(candidate, input)) === expected) matches.add(textRuleFingerprint(candidate));
  }
  return matches.size === 1 && matches.has(textRuleFingerprint(TEXT_RULE));
}

function safeTextTrace(seed: string, requireIdentifiable: boolean): IopEnglishTrace {
  for (let attempt = 0; attempt < 260; attempt += 1) {
    const input = richTextInput(`${seed}|${attempt}`);
    const trace = executeTextRule(TEXT_RULE, input);
    const oracle = oracleTextRule(TEXT_RULE, input);
    if (traceFingerprint(trace) !== traceFingerprint(oracle)) continue;
    if (!traceRowsAreUnique(trace) || !traceElementsAreUnique(trace)) continue;
    if (requireIdentifiable && !textIdentifiable(trace, input)) continue;
    return trace;
  }
  throw new Error(`Unable to generate rich text trace for ${seed}`);
}

function generateRichText(seed: string): IopEnglishGeneratedSource {
  return {
    demonstration: safeTextTrace(`${seed}|DEMO`, true),
    target: safeTextTrace(`${seed}|TARGET`, false),
    ruleExplanation: "Step 1 arranges the words by their last letters in alphabetical order. Step 2 arranges those words by increasing number of vowels. Step 3 removes all vowels from every word. Step 4 alphabetically arranges the remaining letters inside each word. Step 5 replaces every remaining letter by the letter two places before it in the alphabet.",
    ruleIdentifiable: true,
    oracleParity: true,
  };
}

function normalizeMixed(trace: IopMixedSourceTrace): IopEnglishTrace {
  return {
    input: trace.input.map((token) => token.visibleValue),
    steps: trace.steps.map((step) => step.tokens.map((token) => token.visibleValue)),
  };
}

function richMixedInput(seed: string): readonly IopMixedSourceToken[] {
  const rng = makeRng(seed);
  const words = pickDistinct(IOP_RICH_GENERAL_WORD_POOL, 5, rng);
  const byDigitSum = new Map<number, number[]>();
  for (const value of IOP_RICH_MIXED_NUMBER_POOL) {
    const sum = digitSum(value);
    const bucket = byDigitSum.get(sum) ?? [];
    bucket.push(value);
    byDigitSum.set(sum, bucket);
  }
  const sums = shuffle([...byDigitSum.keys()], rng).slice(0, 5);
  const numbers = sums.map((sum, index) => shuffle(byDigitSum.get(sum)!, makeRng(`${seed}|MIXED-SUM|${sum}|${index}`))[0]!);
  const tokens: IopMixedSourceToken[] = [
    ...words.map((value, index) => ({ id: `W${index + 1}`, kind: "WORD" as const, originalValue: value, visibleValue: value, originalPosition: -1 })),
    ...numbers.map((value, index) => ({ id: `N${index + 1}`, kind: "NUMBER" as const, originalValue: String(value), visibleValue: String(value), originalPosition: -1 })),
  ];
  return shuffle(tokens, rng).map((token, originalPosition) => ({ ...token, originalPosition }));
}

function safeMixedTrace(seed: string, requireIdentifiable: boolean): IopMixedSourceTrace {
  for (let attempt = 0; attempt < 260; attempt += 1) {
    const input = richMixedInput(`${seed}|${attempt}`);
    const trace = executeIopMixedSourceRule(IOP_MIXED_SOURCE_RULE, input);
    assertIopMixedSourceOracleParity(trace, reconstructIopMixedSourceOracle(IOP_MIXED_SOURCE_RULE, input));
    const normalized = normalizeMixed(trace);
    if (!traceRowsAreUnique(normalized) || !traceElementsAreUnique(normalized)) continue;
    if (requireIdentifiable && !evaluateIopMixedSourceIdentifiability(IOP_MIXED_SOURCE_RULE, trace).passed) continue;
    return trace;
  }
  throw new Error(`Unable to generate rich mixed RBI trace for ${seed}`);
}

function generateRichMixed(seed: string): IopEnglishGeneratedSource {
  return {
    demonstration: normalizeMixed(safeMixedTrace(`${seed}|DEMO`, true)),
    target: normalizeMixed(safeMixedTrace(`${seed}|TARGET`, false)),
    ruleExplanation: "In each step, select the alphabetically first remaining word and the smallest remaining number. Replace every vowel in the selected word by the next alphabet letter, replace the selected number by its digit sum, and place the transformed number-word pair at the left before the pairs already processed.",
    ruleIdentifiable: true,
    oracleParity: true,
  };
}

export function generateIopRichEnglishSource(seed: string, request: IopRichEnglishSourceRequest): IopEnglishGeneratedSource {
  if (request.engineKind === "FOUNDATION_PROTOTYPE") {
    if (!request.prototypeId) throw new Error(`${request.sourceModeId} is missing its foundation prototype`);
    return generateRichFoundation(seed, request.prototypeId as IopPrototypeId);
  }
  if (request.engineKind === "ADVANCED_PROTOTYPE") {
    if (!request.prototypeId) throw new Error(`${request.sourceModeId} is missing its advanced prototype`);
    return generateRichAdvanced(seed, request.prototypeId as IopAdvancedPrototypeId);
  }
  if (request.engineKind === "NUMERIC_PARITY_SOURCE") return generateRichNumeric(seed);
  if (request.engineKind === "TEXT_RBI_SOURCE") return generateRichText(seed);
  if (request.engineKind === "MIXED_RBI_SOURCE") return generateRichMixed(seed);
  throw new Error(`${request.sourceModeId} uses ${request.engineKind}; rich box generation remains owned by english-box-production.ts`);
}
