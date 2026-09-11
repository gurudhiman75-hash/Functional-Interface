import { ANA_CP003_QLS } from "./question-language.en";
import { checkNumericAmbiguity } from "./ambiguity-checker";
import { solveNumericRule, verifyNumericTransfer, type NumericPair } from "./independent-solver";
import { numericRuleById, type NumericRuleContext } from "./rule-definitions";
import { deriveNumericDifficulty, numericMisconceptions, type NumericDifficulty } from "./audit-remediation";
import { numericMisconceptionExtensions } from "./misconception-extensions";

type NumericOption = number | readonly [number, number];
type NumericOptionEntry = { value: NumericOption; errorLabel: string | null };
type NumericWrongCandidate = { value: number; errorLabel: string };

export interface GeneratedNumericAnalogy {
  qlId: string;
  ruleId: string;
  presentationMode: "MISSING_FOURTH_TERM" | "EQUIVALENT_PAIR_SELECTION";
  difficulty: NumericDifficulty;
  sourceA: number;
  sourceB: number;
  targetA: number;
  targetB: number;
  additionalReference: NumericPair | null;
  context: NumericRuleContext;
  stem: string;
  options: readonly NumericOptionEntry[];
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

function placeCorrectOption(
  options: readonly NumericOptionEntry[],
  requestedIndex: number,
): NumericOptionEntry[] {
  const result = [...options];
  const currentIndex = result.findIndex((option) => option.errorLabel === null);
  if (currentIndex < 0) throw new Error("Numeric options do not contain a correct answer.");
  const [correct] = result.splice(currentIndex, 1);
  result.splice(requestedIndex, 0, correct);
  return result;
}

function qlById(qlId: string) {
  const ql = ANA_CP003_QLS.find((entry) => entry.qlId === qlId);
  if (!ql) throw new Error(`Unknown ANA-CP-003 QL: ${qlId}`);
  return ql;
}

function governedNumericMisconceptions(
  ruleId: string,
  context: NumericRuleContext,
  input: number,
  correct: number,
): NumericWrongCandidate[] {
  const primary = numericMisconceptions(ruleId, context, input, correct)
    .filter((candidate) => candidate.errorLabel !== "ARITHMETIC_OFF_BY_ONE_FALLBACK");
  const extended = numericMisconceptionExtensions(ruleId, context, input, correct);
  const combined: NumericWrongCandidate[] = [];
  for (const candidate of [...primary, ...extended]) {
    if (!Number.isInteger(candidate.value) || candidate.value <= 0 || candidate.value === correct) continue;
    if (combined.some((entry) => entry.value === candidate.value)) continue;
    combined.push(candidate);
  }
  return combined;
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
        if (governedNumericMisconceptions(ruleId, context, inputs[j], targetOutput).length < 3) continue;
        const source = { input: inputs[i], output: sourceOutput };
        const target = { input: inputs[j], output: targetOutput };
        const ambiguity = checkNumericAmbiguity(ruleId, context, [source, target]);
        if (ambiguity.accepted) return { context, source, target };
      }
    }
  }
  throw new Error(`Unable to build an unambiguous ${ruleId} instance with three governed distractors for seed ${seed}.`);
}

function chooseAdditionalReference(
  ruleId: string,
  context: NumericRuleContext,
  source: NumericPair,
  target: NumericPair,
  seed: number,
): NumericPair | null {
  const rule = numericRuleById(ruleId);
  for (const input of candidateInputs(rule.minInput, rule.maxInput, seed * 59 + 31)) {
    if (input === source.input || input === target.input) continue;
    const output = solveNumericRule(ruleId, input, context);
    if (output === null || output === source.output || output === target.output) continue;
    const candidate = { input, output };
    if (checkNumericAmbiguity(ruleId, context, [source, candidate, target]).accepted) return candidate;
  }
  return null;
}

function missingTermOptions(
  ruleId: string,
  context: NumericRuleContext,
  target: NumericPair,
  seed: number,
): NumericOptionEntry[] {
  const distractors = shuffle(
    governedNumericMisconceptions(ruleId, context, target.input, target.output),
    seed * 23 + 3,
  ).slice(0, 3);
  if (distractors.length !== 3) throw new Error(`${ruleId} cannot produce three governed misconception distractors.`);
  return shuffle([
    { value: target.output as NumericOption, errorLabel: null },
    ...distractors.map((entry) => ({ value: entry.value as NumericOption, errorLabel: entry.errorLabel })),
  ], seed * 29 + 7);
}

