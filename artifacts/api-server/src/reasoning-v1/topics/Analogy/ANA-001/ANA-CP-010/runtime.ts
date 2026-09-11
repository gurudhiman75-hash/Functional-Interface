import { matchingNumericRules } from "../ANA-CP-003/independent-solver";
import { independentlySolveAnaCp010Numeric, independentlyValidateAnaCp010Set } from "./independent-solver";
import { anaCp010QlById } from "./question-language.en";
import {
  ANA_CP010_NUMERIC_RULES,
  anaCp010NumericRuleById,
  type AnaCp010NumericContext,
  type AnaCp010NumericRuleId,
} from "./rule-definitions";

export type AnaCp010Difficulty = "EASY" | "MEDIUM" | "HARD";
type NumericPair = { input: number; output: number };
type NumericOption = number | readonly [number, number];

export interface GeneratedAnaCp010Numeric {
  kind: "NUMERIC";
  qlId: string;
  ruleId: AnaCp010NumericRuleId;
  presentationMode: "MISSING_FOURTH_TERM" | "EQUIVALENT_PAIR_SELECTION";
  difficulty: AnaCp010Difficulty;
  context: AnaCp010NumericContext;
  source: NumericPair;
  target: NumericPair;
  stem: string;
  options: readonly { value: NumericOption; errorLabel: string | null }[];
  correctIndex: number;
  explanation: readonly string[];
}

export interface GeneratedAnaCp010Set {
  kind: "NUMBER_SET";
  qlId: string;
  ruleId: "SET_ALL_PRIME" | "SET_FIXED_RATIO_PROGRESSION";
  difficulty: AnaCp010Difficulty;
  source: readonly number[];
  stem: string;
  options: readonly { value: readonly number[]; errorLabel: string | null }[];
  correctIndex: number;
  explanation: readonly string[];
}

export type GeneratedAnaCp010 = GeneratedAnaCp010Numeric | GeneratedAnaCp010Set;

