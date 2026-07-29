import type { DeterministicRandom } from "../../foundation/prng";
import { difficultyFromState, option, pairSetText, reasoningNodes } from "./runtime-core";
import type { NumCp003RawRetainedQuestion } from "./runtime-types";

function sourceValue(hundreds: number, tens: number, units: number): bigint {
  return BigInt(100 * hundreds + 10 * tens + units);
}

function resultValue(hundreds: number, tens: number, units: number): bigint {
  return BigInt(100 * hundreds + 10 * tens + units);
}

export function generateLinkedAuthority(random: DeterministicRandom): NumCp003RawRetainedQuestion {
  for (let attempt = 0; attempt < 8_000; attempt += 1) {
    const sourceHundreds = random.int(1, 6);
    const resultHundreds = sourceHundreds + random.int(1, Math.min(2, 9 - sourceHundreds));
    const sourceUnits = random.int(0, 9);
    const resultUnits = random.int(0, 9);
    const delta = random.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5] as const);
    const addendNumber = 100 * (resultHundreds - sourceHundreds) + (resultUnits - sourceUnits) + 10 * delta;
    if (addendNumber < 100 || addendNumber > 900) continue;
    const addend = BigInt(addendNumber);

    const arithmeticPairs: Array<[number, number]> = [];
    for (let first = 0; first <= 9; first += 1) {
      for (let second = 0; second <= 9; second += 1) {
        if (addend + sourceValue(sourceHundreds, first, sourceUnits) === resultValue(resultHundreds, second, resultUnits)) {
          arithmeticPairs.push([first, second]);
        }
      }
    }
    if (arithmeticPairs.length < 4) continue;

    const divisor = random.pick([3n, 9n, 11n] as const);
    const validPairs = arithmeticPairs.filter((pair) => resultValue(resultHundreds, pair[1], resultUnits) % divisor === 0n);
    if (validPairs.length < 2 || validPairs.length >= arithmeticPairs.length) continue;

    const direction = random.pick(["LARGEST", "SMALLEST"] as const);
    const validDigits = [...new Set(validPairs.map((pair) => pair[0]))].sort((left, right) => left - right);
    if (validDigits.length < 2) continue;
    const answerDigit = direction === "LARGEST" ? validDigits[validDigits.length - 1]! : validDigits[0]!;
    const oppositeDigit = direction === "LARGEST" ? validDigits[0]! : validDigits[validDigits.length - 1]!;
    const answerPair = validPairs.find((pair) => pair[0] === answerDigit)!;
    const answerResult = resultValue(resultHundreds, answerPair[1], resultUnits);

    const arithmeticOnlyDigits = [...new Set(
      arithmeticPairs
        .filter((pair) => !validPairs.some((valid) => valid[0] === pair[0] && valid[1] === pair[1]))
        .map((pair) => pair[0]),
    )].filter((digit) => !validDigits.includes(digit));
    if (arithmeticOnlyDigits.length === 0) continue;

    const rows = [
      option(
        String(answerDigit),
        "CORRECT",
        `${answerDigit} is the ${direction.toLowerCase()} A-value among the pairs satisfying both the addition and divisibility conditions.`,
      ),
      option(
        String(oppositeDigit),
        "OPPOSITE_EXTREMUM",
        `${oppositeDigit} satisfies both conditions but is the opposite valid extremum.`,
      ),
    ];

    const nonExtreme = validDigits.filter((digit) => digit !== answerDigit && digit !== oppositeDigit);
    if (nonExtreme.length > 0) {
      const digit = random.pick(nonExtreme);
      rows.push(option(String(digit), "NON_EXTREME_VALID_DIGIT", `${digit} is valid but is not the requested extremum.`));
    }

    for (const digit of random.shuffle(arithmeticOnlyDigits)) {
      if (rows.length >= 4) break;
      const pair = arithmeticPairs.find((candidate) => candidate[0] === digit)!;
      const value = resultValue(resultHundreds, pair[1], resultUnits);
      rows.push(option(
        String(digit),
        "IGNORED_DIVISIBILITY_FILTER",
        `A = ${digit} gives B = ${pair[1]} and satisfies the addition, but ${value} is not divisible by ${divisor}.`,
      ));
    }

    for (const pair of random.shuffle(arithmeticPairs)) {
      if (rows.length >= 4) break;
      const bValue = pair[1];
      if (rows.some((row) => row.text === String(bValue))) continue;
      rows.push(option(
        String(bValue),
        "RETURNED_B_INSTEAD_OF_A",
        `${bValue} is a B-value from the arithmetic relation; the target asks for A.`,
      ));
    }
    if (rows.length !== 4 || new Set(rows.map((row) => row.text)).size !== 4) continue;

    const sourcePattern = `${sourceHundreds}A${sourceUnits}`;
    const resultPattern = `${resultHundreds}B${resultUnits}`;
    const relationText = delta > 0 ? `B = A + ${delta}` : `B = A - ${Math.abs(delta)}`;
    const directionWord = direction.toLowerCase();

    return {
      difficulty: difficultyFromState(arithmeticPairs.length + validPairs.length + Number(divisor === 11n ? 3 : 1)),
      answerSemantic: "DIGIT",
      stem: random.pick([
        `${addend} + ${sourcePattern} = ${resultPattern}, where A and B are digits. If ${resultPattern} is divisible by ${divisor}, find the ${directionWord} possible A.`,
        `The addition ${addend} + ${sourcePattern} produces ${resultPattern}. Given that the result is a multiple of ${divisor}, what is the ${directionWord} admissible value of A?`,
        `Digits A and B satisfy ${addend} + ${sourcePattern} = ${resultPattern}. The result leaves remainder 0 on division by ${divisor}. Determine the ${directionWord} A.`,
        `When ${addend} is added to ${sourcePattern}, the result is ${resultPattern}. If that result is divisible by ${divisor}, which is the ${directionWord} possible digit A?`,
      ]),
      answer: String(answerDigit),
      optionAudit: rows,
      hiddenState: {
        kind: "LINKED_ARITHMETIC_DIVISIBILITY",
        addend,
        sourcePattern,
        resultPattern,
        divisor,
        arithmeticPairs,
        validPairs,
        direction,
        answerDigit,
      },
      explanation: {
        coreConcept: "The column addition links A and B, while divisibility removes arithmetic-compatible pairs before the requested extremum is selected.",
        strategy: "List the pairs satisfying the addition, filter them by divisibility of the result and then choose the requested A-extremum.",
        steps: [
          `The tens-column relation is ${relationText}, giving arithmetic pairs ${pairSetText(arithmeticPairs)}.`,
          `Divisibility by ${divisor} reduces them to ${pairSetText(validPairs)}.`,
          `The ${directionWord} remaining A-value is ${answerDigit}; it gives the result ${answerResult}.`,
        ],
        shortcut: `Use ${relationText} first, then apply the divisibility rule for ${divisor} directly to the result pattern.`,
        verification: `${addend} + ${sourceValue(sourceHundreds, answerPair[0], sourceUnits)} = ${answerResult}, and ${answerResult} ÷ ${divisor} = ${answerResult / divisor}.`,
        conclusion: `Therefore, the ${directionWord} possible value of A is ${answerDigit}.`,
        traps: [
          "Arithmetic compatibility alone is not enough.",
          "Do not interchange the roles of A and B.",
          `After filtering, choose the ${directionWord} A-value rather than the first pair found.`,
        ],
      },
      reasoningNodes: reasoningNodes(
        `${addend} + ${sourcePattern} = ${resultPattern}, and the result is divisible by ${divisor}.`,
        "Use the arithmetic relation before the divisibility filter.",
        `Pairs ${pairSetText(arithmeticPairs)} reduce to ${pairSetText(validPairs)}.`,
        `${answerResult} reconstructs the addition and is divisible by ${divisor}.`,
        `${answerDigit} is the ${directionWord} valid A-value.`,
      ),
      fingerprint: `linked:${addend}:${sourcePattern}:${resultPattern}:${divisor}:${direction}:${pairSetText(validPairs)}`,
    };
  }

  throw new Error("Unable to construct a material linked arithmetic–divisibility state");
}
