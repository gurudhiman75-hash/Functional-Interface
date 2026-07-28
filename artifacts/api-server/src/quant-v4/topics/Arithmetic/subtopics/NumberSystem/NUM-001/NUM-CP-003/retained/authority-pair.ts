import { fillTwoDigits } from "../../foundation/divisibility";
import type { DeterministicRandom } from "../../foundation/prng";
import {
  difficultyFromState,
  enumerateOrderedPairs,
  option,
  pairSetText,
  pairText,
  randomTemplate,
  reasoningNodes,
} from "./runtime-core";
import type {
  NumCp003RawRetainedQuestion,
  NumCp003RetainedOptionAudit,
  NumCp003RetainedTemplateLabel,
} from "./runtime-types";

const PAIR_DIVISORS: ReadonlyArray<readonly bigint[]> = [
  [8n], [9n], [11n], [12n], [18n], [24n], [25n], [36n], [8n, 9n], [8n, 11n], [9n, 11n], [11n, 12n],
];

interface PairState {
  template: string;
  divisors: bigint[];
  relation?: { kind: "DIGIT_SUM"; value: number };
  validPairs: Array<[number, number]>;
}

function addUnique(rows: NumCp003RetainedOptionAudit[], row: NumCp003RetainedOptionAudit): void {
  if (!rows.some((existing) => existing.text === row.text)) rows.push(row);
}

function describeConstraints(state: PairState): string {
  const divisorText = state.divisors.length === 1
    ? `divisible by ${state.divisors[0]}`
    : `divisible by both ${state.divisors[0]} and ${state.divisors[1]}`;
  return state.relation ? `${divisorText}, with X + Y = ${state.relation.value}` : divisorText;
}

function generatePairState(
  random: DeterministicRandom,
  target: "NONE" | "UNIQUE" | "MULTIPLE",
): PairState {
  for (let attempt = 0; attempt < 5_000; attempt += 1) {
    const template = randomTemplate(random, 2);
    const divisors = [...random.pick(PAIR_DIVISORS)];
    const relation = random.bool(0.48)
      ? { kind: "DIGIT_SUM" as const, value: random.int(2, 16) }
      : undefined;
    const validPairs = enumerateOrderedPairs(template, divisors, relation);
    const matches = target === "NONE"
      ? validPairs.length === 0
      : target === "UNIQUE"
        ? validPairs.length === 1
        : validPairs.length >= 2 && validPairs.length <= 7;
    if (matches) return { template, divisors, relation, validPairs };
  }
  throw new Error(`Unable to construct ${target} ordered-pair state`);
}

function allAdmissiblePairs(template: string): Array<[number, number]> {
  const values: Array<[number, number]> = [];
  for (let first = 0; first <= 9; first += 1) {
    for (let second = 0; second <= 9; second += 1) {
      if (template.startsWith("X") && first === 0) continue;
      if (template.startsWith("Y") && second === 0) continue;
      values.push([first, second]);
    }
  }
  return values;
}

function invalidPairs(state: PairState): Array<[number, number]> {
  const validKeys = new Set(state.validPairs.map(pairText));
  return allAdmissiblePairs(state.template).filter((pair) => !validKeys.has(pairText(pair)));
}