function randomSource(seed: number): () => number {
  let state = (seed ^ 0x27d4eb2d) >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: readonly T[], seed: number): T[] {
  const result = [...items];
  const random = randomSource(seed);
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function sameContext(a: AnaCp010NumericContext, b: AnaCp010NumericContext): boolean {
  return a.exponent === b.exponent && a.adjust === b.adjust && a.constant === b.constant;
}

function cp010Matches(pairs: readonly NumericPair[]) {
  const matches: { ruleId: AnaCp010NumericRuleId; context: AnaCp010NumericContext; priority: number }[] = [];
  for (const rule of ANA_CP010_NUMERIC_RULES) {
    for (const context of rule.contexts) {
      if (pairs.every((pair) => rule.apply(pair.input, context) === pair.output)) {
        matches.push({ ruleId: rule.id, context, priority: rule.priority });
      }
    }
  }
  return matches;
}

function isUnambiguous(
  intendedRuleId: AnaCp010NumericRuleId,
  context: AnaCp010NumericContext,
  pairs: readonly NumericPair[],
): boolean {
  const intended = anaCp010NumericRuleById(intendedRuleId);
  const localMatches = cp010Matches(pairs);
  if (!localMatches.some((match) => match.ruleId === intendedRuleId && sameContext(match.context, context))) return false;
  if (localMatches.some((match) => !(match.ruleId === intendedRuleId && sameContext(match.context, context)) && match.priority <= intended.priority)) return false;
  const legacyMatches = matchingNumericRules(pairs);
  return !legacyMatches.some((match) => match.priority <= intended.priority);
}

function chooseNumericInstance(ruleId: AnaCp010NumericRuleId, seed: number) {
  const rule = anaCp010NumericRuleById(ruleId);
  for (const context of shuffle(rule.contexts, seed * 13 + 1)) {
    const inputs = shuffle(rule.candidateInputs, seed * 17 + 3);
    for (let sourceIndex = 0; sourceIndex < inputs.length; sourceIndex += 1) {
      const sourceOutput = rule.apply(inputs[sourceIndex], context);
      if (sourceOutput === null) continue;
      for (let targetIndex = sourceIndex + 1; targetIndex < inputs.length; targetIndex += 1) {
        const targetOutput = rule.apply(inputs[targetIndex], context);
        if (targetOutput === null || targetOutput === sourceOutput) continue;
        if (numericMisconceptions(ruleId, inputs[targetIndex], targetOutput, context).length < 3) continue;
        const source = { input: inputs[sourceIndex], output: sourceOutput };
        const target = { input: inputs[targetIndex], output: targetOutput };
        if (!isUnambiguous(ruleId, context, [source, target])) continue;
        if (independentlySolveAnaCp010Numeric(ruleId, source.input, context) !== source.output) continue;
        if (independentlySolveAnaCp010Numeric(ruleId, target.input, context) !== target.output) continue;
        return { context, source, target };
      }
    }
  }
  throw new Error(`Unable to generate an unambiguous ${ruleId} instance with three misconception distractors for seed ${seed}.`);
}

function uniquePositive(values: readonly { value: number; errorLabel: string }[], correct: number) {
  const seen = new Set<number>([correct]);
  return values.filter((entry) => {
    if (!Number.isFinite(entry.value) || !Number.isInteger(entry.value) || entry.value <= 0 || seen.has(entry.value)) return false;
    seen.add(entry.value);
    return true;
  });
}

function numericMisconceptions(
  ruleId: AnaCp010NumericRuleId,
  input: number,
  correct: number,
  context: AnaCp010NumericContext,
) {
  const digits = String(input).split("").map(Number);
  const candidates: { value: number; errorLabel: string }[] = [];
  switch (ruleId) {
    case "NUM_HIGHER_FIXED_POWER":
      candidates.push(
        { value: input ** 3, errorLabel: "USED_CUBE_INSTEAD_OF_REQUIRED_POWER" },
        { value: input ** Math.max(2, context.exponent! - 1), errorLabel: "USED_ONE_LOWER_EXPONENT" },
        { value: input ** (context.exponent! + 1), errorLabel: "USED_ONE_HIGHER_EXPONENT" },
        { value: input * context.exponent!, errorLabel: "MULTIPLIED_BY_EXPONENT" },
        { value: input ** 2, errorLabel: "USED_SQUARE_INSTEAD_OF_REQUIRED_POWER" },
        { value: correct + context.exponent!, errorLabel: "ADDED_EXPONENT_AFTER_POWER" },
      );
      break;
    case "NUM_EXACT_SQUARE_ROOT": {
      const root = Math.sqrt(input);
      candidates.push(
        { value: root - 1, errorLabel: "ROOT_ONE_TOO_SMALL" },
        { value: root + 1, errorLabel: "ROOT_ONE_TOO_LARGE" },
        { value: Math.round(Math.cbrt(input)), errorLabel: "USED_CUBE_ROOT" },
        { value: root * 2, errorLabel: "DOUBLED_THE_ROOT" },
        { value: root ** 2, errorLabel: "SQUARED_THE_ROOT_AGAIN" },
      );
      break;
    }
    case "NUM_CUBE_ROOT_ADJUST": {
      const root = Math.round(Math.cbrt(input));
      candidates.push(
        { value: root, errorLabel: "FORGOT_FINAL_ADJUSTMENT" },
        { value: root - context.adjust!, errorLabel: "REVERSED_ADJUSTMENT_DIRECTION" },
        { value: correct - 1, errorLabel: "OFF_BY_ONE_AFTER_ROOT" },
        { value: correct + 1, errorLabel: "OFF_BY_ONE_AFTER_ROOT" },
        { value: root + 2 * context.adjust!, errorLabel: "APPLIED_ADJUSTMENT_TWICE" },
      );
      break;
    }
    case "NUM_CUBE_SUBTRACT":
      candidates.push(
        { value: input ** 3, errorLabel: "FORGOT_FINAL_SUBTRACTION" },
        { value: input ** 3 + context.constant!, errorLabel: "ADDED_CONSTANT_INSTEAD" },
        { value: input ** 3 - Math.max(1, context.constant! - 1), errorLabel: "USED_WRONG_CONSTANT" },
        { value: input ** 2 - context.constant!, errorLabel: "SQUARED_INSTEAD_OF_CUBED" },
        { value: input ** 3 - (context.constant! + 1), errorLabel: "SUBTRACTED_ONE_EXTRA" },
      );
      break;
    case "NUM_DIGIT_QUOTIENT": {
      const [a, b] = digits;
      candidates.push(
        { value: Math.abs(a - b), errorLabel: "SUBTRACTED_DIGITS" },
        { value: a + b, errorLabel: "ADDED_DIGITS" },
        { value: a * b, errorLabel: "MULTIPLIED_DIGITS" },
        { value: Math.floor(b / a), errorLabel: "REVERSED_DIGIT_DIVISION" },
        { value: a, errorLabel: "USED_TENS_DIGIT_ONLY" },
        { value: b, errorLabel: "USED_UNITS_DIGIT_ONLY" },
        { value: correct + 1, errorLabel: "DIVISION_OFF_BY_ONE" },
      );
      break;
    }
    case "NUM_THREE_DIGIT_SUM": {
      const [a, b, c] = digits;
      candidates.push(
        { value: a + b, errorLabel: "IGNORED_LAST_DIGIT" },
        { value: b + c, errorLabel: "IGNORED_FIRST_DIGIT" },
        { value: a + c, errorLabel: "IGNORED_MIDDLE_DIGIT" },
        { value: a * b + c, errorLabel: "MULTIPLIED_FIRST_TWO_DIGITS" },
        { value: a + b * c, errorLabel: "MULTIPLIED_LAST_TWO_DIGITS" },
        { value: a * b * c, errorLabel: "MULTIPLIED_ALL_DIGITS_INSTEAD" },
        { value: a * a + b * b + c * c, errorLabel: "ADDED_SQUARES_OF_DIGITS" },
      );
      break;
    }
    case "NUM_THREE_DIGIT_PRODUCT": {
      const [a, b, c] = digits;
      candidates.push(
        { value: a * b, errorLabel: "IGNORED_LAST_DIGIT" },
        { value: b * c, errorLabel: "IGNORED_FIRST_DIGIT" },
        { value: a * c, errorLabel: "IGNORED_MIDDLE_DIGIT" },
        { value: a + b + c, errorLabel: "ADDED_DIGITS_INSTEAD" },
        { value: a * b + c, errorLabel: "FAILED_TO_MULTIPLY_LAST_DIGIT" },
        { value: a + b * c, errorLabel: "FAILED_TO_MULTIPLY_FIRST_DIGIT" },
        { value: (a + 1) * b * c, errorLabel: "MISREAD_FIRST_DIGIT_BY_ONE" },
        { value: a * b * (c + 1), errorLabel: "MISREAD_LAST_DIGIT_BY_ONE" },
      );
      break;
    }
  }
  return uniquePositive(candidates, correct);
}

function numericDifficulty(ruleId: AnaCp010NumericRuleId, presentationMode: string, context: AnaCp010NumericContext): AnaCp010Difficulty {
  const rule = anaCp010NumericRuleById(ruleId);
  let score = rule.priority;
  if (presentationMode === "EQUIVALENT_PAIR_SELECTION") score += 1;
  if (ruleId === "NUM_HIGHER_FIXED_POWER" && context.exponent === 5) score += 1;
  if (score <= 2) return "EASY";
  if (score <= 4) return "MEDIUM";
  return "HARD";
}

function placeCorrect<T extends { errorLabel: string | null }>(options: readonly T[], index: number): T[] {
  const result = [...options];
  const current = result.findIndex((option) => option.errorLabel === null);
  if (current < 0) throw new Error("Missing correct option.");
  const [correct] = result.splice(current, 1);
  result.splice(index, 0, correct);
  return result;
}

function numericPairDistractors(
  ruleId: AnaCp010NumericRuleId,
  context: AnaCp010NumericContext,
  target: NumericPair,
  seed: number,
): { value: readonly [number, number]; errorLabel: string }[] {
  const rule = anaCp010NumericRuleById(ruleId);
  const distractors: { value: readonly [number, number]; errorLabel: string }[] = [];
  const used = new Set<string>();
  for (const input of shuffle(rule.candidateInputs, seed * 43 + 17)) {
    if (input === target.input) continue;
    const correct = rule.apply(input, context);
    if (correct === null) continue;
    const mistakes = shuffle(numericMisconceptions(ruleId, input, correct, context), seed * 47 + input * 13);
    for (const mistake of mistakes) {
      if (independentlySolveAnaCp010Numeric(ruleId, input, context) === mistake.value) continue;
      const key = `${input}:${mistake.value}`;
      if (used.has(key)) continue;
      used.add(key);
      distractors.push({ value: [input, mistake.value] as const, errorLabel: mistake.errorLabel });
      if (distractors.length === 3) return distractors;
    }
  }
  throw new Error(`${ruleId} cannot produce three truthful equivalent-pair distractors for seed ${seed}.`);
}

function generateNumeric(ql: ReturnType<typeof anaCp010QlById>, seed: number): GeneratedAnaCp010Numeric {
  const ruleId = ql.ruleId as AnaCp010NumericRuleId;
  const rule = anaCp010NumericRuleById(ruleId);
  const { context, source, target } = chooseNumericInstance(ruleId, seed);
  const misconceptions = numericMisconceptions(ruleId, target.input, target.output, context);
  if (misconceptions.length < 3) throw new Error(`${ruleId} produced fewer than three misconception distractors.`);

  const presentationMode = ql.presentationMode as "MISSING_FOURTH_TERM" | "EQUIVALENT_PAIR_SELECTION";
  let rawOptions: { value: NumericOption; errorLabel: string | null }[];
  if (presentationMode === "MISSING_FOURTH_TERM") {
    rawOptions = [
      { value: target.output, errorLabel: null },
      ...misconceptions.slice(0, 3).map((entry) => ({ value: entry.value, errorLabel: entry.errorLabel })),
    ];
  } else {
    rawOptions = [
      { value: [target.input, target.output] as const, errorLabel: null },
      ...numericPairDistractors(ruleId, context, target, seed),
    ];
  }

  const requestedIndex = ((seed + Number(ql.qlId.slice(-3))) % 4 + 4) % 4;
  const options = placeCorrect(shuffle(rawOptions, seed * 31 + 7), requestedIndex);
  const keys = options.map((option) => Array.isArray(option.value) ? option.value.join(":") : String(option.value));
  if (new Set(keys).size !== 4) throw new Error(`${ql.qlId} produced duplicate options.`);
  const correctIndex = options.findIndex((option) => option.errorLabel === null);
  if (presentationMode === "EQUIVALENT_PAIR_SELECTION") {
    const validCount = options.filter((option) => {
      if (!Array.isArray(option.value)) return false;
      return independentlySolveAnaCp010Numeric(ruleId, option.value[0], context) === option.value[1];
    }).length;
    if (validCount !== 1) throw new Error(`${ql.qlId} must contain exactly one valid equivalent numeric pair.`);
  }

  return {
    kind: "NUMERIC",
    qlId: ql.qlId,
    ruleId,
    presentationMode,
    difficulty: numericDifficulty(ruleId, presentationMode, context),
    context,
    source,
    target,
    stem: presentationMode === "MISSING_FOURTH_TERM"
      ? `Select the number that replaces the question mark (?) so that the same relationship is followed.\n${source.input} : ${source.output} :: ${target.input} : ?`
      : `Select the option in which the numbers share the same relationship as ${source.input} : ${source.output}.`,
    options,
    correctIndex,
    explanation: [
      `Rule: ${rule.label}.`,
      `Given pair: ${rule.explain(source.input, source.output, context)}.`,
      `Apply it to the target: ${rule.explain(target.input, target.output, context)}.`,
      `Therefore, the correct answer is ${presentationMode === "MISSING_FOURTH_TERM" ? target.output : `${target.input} : ${target.output}`}.`,
    ],
  };
}

const PRIMES = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71] as const;
const COMPOSITES = [12, 15, 21, 25, 27, 33, 35, 39, 45, 49, 51, 55, 57, 63, 65, 69] as const;

