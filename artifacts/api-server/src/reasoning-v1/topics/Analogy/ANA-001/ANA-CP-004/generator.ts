import { ANA_CP004_QLS } from "./question-language.en";
import { checkSetAmbiguity } from "./ambiguity-checker";
import { solveSetRule, verifySetTransfer, type NumberTriple } from "./independent-solver";
import { setRuleById, type SetRuleContext } from "./rule-definitions";
import { validateSetOptions, type SetOption } from "./option-validator";

export type SetDifficulty = "EASY" | "MEDIUM" | "HARD";
export type SetLayout = "INLINE" | "TWO_ROW_TABLE" | "VERTICAL_GRID" | "BOXED_SETS";
export type TriplePosition = 0 | 1 | 2;

export interface GeneratedSetAnalogy {
  qlId: string;
  ruleId: string;
  presentationMode: "MISSING_MEMBER" | "EQUIVALENT_SET_SELECTION";
  difficulty: SetDifficulty;
  layout: SetLayout;
  missingPosition: TriplePosition | null;
  displayPermutation: readonly [TriplePosition, TriplePosition, TriplePosition];
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

function difficultyForSeed(seed: number): SetDifficulty {
  return (["EASY", "MEDIUM", "HARD"] as const)[Math.abs(seed) % 3];
}

function difficultyFits(difficulty: SetDifficulty, source: NumberTriple, target: NumberTriple): boolean {
  const largestInput = Math.max(source.first, source.second, target.first, target.second);
  const largestOutput = Math.max(source.third, target.third);
  if (difficulty === "EASY") return largestInput <= 12 && largestOutput <= 80;
  if (difficulty === "MEDIUM") return largestInput >= 7 && largestOutput <= 350;
  return largestInput >= 12 || largestOutput >= 120;
}

function chooseInstance(ruleId: string, seed: number, difficulty: SetDifficulty): { context: SetRuleContext; source: NumberTriple; target: NumberTriple } {
  const rule = setRuleById(ruleId);
  let fallback: { context: SetRuleContext; source: NumberTriple; target: NumberTriple } | null = null;
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
        if (!checkSetAmbiguity(ruleId, context, [source, target]).accepted) continue;
        const candidate = { context, source, target };
        fallback ??= candidate;
        if (difficultyFits(difficulty, source, target)) return candidate;
      }
    }
  }
  if (fallback) return fallback;
  throw new Error(`Unable to build an unambiguous ${ruleId} instance for seed ${seed}.`);
}

function plausibleWrongMembers(target: NumberTriple, seed: number): number[] {
  const { first: a, second: b, third: correct } = target;
  const average = (a + b) / 2;
  const candidates = [
    a + b,
    Math.abs(a - b),
    a * b,
    Number.isInteger(average) ? average : -1,
    a * a + b * b,
    Math.abs(a * a - b * b),
    a * b + a,
    a * b + b,
    a * b - a,
    a * b - b,
    correct + 1,
    correct - 1,
    correct + 2,
    correct - 2,
    correct + 5,
    correct - 5,
  ];
  return shuffle(candidates, seed).filter((value, index, all) =>
    Number.isInteger(value) && value > 0 && value !== correct && all.indexOf(value) === index,
  );
}

function missingMemberOptions(target: NumberTriple, seed: number) {
  const distractors = plausibleWrongMembers(target, seed * 17 + 7).slice(0, 3);
  if (distractors.length !== 3) throw new Error("Unable to produce three varied missing-member distractors.");
  return shuffle([
    { value: target.third as SetOption, errorLabel: null },
    ...distractors.map((value) => ({ value: value as SetOption, errorLabel: "PLAUSIBLE_ALTERNATE_SET_RULE" })),
  ], seed * 19 + 11);
}

