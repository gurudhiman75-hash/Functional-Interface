import { IOP_001_LIFECYCLE } from "./lifecycle.ts";
import type { IopDifficulty, IopLifecycle, IopOption } from "./types.ts";

export type IopMixedSourceWordTransform = "VOWELS_PLUS_ONE" | "REVERSE_WORD" | "UNCHANGED";
export type IopMixedSourceNumberTransform = "DIGIT_SUM" | "REVERSE_DIGITS" | "UNCHANGED";
export type IopMixedSourceDirection = "ASC" | "DESC";
export type IopMixedSourcePlacement = "PREPEND_PAIR" | "APPEND_PAIR";
export type IopMixedSourcePairOrder = "NUMBER_WORD" | "WORD_NUMBER";

export interface IopMixedSourceRule {
  readonly id: string;
  readonly wordDirection: IopMixedSourceDirection;
  readonly numberDirection: IopMixedSourceDirection;
  readonly wordTransform: IopMixedSourceWordTransform;
  readonly numberTransform: IopMixedSourceNumberTransform;
  readonly placement: IopMixedSourcePlacement;
  readonly pairOrder: IopMixedSourcePairOrder;
}

export interface IopMixedSourceToken {
  readonly id: string;
  readonly kind: "WORD" | "NUMBER";
  readonly originalValue: string;
  readonly visibleValue: string;
  readonly originalPosition: number;
}

export interface IopMixedSourceStep {
  readonly stepNumber: number;
  readonly selectedWordId: string;
  readonly selectedNumberId: string;
  readonly tokens: readonly IopMixedSourceToken[];
  readonly stateFingerprint: string;
}

export interface IopMixedSourceTrace {
  readonly input: readonly IopMixedSourceToken[];
  readonly steps: readonly IopMixedSourceStep[];
  readonly final: readonly IopMixedSourceToken[];
  readonly ruleFingerprint: string;
}

export interface IopMixedSourceIdentifiability {
  readonly candidateRulesTested: number;
  readonly matchingRuleFingerprints: readonly string[];
  readonly intendedRuleFingerprint: string;
  readonly passed: boolean;
}

export type IopMixedSourceQueryEvidence =
  | { readonly kind: "STEP_OUTPUT"; readonly stepNumber: number }
  | { readonly kind: "ELEMENT_AT_POSITION"; readonly stepNumber: number; readonly position: number }
  | { readonly kind: "STEP_NUMBER"; readonly stateFingerprint: string }
  | { readonly kind: "FINAL_OUTPUT" };

export interface IopMixedSourceChildQuestion {
  readonly questionOrder: 1 | 2 | 3 | 4;
  readonly kind: IopMixedSourceQueryEvidence["kind"];
  readonly evidence: IopMixedSourceQueryEvidence;
  readonly text: string;
  readonly options: readonly [IopOption, IopOption, IopOption, IopOption];
  readonly answerIndex: 0 | 1 | 2 | 3;
  readonly answerDisplay: string;
  readonly explanation: string;
}

export interface IopMixedSourceCaselet {
  readonly caseletId: string;
  readonly packageId: "IOP-001";
  readonly chapterId: "REAS-INP";
  readonly checkpointId: "IOP-CP-008";
  readonly prototypeId: "IOP-CP008-GAP-PROT-001";
  readonly sourceAuthority: "RBI_GRADE_B_2024_SHIFT1_PYQ_RECONSTRUCTION";
  readonly seed: string;
  readonly difficulty: IopDifficulty;
  readonly directions: string;
  readonly demonstration: IopMixedSourceTrace;
  readonly target: IopMixedSourceTrace;
  readonly ruleExplanation: string;
  readonly identifiability: IopMixedSourceIdentifiability;
  readonly oracleParity: true;
  readonly children: readonly [IopMixedSourceChildQuestion, IopMixedSourceChildQuestion, IopMixedSourceChildQuestion, IopMixedSourceChildQuestion];
  readonly lifecycle: IopLifecycle;
}

