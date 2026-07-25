import { ANA_CP004_QLS } from "./question-language.en";
import { checkSetAmbiguity } from "./ambiguity-checker";
import { solveSetRule, verifySetTransfer, type NumberTriple } from "./independent-solver";
import { setRuleById, type SetRuleContext } from "./rule-definitions";
import { validateSetOptions, type SetOption } from "./option-validator";

export interface GeneratedSetAnalogy {
  qlId: string;
  ruleId: string;
  presentationMode: "MISSING_MEMBER" | "EQUIVALENT_SET_SELECTION";
  context: SetRuleContext;
  source: NumberTriple;
  target: NumberTriple;
  stem: string;
  options: readonly { value: SetOption; errorLabel: string | null }[];
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
  let state = (seed ^ 0x94d049bb) >>> 0;
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
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function qlById(qlId: string) {
  const ql = ANA_CP004_QLS.find((entry) => entry.qlId === qlId);
  if (!ql) throw new Error(`Unknown ANA-CP-004 QL: ${qlId}`);
  return ql;
}

function inputPairs(ruleId: string, min: number, max: number, seed: number): readonly [number, number][] {
  const pairs: [number, number][] = [];
  for (let first = min; first <= max; first += 1) {
    if (ruleId === "SET_CONSECUTIVE_CONSTRUCTION") {
      if (first + 1 <= max) pairs.push([first, first + 1]);
      continue;
    }
    for (let second = min; second <= max; second += 1) {
      if (first === second && ["SET_ABS_DIFFERENCE", "SET_SQUARE_DIFFERENCE"].includes(ruleId)) continue;
      pairs.push([first, second]);
    }
  }
  return shuffle(pairs, seed);
}

function chooseInstance(ruleId: string, seed: number): { context: SetRuleContext; source: NumberTriple; target: NumberTriple } {
  const rule = setRuleById(ruleId);
  for (const context of shuffle(rule.contexts, seed * 11 + 3)) {
    const pairs = inputPairs(ruleId, rule.minInput, rule.maxInput, seed * 13 + 5);
    for (let sourceIndex = 0; sourceIndex < pairs.length; sourceIndex += 1) {
      const [sourceFirst, sourceSecond] = pairs[sourceIndex];
      const sourceThird = solveSetRule(ruleId, sourceFirst, sourceSecond, context);
      if (sourceThird === null) continue;
      const source = { first: sourceFirst, second: sourceSecond, third: sourceThird };
      for (let targetIndex = sourceIndex + 1; targetIndex < pairs.length; targetIndex += 1) {
        const [targetFirst, targetSecond] = pairs[targetIndex];
        const targetThird = solveSetRule(ruleId, targetFirst, targetSecond, context);
        if (targetThird === null || targetThird === sourceThird) continue;
        const target = { first: targetFirst, second: targetSecond, third: targetThird };
        if (checkSetAmbiguity(ruleId, context, [source, target]).accepted) return { context, source, target };
      }
    }
  }
  throw new Error(`Unable to build an unambiguous ${ruleId} instance for seed ${seed}.`);
}

function missingMemberOptions(target: NumberTriple, seed: number) {
  const deltas = shuffle([1,2,3,4,5,6,7,9,10,12,15], seed * 17 + 7);
  const distractors: number[] = [];
  for (const delta of deltas) {
    for (const sign of [1, -1]) {
      const value = target.third + sign * delta;
      if (value > 0 && value !== target.third && !distractors.includes(value)) distractors.push(value);
      if (distractors.length === 3) break;
    }
    if (distractors.length === 3) break;
  }
  return shuffle([
    { value: target.third as SetOption, errorLabel: null },
    ...distractors.map((value) => ({ value: value as SetOption, errorLabel: "PLAUSIBLE_WRONG_MEMBER" })),
  ], seed * 19 + 11);
}

function pairSelectionOptions(ruleId: string, context: SetRuleContext, target: NumberTriple, seed: number) {
  const rule = setRuleById(ruleId);
  const candidates = inputPairs(ruleId, rule.minInput, rule.maxInput, seed * 23 + 13);
  const distractors: { value: readonly [number, number, number]; errorLabel: string }[] = [];
  for (const [first, second] of candidates) {
    const correct = solveSetRule(ruleId, first, second, context);
    if (correct === null || (first === target.first && second === target.second)) continue;
    for (const delta of [1,-1,2,-2,3,-3,5,-5,7,-7]) {
      const third = correct + delta;
      if (third <= 0 || third === correct) continue;
      const value = [first, second, third] as const;
      if (!distractors.some((entry) => entry.value.join(":") === value.join(":"))) {
        distractors.push({ value, errorLabel: "VALID_NUMBERS_WRONG_SET_RULE" });
      }
      if (distractors.length === 3) break;
    }
    if (distractors.length === 3) break;
  }
  if (distractors.length !== 3) throw new Error(`${ruleId} cannot produce three set distractors.`);
  return shuffle([
    { value: [target.first, target.second, target.third] as const, errorLabel: null },
    ...distractors,
  ], seed * 29 + 17);
}

export function generateSetAnalogy(qlId: string, seed = 0): GeneratedSetAnalogy {
  const ql = qlById(qlId);
  const rule = setRuleById(ql.ruleId);
  const { context, source, target } = chooseInstance(ql.ruleId, seed);
  if (!verifySetTransfer(ql.ruleId, context, source, target)) throw new Error("Independent solver rejected ANA-CP-004 instance.");
  const options = ql.presentationMode === "MISSING_MEMBER"
    ? missingMemberOptions(target, seed)
    : pairSelectionOptions(ql.ruleId, context, target, seed);
  const correctIndex = validateSetOptions(ql.ruleId, context, options);
  return {
    qlId,
    ruleId: ql.ruleId,
    presentationMode: ql.presentationMode,
    context,
    source,
    target,
    stem: ql.presentationMode === "MISSING_MEMBER"
      ? `(${source.first}, ${source.second}, ${source.third}) :: (${target.first}, ${target.second}, ?)`
      : `Select the number set that follows the same rule as (${source.first}, ${source.second}, ${source.third}).`,
    options,
    correctIndex,
    explanation: {
      ruleStatement: `The relationship is: ${rule.label}.`,
      sourceDemonstration: rule.explain(source.first, source.second, source.third, context),
      targetApplication: rule.explain(target.first, target.second, target.third, context),
      conclusion: ql.presentationMode === "MISSING_MEMBER"
        ? `Therefore, ${target.third} is the missing number.`
        : `Therefore, (${target.first}, ${target.second}, ${target.third}) follows the same rule.`,
      closestTrapRejection: ql.presentationMode === "MISSING_MEMBER"
        ? "The other values are numerically close but do not result from the stated set rule."
        : "The other sets contain plausible numbers but do not preserve the same relationship.",
    },
  };
}
