import type { DeterministicRandom } from "../../foundation/prng";
import { audit, nodes } from "./core";
import type { RawWave04 } from "./rule-generators";
import type { Wave04OptionAudit } from "./types";

const BLOCK_FACTORS: ReadonlyArray<{
  blockDigits: number;
  repetitionFactor: bigint;
  guaranteedFactors: readonly bigint[];
}> = [
  { blockDigits: 2, repetitionFactor: 101n, guaranteedFactors: [101n] },
  { blockDigits: 3, repetitionFactor: 1001n, guaranteedFactors: [7n, 11n, 13n] },
  { blockDigits: 4, repetitionFactor: 10001n, guaranteedFactors: [73n, 137n] },
];

export function repeatedBlockIdentity(random: DeterministicRandom): RawWave04 {
  const state = random.pick(BLOCK_FACTORS);
  const correctDivisor = random.pick(state.guaranteedFactors);
  const candidatePool = [2n, 3n, 5n, 7n, 9n, 11n, 13n, 17n, 19n, 37n, 41n, 73n, 101n, 137n, 100n, 1000n, 10000n]
    .filter((candidate) => candidate !== correctDivisor && state.repetitionFactor % candidate !== 0n);
  const wrongDivisors = random.shuffle(candidatePool).slice(0, 3);
  const options: Wave04OptionAudit[] = [
    audit(correctDivisor.toString(), "CORRECT", `${state.repetitionFactor} is divisible by ${correctDivisor}, so every repeated block is.`),
    ...wrongDivisors.map((divisor) => {
      const misconception = divisor === 10n ** BigInt(state.blockDigits)
        ? "USED_POWER_OF_TEN_ONLY"
        : "USED_BLOCK_VALUE_INSTEAD_OF_REPETITION_FACTOR";
      return audit(divisor.toString(), misconception, `${divisor} does not divide the repetition factor ${state.repetitionFactor}, so it is not guaranteed for every source block.`);
    }),
  ];
  return {
    hiddenState: { kind: "REPEATED_BLOCK_IDENTITY", blockDigits: state.blockDigits, repetitionFactor: state.repetitionFactor, correctDivisor, divisorOptions: [correctDivisor, ...wrongDivisors] },
    difficulty: state.blockDigits === 2 ? "Medium" : "Hard",
    answerSemantic: "DIVISOR",
    stem: `A ${state.blockDigits}-digit block is written twice without a gap. Which option is guaranteed to divide the resulting ${state.blockDigits * 2}-digit number, regardless of the original block?`,
    answer: correctDivisor.toString(),
    options,
    explanation: {
      coreConcept: `Repeating a ${state.blockDigits}-digit block twice multiplies the block value by 10^${state.blockDigits} + 1 = ${state.repetitionFactor}.`,
      strategy: "Factor the place-value repetition multiplier rather than testing individual blocks.",
      steps: [`Let the original block have value B.`, `The repeated number is B × ${state.repetitionFactor}.`, `${state.repetitionFactor} is divisible by ${correctDivisor}, so the repeated number is always divisible by ${correctDivisor}.`],
      shortcut: `For a block of length k repeated twice, use the multiplier 10^k + 1.`,
      verification: `${state.repetitionFactor} ÷ ${correctDivisor} = ${state.repetitionFactor / correctDivisor}, an integer.`,
      conclusion: `Therefore, ${correctDivisor} is guaranteed to divide the repeated-block number.`,
      traps: ["Do not test only one sample block.", "The multiplier is 10^k + 1, not 10^k.", "A factor of a particular block is not guaranteed for every block."],
    },
    nodes: nodes(`A ${state.blockDigits}-digit block is repeated twice.`, "Express the numeral by place value.", `Repeated value = B × ${state.repetitionFactor}.`, `${state.repetitionFactor} is divisible by ${correctDivisor}.`, `Answer ${correctDivisor}.`),
    fingerprint: `repeated-identity:${state.blockDigits}:${correctDivisor}:${wrongDivisors.join(",")}`,
  };
}