export const IOP_MIXED_SOURCE_RULE: IopMixedSourceRule = {
  id: "IOP-MIXED-SOURCE-RBI2024-S1",
  wordDirection: "ASC",
  numberDirection: "ASC",
  wordTransform: "VOWELS_PLUS_ONE",
  numberTransform: "DIGIT_SUM",
  placement: "PREPEND_PAIR",
  pairOrder: "NUMBER_WORD",
};

const WORD_POOL = [
  "basket", "identify", "nocturnal", "quack", "transport", "castle", "marine", "subway", "papaya", "agonic",
  "market", "river", "planet", "silver", "garden", "orange", "temple", "winter", "anchor", "lemon",
] as const;

const NUMBER_POOL = [
  179, 328, 556, 698, 927, 214, 482, 865, 741, 762, 913, 347, 285, 641, 853, 394, 521, 674, 936, 248,
] as const;

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

function digitSum(value: string): number {
  return [...value].reduce((sum, digit) => sum + Number(digit), 0);
}

function transformWord(value: string, transform: IopMixedSourceWordTransform): string {
  if (transform === "UNCHANGED") return value;
  if (transform === "REVERSE_WORD") return [...value].reverse().join("");
  return [...value].map((letter) => "aeiou".includes(letter.toLowerCase()) ? String.fromCharCode(letter.charCodeAt(0) + 1) : letter).join("");
}

function transformNumber(value: string, transform: IopMixedSourceNumberTransform): string {
  if (transform === "UNCHANGED") return value;
  if (transform === "REVERSE_DIGITS") return String(Number([...value].reverse().join("")));
  return String(digitSum(value));
}

function visibleFingerprint(tokens: readonly IopMixedSourceToken[]): string {
  return tokens.map((token) => token.visibleValue).join("|");
}

export function iopMixedSourceRuleFingerprint(rule: IopMixedSourceRule): string {
  return [
    rule.wordDirection,
    rule.numberDirection,
    rule.wordTransform,
    rule.numberTransform,
    rule.placement,
    rule.pairOrder,
  ].join(":");
}

function chooseWord(remaining: readonly IopMixedSourceToken[], direction: IopMixedSourceDirection): IopMixedSourceToken {
  const words = remaining.filter((token) => token.kind === "WORD").sort((a, b) => a.visibleValue.localeCompare(b.visibleValue, "en", { sensitivity: "base" }));
  if (direction === "DESC") words.reverse();
  const chosen = words[0];
  if (!chosen) throw new Error("Mixed source machine has no remaining word");
  return chosen;
}

function chooseNumber(remaining: readonly IopMixedSourceToken[], direction: IopMixedSourceDirection): IopMixedSourceToken {
  const numbers = remaining.filter((token) => token.kind === "NUMBER").sort((a, b) => Number(a.visibleValue) - Number(b.visibleValue));
  if (direction === "DESC") numbers.reverse();
  const chosen = numbers[0];
  if (!chosen) throw new Error("Mixed source machine has no remaining number");
  return chosen;
}

function transformedPair(rule: IopMixedSourceRule, word: IopMixedSourceToken, number: IopMixedSourceToken): readonly [IopMixedSourceToken, IopMixedSourceToken] {
  const transformedWord: IopMixedSourceToken = { ...word, visibleValue: transformWord(word.visibleValue, rule.wordTransform) };
  const transformedNumber: IopMixedSourceToken = { ...number, visibleValue: transformNumber(number.visibleValue, rule.numberTransform) };
  return rule.pairOrder === "NUMBER_WORD" ? [transformedNumber, transformedWord] : [transformedWord, transformedNumber];
}

