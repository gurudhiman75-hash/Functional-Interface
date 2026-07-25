import { ANA_CP003_QLS } from "./question-language.en";
import { checkNumericAmbiguity } from "./ambiguity-checker";
import { solveNumericRule, verifyNumericTransfer, type NumericPair } from "./independent-solver";
import { numericRuleById, type NumericRuleContext } from "./rule-definitions";

type NumericOption = number | readonly [number, number];

export interface GeneratedNumericAnalogy {
  qlId: string;
  ruleId: string;
  presentationMode: "MISSING_FOURTH_TERM" | "EQUIVALENT_PAIR_SELECTION";
  sourceA: number;
  sourceB: number;
  targetA: number;
  targetB: number;
  context: NumericRuleContext;
  stem: string;
  options: readonly { value: NumericOption; errorLabel: string | null }[];
  correctIndex: number;
  explanation: {
    ruleStatement: string;
    sourceDemonstration: string;
    targetApplication: string;
    conclusion: string;
    closestTrapRejection: string;
  };
}

function rng(seed: number): () => number {
  let state = (seed ^ 0x7f4a7c15) >>> 0;
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
  const random = rng(seed);
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function qlById(qlId: string) {
  const ql = ANA_CP003_QLS.find((entry) => entry.qlId === qlId);
  if (!ql) throw new Error(`Unknown ANA-CP-003 QL: ${qlId}`);
  return ql;
}

function candidateInputs(min: number, max: number, seed: number): number[] {
  return shuffle(Array.from({ length: max - min + 1 }, (_, index) => min + index), seed);
}

function chooseInstance(ruleId: string, seed: number): { context: NumericRuleContext; source: NumericPair; target: NumericPair } {
  const rule = numericRuleById(ruleId);
  const contexts = shuffle(rule.parameters, seed * 13 + 5);
  for (const context of contexts) {
    const inputs = candidateInputs(rule.minInput, rule.maxInput, seed * 17 + 9);
    for (let i = 0; i < inputs.length; i += 1) {
      const sourceOutput = solveNumericRule(ruleId, inputs[i], context);
      if (sourceOutput === null) continue;
      for (let j = i + 1; j < inputs.length; j += 1) {
        const targetOutput = solveNumericRule(ruleId, inputs[j], context);
        if (targetOutput === null || targetOutput === sourceOutput) continue;
        const source = { input: inputs[i], output: sourceOutput };
        const target = { input: inputs[j], output: targetOutput };
        const ambiguity = checkNumericAmbiguity(ruleId, context, [source, target]);
        if (ambiguity.accepted) return { context, source, target };
      }
    }
  }
  throw new Error(`Unable to build an unambiguous ${ruleId} instance for seed ${seed}.`);
}

function missingTermOptions(target: NumericPair, seed: number) {
  const deltas = shuffle([1,2,3,4,5,7,9,10,12,15], seed * 23 + 3);
  const distractors: number[] = [];
  for (const delta of deltas) {
    for (const sign of [1, -1]) {
      const value = target.output + sign * delta;
      if (value > 0 && value !== target.output && !distractors.includes(value)) distractors.push(value);
      if (distractors.length === 3) break;
    }
    if (distractors.length === 3) break;
  }
  return shuffle([
    { value: target.output as NumericOption, errorLabel: null },
    ...distractors.map((value) => ({ value: value as NumericOption, errorLabel: "NEAR_VALUE_WRONG_OPERATION" })),
  ], seed * 29 + 7);
}

function pairOptions(ruleId: string, context: NumericRuleContext, target: NumericPair, seed: number) {
  const rule = numericRuleById(ruleId);
  const inputs = candidateInputs(rule.minInput, rule.maxInput, seed * 31 + 11);
  const distractors: { value: readonly [number, number]; errorLabel: string }[] = [];
  for (const input of inputs) {
    const correct = solveNumericRule(ruleId, input, context);
    if (correct === null || input === target.input) continue;
    for (const delta of [1,-1,2,-2,3,-3,5,-5]) {
      const output = correct + delta;
      if (output <= 0 || solveNumericRule(ruleId, input, context) === output) continue;
      const value = [input, output] as const;
      if (!distractors.some((entry) => entry.value[0] === input && entry.value[1] === output)) {
        distractors.push({ value, errorLabel: "VALID_INPUT_WRONG_NUMERIC_RELATION" });
      }
      if (distractors.length === 3) break;
    }
    if (distractors.length === 3) break;
  }
  if (distractors.length !== 3) throw new Error(`${ruleId} cannot produce three numeric pair distractors.`);
  return shuffle([{ value: [target.input, target.output] as const, errorLabel: null }, ...distractors], seed * 37 + 13);
}

export function generateNumericAnalogy(qlId: string, seed = 0): GeneratedNumericAnalogy {
  const ql = qlById(qlId);
  const rule = numericRuleById(ql.ruleId);
  const { context, source, target } = chooseInstance(ql.ruleId, seed);
  if (!verifyNumericTransfer(ql.ruleId, context, source, target)) throw new Error("Independent solver rejected generated instance.");
  const options = ql.presentationMode === "MISSING_FOURTH_TERM"
    ? missingTermOptions(target, seed)
    : pairOptions(ql.ruleId, context, target, seed);
  const canonical = (value: NumericOption) => Array.isArray(value) ? value.join(":") : String(value);
  if (new Set(options.map((option) => canonical(option.value))).size !== 4) throw new Error("Duplicate numeric options.");
  const correctIndex = options.findIndex((option) => option.errorLabel === null);
  if (correctIndex < 0 || options.filter((option) => option.errorLabel === null).length !== 1) throw new Error("Numeric analogy must have exactly one answer.");
  const sourceDemo = rule.explain(source.input, source.output, context);
  const targetDemo = rule.explain(target.input, target.output, context);
  return {
    qlId, ruleId: ql.ruleId, presentationMode: ql.presentationMode,
    sourceA: source.input, sourceB: source.output, targetA: target.input, targetB: target.output, context,
    stem: ql.presentationMode === "MISSING_FOURTH_TERM"
      ? `${source.input} : ${source.output} :: ${target.input} : ?`
      : `Select the pair that follows the same relationship as ${source.input} : ${source.output}.`,
    options, correctIndex,
    explanation: {
      ruleStatement: `The relationship is: ${rule.label}.`,
      sourceDemonstration: sourceDemo,
      targetApplication: targetDemo,
      conclusion: ql.presentationMode === "MISSING_FOURTH_TERM"
        ? `Therefore, ${target.output} is the correct answer.`
        : `Therefore, ${target.input} : ${target.output} follows the same rule.`,
      closestTrapRejection: ql.presentationMode === "MISSING_FOURTH_TERM"
        ? "The other values are close to the answer but do not result from the stated operation."
        : "The other pairs contain valid numbers but do not preserve the same numeric rule.",
    },
  };
}