function uniquePair(random: DeterministicRandom): NumCp003RawRetainedQuestion {
  const state = generatePairState(random, "UNIQUE");
  const answerPair = state.validPairs[0]!;
  const answerText = pairText(answerPair);
  const completed = fillTwoDigits(state.template, answerPair[0], answerPair[1]);
  const rows: NumCp003RetainedOptionAudit[] = [
    option(answerText, "CORRECT", `${answerText} forms ${completed}, which satisfies every displayed constraint.`),
  ];
  if (answerPair[0] !== answerPair[1]) {
    const swapped: [number, number] = [answerPair[1], answerPair[0]];
    addUnique(rows, option(
      pairText(swapped),
      "SWAPPED_DIGIT_ORDER",
      `${pairText(swapped)} places the digits in the opposite positions and does not reproduce the valid state.`,
    ));
  }
  for (const pair of random.shuffle(invalidPairs(state))) {
    if (rows.length >= 4) break;
    const numeral = fillTwoDigits(state.template, pair[0], pair[1]);
    const relationOk = !state.relation || pair[0] + pair[1] === state.relation.value;
    addUnique(rows, option(
      pairText(pair),
      relationOk ? "FAILED_DIVISIBILITY" : "FAILED_AUXILIARY_RELATION",
      relationOk
        ? `${pairText(pair)} forms ${numeral}, which fails at least one divisor condition.`
        : `${pairText(pair)} does not satisfy X + Y = ${state.relation!.value}.`,
    ));
  }
  if (rows.length !== 4) throw new Error("Unable to build unique-pair options");
  const constraints = describeConstraints(state);
  return {
    difficulty: difficultyFromState(state.template.length + state.divisors.length * 2 + (state.relation ? 2 : 0)),
    answerSemantic: "ORDERED_DIGIT_PAIR",
    stem: random.pick([
      `Find the ordered pair (X, Y) that makes ${state.template} ${constraints}.`,
      `Only one ordered digit pair satisfies all conditions for ${state.template}. What is (X, Y)?`,
      `Determine the positions X and Y in ${state.template}, given that it is ${constraints}.`,
      `Which ordered pair completes ${state.template} under every stated condition?`,
    ]),
    answer: answerText,
    optionAudit: rows,
    hiddenState: {
      kind: "ORDERED_PAIR_CANDIDATE_SET",
      template: state.template,
      divisors: state.divisors,
      relation: state.relation,
      validPairs: state.validPairs,
      projection: "UNIQUE_VALID_ORDERED_PAIR",
    },
    explanation: {
      coreConcept: "X and Y are positional digits, so their ordered pair must satisfy every constraint simultaneously.",
      strategy: "Enumerate admissible ordered pairs, apply the optional relation and then test exact divisibility.",
      steps: [
        `Check ordered pairs from the admissible digit domain${state.relation ? ` subject to X + Y = ${state.relation.value}` : ""}.`,
        `The complete valid pair set is ${pairSetText(state.validPairs)}.`,
        `${answerText} forms ${completed}.`,
      ],
      shortcut: "Use the most restrictive suffix, digit-sum or alternating-sum rule first, then verify the remaining pair.",
      verification: `${completed} satisfies ${state.divisors.join(" and ")}${state.relation ? ` and ${answerPair[0]} + ${answerPair[1]} = ${state.relation.value}` : ""}.`,
      conclusion: `Therefore, (X, Y) = ${answerText}.`,
      traps: ["Do not interchange X and Y.", "Do not stop after satisfying only one divisor.", "Apply the auxiliary digit relation before accepting a pair."],
    },
    reasoningNodes: reasoningNodes(
      `${state.template} must satisfy ${constraints}.`,
      "Enumerate ordered pairs and apply all constraints.",
      `The valid pair set is ${pairSetText(state.validPairs)}.`,
      `${answerText} forms ${completed} and passes exact verification.`,
      `The answer is ${answerText}.`,
    ),
    fingerprint: `pair:unique:${state.template}:${state.divisors.join(",")}:${state.relation?.value ?? "none"}:${answerText}`,
  };
}