export function executeIopMixedSourceRule(rule: IopMixedSourceRule, input: readonly IopMixedSourceToken[]): IopMixedSourceTrace {
  const wordCount = input.filter((token) => token.kind === "WORD").length;
  const numberCount = input.filter((token) => token.kind === "NUMBER").length;
  if (wordCount !== numberCount || wordCount < 4) throw new Error("Mixed source machine requires equal word/number counts of at least four");

  let remaining = [...input];
  let fixed: IopMixedSourceToken[] = [];
  const steps: IopMixedSourceStep[] = [];

  for (let stepNumber = 1; stepNumber <= wordCount; stepNumber += 1) {
    const word = chooseWord(remaining, rule.wordDirection);
    const number = chooseNumber(remaining, rule.numberDirection);
    remaining = remaining.filter((token) => token.id !== word.id && token.id !== number.id);
    const pair = [...transformedPair(rule, word, number)];

    if (rule.placement === "PREPEND_PAIR") fixed = [...pair, ...fixed];
    else fixed = [...fixed, ...pair];

    const visible = rule.placement === "PREPEND_PAIR" ? [...fixed, ...remaining] : [...remaining, ...fixed];
    steps.push({
      stepNumber,
      selectedWordId: word.id,
      selectedNumberId: number.id,
      tokens: visible,
      stateFingerprint: visibleFingerprint(visible),
    });
  }

  const fingerprints = [visibleFingerprint(input), ...steps.map((step) => step.stateFingerprint)];
  if (new Set(fingerprints).size !== fingerprints.length) throw new Error("Mixed source machine emitted a duplicate visible state");

  const final = steps.at(-1)?.tokens ?? input;
  return {
    input: [...input],
    steps,
    final: [...final],
    ruleFingerprint: iopMixedSourceRuleFingerprint(rule),
  };
}

function oracleTransformWord(value: string, transform: IopMixedSourceWordTransform): string {
  if (transform === "UNCHANGED") return value;
  if (transform === "REVERSE_WORD") return value.split("").reverse().join("");
  let output = "";
  for (const letter of value) output += "aeiou".includes(letter.toLowerCase()) ? String.fromCharCode(letter.charCodeAt(0) + 1) : letter;
  return output;
}

function oracleTransformNumber(value: string, transform: IopMixedSourceNumberTransform): string {
  if (transform === "UNCHANGED") return value;
  if (transform === "REVERSE_DIGITS") return String(parseInt(value.split("").reverse().join(""), 10));
  let sum = 0;
  for (const digit of value) sum += parseInt(digit, 10);
  return String(sum);
}

export function reconstructIopMixedSourceOracle(rule: IopMixedSourceRule, input: readonly IopMixedSourceToken[]): IopMixedSourceTrace {
  const remaining = new Map(input.map((token) => [token.id, token]));
  let fixed: IopMixedSourceToken[] = [];
  const steps: IopMixedSourceStep[] = [];
  const iterations = input.filter((token) => token.kind === "WORD").length;

  for (let stepNumber = 1; stepNumber <= iterations; stepNumber += 1) {
    const words = [...remaining.values()].filter((token) => token.kind === "WORD").sort((a, b) => a.visibleValue.localeCompare(b.visibleValue, "en", { sensitivity: "base" }));
    const numbers = [...remaining.values()].filter((token) => token.kind === "NUMBER").sort((a, b) => Number(a.visibleValue) - Number(b.visibleValue));
    if (rule.wordDirection === "DESC") words.reverse();
    if (rule.numberDirection === "DESC") numbers.reverse();
    const word = words[0];
    const number = numbers[0];
    if (!word || !number) throw new Error("Mixed source oracle exhausted a category early");
    remaining.delete(word.id);
    remaining.delete(number.id);

    const tw: IopMixedSourceToken = { ...word, visibleValue: oracleTransformWord(word.visibleValue, rule.wordTransform) };
    const tn: IopMixedSourceToken = { ...number, visibleValue: oracleTransformNumber(number.visibleValue, rule.numberTransform) };
    const pair = rule.pairOrder === "NUMBER_WORD" ? [tn, tw] : [tw, tn];
    fixed = rule.placement === "PREPEND_PAIR" ? [...pair, ...fixed] : [...fixed, ...pair];
    const unfixed = input.filter((token) => remaining.has(token.id));
    const visible = rule.placement === "PREPEND_PAIR" ? [...fixed, ...unfixed] : [...unfixed, ...fixed];
    steps.push({ stepNumber, selectedWordId: word.id, selectedNumberId: number.id, tokens: visible, stateFingerprint: visibleFingerprint(visible) });
  }

  const final = steps.at(-1)?.tokens ?? input;
  return { input: [...input], steps, final: [...final], ruleFingerprint: iopMixedSourceRuleFingerprint(rule) };
}

