import { fillTwoDigits, numeralToBigInt, validTwoDigitPairs } from "../../foundation/divisibility";
import type { DeterministicRandom } from "../../foundation/prng";
import { audit, nodes, pairSetText, pairText } from "./core";
import type { RawWave04 } from "./rule-generators";
import type { PairSolutionClass, Wave04OptionAudit } from "./types";

const PAIR_DIVISORS: ReadonlyArray<readonly [bigint, bigint]> = [
  [8n, 9n], [8n, 11n], [9n, 11n], [11n, 12n], [11n, 18n], [12n, 25n], [16n, 9n], [25n, 11n], [8n, 13n], [7n, 9n], [7n, 11n], [13n, 9n],
];

function templateWithXY(random: DeterministicRandom): string {
  const length = random.int(5, 7);
  const parts = Array.from({ length }, (_unused, index) => String(random.int(index === 0 ? 1 : 0, 9)));
  const firstIndex = random.int(1, length - 2);
  const secondIndex = random.int(firstIndex + 1, length - 1);
  parts[firstIndex] = "X";
  parts[secondIndex] = "Y";
  return parts.join("");
}

function invalidPair(template: string, divisors: readonly [bigint, bigint], validPairs: ReadonlyArray<readonly [number, number]>): [number, number] | null {
  for (let first = 0; first <= 9; first += 1) {
    for (let second = 0; second <= 9; second += 1) {
      if (validPairs.some((pair) => pair[0] === first && pair[1] === second)) continue;
      const value = numeralToBigInt(fillTwoDigits(template, first, second));
      if (value % divisors[0] !== 0n || value % divisors[1] !== 0n) return [first, second];
    }
  }
  return null;
}

export function orderedPairSet(random: DeterministicRandom): RawWave04 {
  for (let attempt = 0; attempt < 5000; attempt += 1) {
    const template = templateWithXY(random);
    const chosen = random.pick(PAIR_DIVISORS);
    const divisors: [bigint, bigint] = [chosen[0], chosen[1]];
    const validPairs = validTwoDigitPairs(template, divisors);
    if (validPairs.length < 2 || validPairs.length > 5) continue;
    const invalid = invalidPair(template, divisors, validPairs);
    if (!invalid) continue;
    const answer = pairSetText(validPairs);
    const omitted = pairSetText(validPairs.slice(0, -1));
    const included = pairSetText([...validPairs, invalid]);
    const firstOnly = pairSetText([validPairs[0]!]);
    const options: Wave04OptionAudit[] = [
      audit(answer, "CORRECT", `Complete 10 × 10 enumeration gives exactly ${answer}.`),
      audit(omitted, "OMITTED_VALID_PAIR", `${omitted} omits ${pairText(validPairs.at(-1)!)} even though it satisfies both divisors.`),
      audit(included, "INCLUDED_INVALID_PAIR", `${pairText(invalid)} forms ${fillTwoDigits(template, ...invalid)}, which fails at least one divisor.`),
      audit(firstOnly, "STOPPED_AFTER_FIRST_PAIR", `${firstOnly} stops after the first valid ordered pair instead of listing the full set.`),
    ];
    if (new Set(options.map((row) => row.text)).size !== 4) continue;
    return {
      hiddenState: { kind: "TWO_DIGIT_PAIR_SET", template, divisors, validPairs },
      difficulty: "Hard",
      answerSemantic: "ORDERED_PAIR_SET",
      stem: `Which set contains all ordered pairs (X, Y) that make ${template} divisible by both ${divisors[0]} and ${divisors[1]}?`,
      answer,
      options,
      explanation: {
        coreConcept: "A pair-set answer must include every valid ordered pair and no invalid pair.",
        strategy: `Enumerate the ordered pair domain, then intersect divisibility by ${divisors[0]} and ${divisors[1]}.`,
        steps: ["Start with the 100 ordered pairs from (0, 0) to (9, 9).", "Test each completed numeral against both divisors.", `The complete survivor set is ${answer}.`],
        shortcut: "Apply the rule with the smaller survivor set first, then test those pairs against the second rule.",
        verification: `Independent exact enumeration reconstructs the same ${validPairs.length}-pair set.`,
        conclusion: `Therefore, the complete valid set is ${answer}.`,
        traps: ["The pair is ordered.", "Do not omit a later valid pair.", "Do not include a pair that passes only one divisor."],
      },
      nodes: nodes(`${template} must satisfy ${divisors[0]} and ${divisors[1]}.`, "Intersect both ordered-pair solution sets.", `Survivors: ${answer}.`, "All 100 pairs were tested.", `Answer ${answer}.`),
      fingerprint: `pair-set:${template}:${divisors.join(",")}:${validPairs.map(pairText).join("|")}`,
    };
  }
  throw new Error("Could not build ordered-pair-set state");
}

