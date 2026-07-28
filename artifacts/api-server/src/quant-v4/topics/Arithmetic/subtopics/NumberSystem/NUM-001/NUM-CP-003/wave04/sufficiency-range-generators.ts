import { validSingleDigits } from "../../foundation/divisibility";
import type { DeterministicRandom } from "../../foundation/prng";
import { RULES, audit, countMultiples, lcm, lcm3, nodes } from "./core";
import type { RawWave04 } from "./rule-generators";

const EACH_ALONE = "Each statement alone is sufficient to determine X.";
const I_ONLY = "Statement I alone is sufficient, but Statement II alone is not sufficient.";
const II_ONLY = "Statement II alone is sufficient, but Statement I alone is not sufficient.";
const TOGETHER_ONLY = "Both statements together are sufficient, but neither statement alone is sufficient.";

export function eachStatementAlone(random: DeterministicRandom): RawWave04 {
  const divisors = RULES.map((rule) => rule.divisor);
  for (let attempt = 0; attempt < 7000; attempt += 1) {
    const length = random.int(4, 7);
    const parts = Array.from({ length }, (_unused, index) => String(random.int(index === 0 ? 1 : 0, 9)));
    parts[random.int(1, length - 1)] = "X";
    const template = parts.join("");
    const firstDivisor = random.pick(divisors);
    let secondDivisor = random.pick(divisors);
    while (secondDivisor === firstDivisor) secondDivisor = random.pick(divisors);
    const firstDigits = validSingleDigits(template, firstDivisor);
    const secondDigits = validSingleDigits(template, secondDivisor);
    if (firstDigits.length !== 1 || secondDigits.length !== 1 || firstDigits[0] !== secondDigits[0]) continue;
    const sharedDigit = firstDigits[0]!;
    return {
      hiddenState: { kind: "EACH_STATEMENT_ALONE_SUFFICIENT", template, firstDivisor, secondDivisor, firstDigits, secondDigits, sharedDigit },
      difficulty: "Hard",
      answerSemantic: "SUFFICIENCY_CLASS",
      stem: `What can be concluded about the missing digit X in ${template}? Statement I: The number is divisible by ${firstDivisor}. Statement II: The number is divisible by ${secondDivisor}. Which option correctly describes whether X can be determined?`,
      answer: EACH_ALONE,
      options: [
        audit(EACH_ALONE, "CORRECT", `Statement I gives {${sharedDigit}} and Statement II independently gives the same singleton {${sharedDigit}}.`),
        audit(I_ONLY, "STATEMENT_I_ONLY_MISREAD", `Statement II is also sufficient because its complete candidate set is {${sharedDigit}}.`),
        audit(II_ONLY, "STATEMENT_II_ONLY_MISREAD", `Statement I is also sufficient because its complete candidate set is {${sharedDigit}}.`),
        audit(TOGETHER_ONLY, "BOTH_TOGETHER_ONLY_MISREAD", `The statements do not need to be combined; each one already determines X = ${sharedDigit}.`),
      ],
      explanation: {
        coreConcept: "Each statement alone is sufficient when each separate candidate set is the same singleton.",
        strategy: "Solve Statement I independently, reset the evidence, then solve Statement II independently.",
        steps: [`Statement I permits only X = ${sharedDigit}.`, `Statement II also permits only X = ${sharedDigit}.`, "Therefore either statement alone determines the missing digit."],
        shortcut: "Never combine the statements before checking each one separately.",
        verification: `Exhaustive substitution of X = 0 through 9 produces {${sharedDigit}} from both statements independently.`,
        conclusion: EACH_ALONE,
        traps: ["Do not label the result 'both together only' when each set is already a singleton.", "The two statements may use different rules and still determine the same digit.", "Sufficiency concerns uniqueness, not merely consistency."],
      },
      nodes: nodes(`${template} with divisibility statements ${firstDivisor} and ${secondDivisor}.`, "Check each statement independently for a singleton set.", `I = {${sharedDigit}}, II = {${sharedDigit}}.`, "Both independent enumerations are unique.", EACH_ALONE),
      fingerprint: `each-alone:${template}:${firstDivisor}:${secondDivisor}:${sharedDigit}`,
    };
  }
  throw new Error("Could not build each-statement-alone sufficiency state");
}