export function assertIopMixedSourceOracleParity(actual: IopMixedSourceTrace, oracle: IopMixedSourceTrace): void {
  if (visibleFingerprint(actual.input) !== visibleFingerprint(oracle.input)) throw new Error("Mixed source oracle input mismatch");
  if (actual.ruleFingerprint !== oracle.ruleFingerprint) throw new Error("Mixed source oracle rule mismatch");
  if (actual.steps.length !== oracle.steps.length) throw new Error("Mixed source oracle step-count mismatch");
  for (let index = 0; index < actual.steps.length; index += 1) {
    if (actual.steps[index]!.stateFingerprint !== oracle.steps[index]!.stateFingerprint) throw new Error(`Mixed source oracle mismatch at step ${index + 1}`);
  }
}

function candidateRules(): readonly IopMixedSourceRule[] {
  const candidates: IopMixedSourceRule[] = [];
  for (const wordDirection of ["ASC", "DESC"] as const) {
    for (const numberDirection of ["ASC", "DESC"] as const) {
      for (const wordTransform of ["VOWELS_PLUS_ONE", "REVERSE_WORD", "UNCHANGED"] as const) {
        for (const numberTransform of ["DIGIT_SUM", "REVERSE_DIGITS", "UNCHANGED"] as const) {
          for (const placement of ["PREPEND_PAIR", "APPEND_PAIR"] as const) {
            for (const pairOrder of ["NUMBER_WORD", "WORD_NUMBER"] as const) {
              candidates.push({ id: `ALT-${candidates.length + 1}`, wordDirection, numberDirection, wordTransform, numberTransform, placement, pairOrder });
            }
          }
        }
      }
    }
  }
  return candidates;
}

export function evaluateIopMixedSourceIdentifiability(intended: IopMixedSourceRule, trace: IopMixedSourceTrace): IopMixedSourceIdentifiability {
  const expected = trace.steps.map((step) => step.stateFingerprint).join("/");
  const matches = new Set<string>();
  for (const candidate of candidateRules()) {
    try {
      const candidateTrace = executeIopMixedSourceRule(candidate, trace.input);
      if (candidateTrace.steps.map((step) => step.stateFingerprint).join("/") === expected) matches.add(iopMixedSourceRuleFingerprint(candidate));
    } catch {
      // A candidate that cannot execute the visible input cannot explain it.
    }
  }
  const intendedFingerprint = iopMixedSourceRuleFingerprint(intended);
  return {
    candidateRulesTested: candidateRules().length,
    matchingRuleFingerprints: [...matches],
    intendedRuleFingerprint: intendedFingerprint,
    passed: matches.size === 1 && matches.has(intendedFingerprint),
  };
}