const SOLUTION_TEXT: Record<PairSolutionClass | "ALL_PAIRS", string> = {
  NO_SOLUTION: "No ordered pair satisfies both conditions.",
  UNIQUE_SOLUTION: "Exactly one ordered pair satisfies both conditions.",
  MULTIPLE_SOLUTIONS: "More than one ordered pair satisfies both conditions.",
  ALL_PAIRS: "All 100 ordered pairs satisfy both conditions.",
};

export function pairSolutionClass(random: DeterministicRandom): RawWave04 {
  const desired = random.pick(["NO_SOLUTION", "UNIQUE_SOLUTION", "MULTIPLE_SOLUTIONS"] as const);
  for (let attempt = 0; attempt < 7000; attempt += 1) {
    const template = templateWithXY(random);
    const chosen = random.pick(PAIR_DIVISORS);
    const divisors: [bigint, bigint] = [chosen[0], chosen[1]];
    const validPairs = validTwoDigitPairs(template, divisors);
    const actual: PairSolutionClass = validPairs.length === 0 ? "NO_SOLUTION" : validPairs.length === 1 ? "UNIQUE_SOLUTION" : "MULTIPLE_SOLUTIONS";
    if (actual !== desired) continue;
    const options = (Object.keys(SOLUTION_TEXT) as Array<PairSolutionClass | "ALL_PAIRS">).map((classification) => {
      if (classification === actual) return audit(SOLUTION_TEXT[classification], "CORRECT", `Exact enumeration gives ${validPairs.length} valid ordered pair${validPairs.length === 1 ? "" : "s"}.`);
      if (classification === "NO_SOLUTION") return audit(SOLUTION_TEXT[classification], "CLASSIFIED_NO_SOLUTION", `The actual valid-pair count is ${validPairs.length}.`);
      if (classification === "UNIQUE_SOLUTION") return audit(SOLUTION_TEXT[classification], "CLASSIFIED_UNIQUE_SOLUTION", `The actual valid-pair count is ${validPairs.length}.`);
      if (classification === "MULTIPLE_SOLUTIONS") return audit(SOLUTION_TEXT[classification], "CLASSIFIED_MULTIPLE_SOLUTIONS", `The actual valid-pair count is ${validPairs.length}.`);
      return audit(SOLUTION_TEXT[classification], "CLASSIFIED_ALL_PAIRS", `Only ${validPairs.length} of 100 ordered pairs satisfy both conditions.`);
    });
    return {
      hiddenState: { kind: "TWO_DIGIT_SOLUTION_CLASS", template, divisors, validPairs, solutionClass: actual },
      difficulty: actual === "NO_SOLUTION" ? "Hard" : "Medium",
      answerSemantic: "SOLUTION_CLASS",
      stem: `For the number ${template}, what is true about ordered digit pairs (X, Y) that make it divisible by both ${divisors[0]} and ${divisors[1]}?`,
      answer: SOLUTION_TEXT[actual],
      options,
      explanation: {
        coreConcept: "A solution-class question asks whether the full admissible set is empty, a singleton or contains several pairs.",
        strategy: "Construct the complete ordered-pair solution set before classifying it.",
        steps: ["Test all ordered pairs (X, Y) from 0 to 9.", `The exact valid-pair count is ${validPairs.length}.`, `That count corresponds to: ${SOLUTION_TEXT[actual]}`],
        shortcut: "Reduce the pair domain with the cheaper divisibility rule before classifying the final intersection.",
        verification: `Independent enumeration gives the set ${pairSetText(validPairs)}.`,
        conclusion: SOLUTION_TEXT[actual],
        traps: ["Finding one pair does not prove uniqueness.", "Failure of a few pairs does not prove impossibility.", "Classify the intersection of both rules, not either rule alone."],
      },
      nodes: nodes(`${template} has two unknown digits.`, "Classify the complete intersection.", `Valid-pair count ${validPairs.length}.`, `Set ${pairSetText(validPairs)}.`, SOLUTION_TEXT[actual]),
      fingerprint: `pair-class:${template}:${divisors.join(",")}:${actual}:${validPairs.map(pairText).join("|")}`,
    };
  }
  throw new Error(`Could not build pair solution class ${desired}`);
}