function countPairs(random: DeterministicRandom): NumCp003RawRetainedQuestion {
  const state = generatePairState(random, "MULTIPLE");
  const count = state.validPairs.length;
  const candidates = [count, count - 1, count + 1, count + 2].filter((value) => value >= 0);
  const rows: NumCp003RetainedOptionAudit[] = [];
  for (const value of candidates) {
    addUnique(rows, option(
      String(value),
      value === count ? "CORRECT" : "MISCOUNTED_ORDERED_PAIRS",
      value === count
        ? `${pairSetText(state.validPairs)} contains ${count} ordered pairs.`
        : `${value} does not equal the exact valid-pair count ${count}.`,
    ));
  }
  for (let value = 0; rows.length < 4; value += 1) {
    if (value === count) continue;
    addUnique(rows, option(String(value), "MISCOUNTED_ORDERED_PAIRS", `${value} is not the exact pair count ${count}.`));
  }
  const constraints = describeConstraints(state);
  return {
    difficulty: difficultyFromState(state.template.length + count + state.divisors.length * 2),
    answerSemantic: "COUNT",
    stem: random.pick([
      `How many ordered pairs (X, Y) make ${state.template} ${constraints}?`,
      `Count all ordered digit pairs satisfying every condition in ${state.template}.`,
      `For how many ordered pairs is ${state.template} ${constraints}?`,
      `What is the cardinality of the valid ordered-pair set for ${state.template}?`,
    ]),
    answer: String(count),
    optionAudit: rows,
    hiddenState: { kind: "ORDERED_PAIR_CANDIDATE_SET", template: state.template, divisors: state.divisors, relation: state.relation, validPairs: state.validPairs, projection: "VALID_ORDERED_PAIR_COUNT" },
    explanation: {
      coreConcept: "Ordered-pair counting treats (a, b) and (b, a) as different when the digit positions differ.",
      strategy: "Enumerate all admissible ordered pairs and count the exact valid set.",
      steps: [`Apply ${constraints}.`, `The valid pairs are ${pairSetText(state.validPairs)}.`, `There are ${count} ordered pairs.`],
      shortcut: "Use the most restrictive rule first to reduce the 100-pair domain before final verification.",
      verification: `Independent 100-pair enumeration reproduces the count ${count}.`,
      conclusion: `Therefore, the answer is ${count}.`,
      traps: ["Do not treat ordered pairs as unordered.", "Do not count a pair twice.", "Do not include a pair that satisfies only part of the condition."],
    },
    reasoningNodes: reasoningNodes(`${state.template} must satisfy ${constraints}.`, "Enumerate ordered pairs.", `Valid pairs: ${pairSetText(state.validPairs)}.`, `The set size is ${count}.`, `${count} pairs work.`),
    fingerprint: `pair:count:${state.template}:${state.divisors.join(",")}:${state.relation?.value ?? "none"}:${pairSetText(state.validPairs)}`,
  };
}

function pairSet(random: DeterministicRandom): NumCp003RawRetainedQuestion {
  const state = generatePairState(random, "MULTIPLE");
  const correct = pairSetText(state.validPairs);
  const removedPairs = state.validPairs.slice(0, -1);
  const invalid = random.pick(invalidPairs(state));
  const addedPairs = [...state.validPairs, invalid];
  const swappedPairs = state.validPairs.map(([first, second]) => [second, first] as [number, number]);
  const rows = [
    option(correct, "CORRECT", `${correct} is exactly the complete valid ordered-pair set.`),
    option(pairSetText(removedPairs), "OMITTED_VALID_PAIR", "This set omits at least one valid ordered pair."),
    option(pairSetText(addedPairs), "INCLUDED_INVALID_PAIR", `${pairText(invalid)} does not satisfy every condition.`),
    option(pairSetText(swappedPairs), "SWAPPED_PAIR_POSITIONS", "This option reverses the positional roles of X and Y."),
  ];
  if (new Set(rows.map((row) => row.text)).size !== 4) throw new Error("Unable to build four pair-set options");
  const constraints = describeConstraints(state);
  return {
    difficulty: "Hard",
    answerSemantic: "ORDERED_PAIR_SET",
    stem: random.pick([
      `Which set contains all ordered pairs (X, Y) that make ${state.template} ${constraints}?`,
      `Find the complete ordered-pair solution set for ${state.template}.`,
      `Which option lists every valid (X, Y) pair and no invalid pair for ${state.template}?`,
      `Select the exact ordered-pair set satisfying all conditions in ${state.template}.`,
    ]),
    answer: correct,
    optionAudit: rows,
    hiddenState: { kind: "ORDERED_PAIR_CANDIDATE_SET", template: state.template, divisors: state.divisors, relation: state.relation, validPairs: state.validPairs, projection: "COMPLETE_VALID_ORDERED_PAIR_SET" },
    explanation: {
      coreConcept: "A set answer must include all and only the valid ordered pairs.",
      strategy: "Exhaust the ordered-pair domain, then compare options by semantic set equality.",
      steps: [`Apply ${constraints}.`, `The complete valid set is ${correct}.`, "Any omitted, added or position-swapped pair makes an option incorrect."],
      shortcut: "Reduce the domain with the strongest rule before checking exact membership.",
      verification: `Independent enumeration confirms exactly ${state.validPairs.length} pairs in ${correct}.`,
      conclusion: `Therefore, the correct set is ${correct}.`,
      traps: ["Do not omit a valid pair.", "Do not include a pair that satisfies only one rule.", "Do not normalise away the order of X and Y."],
    },
    reasoningNodes: reasoningNodes(`${state.template} must satisfy ${constraints}.`, "Enumerate the complete ordered domain.", `The valid set is ${correct}.`, "Every member passes and every outside pair fails.", `${correct} is exact.`),
    fingerprint: `pair:set:${state.template}:${state.divisors.join(",")}:${state.relation?.value ?? "none"}:${correct}`,
  };
}