function generatePrimeSet(qlId: string, seed: number): GeneratedAnaCp010Set {
  const shuffledPrimes = shuffle(PRIMES, seed * 7 + 1);
  const source = shuffledPrimes.slice(0, 3);
  const correct = shuffledPrimes.slice(3, 6);
  const composites = shuffle(COMPOSITES, seed * 11 + 3);
  const wrong1 = [shuffledPrimes[6], shuffledPrimes[7], composites[0]];
  const wrong2 = [shuffledPrimes[8], composites[1], shuffledPrimes[9]];
  const wrong3 = [composites[2], shuffledPrimes[10], shuffledPrimes[11]];
  const raw = [
    { value: correct, errorLabel: null },
    { value: wrong1, errorLabel: "CONTAINS_COMPOSITE" },
    { value: wrong2, errorLabel: "CONTAINS_COMPOSITE" },
    { value: wrong3, errorLabel: "CONTAINS_COMPOSITE" },
  ];
  const options = placeCorrect(shuffle(raw, seed * 13 + 5), ((seed + 265) % 4 + 4) % 4);
  if (!independentlyValidateAnaCp010Set("SET_ALL_PRIME", source)) throw new Error("Independent solver rejected prime source set.");
  if (options.filter((option) => independentlyValidateAnaCp010Set("SET_ALL_PRIME", option.value)).length !== 1) throw new Error("Prime set must have exactly one valid option.");
  const correctIndex = options.findIndex((option) => option.errorLabel === null);
  return {
    kind: "NUMBER_SET",
    qlId,
    ruleId: "SET_ALL_PRIME",
    difficulty: "MEDIUM",
    source,
    stem: `Select the set in which the numbers are related in the same way as the numbers in (${source.join(", ")}).`,
    options,
    correctIndex,
    explanation: [
      `All three numbers in (${source.join(", ")}) are prime numbers.`,
      `Only (${options[correctIndex].value.join(", ")}) also contains three prime numbers.`,
      "Each other option contains at least one composite number.",
    ],
  };
}