function createInput(seed: string): readonly IopMixedSourceToken[] {
  const rng = makeRng(seed);
  const words = shuffle(WORD_POOL, rng).slice(0, 5);
  let numbers: number[] = [];
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const candidate = shuffle(NUMBER_POOL, rng).slice(0, 5);
    if (new Set(candidate.map((value) => digitSum(String(value)))).size === candidate.length) {
      numbers = candidate;
      break;
    }
  }
  if (numbers.length !== 5) throw new Error("Unable to select five numbers with unique digit sums");

  const tokens: IopMixedSourceToken[] = [
    ...words.map((value, index) => ({ id: `W${index + 1}`, kind: "WORD" as const, originalValue: value, visibleValue: value, originalPosition: -1 })),
    ...numbers.map((value, index) => ({ id: `N${index + 1}`, kind: "NUMBER" as const, originalValue: String(value), visibleValue: String(value), originalPosition: -1 })),
  ];
  return shuffle(tokens, rng).map((token, originalPosition) => ({ ...token, originalPosition }));
}

function safeTrace(seed: string, requireIdentifiable: boolean): { readonly trace: IopMixedSourceTrace; readonly identifiability?: IopMixedSourceIdentifiability } {
  for (let attempt = 0; attempt < 160; attempt += 1) {
    const input = createInput(`${seed}|${attempt}`);
    const trace = executeIopMixedSourceRule(IOP_MIXED_SOURCE_RULE, input);
    if (new Set(trace.final.map((token) => token.visibleValue)).size !== trace.final.length) continue;
    const oracle = reconstructIopMixedSourceOracle(IOP_MIXED_SOURCE_RULE, input);
    assertIopMixedSourceOracleParity(trace, oracle);
    if (!requireIdentifiable) return { trace };
    const identifiability = evaluateIopMixedSourceIdentifiability(IOP_MIXED_SOURCE_RULE, trace);
    if (identifiability.passed) return { trace, identifiability };
  }
  throw new Error(`Unable to generate safe mixed source trace for ${seed}`);
}

function row(tokens: readonly IopMixedSourceToken[]): string {
  return tokens.map((token) => token.visibleValue).join("  ");
}

function makeOption(display: string, fingerprint: string, isCorrect: boolean): IopOption {
  return { display, semanticFingerprint: fingerprint, isCorrect };
}

function options(correct: IopOption, wrong: readonly IopOption[], seed: string): readonly [IopOption, IopOption, IopOption, IopOption] {
  const unique = new Map<string, IopOption>([[correct.semanticFingerprint, correct]]);
  for (const candidate of wrong) if (!unique.has(candidate.semanticFingerprint)) unique.set(candidate.semanticFingerprint, candidate);
  const choices = [...unique.values()];
  if (choices.length < 4) throw new Error("Mixed source distractor pool too small");
  const mixed = shuffle([correct, ...choices.filter((candidate) => !candidate.isCorrect).slice(0, 3)], makeRng(seed));
  return [mixed[0]!, mixed[1]!, mixed[2]!, mixed[3]!];
}

function allStates(trace: IopMixedSourceTrace) {
  return [{ number: 0, tokens: trace.input, fingerprint: visibleFingerprint(trace.input) }, ...trace.steps.map((step) => ({ number: step.stepNumber, tokens: step.tokens, fingerprint: step.stateFingerprint }))];
}