export function powerSumIdentity(random: DeterministicRandom): RawWave04 {
  for (let attempt = 0; attempt < 1000; attempt += 1) {
    const firstBase = BigInt(random.int(3, 24));
    const secondBase = BigInt(random.int(2, Number(firstBase - 1n)));
    const oddExponent = random.pick([3, 5, 7] as const);
    const value = firstBase ** BigInt(oddExponent) + secondBase ** BigInt(oddExponent);
    const correctDivisor = firstBase + secondBase;
    const candidateRows: Wave04OptionAudit[] = [
      audit((firstBase - secondBase).toString(), "USED_BASE_DIFFERENCE_FOR_POWER_SUM", `The base difference ${firstBase - secondBase} is not the factor supplied by the odd power-sum identity; the exact remainder is ${value % (firstBase - secondBase)}.`),
      audit(BigInt(oddExponent).toString(), "USED_EXPONENT_AS_DIVISOR", `The exponent ${oddExponent} is not generally a divisor; the exact remainder is ${value % BigInt(oddExponent)}.`),
      audit((firstBase * secondBase).toString(), "FALSE_IDENTITY_FACTOR", `The base product ${firstBase * secondBase} is not the identity factor; the exact remainder is ${value % (firstBase * secondBase)}.`),
      audit((correctDivisor + 1n).toString(), "FALSE_IDENTITY_FACTOR", `${correctDivisor + 1n} is adjacent to the base sum but is not guaranteed by the identity.`),
      audit((correctDivisor - 1n).toString(), "FALSE_IDENTITY_FACTOR", `${correctDivisor - 1n} is adjacent to the base sum but is not guaranteed by the identity.`),
      audit(firstBase.toString(), "FALSE_IDENTITY_FACTOR", `The first base ${firstBase} is not the factor supplied by a^n + b^n.`),
      audit(secondBase.toString(), "FALSE_IDENTITY_FACTOR", `The second base ${secondBase} is not the factor supplied by a^n + b^n.`),
    ].filter((row) => {
      const divisor = BigInt(row.text);
      return divisor > 1n && divisor !== correctDivisor && value % divisor !== 0n;
    });
    const uniqueRows = [...new Map(candidateRows.map((row) => [row.text, row])).values()];
    if (uniqueRows.length < 3) continue;
    const wrong = random.shuffle(uniqueRows).slice(0, 3);
    return {
      hiddenState: { kind: "POWER_SUM_IDENTITY", firstBase, secondBase, oddExponent, value, correctDivisor, divisorOptions: [correctDivisor, ...wrong.map((row) => BigInt(row.text))] },
      difficulty: "Hard",
      answerSemantic: "DIVISOR",
      stem: `Which option is guaranteed to divide ${firstBase}^${oddExponent} + ${secondBase}^${oddExponent}?`,
      answer: correctDivisor.toString(),
      options: [
        audit(correctDivisor.toString(), "CORRECT", `${firstBase} + ${secondBase} = ${correctDivisor}, the factor guaranteed for an odd power sum.`),
        ...wrong,
      ],
      explanation: {
        coreConcept: "When n is odd, a^n + b^n contains the factor a + b.",
        strategy: `Use the odd-power-sum identity with a = ${firstBase}, b = ${secondBase} and n = ${oddExponent}.`,
        steps: [`The exponent ${oddExponent} is odd.`, `The base sum is ${firstBase} + ${secondBase} = ${correctDivisor}.`, `Therefore, ${correctDivisor} divides the power sum.`],
        shortcut: "For an odd power sum, test the sum of the bases first.",
        verification: `Exact evaluation gives ${value}, and ${value} ÷ ${correctDivisor} = ${value / correctDivisor}.`,
        conclusion: `Therefore, ${correctDivisor} is the guaranteed divisor.`,
        traps: ["The base difference belongs to a power difference, not this sum.", "The exponent itself is not generally a divisor.", "The a + b factor requires an odd exponent."],
      },
      nodes: nodes(`Expression ${firstBase}^${oddExponent} + ${secondBase}^${oddExponent}.`, "Use the odd power-sum factor identity.", `a+b = ${correctDivisor}.`, `${value} is exactly divisible by ${correctDivisor}.`, `Answer ${correctDivisor}.`),
      fingerprint: `power-sum:${firstBase}:${secondBase}:${oddExponent}:${correctDivisor}:${wrong.map((row) => row.text).join(",")}`,
    };
  }
  throw new Error("Could not build power-sum identity state");
}
