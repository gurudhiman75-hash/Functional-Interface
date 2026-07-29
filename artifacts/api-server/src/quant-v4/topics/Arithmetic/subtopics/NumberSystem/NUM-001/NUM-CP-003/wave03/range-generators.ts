import type { DeterministicRandom } from "../../foundation/prng";
import { audit, countMultiples, lcm, nodes, type Raw } from "./core";

export function rangeTwoDivisors(random: DeterministicRandom, predicate: "EITHER" | "NEITHER" | "EXACTLY_ONE"): Raw {
  for (let attempt = 0; attempt < 500; attempt += 1) {
    const lower = BigInt(random.int(1, 600));
    const upper = lower + BigInt(random.int(350, 2200));
    let firstDivisor = BigInt(random.int(3, 19));
    let secondDivisor = BigInt(random.int(4, 25));
    while (firstDivisor === secondDivisor || firstDivisor % secondDivisor === 0n || secondDivisor % firstDivisor === 0n) {
      firstDivisor = BigInt(random.int(3, 19));
      secondDivisor = BigInt(random.int(4, 25));
    }
    const firstCount = countMultiples(lower, upper, firstDivisor);
    const secondCount = countMultiples(lower, upper, secondDivisor);
    const overlapCount = countMultiples(lower, upper, lcm(firstDivisor, secondDivisor));
    const total = upper - lower + 1n;
    const union = firstCount + secondCount - overlapCount;
    const answer = predicate === "EITHER" ? union : predicate === "NEITHER" ? total - union : firstCount + secondCount - 2n * overlapCount;
    if (answer <= 0n) continue;

    const candidates = predicate === "EITHER"
      ? [answer, firstCount + secondCount, firstCount, secondCount]
      : predicate === "NEITHER"
        ? [answer, union, total, total - firstCount - secondCount]
        : [answer, union, firstCount + secondCount, firstCount];
    const unique = [...new Set(candidates.map(String))];
    if (unique.length !== 4) continue;

    const options = unique.map((text) => {
      const value = BigInt(text);
      if (value === answer) return audit(text, "CORRECT", `Exact inclusion–exclusion gives ${answer}.`);
      if (predicate === "EITHER") {
        if (value === firstCount + secondCount) return audit(text, "DOUBLE_COUNTED_OVERLAP", `This counts the ${overlapCount} common multiples twice.`);
        if (value === firstCount) return audit(text, "COUNTED_ONLY_FIRST_RULE", `This ignores numbers divisible only by ${secondDivisor}.`);
        return audit(text, "COUNTED_ONLY_SECOND_RULE", `This ignores numbers divisible only by ${firstDivisor}.`);
      }
      if (predicate === "NEITHER") {
        if (value === union) return audit(text, "USED_UNION_INSTEAD_OF_COMPLEMENT", `${union} counts numbers divisible by at least one divisor, not neither.`);
        if (value === total) return audit(text, "USED_TOTAL_RANGE_SIZE", `${total} includes every number in the interval.`);
        return audit(text, "FAILED_TO_REMOVE_OVERLAP", `Subtracting both counts without restoring their overlap gives the wrong complement.`);
      }
      if (value === union) return audit(text, "SUBTRACTED_OVERLAP_ONCE", `Exactly one requires removing the ${overlapCount} common multiples from both sets, not once.`);
      if (value === firstCount + secondCount) return audit(text, "DOUBLE_COUNTED_OVERLAP", `This counts common multiples twice.`);
      if (value === firstCount) return audit(text, "COUNTED_ONLY_FIRST_RULE", `This counts only multiples of ${firstDivisor}.`);
      return audit(text, "SUBTRACTED_OVERLAP_ONCE", `This is the union count, whereas common multiples must be excluded entirely.`);
    });

    const task = predicate === "EITHER"
      ? `divisible by ${firstDivisor} or ${secondDivisor} (or both)`
      : predicate === "NEITHER"
        ? `divisible by neither ${firstDivisor} nor ${secondDivisor}`
        : `divisible by exactly one of ${firstDivisor} and ${secondDivisor}`;
    const formula = predicate === "EITHER"
      ? `${firstCount} + ${secondCount} - ${overlapCount} = ${answer}`
      : predicate === "NEITHER"
        ? `${total} - (${firstCount} + ${secondCount} - ${overlapCount}) = ${answer}`
        : `${firstCount} + ${secondCount} - 2 × ${overlapCount} = ${answer}`;

    return {
      hiddenState: { kind: "RANGE_TWO_DIVISORS", predicate, lower, upper, firstDivisor, secondDivisor, firstCount, secondCount, overlapCount, answer },
      difficulty: predicate === "EITHER" ? "Medium" : "Hard",
      answerSemantic: "COUNT",
      stem: `How many integers from ${lower} to ${upper}, inclusive, are ${task}?`,
      answer: answer.toString(),
      options,
      explanation: {
        coreConcept: "Two-divisor range counts require explicit treatment of the common-multiple overlap.",
        strategy: `Count multiples of each divisor and use lcm(${firstDivisor}, ${secondDivisor}) for their intersection.`,
        steps: [`Counts are ${firstCount} and ${secondCount}.`, `Common-multiple count is ${overlapCount}.`, `Required calculation: ${formula}.`],
        shortcut: predicate === "EXACTLY_ONE" ? "For exactly one, subtract the overlap twice." : predicate === "NEITHER" ? "Find the union first, then take its complement in the interval." : "For either, add both counts and subtract the overlap once.",
        verification: `Direct enumeration of every integer in the bounded interval gives ${answer}.`,
        conclusion: `Therefore, the required count is ${answer}.`,
        traps: ["Common multiples belong to both initial sets.", predicate === "EXACTLY_ONE" ? "Exactly one excludes the overlap completely." : "Apply the requested predicate, not a nearby union/complement count.", "The interval endpoints are inclusive."],
      },
      nodes: nodes(`Interval [${lower}, ${upper}] with divisors ${firstDivisor}, ${secondDivisor}.`, "Use inclusion–exclusion and the requested predicate.", formula, "Direct enumeration agrees.", `Answer ${answer}.`),
      fingerprint: `range-${predicate}:${lower}:${upper}:${firstDivisor}:${secondDivisor}:${answer}`,
    };
  }
  throw new Error(`Could not build range predicate ${predicate}`);
}