function buildChildren(trace: IopMixedSourceTrace, seed: string): IopMixedSourceCaselet["children"] {
  const step3 = trace.steps[2]!;
  const step2 = trace.steps[1]!;
  const position = 1 + Math.floor(makeRng(`${seed}|POSITION`)() * step2.tokens.length);
  const correctElement = step2.tokens[position - 1]!;

  const q1Options = options(
    makeOption(row(step3.tokens), `ROW:${step3.stateFingerprint}`, true),
    shuffle(allStates(trace).filter((state) => state.fingerprint !== step3.stateFingerprint), makeRng(`${seed}|Q1W`)).map((state) => makeOption(row(state.tokens), `ROW:${state.fingerprint}`, false)),
    `${seed}|Q1`,
  );
  const q1Index = q1Options.findIndex((candidate) => candidate.isCorrect) as 0 | 1 | 2 | 3;

  const q2Options = options(
    makeOption(correctElement.visibleValue, `TOKEN:${correctElement.id}:${correctElement.visibleValue}`, true),
    shuffle(step2.tokens.filter((token) => token.id !== correctElement.id), makeRng(`${seed}|Q2W`)).map((token) => makeOption(token.visibleValue, `TOKEN:${token.id}:${token.visibleValue}`, false)),
    `${seed}|Q2`,
  );
  const q2Index = q2Options.findIndex((candidate) => candidate.isCorrect) as 0 | 1 | 2 | 3;

  const q3Options = options(
    makeOption("Step 3", "STEP:3", true),
    [1, 2, 4, 5].map((value) => makeOption(`Step ${value}`, `STEP:${value}`, false)),
    `${seed}|Q3`,
  );
  const q3Index = q3Options.findIndex((candidate) => candidate.isCorrect) as 0 | 1 | 2 | 3;

  const finalFingerprint = trace.steps.at(-1)!.stateFingerprint;
  const q4Options = options(
    makeOption(row(trace.final), `ROW:${finalFingerprint}`, true),
    shuffle(allStates(trace).filter((state) => state.fingerprint !== finalFingerprint), makeRng(`${seed}|Q4W`)).map((state) => makeOption(row(state.tokens), `ROW:${state.fingerprint}`, false)),
    `${seed}|Q4`,
  );
  const q4Index = q4Options.findIndex((candidate) => candidate.isCorrect) as 0 | 1 | 2 | 3;

  return [
    {
      questionOrder: 1,
      kind: "STEP_OUTPUT",
      evidence: { kind: "STEP_OUTPUT", stepNumber: 3 },
      text: "Which of the following is Step 3 for the new input?",
      options: q1Options,
      answerIndex: q1Index,
      answerDisplay: row(step3.tokens),
      explanation: `At each step, take the alphabetically first remaining word and the smallest remaining number. Change every vowel of the selected word to its next alphabet letter, replace the selected number by its digit sum, and place the new number-word pair at the left. Step 3 is ${row(step3.tokens)}.`,
    },
    {
      questionOrder: 2,
      kind: "ELEMENT_AT_POSITION",
      evidence: { kind: "ELEMENT_AT_POSITION", stepNumber: 2, position },
      text: `Which element is at position ${position} from the left in Step 2?`,
      options: q2Options,
      answerIndex: q2Index,
      answerDisplay: correctElement.visibleValue,
      explanation: `Step 2 is ${row(step2.tokens)}. Position ${position} contains ${correctElement.visibleValue}.`,
    },
    {
      questionOrder: 3,
      kind: "STEP_NUMBER",
      evidence: { kind: "STEP_NUMBER", stateFingerprint: step3.stateFingerprint },
      text: `At which step does the arrangement ${row(step3.tokens)} occur?`,
      options: q3Options,
      answerIndex: q3Index,
      answerDisplay: "Step 3",
      explanation: "Tracing the paired word-number transformations shows that this exact arrangement first appears at Step 3.",
    },
    {
      questionOrder: 4,
      kind: "FINAL_OUTPUT",
      evidence: { kind: "FINAL_OUTPUT" },
      text: "Which of the following is the final output of the machine?",
      options: q4Options,
      answerIndex: q4Index,
      answerDisplay: row(trace.final),
      explanation: `After all five word-number pairs are processed, the final output is ${row(trace.final)}.`,
    },
  ];
}

export function recomputeIopMixedSourceAnswer(trace: IopMixedSourceTrace, evidence: IopMixedSourceQueryEvidence): string {
  if (evidence.kind === "FINAL_OUTPUT") return row(trace.final);
  if (evidence.kind === "STEP_OUTPUT") return row(trace.steps[evidence.stepNumber - 1]!.tokens);
  if (evidence.kind === "ELEMENT_AT_POSITION") return trace.steps[evidence.stepNumber - 1]!.tokens[evidence.position - 1]!.visibleValue;
  const step = trace.steps.find((candidate) => candidate.stateFingerprint === evidence.stateFingerprint);
  if (!step) throw new Error("Mixed source query oracle could not find state");
  return `Step ${step.stepNumber}`;
}