export function countThreeDivisors(random: DeterministicRandom): RawWave04 {
  for (let attempt = 0; attempt < 1200; attempt += 1) {
    const lower = BigInt(random.int(1, 500));
    const upper = lower + BigInt(random.int(500, 2600));
    const candidates = random.shuffle([3n, 4n, 5n, 7n, 8n, 9n, 11n, 13n, 16n, 25n]).slice(0, 3) as [bigint, bigint, bigint];
    const [a, b, c] = candidates;
    if (a === b || b === c || a === c) continue;
    if (a % b === 0n || b % a === 0n || a % c === 0n || c % a === 0n || b % c === 0n || c % b === 0n) continue;
    const singles: [bigint, bigint, bigint] = [countMultiples(lower, upper, a), countMultiples(lower, upper, b), countMultiples(lower, upper, c)];
    const pairOverlaps: [bigint, bigint, bigint] = [
      countMultiples(lower, upper, lcm(a, b)),
      countMultiples(lower, upper, lcm(a, c)),
      countMultiples(lower, upper, lcm(b, c)),
    ];
    const tripleOverlap = countMultiples(lower, upper, lcm3(a, b, c));
    const sumSingles = singles[0] + singles[1] + singles[2];
    const sumPairs = pairOverlaps[0] + pairOverlaps[1] + pairOverlaps[2];
    const answer = sumSingles - sumPairs + tripleOverlap;
    const wrongNoPairCorrection = sumSingles;
    const wrongNoTripleRestore = sumSingles - sumPairs;
    const wrongOneDivisor = singles[0];
    const optionTexts = [answer, wrongNoPairCorrection, wrongNoTripleRestore, wrongOneDivisor].map(String);
    if (new Set(optionTexts).size !== 4) continue;
    return {
      hiddenState: { kind: "THREE_DIVISOR_RANGE", lower, upper, divisors: [a, b, c], singles, pairOverlaps, tripleOverlap, answer },
      difficulty: "Hard",
      answerSemantic: "COUNT",
      stem: `How many integers from ${lower} to ${upper}, inclusive, are divisible by at least one of ${a}, ${b} and ${c}?`,
      answer: answer.toString(),
      options: [
        audit(answer.toString(), "CORRECT", `Three-set inclusion–exclusion gives ${answer}.`),
        audit(wrongNoPairCorrection.toString(), "DOUBLE_COUNTED_PAIR_OVERLAP", `Adding the three single counts counts pairwise overlaps more than once.`),
        audit(wrongNoTripleRestore.toString(), "MISSED_TRIPLE_OVERLAP_CORRECTION", `After subtracting all pair overlaps, the triple overlap ${tripleOverlap} must be restored once.`),
        audit(wrongOneDivisor.toString(), "COUNTED_ONLY_ONE_DIVISOR", `This counts only multiples of ${a}.`),
      ],
      explanation: {
        coreConcept: "For three divisor sets, add singles, subtract pair overlaps, then restore the triple overlap.",
        strategy: "Use the LCM of each divisor pair and of all three divisors.",
        steps: [`Single counts: ${singles.join(", ")}.`, `Pair-overlap counts: ${pairOverlaps.join(", ")}; triple overlap: ${tripleOverlap}.`, `Answer = ${sumSingles} - ${sumPairs} + ${tripleOverlap} = ${answer}.`],
        shortcut: "Use three-set inclusion–exclusion rather than listing every multiple.",
        verification: `Direct enumeration of the bounded interval also gives ${answer}.`,
        conclusion: `Therefore, ${answer} integers are divisible by at least one stated divisor.`,
        traps: ["Do not simply add all three counts.", "Each pair overlap must be subtracted.", "The triple overlap is subtracted three times and must be restored once."],
      },
      nodes: nodes(`Interval [${lower}, ${upper}] and divisors ${a}, ${b}, ${c}.`, "Apply three-set inclusion–exclusion.", `${sumSingles} - ${sumPairs} + ${tripleOverlap} = ${answer}.`, "Direct predicate enumeration agrees.", `Answer ${answer}.`),
      fingerprint: `three-range:${lower}:${upper}:${a}:${b}:${c}:${answer}`,
    };
  }
  throw new Error("Could not build three-divisor range state");
}