function classifyPairs(random: DeterministicRandom): NumCp003RawRetainedQuestion {
  const target = random.pick(["NONE", "UNIQUE", "MULTIPLE"] as const);
  const state = generatePairState(random, target);
  const answer = target === "NONE" ? "No solution" : target === "UNIQUE" ? "Exactly one solution" : "More than one solution";
  const rows = [
    option("No solution", answer === "No solution" ? "CORRECT" : "WRONG_SOLUTION_CLASS", `The exact valid-pair count is ${state.validPairs.length}.`),
    option("Exactly one solution", answer === "Exactly one solution" ? "CORRECT" : "WRONG_SOLUTION_CLASS", `The exact valid-pair count is ${state.validPairs.length}.`),
    option("More than one solution", answer === "More than one solution" ? "CORRECT" : "WRONG_SOLUTION_CLASS", `The exact valid-pair count is ${state.validPairs.length}.`),
    option("All admissible pairs work", "CLASSIFIED_ALL_PAIRS", `Only ${state.validPairs.length} admissible pairs satisfy every condition.`),
  ];
  const constraints = describeConstraints(state);
  return {
    difficulty: difficultyFromState(state.template.length + state.divisors.length * 2 + (target === "NONE" ? 3 : 1)),
    answerSemantic: "SOLUTION_CLASS",
    stem: random.pick([
      `How should the ordered-pair solution set for ${state.template} be classified under ${constraints}?`,
      `Does ${state.template} have no, one or multiple ordered-pair solutions when it is ${constraints}?`,
      `Classify the number of valid (X, Y) pairs for ${state.template}.`,
      `Which statement correctly describes the ordered-pair solution set of ${state.template}?`,
    ]),
    answer,
    optionAudit: rows,
    hiddenState: { kind: "ORDERED_PAIR_CANDIDATE_SET", template: state.template, divisors: state.divisors, relation: state.relation, validPairs: state.validPairs, projection: "PAIR_SOLUTION_CLASS" },
    explanation: {
      coreConcept: "Solution classification depends on the cardinality of the complete valid ordered-pair set.",
      strategy: "Enumerate the valid set and map its size to none, unique or multiple.",
      steps: [`Apply ${constraints}.`, `The valid set is ${pairSetText(state.validPairs)}.`, `Its size ${state.validPairs.length} gives the class: ${answer}.`],
      shortcut: "Use the strongest constraint first, but confirm the final class with complete enumeration.",
      verification: `The exact valid-pair count is ${state.validPairs.length}.`,
      conclusion: `Therefore, the solution class is '${answer}'.`,
      traps: ["Do not report an actual pair when the target is a class.", "Do not infer uniqueness from the first pair found.", "Do not ignore ordered positions."],
    },
    reasoningNodes: reasoningNodes(`${state.template} must satisfy ${constraints}.`, "Recover the complete valid-pair set.", `Valid pairs: ${pairSetText(state.validPairs)}.`, `The set size is ${state.validPairs.length}.`, `The class is ${answer}.`),
    fingerprint: `pair:class:${target}:${state.template}:${state.divisors.join(",")}:${state.relation?.value ?? "none"}:${pairSetText(state.validPairs)}`,
  };
}

export function generatePairAuthority(
  label: NumCp003RetainedTemplateLabel,
  random: DeterministicRandom,
): NumCp003RawRetainedQuestion {
  switch (label) {
    case "NUM-CP003-QLT2-08": return uniquePair(random);
    case "NUM-CP003-QLT2-09": return countPairs(random);
    case "NUM-CP003-QLT2-10": return pairSet(random);
    case "NUM-CP003-QLT2-11": return classifyPairs(random);
    default: throw new Error(`Unsupported ordered-pair template ${label}`);
  }
}