function pairSelectionOptions(ruleId: string, context: SetRuleContext, target: NumberTriple, seed: number) {
  const rule = setRuleById(ruleId);
  const candidates = inputPairs(ruleId, rule.minInput, rule.maxInput, seed * 23 + 13);
  const distractors: { value: readonly [number, number, number]; errorLabel: string }[] = [];
  for (const [first, second] of candidates) {
    const correct = solveSetRule(ruleId, first, second, context);
    if (correct === null || (first === target.first && second === target.second)) continue;
    const wrongMembers = plausibleWrongMembers({ first, second, third: correct }, seed + first * 31 + second * 17);
    for (const third of wrongMembers) {
      const value = [first, second, third] as const;
      if (!distractors.some((entry) => entry.value.join(":") === value.join(":"))) {
        distractors.push({ value, errorLabel: "VALID_NUMBERS_ALTERNATE_SET_RULE" });
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

const PERMUTATIONS: readonly (readonly [TriplePosition, TriplePosition, TriplePosition])[] = [
  [0, 1, 2],
  [2, 0, 1],
  [1, 2, 0],
];
const LAYOUTS: readonly SetLayout[] = ["INLINE", "TWO_ROW_TABLE", "VERTICAL_GRID", "BOXED_SETS"];

function valuesOf(triple: NumberTriple): readonly [number, number, number] {
  return [triple.first, triple.second, triple.third];
}

function permute(triple: NumberTriple, permutation: readonly [TriplePosition, TriplePosition, TriplePosition]): readonly [number, number, number] {
  const values = valuesOf(triple);
  return [values[permutation[0]], values[permutation[1]], values[permutation[2]]];
}

function renderMissingStem(source: NumberTriple, target: NumberTriple, permutation: readonly [TriplePosition, TriplePosition, TriplePosition], layout: SetLayout): { stem: string; missingPosition: TriplePosition } {
  const displayedSource = permute(source, permutation);
  const displayedTarget = permute(target, permutation).map((value, index) => permutation[index] === 2 ? "?" : String(value));
  const missingPosition = permutation.indexOf(2) as TriplePosition;
  const sourceText = displayedSource.join(", ");
  const targetText = displayedTarget.join(", ");
  if (layout === "TWO_ROW_TABLE") {
    return { stem: `Complete the second row using the same rule.\n\n| Set | 1 | 2 | 3 |\n|---|---:|---:|---:|\n| A | ${displayedSource.join(" | ")} |\n| B | ${displayedTarget.join(" | ")} |`, missingPosition };
  }
  if (layout === "VERTICAL_GRID") {
    return { stem: `Find the missing number in the second column.\n\n| First set | Second set |\n|---:|---:|\n| ${displayedSource[0]} | ${displayedTarget[0]} |\n| ${displayedSource[1]} | ${displayedTarget[1]} |\n| ${displayedSource[2]} | ${displayedTarget[2]} |`, missingPosition };
  }
  if (layout === "BOXED_SETS") {
    return { stem: `The two boxes follow the same rule:\n\n[ ${sourceText} ]   [ ${targetText} ]`, missingPosition };
  }
  return { stem: `(${sourceText}) :: (${targetText})`, missingPosition };
}

function renderSelectionStem(source: NumberTriple, layout: SetLayout): string {
  if (layout === "TWO_ROW_TABLE") return `Select the row that follows the same rule as: | ${source.first} | ${source.second} | ${source.third} |`;
  if (layout === "VERTICAL_GRID") return `Select the number column that follows the same rule as ${source.first} → ${source.second} → ${source.third}.`;
  if (layout === "BOXED_SETS") return `Select the box that follows the same rule as [ ${source.first}, ${source.second}, ${source.third} ].`;
  return `Select the number set that follows the same rule as (${source.first}, ${source.second}, ${source.third}).`;
}

export function generateSetAnalogy(qlId: string, seed = 0): GeneratedSetAnalogy {
  const ql = qlById(qlId);
  const rule = setRuleById(ql.ruleId);
  const difficulty = difficultyForSeed(seed);
  const layout = LAYOUTS[Math.abs(seed) % LAYOUTS.length];
  const permutation = PERMUTATIONS[Math.abs(Math.floor(seed / LAYOUTS.length)) % PERMUTATIONS.length];
  const { context, source, target } = chooseInstance(ql.ruleId, seed, difficulty);
  if (!verifySetTransfer(ql.ruleId, context, source, target)) throw new Error("Independent solver rejected ANA-CP-004 instance.");
  const options = ql.presentationMode === "MISSING_MEMBER"
    ? missingMemberOptions(target, seed)
    : pairSelectionOptions(ql.ruleId, context, target, seed);
  const correctIndex = validateSetOptions(ql.ruleId, context, options);
  const rendered = ql.presentationMode === "MISSING_MEMBER"
    ? renderMissingStem(source, target, permutation, layout)
    : { stem: renderSelectionStem(source, layout), missingPosition: null };
  return {
    qlId,
    ruleId: ql.ruleId,
    presentationMode: ql.presentationMode,
    difficulty,
    layout,
    missingPosition: rendered.missingPosition,
    displayPermutation: permutation,
    context,
    source,
    target,
    stem: rendered.stem,
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
        ? "The other values arise from tempting alternative operations, but not from the rule demonstrated by both sets."
        : "The other sets use plausible arithmetic, but they do not preserve the demonstrated relationship.",
    },
  };
}