function generateRatioSet(qlId: string, seed: number): GeneratedAnaCp010Set {
  const ratios = [2, 3, 4] as const;
  const ratio = ratios[Math.abs(seed) % ratios.length];
  const start = 2 + (Math.abs(seed * 7) % 6);
  const source = [start, start * ratio, start * ratio * ratio] as const;
  const targetStart = start + 2 + (Math.abs(seed) % 4);
  const correct = [targetStart, targetStart * ratio, targetStart * ratio * ratio] as const;
  const wrong1 = [targetStart, targetStart * ratio, targetStart * ratio * ratio + ratio] as const;
  const wrong2 = [targetStart, targetStart * (ratio + 1), targetStart * (ratio + 1) * ratio] as const;
  const wrong3 = [targetStart, targetStart + ratio, targetStart + ratio * 2] as const;
  const raw = [
    { value: correct, errorLabel: null },
    { value: wrong1, errorLabel: "BROKE_SECOND_RATIO" },
    { value: wrong2, errorLabel: "CHANGED_RATIO" },
    { value: wrong3, errorLabel: "USED_ADDITIVE_PROGRESSION" },
  ];
  const options = placeCorrect(shuffle(raw, seed * 17 + 9), ((seed + 266) % 4 + 4) % 4);
  if (!independentlyValidateAnaCp010Set("SET_FIXED_RATIO_PROGRESSION", source)) throw new Error("Independent solver rejected ratio source set.");
  const validOptions = options.filter((option) => {
    if (!independentlyValidateAnaCp010Set("SET_FIXED_RATIO_PROGRESSION", option.value)) return false;
    return option.value[1] / option.value[0] === ratio;
  });
  if (validOptions.length !== 1) throw new Error("Ratio set must have exactly one same-ratio option.");
  const correctIndex = options.findIndex((option) => option.errorLabel === null);
  return {
    kind: "NUMBER_SET",
    qlId,
    ruleId: "SET_FIXED_RATIO_PROGRESSION",
    difficulty: ratio >= 3 ? "MEDIUM" : "EASY",
    source,
    stem: `Select the set in which the numbers are related in the same way as the numbers in (${source.join(", ")}).`,
    options,
    correctIndex,
    explanation: [
      `${source[0]} x ${ratio} = ${source[1]} and ${source[1]} x ${ratio} = ${source[2]}.`,
      `${options[correctIndex].value[0]} x ${ratio} = ${options[correctIndex].value[1]} and ${options[correctIndex].value[1]} x ${ratio} = ${options[correctIndex].value[2]}.`,
      "The other sets do not keep the same multiplier at both steps.",
    ],
  };
}

export function generateAnaCp010(qlId: string, seed = 0): GeneratedAnaCp010 {
  const ql = anaCp010QlById(qlId);
  if (ql.ruleId === "SET_ALL_PRIME") return generatePrimeSet(qlId, seed);
  if (ql.ruleId === "SET_FIXED_RATIO_PROGRESSION") return generateRatioSet(qlId, seed);
  if (ql.ruleId === "SEM_EXPANSION_REGISTRY") {
    throw new Error(`${qlId} is a semantic ANA-CP-010 QL; use generateAnaCp010Semantic or generateLocalizedAnaCp010.`);
  }
  return generateNumeric(ql, seed);
}