function pairOptions(ruleId: string, context: NumericRuleContext, target: NumericPair, seed: number): NumericOptionEntry[] {
  const rule = numericRuleById(ruleId);
  const inputs = candidateInputs(rule.minInput, rule.maxInput, seed * 31 + 11);
  const distractors: { value: readonly [number, number]; errorLabel: string }[] = [];
  for (const input of inputs) {
    if (input === target.input) continue;
    const correct = solveNumericRule(ruleId, input, context);
    if (correct === null) continue;
    for (const misconception of governedNumericMisconceptions(ruleId, context, input, correct)) {
      const value = [input, misconception.value] as const;
      if (solveNumericRule(ruleId, input, context) === misconception.value) continue;
      if (!distractors.some((entry) => entry.value[0] === input && entry.value[1] === misconception.value)) {
        distractors.push({ value, errorLabel: misconception.errorLabel });
      }
      if (distractors.length === 3) break;
    }
    if (distractors.length === 3) break;
  }
  if (distractors.length !== 3) throw new Error(`${ruleId} cannot produce three governed numeric pair distractors.`);
  return shuffle([{ value: [target.input, target.output] as const, errorLabel: null }, ...distractors], seed * 37 + 13);
}

function renderMissingStem(source: NumericPair, target: NumericPair, additional: NumericPair | null, seed: number): string {
  if (!additional) {
    return `Select the number that replaces the question mark (?) so that the same relationship is followed:\n${source.input} : ${source.output} :: ${target.input} : ?`;
  }
  const targetInMiddle = Math.abs(seed) % 2 === 1;
  const expression = targetInMiddle
    ? `${source.input} : ${source.output} :: ${target.input} : ? :: ${additional.input} : ${additional.output}`
    : `${source.input} : ${source.output} :: ${additional.input} : ${additional.output} :: ${target.input} : ?`;
  return `Select the number that replaces the question mark (?) so that all three pairs follow the same relationship:\n${expression}`;
}

function numericWrongValues(options: readonly NumericOptionEntry[]): number[] {
  return options.flatMap((option) =>
    option.errorLabel === null || Array.isArray(option.value) ? [] : [option.value as number],
  );
}

export function generateNumericAnalogy(qlId: string, seed = 0): GeneratedNumericAnalogy {
  const ql = qlById(qlId);
  const rule = numericRuleById(ql.ruleId);
  const { context, source, target } = chooseInstance(ql.ruleId, seed);
  if (!verifyNumericTransfer(ql.ruleId, context, source, target)) throw new Error("Independent solver rejected generated instance.");

  const wantsAdditionalReference = ql.presentationMode === "MISSING_FOURTH_TERM" && Math.abs(seed) % 3 === 0;
  const additionalReference = wantsAdditionalReference
    ? chooseAdditionalReference(ql.ruleId, context, source, target, seed)
    : null;

  const shuffledOptions = ql.presentationMode === "MISSING_FOURTH_TERM"
    ? missingTermOptions(ql.ruleId, context, target, seed)
    : pairOptions(ql.ruleId, context, target, seed);
  const qlOrdinal = Number(ql.qlId.slice(-3));
  const requestedCorrectIndex = ((seed + qlOrdinal) % 4 + 4) % 4;
  const options = placeCorrectOption(shuffledOptions, requestedCorrectIndex);
  const canonical = (value: NumericOption) => Array.isArray(value) ? value.join(":") : String(value);
  if (new Set(options.map((option) => canonical(option.value))).size !== 4) throw new Error("Duplicate numeric options.");
  const correctIndex = options.findIndex((option) => option.errorLabel === null);
  if (correctIndex < 0 || options.filter((option) => option.errorLabel === null).length !== 1) throw new Error("Numeric analogy must have exactly one answer.");

  const sourceDemo = rule.explain(source.input, source.output, context);
  const additionalDemo = additionalReference
    ? rule.explain(additionalReference.input, additionalReference.output, context)
    : null;
  const targetDemo = rule.explain(target.input, target.output, context);
  const difficulty = deriveNumericDifficulty(
    rule,
    context,
    ql.presentationMode,
    numericWrongValues(options),
    target.output,
  );

  return {
    qlId,
    ruleId: ql.ruleId,
    presentationMode: ql.presentationMode,
    difficulty,
    sourceA: source.input,
    sourceB: source.output,
    targetA: target.input,
    targetB: target.output,
    additionalReference,
    context,
    stem: ql.presentationMode === "MISSING_FOURTH_TERM"
      ? renderMissingStem(source, target, additionalReference, seed)
      : `Select the pair that follows the same relationship as ${source.input} : ${source.output}.`,
    options,
    correctIndex,
    explanation: {
      ruleStatement: `The relationship is: ${rule.label}.`,
      sourceDemonstration: additionalDemo ? `${sourceDemo}; also, ${additionalDemo}` : sourceDemo,
      targetApplication: targetDemo,
      conclusion: ql.presentationMode === "MISSING_FOURTH_TERM"
        ? `Therefore, ${target.output} is the correct answer.`
        : `Therefore, ${target.input} : ${target.output} follows the same rule.`,
      closestTrapRejection: ql.presentationMode === "MISSING_FOURTH_TERM"
        ? "Each wrong option comes from a specific alternative operation or stage error; applying the demonstrated rule gives only the stated answer."
        : "Each wrong pair comes from a specific alternative operation or stage error and fails the demonstrated relationship.",
    },
  };
}