export function generateIopMixedSourceCaselet(seed: string): IopMixedSourceCaselet {
  const demo = safeTrace(`${seed}|DEMO`, true);
  const target = safeTrace(`${seed}|TARGET`, false);
  if (!demo.identifiability?.passed) throw new Error(`Mixed source identifiability failed for ${seed}`);
  const caselet: IopMixedSourceCaselet = {
    caseletId: `IOP-001-CP008-GAP-${hashSeed(seed).toString(16).padStart(8, "0")}`,
    packageId: "IOP-001",
    chapterId: "REAS-INP",
    checkpointId: "IOP-CP-008",
    prototypeId: "IOP-CP008-GAP-PROT-001",
    sourceAuthority: "RBI_GRADE_B_2024_SHIFT1_PYQ_RECONSTRUCTION",
    seed,
    difficulty: "Hard",
    directions: "A word and number arrangement machine changes one word and one number in each step. Study the illustration and apply exactly the same rule to the new input.",
    demonstration: demo.trace,
    target: target.trace,
    ruleExplanation: "In each step, the alphabetically first remaining word and the smallest remaining number are selected. Every vowel in the word is changed to the next alphabet letter, the number is replaced by its digit sum, and the transformed number-word pair is placed at the left of the already processed pairs.",
    identifiability: demo.identifiability,
    oracleParity: true,
    children: buildChildren(target.trace, seed),
    lifecycle: IOP_001_LIFECYCLE,
  };
  assertIopMixedSourceCaseletIntegrity(caselet);
  return caselet;
}

export function assertIopMixedSourceCaseletIntegrity(caselet: IopMixedSourceCaselet): void {
  if (!caselet.identifiability.passed || caselet.identifiability.matchingRuleFingerprints.length !== 1) throw new Error("Mixed source rule ambiguity");
  if (caselet.identifiability.matchingRuleFingerprints[0] !== caselet.identifiability.intendedRuleFingerprint) throw new Error("Mixed source wrong rule survived ambiguity audit");
  assertIopMixedSourceOracleParity(caselet.demonstration, reconstructIopMixedSourceOracle(IOP_MIXED_SOURCE_RULE, caselet.demonstration.input));
  assertIopMixedSourceOracleParity(caselet.target, reconstructIopMixedSourceOracle(IOP_MIXED_SOURCE_RULE, caselet.target.input));
  for (const trace of [caselet.demonstration, caselet.target]) {
    const inputIds = [...trace.input.map((token) => token.id)].sort().join("|");
    for (const step of trace.steps) {
      if ([...step.tokens.map((token) => token.id)].sort().join("|") !== inputIds) throw new Error("Mixed source token conservation failed");
    }
    if (trace.steps.length !== 5) throw new Error("Mixed source trace must contain five paired steps");
  }
  for (const child of caselet.children) {
    if (child.options.length !== 4 || new Set(child.options.map((candidate) => candidate.semanticFingerprint)).size !== 4) throw new Error("Mixed source option uniqueness failed");
    if (child.options.filter((candidate) => candidate.isCorrect).length !== 1) throw new Error("Mixed source question has non-unique answer");
    if (!child.options[child.answerIndex]?.isCorrect || child.options[child.answerIndex]?.display !== child.answerDisplay) throw new Error("Mixed source answer index mismatch");
    if (recomputeIopMixedSourceAnswer(caselet.target, child.evidence) !== child.answerDisplay) throw new Error(`Mixed source query oracle mismatch for ${child.kind}`);
  }
  if (caselet.lifecycle.permanentQlCount !== 0 || caselet.lifecycle.questionStudioDiscoverable || caselet.lifecycle.questionBankWritable || caselet.lifecycle.testEligible || caselet.lifecycle.publiclyPublishable) throw new Error("Mixed source gap leaked into delivery lifecycle");
}
