import type { DeterministicRandom } from "../../foundation/prng";
import {
  audit,
  nodes,
  pairSetText,
  relationText,
} from "./core";
import type {
  RawWave05,
  Wave05OptionAudit,
} from "./types";

function pushUnique(rows: Wave05OptionAudit[], row: Wave05OptionAudit): void {
  if (!rows.some((existing) => existing.text === row.text)) rows.push(row);
}

function sourceValue(hundreds: number, tens: number, units: number): bigint {
  return BigInt(100 * hundreds + 10 * tens + units);
}

function resultValue(hundreds: number, tens: number, units: number): bigint {
  return BigInt(100 * hundreds + 10 * tens + units);
}

export function linkedAdditionDivisibilityExtremum(random: DeterministicRandom): RawWave05 {
  for (let attempt = 0; attempt < 5_000; attempt += 1) {
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
        const source = sourceValue(sourceHundreds, first, sourceUnits);
        const result = resultValue(resultHundreds, second, resultUnits);
        if (addend + source === result) arithmeticPairs.push([first, second]);
      }
    }
    if (arithmeticPairs.length < 4) continue;

    const divisor = random.pick([3n, 9n] as const);
    const validPairs = arithmeticPairs.filter((pair) => resultValue(resultHundreds, pair[1], resultUnits) % divisor === 0n);
    if (validPairs.length < 2 || validPairs.length >= arithmeticPairs.length) continue;

    const targetDirection = random.pick(["LARGEST", "SMALLEST"] as const);
    const validTargetDigits = validPairs.map((pair) => pair[0]).sort((left, right) => left - right);
    const answerDigit = targetDirection === "LARGEST"
      ? validTargetDigits[validTargetDigits.length - 1]!
      : validTargetDigits[0]!;
    const oppositeDigit = targetDirection === "LARGEST" ? validTargetDigits[0]! : validTargetDigits[validTargetDigits.length - 1]!;
    const arithmeticOnlyDigits = arithmeticPairs.map((pair) => pair[0]).filter((digit) => !validTargetDigits.includes(digit));
    if (arithmeticOnlyDigits.length === 0) continue;

    const rows: Wave05OptionAudit[] = [
      audit(
        String(answerDigit),
        "CORRECT",
        `${answerDigit} is the ${targetDirection.toLowerCase()} A-value among the pairs that satisfy both the addition and divisibility conditions.`,
      ),
    ];

    if (oppositeDigit !== answerDigit) {
      pushUnique(rows, audit(
        String(oppositeDigit),
        "SELECTED_OPPOSITE_EXTREMUM",
        `${oppositeDigit} satisfies both conditions but is the opposite extremum of the valid A-values.`,
      ));
    }

    const nonExtremeValid = validTargetDigits.filter((digit) => digit !== answerDigit && digit !== oppositeDigit);
    if (nonExtremeValid.length > 0) {
      const digit = random.pick(nonExtremeValid);
      pushUnique(rows, audit(
        String(digit),
        "SELECTED_NON_EXTREME_VALID_VALUE",
        `${digit} satisfies both conditions but is not the requested ${targetDirection.toLowerCase()} valid value.`,
      ));
    }

    for (const digit of random.shuffle(arithmeticOnlyDigits)) {
      if (rows.length >= 4) break;
      const pair = arithmeticPairs.find((candidate) => candidate[0] === digit)!;
      const result = resultValue(resultHundreds, pair[1], resultUnits);
      pushUnique(rows, audit(
        String(digit),
        "IGNORED_DIVISIBILITY_CONSTRAINT",
        `A = ${digit} gives B = ${pair[1]} and satisfies the addition, but ${result} is not divisible by ${divisor}.`,
      ));
    }

    for (const pair of random.shuffle(arithmeticPairs)) {
      if (rows.length >= 4) break;
      const swapped = pair[1];
      pushUnique(rows, audit(
        String(swapped),
        "SWAPPED_UNKNOWN_DIGITS",
        `${swapped} is a B-value from the arithmetic relation; the question asks for A.`,
      ));
    }

    if (rows.length !== 4) continue;

    const sourceText = `${sourceHundreds}A${sourceUnits}`;
    const resultText = `${resultHundreds}B${resultUnits}`;
    const directionWord = targetDirection.toLowerCase();
    const stem = random.pick([
      `When ${addend} is added to ${sourceText}, the result is ${resultText}. If ${resultText} is divisible by ${divisor}, what is the ${directionWord} possible value of A?`,
      `${addend} + ${sourceText} = ${resultText}, where A and B are digits. Given that ${resultText} is divisible by ${divisor}, find the ${directionWord} value of A.`,
      `The addition ${addend} + ${sourceText} produces ${resultText}. The result is a multiple of ${divisor}. What is the ${directionWord} admissible digit A?`,
      `Digits A and B satisfy ${addend} + ${sourceText} = ${resultText}. If the result has no remainder on division by ${divisor}, determine the ${directionWord} possible A.`,
    ]);

    const answerPair = validPairs.find((pair) => pair[0] === answerDigit)!;
    const answerResult = resultValue(resultHundreds, answerPair[1], resultUnits);
    const difficulty = divisor === 9n || arithmeticPairs.length >= 8 ? "Hard" : arithmeticPairs.length >= 6 ? "Medium" : "Easy";

    return {
      hiddenState: {
        kind: "LINKED_ADDITION_EXTREMUM",
        addend,
        sourceHundreds,
        sourceUnits,
        resultHundreds,
        resultUnits,
        delta,
        divisor,
        arithmeticPairs,
        validPairs,
        targetDirection,
        answerDigit,
      },
      difficulty,
      answerSemantic: "DIGIT",
      stem,
      answer: String(answerDigit),
      options: rows,
      explanation: {
        coreConcept: "The column addition links A and B, but divisibility is required to reduce the arithmetic-compatible pairs before taking the requested extremum.",
        strategy: "First list every digit pair satisfying the addition. Then retain only results divisible by the stated divisor and select the requested A-value.",
        steps: [
          `The addition gives ${relationText(delta)}, so the arithmetic-compatible pairs are ${pairSetText(arithmeticPairs)}.`,
          `Testing the result ${resultText} for divisibility by ${divisor} leaves ${pairSetText(validPairs)}.`,
          `The ${directionWord} A-value in the filtered set is ${answerDigit}; the corresponding result is ${answerResult}.`,
        ],
        shortcut: `Use the tens-column relation ${relationText(delta)} first, then apply the digit-sum divisibility rule for ${divisor} to B instead of testing all 100 pairs.`,
        verification: `${addend} + ${sourceValue(sourceHundreds, answerPair[0], sourceUnits)} = ${answerResult}, and ${answerResult} ÷ ${divisor} = ${answerResult / divisor}.`,
        conclusion: `Therefore, the ${directionWord} possible value of A is ${answerDigit}.`,
        traps: [
          "Arithmetic compatibility alone is not enough; the result must also be divisible.",
          "Do not interchange the values or roles of A and B.",
          `After filtering, select the ${directionWord} A-value rather than the first pair found.`,
        ],
      },
      nodes: nodes(
        `${addend} + ${sourceText} = ${resultText}, and the result is divisible by ${divisor}.`,
        "Use the addition relation before applying divisibility to the result.",
        `Arithmetic pairs ${pairSetText(arithmeticPairs)} reduce to ${pairSetText(validPairs)} after divisibility.`,
        `${answerResult} reconstructs the addition and is divisible by ${divisor}.`,
        `${answerDigit} is the ${directionWord} valid A-value.`,
      ),
      fingerprint: `linked-add:${addend}:${sourceText}:${resultText}:${divisor}:${targetDirection}:${pairSetText(validPairs)}`,
    };
  }

  throw new Error("Unable to construct a linked addition/divisibility extremum state");
}
